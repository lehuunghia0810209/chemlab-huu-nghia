/* =========================================================
   CHEMLAB — REACTION COVERAGE MATRIX
   Generates docs/reaction-engine/REACTION_COVERAGE.md from the
   live catalogue and src/lab/engine/profiles.js.
   npm run report:reactions   (check:chem fails if it is stale)
========================================================= */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { REACTIONS } from '../src/lab/reactions.js'
import { CHEMICALS } from '../src/lab/chemicals.js'
import { profileReaction, SUPPORT } from '../src/lab/engine/profiles.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const COVERAGE_PATH = path.join(rootDir, 'docs', 'reaction-engine', 'REACTION_COVERAGE.md')

const catalogue = Array.isArray(CHEMICALS) ? Object.fromEntries(CHEMICALS.map(item => [item.id, item])) : CHEMICALS

/* Reaction ids named in a scenario test (beyond the catalogue-wide checks every reaction gets). */
function scenarioTested() {
  const sources = ['test-chem-core.mjs', 'browser-smoke.mjs'].map(file => fs.readFileSync(path.join(rootDir, 'scripts', file), 'utf8')).join('\n')
  return new Set(REACTIONS.map(reaction => reaction.id).filter(id => sources.includes(`'${id}'`) || sources.includes(`"${id}"`)))
}

const cell = text => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ')

export function buildCoverage() {
  const profiles = REACTIONS.map(reaction => profileReaction(reaction, catalogue))
  const tested = scenarioTested()
  const count = support => profiles.filter(profile => profile.support === support).length
  const phenomena = profile => [
    profile.phenomena.precipitate.length && `kết tủa ${profile.phenomena.precipitate.join(', ')}`,
    profile.phenomena.gas.length && `khí ${profile.phenomena.gas.join(', ')}`,
    profile.phenomena.colorChange && 'đổi màu',
    profile.phenomena.foam && 'bọt',
    profile.phenomena.redissolution && 'tan lại',
    profile.phenomena.multiStep && 'nhiều nấc',
    profile.phenomena.reversible && 'thuận nghịch',
    !profile.phenomena.visible && 'không có hiện tượng rõ'
  ].filter(Boolean).join('; ')

  const lines = [
    '# Reaction Coverage Matrix',
    '',
    'Sinh tự động bởi `npm run report:reactions` từ `src/lab/reactions.js` và `src/lab/engine/profiles.js`. Không sửa tay — `npm run check:chem` báo lỗi khi tài liệu cũ hơn dữ liệu.',
    '',
    `Tổng: **${profiles.length}** phản ứng (ID duy nhất: ${new Set(profiles.map(p => p.id)).size}).`,
    '',
    '| Mức hỗ trợ | Số phản ứng | Ý nghĩa |',
    '|---|---|---|',
    `| ${SUPPORT.QUANTITATIVE} | ${count(SUPPORT.QUANTITATIVE)} | Tính số mol, chất hạn chế, sản phẩm từ nồng độ đã xác minh (0,1 M) và phương trình đã kiểm tra |`,
    `| ${SUPPORT.CONDITIONAL} | ${count(SUPPORT.CONDITIONAL)} | Hiện tượng định tính, phụ thuộc điều kiện (nhiệt độ, chất dư, xúc tác) — xem cột Giới hạn |`,
    `| ${SUPPORT.QUALITATIVE} | ${count(SUPPORT.QUALITATIVE)} | Hiện tượng định tính đã kiểm tra; thiếu dữ liệu để tính lượng chất |`,
    `| ${SUPPORT.UNSUPPORTED} | ${count(SUPPORT.UNSUPPORTED)} | Chưa đủ căn cứ mô phỏng |`,
    `| ${SUPPORT.INVALID} | ${count(SUPPORT.INVALID)} | Dữ liệu sai (không được kích hoạt khi còn lỗi) |`,
    '',
    'Mọi phản ứng đều qua kiểm định toàn catalog trong `npm run check:chem`: chất phản ứng tồn tại, hiệu ứng hợp lệ, phương trình bảo toàn nguyên tố và điện tích (trừ phương trình chữ), ↓/↑ khớp hiệu ứng kết tủa/khí, màu kết tủa khớp bảng chất kết tủa, không dùng hiệu ứng chung chung. Cột "Kịch bản" đánh dấu phản ứng có thêm kiểm thử tình huống riêng.',
    '',
    '| ID | Phương trình | Nhóm | Hiện tượng | Điều kiện | Mức hỗ trợ | Giới hạn | Kịch bản |',
    '|---|---|---|---|---|---|---|---|'
  ]
  for (const profile of profiles) {
    lines.push(`| \`${profile.id}\` | ${cell(profile.equation)} | ${cell(profile.categories.join(', '))} | ${cell(phenomena(profile))} | ${cell(profile.conditions.join(', ') || '—')} | ${profile.support} | ${cell(profile.limitations.join(' ') || '—')} | ${tested.has(profile.id) ? '✓' : ''} |`)
  }
  return `${lines.join('\n')}\n`
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.mkdirSync(path.dirname(COVERAGE_PATH), { recursive: true })
  fs.writeFileSync(COVERAGE_PATH, buildCoverage())
  console.log(`Wrote ${path.relative(rootDir, COVERAGE_PATH)}`)
}
