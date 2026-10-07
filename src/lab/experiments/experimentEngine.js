import {

  getExperimentProgress,

  saveExperimentStep,

  markExperimentCompleted,

  resetExperimentProgress

} from '../../progress/progressStorage.js'


/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  )

}


function createEmptyState() {

  return {

    currentStep:
      0,

    completedSteps:
      new Set(),

    score:
      0,

    answers:
      {},

    completed:
      false,

    started:
      false,

    lastResult:
      null,

    labSnapshot:
      null,

    labConfirmation:
      null

  }

}


/* =========================================================
   LOAD SAVED STATE
========================================================= */

function normalizeSavedState(
  experiment
) {

  const saved =
    getExperimentProgress(
      experiment.grade,
      experiment.id
    )


  if (!saved) {

    return createEmptyState()

  }


  const maxStep =
    experiment.steps.length


  return {

    currentStep:
      clamp(

        Number(
          saved.currentStep ||
          0
        ),

        0,

        maxStep

      ),


    completedSteps:
      new Set(

        Array.isArray(
          saved.completedSteps
        )

          ? saved.completedSteps

          : []

      ),


    score:
      Number(
        saved.score ||
        0
      ),


    answers:

      saved.answers &&
      typeof saved.answers ===
        'object'

        ? {
            ...saved.answers
          }

        : {},


    completed:
      saved.completed ===
      true,


    started:
      saved.started ===
      true,


    lastResult:
      null,


    labSnapshot:
      saved.labSnapshot ||
      null,

    labConfirmation:
      saved.labConfirmation &&
      typeof saved.labConfirmation ===
        'object'

        ? {
            ...saved.labConfirmation
          }

        : null

  }

}


/* =========================================================
   LAB ACTION MATCHING
========================================================= */

function actionMatchesStep(
  action,
  step
) {

  if (
    !action ||
    !step
  ) {

    return false

  }


  if (
    step.type ===
    'add'
  ) {

    return (

      action.type ===
        'add' &&

      action.chemical ===
        step.chemical

    )

  }


  if (
    step.type ===
    'heat'
  ) {

    return (

      action.type ===
        'heat' &&

      action.heating ===
        true

    )

  }


  if (
    step.type ===
    'reaction'
  ) {

    return (

      action.type ===
        'reaction' &&

      action.reactionId ===
        step.reaction

    )

  }


  if (
    step.type ===
    'temperature'
  ) {

    const temperature =
      Number(
        action.temperature
      )


    const min =
      step.minTemperature !==
        undefined

        ? Number(
            step.minTemperature
          )

        : -Infinity


    const max =
      step.maxTemperature !==
        undefined

        ? Number(
            step.maxTemperature
          )

        : Infinity


    return (

      action.type ===
        'temperature' &&

      Number.isFinite(
        temperature
      ) &&

      temperature >=
        min &&

      temperature <=
        max

    )

  }


  if (
    step.type ===
    'indicator'
  ) {

    const indicatorMatches =
      !step.indicator ||
      action.indicator ===
        step.indicator


    const resultMatches =
      !step.result ||
      action.result ===
        step.result


    return (

      action.type ===
        'indicator' &&

      indicatorMatches &&

      resultMatches

    )

  }


  return false

}


/* =========================================================
   CREATE ENGINE
========================================================= */

