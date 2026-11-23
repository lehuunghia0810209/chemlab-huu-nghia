# ChemLab 7.0 — UI/UX Rescue & 3D Redesign

Ngày: 2026-11-23 · Nhánh `feature/chemlab-7.0-dynamic-laboratory` · Không đổi Chemistry Engine, hằng số, ChemAI, quota hay Lab khác · Version vẫn 6.7.0 · Chưa push, chưa merge, chưa deploy.

Trạng thái: **READY FOR USER ACCEPTANCE**. Đây không phải RELEASE READY: kiểm thử tự động không thay được buổi nghiệm thu với người dùng thật.

Bằng chứng nằm trong `reports/chemlab-7.0/ux/`:
- **Ảnh `before-*` và `after-*`:** cùng kích thước màn hình và cùng kịch bản.
- **`*-journey.json`:** từng bước của kịch bản người mới dùng.

Cả hai đều do `scripts/dlab-ux-journey.mjs <nhãn>` sinh ra. Script này chỉ thao tác qua các điều khiển nhìn thấy trên màn hình, và không thay cho người dùng thật.

## 1. Vấn đề UX phát hiện (đo trên bản cũ, ảnh `before-*`)

| # | Vấn đề | Bằng chứng |
|---|---|---|
| 1 | Bàn thí nghiệm nhỏ: chỉ chiếm 24–29% màn hình ở 1366–1920 px. Cốc 100 mL cao khoảng 80–92 px ở 1366–1440 px. | `before-journey.json` → `viewports` |
| 2 | 39 nút hiển thị cùng lúc. Bảng bên phải dày thông số (pH, lực ion, định lượng, form rót) ngay cả khi chưa cần. | `before-first-1440.png` |
| 3 | **Không làm được thí nghiệm natri–nước từ giao diện.** Sau hộp nhập khối lượng, hộp cảnh báo an toàn tự đóng như thể người dùng đã bấm "Hủy", nên natri không bao giờ được thả vào nước. | `before-journey.json`: bước "Natri đã vào nước" = MISS |
| 4 | Gõ "natri" thì mục đầu tiên là chai NaOH. Gõ không dấu ("nuoc") thì không ra kết quả. | Chạy thử journey |
| 5 | Muốn thả chất rắn phải chọn cốc trước, nhưng giao diện không nói ra điều đó. Rót chỉ thị mặc định là 5 mL. | `before-journey-*` |
| 6 | Ống nhỏ giọt và đũa lơ lửng giữa không trung. Khung chọn trông như khung debug. | `before-first-*` |
| 7 | Nhiều thao tác chỉ làm được bằng phím tắt: nghiêng/rót cần lăn chuột hoặc phím `[ ]`. | Mã nguồn và gợi ý trong UI cũ |
| 8 | Nhật ký trộn lẫn thao tác với hiện tượng. Mỗi lần bấm "Dọn dẹp" lại thêm một dòng giống hệt, kể cả khi bàn đã sạch. | `sim.js` cleanup |
| 9 | 3D chỉ gồm hình trụ thô, không có nắp chai, nhãn hay bóng tiếp xúc. Chọn vật thì hiện khung `Box3Helper`. Chất lỏng nghiêng cùng cốc. | `before-journey-7-3d.png` |
| 10 | Không có hướng dẫn ban đầu. Bài Guided Lab đè lên bàn. | `before-first-*` |

## 2. Nguyên nhân gốc

- **(3) Hộp thoại:** `openModal` gán `dialog.onclose`. Sự kiện `close` của hộp thoại trước đến muộn, sau khi hộp kế tiếp đã mở, và kích hoạt `onclose` của hộp mới, coi như "Hủy". Đã sửa: chỉ hủy khi hộp thoại thực sự đã đóng (`!dialog.open`).
- **(1, 2, 10) Bố cục:** lưới ba cột cố định gồm thư viện 248 px và bảng 300 px, cộng sidebar của app. Mọi thông số đều hiển thị ngay, không theo mức độ cần thiết.
- **(6) Vật lơ lửng:** dụng cụ được tạo ở y = 90–150 mm và giữ nguyên chỗ khi thả.
- **(8) Nhật ký lặp:** `cleanup` luôn ghi log, kể cả khi không có gì để dọn.
- **(9) 3D:** chỉ dùng hình trụ và hộp cơ bản. Chất lỏng là một khối xoay quanh trục, không có mặt thoáng riêng.

