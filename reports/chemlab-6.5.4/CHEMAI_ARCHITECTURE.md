# ChemAI — Kiến trúc 6.5.4

Nhánh `feature/chemlab-6.5.4-chemai-access` (worktree `D:\EduLab\.worktrees\chemlab-6.5.4`), tách từ Production 6.5.3 `ff13762`. Chưa commit.

## Luồng request

```
Trình duyệt (src/ai/chemAI.js, src/learning/writtenPractice.js)
  │  GET  /api/chat      → trạng thái công khai
  │  POST /api/chat      → hỏi đáp
  │  GET/POST /api/feedback → nhận xét bài tự luận (luôn dùng Gemini)
  ▼
Cloudflare Pages Functions (functions/api/)
  onRequestGet / onRequestPost
    └─ chemAIAccess(request, env)        ← functions/api/_access.js  (MỚI, chạy trước mọi thứ)
         từ chối → 403 AI_ACCESS_LOCKED (không gọi AI, không đọc body)
         cho phép → chatStatus / chatHandler / feedbackHandler (pipeline 6.5.3 giữ nguyên)
                     ├ sameOrigin, rate limit theo IP (isolate), giới hạn body
                     ├ ngân sách ngày chính xác (Durable Object CHEMAI_BUDGET) — fail-closed
                     ├ safetyGate (_chemSafety.js), truy xuất tri thức ChemLab (_knowledge.js)
                     ├ provider: workers_ai (mặc định) | gemini (CHEMAI_PROVIDER=gemini)
                     └ answerGuard (_chemFacts.js) đối chiếu đáp án với dữ liệu ChemLab
```

File bắt đầu bằng `_` trong `functions/` không thành route, nên `_access.js` không gọi được từ ngoài. `chatHandler`, `chatStatus`, `feedbackHandler` là export nội bộ (Pages chỉ định tuyến `onRequest*`), dùng cho test pipeline.

## Chế độ truy cập (`CHEMAI_ACCESS_MODE`, biến server)

| Giá trị | Hành vi |
|---|---|
| (trống / sai / không biết) | = `disabled` |
| `disabled` | Từ chối tất cả |
| `internal_testing` | Danh tính Cloudflare Access hợp lệ + email trong `CHEMAI_APPROVED_EMAILS` + host nằm trong `CHEMAI_INTERNAL_HOSTS`; host Production `chemlab-edulab.pages.dev` bị từ chối cứng trong code |
| `approved_users` | Danh tính Access hợp lệ + email được duyệt; **Gemini bị từ chối** ở chế độ này (điều khoản chưa đáp ứng) |
| `student_access` | **Từ chối cứng trong code.** Muốn mở phải sửa code sau khi có phê duyệt + cơ sở tuân thủ, không thể bật bằng cờ |

Danh tính: chỉ JWT `Cf-Access-Jwt-Assertion` do Cloudflare Access ký (RS256), xác minh chữ ký bằng khóa công khai tại `https://<team>.cloudflareaccess.com/cdn-cgi/access/certs` (cache 10 phút/isolate, timeout 5 s), kiểm `iss`, `aud`, `exp`, `nbf`, `email`. Không dùng localStorage, query, cookie tự đặt, header tự khai hay token cứng. Không có tài khoản admin hay đường bypass.

## Frontend

- `GET /api/chat` với người chưa có quyền chỉ trả `{ ok, service, release, access:false, configured:false }` — không có provider, model, trạng thái secret.
- `chemAI.js`: composer (ô nhập + nút gửi) và gợi ý **ẩn mặc định**, chỉ hiện khi server trả `access: true`. Người chưa có quyền thấy: "ChemAI đang được hoàn thiện và kiểm định. Tính năng hiện chưa được mở cho học sinh." Nút mở ChemAI giữ nguyên vị trí.
- Việc ẩn chỉ là UX; bảo vệ thật nằm ở server.
- Practice: `GET /api/feedback` trả `enabled:false` khi chưa có quyền → nút nhận xét AI không hiện (hành vi sẵn có của `writtenPractice.js`).

## Biến môi trường mới (đặt trong Cloudflare Dashboard, không trong repo)

`CHEMAI_ACCESS_MODE`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`, `CHEMAI_INTERNAL_HOSTS`. Không cái nào là secret; mẫu ở `.dev.vars.example`. Production không cần đặt gì: thiếu = khóa.
