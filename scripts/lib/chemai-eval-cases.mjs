// ChemAI chemistry evaluation: questions with reference facts and a per-category grader.
// Categories are graded separately; an answer is PASS only if every automatic
// category passes. Fabrication and the overall chemistry are always left to a
// human reviewer (the grader cannot prove an answer is free of invented data).
import { extractMath } from '../../src/ai/markdown.js'

// Text for matching: math unwrapped, Unicode sub/superscripts to ASCII, decimal comma to dot.
export function plain(text) {
  return String(text)
    .replace(/\$+/g, ' ')
    .replace(/\\(?:text|mathrm|mathbf|ce)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '$1/$2')
    .replace(/\\(?:rightarrow|longrightarrow|to)\b/g, '→')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\times\b/g, '×')
    .replace(/\\(?:left|right)\b|\\[,;:! ]|\\[()[\]]/g, ' ')
    .replace(/[_^]\{([^{}]*)\}/g, '$1')
    .replace(/[_^]/g, '')
    .replace(/[{}]/g, '')
    .replace(/[₀-₉]/g, char => String(char.charCodeAt(0) - 0x2080))
    .replace(/[⁰¹²³⁴-⁹]/g, char => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(char)))
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
}

// GDPT 2018 terminology: the old Vietnamised names should not appear.
const OLD_TERMS = [/\baxit\b/i, /\bbazơ\b/i, /\bHiđro\b|\bHydro\b(?!xide)/, /\bOxy\b(?!gen)/, /nhóm metan|nhóm etan/i]
const TRUNCATED = /chưa hoàn chỉnh do vượt giới hạn độ dài|rút gọn do giới hạn độ dài/

const EQUATION = '(?:→|->|=)'

