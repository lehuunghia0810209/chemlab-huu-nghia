# ChemLab 7.0 — Kiểm chứng khoa học

**Trạng thái: PARTIAL.** Mọi phép tính định lượng được kiểm bằng lời giải đóng độc lập trong `scripts/test-dlab.mjs`. Các hằng số lấy từ bảng chuẩn (CRC, NBS, Harris) theo giá trị phổ biến, **chưa được chuyên gia đối chiếu lại với bản gốc trong phiên này** — cần một giáo viên/chuyên gia Hóa duyệt trước khi phát hành Production.

Phân loại: **Q** = kiểm chứng định lượng · **QL** = kiểm chứng định tính · **A** = xấp xỉ giáo dục · **U** = chưa hỗ trợ.

## 1. Hằng số và nguồn

| Đại lượng | Giá trị | Nguồn | Ghi chú |
|---|---|---|---|
| Kw | 1,0·10⁻¹⁴ | CRC | 25 °C, không phụ thuộc nhiệt độ trong mô hình |
| Ka HSO₄⁻ | 1,2·10⁻² | CRC | |
| Ka CH₃COOH | 1,75·10⁻⁵ | CRC | |
| Ka NH₄⁺ | 5,6·10⁻¹⁰ | CRC | |
| Ka₁, Ka₂ H₂CO₃ | 4,45·10⁻⁷; 4,69·10⁻¹¹ | CRC | |
| Thủy phân bậc 1 | Cu²⁺ 10⁻⁷·⁵, Fe²⁺ 10⁻⁹·⁵, Fe³⁺ 10⁻²·¹⁹, Zn²⁺ 10⁻⁹ | tài liệu chuẩn | chỉ bậc 1 |
| Ksp | AgCl 1,77·10⁻¹⁰; AgI 8,52·10⁻¹⁷; BaSO₄ 1,08·10⁻¹⁰; CaCO₃ 3,36·10⁻⁹; Cu(OH)₂ 2,2·10⁻²⁰; Fe(OH)₃ 2,79·10⁻³⁹; Fe(OH)₂ 4,87·10⁻¹⁷; Mg(OH)₂ 5,61·10⁻¹² | CRC | 25 °C |
| Henry CO₂ | 3,4·10⁻² mol/(L·atm) | CRC | |
| ΔH trung hòa | −55,84 kJ/mol | NBS ΔfH° | dùng cả cho axit yếu (xấp xỉ) |
| ΔH phản ứng kim loại | Mg −466,85; Zn −153,89; Fe −89,1; Fe+Cu²⁺ −153,87; Zn+Cu²⁺ −218,66; Cu+2Ag⁺ −146,39; Na+H₂O −184,28; CaCO₃+2H⁺ −15,25 kJ/mol | NBS ΔfH° | |
| Độ tan | NaCl 35,7–39,2; KNO₃ 13,3–246 (0–100 °C); NaHCO₃ 6,9–16,4 g/100 g nước | CRC | nội suy tuyến tính |
| F | 96485 C/mol | CODATA | |
| Pin Zn–Cu | E° = 1,10 V | CRC | Nernst 25 °C |
| Khối lượng mol | tính từ `src/data/elements.js` | IUPAC | |

## 2. Kết quả đối chiếu (test fixtures độc lập)

| Mô hình | Kỳ vọng (tính tay) | Kết quả engine | Loại |
|---|---|---|---|
| HCl 0,5 M | pH 0,301 | 0,301 | Q |
| NaOH 0,5 M | pH 13,699 | 13,699 | Q |
| CH₃COOH 1 M (bậc hai) | pH 2,379 | 2,379 | Q |
| NH₃ 0,5 M | pH 11,475 | 11,474 | Q |
| HCl + NaOH đương lượng | pH 7,00; Q = 279,2 J | 7,00; 279,2 J | Q |
| HCl dư (10 mL + 5 mL NaOH) | pH 0,778 | 0,778 | Q |
| AgNO₃ + NaCl dư | AgCl 1,000 mmol; [Ag⁺] = Ksp/[Cl⁻] | khớp ±2 % | Q |
| CuSO₄ + NaOH thiếu | Cu(OH)₂ = n(OH⁻)/2 | khớp ±1 % | Q |
| Cu(OH)₂ + HCl dư | tan hết | tan hết | Q |
| BaCl₂ + Na₂SO₄ | BaSO₄ 2,000 mmol | khớp ±1 % | Q |
| Mg 0,05 g + HCl 0,5 M 10 mL | H₂ = n(Mg) = 2,057 mmol; pH sau 1,05 | khớp ±0,5 % / ±0,03 | Q (tỉ lượng), A (tốc độ) |
| Na 0,1 g + 100 mL nước | H₂ = 2,175 mmol; pH 12,64; ΔT > 0 | khớp | Q (tỉ lượng, pH), A (tốc độ, chuyển động) |
| Fe + CuSO₄ | n(Cu bám) = n(Fe phản ứng) | khớp ±0,01 % | Q |
| Điện phân CuCl₂, 6 V, 60 s | n(Cu) = I·t/2F (I = 1,145 A) | khớp ±1 % | Q (Faraday); A (điện trở bình 4 Ω, quá thế 0,4 V) |
| Pin Zn–Cu, nồng độ bằng nhau | 1,100 V; mạch hở 0 V khi thiếu cầu muối | khớp ±0,002 | Q |
| KNO₃ 15 g/20 mL: tan ở 60 °C, làm lạnh 25 °C | tinh thể = 15 − 38,7·m(nước)/100 | khớp ±5 % | Q (độ tan bảng) |
| CO₂ sục vào nước vôi pha loãng | đục tối đa ≈ n(Ca²⁺), sau đó trong lại | khớp ±10 % | QL |
| Bảo toàn nguyên tố (Cl, Mg, C) | không đổi | không đổi | Q |
| Bảo toàn thể tích khi rót nghiêng | A + B + đổ ra = 60 mL | sai số < 10⁻⁶ mL | Q |

