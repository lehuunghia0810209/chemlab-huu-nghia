// ChemLab 7.0 — Scientific Validation Matrix generator. The validation status of each manifest entry is a reviewed
// judgement recorded HERE (not in product code), with the evidence that supports it. Default: UNVERIFIED.
// Usage: node scripts/dlab-sci-matrix.mjs → reports/chemlab-7.0/foundation/SCIENTIFIC_VALIDATION_MATRIX.md
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANIFEST } from '../src/dlab/data/manifest.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const T = 'scripts/test-dlab.mjs'
const SV = 'scripts/dlab-sci-validate.mjs'
const G1 = `${T} "gate 1: every manifest scenario conserves elements"`

// status, quantitative evidence (independent of the engine), conservation evidence, extra limits
const V = {
  neutralisation: ['VALIDATED', `${T} "pH strong acid / base", "pH weak acid / base (quadratic)" (closed form)`, G1],
  'co2-carbonate': ['EDUCATIONAL APPROXIMATION', `${T} "pH weak acid / base"; "CO2 into limewater" (qualitative)`, G1, 'Tốc độ thoát khí là minh họa.'],
  'dissolve-salts': ['EDUCATIONAL APPROXIMATION', `${T} "KNO3 solubility table interpolation" (vs the table in code; table values: see data audit)`, G1, 'Tốc độ tan là minh họa; bảng độ tan nội suy tuyến tính.'],
  boiling: ['EDUCATIONAL APPROXIMATION', `${T} "solvent: ethanol is not water" (CRC table points)`, '—', 'Nội suy tuyến tính bảng điểm sôi; 1 atm. Bảng (CRC cũ) có thể lệch 1,5–2,5 °C ở 5–50 % khối lượng etanol so với số liệu VLE 101,325 kPa (Carey & Lewis 1932, theo Antigravity — mới ở mức snippet, cần đối chiếu nguồn gốc rồi thay bảng).'],
  layers: ['EDUCATIONAL APPROXIMATION', `${T} "solvent: ethanol is not water" (density table)`, G1, 'Bỏ qua co thể tích khi trộn nước–etanol.'],
  'electrolysis-cucl2': ['EDUCATIONAL APPROXIMATION', `${T} "electrolysis CuCl2 follows Faraday" (n(Cu) = I·t/2F, closed form)`, `${T} "electrolysis CuCl2 follows Faraday"`, 'Khối lượng theo Faraday là định lượng; cường độ dòng (điện trở, quá thế) là minh họa.'],
  daniell: ['VALIDATED', `${T} "Daniell cell: Nernst voltage", "E follows E°(T)" (closed form)`, '—', 'Bỏ qua thế tiếp xúc lỏng; chưa tính phức amin nếu thêm NH₃.'],
  indicators: ['EDUCATIONAL APPROXIMATION', `${T} "litmus…", "indicator colour spreads…"`, '—'],
  'ammine-cu': ['EDUCATIONAL APPROXIMATION', `${T} "ammine complexes: model" (trend, conservation); constants spread ≈ 1,5 lg units between sources`, `${T} "ammine complexes: model" (Cu conserved)`],
  'ammine-ag': ['VALIDATED', `${T} "validation: AgCl partly dissolved in NH₃ matches the hand solution" (±3 %)`, G1],
  'ammine-zn': ['EDUCATIONAL APPROXIMATION', `${T} "ammine complexes: model" (trend)`, G1],
  redissolve: ['VALIDATED', `${T} "Cu(OH)2 forms with base and redissolves in acid" (n = n(OH⁻)/2)`, '—'],
  'mg-acid': ['VALIDATED', `${T} "Mg + HCl: H2 = n(Mg)…"; ${SV} (equation = engine stoichiometry)`, G1, 'Tốc độ phản ứng là minh họa.'],
  'zn-acid': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'fe-acid': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'fe-cu': ['VALIDATED', `${T} "Fe + CuSO4: copper coats the nail mole-for-mole"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'zn-cu': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'cu-ag': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'na-water': ['VALIDATED', `${T} "Na + water: … NaOH pH and heat"; ${SV}`, G1, 'Chuyển động của mẩu natri là minh họa.'],
  'caco3-acid': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'ppt-AgCl': ['VALIDATED', `${T} "validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved"; "AgCl: limiting reagent and Ksp residual"`, G1],
  'ppt-AgI': ['VALIDATED', `${T} "validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved"`, G1],
  'ppt-BaSO4': ['VALIDATED', `${T} "validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved"`, G1],
  'ppt-Cu(OH)2': ['VALIDATED', `${T} "Cu(OH)2 forms with base and redissolves in acid" (n = n(OH⁻)/2)`, G1, 'Ksp của Cu(OH)₂ đã "già" (CRC); kết tủa mới tan hơn ≈ 10 lần (Hidmi & Edwards 1999).'],
  'ppt-Fe(OH)3': ['VALIDATED', `${T} "hydroxide precipitates: Fe(OH)3, Fe(OH)2, Mg(OH)2 take the limiting reagent"`, G1],
  'ppt-Fe(OH)2': ['VALIDATED', `${T} "hydroxide precipitates: …"`, G1, 'Không mô hình Fe(OH)₂ bị oxi hóa trong không khí thành Fe(OH)₃.'],
  'ppt-Mg(OH)2': ['VALIDATED', `${T} "hydroxide precipitates: …"`, G1],
  'ppt-CaCO3': ['UNVERIFIED', `${T} "CO2 into limewater" (qualitative only)`, G1],
  'ppt-BaCO3': ['UNVERIFIED', 'demo only (forms)', G1],
  'ppt-ZnCO3': ['UNVERIFIED', 'demo only (forms)', G1, 'Thực tế có thể tạo kẽm cacbonat bazơ.'],
  'ppt-Ag2CO3': ['UNVERIFIED', 'demo only (forms)', G1],
  'ppt-Zn(OH)2': ['UNVERIFIED', 'demo only (forms)', G1],
  'redox-cu-i': ['VALIDATED', `${T} "CuCl₂ + KI: 2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂ … atoms and charge conserved"; ${SV}`, G1, 'Cổng pH ≤ 7 là chặn thô (nhiệt động: ngừng ở pH ≈ 5,6 khi có Cu(OH)₂); kết quả do Ksp chi phối vì chỉ ion tan phản ứng — đã thử trên engine.'],
  'redox-fe-i': ['EDUCATIONAL APPROXIMATION', `${SV} (equation = engine stoichiometry); conversion run to completion`, G1, 'Chạy hết theo chất hạn chế; ở < 1 mM thực tế còn vài % chưa phản ứng.'],
}
const def = e => {
  if (V[e.id]) return V[e.id]
  if (e.status === 'NO_REACTION') return ['VALIDATED', `${T} "reaction coverage: unmodelled metal/ion pairs are NO_REACTION or UNSUPPORTED by E°"; demo`, G1, 'So sánh E° chuẩn; không xét động học hay lớp thụ động.']
  if (e.status === 'UNSUPPORTED') return ['UNSUPPORTED', `${T} "unsupported and non-reactions do not invent results"; demo / "${(e.tests || [])[0] || '—'}"`, e.demo ? G1 : '—']
  if (e.status === 'INVALID') return ['UNSUPPORTED (chặn an toàn)', `${T} "safety: every blocked condition in the manifest is refused"`, '— (lệnh bị từ chối, không có tác dụng phụ)']
  return ['UNVERIFIED', '—', '—']
}
const esc = s => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const rows = MANIFEST.map(e => { const [st, ev, cons, lim] = def(e); return { e, st, ev, cons, lim } })
const count = {}
for (const r of rows) count[r.st] = (count[r.st] || 0) + 1
let md = `# ChemLab 7.0 — Scientific Validation Matrix

Sinh bởi \`node scripts/dlab-sci-matrix.mjs\` từ \`src/dlab/data/manifest.js\` (${MANIFEST.length} mục). Trạng thái là đánh giá đã rà soát, ghi trong script, **mặc định UNVERIFIED**; một mục chỉ là VALIDATED khi có nguồn và kiểm tra định lượng độc lập với engine (lời giải tay hoặc bảng tham chiếu) cho phạm vi đã công bố. Demo chỉ chứng minh hiện tượng xảy ra, không phải định lượng.

Kiểm tra chung cho mọi mục:
- **Cân bằng nguyên tố và điện tích** của mọi phương trình hiển thị, và khớp với tỉ lượng engine dùng: \`${SV}\` (104 kiểm tra, có tự kiểm tra bằng phương trình sai cố ý).
- **Bảo toàn nguyên tố** cho mọi kịch bản demo (đầu vào tính từ công thức và lượng hóa chất): ${G1}.
- **Khối lượng mol** so với nguyên tử khối chuẩn IUPAC 2021: \`${SV}\`.

| Trạng thái | Số mục |
|---|---|
${Object.entries(count).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

| ID | Phản ứng / quá trình | Nhóm | Điều kiện hỗ trợ | Kết quả kỳ vọng | Dữ liệu / mô hình | Nguồn | Bảo toàn | Kiểm chứng định lượng / test | Trạng thái | Giới hạn |
|---|---|---|---|---|---|---|---|---|---|---|
`
for (const { e, st, ev, cons, lim } of rows) md += `| \`${esc(e.id)}\` | ${esc(e.title)} | ${esc(e.group)} | ${esc(e.conditions)} | ${esc(e.products)}; ${esc(e.observe)} | ${esc(e.model)} | ${esc(e.source)} | ${esc(cons)} | ${esc(ev)} | **${st}** | ${esc([e.limits && e.limits !== '—' ? e.limits : '', lim || ''].filter(Boolean).join(' ') || '—')} |\n`
const out = path.join(root, 'reports', 'chemlab-7.0', 'foundation', 'SCIENTIFIC_VALIDATION_MATRIX.md')
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, md)
console.log(`wrote ${path.relative(root, out)}: ${MANIFEST.length} entries`, JSON.stringify(count))
