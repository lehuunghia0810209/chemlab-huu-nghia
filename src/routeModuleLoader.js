
export function createRouteModuleLoader({
  version,
  routeProgress,
  appStatus,
  hosts,
  drawer,
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
      status: 'idle',
      promise: null,
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

  async function loadPeriodicRoute() {
    const { initPeriodicWorkspace } = await import('./periodic/periodicWorkspace.js')
    safeInit(
      'Bảng tuần hoàn',
      () => initPeriodicWorkspace({ root: hosts.periodic, drawer }),
      hosts.periodic
    )
  }

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

    host.querySelector('.app-view-loader')?.remove()

    const loader = document.createElement('section')
    loader.className = 'app-view-loader'
    loader.setAttribute('role', 'status')
    loader.setAttribute('aria-live', 'polite')
    loader.innerHTML = `
      <span class="sr-only">Đang tải ${label}…</span>
      <div class="ui-skeleton app-view-loader__title" aria-hidden="true"></div>
      <div class="ui-skeleton app-view-loader__line" aria-hidden="true"></div>
      <div class="app-view-loader__grid" aria-hidden="true">
        <div class="ui-skeleton"></div>
        <div class="ui-skeleton"></div>
        <div class="ui-skeleton"></div>
      </div>
    `

    host.prepend(loader)
  }

  function clearViewLoading(host) {
    host
      ?.querySelector('.app-view-loader')
      ?.remove()
  }

  function renderRouteLoadError(
    host,
    viewName,
    label
  ) {
    if (!host) return

    clearViewLoading(host)

    host.querySelector('.app-route-error')?.remove()

    const node = document.createElement('section')
    node.className = 'ui-state ui-state--error app-route-error'
    node.setAttribute('role', 'alert')
    node.innerHTML = `
      <strong>Chưa tải được ${label}</strong>
      <span>Kết nối hoặc một tệp của mô-đun đang gặp lỗi. Các khu vực khác của ChemLab vẫn hoạt động.</span>
      <button class="ui-btn ui-btn--primary" type="button" data-retry-view="${viewName}">Thử lại</button>
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
      initLearning
    } = await import('./learning/learningApp.js')

    safeInit(
      'Learning',
      () => initLearning(hosts.learning),
      hosts.learning
    )
  }

  // One Laboratory page: the dynamic bench + library, and "Có hướng dẫn" (bench labs and curriculum lessons).
  async function loadLabRoute() {
    const [shellMod, dlabMod, virtualLabResult, guidedResult] = await Promise.allSettled([
      import('./labShell.js'),
      import('./dlab/ui/dlabApp.js'),
      import('./virtualLab.js'),
      import('./lab/experiments/guidedExperiments.js')
    ])
    if (shellMod.status !== 'fulfilled') throw shellMod.reason
    if (dlabMod.status !== 'fulfilled') throw dlabMod.reason
    const shell = shellMod.value.createLabShell(hosts.lab)
    const benchReady = safeInit(
      'Phòng thí nghiệm',
      () => dlabMod.value.initDynamicLab(shell.bench, { onGuided: shell.showGuided }),
      shell.bench
    )
    if (benchReady) shell.attach(window.ChemLabDynamicLab)

    // Curriculum lessons (quizzes, saved progress). A failure here leaves the bench working.
    if (virtualLabResult.status !== 'fulfilled' || guidedResult.status !== 'fulfilled') {
      console.error(`[ChemLab ${version}] Không thể tải Bài học theo chương trình:`, virtualLabResult.reason || guidedResult.reason)
      renderModuleError(shell.lessons, 'Bài học theo chương trình')
      return
    }
    if (!safeInit('Bàn minh họa bài học', virtualLabResult.value.initVirtualLab, shell.lessons)) return
    safeInit('Bài học theo chương trình', guidedResult.value.initGuidedExperiments, shell.lessons)
    shellMod.value.adoptCurriculum(shell.lessons)
    shell.openFromHash()
    window.addEventListener('hashchange', shell.openFromHash)
  }

  const loaders = {
    periodic: loadPeriodicRoute,
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
      ?.querySelector('.app-route-error')
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
