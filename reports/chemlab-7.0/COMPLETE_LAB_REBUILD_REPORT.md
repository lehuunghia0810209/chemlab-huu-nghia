# ChemLab 7.0 — Complete Lab Rebuild Report (bản 2)

Cập nhật 24/11/2026. Báo cáo này viết cho chủ sở hữu để nghiệm thu.

| Mục | Giá trị |
|---|---|
| Repo | `D:\EduLab\ChemLab` |
| Nhánh | `feature/chemlab-7.0-dynamic-laboratory` |
| Bản 1 | `a14ab46` → `ea7ee23` (đã commit cục bộ) |
| Bản 2 | Tiếp từ `ea7ee23`; **chưa commit**, xem §19 |

**Phạm vi:**
- Chỉ sửa Dynamic Lab.
- Không động tới ChemAI, Groq, Cloudflare, Production 6.7.0 hay các Lab khác.
- Không push, không merge, không deploy, không đổi version.

**Trạng thái: PARTIAL.** Các lý do chưa đạt nghiệm thu kỹ thuật toàn phần nằm ở §20; trong đó quan trọng nhất là:
1. **WebKit chế độ "Cao"** dưới 30 fps trong điều kiện máy lúc đo. Bản cũ cho số đo y hệt khi đo xen kẽ (§15).
2. **3D đã nâng cấp nhưng chưa ở mức "sản phẩm"** như directive mô tả (§10).
3. **Các giới hạn khoa học còn lại** (§18).
4. **Toàn bộ thay đổi bản 2 chưa commit**, vì lệnh `git commit` bị bộ phân loại quyền chặn.

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

**Bản 2: chưa commit.** Lệnh `git commit -- <đường dẫn cụ thể>` bị bộ phân loại quyền của Claude Code chặn ("Destructive or Unwanted Actions"), dù directive cho phép commit cục bộ. Tôi không tìm cách lách. Thay đổi nằm trong working tree:
- Sửa: `src/dlab/{data/materials.js,data/reactions.js,engine/chemistry.js,engine/processes.js,ui/dlabApp.js,ui/dlab.css,ui/labels.js,ui/render2d.js,ui/render3d.js}`, `scripts/test-dlab.mjs`, `scripts/lib/dlab-journeys.mjs`, `scripts/dlab-guided-walk.mjs`, `reports/chemlab-7.0/{COMPLETE_LAB_REBUILD_REPORT.md,PROGRESS.md}`.
- Mới: `src/dlab/data/manifest.js`, `scripts/dlab-manifest.mjs`, `scripts/dlab-final-evidence.mjs`, `reports/chemlab-7.0/final/`.

Các file `.claude/` của chủ sở hữu, `QA_CODEX_FULL_AUDIT.md` và `qa-codex/` không được đụng tới.

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
