# ChemLab 7.0 — Kiểm chứng khoa học (cập nhật 2026-11-22, phiên hoàn thiện Phase 5)

**Trạng thái D31: PARTIAL — PENDING EXPERT REVIEW.** Các hằng số đã được đối chiếu với nguồn truy xuất được (bên dưới). Ba sai lệch đã được sửa. **Chưa có chuyên gia Hóa học nào thẩm định.** Báo cáo này không tự nhận đã có xác nhận chuyên môn.

Cách đối chiếu: đọc trực tiếp các bảng công khai có trích dẫn nguồn gốc (CRC 84th ed. qua LibreTexts; bảng tổng hợp thủy phân COST Action 1802 của Baes & Mesmer / NIST46 / IUPAC; trang sản phẩm Sigma-Aldrich/Merck cho pH đo). Không dùng câu trả lời của LLM khác làm bằng chứng. Hai trang (OpenText BC, eCampusOntario) chặn truy cập tự động nên không được dùng.

Phân loại mô hình (theo chỉ thị): **(1) Quantitatively validated · (2) Qualitatively validated · (3) Educational approximation · (4) Unsupported · (5) Pending expert review.**

## 1. Thay đổi so với bản `b379911`

| Đại lượng | Trước | Sau | Lý do / nguồn |
|---|---|---|---|
| Ka₂ (HSO₄⁻) | 1,2·10⁻² | **1,0·10⁻²** (pKa₂ 1,99) | CRC 84th ed. (LibreTexts E1). 1,2·10⁻² là giá trị của một số giáo trình cũ (pKa 1,92); chọn CRC cho thống nhất với các Ka khác. |
| Thủy phân Cu²⁺, log*β₁ | −7,5 | **−7,95** | Powell et al. 2007 (IUPAC), I = 0, 25 °C: −7,95 ± 0,16 (bảng COST 2024). Các bộ khác: NIST46 −7,7; Plyasunova −7,97; Brown & Ekberg −7,64. |
| Dime Cu₂(OH)₂²⁺, log*β₂₂ | không có | **−10,43** | Powell et al. 2007: −10,43 ± 0,07. Thiếu dime là nguyên nhân gốc khiến mô hình lệch pH CuSO₄ và sinh kết tủa Cu(OH)₂ giả (xem §3). |
| Thủy phân Zn²⁺, log*β₁ | −9,0 | **−8,96** | IUPAC 2013 (Powell, PAC 85, 2249): −8,96 ± 0,05; Baes & Mesmer −8,96. |

Không đổi (đã xác nhận): Fe³⁺ −2,19 (Baes & Mesmer 1976; Lemire 2013 −2,15; Brown & Ekberg −2,20). Fe²⁺ −9,5 (Baes & Mesmer 1976; Lemire −9,1 ± 0,4; Brown & Ekberg −9,43) — giá trị được giữ, chênh lệch giữa các bộ dữ liệu tới 0,4 đơn vị log → **(5)**.

## 2. Bảng hằng số, nguồn và phạm vi

