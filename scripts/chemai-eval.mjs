// ChemAI chemistry evaluation against a deployed site (Cloudflare Preview).
// Each question has a reference answer; a response passes only if it states the
// reference facts. It does NOT pass merely because HTTP returned 200.
// Spends real Workers AI Neurons (≈ 30–60 per question): nothing is sent without --confirm.
// usage: node scripts/chemai-eval.mjs <https://preview-url> [--confirm]
const base = process.argv[2]?.replace(/\/$/, '')
const confirmed = process.argv.includes('--confirm')
if (!/^https:\/\/|^http:\/\/localhost/.test(base || '')) {
  console.error('usage: node scripts/chemai-eval.mjs <https://preview-url> [--confirm]')
  process.exit(2)
}

// Unicode sub/superscripts → ASCII, decimal comma → dot, so “CO₂ 0,2 mol” matches /CO2/ and /0.2/.
const plain = text => String(text)
  .replace(/[₀-₉]/g, char => String(char.charCodeAt(0) - 0x2080))
  .replace(/[⁰¹²³⁴-⁹]/g, char => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(char)))
  .replace(/(\d),(\d)/g, '$1.$2')
  .replace(/\s+/g, ' ')

const QUESTIONS = [
  ['mol từ thể tích (đktc)', 'Tính số mol của 4,48 lít khí CO2 ở điều kiện tiêu chuẩn (đktc, 22,4 L/mol).', [/0\.2 ?mol/]],
  ['thể tích ở đkc (CT 2018)', 'Tính thể tích của 0,1 mol khí N2 ở điều kiện chuẩn (đkc: 25 °C, 1 bar).', [/2\.479|2\.48/]],
  ['khối lượng từ mol', 'Khối lượng của 0,5 mol H2SO4 là bao nhiêu gam?', [/49 ?(g|gam)\b/]],
  ['khối lượng mol', 'Tính khối lượng mol phân tử của glucose C6H12O6.', [/180 ?g\/mol/]],
  ['nồng độ mol', 'Hòa tan 5,85 gam NaCl vào nước được 500 mL dung dịch. Tính nồng độ mol của dung dịch.', [/0\.2 ?(M|mol\/L)\b/]],
  ['bài toán PTHH', 'Cho 5,6 gam Fe tác dụng hết với dung dịch HCl dư. Tính thể tích khí H2 thu được ở đktc.', [/2\.24 ?(L|l|lít|dm3)/, /Fe ?\+ ?2 ?HCl/]],
  ['cân bằng phương trình', 'Cân bằng phương trình: Fe + O2 → Fe3O4', [/3 ?Fe ?\+ ?2 ?O2/]],
  ['phản ứng trung hòa', 'Viết phương trình phản ứng giữa dung dịch HCl và dung dịch NaOH.', [/NaCl/, /H2O/]],
  ['pH', 'Tính pH của dung dịch HCl 0,01 M.', [/pH ?(=|là|bằng) ?2\b/]],
  ['cấu hình electron', 'Viết cấu hình electron của nguyên tử Na (Z = 11).', [/1s2 ?2s2 ?2p6 ?3s1/]],
  ['hiện tượng thí nghiệm', 'Nêu hiện tượng khi nhỏ dung dịch NaOH vào dung dịch CuSO4 và viết phương trình.', [/kết tủa/i, /xanh/i, /Cu\(OH\)2/]],
  ['thiếu dữ kiện', 'Tính khối lượng muối thu được sau phản ứng.', [/thiếu|chưa (đủ|có|cho)|cần (thêm|biết)|không đủ/i]],
  ['hữu cơ cơ bản', 'Ethanol có công thức cấu tạo thu gọn là gì?', [/C2H5OH|CH3CH2OH/]]
]

if (!confirmed) {
  console.log(`Plan: ${QUESTIONS.length} questions to ${base}/api/chat (one request each, sequential). Add --confirm to send.`)
  QUESTIONS.forEach(([name, question]) => console.log(`- ${name}: ${question}`))
  process.exit(0)
}

const results = []
for (const [name, question, expectations] of QUESTIONS) {
  const started = Date.now()
  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({ message: question, history: [], context: { view: 'learning' } })
  })
  const payload = await response.json().catch(() => ({}))
  const answer = plain(payload.answer || '')
  const missing = expectations.filter(pattern => !pattern.test(answer)).map(String)
  const pass = response.ok && payload.ok === true && missing.length === 0
  results.push(pass)
  const attempts = payload.meta?.attempts ?? payload.attempts ?? '?'
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name} — HTTP ${response.status} ${payload.code || ''} ${payload.meta?.model || ''} attempts=${attempts} fallback=${payload.meta?.fallbackUsed ?? payload.fallbackUsed ?? false} ${Date.now() - started} ms${missing.length ? ` — missing ${missing.join(', ')}` : ''}`)
  // Full answer: the keyword check is only a first filter; a person grades the chemistry.
  console.log(String(payload.answer || payload.message || '').replace(/^/gm, '     '))
  if (payload.code === 'AI_DAILY_LIMIT' || payload.code === 'AI_BUDGET_LIMITED') break
  // An approved run is one model call per question: stop on any retry or fallback.
  if (attempts !== 1 || payload.meta?.fallbackUsed || payload.fallbackUsed) {
    console.log('STOP: a retry or fallback happened; the run was approved for one call per question.')
    break
  }
}
console.log(`${results.filter(Boolean).length}/${QUESTIONS.length} chemistry answers matched the reference.`)
process.exit(results.length === QUESTIONS.length && results.every(Boolean) ? 0 : 1)
