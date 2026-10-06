import './chemFlow.css'


/* =========================================================
   CHEMLAB 5.2
   CHEM FLOW ENGINE
========================================================= */

const SESSION_KEY =
  'chemlab-v52-context'

const HISTORY_KEY =
  'chemlab-v52-history'


const DESTINATIONS = {

  studio: {
    label: 'Compound Studio',
    view: null
  },

  reaction: {
    label: 'Reaction Studio',
    view: null
  },

  ion: {
    label: 'Ion Engine',
    view: 'tools',

    aliases: [
      'ion',
      'ions',
      'ion engine',
      'ion-engine'
    ]
  },

  molar: {
    label: 'Molar Mass',
    view: 'tools',

    aliases: [
      'calculator',
      'molar',
      'molar mass',
      'chem calculator'
    ]
  },

  solubility: {
    label: 'Tính tan',
    view: 'tools',

    aliases: [
      'solubility',
      'tính tan',
      'bang tinh tan',
      'bảng tính tan'
    ]
  },

  lab: {
    label: 'Virtual Lab',
    view: 'lab',

    aliases: [
      'lab',
      'virtual lab',
      'thí nghiệm'
    ]
  }

}


let currentContext =
  loadSession()


/* =========================================================
   OPEN FROM PERIODIC TABLE
========================================================= */

export async function openElementDestination(
  destination,
  element,
  options = {}
) {

  if (
    !element ||
    !DESTINATIONS[destination]
  ) {
    return
  }


  const ions =
    Array.isArray(
      options.ions
    )
      ? options.ions
      : []


  currentContext = {

    source:
      'periodic',

    destination,

    element: {

      number:
        Number(
          element.number
        ),

      symbol:
        String(
          element.symbol || ''
        ),

      name:
        String(
          element.name || ''
        )

    },

    ion:
      ions[0]
        ? normalizeIon(
            ions[0]
          )
        : null,

    ions:
      ions.map(
        normalizeIon
      ),

    compound:
      null,

    reaction:
      null,

    formula:
      String(
        element.symbol || ''
      ),

    updatedAt:
      Date.now()

  }


  commitContext(
    currentContext
  )


  await go(
    destination
  )

}


/* =========================================================
   SET CONTEXT
========================================================= */

export function setChemContext(
  patch = {}
) {

  currentContext = {

    ...(currentContext || {}),

    ...patch,

    updatedAt:
      Date.now()

  }


  commitContext(
    currentContext
  )


  renderFlowDock()


  return currentContext

}


/* =========================================================
   CAPTURE COMPOUND
========================================================= */

export function captureCompound(
  compound
) {

  if (
    !compound?.formula
  ) {
    return
  }


  currentContext = {

    ...(currentContext || {}),

    source:
      'compound-studio',

    compound: {

      formula:
        String(
          compound.formula
        ),

      name:
        String(
          compound.name ||
          `Hợp chất ${compound.formula}`
        ),

      cation:
        compound.cation ||
        null,

      anion:
        compound.anion ||
        null

    },

    formula:
      String(
        compound.formula
      ),

    updatedAt:
      Date.now()

  }


  commitContext(
    currentContext
  )


  renderFlowDock()


  showToast(
    `${compound.formula} đã được lưu vào Chem Flow`
  )


  return currentContext

}


/* =========================================================
   CAPTURE REACTION
========================================================= */

export function captureReaction(
  reaction
) {

  if (
    !reaction?.balanced
  ) {
    return
  }


  currentContext = {

    ...(currentContext || {}),

    source:
      'reaction-studio',

    destination:
      'reaction',

    reaction: {

      input:
        reaction.input || '',

      balanced:
        reaction.balanced,

      reactants:
        reaction.reactants || [],

      products:
        reaction.products || [],

      type:
        reaction.type || '',

      observations:
        reaction.observations || []

    },

    formula:
      reaction.reactants?.[0]
        ?.formula ||
      currentContext?.formula ||
      '',

    updatedAt:
      Date.now()

  }


  commitContext(
    currentContext
  )


  renderFlowDock()


  showToast(
    'Phản ứng đã được lưu vào Chem Flow'
  )


  return currentContext

}


/* =========================================================
   GET
========================================================= */

export function getChemContext() {

  return currentContext

}


/* =========================================================
   CLEAR
========================================================= */

export function clearChemContext() {

  currentContext =
    null


  try {

    sessionStorage.removeItem(
      SESSION_KEY
    )

  }

  catch {

    /* ignore */

  }


  document
    .querySelector(
      '.cl5-flow-dock'
    )
    ?.remove()


  window.dispatchEvent(
    new CustomEvent(
      'chemlab:context-clear'
    )
  )

}


/* =========================================================
   GO
========================================================= */

