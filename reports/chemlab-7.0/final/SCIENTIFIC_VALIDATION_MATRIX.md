# ChemLab 7.0 Dynamic Lab — Scientific Validation Matrix (đợt hoàn thiện, 2026-11-24)

**Phạm vi:** các mô hình được thêm hoặc sửa trong đợt này, cộng các mô hình cũ bị Antigravity phản biện lại. Mô hình đã kiểm chứng ở đợt trước (Ksp, pH theo cân bằng điện tích, Faraday, độ tan KNO₃…) xem `reports/chemlab-7.0/SCIENTIFIC_VALIDATION.md`.

**Cách đọc cột "Kiểm thử":** tên test trong `scripts/test-dlab.mjs`. Giá trị kỳ vọng được tính độc lập trong test (công thức hoặc bảng nguồn), không đọc lại từ engine.

**Cột "Đối chiếu":**
- *web* = tôi (Claude) đọc trực tiếp trang nguồn.
- *agy* = Antigravity đối chiếu độc lập (`final/agy-science.md`).
- *chưa* = chưa có đối chiếu ngoài.

## 1. Dung môi: nước, etanol, dầu

| Đại lượng | Giá trị trong mô hình | Nguồn | Đối chiếu | Kiểm thử | Giả định và giới hạn |
|---|---|---|---|---|---|
| Khối lượng riêng nước–etanol, 25 °C | 0,99708 → 0,78506 g/mL (0–100 % kl, bước 10 %) | Lange's Handbook 1967 (qua Wikipedia "Ethanol (data page)") | web + agy (khớp ICT/CRC ≤ 0,004 %) | `solvent: …` (50 % kl → 0,90985) | Bỏ qua co thể tích khi trộn (≤ 3,5 %); mực chất lỏng cộng thể tích |
| Nhiệt độ sôi và thành phần hơi, 1 atm | 100 °C (nước), 78,3 °C (etanol), 90 °C và 61 % kl hơi ở 10 % kl | CRC "Boiling points of aqueous solutions" | web; agy: vùng loãng (1–20 % kl) thấp hơn dữ liệu VLE hiện đại khoảng 2 °C | `solvent: …` (etanol sôi 77,5–79 °C, không lên 100 °C) | Dùng bảng CRC cũ; trên điểm đẳng phí 95,5 % coi hơi bằng lỏng |
| ΔvapH | nước 2257 J/g; etanol 838 J/g (38,6 kJ/mol tại Tb) | NIST WebBook | agy (837,0 J/g, sai lệch 0,1 %) | gián tiếp | Không đổi theo nhiệt độ |
| Thang pH | Chỉ áp dụng khi etanol ≤ 10 % thể tích pha phân cực | Quy ước mô hình (IUPAC: dung môi hỗn hợp cần thang riêng) | chưa | `solvent: …`, `review 3: …` | Ngoài phạm vi: không hiển thị pH, ghi rõ lý do |
| Dung môi của chất chỉ thị | Phenolphtalein, chất chỉ thị vạn năng: etanol 50 %; quỳ, metyl da cam: nước | Cách pha phổ biến ở trường học | chưa | `review 3: …` (3 giọt trong 1 mL NaOH giữ pH 13,6) | Cách pha thực tế có thể khác |
| Dầu ăn | 0,92 g/mL, không tan trong nước và etanol | Khoảng điển hình 0,91–0,93 | chưa | `solvent: …`, manifest `layers` | Dầu ăn thực tế tan một phần trong etanol nóng |

## 2. Oxi hóa – khử iotua và điện phân

| Đại lượng | Giá trị | Nguồn | Đối chiếu | Kiểm thử | Giả định và giới hạn |
|---|---|---|---|---|---|
| 2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂ | Phản ứng hoàn toàn theo chất thiếu, chỉ khi pH ≤ 7 | E° Cu²⁺/CuI 0,86 V; I₂/I⁻ 0,5355 V (CRC) | agy: log K ≈ 8 khi dùng I₂(aq) 0,621 V, vẫn ≫ 1 | `CuCl₂ + KI: …`, `review 3: …` | Hoàn toàn; bỏ qua độ tan CuI (Ksp 1,27·10⁻¹²) |
| 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂ | Như trên | E° Fe³⁺/Fe²⁺ 0,771 V | agy: log K ≈ 5,1 (không phải 7,9); ở 1 mM còn khoảng 25 % chưa phản ứng | `CuCl₂ + KI: …` | Phản ứng hoàn toàn là gần đúng; sai lệch đáng kể khi < 1 mM (ghi trong manifest) |
| Thứ tự cân bằng | Muối ít tan (Ksp) → oxi hóa – khử → Ksp lại | Lập luận nhiệt động (AgI có K lớn hơn nhiều) | agy (phát hiện P0) | `review 3: …` (Ag⁺ + Cu²⁺ + I⁻ → AgI) | — |
| Độ tan I₂ | 1,33 mM; thêm theo I₃⁻ khi còn I⁻ | CRC (0,34 g/L, 25 °C) | agy | `CuCl₂ + KI: …` | Lượng I₃⁻ tính gần đúng bằng n(I⁻), chưa giải cân bằng K ≈ 700 |
| Điện phân CuCl₂ | Bị từ chối khi có I⁻, I₂ (kể cả rắn), Ag⁺, Fe³⁺, Fe²⁺, HNO₃, NH₃ vượt 1 % lượng Cu²⁺; hoặc [Cl⁻] < 0,1 M; hoặc dung môi không phải nước | E° (CRC) | agy | `CuCl₂ + KI: …`, `review 3: …` | Giai đoạn điện phân nước không được mô hình hóa |

