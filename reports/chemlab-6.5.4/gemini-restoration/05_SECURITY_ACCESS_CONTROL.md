# 05 — Security & access control

`functions/api/_access.js` không bị suy yếu: xác minh chữ ký RS256 của JWT Cloudflare Access, kiểm `iss`/`aud`/`exp`/`nbf`/`email`, allowlist email phía server, mặc định từ chối, giới hạn host. Chạy trước mọi logic provider ở `/api/chat` và `/api/feedback`.

## Chế độ

| `CHEMAI_ACCESS_MODE` | Kết quả với Gemini |
|---|---|
| không đặt / sai / `disabled` | Từ chối tất cả |
| `student_access` | Từ chối cứng trong code |
| `approved_users` | Từ chối (`PROVIDER_TERMS_UNVERIFIED`): Gemini chưa được phép phục vụ ngoài kiểm thử nội bộ |
| `internal_testing` | Chỉ host trong `CHEMAI_INTERNAL_HOSTS`, không bao giờ `chemlab-edulab.pages.dev`, + JWT hợp lệ + email trong allowlist |

## Secret

- Code chỉ đọc `env.GEMINI_API_KEY`. Biến `" GEMINI_API_KEY"` (dấu cách đầu, đang có trên Production) không bao giờ được đọc; người đã qua cổng thấy cảnh báo **tên** biến trong `configWarnings`, không có giá trị.
- Key gửi qua header `x-goog-api-key`, không nằm trong URL (có test); không có trong log, response hay bundle.
- Quét `dist/`: không có `AIza…`, `GEMINI_API_KEY`, `x-goog-api-key`, `generativelanguage`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`.
- Trong repo chỉ có key giả `AIzaSyTESTONLY…` trong test che key.

## Kết quả kiểm thử

| Ca | Node (`test-chemai-access.mjs`) | workerd local | Preview thật |
|---|---|---|---|
| Ẩn danh / không JWT | 403 | 403 | 403 |
| JWT hết hạn, sai chữ ký, ký bằng khóa khác, sai `aud`, sai `iss`, `nbf` tương lai, `kid` lạ, `alg:none`, thiếu email | 403 | `alg:none` 403 | 403 |
| Email ngoài allowlist | 403 (+ `authenticated:true` ở GET) | — | — |
| Thiếu allowlist / AUD / team domain, team domain lạ, JWKS lỗi | 403 | — | — |
| Chế độ sai, `disabled`, `student_access` | 403 | 403 | 403 (mặc định) |
| Host Production, host Preview công khai | 403 | — | 403 |
| Header/cookie/query giả | 403 | 403 | 403 |
| POST trực tiếp chat + feedback | 403 | 403 | 403 |
| Body không bị đọc khi từ chối | ✓ | — | — |
| Đường dương: `internal_testing` + host nội bộ + JWT hợp lệ được duyệt → Gemini (mock), 0 lệnh gọi Workers AI | ✓ | — | — |

Node: 15/15 PASS. Preview: xem 06/07.

## Rủi ro bảo mật còn tồn tại (ngoài mã 6.5.4)

Các deployment cũ còn mở AI không xác thực: 8 deployment Workers AI và 3 deployment Production cũ có `GEMINI_API_KEY` đúng tên. Xem `03_WORKERS_AI_MIGRATION.md`. Đây là blocker phát hành.
