# ChemLab 7.0 — Post-Codex QA Fix & Final UX Improvement

Ngày: 24/11/2026 · Repo `D:\EduLab\ChemLab` · nhánh `feature/chemlab-7.0-dynamic-laboratory`.
Commit gốc: `acfaaae`. Commit của phiên này: xem §15.
Phạm vi: chỉ Dynamic Lab. Không chạm ChemAI, Groq, quota, Cloudflare hay các Lab khác. Version vẫn 6.7.0. Không push, không merge, không deploy.
Đầu vào: `QA_CODEX_FULL_AUDIT.md` và `qa-codex/`. Hai mục này được giữ nguyên, không sửa.

**Trạng thái: PARTIAL, chờ chủ sở hữu nghiệm thu.**
- Mọi hạng mục chức năng đã làm xong và đã kiểm thử.
- Còn hai điểm chưa đạt:
  - WebKit P01 đạt 29,1 fps, dưới ngưỡng 30.
  - Chưa có thiết bị cảm ứng thật và GPU thật.

## 1. Danh sách BUG-ID đã xử lý

Ghi chú về mã lỗi: báo cáo Codex chỉ có một lỗi là CL7-QA-001. Các lỗi có mã PCQ dưới đây là do tôi tự phát hiện trong lúc sửa.

| ID | Mức | Nội dung | Trạng thái |
|---|---|---|---|
| CL7-QA-001 | P2 (Codex) → nâng lên **P1**: có lỗi engine | Bài kết tủa cần 19 lần bấm “5 giọt” | Đã sửa |
| PCQ-01 | P1 | Ống nhỏ giọt: các giọt sinh ra dưới miệng cốc rơi ra bàn, mất 40–70% dung dịch | Đã sửa (engine) |
| PCQ-02 | P1, có từ trước | Thanh thao tác: khi danh sách cốc đổi thứ tự, tên hiển thị và đích thật lệch nhau, nên có thể nhỏ/thả nhầm cốc | Đã sửa |
| PCQ-03 | P2 | Hết dung dịch, ô “Hút từ” tự chọn sẵn cốc đích (cốc gần nhất) thay vì chai vừa hút | Đã sửa |
| PCQ-04 | P2 | Thời gian chờ lớp Cu phụ thuộc cỡ đinh (0,1 g: 440 s; 2 g: 19 s), do điều kiện dừng dùng lượng Cu tuyệt đối | Đã sửa (điều kiện bài và hiển thị) |
| PCQ-05 | P2 | Bàn 2D tự căn lại khung khi chọn dụng cụ, mở/đóng panel hoặc đổi thanh thao tác | Đã sửa |
| PCQ-06 | P3 | Đinh nằm trên bàn 2D chỉ là một chấm tròn | Đã sửa |
| PCQ-07 | P3 | Nhãn có thể nằm dưới panel hoặc thanh thao tác | Đã sửa |
| PCQ-08 | P3 | Dock 3D tràn khung khi thêm nút camera | Đã sửa |
| Test W01 bản đầu | — | `.catch` nuốt lỗi khiến test bỏ qua bước mở panel mà không báo | Đã sửa test |

Theo đúng bàn giao của Codex, tôi không sửa lại các kịch bản Codex đã xác nhận chạy đúng: Zn + HCl, chuyển bài không rò trạng thái, và 25 kịch bản Sandbox.

## 2. Root cause (đã xác nhận bằng tái hiện)

