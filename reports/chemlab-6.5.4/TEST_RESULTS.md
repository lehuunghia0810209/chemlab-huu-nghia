# ChemLab 6.5.4 — Kết quả kiểm thử

Môi trường: Windows 11, Node 24.21.0, worktree `D:\EduLab\.worktrees\chemlab-6.5.4`, ngày 2026-11-12. Mọi lệnh gọi AI đều là mock; không có request nào tới Google hay Workers AI thật.

| Lệnh | Kết quả |
|---|---|
| `npm run check` (project, chem, learning, questions, exam, exam papers, final UI, ChemAI) | **PASS** — 49 chem, 242 learning, 783 question, 84 exam, 850 exam-paper, 76 UI, 12 access, Gemini mock, 20 feedback, 25 Workers AI, 11 render, 9 eval, 24 guard |
| `node scripts/test-chemai-access.mjs` (mới) | **PASS** 12/12 |
| `npm run build` | **PASS** |
| `node scripts/browser-smoke.mjs` (Chromium, 42 suite) | **PASS** 418/418 |
| `CHEMLAB_GROUPS=ai node scripts/browser-smoke.mjs` | **PASS** 31/31 (lần đầu FAIL 2 — lỗi do tôi khóa composer cả khi server lỗi cấu hình; đã sửa: tách "quyền" khỏi "trạng thái dịch vụ") |
| `node scripts/a11y-audit.mjs` | **PASS** — axe không có vi phạm WCAG A/AA; kiểm tra focus PASS |
| `node scripts/local-cloudflare-check.mjs` (wrangler pages dev / workerd, viết lại cho 6.5.4) | **PASS** 12/12 staging + 10/10 cổng |
| Quét secret trong `dist/` (`AIza…`, `GEMINI_API_KEY`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`, `generativelanguage`) | **PASS** — không có |

## Ma trận yêu cầu bảo mật (§6 của yêu cầu)

| Yêu cầu | Bằng chứng | Trạng thái |
|---|---|---|
| Người chưa đăng nhập không truy cập được AI | access test "approved_users: direct API request without identity"; workerd check | PASS |
| Học sinh không truy cập được AI | `student_access` bị từ chối kể cả với danh tính hợp lệ; email không được duyệt bị từ chối | PASS |
| Request trực tiếp tới API bị từ chối | Node + workerd, cả chat và feedback | PASS |
| Không giả mạo quyền bằng frontend | 11 token giả + header/query/cookie tự đặt → 403 | PASS |
| Thiếu cấu hình → fail-closed | thiếu AUD/team/email, team domain lạ, JWKS lỗi → 403 | PASS |
| Không có secret trong bundle | quét `dist/` | PASS |
| Không có request tới Gemini khi khóa | bộ đếm fetch tới googleapis = 0; browser: 0 POST khi khóa ở 1280/390/320 px | PASS |
| Learning, Practice, Exam, Virtual Lab không bị ảnh hưởng | `npm run check` + browser smoke 418/418 | PASS |
| UI khóa: đúng thông báo, không nút gửi, không lộ backend | browser journey 1280 dark / 390 light / 320 dark | PASS |

## Chưa chạy

- Gọi Gemini / Workers AI thật — **NOT RUN** (cấm theo yêu cầu).
- Cloudflare Access thật (JWKS từ team thật) — **NOT RUN**, chưa có ứng dụng Access.
- Preview deployment — **NOT RUN** (không deploy trong giai đoạn này).
- Firefox/WebKit — **NOT RUN** lần này (smoke chạy Chromium).
- Kiểm thử ngân sách Durable Object trong workerd thật: kịch bản cũ không còn tới được qua HTTP khi cổng khóa; vẫn được Node test bao phủ.