## 3. Những thay đổi đã thực hiện

**Bố cục "bàn thí nghiệm trước, điều khiển sau"** (`dlabApp.js`, `dlab.css`)
- Bàn chiếm toàn bộ khung Lab.
- Thư viện (trái) và bảng Quan sát/Chi tiết (phải) là ngăn kéo nổi, thu gọn được. Trên tablet và điện thoại chúng thành bảng trượt từ đáy.
- Khung nhìn tự căn vật thể vào vùng không bị che (`view.ox`). Chừa sẵn khoảng phía trên để nhấc cốc khi rót.
- Tiêu đề gọn lại:
  - Chế độ **Tự do / Có hướng dẫn**.
  - Nút **Xem 3D**, nút **?** để mở lại hướng dẫn.
  - Menu **⋯** chứa Lưu, Mở, Dọn bàn, Đồ họa, Toàn màn hình.
  - Nút Hỏi ChemAI (chỉ chạy khi người dùng bấm).
- Thanh điều khiển nổi phía dưới: Tạm dừng, tốc độ, thời gian, Hoàn tác, Đặt lại, Vừa khung, và Góc mặc định khi ở 3D.
- Khi đang cầm vật, các lớp nổi mờ đi và cho chuột xuyên qua. Nhờ vậy cốc nhấc lên không bị che, và con lăn chuột vẫn nghiêng được cốc.

**Thanh thao tác theo ngữ cảnh:** chọn một vật thì các thao tác chính hiện ngay trên bàn, không cần phím tắt.

| Vật | Thao tác chính |
|---|---|
| Chai hóa chất | **Rót [mL] vào [cốc] → Rót vào cốc** |
| Chai chất chỉ thị | **Nhỏ 3 giọt vào cốc** |
| Cốc | Rót sang cốc khác. **Nghiêng tay** bằng thanh trượt: đưa cốc lên trên cốc nhận rồi nghiêng; lượng rót vẫn do mô phỏng quyết định. Khuấy. |
| Ống nhỏ giọt / pipet | Hút từ…, nhỏ 1 giọt hoặc 5 giọt vào… |
| Kẹp / thìa | Lấy… rồi thả vào… |
| Giấy quỳ / nhiệt kế / máy pH | Nhúng hoặc đo trong…, rồi Lấy ra |
| Đũa thủy tinh | Khuấy… |
| Bếp | Bật/tắt |

Thông số nâng cao (pH, lực ion, định lượng, rót chính xác) chuyển sang tab **Chi tiết vật**. Phím tắt vẫn giữ nguyên cho người dùng nâng cao.

**Thư viện** (`library.js`, `icons.js`)
- Có biểu tượng cho từng loại dụng cụ và hóa chất.
- Tìm kiếm không cần dấu.
- Mục khớp đúng tên gốc xếp đầu: "natri" → Natri (mẩu). "nước" → Nước cất.
- Thả chất rắn khi chưa chọn cốc: tự chọn cốc duy nhất đang có chất lỏng, hoặc hỏi "Thả … vào đâu?".
- Dụng cụ mới lấy ra và dụng cụ thả giữa không trung đều nằm trên mặt bàn. Ngoại lệ là khi đang ở trên hoặc trong một cốc.

**Bảng Quan sát** (`observations.js`): ba nhóm ưu tiên.
1. **Đang diễn ra:** phản ứng đang xảy ra, lấy từ `activeReactions` của mô phỏng.
2. **Kết luận:** hiện khi phản ứng kết thúc. Gồm phương trình, lời giải thích ngắn, màu chất chỉ thị và môi trường. Tất cả tính từ pH thật của dung dịch, không gán cứng.
3. **An toàn**, rồi đến **Quan sát được**.

Nhật ký thao tác được thu gọn. Các dòng lặp liền nhau gộp lại kèm "×n", không mất dữ liệu. `cleanup` chỉ ghi log khi thực sự dọn được gì. Khi có phản ứng đầu tiên, bảng tự mở trên màn hình rộng; trên điện thoại chỉ hiện chấm báo.