- **CL7-QA-001** có ba nguyên nhân chồng nhau:
  1. **PCQ-01 (lỗi engine).**
     - `dispense` xếp các giọt của một lần nhỏ thành chuỗi kéo xuống dưới đầu ống (cách nhau 6 mm).
     - Cốc nhận giọt được xác định riêng cho từng giọt bằng `containerBelow`. Hàm này chỉ tìm cốc có miệng nằm *dưới* giọt.
     - Đầu ống đặt ở miệng cốc + 14 mm, nên từ giọt thứ 3 trở đi đã nằm dưới miệng cốc. Các giọt này không được gán cốc và rơi ra bàn.
     - Đo trên bản cũ: bấm “10 giọt” chỉ có 3 giọt vào cốc (0,075 so với 0,25 mmol NaOH); bấm “5 giọt” cũng chỉ có 3.
  2. **Ngưỡng mô hình.** Theo mô hình trộn đều, cần khoảng **3 mL NaOH 0,5 M** (2,75–3,0 mL) mới có kết tủa bền.
     - Lượng OH⁻ ban đầu bị đệm bởi phản ứng thủy phân Cu²⁺ (dime Cu₂(OH)₂²⁺); pH chỉ tăng từ 4,34 lên 4,88.
     - Ngoài ra còn ngưỡng tạo mầm `NUCLEATION_LOG = 1`.
     - Câu hướng dẫn “lặp lại vài lần” không nói lượng cần thiết.
  3. **Thao tác.** Mỗi lần chỉ hút được 1 mL và chỉ có nút 1 hoặc 5 giọt.
  - Cộng lại: 3 mL ÷ (3 giọt × 0,05 mL) ≈ 20 lần bấm, khớp với 19 lần Codex đo được.
- **PCQ-02.** Hàm `patch()` trong `dlabApp.js` so sánh “khung” HTML sau khi thay mọi chữ số. Vì vậy `value="o3"` và `"o5"` bị coi là giống nhau.
  - Khi thứ tự cốc đổi, hàm chỉ cập nhật chữ hiển thị, không cập nhật giá trị option.
  - Đã tái hiện: chọn Ống B, giọt lại rơi vào Ống C.
- **PCQ-04.** Bước 2 bài Kim loại hoàn thành khi `coat.Cu > 8e-4 mol` (lượng tuyệt đối); màu lớp phủ cũng tính theo lượng tuyệt đối.
  - Tốc độ phản ứng = k·A·[Cu²⁺], với diện tích A tỉ lệ thuận với khối lượng đinh (bán kính cố định, đinh dài ra theo khối lượng).
  - Vì vậy, 0,8 mmol Cu bằng 45% Fe của đinh 0,1 g, nhưng chỉ 2% của đinh 2 g.
- **PCQ-05.** Mọi thay đổi số vật, chiều cao thanh thao tác hay trạng thái panel đều gọi `fitView()` ngay lập tức.

## 3. Cách giải quyết CL7-QA-001

- **Engine** (`sim.js` › `dispense`): cốc nhận được xác định **một lần tại đầu ống** cho cả loạt giọt (`containerAt || containerBelow`). Hằng số hóa học và ngưỡng không đổi.
- **Bài học** (`guided.js`):
  - Câu nhiệm vụ ghi rõ “cần khoảng 3 mL NaOH 0,5 M (60 giọt)”. Con số này có unit test buộc khớp với mô hình (2,5–3,5 mL).
  - Phần Gợi ý ghi lại thao tác cụ thể, kèm một câu lưu ý trung thực: *“mô hình coi dung dịch trộn đều tức thì… trong ống nghiệm thật thường thấy vẩn xanh ngay chỗ giọt rơi từ những giọt đầu”*.
- **Dòng tiến độ định lượng** `.dlab-gprogress`:
  - Lấy trực tiếp từ trạng thái mô phỏng: lượng đã thêm suy từ Na⁺; lượng còn thiếu tìm bằng chia đôi trên bản sao thành phần cốc, dùng đúng hàm `mix()` của engine (`moreToAdd`).
  - Ví dụ: “Đã thêm 0,5 mL NaOH vào Cốc A, chưa có kết tủa bền. Cần thêm khoảng 2,35 mL (47 giọt) nữa.” → “…: kết tủa Cu(OH)₂ đã xuất hiện.”
- **Ống nhỏ giọt:**
  - Hút đầy 2 mL (dung tích bầu).
  - Nút **1 / 5 / 10 giọt**.
  - **Nhập số mL** rồi bấm “Nhỏ”.
  - **“Hút thêm”** hút lại từ chai vừa dùng.
- Bước bài vẫn chỉ hoàn thành khi engine thực sự tạo Cu(OH)₂ > 2·10⁻⁴ mol; ứng dụng không tự thêm sản phẩm.