export async function go(
  destination
) {

  const info =
    DESTINATIONS[
      destination
    ]


  if (!info) {
    return
  }


  /* =====================================================
     COMPOUND STUDIO
  ===================================================== */

  if (
    destination ===
    'studio'
  ) {

    try {

      const module =
        await import(
          './compoundStudio.js'
        )


      module.openCompoundStudio({

        context:
          currentContext

      })


      setDestination(
        'studio'
      )

    }

    catch (
      error
    ) {

      console.error(
        '[ChemLab] Compound Studio:',
        error
      )

    }


    return

  }


  /* =====================================================
     REACTION STUDIO
  ===================================================== */

  if (
    destination ===
    'reaction'
  ) {

    try {

      const module =
        await import(
          './reactionStudio.js'
        )


      module.openReactionStudio({

        context:
          currentContext

      })


      setDestination(
        'reaction'
      )

    }

    catch (
      error
    ) {

      console.error(
        '[ChemLab] Reaction Studio:',
        error
      )

    }


    return

  }


  /* =====================================================
     NORMAL VIEWS
  ===================================================== */

  navigateView(
    info.view
  )


  await waitFrames(
    3
  )


  if (
    info.view ===
    'tools'
  ) {

    openTool(
      destination
    )

  }


  await waitFrames(
    3
  )


  setDestination(
    destination
  )


  if (
    currentContext
  ) {

    applyContext(
      destination,
      currentContext
    )

  }

}


/* =========================================================
   DESTINATION
========================================================= */

function setDestination(
  destination
) {

  if (
    currentContext
  ) {

    currentContext.destination =
      destination


    currentContext.updatedAt =
      Date.now()


    commitContext(
      currentContext
    )

  }


  renderFlowDock()

}


/* =========================================================
   MAIN VIEW
========================================================= */

function navigateView(
  view
) {

  if (!view) {
    return
  }


  const selectors = [

    `[data-view="${view}"]`,

    `[data-app-view="${view}"]`,

    `[data-nav="${view}"]`,

    `a[href="#${view}"]`

  ]


  for (
    const selector
    of selectors
  ) {

    const item =
      document.querySelector(
        selector
      )


    if (
      item instanceof
      HTMLElement
    ) {

      item.click()

      return

    }

  }


  window.location.hash =
    `#${view}`

}


/* =========================================================
   TOOL NAVIGATION
========================================================= */

function openTool(
  destination
) {

  const info =
    DESTINATIONS[
      destination
    ]


  if (
    !info?.aliases
  ) {
    return
  }


  if (
    typeof window
      .ChemLabTools
      ?.open ===
    'function'
  ) {

    for (
      const alias
      of info.aliases
    ) {

      try {

        const result =
          window.ChemLabTools
            .open(
              alias
            )


        if (
          result !== false
        ) {

          return

        }

      }

      catch {

        /* try fallback */

      }

    }

  }


  const buttons =
    [
      ...document
        .querySelectorAll(
          'button'
        )
    ]


  const aliases =
    info.aliases
      .map(
        normalizeText
      )


  const button =
    buttons.find(
      item => {

        const text =
          normalizeText(
            item.textContent
          )


        return aliases.some(
          alias =>
            text.includes(
              alias
            )
        )

      }
    )


  button?.click?.()

}


/* =========================================================
   APPLY CONTEXT
========================================================= */

function applyContext(
  destination,
  context
) {

  try {

    switch (
      destination
    ) {

      case 'ion':

        prefillIon(
          context
        )

        break


      case 'molar':

        prefillMolar(
          context
        )

        break


      case 'solubility':

        prefillSolubility(
          context
        )

        break


      case 'lab':

        prefillLab(
          context
        )

        break

    }


    window.dispatchEvent(
      new CustomEvent(
        `chemlab:context:${destination}`,
        {
          detail:
            context
        }
      )
    )

  }

  catch (
    error
  ) {

    console.warn(
      '[ChemLab Flow] Prefill:',
      error
    )

  }

}


/* =========================================================
   ION PREFILL
========================================================= */

function prefillIon(
  context
) {

  const root =
    firstExisting([
      '#ion-engine-v5',
      '#ion-engine',
      '[data-ion-engine]'
    ])


  if (!root) {
    return
  }


  const input =
    findTextInput(
      root
    )


  if (
    input &&
    context.element?.symbol
  ) {

    setInput(
      input,
      context.element.symbol
    )

  }

}


/* =========================================================
   MOLAR PREFILL
========================================================= */

