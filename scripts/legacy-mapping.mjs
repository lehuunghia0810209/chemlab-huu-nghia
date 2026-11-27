// ChemLab 7.1: inventory of the curriculum lessons (src/lab/experiments) and their dynamic-library twins (src/labShell.js).
// Writes reports/chemlab-7.1/LEGACY_MAPPING.md and fails if a mapped target does not exist in the library.
import fs from 'node:fs/promises'
import { EXPERIMENTS as LESSONS } from '../src/lab/experiments/experiments.js'
import { EXPERIMENTS } from '../src/dlab/data/experiments.js'
import { experimentValidation } from '../src/dlab/data/experiments.js'

const shell = await fs.readFile(new URL('../src/labShell.js', import.meta.url), 'utf8')
const MAP = Object.fromEntries([...shell.matchAll(/^\s+'([\w-]+)': '(exp-[\w-]+)'/gm)].map(m => [m[1], m[2]]))
const LAB = new Set(['add', 'heat', 'reaction', 'temperature', 'indicator'])
const wet = LESSONS.filter(e => (e.steps || []).some(s => LAB.has(s.type)))
const bad = Object.entries(MAP).filter(([, t]) => !EXPERIMENTS.some(e => e.id === t))
const rows = wet.map(e => {
  const t = MAP[e.id]
  const x = t && EXPERIMENTS.find(y => y.id === t)
  return `| ${e.id} | ${e.grade} | ${e.title} | ${(e.chemicals || []).join(' + ')} | ${x ? `${x.id} — ${x.title} (${experimentValidation(x)})` : '— (chỉ bàn minh họa của bài học)'} |`
})
const md = `# ChemLab 7.1: bài học cũ và thí nghiệm động tương ứng

Tạo bởi \`node scripts/legacy-mapping.mjs\`. Phòng thí nghiệm gốc có ${LESSONS.length} bài theo chương trình (kiến thức, câu hỏi, lưu tiến độ); ${wet.length} bài có bước thao tác hóa chất. Tất cả ${LESSONS.length} bài được giữ nguyên trong "Có hướng dẫn → Bài học theo chương trình lớp 10–12".

- ${wet.filter(e => MAP[e.id]).length}/${wet.length} bài có thao tác hóa chất đã có thí nghiệm động tương ứng (nút "Làm trên bàn thí nghiệm").
- ${wet.filter(e => !MAP[e.id]).length} bài (chủ yếu hóa hữu cơ: anken + nước brom, glixerol, phenol, este, glucozơ, protein; khí NH₃, SO₂) chưa có mô hình động; bước thao tác dùng bàn minh họa của bài học, có ghi nhãn "minh họa theo kịch bản", không phải mô phỏng định lượng.
- Chế độ "Tự do" cũ (một cốc, phản ứng tra bảng) không còn là một phòng thí nghiệm riêng: bàn tự do duy nhất là bàn mô phỏng động.

| Bài cũ | Lớp | Tên | Hóa chất | Thí nghiệm động (mức kiểm chứng) |
|---|---|---|---|---|
${rows.join('\n')}
`
await fs.mkdir(new URL('../reports/chemlab-7.1/', import.meta.url), { recursive: true })
await fs.writeFile(new URL('../reports/chemlab-7.1/LEGACY_MAPPING.md', import.meta.url), md)
console.log(`lessons ${LESSONS.length}, with lab steps ${wet.length}, mapped ${wet.filter(e => MAP[e.id]).length}, bad targets ${bad.length}`)
if (bad.length) { console.error(bad); process.exit(1) }
