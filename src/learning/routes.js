// Learning sub-routes in the hash:
//   #learning · #learning/grade-10 · #learning/lesson/g10-l1
//   #learning/practice · #learning/practice/session · #learning/practice/topics
//   #learning/practice/lesson/g10-l1 · #learning/practice/chapter/g10-c1
function decode(part) {
  try {
    return decodeURIComponent(part)
  }
  catch {
    return part
  }
}

export function parseRoute(hash) {
  const parts = String(hash || '').replace(/^#/, '').split('/')
  if (parts[0] !== 'learning') return null
  if (parts[1] === 'lesson' && parts[2]) return { name: 'lesson', lessonId: decode(parts[2]) }
  const grade = /^grade-(10|11|12)$/.exec(parts[1] || '')
  if (grade) return { name: 'grade', grade: Number(grade[1]) }
  if (parts[1] === 'practice') {
    if (parts[2] === 'session') return { name: 'practice', view: 'session' }
    if (parts[2] === 'topics') return { name: 'practice', view: 'topics' }
    if ((parts[2] === 'lesson' || parts[2] === 'chapter') && parts[3]) {
      return { name: 'practice', view: 'start', scope: parts[2], id: decode(parts[3]) }
    }
    return { name: 'practice', view: 'home' }
  }
  return { name: 'home' }
}

export function routeHash(route) {
  if (route.name === 'lesson') return `#learning/lesson/${encodeURIComponent(route.lessonId)}`
  if (route.name === 'grade') return `#learning/grade-${route.grade}`
  if (route.name === 'practice') {
    if (route.view === 'session') return '#learning/practice/session'
    if (route.view === 'topics') return '#learning/practice/topics'
    if (route.view === 'start') return `#learning/practice/${route.scope}/${encodeURIComponent(route.id)}`
    return '#learning/practice'
  }
  return '#learning'
}
