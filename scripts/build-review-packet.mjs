// Builds docs/review/TEACHER_REVIEW_PACKET_6.5.md from the published exam
// papers, so a teacher can review keys, ChemLab solutions and flagged items in
// one document. Statuses are never raised here: every item starts as
// TEACHER REVIEW PENDING and only a human reviewer may change it in the register.
// usage: node scripts/build-review-packet.mjs
import fs from 'node:fs'
import { EXAMS, isTakeable, loadPaper } from '../src/exam/catalog.js'

const KIND = {
  'official-reference': 'Đề tham khảo / minh họa của Bộ GD&ĐT',
  'official-exam': 'Đề thi chính thức của Bộ GD&ĐT',
  'provincial-exam': 'Đề khảo sát của Sở GD&ĐT',
  'teacher-practice': 'Đề ôn luyện do giáo viên biên soạn'
}
// Items the implementing agent flagged for priority review (see the paper checklists).
const FLAGS = {
  'tn25-ii4': 'Đã sửa lỗi đánh máy của bản docx: “g L⁻¹” → “g mL⁻¹”. Cần đối chiếu bản in gốc.',
  'tn25-iii4': 'Đã sửa lỗi đánh máy: hàng “CH₃CH₂CH₃(g)” → “CH₃CH₂CH₂CH₃(g)” (butane). Cần đối chiếu bản in gốc.',
  'tn25-iii2': 'Hình peptide trong nguồn có độ phân giải thấp (258×70 px).',
  'tn25-2': 'Hình phức chất trong nguồn có độ phân giải thấp.',
  'dtt5-7': 'Đề gọi CO₂ là khí độc; xem lại phát biểu và lời giải.',
  'dtt5-15': 'Đáp án tác giả coi histidine (pI 7,64) gần như không di chuyển ở pH 7,0 — cách hiểu gần đúng.',
  'dtt6-2': 'Đề dùng kí hiệu Δr cho nhiệt tạo thành CO₂.',
  'dtt6-ii3': 'Ý a) nhắc tới hình minh họa không có trong đề gốc.'
}
const BLOCKED = [
  ['dtt-2026-de-4', 'III.6', 'Vitamin C trong viên sủi: n(I₂) = 8,5·10⁻⁵ mol/10 mL ⇒ 0,1496 g', 'Tác giả ghi 149; làm tròn đến hàng đơn vị là 150', 'Xác nhận đáp án 150 (hoặc giữ 149 nếu đề định làm tròn xuống)'],
  ['dtt-2026-de-4', 'III.5', 'CH₄ cho 1,00 tấn NH₃, hiệu suất chuyển hóa 95%, 80% nhiệt từ phản ứng đốt', 'Tác giả cấp nhiệt cho cả phần CH₄ không chuyển hóa ⇒ 0,66; chỉ phần chuyển hóa ⇒ 0,65', 'Chọn một cách hiểu và sửa lời dẫn cho rõ'],
  ['dtt-2026-de-4', 'I.7', 'Cháy PMMA: “(c) dùng cát dập lửa” được coi là sai', 'Cát là biện pháp dập đám cháy nhỏ thông dụng', 'Xem lại đáp án D'],
  ['dtt-2026-de-2', 'III.5', 'Than cốc cho 5,00 tấn CO, hiệu suất 85%, 90% nhiệt', 'Cùng tranh chấp như trên: 3,62 hay 3,46', 'Chọn cách hiểu, sửa lời dẫn'],
  ['dtt-2026-de-2', 'I.11', 'Ứng dụng của aniline', 'Phương án A và D trùng chữ', 'Tác giả sửa phương án'],
  ['dtt-2026-de-2', 'I.2', 'Cấu hình [Ar]4s¹', 'Lời dẫn ghi “nguyên tử ca” rồi “nguyên tố K”', 'Sửa lời dẫn'],
  ['dtt-2026-de-3', 'III.1', 'Sắp xếp phát biểu đúng về ứng dụng của N và hợp chất', 'Phát biểu (4) HNO₃ trong xử lí nước thải và (5) “sodium nitrate” trong rau không kiểm chứng được từ chương trình', 'Giáo viên xác nhận từng phát biểu']
]

const cell = text => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ')
const plain = content => (Array.isArray(content) ? content : [{ type: 'p', text: content }])
  .map(block => block.type === 'figure' ? `[Hình: ${block.alt}]` : block.type === 'table' ? `[Bảng: ${block.head.join(' / ')}]` : block.type === 'list' ? block.items.join(' ') : block.text)
  .join(' ').replace(/\*\*/g, '').replace(/_\{([^}]*)\}/g, '$1').replace(/\^\{([^}]*)\}/g, '$1')
