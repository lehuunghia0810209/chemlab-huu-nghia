# ChemLab 7.0 — Kết quả kiểm thử (2026-11-22)

Môi trường: Windows 11, Node 24.21, Vite 8.3.6, playwright-core 1.64 (headless), build `dist/` từ worktree.

## Lệnh và kết quả

| Lệnh | Kết quả |
|---|---|
| `npm run check` (bao gồm `check:dlab`) | PASS — toàn bộ bộ kiểm tra hiện có + Dynamic Lab 36/36 |
| `npm run build` | PASS |
| `node scripts/dlab-e2e.mjs` (Chromium) | PASS 31/31 |
| `CHEMLAB_BROWSER=firefox node scripts/dlab-e2e.mjs` | PASS 31/31 |
| `CHEMLAB_BROWSER=webkit node scripts/dlab-e2e.mjs` | PASS 31/31 |
| `npm run check:browser` (regression ChemLab, Chromium) | Lần 1 FAIL 40/448 → đã sửa (lỗi 8 bên dưới); lần 2 PASS 448/448 |

## Unit / integration (`scripts/test-dlab.mjs`, 36)

Registry (khối lượng mol, hồ sơ, độ tan, hình học bình), pH mạnh/yếu, trung hòa + nhiệt, AgCl/BaSO₄/Cu(OH)₂ (tạo và tan lại), rót chính xác, rót nghiêng bảo toàn, 30 vs 60 FPS giống hệt, tốc độ/pause, Undo, serialize→restore→tiếp tục, Mg+HCl, Na+H₂O (nổi, chạy, tan, pH, nhiệt), Fe+CuSO₄, phản ứng không hỗ trợ, NaCl tan + KNO₃ kết tinh khi làm lạnh, CO₂ + nước vôi, giấy quỳ (một phần/sâu hơn/lấy ra/dùng lại/trung tính/không chạm), khuếch tán + khuấy, kết tủa lắng + khuấy lơ lửng, Safety Na, hư hỏng (ống đong không đun, sốc nhiệt → nứt → vỡ → từ chối chứa → dọn), điện phân Faraday, pin Nernst, bất biến, lưu/migrate, hoàn thành cả 5 Guided Lab.

## E2E (`scripts/lib/dlab-journeys.mjs`) — kiểm cả trạng thái lẫn pixel canvas

S01 lấy giấy quỳ · S02 nhúng một phần (đầu giấy đỏ, phần trên tím trên canvas) · S03 nhúng sâu hơn · S04 lấy ra giữ màu · S05 rót bằng kéo + lăn chuột, bảo toàn Na⁺ · S06 nhỏ giọt · S07 màu lan từ điểm tiếp xúc (pixel hồng gần giọt) · S08 khuấy bằng đũa · S09 kết tủa lắng (pixel đáy xanh) · S10 kéo muối từ thư viện, tan · S11 đinh sắt/CuSO₄ · S12 điện phân qua inspector + hộp thoại an toàn · S13 dầu tách lớp (pixel vàng trên) · S14 cảnh báo/chặn Na · S15 sốc nhiệt → nứt, bếp bị chặn · S16 pause/resume · S17 tốc độ 4× và 0,25× · S18 Undo · S19 Reset · S20 lưu, tải lại trang, mở · S21 2D↔3D giữ nguyên trạng thái · S22 hoàn thành Guided Lab · S23 Sandbox · S24 không tạo H₂ giả, báo “chưa có mô hình” · S25 không có POST `/api/chat`; “Hỏi ChemAI” chỉ điền sẵn câu hỏi · M01 390/320 px · R01 768/1024/1920 · A01 axe WCAG 2.2 AA sáng/tối · P01/P01b hiệu năng · P02 đóng/mở 3D.

Ghi chú S25: khi mở panel, ChemAI hiện có gửi `GET /api/chat` (trạng thái + quota, không gọi model — `functions/api/chat.js` onRequestGet). Test chỉ tính request khác GET.

## Lỗi phát hiện nhờ kiểm thử và đã sửa

1. Inspector vẽ lại mỗi 6 khung → nút bị thay khi đang bấm (S12, S15). Sửa: chỉ vá text khi cấu trúc không đổi.
2. Giọt rơi vào ống nghiệm sâu bị tính là đổ ra bàn (S22). Sửa: cố định bình nhận khi giọt rời đầu ống.
3. Vật lấy từ thư viện nằm ngoài vùng nhìn trên điện thoại (M01). Sửa: chọn chỗ trống trong vùng đang hiển thị.
4. Giọt chỉ thị đậm đặc không hiện màu tại điểm rơi (S07). Sửa: “bake” màu theo ô + ngoại suy màu khi tracer đậm đặc.
5. Canvas 2D lộ ra dưới 3D (`display:block` ghi đè `hidden`). Sửa CSS.
6. Khuấy phụ thuộc FPS và bị triệt tiêu khi kéo qua lại trong một bước (S08 WebKit). Sửa: tỉ lệ theo quãng đường nét khuấy, cộng dồn ở controller.
7. Fe trong CuSO₄ báo “sinh H₂” do pH thủy phân. Sửa: phản ứng axit–kim loại chỉ khi pH < 3.
8. Regression `check:browser` 40/448: view `dlab` vô tình thêm mục thứ 6 vào bottom nav (bị che trên điện thoại). Sửa: bottom nav chỉ gồm 5 view chính.

## Hiệu năng (cảnh 8 cốc, 480 hạt kết tủa, 240 khung)

| Trình duyệt (headless) | Đồ họa cao | Đồ họa tiết kiệm | Long task |
|---|---|---|---|
| Chromium | 60,0 FPS, p95 16,8 ms | 60,0 FPS | 0 |
| Firefox | 47,3 FPS, p95 26,6 ms | 45,6 FPS | 0 |
| WebKit | 32,4 FPS, p95 42,0 ms | 34,2 FPS | 0 |

WebKit/Firefox headless trên Windows giới hạn requestAnimationFrame; chế độ tiết kiệm không làm đổi đáng kể → giới hạn môi trường, không phải chi phí vẽ. Chưa đo trên thiết bị thật, chưa đo LCP/CLS bằng Lighthouse (NOT RUN). Bundle: `dlabApp` ≈ 121 kB (gzip ≈ 41 kB) tải lười chỉ ở `#dlab`; `render3d` ≈ 5 kB chỉ khi bấm 3D. Bộ nhớ: Chromium `performance.memory` bị lượng tử hóa nên không kết luận được rò rỉ heap; đã xác nhận canvas WebGL được gỡ sau 7 lần mở/đóng.
