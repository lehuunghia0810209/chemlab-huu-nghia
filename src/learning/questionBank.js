// Question bank: one module per chapter in ./questions/<chapterId>.js,
// loaded on demand. Each module exports `questions` (and optionally SOURCE);
// grade/chapterId are filled in from the catalog so files only name lessonId.
import { GRADES, findLesson } from './catalog.js'

// Chapters whose question file exists. Add an ID with its file.
export const QUESTION_CHAPTERS = new Set([
  'g10-c1', 'g10-c2', 'g10-c3', 'g10-c4', 'g10-c5', 'g10-c6', 'g10-c7',
  'g11-c1', 'g11-c2', 'g11-c3', 'g11-c4', 'g11-c5', 'g11-c6',
  'g12-c1', 'g12-c2', 'g12-c3', 'g12-c4', 'g12-c5', 'g12-c6'
])

const DEFAULT_SOURCE = 'ChemLab — biên soạn theo Chương trình GDPT 2018 và SGK Hóa học Kết nối tri thức với cuộc sống'

const cache = new Map()

export function chapterHasQuestions(chapterId) {
  return QUESTION_CHAPTERS.has(chapterId)
}

export function loadChapterQuestions(chapterId) {
  if (!QUESTION_CHAPTERS.has(chapterId)) return Promise.resolve([])
  if (!cache.has(chapterId)) {
    const promise = import(`./questions/${chapterId}.js`).then(module => module.questions.map(question => {
      const entry = findLesson(question.lessonId)
      return Object.freeze({
        source: module.SOURCE || DEFAULT_SOURCE,
        verificationStatus: 'internal',
        ...question,
        grade: entry?.grade.grade ?? null,
        chapterId: entry?.chapter.id ?? null
      })
    }))
    // A failed load (offline chunk) must be retryable.
    promise.catch(() => cache.delete(chapterId))
    cache.set(chapterId, promise)
  }
  return cache.get(chapterId)
}

export async function loadQuestions({ grade = null, chapterId = null, lessonId = null } = {}) {
  let chapterIds
  if (lessonId) chapterIds = [findLesson(lessonId)?.chapter.id].filter(Boolean)
  else if (chapterId) chapterIds = [chapterId]
  else {
    chapterIds = GRADES
      .filter(item => grade === null || item.grade === Number(grade))
      .flatMap(item => item.chapters.map(chapter => chapter.id))
  }
  const lists = await Promise.all(chapterIds.map(loadChapterQuestions))
  const all = lists.flat()
  return lessonId ? all.filter(question => question.lessonId === lessonId) : all
}

export async function loadQuestionsById(ids) {
  const wanted = new Set(ids)
  const chapterIds = new Set()
  for (const id of wanted) {
    const lessonId = id.replace(/-q\d+$/, '')
    const chapter = findLesson(lessonId)?.chapter.id
    if (chapter) chapterIds.add(chapter)
  }
  const lists = await Promise.all([...chapterIds].map(loadChapterQuestions))
  const byId = new Map(lists.flat().map(question => [question.id, question]))
  return ids.map(id => byId.get(id)).filter(Boolean)
}
