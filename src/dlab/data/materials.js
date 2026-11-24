// ChemLab 7.0 Dynamic Lab — material registry.
// Every numeric constant names its table in SOURCES; anything without data is left null, never guessed.
import { elements } from '../../data/elements.js'
import { parseFormula } from '../../chem/formula.js'

const ATOMIC_MASS = Object.fromEntries(elements.map(({ symbol, mass }) => [symbol, mass]))

export function molarMass(formula) {
  const atoms = parseFormula(formula)
  let total = 0
  for (const [symbol, count] of Object.entries(atoms)) {
    if (!(symbol in ATOMIC_MASS)) throw new Error(`Không có khối lượng nguyên tử của ${symbol}`)
    total += ATOMIC_MASS[symbol] * count
  }
  return total
}

export const SOURCES = {
  crc: 'CRC Handbook of Chemistry and Physics (bảng Ksp, Ka, độ tan, khối lượng riêng, 25 °C)',
  nbs: 'NBS Tables of Chemical Thermodynamic Properties (1982) — ΔfH° ion trong nước, 25 °C',
  sgk: 'SGK Hóa học THCS–THPT (Chương trình GDPT 2018) — hiện tượng quan sát định tính',
  harris: 'Harris, Quantitative Chemical Analysis — khoảng đổi màu chất chỉ thị',
  faraday: 'Định luật Faraday, F = 96485 C/mol (CODATA)',
  model: 'Xấp xỉ giáo dục của ChemLab — chỉ để minh họa, không phải số liệu đo'
}

// Dissolved species used in the charge balance. z = charge.
// hydrolysisKa: M^z+ + H2O ⇌ MOH + H+ ; dimerBeta: 2M^z+ + 2H2O ⇌ M2(OH)2 + 2H+ (I = 0, 25 °C).
// Sources: COST Action 1802 hydrolysis compilation (2024) of Baes & Mesmer 1976 / IUPAC Powell 2007, 2013.
export const IONS = {
  'Na+': { z: 1, label: 'Na⁺' },
  'K+': { z: 1, label: 'K⁺' },
  'Ag+': { z: 1, label: 'Ag⁺' },
  'Ba2+': { z: 2, label: 'Ba²⁺' },
  'Ca2+': { z: 2, label: 'Ca²⁺' },
  'Mg2+': { z: 2, label: 'Mg²⁺' },
  'Zn2+': { z: 2, label: 'Zn²⁺', hydrolysisKa: 10 ** -8.96 }, // Powell 2013
  'Cu2+': { z: 2, label: 'Cu²⁺', hydrolysisKa: 10 ** -7.95, dimerBeta: 10 ** -10.43, color: [70, 140, 230], colorPerM: 1.6 }, // Powell 2007
  'Fe2+': { z: 2, label: 'Fe²⁺', hydrolysisKa: 10 ** -9.5, color: [150, 200, 140], colorPerM: 0.8 }, // Baes & Mesmer 1976
  'Fe3+': { z: 3, label: 'Fe³⁺', hydrolysisKa: 10 ** -2.19, color: [205, 140, 40], colorPerM: 3 }, // Baes & Mesmer 1976
  'Cl-': { z: -1, label: 'Cl⁻' },
  'NO3-': { z: -1, label: 'NO₃⁻' },
  'I-': { z: -1, label: 'I⁻' },
  // Weak systems: the stored amount is the analytical total; speciation is solved from pH.
  SO4: { z: 0, label: 'SO₄²⁻/HSO₄⁻', weak: 'sulfate' },
  OAc: { z: 0, label: 'CH₃COOH/CH₃COO⁻', weak: 'acetate' },
  NH3: { z: 0, label: 'NH₃/NH₄⁺', weak: 'ammonia' },
  CO3: { z: 0, label: 'H₂CO₃/HCO₃⁻/CO₃²⁻', weak: 'carbonate' }
}

