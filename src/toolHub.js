import './toolHub.css'

const TOOL_STORAGE_KEY =
  'chemlab-active-tool'


const TOOLS = [
  {
    id: 'balancer',
    title: 'Cân bằng PTHH',
    description:
      'Cân bằng phương trình và kiểm tra nguyên tử.',
    icon: '⚖',
    accent: 'violet',
    selectors: [
      '#equation-balancer',
      '.balance-tool'
    ]
  },

  {
    id: 'calculator',
    title: 'Máy tính hóa học',
    description:
      'Mol, nồng độ, khối lượng và thể tích khí.',
    icon: '∑',
    accent: 'blue',
    selectors: [
      '#chem-calculator-v4',
      '.chem-calc-v4'
    ]
  },

  {
    id: 'solubility',
    title: 'Bảng tính tan',
    description:
      'Tra cứu khả năng tan của hợp chất ion.',
    icon: '◫',
    accent: 'green',
    selectors: [
      '#solubility-tool',
      '.sol-tool'
    ]
  },

  {
    id: 'ions',
    title: 'Không gian ion',
    description:
      'Tra ion và tự tạo công thức hợp chất.',
    icon: '±',
    accent: 'orange',
    selectors: [
      '#ion-engine',
      '.ion-engine'
    ]
  },

  {
    id: 'orbital',
    title: 'Orbital Atlas',
    description:
      'Khám phá orbital s, p, d và f trong 3D.',
    icon: '◎',
    accent: 'pink',
    selectors: [
      '#orbital-atlas'
    ]
  }
]


