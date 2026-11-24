# ChemLab 7.0 — Complete Lab Rebuild Report

Ngày: 24/11/2026 · Repo `D:\EduLab\ChemLab` · nhánh `feature/chemlab-7.0-dynamic-laboratory` · từ `a14ab46` đến commit ở §19.
- Chỉ sửa Dynamic Lab.
- ChemAI, Groq, Cloudflare, Production 6.7.0 và các Lab khác: không động tới.
- Không push, không merge, không deploy, không đổi version.

**Trạng thái: PARTIAL, chờ chủ sở hữu nghiệm thu.**
- Đã làm xong:
  - Lỗi người dùng báo (bài Kết tủa bước 5) được tái hiện và sửa tận gốc.
  - Kiểm toán kiến trúc và khoa học độc lập 2 vòng (Antigravity).
  - Sửa 4 lỗi P0 và 12 lỗi P1 đã được kiểm chứng.
  - Cả 5 Guided Lab hoàn thành qua giao diện thật.
- Chưa làm: “viết lại toàn bộ” và nâng cấp 3D lớn mà directive mô tả. Lý do ở §1, các hạng mục còn thiếu ở §18.

## 1. Executive summary

**Quyết định kiến trúc: KEEP lõi, REFACTOR có trọng điểm, không REPLACE.**

Audit (của tôi và của Antigravity) xác nhận hệ thống đã đạt nguyên tắc “ONE STATE — ONE CORE — MULTIPLE VIEWS”:
- Một `sim.state` và một `sim.dispatch` (đi qua kiểm tra an toàn `assess`), với bước thời gian cố định tách khỏi FPS.
- 2D, 3D và Guided Lab chỉ *đọc* state; renderer không thay đổi thành phần hóa học.

Các lỗi người dùng gặp không nằm ở chỗ thiếu một engine mới, mà ở:
1. Cách chọn đích mặc định và việc giữ lựa chọn trên thanh thao tác.
2. Điều kiện hoàn thành bước đọc sai đối tượng.
3. Những lỗ hổng cụ thể trong engine: bảo toàn chất, vượt quá lượng axit, phản ứng bị bỏ qua im lặng.

Viết lại khoảng 6.000 dòng đang có 61 E2E và 57 unit test sẽ có rủi ro hồi quy lớn hơn lợi ích. Tôi sửa đúng chỗ hỏng, mỗi sửa có test chứng minh nó hỏng trên code cũ.

## 2. Kiến trúc (sau đợt này)

Luồng xử lý: Thao tác → `assess` (an toàn) → lệnh trong `sim.js` → bước mô phỏng (`processes.js`, `chemistry.js`) → sự kiện (`log`/`notes`) → 2D/3D → Quan sát → điều kiện bước Guided (`guided.js`, chỉ đọc state).

| Lớp | File | Trạng thái |
|---|---|---|
| Hóa chất, ion, kết tủa, nguồn | `data/materials.js` | KEEP; thêm 4 kết tủa |
| Phản ứng, E°, gợi ý “chưa hỗ trợ” | `data/reactions.js` | REFACTOR: thêm `ION_E0`, `ION_HINTS`, gợi ý theo pH |
| Cân bằng, pH, kết tủa | `engine/chemistry.js` | KEEP; sửa ghi chú trung hòa |
| Động học, hòa tan, khí, điện hóa | `engine/processes.js` | REFACTOR: bảo toàn, chặn vượt lượng axit, khí theo từng bình, phân loại phản ứng |
| Lệnh, undo, bất biến | `engine/sim.js` | KEEP; thay dụng cụ giữ vai trò trong bài, chặn NaN V |
| Guided Lab | `guided.js` + `ui/dlabApp.js` | REFACTOR: điều kiện theo đúng vật, phục hồi, đồng bộ Hoàn tác/Đặt lại |
| 2D / 3D | `ui/render2d.js`, `ui/render3d.js` | REFACTOR: kết tủa, bọt khí, dầu, catot, dây, tường |

## 3. Hệ thống giữ lại

- Lõi mô phỏng với bước cố định H = 1/60 s; tốc độ 0,25–4×; tua nhanh chạy chính mô hình.
- Mô hình pH theo cân bằng điện tích; Ksp; thủy phân Cu²⁺ (IUPAC); định luật Faraday; phương trình Nernst.
- Bộ điều khiển tương tác dùng chung cho 2D và 3D.
- Lưu, mở, hoàn tác (có migration).
- Toàn bộ sửa lỗi của `acfaaae` và `34fd4de`.