// Acid constants at 25 °C (CRC). Contribution to charge balance is solved in chemistry.js.
export const WEAK = {
  sulfate: { Ka2: 1.0e-2 }, // pKa2 1.99, CRC 84th ed.
  acetate: { Ka: 1.75e-5 },
  ammonia: { Ka: 5.6e-10 },
  carbonate: { Ka1: 4.45e-7, Ka2: 4.69e-11 }
}

export const KW = 1.0e-14
export const HENRY_CO2 = 3.4e-2 // mol/(L·atm), 25 °C
export const FARADAY = 96485

// Sparingly soluble salts. cation/anion keys refer to IONS; anion 'OH' is derived from pH.
export const PRECIPITATES = {
  AgCl: { name: 'Bạc clorua', formula: 'AgCl', cation: 'Ag+', anion: 'Cl-', p: 1, q: 1, Ksp: 1.77e-10, color: [245, 245, 240], density: 5.56 },
  AgI: { name: 'Bạc iotua', formula: 'AgI', cation: 'Ag+', anion: 'I-', p: 1, q: 1, Ksp: 8.52e-17, color: [240, 220, 120], density: 5.68 },
  BaSO4: { name: 'Bari sunfat', formula: 'BaSO4', cation: 'Ba2+', anion: 'SO4', p: 1, q: 1, Ksp: 1.08e-10, color: [250, 250, 250], density: 4.5 },
  CaCO3: { name: 'Canxi cacbonat', formula: 'CaCO3', cation: 'Ca2+', anion: 'CO3', p: 1, q: 1, Ksp: 3.36e-9, color: [245, 245, 245], density: 2.71 },
  'Cu(OH)2': { name: 'Đồng(II) hiđroxit', formula: 'Cu(OH)2', cation: 'Cu2+', anion: 'OH', p: 1, q: 2, Ksp: 2.2e-20, color: [90, 160, 230], density: 3.37 },
  'Fe(OH)3': { name: 'Sắt(III) hiđroxit', formula: 'Fe(OH)3', cation: 'Fe3+', anion: 'OH', p: 1, q: 3, Ksp: 2.79e-39, color: [160, 80, 30], density: 3.4 },
  'Fe(OH)2': { name: 'Sắt(II) hiđroxit', formula: 'Fe(OH)2', cation: 'Fe2+', anion: 'OH', p: 1, q: 2, Ksp: 4.87e-17, color: [200, 220, 200], density: 3.4 },
  'Mg(OH)2': { name: 'Magie hiđroxit', formula: 'Mg(OH)2', cation: 'Mg2+', anion: 'OH', p: 1, q: 2, Ksp: 5.61e-12, color: [248, 248, 248], density: 2.34 },
  // Added 2026-11-24 (CRC 25 °C). Zn(OH)₂ redissolving in excess base (amphoteric) is NOT modelled: flagged as unsupported.
  BaCO3: { name: 'Bari cacbonat', formula: 'BaCO3', cation: 'Ba2+', anion: 'CO3', p: 1, q: 1, Ksp: 2.58e-9, color: [250, 250, 250], density: 4.29 },
  ZnCO3: { name: 'Kẽm cacbonat', formula: 'ZnCO3', cation: 'Zn2+', anion: 'CO3', p: 1, q: 1, Ksp: 1.46e-10, color: [248, 248, 245], density: 4.4 },
  Ag2CO3: { name: 'Bạc cacbonat', formula: 'Ag2CO3', cation: 'Ag+', anion: 'CO3', p: 2, q: 1, Ksp: 8.46e-12, color: [240, 232, 200], density: 6.08 },
  CaSO4: { name: 'Canxi sunfat', formula: 'CaSO4', cation: 'Ca2+', anion: 'SO4', p: 1, q: 1, Ksp: 4.93e-5, color: [250, 250, 250], density: 2.96 },
  Ag2SO4: { name: 'Bạc sunfat', formula: 'Ag2SO4', cation: 'Ag+', anion: 'SO4', p: 2, q: 1, Ksp: 1.2e-5, color: [250, 250, 250], density: 5.45 },
  'Zn(OH)2': { name: 'Kẽm hiđroxit', formula: 'Zn(OH)2', cation: 'Zn2+', anion: 'OH', p: 1, q: 2, Ksp: 3e-17, color: [250, 250, 250], density: 3.05 }
}

