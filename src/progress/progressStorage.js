/* =========================================================
   CHEMLAB PROGRESS STORAGE
   Version 1.0

   Lưu tiến độ Learning + Guided Lab bằng localStorage.

   Dữ liệu vẫn còn khi:
   - F5
   - đóng tab
   - đóng trình duyệt
   - tắt điện thoại
   - quay lại sau nhiều ngày / nhiều tháng

   Dữ liệu chỉ mất nếu:
   - người dùng xóa dữ liệu website
   - dùng chế độ ẩn danh rồi đóng trình duyệt
   - đổi thiết bị / đổi trình duyệt
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

export const PROGRESS_STORAGE_KEY =
  'chemlab-v1-progress'


export const PROGRESS_SCHEMA_VERSION =
  1


/* =========================================================
   DEFAULT DATA
========================================================= */

function createDefaultProgress() {

  return {

    version:
      PROGRESS_SCHEMA_VERSION,


    createdAt:
      new Date()
        .toISOString(),


    updatedAt:
      new Date()
        .toISOString(),


    /* =====================================================
       LEARNING
    ===================================================== */

    learning: {

      grade10: {
        lessons: {},
        chapters: {},
        completedLessons: []
      },


      grade11: {
        lessons: {},
        chapters: {},
        completedLessons: []
      },


      grade12: {
        lessons: {},
        chapters: {},
        completedLessons: []
      },


      quizzes: {},


      totalXP:
        0,


      totalCorrect:
        0,


      totalQuestions:
        0

    },


    /* =====================================================
       GUIDED LAB
    ===================================================== */

    experiments: {

      grade10: {},

      grade11: {},

      grade12: {},


      completed: [],


      totalCompleted:
        0

    },


    /* =====================================================
       GLOBAL STATS
    ===================================================== */

    statistics: {

      completedLessons:
        0,


      completedExperiments:
        0,


      correctAnswers:
        0,


      totalAnswers:
        0,


      totalLearningTimeSeconds:
        0,


      totalExperimentTimeSeconds:
        0

    },


    /* =====================================================
       LAST ACTIVITY
    ===================================================== */

    lastActivity:
      null

  }

}


/* =========================================================
   STORAGE SUPPORT
========================================================= */

function storageAvailable() {

  try {

    const key =
      '__chemlab_storage_test__'


    localStorage.setItem(
      key,
      '1'
    )


    localStorage.removeItem(
      key
    )


    return true

  }

  catch {

    return false

  }

}


/* =========================================================
   SAFE PARSE
========================================================= */

function safeParse(
  value
) {

  try {

    return JSON.parse(
      value
    )

  }

  catch {

    return null

  }

}


/* =========================================================
   OBJECT CHECK
========================================================= */

function isObject(
  value
) {

  return (
    value !==
      null &&

    typeof value ===
      'object' &&

    !Array.isArray(
      value
    )
  )

}


/* =========================================================
   DEEP MERGE

   Dùng để dữ liệu cũ vẫn hoạt động
   khi sau này ta thêm field mới.
========================================================= */

function deepMerge(
  defaults,
  saved
) {

  if (
    Array.isArray(
      defaults
    )
  ) {

    return Array.isArray(
      saved
    )

      ? saved

      : defaults

  }


  if (
    !isObject(
      defaults
    )
  ) {

    return saved !==
      undefined

      ? saved

      : defaults

  }


  const result =
    {
      ...defaults
    }


  if (
    !isObject(
      saved
    )
  ) {

    return result

  }


  Object
    .keys(
      saved
    )
    .forEach(
      key => {

        if (
          key in
          defaults
        ) {

          result[key] =
            deepMerge(

              defaults[key],

              saved[key]

            )

        }

        else {

          result[key] =
            saved[key]

        }

      }
    )


  return result

}


/* =========================================================
   LOAD
========================================================= */