function prefillMolar(
  context
) {

  const root =
    firstExisting([
      '#chem-calculator-v4',
      '#chem-calculator',
      '[data-chem-calculator]'
    ])


  if (!root) {
    return
  }


  const formula =
    context.compound
      ?.formula ||

    context.formula ||

    context.element
      ?.symbol


  if (!formula) {
    return
  }


  const inputs =
    [
      ...root.querySelectorAll(
        'input'
      )
    ]


  const input =
    inputs.find(
      item => {

        const text =
          normalizeText(
            [
              item.id,
              item.name,
              item.placeholder,
              item.getAttribute(
                'aria-label'
              )
            ]
              .filter(Boolean)
              .join(' ')
          )


        return (
          text.includes(
            'formula'
          ) ||
          text.includes(
            'cong thuc'
          ) ||
          text.includes(
            'h2o'
          ) ||
          text.includes(
            'nacl'
          )
        )

      }
    ) ||
    findTextInput(
      root
    )


  if (input) {

    setInput(
      input,
      formula
    )

  }

}


/* =========================================================
   SOLUBILITY
========================================================= */

function prefillSolubility(
  context
) {

  window.dispatchEvent(
    new CustomEvent(
      'chemlab:solubility-context',
      {
        detail:
          context
      }
    )
  )

}


/* =========================================================
   LAB
========================================================= */

function prefillLab(
  context
) {

  const root =
    firstExisting([
      '#virtual-lab-v4',
      '#virtual-lab',
      '[data-virtual-lab]'
    ])


  const firstReactant =
    context.reaction
      ?.reactants
      ?.[0]
      ?.formula


  const query =
    firstReactant ||

    context.compound
      ?.formula ||

    context.formula ||

    context.element
      ?.symbol


  if (
    root &&
    query
  ) {

    const input =
      findTextInput(
        root
      )


    if (input) {

      setInput(
        input,
        query
      )

    }

  }


  if (
    context.reaction
  ) {

    window.dispatchEvent(
      new CustomEvent(
        'chemlab:reaction-context',
        {
          detail:
            context.reaction
        }
      )
    )

  }


  window.dispatchEvent(
    new CustomEvent(
      'chemlab:lab-context',
      {
        detail:
          context
      }
    )
  )

}


/* =========================================================
   FLOW DOCK
========================================================= */

function renderFlowDock() {

  if (
    !currentContext
  ) {

    document
      .querySelector(
        '.cl5-flow-dock'
      )
      ?.remove()


    return

  }


  let dock =
    document.querySelector(
      '.cl5-flow-dock'
    )


  if (!dock) {

    dock =
      document.createElement(
        'aside'
      )


    dock.className =
      'cl5-flow-dock'


    dock.setAttribute(
      'aria-label',
      'Chem Flow'
    )


    document.body.appendChild(
      dock
    )

  }


  const display =
    getDisplay()


  dock.innerHTML = `
    <div class="cl5-flow-identity">

      <span class="cl5-flow-logo">
        ⌬
      </span>


      <div>

        <small>
          CHEM FLOW
        </small>

        <strong>
          ${escapeHTML(
            display.main
          )}
        </strong>

        <span>
          ${escapeHTML(
            display.secondary
          )}
        </span>

      </div>

    </div>


    <div class="cl5-flow-steps">

      ${flowButton(
        'studio',
        '◇',
        'Studio'
      )}

      <i>→</i>

      ${flowButton(
        'reaction',
        '⇌',
        'Reaction'
      )}

      <i>→</i>

      ${flowButton(
        'ion',
        '±',
        'Ion'
      )}

      <i>→</i>

      ${flowButton(
        'molar',
        '∑',
        'Molar'
      )}

      <i>→</i>

      ${flowButton(
        'solubility',
        '◫',
        'Tính tan'
      )}

      <i>→</i>

      ${flowButton(
        'lab',
        '⌁',
        'Lab'
      )}

    </div>


    <button
      type="button"
      class="cl5-flow-close"
      data-flow-clear
      aria-label="Đóng Chem Flow"
    >
      ×
    </button>
  `


  dock
    .querySelectorAll(
      '[data-flow-destination]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            go(
              button.dataset
                .flowDestination
            )

          }
        )

      }
    )


  dock
    .querySelector(
      '[data-flow-clear]'
    )
    ?.addEventListener(
      'click',
      clearChemContext
    )

}


/* =========================================================
   FLOW BUTTON
========================================================= */

function flowButton(
  destination,
  icon,
  label
) {

  return `
    <button
      type="button"
      data-flow-destination="${destination}"
      class="${
        currentContext
          ?.destination ===
        destination
          ? 'active'
          : ''
      }"
    >

      <span>
        ${icon}
      </span>

      <b>
        ${label}
      </b>

    </button>
  `

}


/* =========================================================
   DISPLAY
========================================================= */

