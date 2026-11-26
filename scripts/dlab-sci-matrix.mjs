// ChemLab 7.0 — Scientific Validation Matrix generator. The validation status of each manifest entry is a reviewed
// judgement recorded HERE (not in product code), with the evidence that supports it. Default: UNVERIFIED.
// Usage: node scripts/dlab-sci-matrix.mjs → reports/chemlab-7.0/foundation/SCIENTIFIC_VALIDATION_MATRIX.md
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANIFEST } from '../src/dlab/data/manifest.js'
import { validationOf } from '../src/dlab/data/validation.js'
const SV = 'scripts/dlab-sci-validate.mjs'
const G1 = 'scripts/test-dlab.mjs "gate 1: every manifest scenario conserves elements"'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const esc = s => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const rows = MANIFEST.map(e => { const [st, ev, cons, lim] = validationOf(e); return { e, st, ev, cons, lim } })
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
