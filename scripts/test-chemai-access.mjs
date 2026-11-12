// ChemAI access gate (functions/api/_access.js) through the real route handlers.
// Real RS256 signatures from a key pair generated here; the JWKS endpoint and every
// other network call are mocked, and any call to Google fails the test.
import assert from 'node:assert/strict'
import { onRequestGet as chatGet, onRequestPost as chatPost } from '../functions/api/chat.js'
import { onRequestGet as feedbackGet, onRequestPost as feedbackPost } from '../functions/api/feedback.js'
import { accessMode, chemAIAccess, LOCKED_MESSAGE } from '../functions/api/_access.js'

const team = 'https://chemlab-test.cloudflareaccess.com'
const aud = 'test-audience-tag'
const internalHost = 'preview-test.chemlab-edulab.pages.dev'
const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify'])
const otherPair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify'])
const jwk = { ...await crypto.subtle.exportKey('jwk', pair.publicKey), kid: 'k1' }

const b64 = value => Buffer.from(typeof value === 'string' ? value : value instanceof Uint8Array ? value : JSON.stringify(value)).toString('base64url')
async function token(claims = {}, { key = pair.privateKey, alg = 'RS256', kid = 'k1' } = {}) {
  const now = Math.floor(Date.now() / 1000)
  const head = b64({ alg, kid, typ: 'JWT' })
  const body = b64({ iss: team, aud: [aud], email: 'teacher@example.org', iat: now, exp: now + 600, ...claims })
  const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${body}`)))
  return `${head}.${body}.${b64(signature)}`
}

const calls = { google: 0, jwks: 0, ai: 0 }
globalThis.fetch = async url => {
  const target = String(url)
  if (target === `${team}/cdn-cgi/access/certs`) {
    calls.jwks += 1
    return Response.json({ keys: [jwk] })
  }
  if (target.includes('googleapis.com')) calls.google += 1
  throw new Error(`unexpected network call: ${target}`)
}

const budget = () => ({ idFromName: name => name, get: () => ({ fetch: async () => Response.json({ allowed: true, used: 1 }) }) })
const ai = { run: async () => { calls.ai += 1; return { choices: [{ message: { content: 'H₂O là nước.' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 5 } } } }
// Everything a real call would need; only the gate stands in the way.
const full = (extra = {}) => ({
  AI: ai, CHEMAI_BUDGET: budget(), GEMINI_API_KEY: 'test-only-not-a-key', CHEMAI_FEEDBACK: 'on',
  CF_ACCESS_TEAM_DOMAIN: team, CF_ACCESS_AUD: aud, CHEMAI_APPROVED_EMAILS: 'teacher@example.org', CHEMAI_INTERNAL_HOSTS: internalHost, ...extra
})
const request = (path, { host = 'chemlab-edulab.pages.dev', method = 'POST', headers = {}, body } = {}) => new Request(`https://${host}${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', Origin: `https://${host}`, 'CF-Connecting-IP': '203.0.113.9', ...headers },
  body: method === 'POST' ? JSON.stringify(body ?? (path.endsWith('feedback') ? { rubricId: 'g11-l20-w1', answer: 'Khi cho NaOH vào dung dịch CuSO4 xuất hiện kết tủa xanh Cu(OH)2 do Cu2+ kết hợp với OH-.' } : { message: 'H2O là gì?' })) : undefined
})
const assertLocked = async (response, label) => {
  assert.equal(response.status, 403, label)
  const payload = await response.json()
  assert.equal(payload.code, 'AI_ACCESS_LOCKED', label)
  assert.equal(payload.message, LOCKED_MESSAGE, label)
  assert.ok(!JSON.stringify(payload).match(/gemini|workers|model|mode|reason/i), `${label}: no backend detail`)
}

let passed = 0
const test = async (name, fn) => {
  await fn()
  passed += 1
}
const log = console.log
console.log = () => {} // access logs; silenced to keep output readable

await test('mode parsing: missing, unknown, case and whitespace variants stay disabled', () => {
  for (const value of [undefined, '', 'on', 'true', 'Approved_Users', 'admin', ' student_access']) assert.equal(accessMode({ CHEMAI_ACCESS_MODE: value }), value === ' student_access' ? 'student_access' : 'disabled')
})

await test('default (no mode): logged-out user is refused on chat and feedback, fully configured', async () => {
  await assertLocked(await chatPost({ request: request('/api/chat'), env: full() }), 'chat')
  await assertLocked(await feedbackPost({ request: request('/api/feedback'), env: full() }), 'feedback')
})

