# ChemLab 7.0 — Complete Lab Rebuild Report (bản 4)

Cập nhật 25/11/2026. Báo cáo này viết cho chủ sở hữu để nghiệm thu. **§R4 là phần mới của bản 4**; §0 là bản 3, từ §1 trở đi là bản 2 — giữ lại làm lịch sử.

| Mục | Giá trị |
|---|---|
| Repo | `D:\EduLab\ChemLab` |
| Nhánh | `feature/chemlab-7.0-dynamic-laboratory` |
| Bản 1 | `a14ab46` → `ea7ee23` (đã commit cục bộ) |
| Bản 2 | Tiếp từ `ea7ee23`; commit cục bộ `51ea6f7` |
| Bản 3 | Tiếp từ `51ea6f7`; commit cục bộ `faaa52f` |
| Bản 4 | Tiếp từ `faaa52f`; commit cục bộ, xem §19 |
| Nghiệm thu trên máy | `http://[::1]:5180/#dlab` (Vite dev của phiên này) |

**Phạm vi:**
- Chỉ sửa Dynamic Lab.
- Không động tới ChemAI, Groq, Cloudflare, Production 6.7.0 hay các Lab khác.
- Không push, không merge, không deploy, không đổi version.

**Trạng thái bản 4: PARTIAL.** Xem bảng nghiệm thu §R4.9. Hai lý do chính:
1. **FPS Firefox/WebKit dưới ngưỡng trên máy hiện tại.** Không thấy suy giảm so với bản 3 khi đo cùng điều kiện (§R4.7), nhưng chưa được xác minh đạt.
2. **3D đã nâng cấp nhưng chưa ở mức sản phẩm hoàn chỉnh.**

Phức amin (lý do PARTIAL của bản 3) **đã được mô hình hóa** (§R4.2).

## R4. Bản 4 — phức đồng–amoniac, 3D, hiệu năng engine (25/11/2026)

Tiếp từ `faaa52f`. Phần này viết cho chủ sở hữu để nghiệm thu; chi tiết kỹ thuật nằm trong mã và test.

### R4.1 Kết quả nhanh

| Kịch bản chính | Kết quả | Bằng chứng |
|---|---|---|
| CuSO₄ + NH₃ 2 M nhỏ dần: Cu(OH)₂ xanh nhạt → tan → dung dịch xanh thẫm | PASS: engine (unit), thẻ Khám phá qua giao diện (X06) trên cả 3 trình duyệt, ảnh từ app | `round4/shots/r4-ammine-1…4`, video `r4-ammine-sequence-3d.webm` |
| AgCl tan trong NH₃, AgI không tan | PASS (unit + X06 + ảnh) | `round4/shots/r4-agcl-dissolves-agi-stays-3d.png` |
| S07 màu chỉ thị lan (sửa đồng bộ test, xem R4.6) | PASS trên 3 trình duyệt (riêng 9/9, trong bộ đầy đủ 3/3) | `round4/s07-fix/`, `round4/final/` |
| P01/P01b FPS cảnh bận | Chromium PASS 60/60 fps; **Firefox FAIL 26,4 / 23,7 fps; WebKit FAIL 12,8 / 13,2 fps** (ngưỡng 30 giữ nguyên) | `round4/final/e2e-*.log`, `round4/perf-ab/` |
| 29 thẻ Khám phá qua giao diện thật (gồm 3 thẻ phức mới) | PASS 29/29 trên Chromium, Firefox, WebKit | `round4/final/e2e-*` |
| 5 Guided Lab qua giao diện | PASS 5/5 bài, 0 lỗi console, 0 yêu cầu ChemAI | `round4/final/walk/` |
| Unit test engine | PASS 116/116 | `node scripts/test-dlab.mjs` |
| E2E Chromium / Firefox / WebKit | Chromium **96/96 PASS** (60 fps). Firefox **90/92**, WebKit **90/92**: chỉ P01/P01b FAIL (FPS, xem R4.7); S07 PASS | `round4/final/e2e-*.log` |
| `npm run check`, `npm run check:browser` | PASS (exit 0) / PASS 448/448 | `round4/final/check-browser.log` |
| Lỗi console, yêu cầu ChemAI | 0 / 0 | log trên |

### R4.2 Phức đồng–amoniac: đã mô hình hóa, không còn "Chưa hỗ trợ"

**Trước:** CuSO₄ + NH₃ dư vẫn hiện kết tủa Cu(OH)₂, kèm dòng "Chưa hỗ trợ".

**Sau:** engine tính phức thật.
- Phức từng nấc M(NH₃)ᵢ cho Cu²⁺ (i = 1–4), Zn²⁺ (1–4), Ag⁺ (1–2), giải **cùng lúc** với pH (cân bằng điện tích), cân bằng khối lượng NH₃ và Ksp. NH₃ đã liên kết trong phức không bị proton hóa; phức giữ nguyên điện tích của ion kim loại.
- Vì [Cu²⁺] tự do giảm, Cu(OH)₂ tự tan theo Ksp — không có quy tắc "nếu NH₃ dư thì xóa kết tủa". Đồng được bảo toàn (có test).
- Màu dung dịch tính từ **lượng phức** trong engine (Beer–Lambert, phức hấp thụ mạnh hơn Cu²⁺(aq) ≈ 19 lần theo ε và vùng nhạy của mắt), không theo số lần bấm. 2D và 3D dùng cùng màu đó.
- Hạt kết tủa biến mất theo đúng lượng kết tủa còn lại của từng chất (trước đây chỉ tính tổng, hạt Cu(OH)₂ có thể còn sót cạnh AgCl).
- Bảng quan sát: "Kết tủa Cu(OH)₂ tan trong NH₃ dư, tạo phức [Cu(NH₃)₄]²⁺ màu xanh thẫm." Nhãn cốc: `[Cu(NH₃)₄]SO₄`, `[Ag(NH₃)₂]Cl`; phần anion dư khi có NH₃ được gọi là `(NH₄)₂SO₄` thay vì `H₂SO₄` (lỗi cũ).

**Dữ liệu và quyết định (Antigravity nghiên cứu, Claude kiểm chứng lại bằng engine):**

| Mục | Giá trị dùng | Ghi chú |
|---|---|---|
| lg β Cu–NH₃ (1→4) | 4,31; 7,98; 11,02; 13,32 | Lange (số liệu Bjerrum, môi trường muối amoni). NIST SRD 46 ở I = 0 cho lg β₄ = 11,75 — các nguồn lệch tới ≈ 1,5 đơn vị log |
| lg β Zn–NH₃ (1→4) | 2,37; 4,81; 7,31; 9,46 | Lange; NIST I = 0: 8,89–9,0 |
| lg β Ag–NH₃ (1→2) | 3,24; 7,05 | Lange; NIST I = 0: 3,31; 7,22 |
| Ksp Cu(OH)₂ | 2,2·10⁻²⁰ (giữ nguyên, CRC) | Đã thử Ksp "kết tủa mới" 2,3·10⁻¹⁹ (Hidmi & Edwards 1999): bài Guided "kết tủa" sẽ cần 12,6 mL NaOH thay vì 3 mL, trái quan sát thực tế. **Không đổi.** |
| Dung dịch NH₃ 2 M (mới trong tủ hóa chất) | 2 M | Antigravity chỉ ra và engine xác nhận: **NH₃ 0,5 M không đệm không thể hòa tan hết Cu(OH)₂** với bất kỳ hằng số hợp lý nào (phần kết tủa cuối cùng tiêu hết NH₄⁺, pH vọt lên). Thí nghiệm ở trường dùng NH₃ 2–6 M. |

Kết quả mô hình (5 mL CuSO₄ 0,5 M):

| NH₃ thêm vào | Kết quả |
|---|---|
| 2 mL NH₃ 2 M | Kết tủa Cu(OH)₂ xanh nhạt |
| 10 mL NH₃ 2 M | ≈ 96 % đã thành phức |
| 30 mL NH₃ 2 M | 100 % thành phức, không còn kết tủa, xanh thẫm |
| 50 mL NH₃ 0,5 M | ≈ 81 % thành phức, còn kết tủa — ghi rõ trong manifest là giới hạn thật của NH₃ loãng |
| AgCl (1 mmol) + 10 mL NH₃ 2 M | AgCl tan |
| AgI + 30 mL NH₃ 2 M | AgI gần như không đổi (Ksp·β₂ ≈ 10⁻⁹) |
| ZnSO₄ 5 mL + 30 mL NH₃ 2 M | ≈ 94 % tan; còn ≈ 6 % — ghi `APPROX` (Zn(OH)₂ mới kết tủa thực tế tan hơn) |

Không ảnh hưởng hệ cũ: pH của 4000 hỗn hợp ngẫu nhiên không có kim loại tạo phức trùng với bản `faaa52f` tới 5·10⁻¹³; toàn bộ unit test cũ (AgCl, AgI, Ag₂CO₃, CuCl₂ + KI, điện phân, Guided "kết tủa" 3 mL) vẫn đạt.

**Hiệu năng engine:** lần đầu, mỗi lần trộn có NH₃ + Cu tốn 45 ms (rót bằng cách nghiêng gọi trộn 60 lần/giây → sẽ đứng hình). Thay bisection bằng Illinois có chặn (không bao giờ chậm hơn bisection) và khởi động ấm quanh nghiệm trước: còn 2,8 ms/bước khi rót NH₃ 2 M vào CuSO₄ (0,4 ms với NaOH). Các trường hợp không có NH₃ nhanh hơn trước.