export function loadProgress() {

  const defaults =
    createDefaultProgress()


  if (
    !storageAvailable()
  ) {

    return defaults

  }


  const raw =
    localStorage
      .getItem(
        PROGRESS_STORAGE_KEY
      )


  if (!raw) {

    saveProgress(
      defaults
    )


    return defaults

  }


  const parsed =
    safeParse(
      raw
    )


  if (
    !parsed
  ) {

    saveProgress(
      defaults
    )


    return defaults

  }


  const merged =
    deepMerge(
      defaults,
      parsed
    )


  merged.version =
    PROGRESS_SCHEMA_VERSION


  return merged

}


/* =========================================================
   SAVE
========================================================= */

export function saveProgress(
  data
) {

  if (
    !storageAvailable()
  ) {

    return false

  }


  try {

    const payload = {

      ...data,

      version:
        PROGRESS_SCHEMA_VERSION,

      updatedAt:
        new Date()
          .toISOString()

    }


    localStorage.setItem(

      PROGRESS_STORAGE_KEY,

      JSON.stringify(
        payload
      )

    )


    dispatchProgressChanged(
      payload
    )


    return true

  }

  catch (
    error
  ) {

    console.error(
      '[ChemLab Progress] Save failed:',
      error
    )


    return false

  }

}


/* =========================================================
   UPDATE HELPER
========================================================= */

export function updateProgress(
  updater
) {

  const progress =
    loadProgress()


  const result =
    updater(
      progress
    )


  const next =
    result ||
    progress


  saveProgress(
    next
  )


  return next

}


/* =========================================================
   GRADE KEY
========================================================= */

function gradeKey(
  grade
) {

  const value =
    Number(
      grade
    )


  if (
    value ===
    10
  ) {

    return 'grade10'

  }


  if (
    value ===
    11
  ) {

    return 'grade11'

  }


  if (
    value ===
    12
  ) {

    return 'grade12'

  }


  return null

}


/* =========================================================
   UNIQUE PUSH
========================================================= */

function uniquePush(
  array,
  value
) {

  if (
    !Array.isArray(
      array
    )
  ) {

    return

  }


  if (
    !array.includes(
      value
    )
  ) {

    array.push(
      value
    )

  }

}


/* =========================================================
   LEARNING
========================================================= */


/* =========================================================
   GET LESSON
========================================================= */

export function getLessonProgress(
  grade,
  lessonId
) {

  const key =
    gradeKey(
      grade
    )


  if (!key) {
    return null
  }


  const progress =
    loadProgress()


  return (

    progress
      .learning
      [key]
      .lessons
      [lessonId] ||

    null

  )

}


/* =========================================================
   SAVE LESSON STATE
========================================================= */

export function saveLessonProgress(
  grade,
  lessonId,
  data = {}
) {

  const key =
    gradeKey(
      grade
    )


  if (
    !key ||
    !lessonId
  ) {

    return null

  }


  return updateProgress(
    progress => {

      const previous =
        progress
          .learning
          [key]
          .lessons
          [lessonId] ||
        {}


      progress
        .learning
        [key]
        .lessons
        [lessonId] = {

          ...previous,

          ...data,

          grade:
            Number(
              grade
            ),

          lessonId,

          started:
            true,

          lastOpened:
            new Date()
              .toISOString()

        }


      saveLastActivityToObject(
        progress,
        {

          type:
            'learning',

          grade:
            Number(
              grade
            ),

          lessonId

        }
      )


      return progress

    }
  )

}


/* =========================================================
   MARK LESSON COMPLETE
========================================================= */

