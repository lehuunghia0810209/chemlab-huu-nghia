const VIEW_LABELS = Object.freeze({
  home: 'Tổng quan',
  periodic: 'Bảng tuần hoàn',
  tools: 'Công cụ hóa học',
  learning: 'Học tập',
  lab: 'Phòng thí nghiệm'
})

const TOOL_LABELS = Object.freeze({
  balancer: 'Cân bằng PTHH',
  calculator: 'Máy tính hóa học',
  solubility: 'Bảng tính tan',
  ions: 'Ion Engine',
  orbital: 'Orbital Atlas',
  compound: 'Compound Studio',
  reaction: 'Reaction Studio'
})

function cleanText(value, limit = 2600) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit)
}

function safeClone(value) {
  try {
    return JSON.parse(JSON.stringify(value))
  }
  catch {
    return null
  }
}

function currentElement() {
  const drawer = document.querySelector('#element-drawer.open, #element-drawer[aria-hidden="false"]')
  if (!drawer) return null

  const symbol = cleanText(drawer.querySelector('.ew5-symbol strong')?.textContent, 12)
  const name = cleanText(drawer.querySelector('.ew5-hero-copy h2')?.textContent, 80)
  const position = cleanText(drawer.querySelector('.ew5-top strong')?.textContent, 40)
  const summary = cleanText(drawer.querySelector('.ew5-hero-copy p')?.textContent, 240)

  if (!symbol && !name) return null

  return {
    symbol: symbol || null,
    name: name || null,
    position: position || null,
    summary: summary || null
  }
}

function visibleWorkspaceText(view) {
  const section = document.querySelector(`#view-${view}`)
  if (!section) return ''

  const clone = section.cloneNode(true)
  clone.querySelectorAll(
    'script, style, svg, [aria-hidden="true"], .chemai-root, .chemai-panel, .chemai-launcher'
  ).forEach(node => node.remove())

  return cleanText(clone.innerText || clone.textContent, 3000)
}

function learningContext() {
  try {
    return safeClone(window.ChemLabLearning?.context?.())
  }
  catch {
    return null
  }
}

function labContext() {
  try {
    return safeClone(window.ChemLabLab?.context?.())
  }
  catch {
    return null
  }
}

export function buildChemAIContext() {
  const app = window.ChemLabApp?.context?.() || {}
  const view = app.view || document.documentElement.dataset.chemlabView || 'home'
  const tool = window.ChemLabTools?.current?.() || app.tool || null
  const chemFlow = safeClone(window.ChemLabContext?.current || app.chemFlow || null)
  const element = currentElement()

  return {
    version: app.version || null,
    view,
    viewLabel: VIEW_LABELS[view] || view,
    tool,
    toolLabel: tool ? (TOOL_LABELS[tool] || tool) : null,
    hash: window.location.hash || '#home',
    element,
    chemFlow,
    learning: view === 'learning' ? learningContext() : null,
    lab: view === 'lab' ? labContext() : null,
    progress: safeClone(app.progress || null),
    visibleText: visibleWorkspaceText(view)
  }
}

export function getContextLabel(context) {
  if (context?.element?.symbol) {
    return `${context.element.symbol} · ${context.element.name || 'Nguyên tố'}`
  }

  if (context?.chemFlow?.reaction?.balanced) {
    return cleanText(context.chemFlow.reaction.balanced, 90)
  }

  if (context?.chemFlow?.compound?.formula) {
    return `${context.chemFlow.compound.formula} · ${context.chemFlow.compound.name || 'Hợp chất'}`
  }

  if (context?.toolLabel) {
    return context.toolLabel
  }

  if (context?.view === 'lab') {
    const experimentTitle = context?.lab?.guided?.experiment?.title
    if (experimentTitle) return `Lab · ${cleanText(experimentTitle, 68)}`

    const mixtureIds = Object.keys(context?.lab?.mixture || {}).slice(0, 3)
    if (mixtureIds.length) return `Lab · ${mixtureIds.join(' + ')}`
  }

  if (context?.view === 'learning' && context?.learning?.topicName) {
    return `Learning · ${cleanText(context.learning.topicName, 64)}`
  }

  return context?.viewLabel || 'ChemLab'
}

export function getSmartSuggestions(context) {
  if (context?.element?.symbol) {
    const symbol = context.element.symbol
    return [
      `Giải thích ${symbol} thật dễ hiểu`,
      `Cấu hình electron của ${symbol} như thế nào?`,
      `${symbol} thường tạo ion nào?`
    ]
  }

  if (context?.view === 'tools') {
    const byTool = {
      balancer: [
        'Chỉ tôi cách cân bằng phương trình đang nhập',
        'Giải thích phương pháp bảo toàn nguyên tố',
        'Cho tôi một phương trình để luyện tập'
      ],
      calculator: [
        'Giải thích công thức tính số mol',
        'Khi nào dùng n = m/M?',
        'Cho tôi một bài tính mol ngắn'
      ],
      solubility: [
        'Giải thích cách nhớ bảng tính tan',
        'Khi nào tạo kết tủa?',
        'Cho tôi bài tập nhận biết kết tủa'
      ],
      ions: [
        'Giải thích cách ghép công thức ion',
        'Tại sao tổng điện tích phải bằng 0?',
        'Cho tôi 3 bài luyện ghép ion'
      ],
      orbital: [
        'Giải thích orbital s, p, d, f',
        'Quy tắc Hund là gì?',
        'Giải thích nguyên lý Pauli dễ hiểu'
      ],
      compound: [
        'Giải thích hợp chất đang xem',
        'Cách tính khối lượng mol?',
        'Hợp chất này có thể thuộc loại nào?'
      ],
      reaction: [
        'Giải thích phản ứng đang xem',
        'Phản ứng này thuộc loại nào?',
        'Có thể thử phản ứng này trong Lab không?'
      ]
    }

    return byTool[context.tool] || [
      'Tôi nên dùng công cụ nào cho bài này?',
      'Giải thích cách cân bằng PTHH',
      'Mở công cụ tính số mol giúp tôi'
    ]
  }

  if (context?.view === 'learning') {
    return [
      'Giải thích nội dung tôi đang học dễ hiểu hơn',
      'Cho tôi 3 câu hỏi luyện tập ngắn',
      'Dựa vào tiến độ, tôi nên ôn phần nào?'
    ]
  }

  if (context?.view === 'lab') {
    return [
      'Giải thích hiện tượng trong Lab hiện tại',
      'Phản ứng nào có thể đang xảy ra?',
      'Tôi nên quan sát điều gì trong thí nghiệm này?'
    ]
  }

  if (context?.view === 'periodic') {
    return [
      'Cách đọc bảng tuần hoàn nhanh nhất?',
      'Giải thích xu hướng độ âm điện',
      'Tại sao các nguyên tố cùng nhóm giống nhau?'
    ]
  }

  return [
    'Tôi nên bắt đầu học Hóa từ đâu?',
    'Chem Flow dùng để làm gì?',
    'Hãy giới thiệu nhanh các phần của ChemLab'
  ]
}