### R4.3 3D

| Trước (`round3/after-final`) | Sau (`round4/after`, `round4/shots`) |
|---|---|
| Kết tủa là các khối đa diện lớn, trông như đá viên | Kết tủa dạng bông keo mềm (Points, một draw call), mỗi hạt mô phỏng vẽ thành một cụm; lơ lửng rồi lắng theo engine |
| Bọt khí là quả cầu trắng đục | Bọt trong ở giữa, sáng ở viền (Fresnel theo góc nhìn) |
| Dung dịch thẫm màu có vệt hồng tím (phản xạ đèn ấm trên mặt trong khối lỏng) | Khối lỏng nhám, mặt thoáng phản xạ dịu; độ bóng do lớp thủy tinh đảm nhận |
| Vòng chọn dày, lấn át cốc | Vòng mảnh |
| Màu phức không có | Màu xanh thẫm theo lượng phức |

Không có hiệu ứng nào chạy độc lập với engine: hạt, bọt, màu và mức chất lỏng đều đọc từ trạng thái mô phỏng.

### R4.4 Review độc lập của Antigravity

Antigravity làm hai việc, cả hai **chỉ đọc**: không chạy lệnh, không thao tác trình duyệt. Lượt review được cấp quyền đọc file trong repo bằng `--settings` riêng cho phiên (`round4/agy/agy-settings-readonly.json`); ghi file và mọi lệnh shell đều bị chặn.

1. **Nghiên cứu hằng số** (`round4/agy/agy-ammine.md`): bảng β theo nguồn và lực ion, phép tính kiểm tra, ε/λmax cho màu. Phát hiện quan trọng nhất: NH₃ 0,5 M không đệm không thể hòa tan hết Cu(OH)₂. Engine tái hiện đúng kết luận này, nên lab có thêm NH₃ 2 M.
2. **Review mã và ảnh** (`round4/agy/agy-review.md`). Tôi kiểm lại từng mục:

| Phát hiện (mức Antigravity đánh giá) | Kiểm chứng | Xử lý |
|---|---|---|
| ZnSO₄ + NH₃ 2 M bật nhầm cảnh báo Zn(OH)₂ lưỡng tính (P1) | Đúng: pH của NH₃ 2 M ≈ 11,8 > ngưỡng 11,5 | Ngưỡng thành pH 12 (NaOH dư vẫn bị báo); có test |
| Điện phân CuCl₂ + NH₃ vừa quá tỉ lệ 2:1 lọt qua chốt chặn (P1) | Đúng: phần đồng tan gần như toàn là phức, nhưng tỉ lệ tính trên tổng đồng | So với đồng **đang tan**; có test, không có Cu bám |
| Nhãn "2 M 2 M" trên chai (P1) | Đúng | Tên hóa chất không kèm nồng độ |
| "HCl + vết NH₃" bị gọi là "NH₄Cl + NH₃"; "+ NH₃" giả ở pH 4 (P1) | Đúng | Axit chỉ đổi thành muối amoni khi NH₄⁺ đủ cân bằng; "NH₃" chỉ hiện khi NH₃ tự do đáng kể; có test |
| Ghi chú "tan trong NH₃ dư" khi axit mới là thứ hòa tan kết tủa (P1) | Đúng (tôi cũng tự phát hiện trước) | Chỉ ghi khi lượng phức tăng; có test |
| Thứ tự vẽ trong suốt: hạt kết tủa ngang hàng thủy tinh, nhảy trước/sau (P1) | Đúng theo mã | Hạt và bọt vẽ sau chất lỏng, trước thủy tinh |
| Hạt kết tủa như "chấm bi phát sáng", lòi ra ngoài thành cốc (P1) | Đúng một phần (ảnh) | Nhỏ hơn, mờ hơn, tối nhẹ; kẹp trong thành và dưới mặt thoáng |
| Hiệu năng giải lồng ba tầng (P2) | Đúng: đo được 45 ms/lần trộn | Illinois + khởi động ấm: 2,8 ms/bước khi rót |
| Khoảng nghiệm đảo ngược khi NH₃ cực loãng (P2) | Đúng theo mã | Chặn dưới theo nồng độ |
| Phức trong dung môi nhiều etanol (P2) | Đúng | Không ghi chú phức khi thang pH không áp dụng |
| Upload GPU mỗi khung khi không có hạt; biên dịch lại shader ở bọt đầu tiên (P2) | Đúng | Chỉ upload khi có thay đổi; cấp phát màu bọt từ đầu |
| Manifest: chưa nói rõ dùng β₄ cao nhất, thiếu lượng tham chiếu, demo rót một lần không thấy kết tủa, thiếu cảnh báo bạc nitrua (P2) | Đúng | Sửa nội dung; demo nhỏ 3 mL trước rồi rót tiếp, kỳ vọng ghi chú "kết tủa tan" |
| `[Ag(NH₃)₂]₂SO₄` bị bọc ngoặc thừa (P2) | Đúng | Sửa |
| Pin Daniell và Cu²⁺ + I⁻ chưa tính phức amin (P2) | Đúng | **Chưa sửa**, ghi ở giới hạn (cần NH₃ cùng lúc với pin/iotua; không có bài nào dùng) |
| Thủy tinh, màu phức có thể thẫm hơn (góp ý hình ảnh) | Ý kiến | Màu phức đã thẫm hơn; thủy tinh giữ nguyên |


### R4.6 S07 (màu chỉ thị lan từ vị trí tiếp xúc) — nguyên nhân đã xác minh

Triệu chứng: trong lượt hồi quy đầy đủ, S07 hỏng trên WebKit; pixel ở chỗ giọt rơi không có chút hồng nào (`228,238,250`, đúng màu NaOH nền).

Điều tra (bằng chứng ở `round4/s07-ab/`, `round4/s07-fix/`, `scripts/dlab-s07-latency.mjs`):

| Câu hỏi | Kết quả đo |
|---|---|
| Chạy riêng, HEAD `faaa52f` và round 4, WebKit | 6/6 đạt (3 + 3), CPU 40–62 % → không do mã round 4 |
| Engine có hồng ngay khi giọt chạm mặt không? | Có: độ hồng 124 ở ô tiếp xúc, phía xa −16, ngay bước đầu (node, `cellColor`) |
| Canvas có hồng ngay không? | Có: khung đầu tiên đã hồng hơn phía xa ≈ 25 đơn vị, tăng dần khi màu lan xuống ô dưới. Giá trị trên canvas thấp hơn engine vì màu dung dịch vẽ trong suốt lên nền và ảnh lưới được làm mịn. **Không có độ trễ hiển thị.** |
| Chế độ đồ họa khi test chạy | Firefox hôm nay chạy khoảng 23 fps ngay cả với bàn trống → sau khoảng 3 s lab **tự chuyển sang "Đồ họa: Tiết kiệm"** (cơ chế bản 3, có báo cho học sinh). Ở Tiết kiệm, dung dịch được tô một màu trung bình nên không còn "hồng gần, nhạt xa" để đo |

**Nguyên nhân:** S07 kiểm tra một tính năng của chế độ Cao (màu lan dần) mà không chọn chế độ đó. Khi máy chậm hơn 25 fps, cơ chế tự chuyển chế độ đã đổi sang Tiết kiệm trước khi test đọc pixel. Hành vi sản phẩm là đúng như thiết kế.

**Sửa:**
- S07 chọn "Đồ họa: Cao" qua menu như học sinh vẫn làm (giống P01; lựa chọn của học sinh không bao giờ bị ghi đè) và kiểm tra lại chế độ lúc đọc pixel.
- S07 chờ theo **thời gian mô phỏng** (0,1 s sau giọt thứ 3 — đúng 400 ms ở 0,25× như thiết kế ban đầu) rồi chờ 2 khung hình, thay cho chờ cố định 400 ms thời gian thực. Lý do: `sim.advance` giới hạn mỗi khung 0,25 s, nên khi trình duyệt khựng, 400 ms thực có thể ứng với ít thời gian mô phỏng hơn nhiều. Timeout hữu hạn (10 s, 60 s).
- Tiêu chí "hồng gần hơn xa ≥ 25" giữ nguyên, không nới.
- Renderer 2D: cốc vừa có chất thêm vào được tải lại lưới màu ngay, không chờ đến lượt trong hàng đợi luân phiên (bản 3). Không phải nguyên nhân của S07, nhưng là độ trễ thật có thể thấy ở FPS thấp khi có nhiều cốc.

Sau khi sửa, chạy riêng: 9/9 đạt (3 lượt × Chromium, Firefox, WebKit).

### R4.7 Hiệu năng — so sánh A/B trong cùng điều kiện

Chi tiết: `round4/perf-ab/FINDINGS.md`.

- Bản round 3 `faaa52f` (từng đạt 41/39 fps trên Firefox và 33/37 fps trên WebKit) đo lại hôm nay chỉ còn 21–24 và 14–16 fps. Round 4 nằm trong khoảng ±3 % so với bản đó.
- Profile CPU (Chromium, cùng cảnh, 240 khung): HEAD và round 4 tương đương ở mọi thành phần.
  - Vẽ 2D: 0,3–0,4 s.
  - Engine: 0,13–0,17 s.
  - Solver Ksp/pH: không lọt top.
  - Render loop và nhãn: 0,13–0,18 s.
  - Phần lớn thời gian là raster/compositing gốc của trình duyệt: khoảng 2 s.
