import {
  buildChemAIContext,
  getContextLabel,
  getSmartSuggestions
} from './contextBuilder.js'

const SESSION_KEY = 'chemlab-v62-ai-session'
const MAX_STORED_MESSAGES = 24
const MAX_HISTORY_TO_SERVER = 10
const MAX_INPUT_LENGTH = 4000

let singleton = null

function icon(name) {
  const paths = {
    spark: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    send: '<path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/>',
    stop: '<rect x="7" y="7" width="10" height="10" rx="2"/>',
    copy: '<rect x="8" y="8" width="10" height="10" rx="2"/><path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    context: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M6.1 9A7 7 0 0 1 18 6l2 5M4 13l2 5a7 7 0 0 0 11.9-3"/>',
    brain: '<path d="M9.5 4.5A3 3 0 0 0 4 6a3 3 0 0 0 0 6 3 3 0 0 0 3 5h2.5M14.5 4.5A3 3 0 0 1 20 6a3 3 0 0 1 0 6 3 3 0 0 1-3 5h-2.5M9.5 4.5v15M14.5 4.5v15"/>',
    warning: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/>'
  }

  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`
}

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function inlineMarkdown(value) {
  return escapeHTML(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
}

function markdownToHTML(markdown) {
  const source = String(markdown ?? '').replace(/\r\n/g, '\n').trim()
  if (!source) return ''

  const blocks = source.split(/```/)
  const html = []

  blocks.forEach((block, index) => {
    if (index % 2 === 1) {
      const cleaned = block.replace(/^\w+\n/, '').trim()
      html.push(`<pre><code>${escapeHTML(cleaned)}</code></pre>`)
      return
    }

    const lines = block.split('\n')
    let listType = null
    let listItems = []

    const flushList = () => {
      if (!listType || !listItems.length) return
      html.push(`<${listType}>${listItems.join('')}</${listType}>`)
      listType = null
      listItems = []
    }

    for (const rawLine of lines) {
      const line = rawLine.trim()

      if (!line) {
        flushList()
        continue
      }

      const bullet = line.match(/^[-*]\s+(.+)$/)
      const ordered = line.match(/^\d+[.)]\s+(.+)$/)

      if (bullet) {
        if (listType && listType !== 'ul') flushList()
        listType = 'ul'
        listItems.push(`<li>${inlineMarkdown(bullet[1])}</li>`)
        continue
      }

      if (ordered) {
        if (listType && listType !== 'ol') flushList()
        listType = 'ol'
        listItems.push(`<li>${inlineMarkdown(ordered[1])}</li>`)
        continue
      }

      flushList()

      if (/^###\s+/.test(line)) {
        html.push(`<h4>${inlineMarkdown(line.replace(/^###\s+/, ''))}</h4>`)
        continue
      }

      if (/^##\s+/.test(line)) {
        html.push(`<h3>${inlineMarkdown(line.replace(/^##\s+/, ''))}</h3>`)
        continue
      }

      if (/^>\s+/.test(line)) {
        html.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s+/, ''))}</blockquote>`)
        continue
      }

      const equationLike =
        /(?:→|⇌|↔)/.test(line) &&
        /[A-Z][A-Za-z₀-₉⁺⁻²³⁴⁵⁶⁷⁸⁹()\[\]]*/.test(line)

      if (equationLike) {
        html.push(`<div class="chemai-equation">${inlineMarkdown(line)}</div>`)
        continue
      }

      html.push(`<p>${inlineMarkdown(line)}</p>`)
    }

    flushList()
  })

  return html.join('')
}

function loadSession() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
    if (!Array.isArray(parsed?.messages)) return []

    return parsed.messages
      .filter(item => ['user', 'assistant'].includes(item?.role) && item?.content)
      .slice(-MAX_STORED_MESSAGES)
      .map(item => ({
        role: item.role,
        content: String(item.content).slice(0, 12000),
        timestamp: Number(item.timestamp) || Date.now(),
        meta: item?.meta && typeof item.meta === 'object'
          ? {
              provider: String(item.meta.provider || '').slice(0, 40),
              model: String(item.meta.model || '').slice(0, 120),
              groundedElements: Number(item.meta.groundedElements) || 0,
              groundedChemicals: Number(item.meta.groundedChemicals) || 0,
              groundedReactions: Number(item.meta.groundedReactions) || 0,
              groundedLessons: Number(item.meta.groundedLessons) || 0
            }
          : null
      }))
  }
  catch {
    return []
  }
}

function saveSession(messages) {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        version: 1,
        updatedAt: Date.now(),
        messages: messages.slice(-MAX_STORED_MESSAGES)
      })
    )
  }
  catch {
    /* session storage is optional */
  }
}

function isLocalHost() {
  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

export function initChemAI({ version = '6.2.0' } = {}) {
  if (singleton) return singleton

  let messages = loadSession()
  let open = false
  let pending = false
  let controller = null
  let serviceState = 'checking'
  let lastContext = buildChemAIContext()
  let serverSuggestions = []
  let lastFocused = null
  let statusChecked = false
  const displayVersion = String(version).replace(/\.0$/, '')

  const root = document.createElement('div')
  root.className = 'chemai-root'
  root.hidden = true
  root.innerHTML = `
    <div class="chemai-backdrop" data-chemai-close aria-hidden="true"></div>

    <section
      class="chemai-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="chemai-title"
      aria-describedby="chemai-subtitle"
    >
      <header class="chemai-header">
        <div class="chemai-brand">
          <span class="chemai-orb" aria-hidden="true">
            <i></i><b></b><em></em>
            ${icon('spark')}
          </span>
          <div>
            <div class="chemai-title-row">
              <h2 id="chemai-title">ChemAI</h2>
              <span class="chemai-version">${escapeHTML(displayVersion)}</span>
            </div>
            <p id="chemai-subtitle">Trợ lý Hóa học của ChemLab · Gemini</p>
          </div>
        </div>

        <div class="chemai-header-actions">
          <button class="chemai-icon-button" type="button" data-chemai-new title="Cuộc trò chuyện mới" aria-label="Tạo cuộc trò chuyện mới">
            ${icon('plus')}
          </button>
          <button class="chemai-icon-button" type="button" data-chemai-close title="Đóng ChemAI" aria-label="Đóng ChemAI">
            ${icon('close')}
          </button>
        </div>
      </header>

      <div class="chemai-contextbar">
        <span class="chemai-context-icon">${icon('context')}</span>
        <div class="chemai-context-copy">
          <small>NGỮ CẢNH HIỆN TẠI</small>
          <strong id="chemai-context-label">ChemLab</strong>
        </div>
        <span id="chemai-service-badge" class="chemai-service-badge checking">
          <i></i><span>Đang kiểm tra</span>
        </span>
      </div>

      <div
        id="chemai-messages"
        class="chemai-messages"
        aria-live="polite"
        aria-relevant="additions"
      ></div>

      <div id="chemai-suggestions" class="chemai-suggestions" aria-label="Gợi ý câu hỏi"></div>

      <form id="chemai-form" class="chemai-composer">
        <div class="chemai-input-shell">
          <textarea
            id="chemai-input"
            rows="1"
            maxlength="${MAX_INPUT_LENGTH}"
            autocomplete="off"
            placeholder="Hỏi ChemAI về Hóa học..."
            aria-label="Nhập câu hỏi cho ChemAI"
          ></textarea>

          <button id="chemai-send" class="chemai-send" type="submit" aria-label="Gửi câu hỏi">
            <span class="chemai-send-icon send">${icon('send')}</span>
            <span class="chemai-send-icon stop">${icon('stop')}</span>
          </button>
        </div>

        <div class="chemai-composer-meta">
          <span>Enter để gửi · Shift + Enter xuống dòng</span>
          <span id="chemai-count">0/${MAX_INPUT_LENGTH}</span>
        </div>
      </form>

      <footer class="chemai-footer">
        <span>${icon('brain')} ChemAI · Gemini · trả lời tiếng Việt · công thức và PTHH giữ chuẩn Hóa học</span>
        <small>AI có thể sai. Hãy kiểm tra kết quả quan trọng.</small>
      </footer>
    </section>
  `

  document.body.appendChild(root)

  const panel = root.querySelector('.chemai-panel')
  const messagesEl = root.querySelector('#chemai-messages')
  const suggestionsEl = root.querySelector('#chemai-suggestions')
  const input = root.querySelector('#chemai-input')
  const form = root.querySelector('#chemai-form')
  const sendButton = root.querySelector('#chemai-send')
  const countEl = root.querySelector('#chemai-count')
  const contextLabel = root.querySelector('#chemai-context-label')
  const serviceBadge = root.querySelector('#chemai-service-badge')
  const mobileMedia = window.matchMedia('(max-width: 767px)')

  function syncVisualViewport() {
    const height = Math.round(window.visualViewport?.height || window.innerHeight)
    root.style.setProperty('--chemai-viewport-h', `${height}px`)
  }

  syncVisualViewport()
  window.visualViewport?.addEventListener('resize', syncVisualViewport)

  function announce(message) {
    const announcer = document.querySelector('#app-announcer')
    if (announcer) announcer.textContent = message
  }

  function setServiceState(state, label) {
    serviceState = state
    serviceBadge.className = `chemai-service-badge ${state}`
    serviceBadge.querySelector('span').textContent = label
  }

  async function checkService() {
    if (statusChecked) return serviceState
    statusChecked = true

    try {
      const response = await fetch('/api/chat', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) throw new Error('not-json')

      const data = await response.json()

      if (data?.configured) {
        serviceBadge.title = data?.model ? `Gemini · ${data.model}` : 'Gemini'
        setServiceState('online', 'Gemini')
      }
      else {
        serviceBadge.title = 'Gemini chưa được cấu hình'
        setServiceState('setup', 'Chưa cấu hình')
      }
    }
    catch {
      if (isLocalHost()) {
        setServiceState('local', 'Local UI')
      }
      else {
        setServiceState('offline', 'Ngoại tuyến')
      }
    }

    return serviceState
  }

  function updateContext() {
    lastContext = buildChemAIContext()
    contextLabel.textContent = getContextLabel(lastContext)
    if (!messages.length) renderMessages()
    renderSuggestions()
  }

  function scrollToBottom(behavior = 'smooth') {
    requestAnimationFrame(() => {
      messagesEl.scrollTo({
        top: messagesEl.scrollHeight,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : behavior
      })
    })
  }

  function renderWelcome() {
    if (messages.length) return

    messagesEl.innerHTML = `
      <section class="chemai-welcome">
        <span class="chemai-welcome-mark">${icon('spark')}</span>
        <span class="chemai-eyebrow">CHEMAI FINAL · HIỂU NGỮ CẢNH</span>
        <h3>Hỏi ngay trong lúc bạn đang học.</h3>
        <p>
          ChemAI dùng Gemini cùng dữ liệu của ChemLab để giải thích bằng tiếng Việt,
          trong khi công thức, phương trình và ký hiệu Hóa học vẫn giữ chuẩn quốc tế.
        </p>
        <div class="chemai-welcome-context">
          <span>${icon('context')}</span>
          <div>
            <small>ĐANG HỖ TRỢ</small>
            <strong>${escapeHTML(getContextLabel(lastContext))}</strong>
          </div>
        </div>
        <div class="chemai-capabilities">
          <span>Giải thích</span>
          <span>Giải bài</span>
          <span>Trợ lý Lab</span>
          <span>Điều hướng</span>
        </div>
      </section>
    `
  }

  function groundingLabel(meta) {
    if (!meta || typeof meta !== 'object') return ''

    const parts = []
    const elements = Number(meta.groundedElements) || 0
    const chemicals = Number(meta.groundedChemicals) || 0
    const reactions = Number(meta.groundedReactions) || 0
    const lessons = Number(meta.groundedLessons) || 0

    if (elements) parts.push(`${elements} nguyên tố`)
    if (chemicals) parts.push(`${chemicals} hóa chất`)
    if (reactions) parts.push(`${reactions} phản ứng`)
    if (lessons) parts.push(`${lessons} bài học`)

    return parts.length ? `Đối chiếu dữ liệu ChemLab: ${parts.join(' · ')}` : ''
  }

  function renderMessages() {
    messagesEl.innerHTML = ''
    messagesEl.classList.toggle('is-empty', !messages.length)

    if (!messages.length) {
      renderWelcome()
      return
    }

    for (const message of messages) {
      const article = document.createElement('article')
      article.className = `chemai-message ${message.role}`

      if (message.role === 'user') {
        article.innerHTML = `
          <div class="chemai-message-meta"><span>Bạn</span></div>
          <div class="chemai-bubble"><p>${escapeHTML(message.content).replace(/\n/g, '<br>')}</p></div>
        `
      }
      else {
        article.innerHTML = `
          <div class="chemai-message-meta">
            <span class="chemai-mini-orb">${icon('spark')}</span>
            <span>ChemAI</span>
          </div>
          <div class="chemai-bubble chemai-answer">${markdownToHTML(message.content)}</div>
          ${groundingLabel(message.meta) ? `<div class="chemai-grounding-note">${icon('context')}<span>${escapeHTML(groundingLabel(message.meta))}</span></div>` : ''}
          <div class="chemai-message-tools">
            <button type="button" data-copy-answer aria-label="Sao chép câu trả lời">
              ${icon('copy')} <span>Sao chép</span>
            </button>
          </div>
        `
      }

      messagesEl.appendChild(article)
    }
  }

  function renderThinking() {
    const article = document.createElement('article')
    article.id = 'chemai-thinking'
    article.className = 'chemai-message assistant thinking'
    article.innerHTML = `
      <div class="chemai-message-meta">
        <span class="chemai-mini-orb">${icon('spark')}</span>
        <span>ChemAI đang suy nghĩ</span>
      </div>
      <div class="chemai-bubble">
        <span class="chemai-thinking-dots" aria-label="Đang tạo câu trả lời">
          <i></i><i></i><i></i>
        </span>
      </div>
    `
    messagesEl.appendChild(article)
    scrollToBottom()
  }

  function removeThinking() {
    root.querySelector('#chemai-thinking')?.remove()
  }

  function renderActions(actions = []) {
    root.querySelector('.chemai-response-actions')?.remove()
    if (!actions.length) return

    const wrapper = document.createElement('div')
    wrapper.className = 'chemai-response-actions'
    wrapper.innerHTML = actions.map(action => `
      <button
        type="button"
        data-ai-action="${escapeHTML(action.type)}"
        data-ai-target="${escapeHTML(action.target)}"
      >
        <span>${escapeHTML(action.label)}</span>
        ${icon('chevron')}
      </button>
    `).join('')

    messagesEl.appendChild(wrapper)
  }

  function renderSuggestions(custom = null) {
    const suggestions = Array.isArray(custom) && custom.length
      ? custom
      : (serverSuggestions.length ? serverSuggestions : getSmartSuggestions(lastContext))

    suggestionsEl.innerHTML = suggestions.slice(0, 3).map(item => `
      <button type="button" data-ai-suggestion="${escapeHTML(item)}">${escapeHTML(item)}</button>
    `).join('')
  }

  function renderSystemNotice(type, title, copy) {
    const notice = document.createElement('section')
    notice.className = `chemai-system-notice ${type}`
    notice.innerHTML = `
      <span>${type === 'warning' ? icon('warning') : icon('context')}</span>
      <div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(copy)}</p></div>
    `
    messagesEl.appendChild(notice)
    scrollToBottom()
  }

  function setPending(value) {
    pending = Boolean(value)
    root.classList.toggle('is-pending', pending)
    sendButton.setAttribute('aria-label', pending ? 'Dừng tạo câu trả lời' : 'Gửi câu hỏi')
    input.disabled = pending
  }

  function autoResize() {
    input.style.height = 'auto'
    input.style.height = `${Math.min(input.scrollHeight, 132)}px`
    countEl.textContent = `${input.value.length}/${MAX_INPUT_LENGTH}`
  }

  function addMessage(role, content, meta = null) {
    messages.push({ role, content, timestamp: Date.now(), meta })
    messages = messages.slice(-MAX_STORED_MESSAGES)
    saveSession(messages)
  }

  function resetConversation() {
    if (pending && controller) controller.abort()
    messages = []
    serverSuggestions = []
    saveSession(messages)
    renderMessages()
    renderSuggestions()
    input.value = ''
    autoResize()
    input.focus()
    announce('Đã tạo cuộc trò chuyện ChemAI mới')
  }

  async function executeAction(type, target) {
    if (type === 'navigate') {
      window.ChemLabApp?.navigate?.(target)
      updateContext()
      return
    }

    if (type === 'open_tool') {
      await window.ChemLabApp?.openTool?.(target)
      updateContext()
    }
  }

  async function ask(rawMessage) {
    const question = String(rawMessage ?? '').trim().slice(0, MAX_INPUT_LENGTH)
    if (!question || pending) return

    updateContext()
    serverSuggestions = []

    const history = messages
      .slice(-MAX_HISTORY_TO_SERVER)
      .map(item => ({ role: item.role, content: item.content }))

    addMessage('user', question)
    renderMessages()
    suggestionsEl.innerHTML = ''
    renderThinking()
    input.value = ''
    autoResize()
    setPending(true)

    controller = new AbortController()

    try {
      if (!statusChecked) await checkService()

      if (serviceState === 'local') {
        throw Object.assign(new Error('local-ui'), { code: 'LOCAL_UI_ONLY' })
      }

      if (serviceState === 'setup') {
        throw Object.assign(new Error('not-configured'), { code: 'AI_NOT_CONFIGURED' })
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: question,
          history,
          context: lastContext
        }),
        signal: controller.signal
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw Object.assign(new Error('invalid-response'), { code: isLocalHost() ? 'LOCAL_UI_ONLY' : 'INVALID_RESPONSE' })
      }

      const data = await response.json()

      if (!response.ok || !data?.ok) {
        throw Object.assign(
          new Error(data?.message || 'ChemAI chưa thể trả lời.'),
          { code: data?.code || 'AI_ERROR' }
        )
      }

      removeThinking()

      const answer = String(data.answer || '').trim()
      if (!answer) throw new Error('ChemAI trả về câu trả lời trống.')

      addMessage('assistant', answer, data.meta || null)
      serverSuggestions = Array.isArray(data.suggestions) ? data.suggestions : []
      renderMessages()
      renderActions(Array.isArray(data.actions) ? data.actions : [])
      renderSuggestions()
      serviceBadge.title = data?.meta?.model ? `Gemini · ${data.meta.model}` : 'Gemini'
      setServiceState('online', 'Gemini')
      scrollToBottom()
    }
    catch (error) {
      removeThinking()

      if (error?.name === 'AbortError') {
        renderSystemNotice('neutral', 'Đã dừng', 'Bạn đã dừng câu trả lời hiện tại.')
      }
      else if (error?.code === 'LOCAL_UI_ONLY') {
        renderSystemNotice(
          'info',
          'Đang ở chế độ kiểm tra giao diện',
          'Vite localhost không chạy Cloudflare Pages Function. Sau khi deploy, hoặc khi chạy bằng Cloudflare Pages dev, ChemAI sẽ kết nối API thật.'
        )
      }
      else if (error?.code === 'AI_NOT_CONFIGURED') {
        setServiceState('setup', 'Chưa cấu hình')
        renderSystemNotice(
          'warning',
          'ChemAI chưa có API key',
          'Thêm secret GEMINI_API_KEY trong Cloudflare Pages → Settings → Variables and Secrets, sau đó deploy lại.'
        )
      }
      else {
        if (!isLocalHost()) setServiceState('offline', 'Có lỗi')
        renderSystemNotice(
          'warning',
          'ChemAI chưa thể trả lời',
          error?.message || 'Kiểm tra kết nối rồi thử lại.'
        )
      }
    }
    finally {
      controller = null
      setPending(false)
      input.disabled = false
      input.focus()
    }
  }

  function openPanel(initialPrompt = '') {
    if (open) {
      if (initialPrompt) {
        input.value = initialPrompt.slice(0, MAX_INPUT_LENGTH)
        autoResize()
      }
      input.focus()
      return
    }

    open = true
    lastFocused = document.activeElement
    panel.setAttribute('aria-modal', mobileMedia.matches ? 'true' : 'false')
    syncVisualViewport()
    root.hidden = false
    document.documentElement.classList.add('chemai-open')
    requestAnimationFrame(() => root.classList.add('is-open'))

    updateContext()
    renderMessages()
    renderSuggestions()
    void checkService()

    if (initialPrompt) input.value = initialPrompt.slice(0, MAX_INPUT_LENGTH)
    autoResize()

    requestAnimationFrame(() => input.focus())
    announce('Đã mở ChemAI')
  }

  function closePanel() {
    if (!open) return
    open = false
    root.classList.remove('is-open')
    document.documentElement.classList.remove('chemai-open')

    setTimeout(() => {
      if (!open) root.hidden = true
    }, 220)

    lastFocused?.focus?.()
    announce('Đã đóng ChemAI')
  }

  form.addEventListener('submit', event => {
    event.preventDefault()

    if (pending) {
      controller?.abort()
      return
    }

    void ask(input.value)
  })

  input.addEventListener('input', autoResize)
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      form.requestSubmit()
    }
  })

  root.addEventListener('click', event => {
    if (event.target.closest('[data-chemai-close]')) {
      closePanel()
      return
    }

    if (event.target.closest('[data-chemai-new]')) {
      resetConversation()
      return
    }

    const suggestion = event.target.closest('[data-ai-suggestion]')
    if (suggestion) {
      input.value = suggestion.dataset.aiSuggestion || ''
      autoResize()
      input.focus()
      return
    }

    const action = event.target.closest('[data-ai-action]')
    if (action) {
      void executeAction(action.dataset.aiAction, action.dataset.aiTarget)
      return
    }

    const copyButton = event.target.closest('[data-copy-answer]')
    if (copyButton) {
      const article = copyButton.closest('.chemai-message')
      const assistantMessages = messages.filter(item => item.role === 'assistant')
      const articleAssistantIndex = [...messagesEl.querySelectorAll('.chemai-message.assistant:not(.thinking)')].indexOf(article)
      const content = assistantMessages[articleAssistantIndex]?.content

      if (content) {
        navigator.clipboard?.writeText(content).then(() => {
          copyButton.querySelector('span').textContent = 'Đã chép'
          setTimeout(() => {
            const label = copyButton.querySelector('span')
            if (label) label.textContent = 'Sao chép'
          }, 1400)
        }).catch(() => {})
      }

    }
  })

  document.addEventListener('keydown', event => {
    if (!open) return

    if (event.key === 'Escape') {
      event.preventDefault()
      closePanel()
      return
    }

    if (event.key === 'Tab' && mobileMedia.matches) {
      const focusable = [...panel.querySelectorAll(
        'button:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )].filter(element => !element.hidden && element.offsetParent !== null)

      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
      else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  })

  const contextEvents = [
    'chemlab:view-change',
    'chemlab:context',
    'chemlab:context-clear',
    'chemlab:tool-change',
    'chemlab:lab-action',
    'chemlab:progress-changed'
  ]

  contextEvents.forEach(eventName => {
    window.addEventListener(eventName, () => {
      if (open) updateContext()
    })
  })

  autoResize()

  singleton = Object.freeze({
    open: openPanel,
    close: closePanel,
    ask,
    reset: resetConversation,
    context: () => buildChemAIContext(),
    isOpen: () => open
  })

  window.ChemAI = singleton
  return singleton
}
