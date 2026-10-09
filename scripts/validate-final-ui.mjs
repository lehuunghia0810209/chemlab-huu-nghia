import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')
const read = relative => fs.readFile(path.join(rootDir, relative), 'utf8')

const [packageText, main, loader, home, finalCss] = await Promise.all([
  read('package.json'),
  read('src/main.js'),
  read('src/routeModuleLoader.js'),
  read('src/final/homeDashboard.js'),
  read('src/final/final-6.css')
])

const pkg = JSON.parse(packageText)
const failures = []
const checks = []

function expect(name, condition) {
  checks.push({ name, pass: Boolean(condition) })
  if (!condition) failures.push(name)
}

expect('release is ChemLab 6', /^6\./.test(pkg.version))
expect('final CSS is imported last', main.includes("import './final/final-6.css'"))
expect('home dashboard module is imported', main.includes("from './final/homeDashboard.js'"))
expect('home is a valid route', /new Set\(\[\s*'home'/.test(main))
expect('home view exists in app shell', main.includes('id="view-home"'))
expect('home nav entry exists', main.includes("'home',\n        'home',\n        'Tổng quan'"))
expect('brand returns to home', main.includes('data-app-view="home"'))
expect('v6 storage key is used', main.includes("'chemlab-v6-last-view'"))
expect('legacy v5 storage key is not used', !main.includes("'chemlab-v5-last-view'"))
expect('route loader marks home ready', /home:\s*\{\s*status:\s*'ready'/.test(loader))
expect('dashboard exports createHomeDashboard', home.includes('export function createHomeDashboard'))
expect('dashboard has Chem Flow', home.includes('CHEM FLOW'))
expect('dashboard has progress-driven grade cards', home.includes('getGradeSummary'))
expect('ChemLabApp context API exists', main.includes('window.ChemLabApp = Object.freeze'))
expect('view-change integration event exists', main.includes("'chemlab:view-change'"))
expect('Tool Center exposes Compound Studio', (await read('src/toolHub.js')).includes("id: 'compound'"))
expect('Tool Center exposes Reaction Studio', (await read('src/toolHub.js')).includes("id: 'reaction'"))
expect('final tokens exist', finalCss.includes('--cl6-violet:'))
expect('mobile final nav supports 5 routes', finalCss.includes('grid-template-columns:repeat(5,1fr)'))
expect('reduced motion is supported', finalCss.includes('@media (prefers-reduced-motion: reduce)'))
expect('final UI avoids !important', !finalCss.includes('!important'))

console.log('\nChemLab 6 final UI validation')
console.table(checks)

if (failures.length) {
  console.error(`\nFAIL — ${failures.length} final UI checks failed:`)
  failures.forEach(item => console.error(`- ${item}`))
  process.exitCode = 1
} else {
  console.log(`\nPASS — ${checks.length} final UI checks passed.\n`)
}
