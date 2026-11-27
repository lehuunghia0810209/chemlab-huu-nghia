# ChemLab 7.0 — Kế hoạch Experiment Library (Hóa học 10–12)

Viết cho: chủ sở hữu và phiên phát triển kế tiếp.

## 1. Chuẩn một thí nghiệm (áp dụng cho cả 5 nhóm đã có)

Mỗi thí nghiệm là **dữ liệu** trong `src/dlab/data/experiments.js`. Engine tự tính mọi kết quả; không có hoạt cảnh dựng sẵn.

| Trường | Ý nghĩa |
|---|---|
| `id`, `group`, `grade`, `difficulty`, `safetyLevel`, `keywords` | Định danh, nhóm, lớp, mức độ (`DIFFICULTY`: Cơ bản / Trung bình / Nâng cao), mức an toàn, từ khóa tìm kiếm (không dấu cũng tìm được) |
| `objective`, `equipment`, `chemicals`, `conditions` | Mục tiêu học tập; dụng cụ; hóa chất có nồng độ; điều kiện áp dụng |
| `setup` | Bình, dung dịch ban đầu, các chai cần dùng (bày bằng chính lệnh `dispatch` mà học sinh dùng) |
| `setup.tools` | Dụng cụ cần bày thêm (vd. kẹp hóa chất cho kim loại) |
| `steps` | Thao tác dạng dữ liệu `{ text, act }`: `{ pour, to, mL }` (thanh rót), `{ drops, to }` (nút "Nhỏ 3 giọt" của chai chỉ thị, 0,15 mL), `{ solid, massG, to }` (kẹp: lấy rồi thả). Học sinh, unit test và E2E cùng thực hiện đúng các thao tác này |
| `phenomena`, `equation`, `explanation` | Hiện tượng; phương trình (phải qua `dlab-sci-validate`); giải thích khoa học |
| `safety` | Cảnh báo an toàn ngoài đời |
| `processRefs` | Các mục manifest mà thí nghiệm dùng |
| Trạng thái kiểm chứng | **Không nhập tay**: `experimentValidation()` lấy mức *yếu nhất* trong các `processRefs` từ ma trận. Quá trình không có trong manifest thì là UNVERIFIED |
| `expect`, `references`, `tests` | Sự kiện engine phải sinh ra; nguồn; tên test (test kiểm tra rằng các tên này tồn tại) |
| `expectState` | Kiểm tra trên state cuối: khoảng pH (từ lời giải tay), màu chất chỉ thị, lớp kim loại bám (`coat`), khí (`gas`), không có khí / không bám (`noGas`, `noCoat`) |

Chuỗi hoàn thiện cho mỗi thí nghiệm:

**Định nghĩa → Bày dụng cụ → Thao tác (thanh rót, kẹp, ống nhỏ giọt) → Engine → Sự kiện quan sát → 2D/3D → Giải thích → E2E.**

Một thí nghiệm chỉ được thêm khi đáp ứng đủ:
- Phương trình cân bằng (`dlab-sci-validate`).
- Unit test `experiment library` chạy đúng các bước trên engine và thấy đủ `expect`, không có sự kiện UNSUPPORTED.
- Journey E2E `EXP` làm thí nghiệm qua UI (thanh rót, nút nhỏ giọt, kẹp) trên Chromium, Firefox, WebKit, kiểm `expectState` và kiểm các vật bày ra không che nhau.
- Nhãn hiển thị đúng với ma trận.

## 2. Các nhóm (theo khả năng hiện có của engine)