// Pure liquids: density g/mL, heat capacity J/(g·K), aqueous = hosts dissolved ions.
export const LIQUIDS = {
  water: { name: 'Nước', formula: 'H2O', density: 0.997, cp: 4.18, aqueous: true, color: [215, 235, 250], miscibleWith: ['water', 'ethanol'] },
  ethanol: { name: 'Etanol', formula: 'C2H5OH', density: 0.789, cp: 2.44, aqueous: true, color: [235, 240, 250], miscibleWith: ['water', 'ethanol'] },
  oil: { name: 'Dầu ăn', formula: null, density: 0.92, cp: 2.0, aqueous: false, color: [240, 200, 60], miscibleWith: ['oil'] }
}

// Solubility (g solute / 100 g water). KNO3 is temperature dependent (CRC table, linear interpolation).
export const SOLUBILITY = {
  NaCl: { ion: 'Na+', counter: 'Cl-', formula: 'NaCl', table: [[0, 35.7], [20, 35.9], [40, 36.4], [60, 37.1], [80, 38.0], [100, 39.2]] },
  KNO3: { ion: 'K+', counter: 'NO3-', formula: 'KNO3', table: [[0, 13.3], [10, 20.9], [20, 31.6], [30, 45.8], [40, 63.9], [50, 85.5], [60, 110], [70, 138], [80, 169], [90, 202], [100, 246]] }
}

export function solubilityAt(key, T) {
  const table = SOLUBILITY[key].table
  if (T <= table[0][0]) return table[0][1]
  for (let i = 1; i < table.length; i += 1) {
    const [t1, s1] = table[i]
    const [t0, s0] = table[i - 1]
    if (T <= t1) return s0 + (s1 - s0) * (T - t0) / (t1 - t0)
  }
  return table[table.length - 1][1]
}

// Indicators: colour = mix of acid and base form by fraction 1/(1+10^(pKin−pH)).
// Universal indicator uses a stepped chart, so it is marked qualitative.
export const INDICATORS = {
  // Litmus has a broad violet plateau around neutral, so it is charted rather than a single sigmoid.
  litmus: { name: 'Quỳ tím', validation: 'qualitative', range: 'đỏ < 5 · tím 5,5–7,5 · xanh > 8,3', neutral: [130, 70, 160], chart: [[4.5, [210, 50, 60]], [5.5, [130, 70, 160]], [7.5, [130, 70, 160]], [8.3, [50, 80, 200]]] },
  phenolphthalein: { name: 'Phenolphtalein', pKin: 9.4, acid: [255, 255, 255, 0], base: [230, 40, 150], validation: 'quantitative-range', range: 'không màu < 8,2 · hồng 8,2–10' },
  methylOrange: { name: 'Metyl da cam', pKin: 3.46, acid: [220, 40, 40], base: [245, 190, 40], validation: 'quantitative-range', range: 'đỏ < 3,1 · vàng > 4,4' },
  universal: {
    name: 'Chất chỉ thị vạn năng',
    validation: 'qualitative',
    range: 'thang màu pH 1–14',
    chart: [[1, [200, 30, 40]], [3, [240, 110, 40]], [5, [245, 200, 50]], [7, [80, 170, 70]], [9, [40, 120, 200]], [11, [60, 60, 170]], [13, [110, 40, 140]]]
  }
}

