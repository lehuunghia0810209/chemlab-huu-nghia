# ChemLab Next Evolution — Audit

Ngày: 2026-10-18 · Nhánh: `evolution/next` (tách từ `remake/ultimate-ui` @ `d06c3dd`).

## Baseline đã xác minh (chạy lại trong phiên)

| Lệnh | Kết quả |
|---|---|
| `npm run check` (project, chem 16, ui 75, ai mock) | PASS |
| `npm run build` | PASS — cảnh báo `orbitalScene` 788 kB (gzip 201 kB), chỉ tải khi mở 3D |
| `npm run check:browser` | PASS 115/115 |

## Phát hiện (có bằng chứng)

| ID | Mức | Vấn đề | Trạng thái |
|---|---|---|---|
| E1 | P1 | 2 phương trình oxi hóa–khử trong Virtual Lab chưa cân bằng (`h2o2-kmno4-acid`, `feso4-kmno4-acid`) — lệch nguyên tố và điện tích | Đã sửa, có test |
| E2 | P1 | 20 phương trình hiển thị chữ tiếng Anh thay cho phương trình ("Alkene + KMnO₄ → oxidized products", "copper-ammonia complex"…) | Đã thay bằng phương trình chuẩn SGK hoặc mô tả tiếng Việt |
| E3 | P1 | Không có kiểm thử nào xác minh phương trình dữ liệu bảo toàn nguyên tố | Đã thêm: mọi phương trình (trừ 6 phương trình chữ được liệt kê) phải bảo toàn nguyên tố + điện tích |
| E4 | P1 | Balancer: kiểm tra trực tiếp bỏ qua hệ số người dùng nhập ("2H₂ + O₂ → 2H₂O" báo chưa cân bằng) | Đã sửa |
| E5 | P2 | Balancer chấp nhận ký hiệu không tồn tại ("Hcl" → nguyên tố "Hcl"), không đọc chỉ số Unicode (H₂O), không hỗ trợ ion | Đã sửa: kiểm tra ký hiệu, Unicode, điện tích `^2+`/`²⁺` |
| E6 | P2 | Balancer im lặng chọn bộ hệ số nhỏ nhất khi nghiệm không duy nhất → kết quả sai hóa học với redox (vd. H₂O₂ + MnO₄⁻) | Đã thêm cảnh báo nhiều nghiệm |
| E7 | P2 | 4 parser công thức trùng lặp (Balancer, Calculator, Compound Studio, Reaction Studio), không có test | Đã gộp: cả 4 công cụ dùng `src/chem/formula.js`; Reaction Studio dùng bộ cân bằng chung |
| E8 | P2 | Hệ số đứng đầu bị hiển thị thành chỉ số dưới trên đĩa cân (₂MnO₄) | Đã sửa |
| E9 | P2 | pH Virtual Lab là điểm tuyến tính không theo nồng độ | Đã sửa cho acid/base mạnh (số mol, 0,1 M); acid/base yếu hiển thị định tính |
| E10 | P2 | Khuấy luôn tạo bọt khí kể cả khi không có phản ứng sinh khí | Đã sửa |
| E11 | P2 | Tool Center tải Three.js (~190 kB gzip) dù chỉ dùng công cụ 2D | Đã sửa (Orbital Atlas tải động) |
| E12 | P1 | Bảng tính tan: Ag₂SO₄, Li₃PO₄ ghi "tan"; 7 cặp không tồn tại trong nước ghi "không tan" | Đã sửa |
| E13 | P2 | Reaction Studio gắn (aq) cho khí/chất rắn quen thuộc (NO, MnO₂…) | Đã sửa bằng danh sách trạng thái |

## Đo hiệu năng (EV-07, 2026-10-19)

Điều kiện: `vite preview` cục bộ, viewport 390×844 DPR 3, CPU chậm 4×, mạng 150 ms RTT / 1,6 Mbps, không service worker.

| Route | LCP | CLS | Tương tác đo được | Dữ liệu tải |
|---|---|---|---|---|
| home | 1,72 s | 0 | 176 ms | 243 kB |
| periodic | 1,47 s | 0,001 | 280 ms lần mở đầu; 112–144 ms các lần sau | 228 kB |
| tools | 1,31 s | 0 | 88 ms | 274 kB |
| lab | 2,04 s | 0 | 88 ms | 278 kB |
| learning | 1,30 s | 0 | 200 ms | 282 kB |

Mở chi tiết nguyên tố lần đầu tốn thêm ~100 ms layout (4×) do tải font/thiết lập style lần đầu; chưa xử lý.
Phiên dài: 20 lần mở/đóng mô hình phân tử 3D — không còn canvas, không cảnh báo WebGL, heap 6,9 → 7,9 MB; 30 vòng thêm/khuấy/hoàn tác/đặt lại trong Lab — heap 3,48 → 3,56 MB, không lỗi.
Không có công cụ a11y tự động (axe chưa cài) — chỉ kiểm tra thủ công nhãn/aria của phần mới.

## Cơ hội tiếp theo (chưa làm)

- pH cho acid/base yếu và hệ đệm (cần nồng độ + Ka đã kiểm chứng).
- Phản ứng Lab vẫn định tính: không tiêu thụ chất, kết tủa không tan lại khi dư thuốc thử.
- Mở rộng thư viện phân tử 3D (SO₂, PCl₅, C₂H₅OH…) khi có số liệu kiểm chứng.
- Kiểm thử a11y bằng công cụ (axe) — cần cài dev dependency.