## 4. Hệ thống viết lại hoặc sửa lớn

1. **Xác định đích theo ID vật** (`vessels()`, `patch()`, `misplaced()`): nguyên nhân gốc lỗi bước 5. Chi tiết ở §12.
2. **Lượng khí theo từng bình** (`releaseGas`): bước bài chỉ đọc khí của chính bình đích.
3. **Phân loại phản ứng** (REACTION / NO_REACTION / UNSUPPORTED), thay cho việc im lặng.
4. **Bảo toàn chất**: kết tinh, vượt quá lượng H⁺, bảo vệ khi lưu.
5. **Tính toàn vẹn của Guided Lab**: điều kiện bước, vật bị cất, thay dụng cụ, Hoàn tác/Đặt lại.

## 5. Chemistry Engine — thay đổi đã kiểm chứng

| Lỗi | Kịch bản hỏng (đã tái hiện) | Sửa |
|---|---|---|
| Tự sinh Na (P0) | Thả NaCl vào HCl đậm đặc: tinh thể lớn lên bằng Na không có nguồn | Lượng đã tan tính theo ion thiếu nhất; tinh thể không lấy lại nhiều hơn lượng đã tan |
| NaHCO₃ giả (P0) | Đun sôi Na₂CO₃ thì kết tinh NaHCO₃ | Không kết tinh từ tổng carbonat |
| Vượt quá lượng axit (P0) | Mg + 5 mL HCl nóng: pH tăng vọt lên 13,6 và có Mg(OH)₂ | Mỗi bước tiêu thụ tối đa ½ lượng H⁺ tự do |
| Fe/Zn/Mg + FeCl₃ (P0) | Sinh H₂ giả do pH 1,5 | Báo “Chưa hỗ trợ” trước khi xét bất kỳ quy tắc nào |
| Im lặng (P1) | Mg + CuSO₄, Fe/Zn + AgNO₃, FeCl₃ + KI, Cu²⁺ + I⁻, Zn(OH)₂ trong kiềm dư, Cu²⁺ + NH₃ dư, Zn + NaOH | Phân loại theo E° (CRC) và các gợi ý ion/pH |
| Ghi “trung hòa” sai (P1) | CuSO₄ + NaOH bị ghi “H⁺ + OH⁻ → H₂O” | Chỉ ghi khi cả H⁺ và OH⁻ cùng phản ứng (> 10⁻⁵ mol) |
| Lỗi lưu (P1) | Số dư −1e−17 sau khi chất phản ứng hết làm hỏng bản lưu | Dung sai −1e−12, giống `checkInvariants` |
| Kết tủa còn thiếu | ZnSO₄ + NaOH, BaCl₂ + Na₂CO₃… không có gì xảy ra | Thêm BaCO₃, ZnCO₃, Ag₂CO₃, Zn(OH)₂ (Ksp CRC) |
| Kết tủa “ít tan” sai | CaSO₄, Ag₂SO₄ (giai đoạn trung gian) làm phép thử Cl⁻/SO₄²⁻ bị đục | Gỡ bỏ, ghi thành giới hạn |

## 6. Physics và hiển thị chất lỏng

- **Kết tủa (2D):**
  - Độ đục tỉ lệ với nồng độ kết tủa đang lơ lửng (mol/L, lấy từ engine × tỉ lệ hạt chưa lắng).
  - Hạt vẽ thành bông tròn có viền.
  - Kích thước bông được phóng to để nhìn thấy; đây là xấp xỉ trực quan, không phải kích thước hạt thật.
- **Bọt khí:** có thân trong suốt, viền rõ và điểm sáng. Số bọt vẫn tỉ lệ với lượng khí (`BUBBLE_MOL`).
- **3D:**
  - Lớp dầu nổi trên nước, nhìn từ trên thấy màu dầu.
  - Catot đổi màu đồng theo `cuDeposit`.
  - Dây điện (nguồn → điện cực, dây vôn kế).
  - Tường nền hiện ở mọi mức đồ họa.
- Từ trước: dòng rót khi nghiêng, mặt thoáng ngang, lắng, khuấy, chất rắn tan dần, lớp phủ Cu theo độ dày.

## 7. Phạm vi phản ứng