await test('default: GET status reveals nothing about provider, model or secrets', async () => {
  const payload = await (await chatGet({ request: request('/api/chat', { method: 'GET' }), env: full({ ' GEMINI_API_KEY': 'x' }) })).json()
  assert.deepEqual(Object.keys(payload).sort(), ['access', 'configured', 'ok', 'release', 'service'])
  assert.equal(payload.access, false)
  assert.equal(payload.configured, false)
  assert.equal((await (await feedbackGet({ request: request('/api/feedback', { method: 'GET' }), env: full() })).json()).enabled, false)
})

await test('status separates "signed in but not approved" from anonymous, revealing nothing else', async () => {
  const env = full({ CHEMAI_ACCESS_MODE: 'internal_testing' })
  const get = async headers => (await chatGet({ request: request('/api/chat', { host: internalHost, method: 'GET', headers }), env })).json()
  const unapproved = await get({ 'Cf-Access-Jwt-Assertion': await token({ email: 'student@example.org' }) })
  assert.deepEqual(Object.keys(unapproved).sort(), ['access', 'authenticated', 'configured', 'ok', 'release', 'service'])
  assert.deepEqual([unapproved.access, unapproved.authenticated], [false, true])
  for (const headers of [{}, { 'Cf-Access-Jwt-Assertion': await token({}, { key: otherPair.privateKey }) }, { 'X-User-Email': 'teacher@example.org' }]) {
    assert.equal((await get(headers)).authenticated, undefined, 'no identity claim without a verified token')
  }
})

await test('student_access cannot be switched on by the flag, even with a valid approved identity', async () => {
  const headers = { 'Cf-Access-Jwt-Assertion': await token() }
  await assertLocked(await chatPost({ request: request('/api/chat', { headers }), env: full({ CHEMAI_ACCESS_MODE: 'student_access' }) }), 'chat')
  await assertLocked(await feedbackPost({ request: request('/api/feedback', { headers }), env: full({ CHEMAI_ACCESS_MODE: 'student_access' }) }), 'feedback')
})

await test('approved_users: direct API request without identity is refused', async () => {
  await assertLocked(await chatPost({ request: request('/api/chat'), env: full({ CHEMAI_ACCESS_MODE: 'approved_users' }) }), 'no token')
})

await test('approved_users: forged / spoofed identities are refused', async () => {
  const env = full({ CHEMAI_ACCESS_MODE: 'approved_users' })
  const now = Math.floor(Date.now() / 1000)
  const forged = [
    await token({}, { key: otherPair.privateKey }),                  // signed by someone else
    `${b64({ alg: 'none', kid: 'k1' })}.${b64({ iss: team, aud: [aud], email: 'teacher@example.org', exp: now + 600 })}.`,
    (await token()).replace(/\.[^.]+$/, '.AAAA'),                    // tampered signature
    await token({ email: 'student@example.org' }),                    // valid but not approved
    await token({ aud: ['other-app'] }),
    await token({ iss: 'https://evil.cloudflareaccess.com' }),
    await token({ exp: now - 3600 }),
    await token({ nbf: now + 3600 }),
    await token({}, { kid: 'unknown' }),
    await token({ email: undefined }),                               // service token, no person
    'not-a-jwt'
  ]
  for (const [index, value] of forged.entries()) {
    await assertLocked(await chatPost({ request: request('/api/chat', { headers: { 'Cf-Access-Jwt-Assertion': value } }), env }), `forged #${index}`)
  }
  // Frontend-style spoofing: headers, query and cookies are not identity.
  const spoof = request('/api/chat?admin=1&access=approved', { headers: { 'X-ChemAI-Access': 'approved', 'X-User-Email': 'teacher@example.org', Cookie: 'chemai=approved' } })
  await assertLocked(await chatPost({ request: spoof, env }), 'spoof headers')
})

await test('missing or invalid Access configuration fails closed', async () => {
  const headers = { 'Cf-Access-Jwt-Assertion': await token() }
  for (const env of [
    full({ CHEMAI_ACCESS_MODE: 'approved_users', CF_ACCESS_AUD: '' }),
    full({ CHEMAI_ACCESS_MODE: 'approved_users', CF_ACCESS_TEAM_DOMAIN: '' }),
    full({ CHEMAI_ACCESS_MODE: 'approved_users', CF_ACCESS_TEAM_DOMAIN: 'https://evil.example' }),
    full({ CHEMAI_ACCESS_MODE: 'approved_users', CHEMAI_APPROVED_EMAILS: '' })
  ]) await assertLocked(await chatPost({ request: request('/api/chat', { headers }), env }), 'bad config')
})

await test('JWKS unavailable fails closed', async () => {
  const saved = globalThis.fetch
  globalThis.fetch = async () => new Response('down', { status: 503 })
  try {
    const result = await chemAIAccess(request('/api/chat', { headers: { 'Cf-Access-Jwt-Assertion': await token() } }), full({ CHEMAI_ACCESS_MODE: 'approved_users', CF_ACCESS_TEAM_DOMAIN: 'https://other-team.cloudflareaccess.com' }))
    assert.equal(result.allowed, false)
  }
  finally {
    globalThis.fetch = saved
  }
})

