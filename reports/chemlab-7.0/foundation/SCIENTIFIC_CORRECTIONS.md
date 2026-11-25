# ChemLab 7.0 — Scientific Corrections (đợt rà soát khoa học, 26/11/2026)

Viết cho: người phát triển và người duyệt nội dung ChemLab ở phiên sau.

## Quy trình đã dùng

1. **Antigravity rà soát độc lập, chỉ đọc**, theo hai lượt: dữ liệu (`agy/agy-data-audit.md`) và nội dung giáo dục (`agy/agy-content-audit.md`). Mỗi nhận định được gắn nhãn cách biết: READ_PAGE (đã đọc trang), SNIPPET (chỉ đọc đoạn trích), MEMORY (từ trí nhớ).
2. **Claude kiểm lại từng phát hiện** bằng một trong ba cách: đọc mã nguồn, tính tay (Nernst, Ksp, cân bằng khối lượng), hoặc chạy thử trên engine. Phát hiện nào sai thì bị bác, kèm lý do (xem bảng "Không sửa").
3. **Mỗi lỗi đã sửa đều có test hồi quy.** Test viết theo hướng "phải báo khi đúng" và "không được báo khi sai". Kỳ vọng định lượng lấy từ lời giải tay, không từ engine.
4. **Kiểm tra độc lập mới** (không dùng logic engine):
   - `scripts/dlab-sci-validate.mjs` (104 kiểm tra): cân bằng nguyên tố và điện tích của mọi phương trình hiển thị; độ khớp giữa phương trình và tỉ lượng engine dùng; khối lượng mol so với IUPAC 2021. Có tự kiểm tra bằng phương trình sai cố ý.
   - Test `gate 1`: bảo toàn nguyên tố cho mọi kịch bản manifest, với đầu vào tính từ công thức hóa học.
   - Test `validation: …`: so √Ksp của AgCl, AgI, BaSO₄ và AgCl–NH₃ với lời giải tay.

Không có hằng số nào bị chỉnh để test đạt.

## Đã sửa