**Khung phóng to vùng phản ứng (2D):** mẩu natri thật chỉ khoảng 3 mm. Khi có phản ứng, cốc liên quan được vẽ thêm ở góc màn hình với độ phóng ×1,5 trở lên. Đây là cùng renderer và cùng trạng thái, chỉ đặt camera gần hơn, không phóng đại kích thước thật.

**Hướng dẫn nhanh:** 4 thẻ gồm Thư viện → Bàn và thanh thao tác → Quan sát → Bắt đầu.
- Không chặn thao tác, có nút "Bỏ qua".
- Chỉ hiện ở lần đầu (`localStorage`); mở lại bằng nút **?**.
- Không tự làm thí nghiệm thay học sinh.

**3D** (`render3d.js`, dựng lại toàn bộ, chỉ dùng hình học thủ tục, không tải mô hình ngoài)
- **Dụng cụ thủy tinh:**
  - Thủy tinh có độ dày thành, viền miệng sáng và vạch chia ở đúng mức thể tích.
  - Ống nghiệm đáy tròn. Bình tam giác theo đúng biên dạng.
  - Chai có nắp và nhãn ghi công thức, tên.
- **Chất lỏng:**
  - Mặt thoáng luôn nằm ngang khi nghiêng nhờ mặt phẳng cắt theo phương ngang thế giới, đi qua điểm trên trục cốc ứng với mực chất lỏng. Đây là mô hình gần đúng bảo toàn thể tích cho thân hình trụ.
  - Vùng màu chất chỉ thị lấy từ chính lưới khuếch tán của mô phỏng nên lan dần đúng như 2D.
  - Dung dịch không màu giữ được độ trong, không trắng đục.
- **Vật rắn:** mẩu kim loại có hình khối gồ ghề, đinh sắt có mũ và mũi nhọn, dây đồng dạng cuộn, dải Mg, đống bột. Lớp Cu/Ag bám đổi màu theo lượng mol.
- **Dụng cụ:** ống nhỏ giọt có quả bóp cao su, kẹp, đũa, thìa. Nhiệt kế có cột đỏ đổi theo số đo; máy pH, nguồn điện và vôn kế có màn hình số.
- **Khác:**
  - Bóng tiếp xúc nhạt dần khi nhấc vật lên. Vòng sáng trên mặt bàn báo trạng thái di chuột, đang chọn hoặc đang cầm. Màu cam cho bước của Guided Lab.
  - Nhãn tên khi di chuột lên vật; khi đang kéo thì đổi thành "Đang cầm: …".
  - Bọt khí và hạt kết tủa phân bố quanh thân cốc, kèm lớp kết tủa lắng ở đáy.
- **Camera:**
  - Góc nhìn mặc định nhìn chính diện từ trên cao.
  - Góc quay bị giới hạn: không xuống dưới bàn, không quay quá ±57°. Khoảng cách tối thiểu 120 mm.
  - Zoom theo vị trí con trỏ. Các nút **Góc mặc định** và **Vừa khung**.
  - Vật vừa được chọn tự được kéo vào khung nhìn. Khung nhìn chừa chỗ cho các ngăn kéo đang mở.
- **Đồ họa và tài nguyên:**
  - Không có GPU (SwiftShader/llvmpipe): tự chuyển sang "Đồ họa: Tiết kiệm" và báo cho người dùng, trừ khi người dùng đã tự chọn chất lượng.
  - Chế độ tiết kiệm không dùng environment map và tường phông, ít phân đoạn hình học hơn, tắt khử răng cưa.
  - Mọi geometry, material và texture được giải phóng khi xóa vật hoặc khi tắt 3D.

**Engine:** chỉ đổi nội dung ghi log của lệnh `cleanup` trong `sim.js` (log khi có gì để dọn, trả về `changed`). Hóa học, vật lý, chất lỏng và an toàn giữ nguyên.

## 4. Thao tác đơn giản hơn thế nào

