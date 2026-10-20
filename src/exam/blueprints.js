// Exam blueprints (structure + scoring) per exam year. Exam scoring never reuses
// Practice rules: points are integers in hundredths so totals are exact.
//
// Sources checked 2026-10-20 (see docs/exam/EXAM_SOURCES.md):
// - Quyết định 764/QĐ-BGDĐT (08/3/2024): cấu trúc định dạng đề thi từ năm 2025.
// - Cục Quản lý chất lượng: “Cấu trúc định dạng đề thi tốt nghiệp THPT từ năm 2025”
//   (vqa.moet.gov.vn, 29/12/2023) and the 2025 reference papers (18/10/2024).
// - Bộ GD&ĐT (VnExpress, 04/02/2026): 2026 keeps the 2025 structure, no new sample paper.
// The point rules (Phần I 0,25; Phần II 0,1 / 0,25 / 0,5 / 1; Phần III 0,25) are
// printed on the answer-key pages of the official đề tham khảo 2025 and đề minh
// họa; the 4-column short-answer grid rests on secondary reports.

export const BLUEPRINTS = Object.freeze({
  'thpt-2025-hoa': Object.freeze({
    id: 'thpt-2025-hoa',
    title: 'Kỳ thi tốt nghiệp THPT — Hóa học (cấu trúc từ năm 2025)',
    appliesTo: [2025, 2026],
    note: 'Bộ GD&ĐT thông báo năm 2026 giữ ổn định cấu trúc năm 2025.',
    timeLimitMinutes: 50,
    maxPointsHundredths: 1000,
    // Structure and point rules confirmed by the official 2025 reference and
    // illustrative papers (both print the rules on their answer-key page).
    sourceStatus: 'primary-official-papers',
    parts: Object.freeze([
      Object.freeze({
        id: 'I',
        title: 'Phần I. Trắc nghiệm nhiều phương án lựa chọn',
        type: 'single',
        count: 18,
        instruction: 'Mỗi câu có 4 phương án, chỉ chọn một phương án.',
        pointsHundredths: 25
      }),
      Object.freeze({
        id: 'II',
        title: 'Phần II. Trắc nghiệm đúng sai',
        type: 'truefalse',
        count: 4,
        statements: 4,
        instruction: 'Mỗi câu có 4 ý a), b), c), d); ở mỗi ý chọn Đúng hoặc Sai.',
        // Points by number of statements answered correctly (0…4).
        tableHundredths: Object.freeze([0, 10, 25, 50, 100])
      }),
      Object.freeze({
        id: 'III',
        title: 'Phần III. Trắc nghiệm trả lời ngắn',
        type: 'short',
        count: 6,
        instruction: 'Ghi kết quả vào ô trả lời, tối đa 4 kí tự (chữ số, dấu “-”, dấu “,”).',
        pointsHundredths: 25,
        maxChars: 4
      })
    ])
  })
})

export function getBlueprint(id) {
  return BLUEPRINTS[id] || null
}

export function formatPoints(hundredths) {
  const value = hundredths / 100
  return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