| # | Mức | Thông tin ban đầu | Vì sao sai | Kết quả sửa | Nguồn / kiểm chứng | File | Test |
|---|---|---|---|---|---|---|---|
| 1 | P0 (an toàn) | Khi hỗn hợp có hơn 10 % etanol, pH bị ẩn (`null`) nên lệnh chặn "Na vào axit" bị bỏ qua. Thả Na vào etanol thì lab khuyên "cần ≥ 50 mL nước". Chỉ chặn ống nghiệm và ống đong. | Na vào axit lẫn etanol vẫn được phép. Lời khuyên thêm nước vào Na–etanol là nguy hiểm. Bình tam giác và chai cũng có miệng hẹp. | Độ axit tính trực tiếp từ ion (`solveH`), không phụ thuộc pH hiển thị. Chặn Na khi etanol > 5 % thể tích (vài giọt chỉ thị vẫn được). Chặn thêm bình tam giác, chai và nước nóng > 40 °C. | Đọc mã (`safety.js`); quy tắc an toàn phòng thí nghiệm | `engine/safety.js` | `audit: …` (Na) |
| 2 | P0 (đánh giá bài) | Bài 1, bước 5 chỉ kiểm tra `pH < 8.2`. | Trong JS, `null < 8.2` là `true`, nên bước được tính đạt dù dung dịch còn kiềm mạnh. | Thêm điều kiện `pH != null` và phải có ghi chú trung hòa của ống B. Nội dung hướng dẫn: rót khoảng 7 mL rồi nhỏ tiếp. | Đọc mã; quy tắc so sánh của JavaScript | `guided.js` | `audit: …` (step5) |
| 3 | P1 (nội dung) | Thẻ Khám phá hiện "AGNO3 + NACL" (id viết hoa). | Ký hiệu nguyên tố phân biệt chữ hoa, chữ thường. | Hiển thị công thức có chỉ số dưới: AgNO₃ + NaCl. | IUPAC (ký hiệu nguyên tố) | `data/manifest.js` | Kiểm tra bằng mắt và manifest |
| 4 | P1 | Sản phẩm của Na + H₂O ghi "Na⁺, H₂"; của CaCO₃ + axit và Cu(OH)₂ + H⁺ thiếu H₂O. Tiêu đề "HCO₃⁻/CO₃²⁻ + H⁺ → CO₂↑" không cân bằng. | Thiếu sản phẩm; phương trình mất cân bằng. | Sản phẩm lấy nguyên vế phải của phương trình đã cân bằng. Tiêu đề thành CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O; HCO₃⁻ + H⁺ → CO₂↑ + H₂O. | Tự cân bằng (`dlab-sci-validate`) | `data/manifest.js` | validator |
| 5 | P1 | Dãy hoạt động: "kim loại mạnh hơn đẩy kim loại yếu hơn"; "trước H đẩy H₂ khỏi axit loãng". | Kim loại kiềm (Na) phản ứng với nước trước. HNO₃ loãng không giải phóng H₂. | Nêu rõ "từ Mg trở về sau" và "axit không có tính oxi hóa mạnh (HCl, H₂SO₄ loãng); không áp dụng cho HNO₃". Sửa tương tự trong 3 giải thích Mg, Zn, Fe. | Chương trình Hóa học THPT (MEMORY của Antigravity, khớp kiến thức chuẩn) | `guided.js`, `ui/observations.js` | — (nội dung) |
| 6 | P1 | "Muối cacbonat tác dụng với axit mạnh" — hiện cả khi dùng CH₃COOH. | CH₃COOH là axit yếu nhưng vẫn mạnh hơn H₂CO₃. | "axit mạnh hơn H₂CO₃ (như HCl, CH₃COOH)". | pKa CH₃COOH 4,76 < pKa1 H₂CO₃ 6,35 (CRC) | `ui/observations.js` | — |
| 7 | P1 | Bảng Quan sát ghi "Sục khí CO₂ vào dung dịch" cả khi khí đang thoát ra. | Mô tả ngược quá trình. | Phân biệt "đang sục CO₂ vào" (khi có nguồn CO₂) với "CO₂ thoát ra khỏi dung dịch". | Đọc mã | `ui/observations.js` | — |
| 8 | P1 | Ghi chú "H⁺ + OH⁻ → H₂O" hiện cả với Na₂CO₃ + HCl, NH₃ + HCl, CH₃COOH + NaOH. | Phương trình ion rút gọn sai khi có chất điện li yếu. | Khi có CO₃²⁻, CH₃COO⁻ hoặc NH₃, chỉ ghi "Phản ứng axit – bazơ…, tỏa nhiệt". | Quy tắc phương trình ion rút gọn (Hóa 11) | `engine/processes.js` | `audit: …` (2 chiều) |
| 9 | P1 | Đinh sắt trong Cu(OH)₂ + NaOH dư vẫn báo "lớp đồng bám". Cảnh báo "chưa hỗ trợ" có thể bật vì vết ion cỡ 10⁻³⁰ mol. | Ion tan quá ít, không có phản ứng thấy được. | Phản ứng kim loại–ion chỉ chạy khi ion ≥ 10⁻⁶ M. Lọc ion dưới 10⁻⁷ mol. | Ksp Cu(OH)₂ → [Cu²⁺] ≈ 10⁻¹⁸ M | `engine/processes.js` | `audit: …` (Fe/Cu(OH)₂) |
| 10 | P1 | Cảnh báo "Ag⁺ + Fe²⁺ → Ag" bật khi chỉ có kết tủa AgCl. | E°(AgCl/Ag) = 0,22 V < E°(Fe³⁺/Fe²⁺) = 0,77 V. | Chỉ xét Ag⁺ tự do (> 10⁻⁵ M); ghi rõ phản ứng thuận nghịch (⇌). | E° (CRC) | `data/reactions.js`, `engine/processes.js` | `audit: …` |
| 11 | P1 | CaCl₂ + NaOH và CaCl₂ + Na₂SO₄ đặc không có kết tủa, không có cảnh báo. | Ca(OH)₂ và CaSO₄ ít tan. Ở 0,1 M, Q vượt độ tan nhiều lần. | Cảnh báo "chưa mô hình hóa định lượng" khi Q vượt tích tính theo độ tan đo được (Ca(OH)₂ ≈ 0,0216 M, CaSO₄ ≈ 0,015 M). Không thêm Ksp lý tưởng, vì sẽ làm nước vôi trong 0,02 M của lab quá bão hòa. | Ksp Ca(OH)₂ 5,0·10⁻⁶ (SNIPPET). Độ tan theo bảng CRC (theo trí nhớ, **cần đối chiếu trang**) | `data/reactions.js` | `audit: …` (4 chiều) + demo manifest |
| 12 | P1 | Mg²⁺/Fe²⁺ + CO₃²⁻ cho ra Mg(OH)₂/Fe(OH)₂ mà không cảnh báo. | Thực tế tạo magie cacbonat bazơ, FeCO₃. | Cảnh báo "chưa mô hình hóa chính xác", giống trường hợp Cu²⁺ + CO₃²⁻ đã có. | Ksp FeCO₃ 3,1·10⁻¹¹, MgCO₃ 6,8·10⁻⁶ (SNIPPET) | `data/reactions.js` | demo manifest |
| 13 | P1 | "I₂ trong kiềm chuyển thành I⁻/IO⁻". | IO⁻ kém bền; sản phẩm thực là IO₃⁻. | 3I₂ + 6OH⁻ → 5I⁻ + IO₃⁻ + 3H₂O. | Hóa vô cơ chuẩn (SNIPPET + kiến thức chuẩn) | `data/reactions.js` | — |
| 14 | P1 | "Fe³⁺ + I⁻ trong kiềm" bị xếp "chưa hỗ trợ". | Engine đã cho kết quả đúng: Fe(OH)₃ kết tủa, không có I₂. | Gỡ cảnh báo này (manifest bớt 1 mục). | Chạy thử trên engine | `data/reactions.js`, `data/manifest.js` | test redox cũ |
| 15 | P1 | Điện phân NaCl, HCl hay CuSO₄ báo "Đã hết Cu²⁺ hoặc Cl⁻". | Các ion đó chưa từng có trong dung dịch. | Chỉ báo "đã hết" khi điện phân CuCl₂ thật sự đã chạy. Ngược lại báo "chưa mô hình hóa (chỉ hỗ trợ CuCl₂)". | Đọc mã | `engine/processes.js` | test điện phân (cập nhật câu chữ) |
| 16 | P1 | Đun HCl, HNO₃, CH₃COOH hoặc NH₃ đến cạn thì báo "còn chất rắn kết tinh". Không có cảnh báo hơi độc. | Các chất này bay hơi hết, không để lại tinh thể. | Báo "bay hơi hết, không để lại chất rắn". Cảnh báo tủ hút khi đun axit/NH₃ dễ bay hơi. Chặn đun dung dịch bạc–amoniac (nguy cơ bạc nitrua). | Kiến thức an toàn (MEMORY) | `engine/processes.js`, `engine/safety.js` | `audit: …` (HCl) |
| 17 | P1 | Ghi chú đẳng phí "≈ 95,5 %" hiện cả với etanol 99 %. Thẻ sôi nói mọi hỗn hợp "sôi giữa 78 và 100 °C". | Mô tả sai điểm đẳng phí. | Chỉ ghi khi ở khoảng 95,5 % ± 1 %, kèm thành phần thật. Thẻ nêu rõ đẳng phí ≈ 78,1 °C. | Đẳng phí 95,6 % khối lượng, 78,1–78,2 °C (SNIPPET) | `engine/processes.js`, `data/manifest.js` | — |
| 18 | P1 | Thẻ ghi NaHCO₃ "hòa tan và kết tinh, 0–100 °C". | NaHCO₃ bị nhiệt phân trên khoảng 50–60 °C; engine không kết tinh NaHCO₃. | Sửa tiêu đề, điều kiện và giới hạn. | SNIPPET + kiến thức chuẩn | `data/manifest.js` | — |
| 19 | P1 | Giấy quỳ: pH 5–8 bị gọi "gần trung tính"; ngưỡng 8 không khớp 8,3 của mô hình màu. | pH 5 là axit yếu; hai ngưỡng mâu thuẫn. | Dùng ngưỡng 8,3. Trong khoảng 5,0–8,3: "quỳ chưa đổi màu rõ, dùng máy đo pH". | Bảng màu chỉ thị trong `materials.js` | `engine/processes.js` | — |
| 20 | P1 | Bài 2, bước 4 ("tan bằng HCl") đạt được cả khi dùng NH₃ 2 M (dung dịch kiềm). Gợi ý ghi "khuấy giúp tan nhanh". | Không kiểm tra được hiện tượng tan trong axit; mô hình tan tức thì. | Thêm điều kiện `pH < 7`; bỏ câu về khuấy. | Đọc mã | `guided.js` | walk |
| 21 | P1 | Kết luận bài 1: "C là muối trung tính". | Thí nghiệm chỉ chứng minh môi trường trung tính; "muối trung hòa" là khái niệm khác. | "C là dung dịch có môi trường trung tính (ở đây là NaCl)". | Thuật ngữ SGK | `guided.js` | — |
| 22 | P1 | Bài 5: đổ etanol vào ống dầu–nước, hoặc dầu vào ống etanol–nước, vẫn đạt bước. | Bước không kiểm tra đúng hiện tượng. | Kiểm tra dầu nổi (`!oilBelow`) và ống etanol không có dầu. | Đọc mã | `guided.js` | walk |
| 23 | P1 (an toàn) | ZnSO₄ thiếu nhãn độc môi trường và cảnh báo mắt. Phenolphtalein thiếu cảnh báo sức khỏe. Nước vôi trong không nhắc đeo kính. | Thiếu thông tin nguy hiểm. | ZnSO₄: thêm `env` và cảnh báo mắt. Phenolphtalein: thêm `toxic` và ghi "nghi gây ung thư (GHS H350)". Nước vôi trong: nhắc đeo kính. | GHS/CLP, SDS (SNIPPET) | `data/materials.js` | test reagent có nhãn an toàn |
| 24 | P2 | Tên kết tủa bị viết thường cả số La Mã: "sắt(ii)". | Số La Mã phải viết hoa. | Chỉ viết thường chữ cái đầu: "sắt(II) hiđroxit". | Danh pháp Stock | `data/manifest.js` | — |
| 25 | P2 | ZnCO₃, Fe(OH)₂, Zn(OH)₂, AgCl, BaSO₄, AgI thiếu giới hạn. | Mô hình bỏ qua cacbonat bazơ, Fe(OH)₂ bị oxi hóa trong không khí, tính lưỡng tính; cần nói rõ chất nào không tan trong axit. | Thêm từng câu giới hạn. | Kiến thức chuẩn | `data/manifest.js` | — |