## 4. Số thao tác trước và sau

| | Trước (`acfaaae`) | Sau |
|---|---|---|
| Codex, giao diện thật | 19 lần “5 giọt”, cộng nhiều lần hút lại | — |
| Unit test (mô phỏng chính thao tác đó) | 19 lần “10 giọt” + 5 lần hút (test FAIL trên code cũ) | ≤ 7 lần “10 giọt” + 2 lần hút |
| Giao diện thật (E2E G08, chạy thử bài) | — | **8 thao tác**: Hút 2 mL, 4 × 10 giọt, Hút 2 mL, 2 × 10 giọt |
| Cách nhanh | — | Nhập mL: Hút, Nhỏ 2 mL, Hút, Nhỏ 1 mL (4 thao tác). Hoặc rót 3 mL từ chai (1 thao tác). |

## 5. Tủ hóa chất và Kệ dụng cụ

- Hai tab chính: **Tủ hóa chất** (Dung dịch, Chất rắn, Chất lỏng, Chất khí, Chất chỉ thị) và **Kệ dụng cụ** (Cốc, bình, ống; Lấy, chuyển, khuấy; Đo, nhiệt, điện).
- Nhóm hiển thị dạng chip xuống dòng thay vì cuộn ngang. Chế độ “Tất cả” có tiêu đề nhóm dính ở đầu.
- Danh sách cuộn dọc; mỗi mục có biểu tượng, tên, công thức và nồng độ hoặc dung tích.
- Tìm kiếm áp dụng cho cả tủ lẫn kệ:
  - Có dấu, không dấu (“muoi an”).
  - Công thức có hoặc không có chỉ số dưới (“CuSO4” = “CuSO₄”).
  - Kết quả ghi rõ mục thuộc tủ hay kệ.
- Bấm vào mục để lấy ra bàn, hoặc kéo thả (giữ nguyên cơ chế cũ). Trên màn hình dưới 1100 px, chip cao 36 px.
- Kiểm thử bằng E2E L01:
  - Đổi tab liên tục 12 lần.
  - 5 nhóm đều hiện và đều có mục.
  - Không cuộn ngang (`scrollWidth − clientWidth ≤ 1`).
  - Năm truy vấn tìm kiếm đều đúng.
  - Lấy kẹp bằng bấm.
- Axe WCAG 2.2 AA (A01): đạt sau khi sửa tiêu đề nhóm (ban đầu dùng `li role=presentation`, axe báo lỗi “list”).

## 6. Điều khiển 3D

- **Đã có sẵn và vẫn giữ:**
  - Kéo vật thì tắt OrbitControls và bắt con trỏ (pointer capture); xoay chỉ bắt đầu khi bấm vào chỗ trống.
  - Chọn vật nhỏ theo khoảng cách trên màn hình (14 px).
  - Vật nằm trong bình được ưu tiên hơn thành bình.
  - Toàn bộ sửa lỗi gắp đinh của `acfaaae` (G01–G07 vẫn đạt).
- **Mới:**
  - **Phản hồi khi thả**, dùng chung cho 2D và 3D:
    - Viền hoặc vòng **xanh** kèm nhãn “Thả vào Cốc A”.
    - Viền hoặc vòng **đỏ nét đứt** kèm lý do lấy từ chính luật an toàn của lệnh `release`, ví dụ natri trên ống nghiệm.
  - **Nhìn vật chọn** (nút hoặc phím F). Camera bay tới vật, kích thước tính từ chính kích thước vật.
  - Nút “Góc mặc định” và “Nhìn vật chọn” trên dock chỉ còn biểu tượng (có tên ẩn và tooltip), để dock không tràn. “Vừa khung” giữ nguyên.
- E2E T02:
  - Kéo chỗ trống thì camera xoay, không vật nào dịch chuyển.
  - Mang natri qua ống nghiệm thì báo đỏ; qua chậu thì báo xanh. Camera không đổi (sai số < 10⁻³).
  - Thả xong thì phản hồi biến mất.
  - “Nhìn vật chọn” đưa camera lại gần vật.

## 7. Workspace 2D