| # | Nhóm | Lớp | Quá trình sẵn có (trạng thái ma trận) | Trạng thái |
|---|---|---|---|---|
| 1 | **Kết tủa, hòa tan và tạo phức** | 11–12 | AgCl, BaSO₄, Cu(OH)₂, Fe(OH)₃, hòa tan trong axit (VALIDATED); phức Ag–NH₃ (VALIDATED); phức Cu–NH₃ (APPROX) | **Đã triển khai: 6 thí nghiệm** |
| 2 | **Axit – bazơ và chất chỉ thị** | 11 | pH axit/bazơ mạnh, yếu, pha loãng (`acid-base-ph`, VALIDATED, mới); chuẩn độ axit yếu (`weak-acid-titration`, VALIDATED, mới); trung hòa (VALIDATED); chất chỉ thị (APPROX) | **Đã triển khai: 6 thí nghiệm** |
| 3 | **Kim loại và dãy hoạt động hóa học** | 12 | Mg/Zn + HCl, Fe/Zn + Cu²⁺, Cu + Ag⁺ (VALIDATED: tỉ lượng; tốc độ là minh họa); Cu + HCl, Cu/Fe + Zn²⁺ không phản ứng theo E° (VALIDATED) | **Đã triển khai: 5 thí nghiệm** |
| 4 | **Điện hóa: pin và điện phân** | 12 | Pin Daniell (VALIDATED); Nernst theo nồng độ, dung dịch lí tưởng (`nernst-ideal`, APPROX, mới); điện phân CuCl₂ (APPROX: khối lượng theo Faraday, dòng và quá thế là minh họa) | **Đã triển khai: 3 thí nghiệm** |
| 5 | **Oxi hóa – khử** | 10 | Cu²⁺ + I⁻ (VALIDATED); Fe³⁺ + I⁻ (APPROX) | **Đã triển khai: 2 thí nghiệm** |
| 6 | Hòa tan, kết tinh, sôi, dung môi | 10–11 | Hòa tan/kết tinh, sôi, phân lớp nước–etanol–dầu (APPROX) | Sẵn sàng, ghi rõ giới hạn của bảng điểm sôi |
| 7 | Kết tủa cacbonat (CaCO₃, BaCO₃, ZnCO₃, Ag₂CO₃), Zn(OH)₂ | 11 | **UNVERIFIED** | Chỉ làm sau khi có test định lượng có lời giải tay |
| — | Chưa hỗ trợ (không làm cho đến khi có mô hình và nguồn) | | Kim loại + HNO₃ (NOx); Fe(OH)₂ bị oxi hóa trong không khí; Zn(OH)₂/Al(OH)₃ lưỡng tính; dịch chuyển cân bằng màu (Fe³⁺/SCN⁻); tốc độ phản ứng định lượng; phản ứng hữu cơ (este hóa…); nhiệt lượng kế chính xác | Giữ nhãn UNSUPPORTED; không dùng hoạt cảnh để giả lập |

## 2a. Phase 2 (2026-11-26): 11 thí nghiệm mới

Thư viện có **17 thí nghiệm**, không trùng nhau (6 cũ + 11 mới). Không có thí nghiệm nào trùng với 29 thẻ cũ: thí nghiệm là chuỗi thao tác nhiều bước, thẻ là một quá trình. Có thêm **2 mục manifest mới** (`acid-base-ph`, `weak-acid-titration`), nên tab Khám phá có **31 thẻ**. Hai mục này không có code engine mới: engine đã tính pH bằng cân bằng điện tích với Ka/Kb. Việc mới là khai báo chúng thành tuyên bố có lời giải tay.