export function initToolHub() {
  const toolsRoot =
    document.querySelector('#tools')

  if (!toolsRoot) return

  if (
    toolsRoot.dataset
      .toolHubReady === 'true'
  ) {
    return
  }

  toolsRoot.dataset
    .toolHubReady = 'true'

  const moduleMap =
    new Map()

  TOOLS.forEach(tool => {
    const element =
      findToolElement(
        toolsRoot,
        tool.selectors
      )

    if (element) {
      moduleMap.set(
        tool.id,
        element
      )
    }
  })

  if (!moduleMap.size) return

  let activeTool =
    loadActiveTool()

  if (
    !moduleMap.has(
      activeTool
    )
  ) {
    activeTool =
      TOOLS.find(tool =>
        moduleMap.has(tool.id)
      )?.id || 'balancer'
  }

  const hub =
    document.createElement('div')

  hub.className =
    'chem-tool-hub'

  hub.innerHTML = `
    <section class="tool-hub-header">
      <div>
        <span class="tool-hub-eyebrow">
          CHEMLAB TOOLBOX
        </span>

        <h2>
          Chọn công cụ
        </h2>

        <p>
          Mỗi công cụ hoạt động trong
          một workspace riêng.
        </p>
      </div>

      <div class="tool-hub-status">
        <i></i>

        <span>
          ${moduleMap.size} công cụ
        </span>
      </div>
    </section>


    <nav
      class="tool-selector"
      role="tablist"
      aria-label="Chọn công cụ hóa học"
    >
      ${
        TOOLS
          .filter(tool =>
            moduleMap.has(tool.id)
          )
          .map(tool => `
            <button
              type="button"
              class="
                tool-selector-card
                ${tool.accent}
              "
              data-tool="${tool.id}"
              role="tab"
              aria-selected="false"
            >
              <span class="tool-selector-icon">
                ${tool.icon}
              </span>

              <span class="tool-selector-copy">
                <strong>
                  ${tool.title}
                </strong>

                <small>
                  ${tool.description}
                </small>
              </span>

              <span
                class="tool-selector-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          `)
          .join('')
      }
    </nav>


    <div class="tool-active-bar">
      <div>
        <span>
          ĐANG SỬ DỤNG
        </span>

        <strong id="tool-active-name">
          —
        </strong>
      </div>

      <div class="tool-active-help">
        <span>
          Chọn công cụ khác ở phía trên
        </span>
      </div>
    </div>


    <div
      id="tool-stage"
      class="tool-stage"
    ></div>
  `

  toolsRoot.prepend(hub)

  const stage =
    hub.querySelector('#tool-stage')

  TOOLS.forEach(tool => {
    const module =
      moduleMap.get(tool.id)

    if (!module) return

    module.dataset
      .toolModule =
      tool.id

    module.classList.add(
      'tool-hub-module'
    )

    stage.appendChild(module)
  })

  const selector =
    hub.querySelector(
      '.tool-selector'
    )

  selector.addEventListener(
    'click',
    event => {
      const button =
        event.target.closest(
          '[data-tool]'
        )

      if (!button) return

      setActiveTool(
        button.dataset.tool,
        true
      )
    }
  )

  selector.addEventListener(
    'keydown',
    event => {
      if (
        ![
          'ArrowLeft',
          'ArrowRight',
          'Home',
          'End'
        ].includes(event.key)
      ) {
        return
      }

      const buttons =
        [
          ...selector.querySelectorAll(
            '[data-tool]'
          )
        ]

      const index =
        buttons.indexOf(
          event.target
        )

      if (index < 0) return

      event.preventDefault()

      let next = index

      if (event.key === 'Home') {
        next = 0
      }

      if (event.key === 'End') {
        next =
          buttons.length - 1
      }

      if (
        event.key === 'ArrowLeft'
      ) {
        next =
          (
            index -
            1 +
            buttons.length
          ) %
          buttons.length
      }

      if (
        event.key === 'ArrowRight'
      ) {
        next =
          (
            index +
            1
          ) %
          buttons.length
      }

      const button =
        buttons[next]

      button?.focus()

      if (button) {
        setActiveTool(
          button.dataset.tool,
          true
        )
      }
    }
  )

  window.ChemLabTools = {
    open(toolId) {
      setActiveTool(
        toolId,
        true
      )
    },

    current() {
      return activeTool
    }
  }

  function setActiveTool(
    toolId,
    userAction = false
  ) {
    if (
      !moduleMap.has(toolId)
    ) {
      return
    }

    activeTool =
      toolId

    saveActiveTool(
      toolId
    )

    hub
      .querySelectorAll(
        '[data-tool]'
      )
      .forEach(button => {
        const active =
          button.dataset.tool ===
          toolId

        button.classList.toggle(
          'active',
          active
        )

        button.setAttribute(
          'aria-selected',
          String(active)
        )

        button.tabIndex =
          active ? 0 : -1
      })

    hub
      .querySelectorAll(
        '[data-tool-module]'
      )
      .forEach(module => {
        const active =
          module.dataset
            .toolModule ===
          toolId

        module.hidden =
          !active

        module.classList.toggle(
          'active',
          active
        )
      })

    const tool =
      TOOLS.find(
        item =>
          item.id ===
          toolId
      )

    hub
      .querySelector(
        '#tool-active-name'
      )
      .textContent =
      tool?.title ||
      'Công cụ'

    if (userAction) {
      const reduceMotion =
        window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches

      hub
        .querySelector(
          '.tool-active-bar'
        )
        ?.scrollIntoView({
          behavior:
            reduceMotion
              ? 'auto'
              : 'smooth',

          block:
            'start'
        })
    }
  }

  setActiveTool(
    activeTool,
    false
  )
}


function findToolElement(
  root,
  selectors
) {
  for (
    const selector
    of selectors
  ) {
    const element =
      root.querySelector(
        selector
      )

    if (element) {
      return element
    }
  }

  return null
}


function loadActiveTool() {
  try {
    return (
      localStorage.getItem(
        TOOL_STORAGE_KEY
      ) ||
      'balancer'
    )
  }
  catch {
    return 'balancer'
  }
}


function saveActiveTool(
  toolId
) {
  try {
    localStorage.setItem(
      TOOL_STORAGE_KEY,
      toolId
    )
  }
  catch {
    /* ignore */
  }
}