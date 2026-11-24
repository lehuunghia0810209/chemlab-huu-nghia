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

**Kiểm thử:** mỗi mục có cột "Kiểm thử engine = có" được \`scripts/test-dlab.mjs\` chạy thật trên engine (bày dụng cụ, một thao tác, kiểm tra sản phẩm, không bịa khí hay lớp kim loại với mục Không phản ứng hoặc Chưa hỗ trợ, và kiểm tra bảo toàn chất). Thẻ "Khám phá" trong Sandbox lấy đúng ${DISCOVER.length} mục có kịch bản.

| Trạng thái | Số mục |
|---|---|
${order.map(s => `| ${STATUS[s]} (\`${s}\`) | ${MANIFEST.filter(e => e.status === s).length} |`).join('\n')}

`
for (const s of order) {
  const rows = MANIFEST.filter(e => e.status === s)
  if (!rows.length) continue
  md += `## ${STATUS[s]}\n\n| ID | Phản ứng / quá trình | Đầu vào | Điều kiện | Sản phẩm | Quan sát | Mô hình | Nguồn | Kiểm thử engine | Giới hạn |\n|---|---|---|---|---|---|---|---|---|---|\n`
  for (const e of rows) md += `| \`${cell(e.id)}\` | ${cell(e.title)} | ${cell(e.inputs)} | ${cell(e.conditions)} | ${cell(e.products)} | ${cell(e.observe)} | ${cell(e.model)} | ${cell(e.source)} | ${e.demo ? 'có' : 'không (xem test riêng)'} | ${cell(e.limits)} |\n`
  md += '\n'
}
await fs.mkdir(path.dirname(out), { recursive: true })
await fs.writeFile(out, md)
console.log(`wrote ${path.relative(root, out)}: ${MANIFEST.length} entries`)
