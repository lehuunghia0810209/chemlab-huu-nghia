// Learning catalog: Grade → Chapter → Lesson for the core (non-elective)
// Hóa học 10–12 programme. Built on the Lab's CURRICULUM so lesson IDs stay
// the ones stored in users' progress; adds what the Lab list cannot hold
// (lessons without a guided activity, full official titles, content status).
import { CURRICULUM } from '../lab/experiments/curriculum.js'
import { getExperimentsForLesson } from '../lab/experiments/experiments.js'

export const CURRICULUM_SOURCES = [
  {
    id: 'ct-2018',
    title: 'Chương trình giáo dục phổ thông môn Hóa học',
    reference: 'Ban hành kèm Thông tư 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ GD&ĐT',
    note: 'Thông tư 13/2022/TT-BGDĐT (03/8/2022) sửa đổi một số nội dung của Chương trình GDPT 2018; chưa tìm thấy thay đổi nào với nội dung môn Hóa học.'
  },
  {
    id: 'sgk-kntt',
    title: 'SGK Hóa học 10, 11, 12 — bộ Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)',
    reference: 'Quyết định 3588/QĐ-BGDĐT ngày 26/12/2025 chọn bộ sách này để sử dụng thống nhất toàn quốc từ năm học 2026–2027',
    note: 'Mục lục được đối chiếu với các bản liệt kê công khai (VietJack, Lời giải hay, kế hoạch dạy học của trường), chưa đối chiếu trực tiếp với sách in.'
  }
]

// Full titles as printed in the KNTT table of contents where the Lab list shortens them.
const OFFICIAL_TITLES = {
  'g10-c2': 'Bảng tuần hoàn các nguyên tố hóa học và định luật tuần hoàn',
  'g10-l6': 'Xu hướng biến đổi một số tính chất của nguyên tử các nguyên tố trong một chu kì và trong một nhóm',
  'g10-l7': 'Xu hướng biến đổi thành phần và một số tính chất của hợp chất trong một chu kì',
  'g10-l8': 'Định luật tuần hoàn. Ý nghĩa của bảng tuần hoàn các nguyên tố hóa học',
  'g10-l22': 'Hydrogen halide. Muối halide',
  'g11-c2': 'Nitrogen và sulfur',
  'g11-l5': 'Ammonia. Muối ammonium',
  'g11-c3': 'Đại cương về hóa học hữu cơ',
  'g11-c5': 'Dẫn xuất halogen – Alcohol – Phenol',
  'g11-c6': 'Hợp chất carbonyl – Carboxylic acid',
  'g12-c1': 'Ester – Lipid',
  'g12-l1': 'Ester – Lipid',
  'g12-c7': 'Nguyên tố nhóm IA và nhóm IIA',
  'g12-c8': 'Sơ lược về dãy kim loại chuyển tiếp thứ nhất và phức chất'
}

// Lessons in the textbook that the Lab curriculum does not list (no guided activity yet).
const EXTRA_LESSONS = {
  'g10-c7': [{ id: 'g10-l23', number: 23, title: 'Ôn tập chương 7', type: 'challenge' }]
}

export const STATUS = {
  published: { label: 'Bài học đầy đủ', description: 'Đã biên soạn đủ các bước học, ví dụ và kiểm tra nhanh.' },
  legacy: { label: 'Bản rút gọn', description: 'Nội dung ngắn từ phiên bản trước, chưa chuyển đổi đầy đủ.' },
  draft: { label: 'Đang biên soạn', description: 'Nội dung đang được viết, chưa sẵn sàng.' },
  catalogued: { label: 'Chưa có nội dung', description: 'Đã có trong danh mục chương trình, nội dung sẽ được bổ sung.' }
}

// Lessons with full content in ./lessons/<id>.js, loaded on demand.
// Add an ID here when its file passes `npm run check:learning`.
export const FULL_LESSONS = new Set([
  'g10-l1', 'g10-l2', 'g10-l3', 'g10-l4',
  'g10-l5', 'g10-l6', 'g10-l7', 'g10-l8', 'g10-l9',
  'g11-l1',
  'g12-l15'
])

function buildGrade(source) {
  const chapters = source.chapters.map(chapter => {
    const lessons = [...chapter.lessons, ...(EXTRA_LESSONS[chapter.id] || [])]
      .sort((a, b) => a.number - b.number)
      .map(lesson => {
        const activities = getExperimentsForLesson(lesson.id)
        return {
          id: lesson.id,
          grade: source.grade,
          chapterId: chapter.id,
          number: lesson.number,
          title: OFFICIAL_TITLES[lesson.id] || lesson.title,
          type: lesson.type,
          review: lesson.type === 'challenge',
          status: FULL_LESSONS.has(lesson.id) ? 'published' : activities.length ? 'legacy' : 'catalogued',
          activityIds: activities.map(activity => activity.id),
          sourceId: 'sgk-kntt'
        }
      })
    return {
      id: chapter.id,
      grade: source.grade,
      number: chapter.number,
      title: OFFICIAL_TITLES[chapter.id] || chapter.title,
      lessons
    }
  })
  return { grade: source.grade, title: source.title, subtitle: source.subtitle, chapters }
}

export const GRADES = Object.freeze([10, 11, 12].map(grade => buildGrade(CURRICULUM[grade])))

const LESSON_INDEX = new Map()
for (const grade of GRADES) {
  for (const chapter of grade.chapters) {
    for (const lesson of chapter.lessons) LESSON_INDEX.set(lesson.id, { lesson, chapter, grade })
  }
}

export function getGrade(grade) {
  return GRADES.find(item => item.grade === Number(grade)) || null
}

export function findLesson(lessonId) {
  return LESSON_INDEX.get(lessonId) || null
}

export function allLessons() {
  return [...LESSON_INDEX.values()].map(entry => entry.lesson)
}

export function hasFullContent(lessonId) {
  return FULL_LESSONS.has(lessonId)
}

export async function loadLessonContent(lessonId) {
  if (!FULL_LESSONS.has(lessonId)) return null
  const module = await import(`./lessons/${lessonId}.js`)
  return module.default
}
