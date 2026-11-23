# ChemLab 7.0 — Sửa thao tác kẹp trong Guided Lab và nhãn vật thể 3D

**Ngày:** 2026-11-24
**Nhánh:** `feature/chemlab-7.0-dynamic-laboratory`
**Gốc so sánh:** `7a0c804`
**Trạng thái:** CHỜ NGHIỆM THU. Chưa push, chưa deploy, version vẫn 6.7.0.

Bằng chứng nằm trong `reports/chemlab-7.0/tongs/`:
- `before.json`, `before-*.png`: bản `7a0c804`.
- `after.json`, `after-*.png`: bản đã sửa.
- `guided-walk.json`, `walk-*.png`: đi hết 5 Guided Lab.

Hai bộ ảnh before/after được chụp bằng cùng một script, `scripts/dlab-tongs-journey.mjs`, thao tác bằng chuột thật.

## 1. Tái hiện lỗi trên bản 7a0c804

Script mở Guided Lab "Kim loại", chọn kẹp, lấy đinh sắt thả vào cốc CuSO₄, đợi ở tốc độ 4×, rồi thử gắp đinh ra.

| Bước | Bản 7a0c804 | Bản sửa |
|---|---|---|
| Kẹp đưa ra chất mặc định | Natri (mẩu), 0,1 g | Đinh sắt (theo bài), 2 g |
| Đổi sang Đinh sắt thì khối lượng | vẫn 0,1 g | 2 g; mỗi chất dùng khối lượng mặc định riêng |
| Lớp Cu bám đủ để qua bước 2, ở 4× | chưa xong sau 90 s thật (360 s mô phỏng) | 4,7 s thật (≈ 19 s mô phỏng) |
| Tỷ lệ thời gian mô phỏng / thời gian thật ở 4× | 4,00 | 4,00 |
| Chọn kẹp rồi bấm vào đinh trong cốc | chọn nhầm **cái cốc** (`o1`); đinh không đổi | đinh được gắp (`holder` là kẹp) |
| Kéo đinh trực tiếp ra ngoài | không có gì xảy ra | đinh được gắp bằng kẹp trên bàn và đi theo con trỏ |
| Sang bước kẽm, kẹp đưa ra | Natri (mẩu) | Kẽm (viên) |
| Nhãn 3D | không có | tên và thành phần lấy từ trạng thái mô phỏng |

## 2. Nguyên nhân gốc (đã kiểm chứng)

### Không gắp được đinh: bốn nguyên nhân chồng lên nhau

1. **Simulation Core không có lệnh gắp một vật đã có sẵn.** Lệnh `pick` chỉ lấy hóa chất *mới* từ kho, và `tool.load` chỉ là dữ liệu `{reagent, massG}`. Một khi đinh đã nằm trong cốc, không lệnh nào lấy lại được nó (`src/dlab/engine/sim.js` tại 7a0c804).
2. **Interaction Controller từ chối kéo chất rắn trong bình.** Hàm `beginDrag` có dòng `if (o.type === 'solid' && o.in) return false`, và thanh thao tác của chất rắn rỗng (`quickActions`: `if (o.type === 'solid') return ''`).
3. **Vùng bấm (hitbox) không trùng hình vẽ.** Đinh 2 g được vẽ thành một thanh cao khoảng 34 mm, đứng từ đáy cốc. Nhưng vùng bấm chỉ là một hình tròn bán kính 8 mm quanh điểm cách đáy 4 mm, nên bấm vào thân đinh sẽ trúng cái cốc. Trong 3D cũng vậy: tia chọn chạm thành cốc thủy tinh trước khi tới đinh.
4. **Hai lớp phủ nuốt cú bấm,** phát hiện khi tái hiện bằng chuột thật:
   - Khung "Phóng to vùng phản ứng" nằm đè lên dụng cụ ở góc phải dưới bàn.
   - Thông báo (toast) ở giữa đáy bàn.

   Cả hai đều nhận sự kiện chuột.

Trong 3D còn hai nguyên nhân riêng:
- Kẹp là hai thanh mảnh, tia chọn lọt qua khe giữa.
- Sự kiện `click` theo sau một cú bấm đã xử lý lại chọn vật nằm dưới con trỏ (cái cốc), làm mất vật vừa gắp.

