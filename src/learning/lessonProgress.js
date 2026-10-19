// Step-reader progress, stored in the existing progress record
// (chemlab-v1-progress → learning.gradeNN.lessons[lessonId]) so older
// fields (started, completed, progress, completedAt) keep their meaning.
// Added fields: currentStep, openedSteps, viewedSteps, answers, contentVersion.
import {
  getLessonProgress,
  saveLessonProgress,
  markLessonCompleted,
  loadProgress
} from '../progress/progressStorage.js'
import { findLesson } from './catalog.js'
import { getLessonProgress as getActivityLessonProgress } from '../lab/experiments/progressSummary.js'

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const idList = value => Array.isArray(value) ? value.filter(item => typeof item === 'string') : []

// Read a stored record defensively: unknown or corrupt fields fall back
// without throwing, step IDs the current content no longer has are ignored.
export function normalizeRecord(record, stepIds) {
  const saved = isObject(record) ? record : {}
  const known = new Set(stepIds)
  const answers = {}
  if (isObject(saved.answers)) {
    for (const [id, answer] of Object.entries(saved.answers)) {
      if (isObject(answer) && typeof answer.choice === 'string') answers[id] = { choice: answer.choice, correct: answer.correct === true }
    }
  }
  return {
    currentStep: known.has(saved.currentStep) ? saved.currentStep : stepIds[0],
    opened: new Set(idList(saved.openedSteps).filter(id => known.has(id))),
    viewed: new Set(idList(saved.viewedSteps).filter(id => known.has(id))),
    answers,
    started: saved.started === true,
    completed: saved.completed === true,
    lastOpened: typeof saved.lastOpened === 'string' ? saved.lastOpened : null
  }
}

// Steps still to learn before the lesson can be completed from the final step.
export function missingSteps(stepIds, viewed) {
  return stepIds.slice(0, -1).filter(id => !viewed.has(id))
}

export function percentLearned(stepIds, viewed) {
  if (!stepIds.length) return 0
  return Math.round(stepIds.filter(id => viewed.has(id)).length / stepIds.length * 100)
}

export function readLessonState(lesson, content) {
  const stepIds = content.steps.map(step => step.id)
  return normalizeRecord(getLessonProgress(lesson.grade, lesson.id), stepIds)
}

// Merge with what is stored so IDs from other content versions are kept.
function merged(stored, current) {
  return [...new Set([...idList(stored), ...current])]
}

export function saveLessonState(lesson, content, state) {
  const stored = getLessonProgress(lesson.grade, lesson.id) || {}
  const stepIds = content.steps.map(step => step.id)
  saveLessonProgress(lesson.grade, lesson.id, {
    currentStep: state.currentStep,
    openedSteps: merged(stored.openedSteps, state.opened),
    viewedSteps: merged(stored.viewedSteps, state.viewed),
    answers: { ...(isObject(stored.answers) ? stored.answers : {}), ...state.answers },
    contentVersion: content.contentVersion,
    progress: stored.completed === true ? 100 : percentLearned(stepIds, state.viewed)
  })
}

export function completeLesson(lesson, content, state) {
  const stored = getLessonProgress(lesson.grade, lesson.id) || {}
  markLessonCompleted(lesson.grade, lesson.id, {
    currentStep: state.currentStep,
    openedSteps: merged(stored.openedSteps, state.opened),
    viewedSteps: merged(stored.viewedSteps, state.viewed),
    answers: { ...(isObject(stored.answers) ? stored.answers : {}), ...state.answers },
    contentVersion: content.contentVersion
  })
}

// Summary used by lists: reader progress, plus — for lessons still on legacy
// content — completion of their guided Lab activities, so earlier progress counts.
export function lessonSummary(lesson, progress = loadProgress()) {
  const record = progress.learning?.[`grade${lesson.grade}`]?.lessons?.[lesson.id]
  const saved = isObject(record) ? record : {}
  let completed = saved.completed === true
  let started = completed || saved.started === true

  if (!completed && lesson.status === 'legacy' && lesson.activityIds.length) {
    try {
      const activities = getActivityLessonProgress(lesson.grade, lesson.id)
      completed = activities.completed
      started = started || activities.started
    }
    catch {
    }
  }

  const progressValue = Number(saved.progress)
  return {
    started,
    completed,
    progress: completed ? 100 : Number.isFinite(progressValue) ? Math.max(0, Math.min(100, progressValue)) : 0,
    lastOpened: typeof saved.lastOpened === 'string' ? saved.lastOpened : null,
    currentStep: typeof saved.currentStep === 'string' ? saved.currentStep : null
  }
}

// Most recent lesson opened in the reader that still exists in the catalog.
export function findContinueLesson(progress = loadProgress()) {
  let best = null
  for (const grade of [10, 11, 12]) {
    const lessons = progress.learning?.[`grade${grade}`]?.lessons
    if (!isObject(lessons)) continue
    for (const [lessonId, record] of Object.entries(lessons)) {
      const entry = findLesson(lessonId)
      if (!entry || !isObject(record) || typeof record.lastOpened !== 'string') continue
      const time = Date.parse(record.lastOpened)
      if (!Number.isFinite(time)) continue
      const candidate = { entry, record, time, completed: record.completed === true }
      // Prefer unfinished lessons; among equals, the most recent.
      if (!best || (best.completed && !candidate.completed) || (best.completed === candidate.completed && time > best.time)) best = candidate
    }
  }
  return best
}
