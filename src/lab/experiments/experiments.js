/* =========================================================
   CHEMLAB
   GUIDED LEARNING MASTER REGISTRY
========================================================= */

import {
  GRADE10_EXPERIMENTS
} from './grade10.js'


import {
  GRADE11_EXPERIMENTS
} from './grade11.js'


import {
  GRADE12_EXPERIMENTS
} from './grade12.js'


/* =========================================================
   MASTER ARRAY
========================================================= */

export const EXPERIMENTS = [

  ...GRADE10_EXPERIMENTS,

  ...GRADE11_EXPERIMENTS,

  ...GRADE12_EXPERIMENTS

]


/* =========================================================
   ID MAP
========================================================= */

export const EXPERIMENT_MAP =
  Object.fromEntries(

    EXPERIMENTS.map(
      activity => [

        activity.id,

        activity

      ]
    )

  )


/* =========================================================
   GET BY ID
========================================================= */

export function getExperimentById(
  id
) {

  if (!id) {
    return null
  }


  return (
    EXPERIMENT_MAP[id] ||
    null
  )

}


/* =========================================================
   GET BY LESSON
========================================================= */

export function getExperimentsForLesson(
  lessonId
) {

  if (!lessonId) {
    return []
  }


  return EXPERIMENTS.filter(
    activity =>
      activity.lessonId ===
      lessonId
  )

}


/* =========================================================
   GET BY GRADE
========================================================= */

export function getExperimentsForGrade(
  grade
) {

  const numericGrade =
    Number(
      grade
    )


  return EXPERIMENTS.filter(
    activity =>
      activity.grade ===
      numericGrade
  )

}


/* =========================================================
   GET BY CHAPTER
========================================================= */

export function getExperimentsForChapter(
  chapterId
) {

  if (!chapterId) {
    return []
  }


  return EXPERIMENTS.filter(
    activity =>
      activity.chapterId ===
      chapterId
  )

}


/* =========================================================
   VALIDATION
========================================================= */

export function validateExperiments() {

  const errors =
    []


  const ids =
    new Set()


  EXPERIMENTS.forEach(
    activity => {

      if (
        !activity.id
      ) {

        errors.push(
          'Có activity thiếu ID.'
        )

      }


      if (
        ids.has(
          activity.id
        )
      ) {

        errors.push(
          `Trùng ID: ${activity.id}`
        )

      }


      ids.add(
        activity.id
      )


      if (
        !activity.lessonId
      ) {

        errors.push(
          `${activity.id}: thiếu lessonId`
        )

      }


      if (
        !activity.chapterId
      ) {

        errors.push(
          `${activity.id}: thiếu chapterId`
        )

      }


      if (
        !Array.isArray(
          activity.steps
        ) ||
        !activity.steps.length
      ) {

        errors.push(
          `${activity.id}: không có steps`
        )

      }

    }
  )


  return {

    valid:
      errors.length ===
      0,

    total:
      EXPERIMENTS.length,

    grade10:
      GRADE10_EXPERIMENTS.length,

    grade11:
      GRADE11_EXPERIMENTS.length,

    grade12:
      GRADE12_EXPERIMENTS.length,

    errors

  }

}