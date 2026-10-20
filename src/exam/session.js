// Exam sessions and results in localStorage (no account, no server).
//
// - The deadline is stored when the exam starts; remaining time is always
//   deadline − now, so reloads, closed tabs and throttled timers cannot reset it.
// - Every write re-reads storage and changes one field (read-modify-write), so a
//   second tab cannot wipe answers with a stale copy.
// - The clock is never allowed to run backwards: “now” is at least the last time
//   the session was seen; a big jump back is flagged on the result.
// - Submitting is idempotent.
// This runs in the learner's browser: it is a practice environment, not an
// exam-security system.
import { scoreExam } from './scoring.js'

export const STORE_KEY = 'chemlab-v1-exam'
export const CORRUPT_KEY = 'chemlab-v1-exam-corrupt'
const STORE_VERSION = 1
const RESULT_HISTORY = 20
const CLOCK_SKEW_MS = 60_000

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)

function emptyStore() {
  return { version: STORE_VERSION, sessions: {}, results: [] }
}

function validSession(session) {
  return isObject(session) &&
    typeof session.id === 'string' &&
    typeof session.examId === 'string' &&
    Number.isFinite(session.startedAt) &&
    Number.isFinite(session.deadline) &&
    Number.isFinite(session.lastSeenAt) &&
    isObject(session.answers) &&
    isObject(session.flags) &&
    ['active', 'submitted'].includes(session.status)
}

export function createExamStore({ storage = globalThis.localStorage, now = () => Date.now(), random = () => Math.random() } = {}) {
  let notice = null // set once when stored data had to be recovered

  function read() {
    let raw = null
    try {
      raw = storage.getItem(STORE_KEY)
    }
    catch {
      return emptyStore()
    }
    if (!raw) return emptyStore()
    let data
    try {
      data = JSON.parse(raw)
    }
    catch {
      data = null
    }
    if (!isObject(data) || data.version !== STORE_VERSION || !isObject(data.sessions) || !Array.isArray(data.results)) {
      // Keep the unreadable copy for diagnosis instead of silently losing it.
      try {
        storage.setItem(CORRUPT_KEY, raw)
        storage.removeItem(STORE_KEY)
      }
      catch { /* storage unavailable: start clean in memory */ }
      notice = 'Dữ liệu thi đã lưu không đọc được nên đã được đặt lại.'
      return emptyStore()
    }
    for (const [examId, session] of Object.entries(data.sessions)) {
      if (!validSession(session)) {
        delete data.sessions[examId]
        notice = 'Một phiên thi đã lưu bị hỏng và đã được bỏ qua.'
      }
    }
    data.results = data.results.filter(isObject)
    return data
  }

  function write(data) {
    try {
      storage.setItem(STORE_KEY, JSON.stringify(data))
      return true
    }
    catch {
      return false
    }
  }

  // Effective time never goes backwards for a session.
  function clock(session) {
    const current = now()
    return { time: Math.max(current, session.lastSeenAt), rolledBack: current < session.lastSeenAt - CLOCK_SKEW_MS }
  }

  function mutate(examId, sessionId, change) {
    const data = read()
    const session = data.sessions[examId]
    if (!session || session.id !== sessionId) return { ok: false, reason: 'missing' }
    if (session.status !== 'active') return { ok: false, reason: 'submitted', session }
    const { time, rolledBack } = clock(session)
    if (time >= session.deadline) return { ok: false, reason: 'expired', session }
    change(session)
    session.lastSeenAt = time
    session.savedAt = time
    if (rolledBack) session.clockAnomaly = true
    const saved = write(data)
    return { ok: saved, reason: saved ? null : 'storage', session }
  }

  return {
    takeNotice() {
      const message = notice
      notice = null
      return message
    },

    getSession(examId) {
      return read().sessions[examId] || null
    },

    remainingMs(session) {
      return Math.max(0, session.deadline - clock(session).time)
    },

    isExpired(session) {
      return session.status === 'active' && clock(session).time >= session.deadline
    },

    start(entry, paper) {
      const data = read()
      const existing = data.sessions[entry.id]
      if (existing?.status === 'active') return { session: existing, resumed: true }
      const time = now()
      const session = {
        id: `${time.toString(36)}-${Math.floor(random() * 1e9).toString(36)}`,
        examId: entry.id,
        contentVersion: paper.dataVersion,
        startedAt: time,
        deadline: time + paper.timeLimitMinutes * 60_000,
        lastSeenAt: time,
        savedAt: time,
        current: 0,
        answers: {},
        flags: {},
        status: 'active',
        clockAnomaly: false
      }
      data.sessions[entry.id] = session
      return { session, resumed: false, saved: write(data) }
    },

    // value undefined/'' clears the answer (an explicit learner action).
    setAnswer(examId, sessionId, questionId, value) {
      return mutate(examId, sessionId, session => {
        if (value === undefined || value === '' || (isObject(value) && !Object.keys(value).length)) delete session.answers[questionId]
        else session.answers[questionId] = value
      })
    },

    setFlag(examId, sessionId, questionId, flagged) {
      return mutate(examId, sessionId, session => {
        if (flagged) session.flags[questionId] = true
        else delete session.flags[questionId]
      })
    },

    setCurrent(examId, sessionId, index) {
      return mutate(examId, sessionId, session => {
        session.current = index
      })
    },

    // Scores and stores the result once. A second call (other tab, double click)
    // returns the stored result.
    submit(examId, sessionId, paper, { reason = 'manual' } = {}) {
      const data = read()
      const session = data.sessions[examId]
      if (!session || session.id !== sessionId) return { ok: false, reason: 'missing' }
      if (session.status === 'submitted') {
        return { ok: true, duplicate: true, session, result: data.results.find(item => item.id === session.resultId) || null }
      }
      if (session.contentVersion !== paper.dataVersion) return { ok: false, reason: 'version' }
      const { time, rolledBack } = clock(session)
      const timedOut = time >= session.deadline
      const scored = scoreExam(paper, session.answers)
      const result = {
        id: `r-${session.id}`,
        examId,
        sessionId: session.id,
        title: paper.title,
        contentVersion: paper.dataVersion,
        earned: scored.earned,
        possible: scored.possible,
        parts: scored.parts.map(({ id, earned, possible }) => ({ id, earned, possible })),
        answers: { ...session.answers },
        startedAt: session.startedAt,
        submittedAt: Math.min(time, session.deadline),
        reason: timedOut ? 'timeout' : reason,
        clockAnomaly: Boolean(session.clockAnomaly || rolledBack)
      }
      session.status = 'submitted'
      session.resultId = result.id
      session.submittedAt = result.submittedAt
      session.lastSeenAt = time
      data.results = [result, ...data.results.filter(item => item.id !== result.id)].slice(0, RESULT_HISTORY)
      const saved = write(data)
      return { ok: saved, reason: saved ? null : 'storage', session, result }
    },

    // Drops the active or finished session for an exam (results stay).
    discard(examId) {
      const data = read()
      delete data.sessions[examId]
      return write(data)
    },

    results(examId = null) {
      const list = read().results
      return examId ? list.filter(item => item.examId === examId) : list
    },

    getResult(resultId) {
      return read().results.find(item => item.id === resultId) || null
    }
  }
}