Không có lỗi tọa độ giữa 2D và 3D, cũng không có vật bị mất khỏi trạng thái mô phỏng. Guided Lab không chặn thao tác.

### "Natri (mẩu) 0,1 g" trên thanh kẹp
Đây là **lỗi UX ngữ cảnh**, không phải trạng thái tồn dư và không phải lỗi chọn chất:
- Ô chọn luôn mặc định mục đầu danh sách chất rắn dùng kẹp, tức `na`.
- Ô khối lượng điền `defaultMass` của mục đầu đó (0,1) và **không đổi** khi học sinh chọn chất khác.

### Chờ lâu dù đã chọn 4×
Đây là **hệ quả của lỗi mặc định khối lượng** nói trên, không phải do tốc độ hay do treo:
- Tốc độ 4× được áp dụng đúng (đo được 4,00) và phản ứng vẫn tiến triển.
- Đinh 0,1 g có diện tích bề mặt nhỏ, nên phải mất 440 s mô phỏng (khoảng 110 s thật ở 4×) mới bám đủ 0,8 mmol Cu.
- Đinh 2 g chỉ cần khoảng 20 s mô phỏng.
- Điều kiện chuyển bước là một ngưỡng lượng Cu bám, không đợi phản ứng kết thúc.

## 3. Thay đổi

### Simulation Core (`sim.js`, `safety.js`, `processes.js`)
- **Lệnh mới `grab {tool, id}`:** gắp đúng vật được chỉ định (giữ id, khối lượng, `mass0`, lớp bám `coat`). Vật được kẹp vẫn là đối tượng thật, có `holder` trỏ tới kẹp.
- **`pick` (lấy mới từ kho)** cũng tạo đối tượng thật ngay khi kẹp, nên 2D, 3D, nhãn và Hoàn tác đều nhìn thấy vật đang được kẹp.
- **`release`:**
  - Đầu kẹp ở trong bình: vật vào thẳng bình.
  - Đầu kẹp ở trên miệng bình: vật rơi vào bình.
  - Ngoài ra: vật đặt lên bàn (y = 0), không lơ lửng.
  - Bản lưu cũ (load không có id) vẫn thả được.
- **`carry()`:** vật được kẹp đi theo đầu kẹp; vật trong bình đi theo bình. Chạy sau mỗi lệnh và mỗi bước mô phỏng, nên 2D, 3D, vùng bấm và nhãn cùng đọc một tọa độ.
- **Kiểm tra an toàn cho `grab`, có lý do hiển thị khi bị chặn:**
  - vật đã phản ứng hết;
  - chất bột/tinh thể đã vào dung dịch;
  - natri đang phản ứng trong nước;
  - kẹp đang giữ vật khác;
  - dụng cụ không phải kẹp.
- **`remove` kẹp đang giữ vật:** vật được đặt xuống bàn, không bị treo vào một dụng cụ không còn tồn tại.
- **Bình chứa có mã A/B/C cố định.** Tên ngắn: "Cốc A", "Ống nghiệm B", "Chậu C".
- **Không thay đổi** hằng số, động học hay hóa học nào.

### Interaction Controller (`dlabApp.js`), dùng chung cho 2D và 3D
- **Chọn kẹp:**
  - Các vật gắp được có viền nét đứt và nhãn "bấm để gắp".
  - Bấm vào vật: gắp lên miệng bình.
  - Bấm rồi kéo: mang vật đi.
  - Thả chuột trên bàn: đặt xuống bàn. Thả trên hoặc trong bình: thả vào bình.
- **Không chọn kẹp trước:** bấm vào đinh thì chọn đinh. Kéo đinh thì tự dùng kẹp trống trên bàn (chỉ tạo kẹp mới nếu không còn kẹp nào).
- **Vùng bấm của vật nhỏ** khớp hình vẽ, cộng lề tối thiểu khoảng 12 px theo mức zoom. Vật nhỏ được ưu tiên hơn cái bình bao quanh. Vật đang kẹp được chọn thông qua chính cái kẹp.
- **Thanh thao tác theo ngữ cảnh**, mỗi nút đều là lệnh thật đi qua Simulation Core:
  - Đinh trong bình: "Gắp ra, đặt lên bàn" và "Gắp lên".
  - Kẹp trống: "Gắp [Đinh sắt · 1,95 g · trong Cốc A]" (chọn đúng vật cụ thể) và "Lấy mới".
  - Kẹp đang giữ vật: "Thả vào …" và "Đặt lên bàn".
  - Vật đã phản ứng hết, hoặc bột đã tan: ghi rõ vì sao không gắp được.