| id | Nhóm | Mức độ | Trạng thái (suy ra) | Kết quả kiểm trên state |
|---|---|---|---|---|
| exp-strong-acid-dilution | Axit – bazơ | Cơ bản | VALIDATED | HCl 0,5 M pha 10 lần: pH 1,30 |
| exp-strong-vs-weak-acid | Axit – bazơ | Cơ bản | VALIDATED | HCl 0,5 M pH 0,60; CH₃COOH 0,5 M pH 2,53 |
| exp-strong-vs-weak-base | Axit – bazơ | Cơ bản | VALIDATED | NaOH 0,25 M pH 13,40; NH₃ 0,25 M pH ≈ 11,3 |
| exp-neutralisation-excess | Axit – bazơ | Trung bình | VALIDATED | Dư NaOH: pH ≈ 13,0, không dừng ở 7 |
| exp-phenolphthalein-endpoint | Axit – bazơ | Trung bình | APPROX (vì chất chỉ thị) | Dư HCl: pH ≈ 1,6, phenolphtalein không màu |
| exp-weak-acid-titration | Axit – bazơ | Nâng cao | APPROX (vì chất chỉ thị) | Điểm tương đương: pH 9,14, phenolphtalein hồng |
| exp-iron-copper-sulfate | Kim loại | Cơ bản | VALIDATED | Cu bám trên đinh sắt |
| exp-zinc-copper-sulfate | Kim loại | Cơ bản | VALIDATED | Cu bám trên kẽm |
| exp-copper-silver-nitrate | Kim loại | Trung bình | VALIDATED | Ag bám trên đồng |
| exp-metals-in-acid | Kim loại | Trung bình | VALIDATED | Mg, Zn giải phóng H₂; Cu không phản ứng |
| exp-no-displacement | Kim loại | Cơ bản | VALIDATED | Cu, Fe trong ZnSO₄: không phản ứng, không bám |

Lời giải tay (unit `acid–base: dilution and weak-acid titration match hand solutions`): pha loãng HCl; bậc hai cho CH₃COOH và NH₃; nửa tương đương h² + (Na+Ka)h − (C−Na)Ka = 0 cho pH ≈ pKa; tương đương từ thủy phân CH₃COO⁻.

Giới hạn khoa học giữ nguyên: hoạt độ = nồng độ (sai số vài phần mười đơn vị pH khi lực ion > 0,1 M); tốc độ phản ứng kim loại là minh họa, không phải động học thật; không dùng HNO₃; không có kim loại kiềm trong thư viện; quỳ và chỉ thị vạn năng chỉ định tính. Độ đậm màu chất chỉ thị trong 2D/3D phụ thuộc số giọt trên thể tích (`processes.js`), nên phenolphtalein 3 giọt trong 30 mL ở pH 9,1 chỉ hồng rất nhạt trên hình. Phần chữ ghi "chuyển hồng" đúng theo pH, nhưng mô hình độ đậm màu chưa được đối chiếu với thực tế.

Giao diện: ô tìm kiếm (không dấu vẫn tìm được), lọc mức độ, thông báo khi không có kết quả, nhóm dạng `<section>`. Nhãn kiểm chứng ghi kèm lớp và mức độ. "Bày lại" cất bộ đã bày trước đó. Vị trí bày được tính theo bề rộng thật của dụng cụ, nên chai không còn đè lên cốc.

## 2b. Phase 3 (2026-11-27): 5 thí nghiệm mới, Catalog, sửa khoa học

Thư viện có **22 thí nghiệm**, không trùng nhau (17 + 5). Tab Khám phá vẫn có 31 thẻ. Manifest có 78 mục: thêm `nernst-ideal`, không có demo nên không thành thẻ.

| id | Nhóm | Mức độ | Trạng thái (suy ra) | Kết quả kiểm trên state |
|---|---|---|---|---|
| exp-daniell-cell | Điện hóa | Trung bình | VALIDATED | Chưa có cầu muối: 0 V (mạch hở); có cầu muối: 1,100 V |
| exp-daniell-concentration | Điện hóa | Nâng cao | APPROX (vì `nernst-ideal`) | Pha loãng Cu²⁺ 10 lần: 1,100 → 1,0704 V (Nernst lí tưởng; pin thật ≈ −0,014 V) |
| exp-electrolysis-cucl2 | Điện hóa | Trung bình | APPROX | Cu bám ở catot, Cl₂ thoát ra; số mol Cu = số mol Cl₂ |
| exp-copper-iodide | Oxi hóa – khử | Nâng cao | VALIDATED | Cốc A: I⁻ hết, dư 4 mmol Cu²⁺, có iot rắn. Cốc B: Cu²⁺ hết, dư 3 mmol I⁻, I₂ tan (I₃⁻) |
| exp-iron3-iodide | Oxi hóa – khử | Trung bình | APPROX | Dư KI: Fe³⁺ hết, Fe²⁺ và I₂ tan (I₃⁻), không có iot rắn |