- Trong lúc đo, Chrome và VS Code của chủ sở hữu dùng khoảng 38 % và 34 % một nhân. Tôi không tắt.
- **Kết luận có giới hạn:** chưa thấy suy giảm hiệu năng do round 4. FPS trên Firefox và WebKit **vẫn dưới ngưỡng** trên máy hiện tại, và chưa chứng minh được tải máy là nguyên nhân duy nhất. Trạng thái: **PERFORMANCE NOT VERIFIED / FAIL UNDER CURRENT ENVIRONMENT.** Ngưỡng 30 fps giữ nguyên.

### R4.8 Lượt hồi quy cuối (một bản build, tuần tự, có giới hạn thời gian, 25/11 22:13–22:54)

Môi trường (`round4/final/env.log`): i5-12450HX, 12 luồng, 16 GB, Windows 11; Chromium 156 (headless, WebGL qua SwiftShader — phần mềm), Firefox 157, WebKit 27.2 (chuỗi renderer bị che: "GTX 980 or similar", "Apple GPU" — không xác nhận được GPU thật). Tải CPU trước mỗi bước: 18–47 % (`round4/final/steps.log`).

| Bước | Kết quả | Ghi chú |
|---|---|---|
| `npx vite build` | PASS | |
| `node scripts/test-dlab.mjs` | PASS 116/116 | |
| `npm run check` | PASS | |
| E2E Chromium | PASS 96/96 | P01 Cao/Tiết kiệm 60,0 / 60,0 fps, p95 16,7 / 16,8 ms (đồ họa chọn qua menu) |
| E2E Firefox | **90/92** | P01 **FAIL 26,4 fps** (p95 48,6 ms), P01b **FAIL 23,7 fps** (p95 50,0 ms); CPU 47 % lúc bắt đầu |
| E2E WebKit | **90/92** | P01 **FAIL 12,8 fps** (p95 92 ms), P01b **FAIL 13,2 fps** (p95 195 ms); CPU 30 % lúc bắt đầu |
| S07 (trong bộ trên) | PASS ×3 | |
| X06 29 thẻ Khám phá | PASS ×3 | gồm 3 thẻ phức chất |
| Guided walk (5 bài, qua UI) | PASS 5/5 | 0 lỗi console, 0 yêu cầu ChemAI |
| `npm run check:browser` | PASS 448/448 | |

### R4.9 Bảng nghiệm thu bản 4

| # | Hạng mục | Trạng thái |
|---|---|---|
| 1 | Phức đồng–amoniac (và Ag, Zn) mô hình hóa, đồng bộ 2D/3D, màu theo engine | PASS |
| 2 | Không ảnh hưởng hệ đã đúng (AgCl, AgI, Guided "kết tủa", pH) | PASS |
| 3 | 3D nâng cấp (kết tủa, bọt, chất lỏng, vòng chọn, thứ tự vẽ) | PASS về những gì đã làm; **chưa phải mức sản phẩm hoàn chỉnh** (procedural, không bóng đổ thật) |
| 4 | Sandbox 29 thẻ, Guided 5/5, Save/Load/Undo/Reset, 2D/3D | PASS (X06, walk, S18–S20, X02/X04, G10) |
| 5 | S07 | PASS sau khi xác minh nguyên nhân và sửa đồng bộ test (R4.6) |
| 6 | Hiệu năng Firefox/WebKit | **FAIL UNDER CURRENT ENVIRONMENT / PERFORMANCE NOT VERIFIED**: không thấy suy giảm so với `faaa52f` khi đo cùng điều kiện, nhưng FPS dưới ngưỡng |
| 7 | Review độc lập (Antigravity) | PASS: 13 mục đã sửa, 1 mục ghi vào giới hạn (Daniell, Cu²⁺ + I⁻ với phức), 1 góp ý hình ảnh làm một phần |
| 8 | Bằng chứng từ app thật | PASS (`round4/after`, `round4/shots`, video `.webm`) |

**Trạng thái bản 4: PARTIAL.** Chưa đủ điều kiện READY FOR OWNER ACCEPTANCE vì mục 6 (FPS Firefox/WebKit chưa đạt trên máy hiện tại) và mục 3 (3D chưa hoàn chỉnh).

### R4.10 Bằng chứng

| Nội dung | Đường dẫn |
|---|---|
| Ảnh 3D trước (bản 3) / sau (bản 4), cùng script cùng cảnh | `final/round3/after-final/` → `final/round4/after/` |
| Chuỗi phức đồng–amoniac (3D, 4 ảnh) + 2D có bảng Quan sát | `final/round4/shots/r4-ammine-1…5` |
| Video chuỗi phức (Playwright, 3D) | `final/round4/shots/r4-ammine-sequence-3d.webm` |
| AgCl tan / AgI không tan | `final/round4/shots/r4-agcl-dissolves-agi-stays-3d.png` |
| Cận cảnh: khí đang thoát, kết tủa lơ lửng / đã lắng, lớp kim loại bám | `final/round4/shots/r4-closeup-*` |
| Sandbox, tab Khám phá có nhóm Phức chất | `final/round4/shots/r4-sandbox-discover.png` |
| Antigravity: nghiên cứu hằng số, review | `final/round4/agy/` |
| A/B hiệu năng, profile | `final/round4/perf-ab/` |
| S07: A/B và sau sửa | `final/round4/s07-ab/`, `final/round4/s07-fix/` |
| Hồi quy cuối | `final/round4/final/` (ảnh, JSON FPS); các dòng kết quả trích nguyên văn từ log ở `final/round4/RESULTS.txt` (`*.log` bị `.gitignore` loại, log đầy đủ còn trên máy) |

### R4.11 Giới hạn còn lại sau bản 4

- 3D vẫn là hình procedural (không .glb), không có bóng đổ thật hay khúc xạ; giá đỡ dụng cụ cầm tay vẫn là giải pháp trung gian.
- Phức amin: mô hình lý tưởng (hoạt độ = nồng độ); không có muối sunfat bazơ, [Cu(NH₃)₅]²⁺, phức hỗn hợp hiđroxo–amin; Ag₂O khi mới nhỏ ít NH₃ vẫn chỉ báo "Chưa hỗ trợ".
- Khi chưa khuấy, NH₃ (nhẹ hơn nước) nằm ở nửa trên; ranh giới hai lớp trong 3D có thể ánh tím. Khuấy thì đều màu.
- Rót NH₃ vào dung dịch đồng ở tốc độ 4× tốn ≈ 11 ms/khung cho engine; chưa đo FPS riêng cho kịch bản này trên WebKit.
- Pin Daniell và phản ứng Cu²⁺ + I⁻ chưa tính đến phức amin nếu học sinh thêm NH₃ vào đó.
- Hạt kết tủa 3D không bị lớp chất lỏng phía trước phủ màu (cần tách khối lỏng thành hai mặt).
- Chưa kiểm thử trên GPU thật hay điện thoại thật.


## 0. Bản 3 — đợt hoàn thiện sau checkpoint `51ea6f7` (25/11/2026)

Bản 2 đã được commit cục bộ thành `51ea6f7` (67 file; danh sách ở §19). Bản 3 tiếp tục từ đó, tập trung vào 5 phần chủ sở hữu yêu cầu: 3D, Sandbox, kiểm chứng khoa học, hiệu năng, và kiểm thử độc lập.

### 0.1 Hiệu năng WebKit — nguyên nhân đã đo được

**Đính chính bản 2.** P01/P01b đo **canvas 2D** (8 cốc, 480 hạt), không phải 3D. Bản 2 ghi "WebKit chế độ Cao 3D" là quy sai.

Phân tích từng phần của một khung hình bằng đo đạc tạm trong vòng lặp (đã gỡ sau khi đo), cảnh P01, WebKit:

| Phần | Bản 2 | Bản 3 |
|---|---|---|
| `putImageData` (ảnh lưới màu 10×14 của 8 cốc) | 8,2–9,4 ms/khung (8 lần) | 1 lần/khung, cốc chờ lâu nhất trước, mỗi cốc tối đa 15 Hz |
| Toàn bộ vẽ 2D (`render`) | 11–14 ms | 6–8 ms |
| Engine (`advance`) | 0,6–1 ms | không đổi |
| Panel DOM | 0,1–0,2 ms | không đổi |

Kiểm tra loại trừ (WebKit, bàn trống):

| Tình huống | fps |
|---|---|
| Vòng lặp không vẽ gì | 62 |
| Chỉ 1 lệnh `fillRect` lên canvas mỗi khung | 38–40 |
| Tắt `backdrop-filter`, `filter`, bóng đổ, animation, nền trang, `sticky`, bo góc, `overflow`; canvas khớp lưới pixel | 38–41 (không đổi) |
| Trang HTML trống chỉ có canvas 1440×900 | 120+ |

**Kết luận:**
- Khoảng 25 ms mỗi khung là chi phí WebKit (bản Playwright trên Windows) tổ hợp canvas trong trang ChemLab.
- Chi phí này **không phụ thuộc nội dung vẽ**. Tôi chưa tìm ra yếu tố nào của trang gây ra nó.
- Phần tôi kiểm soát được là chi phí JS, đã giảm khoảng một nửa.

**A/B 5 lượt xen kẽ trên cùng máy** (bản cũ `ea7ee23`, bản mới là bản 3; P01 WebKit):

| | Cao: fps (p95) | Tiết kiệm: fps |
|---|---|---|
| Bản cũ | 30,0 (43) · 29,9 (42) · 29,3 (43) · 31,9 (37) · 30,7 (40) — **trung bình 30,4** | 36,6–39,9 — trung bình 37,5 |
| Bản 3 | 32,6 (38) · 32,8 (39) · 31,5 (42) · 32,0 (42) · 32,4 (40) — **trung bình 32,3** | 36,4–38,4 — trung bình 37,2 |