| Việc | Trước | Sau |
|---|---|---|
| Thêm 50 mL nước vào cốc | Lấy chai ra, chọn chai, mở form "Rót chính xác" trong bảng phải, nhập mL, chọn cốc, bấm Rót | Gõ "nước", bấm mục đầu, bấm **Rót vào cốc** |
| Thêm phenolphtalein | Như trên, mặc định 5 mL | Bấm mục trong thư viện, bấm **Nhỏ vào cốc** (3 giọt) |
| Thả natri | Phải chọn cốc trước; sau đó hộp cảnh báo tự hủy nên **không làm được** | Gõ "natri", bấm, nhập khối lượng, đọc cảnh báo, bấm "Tôi hiểu, tiếp tục". Cốc có nước được tự chọn; kẹp lấy rồi thả, sau đó đặt lại trên bàn |
| Rót từ cốc sang cốc | Kéo lên, giữ chuột, lăn chuột hoặc dùng phím `[ ]` | Kéo thanh **Nghiêng tay** (cách cũ vẫn dùng được) |
| Thấy hiện tượng | Đọc nhật ký 14 dòng lẫn thao tác | Thẻ "Đang diễn ra", khung phóng to, rồi "Kết luận" |
| Bắt đầu | Không có chỉ dẫn | Thẻ hướng dẫn 4 bước, mở lại được bằng **?** |

## 5. Kết quả quan sát phản ứng natri–nước (ảnh `after-journey-5/6/7`, `after-scene-sodium-*`)

Kịch bản: 150 mL nước, 0,3 mL phenolphtalein, 0,1 g Na.
- Mẩu natri nổi trên mặt nước, chạy qua lại và nhỏ dần. Bọt khí H₂ thoát ra quanh mẩu natri.
- Vệt hồng lan dần từ vị trí mẩu natri, ở cả 2D và 3D.
- Khi natri phản ứng hết, bảng Quan sát ghi:
  - "2Na + 2H₂O → 2NaOH + H₂↑".
  - Lời giải thích ngắn.
  - "Phenolphtalein chuyển hồng".
  - "Dung dịch có môi trường bazơ (pH ≈ …)", với pH lấy từ trạng thái mô phỏng.

E2E U02 kiểm tra rằng con số pH trong kết luận bằng đúng pH của mô phỏng.

## 6. Kết quả kiểm thử (tất cả thực sự đã chạy, 2026-11-23)

| Lệnh | Kết quả |
|---|---|
| `npm run check` (có `check:dlab` 45/45, gồm 4 bài mới) | PASS |
| `npm run check:browser` | PASS 448/448 |
| `node scripts/dlab-e2e.mjs` (Chromium) | PASS 47/47 (40 bài cũ + 7 bài mới U01–U07) |
| `CHEMLAB_BROWSER=firefox …` | PASS 44/44 |
| `CHEMLAB_BROWSER=webkit …` | PASS 44/44 |
| `node scripts/dlab-ux-journey.mjs after` | 10/10 bước người mới dùng (bản cũ: 7/10), 0 lỗi console |
| axe (trong E2E) | PASS |
| Yêu cầu ChemAI tốn token | 0 |

Bảy bài E2E mới:
- **U01:** hướng dẫn nhanh — hiện lần đầu, bỏ qua được, mở lại được.
- **U02:** làm thí nghiệm natri–nước chỉ bằng điều khiển nhìn thấy, đến tận phần kết luận.
- **U03:** nghiêng bằng thanh trượt, bảo toàn thể tích, cốc trở lại thẳng đứng và nằm trên bàn.
- **U04:** dụng cụ rơi về mặt bàn khi thả giữa không trung.
- **U05:** thanh thao tác theo ngữ cảnh và việc gộp nhật ký.
- **U06:** 3D — nhãn khi di chuột, chọn vật, Vừa khung, Góc mặc định.
- **U07:** điện thoại 390 px — thư viện là bảng trượt, không cuộn ngang.

Bài E2E cũ chỉ đổi đường thao tác cho khớp giao diện mới (mở tab "Chi tiết vật", mở menu ⋯). Không bài nào bị nới điều kiện.

Một lỗi phát hiện và đã sửa trong quá trình này: ở Firefox, cốc được nhấc lên nằm dưới thanh thao tác, nên con lăn chuột cuộn cả trang thay vì nghiêng cốc (S05).