export function createExperimentEngine({

  experiment,

  onUpdate =
    () => {},

  onComplete =
    () => {}

} = {}) {


  if (
    !experiment?.id
  ) {

    throw new Error(
      'Experiment is required.'
    )

  }


  if (
    !Array.isArray(
      experiment.steps
    )
  ) {

    throw new Error(
      `Experiment "${experiment.id}" has no steps.`
    )

  }


  let state =
    normalizeSavedState(
      experiment
    )


  let active =
    false


  /* =====================================================
     CURRENT STEP
  ===================================================== */

  function getCurrentStep() {

    if (
      state.completed
    ) {

      return null

    }


    return (

      experiment
        .steps
        [state.currentStep] ||

      null

    )

  }


  /* =====================================================
     PUBLIC SNAPSHOT
  ===================================================== */

  function snapshot() {

    const totalSteps =
      experiment
        .steps
        .length


    return {

      experiment,


      currentStep:
        state.currentStep,


      currentStepData:
        getCurrentStep(),


      completedSteps:
        [
          ...state.completedSteps
        ],


      score:
        state.score,


      answers:
        {
          ...state.answers
        },


      completed:
        state.completed,


      started:
        state.started,


      lastResult:
        state.lastResult,


      labSnapshot:
        state.labSnapshot,


      labConfirmation:
        state.labConfirmation

          ? {
              ...state.labConfirmation
            }

          : null,


      awaitingLabConfirmation:
        Boolean(
          state.labConfirmation &&
          state.labConfirmation.stepIndex ===
            state.currentStep
        ),


      totalSteps,


      progressPercent:

        totalSteps

          ? Math.round(

              state
                .completedSteps
                .size /

              totalSteps *

              100

            )

          : 0

    }

  }


  /* =====================================================
     SAVE
  ===================================================== */

  function persist() {

    saveExperimentStep(

      experiment.grade,

      experiment.id,

      {

        currentStep:
          state.currentStep,


        completedSteps:
          [
            ...state.completedSteps
          ],


        score:
          state.score,


        answers:
          state.answers,


        extra: {

          started:
            true,

          completed:
            state.completed,

          labSnapshot:
            state.labSnapshot,

          labConfirmation:
            state.labConfirmation

        }

      }

    )

  }


  function notify() {

    onUpdate(
      snapshot()
    )

  }


  /* =====================================================
     COMPLETE ACTIVITY
  ===================================================== */

  function finishExperiment() {

    if (
      state.completed
    ) {

      return snapshot()

    }


    state.completed =
      true


    state.currentStep =
      experiment
        .steps
        .length


    markExperimentCompleted(

      experiment.grade,

      experiment.id,

      {

        score:
          state.score,


        completedSteps:
          [
            ...state.completedSteps
          ],


        answers:
          state.answers,


        labSnapshot:
          state.labSnapshot,


        labConfirmation:
          null,


        currentStep:
          experiment
            .steps
            .length

      }

    )


    const data =
      snapshot()


    onUpdate(
      data
    )


    onComplete(
      data
    )


    return data

  }


  /* =====================================================
     COMPLETE CURRENT STEP
  ===================================================== */

  function completeCurrentStep(
    result = null
  ) {

    if (
      state.completed
    ) {

      return snapshot()

    }


    const index =
      state.currentStep


    state
      .completedSteps
      .add(
        index
      )


    state.lastResult =
      result


    state.labConfirmation =
      null


    state.currentStep +=
      1


    state.started =
      true


    if (
      state.currentStep >=
      experiment.steps.length
    ) {

      return finishExperiment()

    }


    persist()

    notify()


    return snapshot()

  }


  /* =====================================================
     MANUAL CONTINUE

     Dùng cho:
     info / theory / note / observation
  ===================================================== */

  function continueStep() {

    const step =
      getCurrentStep()


    if (!step) {

      return {

        accepted:
          false,

        message:
          'Không còn bước nào để tiếp tục.'

      }

    }


    const manualTypes =
      new Set([
        'info',
        'theory',
        'note',
        'observation'
      ])


    if (
      !manualTypes.has(
        step.type
      )
    ) {

      return {

        accepted:
          false,

        message:
          'Bước hiện tại không thể chuyển thủ công.'

      }

    }


    completeCurrentStep({

      type:
        'success',

      message:
        step.success ||
        ''

    })


    return {

      accepted:
        true

    }

  }


  /* =====================================================
     LAB ACTION
  ===================================================== */

  function handleLabAction(
    event
  ) {

    if (
      !active ||
      state.completed
    ) {

      return

    }


    const action =
      event?.detail ||
      event


    /*
      Lưu trạng thái thật của cốc sau mọi thao tác.
      Nhờ vậy có thể F5 / đóng trình duyệt / quay lại sau.
    */

    if (
      action?.snapshot
    ) {

      state.labSnapshot =
        action.snapshot


      persist()

    }


    const step =
      getCurrentStep()


    if (
      actionMatchesStep(
        action,
        step
      )
    ) {

      const result = {

        type:
          'success',

        message:

          step.success ||

          (
            step.type ===
              'reaction'

              ? 'Phản ứng đã xảy ra. Hãy quan sát hiện tượng và phương trình trước khi tiếp tục.'

              : step.type ===
                  'indicator'

                ? 'Đã có kết quả thử bằng giấy quỳ tím. Hãy quan sát màu giấy trước khi tiếp tục.'

                : 'Bước đã hoàn thành.'
          )

      }


      const requiresConfirmation =

        step.type ===
          'reaction' ||

        step.type ===
          'indicator' ||

        step.confirmBeforeContinue ===
          true


      if (
        requiresConfirmation
      ) {

        state.started =
          true


        state.lastResult =
          result


        state.labConfirmation = {

          stepIndex:
            state.currentStep,

          type:
            step.type,

          reactionId:
            action.reactionId ||
            null,

          indicator:
            action.indicator ||
            null,

          indicatorResult:
            action.result ||
            null

        }


        persist()

        notify()

        return

      }


      completeCurrentStep(
        result
      )

    }

  }


  /* =====================================================
     CONFIRM LAB RESULT

     Reaction/indicator steps are intentionally held here
     so learners can inspect the result before advancing.
  ===================================================== */

  function confirmLabStep() {

    const step =
      getCurrentStep()


    const confirmation =
      state.labConfirmation


    if (
      !step ||
      !confirmation ||
      confirmation.stepIndex !==
        state.currentStep
    ) {

      return {

        accepted:
          false,

        message:
          'Chưa có kết quả thí nghiệm nào cần xác nhận.'

      }

    }


    const result =
      state.lastResult ||
      {
        type:
          'success',

        message:
          'Đã quan sát kết quả.'
      }


    completeCurrentStep(
      result
    )


    return {

      accepted:
        true

    }

  }


  /* =====================================================
     ANSWER PREDICTION / QUIZ
  ===================================================== */

  function answerPrediction(
    optionId
  ) {

    const step =
      getCurrentStep()


    if (
      !step ||
      (
        step.type !==
          'prediction' &&

        step.type !==
          'quiz'
      )
    ) {

      return {

        accepted:
          false,

        correct:
          false,

        message:
          'Bước hiện tại không phải câu hỏi.'

      }

    }


    const answerKey =

      step.id ||

      `step-${state.currentStep}`


    const correct =
      optionId ===
      step.correct


    state.answers[
      answerKey
    ] = {

      answer:
        optionId,

      correct,

      answeredAt:
        new Date()
          .toISOString()

    }


    if (
      correct
    ) {

      state.score +=
        Number(
          step.score ||
          1
        )


      state.lastResult = {

        type:
          'success',

        message:

          step.explanation ||

          'Chính xác.'

      }


      completeCurrentStep(
        state.lastResult
      )

    }

    else {

      state.lastResult = {

        type:
          'error',

        message:

          step.incorrectMessage ||

          'Chưa chính xác. Hãy suy nghĩ và thử lại.'

      }


      persist()

      notify()

    }


    return {

      accepted:
        true,

      correct,

      message:
        state.lastResult
          ?.message ||
        ''

    }

  }


  /* =====================================================
     START / RESUME / PAUSE
  ===================================================== */

  function start() {

    if (
      active
    ) {

      notify()

      return snapshot()

    }


    active =
      true


    state.started =
      true


    window.addEventListener(

      'chemlab:lab-action',

      handleLabAction

    )


    persist()

    notify()


    return snapshot()

  }


  function pause() {

    active =
      false


    window.removeEventListener(

      'chemlab:lab-action',

      handleLabAction

    )

  }


  function destroy() {

    pause()

  }


  function restart() {

    resetExperimentProgress(

      experiment.grade,

      experiment.id

    )


    state =
      createEmptyState()


    persist()

    notify()


    return snapshot()

  }


  function resume() {

    state =
      normalizeSavedState(
        experiment
      )


    return start()

  }


  /* =====================================================
     PUBLIC API
  ===================================================== */

  return {

    start,

    resume,

    pause,

    restart,

    destroy,

    continueStep,

    confirmLabStep,

    answerPrediction,

    getState:
      snapshot,

    getCurrentStep

  }

}