Chế độ Tiết kiệm không dùng ảnh lưới màu nên không đổi, đúng như dự kiến.

**WebKit trong lượt kiểm thử đầy đủ cuối:** Cao 33,5 fps (p95 39 ms), Tiết kiệm 37,1 fps. Đây là 1 lượt đo; kết luận dựa trên trung bình 5 lượt A/B ở trên.

**Máy chậm thì tự chuyển chế độ, có báo:**
- Nếu khung hình dưới 25 fps liên tục trong 4 s ở chế độ "Cao", và học sinh chưa tự chọn chế độ, lab chuyển **một lần** sang "Tiết kiệm".
- Thông báo hiện ra: "Máy đang chạy chậm (khoảng N khung hình/giây) nên đã chuyển sang Đồ họa: Tiết kiệm. Kết quả thí nghiệm không đổi; đổi lại ở menu ⋯."
- Lựa chọn của học sinh không bao giờ bị ghi đè.
- Sau review: không tính các lúc tua nhanh hay khựng (khung dài hơn 0,5 s, ví dụ lúc mở 3D hoặc cửa sổ bị che). Không đổi thiết lập 3D đã lưu. Không hiện nhầm thông báo "máy không có GPU".
- Test P03 (Chromium, giả lập CPU chậm 10× qua CDP) kiểm tra cả hai ý trên.
- P01 "Cao" chọn chế độ qua menu và kiểm tra nút vẫn ghi "Cao" sau khi đo. Như vậy phép đo luôn đúng là chế độ Cao; **ngưỡng 30 fps giữ nguyên**.

### 0.2 T02 chập chờn — nguyên nhân đã xác nhận qua mã nguồn

- **Nguyên nhân:** `update()` trong `render3d.js` tự lia camera (`flyTo` 420 ms) khi vật **vừa được chọn** nằm gần mép khung nhìn. Nhấn để cầm cũng là chọn, nên khi cái kẹp nằm sát mép, camera lia trong lúc học sinh đang kéo và cảnh trượt dưới con trỏ.
- **Vì sao chập chờn:** vị trí chiếu của kẹp phụ thuộc bố cục, mà bố cục phụ thuộc font của từng trình duyệt.
- **Sửa:** không tự lia khi lựa chọn đến từ thao tác cầm vật.
- Bản cũ cũng hỏng test này vì đúng lỗi đó; trước đây tôi đã kết luận sai rằng nguyên nhân là môi trường.
- **Sửa test liên quan:** sau khi đổi khung hình, điểm "vùng trống" (470, 230 mm) của T02 rơi dưới thanh thao tác. Test giờ dùng (470, 150 mm) và kiểm tra trước rằng điểm đó đúng là canvas.

### 0.3 Kiểm chứng khoa học

**Manifest 72 mục, theo mức kiểm chứng** (sinh tự động, `final/REACTION_SUPPORT_MANIFEST.md`):

| Trạng thái | Số mục | Kịch bản chạy trên engine | Unit test riêng | Chưa kiểm chứng |
|---|---|---|---|---|
| Được mô hình hóa | 30 | 26 | 4 | 0 |
| Xấp xỉ giáo dục | 1 | 0 | 1 | 0 |
| Không phản ứng | 5 | 5 | 0 | 0 |
| Chưa hỗ trợ | 28 | 20 | 6 | **2** |
| Bị chặn vì an toàn | 8 | 0 | 8 | 0 |

**Lỗi khoa học tìm thấy nhờ viết test cho các mục "Chưa hỗ trợ":**
1. **Phức amin.**
   - Lỗi: CuSO₄ cộng NH₃ dư hiện Cu(OH)₂↓ mà không báo gì, vì điều kiện cũ là "pH > 9", trong khi dung dịch đệm NH₃/NH₄⁺ chỉ có pH 8,95.
   - Thực tế: NH₃ tự do còn khoảng 0,125 M, nên [Cu(NH₃)₄]²⁺ chiếm ưu thế (β₄·[NH₃]⁴ ≈ 10⁹).
   - Sửa: điều kiện mới dựa trên NH₃ tự do (tính từ Ka của NH₄⁺), vượt β^(−1/n); áp dụng cho Ag⁺, Zn²⁺, Cu²⁺.
   - Sau review: điều kiện được làm đúng hơn nữa, dùng **tỉ lệ kim loại nằm trong phức > 5 %**. Tỉ lệ này tính từ ion tan và từ kết tủa tan theo Ksp·β·[NH₃]ⁿ/[anion]^q, có cân bằng khối lượng anion. Nhờ vậy AgI không bị báo tan trong NH₃, AgCl thì có; và vết NH₃ trên Cu(OH)₂ trong kiềm mạnh không còn bị báo nhầm.
2. **Điện phân.**
   - NH₄⁺ (NH₃ trong dung dịch axit) không còn bị coi là chất gây nhiễu.
   - Khi NH₃ dư giữ hết Cu, lab báo "Chưa hỗ trợ: phức amin", thay vì báo sai "đã hết Cu²⁺ … giai đoạn điện phân nước".

**Test mới:**
- `safety: every blocked condition…` kiểm tra đủ 8 điều kiện bị chặn.
- `electrolysis refuses every interference…` kiểm tra **đúng lý do được báo** cho từng chất gây nhiễu, cộng 2 trường hợp **không** phải nhiễu: Ag⁺ đã thành AgCl, và NH₄⁺.
  - Hai quy tắc I⁻ và Ag⁺ không thể xảy ra trong dung dịch CuCl₂: I⁻ bị Cu²⁺ oxi hóa ngay khi trộn, Ag⁺ kết tủa thành AgCl. Chúng được giữ làm chốt chặn và manifest ghi là **chưa kiểm chứng**; đây là 2 mục "chưa kiểm chứng" duy nhất.
- `ammine complexes…`: AgI không tan, AgCl tan, không ra hint Ag₂O khi NH₃ dư, không báo nhầm khi có Cu(OH)₂ trong kiềm mạnh, và điện phân CuSO₄ + NH₃ (không có Cl⁻) không bị gọi là "phức".
- 20 kịch bản "Chưa hỗ trợ" chạy bằng hóa chất thật.

Sau review của Antigravity (§0.6), unit test tăng từ 95 lên **116**.

### 0.4 Sandbox

- Journey X06 làm **toàn bộ 26 thẻ "Khám phá" bằng thao tác giao diện thật**:
  - Bấm "Bày dụng cụ", chọn tốc độ 4×.
  - Rót bằng thanh thao tác, hoặc dùng kẹp/thìa để "Lấy" rồi "Thả", xác nhận hộp cảnh báo an toàn khi có.
  - Chờ kết quả, kiểm tra đúng kỳ vọng của manifest và bảo toàn chất.
- Kết quả: **26/26 đạt trên Chromium, Firefox và WebKit** (§0.8).

### 0.5 3D

Ảnh "trước" và "sau" cùng script, cùng cảnh. Mỗi lượt chụp ở một thư mục riêng: `final/round3/before` và `final/round3/after-final`. Các lượt trung gian `after-a`, `after-b`, `after-c` giữ lại trên máy nhưng không commit.

| Vấn đề thấy trên ảnh "trước" | Sửa |
|---|---|
| Dụng cụ (kẹp, đũa, thìa, ống nhỏ giọt, điện cực, cầu muối, giấy quỳ) lơ lửng giữa không trung: các bài đặt chúng ở y = 60–150 mm | Khi dụng cụ ở trên cao và không ai cầm, vẽ giá đỡ thí nghiệm (đế, cột, tay kẹp) chạm mặt bàn. Khi đặt trên bàn, vẽ khối giá nhỏ. Giá đỡ không nhận click |
| Đũa, ống nhỏ giọt gần như vô hình | Vật liệu thủy tinh mảnh, độ đục 0,42 |
| Dung dịch không màu trông như sữa xám | Gần trong suốt (độ đục × 0,45 khi màu không bão hòa) |
| Kết tủa gần như không thấy | Hạt dạng vảy, lớn hơn (ghi rõ là kích thước minh họa); lớp lắng hình mô thoải sát thành cốc, ẩn khi cốc rỗng. Lớp đục huyền phù thêm trong 3D đã bị **gỡ** sau review, vì engine đã pha màu kết tủa vào dung dịch và áp hai lần làm mất màu nâu của I₂ |
| Ống nghiệm đứng một mình trên bàn | Giá dây mảnh (không che đáy ống) khi ống không nằm trên giá ống nghiệm |
| Vòng chọn to gấp 1,6 lần đế cốc | Ôm sát đế |
| Không thấy bóng tiếp xúc trên bàn xanh than | Bàn epoxy xám |
| Thẻ "Khám phá" bị nút × đè | Thanh thẻ cuộn ngang trong ngăn hẹp |
| Vật nằm ở 1/3 dưới khung, phía trên là tường trống | Hạ điểm nhìn (0,42 → 0,34 chiều cao) |
| Camera lia khi vừa cầm vật | Xem §0.2 |

Đánh giá trung thực: rõ hơn nhiều ở mặt "vật đứng ở đâu" và "nhìn thấy hiện tượng". Tuy vậy vẫn là hình procedural, không có mô hình .glb, khúc xạ thật hay bóng đổ thật (shadow map), nên **chưa thể gọi là mức sản phẩm hoàn chỉnh**.

### 0.6 Review độc lập của Antigravity (AI phụ, chỉ đọc)

