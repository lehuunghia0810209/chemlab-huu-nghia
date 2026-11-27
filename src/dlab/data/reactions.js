// Heterogeneous (solid + solution) reactions. Stoichiometry and ΔH are quantitative;
// rate constants k are educational approximations chosen so a demo runs in seconds to minutes.
// rate (mol/s) = k · A(cm²) · driver, driver = [H⁺] | [ion] | 1 (water). ΔH from NBS ΔfH° (J/mol of solid).

export const KINETIC = [
  { id: 'mg-acid', solid: 'mg', driver: 'h', nitrateUnsupported: true, k: 3.5e-5, gives: { 'Mg2+': 1 }, gas: { H2: 1 }, dH: -466850, equation: 'Mg + 2H⁺ → Mg²⁺ + H₂↑', observe: 'Dải magie tan dần, sủi bọt khí không màu mạnh, dung dịch ấm lên.' },
  { id: 'zn-acid', solid: 'zn', driver: 'h', nitrateUnsupported: true, k: 2e-5, gives: { 'Zn2+': 1 }, gas: { H2: 1 }, dH: -153890, equation: 'Zn + 2H⁺ → Zn²⁺ + H₂↑', observe: 'Viên kẽm tan dần, có bọt khí không màu.' },
  { id: 'fe-acid', solid: 'fe', driver: 'h', nitrateUnsupported: true, k: 4e-6, gives: { 'Fe2+': 1 }, gas: { H2: 1 }, dH: -89100, equation: 'Fe + 2H⁺ → Fe²⁺ + H₂↑', observe: 'Bọt khí nhỏ thoát ra chậm trên bề mặt đinh sắt.' },
  { id: 'fe-cu', solid: 'fe', driver: 'Cu2+', k: 2e-5, consumes: { 'Cu2+': 1 }, gives: { 'Fe2+': 1 }, deposit: { Cu: 1 }, dH: -153870, equation: 'Fe + Cu²⁺ → Fe²⁺ + Cu', observe: 'Lớp đồng màu đỏ bám lên đinh sắt, màu xanh của dung dịch nhạt dần.' },
  { id: 'zn-cu', solid: 'zn', driver: 'Cu2+', k: 3e-5, consumes: { 'Cu2+': 1 }, gives: { 'Zn2+': 1 }, deposit: { Cu: 1 }, dH: -218660, equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu', observe: 'Kẽm phủ lớp đồng đỏ, dung dịch nhạt màu xanh.' },
  { id: 'cu-ag', solid: 'cu', driver: 'Ag+', k: 2e-5, consumes: { 'Ag+': 2 }, gives: { 'Cu2+': 1 }, deposit: { Ag: 2 }, dH: -146390, equation: 'Cu + 2Ag⁺ → Cu²⁺ + 2Ag', observe: 'Dây đồng phủ lớp bạc xám, dung dịch dần có màu xanh.' },
  { id: 'na-water', solid: 'na', driver: 'water', water: 1, k: 4e-4, gives: { 'Na+': 1 }, gas: { H2: 0.5 }, dH: -184280, moves: true, equation: '2Na + 2H₂O → 2NaOH + H₂↑', observe: 'Mẩu natri nổi, chạy trên mặt nước, tan dần, có khí thoát ra; dung dịch thành bazơ.' },
  { id: 'caco3-acid', solid: 'caco3', driver: 'h', k: 1.5e-5, gives: { 'Ca2+': 1 }, gas: { CO2: 1 }, dH: -15250, equation: 'CaCO₃ + 2H⁺ → Ca²⁺ + CO₂↑ + H₂O', observe: 'Đá vôi sủi bọt khí không màu, tan dần.' }
]

// Reactions the engine knows a solid does NOT undergo in water/solution under lab conditions
// (so the UI can say "không phản ứng" instead of "chưa có mô hình").
export const NO_REACTION = [
  { solid: 'cu', driver: 'h', reason: 'Cu đứng sau H trong dãy hoạt động hóa học, không đẩy được H₂ khỏi axit loãng (HCl, H₂SO₄ loãng).' },
  { solid: 'cu', driver: 'Zn2+', reason: 'Cu yếu hơn Zn nên không khử được Zn²⁺.' },
  { solid: 'fe', driver: 'Zn2+', reason: 'Fe yếu hơn Zn nên không khử được Zn²⁺.' },
  { solid: 'cu', driver: 'Fe2+', reason: 'Cu yếu hơn Fe nên không khử được Fe²⁺.' }
]

// Standard reduction potentials E° (V, 25 °C; CRC Handbook, "Electrochemical Series") for the metal ions and
// metals on the bench. Used only to classify a metal + ion pair the registry has no rule for:
// a weaker oxidant → NO_REACTION; a stronger one → UNSUPPORTED (it would react, but is not modelled).
export const ION_E0 = { 'K+': -2.93, 'Ba2+': -2.91, 'Ca2+': -2.87, 'Na+': -2.71, 'Mg2+': -2.37, 'Mn2+': -1.18, 'Zn2+': -0.76, 'Fe2+': -0.44, 'Cu2+': 0.34, 'Ag+': 0.80 }
export const METAL_E0 = { mg: -2.37, zn: -0.76, fe: -0.44, cu: 0.34 }
export const ION_NAME = { 'K+': 'K⁺', 'Ba2+': 'Ba²⁺', 'Ca2+': 'Ca²⁺', 'Na+': 'Na⁺', 'Mg2+': 'Mg²⁺', 'Mn2+': 'Mn²⁺', 'Zn2+': 'Zn²⁺', 'Fe2+': 'Fe²⁺', 'Cu2+': 'Cu²⁺', 'Ag+': 'Ag⁺' }

// Solution-phase processes outside the model, detected from the dissolved species alone.
// minPH/maxPH: only in that pH range. Reported as "Chưa hỗ trợ mô phỏng", never given a guessed product.
export const ION_HINTS = [
  // Ag₂O forms when free [Ag⁺]·[OH⁻] exceeds K = 2,0·10⁻⁸ (½Ag₂O + ½H₂O ⇌ Ag⁺ + OH⁻, CRC) — e.g. pH ≈ 7,6
  // in 0,05 M Ag⁺, but not over Ag₂CO₃ in carbonate (free Ag⁺ is tiny there).
  { all: ['Ag+'], kspOH: 2.0e-8, reason: 'Ag⁺ trong môi trường kiềm tạo Ag₂O nâu đen — chưa được mô hình hóa.' },
  { all: ['NO3-', 'I-'], maxPH: 3, reason: 'HNO₃ oxi hóa I⁻ thành I₂ (và tạo NO) — chưa được mô hình hóa.' },
  { all: ['NO3-', 'Fe2+'], maxPH: 3, reason: 'HNO₃ oxi hóa Fe²⁺ thành Fe³⁺ (và tạo NO) — chưa được mô hình hóa.' },
  { all: ['Ag+', 'Fe2+'], dissolved: true, reason: 'Ag⁺ + Fe²⁺ ⇌ Ag↓ + Fe³⁺ (E° 0,80 > 0,77 V, phản ứng thuận nghịch) — chưa được mô hình hóa.' },
  { all: ['Cu2+', 'CO3'], minPH: 5.5, reason: 'Cu²⁺ với cacbonat thực tế tạo đồng cacbonat bazơ Cu₂(OH)₂CO₃ màu xanh lục; mô phỏng chỉ có Cu(OH)₂ — chưa mô hình hóa chính xác.' },
  // IO⁻ is not stable at room temperature: the overall change is 3I₂ + 6OH⁻ → 5I⁻ + IO₃⁻ + 3H₂O.
  { all: ['I2'], minPH: 9, reason: 'I₂ trong kiềm tự oxi hóa – khử thành I⁻ và IO₃⁻ (3I₂ + 6OH⁻ → 5I⁻ + IO₃⁻ + 3H₂O, dung dịch mất màu) — chưa được mô hình hóa.' },
  // pH > 12: excess NaOH (pH ≈ 13), not NH₃ 2 M (pH ≈ 11,8), where zinc dissolves as [Zn(NH₃)₄]²⁺ (modelled).
  // Sparingly soluble salts whose ideal Ksp would contradict the library's own solutions (limewater 0,02 M would be
  // supersaturated): flagged when Q exceeds the product at the measured solubility (concentration basis, 25 °C).
  // Ca(OH)₂ ≈ 0,0216 M → 4s³ ≈ 4,0·10⁻⁵; CaSO₄ (gypsum) ≈ 0,015 M → s² ≈ 2,3·10⁻⁴ (CRC solubility tables; values to recheck).
  { all: ['Ca2+'], qMin: { anion: 'OH', n: 2, K: 4.0e-5 }, reason: 'Ca²⁺ với kiềm đặc (vd. CaCl₂ + NaOH) tạo kết tủa trắng Ca(OH)₂ ít tan — chưa được mô hình hóa định lượng.' },
  { all: ['Ca2+', 'SO4'], qMin: { anion: 'SO4', n: 1, K: 2.3e-4 }, reason: 'Ca²⁺ với SO₄²⁻ ở nồng độ cao tạo kết tủa trắng CaSO₄ ít tan — chưa được mô hình hóa định lượng.' },
  { all: ['Mg2+', 'CO3'], minPH: 8, reason: 'Mg²⁺ với cacbonat thực tế tạo magie cacbonat bazơ màu trắng; mô phỏng chỉ có Mg(OH)₂ — chưa mô hình hóa chính xác.' },
  { all: ['Fe2+', 'CO3'], minPH: 6.5, reason: 'Fe²⁺ với cacbonat thực tế tạo FeCO₃ màu trắng xanh; mô phỏng chỉ có Fe(OH)₂ — chưa mô hình hóa chính xác.' },
  { all: ['Zn2+'], minPH: 12, reason: 'Zn(OH)₂ lưỡng tính tan trong kiềm dư tạo [Zn(OH)₄]²⁻ — chưa được mô hình hóa.' },
  // E°(MnO₄⁻/Mn²⁺) 1,51 V > E°(Cl₂/Cl⁻) 1,36 V: why the permanganate titration is acidified with H₂SO₄, never HCl.
  { all: ['MnO4-', 'Cl-'], maxPH: 2, reason: 'MnO₄⁻ trong axit có thể oxi hóa Cl⁻ thành khí Cl₂ độc (vì vậy chuẩn độ pemanganat dùng H₂SO₄, không dùng HCl) — phản ứng với Cl⁻ chưa được mô hình hóa.' },
  { all: ['MnO4-', 'SCN-'], reason: 'MnO₄⁻ oxi hóa SCN⁻ — chưa được mô hình hóa.' },
  { all: ['Cu2+', 'SCN-'], reason: 'Cu²⁺ với SCN⁻ tạo kết tủa Cu(SCN)₂ đen rồi CuSCN trắng — chưa được mô hình hóa.' },
  { all: ['MnO4-', 'I-'], reason: 'MnO₄⁻ oxi hóa I⁻ thành I₂ (sản phẩm của Mn phụ thuộc pH) — chưa được mô hình hóa.' },
  { all: ['MnO4-', 'Mn2+'], minPH: 2.5, reason: 'MnO₄⁻ và Mn²⁺ ở môi trường gần trung tính tạo MnO₂ nâu đen — chưa được mô hình hóa.' },
  // Mn(OH)₂ Ksp ≈ 2·10⁻¹³ (CRC): white, browns in air; not in the Ksp table.
  { all: ['Mn2+'], minPH: 8.5, reason: 'Mn²⁺ trong môi trường kiềm tạo kết tủa Mn(OH)₂ trắng, hóa nâu trong không khí — chưa được mô hình hóa.' },
  // Fe(SCN)₂⁺ … Fe(SCN)₆³⁻: ≥ 10 % of the iron when free SCN⁻ ≳ 5 mM (K2 ≈ 16–20): the 1:1 model then understates the red.
  { all: ['Fe3+', 'SCN-'], minFree: { ion: 'SCN-', c: 5e-3 }, reason: 'SCN⁻ dư nhiều (> 5 mM) tạo thêm phức Fe(SCN)₂⁺, Fe(SCN)₃… màu đỏ sẫm hơn; mô phỏng chỉ tính phức FeSCN²⁺ (1:1).' }
]

// Fast ionic redox in solution, run to completion (K ≫ 1). E° (CRC, 25 °C): Cu²⁺/CuI 0,86 V, Fe³⁺/Fe²⁺ 0,771 V,
// I₂(s)/I⁻ 0,5355 V, I₃⁻/I⁻ 0,536 V → log K = nΔE°/0,05916 ≈ 11 (Cu) and 7,9 (Fe, to I₂(s) or I₃⁻). For dissolved
// I₂(aq) (0,621 V) K is only ≈ 10⁵: a dilute stoichiometric Fe³⁺ + I⁻ mixture (~1 mM) leaves ~20 % unreacted.
// shortcut: complete conversion; the library uses excess I⁻ (I₃⁻), where conversion is > 99,9 %.
// maxPH: Fe³⁺/I⁻ only below pH ≈ 3 — above it Fe(OH)₃ (Ksp 2,8·10⁻³⁹) forms and E(Fe(OH)₃/Fe²⁺) ≈ 1,07 − 0,18·pH V
// falls below 0,54 V; Cu²⁺/I⁻ up to pH 7 (Cu(OH)₂ from pH ≈ 5 at 0,1 M — model boundary, not a measured limit).
export const ION_REDOX = [
  { id: 'cu-i', maxPH: 7, reactants: { 'Cu2+': 2, 'I-': 4 }, products: { I2: 1 }, precipitate: { CuI: 2 }, equation: '2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂', observe: 'xuất hiện kết tủa CuI màu trắng ngà, dung dịch chuyển vàng nâu do I₂ (I₃⁻ khi dư I⁻).' },
  { id: 'fe-i', maxPH: 3, reactants: { 'Fe3+': 2, 'I-': 2 }, products: { 'Fe2+': 2, I2: 1 }, equation: '2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂', observe: 'dung dịch chuyển vàng nâu do I₂ (I₃⁻ khi dư I⁻) sinh ra.', inputs: 'FeCl₃ + KI', demo: { fill: [['fecl3', 10]], pour: ['ki', 20], expect: { ion: 'I2' } } },
  // E°(MnO₄⁻/Mn²⁺) = 1,51 V vs E°(Fe³⁺/Fe²⁺) = 0,771 V: K ≈ 10⁶² for 5 e⁻, fast at 25 °C (the permanganate titration of iron(II)).
  // Mn²⁺ is the product only in clearly acidic solution: at pH ≈ 3–10 MnO₂ (brown-black) forms, in strong base MnO₄²⁻ (green)
  // — not modelled, reported instead (maxPH 2: model boundary taken from the titration practice of 0,5–1 M H₂SO₄).
  // acid: 8 H⁺ per ξ, supplied by the solution (charge balance); the extent stops where the solution would pass maxPH.
  { id: 'mno4-fe', maxPH: 2, acid: 8, reactants: { 'MnO4-': 1, 'Fe2+': 5 }, products: { 'Mn2+': 1, 'Fe3+': 5 }, equation: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O', observe: 'MnO₄⁻ (tím hồng) bị khử thành Mn²⁺ gần như không màu, Fe²⁺ thành Fe³⁺ (vàng nhạt); khi Fe²⁺ đã hết, MnO₄⁻ dư giữ màu tím hồng.', inputs: 'FeSO₄ + H₂SO₄ loãng + KMnO₄', rangeNote: 'Ở pH > 2 (thiếu axit), MnO₄⁻ bị khử thành MnO₂ kết tủa nâu đen chứ không thành Mn²⁺', source: 'E° MnO₄⁻/Mn²⁺ 1,51 V; Fe³⁺/Fe²⁺ 0,771 V (CRC); ε(MnO₄⁻) ≈ 2400 L/(mol·cm) ở 525 nm', limits: 'Chỉ trong môi trường axit rõ (pH ≤ 2); thiếu axit thì phần còn lại được báo là ngoài phạm vi mô hình.', demo: { fill: [['feso4', 5], ['h2so4', 10]], pour: ['kmno4', 5], expect: { ion: 'Fe3+' } } }
]

// Electrochemistry. E° in volts (25 °C, CRC). Faraday quantities are exact; cell resistance is illustrative.
export const ELECTRO = {
  // The CuCl₂ model is valid only when Cu²⁺ is the first species reduced and Cl⁻ the first oxidised.
  // A species that would discharge first (E°, CRC) makes the cell "chưa hỗ trợ" instead of giving Cu + Cl₂.
  electrolysisCuCl2: {
    // minCl: below ~0,1 M chloride O₂ evolution competes at the anode (model boundary, SGK uses 0,5–1 M CuCl₂).
    decomposition: 1.02, overpotential: 0.4, resistance: 4, minCl: 0.1, equation: 'CuCl₂ → Cu (catot) + Cl₂↑ (anot)',
    interferes: [
      { ion: 'I-', why: 'I⁻ bị oxi hóa ở anot trước Cl⁻ (E° I₂/I⁻ 0,54 V < Cl₂/Cl⁻ 1,36 V) → tạo I₂, không phải Cl₂' },
      { ion: 'I2', why: 'I₂ trong dung dịch bị khử ở catot trước Cu²⁺ (E° 0,54 V > 0,34 V)' },
      { ion: 'Ag+', why: 'Ag⁺ bị khử ở catot trước Cu²⁺ (E° 0,80 V > 0,34 V) → bạc bám catot' },
      { ion: 'Fe3+', why: 'Fe³⁺ bị khử ở catot trước Cu²⁺ (E° Fe³⁺/Fe²⁺ 0,77 V > 0,34 V)' },
      { ion: 'Fe2+', why: 'Fe²⁺ bị oxi hóa ở anot trước Cl⁻ (E° Fe³⁺/Fe²⁺ 0,77 V < 1,36 V)' },
      { ion: 'NO3-', maxPH: 3, why: 'HNO₃ hòa tan đồng bám ở catot và bị khử tạo NO' },
      { ion: 'NH3', ammine: { metal: 'Cu2+' }, why: 'NH₃ dư tạo phức với Cu²⁺ ([Cu(NH₃)₄]²⁺), thay đổi phản ứng ở catot' }, // complex share, not NH₃ presence: NH₄⁺ does not complex
      { ion: 'MnO4-', why: 'MnO₄⁻ bị khử ở catot trước Cu²⁺ (E° 1,51 V > 0,34 V)' },
      { ion: 'SCN-', why: 'SCN⁻ bị oxi hóa ở anot trước Cl⁻ (E° (SCN)₂/SCN⁻ ≈ 0,77 V < 1,36 V)' }
    ]
  },
  // E°(T) = E°(298) + ΔS°/(nF)·(T − 298,15); ΔS° from NBS S° (J/(mol·K)): Zn²⁺ −112,1, Cu 33,150, Zn 41,63,
  // Cu²⁺ −99,6 → ΔS° = −20,98 J/(mol·K), dE°/dT = −0,109 mV/K (ΔCp neglected; valid 0–100 °C, liquid water).
  // Measured cells read a larger slope (≈ −0,3 to −0,4 mV/K) because of the liquid-junction potential, not modelled.
  daniell: { E0: 1.10, n: 2, dS: -20.98, equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu, E° = 1,10 V' }
}

// Solid + liquid (not ion) reactions that happen but are not modelled. Checked only when water is absent,
// because with water present the water reaction (modelled) dominates the observation.
export const SOLVENT_HINTS = [
  { solid: 'na', liquid: 'ethanol', reason: 'Na + etanol (2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑, chậm hơn với nước) chưa được mô hình hóa định lượng.' }
]

// Solution-phase processes outside the model: reported as "chưa có mô hình" instead of being guessed.
export const UNSUPPORTED_HINTS = [
  { all: ['NO3-', 'cu'], maxPH: 3, reason: 'Cu với HNO₃ (tạo NO/NO₂) chưa được mô hình hóa định lượng.' },
  { all: ['Fe3+', 'cu'], reason: 'Cu + Fe³⁺ chưa được mô hình hóa.' },
  { all: ['Fe3+', 'fe'], reason: 'Fe + Fe³⁺ chưa được mô hình hóa.' },
  { all: ['Fe3+', 'zn'], reason: 'Zn + Fe³⁺ (khử Fe³⁺) chưa được mô hình hóa.' },
  { all: ['Fe3+', 'mg'], reason: 'Mg + Fe³⁺ (khử Fe³⁺) chưa được mô hình hóa.' },
  { all: ['SO4', 'caco3'], maxPH: 3, reason: 'CaCO₃ + H₂SO₄: lớp CaSO₄ ít tan bao phủ đá vôi làm phản ứng chậm dần rồi dừng — chưa được mô hình hóa.' },
  ...['mg', 'zn', 'fe', 'cu'].map(m => ({ all: ['MnO4-', m], reason: 'Kim loại khử MnO₄⁻ (sản phẩm của Mn phụ thuộc pH) — chưa được mô hình hóa.' })),
  { all: ['zn'], minPH: 12.5, reason: 'Zn tan trong kiềm mạnh (Zn + 2OH⁻ + 2H₂O → [Zn(OH)₄]²⁻ + H₂↑) chưa được mô hình hóa.' }
]