export function indicatorColor(key, pH) {
  const ind = INDICATORS[key]
  if (ind.chart) {
    const chart = ind.chart
    if (pH <= chart[0][0]) return [...chart[0][1], 1]
    for (let i = 1; i < chart.length; i += 1) {
      if (pH <= chart[i][0]) {
        const t = (pH - chart[i - 1][0]) / (chart[i][0] - chart[i - 1][0])
        return [...mixRgb(chart[i - 1][1], chart[i][1], t), 1]
      }
    }
    return [...chart[chart.length - 1][1], 1]
  }
  const f = 1 / (1 + 10 ** (ind.pKin - pH))
  const alphaA = ind.acid[3] ?? 1
  const alphaB = ind.base[3] ?? 1
  return [...mixRgb(ind.acid, ind.base, f), alphaA + (alphaB - alphaA) * f]
}

export function mixRgb(a, b, t) {
  return [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * t))
}

const H = { corrosive: 'Ăn mòn', irritant: 'Gây kích ứng', toxic: 'Độc', flammable: 'Dễ cháy', water: 'Phản ứng mạnh với nước', oxidizer: 'Chất oxi hóa', env: 'Độc cho môi trường nước' }
export const HAZARD_LABELS = H

// Reagents the library offers. Solutions: per mol solute, ions released (analytical totals).
function solution(id, name, nameEn, formula, M, ions, extra = {}) {
  return { id, kind: 'solution', name, nameEn, formula, M, ions, solvent: 'water', molarMass: molarMass(formula), ...extra }
}

