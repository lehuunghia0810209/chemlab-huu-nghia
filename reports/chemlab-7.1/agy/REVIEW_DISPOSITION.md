# Rà soát độc lập Antigravity (bản RC 7.1) — xử lý từng phát hiện

Nguồn: `agy-review.md` (gemini-4-neon-high, chế độ chỉ đọc). Lượt đầu bằng claude-opus-5-5-high dừng sau câu mở đầu (không đọc được file ở chế độ plan headless) nên chạy lại. Mỗi phát hiện được Claude tái hiện hoặc đối chiếu mã trước khi sửa.

| # | Mức | Phát hiện | Kiểm chứng | Xử lý |
|---|---|---|---|---|
| 1 | P0 | Kết tủa cạnh tranh sắp theo độ tan trong nước tinh khiết → AgSCN giả khi Cl⁻ dư lớn; Zn(OH)₂ ở pH 4,5 | Tái hiện: 0,05 mmol AgSCN (sai), Zn(OH)₂ 0,65 mmol ở pH 4,5 (sai) | Sửa: sắp theo độ quá bão hòa thực tế (log Q − log Ksp)/p, lặp đến hội tụ (≤ 40 vòng). Sau sửa: chỉ AgCl; chỉ ZnCO₃. Test hồi quy mới |
| 2 | P1 | MnO₄⁻/Fe²⁺: dừng vì hết axit mà không báo; chữ "Fe²⁺ còn dư" sai khi dư MnO₄⁻; chạy tiếp nhờ Fe(OH)₃; nhánh giới hạn axit chưa có test | Đúng (đọc mã) | Sửa: luôn gắn `redox` khi có cờ dừng; thông báo riêng "hết axit"; không chạy khi có Fe(OH)₃; pH tính lại cho từng quy tắc; câu hiện tượng viết lại; test nhánh dừng giữa chừng |
| 3 | P1 | Thiếu cảnh báo MnO₄⁻ + Cl⁻ (axit), MnO₄⁻ + SCN⁻, Cu²⁺ + SCN⁻, MnO₄⁻ + kim loại; thiếu Mn²⁺ trong dãy E° | Đúng | Thêm các cảnh báo "chưa hỗ trợ" (có bàn thử) và E°(Mn²⁺/Mn) = −1,18 V |
| 4 | P1 | Thẻ khám phá FeSCN²⁺ tạo Fe(OH)₃ ngay khi bày; thí nghiệm Fe³⁺/I⁻ sát ngưỡng | Tái hiện (pH 2,1, Fe(OH)₃ xuất hiện) | Axit hóa: HNO₃ trong thẻ khám phá; H₂SO₄ trong thí nghiệm Fe³⁺/I⁻ |
| 5 | P1 | Vôn kế vẫn hiện 1,10 V khi điện cực ở dung dịch có phản ứng chưa mô hình (HNO₃, Fe³⁺…); câu báo phản ứng phụ cũ | Đúng | Thêm điều kiện `container.unsupported`; chỉ nêu phương trình khi phản ứng vừa xảy ra |
| 6 | P1 | "CuSO₄: vàng" với chỉ thị vạn năng sai màu (màu xanh của Cu²⁺ pha vào) | Đúng | Đổi sang ZnSO₄ không màu (pH ≈ 5,5); ghi chú về muối có màu |
| 7 | P1 | Chất gây nhiễu điện phân mới (MnO₄⁻, SCN⁻) bị test bỏ qua | Đúng | Thêm bàn thử; test fail nếu một chất gây nhiễu (trừ Ag⁺, không thể có trong CuCl₂) không có bàn thử |
| 8 | P1 | Thông báo "mất màu khi nóng" khi không hề có màu; ghi chú phức trong hỗn hợp nhiều etanol | Đúng | Chỉ báo khi ở 25 °C có màu; bỏ qua khi pH không áp dụng |
| 9 | P1 | "Bày dụng cụ" đẩy tới 23 bước hoàn tác; nút "Làm trên bàn thí nghiệm" không mở thẻ hướng dẫn | Đúng | Một bước hoàn tác cho cả lần bày; mở thẻ thí nghiệm trong Thư viện |
| 10 | P1 | ChemAI nhận ngữ cảnh cốc cũ rỗng và chữ của phần đang ẩn; Trang chủ "Tiếp tục thí nghiệm" mở bàn tự do | Đúng | `window.ChemLabLab.context()` trả ngữ cảnh bàn động (hoặc bài học khi đang mở); bỏ phần tử `[hidden]` khỏi chữ gửi ChemAI; liên kết `#lab/experiment/<id>` mở đúng bài |
| 11 | P1 | Kéo từ tủ hóa chất: thiếu `pointercancel` → rò sự kiện, bóng kéo kẹt | Đúng | Thêm `pointercancel` |
| 12 | P1 | Mất tiêu điểm khi đổi trang; `aria-pressed` sai khi đóng bảng; thiếu `<h1>` | Đúng | Chuyển tiêu điểm khi đổi trang; `aria-pressed` theo trạng thái bảng; tiêu đề chính là `<h1>` |
| 13 | P1 | Màu FeSCN²⁺ làm mất màu phức đồng–amoniac trong cùng cốc | Đúng | Tách hai phần trừ màu |
| 14 | P2 | pH tính một lần cho mọi quy tắc redox | Đúng | Tính lại cho từng quy tắc |
| 15 | P2 | Đồng bộ thanh "thí nghiệm tương ứng" bằng hẹn giờ | Đã sửa trước đó (MutationObserver) | — |
| 16 | P2 | Bấm "Thư viện thí nghiệm" hiện thông báo "chuyển sang Tự do" | Đúng | Bỏ thông báo ở nhánh này |
| 17 | P2 | Thí nghiệm phân lớp không có điều kiện kiểm | Đúng | Chưa sửa: bài có hướng dẫn "organic" và test dung môi đã kiểm khối lượng riêng/phân lớp; ghi là giới hạn |
| 18, 19, 22, 23, 25 | P2–P3 | Câu chữ (Cl⁻ từ FeCl₃; kiềm làm mất màu tinh bột chưa mô phỏng; dụng cụ thừa; 4,35 mmol Na; ngưỡng quỳ) | Đúng | Sửa câu chữ |
| 20 | P2 | Kiểm công thức AgSCN bị bỏ qua | Đúng | Thêm SCN vào bảng kiểm |
| 21 | P2 | Giải lại các kết tủa cạnh tranh mỗi lần cân bằng | Đúng về nguyên tắc | Chưa tối ưu; FPS được đo trong E2E (không giảm ngưỡng) |
| 24 | P3 | `#dlab/...` không được viết lại | Đúng | Viết lại theo phần đầu của đường dẫn |
