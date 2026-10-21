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
    title: 'Đề minh họa định dạng đề thi từ năm 2025 — Hóa học (đề kiểm tra lớp 10)',
    kind: 'official-reference',
    blueprint: 'thpt-2025-hoa',
    year: 2025,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT — Cục Quản lý chất lượng',
      url: 'https://vqa.moet.gov.vn/vi/news/thong-bao/cau-truc-dinh-dang-de-thi-tot-nghiep-thpt-tu-nam-2025-74.html',
      documentUrl: 'https://drive.google.com/file/d/1ZuXbhxvdamaPrvcr1JuSpnZeVWMcndQn/view',
      publishedAt: '2023-12-29'
    },
    rights: OWNER,
    answerKey: 'official',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề minh họa định dạng mới, dùng nội dung lớp 10. Đề và đáp án lấy từ tệp chính thức; lời giải tham khảo do ChemLab biên soạn.',
    load: () => import('./papers/minh-hoa-2025-hoa.js')
  }),
  Object.freeze({
    id: 'dong-nai-2026-l1-0301',
    title: 'Đề khảo sát chất lượng tốt nghiệp THPT 2026 lần 1 — Sở GD&ĐT Đồng Nai — Hóa học (ca 1, mã đề 0301)',
    kind: 'provincial-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'Sở GD&ĐT Đồng Nai', publishedAt: '2026-04' },
    rights: OWNER,
    answerKey: 'official',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề và đáp án (bảng đáp án của Sở) do chủ dự án cung cấp. Ca 1 có 24 mã đề hoán vị cùng một bộ câu hỏi; ChemLab dùng mã 0301.',
    load: () => import('./papers/dong-nai-2026-l1-0301.js')
  }),
  Object.freeze({
    id: 'dong-nai-2026-l1-0325',
    title: 'Đề khảo sát chất lượng tốt nghiệp THPT 2026 lần 1 — Sở GD&ĐT Đồng Nai — Hóa học (ca 2, mã đề 0325)',
    kind: 'provincial-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'Sở GD&ĐT Đồng Nai', publishedAt: '2026-04' },
    rights: OWNER,
    answerKey: 'official',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề và đáp án (bảng đáp án của Sở) do chủ dự án cung cấp. Ca 2 là đề khác ca 1, có 24 mã đề hoán vị; ChemLab dùng mã 0325.',
    load: () => import('./papers/dong-nai-2026-l1-0325.js')
  }),
  Object.freeze({
    id: 'tot-nghiep-2025-hoa',
    title: 'Đề thi tốt nghiệp THPT năm 2025 — Hóa học (mã đề 0338)',
    kind: 'official-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2025,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT — Kỳ thi tốt nghiệp THPT năm 2025',
      url: 'https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/cong-bo-dap-an-cac-mon-thi-cua-ky-thi-tot-nghiep-thpt-2025-208.html',
      publishedAt: '2025-06'
    },
    rights: OWNER,
    answerKey: 'official',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề mã 0338 từ tệp do chủ dự án cung cấp; đáp án đối chiếu đủ 28/28 với đáp án chính thức của Bộ cho mã 0338. Lời giải tham khảo do ChemLab biên soạn.',
    load: () => import('./papers/tot-nghiep-2025-hoa.js')
  }),
  Object.freeze({
    id: 'tot-nghiep-2026-hoa',
    title: 'Đề thi tốt nghiệp THPT năm 2026 — Hóa học (mã đề 0330)',
    kind: 'official-exam',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: {
      authority: 'Bộ GD&ĐT — Kỳ thi tốt nghiệp THPT năm 2026',
      url: 'https://moet.gov.vn/tin-tuc/tin-tong-hop2/cong-bo-dap-an-cac-mon-thi-cua-ky-thi-tot-nghiep-thpt-2026.html',
      publishedAt: '2026-06'
    },
    rights: OWNER,
    answerKey: 'official',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề mã 0330 từ tệp do chủ dự án cung cấp; đáp án đối chiếu đủ 28/28 với đáp án chính thức của Bộ công bố ngày 19/6/2026. Lời giải tham khảo do ChemLab biên soạn.',
    load: () => import('./papers/tot-nghiep-2026-hoa.js')
  }),
  Object.freeze({
    id: 'dtt-2026-de-5',
    title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 5 (ThS. Dương Thành Tính) — Hóa học',
    kind: 'teacher-practice',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026', file: { name: 'DE 5 ON TN.THPT 2026 - DTT.pdf', sha256: '4de752a6e7b59c38da6ec931deaf130c93dc34d355b62124d233e3fd86bc4d6d' } },
    rights: OWNER,
    answerKey: 'author',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề ôn luyện do giáo viên biên soạn, không phải đề chính thức. Đáp án của tác giả, ChemLab đã giải lại đủ 28 câu để đối chiếu.',
    load: () => import('./papers/dtt-2026-de-5.js')
  }),
  Object.freeze({
    id: 'dtt-2026-de-6',
    title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 6 (ThS. Dương Thành Tính) — Hóa học',
    kind: 'teacher-practice',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026', file: { name: 'DE 6 ON TN.THPT 2026 - DTT.pdf', sha256: '21e92283bc8e1b3debc94567ae3fe491da58f876fdf9dfc6f2cbe39d117f5f14' } },
    rights: OWNER,
    answerKey: 'author',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED', 'CONTENT_TRANSCRIBED', 'ANSWER_KEY_VERIFIED', 'SCORING_VERIFIED', 'UI_TESTED']),
    note: 'Đề ôn luyện do giáo viên biên soạn, không phải đề chính thức. Đáp án của tác giả, ChemLab đã giải lại đủ 28 câu để đối chiếu.',
    load: () => import('./papers/dtt-2026-de-6.js')
  }),
  Object.freeze({
    id: 'dtt-2026-de-4',
    title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 4 (ThS. Dương Thành Tính) — Hóa học',
    kind: 'teacher-practice',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026', file: { name: 'DE 4 ON TN.THPT 2026 - DTT.pdf', sha256: '9fbc7ace4cbea08b2a0540f773e60a7cbe22c6a0d241ec3bfb700fbbfbcd19a4' } },
    rights: OWNER,
    answerKey: 'author',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED']),
    note: 'Chưa sẵn sàng: đáp án của tác giả mâu thuẫn với phép giải độc lập ở Phần III câu 5 (0,66 so với 0,65) và câu 6 (149 mg, trong khi 149,6 mg làm tròn là 150). Chờ chủ dự án hoặc giáo viên quyết định.',
  }),
  Object.freeze({
    id: 'dtt-2026-de-2',
    title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 2 (ThS. Dương Thành Tính) — Hóa học',
    kind: 'teacher-practice',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026', file: { name: 'DE 2 ON TN.THPT 2026 - DTT.docx', sha256: '9e12785bd8a0d5693a3d2510bd95d276e94980ba8caa8ebaf3862b16d15d72ee' } },
    rights: OWNER,
    answerKey: 'author',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED']),
    note: 'Chưa sẵn sàng: Phần III câu 5 có đáp án 3,62 phụ thuộc cách tính nhiệt cho phần carbon không chuyển hóa (cách khác cho 3,46); Phần I câu 11 có hai phương án A và D trùng nhau; câu 2 nhầm tên nguyên tố. Chờ chủ dự án hoặc giáo viên quyết định.',
  }),
  Object.freeze({
    id: 'dtt-2026-de-3',
    title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 3 (ThS. Dương Thành Tính) — Hóa học',
    kind: 'teacher-practice',
    blueprint: 'thpt-2025-hoa',
    year: 2026,
    timeLimitMinutes: 50,
    source: { authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026', file: { name: 'DE 3 ON TN.THPT 2026 - DTT.docx', sha256: 'ba54e0a93f932a40826f49ca4596e17f904890deb72821ef6c2fcca183b7de8f' } },
    rights: OWNER,
    answerKey: 'author',
    states: Object.freeze(['SOURCE_VERIFIED', 'OWNER_ATTESTED']),
    note: 'Chưa sẵn sàng: Phần III câu 1 dựa trên các phát biểu thực tế (ứng dụng của nitric acid, nitrate trong rau) mà ChemLab chưa kiểm chứng độc lập được; cần giáo viên xác nhận.',
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