export const REAGENTS = [
  solution('hcl', 'Axit clohiđric', 'Hydrochloric acid', 'HCl', 0.5, { 'Cl-': 1 }, { group: 'acid', hazards: ['corrosive'], safety: 'Ăn mòn da và mắt; đeo kính bảo hộ, găng tay.' }),
  solution('h2so4', 'Axit sunfuric loãng', 'Dilute sulfuric acid', 'H2SO4', 0.25, { SO4: 1 }, { group: 'acid', hazards: ['corrosive'], safety: 'Axit loãng vẫn gây bỏng; luôn rót axit vào nước khi pha.' }),
  solution('hno3', 'Axit nitric loãng', 'Dilute nitric acid', 'HNO3', 0.5, { 'NO3-': 1 }, { group: 'acid', hazards: ['corrosive', 'oxidizer'], safety: 'Ăn mòn, có tính oxi hóa; tránh tiếp xúc da.' }),
  solution('ch3cooh', 'Axit axetic', 'Acetic acid', 'CH3COOH', 1, { OAc: 1 }, { group: 'organic', hazards: ['irritant'], safety: 'Mùi xốc, gây kích ứng mắt.' }),
  solution('naoh', 'Natri hiđroxit', 'Sodium hydroxide', 'NaOH', 0.5, { 'Na+': 1 }, { group: 'base', hazards: ['corrosive'], safety: 'Bazơ mạnh, ăn mòn da; đeo kính và găng tay.' }),
  solution('koh', 'Kali hiđroxit', 'Potassium hydroxide', 'KOH', 0.5, { 'K+': 1 }, { group: 'base', hazards: ['corrosive'], safety: 'Bazơ mạnh, ăn mòn da.' }),
  solution('caoh2', 'Nước vôi trong', 'Limewater', 'Ca(OH)2', 0.02, { 'Ca2+': 1 }, { group: 'base', hazards: ['irritant'], safety: 'Gây kích ứng mắt.' }),
  solution('nh3', 'Dung dịch amoniac', 'Aqueous ammonia', 'NH3', 0.5, { NH3: 1 }, { group: 'base', hazards: ['irritant'], safety: 'Mùi khai, gây kích ứng đường hô hấp; dùng nơi thoáng khí.' }),
  solution('nacl', 'Natri clorua', 'Sodium chloride', 'NaCl', 0.5, { 'Na+': 1, 'Cl-': 1 }, { group: 'salt', hazards: [], safety: 'Ít nguy hiểm.' }),
  solution('na2so4', 'Natri sunfat', 'Sodium sulfate', 'Na2SO4', 0.2, { 'Na+': 2, SO4: 1 }, { group: 'salt', hazards: [], safety: 'Ít nguy hiểm.' }),
  solution('bacl2', 'Bari clorua', 'Barium chloride', 'BaCl2', 0.2, { 'Ba2+': 1, 'Cl-': 2 }, { group: 'salt', hazards: ['toxic'], safety: 'Hợp chất bari tan độc khi nuốt; rửa tay sau thí nghiệm.' }),
  solution('agno3', 'Bạc nitrat', 'Silver nitrate', 'AgNO3', 0.1, { 'Ag+': 1, 'NO3-': 1 }, { group: 'salt', hazards: ['corrosive', 'env'], safety: 'Làm đen da, độc với sinh vật nước; không đổ xuống cống.' }),
  solution('cuso4', 'Đồng(II) sunfat', 'Copper(II) sulfate', 'CuSO4', 0.5, { 'Cu2+': 1, SO4: 1 }, { group: 'salt', hazards: ['irritant', 'env'], safety: 'Độc khi nuốt, độc với sinh vật nước.' }),
  solution('cucl2', 'Đồng(II) clorua', 'Copper(II) chloride', 'CuCl2', 0.5, { 'Cu2+': 1, 'Cl-': 2 }, { group: 'salt', hazards: ['irritant', 'env'], safety: 'Độc khi nuốt; điện phân sinh khí Cl₂ độc.' }),
  solution('feso4', 'Sắt(II) sunfat', 'Iron(II) sulfate', 'FeSO4', 0.2, { 'Fe2+': 1, SO4: 1 }, { group: 'salt', hazards: ['irritant'], safety: 'Gây kích ứng.' }),
  solution('fecl3', 'Sắt(III) clorua', 'Iron(III) chloride', 'FeCl3', 0.2, { 'Fe3+': 1, 'Cl-': 3 }, { group: 'salt', hazards: ['corrosive'], safety: 'Ăn mòn, làm ố da.' }),
  solution('znso4', 'Kẽm sunfat', 'Zinc sulfate', 'ZnSO4', 0.5, { 'Zn2+': 1, SO4: 1 }, { group: 'salt', hazards: ['irritant'], safety: 'Gây kích ứng mắt.' }),
  solution('mgcl2', 'Magie clorua', 'Magnesium chloride', 'MgCl2', 0.2, { 'Mg2+': 1, 'Cl-': 2 }, { group: 'salt', hazards: [], safety: 'Ít nguy hiểm.' }),
  solution('cacl2', 'Canxi clorua', 'Calcium chloride', 'CaCl2', 0.2, { 'Ca2+': 1, 'Cl-': 2 }, { group: 'salt', hazards: ['irritant'], safety: 'Gây kích ứng mắt.' }),
  solution('na2co3', 'Natri cacbonat', 'Sodium carbonate', 'Na2CO3', 0.2, { 'Na+': 2, CO3: 1 }, { group: 'salt', hazards: ['irritant'], safety: 'Gây kích ứng mắt.' }),
  solution('nahco3', 'Natri hiđrocacbonat', 'Sodium bicarbonate', 'NaHCO3', 0.5, { 'Na+': 1, CO3: 1 }, { group: 'salt', hazards: [], safety: 'Ít nguy hiểm.' }),
  solution('ki', 'Kali iotua', 'Potassium iodide', 'KI', 0.1, { 'K+': 1, 'I-': 1 }, { group: 'salt', hazards: [], safety: 'Ít nguy hiểm.' }),
  { id: 'water', kind: 'liquid', liquid: 'water', name: 'Nước cất', nameEn: 'Distilled water', formula: 'H2O', molarMass: molarMass('H2O'), group: 'liquid', hazards: [], safety: 'An toàn.' },
  { id: 'ethanol', kind: 'liquid', liquid: 'ethanol', name: 'Etanol', nameEn: 'Ethanol', formula: 'C2H5OH', molarMass: molarMass('C2H5OH'), group: 'organic', hazards: ['flammable'], safety: 'Dễ cháy; tránh xa ngọn lửa.' },
  { id: 'oil', kind: 'liquid', liquid: 'oil', name: 'Dầu ăn', nameEn: 'Vegetable oil', formula: null, molarMass: null, group: 'organic', hazards: [], safety: 'Trơn trượt khi đổ ra bàn.' },
  { id: 'litmus', kind: 'indicator', indicator: 'litmus', name: 'Dung dịch quỳ tím', nameEn: 'Litmus solution', formula: null, molarMass: null, group: 'indicator', hazards: [], safety: 'An toàn.' },
  { id: 'phenolphthalein', kind: 'indicator', indicator: 'phenolphthalein', name: 'Phenolphtalein', nameEn: 'Phenolphthalein', formula: 'C20H14O4', molarMass: molarMass('C20H14O4'), group: 'indicator', hazards: ['flammable'], safety: 'Dung dịch pha trong cồn, dễ cháy.' },
  { id: 'methylOrange', kind: 'indicator', indicator: 'methylOrange', name: 'Metyl da cam', nameEn: 'Methyl orange', formula: 'C14H14N3NaO3S', molarMass: molarMass('C14H14N3NaO3S'), group: 'indicator', hazards: ['toxic'], safety: 'Độc khi nuốt.' },
  { id: 'universal', kind: 'indicator', indicator: 'universal', name: 'Chỉ thị vạn năng', nameEn: 'Universal indicator', formula: null, molarMass: null, group: 'indicator', hazards: ['flammable'], safety: 'Pha trong cồn, dễ cháy.' },
  // Solids. shape: sphere | ribbon | cylinder | powder. density g/cm³ (CRC).
  { id: 'na', kind: 'solid', name: 'Natri (mẩu)', nameEn: 'Sodium', formula: 'Na', molarMass: molarMass('Na'), density: 0.968, shape: 'sphere', defaultMass: 0.1, maxMass: 0.2, tool: 'tongs', group: 'metal', color: [200, 205, 210], hazards: ['water', 'flammable', 'corrosive'], safety: 'Phản ứng mãnh liệt với nước, sinh H₂ dễ cháy và NaOH ăn mòn. Chỉ dùng mẩu nhỏ bằng hạt đậu xanh, dùng kẹp.' },
  { id: 'mg', kind: 'solid', name: 'Magie (dải)', nameEn: 'Magnesium ribbon', formula: 'Mg', molarMass: molarMass('Mg'), density: 1.738, shape: 'ribbon', defaultMass: 0.05, maxMass: 0.5, tool: 'tongs', group: 'metal', color: [190, 195, 200], hazards: ['flammable'], safety: 'Dễ cháy khi đốt, cháy sáng chói.' },
  { id: 'zn', kind: 'solid', name: 'Kẽm (viên)', nameEn: 'Zinc granule', formula: 'Zn', molarMass: molarMass('Zn'), density: 7.14, shape: 'sphere', defaultMass: 0.5, maxMass: 5, tool: 'tongs', group: 'metal', color: [165, 170, 180], hazards: [], safety: 'Ít nguy hiểm.' },
  { id: 'fe', kind: 'solid', name: 'Đinh sắt', nameEn: 'Iron nail', formula: 'Fe', molarMass: molarMass('Fe'), density: 7.874, shape: 'cylinder', defaultMass: 2, maxMass: 5, tool: 'tongs', group: 'metal', color: [110, 115, 125], hazards: [], safety: 'Cẩn thận đầu nhọn.' },
  { id: 'cu', kind: 'solid', name: 'Dây đồng', nameEn: 'Copper wire', formula: 'Cu', molarMass: molarMass('Cu'), density: 8.96, shape: 'cylinder', defaultMass: 1, maxMass: 5, tool: 'tongs', group: 'metal', color: [200, 110, 60], hazards: [], safety: 'Ít nguy hiểm.' },
  { id: 'caco3', kind: 'solid', name: 'Đá vôi (CaCO₃)', nameEn: 'Marble chips', formula: 'CaCO3', molarMass: molarMass('CaCO3'), density: 2.71, shape: 'sphere', defaultMass: 1, maxMass: 5, tool: 'tongs', group: 'salt', color: [235, 232, 225], hazards: [], safety: 'Ít nguy hiểm.' },
  { id: 'nacl-s', kind: 'solid', name: 'Muối ăn (tinh thể)', nameEn: 'Sodium chloride crystals', formula: 'NaCl', dissolves: 'NaCl', molarMass: molarMass('NaCl'), density: 2.165, shape: 'powder', defaultMass: 2, maxMass: 20, tool: 'spatula', group: 'salt', color: [250, 250, 250], hazards: [], safety: 'Ít nguy hiểm.' },
  { id: 'kno3-s', kind: 'solid', name: 'Kali nitrat (tinh thể)', nameEn: 'Potassium nitrate', formula: 'KNO3', dissolves: 'KNO3', molarMass: molarMass('KNO3'), density: 2.11, shape: 'powder', defaultMass: 5, maxMass: 30, tool: 'spatula', group: 'salt', color: [250, 250, 250], hazards: ['oxidizer'], safety: 'Chất oxi hóa; tránh xa chất dễ cháy.' },
  { id: 'nahco3-s', kind: 'solid', name: 'Bột NaHCO₃', nameEn: 'Baking soda', formula: 'NaHCO3', dissolves: 'NaHCO3', molarMass: molarMass('NaHCO3'), density: 2.2, shape: 'powder', defaultMass: 1, maxMass: 10, tool: 'spatula', group: 'salt', color: [250, 250, 250], hazards: [], safety: 'Ít nguy hiểm.' },
  { id: 'co2', kind: 'gas', name: 'Khí CO₂ (bình)', nameEn: 'Carbon dioxide', formula: 'CO2', molarMass: molarMass('CO2'), group: 'gas', hazards: [], safety: 'Gây ngạt ở nồng độ cao; dùng nơi thoáng.' }
]

