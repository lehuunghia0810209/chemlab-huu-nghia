// Shared metadata for lesson files, so every lesson states its sources and
// verification level the same way.
export const VERIFICATION = Object.freeze({
  level: 'internal',
  note: 'Biên soạn độc lập; phương trình, phép tính và đáp án được kiểm tra tự động, đối chiếu chương trình và tài liệu tham khảo. Chưa qua thẩm định của giáo viên hoặc chuyên gia độc lập.',
  date: '2026-10-19'
})

export const programme = topic => `Chương trình GDPT 2018 môn Hóa học — yêu cầu cần đạt mục “${topic}” (diễn đạt lại).`

export const textbook = (grade, number) => `SGK Hóa học ${grade}, Kết nối tri thức với cuộc sống — Bài ${number} (đối chiếu mục lục, nội dung biên soạn độc lập).`

export const ATOMIC_MASS_NOTE = 'Nguyên tử khối làm tròn theo quy ước thường dùng trong SGK và đề thi (H = 1, C = 12, O = 16, Na = 23, Cl = 35,5, Fe = 56, Cu = 64…).'
