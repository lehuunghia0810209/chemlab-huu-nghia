# Gemini — Audit khôi phục kỹ thuật (6.5.4)

Phạm vi: mã nguồn `functions/api/` tại `ff13762` + thay đổi 6.5.4. Không có lệnh gọi Gemini thật, không đọc/sửa secret hay binding trên Cloudflare trong phiên này. Giá trị secret không xuất hiện trong báo cáo.

| Hạng mục | Hiện trạng (bằng chứng) | Đánh giá |
|---|---|---|
| Cloudflare Functions | `functions/api/chat.js`, `feedback.js`, helper `_*.js`; nay có cổng `_access.js` chạy trước | OK |
| Cấu hình API key | Đọc duy nhất `env.GEMINI_API_KEY`, gửi qua header `x-goog-api-key` (không nằm trong URL). Bundle `dist/` không chứa key, tên biến secret hay `generativelanguage` (quét grep) | OK |
| Biến `" GEMINI_API_KEY"` (dấu cách đầu) trên Production | Theo ghi nhận phát hành 6.5.3 (không kiểm lại trực tiếp phiên này). Code không bao giờ đọc tên này → Gemini coi như chưa cấu hình (fail-closed). 6.5.4 thêm `configWarnings` liệt kê **tên** biến có khoảng trắng — chỉ trả cho người đã qua cổng | Chưa sửa (đúng yêu cầu). Chủ dự án cần tự đổi tên khi quyết định bật; không để code đọc tên sai vì sẽ "tự bật" ngầm |
| Model / fallback | Mặc định `gemini-3.8-flash`, fallback `gemini-3.6-flash`, đổi bằng `GEMINI_MODEL` / `GEMINI_FALLBACK_MODELS`; lỗi model-unavailable chuyển sang fallback (có mock test) | Tính sẵn có thực tế **NOT RUN** (cần gọi thật) |
| Validate request | sameOrigin, body ≤ 64 KB, message ≤ 4000, history ≤ 10 mục, context được làm sạch đệ quy; feedback chỉ nhận `rubricId` có thật | OK (test) |
| Rate limit | 18 req/phút/IP mỗi isolate; ngân sách ngày chính xác bằng Durable Object; thiếu ngân sách → 503 không gọi AI | OK (test). Giới hạn isolate không toàn cục — đã có DO bù |
| Chống lạm dụng | Cổng truy cập 6.5.4 (403 trước khi đọc body); safetyGate; chặn trùng request, giới hạn đồng thời | OK |
| Timeout / retry | Gemini: abort 52 s, tối đa 4 lần thử với backoff ≤ 10 s chỉ cho 408/429/5xx; client 65 s | OK (mock) |
| Xử lý lỗi | FAILED_PRECONDITION phân loại REGION/BILLING/ACCOUNT; thông báo cho người dùng không lộ chi tiết | OK (mock) |
| Privacy / logging | Log một dòng JSON/request: không key, header, IP hay nội dung hội thoại; upstreamMessage được cắt. Log từ chối truy cập chỉ có `reason`, không có email | OK |
| Kiểm chứng đáp án Hóa học | `answerGuard` đối chiếu với dữ liệu ChemLab (24 ca), truy xuất tri thức, prompt độ chính xác | OK (test) |

## Lỗi Production đã biết (từ 6.5)

Google trả `FAILED_PRECONDITION: User location is not supported for the API use` (Function chạy ở colo HKG). Không phải lỗi code. Nhánh relay Singapore nằm ở worktree `D:\EduLab\.worktrees\chemlab-gemini` (chưa commit, không gộp vào 6.5.4).

## Kết luận

Phần kỹ thuật đã chuẩn hóa: đường gọi Gemini nằm sau cổng quyền server, fail-closed, có mock test. **Chưa khôi phục khả năng gọi Gemini thật** — bị chặn bởi: vùng HKG, tên biến secret sai, và đặc biệt là điều khoản Google (xem RELEASE_READINESS.md).