export function markLessonCompleted(
  grade,
  lessonId,
  data = {}
) {

  const key =
    gradeKey(
      grade
    )


  if (
    !key ||
    !lessonId
  ) {

    return null

  }


  return updateProgress(
    progress => {

      const lesson =
        progress
          .learning
          [key]
          .lessons
          [lessonId] ||
        {}


      const alreadyCompleted =
        lesson.completed ===
        true


      progress
        .learning
        [key]
        .lessons
        [lessonId] = {

          ...lesson,

          ...data,

          grade:
            Number(
              grade
            ),

          lessonId,

          started:
            true,

          completed:
            true,

          progress:
            100,

          completedAt:
            lesson.completedAt ||
            new Date()
              .toISOString(),

          lastOpened:
            new Date()
              .toISOString()

        }


      uniquePush(

        progress
          .learning
          [key]
          .completedLessons,

        lessonId

      )


      if (
        !alreadyCompleted
      ) {

        progress
          .statistics
          .completedLessons +=
          1

      }


      saveLastActivityToObject(
        progress,
        {

          type:
            'learning',

          grade:
            Number(
              grade
            ),

          lessonId,

          completed:
            true

        }
      )


      return progress

    }
  )

}


/* =========================================================
   CHAPTER PROGRESS
========================================================= */

export function saveChapterProgress(
  grade,
  chapterId,
  data = {}
) {

  const key =
    gradeKey(
      grade
    )


  if (
    !key ||
    !chapterId
  ) {

    return null

  }


  return updateProgress(
    progress => {

      const old =
        progress
          .learning
          [key]
          .chapters
          [chapterId] ||
        {}


      progress
        .learning
        [key]
        .chapters
        [chapterId] = {

          ...old,

          ...data,

          chapterId,

          updatedAt:
            new Date()
              .toISOString()

        }


      return progress

    }
  )

}


/* =========================================================
   QUIZ PROGRESS
========================================================= */

export function saveQuizProgress(
  quizId,
  data = {}
) {

  if (!quizId) {
    return null
  }


  return updateProgress(
    progress => {

      const old =
        progress
          .learning
          .quizzes
          [quizId] ||
        {}


      progress
        .learning
        .quizzes
        [quizId] = {

          ...old,

          ...data,

          quizId,

          lastOpened:
            new Date()
              .toISOString()

        }


      saveLastActivityToObject(
        progress,
        {

          type:
            'quiz',

          quizId

        }
      )


      return progress

    }
  )

}


/* =========================================================
   RECORD ANSWER
========================================================= */

export function recordLearningAnswer({
  quizId = null,
  correct = false,
  xp = 0
} = {}) {

  return updateProgress(
    progress => {

      progress
        .learning
        .totalQuestions +=
        1


      progress
        .statistics
        .totalAnswers +=
        1


      if (
        correct
      ) {

        progress
          .learning
          .totalCorrect +=
          1


        progress
          .statistics
          .correctAnswers +=
          1

      }


      progress
        .learning
        .totalXP +=
        Number(
          xp
        ) ||
        0


      if (
        quizId
      ) {

        const quiz =
          progress
            .learning
            .quizzes
            [quizId] ||
          {}


        quiz.answers =
          Number(
            quiz.answers ||
            0
          ) +
          1


        if (
          correct
        ) {

          quiz.correct =
            Number(
              quiz.correct ||
              0
            ) +
            1

        }


        quiz.lastOpened =
          new Date()
            .toISOString()


        progress
          .learning
          .quizzes
          [quizId] =
          quiz

      }


      return progress

    }
  )

}


/* =========================================================
   EXPERIMENTS
========================================================= */


/* =========================================================
   GET EXPERIMENT
========================================================= */

export function getExperimentProgress(
  grade,
  experimentId
) {

  const key =
    gradeKey(
      grade
    )


  if (!key) {
    return null
  }


  const progress =
    loadProgress()


  return (

    progress
      .experiments
      [key]
      [experimentId] ||

    null

  )

}


/* =========================================================
   SAVE EXPERIMENT PROGRESS
========================================================= */

