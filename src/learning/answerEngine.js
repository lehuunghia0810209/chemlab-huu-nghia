// Answer checking for the question bank. Pure functions, no DOM.
// Result kinds: 'correct' · 'incorrect' (knowledge error) · 'invalid' (input
// error: empty, unreadable number, unknown unit — not graded, the learner fixes it).

export const QUESTION_TYPES = {
  single: 'Một đáp án',
  multiple: 'Nhiều đáp án',
  truefalse: 'Đúng / Sai',
  short: 'Trả lời ngắn',
  numeric: 'Tính toán'
}

export const DIFFICULTIES = {
  recognize: 'Nhận biết',
  understand: 'Thông hiểu',
  apply: 'Vận dụng',
  advanced: 'Vận dụng cao'
}

const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉'
const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹'

function plainDigits(text) {
  return text
    .replace(/[₀-₉]/g, char => String(SUBSCRIPT.indexOf(char)))
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, char => String(SUPERSCRIPT.indexOf(char)))
    .replace(/⁺/g, '+')
    .replace(/[⁻−–]/g, '-')
}

export function normalizeText(value, { caseSensitive = false, compact = false } = {}) {
  let text = plainDigits(String(value ?? '').normalize('NFC'))
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.;]+$/, '')
  if (compact) text = text.replace(/\s+/g, '')
  return caseSensitive ? text : text.toLocaleLowerCase('vi')
}

