# ChemLab 7.0 — Foundation Validation

Viết cho: chủ sở hữu và phiên phát triển sau. Phần này ghi lại những gì đã thực sự chạy và kết quả của chúng.

## 1. Kịch bản mở, bắt đầu từ bàn trống (không chọn thẻ)

| Kịch bản | Unit (engine, qua `sim.dispatch`) | Trình duyệt thật (Chromium, qua UI) | Kỳ vọng (độc lập với engine) |
|---|---|---|---|
| A. Axit – bazơ: HCl 20 mL + NaOH 10, 20 rồi 30 mL | PASS | **F01** PASS: thư viện → cốc → 2 chai → thanh rót, đổi lượng NaOH | pH theo lời giải tay của axit/bazơ mạnh (Kw = 10⁻¹⁴): 0,78; 7; 13,0 |
| B. Kết tủa: AgNO₃ 2 mmol + NaCl 1, 2 rồi 4 mmol | PASS | — (thẻ X06 có AgCl qua UI) | AgCl ≤ min(n), giới hạn bởi chất hết trước; Ag⁺ dư còn tan |
| C. Tạo phức: CuSO₄ + NH₃ 2 M từng 1 mL | PASS | **F02** PASS: thêm từng phần qua thanh rót | Cu(OH)₂ xuất hiện trước, đạt cực đại, rồi tan hết; 100 % thành phức; sự kiện `ppt` đến trước `ammine-dis` |
| D. Nối tiếp: Cu(OH)₂ → HCl hòa tan → đinh Fe đẩy Cu | PASS | — | Cu bám đinh từ Cu²⁺ vừa được hòa tan lại; sự kiện `rx-fe-cu` có `VALIDATED` |
| E. Chưa hỗ trợ / an toàn: Mg + ZnSO₄; Na + HCl | PASS | **F03** PASS (lệnh sai qua API của trang); S24 PASS | UNSUPPORTED, Mg không đổi, không có Mg²⁺, khí hay lớp bám giả; Na + HCl trả về `SAFETY_BLOCKED` |

## 2. Test domain và metamorphic (`scripts/test-dlab.mjs`, các test "foundation: …")

| Test | Nội dung |
|---|---|
| command contract | 24 lệnh sai: id đã xóa, sai chức năng, lượng âm hoặc NaN, sai loại hóa chất, giọt lẻ, nguồn trùng đích, NaN tọa độ/góc/khuấy, chai chứa chất rắn, cầu muối hay CO₂ sai dụng cụ, `pick` khi đang giữ, `replace` chất rắn, tên lệnh `toString`. Tất cả trả về `INVALID_INPUT`; objects, nhật ký, sự kiện và lịch sử undo không đổi. Lệnh bị chặn an toàn: toàn bộ bàn, chất đổ, giọt và undo không đổi. Hút quá lượng có sẵn: chỉ lấy đúng 10 mL đang có. |
| canonical describe | Đơn vị, thể tích, tổng phân tích Cu, phức chiếm 100 %, pH; registry `SPECIES` (id, pha, điện tích; hệ yếu có điện tích `null`); 29 thẻ đều chuyển được thành template chuẩn. |
| metamorphic | Rót một lần hay chia 15 phần (NaOH), 30 phần (NH₃) cho cùng kết quả, và kết quả khác 0. Đổi vị trí hoặc thứ tự tạo bình cho cùng kết quả. `snapshot`/`restore`, `migrate` → `validateSave` → `load` giữ nguyên số liệu và sự kiện. Bản lưu cũ chưa có `events` vẫn mở được. `events` sai định dạng bị từ chối. `reset` trả về đúng bàn đã đánh dấu. |
| Guided = Sandbox | Cùng cốc, cùng thao tác: bài Guided "kết tủa" và Sandbox cho cùng lượng (sai khác ≤ 10⁻⁶), kết quả khác 0. |
| open-ended A–E | Như mục 1. |