export const CASES = [
  { id: 'mol-stp', topic: 'n ở đktc', question: 'Tính số mol của 4,48 lít khí CO2 ở điều kiện tiêu chuẩn (đktc, 22,4 L/mol).', final: [/0\.20? ?mol/] },
  { id: 'vol-std', topic: 'V ở đkc', question: 'Tính thể tích của 0,1 mol khí N2 ở điều kiện chuẩn (đkc: 25 °C, 1 bar).', final: [/2\.479|2\.48 ?(L|lít)/] },
  { id: 'mass', topic: 'khối lượng', question: 'Khối lượng của 0,5 mol H2SO4 là bao nhiêu gam?', final: [/\b49(\.0+)? ?(g|gam)\b/], steps: [/98 ?g\/mol/] },
  { id: 'molar-mass', topic: 'khối lượng mol', question: 'Tính khối lượng mol phân tử của glucose C6H12O6.', final: [/180 ?g\/mol/] },
  { id: 'molarity', topic: 'nồng độ mol', question: 'Hòa tan 5,85 gam NaCl vào nước được 500 mL dung dịch. Tính nồng độ mol của dung dịch.', final: [/0\.20? ?(M|mol\/L)\b/], steps: [/0\.10? ?mol/] },
  { id: 'stoich', topic: 'bài toán PTHH', question: 'Cho 5,6 gam Fe tác dụng hết với dung dịch HCl dư. Tính thể tích khí H2 thu được ở đktc.', final: [/2\.24 ?(L|l|lít|dm3)/], steps: [/Fe ?\+ ?2 ?HCl/, /0\.10? ?mol/] },
  { id: 'balance-fe3o4', topic: 'cân bằng Fe₃O₄', question: 'Cân bằng phương trình: Fe + O2 → Fe3O4', final: [new RegExp(`3 ?Fe ?\\+ ?2 ?O2 ?${EQUATION} ?Fe3O4`)], forbiddenSteps: [/nhân đôi[^.\n]{0,40}\bFe\b|\bFe\b[^.\n]{0,40}nhân đôi/i] },
  { id: 'balance-al2o3', topic: 'cân bằng (biến thể)', question: 'Cân bằng phương trình Al + O2 → Al2O3 và giải thích từng bước.', final: [new RegExp(`4 ?Al ?\\+ ?3 ?O2 ?${EQUATION} ?2 ?Al2O3`)] },
  { id: 'neutral', topic: 'trung hòa', question: 'Viết phương trình phản ứng giữa dung dịch HCl và dung dịch NaOH.', final: [/NaCl/, /H2O/] },
  { id: 'ph', topic: 'pH', question: 'Tính pH của dung dịch HCl 0,01 M.', final: [/pH ?(=|là|bằng) ?2\b/] },
  { id: 'config-na', topic: 'cấu hình e Na', question: 'Viết cấu hình electron của nguyên tử Na (Z = 11).', final: [/1s2 ?2s2 ?2p6 ?3s1/], facts: [], forbiddenFacts: [/nhóm (IVA|IIA|IIIA|VA|VIA|VIIA|VIIIA)\b/] },
  { id: 'position-k', topic: 'vị trí K (biến thể)', question: 'Xác định vị trí của nguyên tố K (Z = 19) trong bảng tuần hoàn.', final: [/chu kì 4|chu kỳ 4/i, /\bIA\b|nhóm 1\b/], forbiddenFacts: [/nhóm (IIA|IVA|IB)\b/] },
  { id: 'position-cl', topic: 'vị trí Cl (biến thể)', question: 'Nguyên tố Cl (Z = 17) thuộc chu kì nào, nhóm nào? Giải thích.', final: [/chu kì 3|chu kỳ 3/i, /VIIA|nhóm 17\b/], steps: [/3s2 ?3p5/] },
  { id: 'cuso4-naoh', topic: 'NaOH + CuSO₄', question: 'Nêu hiện tượng khi nhỏ dung dịch NaOH vào dung dịch CuSO4 và viết phương trình.', final: [/Cu\(OH\)2/], facts: [/kết tủa/i, /xanh lam|xanh dương/i], forbiddenFacts: [/xanh lục/i, /không khí[^.\n]{0,60}(CuO|đen)|oxi hóa[^.\n]{0,40}CuO|oxy hóa[^.\n]{0,40}CuO/i, /2 ?Cu\(OH\)2 ?(→|->) ?CuO/] },
  { id: 'cuoh2-heat', topic: 'đun nóng Cu(OH)₂ (biến thể)', question: 'Đun nóng kết tủa Cu(OH)2 thì thu được chất gì, màu gì? Viết phương trình.', final: [/CuO/, new RegExp(`Cu\\(OH\\)2 ?(\\(t°?\\) ?)?${EQUATION}[^\\n]{0,20}CuO ?\\+ ?H2O`)], facts: [/đen/i], forbiddenFacts: [/2 ?Cu\(OH\)2 ?(→|->) ?CuO/, /CuO[^.\n]{0,30}(xám|đỏ)/i] },
  { id: 'fecl3-naoh', topic: 'NaOH + FeCl₃ (biến thể)', question: 'Nêu hiện tượng khi nhỏ dung dịch NaOH vào dung dịch FeCl3 và viết phương trình.', final: [/Fe\(OH\)3/, new RegExp(`FeCl3 ?\\+ ?3 ?NaOH|3 ?NaOH ?\\+ ?FeCl3`)], facts: [/nâu đỏ/i] },
  { id: 'missing-data', topic: 'thiếu dữ kiện', question: 'Tính khối lượng muối thu được sau phản ứng.', final: [/thiếu|chưa (đủ|có|cho)|cần (thêm|biết)|không đủ/i] },
  { id: 'ethanol', topic: 'ethanol', question: 'Ethanol có công thức cấu tạo thu gọn là gì?', final: [/C2H5OH|CH3CH2OH|CH3-CH2-OH/] },
  { id: 'alkyl-names', topic: 'tên nhóm alkyl (biến thể)', question: 'Gọi tên các nhóm CH3– và C2H5– theo danh pháp hiện hành.', final: [/methyl/i, /ethyl/i] }
]

// Returns { categories: {name: true|false|null}, pass, notes }. null = not applicable.
export function grade(testCase, answer) {
  const raw = String(answer || '')
  const text = plain(raw)
  const missing = list => (list || []).filter(pattern => !pattern.test(text)).map(String)
  const present = list => (list || []).filter(pattern => pattern.test(text)).map(String)
  const notes = []
  const check = (name, problems) => {
    if (problems === null) return null
    if (problems.length) notes.push(`${name}: ${problems.join(', ')}`)
    return problems.length === 0
  }
  // Display: anything that still looks like TeX after math extraction would show raw.
  const leftover = extractMath(raw).text
  const display = [/\$/.test(leftover) && 'unbalanced $', /\\[A-Za-z]+/.test(leftover) && 'TeX outside math'].filter(Boolean)
  const categories = {
    final: check('final', missing(testCase.final)),
    steps: check('steps', testCase.steps || testCase.forbiddenSteps ? [...missing(testCase.steps), ...present(testCase.forbiddenSteps)] : null),
    facts: check('facts', testCase.facts || testCase.forbiddenFacts ? [...missing(testCase.facts), ...present(testCase.forbiddenFacts)] : null),
    terminology: check('terminology', present(OLD_TERMS)),
    display: check('display', display),
    complete: check('complete', TRUNCATED.test(raw) || !raw.trim() ? ['truncated or empty'] : [])
  }
  const pass = Object.values(categories).every(value => value !== false)
  return { categories, pass, notes }
}