Act mới: `dip` (nhúng điện cực bằng điều khiển "Nhúng bằng thông số", nay cũng dùng được cho cặp điện cực, tức có thể thao tác bằng bàn phím), `power`, `bridge`, `voltmeter`. `expectState` có thêm `object` (số chỉ vôn kế, đồng bám catot), `precipitate`, `noPrecipitate`, `left`, `gone`.

Sửa khoa học. Antigravity rà soát độc lập (`reports/chemlab-7.0/phase3/agy/agy-phase3-science.md`); mọi điểm dưới đây đã được đối chiếu lại trước khi sửa:
- **Nernst:** vôn kế dùng nồng độ ion tự do (`freeConc`, đã trừ thủy phân và phức). Khi có NH₃ tạo phức thì không hiển thị số và sinh sự kiện OUT_OF_MODEL_RANGE. Khi không có ion của kim loại thì hiện "—" thay cho 0 V.
- **Cu²⁺/Fe³⁺ + I⁻ ngoài khoảng pH của mô hình:** trước đây không báo gì, nay sinh sự kiện OUT_OF_MODEL_RANGE. Fe³⁺/I⁻ chỉ được tính khi pH < 3, vì trên mức đó Fe(OH)₃ kết tủa và E(Fe(OH)₃/Fe²⁺) thấp hơn 0,54 V; trước đây giới hạn là 7.
- **Độ tan I₂ trong KI:** giới hạn I₃⁻ là K·S₀/(1 + K·S₀) ≈ 0,486 mol trên mỗi mol I⁻ (K = 710). Trước đây engine dùng 1,0, cao gấp khoảng 2 lần.
- **Nội dung:** khi I⁻ hết, I₂ vượt độ tan tách thành iot rắn và màu nâu che màu xanh của Cu²⁺. Thí nghiệm Fe³⁺ + I⁻ nay dùng dư KI. Nernst lí tưởng được ghi rõ là xấp xỉ (hoạt độ). Quá thế 0,4 V được ghi là giá trị minh họa. Bổ sung cảnh báo an toàn (kính bảo hộ, thải bỏ đúng cách) và cách gọi "phức ammin".

Màu phenolphtalein (từ giới hạn ở §2a) nay tính theo Beer–Lambert cho dạng hồng: A(1 %, 1 cm) = 725 ở pH 9,8 (thông số Merck 107233), dung dịch gốc 1 %, quang lộ vẽ 1 cm. 3 giọt trong 30 mL: pH 7 gần như không màu, pH 8,2 hồng nhạt, pH 9,1 hồng rõ. Bảng Chi tiết ghi khoảng đổi màu và chú thích "màu trên hình là biểu diễn trực quan".

Catalog (tab Khám phá): tìm kiếm không dấu; lọc theo nhóm, lớp, mức độ, mức kiểm chứng; số thí nghiệm đang hiện; "Về bàn trống" (có xác nhận, hoàn tác được một bước); "Bày dụng cụ", "Bày lại". Sandbox mở không thay đổi.

## 3. Thứ tự cho các đợt sau

1. ~~Nhóm 2 và 3~~ (xong ở Phase 2).
2. ~~Nhóm 4 và 5~~ (xong ở Phase 3). Có thể bổ sung cho nhóm 2: metyl da cam (pKin 3,46, đã có trong dữ liệu) và CO₂ từ cacbonat (APPROX). Điện hóa: pin Zn–Cu với nồng độ khác nhau chỉ nên mở rộng khi có hệ số hoạt độ.
3. **Nhóm 7:** viết test định lượng trước, sau đó mới đưa vào thư viện.
4. **UI Experiment Catalog:** thư viện vẫn nằm trong tab "Khám phá", đã có tìm kiếm và lọc mức độ. Khi có trên 3 nhóm, nên tách thành màn hình riêng có lọc theo lớp và mức kiểm chứng.

Không đặt chỉ tiêu số lượng. Thí nghiệm nào chưa qua đủ các bước ở §1 thì không đưa vào.