| Đại lượng | Giá trị | Đơn vị · điều kiện | Nguồn đã đối chiếu | Phạm vi / giới hạn | Loại |
|---|---|---|---|---|---|
| Kw | 1,0·10⁻¹⁴ | 25 °C | CRC (pKw 14,00) | Không phụ thuộc nhiệt độ trong mô hình (ở 60 °C thật ≈ 9,6·10⁻¹⁴) | 3 |
| Ka CH₃COOH | 1,75·10⁻⁵ | 25 °C, I = 0 | CRC 84 (LibreTexts E1): 1,75·10⁻⁵, pKa 4,756 | | 1 |
| Ka NH₄⁺ | 5,6·10⁻¹⁰ | 25 °C | Từ Kb NH₃ = 1,8·10⁻⁵ (CRC 84, LibreTexts E2): Kw/Kb = 5,6·10⁻¹⁰ | | 1 |
| Ka₁, Ka₂ H₂CO₃ | 4,45·10⁻⁷; 4,69·10⁻¹¹ | 25 °C | CRC 84: 4,5·10⁻⁷ (pKa 6,35); 4,7·10⁻¹¹ (pKa 10,33) | Khớp tới chữ số hiển thị | 1 |
| Ka₂ HSO₄⁻ | 1,0·10⁻² | 25 °C, I = 0 | CRC 84: 1,0·10⁻², pKa₂ 1,99 | Ở lực ion cao Ka₂ biểu kiến lớn hơn nhiều (Luts 1994: 0,095 trong NaClO₄ 1 M) | 1 (I ≤ 0,1 M) |
| Ksp AgCl | 1,77·10⁻¹⁰ | 25 °C | CRC 84 (LibreTexts E3) + EngineeringToolbox | | 1 |
| Ksp AgI | 8,52·10⁻¹⁷ | 25 °C | CRC 84 | | 1 |
| Ksp BaSO₄ | 1,08·10⁻¹⁰ | 25 °C | CRC 84 | | 1 |
| Ksp CaCO₃ | 3,36·10⁻⁹ | 25 °C, calcit | CRC 84; EngineeringToolbox ghi rõ calcit (aragonit 6,0·10⁻⁹) | | 1 |
| Ksp Fe(OH)₃ | 2,79·10⁻³⁹ | 25 °C | CRC 84 | Thực tế phụ thuộc độ già hóa kết tủa | 1 |
| Ksp Fe(OH)₂ | 4,87·10⁻¹⁷ | 25 °C | CRC 84 | | 1 |
| Ksp Mg(OH)₂ | 5,61·10⁻¹² | 25 °C | CRC 84 | | 1 |
| Ksp Cu(OH)₂ | 2,2·10⁻²⁰ | 25 °C | Bảng mở eCampusOntario trích CRC 100th ed. (qua kết quả tìm kiếm; trang chặn đọc trực tiếp). LibreTexts E3 (CRC 84) không có dòng này; EngineeringToolbox ghi 1·10⁻²⁰; IUPAC Powell 2007: log*Ks₀ = 8,67 → Ksp ≈ 4,7·10⁻²⁰ | Các nguồn lệch tới hệ số 4,7 | **5** |
| Thủy phân Cu²⁺, Zn²⁺, Fe³⁺, Fe²⁺ | xem §1 | I = 0, 25 °C | COST Action 1802 (2024), bảng Cu, Zn, Fe | Chỉ CuOH⁺, Cu₂(OH)₂²⁺, MOH; bỏ qua Cu₃(OH)₄²⁺, ion phức | 1 (Cu, Zn, Fe³⁺); 5 (Fe²⁺) |
| Henry CO₂ | 3,4·10⁻² | mol/(L·atm), 25 °C | Sander (compilation) — giá trị phổ biến, **chưa đọc lại bản gốc trong phiên này** | | 5 |
| ΔfH° ion (kJ/mol) | Mg²⁺ −466,85; Fe²⁺ −89,1; Ag⁺ +105,58; Na⁺ −240,12; OH⁻ −229,99; H₂O(l) −285,83; CO₂(g) −393,51 | 25 °C | CRC 84 (LibreTexts T1): −466,85; −89,1; 105,6; −240,1; −230,0; −285,8; −393,5 | Khớp tới 0,1 kJ | 1 |
| ΔfH° Zn²⁺, Cu²⁺, Ca²⁺ | −153,89; +64,77; −542,83 | 25 °C | NBS 1982 — **không có trong bảng LibreTexts T1 đã đọc** | | 5 |
| ΔfH° CaCO₃ (calcit) | −1206,92 (NBS) | 25 °C | CRC 84 ghi −1207,6 | Chênh 0,7 kJ → ΔH(CaCO₃ + 2H⁺) = −15,25 (NBS) hoặc −14,6 kJ/mol (CRC) | 1 (trong ±1 kJ) |
| ΔH trung hòa | −55,84 kJ/mol | 25 °C | Tính từ ΔfH° H₂O(l) và OH⁻ (đã khớp CRC) | Áp dụng cả cho axit yếu (bỏ qua nhiệt phân li) | 1 (axit mạnh) · 3 (axit yếu) |
| E° Cu²⁺/Cu; Zn²⁺/Zn | +0,3419; −0,7618 V | 25 °C | LibreTexts P1 (Harvey; Bard 1985) | E°pin Daniell = 1,1037 → 1,10 V | 1 |
| E° Cl₂/Cl⁻ | 1,358 V (khí) | 25 °C | P1 ghi 1,396 V cho Cl₂(**aq**); 1,358 V là Cl₂(**k**) (CRC). Mô hình dùng khí → 1,358 | Thế phân hủy CuCl₂ = 1,358 − 0,342 = 1,02 V | 1 |
| F | 96485 C/mol | | CODATA (96485,33) | | 1 |
| Độ tan KNO₃ | 13,3 → 246 g/100 g nước (0–100 °C) | | Bảng độ tan chuẩn (Perry/CRC, giá trị phổ biến) | Nội suy tuyến tính giữa các mốc 10 °C | 1 (bảng) · 5 (bản gốc chưa đọc lại) |
| Độ tan NaCl | 35,7 → 39,2 | | như trên | Perry ghi 36,0 (20 °C), 39,8 (100 °C) — chênh ≤ 0,6 | 5 |
| Độ tan NaHCO₃ | 6,9; 9,6; 12,7; 16,4 (0/20/40/60 °C) | | như trên | | 5 |
| Khối lượng mol | từ `src/data/elements.js` | | Khối lượng nguyên tử IUPAC (dữ liệu sẵn có của ChemLab, đã dùng ở các bản trước) | | 1 |
| Khối lượng riêng rắn | Na 0,968; Mg 1,738; Zn 7,14; Fe 7,874; Cu 8,96; CaCO₃ 2,71; NaCl 2,165; KNO₃ 2,11; NaHCO₃ 2,20 g/cm³ | 20–25 °C | CRC (giá trị phổ biến) — **chưa đọc lại bản gốc** | Chỉ dùng cho kích thước hình học | 5 |
| Màu hóa chất, kết tủa | RGB minh họa | | SGK Hóa học (mô tả định tính: Cu(OH)₂ xanh lam, Fe(OH)₃ nâu đỏ, AgCl trắng, AgI vàng, Fe(OH)₂ trắng xanh) | Không phải phép đo màu | 2 |