- **Lời nhắc một lần** khi chọn kẹp lần đầu (localStorage `chemlab-dlab-tip-tongs`).
- **Hoàn tác:** mỗi cử chỉ là một bước (gắp; rồi đặt xuống).
- **Lớp phủ không còn chặn chuột:**
  - Khung phóng to và thông báo cho chuột đi xuyên qua.
  - Khung phóng to tự ẩn khi nó sẽ che một vật trên bàn.
- **Ống nhỏ giọt "Hút từ"** liệt kê cả chai hóa chất. Trước đây không hút được phenolphtalein từ chai bằng thanh thao tác.

### Guided Lab (`guided.js` và thanh bước)
- **Thanh bước gọn nằm phía trên bàn**, không che bàn và không dùng popup. Gồm:
  - "Bước n/N" và nhiệm vụ;
  - **Thao tác với:** tên và thành phần thật của các vật liên quan;
  - **Hoàn thành khi:**;
  - nút **Gợi ý** (hướng dẫn khi gặp khó) và nút **Bài học**.
- **Mỗi bước có thêm dữ liệu:** `done` (dấu hiệu hoàn thành), `help`, `need` (chất rắn và khối lượng cần dùng) và `wait` (điều kiện cho phép tua).
- **Kẹp và thìa đưa ra đúng chất mà bước đang cần,** có ghi "(theo bài)". Học sinh vẫn đổi được. Lựa chọn của học sinh được giữ cho tới khi sang bước mới. Không tự thao tác thay học sinh.
- **"Tua đến hiện tượng":**
  - Chỉ hiện ở bước chờ, và khi điều kiện chờ đã có (ví dụ kẽm đã ở trong axit).
  - Chạy **chính mô hình mô phỏng** theo từng lát 2 s, cho tới khi điều kiện hoàn thành của bước đạt (tối đa 10 phút mô phỏng).
  - Thông báo rõ: "Đã tua m:ss thời gian mô phỏng. Mọi thay đổi do mô hình tính, không phải hình minh họa".
- **Đồng hồ** ghi "Mô phỏng m:ss", kèm chú thích phân biệt thời gian mô phỏng với thời gian thực. Tốc độ hiện ở nút đang bật.
- **Bỏ nhãn ghi cứng tên hóa chất** ("CuSO₄", "HCl", "Cốc nước"…). Nhãn giờ tự cập nhật theo thành phần.
- **Bài nhận biết dung dịch A/B/C** đặt cờ `hideContents`, để nhãn không làm lộ đáp án.

### Nhãn vật thể (`labels.js` mới; lớp phủ `.dlab-labels`)
- **Văn bản nhãn lấy hoàn toàn từ trạng thái mô phỏng,** ví dụ:
  - Cốc A — CuSO₄ + FeSO₄ · có Đinh sắt (Fe)
  - Đinh sắt (Fe) · có lớp Cu bám
  - Kẹp hóa chất — đang gắp Đinh sắt (Fe)
  - Cốc B — ZnCl₂ + HCl · có Kẽm (Zn)
- **Tên dung dịch** được suy từ ion theo cân bằng điện tích:
  - muối: CuSO₄, NaCl…;
  - axit dư: HCl…;
  - bazơ dư: NaOH…;
  - kết tủa: Cu(OH)₂↓;
  - chất chỉ thị.

  Dung môi vết (ví dụ etanol pha trong phenolphtalein) không được đưa vào tên.
- **Là lớp HTML 2D gắn với tọa độ thế giới,** dùng chung cho 2D và 3D, nên luôn dễ đọc khi xoay hoặc zoom.
- **Ba chế độ:** "Nhãn: Tất cả", "Khi chọn", "Ẩn". Nút ở thanh dưới; lựa chọn được nhớ.
- **Khi rê chuột** nhãn có viền nổi bật; khi chọn hoặc cầm, nhãn tô màu nhấn.
- **Tránh chồng lấn:** nhãn đè nhau thì được đẩy lên; nếu vẫn chồng thì nhãn kém quan trọng bị ẩn.
- **Luôn nằm trong khung nhìn.**
- **`pointer-events: none`:** nhãn không bao giờ chặn thao tác. Khi đang kéo, các nhãn khác mờ đi.
- **Vật nhỏ trong bình** được nêu trong nhãn của bình. Nhãn riêng của vật hiện khi rê chuột, khi chọn, hoặc khi kẹp đang chọn.
- **Tooltip 3D cũ** được thay bằng lớp nhãn này.

