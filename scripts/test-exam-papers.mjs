// Data checks for every published (takeable) official paper:
// structure, double-entry answer key against the official key page, scientific
// recomputation of numeric answers, figures on disk, no placeholders.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { EXAMS, isTakeable, loadPaper } from '../src/exam/catalog.js'
import { getBlueprint } from '../src/exam/blueprints.js'
import { scoreExam, validateShortAnswer } from '../src/exam/scoring.js'
import { validatePaper } from '../src/exam/validate.js'
import { molarMass } from '../src/learning/chemMath.js'
import { GRADES } from '../src/learning/catalog.js'

let passed = 0
const failures = []
function check(name, condition, detail = '') {
  if (condition) passed += 1
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
}

const chapterIds = new Set(GRADES.flatMap(grade => grade.chapters.map(chapter => chapter.id)))

// Answer keys typed a second time, independently, from the official key pages.
const OFFICIAL_KEYS = {
  'tham-khao-2025-hoa': {
    page: '04_HoaHoc.pdf trang 5 (ĐÁP ÁN ĐỀ THAM KHẢO)',
    I: 'AADABDCABBBADBADDB',
    II: ['ĐĐSS', 'SSĐS', 'SĐĐĐ', 'ĐSSĐ'],
    III: ['10,7', '322', '2134', '7', '1,03', '86,1']
  },
  'minh-hoa-2025-hoa': {
    page: '4_Hoa hoc.pdf trang 5 (ĐÁP ÁN ĐỀ KIỂM TRA LỚP 10)',
    I: 'BADADBADDDCCBCBDAD',
    II: ['SSĐĐ', 'ĐĐSĐ', 'ĐĐĐS', 'ĐĐĐS'],
    III: ['3', '6', '3', '4', '5', '24,3']
  },
  'dong-nai-2026-l1-0301': {
    page: 'bảng đáp án của Sở GD&ĐT Đồng Nai, mã 0301 (xlsx và PDF)',
    I: 'CDAABBADCADBDACABB',
    II: ['SĐSS', 'SĐSĐ', 'ĐSSĐ', 'ĐĐSS'],
    III: ['10', '2', '4,1', '4', '104', '4']
  },
  'dong-nai-2026-l1-0325': {
    page: 'bảng đáp án của Sở GD&ĐT Đồng Nai, mã 0325 (xlsx và PDF)',
    I: 'ACACDBBDDCDACCBDCB',
    II: ['ĐSSS', 'ĐĐSS', 'SĐĐS', 'SSĐĐ'],
    III: ['62,5', '4', '2', '3', '20,5', '-354']
  }
}

// Independent recomputation of numeric short answers (rounded as the paper asks).
const round = (value, digits) => Number(value.toFixed(digits))
const RECOMPUTE = {
  'tham-khao-2025-hoa': {
    'tk25-iii1': () => round(5.4 * 2 * molarMass('Al2O3') / (4 * molarMass('Al')) / 0.954, 1),
    'tk25-iii2': () => molarMass('C18H35O2K'),
    'tk25-iii5': () => {
      const dH1 = -110.5 - (-74.6 + -241.8)
      const dH2 = -393.5 + 2 * -241.8 - -74.6
      const molH2 = 0.30e6 / molarMass('H2')
      const molCH4 = molH2 / 3 + (molH2 / 3) * dH1 / (0.9 * -dH2)
      return round(molCH4 * molarMass('CH4') / 1e6, 2)
    },
    'tk25-iii6': () => {
      const molFe = 9.72e-3 * 0.012 * 5 * 10
      const mohr = molarMass('FeSO4') + 2 * molarMass('NH4') + molarMass('SO4') + 6 * molarMass('H2O')
      return round(molFe * mohr / 2.656 * 100, 1)
    }
  },
  'minh-hoa-2025-hoa': {
    'mh25-iii6': () => round((24 * 79 + 25 * 10 + 26 * 11) / 100, 1),
    'mh25-iii5': () => 2 + 3
  },
  'dong-nai-2026-l1-0301': {
    // Na⁺ released by regeneration = 2 × (Ca²⁺ + Mg²⁺) held; 1 unit = 0,5 mmol/L.
    'dn1-iii1': () => round(200 * 150 / molarMass('NaCl') / 2 / 50000 * 1000 / 0.5, 0),
    'dn1-iii3': () => round(0.60e-3 / molarMass('C3H5N3O9') * 1541.4e3, 1),
    'dn1-iii5': () => molarMass('C8H8')
  },
  'dong-nai-2026-l1-0325': {
    'dn2-iii1': () => molarMass('C2H3Cl'),
    'dn2-iii5': () => round(100 * 120 / molarMass('NaCl') / 2 / (10 * 0.5e-3) / 1000, 1),
    // C₃H₅N₃O₉ → 3/2 N₂ + 3 CO₂ + 5/2 H₂O(l) + 1/4 O₂
    'dn2-iii6': () => round(3 * -393.5 + 2.5 * -285.8 - -1541.4, 0)
  }
}
const asNumber = text => Number(String(text).replace(',', '.'))

