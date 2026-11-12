# 04 — ChemAI UX verification

Giao diện ChemAI giữ nguyên vị trí (nút ChemAI ở dashboard và topbar mobile), cùng panel, theme Light/Dark và bố cục. Không thêm chatbot thứ hai. Thay đổi UI duy nhất của 6.5.4 nằm trong `src/ai/chemAI.js` / `chemAI.css` (trạng thái khóa).

## Trạng thái truy cập

| Trạng thái | Nguồn (server) | UI |
|---|---|---|
| Chưa được cấp quyền (ẩn danh, chế độ `disabled`, `student_access`…) | `GET /api/chat` → `access:false` | Badge "Chưa mở"; thông báo "ChemAI đang được hoàn thiện và kiểm định. Tính năng hiện chưa được mở cho học sinh."; không có ô nhập/nút gửi/gợi ý |
| Đã đăng nhập (JWT Access hợp lệ) nhưng không có trong allowlist | `access:false, authenticated:true` | Badge "Chưa mở"; "Bạn đã đăng nhập nhưng tài khoản chưa được cấp quyền dùng ChemAI. …"; không có composer |
| Có quyền, provider chưa sẵn sàng | `access:true, configured:false` | Badge "Chưa cấu hình"; gửi → thông báo "ChemAI chưa được bật" |
| Đang xử lý | — | Nút gửi thành nút dừng, ô nhập khóa (chặn gửi trùng), chỉ báo đang trả lời |
| Provider lỗi | 4xx/5xx có `code` | Thông báo tiếng Việt; lỗi tạm thời có nút "Thử lại"; lỗi cấu hình/hạn mức không có nút thử lại; giao diện mở lại ô nhập |
| Thành công | `ok:true` | Câu trả lời Markdown + KaTeX, ghi chú đối chiếu ChemLab nếu có sửa |

Người không có quyền không thấy provider, model hay trạng thái secret (kiểm tra cả bằng test Node và trình duyệt).

## Kiểm chứng trên trình duyệt (`browser-smoke.mjs`, mock `/api/chat`, cả 3 engine)

- Gửi/nhận câu trả lời; câu trả lời dài có ghi chú sửa vẫn nằm trong tầm nhìn; thông báo độ tin cậy hiện trên điện thoại (1280/390/320 px).
- KaTeX: mọi công thức được typeset (MathML), không còn `$`/TeX thô; công thức dài cuộn trong khung, trang không tràn ngang; màu theo theme; HTML và `\href` trong câu trả lời bị vô hiệu (Light/Dark).
- Lỗi precondition: thông báo rõ, không có nút thử lại vô ích; lỗi quá tải: có nút thử lại, thử lại thành công, hội thoại được giữ.
- Trạng thái khóa ở 1280 dark / 390 light / 320 dark: thông báo đúng chữ, không có nút gửi, không có gợi ý, không lộ backend, không tràn ngang, 0 request ngoài GET trạng thái.
- "Đã đăng nhập nhưng chưa được cấp quyền": đúng thông báo, không có composer.
- Mobile: khi có quyền, các nút nằm trong màn hình, nút gửi bấm được và ≥ 44 px.
- Console sạch trong mọi journey.

## Accessibility

`a11y-audit.mjs` (axe WCAG A/AA, có panel ChemAI với câu trả lời chứa công thức) + kiểm tra focus bàn phím: PASS. Thông báo khóa dùng `role="status"`; panel giữ `role="dialog"`, `aria-labelledby`, focus trap và đóng bằng Esc như trước.

## Chưa kiểm chứng

Câu trả lời thật của Gemini (chất lượng tiếng Việt, độ dài, công thức thực tế) — cần live test.