function getDisplay() {

  if (
    currentContext
      ?.reaction
      ?.balanced
  ) {

    return {

      main:
        'Reaction',

      secondary:
        currentContext
          .reaction
          .balanced

    }

  }


  if (
    currentContext
      ?.compound
      ?.formula
  ) {

    return {

      main:
        currentContext
          .compound
          .formula,

      secondary:
        currentContext
          .compound
          .name ||
        'Hợp chất đang làm việc'

    }

  }


  if (
    currentContext
      ?.ion
      ?.formula
  ) {

    return {

      main:
        currentContext
          .ion
          .formula,

      secondary:
        currentContext
          .element
          ?.name ||
        'Ion đang làm việc'

    }

  }


  return {

    main:
      currentContext
        ?.element
        ?.symbol ||
      'ChemLab',

    secondary:
      currentContext
        ?.element
        ?.name ||
      'Chem Flow'

  }

}


/* =========================================================
   COMMIT
========================================================= */

function commitContext(
  context
) {

  saveSession(
    context
  )


  saveHistory(
    context
  )


  window.dispatchEvent(
    new CustomEvent(
      'chemlab:context',
      {
        detail:
          context
      }
    )
  )

}


/* =========================================================
   STORAGE
========================================================= */

function saveSession(
  context
) {

  try {

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(
        context
      )
    )

  }

  catch {

    /* ignore */

  }

}


function loadSession() {

  try {

    const value =
      sessionStorage.getItem(
        SESSION_KEY
      )


    return value
      ? JSON.parse(
          value
        )
      : null

  }

  catch {

    return null

  }

}


/* =========================================================
   HISTORY
========================================================= */

function saveHistory(
  context
) {

  try {

    const history =
      JSON.parse(
        localStorage.getItem(
          HISTORY_KEY
        ) ||
        '[]'
      )


    const signature =
      context.reaction
        ?.balanced ||

      context.compound
        ?.formula ||

      context.ion
        ?.formula ||

      context.element
        ?.symbol


    if (!signature) {
      return
    }


    const cleaned =
      history.filter(
        item =>
          item.signature !==
          signature
      )


    cleaned.unshift({

      signature,

      context,

      time:
        Date.now()

    })


    localStorage.setItem(
      HISTORY_KEY,

      JSON.stringify(
        cleaned.slice(
          0,
          10
        )
      )
    )

  }

  catch {

    /* ignore */

  }

}


/* =========================================================
   HELPERS
========================================================= */

function firstExisting(
  selectors
) {

  for (
    const selector
    of selectors
  ) {

    const element =
      document.querySelector(
        selector
      )


    if (element) {
      return element
    }

  }


  return null

}


function findTextInput(
  root
) {

  return root.querySelector(
    'input[type="search"], input[type="text"]'
  )

}


function setInput(
  input,
  value
) {

  input.value =
    value


  input.dispatchEvent(
    new Event(
      'input',
      {
        bubbles:
          true
      }
    )
  )


  input.dispatchEvent(
    new Event(
      'change',
      {
        bubbles:
          true
      }
    )
  )

}


function normalizeIon(
  ion
) {

  return {

    formula:
      String(
        ion.formula || ''
      ),

    charge:
      String(
        ion.charge || ''
      ),

    type:
      String(
        ion.type || ''
      )

  }

}


function normalizeText(
  value
) {

  return String(
    value || ''
  )
    .normalize(
      'NFD'
    )
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()

}


function waitFrames(
  count = 1
) {

  return new Promise(
    resolve => {

      function next(
        remaining
      ) {

        if (
          remaining <=
          0
        ) {

          resolve()

          return

        }


        requestAnimationFrame(
          () =>
            next(
              remaining - 1
            )
        )

      }


      next(
        count
      )

    }
  )

}


function escapeHTML(
  value
) {

  return String(
    value || ''
  )
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;')

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  document
    .querySelector(
      '.cl5-flow-toast'
    )
    ?.remove()


  const toast =
    document.createElement(
      'div'
    )


  toast.className =
    'cl5-flow-toast'


  toast.innerHTML = `
    <span>
      ✓
    </span>

    <div>

      <strong>
        Chem Flow
      </strong>

      <small>
        ${escapeHTML(message)}
      </small>

    </div>
  `


  document.body.appendChild(
    toast
  )


  requestAnimationFrame(
    () =>
      toast.classList.add(
        'show'
      )
  )


  setTimeout(
    () => {

      toast.classList.remove(
        'show'
      )


      setTimeout(
        () =>
          toast.remove(),
        220
      )

    },
    2300
  )

}


/* =========================================================
   RESTORE
========================================================= */

if (
  currentContext
) {

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      () => {

        setTimeout(
          renderFlowDock,
          100
        )

      }
    )

  }

  else {

    setTimeout(
      renderFlowDock,
      100
    )

  }

}


/* =========================================================
   GLOBAL API
========================================================= */

window.ChemLabContext = {

  get current() {

    return currentContext

  },

  open:
    openElementDestination,

  set:
    setChemContext,

  captureCompound,

  captureReaction,

  go,

  clear:
    clearChemContext

}


window.ChemLabFlow =
  window.ChemLabContext