## 4. Đồng bộ 2D/3D
Hai chế độ đọc chung một `sim.state`, nên chỉ có một bản của mỗi vật.

| Kiểm tra | Cách kiểm | Kết quả |
|---|---|---|
| Gắp đinh trong 3D rồi chuyển sang 2D | E2E G04 | vẫn đang kẹp (cùng `holder`), không có đinh thứ hai |
| Gắp trong 2D rồi xem 3D | journey bước 9 | đinh hiện ở đầu kẹp |
| Số vật trước và sau khi chuyển 2D ⇄ 3D | `guided-walk.json`, 5 bài | giữ nguyên |
| Nhãn | 2D và 3D | cùng nội dung |
| Hoàn tác sau khi gắp | E2E G01 | đúng thứ tự cử chỉ |

## 5. Năm Guided Lab, chỉ dùng điều khiển nhìn thấy

Script: `scripts/dlab-guided-walk.mjs`. Có chuyển 2D ⇄ 3D giữa chừng trong mỗi bài.

| Bài | Kết quả | Thao tác dùng chung đã đi qua | Thời gian |
|---|---|---|---|
| Nhận biết axit/bazơ | 5/5 | nhúng quỳ ×3, hút phenolphtalein từ chai, nhỏ giọt, rót từ chai | 8,8 s thật / 7,2 s mô phỏng |
| Kết tủa Cu(OH)₂ | 5/5 | rót, **tua** (lắng), khuấy, rót axit, thìa: muối (chất gợi ý đúng) → thả → **tua** | 7,9 s thật / 43 s mô phỏng |
| Kim loại | 5/5 | kẹp: đinh → **tua** → **gắp đinh ra, đặt lên bàn** → kẽm → **tua** → natri (xác nhận an toàn) → **tua** | 12,5 s thật / 64 s mô phỏng |
| Điện phân và pin | 5/5 | kéo điện cực vào cốc, nối dây và bật nguồn, **tua**, kẹp Zn và Cu, cầu muối, vôn kế | 10,4 s thật / 43,5 s mô phỏng |
| Hữu cơ | 4/4 | nhúng quỳ, thìa NaHCO₃ (chất gợi ý đúng), rót dầu và etanol | 9,5 s thật / 8,5 s mô phỏng |

Không có lỗi console và không có yêu cầu ChemAI nào.

Nhân lúc đi các bài, đã sửa một lỗi dùng chung khác: ống nhỏ giọt không hút được từ chai hóa chất bằng thanh thao tác.

## 6. Kiểm thử
| Lệnh | Kết quả |
|---|---|
| `npm run check` | PASS (DLab 51/51, trước 45) |
| `npx vite build` | PASS |
| `npm run check:browser` | PASS 448/448 |
| `node scripts/dlab-e2e.mjs` — Chromium | PASS 54/54 (P01 60 fps) |
| E2E — Firefox | 49/51: mọi test chức năng PASS; **P01/P01b FAIL** (20,2/21,1 fps, ngưỡng 30) |
| E2E — WebKit | 49/51: mọi test chức năng PASS; **P01/P01b FAIL** (14,2/18,1 fps) |
| `dlab-tongs-journey.mjs after` | 16/16 OK (bản 7a0c804: 7 FAIL) |
| `dlab-guided-walk.mjs` | 5/5 bài hoàn thành; 0 lỗi console; 0 yêu cầu ChemAI |

**P01 không phải lỗi do thay đổi này.** Bản 7a0c804, đo cùng máy cùng ngày bằng cùng bản build:
- Firefox: 21–23 fps, so với 20–21 fps của bản mới.
- WebKit: 13,7/17,9 fps, so với 13,4/17,4 fps của bản mới.