Kỳ vọng định lượng đều lấy từ lời giải tay viết trong test, không đọc ngược từ engine. Các test khoa học trước đó (`validation: …`, `gate 1: …`, `audit: …`) vẫn chạy.

## 3. Review độc lập (Antigravity, chỉ đọc) và cách xử lý

File: `agy/agy-foundation-review.md`. Claude kiểm lại từng mục bằng cách đọc mã, rồi sửa:

| Mức | Phát hiện | Xử lý |
|---|---|---|
| P0 | `pick` khi kẹp đang giữ một mẩu chất sẽ ghi đè `load`, khiến mẩu Na đang bị chặn có thể rơi vào axit | Hợp đồng từ chối `pick` khi dụng cụ đang giữ; có test |
| P0 | `replace` chất rắn ném lỗi; `record()` chạy trước khi lệnh thành công nên khi lỗi có thể làm mất một mục undo | Hợp đồng chỉ cho thay dụng cụ; undo chỉ ghi sau khi lệnh thành công |
| P0 | NaN ở tọa độ, góc nghiêng, cường độ khuấy | Hợp đồng kiểm tra số; `checkInvariants` kiểm tra vị trí |
| P1 | Hợp đồng hở: chai chứa chất rắn, cầu muối hay CO₂ sai dụng cụ, nối hoặc rót vào chính nó, V âm, `release`/`grab` sai dụng cụ | Sửa tất cả; có test |
| P1 | `ppt-CuI` trỏ tới id không có trong manifest nên mặc định thành APPLIED; quá trình không có trong manifest mặc định APPLIED | Tính vào `redox-cu-i`; không có trong manifest thì mặc định **UNVERIFIED** |
| P1 | Ghi chú nhiệt Daniell bị gắn VALIDATED; etanol nguyên chất bị gắn UNSUPPORTED | Cả hai thành `OUT_OF_MODEL_RANGE` |
| P1 | `describe()`: thiếu đơn vị, tính phức khi pH không áp dụng, bỏ sót cặn, báo 25 °C giả cho ống nhỏ giọt | Sửa cả bốn |
| P1 | Lưu/mở chưa kiểm tra và chưa chuẩn hóa `events` | Đã có kiểm tra (`validateSave`), `migrate` và `load` chuẩn hóa |
| P1 | Một số test vẫn đạt kể cả khi tính năng hỏng | Siết chặt: so cả bàn, lượng chính xác, kết quả khác 0, đi qua đường `persistence` thật, Mg không đổi |
| P2 | Không giới hạn số sự kiện bị chặn; lệnh trùng tên thuộc tính prototype | Sửa |
| P2 | F01–F03 chưa đối chiếu với pixel canvas | Chưa làm (để phiên sau) |

## 4. Hồi quy (lượt cuối, một bản build, chạy tuần tự)

Lệnh và log: `regression/final/` (trích dòng kết quả trong `regression/final/RESULTS.txt`, vì `*.log` bị `.gitignore` loại).

| Bước | Kết quả |
|---|---|
| `npx vite build` | PASS |
| `node scripts/test-dlab.mjs` | **PASS 128/128** (trước Foundation: 123) |
| `node scripts/dlab-sci-validate.mjs` | PASS 104/104 |
| `npm run check` | PASS |
| E2E Chromium (`node scripts/dlab-e2e.mjs`) | **98/99**: F03 FAIL do chính test so `JSON.stringify` toàn bộ objects trong lúc mô phỏng đang chạy, nên các trường hiển thị `vis` đổi theo từng khung hình. Đã sửa (tạm dừng mô phỏng, bỏ qua `vis`); chạy lại F01–F03: **3/3 PASS trong 3 lượt liên tiếp**. 96 test cũ: PASS |
| Guided walk (5 bài, qua UI) | PASS 5/5; 0 lỗi console; 0 yêu cầu ChemAI |
| `npm run check:browser` | PASS 448/448 |
| E2E Firefox / WebKit | **NOT RUN** trong đợt này (FPS P01/P01b vẫn FAIL trên máy này từ round 4) |

