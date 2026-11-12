# 06 — Test results

Commit kiểm thử: `b3b8ea8`. Windows 11, Node 24.21.0 (local); Node 22.16.0 / npm 10.9.2 (giả lập Cloudflare). **Mọi kiểm thử Gemini đều là mock. Live Gemini: NOT RUN.**

## Mock Gemini API (`npm run check:ai`)

| Script | Kết quả | Phạm vi |
|---|---|---|
| `test-chemai-access.mjs` | PASS 15/15 | JWT (RS256 thật/giả), allowlist, chế độ, host, header/cookie/query giả, body không bị đọc khi từ chối, trạng thái "đã đăng nhập nhưng chưa được duyệt", đường dương internal_testing → Gemini mock, 0 lệnh gọi Workers AI |
| `test-chemai-api.mjs` | PASS | Tạo request đúng endpoint/header (key không ở URL); parse response; allowlist model + fallback; thiếu key / key sai tên; key không hợp lệ 401/403; 400/FAILED_PRECONDITION; 404 model → fallback; 429 + Retry-After; 500/503 có giới hạn lần thử; timeout/AbortError (3 lần); lỗi mạng; bị chặn an toàn (blockReason, SAFETY); rỗng; không phải JSON; thiếu answer; HTML; MAX_TOKENS; ẩn `thought`; ngân sách DO chính xác (đồng thời 8 request); fail-closed khi ngân sách lỗi/thiếu; KV chỉ khi chấp nhận rõ; giới hạn 40/ngày/client; request trùng 409; rate limit theo IP; che key trong log |
| `test-feedback-api.mjs` | PASS 20/20 | Feedback rubric, cổng, ngân sách |
| `test-chemai-guard.mjs` | PASS 23/23 | Kiểm chứng Hóa học, safetyGate (không gọi model, không trừ ngân sách), ghi chú sửa, kill switch `CHEMAI_PROVIDER`, prompt (quy tắc chính xác, LaTeX, an toàn) |
| `test-chemai-markdown.mjs` | PASS 11/11 | Markdown/KaTeX an toàn |
| `test-chemai-eval.mjs` | PASS 9/9 | Bộ chấm đánh giá |

Số kiểm tra guard giảm 24 → 23: bỏ ca timeout của Workers AI (Gemini timeout nằm trong `test-chemai-api.mjs`). Bỏ `test-workers-ai.mjs` (25 ca) cùng module bị xóa.

## Chemistry, Learning, Practice, Exam (`npm run check`)

PASS: project/version, chemistry core 49, learning 242, questions 783 (537 câu), exam 84, exam papers 850, final UI 76, AI như trên.

Số liệu cốt lõi (đếm trực tiếp từ module): 103 chemicals, 96 reactions, 21 chapters, 78 lessons, 78 guided activities, 372 guided steps, 188 guided questions, 537 practice questions, 12 exam entries, 8 takeable exams — khớp mốc. `git diff ff13762 -- src` ngoài `src/ai` và `src/appMeta.js`: trống. Publication gates không đổi.

## Browser (`browser-smoke.mjs`, 42 suite)

| Engine | Kết quả |
|---|---|
| Chromium | PASS 420/420 |
| Firefox | PASS 420/420 |
| WebKit | PASS 420/420 |

420 = 418 (mốc trước) + 2 kiểm tra mới: "đã đăng nhập nhưng chưa được duyệt" và console sạch ở journey đó. Gồm layout, tools, lab, guided, learning, practice, exam (core, chấm mọi đề, khôi phục), written practice, CSP, PWA upgrade/offline/persistence, ChemAI.

`a11y-audit.mjs`: PASS (axe WCAG A/AA, focus bàn phím).

## Build & security

| Kiểm tra | Kết quả |
|---|---|
| `npm ci` (Node 22.16/npm 10.9.2, từ `git archive`) | PASS |
| `npm run build` | PASS |
| `npm audit` | 0 lỗ hổng |
| Build tái lập: local vs Cloudflare-equivalent | 302/304 file giống hệt; `_headers`, `robots.txt` chỉ khác CRLF của worktree Windows |
| Secret trong `dist/` | Không có |
| CSP, X-Frame-Options, nosniff, SW `chemlab-6.5.4-access-1`, manifest, asset bất biến | PASS (`staging-smoke` trên workerd local và Preview) |
| `local-cloudflare-check.mjs` (workerd) | PASS 12/12 + 10/10 (chạy trên `2e12406`; `b3b8ea8` chỉ thêm trường `authenticated` và test) |

## Preview `0e870491` (commit `b3b8ea8`)

| Kiểm tra | Kết quả |
|---|---|
| Access gate 19 request (alias và URL deployment) | PASS 19/19 mỗi URL |
| `staging-smoke.mjs` | PASS 12/12 |
| `preview-locked-check.mjs` Chromium / Firefox / WebKit (1440 + 390 px) | PASS 28/28 mỗi engine |
| Log tail | 21 sự kiện API được ghi: 13 POST → 403 `MODE_DISABLED`, 0 sự kiện gọi provider (tail chỉ lấy mẫu) |

## Performance

Bundle so với 6.5.3 (`ff13762`): tổng +710 B, JS +325 B, JS gzip +79 B (773 873 → 773 952). Từ chối truy cập trên Preview: 1–6 ms wall time. Không đo hiệu năng Gemini thật.
