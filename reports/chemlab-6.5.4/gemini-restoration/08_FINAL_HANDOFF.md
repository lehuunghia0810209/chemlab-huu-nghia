# 08 — Final handoff

## Kết luận

**CONDITIONAL — BLOCKERS REMAIN**

Khôi phục Gemini đã hoàn thành ở mức mã nguồn và kiểm thử mock. ChemAI trên ChemLab 6.5.4 chỉ dùng Gemini `generateContent`, không còn Workers AI trong đường xử lý, giữ nguyên giao diện và cổng quyền. Nhưng chưa thể kết luận "READY FOR REVIEW" không điều kiện: kiểm kê phát hiện các deployment cũ đang mở AI (kể cả Gemini với key thật) mà không cần xác thực (B1, file 07). Đây là blocker bảo mật cần chủ dự án xử lý.

## Đã hoàn thành

1. Tìm và đánh giá implementation Gemini cũ (6.2 `d06c3dd`; worktree `chemlab-gemini`) — file 01.
2. Adapter Gemini tương thích tài liệu hiện hành; model `gemini-3.8-flash` / fallback `gemini-3.6-flash` có allowlist — file 02.
3. Xóa Workers AI khỏi runtime; `CHEMAI_PROVIDER` chỉ còn là công tắc tắt — file 03.
4. Giao diện ChemAI giữ nguyên; phân biệt trạng thái khóa / đã đăng nhập chưa duyệt / chưa cấu hình / đang xử lý / lỗi / thành công — file 04.
5. Access control không suy yếu, có thêm test — file 05.
6. Mock, browser (420/420 × 3), dữ liệu cốt lõi, build, audit, secret — PASS — file 06.
7. Preview khóa AI `0e870491` đã xác minh; Production 6.5.3 không đổi — file 07.

## Mock PASS vs live PASS

| | Trạng thái |
|---|---|
| Cấu trúc request/response, lỗi, retry, ngân sách, phân quyền | **Mock PASS** |
| Gemini trả lời thật, chất lượng tiếng Việt/Hóa học, độ trễ, `thinkingLevel`, trần token | **Live NOT RUN** |
| Từ chối truy cập trên Preview thật | **Live PASS** (không liên quan tới provider) |

Không có kết quả nào trong bộ báo cáo được coi là "Gemini LIVE".

## Chưa kiểm chứng

- Lệnh gọi Gemini thật (cấm trong phạm vi).
- Xác minh JWT với Cloudflare Access thật (Access chưa bật).
- Khả năng gọi thật của các deployment cũ (không POST để tránh gọi AI thật).

## Các bước còn lại

Ngay (độc lập với 6.5.4):
1. **Rotate Gemini API key** trong Google AI Studio để vô hiệu hóa key đang nằm trong `8583adb3`, `69508b59`, `c2ddfea7`.
2. Xóa (hoặc bảo vệ bằng Access) 11 deployment còn mở AI: Preview `35e7164b`, `f5ae151a`, `1f97dde4`, `1ea5c4a4`, `69364d09`, `a8988d59`, `fff5e414`; Production cũ `7cad8281`, `8583adb3`, `69508b59`, `c2ddfea7`. Giữ `a522519a`, `4aa0dc00`.

Phát hành 6.5.4 (Gemini khóa): chủ dự án review → merge `main` → kiểm tra Production (`GET /api/chat` → `access:false`, POST → 403).

Bật Gemini thật (release gate riêng): xác nhận điều khoản → bật Access → secret đúng tên trên Preview riêng → quyết định relay (HKG) → một lệnh gọi thử có phê duyệt → đánh giá chất lượng bởi giáo viên. Không mở cho học sinh.
