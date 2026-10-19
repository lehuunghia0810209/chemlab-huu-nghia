// Learning sub-routes in the hash:
//   #learning · #learning/grade-10 · #learning/lesson/g10-l1 · #learning/practice
export function parseRoute(hash) {
  const parts = String(hash || '').replace(/^#/, '').split('/')
  if (parts[0] !== 'learning') return null
  if (parts[1] === 'lesson' && parts[2]) {
    let lessonId = parts[2]
    try {
      lessonId = decodeURIComponent(lessonId)
    }
    catch {
    }
    return { name: 'lesson', lessonId }
  }
  const grade = /^grade-(10|11|12)$/.exec(parts[1] || '')
  if (grade) return { name: 'grade', grade: Number(grade[1]) }
  if (parts[1] === 'practice') return { name: 'practice' }
  return { name: 'home' }
}

export function routeHash(route) {
  if (route.name === 'lesson') return `#learning/lesson/${encodeURIComponent(route.lessonId)}`
  if (route.name === 'grade') return `#learning/grade-${route.grade}`
  if (route.name === 'practice') return '#learning/practice'
  return '#learning'
}