Lệnh: `agy -p … --mode plan --model gemini-4-neon-high`. Antigravity chỉ đọc mã, diff và ảnh chụp, không chạy lệnh; nó **không thao tác trình duyệt**. Prompt, diff và kết quả nằm ở `final/round3/agy/`.

| Phát hiện (mức Antigravity đánh giá) | Kiểm chứng | Xử lý |
|---|---|---|
| AgI + NH₃ bị báo tan thành phức (P1) | Tái hiện: tỉ lệ phức 12,8 % (sai) | Tính độ tan phức có cân bằng khối lượng anion → 0,02 %; có test |
| Vết NH₃ trên Cu(OH)₂ trong kiềm mạnh báo nhầm phức (P1) | Đúng theo phân tích mã | Điều kiện theo tỉ lệ phức; có test |
| Cu(OH)₂ vẫn hiện khi NH₃ dư lẽ ra đã hòa tan thành phức (P1) | Đúng | **Chưa sửa**: phức amin chưa được mô hình hóa. Lab chỉ báo "Chưa hỗ trợ" trong bảng quan sát; xem §0.7 |
| Hint Ag₂O và hint phức hiện cùng lúc (P2) | Đúng | Ag⁺ nằm trong phức không còn tính là Ag⁺ tự do; có test |
| Điện phân kiểm tra phức trước khi kiểm tra Cl⁻ và dung môi (P2) | Đúng | Chỉ kiểm tra khi có Cl⁻ và dung dịch là nước; có test |
| Hằng số β là giá trị ở lực ion cao (P3) | Không tra được nguồn gốc độc lập | Ghi chú trong mã: hint chỉ mang tính định tính |
| Bộ nhớ đệm lưới màu: lỗi làm tròn nửa số, bị kẹt ảnh cũ (P1) | Đúng theo phân tích mã | So byte đã lưu; lưới "bẩn" được đưa lại vào hàng chờ |
| Bộ tự chuyển chế độ kích hoạt nhầm khi tua nhanh/khựng, ghi đè thiết lập 3D, cờ cũ còn sót (P1) | Đúng | Sửa cả ba |
| Lớp đục kết tủa 3D bị áp hai lần, màu I₂ mất (P2) | Đúng: ảnh `after-c` cho thấy màu xám | Gỡ lớp đục; độ đục chuyển mượt theo độ bão hòa màu; ẩn lớp lắng khi cốc rỗng |
| Giá đỡ xuyên qua bình, giấy quỳ vẫn lơ lửng, tay kẹp không chạm vật (P1) | Đúng một phần | Ẩn giá khi dụng cụ nhúng/đứng trong bình; thêm giấy quỳ; kẹp ở thanh ngang của điện cực và vòm cầu muối |
| Test điện phân không kiểm tra lý do; quy tắc I⁻/Ag⁺ không thể xảy ra nhưng ghi "đã kiểm chứng" (P1) | Đúng | Kiểm tra đúng lý do; manifest ghi 2 mục chưa kiểm chứng |
| Test an toàn chỉ kiểm tra mức "chặn" (P2) | Đúng | Kiểm tra cả lý do chặn |
| P03 có thể đạt mà không chứng minh máy đã chậm (P2) | Đúng | Đo fps lúc throttle: phải dưới 25 |
| Đổi toạ độ T02 có thể che một hồi quy khung hình (P1) | Đã xem xét | Không đổi: thanh thao tác vốn phủ mép trên canvas, và khung hình đã tính phần này (`ins.t`). Test "nhấc cốc lên" T02 đầu vẫn đạt trên cả 3 trình duyệt |
| Thẻ "Khám phá" bị nút × đè; cảnh bằng chứng có cốc chồng lên nhau | Đúng | Thanh thẻ cuộn ngang; script chụp dọn bàn trước khi dựng cảnh |

### 0.7 Giới hạn còn lại sau bản 3

- **Phức amin** ([Cu(NH₃)₄]²⁺, [Zn(NH₃)₄]²⁺, [Ag(NH₃)₂]⁺) chưa được mô hình hóa. Khi NH₃ dư, bình vẫn hiện kết tủa hiđroxit, kèm cảnh báo "Chưa hỗ trợ". Ngoài thực tế, dung dịch lẽ ra trong và có màu xanh thẫm.
- **3D** vẫn là hình procedural: không có mô hình .glb, khúc xạ thật hay bóng đổ thật. Cột giá đỡ phía sau cốc có thể rối mắt khi nhìn cận cảnh.
- **WebKit:** sàn khoảng 25 ms/khung khi canvas được cập nhật, chưa tìm ra nguyên nhân. Chế độ Cao đạt quanh 30–33 fps, rất sát ngưỡng; máy tải nặng sẽ không đạt.
- **Chưa kiểm thử** trên GPU thật, điện thoại thật, hay bằng một lượt QA tương tác độc lập trên trình duyệt (Antigravity không có công cụ trình duyệt).
- 2 quy tắc chốt chặn điện phân (I⁻, Ag⁺) không kiểm chứng được bằng thí nghiệm, vì không thể tạo ra trong dung dịch CuCl₂.
- X06 kiểm tra trạng thái engine sau thao tác UI, chưa kiểm tra chữ trong bảng quan sát của từng thẻ.

### 0.8 Kiểm thử bản 3 (lượt đầy đủ cuối, cùng một bản build)

| Lệnh | Kết quả |
|---|---|
| `node scripts/test-dlab.mjs` | **116/116 PASS** |
| `npm run check` | PASS (exit 0) |
| `npm run check:browser` | **448/448 PASS** |
| `node scripts/dlab-e2e.mjs` Chromium | **93/93 PASS**; P01 60/60 fps |
| Firefox | **89/89 PASS**; P01 41,4 / 39,3 fps. P03 và TC320–768 chỉ chạy trên Chromium (CDP) |
| WebKit | **89/89 PASS**; P01 33,5 / 37,1 fps; T02 PASS |
| `node scripts/dlab-guided-walk.mjs` | **5/5 bài hoàn thành** bằng thao tác giao diện; 0 lỗi console; 0 yêu cầu ChemAI |
| X06 (26 thẻ Khám phá qua UI) | 26/26 trên cả 3 trình duyệt (nằm trong các con số trên) |

Bằng chứng: `final/round3/e2e-{chromium,firefox,webkit}/`, `final/round3/walk/`, `final/round3/before/`, `final/round3/after-final/`.

### 0.9 Bảng nghiệm thu bản 3

| # | Tiêu chí (Acceptance gate của chủ sở hữu) | Trạng thái |
|---|---|---|
| 1 | Không còn lỗi P0/P1 đã xác nhận trong phạm vi hỗ trợ | **PARTIAL**: các P1 của review đã sửa và có test, trừ phức amin. Phức amin nằm ngoài phạm vi hỗ trợ và được báo "Chưa hỗ trợ", nhưng hình vẫn hiện kết tủa |
| 2 | Hiện tượng chủ chốt đúng với mô hình đã công bố | PASS: manifest 72 mục, 70 mục có kiểm chứng |
| 3 | 5/5 Guided Lab bằng tương tác thật | PASS |
| 4 | Sandbox ổn định | PASS: 26/26 thẻ qua UI trên 3 trình duyệt; X01–X05 |
| 5 | 3D nâng cấp rõ rệt về hình ảnh và khả năng dùng | PARTIAL: rõ rệt hơn (§0.5) nhưng chưa phải mức sản phẩm hoàn chỉnh |
| 6 | Không còn lỗi chọn nhầm, thả nhầm, sai trạng thái nghiêm trọng | PASS trong phạm vi test (T01–T02, G10, X02); đã sửa lỗi camera lia khi đang cầm |
| 7 | Hoàn tác, Đặt lại, Lưu, Mở đáng tin cậy | PASS (S18–S20, X02, X04, G10) |
| 8 | Build và hồi quy đạt | PASS (§0.8) |
| 9 | FPS và cross-browser báo cáo đầy đủ | PASS: báo cả kết quả sát ngưỡng và nguyên nhân WebKit |
| 10 | Ảnh 2D/3D thực tế | PASS (`final/round3/`) |
| 11 | Giới hạn ghi rõ | PASS (§0.7) |

**Đề xuất: PARTIAL.** Chưa đề xuất nghiệm thu Full Product, vì mục 1 (phức amin) và mục 5 (3D) chưa đạt trọn.


## 1. Executive summary

Bản 2 tiếp tục directive Full Rebuild, theo thứ tự ưu tiên chủ sở hữu yêu cầu.

**Khoa học trước:**
- Mô hình dung môi nước–etanol–dầu.
- Phản ứng CuCl₂ / FeCl₃ + KI.
- Điện phân chỉ chạy khi mô hình còn đúng.
- Pin Daniell phụ thuộc nhiệt độ.
- Antigravity review khoa học vòng 3: tôi tái hiện các phát hiện và sửa 10 lỗi đã xác nhận.

**Manifest phản ứng:** 72 mục trong mã nguồn. Các mục có kịch bản được chạy làm test trên engine thật.

**Sandbox:** thêm thẻ "Khám phá" lấy từ manifest. Thẻ chỉ bày dụng cụ; học sinh tự làm thí nghiệm.

**3D:** mỏ rót, vạch chia in số, đế ống đong, viền kính Fresnel, vòng mặt thoáng, thìa và kẹp mới, tường gạch, bàn sáng hơn, cầm vật thì camera đứng yên.

**Kiểm thử:**

