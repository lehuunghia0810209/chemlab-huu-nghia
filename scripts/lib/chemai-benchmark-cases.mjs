// ChemAI 6.7 benchmark: 56 THPT chemistry questions with hand-solved expected results.
// route: what a correct router should do — 'engine' (0 tokens), '20b', '120b' or 'llm'
// (either model is acceptable). expect: every pattern must match the answer; reject: none
// may. Answers are compared after plainChem (no LaTeX, ASCII digits, decimal point), so a
// pattern reads "2.479" for 2,479. Patterns catch the final result, not the reasoning: a
// human still reviews the saved answers before any release decision.
import { answerGuard, plainChem } from '../../functions/api/_chemFacts.js'

const FE_HCL = [
  { role: 'user', content: 'Cho 5,6 g Fe tác dụng hết với dung dịch HCl dư. Tính thể tích khí H2 thu được ở đkc.' },
  { role: 'assistant', content: 'n(Fe) = 5,6/56 = 0,1 mol. Fe + 2HCl → FeCl₂ + H₂. n(H₂) = n(Fe) = 0,1 mol. V(H₂) = 0,1 × 24,79 = 2,479 L.' }
]
// "pH = 2", "pH = −log(0,01) = 2", "pH ≈ 2": the last value stated for pH in that clause.
// A whole number in the answer within ±rel of value (2,48 passes for 2,479; 2,24 and 12,479 do not).
// Same interface as a RegExp (test, toString), so gradeAnswer treats both alike.
const NUM = (value, rel = 0.005) => ({
  test: text => (text.match(/\d+(?:\.\d+)?/g) || []).some(found => Math.abs(Number(found) - value) <= rel * value),
  toString: () => `≈${value} ±${rel * 100}%`
})
// The final result, not a number somewhere in the working: the LAST volume stated in litres
// (molar volumes such as 24.79 L/mol or L·mol⁻¹ are not volumes) within ±rel of value.
const FINAL_L = (value, rel = 0.005) => ({
  test: text => {
    const last = [...text.matchAll(/(\d+(?:\.\d+)?) ?(?:L|lít)(?![\p{L}\d]| ?[·./]? ?mol)/gu)].at(-1)
    return Boolean(last) && Math.abs(Number(last[1]) - value) <= rel * value
  },
  toString: () => `final volume ≈${value} L ±${rel * 100}%`
})
const PH = value => new RegExp(`pH(?:[^.;:\\n]|\\.(?=\\d)){0,40}?(?:=|là|bằng|≈) ?${value}(?!\\d|\\.\\d)`)

