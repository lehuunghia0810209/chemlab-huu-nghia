/* =========================================================
   CHEMLAB 5.2.2 — ROUTE MODULE LOADER

   Heavy routes are lazy-loaded so the Periodic landing view
   does not pull Tools, Learning, Lab or Three.js up front.
========================================================= */

export function createRouteModuleLoader({
  version,
  routeProgress,
  appStatus,
  hosts,
  safeInit,
  renderModuleError,
  getCurrentView
}) {
  const state = {
    home: {
      status: 'ready',
      promise: Promise.resolve(true),
      host: hosts.home,
      label: 'Tổng quan'
    },
    periodic: {
      status: 'ready',
      promise: Promise.resolve(true),
      host: hosts.periodic,
      label: 'Bảng tuần hoàn'
    },
    tools: {
      status: 'idle',
      promise: null,
      host: hosts.tools,
      label: 'Công cụ hóa học'
    },
    learning: {
      status: 'idle',
      promise: null,
      host: hosts.learning,
      label: 'Học tập'
    },
    lab: {
      status: 'idle',
      promise: null,
      host: hosts.lab,
      label: 'Phòng thí nghiệm'
    }
  }

  let activeRouteLoads = 0

  function setAppStatus(
    message,
    status = 'ready'
  ) {
    if (!appStatus) return

    appStatus.classList.remove(
      'is-ready',
      'is-loading',
      'is-error'
    )

    appStatus.classList.add(
      `is-${status}`
    )

    const label =
      appStatus.querySelector('span')

    if (label) {
      label.textContent = message
    }
  }

  function beginRouteLoad() {
    activeRouteLoads += 1

    routeProgress
      ?.classList
      .add('is-active')
  }

  function endRouteLoad() {
    activeRouteLoads = Math.max(
      0,
      activeRouteLoads - 1
    )

    if (activeRouteLoads === 0) {
      routeProgress
        ?.classList
        .remove('is-active')
    }
  }

  function renderViewLoading(
    host,
    label
  ) {
    if (!host) return

    host
      .querySelector('.v5-view-loader')
      ?.remove()

    const loader =
      document.createElement('section')

    loader.className =
      'v5-view-loader'

    loader.setAttribute(
      'role',
      'status'
    )

    loader.setAttribute(
      'aria-live',
      'polite'
    )

    loader.innerHTML = `
      <div class="v5-loader-head">
        <span class="v5-loader-orbit" aria-hidden="true">
          <i></i>
        </span>

        <div>
          <strong>Đang chuẩn bị ${label}</strong>
          <span>
            ChemLab chỉ tải module khi bạn cần để mở trang nhanh hơn.
          </span>
        </div>
      </div>

      <div class="v5-loader-grid" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `

    host.prepend(loader)
  }

  function clearViewLoading(host) {
    host
      ?.querySelector('.v5-view-loader')
      ?.remove()
  }

  function renderRouteLoadError(
    host,
    viewName,
    label
  ) {
    if (!host) return

    clearViewLoading(host)

    host
      .querySelector('.v5-route-error')
      ?.remove()

    const node =
      document.createElement('section')

    node.className =
      'v5-route-error'

    node.innerHTML = `
      <div class="v5-route-error-icon" aria-hidden="true">!</div>

      <div>
        <strong>Chưa tải được ${label}</strong>
        <p>
          Kết nối hoặc một file module có thể đang gặp lỗi.
          Các khu vực khác của ChemLab vẫn hoạt động bình thường.
        </p>
      </div>

      <button
        type="button"
        data-retry-view="${viewName}"
      >
        Thử lại
      </button>
    `

    host.prepend(node)
  }

  async function loadToolsRoute() {
    const specs = [
      {
        label: 'Cân bằng phương trình',
        load: () => import('./balancer.js'),
        init: 'initEquationBalancer',
        host: hosts.tools
      },
      {
        label: 'Máy tính hóa học',
        load: () => import('./chemCalculator.js'),
        init: 'initChemCalculator',
        host: hosts.tools
      },
      {
        label: 'Bảng tính tan',
        load: () => import('./solubilityTable.js'),
        init: 'initSolubilityTable',
        host: hosts.tools
      },
      {
        label: 'Ion Engine',
        load: () => import('./ionEngine.js'),
        init: 'initIonEngine',
        host: hosts.tools
      },
      {
        label: 'Ion Reset',
        load: () => import('./ionEngineReset.js'),
        init: 'initIonEngineReset',
        host: null
      },
      {
        label: 'Orbital Atlas',
        load: () => import('./orbitalAtlas.js'),
        init: 'initOrbitalAtlas',
        host: hosts.tools
      },
      {
        label: 'Tool Center',
        load: () => import('./toolHub.js'),
        init: 'initToolHub',
        host: hosts.tools,
        last: true
      }
    ]

    const results =
      await Promise.allSettled(
        specs.map(spec => spec.load())
      )

    let loadedVisualModules = 0

    const initialize = last => {
      specs.forEach((spec, index) => {
        if (Boolean(spec.last) !== last) {
          return
        }

        const result = results[index]

        if (result.status !== 'fulfilled') {
          console.error(
            `[ChemLab ${version}] Không thể tải ${spec.label}:`,
            result.reason
          )

          if (spec.host) {
            renderModuleError(
              spec.host,
              spec.label
            )
          }

          return
        }

        const initializer =
          result.value[spec.init]

        if (typeof initializer !== 'function') {
          console.error(
            `[ChemLab ${version}] ${spec.label} không export ${spec.init}.`
          )

          if (spec.host) {
            renderModuleError(
              spec.host,
              spec.label
            )
          }

          return
        }

        const ok = safeInit(
          spec.label,
          initializer,
          spec.host
        )

        if (ok && spec.host) {
          loadedVisualModules += 1
        }
      })
    }

    /* Tool Center must run after the tool modules exist. */
    initialize(false)
    initialize(true)

    if (loadedVisualModules === 0) {
      throw new Error(
        'Không có module công cụ nào tải thành công.'
      )
    }
  }

  async function loadLearningRoute() {
    const {
      initQuiz
    } = await import('./quiz.js')

    const learningReady = safeInit(
      'Learning',
      initQuiz,
      hosts.learning
    )

    if (!learningReady) return

    const quiz =
      document.querySelector('#quiz')

    if (
      quiz &&
      hosts.learning &&
      quiz.parentElement !== hosts.learning
    ) {
      hosts.learning.appendChild(quiz)
    }
  }

  async function loadLabRoute() {
    const [
      virtualLabResult,
      guidedResult
    ] = await Promise.allSettled([
      import('./virtualLab.js'),
      import('./lab/experiments/guidedExperiments.js')
    ])

    if (virtualLabResult.status !== 'fulfilled') {
      throw virtualLabResult.reason
    }

    const labReady = safeInit(
      'Phòng thí nghiệm',
      virtualLabResult.value.initVirtualLab,
      hosts.lab
    )

    if (!labReady) return

    const lab =
      document.querySelector('#lab')

    if (
      lab &&
      hosts.lab &&
      lab.parentElement !== hosts.lab
    ) {
      hosts.lab.appendChild(lab)
    }

    const labLabel =
      hosts.lab
        ?.querySelector(
          '.vl-head > div:first-child > span'
        )

    if (labLabel) {
      labLabel.textContent =
        'PHÒNG THÍ NGHIỆM ẢO'
    }

    if (guidedResult.status === 'fulfilled') {
      safeInit(
        'Guided Experiments',
        guidedResult.value.initGuidedExperiments,
        hosts.lab
      )
    } else {
      console.error(
        `[ChemLab ${version}] Không thể tải Guided Experiments:`,
        guidedResult.reason
      )

      renderModuleError(
        hosts.lab,
        'Guided Experiments'
      )
    }
  }

  const loaders = {
    tools: loadToolsRoute,
    learning: loadLearningRoute,
    lab: loadLabRoute
  }

  function ensureViewReady(
    viewName,
    {
      retry = false
    } = {}
  ) {
    const route = state[viewName]

    if (!route) {
      return Promise.resolve(false)
    }

    if (route.status === 'ready') {
      return route.promise ||
        Promise.resolve(true)
    }

    if (
      route.status === 'loading' &&
      route.promise
    ) {
      return route.promise
    }

    if (
      route.status === 'error' &&
      !retry
    ) {
      return Promise.resolve(false)
    }

    const loader = loaders[viewName]

    if (!loader) {
      return Promise.resolve(true)
    }

    route.status = 'loading'

    route.host?.setAttribute(
      'data-module-state',
      'loading'
    )

    route.host?.setAttribute(
      'aria-busy',
      'true'
    )

    route.host
      ?.querySelector('.v5-route-error')
      ?.remove()

    renderViewLoading(
      route.host,
      route.label
    )

    if (getCurrentView() === viewName) {
      setAppStatus(
        `Đang tải ${route.label}…`,
        'loading'
      )
    }

    beginRouteLoad()

    route.promise = loader()
      .then(() => {
        route.status = 'ready'

        route.host?.setAttribute(
          'data-module-state',
          'ready'
        )

        route.host?.setAttribute(
          'aria-busy',
          'false'
        )

        clearViewLoading(route.host)

        if (getCurrentView() === viewName) {
          setAppStatus(
            'Sẵn sàng',
            'ready'
          )
        }

        window.dispatchEvent(
          new CustomEvent(
            'chemlab:view-ready',
            {
              detail: {
                view: viewName
              }
            }
          )
        )

        return true
      })
      .catch(error => {
        route.status = 'error'

        route.host?.setAttribute(
          'data-module-state',
          'error'
        )

        route.host?.setAttribute(
          'aria-busy',
          'false'
        )

        console.error(
          `[ChemLab ${version}] Không thể tải route ${viewName}:`,
          error
        )

        renderRouteLoadError(
          route.host,
          viewName,
          route.label
        )

        if (getCurrentView() === viewName) {
          setAppStatus(
            'Có lỗi khi tải',
            'error'
          )
        }

        return false
      })
      .finally(endRouteLoad)

    return route.promise
  }

  function openToolWhenReady(toolId) {
    return ensureViewReady('tools')
      .then(ready => {
        if (!ready) return false

        window
          .ChemLabTools
          ?.open(toolId)

        return true
      })
  }

  function retryView(viewName) {
    const route = state[viewName]

    if (!route) {
      return Promise.resolve(false)
    }

    route.status = 'idle'
    route.promise = null

    return ensureViewReady(
      viewName,
      { retry: true }
    )
  }

  function getStatus(viewName) {
    return state[viewName]?.status ||
      'idle'
  }

  return Object.freeze({
    ensureViewReady,
    openToolWhenReady,
    retryView,
    getStatus,
    setAppStatus
  })
}
