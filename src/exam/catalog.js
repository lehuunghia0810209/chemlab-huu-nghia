// Exam catalog: one metadata entry per paper; questions, when published, are a
// lazily imported paper module. Publication is gated here, in one place.
//
// Rights: the project owner has attested that ChemLab may use these papers
// (authorization basis `owner_attestation`). The licence documents are private
// and were not seen by the agent, so rights are recorded as OWNER_ATTESTED, not
// as independently verified. A paper becomes takeable only when every state in
// REQUIRED_STATES is reached; see docs/exam/EXAM_SOURCES.md.

export const FIXTURE_FLAG = 'chemlab-exam-fixtures'

export const STATES = Object.freeze({
  SOURCE_VERIFIED: 'Nguồn đã xác minh',
  OWNER_ATTESTED: 'Chủ dự án xác nhận quyền sử dụng',
  CONTENT_TRANSCRIBED: 'Đã số hóa và đối chiếu từng câu',
  ANSWER_KEY_VERIFIED: 'Đáp án đã đối chiếu',
  SCORING_VERIFIED: 'Cách chấm đã kiểm thử',
  UI_TESTED: 'Đã kiểm thử giao diện',
  READY_FOR_OWNER_RELEASE: 'Sẵn sàng chờ chủ dự án phát hành'
})

export const REQUIRED_STATES = Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED'])

const OWNER = Object.freeze({ basis: 'owner_attestation', status: 'OWNER_ATTESTED', documentSeenByAgent: false })

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
      documentUrl: 'https://drive.google.com/file/d/1VVZQh1X5W55cqg9AY43iqR5kP0exvkYu/view',
      publishedAt: '2024-10-18'
    },
    rights: OWNER,
    answerKey: 'official',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề và đáp án lấy từ tệp chính thức do Cục Quản lý chất lượng công bố. Lời giải là lời giải tham khảo do ChemLab biên soạn.',
    load: () => import('./papers/tham-khao-2025-hoa.js')
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
    rights: OWNER,
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED']),
    note: 'Chưa số hóa. Đề minh họa định dạng công bố trước khi có đề tham khảo 2025.'
  }),
  Object.freeze({
    id: 'tot-nghiep-2025-hoa',
    title: 'Đề thi tốt nghiệp THPT năm 2025 — Hóa học',
    kind: 'official-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2025,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT — Cục Quản lý chất lượng (công bố đáp án)',
      url: 'https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/cong-bo-dap-an-cac-mon-thi-cua-ky-thi-tot-nghiep-thpt-2025-208.html',
      publishedAt: '2025-07'
    },
    rights: OWNER,
    states: Object.freeze(['OWNER_ATTESTED']),
    note: 'Chưa số hóa: chưa có bản đề gốc kèm mã đề khớp với đáp án chính thức.'
  }),
  Object.freeze({
    id: 'tot-nghiep-2026-hoa',
    title: 'Đề thi tốt nghiệp THPT năm 2026 — Hóa học',
    kind: 'official-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bản đăng lại trên chinhphu.vn (ảnh của Báo Giáo dục và Thời đại)',
      url: 'https://xaydungchinhsach.chinhphu.vn/thi-tot-nghiep-thpt-2026-de-thi-mon-hoa-hoc-goi-y-dap-an-11926061210550049.htm',
      publishedAt: '2026-06'
    },
    rights: OWNER,
    states: Object.freeze(['OWNER_ATTESTED']),
    note: 'Chưa số hóa: nguồn hiện có là bản đăng lại, chưa đối chiếu được với bản gốc của Bộ.'
  }),
  Object.freeze({
    id: 'fixture-kiem-thu',
    title: 'Đề kiểm thử nội bộ (không phải đề chính thức)',
    kind: 'fixture',
    blueprint: 'thpt-2025-hoa',
    year: null,
    timeLimitMinutes: 15,
    source: null,
    rights: null,
    states: Object.freeze([]),
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

export function stateList(entry) {
  const states = [...(entry?.states || [])]
  if (REQUIRED_STATES.every(state => states.includes(state))) states.push('READY_FOR_OWNER_RELEASE')
  return states
}

// The single publication gate.
export function isTakeable(entry, options = {}) {
  if (!entry?.load) return false
  if (entry.kind === 'fixture') return fixturesEnabled(options.storage)
  return stateList(entry).includes('READY_FOR_OWNER_RELEASE')
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