const NUMBER = /^([+\-−]?)(\d+(?:[.,]\d+)?)(?:\s*(?:[eE]([+\-−]?\d+)|[x×·*]\s*10\s*(?:\^\s*([+\-−]?\d+)|([⁺⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+))))?\s*(.*)$/

// Strict parser: one decimal separator (comma or dot), optional ×10^n, then an
// optional unit. "1.000.000", "1 000", ".5" or "12abc" are rejected, not guessed.
export function parseNumber(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return { ok: false, error: 'Hãy nhập một giá trị.' }
  const match = NUMBER.exec(text)
  if (!match) {
    return { ok: false, error: /^[.,]\d/.test(text) ? 'Viết số có chữ số trước dấu phẩy, ví dụ 0,5.' : 'Không đọc được số. Ví dụ hợp lệ: 2,24 hoặc 6,02×10^23.' }
  }
  const [, sign, digits, eExp, caretExp, superExp, rest] = match
  let exponent = 0
  if (eExp) exponent = Number(plainDigits(eExp))
  else if (caretExp) exponent = Number(plainDigits(caretExp))
  else if (superExp) exponent = Number(plainDigits(superExp))
  const unit = rest.trim()
  // \p{L} admits Vietnamese unit names such as “tấn”; the unit table still decides what is accepted.
  if (unit && !/^[\p{L}µμ°%/·.\-\d¹²³⁻ ]+$/u.test(unit)) {
    return { ok: false, error: 'Phần sau con số không phải là đơn vị hợp lệ.' }
  }
  if (/^[\d.,]/.test(unit)) {
    return { ok: false, error: 'Không dùng dấu cách hay dấu chấm để phân tách hàng nghìn.' }
  }
  // Number('…e…') is correctly rounded by spec; mantissa * 10 ** n is not (Math.pow differs between V8 versions).
  const value = Number(`${sign === '-' || sign === '−' ? '-' : ''}${digits.replace(',', '.')}e${exponent}`)
  if (!Number.isFinite(value)) return { ok: false, error: 'Giá trị quá lớn hoặc không hợp lệ.' }
  return { ok: true, value, unit: unit.replace(/\s+/g, '') }
}

function unitTable(answer) {
  if (answer.units) return answer.units
  if (!answer.unit) return {}
  return UNITS[answer.unit] || { [answer.unit]: 1 }
}

// Exact match only: M (mol/L) and m, mL and ML must not be confused.
function findUnitFactor(table, unit) {
  return Object.hasOwn(table, unit) ? table[unit] : undefined
}

// Shared unit tables (factor to the canonical unit, listed first).
export const UNITS = {
  g: { g: 1, kg: 1000, mg: 0.001 },
  kg: { kg: 1, g: 0.001, tấn: 1000 },
  L: { L: 1, l: 1, mL: 0.001, ml: 0.001, dm3: 1, 'dm³': 1, cm3: 0.001, 'cm³': 0.001 },
  mL: { mL: 1, ml: 1, L: 1000, l: 1000, cm3: 1, 'cm³': 1 },
  M: { M: 1, 'mol/L': 1, 'mol/l': 1, mM: 0.001 },
  mol: { mol: 1, mmol: 0.001 },
  kJ: { kJ: 1, J: 0.001 },
  V: { V: 1, mV: 0.001 },
  '%': { '%': 1 },
  amu: { amu: 1, u: 1 },
  'g/mol': { 'g/mol': 1 }
}

export function numericTolerance(answer) {
  if (Number.isFinite(answer.tolerance)) return answer.tolerance
  return Math.max(Math.abs(answer.value) * 0.01, 1e-12)
}

function invalid(message) {
  return { kind: 'invalid', correct: false, score: 0, message }
}

function graded(correct, extra = {}) {
  return { kind: correct ? 'correct' : 'incorrect', correct, score: correct ? 1 : 0, ...extra }
}

export function evaluate(question, response) {
  switch (question.type) {
    case 'single': {
      if (typeof response !== 'string' || !response) return invalid('Hãy chọn một đáp án.')
      if (!question.options.some(option => option.id === response)) return invalid('Đáp án không hợp lệ.')
      return graded(response === question.correctAnswer)
    }

    case 'multiple': {
      const chosen = new Set(Array.isArray(response) ? response : [])
      if (!chosen.size) return invalid('Hãy chọn ít nhất một đáp án.')
      const correctSet = new Set(question.correctAnswer)
      const right = question.options.filter(option => chosen.has(option.id) === correctSet.has(option.id)).length
      return graded(right === question.options.length, { detail: `${right}/${question.options.length} lựa chọn được xác định đúng` })
    }

    case 'truefalse': {
      const answers = response && typeof response === 'object' ? response : {}
      const missing = question.statements.filter(statement => typeof answers[statement.id] !== 'boolean')
      if (missing.length) return invalid(`Còn ${missing.length} ý chưa chọn Đúng hoặc Sai.`)
      const right = question.statements.filter(statement => answers[statement.id] === question.correctAnswer[statement.id]).length
      const total = question.statements.length
      return { ...graded(right === total), score: right / total, detail: `${right}/${total} ý đúng` }
    }

    case 'short': {
      const options = { caseSensitive: question.correctAnswer.caseSensitive === true, compact: question.correctAnswer.compact === true }
      const given = normalizeText(response, options)
      if (!given) return invalid('Hãy nhập câu trả lời.')
      const accepted = question.correctAnswer.accepted.map(item => normalizeText(item, options))
      return graded(accepted.includes(given))
    }

    case 'numeric': {
      const parsed = parseNumber(response)
      if (!parsed.ok) return invalid(parsed.error)
      const answer = question.correctAnswer
      const table = unitTable(answer)
      let factor = 1
      let note = ''
      if (parsed.unit) {
        factor = findUnitFactor(table, parsed.unit)
        if (factor === undefined) {
          const expected = Object.keys(table)
          return invalid(expected.length
            ? `Đơn vị “${parsed.unit}” không phù hợp. Dùng ${expected.join(' hoặc ')}.`
            : 'Đại lượng này không có đơn vị, chỉ nhập con số.')
        }
      }
      else if (answer.unit) {
        note = `Lần sau nhớ ghi đơn vị (${answer.unit}).`
      }
      const correct = Math.abs(parsed.value * factor - answer.value) <= numericTolerance(answer)
      return graded(correct, note ? { note } : {})
    }

    default:
      return invalid('Dạng câu hỏi không được hỗ trợ.')
  }
}

// Text shown as "Đáp án đúng" in feedback and review.
export function formatCorrectAnswer(question) {
  const optionText = id => {
    const index = question.options.findIndex(option => option.id === id)
    return `${String.fromCharCode(65 + index)}. ${question.options[index].text}`
  }
  switch (question.type) {
    case 'single':
      return optionText(question.correctAnswer)
    case 'multiple':
      return question.correctAnswer.map(optionText).join('; ')
    case 'truefalse':
      return question.statements.map(statement => `${statement.id}) ${question.correctAnswer[statement.id] ? 'Đúng' : 'Sai'}`).join(' · ')
    case 'short':
      return question.correctAnswer.accepted[0]
    case 'numeric': {
      const value = question.correctAnswer.display || String(question.correctAnswer.value).replace('.', ',')
      return question.correctAnswer.unit ? `${value} ${question.correctAnswer.unit}` : value
    }
    default:
      return ''
  }
}