export function saveExperimentProgress(
  grade,
  experimentId,
  data = {}
) {

  const key =
    gradeKey(
      grade
    )


  if (
    !key ||
    !experimentId
  ) {

    return null

  }


  return updateProgress(
    progress => {

      const old =
        progress
          .experiments
          [key]
          [experimentId] ||
        {}


      progress
        .experiments
        [key]
        [experimentId] = {

          ...old,

          ...data,

          grade:
            Number(
              grade
            ),

          experimentId,

          started:
            true,

          lastOpened:
            new Date()
              .toISOString()

        }


      saveLastActivityToObject(
        progress,
        {

          type:
            'experiment',

          grade:
            Number(
              grade
            ),

          experimentId

        }
      )


      return progress

    }
  )

}


/* =========================================================
   SAVE EXPERIMENT STEP
========================================================= */

export function saveExperimentStep(
  grade,
  experimentId,
  {

    currentStep = 0,

    completedSteps = [],

    score = 0,

    answers = {},

    prediction = null,

    extra = {}

  } = {}
) {

  return saveExperimentProgress(

    grade,

    experimentId,

    {

      currentStep:

        Math.max(
          0,
          Number(
            currentStep
          ) ||
          0
        ),


      completedSteps:

        Array.from(
          new Set(
            completedSteps
          )
        ),


      score:

        Number(
          score
        ) ||
        0,


      answers,

      prediction,

      ...extra

    }

  )

}


/* =========================================================
   MARK EXPERIMENT COMPLETED
========================================================= */

export function markExperimentCompleted(
  grade,
  experimentId,
  data = {}
) {

  const key =
    gradeKey(
      grade
    )


  if (
    !key ||
    !experimentId
  ) {

    return null

  }


  return updateProgress(
    progress => {

      const old =
        progress
          .experiments
          [key]
          [experimentId] ||
        {}


      const alreadyCompleted =
        old.completed ===
        true


      progress
        .experiments
        [key]
        [experimentId] = {

          ...old,

          ...data,

          grade:
            Number(
              grade
            ),

          experimentId,

          started:
            true,

          completed:
            true,

          progress:
            100,

          completedAt:
            old.completedAt ||
            new Date()
              .toISOString(),

          lastOpened:
            new Date()
              .toISOString()

        }


      uniquePush(

        progress
          .experiments
          .completed,

        experimentId

      )


      if (
        !alreadyCompleted
      ) {

        progress
          .experiments
          .totalCompleted +=
          1


        progress
          .statistics
          .completedExperiments +=
          1

      }


      saveLastActivityToObject(
        progress,
        {

          type:
            'experiment',

          grade:
            Number(
              grade
            ),

          experimentId,

          completed:
            true

        }
      )


      return progress

    }
  )

}


/* =========================================================
   RESET ONE EXPERIMENT
========================================================= */

export function resetExperimentProgress(
  grade,
  experimentId
) {

  const key =
    gradeKey(
      grade
    )


  if (
    !key ||
    !experimentId
  ) {

    return false

  }


  updateProgress(
    progress => {

      delete progress
        .experiments
        [key]
        [experimentId]


      progress
        .experiments
        .completed =
        progress
          .experiments
          .completed
          .filter(
            id =>
              id !==
              experimentId
          )


      progress
        .experiments
        .totalCompleted =
        progress
          .experiments
          .completed
          .length


      progress
        .statistics
        .completedExperiments =
        progress
          .experiments
          .completed
          .length


      return progress

    }
  )


  return true

}


/* =========================================================
   TIME TRACKING
========================================================= */

export function addLearningTime(
  seconds
) {

  const amount =
    Math.max(
      0,
      Number(
        seconds
      ) ||
      0
    )


  return updateProgress(
    progress => {

      progress
        .statistics
        .totalLearningTimeSeconds +=
        amount


      return progress

    }
  )

}


export function addExperimentTime(
  seconds
) {

  const amount =
    Math.max(
      0,
      Number(
        seconds
      ) ||
      0
    )


  return updateProgress(
    progress => {

      progress
        .statistics
        .totalExperimentTimeSeconds +=
        amount


      return progress

    }
  )

}


/* =========================================================
   LAST ACTIVITY
========================================================= */