| Bộ kiểm thử | Bản 1 | Bản 2 |
|---|---|---|
| Unit | 57 | 95 |
| E2E Chromium | 61 | 66 (thêm 5 hành trình Sandbox bằng chuột thật) |

Quyết định kiến trúc của bản 1 giữ nguyên: **KEEP lõi, REFACTOR có trọng điểm**. Đây không phải là thu hẹp việc. Mọi mô hình mới đều đi qua một state và một engine, nên 2D, 3D, Guided và Sandbox nhận kết quả giống nhau mà không cần sửa riêng từng view.

## 2. Kiến trúc

Luồng xử lý: Thao tác → `assess` (an toàn) → lệnh trong `sim.js` → bước mô phỏng (`processes.js`, `chemistry.js`) → `log` / `notes` → 2D / 3D → Quan sát → điều kiện bước Guided.

| Lớp | File | Bản 2 |
|---|---|---|
| Dữ liệu chất | `data/materials.js` | Bảng khối lượng riêng và điểm sôi nước–etanol; dung môi của chất chỉ thị; I₂, CuI, iot rắn |
| Phản ứng | `data/reactions.js` | `ION_REDOX`, `SOLVENT_HINTS`, chất cản trở điện phân, ΔS° Daniell, 11 gợi ý "chưa hỗ trợ" mới |
| **Manifest** | `data/manifest.js` (mới) | Danh sách duy nhất các phản ứng/quá trình được khẳng định, kèm kịch bản chạy được |
| Cân bằng | `engine/chemistry.js` | `polarPhase`, `boilingOf`, `oilBelow`; thứ tự Ksp → oxi hóa–khử → Ksp; độ tan I₂ |
| Quá trình | `engine/processes.js` | Sôi theo thành phần; pH chỉ khi áp dụng được; đầu đo/điện cực xét lớp dầu; Na tiêu thụ nước; kiểm soát điện phân; Nernst theo T |
| 3D | `ui/render3d.js` | §10 |
| Sandbox | `ui/dlabApp.js`, `dlab.css` | Thẻ "Khám phá"; nút Rót/Nhỏ chung cho mọi bình; lượng rót mặc định vừa bình |

## 3. Hệ thống giữ lại

- Lõi mô phỏng: H = 1/60 s, tốc độ 0,25–4×, tua chạy chính mô hình.
- pH theo cân bằng điện tích, Ksp, thủy phân, Faraday.
- Bộ điều khiển tương tác dùng chung 2D/3D.
- Lưu/Mở/Hoàn tác (có migration).
- Toàn bộ các sửa của bản 1.

## 4. Hệ thống viết mới hoặc sửa lớn (bản 2)

1. **Mô hình dung môi** (§5.1).
2. **Oxi hóa–khử ion trong dung dịch** và thứ tự cân bằng (§5.2).
3. **Kiểm soát phạm vi điện phân và pin** (§5.3).
4. **Manifest phản ứng và test registry** (§7).
5. **Sandbox "Khám phá"** (§13).
6. **Nâng cấp hình học/vật liệu 3D** (§10).

## 5. Chemistry Engine — thay đổi đã kiểm chứng

### 5.1 Dung môi (mục III-A của directive)

| Trước (đã tái hiện) | Sau |
|---|---|
| Etanol tinh khiết có pH 7; quỳ và máy đo pH "đo được" | Không có pH; ghi rõ lý do. pH chỉ áp dụng khi etanol ≤ 10 % thể tích |
| Dầu luôn nổi; trong etanol dầu cũng nổi (sai) | Dầu nổi trên nước, chìm dưới etanol. Khối lượng riêng hỗn hợp tra bảng Lange (50 % khối lượng → 0,90985 g/mL) |
| Etanol không sôi; chỉ nước sôi ở 100 °C | Sôi theo bảng CRC: etanol khoảng 78 °C; hỗn hợp sôi tăng dần vì hơi giàu etanol; đẳng phí 95,5 % có thông báo riêng |
| Na trong etanol: im lặng | Báo "Chưa hỗ trợ" (Na + etanol khan). Hệ thống an toàn vốn đã chặn thả Na khi thiếu 50 mL nước |
| 3 giọt phenolphtalein làm 1 mL NaOH mất pH và mất màu (lỗi do chính bản sửa đầu tiên gây ra; Antigravity phát hiện) | Chất chỉ thị pha trong etanol 50 % (cách pha phổ biến): giữ pH 13,6 |

### 5.2 CuCl₂ + KI và oxi hóa–khử iotua (mục III-B)

Phân tích trước khi sửa:
- Trộn CuCl₂ với KI: phản ứng **xảy ra ngay trong dung dịch**, trước mọi lần điện phân: 2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂.
- Sau đó dung dịch còn I₂ (và có thể I⁻). I₂ bị khử ở catot trước Cu²⁺; I⁻ bị oxi hóa ở anot trước Cl⁻.
- Vì vậy kết quả "Cu + Cl₂" của mô hình CuCl₂ là sai. Mô hình **không đổi Cl₂ thành I₂**; nó từ chối điện phân và nói rõ lý do.

Mô hình mới:
- `ION_REDOX`: Cu²⁺ + I⁻ và Fe³⁺ + I⁻, phản ứng hết theo chất thiếu, chỉ khi pH ≤ 7.
- Thứ tự Ksp → oxi hóa–khử → Ksp: Ag⁺ lấy I⁻ thành AgI trước.
- I₂ tan tối đa 1,33 mM (thêm phần I₃⁻ khi còn I⁻); phần dư thành iot rắn.
- Kiểm tra bằng test: bảo toàn Cu, I, Fe; điện tích không đổi.
- Giới hạn: Fe³⁺ + I⁻ ở nồng độ < 1 mM thực tế còn khoảng 25 % chưa phản ứng (K ≈ 10⁵, theo Antigravity); điều này được ghi trong manifest.

### 5.3 Điện phân và pin Daniell (mục III-C)

**Điện phân CuCl₂ bị từ chối (không tạo sản phẩm) khi:**
- Có I⁻, I₂ (kể cả iot rắn), Ag⁺, Fe³⁺, Fe²⁺, HNO₃ (pH ≤ 3) hoặc NH₃ vượt 1 % lượng Cu²⁺.
- [Cl⁻] < 0,1 M (khi đó O₂ cạnh tranh ở anot).
- Dung môi không phải nước.

**Pin Daniell:**
- E = E°(T) − (RT ln10 / 2F)·lg([Zn²⁺]/[Cu²⁺]), tính tại nhiệt độ trung bình của hai cốc.
- dE°/dT = ΔS°/2F = −0,109 mV/K, với ΔS° tính từ S° của NBS (Antigravity đã đối chiếu cả bốn giá trị).
- Hai cốc khác nhiệt độ: có ghi chú. Dung môi không phải nước: từ chối.
- Giới hạn: pin thật dốc hơn (−0,3 đến −0,5 mV/K) do thế tiếp xúc lỏng và hệ số hoạt độ; E° 1,10 V là giá trị SGK (CRC: 1,1037 V).

### 5.4 Các lỗi khác từ review khoa học vòng 3 (đã tái hiện rồi mới sửa)

- Không oxi hóa–khử trong môi trường kiềm (không còn I₂ hay Fe(OH)₂ giả).
- Na dừng ở mặt phân cách dầu–nước và tiêu thụ nước (bảo toàn H, O).
- Đầu đo pH, giấy quỳ và điện cực chỉ nằm trong lớp dầu: không đo, không có dòng điện.
- Thông báo điện phân không còn nêu sai chất cản trở; một giọt KI không còn chặn vĩnh viễn.
- Ag₂O được báo theo [Ag⁺][OH⁻] > 10·K, cùng quy tắc tạo mầm với mọi kết tủa (trước đây chỉ báo khi pH > 12).
- CH₃COOH không còn ngừng tác dụng với đá vôi/kim loại ở mức 1,7 %.
- Thêm 11 gợi ý "chưa hỗ trợ": HNO₃ + I⁻/Fe²⁺, Ag⁺ + Fe²⁺, Ag⁺/Zn²⁺ + NH₃, CaCO₃ + H₂SO₄, Cu²⁺ + cacbonat, I₂ trong kiềm…

Chi tiết ở `final/SCIENTIFIC_VALIDATION_MATRIX.md`.

## 6. Physics và hiển thị

- Lớp chất lỏng trong 2D và 3D lấy thứ tự từ engine (`oilBelow`); có đường phân cách hai lớp.
- I₂ tô màu vàng nâu theo nồng độ. CuI và iot rắn hiển thị như kết tủa.
- Bọt khí khi sôi lấy từ lượng hơi thực bay ra (nước + etanol).
- Giữ nguyên từ bản 1:
  - Kết tủa có độ đục theo nồng độ và lắng.
  - Bọt khí tỉ lệ lượng khí.
  - Rót khi nghiêng, khuấy.
  - Chất rắn tan dần.
  - Lớp Cu theo độ dày.

## 7. Phạm vi phản ứng — manifest

`final/REACTION_SUPPORT_MANIFEST.md` được sinh tự động bởi `node scripts/dlab-manifest.mjs` từ `src/dlab/data/manifest.js`. Báo cáo không viết tay riêng danh sách này.

| Trạng thái | Số mục |
|---|---|
| Được mô hình hóa | 30 |
| Xấp xỉ giáo dục | 1 |
| Không phản ứng | 5 |
| Chưa hỗ trợ (báo rõ) | 28 |
| Bị chặn vì an toàn | 8 |