## 3. pH của dung dịch CuSO₄ (yêu cầu kiểm tra riêng)

**Số liệu đo có nguồn** (không có số liệu đo nào ở đúng 0,5 M được tìm thấy):

| Dung dịch | pH đo | Điều kiện | Nguồn |
|---|---|---|---|
| CuSO₄ 0,1 M (dung dịch chuẩn độ) | 4,2 | 20 °C, nước | Sigma-Aldrich/Merck 102784 |
| CuSO₄·5H₂O 50 g/L (≈ 0,20 M) | 3,7–4,5 | 25 °C | Sigma-Aldrich C7631 (trang sản phẩm) |

**Mô hình (sau sửa, I = 0, không hiệu chỉnh hoạt độ):**

| C (M) | 0,001 | 0,01 | 0,05 | 0,1 | 0,2 | 0,5 |
|---|---|---|---|---|---|---|
| pH mô hình | 5,31 | 4,78 | 4,49 | **4,38** | **4,28** | 4,14 |

- Ở 0,1 M lệch +0,18 so với số đo 4,2 (khác 5 °C). Ở 0,2 M nằm trong khoảng 3,7–4,5 → **(1) trong khoảng có số đo 0,1–0,2 M.**
- Trước khi sửa (thiếu dime, Ka₂ sai): mô hình cho ≈ 4,7 ở 0,5 M; khi chỉ thay hằng số theo nguồn mà chưa thêm dime, mô hình cho ≈ 5,0 và **sinh kết tủa Cu(OH)₂ giả** trong CuSO₄ 0,5 M trong suốt (Q > 10·Ksp). Đây là lỗi thật của mô hình (trước đó bị che vì các hằng số sai bù trừ nhau), được test `CuSO4: pH inside the measured bracket, no false Cu(OH)2` khóa lại.
- **Không hardcode pH.** Giá trị đến từ cân bằng điện tích với CuOH⁺ và Cu₂(OH)₂²⁺ (cân bằng khối lượng giải bậc hai), HSO₄⁻/SO₄²⁻.
- Ở 0,5 M (I ≈ 2 M) không có số đo đối chiếu → **(3) xấp xỉ giáo dục**, có cảnh báo trên giao diện.

**Phạm vi tin cậy và cảnh báo:** engine tính lực ion I = ½Σcz² sau mỗi lần cập nhật. Khi I > 0,1 M, inspector hiển thị: *"pH tính theo mô hình dung dịch lý tưởng (pH = −lg[H⁺], như SGK). Lực ion … M > 0,1 M nên pH đo bằng máy thật có thể lệch vài phần mười."* Ngưỡng 0,1 M: ở I = 0,1 hệ số hoạt độ ion hóa trị 1 theo Davies ≈ 0,78 (lệch ≈ 0,1 đơn vị pH); ion hóa trị 2 lệch nhiều hơn. Lựa chọn giữ pH = −lg[H⁺] là có chủ đích để khớp định nghĩa trong SGK THPT; hiệu chỉnh Davies đã được cân nhắc nhưng không áp dụng vì sẽ làm pH axit mạnh khác với cách tính học sinh được dạy (ví dụ HCl 0,5 M: 0,30 → 0,43).

## 4. Kết quả đối chiếu định lượng (fixtures độc lập, `scripts/test-dlab.mjs`, 41/41 PASS)