## 7. Hiệu năng trước/sau (`scripts/dlab-perf-audit.mjs`)

Môi trường đo: Chromium headless, GPU giả lập phần mềm SwiftShader, 1440×900.

| Cảnh | FPS trước | FPS sau | Ghi chú |
|---|---|---|---|
| 2D thường (3 cốc) | 60 | 60 | |
| 2D bận (8 cốc, 480 hạt) | 60 | 60 | |
| 2D tiết kiệm | 60 | 60 | |
| 3D "Cao" (3 cốc) | 60 | **6,7** | Ép chất lượng Cao trên GPU giả lập phần mềm |
| 3D "Cao" (8 cốc) | 47,9 | **7,0** | Như trên |
| 3D "Tiết kiệm" (8 cốc) | 60 | 38,3 | Chế độ mà máy không có GPU nay **tự chọn** |
| Mở 3D lần đầu | 455 ms | 548 ms | render3d.js: 7,7 kB → 25,3 kB |

Về bộ nhớ: sau 8 lần mở và đóng 3D, số listener giữ ổn định ở 85, số canvas WebGL còn sót bằng 0, và vòng `requestAnimationFrame` dừng khi rời trang. Heap tăng khoảng 0,13 MB mỗi chu kỳ, cùng độ dốc với bản trước (6,05 → 7,15 MB). Chưa thấy rò rỉ mới, nhưng 8 chu kỳ là ít nên chưa đủ để kết luận chắc chắn.

Quá trình xử lý 3D:
- Bản đầu tiên chỉ đạt 4,2 FPS và mất 3,5 s để mở 3D trên SwiftShader.
- Đo từng yếu tố cho thấy nguyên nhân chính là environment map PMREM, cộng với thủy tinh vẽ hai mặt và chi phí tô điểm ảnh khi vật thể lớn hơn trên màn hình.
- Sau khi sửa và thêm cơ chế tự chuyển sang Tiết kiệm, đạt khoảng 35–38 FPS.

**Chưa đo trên GPU thật.** Với GPU thật, chế độ Cao là tải nhẹ, nhưng điều này cần chủ sở hữu xác nhận trên thiết bị.

Ở 2D, Firefox và WebKit headless có lúc gần ngưỡng 30 FPS, vì canvas lớn hơn khoảng 2,3 lần. Lớp nổi đã chuyển sang nền đặc không đổ bóng và canvas đặt `alpha: false`, nên lượt chạy cuối của P01 đạt trên cả ba trình duyệt.

## 8. Giới hạn còn lại

1. Chưa có người dùng thật nghiệm thu: journey là Playwright mô phỏng người mới dùng. Chạm thật trên điện thoại vẫn là D30 từ Phase 5.
2. 3D "Cao" trên máy không có GPU chậm (khoảng 7 FPS). Đã có cơ chế tự chuyển sang Tiết kiệm, nhưng nếu người dùng tự chọn Cao thì vẫn chậm.
3. Khung 3D chừa khoảng phía trên để nhấc cốc khi rót, nên ở cảnh ít dụng cụ, vật nằm hơi thấp trong khung.
4. Mặt thoáng 3D khi nghiêng mạnh (trên 20°): đĩa mặt thoáng bị ẩn, chỉ còn khối chất lỏng bị cắt. Mô hình mặt phẳng là gần đúng cho thân hình trụ; với bình tam giác, độ lệch hình học lớn hơn.
5. Bảng Quan sát chỉ giải thích những phản ứng có quy tắc `KINETIC`. Kết tủa và trung hòa vẫn chỉ ghi "Quan sát được", chưa có thẻ kết luận riêng.
6. SCIENTIFIC_VALIDATION §8 (D31) và kiểm tra Preview sau Access (D34) vẫn mở như ở Phase 5.

## 9. Commit

Xem `git log`: commit "feat(dlab): UX rescue …" trên nhánh tính năng. Chưa push.

## 10. Chạy thử

```
cd D:\EduLab\ChemLab
npm run dev
```
Mở http://localhost:5173/#dlab. Để xem lại hướng dẫn nhanh, bấm nút **?**.
