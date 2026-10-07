import {
  getExperimentProgress
} from '../../progress/progressStorage.js'

import {
  getExperimentsForLesson,
  getExperimentsForGrade
} from './experiments.js'

import {
  getGradeCurriculum
} from './curriculum.js'


/* =========================================================
   ACTIVITY
========================================================= */

export function getActivityStatus(
  activity
) {

  if (!activity) {

    return {
      completed: false,
      started: false,
      progress: 0
    }

  }


  const saved =
    getExperimentProgress(
      activity.grade,
      activity.id
    )


  const totalSteps =
    Array.isArray(
      activity.steps
    )
      ? activity.steps.length
      : 0


  const completedSteps =
    Array.isArray(
      saved?.completedSteps
    )
      ? saved.completedSteps.length
      : 0


  const completed =
    saved?.completed === true


  const started =
    completed ||
    completedSteps > 0 ||
    Number(
      saved?.currentStep || 0
    ) > 0 ||
    Boolean(
      saved?.labSnapshot
    )


  const progress =
    completed

      ? 100

      : totalSteps

        ? Math.round(
            completedSteps /
            totalSteps *
            100
          )

        : 0


  return {
    saved,
    completed,
    started,
    progress,
    completedSteps,
    totalSteps
  }

}


/* =========================================================
   LESSON
========================================================= */

export function getLessonProgress(
  grade,
  lessonId
) {

  const activities =
    getExperimentsForLesson(
      lessonId
    )


  if (!activities.length) {

    return {
      grade,
      lessonId,
      activities: [],
      totalActivities: 0,
      completedActivities: 0,
      startedActivities: 0,
      completed: false,
      started: false,
      progress: 0
    }

  }


  const statuses =
    activities.map(
      activity => ({
        activity,
        status:
          getActivityStatus(
            activity
          )
      })
    )


  const completedActivities =
    statuses.filter(
      item =>
        item.status.completed
    ).length


  const startedActivities =
    statuses.filter(
      item =>
        item.status.started
    ).length


  const progress =
    Math.round(

      statuses.reduce(
        (
          total,
          item
        ) =>
          total +
          item.status.progress,

        0
      ) /

      statuses.length

    )


  return {

    grade,
    lessonId,

    activities,

    totalActivities:
      activities.length,

    completedActivities,

    startedActivities,

    completed:
      completedActivities ===
      activities.length,

    started:
      startedActivities > 0,

    progress

  }

}


/* =========================================================
   CHAPTER
========================================================= */

export function getChapterProgress(
  grade,
  chapter
) {

  if (
    !chapter ||
    !Array.isArray(
      chapter.lessons
    )
  ) {

    return {
      totalLessons: 0,
      completedLessons: 0,
      startedLessons: 0,
      progress: 0
    }

  }


  const lessonStates =
    chapter.lessons.map(
      lesson =>
        getLessonProgress(
          grade,
          lesson.id
        )
    )


  const completedLessons =
    lessonStates.filter(
      lesson =>
        lesson.completed
    ).length


  const startedLessons =
    lessonStates.filter(
      lesson =>
        lesson.started &&
        !lesson.completed
    ).length


  const totalLessons =
    lessonStates.length


  const progress =
    totalLessons

      ? Math.round(
          completedLessons /
          totalLessons *
          100
        )

      : 0


  return {

    totalLessons,

    completedLessons,

    startedLessons,

    progress,

    lessonStates

  }

}


/* =========================================================
   GRADE
========================================================= */

export function getGradeProgress(
  grade
) {

  const curriculum =
    getGradeCurriculum(
      grade
    )


  if (!curriculum) {

    return {
      grade,
      totalLessons: 0,
      completedLessons: 0,
      startedLessons: 0,
      progress: 0,
      totalActivities: 0,
      completedActivities: 0
    }

  }


  const lessons =
    curriculum.chapters
      .flatMap(
        chapter =>
          chapter.lessons
      )


  const lessonStates =
    lessons.map(
      lesson =>
        getLessonProgress(
          grade,
          lesson.id
        )
    )


  const completedLessons =
    lessonStates.filter(
      lesson =>
        lesson.completed
    ).length


  const startedLessons =
    lessonStates.filter(
      lesson =>
        lesson.started &&
        !lesson.completed
    ).length


  const totalLessons =
    lessons.length


  const activities =
    getExperimentsForGrade(
      grade
    )


  const completedActivities =
    activities.filter(
      activity =>
        getActivityStatus(
          activity
        ).completed
    ).length


  return {

    grade,

    totalLessons,

    completedLessons,

    startedLessons,

    progress:
      totalLessons

        ? Math.round(
            completedLessons /
            totalLessons *
            100
          )

        : 0,

    totalActivities:
      activities.length,

    completedActivities,

    lessonStates

  }

}


/* =========================================================
   FIND CURRENT LESSON

   Không phụ thuộc timestamp trong progressStorage.
   Tìm bài đang làm dở đầu tiên theo đúng chương trình.
========================================================= */

export function findCurrentLesson(
  grade
) {

  const curriculum =
    getGradeCurriculum(
      grade
    )


  if (!curriculum) {
    return null
  }


  for (
    const chapter of
    curriculum.chapters
  ) {

    for (
      const lesson of
      chapter.lessons
    ) {

      const progress =
        getLessonProgress(
          grade,
          lesson.id
        )


      if (
        progress.started &&
        !progress.completed
      ) {

        return {
          grade,
          chapter,
          lesson,
          progress
        }

      }

    }

  }


  return null

}


/* =========================================================
   FIRST UNFINISHED LESSON
========================================================= */

export function findNextLesson(
  grade
) {

  const curriculum =
    getGradeCurriculum(
      grade
    )


  if (!curriculum) {
    return null
  }


  for (
    const chapter of
    curriculum.chapters
  ) {

    for (
      const lesson of
      chapter.lessons
    ) {

      const progress =
        getLessonProgress(
          grade,
          lesson.id
        )


      if (
        !progress.completed &&
        progress.totalActivities >
          0
      ) {

        return {
          grade,
          chapter,
          lesson,
          progress
        }

      }

    }

  }


  return null

}