export const CASES = Object.freeze([
  // Element lookup
  { id: 'E1', category: 'element', route: 'engine', question: 'Số hiệu nguyên tử của sắt là bao nhiêu?', expect: [/\b26\b/] },
  { id: 'E2', category: 'element', route: 'engine', question: 'Nguyên tố có Z = 20 là gì?', expect: [/\bCa\b|calcium|canxi/i] },
  { id: 'E3', category: 'element', route: 'engine', question: 'Kí hiệu hóa học của natri là gì?', expect: [/\bNa\b/] },
  { id: 'E4', category: 'element', route: 'engine', question: 'Nguyên tử khối của Cl', expect: [/35\.5/] },
  { id: 'E5', category: 'element', route: 'engine', question: 'Neon có bao nhiêu electron?', expect: [/\b10\b/] },
  { id: 'E6', category: 'element', route: 'llm', question: 'Nguyên tố nào có tính kim loại mạnh nhất trong chu kì 3?', expect: [/\bNa\b|natri|sodium/i] },
  // Electron configuration
  { id: 'C1', category: 'configuration', route: 'engine', question: 'Cấu hình electron của Neon', expect: [/1s2 ?2s2 ?2p6/] },
  { id: 'C2', category: 'configuration', route: 'llm', question: 'Viết cấu hình electron của Fe (Z = 26)', expect: [/3d6 ?4s2|4s2 ?3d6/] },
  { id: 'C3', category: 'configuration', route: 'engine', question: 'Cấu hình electron của Cr', expect: [/3d5 ?4s1|4s1 ?3d5/] },
  { id: 'C4', category: 'configuration', route: 'engine', question: 'Cấu hình electron của Cu', expect: [/3d10 ?4s1|4s1 ?3d10/] },
  { id: 'C5', category: 'configuration', route: 'engine', question: '1s² 2s² 2p⁶ 3s² 3p⁵ là cấu hình của nguyên tố nào?', expect: [/\bCl\b|clo|chlorine/i] },
  { id: 'C6', category: 'configuration', route: 'llm', question: 'Viết cấu hình electron của ion Fe³⁺', expect: [/3d5/], reject: [/\[Ar\] ?3d5 ?4s[12]|3d3 ?4s2/] },
  { id: 'C7', category: 'configuration', route: 'llm', question: 'Nguyên tố X có cấu hình electron lớp ngoài cùng là 3s²3p⁴. Xác định vị trí của X trong bảng tuần hoàn.', expect: [/chu k[ìy] 3/i, /VIA|VI A|6A/] },
  { id: 'C8', category: 'configuration', route: 'llm', question: 'Tại sao cấu hình electron của Cr là [Ar]3d⁵4s¹ mà không phải [Ar]3d⁴4s²?', expect: [/bán bão hòa|bán bão hoà|bền/i] },
  // Balancing
  { id: 'B1', category: 'balancing', route: 'llm', question: 'Cân bằng phương trình: Fe + O2 → Fe3O4', expect: [/3 ?Fe ?\+ ?2 ?O2 ?→ ?Fe3O4/] },
  { id: 'B2', category: 'balancing', route: 'llm', question: 'Cân bằng: Al + O2 → Al2O3', expect: [/4 ?Al ?\+ ?3 ?O2 ?→ ?2 ?Al2O3/] },
  { id: 'B3', category: 'balancing', route: 'llm', question: 'Cân bằng: C3H8 + O2 → CO2 + H2O', expect: [/C3H8 ?\+ ?5 ?O2 ?→ ?3 ?CO2 ?\+ ?4 ?H2O/] },
  { id: 'B4', category: 'balancing', route: 'llm', question: 'Cân bằng phương trình KMnO4 + HCl → KCl + MnCl2 + Cl2 + H2O', expect: [/2 ?KMnO4 ?\+ ?16 ?HCl ?→ ?2 ?KCl ?\+ ?2 ?MnCl2 ?\+ ?5 ?Cl2 ?\+ ?8 ?H2O/] },
  { id: 'B5', category: 'balancing', route: '120b', question: 'Cân bằng phản ứng oxi hóa – khử Cu + HNO3 → Cu(NO3)2 + NO + H2O bằng phương pháp thăng bằng electron', expect: [/3 ?Cu ?\+ ?8 ?HNO3 ?→ ?3 ?Cu\(NO3\)2 ?\+ ?2 ?NO ?\+ ?4 ?H2O/] },
  { id: 'B6', category: 'balancing', route: 'llm', question: 'Cân bằng: Fe2O3 + CO → Fe + CO2', expect: [/Fe2O3 ?\+ ?3 ?CO ?→ ?2 ?Fe ?\+ ?3 ?CO2/] },
  // Acid–base
  { id: 'A1', category: 'acid-base', route: 'engine', question: 'Tính pH của dung dịch HCl 0,01M', expect: [PH(2)] },
  { id: 'A2', category: 'acid-base', route: 'engine', question: 'Tính pH của dung dịch NaOH 0,001M', expect: [PH(11)] },
  { id: 'A3', category: 'acid-base', route: 'engine', question: 'pH của dung dịch Ba(OH)2 0,005M là bao nhiêu?', expect: [PH(12)] },
  { id: 'A4', category: 'acid-base', route: 'llm', question: 'Tính pH của dung dịch H2SO4 0,005M (coi H2SO4 phân li hoàn toàn cả hai nấc)', expect: [PH(2)] },
  { id: 'A5', category: 'acid-base', route: 'llm', question: 'Theo thuyết Brønsted–Lowry, HCO3⁻ là acid hay base?', expect: [/lưỡng tính|vừa là acid,? vừa là base|cả acid và base|vừa có thể là acid/i] },
  { id: 'A6', category: 'acid-base', route: 'llm', question: 'Dung dịch CH3COONa có môi trường acid, base hay trung tính? Vì sao?', expect: [/base|kiềm/i], reject: [/môi trường (?:là )?acid|trung tính\./i] },
  { id: 'A7', category: 'acid-base', route: '120b', question: 'Trộn 100 mL dung dịch HCl 0,1M với 100 mL dung dịch NaOH 0,05M. Tính pH của dung dịch thu được.', expect: [/1\.6/] },
  // Amount, mass, concentration
  { id: 'M1', category: 'amount', route: 'engine', question: 'Khối lượng của 0,5 mol H2SO4 là bao nhiêu?', expect: [/\b49(?:\.0+)? ?(?:g|gam)\b/] },
  { id: 'M2', category: 'amount', route: 'engine', question: 'Tính số mol của 9,8 gam H2SO4', expect: [/0\.1 ?mol/] },
  { id: 'M3', category: 'amount', route: 'engine', question: 'Tính số mol của 11,2 lít khí H2 ở đktc', expect: [/0\.5 ?mol/] },
  { id: 'M4', category: 'amount', route: 'engine', question: 'Tính thể tích của 0,25 mol khí CO2 ở đkc', expect: [/6\.19\d* ?L|6\.2 ?L/] },
  { id: 'M5', category: 'amount', route: 'engine', question: 'Hòa tan 5,85 g NaCl vào nước được 200 mL dung dịch. Tính nồng độ mol của dung dịch.', expect: [/\b0\.50* ?(?:M\b|mol ?\/ ?L|mol ?[·.]? ?L(?:⁻¹|⁻1|-1))/] },
  { id: 'M6', category: 'amount', route: 'engine', question: 'Tính khối lượng NaOH có trong 200 mL dung dịch NaOH 0,5M', expect: [/\b4 ?(?:g|gam)\b/] },
  { id: 'M7', category: 'amount', route: 'engine', question: 'Khối lượng mol của Ca(OH)2', expect: [/\b74\b/] },
  { id: 'M8', category: 'amount', route: 'llm', question: 'Tính nồng độ phần trăm của dung dịch khi hòa tan 20 g NaCl vào 180 g nước', expect: [/\b10 ?%/] },
  { id: 'M9', category: 'amount', route: 'llm', question: 'Có bao nhiêu phân tử trong 0,5 mol CO2?', expect: [/3\.01/] },
  { id: 'M10', category: 'amount', route: 'llm', question: 'Tính khối lượng của 0,5 mol CuSO4.5H2O', expect: [/\b125 ?(?:g|gam)\b/] },
  // Multi-step problems
  { id: 'P1', category: 'multi-step', route: '120b', question: FE_HCL[0].content, expect: [FINAL_L(2.479), /(?<![\d.])56(?!\d|\.\d)/, /24\.79/], reject: [/55\.8/] },
  { id: 'P2', category: 'multi-step', route: '120b', question: 'Cho 2,7 g Al tác dụng với dung dịch H2SO4 loãng dư. Tính thể tích H2 (đktc).', expect: [/3\.36/] },
  { id: 'P3', category: 'multi-step', route: '120b', question: 'Đốt cháy hoàn toàn 4,6 g C2H5OH. Tính thể tích CO2 thu được ở đktc và khối lượng nước tạo thành.', expect: [/4\.48/, /5\.4 ?(?:g|gam)/] },
  { id: 'P4', category: 'multi-step', route: '120b', question: 'Hòa tan hoàn toàn 10 g hỗn hợp Mg và Fe vào dung dịch HCl dư thu được 5,6 lít H2 (đktc). Tính khối lượng mỗi kim loại.', expect: [/\b3 ?(?:g|gam)\b/, /\b7 ?(?:g|gam)\b/] },
  { id: 'P5', category: 'multi-step', route: '120b', question: 'Cho 200 mL dung dịch BaCl2 0,1M tác dụng với 100 mL dung dịch Na2SO4 0,15M. Tính khối lượng kết tủa.', expect: [NUM(3.495)] },
  { id: 'P6', category: 'multi-step', route: '120b', question: 'Nung 10 g CaCO3 đến khối lượng không đổi, hiệu suất 80%. Tính khối lượng CaO thu được.', expect: [/4\.48 ?(?:g|gam)/] },
  { id: 'P7', category: 'multi-step', route: '120b', question: 'Cho 6,5 g Zn vào 100 mL dung dịch CuSO4 1M. Sau phản ứng hoàn toàn, tính khối lượng chất rắn thu được.', expect: [/6\.4 ?(?:g|gam)/] },
  // Follow-ups that need the conversation
  { id: 'F1', category: 'follow-up', route: '120b', history: FE_HCL, question: 'Tính khối lượng muối thu được.', expect: [/12\.7/] },
  { id: 'F2', category: 'follow-up', route: '120b', history: FE_HCL, question: 'Nếu dùng 11,2 g Fe thì thể tích H2 là bao nhiêu?', expect: [/4\.958|4\.96/] },
  { id: 'F3', category: 'follow-up', route: 'llm', history: [{ role: 'user', content: 'Cấu hình electron của Fe' }, { role: 'assistant', content: 'Fe (Z = 26): 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s² (viết gọn [Ar] 3d⁶ 4s²).' }], question: 'Còn của Fe²⁺ thì sao?', expect: [/3d6/], reject: [/3d6 ?4s2 ?\(Fe2|Fe2\+?:? ?\[Ar\] ?3d4 ?4s2/] },
  { id: 'F4', category: 'follow-up', route: 'llm', history: [{ role: 'user', content: 'Tính pH của dung dịch HCl 0,01M' }, { role: 'assistant', content: 'HCl là acid mạnh nên [H⁺] = 0,01 M, pH = 2.' }], question: 'Nếu pha loãng dung dịch đó 10 lần thì pH bằng bao nhiêu?', expect: [/pH(?:[^.;:\n]|\.(?=\d)){0,40}?(?:=|là|bằng|≈|mới|tăng lên) ?3(?!\d|\.\d)/] },
  { id: 'F5', category: 'follow-up', route: 'llm', history: [{ role: 'user', content: 'Hòa tan 0,2 mol NaOH vào nước được 500 mL dung dịch.' }, { role: 'assistant', content: 'Dung dịch NaOH có nồng độ 0,2/0,5 = 0,4 M.' }], question: 'Tính pH của dung dịch đó.', expect: [/13\.6/] },
  { id: 'F6', category: 'follow-up', route: 'llm', history: [{ role: 'user', content: 'Liên kết ion là gì?' }, { role: 'assistant', content: 'Liên kết ion là liên kết được tạo thành bởi lực hút tĩnh điện giữa các ion mang điện tích trái dấu.' }], question: 'Cho ví dụ', expect: [/NaCl|MgO|KCl|CaCl2|NaF|CaO|K2O|Na2O/] },
  // Ambiguous questions and exceptions
  { id: 'X1', category: 'ambiguous', route: 'llm', question: 'Tính khối lượng của 0,5 mol', expect: [/thiếu|chưa (?:cho|rõ|nêu|biết)|chất nào|cần biết|cho biết chất|không rõ/i] },
  { id: 'X2', category: 'ambiguous', route: 'llm', question: 'Cu có tác dụng với dung dịch HCl không?', expect: [/không/i], reject: [/(?<![Kk]hông có phản ứng[^.]{0,40})Cu ?\+ ?2 ?HCl ?→ ?CuCl2 ?\+ ?H2(?!O)/] },
  { id: 'X3', category: 'ambiguous', route: 'llm', question: 'Tính thể tích của 0,5 mol khí O2', expect: [/đktc|đkc|điều kiện/i] },
  { id: 'X4', category: 'ambiguous', route: 'llm', question: 'Tính pH của dung dịch HCl 10⁻⁸ M', expect: [/6\.9/], reject: [/pH ?(?:=|là|bằng) ?8(?![\d.])/] },
  { id: 'X5', category: 'ambiguous', route: 'llm', question: 'Fe tác dụng với Cl2 tạo ra FeCl2 đúng không?', expect: [/FeCl3/, /2 ?Fe ?\+ ?3 ?Cl2 ?→ ?2 ?FeCl3/], reject: [/^\W*(?:đúng|có)(?![\p{L}])/iu, /(?:^|[^\d ]) ?Fe ?\+ ?Cl2 ?→ ?FeCl3/] },
  { id: 'X6', category: 'ambiguous', route: 'llm', question: 'Ag có tan trong dung dịch HCl không?', expect: [/không/i] }
])

// The text a pattern sees: plainChem, markdown emphasis removed, one line.
export const normalizeAnswer = answer => plainChem(String(answer).normalize('NFC').replace(/[⟶⇒]/g, '→').replace(/\*\*|__/g, '').replace(/ | /g, ' ')).replace(/\s+/g, ' ')

export function gradeAnswer(item, answer) {
  const text = normalizeAnswer(answer)
  const missing = (item.expect || []).filter(pattern => !pattern.test(text)).map(String)
  // A right equation or number next to a contradicting one is not a pass: anything the
  // Chemistry Guard still flags as an error in the shown answer fails the answer.
  const guard = answerGuard(String(answer), { question: item.question }).findings.filter(found => found.severity === 'error').map(found => `guard:${found.id}`)
  const forbidden = [...(item.reject || []).filter(pattern => pattern.test(text)).map(String), ...guard]
  return { pass: !missing.length && !forbidden.length, missing, forbidden }
}

export const routeMatches = (expected, actual) => expected === actual || (expected === 'llm' && (actual === '20b' || actual === '120b'))
