// Writes reports/chemlab-7.0/final/REACTION_SUPPORT_MANIFEST.md from src/dlab/data/manifest.js, so the report
// can never drift from what the engine claims. Usage: node scripts/dlab-manifest.mjs
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { MANIFEST, STATUS, DISCOVER } from '../src/dlab/data/manifest.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'reports', 'chemlab-7.0', 'final', 'REACTION_SUPPORT_MANIFEST.md')
const cell = v => String(v ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const order = ['SUPPORTED', 'APPROX', 'NO_REACTION', 'UNSUPPORTED', 'INVALID']
let md = `# ChemLab 7.0 Dynamic Lab — Reaction & Process Support Manifest

Sinh tự động từ \`src/dlab/data/manifest.js\` bằng \`node scripts/dlab-manifest.mjs\`. Bảng này là đúng những gì engine khẳng định mô phỏng; không có mục nào được viết tay riêng cho báo cáo.

**Kiểm chứng:**
- "Kịch bản trên engine": \`scripts/test-dlab.mjs\` chạy thật mục đó trên engine. Test bày dụng cụ, thực hiện một thao tác, rồi kiểm tra sản phẩm (hoặc lời báo "Chưa hỗ trợ"). Với mục Không phản ứng hoặc Chưa hỗ trợ, test còn kiểm tra engine không bịa ra khí hay lớp kim loại, và kiểm tra bảo toàn chất.
- "Unit test riêng": mục được kiểm bởi test có tên ghi trong cột "Kiểm chứng". Test manifest đối chiếu để chắc các test đó tồn tại.
- "Chưa kiểm chứng": mục chỉ có trong bảng, chưa có test chạy thật.

Thẻ "Khám phá" trong Sandbox lấy đúng ${DISCOVER.length} mục mô hình hóa có kịch bản.

| Trạng thái | Số mục | Kịch bản trên engine | Unit test riêng | Chưa kiểm chứng |
|---|---|---|---|---|
${order.map(s => { const r = MANIFEST.filter(e => e.status === s); return `| ${STATUS[s]} (\`${s}\`) | ${r.length} | ${r.filter(e => e.demo).length} | ${r.filter(e => !e.demo && e.tests?.length).length} | ${r.filter(e => !e.demo && !e.tests?.length).length} |` }).join('\n')}

`
for (const s of order) {
  const rows = MANIFEST.filter(e => e.status === s)
  if (!rows.length) continue
  md += `## ${STATUS[s]}\n\n| ID | Phản ứng / quá trình | Đầu vào | Điều kiện | Sản phẩm | Quan sát | Mô hình | Nguồn | Kiểm chứng | Giới hạn |\n|---|---|---|---|---|---|---|---|---|---|\n`
  for (const e of rows) {
    const verified = e.demo ? 'kịch bản trên engine' : e.tests?.length ? `unit test: ${e.tests.map(t => `“${cell(t)}…”`).join(', ')}` : '**chưa kiểm chứng**'
    md += `| \`${cell(e.id)}\` | ${cell(e.title)} | ${cell(e.inputs)} | ${cell(e.conditions)} | ${cell(e.products)} | ${cell(e.observe)} | ${cell(e.model)} | ${cell(e.source)} | ${verified} | ${cell(e.limits)} |\n`
  }
  md += '\n'
}
await fs.mkdir(path.dirname(out), { recursive: true })
await fs.writeFile(out, md)
console.log(`wrote ${path.relative(root, out)}: ${MANIFEST.length} entries`)
