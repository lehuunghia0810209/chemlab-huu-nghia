// The evaluation grader itself. Fixtures are excerpts of GLM-4.7-Flash answers from the
// Preview run of 2026-10-21 (test questions only, no user data) plus corrected variants.
import assert from 'node:assert/strict'
import { CASES, grade, plain } from './lib/chemai-eval-cases.mjs'

const byId = id => CASES.find(item => item.id === id)
let passed = 0
function test(name, fn) {
  try {
    fn()
    passed += 1
  }
  catch (error) {
    console.error(`FAIL — ${name}`)
    throw error
  }
}

test('case list: unique ids, the four failure areas each have variants', () => {
  assert.equal(new Set(CASES.map(item => item.id)).size, CASES.length)
  for (const id of ['balance-al2o3', 'position-k', 'position-cl', 'cuoh2-heat', 'fecl3-naoh', 'alkyl-names']) assert.ok(byId(id), id)
})

test('normalisation reads TeX and Unicode the same way', () => {
  assert.equal(plain('$$C_m = \\frac{0,10 \\text{ mol}}{0,500 \\text{ L}} = 0,20 \\text{ mol/L}$$').trim(), 'C m = 0.10 mol/0.500 L = 0.20 mol/L'.replace('C m', 'Cm'))
  assert.match(plain('\\( 1s^2 2s^2 2p^6 3s^1 \\)'), /1s2 2s2 2p6 3s1/)
  assert.match(plain('3Fe + 2O₂ → Fe₃O₄'), /3Fe \+ 2O2 → Fe3O4/)
})

test('former false negatives now pass the final answer: “49,0 gam”, “0,20 mol/L”', () => {
  assert.equal(grade(byId('mass'), 'Khối lượng của 0,5 mol H₂SO₄ là **49,0 gam**. $M = 98 \\text{ g/mol}$').categories.final, true)
  assert.equal(grade(byId('molarity'), '$$n = 0,10 \\text{ mol}$$ $$C_m = \\frac{0,10}{0,500} = 0,20 \\text{ mol/L}$$').categories.final, true)
})

test('Na “nhóm IVA”: final answer right, facts wrong → not PASS', () => {
  const result = grade(byId('config-na'), 'Cấu hình electron là **\\( 1s^2 2s^2 2p^6 3s^1 \\)**. Nguyên tử Na thuộc nhóm IVA (nhóm 1) và chu kỳ 3.')
  assert.deepEqual([result.categories.final, result.categories.facts, result.pass], [true, false, false])
})

test('Cu(OH)₂ “xanh lục”, air oxidation, unbalanced decomposition → facts FAIL', () => {
  const answer = 'xuất hiện một kết tủa màu xanh lục. Sau đó chuyển sang màu đen khi tiếp xúc với không khí (do Cu(OH)₂ bị oxy hóa thành CuO).\n$$CuSO_4 + 2NaOH \\rightarrow Cu(OH)_2\\downarrow + Na_2SO_4$$\n$$2Cu(OH)_2 \\xrightarrow{\\Delta} CuO\\downarrow + H_2O$$'
  const result = grade(byId('cuso4-naoh'), answer)
  assert.equal(result.categories.facts, false)
  assert.equal(result.notes.filter(note => note.startsWith('facts')).length, 1)
  assert.match(result.notes[0], /kết tủa|xanh lam|xanh lục|không khí/)
  const fixed = grade(byId('cuso4-naoh'), 'Xuất hiện **kết tủa xanh lam** Cu(OH)₂.\n\nCuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄')
  assert.equal(fixed.pass, true, JSON.stringify(fixed))
})

test('Fe₃O₄ explained with “nhân đôi số mol Fe” → steps FAIL; the right wording passes', () => {
  const wrong = 'Phương trình có 1 nguyên tử Fe ở vế trái và 3 nguyên tử Fe ở vế phải. Ta cần nhân đôi số mol Fe.\n3Fe + 2O₂ → Fe₃O₄'
  assert.deepEqual([grade(byId('balance-fe3o4'), wrong).categories.steps, grade(byId('balance-fe3o4'), wrong).pass], [false, false])
  assert.equal(grade(byId('balance-fe3o4'), 'Vế phải có 3 nguyên tử Fe nên đặt hệ số 3 trước Fe.\n3Fe + 2O₂ → Fe₃O₄').pass, true)
})

test('“nhóm metan (CH₃-)” and old terms → terminology FAIL', () => {
  const result = grade(byId('ethanol'), 'Công thức là **C₂H₅OH**. Chuỗi gồm một nhóm metan (CH₃-) và nhóm -CH₂-.')
  assert.deepEqual([result.categories.final, result.categories.terminology], [true, false])
  assert.equal(grade(byId('neutral'), 'Phản ứng giữa axit HCl và bazơ NaOH: HCl + NaOH → NaCl + H₂O').categories.terminology, false)
  assert.equal(grade(byId('neutral'), 'Phản ứng giữa acid HCl và base NaOH: HCl + NaOH → NaCl + H₂O').pass, true)
})

test('variants: heating Cu(OH)₂, FeCl₃ + NaOH, alkyl names, positions', () => {
  assert.equal(grade(byId('cuoh2-heat'), 'Thu được CuO màu **đen**: Cu(OH)₂ → CuO + H₂O').pass, true)
  assert.equal(grade(byId('cuoh2-heat'), 'Thu được CuO màu đen: 2Cu(OH)₂ → CuO + H₂O').categories.facts, false)
  assert.equal(grade(byId('fecl3-naoh'), 'Kết tủa **nâu đỏ** Fe(OH)₃: FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl').pass, true)
  assert.equal(grade(byId('alkyl-names'), 'CH₃– là **methyl**, C₂H₅– là **ethyl**.').pass, true)
  assert.equal(grade(byId('position-k'), 'K: 1s²2s²2p⁶3s²3p⁶4s¹ → chu kì 4, nhóm IA.').pass, true)
  assert.equal(grade(byId('position-k'), 'K thuộc chu kì 4, nhóm IIA.').pass, false)
})

test('display and completeness are separate from correctness', () => {
  const raw = grade(byId('mol-stp'), 'n = 0,2 mol, viết là \\frac{4,48}{22,4 và $ lạc')
  assert.equal(raw.categories.final, true)
  assert.equal(raw.categories.display, false)
  const cut = grade(byId('mol-stp'), 'n = 0,2 mol\n\n*(Câu trả lời chưa hoàn chỉnh do vượt giới hạn độ dài. Hãy hỏi tiếp phần còn lại hoặc chia nhỏ câu hỏi.)*')
  assert.deepEqual([cut.categories.complete, cut.pass], [false, false])
  assert.equal(grade(byId('vol-std'), 'Kết quả: $$V \\approx 2,48$ L$').categories.final, true, 'recovered broken math still graded')
})

console.log(`PASS — ${passed} ChemAI evaluation grader checks passed.`)