## 3. Chất chỉ thị

| Chất chỉ thị | Quy luật | Loại |
|---|---|---|
| Quỳ tím | đỏ ≤ 4,5 → tím 5,5–7,5 → xanh ≥ 8,3 (thang màu) | QL |
| Phenolphtalein | dạng bazơ theo 1/(1+10^(9,4−pH)); không màu < 8,2 | QL (khoảng chuyển màu Harris) |
| Metyl da cam | pKin 3,46; đỏ < 3,1, vàng > 4,4 | QL |
| Vạn năng | thang màu pH 1–14 | QL |

## 4. Xấp xỉ giáo dục (A) — phải nói rõ với học sinh

1. Dung dịch lý tưởng, hoạt độ = nồng độ (ở 0,5 M pH thật lệch vài phần mười). Ví dụ CuSO₄ 0,5 M: mô hình pH ≈ 4,7, thực tế ≈ 3,5–4.
2. Tốc độ phản ứng dị thể (k), hệ số khuếch tán màu, tốc độ lắng, chuyển động mẩu Na: minh họa, không phải số đo.
3. Kết tủa đầu tiên cần Q > 10·Ksp (vùng giả bền) — tránh kết tủa giả nhưng là quy ước đơn giản hóa.
4. Thủy phân ion kim loại chỉ bậc 1; bỏ qua phức chất (ví dụ [Cu(NH₃)₄]²⁺ — **U**).
5. Nhiệt: nhiệt dung dung dịch ≈ nước; hiệu suất bếp 50 %, hệ số mất nhiệt 0,35 W/K là minh họa. Không bay hơi dưới 100 °C.
6. CO₂ hòa tan bị giới hạn ở độ tan dưới 1 atm; trao đổi chậm với không khí bị bỏ qua. Với nước vôi bão hòa (0,02 M), mô hình lý tưởng chỉ làm tan lại khoảng 2/3 CaCO₃ khi sục CO₂ dư.
7. Hư hỏng dụng cụ: sốc nhiệt khi |ΔT| > 60 K (thủy tinh chịu nhiệt) hoặc > 30 K (không chịu nhiệt) với dụng cụ gần khô — quy tắc giáo dục, không phải cơ học vật liệu.
8. Hình học khoang chứa là vật tròn xoay gần đúng; vạch chia được hiệu chỉnh để dung tích danh định đúng.

## 5. Chưa hỗ trợ (U) — engine báo “chưa có mô hình”, không tạo kết quả

- Kim loại + HNO₃ (sinh NOx), Cu + Fe³⁺, Fe + Fe³⁺, I⁻ + Fe³⁺.
- Giai đoạn điện phân nước sau khi hết Cu²⁺ hoặc Cl⁻; điện phân dung dịch khác CuCl₂.
- Na với axit (bị Safety chặn), axit đặc, phản ứng hữu cơ tổng hợp.
- Cô cạn đến khô: ion chuyển thành “cặn” và chỉ được báo cáo.

## 6. Việc cần chuyên gia làm trước khi phát hành

- Đối chiếu bảng hằng số ở §1 với CRC/NBS bản gốc.
- Duyệt lời văn hiện tượng/giải thích trong 5 Guided Lab và các câu “Không có phản ứng”.
- Quyết định có công bố mức Na tối đa 0,2 g và quy tắc ≥ 50 mL nước hay không.