Chính sách mới trong `dlabApp.js`:
- Bàn mới (bắt đầu bài, mở, đặt lại, hoặc bàn đang trống được thêm vật) được căn khung **một lần**, rồi căn lại sau khi panel đã đo xong.
- Vật mới bị khuất thì căn ngay, trừ khi đang kéo.
- Các thay đổi thụ động chỉ làm căn lại khi có vật **thật sự bị che**, và chỉ sau khi chuột đã **dừng 900 ms**. Thay đổi thụ động gồm: panel, thanh thao tác, chọn dụng cụ, chuyển bước.
- Không bao giờ căn lại trong lúc kéo.
- Khi bàn chỉ đổi chiều cao nhỏ (thanh bước, Gợi ý), khung nhìn được bù để bàn giữ nguyên vị trí trên trang.
- “Vừa khung” luôn căn lại; tự phóng to/thu nhỏ bằng tay thì tắt tự căn.

Kiểm thử:
- **W01** (Chromium, Firefox, WebKit). Chọn ống nhỏ giọt, chọn kẹp, lấy mẩu chất (đổi số vật), mở và đóng Quan sát: vật không dịch quá 1,5 px ngay sau mỗi thao tác.
  - Trên Firefox/WebKit, panel làm thanh thao tác xuống dòng và che đỉnh ống nhỏ giọt. Khi đó bàn chỉ căn lại sau khi chuột dừng, và sau đó không còn vật nào bị che. Đây là hành vi đúng thiết kế, test kiểm tra đúng điều này.
- **W02.** Trong lúc kéo, dù có vật mới xuất hiện ngoài khung, khung nhìn không đổi. Thả chuột xong mới căn lại.

## 8. Hình ảnh và nhãn

- **Đinh hoặc dải kim loại ngoài cốc (2D):**
  - Nằm trên bàn: đinh nằm ngang, có mũ và mũi nhọn.
  - Khi được kẹp: đinh treo thẳng đứng.
  - Màu lớp Cu bám vẫn giữ.
  - Vùng bấm (`solidBox`) khớp với hình vẽ.
- **Nhãn:**
  - Nằm trong vùng không bị panel hoặc thanh thao tác che.
  - Vật nằm dưới panel thì ẩn nhãn, trừ vật đang chọn hoặc đang cầm.
  - Nhãn ưu tiên thấp bị ẩn chứ không bị đẩy đè lên vật.
- **Màu lớp phủ và nhãn “có lớp Cu bám”** dùng `coatCoverage()`: độ dày lớp phủ, tính bằng mol trên cm² diện tích ban đầu của mẩu. Với đinh 2 g mặc định, hình ảnh giống hệt trước.
- **Không làm** (tránh phóng đại hiện tượng không có cơ sở): không tăng kích thước kết tủa hay bọt khí; không đổi độ tương phản thủy tinh.
  - Kết tủa trong G08 nhận ra được qua nhãn “Cu(OH)₂↓”, các hạt xanh trong cốc và dòng tiến độ. Ở 1440 px khi mở cả hai panel, cốc vẫn khá nhỏ (xem §13).

## 9. Năm Guided Lab (giao diện thật: chuột, thanh thao tác, thanh bước; có chuyển 2D ⇄ 3D)

`node scripts/dlab-guided-walk.mjs`, chạy trên server dev 5173: kết quả trong `post-codex/guided-walk.json` và ảnh `walk-*.png`.

| Bài | Kết quả | Ghi chú |
|---|---|---|
| Axit–bazơ | 5/5 | Ống nhỏ giọt nhỏ phenolphtalein đúng ống B (trước khi sửa PCQ-02 thì rơi nhầm ống C) |
| Kết tủa | 5/5 | Bước 1 bằng ống nhỏ giọt: 8 thao tác, có dòng tiến độ |
| Kim loại | 5/5 | Gắp đinh ra; Zn + HCl có H₂; natri; tua đến hiện tượng 20,8 s mô phỏng |
| Điện phân | 5/5 | |
| Hữu cơ | 4/4 | |

Kết quả chung: 0 lỗi console, 0 request ChemAI hoặc Groq.

