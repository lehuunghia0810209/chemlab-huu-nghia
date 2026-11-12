# ChemAI — Kiểm soát truy cập & bảo mật (6.5.4)

## Nguyên tắc

- Quyết định ở server (`functions/api/_access.js`), chạy **trước** sameOrigin, rate limit, đọc body, ngân sách và mọi lệnh gọi AI, cho cả `/api/chat` và `/api/feedback`.
- Fail-closed: chế độ thiếu/sai, thiếu `CF_ACCESS_TEAM_DOMAIN`/`CF_ACCESS_AUD`/danh sách email, team domain không đúng dạng `https://<team>.cloudflareaccess.com`, không lấy được khóa công khai, token sai/hết hạn/không chữ ký, email không được duyệt → 403.
- Phản hồi từ chối giống nhau ở mọi trường hợp: `{ ok:false, code:"AI_ACCESS_LOCKED", message:"ChemAI đang được hoàn thiện…" }` — không lộ lý do, chế độ, provider hay model.

## Mô hình đe dọa đã xét

| Tấn công | Chặn bằng |
|---|---|
| Gọi thẳng API (curl) | Cổng server, không phụ thuộc UI |
| Sửa JS/localStorage/hiện lại nút gửi | Server vẫn 403 |
| Query `?admin=1`, header `X-User-Email`, cookie tự đặt | Không phải nguồn danh tính |
| JWT giả: `alg:none`, ký bằng khóa khác, sửa chữ ký, sai `aud`/`iss`, hết hạn, `nbf` tương lai, `kid` lạ, không có email (service token) | Xác minh RS256 + claim |
| Bật `student_access` bằng cờ | Từ chối cứng trong code |
| Bật `internal_testing` trên Production | Host Production bị loại cứng; host phải nằm trong allowlist |
| Bật Gemini cho `approved_users` | Từ chối cứng (điều khoản chưa đáp ứng) |
| Trỏ team domain tới máy chủ lạ (SSRF/khóa giả) | Regex chỉ cho `*.cloudflareaccess.com` |
| Lộ secret qua bundle | Quét `dist/`: sạch |

## Giới hạn còn lại

- Danh tính phụ thuộc Cloudflare Access được cấu hình đúng (ứng dụng Access bảo vệ host tương ứng). Việc tạo ứng dụng Access/AUD là thao tác Dashboard của chủ dự án — chưa làm.
- Đường JWKS thật (fetch tới `cloudflareaccess.com`) chỉ được test bằng mock trong Node; chưa chạy với một team Access thật.
- Danh sách email là cấu hình server; phân biệt "người lớn được phép" và "học sinh" là trách nhiệm của người cấp quyền.
- `configWarnings` (tên biến có khoảng trắng) chỉ trả cho người đã qua cổng.