## 5. Gate khoa học (báo riêng, Foundation không thay thế)

| Gate | Trạng thái |
|---|---|
| 1 Scientific core | PARTIAL: không còn P0/P1 đã biết ở chức năng tuyên bố hỗ trợ; 5 mục UNVERIFIED; một số giá trị số cần đối chiếu trang nguồn (xem `SCIENTIFIC_CORRECTIONS.md`) |
| 2 Equipment & interaction | **Đạt cho phạm vi đã kiểm**: hợp đồng lệnh; lệnh bị từ chối không có tác dụng phụ; bảo toàn khi rót/hút; 2D/3D/Guided/Sandbox dùng chung `dispatch` |
| 3 Simulation & visualization | PARTIAL: sự kiện chỉ sinh từ engine, renderer không tự tạo sản phẩm; chưa rà lại toàn bộ hình 3D |
| 4 Guided & Sandbox | PARTIAL: Guided 5/5 qua UI, 29 thẻ X06 qua UI, Sandbox mở F01–F02; chưa có chuyên gia giáo dục duyệt |
| 5 Final validation | PARTIAL: ma trận 75 mục (25/9/5/28/8, không đổi); FPS Firefox/WebKit chưa đạt (round 4) |

## 6. Chưa kiểm chứng trong đợt này

- E2E Firefox/WebKit cho F01–F03 (mới chạy trên Chromium).
- Chưa đối chiếu pixel canvas của F01–F03 (mới kiểm state và sự kiện qua UI thật).
- Kịch bản B và D chưa có bản qua UI (mới có ở unit).
- Năm mục kết tủa UNVERIFIED và các hằng số cần đối chiếu nguồn: không đổi so với `SCIENTIFIC_CORRECTIONS.md`.

## 7. Foundation Exit (27/11/2026)

| Kiểm tra | Kết quả |
|---|---|
| Toàn bộ E2E Chromium sau khi sửa F03 (96 test cũ + F01–F05) | **101/101 PASS** (`exit/e2e-chromium.log`; CPU 45 % lúc bắt đầu) |
| F03: sửa race condition có đúng không | Test tạm dừng mô phỏng rồi so toàn bộ objects, chỉ bỏ trường hiển thị `vis`. Mọi dữ liệu khoa học (contents, vị trí, chất rắn, nhiệt độ) vẫn được so; kỳ vọng `INVALID_INPUT` giữ nguyên |
| Kịch bản B qua UI (**F04**) | PASS: AgNO₃ + NaCl; đổi lượng NaCl thì chất hết trước đổi theo (Cl⁻ rồi Ag⁺), sự kiện `ppt-AgCl` là APPLIED/VALIDATED |
| Kịch bản D qua UI (**F05**) | PASS: Cu(OH)₂ → HCl hòa tan → kẹp (UI) thả đinh Fe → Cu bám. Engine ghi đúng cả Fe + 2H⁺ (axit dư) và **không** ghi "trung hòa" khi axit hòa tan Cu(OH)₂ |
| Đối chiếu state với canvas 2D | F02: sau khi khuấy, pixel chất lỏng là màu xanh thẫm (B > R + 60), khớp với phức 100 % trong `describe()` |
| Đối chiếu với 3D | Chưa tự động hóa. Bằng chứng là ảnh round 4 (`final/round4/shots/r4-ammine-*`), cùng đường đọc state |
| Firefox / WebKit: các kịch bản Sandbox (F01–F05, S23, S24) | **7/7 PASS / 7/7 PASS** (CPU 54 % / 0 % lúc bắt đầu). P01/P01b (FPS) không chạy lại: vẫn ở mức "FAIL UNDER CURRENT ENVIRONMENT" của round 4 |
| Thư viện thí nghiệm, 6 journey EXP + L01 | Chromium 7/7, Firefox 7/7, WebKit 7/7 |