Chạy thử Kim loại và Điện phân 3 lần liên tiếp đều 5/5, sau khi sửa race trong script chạy thử: script trước đó không chờ ô “Thả vào” hiện ra.

## 10. Sandbox

- Các kịch bản S01–S25 của Codex đều đạt trên Chromium (59/59) và Firefox (56/56); WebKit đạt 55/56, chỉ P01 hỏng.
- Sau khi thay đổi khung nhìn, S02–S04 (nhúng giấy quỳ) từng hỏng chập chờn. Hai nguyên nhân:
  - Ứng dụng: vật mới thêm mà nằm ngoài khung thì phải chờ chuột dừng mới căn lại. Đã sửa: vật mới thì căn ngay.
  - Test: tính tọa độ trước khi khung căn lần cuối. Đã thêm `settled()`.
  - Sau đó chạy 3 lần liên tiếp đều 7/7.
- Không tự kiểm thêm tổ hợp hóa chất mới ngoài báo cáo Codex. Không tuyên bố Chemistry Engine đã được kiểm chứng toàn bộ.

## 11. Test và build (lần chạy cuối, tuần tự)

| Lệnh | Kết quả |
|---|---|
| `npm run check` | PASS (exit 0), Dynamic Lab **53/53** (mới: tiến độ kết tủa, giọt vào đúng cốc, thời gian lớp Cu theo cỡ đinh) |
| `npx vite build` | PASS |
| `node scripts/dlab-e2e.mjs` (Chromium) | **59/59** PASS (mới: G08, L01, W01, W02, T02) |
| `CHEMLAB_BROWSER=firefox …` | **56/56** PASS |
| `CHEMLAB_BROWSER=webkit …` | **55/56**: FAIL P01 (29,1 fps) |
| `npm run check:browser` | **448/448** PASS |
| Axe WCAG 2.2 AA (A01, sáng/tối) | PASS trên cả 3 trình duyệt |

Các test cũ được sửa (chỉ đổi cách tìm phần tử hoặc cách đồng bộ, tiêu chí giữ nguyên):
- Locator cho tab thư viện và nút “Hút 2 mL”.
- G05: ngưỡng lớp Cu quy đổi theo cùng độ dày lớp phủ (0,8 mmol × 0,1/2).
- Test đơn vị đinh 0,1 g: trước đây khẳng định “cần hơn 200 s”, nay khẳng định thời gian gần như không phụ thuộc cỡ đinh. Đây là thay đổi chủ ý của mô hình, ghi ở §2 và §12.

## 12. FPS, trình duyệt, máy đo

Môi trường đo: máy Windows 11 cá nhân, headless Playwright, renderer phần mềm (không dùng GPU thật). Cảnh bận có 480 hạt.

| Trình duyệt | Đồ họa cao | Tiết kiệm | Ngưỡng | Trạng thái |
|---|---|---|---|---|
| Chromium | 60,0 fps (p95 16,7 ms) | 60,0 | 30 | PASS |
| Firefox | 38,4 (lần trước 37,4) | 36,7 (37,8) | 30 | PASS |
| WebKit | **29,1** (lần trước 31,5) | 33,7 (35,1) | 30 | **FAIL ở lần chạy cuối** |

Giữ nguyên ngưỡng 30. WebKit dao động quanh ngưỡng giữa các lần chạy. Hôm trước, bản `7a0c804` đo trên cùng máy chỉ được 13,7 fps, nên kết quả phụ thuộc nhiều vào tải máy. Cần đo lại trên GPU thật.

Tôi không dùng kết quả của lần đạt để thay cho lần hỏng.

**Server dev 5173 sau các phiên Playwright dài:**
- Bộ nhớ tăng từ 277 lên 332 MB; số handle ổn định (11.459 → 11.470).
- `curl` mất 10–15 ms cả trước lẫn sau (đo bằng `Invoke-WebRequest` thì khoảng 400 ms, nhưng đó là độ trễ riêng của lệnh PowerShell).
- Trên máy hiện có 2 server dev ChemLab và 1 server dev PhysicsLab chạy song song, cùng nhiều tiến trình khác.
- Kết luận: trong phiên này **không tái hiện được** chuyện 5173 bị treo, và không thấy dấu hiệu rò tài nguyên theo số handle. Phần bộ nhớ tăng có thể do Vite cache module. Nhận định “sự cố môi trường” của Codex chưa được chứng minh hay bác bỏ.
- Một tiến trình `vite preview --port 4173` (PID 1372) do lệnh debug của tôi khởi động vẫn đang chạy. Lệnh tắt bị chặn quyền, nên cần chủ sở hữu tự tắt.

