import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

import {
  CHEMICALS,
  CHEMICAL_ORDER
} from '../src/lab/chemicals.js'

import {
  REACTIONS
} from '../src/lab/reactions.js'

import {
  CURRICULUM
} from '../src/lab/experiments/curriculum.js'

import {
  GRADE10_EXPERIMENTS
} from '../src/lab/experiments/grade10.js'

import {
  GRADE11_EXPERIMENTS
} from '../src/lab/experiments/grade11.js'

import {
  GRADE12_EXPERIMENTS
} from '../src/lab/experiments/grade12.js'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')

const errors = []
const warnings = []

const fail = message =>
  errors.push(message)

const warn = message =>
  warnings.push(message)

const uniqueDuplicates = values => {
  const seen = new Set()
  const duplicates = new Set()

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value)
    }

    seen.add(value)
  }

  return [...duplicates]
}

const packageJson = JSON.parse(
  await fs.readFile(
    path.join(rootDir, 'package.json'),
    'utf8'
  )
)

const version = String(packageJson.version || '').trim()

const appMetaText = await fs.readFile(
  path.join(rootDir, 'src/appMeta.js'),
  'utf8'
)

const swText = await fs.readFile(
  path.join(rootDir, 'public/sw.js'),
  'utf8'
)

const manifest = JSON.parse(
  await fs.readFile(
    path.join(rootDir, 'public/manifest.webmanifest'),
    'utf8'
  )
)

const indexHtml = await fs.readFile(
  path.join(rootDir, 'index.html'),
  'utf8'
)

if (!appMetaText.includes(`version: '${version}'`)) {
  fail(`src/appMeta.js chưa đồng bộ version ${version}.`)
}

if (!swText.includes(`'chemlab-${version}'`)) {
  fail(`public/sw.js chưa đồng bộ cache version ${version}.`)
}

if (!manifest.name.includes(version)) {
  fail(`manifest.webmanifest chưa chứa version ${version}.`)
}

if (!indexHtml.includes(`ChemLab ${version}`)) {
  fail(`index.html chưa chứa version ${version}.`)
}

/* =========================================================
   SOURCE INTEGRITY
========================================================= */

const srcDir = path.join(rootDir, 'src')

async function walkFiles(directory) {
  const entries = await fs.readdir(
    directory,
    { withFileTypes: true }
  )

  const files = []

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    )

    if (entry.isDirectory()) {
      files.push(
        ...await walkFiles(fullPath)
      )
      continue
    }

    files.push(fullPath)
  }

  return files
}

const sourceFiles = await walkFiles(srcDir)
const jsFiles = sourceFiles.filter(filePath => filePath.endsWith('.js'))
const cssFiles = sourceFiles.filter(filePath => filePath.endsWith('.css'))

const importPatterns = [
  /\bimport\s*['"](\.[^'"]+)['"]/g,
  /\bimport\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g,
  /\b(?:import|export)\s+[\s\S]*?\sfrom\s*['"](\.[^'"]+)['"]/g
]

let checkedRelativeImports = 0

for (const jsFile of jsFiles) {
  const source = await fs.readFile(
    jsFile,
    'utf8'
  )

  const syntaxCheck = spawnSync(
    process.execPath,
    ['--check', jsFile],
    {
      encoding: 'utf8'
    }
  )

  if (syntaxCheck.status !== 0) {
    fail(
      `JavaScript syntax lỗi ở ${path.relative(rootDir, jsFile)}: ${syntaxCheck.stderr.trim()}`
    )
  }

  const specifiers = new Set()

  for (const pattern of importPatterns) {
    pattern.lastIndex = 0

    let match

    while ((match = pattern.exec(source))) {
      specifiers.add(match[1])
    }
  }

  for (const specifier of specifiers) {
    checkedRelativeImports += 1

    const resolved = path.resolve(
      path.dirname(jsFile),
      specifier
    )

    try {
      await fs.access(resolved)
    } catch {
      fail(
        `${path.relative(rootDir, jsFile)} import file không tồn tại: ${specifier}`
      )
    }
  }
}

