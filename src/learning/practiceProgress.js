// Practice results inside chemlab-v1-progress → learning.practice, plus the
// in-progress session under its own key so a reload resumes it.
import { updateProgress, loadProgress, recordLearningAnswer } from '../progress/progressStorage.js'

export const SESSION_KEY = 'chemlab-v1-practice-session'
const SESSION_HISTORY = 20

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)

export function readPractice(progress = loadProgress()) {
  const practice = isObject(progress.learning?.practice) ? progress.learning.practice : {}
  return {
    answers: isObject(practice.answers) ? practice.answers : {},
    sessions: Array.isArray(practice.sessions) ? practice.sessions.filter(isObject) : []
  }
}

function ensurePractice(progress) {
  const current = progress.learning.practice
  if (!isObject(current)) progress.learning.practice = { answers: {}, sessions: [] }
  if (!isObject(progress.learning.practice.answers)) progress.learning.practice.answers = {}
  if (!Array.isArray(progress.learning.practice.sessions)) progress.learning.practice.sessions = []
  return progress.learning.practice
}

export function recordPracticeAnswer(question, result) {
  recordLearningAnswer({ quizId: null, correct: result.correct })
  updateProgress(progress => {
    const practice = ensurePractice(progress)
    const previous = isObject(practice.answers[question.id]) ? practice.answers[question.id] : {}
    practice.answers[question.id] = {
      lessonId: question.lessonId,
      attempts: (Number(previous.attempts) || 0) + 1,
      correct: (Number(previous.correct) || 0) + (result.correct ? 1 : 0),
      lastCorrect: result.correct,
      lastAt: new Date().toISOString()
    }
    return progress
  })
}

export function recordPracticeSession(summary) {
  updateProgress(progress => {
    const practice = ensurePractice(progress)
    practice.sessions = [{ ...summary, at: new Date().toISOString() }, ...practice.sessions].slice(0, SESSION_HISTORY)
    return progress
  })
}

// IDs whose most recent attempt was wrong.
export function wrongQuestionIds(progress = loadProgress()) {
  return Object.entries(readPractice(progress).answers)
    .filter(([, answer]) => isObject(answer) && answer.lastCorrect === false)
    .map(([id]) => id)
}

export function loadSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return isObject(session) && Array.isArray(session.questionIds) && session.questionIds.length ? session : null
  }
  catch {
    return null
  }
}

export function saveSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
    return true
  }
  catch {
    return false
  }
}
