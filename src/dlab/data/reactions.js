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
  { id: 'na-water', solid: 'na', driver: 'water', k: 4e-4, gives: { 'Na+': 1 }, gas: { H2: 0.5 }, dH: -184280, moves: true, equation: '2Na + 2H₂O → 2NaOH + H₂↑', observe: 'Mẩu natri nổi, chạy trên mặt nước, tan dần, có khí thoát ra; dung dịch thành bazơ.' },
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
export const ION_E0 = { 'K+': -2.93, 'Ba2+': -2.91, 'Ca2+': -2.87, 'Na+': -2.71, 'Mg2+': -2.37, 'Zn2+': -0.76, 'Fe2+': -0.44, 'Cu2+': 0.34, 'Ag+': 0.80 }
export const METAL_E0 = { mg: -2.37, zn: -0.76, fe: -0.44, cu: 0.34 }
export const ION_NAME = { 'K+': 'K⁺', 'Ba2+': 'Ba²⁺', 'Ca2+': 'Ca²⁺', 'Na+': 'Na⁺', 'Mg2+': 'Mg²⁺', 'Zn2+': 'Zn²⁺', 'Fe2+': 'Fe²⁺', 'Cu2+': 'Cu²⁺', 'Ag+': 'Ag⁺' }

// Solution-phase processes outside the model, detected from the dissolved species alone.
// minPH/maxPH: only in that pH range. Reported as "Chưa hỗ trợ mô phỏng", never given a guessed product.
export const ION_HINTS = [
  { all: ['Fe3+', 'I-'], reason: 'Fe³⁺ oxi hóa I⁻ thành I₂ — chưa được mô hình hóa.' },
  { all: ['Cu2+', 'I-'], reason: 'Cu²⁺ + I⁻ (tạo CuI↓ và I₂) — chưa được mô hình hóa.' },
  { all: ['Ag+'], minPH: 12, reason: 'Ag⁺ trong môi trường kiềm tạo Ag₂O nâu đen — chưa được mô hình hóa.' },
  { all: ['Zn2+'], minPH: 11.5, reason: 'Zn(OH)₂ lưỡng tính tan trong kiềm dư tạo [Zn(OH)₄]²⁻ — chưa được mô hình hóa.' },
  { all: ['Cu2+', 'NH3'], minPH: 9, reason: 'Cu²⁺ với NH₃ dư tạo phức [Cu(NH₃)₄]²⁺ xanh thẫm — chưa được mô hình hóa.' }
]

// Electrochemistry. E° in volts (25 °C, CRC). Faraday quantities are exact; cell resistance is illustrative.
export const ELECTRO = {
  electrolysisCuCl2: { decomposition: 1.02, overpotential: 0.4, resistance: 4, equation: 'CuCl₂ → Cu (catot) + Cl₂↑ (anot)' },
  daniell: { E0: 1.10, n: 2, equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu, E° = 1,10 V' }
}

// Solution-phase processes outside the model: reported as "chưa có mô hình" instead of being guessed.
export const UNSUPPORTED_HINTS = [
  { all: ['NO3-', 'cu'], maxPH: 3, reason: 'Cu với HNO₃ (tạo NO/NO₂) chưa được mô hình hóa định lượng.' },
  { all: ['Fe3+', 'cu'], reason: 'Cu + Fe³⁺ chưa được mô hình hóa.' },
  { all: ['Fe3+', 'fe'], reason: 'Fe + Fe³⁺ chưa được mô hình hóa.' },
  { all: ['Fe3+', 'zn'], reason: 'Zn + Fe³⁺ (khử Fe³⁺) chưa được mô hình hóa.' },
  { all: ['Fe3+', 'mg'], reason: 'Mg + Fe³⁺ (khử Fe³⁺) chưa được mô hình hóa.' },
  { all: ['zn'], minPH: 12.5, reason: 'Zn tan trong kiềm mạnh (Zn + 2OH⁻ + 2H₂O → [Zn(OH)₄]²⁻ + H₂↑) chưa được mô hình hóa.' },
  { all: ['I-', 'Fe3+'], reason: 'Phản ứng oxi hóa I⁻ bởi Fe³⁺ chưa được mô hình hóa.' }
]