const routeModuleExports = {
  'balancer.js': ['initEquationBalancer'],
  'chemCalculator.js': ['initChemCalculator'],
  'solubilityTable.js': ['initSolubilityTable'],
  'ionEngine.js': ['initIonEngine'],
  'ionEngineReset.js': ['initIonEngineReset'],
  'orbitalAtlas.js': ['initOrbitalAtlas'],
  'toolHub.js': ['initToolHub'],
  'quiz.js': ['initQuiz'],
  'virtualLab.js': ['initVirtualLab'],
  'lab/experiments/guidedExperiments.js': ['initGuidedExperiments']
}

for (const [relativePath, exports] of Object.entries(routeModuleExports)) {
  const modulePath = path.join(srcDir, relativePath)
  const source = await fs.readFile(modulePath, 'utf8')

  for (const exportName of exports) {
    const directExport = new RegExp(
      `export\\s+(?:async\\s+)?function\\s+${exportName}\\b`
    )

    const namedExport = new RegExp(
      `export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`,
      's'
    )

    if (
      !directExport.test(source) &&
      !namedExport.test(source)
    ) {
      fail(
        `Lazy route module ${relativePath} thiếu export ${exportName}.`
      )
    }
  }
}

for (const cssFile of cssFiles) {
  const css = await fs.readFile(
    cssFile,
    'utf8'
  )

  const openBraces = (css.match(/\\{/g) || []).length
  const closeBraces = (css.match(/\\}/g) || []).length

  if (openBraces !== closeBraces) {
    fail(
      `CSS block không cân bằng ở ${path.relative(rootDir, cssFile)}: ${openBraces} "{" / ${closeBraces} "}".`
    )
  }
}

const chemicalIds = Object.keys(CHEMICALS)

if (chemicalIds.length !== CHEMICAL_ORDER.length) {
  fail(
    `CHEMICALS (${chemicalIds.length}) và CHEMICAL_ORDER (${CHEMICAL_ORDER.length}) lệch số lượng.`
  )
}

for (const duplicate of uniqueDuplicates(CHEMICAL_ORDER)) {
  fail(`Chemical ID bị lặp trong CHEMICAL_ORDER: ${duplicate}`)
}

for (const id of CHEMICAL_ORDER) {
  if (!CHEMICALS[id]) {
    fail(`CHEMICAL_ORDER tham chiếu chemical không tồn tại: ${id}`)
  }
}

for (const [key, chemical] of Object.entries(CHEMICALS)) {
  if (chemical.id !== key) {
    fail(`Chemical key/id không khớp: key=${key}, id=${chemical.id}`)
  }
}

for (const duplicate of uniqueDuplicates(REACTIONS.map(reaction => reaction.id))) {
  fail(`Reaction ID bị lặp: ${duplicate}`)
}

const reactionIds = new Set(
  REACTIONS.map(reaction => reaction.id)
)

for (const reaction of REACTIONS) {
  if (!reaction.id) {
    fail('Có reaction không có id.')
  }

  if (!Array.isArray(reaction.reactants) || reaction.reactants.length < 1) {
    fail(`Reaction ${reaction.id} không có reactants hợp lệ.`)
  }

  for (const chemicalId of reaction.reactants || []) {
    if (!CHEMICALS[chemicalId]) {
      fail(
        `Reaction ${reaction.id} tham chiếu chemical không tồn tại: ${chemicalId}`
      )
    }
  }

  if (!Array.isArray(reaction.effects) || reaction.effects.length < 1) {
    warn(`Reaction ${reaction.id} không có effect.`)
  }
}

const curriculumLessons = []
const chapterIds = []

for (const grade of Object.values(CURRICULUM)) {
  for (const chapter of grade.chapters || []) {
    chapterIds.push(chapter.id)

    for (const lesson of chapter.lessons || []) {
      curriculumLessons.push({
        ...lesson,
        grade: grade.grade,
        chapterId: chapter.id
      })
    }
  }
}

