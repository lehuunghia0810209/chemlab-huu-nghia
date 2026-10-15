/* =========================================================
   PERIODIC TABLE DATA
   Normalised element records (position, block, category,
   state, electron configuration) built from data/elements.js.
   No DOM here.
========================================================= */

import { elements } from '../data/elements.js'
import { getElectronConfiguration } from '../chem/electronConfiguration.js'

export const CATEGORIES = Object.freeze({
  alkali: { label: 'Kim loại kiềm' },
  alkaline: { label: 'Kim loại kiềm thổ' },
  transition: { label: 'Kim loại chuyển tiếp' },
  postTransition: { label: 'Kim loại sau chuyển tiếp' },
  metalloid: { label: 'Á kim' },
  nonmetal: { label: 'Phi kim' },
  halogen: { label: 'Halogen' },
  noble: { label: 'Khí hiếm' },
  lanthanide: { label: 'Họ Lanthanide' },
  actinide: { label: 'Họ Actinide' }
})

export const BLOCKS = Object.freeze({
  s: { label: 'Khối s' },
  p: { label: 'Khối p' },
  d: { label: 'Khối d' },
  f: { label: 'Khối f' }
})

export const STATES = Object.freeze({
  gas: { label: 'Khí' },
  liquid: { label: 'Lỏng' },
  solid: { label: 'Rắn' },
  unknown: { label: 'Chưa xác định' }
})

/* Physical state at 25 °C, 1 bar. Elements from Fm (Z = 100) on have
   never been made in bulk, so their state is not known experimentally. */
const GASES = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86])
const LIQUIDS = new Set([35, 80])
const FIRST_UNKNOWN_STATE = 100

function sequentialRow(start, end, column = 1) {
  const row = {}
  for (let number = start; number <= end; number += 1) row[number] = column + number - start
  return row
}

/* Column (group) of each main-table element, keyed by period. */
const PERIOD_ROWS = {
  1: { 1: 1, 2: 18 },
  2: { 3: 1, 4: 2, 5: 13, 6: 14, 7: 15, 8: 16, 9: 17, 10: 18 },
  3: { 11: 1, 12: 2, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18 },
  4: sequentialRow(19, 36),
  5: sequentialRow(37, 54),
  6: { 55: 1, 56: 2, ...sequentialRow(72, 86, 4) },
  7: { 87: 1, 88: 2, ...sequentialRow(104, 118, 4) }
}

export function isLanthanide(number) {
  return number >= 57 && number <= 71
}

export function isActinide(number) {
  return number >= 89 && number <= 103
}

function mainPosition(number) {
  for (const [period, row] of Object.entries(PERIOD_ROWS)) {
    if (row[number] !== undefined) return { period: Number(period), group: row[number] }
  }
  return null
}

function position(number) {
  if (isLanthanide(number)) return { period: 6, group: null, block: 'f', fIndex: number - 57 }
  if (isActinide(number)) return { period: 7, group: null, block: 'f', fIndex: number - 89 }

  const { period, group } = mainPosition(number)
  let block = 'p'
  if (group <= 2 || number === 2) block = 's'
  else if (group <= 12) block = 'd'
  return { period, group, block, fIndex: null }
}

const CATEGORY_BY_SOURCE = Object.freeze({
  'alkali metal': 'alkali',
  'alkaline earth metal': 'alkaline',
  'transition metal': 'transition',
  'post-transition metal': 'postTransition',
  'metalloid': 'metalloid',
  'nonmetal': 'nonmetal',
  'halogen': 'halogen',
  'noble gas': 'noble',
  'lanthanide': 'lanthanide',
  'actinide': 'actinide'
})

function categoryOf(number, source) {
  if (isLanthanide(number)) return 'lanthanide'
  if (isActinide(number)) return 'actinide'
  return CATEGORY_BY_SOURCE[String(source || '').toLowerCase()] || 'postTransition'
}

function stateOf(number) {
  if (number >= FIRST_UNKNOWN_STATE) return 'unknown'
  if (GASES.has(number)) return 'gas'
  if (LIQUIDS.has(number)) return 'liquid'
  return 'solid'
}

export const ELEMENTS = Object.freeze(elements.map(raw => {
  const where = position(raw.number)
  return Object.freeze({
    number: raw.number,
    symbol: raw.symbol,
    name: raw.name,
    mass: raw.mass,
    category: categoryOf(raw.number, raw.category),
    state: stateOf(raw.number),
    ...where,
    /* Properties of Z ≥ 104 are largely theoretical predictions. */
    predicted: raw.number >= 104,
    electron: getElectronConfiguration(raw.number)
  })
}))

export const ELEMENT_MAP = new Map(ELEMENTS.map(element => [element.number, element]))

export function getElement(number) {
  return ELEMENT_MAP.get(Number(number)) || null
}

/* Standard atomic weight for display; integers mean "mass number of the
   longest-lived isotope" and are shown in brackets by convention. */
export function formatMass(mass) {
  const value = Number(mass)
  if (!Number.isFinite(value)) return '—'
  if (Number.isInteger(value)) return `[${value}]`
  return value.toLocaleString('vi-VN', { maximumFractionDigits: 3 })
}

export function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
}

/* Search ranks exact symbol / atomic number above partial name matches. */
export function searchElements(query) {
  const text = normalizeSearch(query)
  if (!text) return ELEMENTS

  const scored = []
  for (const element of ELEMENTS) {
    const symbol = element.symbol.toLowerCase()
    const name = normalizeSearch(element.name)
    let score = 0
    if (String(element.number) === text) score = 100
    else if (symbol === text) score = 90
    else if (name === text) score = 80
    else if (name.startsWith(text)) score = 60
    else if (symbol.startsWith(text)) score = 50
    else if (name.includes(text) || normalizeSearch(CATEGORIES[element.category].label).includes(text)) score = 20
    if (score) scored.push({ element, score })
  }
  return scored.sort((a, b) => b.score - a.score || a.element.number - b.element.number).map(item => item.element)
}
