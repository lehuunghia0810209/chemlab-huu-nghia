// ChemAI access control (server-side, fail-closed). Every AI route asks this module
// first; the browser never decides. Identity comes only from a Cloudflare Access
// JWT (header Cf-Access-Jwt-Assertion) verified here against the team's public keys.
//
// CHEMAI_ACCESS_MODE (server env):
//   disabled          default; also any missing/unknown value → no AI for anyone
//   internal_testing  verified + approved identity, only on hosts in CHEMAI_INTERNAL_HOSTS
//                     (never on a production host)
//   approved_users    verified identity listed in CHEMAI_APPROVED_EMAILS
//   student_access    refused in code: opening ChemAI to students needs a code change
//                     after the provider-terms review and owner approval, not a flag
// Required with internal_testing / approved_users: CF_ACCESS_TEAM_DOMAIN
// (https://<team>.cloudflareaccess.com), CF_ACCESS_AUD, CHEMAI_APPROVED_EMAILS.

export const ACCESS_MODES = Object.freeze(['disabled', 'internal_testing', 'approved_users', 'student_access'])
export const LOCKED_MESSAGE = 'ChemAI đang được hoàn thiện và kiểm định. Tính năng hiện chưa được mở cho học sinh.'
// Production hosts can never run internal_testing, whatever CHEMAI_INTERNAL_HOSTS says.
const PRODUCTION_HOSTS = new Set(['chemlab-edulab.pages.dev'])
const TEAM_DOMAIN = /^https:\/\/[a-z0-9-]{1,63}\.cloudflareaccess\.com$/
const CLOCK_SKEW_S = 60
const JWKS_TTL_MS = 10 * 60 * 1000
const JWKS_TIMEOUT_MS = 5000
const MAX_TOKEN_LENGTH = 8192
const jwksCache = new Map()

const list = value => String(value || '').split(',').map(item => item.trim().toLowerCase()).filter(Boolean)

export function accessMode(env) {
  const value = String(env?.CHEMAI_ACCESS_MODE || '').trim()
  return ACCESS_MODES.includes(value) ? value : 'disabled'
}

function base64url(value) {
  const text = value.replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(text + '='.repeat((4 - text.length % 4) % 4)), char => char.charCodeAt(0))
}

const decodeJSON = value => JSON.parse(new TextDecoder().decode(base64url(value)))

async function teamKeys(team) {
  const cached = jwksCache.get(team)
  if (cached && cached.expires > Date.now()) return cached.keys
  const response = await fetch(`${team}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(JWKS_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`jwks ${response.status}`)
  const keys = (await response.json())?.keys
  if (!Array.isArray(keys)) throw new Error('jwks shape')
  jwksCache.set(team, { keys, expires: Date.now() + JWKS_TTL_MS })
  return keys
}

// Returns the verified, lower-cased email or null. Any doubt → null.
export async function verifyAccessIdentity(request, env) {
  const team = String(env?.CF_ACCESS_TEAM_DOMAIN || '').trim().replace(/\/$/, '')
  const audience = String(env?.CF_ACCESS_AUD || '').trim()
  const token = request.headers.get('Cf-Access-Jwt-Assertion') || ''
  if (!TEAM_DOMAIN.test(team) || !audience || !token || token.length > MAX_TOKEN_LENGTH) return null
  try {
    const [headerPart, payloadPart, signaturePart, extra] = token.split('.')
    if (!signaturePart || extra !== undefined) return null
    const header = decodeJSON(headerPart)
    if (header?.alg !== 'RS256' || typeof header.kid !== 'string') return null
    const jwk = (await teamKeys(team)).find(key => key?.kid === header.kid && key?.kty === 'RSA')
    if (!jwk) return null
    const key = await crypto.subtle.importKey('jwk', { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const signed = new TextEncoder().encode(`${headerPart}.${payloadPart}`)
    if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, base64url(signaturePart), signed)) return null
    const claims = decodeJSON(payloadPart)
    const now = Math.floor(Date.now() / 1000)
    const audiences = Array.isArray(claims?.aud) ? claims.aud : [claims?.aud]
    if (claims?.iss !== team || !audiences.includes(audience)) return null
    if (!Number.isFinite(claims.exp) || claims.exp + CLOCK_SKEW_S < now) return null
    if (Number.isFinite(claims.nbf) && claims.nbf - CLOCK_SKEW_S > now) return null
    const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : ''
    return email || null
  }
  catch {
    return null
  }
}

function hostOf(request) {
  try {
    return new URL(request.url).hostname.toLowerCase()
  }
  catch {
    return ''
  }
}

// { allowed, mode, reason }. reason is for server logs only; never shown to users.
export async function chemAIAccess(request, env, { provider = null } = {}) {
  const mode = accessMode(env)
  const deny = reason => ({ allowed: false, mode, reason })
  if (mode === 'disabled') return deny('MODE_DISABLED')
  if (mode === 'student_access') return deny('STUDENT_ACCESS_LOCKED')
  const host = hostOf(request)
  if (mode === 'internal_testing' && (PRODUCTION_HOSTS.has(host) || !list(env.CHEMAI_INTERNAL_HOSTS).includes(host))) return deny('HOST_NOT_INTERNAL')
  // Gemini terms exclude services likely used by under-18s; until that review is done,
  // Gemini runs only in isolated internal testing.
  if (provider === 'gemini' && mode !== 'internal_testing') return deny('PROVIDER_TERMS_UNVERIFIED')
  const approved = list(env.CHEMAI_APPROVED_EMAILS)
  if (!approved.length) return deny('NO_APPROVED_USERS')
  const email = await verifyAccessIdentity(request, env)
  if (!email) return deny('UNAUTHENTICATED')
  if (!approved.includes(email)) return deny('NOT_APPROVED')
  return { allowed: true, mode, reason: 'OK' }
}

export function accessDenied(reason, route) {
  console.log(JSON.stringify({ event: 'chemai.access', route, status: 403, reason }))
  return new Response(JSON.stringify({ ok: false, code: 'AI_ACCESS_LOCKED', message: LOCKED_MESSAGE }), {
    status: 403,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' }
  })
}

// Env names with stray whitespace (e.g. " GEMINI_API_KEY") are never read by the code.
export const malformedEnvNames = env => Object.keys(env || {}).filter(name => name !== name.trim()).map(name => JSON.stringify(name))
