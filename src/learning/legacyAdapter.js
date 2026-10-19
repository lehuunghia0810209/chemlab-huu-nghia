// Presents a lesson's legacy guided activities (Lab content from earlier
// versions) as reader steps, so every catalogued lesson stays reachable until
// a full lesson replaces it. Lab-only actions become one "do it in the Lab" step.
import { getExperimentById } from '../lab/experiments/experiments.js'

const LAB_ACTIONS = new Set(['add', 'reaction', 'indicator', 'heat'])

function conceptBlocks(step) {
  const blocks = []
  if (step.text) blocks.push({ type: 'p', text: step.text })
  if (step.points?.length) blocks.push({ type: 'list', items: step.points })
  if (step.formula) blocks.push({ type: 'equation', text: step.formula })
  return blocks
}

function quizBlock(step) {
  return {
    type: 'quiz',
    id: step.id,
    question: step.question,
    options: step.options,
    correct: step.correct,
    explanation: step.explanation
  }
}

export function buildLegacyLesson(lesson) {
  const activities = lesson.activityIds.map(getExperimentById).filter(Boolean)
  const objectives = [...new Set(activities.map(activity => activity.objective).filter(Boolean))]

  const steps = [{
    id: 'legacy-overview',
    kind: 'objectives',
    title: 'Bài này giúp em',
    blocks: [
      objectives.length
        ? { type: 'list', items: objectives }
        : { type: 'p', text: 'Ôn lại kiến thức trọng tâm của chương.' }
    ]
  }]

  for (const activity of activities) {
    let pending = null
    const flush = () => {
      if (pending) steps.push(pending)
      pending = null
    }

    activity.steps.forEach((step, index) => {
      const id = `legacy-${activity.id}-${index}`

      if (step.type === 'quiz' || step.type === 'prediction') {
        if (pending?.kind !== 'check') {
          flush()
          pending = { id, kind: 'check', title: 'Kiểm tra nhanh', blocks: [] }
        }
        pending.blocks.push(quizBlock(step))
        return
      }

      if (LAB_ACTIONS.has(step.type)) {
        if (pending?.kind !== 'practice') {
          flush()
          pending = {
            id,
            kind: 'practice',
            title: 'Thực hành trong phòng thí nghiệm',
            blocks: [
              { type: 'p', text: 'Phần này cần thao tác với hóa chất trong Phòng thí nghiệm ảo:' },
              { type: 'list', ordered: true, items: [] },
              {
                type: 'activity',
                title: activity.title,
                text: 'Mở hoạt động có hướng dẫn. Tiến độ bài học ở đây vẫn được giữ nguyên.',
                action: { kind: 'guided', grade: activity.grade, lessonId: activity.lessonId, experimentId: activity.id }
              }
            ]
          }
        }
        if (step.text) pending.blocks[1].items.push(step.text)
        return
      }

      flush()
      steps.push({
        id,
        kind: 'concept',
        title: step.title || 'Kiến thức',
        blocks: conceptBlocks(step)
      })
    })

    flush()
  }

  return {
    id: lesson.id,
    contentVersion: 0,
    status: 'legacy',
    steps
  }
}