| Mô hình | Kỳ vọng (lời giải đóng, tính trong test) | Kết quả | Loại |
|---|---|---|---|
| HCl 0,5 M / NaOH 0,5 M | pH 0,301 / 13,699 | khớp ±0,005 | 1 |
| H₂SO₄ 0,25 M (Ka₂ = 1,0·10⁻²) | pH = −lg(C + x), x từ phương trình bậc hai | khớp ±0,003 | 1 |
| CH₃COOH 1 M; NH₃ 0,5 M | pH 2,379; 11,475 | khớp | 1 |
| Trung hòa HCl + NaOH | pH 7,00; Q = 279,2 J | khớp | 1 |
| AgCl, BaSO₄, AgI | lượng kết tủa = chất hạn chế; [Ag⁺] = Ksp/[Cl⁻] | ±2 % | 1 |
| Cu(OH)₂, Fe(OH)₃, Fe(OH)₂, Mg(OH)₂ | = chất hạn chế; Cu(OH)₂ tan lại trong axit dư | ±0,2 % | 1 |
| CuSO₄ 0,1/0,2 M | trong khoảng đo 3,7–4,6; không kết tủa giả ở 0,5 M; I(0,5 M) = 2,0 M | khớp | 1 |
| Mg, Zn, Fe + HCl | n(M²⁺) = n(H₂) = n(kim loại phản ứng) | ±0,01 % | 1 (tỉ lượng) · 3 (tốc độ) |
| Fe, Zn + Cu²⁺; Cu + 2Ag⁺ | n(lớp bám) = n·ξ; ion mất = ion sinh | ±0,01 % | 1 · 3 (tốc độ) |
| CaCO₃ + HCl | n(Ca²⁺) = ξ | ±0,01 % | 1 · 3 (tốc độ, CO₂ thoát/hòa tan) |
| Na + H₂O (0,1 g, 100 mL) | H₂ = n(Na)/2; pH 12,64; ΔT > 0 | khớp | 1 (tỉ lượng, pH) · 3 (tốc độ, chuyển động) |
| Điện phân CuCl₂ | n(Cu) = I·t/2F | ±1 % | 1 (Faraday) · 3 (điện trở bình 4 Ω, quá thế 0,4 V) |
| Pin Daniell | 1,100 V khi nồng độ bằng nhau; Nernst theo tỉ lệ nồng độ; 0 V khi thiếu cầu muối | ±0,002 V | 1 (25 °C, hoạt độ = nồng độ) |
| KNO₃ kết tinh khi làm lạnh 60 → 25 °C | theo bảng độ tan | ±5 % | 1 |
| CO₂ vào nước vôi pha loãng | đục rồi trong lại | | 2 |
| Bảo toàn nguyên tố, thể tích khi rót nghiêng | không đổi; sai số < 10⁻⁶ mL | | 1 |

**Điều kiện áp dụng:** Nernst — 25 °C, hoạt độ = nồng độ, chỉ cặp Zn/Cu với cầu muối; Faraday — hiệu suất dòng 100 %, chỉ CuCl₂, dừng khi hết Cu²⁺ hoặc Cl⁻ (giai đoạn điện phân nước: **4**).

## 5. Chất chỉ thị

| Chỉ thị | Quy luật | Nguồn | Loại |
|---|---|---|---|
| Quỳ tím | đỏ ≤ 4,5 · tím 5,5–7,5 · xanh ≥ 8,3 | khoảng chuyển 4,5–8,3 (Harris; bảng chỉ thị chuẩn) | 2 |
| Phenolphtalein | 1/(1 + 10^(9,4 − pH)); không màu < 8,2, hồng 8,2–10 | Harris | 2 (khoảng chuyển màu) |
| Metyl da cam | pKin 3,46; đỏ < 3,1, vàng > 4,4 | Harris | 2 |
| Vạn năng | thang màu pH 1–14 | thang màu thông dụng; mỗi hãng một khác | 3 |

Khoảng chuyển màu: **(5)** — chưa đọc lại bảng Harris gốc trong phiên này.

## 6. Xấp xỉ giáo dục (3) — đã ghi trong giao diện hoặc tài liệu

