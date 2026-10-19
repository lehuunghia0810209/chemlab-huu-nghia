
import { elements } from '../data/elements.js'

const SYMBOLS = new Set(elements.map(element => element.symbol))
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉'
const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

export function isElementSymbol(symbol) {
  return SYMBOLS.has(symbol)
}

function toSuperscript(digits, sign) {
  return [...digits].map(digit => SUPERSCRIPTS[digit]).join('') + (sign === '+' ? '⁺' : '⁻')
}

export function normalizeChargeNotation(text) {
  return String(text ?? '').replace(/\^(\d*)([+-])/g, (_, digits, sign) => toSuperscript(digits, sign))
}

function splitCharge(text) {
  const match = text.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/)
  if (!match) return { body: text, charge: 0 }
  const size = match[1] ? Number([...match[1]].map(char => SUPERSCRIPTS.indexOf(char)).join('')) : 1
  return {
    body: text.slice(0, -match[0].length),
    charge: match[2] === '⁺' ? size : -size
  }
}

function readNumber(text, start) {
  let index = start
  while (index < text.length && /\d/.test(text[index])) index += 1
  return {
    value: index > start ? Number(text.slice(start, index)) : 1,
    next: index
  }
}

function merge(target, source, multiplier = 1) {
  for (const [symbol, count] of Object.entries(source)) {
    target[symbol] = (target[symbol] || 0) + count * multiplier
  }
}

const CLOSING = { ')': '(', ']': '[', '}': '{' }

function parseGroup(text) {
  const stack = [{}]
  const brackets = []
  let index = 0

  while (index < text.length) {
    const char = text[index]

    if (char === '(' || char === '[' || char === '{') {
      stack.push({})
      brackets.push(char)
      index += 1
      continue
    }

    if (CLOSING[char]) {
      if (brackets.pop() !== CLOSING[char]) {
        throw new Error(`Dấu ngoặc không hợp lệ trong ${text}.`)
      }
      const group = stack.pop()
      const number = readNumber(text, index + 1)
      index = number.next
      merge(stack[stack.length - 1], group, number.value)
      continue
    }

    if (/[A-Z]/.test(char)) {
      let symbol = char
      if (/[a-z]/.test(text[index + 1] || '')) symbol += text[index + 1]
      if (!SYMBOLS.has(symbol)) {
        if (symbol.length === 2 && SYMBOLS.has(char)) {
          throw new Error(`Không tìm thấy nguyên tố "${symbol}". Viết hoa đúng ký hiệu (ví dụ CO là carbon monoxide, Co là cobalt).`)
        }
        throw new Error(`Không tìm thấy nguyên tố "${symbol}".`)
      }
      const number = readNumber(text, index + symbol.length)
      index = number.next
      const current = stack[stack.length - 1]
      current[symbol] = (current[symbol] || 0) + number.value
      continue
    }

    throw new Error(`Ký tự "${char}" không hợp lệ trong ${text}.`)
  }

  if (brackets.length) {
    throw new Error(`Còn dấu ngoặc chưa đóng trong ${text}.`)
  }

  return stack[0]
}

export function parseSpecies(raw) {
  let text = normalizeChargeNotation(raw)
    .replace(/\s+/g, '')
    .replace(/[₀-₉]/g, char => String(SUBSCRIPTS.indexOf(char)))
    .replace(/[∙•⋅*]/g, '·')
    .replace(/[↓↑]/g, '')
    .replace(/\([a-z]+\)$/, '')

  if (!text) throw new Error('Công thức đang trống.')
  if (/[A-Za-z0-9)\]]-$/.test(text)) {
    throw new Error(`Viết điện tích ion bằng dấu ^, ví dụ MnO4^- hoặc Fe^3+ (đang nhập "${raw}").`)
  }

  const coefficientMatch = text.match(/^(\d+)(?=[A-Z([{])/)
  const coefficient = coefficientMatch ? Number(coefficientMatch[1]) : 1
  if (coefficientMatch) text = text.slice(coefficientMatch[1].length)
  if (coefficient === 0) throw new Error('Hệ số phải lớn hơn 0.')

  const { body, charge } = splitCharge(text)
  const atoms = {}

  for (const part of body.split(/[·.]/)) {
    if (!part) throw new Error(`Công thức "${raw}" không hợp lệ.`)
    const match = part.match(/^(\d+)(?=[A-Z([{])/)
    const multiplier = match ? Number(match[1]) : 1
    merge(atoms, parseGroup(match ? part.slice(match[1].length) : part), multiplier)
  }

  if (!Object.keys(atoms).length) throw new Error(`Công thức "${raw}" không hợp lệ.`)

  return { formula: text, coefficient, atoms, charge }
}

export function parseFormula(raw) {
  return parseSpecies(raw).atoms
}