**Có mô hình định lượng:**
- Axit/bazơ với 4 chất chỉ thị, pH, trung hòa, pha loãng.
- Kết tủa: AgCl, AgI, BaSO₄, CaCO₃, Cu(OH)₂, Fe(OH)₃, Fe(OH)₂, Mg(OH)₂, BaCO₃, ZnCO₃, Ag₂CO₃, Zn(OH)₂.
- Kim loại: Mg/Zn/Fe + H⁺; Fe/Zn + Cu²⁺; Cu + Ag⁺; Na + nước; CaCO₃ + axit.
- Hòa tan và kết tinh: NaCl, KNO₃, NaHCO₃ (chỉ tan).
- CO₂ (NaHCO₃ + axit, sục CO₂).
- Điện phân CuCl₂; pin Daniell (Nernst).
- Phân lớp dầu/nước; etanol tan trong nước.

**Báo “Không có phản ứng”** kèm lý do: Cu + H⁺; các cặp kim loại/ion có E° của ion thấp hơn (ví dụ Zn + Mg²⁺).

**Báo “Chưa hỗ trợ mô phỏng phản ứng này”:**
- Cu + HNO₃ (pH ≤ 3); Fe/Cu/Zn/Mg + Fe³⁺; Fe³⁺ + I⁻; Cu²⁺ + I⁻.
- Ag⁺ trong kiềm (Ag₂O); Zn(OH)₂ hoặc Zn trong kiềm mạnh; Cu²⁺ + NH₃ dư.
- Các cặp kim loại/ion có E° của ion cao hơn mà chưa có quy tắc (Mg + Cu²⁺, Fe/Zn + Ag⁺).

**Vẫn chưa mô hình hóa** (chi tiết ở §18):
- Na + etanol (hiện không có phản ứng và cũng không có thông báo).
- CuSO₄ + KI khi điện phân (hiện vẫn sinh Cl₂).
- Etanol sôi ở 78 °C; CuO khi đun Cu(OH)₂.

## 8. Kiểm chứng khoa học

| Mô hình | Loại | Nguồn | Test |
|---|---|---|---|
| Ksp, độ tan, E°, ΔH | Có kiểm chứng (hằng số) | CRC Handbook, NBS 1982, IUPAC Powell 2007/2013 (`SOURCES` trong `materials.js`) | `scripts/test-dlab.mjs` (đối chiếu số liệu độc lập) |
| Phân loại kim loại/ion theo E° | Có kiểm chứng (định tính) | CRC, Electrochemical Series | test “reaction coverage” |
| Hằng số tốc độ k, ngưỡng tạo mầm 10·Ksp | Xấp xỉ giáo dục | `SOURCES.model` | ghi rõ trong bài học |
| Độ đục, kích thước bông kết tủa, bọt khí | Xấp xỉ trực quan | — | — |
| Hệ số hoạt độ | Lý tưởng (γ = 1); cảnh báo khi I > 0,1 M | — | lý do gỡ CaSO₄/Ag₂SO₄ |

Antigravity đã đối chiếu các hằng số. Hai chênh lệch được ghi nhận nhưng chưa đổi (cần chuyên gia duyệt):
- Ksp Cu(OH)₂: 2,2·10⁻²⁰ (CRC) so với 4,8·10⁻²⁰ (IUPAC Powell 2007, doi:10.1351/pac200779050895).
- Khối lượng riêng etanol 0,789 g/mL là giá trị ở 20 °C.

## 9. 2D Workspace

Giữ nguyên các chính sách đã làm ở `34fd4de`:
- Bàn không tự dịch chuyển khi người dùng đang thao tác.
- Hình đinh đúng; nhãn tránh panel; có phản hồi khi thả.

Đợt này thêm:
- Hiển thị kết tủa và bọt khí rõ hơn.
- Đích mặc định đúng theo bước bài.

## 10. 3D Laboratory

Như §6. Nhận diện vật thể vẫn dựa trên hình dạng dựng bằng code (chai có nhãn, ống nghiệm, pipet…).

**Không** làm nâng cấp vật liệu, ánh sáng hay mô hình 3D lớn trong đợt này (§18).

## 11. Tương tác dụng cụ

- **Đích mặc định:**
  - Trong mọi ô “Rót / Nhỏ / Thả vào”, bình đích của bước hiện tại (theo ID) đứng đầu.
  - Với chất rắn đang được kẹp, đích là bình mà bước chỉ định cho chính chất đó.