await test('internal_testing never opens on the production host or an unlisted host', async () => {
  const headers = { 'Cf-Access-Jwt-Assertion': await token() }
  const env = full({ CHEMAI_ACCESS_MODE: 'internal_testing', CHEMAI_INTERNAL_HOSTS: `chemlab-edulab.pages.dev,${internalHost}` })
  await assertLocked(await chatPost({ request: request('/api/chat', { headers }), env }), 'production host')
  await assertLocked(await chatPost({ request: request('/api/chat', { host: 'other.pages.dev', headers }), env }), 'unlisted host')
})

await test('Gemini is refused outside internal_testing (provider terms not verified)', async () => {
  const headers = { 'Cf-Access-Jwt-Assertion': await token() }
  await assertLocked(await chatPost({ request: request('/api/chat', { headers }), env: full({ CHEMAI_ACCESS_MODE: 'approved_users' }) }), 'chat gemini')
  await assertLocked(await feedbackPost({ request: request('/api/feedback', { headers }), env: full({ CHEMAI_ACCESS_MODE: 'approved_users' }) }), 'feedback gemini')
})

await test('public Preview hosts: no identity, or internal_testing on an unlisted preview host, are refused', async () => {
  for (const host of ['ab12cd34.chemlab-edulab.pages.dev', 'feature-chemlab-6-5-4-chemai-acc.chemlab-edulab.pages.dev']) {
    await assertLocked(await chatPost({ request: request('/api/chat', { host }), env: full({ CHEMAI_ACCESS_MODE: 'approved_users' }) }), `${host} no identity`)
    await assertLocked(await feedbackPost({ request: request('/api/feedback', { host }), env: full({ CHEMAI_ACCESS_MODE: 'approved_users' }) }), `${host} feedback`)
    await assertLocked(await chatPost({ request: request('/api/chat', { host, headers: { 'Cf-Access-Jwt-Assertion': await token() } }), env: full({ CHEMAI_ACCESS_MODE: 'internal_testing' }) }), `${host} internal unlisted`)
  }
})

await test('a refused request is answered before its body is read (no provider logic runs)', async () => {
  for (const [handler, path] of [[chatPost, '/api/chat'], [feedbackPost, '/api/feedback']]) {
    for (const mode of [undefined, 'student_access', 'approved_users']) {
      const req = request(path)
      await assertLocked(await handler({ request: req, env: full({ CHEMAI_ACCESS_MODE: mode }) }), `${path} ${mode}`)
      assert.equal(req.bodyUsed, false, `${path} ${mode}: body untouched`)
    }
  }
})

assert.equal(calls.google, 0, 'no request may reach Google while locked')
assert.equal(calls.ai, 0, 'no model call while locked')

await test('internal_testing + allowlisted preview host + verified approved identity reaches the (mocked) Gemini pipeline', async () => {
  const headers = { 'Cf-Access-Jwt-Assertion': await token({ email: 'Teacher@Example.org' }) }
  const env = full({ CHEMAI_ACCESS_MODE: 'internal_testing', ' GEMINI_API_KEY': 'x' })
  const status = await (await chatGet({ request: request('/api/chat', { host: internalHost, method: 'GET', headers }), env })).json()
  assert.equal(status.access, true)
  assert.equal(status.provider, 'Gemini')
  assert.deepEqual(status.configWarnings, ['" GEMINI_API_KEY"'], 'malformed env name reported by name only')
  assert.ok(!JSON.stringify(status).includes('test-only-not-a-key'))
  const saved = globalThis.fetch
  let google = 0
  globalThis.fetch = async (url, init) => {
    if (!String(url).startsWith('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent')) return saved(url, init)
    google += 1
    assert.equal(init.headers['x-goog-api-key'], 'test-only-not-a-key', 'key only in the header, never in the URL')
    return Response.json({ candidates: [{ content: { parts: [{ text: '{"answer":"H₂O là nước.","actions":[],"suggestions":[]}' }] }, finishReason: 'STOP' }] })
  }
  try {
    const response = await chatPost({ request: request('/api/chat', { host: internalHost, headers }), env })
    assert.equal(response.status, 200, await response.clone().text())
    assert.equal((await response.json()).meta.provider, 'Gemini')
  }
  finally {
    globalThis.fetch = saved
  }
  assert.equal(google, 1)
  assert.equal(calls.ai, 0, 'no Workers AI call even with the AI binding present')
})

await test('JWKS is cached per isolate', () => assert.ok(calls.jwks <= 2, `jwks fetched ${calls.jwks} times`))

console.log = log
assert.equal(calls.google, 0)
console.log(`PASS — ${passed} ChemAI access-control checks passed.`)
