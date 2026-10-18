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
| E7 | P2 | 4 parser công thức trùng lặp (Balancer, Calculator, Compound Studio, Reaction Studio), không có test | Balancer + Calculator dùng `src/chem/formula.js`; 2 Studio còn parser riêng |
| E8 | P2 | Hệ số đứng đầu bị hiển thị thành chỉ số dưới trên đĩa cân (₂MnO₄) | Đã sửa |
| E9 | P2 | pH Virtual Lab là điểm tuyến tính không theo nồng độ (đã ghi "ước tính" trên UI) | Chưa đổi — cần mô hình nồng độ, ảnh hưởng ngưỡng chỉ thị của Guided |

## Cơ hội tiếp theo (chưa làm)

- Compound/Reaction Studio dùng parser chung (E7).
- Mô hình pH theo nồng độ (E9) — cần quyết định nồng độ chuẩn của dung dịch trong Lab.
- Bộ chọn 3D phân tử (ball-and-stick) cho các phân tử THPT có tọa độ kiểm chứng.
- Đo hiệu năng có throttling (LCP/INP thực tế trên mobile).