- **Không mang lựa chọn sang vật khác:** lựa chọn chỉ được giữ khi vẽ lại thanh của *cùng một* vật. Thanh của vật khác luôn được dựng lại.
- **Thay dụng cụ hỏng:** dụng cụ thay thế tiếp nhận vai trò trong bài.

## 12. Guided Lab

**Lỗi người dùng báo** (Kết tủa bước 5: đích hiển thị “Cốc B — HCl”, muối lại tan trong Cốc A, bài không hoàn thành):
- Có hai nguyên nhân, đều nằm ở thanh thao tác:
  1. Đích mặc định là bình *gần nhất*. Chai HCl đặt cạnh Cốc B (nước), nên HCl bị rót vào Cốc B.
  2. Bản sửa `34fd4de` giữ lựa chọn `to` khi chuyển sang **vật khác**, nên thìa muối thừa hưởng “Cốc A” từ chai HCl.
- Đã sửa cả hai.
- Thêm dòng phục hồi: “Muối ăn đang ở Cốc A, không phải Cốc B. Lấy mẩu mới và thả vào Cốc B.”
- Test G09 hỏng trên `a14ab46` và đạt sau khi sửa.

**Điều kiện hoàn thành bước:** từng điều kiện được rà lại, chỉ đọc bằng chứng của chính vật đích.

| Bài, bước | Trước | Sau |
|---|---|---|
| Axit–bazơ 2–3 | Một giấy quỳ đã dùng, chạm qua ống khác cũng tính | Giấy đang ở trong ống đó, hoặc ống đó là ống đầu tiên nó chạm |
| Axit–bazơ 5 | Pha loãng hay đổ ống đi cũng đạt | Ống B phải có Cl⁻ (đã thêm HCl) và pH < 8,2 |
| Kết tủa 4 | Đổ cốc ra cũng đạt (dựa vào ghi chú cũ) | Cu²⁺ đã tan trở lại và có Cl⁻ trong chính Cốc A |
| Kết tủa 5 | Thả một nhúm 0,1 g cũng đạt | Tổng ≥ 1,8 g muối đã tan trong Cốc B (một hay nhiều lần lấy) |
| Kim loại 3 | Khí H₂ của toàn bàn | Viên kẽm trong Cốc B đã phản ứng, và H₂ sinh ra từ chính Cốc B |
| Điện phân 1 | Lệch 1 mm so với engine (bước đạt nhưng không có dòng điện) | Dùng đúng điều kiện ngâm của engine |
| Điện phân 2 | Nguồn nối sang cốc khác cũng đạt | Dây nối từ chính nguồn này tới chính điện cực này |
| Hữu cơ 2 | CO₂ toàn bàn; CaCO₃ cũng đạt | CO₂ từ ống A và có NaHCO₃ trong ống A |
| Hữu cơ 3–4 | Đổ hết nước đi vẫn đạt | Trong ống vẫn còn nước |

**Không treo, có phục hồi:**
- Cất một vật của bài không còn làm dừng vòng render (lỗi P0). Thanh bước báo cách phục hồi.
- Chỉ vật của *bước hiện tại* mới có thể chặn tiến độ.
- Hoàn tác và Đặt lại lùi cả tiến độ bài.

**Giảm chữ:**
- Thanh bước chỉ còn: nhiệm vụ, “Thao tác với”, dòng tiến độ, các nút Gợi ý / Bài học / Tua.
- “Hoàn thành khi” chuyển vào phần Gợi ý.
- Phần giới thiệu bài thu gọn sẵn.

**Chạy thử thật** (`scripts/dlab-guided-walk.mjs`, chỉ dùng điều khiển nhìn thấy, có chuyển 2D ⇄ 3D):

| Bài | Kết quả |
|---|---|
| Axit–bazơ | 5/5 |
| Kết tủa | 5/5 |
| Kim loại | 5/5 |
| Điện phân | 5/5 |
| Hữu cơ | 4/4 |

0 lỗi console, 0 request ChemAI.

## 13. Sandbox

- Các E2E S01–S25 đạt.
- Mới: phân loại phản ứng thay vì im lặng; có thêm kết tủa; không còn sản phẩm giả trong các kịch bản ở §5.
- **Chưa** thiết kế lại giao diện Sandbox (§18).

## 14. An toàn

