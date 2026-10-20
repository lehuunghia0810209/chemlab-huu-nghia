// Exam catalog. Each entry is metadata; question data, when ChemLab may publish
// it, is a lazily imported paper module. Publication is gated here, in one place.
//
// Official papers below are inventoried with their sources, but their questions
// are NOT included: no permission to copy/redistribute them has been confirmed.
// See docs/exam/EXAM_SOURCES.md for how an owner can add a licensed paper.

export const FIXTURE_FLAG = 'chemlab-exam-fixtures'

export const EXAMS = Object.freeze([
  Object.freeze({
    id: 'tham-khao-2025-hoa',
    title: 'Đề thi tham khảo tốt nghiệp THPT từ năm 2025 — Hóa học',
    kind: 'official-reference',
    blueprint: 'thpt-2025-hoa',
    year: 2025,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT — Cục Quản lý chất lượng',
      url: 'https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/de-thi-tham-khao-ky-thi-tot-nghiep-thpt-tu-nam-2025-159.html',
      publishedAt: '2024-10-18'
    },
    license: 'pending',
    publication: 'metadata-only',
    note: 'Chưa xác minh quyền sao chép và đưa câu hỏi lên ChemLab; chỉ hiển thị liên kết đến nguồn.'
  }),
  Object.freeze({
    id: 'tot-nghiep-2025-hoa',
    title: 'Đề thi tốt nghiệp THPT năm 2025 — Hóa học',
    kind: 'official-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2025,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT (đáp án chính thức công bố 06/7/2025)',
      url: 'https://moet.gov.vn/tin-tuc/ky-thi-tot-nghiep-thpt-nam-2025',
      publishedAt: '2025-07-06'
    },
    license: 'pending',
    publication: 'metadata-only',
    note: 'Chưa tìm được bản gốc đề Hóa học kèm đáp án theo mã đề trên trang chính thức; chưa xác minh quyền sử dụng.'
  }),
  Object.freeze({
    id: 'minh-hoa-2025-hoa',
    title: 'Đề minh họa định dạng đề thi từ năm 2025 — Hóa học',
    kind: 'official-reference',
    blueprint: 'thpt-2025-hoa',
    year: 2025,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT — Cục Quản lý chất lượng',
      url: 'https://vqa.moet.gov.vn/vi/news/thong-bao/cau-truc-dinh-dang-de-thi-tot-nghiep-thpt-tu-nam-2025-74.html',
      publishedAt: '2023-12-29'
    },
    license: 'pending',
    publication: 'metadata-only',
    note: 'Đề minh họa định dạng (công bố trước khi có đề tham khảo 2025); chưa xác minh quyền sử dụng.'
  }),
  Object.freeze({
    id: 'tot-nghiep-2026-hoa',
    title: 'Đề thi tốt nghiệp THPT năm 2026 — Hóa học',
    kind: 'official-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT (đề thi, đáp án); bản đăng lại trên chinhphu.vn',
      url: 'https://xaydungchinhsach.chinhphu.vn/thi-tot-nghiep-thpt-2026-de-thi-mon-hoa-hoc-goi-y-dap-an-11926061210550049.htm',
      publishedAt: '2026-06'
    },
    license: 'pending',
    publication: 'metadata-only',
    note: 'Bản đăng lại dưới dạng ảnh; chưa xác minh quyền sử dụng và chưa số hóa.'
  }),
  Object.freeze({
    id: 'fixture-kiem-thu',
    title: 'Đề kiểm thử nội bộ (không phải đề chính thức)',
    kind: 'fixture',
    blueprint: 'thpt-2025-hoa',
    year: null,
    timeLimitMinutes: 15,
    source: null,
    license: 'internal-fixture',
    publication: 'fixture',
    note: 'Dữ liệu kiểm thử engine do ChemLab soạn; chỉ hiện khi bật chế độ kiểm thử.',
    load: () => import('./papers/fixture-kiem-thu.js')
  })
])

export function fixturesEnabled(storage = globalThis.localStorage) {
  try {
    return Boolean(import.meta.env?.DEV) || storage?.getItem(FIXTURE_FLAG) === '1'
  }
  catch {
    return false
  }
}

// The single publication gate: a paper is takeable only when ChemLab holds the
// rights and its transcription and answer key were verified.
export function isTakeable(entry, options = {}) {
  if (!entry?.load) return false
  if (entry.kind === 'fixture') return fixturesEnabled(options.storage)
  return entry.publication === 'published' &&
    entry.license === 'licensed' &&
    entry.verification?.transcription === 'verified' &&
    entry.verification?.answerKey === 'verified'
}

export function visibleExams(options = {}) {
  return EXAMS.filter(entry => entry.kind !== 'fixture' || fixturesEnabled(options.storage))
}

export function findExam(id) {
  return EXAMS.find(entry => entry.id === id) || null
}

export async function loadPaper(entry) {
  const module = await entry.load()
  return module.default
}