// Solid salts that dissolve completely give these ions per formula unit.
export const SALT_IONS = {
  NaCl: { 'Na+': 1, 'Cl-': 1 },
  KNO3: { 'K+': 1, 'NO3-': 1 },
  NaHCO3: { 'Na+': 1, CO3: 1 }
}
// NaHCO3 solubility: 9.6 g/100 g water at 20 °C (CRC); treated as constant.
SOLUBILITY.NaHCO3 = { ion: 'Na+', counter: 'CO3', formula: 'NaHCO3', table: [[0, 6.9], [20, 9.6], [40, 12.7], [60, 16.4]] }

export const REAGENT_BY_ID = Object.fromEntries(REAGENTS.map(r => [r.id, r]))

export const GASES = {
  H2: { name: 'Khí hiđro', formula: 'H₂', visible: false, hazard: 'Dễ cháy, nổ khi trộn với không khí và gặp lửa.' },
  CO2: { name: 'Khí cacbon đioxit', formula: 'CO₂', visible: false, hazard: 'Không màu, nặng hơn không khí.' },
  Cl2: { name: 'Khí clo', formula: 'Cl₂', visible: true, color: [200, 220, 120], hazard: 'Màu vàng lục, rất độc — chỉ thao tác trong tủ hút.' },
  steam: { name: 'Hơi nước', formula: 'H₂O(h)', visible: true, color: [240, 245, 250], hazard: 'Gây bỏng khi tiếp xúc.' }
}