Giữ nguyên `assess`:
- Natri trong ống hẹp hoặc trong axit bị chặn.
- Cảnh báo khí Cl₂.
- Phản hồi xanh/đỏ khi thả lấy từ chính các luật này.

Không thêm hiệu ứng cháy nổ.

Còn tồn tại: khi đang kéo, cốc có thể bị nung trên bếp trước khi `assess` của lệnh `move` kịp chạy (§18).

## 15. Hiệu năng

| Trình duyệt | Đồ họa cao | Tiết kiệm | Ngưỡng | Kết quả |
|---|---|---|---|---|
| Chromium | 60,0 fps (p95 16,8 ms) | 60,0 | 30 | PASS |
| Firefox | 40,4 fps (p95 33,5 ms) | 39,7 | 30 | PASS |
| WebKit | 30,2 fps (p95 41,0 ms) | 38,7 | 30 | PASS (sát ngưỡng; lần đo trước đó trong ngày là 29,1 fps — FAIL) |

- Môi trường đo: Playwright headless, renderer phần mềm (không có GPU thật), cảnh bận 480 hạt.
- Ngưỡng giữ nguyên.
- Phần 3D thêm mới (dây, catot, dầu) tái sử dụng vật liệu và dọn tài nguyên trong `dispose()`. Antigravity đã kiểm tra: không rò tài nguyên GPU.

## 16. QA evidence

| Lệnh | Kết quả |
|---|---|
| `node scripts/test-dlab.mjs` | **57/57** (thêm 6 test; mỗi test mới đã kiểm chứng hỏng trên code cũ) |
| `npx vite build` | PASS |
| `node scripts/dlab-e2e.mjs` (Chromium) | **61/61** (thêm G09 và G10; cả hai hỏng trên code cũ) |
| `npm run check` | PASS (exit 0) |
| E2E Firefox / WebKit | Firefox 57/58 ở lượt đầu: S13 (lấy mẫu pixel lớp dầu) hỏng chập chờn 1/3 lần, do test lấy mẫu trước khi bàn căn lại khung xong. Đã thêm `settled()` (tiêu chí giữ nguyên), sau đó đạt 5/5 lượt. WebKit 58/58 |
| `npm run check:browser` | **448/448** PASS |
| Chạy thử 5 bài trên giao diện | 5/5 bài (`rebuild/guided-walk.json`, `rebuild/walk-*.png`) |

**Ảnh:**
- Trước: `qa-codex/*` (Codex trên `acfaaae`), `post-codex/*` (trên `34fd4de`).
- Sau: `rebuild/shots/ppt-bubbles-v2-2d.png` (kết tủa và bọt khí), `rebuild/shots/3d-organic.png` (lớp dầu trong 3D), `rebuild/shots/3d-electrolysis.png` (dây và điện phân), `rebuild/walk-*.png`.
- **Không có video:** tôi không quay video trong phiên này.

## 17. Đóng góp của Antigravity (AI phụ)

- Chạy bằng `agy -p --mode plan`, model `gemini-4-neon-high`, **chỉ đọc**, không sửa file và không chạy lệnh.
- Lượt đầu bị chặn quyền chạy lệnh terminal, nên không có kết quả. Tôi không bật `--dangerously-skip-permissions`; chạy lại với chỉ công cụ đọc file thì có kết quả.
- **Review 1** (`rebuild/agy-audit.md`): kiểm toán kiến trúc và khoa học, nêu 4 lỗi P0, 6 P1, 4 P2, 3 P3, kèm số dòng, kịch bản hỏng và nguồn.
- **Review 2** (`rebuild/agy-review2.md`): review đối kháng các sửa đổi của tôi, nêu 5 lỗi P1 và 5 P2 do chính tôi gây ra hoặc bỏ sót.
- **Phân công:**
  - Claude: kiểm chứng từng phát hiện với mã nguồn, quyết định sửa hay không, viết code và test, xác nhận test hỏng trên code cũ.
  - Antigravity: không sửa dòng code nào.
- Không dùng nguồn nào của Antigravity mà chưa đối chiếu. Hai nguồn IUPAC (doi) được ghi lại nhưng chưa dùng để đổi hằng số.

## 18. Giới hạn đã biết (chưa làm trong đợt này)