1. Dung dịch lý tưởng (hoạt độ = nồng độ); cảnh báo khi I > 0,1 M.
2. Tốc độ phản ứng dị thể (k), khuếch tán màu, tốc độ lắng, chuyển động mẩu Na: minh họa, không phải số đo.
3. Kết tủa đầu tiên cần Q > 10·Ksp (vùng giả bền).
4. Nhiệt: nhiệt dung dung dịch ≈ nước; hiệu suất bếp, hệ số mất nhiệt; không bay hơi dưới 100 °C; Kw cố định 25 °C.
5. CO₂ hòa tan giới hạn bởi định luật Henry ở 1 atm; nước vôi bão hòa (0,02 M) chỉ trong lại một phần khi sục CO₂ dư.
6. Hư hỏng dụng cụ: sốc nhiệt khi |ΔT| > 60 K (thủy tinh chịu nhiệt) hoặc > 30 K (không chịu nhiệt) với dụng cụ gần khô — quy tắc minh họa, không phải cơ học vật liệu, không phải ngưỡng an toàn thực tế.
7. Khoang chứa là vật tròn xoay gần đúng; vạch chia hiệu chỉnh theo dung tích danh định.

## 7. Chưa hỗ trợ (4) — engine báo "chưa có mô hình", không sinh kết quả

Kim loại + HNO₃ (NOx); Cu + Fe³⁺; Fe + Fe³⁺; I⁻ + Fe³⁺; phức [Cu(NH₃)₄]²⁺; điện phân nước sau khi hết Cu²⁺/Cl⁻; điện phân dung dịch khác CuCl₂; Na với axit (bị Safety chặn); axit đặc; phản ứng hữu cơ tổng hợp (este hóa…); cô cạn đến khô (chỉ báo cáo "cặn").

## 8. PENDING EXPERT REVIEW (5) — việc dành cho giáo viên/chuyên gia Hóa

1. Ksp Cu(OH)₂: chọn 2,2·10⁻²⁰ (CRC mới) hay 4,7·10⁻²⁰ (IUPAC 2007).
2. log*β₁ Fe²⁺ (−9,5 so với −9,1 … −9,43).
3. Đọc lại bản gốc: ΔfH° Zn²⁺/Cu²⁺/Ca²⁺ (NBS 1982), bảng độ tan NaCl/KNO₃/NaHCO₃, Henry CO₂, khoảng chuyển màu chỉ thị (Harris), khối lượng riêng.
4. Duyệt lời văn hiện tượng trong 5 Guided Lab và các câu "Không có phản ứng".
5. Quyết định công bố quy tắc an toàn Na (≤ 0,2 g, ≥ 50 mL nước) — đây là quy ước của mô hình giáo dục, **không** phải hướng dẫn thực hành.

## 9. Nguồn

- CRC Handbook of Chemistry and Physics, 84th ed. (2004), qua LibreTexts: [E1 Ka](https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Equilibrium_Constants/E1%3A_Acid_Dissociation_Constants_at_25C), [E2 Kb](https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Equilibrium_Constants/E2._Base_Dissociation_Constants_at_25C), [E3 Ksp](https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Equilibrium_Constants/E3._Solubility_Constants_for_Compounds_at_25C), [T1 nhiệt động](https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Thermodynamics_Tables/T1%3A_Standard_Thermodynamic_Quantities).
- Thế điện cực chuẩn (Harvey; Bard, Parsons & Jordan 1985): [LibreTexts P1](https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Electrochemistry_Tables/P1%3A_Standard_Reduction_Potentials_by_Element).
- Hằng số thủy phân (Baes & Mesmer 1976; NIST46; Powell et al. 2007, Pure Appl. Chem. 79, 895; Powell et al. 2013, PAC 85, 2249; Lemire 2013; Brown & Ekberg 2016) — bảng COST Action 1802, cập nhật 2024: [Cu](https://equilibriumdata.github.io/docs/COST/Cu.pdf), [Fe](https://equilibriumdata.github.io/docs/COST/Fe.pdf), [Zn](https://equilibriumdata.github.io/docs/COST/Zn.pdf) (giá trị Zn lấy từ kết quả tìm kiếm trích bảng này, chưa mở PDF Zn).
- Ksp đối chiếu: [EngineeringToolbox](https://www.engineeringtoolbox.com/solubility-product-equilibrium-constant-ionic-solution-salt-Ksp-d_1952.html).
- pH CuSO₄ đo: [Sigma-Aldrich/Merck 102784](https://www.sigmaaldrich.com/product/MM/102784) (0,1 M, pH 4,2, 20 °C); [Sigma-Aldrich C7631](https://sigmaaldrich.com/US/en/product/sigald/c7631) (50 g/L, pH 3,7–4,5, 25 °C). Số liệu lấy qua kết quả tìm kiếm trích trang sản phẩm.
- Ka₂ trong môi trường ion: Luts et al., J. Solution Chem. 1994 ([Springer](https://link.springer.com/article/10.1007/BF00972609)).
- SGK Hóa học (Chương trình GDPT 2018) — mô tả hiện tượng định tính.