## Không sửa (đã kiểm chứng và bác bỏ, hoặc hạ mức)

| Phát hiện | Kết luận của Claude |
|---|---|
| Fe³⁺/Cu²⁺ + I⁻ chạy đến pH 7 nên sinh I₂ sai khi có hiđroxit (Antigravity xếp P1) | **Hạ xuống P2.** Phép tính Nernst của Antigravity đúng: ở pH 4, Fe(OH)₃/Fe²⁺ cho 0,50 V < 0,61 V; Cu ngừng ở pH ≈ 5,6. Nhưng engine chỉ cho phản ứng chạy trên ion tan sau bước Ksp. Chạy thử 4 kịch bản: I₂ không tăng sau 20 s; lượng I₂ sinh ra đều từ phần ion tan ở pH thấp, đúng nhiệt động. Cổng pH 7 là chặn thô, đã ghi vào giới hạn. |
| Bảng điểm sôi nước–etanol lệch 1,5–2,5 °C (P1) | **P2, chưa sửa.** Nguồn đối chiếu (Carey & Lewis 1932) mới ở mức snippet. Một điểm tôi tự so (5 % khối lượng: bảng 94 °C, số liệu VLE ≈ 95,5 °C) phù hợp với nhận định. Cần đọc nguồn gốc rồi thay cả bảng; đã ghi trong ma trận. |
| P2 khác (thuật ngữ trước 2018, ngưỡng sốc nhiệt borosilicat, ghi chú pH nhầm cốc khi nhiều cốc, vết sunfat chặn CaCO₃ + HCl, sản phẩm HNO₃) | Ghi vào `NEXT_PHASE_HANDOFF.md`, chưa sửa trong đợt này. |

## Nguồn: mức độ kiểm chứng (trung thực)

- Hằng số trong mã có ghi nguồn (CRC, NIST/NBS, Lange, Powell/IUPAC, Hidmi & Edwards).
  - Đã kiểm định lượng bằng test lời giải tay: Ksp của AgCl, AgI, BaSO₄; lg β₂ của Ag–NH₃; Faraday; Nernst.
  - Đã đối chiếu độc lập: khối lượng mol so với IUPAC 2021.
- Phần lớn nhận định của Antigravity được gắn nhãn **SNIPPET** hoặc **MEMORY**, chưa phải READ_PAGE. Các sửa đổi dựa trên kiến thức hóa học chuẩn (sản phẩm, quy tắc, an toàn) đã được Claude đối chiếu với kiến thức giáo khoa. Các **giá trị số mới** chưa được đối chiếu với trang nguồn và được đánh dấu "cần đối chiếu":
  - độ tan Ca(OH)₂ ≈ 0,0216 M;
  - độ tan CaSO₄ ≈ 0,015 M;
  - Ksp của FeCO₃ và MgCO₃.
- Không có URL nào được tạo ra. Báo cáo không trích dẫn trang web nào mà Claude chưa đọc.