function saveLastActivityToObject(
  progress,
  activity
) {

  progress.lastActivity = {

    ...activity,

    timestamp:
      new Date()
        .toISOString()

  }

}


export function saveLastActivity(
  activity
) {

  return updateProgress(
    progress => {

      saveLastActivityToObject(
        progress,
        activity
      )


      return progress

    }
  )

}


export function getLastActivity() {

  return loadProgress()
    .lastActivity

}


/* =========================================================
   GET GRADE SUMMARY
========================================================= */

export function getGradeSummary(
  grade
) {

  const key =
    gradeKey(
      grade
    )


  if (!key) {

    return null

  }


  const progress =
    loadProgress()


  const lessons =
    Object.values(

      progress
        .learning
        [key]
        .lessons

    )


  const experiments =
    Object.values(

      progress
        .experiments
        [key]

    )


  return {

    grade:
      Number(
        grade
      ),


    startedLessons:
      lessons.length,


    completedLessons:
      lessons.filter(
        item =>
          item.completed
      ).length,


    startedExperiments:
      experiments.length,


    completedExperiments:
      experiments.filter(
        item =>
          item.completed
      ).length

  }

}


/* =========================================================
   OVERALL SUMMARY
========================================================= */

export function getProgressSummary() {

  const progress =
    loadProgress()


  return {

    totalXP:
      progress
        .learning
        .totalXP,


    correctAnswers:
      progress
        .statistics
        .correctAnswers,


    totalAnswers:
      progress
        .statistics
        .totalAnswers,


    completedLessons:
      progress
        .statistics
        .completedLessons,


    completedExperiments:
      progress
        .statistics
        .completedExperiments,


    learningTimeSeconds:
      progress
        .statistics
        .totalLearningTimeSeconds,


    experimentTimeSeconds:
      progress
        .statistics
        .totalExperimentTimeSeconds,


    lastActivity:
      progress
        .lastActivity

  }

}


/* =========================================================
   EXPORT BACKUP
========================================================= */

export function exportProgressJSON() {

  const progress =
    loadProgress()


  return JSON.stringify(

    progress,

    null,

    2

  )

}


/* =========================================================
   IMPORT BACKUP
========================================================= */

export function importProgressJSON(
  json
) {

  const parsed =
    typeof json ===
      'string'

      ? safeParse(
          json
        )

      : json


  if (
    !isObject(
      parsed
    )
  ) {

    return false

  }


  const merged =
    deepMerge(

      createDefaultProgress(),

      parsed

    )


  merged.version =
    PROGRESS_SCHEMA_VERSION


  return saveProgress(
    merged
  )

}


/* =========================================================
   RESET EVERYTHING
========================================================= */

export function resetAllProgress() {

  if (
    !storageAvailable()
  ) {

    return false

  }


  const fresh =
    createDefaultProgress()


  localStorage.setItem(

    PROGRESS_STORAGE_KEY,

    JSON.stringify(
      fresh
    )

  )


  dispatchProgressChanged(
    fresh
  )


  return true

}


/* =========================================================
   DELETE STORAGE
========================================================= */

export function deleteProgressStorage() {

  if (
    !storageAvailable()
  ) {

    return false

  }


  localStorage.removeItem(
    PROGRESS_STORAGE_KEY
  )


  dispatchProgressChanged(
    createDefaultProgress()
  )


  return true

}


/* =========================================================
   EVENTS

   UI khác có thể listen:

   window.addEventListener(
     'chemlab:progress-changed',
     event => ...
   )
========================================================= */

function dispatchProgressChanged(
  progress
) {

  window.dispatchEvent(

    new CustomEvent(
      'chemlab:progress-changed',

      {

        detail:
          progress

      }
    )

  )

}


/* =========================================================
   INITIALIZE
========================================================= */

export function initProgressStorage() {

  const progress =
    loadProgress()


  saveProgress(
    progress
  )


  return progress

}