for (const duplicate of uniqueDuplicates(chapterIds)) {
  fail(`Chapter ID bị lặp: ${duplicate}`)
}

for (const duplicate of uniqueDuplicates(curriculumLessons.map(lesson => lesson.id))) {
  fail(`Lesson ID bị lặp: ${duplicate}`)
}

const lessonIds = new Set(
  curriculumLessons.map(lesson => lesson.id)
)

const experiments = [
  ...GRADE10_EXPERIMENTS,
  ...GRADE11_EXPERIMENTS,
  ...GRADE12_EXPERIMENTS
]

for (const duplicate of uniqueDuplicates(experiments.map(experiment => experiment.id))) {
  fail(`Experiment ID bị lặp: ${duplicate}`)
}

const guidedQuestionIds = []
const lessonExperimentCount = new Map()

for (const experiment of experiments) {
  lessonExperimentCount.set(
    experiment.lessonId,
    (lessonExperimentCount.get(experiment.lessonId) || 0) + 1
  )

  if (!lessonIds.has(experiment.lessonId)) {
    fail(
      `Experiment ${experiment.id} tham chiếu lesson không tồn tại: ${experiment.lessonId}`
    )
  }

  for (const chemicalId of experiment.chemicals || []) {
    if (!CHEMICALS[chemicalId]) {
      fail(
        `Experiment ${experiment.id} tham chiếu chemical không tồn tại: ${chemicalId}`
      )
    }
  }

  for (const step of experiment.steps || []) {
    if (step.type === 'add' && !CHEMICALS[step.chemical]) {
      fail(
        `Experiment ${experiment.id} có bước add chemical không tồn tại: ${step.chemical}`
      )
    }

    if (step.type === 'reaction' && !reactionIds.has(step.reaction)) {
      fail(
        `Experiment ${experiment.id} có bước reaction không tồn tại: ${step.reaction}`
      )
    }

    if (step.type === 'quiz' || step.type === 'prediction') {
      guidedQuestionIds.push(step.id)

      const optionIds = new Set(
        (step.options || []).map(option => option.id)
      )

      if (!step.id) {
        fail(`Experiment ${experiment.id} có câu hỏi thiếu id.`)
      }

      if (!optionIds.has(step.correct)) {
        fail(
          `Câu ${step.id || '(không id)'} có đáp án đúng không nằm trong options.`
        )
      }
    }
  }
}

for (const duplicate of uniqueDuplicates(guidedQuestionIds)) {
  fail(`Guided question ID bị lặp: ${duplicate}`)
}

for (const lesson of curriculumLessons) {
  if (!lessonExperimentCount.has(lesson.id)) {
    fail(`Lesson chưa có Guided Activity: ${lesson.id}`)
  }
}

const stats = {
  version,
  chemicals: chemicalIds.length,
  reactions: REACTIONS.length,
  chapters: chapterIds.length,
  lessons: curriculumLessons.length,
  guidedActivities: experiments.length,
  guidedSteps: experiments.reduce(
    (total, experiment) => total + (experiment.steps?.length || 0),
    0
  ),
  guidedQuestions: guidedQuestionIds.length,
  jsFilesChecked: jsFiles.length,
  cssFilesChecked: cssFiles.length,
  relativeImports: checkedRelativeImports,
  lazyRouteModules: Object.keys(routeModuleExports).length
}

console.log('\nChemLab project validation')
console.table(stats)

if (warnings.length) {
  console.warn(`\nWarnings (${warnings.length})`)

  for (const message of warnings) {
    console.warn(`- ${message}`)
  }
}

if (errors.length) {
  console.error(`\nErrors (${errors.length})`)

  for (const message of errors) {
    console.error(`- ${message}`)
  }

  process.exitCode = 1
} else {
  console.log('\nPASS — version và dữ liệu ChemLab nhất quán.\n')
}