- 33 mục có kịch bản được chạy trên engine thật trong `test-dlab.mjs`. Mỗi kịch bản kiểm tra đúng sản phẩm; với mục Không phản ứng hoặc Chưa hỗ trợ thì kiểm tra không bịa khí hay lớp kim loại; và kiểm tra bảo toàn chất.
- Tổ hợp không có trong manifest: engine báo "Không có phản ứng" chỉ khi có căn cứ (E° hoặc quy tắc NO_REACTION), các trường hợp khác báo "Chưa hỗ trợ". Không tổ hợp nào tự động thành "Không phản ứng".

## 8. Kiểm chứng khoa học

Xem `final/SCIENTIFIC_VALIDATION_MATRIX.md`: mỗi hằng số có nguồn, cách đối chiếu và test.

**Nguồn tôi đọc trực tiếp:**
- Wikipedia "Ethanol (data page)": bảng Lange 1967 và bảng sôi CRC.
- Tài liệu chính thức của Antigravity về quyền.

**Antigravity đối chiếu độc lập:** CRC, NIST WebBook, NBS (`final/agy-science.md`).

**Hai chênh lệch ghi nhận nhưng chưa đổi:**
- Bảng sôi CRC thấp hơn dữ liệu VLE hiện đại khoảng 2 °C ở vùng loãng.
- E° Daniell 1,10 V so với 1,1037 V.

## 9. 2D Workspace

- Thứ tự lớp đúng theo khối lượng riêng.
- Tên ống trong giá tự rút gọn thành chữ cái khi không đủ chỗ; trước đây bị dính thành "Ống AỐng BỐng C", lỗi do Antigravity phát hiện.
- Số thập phân trong thông báo dùng dấu phẩy (1,100 V).

## 10. 3D Laboratory

**Đã làm** (procedural, three.js có sẵn, không thêm thư viện; tài nguyên GPU được dọn trong `dispose()`):

| Hạng mục | Thay đổi |
|---|---|
| Cốc, ống đong | Mỏ rót tạo bằng biến dạng hình tiện (lathe) ở miệng |
| Vạch chia | In số ở đúng mức thể tích của engine (`levelForVolume`): cốc 5/10 mL, ống đong 1 mL, số ở mỗi vạch lớn; thay 4 khối hộp không số |
| Ống đong | Đế lục giác |
| Ống nghiệm | Bỏ đĩa đáy phẳng thừa |
| Kính | Độ trong suốt tăng theo góc nhìn (Fresnel, 3 phép tính/pixel); viền rõ ngay cả khi không có bản đồ môi trường |
| Mặt thoáng | Vòng sáng ở mép chất lỏng |
| Thìa | Liền khối (trước đây cán cách lòng thìa 11 mm) |
| Kẹp | Hai càng cong nối ở đầu |
| Thép ở chế độ Tiết kiệm | Không còn đen |
| Bọt khí | Vẽ sau chất lỏng nên nhìn thấy bên trong |
| Bàn và tường | Bàn epoxy có vân, sáng hơn để thấy bóng; tường gạch men |
| Camera | Cầm vật thì quán tính xoay dừng ngay |

**Không làm** (trung thực):
- Không có mô hình .glb/.gltf, bản đồ môi trường HDR hay khúc xạ thật (transmission). Lý do: kính kiểu Physical tốn khoảng 10 lần trên GPU phần mềm, và máy đo không có GPU thật.
- Kẹp và ống nhỏ giọt vẫn là hình đơn giản, chỉ được làm lại một phần.
- Antigravity đề xuất tách thành kính trước/sau và mặt thoáng lõm; chưa làm.

Ảnh trước/sau ở `final/shots/` (`before-*` là `ea7ee23`, `after-*` là bản 2, cùng script `scripts/dlab-final-evidence.mjs`). Đánh giá của tôi: rõ ràng hơn ở thể tích (có số), mỏ rót, viền kính và bối cảnh, nhưng **chưa ở mức sản phẩm như directive mô tả**.

## 11. Tương tác dụng cụ

- Nút "Rót" và "Nhỏ" dùng chung cho mọi bình. Trước đây nút luôn ghi "Rót vào cốc" kể cả khi đích là ống nghiệm.
- Lượng rót mặc định tối đa bằng một nửa chỗ trống của bình đích. Trước đây đề xuất 50 mL cho ống 20 mL.
- Giữ nguyên từ bản 1: đích mặc định theo bước, không mang lựa chọn sang vật khác.

## 12. Guided Lab

- Giữ nguyên toàn bộ sửa của bản 1 (đích theo ID, không hoàn thành nhầm, phục hồi, Hoàn tác/Đặt lại).
- Đổi bài giữa chừng: bài mới sạch và không Hoàn tác về bài cũ (E2E X04).
- Chạy cả 5 bài qua giao diện thật (`final/walk/`):

| Bài | Kết quả |
|---|---|
| Axit–bazơ | 5/5 |
| Kết tủa | 5/5 |
| Kim loại | 5/5 (`final/walk-metals-rerun/`) |
| Điện phân | 5/5 |
| Hữu cơ | 4/4 |

  0 lỗi console, 0 request ChemAI. Lần chạy đầu, bài Kim loại có một lỗi tranh chấp thời gian trong script kiểm thử (nút "Tua" biến mất đúng lúc bài hoàn thành). Đã sửa script; chạy lại đạt 5/5 đủ 6 thao tác.

## 13. Sandbox

**Thẻ "Khám phá"** (chỉ có ở chế độ Tự do):
- 26 hiện tượng có mô hình, nhóm theo chủ đề, lấy từ manifest.
- "Bày dụng cụ" chỉ đặt cốc (có dung dịch nền), chai thuốc thử hoặc kẹp/thìa, rồi chọn sẵn dụng cụ và nói việc cần làm. Học sinh tự rót hoặc tự thả.
- Ghi chú đầu danh sách: tổ hợp khác vẫn thử được; mô phỏng sẽ nói rõ khi không phản ứng hoặc chưa hỗ trợ.

**Kịch bản ngoài 5 bài** (E2E, chuột thật trên điều khiển nhìn thấy):

| Mã | Kịch bản |
|---|---|
| X01 | Khám phá → Cu(OH)₂: kiểm tra chưa có kết tủa trước khi học sinh rót, có kết tủa sau khi rót |
| X02 | Rót nhầm cốc → Hoàn tác → cốc trở lại như cũ → rót đúng → AgCl |
| X03 | KI từ Tủ hóa chất vào CuCl₂ → CuI và I₂, nhãn ghi I₂ → điện phân bị từ chối, không có Cl₂ |
| X04 | Đổi bài giữa chừng |
| X05 | Rót quá nhiều → tràn, thể tích không vượt dung tích |

Kịch bản sẵn có từ trước: S01–S25 (thư viện, rót, nhỏ, khuấy, kết tủa, hòa tan, Hoàn tác, Đặt lại, Lưu/Mở sau khi tải lại trang, chuyển 2D/3D không mất trạng thái), G04 (chuyển 2D khi đang kẹp vật trong 3D).

**Không làm:** chưa đổi bố cục tổng thể của Sandbox (thư viện / bàn / Quan sát), vì bố cục bản UX rescue vẫn dùng được và E2E đã khóa hành vi.

## 14. An toàn

Giữ nguyên `assess` của các bản trước. Có 8 điều kiện chặn, liệt kê trong manifest ở mục INVALID.

Mới:
- Báo "Hơi etanol dễ bắt lửa" khi etanol sôi.
- Báo Ag₂O, NH₃ và các trường hợp chưa hỗ trợ.

## 15. Hiệu năng

Môi trường đo:
- Playwright headless trên Windows 11, laptop dùng chung.
- Không có GPU thật: WebGL chạy bằng renderer phần mềm.
- Cảnh P01 là 2D, 8 cốc có kết tủa, 480 hạt.
- Trong lúc đo, các ứng dụng của chủ sở hữu vẫn chạy (trình duyệt đã dùng khoảng 41.000 giây CPU, Zalo, ChatGPT, NVIDIA Overlay). Tôi không tắt chúng.

| Lần đo | Chromium Cao / Tiết kiệm | Firefox | WebKit |
|---|---|---|---|
| Lượt E2E tuần tự, máy tương đối rảnh | 60,0 / 60,0 | 39,2 / 35,7 | **27,1 (FAIL)** / 34,1 |
| Lượt cuối (§16), máy đang tải nặng | 60,0 / 60,0 | **20,6 / 21,1 (FAIL)** | **12,5 / 18,2 (FAIL)** |
| **5 lượt xen kẽ bản cũ `ea7ee23` và bản 2, cùng điều kiện** | — | — | Cao: cũ 14,0–14,5, mới 13,6–14,8 · Tiết kiệm: cũ 16,6–18,7, mới 16,6–18,2 |

**Kết luận:**
- Bản 2 **không làm chậm** so với bản cũ: số đo xen kẽ trùng nhau, và engine chạy 0,27–0,31 ms/bước so với 0,31–0,32 ms trên Node.
- Engine không phải nút thắt. Thời gian vẽ trên WebKit phần mềm và tải của máy mới là yếu tố quyết định: chênh 14–30 fps giữa các lúc đo.
- **Ngưỡng 30 fps giữ nguyên.** WebKit chế độ "Cao" **không đạt** trong các lượt đo gần nhất; một lượt đo 30,2 fps trước đây không phải bằng chứng ổn định.
- Chưa đo trên GPU thật hay điện thoại thật.

## 16. QA evidence