const key = (question, part) => part === 'II' ? Object.entries(question.answer).map(([id, value]) => `${id}${value ? 'Đ' : 'S'}`).join(' ') : question.answer

const papers = []
for (const entry of EXAMS.filter(item => item.kind !== 'fixture' && isTakeable(item))) papers.push([entry, await loadPaper(entry)])
const total = papers.reduce((sum, [, paper]) => sum + paper.sections.reduce((n, section) => n + section.questions.length, 0), 0)

const lines = [
  '# Hồ sơ thẩm định giáo viên — đề thi ChemLab 6.5',
  '',
  `Tạo tự động bằng \`node scripts/build-review-packet.mjs\` từ dữ liệu đề. ${papers.length} đề, ${total} câu. Đề, đáp án lấy từ đơn vị ra đề (hoặc tác giả đề ôn); **lời giải và phân loại chương do ChemLab biên soạn**. Mọi mục đang ở trạng thái **TEACHER REVIEW PENDING**. Không ai được ghi “TEACHER VERIFIED” ngoài giáo viên thẩm định thật, ghi vào \`docs/learning/TEACHER_REVIEW_REGISTER.md\`.`,
  '',
  'Trạng thái dùng trong hồ sơ: NOT REVIEWED · AUTOMATED VERIFIED (kiểm thử tự động và agent đã giải lại) · TEACHER REVIEW PENDING · TEACHER VERIFIED · NEEDS CORRECTION.',
  '',
  '## 1. Ưu tiên xem trước',
  '',
  '| Mã câu | Lí do |',
  '| --- | --- |',
  ...Object.entries(FLAGS).map(([id, reason]) => `| \`${id}\` | ${cell(reason)} |`),
  '',
  '## 2. Ba đề DTT đang bị chặn (không phát hành)',
  '',
  '| Đề | Câu | Dữ kiện | Vấn đề | Đề xuất | Người xác nhận |',
  '| --- | --- | --- | --- | --- | --- |',
  ...BLOCKED.map(row => `| \`${row[0]}\` | ${row.slice(1).map(cell).join(' | ')} | Giáo viên Hóa học hoặc tác giả đề (ThS. Dương Thành Tính) |`),
  '',
  '## 3. Từng đề',
  ''
]
for (const [entry, paper] of papers) {
  lines.push(`### ${paper.title}`, '', `\`${paper.id}\` · ${KIND[paper.kind]} · đáp án: ${paper.answerKey === 'author' ? 'của tác giả đề' : 'chính thức của đơn vị ra đề'} · checklist: \`docs/exam/papers/${paper.id}.md\``, '')
  if (paper.editorialNote) lines.push(`> Ghi chú biên tập: ${paper.editorialNote}`, '')
  lines.push('| Câu | Tóm tắt đề | Đáp án | Chương | Lời giải ChemLab | Trạng thái |', '| --- | --- | --- | --- | --- | --- |')
  for (const section of paper.sections) {
    section.questions.forEach((question, index) => {
      const summary = plain(question.content).slice(0, 140)
      const flag = FLAGS[question.id] ? ' ⚑' : ''
      lines.push(`| ${section.part}.${index + 1}${flag} | ${cell(summary)}… | ${cell(key(question, section.part))} | ${question.meta.chapters.join(', ')} | ${cell(question.solution.text)} | TEACHER REVIEW PENDING |`)
    })
  }
  lines.push('')
}
lines.push('## 4. Ngoài đề thi', '', '- 78 bài Learning và 537 câu Practice: ưu tiên theo `docs/learning/TEACHER_REVIEW_REGISTER.md` (câu tính toán, mục trong `CONTENT_VERIFICATION.md`).', '- 3 rubric tự luận: `src/learning/rubrics.js` (tiêu chí và lỗi nghiêm trọng điều khiển nhận xét AI).', '')

fs.mkdirSync(new URL('../docs/review/', import.meta.url), { recursive: true })
fs.writeFileSync(new URL('../docs/review/TEACHER_REVIEW_PACKET_6.5.md', import.meta.url), lines.join('\n'))
console.log(`Wrote docs/review/TEACHER_REVIEW_PACKET_6.5.md — ${papers.length} papers, ${total} questions, ${Object.keys(FLAGS).length} flagged items, ${BLOCKED.length} blocked items.`)