Chênh lệch nằm trong biên dao động; trong một lần đo lặp, chính bản 7a0c804 cho 30,3 rồi 21,1 fps. Ngày 2026-11-23 các test này đạt, nên lần trượt hôm nay là do tải máy (SwiftShader, không có GPU), chưa phải kết luận về hiệu năng. Lớp nhãn không làm giảm FPS: đo với nhãn bật và tắt trên Firefox cho 23,0 và 20,8 fps.

**Độ ổn định của G01:** lúc đầu G01 trượt ngẫu nhiên trên Firefox/WebKit. Nguyên nhân là bàn tự căn lại khung (phản ứng đầu tiên tự mở bảng Quan sát, hoặc thanh thao tác đổi chiều cao) đúng lúc test bấm. Test giờ chờ khung nhìn ổn định; sau đó đạt 15/15 lượt chạy. Hành vi bàn tự căn khung này có từ trước và được ghi ở mục Giới hạn.

Các test mới:
- **Unit (`test-dlab.mjs`, 6 test):**
  - gắp từ bình rỗng và từ bình có dung dịch;
  - gắp sau khi đã phản ứng (vẫn giữ lớp Cu);
  - không gắp được: vật đã phản ứng hết, bột đã tan, natri đang phản ứng, kẹp đang giữ vật khác;
  - Hoàn tác và bảo toàn nguyên tố khi gắp/thả;
  - bản lưu cũ;
  - nhãn đổi theo thành phần (A/B/C, ẩn ở bài nhận biết);
  - các bước Guided có `done`/`help`; đinh 0,1 g thực sự cần hàng trăm giây mô phỏng.
- **E2E bằng chuột thật (`dlab-journeys.mjs`, G01–G07):**
  - gắp trong 2D, trong bình có dung dịch;
  - kéo đinh ra từ bình rỗng;
  - nút "Gắp ra, đặt lên bàn"; vật đã phản ứng hết không gắp được;
  - gắp trong 3D rồi chuyển 2D;
  - Guided Lab kim loại: thanh bước, chất gợi ý, đo tỷ lệ 4×, nút tua;
  - nhãn: cập nhật, không chặn chuột, nằm trong khung 3D, ẩn được;
  - điện thoại 390 px.
- **Hai test cũ đổi selector** cho giao diện mới, không nới tiêu chí:
  - U05: thanh thao tác hiện "Cốc A" (trước là "Cốc thủy tinh 100 mL").
  - U06: nhãn khi rê chuột là `.dlab-label.is-hover` (trước là `.dlab-3d-tip`).

## 7. Giới hạn còn lại
- **Đinh nằm trên bàn được vẽ bằng một chấm tròn trong 2D.** Trong bình thì đinh được vẽ đúng hình thanh; 3D có mô hình đinh.
- **Khung camera 3D vẫn để nhiều khoảng trống phía trên** khi trên bàn có ít vật. Đây là giới hạn đã nêu từ bản UX Rescue.
- **Khi kéo một mẩu chất rắn rời trên bàn,** mẩu vẫn đi theo con trỏ (hành vi cũ), không tự dùng kẹp.
- **Tên dung dịch là cách gọi gần đúng từ ion.** Hỗn hợp nhiều ion sẽ được viết thành nhiều muối (ví dụ "Na₂SO₄ + CuSO₄ + NaCl"). Tên chỉ để nhận diện, không thay cho bảng thành phần ở "Chi tiết vật".
- **Ngưỡng "lớp Cu bám rõ" của bước 2 là lượng mol tuyệt đối.** Đinh nhỏ hơn vì thế cần lâu hơn; bước đã ghi rõ điều này trong phần Gợi ý.
- **Bàn 2D tự căn lại khung** khi bảng Quan sát tự mở (lần phản ứng đầu tiên) hoặc khi thanh thao tác đổi chiều cao. Vật có thể dịch đi khoảng một nhịp ngay lúc học sinh định bấm. Hành vi này có từ bản UX Rescue.
- **Nhãn chỉ được giữ trong khung canvas,** chưa tránh phần ngăn kéo đang mở, nên nhãn ở sát mép phải có thể bị ngăn Quan sát che một phần.
- **P01 trên Firefox/WebKit dưới 30 fps** ở máy kiểm thử (cả bản cũ lẫn bản mới); cần đo trên máy có GPU thật.
- **Chưa thử với người dùng thật** hay trên thiết bị cảm ứng thật.