const PLACEHOLDER = /\b(TODO|TBD|lorem|placeholder|xxx)\b|\?\?\?/i

for (const entry of EXAMS.filter(item => item.kind !== 'fixture' && isTakeable(item))) {
  const paper = await loadPaper(entry)
  const name = entry.id
  const blueprint = getBlueprint(paper.blueprint)
  const errors = validatePaper(paper, { chapterIds })
  check(`${name}: paper validates (strict blueprint counts)`, errors.length === 0, errors.join('; '))
  check(`${name}: catalog and paper agree`, paper.id === entry.id && paper.blueprint === entry.blueprint && paper.timeLimitMinutes === blueprint.timeLimitMinutes && paper.answerKey === entry.answerKey)
  check(`${name}: owner attestation recorded, licence document not claimed`, paper.license === 'owner-attested' && entry.rights.documentSeenByAgent === false)

  const sections = Object.fromEntries(paper.sections.map(section => [section.part, section.questions]))
  const key = OFFICIAL_KEYS[name]
  check(`${name}: an independent official key exists in this test`, Boolean(key))
  if (key) {
    const part1 = sections.I.map(q => q.answer).join('')
    check(`${name}: Part I key matches ${key.page}`, part1 === key.I, `${part1} vs ${key.I}`)
    const part2 = sections.II.map(q => ['a', 'b', 'c', 'd'].map(id => (q.answer[id] ? 'Đ' : 'S')).join(''))
    check(`${name}: Part II key matches`, part2.join() === key.II.join(), part2.join())
    const part3 = sections.III.map(q => q.answer)
    check(`${name}: Part III key matches`, part3.join() === key.III.join(), part3.join())
  }

  // Full marks only with the key; total exactly 10.
  const right = {}
  for (const section of paper.sections) for (const q of section.questions) right[q.id] = section.part === 'II' ? { ...q.answer } : q.answer
  const full = scoreExam(paper, right)
  check(`${name}: all-correct scores exactly 10`, full.earned === 1000 && full.possible === 1000, String(full.earned))
  check(`${name}: empty sheet scores 0`, scoreExam(paper, {}).earned === 0)

  // Short answers fit the 4-column grid and recompute.
  for (const q of sections.III) check(`${name}: ${q.id} answer fits the grid`, validateShortAnswer(q.answer, 4).ok)
  for (const [id, compute] of Object.entries(RECOMPUTE[name] || {})) {
    const q = sections.III.find(item => item.id === id)
    const value = compute()
    check(`${name}: ${id} recomputed independently`, Math.abs(value - asNumber(q.answer)) < 1e-9, `${value} vs ${q.answer}`)
  }

  // Options distinct, statements distinct, no placeholders, figures present.
  for (const section of paper.sections) {
    for (const q of section.questions) {
      const texts = JSON.stringify(q)
      check(`${name}: ${q.id} has no placeholder text`, !PLACEHOLDER.test(texts))
      if (q.options) check(`${name}: ${q.id} options are distinct`, new Set(q.options.map(o => o.text)).size === q.options.length)
      if (q.statements) check(`${name}: ${q.id} statements are distinct`, new Set(q.statements.map(s => s.text)).size === q.statements.length)
      check(`${name}: ${q.id} solution labelled as ChemLab reference`, q.solution.official === false || paper.solutionsOfficial === true)
      for (const block of Array.isArray(q.content) ? q.content : []) {
        if (block.type !== 'figure') continue
        const file = fileURLToPath(block.src)
        const exists = fs.existsSync(file)
        check(`${name}: ${q.id} figure exists`, exists, file)
        if (exists) {
          const png = fs.readFileSync(file)
          check(`${name}: ${q.id} figure size matches`, png.readUInt32BE(16) === block.width && png.readUInt32BE(20) === block.height, `${png.readUInt32BE(16)}×${png.readUInt32BE(20)}`)
        }
      }
    }
  }
}

check('at least one official paper is takeable', EXAMS.some(item => item.kind !== 'fixture' && isTakeable(item)))

if (failures.length) {
  console.error(`FAIL — ${failures.length} exam paper checks failed:`)
  failures.forEach(failure => console.error(`  ✗ ${failure}`))
  process.exit(1)
}
console.log(`PASS — ${passed} exam paper checks passed.`)