| Lệnh | Kết quả |
|---|---|
| `node scripts/test-dlab.mjs` | **95/95** (mới: dung môi, CuCl₂ + KI, Daniell T, review 3, 33 kịch bản manifest, độ đầy đủ manifest) |
| `npm run check` | PASS (exit 0) |
| `npx vite build` | PASS |
| E2E Chromium | **66/66** |
| E2E Firefox / WebKit (lượt cuối) | Firefox **61/63**: chỉ P01, P01b FAIL (FPS, máy tải nặng). WebKit **60/63**: P01, P01b FAIL (FPS) và T02 (lần hai) **FLAKY**. Lượt trước, máy rảnh hơn: Firefox 62/63 và WebKit 61/63. T02 sau khi sửa đạt 2/2 ở cả hai trình duyệt khi máy rảnh |
| `npm run check:browser` | **448/448** |
| Guided walk 5 bài | 5/5, 0 lỗi console, 0 ChemAI |

**Thay đổi test và lý do** (không nới tiêu chí):
- `audit fixes`: Fe³⁺ + I⁻ từ "chưa hỗ trợ" thành phương trình được mô hình hóa (hành vi đổi có chủ đích).
- `CuCl₂ + KI`: I₂ tính cả phần rắn, theo mô hình độ tan mới.
- X03: chờ nhãn cập nhật ở khung hình kế tiếp, thay vì đọc ngay.
- E2E dùng `[data-qa="pour"]` vì nút đổi tên thành "Rót".
- `dlab-guided-walk.mjs`: xử lý trường hợp nút "Tua" biến mất.

**Hồi quy do tôi gây ra trong đợt này, đã sửa:**
- Giảm khoảng trống trên khung 3D làm cốc nhấc lên ra khỏi khung nhìn (T02 hỏng ở Firefox): đã hoàn tác.
- 3 giọt chất chỉ thị làm mất pH: đã sửa.

**Lỗi có sẵn từ trước** (bản cũ `ea7ee23` cũng hỏng khi chạy hôm nay): T02 3D, camera xê dịch khoảng 0,001–0,005 khi đang cầm vật.
- Đã sửa một nguyên nhân trong ứng dụng: dừng quán tính xoay khi cầm vật. Sau sửa đạt ở Firefox và WebKit khi máy rảnh; không nới test.
- Khi máy tải nặng, WebKit vẫn hỏng: **FLAKY**. Giả thuyết chưa xác nhận: vòng render theo yêu cầu dừng giữa lúc quán tính hoặc hoạt cảnh căn khung đang chạy, rồi chạy tiếp khi chuột rê tới vật.

**Ảnh và dữ liệu:**
- `final/shots/` (trước/sau, 2D/3D, Cao/Tiết kiệm, 5 bài).
- `final/walk/`.
- `final/agy-walk/` (lượt chạy của Antigravity).

Không có video.

## 17. Đóng góp của Antigravity (AI phụ)

| Lượt | Chế độ | Kết quả | Claude xử lý |
|---|---|---|---|
| Review khoa học (`final/agy-science.md`) | Chỉ đọc, có tra web | Đối chiếu số liệu; 1 P0, 5 P1, 2 P2, 1 P3 và 6 phản ứng khác còn sai | Tái hiện từng phát hiện trên engine (3 lỗi nặng nhất tái hiện ngay), sửa 10 lỗi, viết test `review 3`. Không theo một kỳ vọng của nó: nó cho rằng NaOH 5 mmol + FeCl₃ 2 mmol là môi trường kiềm, nhưng thực ra thiếu OH⁻ |
| Phê bình 3D (`final/agy-3d.md`) | Chỉ đọc | 8 điểm yếu kèm số dòng, kế hoạch P0–P2 | Kiểm chứng: thìa hở 11 mm, thép đen ở chế độ Tiết kiệm, đĩa đáy ống nghiệm, thứ tự vẽ bọt khí. Làm phần lớn P0/P1 (§10) |
| QA trình duyệt độc lập (`final/agy-browser.md`) | `--settings` chỉ có hiệu lực trong phiên, cho phép duy nhất `node scripts/dlab-guided-walk.mjs` và localhost; cấm ghi file, git, npm, npx | **Không có công cụ trình duyệt tương tác**, nên không tự bấm được. Chạy guided-walk (5/5) và đọc ảnh, phát hiện 4 vấn đề giao diện | Sửa cả 4 (§9, §11). Thông báo chồng nhau thực ra là toast tự ẩn sau 4,5 s |

Cơ chế quyền:
- Dùng đúng cơ chế chính thức `permissions.allow` (tài liệu antigravity.google/docs/permissions).
- Không dùng `--dangerously-skip-permissions`.
- Antigravity cho biết lần đầu không chạy được trong sandbox vì Chromium của Playwright nằm ngoài sandbox, nên lệnh được chạy ngoài sandbox theo quy tắc allow.

Sự cố: script guided-walk mặc định ghi đè ảnh bằng chứng cũ ở `tongs/`. Tôi đã chuyển kết quả mới sang `final/agy-walk/` và khôi phục bằng chứng cũ từ HEAD bằng `git restore`.

Antigravity không sửa dòng code nào.

## 18. Giới hạn còn lại

**Khoa học** (đã ghi nhận, chưa sửa):
- Na + axit mạnh dùng ΔH của Na + nước.
- Hằng số Henry của CO₂ cố định ở 25 °C, nên đun không đuổi CO₂; NH₃ và HCl không bay hơi.
- Mg với nước nóng.
- Bảng sôi CRC thấp hơn dữ liệu hiện đại khoảng 2 °C ở vùng loãng.
- Fe³⁺ + I⁻ được coi là phản ứng hết.
- I₃⁻ tính gần đúng.
- Axit yếu: tốc độ chỉ tính theo [H⁺], nên chậm hơn thực tế.
- Hệ số hoạt độ lý tưởng; ngưỡng tạo mầm 10·Ksp; hằng số tốc độ k là xấp xỉ.
- Bỏ qua co thể tích khi trộn nước–etanol.
- Màu dung dịch phụ thuộc thứ tự thêm ion (P3).

**Từ bản 1, chưa sửa:**
- Cốc có thể bị nung trong lúc kéo qua bếp.
- `c.unsupported` không tự xóa.
- Kết luận trong bảng Quan sát có thể gán nhầm cốc khi hai cốc cùng một phản ứng.

**Sản phẩm:** 3D chưa ở mức "sản phẩm"; bố cục Sandbox chưa đổi; không có video; WebKit chế độ "Cao" < 30 fps.

**Chưa thử:** thiết bị cảm ứng thật, GPU thật, học sinh thật.

## 19. Git

| Commit | Nội dung |
|---|---|
| `fc43ae4` | Bản 1: lỗi bước 5, khí theo bình |
| `1707961` | Bản 1: phân loại phản ứng, kết tủa và bọt khí |
| `6f2bc1c` | Bản 1: review 1 |
| `a306197` | Bản 1: 3D dầu, catot, dây |
| `15e6d45` | Bản 1: review 2 |
| `ea7ee23` | Bản 1: báo cáo |
| `51ea6f7` | Bản 2 (67 file), commit cục bộ sau khi chủ sở hữu cho phép |
| `faaa52f` | Bản 3: phức amin (hint), test manifest, hiệu năng 2D WebKit, sửa T02, 3D, X06/P03, báo cáo và bằng chứng `final/round3/` |
| (commit bản 4) | Bản 4: mô hình phức amin, NH₃ 2 M, solver Illinois, 3D kết tủa/bọt/chất lỏng, S07, review Antigravity, bằng chứng `final/round4/` |

Mỗi commit chỉ stage đúng file theo pathspec. Không đụng tới các file `.claude/` của chủ sở hữu (11 file đang staged, cùng `.claude/settings.json`), `QA_CODEX_FULL_AUDIT.md` và `qa-codex/`. Các thư mục ảnh trung gian `final/round3/after-{a,b,c}` không commit. Không push, không merge, không deploy.

## 20. Acceptance checklist (mục XI của directive)

| # | Tiêu chí | Trạng thái |
|---|---|---|
| 1 | Không còn lỗi khoa học nghiêm trọng đã biết trong phạm vi hỗ trợ | PASS có điều kiện: các lỗi P0/P1 đã biết đều đã sửa; còn giới hạn P2/P3 ở §18 |
| 2 | Phản ứng hỗ trợ có mô hình và giới hạn | PASS (manifest, 72 mục) |
| 3 | 2D đầy đủ | PASS |
| 4 | 3D thực sự nâng cấp và thao tác tốt | PARTIAL: có nâng cấp, thao tác qua E2E; chưa ở mức sản phẩm |
| 5 | Sandbox hoàn thiện | PARTIAL: có Khám phá và 5 kịch bản mới; bố cục chưa đổi |
| 6 | 5 Guided Lab qua giao diện | PASS |
| 7 | Không hỗ trợ thì báo trung thực | PASS |
| 8 | Hoàn tác, Đặt lại, Lưu, Mở nhất quán | PASS (S18–S20, X02, X04, G10) |
| 9 | Không mất dữ liệu, không treo | PASS trong phạm vi test |
| 10 | Build, hồi quy, kiểm thử bắt buộc | PARTIAL: WebKit P01 chế độ "Cao" FAIL (§15); phần còn lại PASS |
| 11 | Bằng chứng hình ảnh và khoa học | PASS (`final/`) |
| 12 | Không ảnh hưởng Production 6.7.0 | PASS |

URL thử: http://localhost:5173/#dlab. Thẻ "Khám phá" nằm ở bảng bên phải, chế độ "Tự do".