## 13. Giới hạn còn lại

- **Ngưỡng tạo kết tủa:** mô hình trộn đều nên cần khoảng 3 mL NaOH; trong thực tế, kết tủa cục bộ thấy ngay từ giọt đầu. Bài học đã ghi rõ. Muốn đổi `NUCLEATION_LOG` hoặc mô hình hóa trộn cục bộ thì cần giáo viên hoặc chuyên gia duyệt.
- **Lớp phủ theo độ dày** là xấp xỉ giáo dục; mốc đầy màu lấy theo thang cũ của đinh 2 g, chưa đối chiếu số đo thực.
- **Bàn nhỏ khi mở cả hai panel** (1440 px): cốc khoảng 60 px. Người dùng có thể thu gọn panel, bấm “Vừa khung” hoặc phóng to. Chưa làm chế độ tự thu gọn panel.
- **Bàn 2D vẫn có thể tự căn lại** sau khi chuột dừng 900 ms, nếu có vật bị che. Đây là thiết kế có chủ ý.
- **Chưa kiểm** trên điện thoại hay máy tính bảng cảm ứng thật, GPU thật, hay với học sinh thật.
- **WebKit P01** dưới 30 fps ở lần chạy cuối.

## 14. Ảnh bằng chứng

**Trước** (Codex, `acfaaae`):
- `qa-codex/precipitate-01-first-drop.png`, `precipitate-01-stuck.png`: 0/5 sau nhiều lần “5 giọt”.
- `qa-codex/acid-base-00-start.png`: thư viện cũ với các tab cuộn ngang.

**Sau** (`post-codex/`):
- `after-1-tu-hoa-chat.png`, `after-2-ke-dung-cu.png`, `after-3-tim-cong-thuc.png`: tủ, kệ và tìm “CuSO4”.
- `after-4-ket-tua-tien-do.png` (dòng tiến độ), `after-5-ket-tua-xuat-hien.png` (nhãn Cu(OH)₂↓, bước 2/5).
- `after-6-dinh-tren-ban-2d.png`, `after-7-dinh-dang-kep-2d.png`: hình đinh có lớp Cu.
- `after-8-3d-nhan-va-kep.png`, `after-9-3d-nhin-vat-chon.png`.
- `walk-*.png`, `guided-walk.json`, `evidence.json`.
- E2E: `test-results/dlab-e2e/chromium-t02-drop-ok.png` (phản hồi thả xanh), `chromium-g08-precipitate.png`.

## 15. Commit

**Chưa commit.** Lệnh `git add`/`git commit` bị chặn quyền trong phiên này. Các thay đổi nằm trong working tree, HEAD vẫn là `acfaaae`.

Nếu chủ sở hữu đồng ý, commit bằng pathspec rõ ràng gồm:
- `src/dlab/engine/{processes,sim}.js`
- `src/dlab/guided.js`
- `src/dlab/ui/{dlab.css,dlabApp.js,labels.js,library.js,render2d.js,render3d.js}`
- `scripts/{dlab-guided-walk.mjs,test-dlab.mjs,dlab-postqa-evidence.mjs}`
- `scripts/lib/dlab-journeys.mjs`
- `reports/chemlab-7.0/{POST_CODEX_QA_FIX_REPORT.md,PROGRESS.md}`
- `reports/chemlab-7.0/post-codex/`

Không đưa vào commit: các file `.claude/` của chủ sở hữu, `QA_CODEX_FULL_AUDIT.md` và `qa-codex/`. Không push.

## 16. URL localhost

http://localhost:5173/#dlab (server dev đang chạy; nếu không, chạy `npm run dev` trong `D:\EduLab\ChemLab`).
