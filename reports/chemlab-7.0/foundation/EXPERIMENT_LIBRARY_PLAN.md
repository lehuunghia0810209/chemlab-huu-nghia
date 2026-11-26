# ChemLab 7.0 — Kế hoạch Experiment Library (Hóa học 10–12)

Viết cho: chủ sở hữu và phiên phát triển kế tiếp.

## 1. Chuẩn một thí nghiệm (đã áp dụng cho nhóm 1)

Mỗi thí nghiệm là **dữ liệu** trong `src/dlab/data/experiments.js`. Engine tự tính mọi kết quả; không có hoạt cảnh dựng sẵn.

| Trường | Ý nghĩa |
|---|---|
| `objective`, `equipment`, `chemicals`, `conditions` | Mục tiêu học tập; dụng cụ; hóa chất có nồng độ; điều kiện áp dụng |
| `setup` | Bình, dung dịch ban đầu, các chai cần dùng (bày bằng chính lệnh `dispatch` mà học sinh dùng) |
| `steps` | Thao tác dạng dữ liệu `{ text, act }`. Học sinh, unit test và E2E cùng thực hiện đúng các thao tác này |
| `phenomena`, `equation`, `explanation` | Hiện tượng; phương trình (phải qua `dlab-sci-validate`); giải thích khoa học |
| `safety` | Cảnh báo an toàn ngoài đời |
| `processRefs` | Các mục manifest mà thí nghiệm dùng |
| Trạng thái kiểm chứng | **Không nhập tay**: `experimentValidation()` lấy mức *yếu nhất* trong các `processRefs` từ ma trận. Quá trình không có trong manifest thì là UNVERIFIED |
| `expect`, `references`, `tests` | Sự kiện engine phải sinh ra; nguồn; tên test (test kiểm tra rằng các tên này tồn tại) |

Chuỗi hoàn thiện cho mỗi thí nghiệm:

**Định nghĩa → Bày dụng cụ → Thao tác (thanh rót, kẹp, ống nhỏ giọt) → Engine → Sự kiện quan sát → 2D/3D → Giải thích → E2E.**

Một thí nghiệm chỉ được thêm khi đáp ứng đủ:
- Phương trình cân bằng (`dlab-sci-validate`).
- Unit test `experiment library` chạy đúng các bước trên engine và thấy đủ `expect`, không có sự kiện UNSUPPORTED.
- Journey E2E `L01` làm thí nghiệm qua UI.
- Nhãn hiển thị đúng với ma trận.

## 2. Các nhóm (theo khả năng hiện có của engine)

| # | Nhóm | Lớp | Quá trình sẵn có (trạng thái ma trận) | Trạng thái |
|---|---|---|---|---|
| 1 | **Kết tủa, hòa tan và tạo phức** | 11–12 | AgCl, BaSO₄, Cu(OH)₂, Fe(OH)₃, hòa tan trong axit (VALIDATED); phức Ag–NH₃ (VALIDATED); phức Cu–NH₃ (APPROX) | **Đã triển khai: 6 thí nghiệm** |
| 2 | Axit – bazơ, pH và chất chỉ thị | 10–11 | Trung hòa (VALIDATED); chất chỉ thị (APPROX); CO₂ từ cacbonat (APPROX) | Sẵn sàng (chỉ cần dữ liệu) |
| 3 | Kim loại: dãy hoạt động | 12 | Mg/Zn/Fe + axit, Fe/Zn + Cu²⁺, Cu + Ag⁺, Na + nước (VALIDATED: tỉ lượng; tốc độ là minh họa); không phản ứng theo E° (VALIDATED) | Sẵn sàng |
| 4 | Điện hóa | 12 | Pin Daniell (VALIDATED); điện phân CuCl₂ (APPROX: khối lượng theo Faraday, cường độ dòng là minh họa) | Sẵn sàng |
| 5 | Oxi hóa – khử với iotua | 10 | CuCl₂ + KI (VALIDATED); Fe³⁺ + I⁻ (APPROX) | Sẵn sàng |
| 6 | Hòa tan, kết tinh, sôi, dung môi | 10–11 | Hòa tan/kết tinh, sôi, phân lớp nước–etanol–dầu (APPROX) | Sẵn sàng, ghi rõ giới hạn của bảng điểm sôi |
| 7 | Kết tủa cacbonat (CaCO₃, BaCO₃, ZnCO₃, Ag₂CO₃), Zn(OH)₂ | 11 | **UNVERIFIED** | Chỉ làm sau khi có test định lượng có lời giải tay |
| — | Chưa hỗ trợ (không làm cho đến khi có mô hình và nguồn) | | Kim loại + HNO₃ (NOx); Fe(OH)₂ bị oxi hóa trong không khí; Zn(OH)₂/Al(OH)₃ lưỡng tính; dịch chuyển cân bằng màu (Fe³⁺/SCN⁻); tốc độ phản ứng định lượng; phản ứng hữu cơ (este hóa…); nhiệt lượng kế chính xác | Giữ nhãn UNSUPPORTED; không dùng hoạt cảnh để giả lập |

## 3. Thứ tự cho các đợt sau

1. **Nhóm 2 và 3** (nhiều bài thường gặp; quá trình đã VALIDATED): 4–6 thí nghiệm mỗi nhóm theo đúng chuẩn §1.
2. **Nhóm 4 và 5.**
3. **Nhóm 7:** viết test định lượng trước, sau đó mới đưa vào thư viện.
4. **UI Experiment Catalog:** hiện thư viện nằm trong tab "Khám phá". Khi có trên 3 nhóm, tách thành màn hình riêng, có lọc theo lớp, nhóm và mức kiểm chứng.

Không đặt chỉ tiêu số lượng. Thí nghiệm nào chưa qua đủ các bước ở §1 thì không đưa vào.
