// Round 4 — record the measurement environment next to the E2E logs: browser versions, WebGL renderer, CPU load.
// Usage: node scripts/dlab-env-report.mjs <baseUrl> → JSON on stdout.
import os from 'node:os'
import { execSync } from 'node:child_process'
import { chromium, firefox, webkit } from 'playwright-core'

const base = process.argv[2] || 'http://[::1]:5180/'
const load = () => { try { return Number(execSync('powershell -NoProfile -Command "(Get-CimInstance Win32_Processor).LoadPercentage"').toString().trim()) } catch { return null } }
const out = { at: new Date().toISOString(), cpu: os.cpus()[0]?.model, logicalCpus: os.cpus().length, memGB: Math.round(os.totalmem() / 2 ** 30), cpuLoadPct: load(), browsers: {} }
for (const [name, type] of Object.entries({ chromium, firefox, webkit })) {
  const b = await type.launch({ headless: true })
  const p = await b.newPage()
  await p.goto(`${base}#dlab`)
  const gl = await p.evaluate(() => {
    const c = document.createElement('canvas').getContext('webgl')
    if (!c) return null
    const e = c.getExtension('WEBGL_debug_renderer_info')
    return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : c.getParameter(c.RENDERER)
  })
  out.browsers[name] = { version: b.version(), webglRenderer: gl, headless: true }
  await b.close()
}
console.log(JSON.stringify(out, null, 1))