## 3. Pin Daniell

| Đại lượng | Giá trị | Nguồn | Đối chiếu | Kiểm thử | Giả định và giới hạn |
|---|---|---|---|---|---|
| E°(298 K) | 1,10 V | SGK; CRC cho 1,1037 V | agy | `Daniell cell: E follows E°(T)…` | Làm tròn 1,10 V lệch 3,7 mV so với CRC |
| dE°/dT | −0,109 mV/K, từ ΔS° = −20,98 J/(mol·K) | NBS 1982: S° Zn²⁺ −112,1; Cu 33,150; Zn 41,63; Cu²⁺ −99,6 | agy (khớp cả bốn giá trị) | như trên (25 °C và 60 °C) | Pin thật dốc hơn (−0,3 đến −0,5 mV/K) do thế tiếp xúc lỏng và hệ số hoạt độ; bỏ qua ΔCp |
| Hệ số Nernst | RT ln10 / 2F tại nhiệt độ trung bình hai cốc | Định nghĩa | — | như trên | Hai cốc khác nhiệt độ: dùng trung bình và ghi chú (pin nhiệt điện không mô hình hóa) |
| Dung môi | Từ chối khi etanol > 10 % | — | agy | — | — |

## 4. Sửa sau review khoa học của Antigravity (các lỗi cũ)

| Phát hiện | Kiểm chứng | Sửa | Kiểm thử |
|---|---|---|---|
| Na nổi trên lớp dầu | Tái hiện: `liquidDensity` trả về khối lượng riêng của nước | Na dừng ở mặt phân cách dầu–nước | `review 3: …` |
| Na + nước không tiêu thụ nước (sai bảo toàn H, O) | Đọc mã | Quy tắc tiêu thụ 1 mol H₂O / mol Na; ít nước thì dừng | `review 3: …` |
| Máy đo pH, quỳ, điện cực chỉ trong lớp dầu vẫn "đo được" | Đọc mã | Dùng mặt trên của pha phân cực (`polarSurfaceY`) | `review 3: …` |
| Thông báo "Ag⁺ bị khử trước" khi không có Cu²⁺/Cl⁻ | Đọc mã | Kiểm tra Cu²⁺/Cl⁻ trước, sau đó mới xét chất cản trở | `review 3: …` |
| Một giọt KI chặn vĩnh viễn 250 mL CuCl₂ | Đọc mã | Ngưỡng 1 % lượng Cu²⁺ | — |
| Ag⁺ trong kiềm chỉ báo khi pH > 12 | Tính theo Ksp: Ag₂O bắt đầu ở pH ≈ 7,6 | Báo khi [Ag⁺][OH⁻] > 10·K (cùng quy tắc tạo mầm với các kết tủa khác) | `review 3: …`; `review 2` giữ nguyên (Ag₂CO₃ không bị gọi là Ag₂O vì Q/K ≈ 2,1, nằm trong sai số Ksp) |
| CH₃COOH + đá vôi/kim loại dừng ở 1,7 % | Đọc mã (ngưỡng pH < 3) | Tiếp tục khi còn axit phân tử; tốc độ chỉ theo [H⁺] (ghi giới hạn) | thủ công: 1 g CaCO₃ trong CH₃COOH 1 M vẫn tiếp tục sinh CO₂ |
| HNO₃ + KI, HNO₃ + Fe²⁺, Ag⁺ + Fe²⁺, Ag⁺/Zn²⁺ + NH₃, CaCO₃ + H₂SO₄, Cu²⁺ + cacbonat, I₂ trong kiềm: im lặng | Đọc mã | Báo "Chưa hỗ trợ", không tạo sản phẩm | manifest (28 mục UNSUPPORTED) |

## 5. Chưa sửa (đã ghi nhận)

- Na + axit mạnh dùng ΔH của Na + nước, thiếu nhiệt trung hòa. Hệ thống an toàn chặn thả Na vào dung dịch pH < 4, nhưng không chặn khi rót axit vào sau.
- Hằng số Henry của CO₂ cố định ở 25 °C, nên đun sôi không đuổi thêm CO₂; NH₃ và HCl không bay hơi khi đun.
- Mg với nước nóng không được mô hình hóa và không có cảnh báo.
- Màu dung dịch phụ thuộc thứ tự thêm ion (P3).
- Nhiệt trung hòa giả rất nhỏ (khoảng +0,05 °C) khi Fe³⁺ thủy phân bị tiêu thụ.
- Bảng sôi CRC thấp hơn dữ liệu VLE hiện đại khoảng 2 °C ở vùng loãng.