**Phạm vi directive chưa làm:**
- Viết lại kiến trúc (quyết định KEEP, ở §1).
- Nâng cấp lớn hình ảnh 3D: vật liệu thủy tinh, ánh sáng, mô hình dụng cụ chi tiết.
- Thiết kế lại giao diện Sandbox; video hiện tượng.
- Lượt QA trình duyệt độc lập của Antigravity: chế độ headless không chạy được trình duyệt vì không có quyền chạy lệnh.

**Còn tồn tại trong engine** (Antigravity báo, đã kiểm chứng, chưa sửa):
- Etanol được coi là “dung môi nước”:
  - pH của etanol tinh khiết = 7.
  - Dầu nổi trên etanol (sai: etanol nhẹ hơn dầu).
  - Etanol không sôi ở 78 °C.
- Điện phân CuCl₂ + KI vẫn sinh Cl₂.
- Pin Daniell luôn tính ở 25 °C.
- Axit yếu ngừng tấn công kim loại khi pH > 3.
- Nhiệt trung hòa vẫn hơi dư khi tạo kết tủa hiđroxit (≤ 1–2 °C).
- Khi đang kéo, cốc có thể bị nung trên bếp trước khi kiểm tra an toàn chạy.
- Lượng nước không giảm khi natri phản ứng (< 0,2 mL).
- `c.unsupported` không tự xóa khi lấy chất rắn ra.
- Kết luận trong bảng Quan sát có thể gán nhầm cốc khi hai cốc chạy cùng một phản ứng.

**Mô hình:**
- Hệ số hoạt độ lý tưởng (γ = 1), nên gỡ CaSO₄ và Ag₂SO₄.
- Ngưỡng tạo mầm 10·Ksp; mô hình trộn đều tức thì (cần khoảng 3 mL NaOH mới có kết tủa).
- Hằng số tốc độ k là xấp xỉ giáo dục.

**Chưa thử:** thiết bị cảm ứng thật, GPU thật, học sinh thật.

## 19. Git commits (cục bộ, chưa push)

| Commit | Nội dung |
|---|---|
| `fc43ae4` | Đích theo ID vật, không mang lựa chọn sang vật khác, khí theo từng bình (lỗi bước 5) |
| `1707961` | Phân loại theo E°, kết tủa và bọt khí 2D, giảm chữ Guided, tường nền 3D |
| `6f2bc1c` | Sửa theo review Antigravity 1: bảo toàn chất, vượt lượng axit, ưu tiên “chưa hỗ trợ”, toàn vẹn Guided |
| `a306197` | 3D (dầu, catot, dây); bước điện cực khớp engine; chặn NaN V |
| `15e6d45` | Sửa theo review Antigravity 2 |

Các file `.claude/` của chủ sở hữu, `QA_CODEX_FULL_AUDIT.md` và `qa-codex/` không nằm trong commit nào.

## 20. Acceptance checklist

| Gate | Trạng thái |
|---|---|
| A — Scientific Core | PARTIAL: các phản ứng được hỗ trợ đã kiểm chứng; còn các giới hạn ở §18 |
| B — Simulation | PASS trong phạm vi test: rót, nhỏ, hút, thả, gắp, khí, kết tủa, bảo toàn |
| C — Guided Lab | PASS: 5/5 bài, đúng đích, có phục hồi, không hoàn thành nhầm do sự kiện cũ |
| D — 2D & 3D | PARTIAL: cùng state; đã bổ sung dầu, catot, dây trong 3D; chưa nâng cấp đồ họa lớn |
| E — User Experience | PARTIAL: ít chữ hơn, đích đúng, không bấm lặp; chưa thử với học sinh thật |
| F — Technical | PASS: build, unit 57/57, E2E 61/61 · 58/58 · 58/58 (sau khi sửa đồng bộ S13), 448/448, 0 lỗi console, 0 request ChemAI tự động. FPS WebKit sát ngưỡng 30 |

**Hướng dẫn nhanh cho người dùng:**
1. Chọn “Có hướng dẫn” rồi chọn bài.
2. Đọc thanh bước phía trên bàn; bấm “Gợi ý” khi cần.
3. Chọn dụng cụ trên bàn: thanh thao tác đã chọn sẵn đúng cốc của bước.
4. Bấm thao tác (Rót / Nhỏ / Thả…); dòng tiến độ cho biết đã đạt hay còn thiếu.
5. Bước chờ: bấm “Tua đến hiện tượng”.
6. Sai cốc: làm theo dòng hướng dẫn phục hồi, hoặc bấm Hoàn tác.

URL: http://localhost:5173/#dlab
