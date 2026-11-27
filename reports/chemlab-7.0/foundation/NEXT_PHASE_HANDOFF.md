# ChemLab 7.0 — Next Phase Handoff (khoa học)

Viết cho: phiên phát triển tiếp theo, dù là AI hay người. Đọc file này trước khi sửa engine, dữ liệu hay nội dung bài.

## 0. Trạng thái

- Nhánh `feature/chemlab-7.0-dynamic-laboratory`. Commit mới nhất là commit Foundation ngay sau `91ac642` (xem `git log -1`). Chưa push, merge hay deploy. Production vẫn là 6.7.0.
- Đợt Foundation đã xong: `FOUNDATION_ARCHITECTURE.md` mô tả kiến trúc, `FOUNDATION_VALIDATION.md` ghi những gì đã chạy. Đợt khoa học trước đó: `SCIENTIFIC_VALIDATION_MATRIX.md` (75 mục, 25/9/5/28/8) và `SCIENTIFIC_CORRECTIONS.md`.
- Trạng thái: **FOUNDATION PARTIAL.**
  - Đã có: state chuẩn, lệnh thống nhất, bộ giải theo state, Sandbox mở chứng minh qua UI, luồng sự kiện.
  - Còn thiếu: E2E Firefox/WebKit cho F01–F03; kiểm pixel canvas; kịch bản B và D qua UI.
  - Gate khoa học vẫn PARTIAL, và FPS Firefox/WebKit chưa đạt.

## 0.1 API đã sẵn sàng (Foundation)

| API | Dùng để |
|---|---|
| `sim.dispatch(cmd, { confirmed })` → `{ ok, outcome }` | Mọi thao tác. `outcome` ∈ APPLIED, INVALID_INPUT, SAFETY_BLOCKED, NEEDS_CONFIRMATION |
| `COMMAND_CONTRACT`, `contractProblems` (`engine/contract.js`) | Hợp đồng lệnh: id tham chiếu và chức năng, đại lượng và đơn vị |
| `describe(state, id)` (`engine/domain.js`), `window.ChemLabDynamicLab.describe(id)` | Trạng thái khoa học của một vật chứa (mol, mL, °C, pH, phức, kết tủa, chất rắn, khí, cặn) |
| `state.events`, `window.ChemLabDynamicLab.events(since)` | Sự kiện quan sát: `{ t, key, container, outcome, process, validation, state }` |
| `SPECIES` | Registry chất (id ≠ công thức ≠ tên) |
| `experimentTemplate(entry)` | Thẻ hoặc thí nghiệm dưới dạng dữ liệu |
| `VALIDATION`, `validationOf` (`data/validation.js`) | Trạng thái kiểm chứng; dùng chung cho engine và ma trận |

## 0.15 Hợp đồng được giữ cố định (từ Foundation Exit)

Chỉ sửa khi có lỗi hoặc nhu cầu tích hợp đã được chứng minh; không refactor lớn:
- `engine/contract.js`
- `engine/domain.js`
- Bộ giải quá trình (`chemistry.js`, `processes.js`)
- Luồng sự kiện (`state.events`)
- Ma trận kiểm chứng (`data/validation.js`)
- Schema lưu/mở (`persistence.js`)
- Các template trong manifest `DISCOVER` (29 ở Foundation Exit; Phase 2 thêm `acid-base-ph`, `weak-acid-titration`, thành 31)

Các sửa lỗi khoa học và an toàn của `91ac642` phải được giữ nguyên.

## 0.16 Experiment Library (phase sản phẩm 1)

- **Dữ liệu:** `src/dlab/data/experiments.js`. Nhóm 1, "Kết tủa, hòa tan và tạo phức", có 6 thí nghiệm. Trạng thái kiểm chứng được **suy ra** bằng `experimentValidation`.
- **Giao diện:** tab "Khám phá", mục đầu tiên, với nhãn kiểm chứng, nút "Bày dụng cụ" và phần "Hướng dẫn".
- **Test:** unit `experiment library: every experiment runs on the engine`; phương trình trong `dlab-sci-validate`; E2E `EXP` trên 3 trình duyệt.
- **Kế hoạch các nhóm tiếp theo:** `EXPERIMENT_LIBRARY_PLAN.md`.

## 0.17 Experiment Library Phase 2 (2026-11-26)

- Thêm 2 nhóm: "Axit – bazơ và chất chỉ thị" (6 thí nghiệm) và "Kim loại và dãy hoạt động hóa học" (5 thí nghiệm). Thư viện có 17 thí nghiệm không trùng nhau. Danh sách và trạng thái ở `EXPERIMENT_LIBRARY_PLAN.md` §2a.
- Schema thí nghiệm có thêm `grade`, `difficulty`, `safetyLevel`, `keywords`, `setup.tools`, các act `drops` và `solid`, và `expectState`. Không có engine riêng cho từng thí nghiệm.
- Hai mục manifest mới, `acid-base-ph` và `weak-acid-titration`, đều VALIDATED nhờ lời giải tay. Ma trận có 77 mục (27/9/5/28/8).
- UI: tìm kiếm, lọc mức độ, "Bày lại"; vị trí bày theo bề rộng thật (sửa lỗi chai đè cốc).
- Bằng chứng: `reports/chemlab-7.0/library/RESULTS.md`, ảnh ở `library/shots/`.

## 0.18 Phase 3 và phát hành 7.0.0 (2026-11-27)

- Thêm nhóm Điện hóa (3 thí nghiệm) và Oxi hóa – khử (2 thí nghiệm); thư viện có 22 thí nghiệm. Catalog có lọc theo nhóm, lớp, mức độ, mức kiểm chứng, và nút "Về bàn trống". Chi tiết ở `EXPERIMENT_LIBRARY_PLAN.md` §2b.
- Sửa engine: Nernst dùng ion tự do và chặn khi có phức NH₃; Fe³⁺/I⁻ chỉ tính khi pH < 3; sức chứa I₃⁻ dùng K = 710; báo OUT_OF_MODEL_RANGE khi redox iotua nằm ngoài khoảng pH; màu phenolphtalein theo Beer–Lambert.
- P03 (máy chậm) không còn phụ thuộc tốc độ máy: mỗi khung hình bị tải đúng 60 ms ngay trong trang, ngưỡng giữ nguyên.
- Kiểm 3D theo state: `node scripts/dlab-3d-state.mjs <url> <out>` (6 hiện tượng; đạt 5/6, 1 giới hạn P2: dung dịch màu nhạt gần như không thấy màu trong 3D).
- Version 7.0.0; phòng thí nghiệm động có trong thanh bên. Báo cáo phát hành: `reports/chemlab-7.0/release/RELEASE_7.0.0.md`.



- Một engine, một state. Không gắn cứng sản phẩm theo id thẻ hoặc id bài.
- Mọi thao tác đi qua `dispatch`. Lệnh bị từ chối không thay đổi state khoa học, undo hay nhật ký (lần bị chặn an toàn chỉ được ghi vào nhật ký và `events`). Undo chỉ ghi khi lệnh thành công.
- Sự kiện chỉ sinh từ engine (`noteOnce`). Renderer không tạo sản phẩm. Một quá trình UNVERIFIED hoặc không có trong manifest **không bao giờ** được báo là APPLIED/VALIDATED.
- Bảo toàn nguyên tố (`gate 1`); phương trình cân bằng (`dlab-sci-validate`); ma trận chỉ nâng lên VALIDATED khi có lời giải tay độc lập.

## 1. Tiêu chí khoa học không được vi phạm

1. **Unit test đạt không phải là bằng chứng khoa học.** Kỳ vọng định lượng phải đến từ lời giải tay hoặc bảng tham chiếu, viết trực tiếp trong test, không đọc ngược từ engine. Xem các test `validation: …` và `gate 1: …` trong `scripts/test-dlab.mjs`.
2. **Mọi phương trình hiển thị phải cân bằng và khớp tỉ lượng engine dùng.** Chạy `node scripts/dlab-sci-validate.mjs` (phải in PASS). Khi thêm phản ứng, thêm vào `KINETIC`/`ION_REDOX` thì script tự kiểm.
3. **Bảo toàn nguyên tố:** mọi demo trong manifest phải qua test `gate 1`. Thêm phản ứng mới thì phải có demo.
4. **Không chỉnh hằng số để test đạt.** Khi hai nguồn lệch nhau, xét điều kiện đo (nhiệt độ, lực ion, dạng chất rắn mới hay đã già) rồi mới chọn, và ghi lý do vào chú thích dữ liệu. Ví dụ đã làm: Ksp Cu(OH)₂ giữ giá trị CRC vì giá trị của kết tủa mới làm sai bài Guided "kết tủa".
5. **Mô hình lý tưởng (hoạt độ = nồng độ) có giới hạn.** Với chất ít tan mà Ksp lý tưởng mâu thuẫn với chính hóa chất của lab (Ca(OH)₂, CaSO₄), dùng cảnh báo "chưa mô hình hóa định lượng" theo độ tan đo được. Không thêm kết tủa giả.
6. **Chưa hỗ trợ thì phải nói rõ, không tạo sản phẩm.** Hiện tượng sai (sai sản phẩm, sai chất) là lỗi P1.
7. **Nội dung giáo dục:**
   - Tránh khẳng định tuyệt đối khi kết quả phụ thuộc điều kiện: dãy hoạt động có ngoại lệ kim loại kiềm và HNO₃; "axit mạnh" so với "axit mạnh hơn H₂CO₃".
   - Phương trình ion rút gọn phải giữ nguyên dạng phân tử của chất điện li yếu.
8. **Điều kiện hoàn thành bài Guided phải kiểm tra đúng hiện tượng.** Không so sánh với giá trị có thể là `null` (trong JS, `null < x` là `true`). Bước tính đạt phải dựa trên sự kiện thật của engine, ví dụ một ghi chú cụ thể.
9. **An toàn:** không bao giờ để pH bị ẩn (khi etanol > 10 %) làm mất một lệnh chặn. Độ axit phải tính từ ion.
10. **Nguồn tham khảo:** ghi rõ READ_PAGE, SNIPPET hay MEMORY. Không tạo URL. Kết quả trùng giữa hai AI không phải là bằng chứng.

## 2. Chưa kiểm chứng: việc ưu tiên cho phiên sau

| Mục | Việc cần làm |
|---|---|
| `ppt-CaCO3`, `ppt-BaCO3`, `ppt-ZnCO3`, `ppt-Ag2CO3`, `ppt-Zn(OH)2` | **UNVERIFIED:** mới có demo định tính. Cần test định lượng có lời giải tay (cacbonat bị proton hóa theo pH). |
| Bảng điểm sôi nước–etanol | Có thể lệch 1,5–2,5 °C. Cần đọc nguồn VLE ở 101,325 kPa (Carey & Lewis 1932 hoặc bảng hiện đại), rồi thay bảng và cập nhật test. |
| Độ tan Ca(OH)₂, CaSO₄; Ksp FeCO₃, MgCO₃ | Giá trị lấy theo trí nhớ hoặc snippet. Cần đối chiếu trang nguồn (CRC). |
| Phức amin của Cu và Zn | EDUCATIONAL APPROXIMATION: lg β₄ lệch nhau tới khoảng 1,5 giữa các nguồn. Chỉ phức của Ag đã được kiểm chứng định lượng. |
| Pin Daniell, Cu²⁺ + I⁻ | Chưa tính phức amin nếu học sinh thêm NH₃. Cổng pH ≤ 7 của phản ứng iotua là chặn thô. |

## 3. Backlog P2 (Antigravity đã nêu, chưa sửa)

- Thuật ngữ: thống nhất danh pháp theo chương trình GDPT 2018 (ví dụ hiđroxit/hydroxide, axit/acid) sau khi chủ sở hữu chọn chuẩn.
- Ngưỡng sốc nhiệt cho thủy tinh borosilicat (`processes.js`, `safety.js`).
- Bảng Quan sát có thể gắn sự kiện pH hoặc chỉ thị vào nhầm cốc khi một phản ứng chạy ở nhiều cốc (`observations.js`).
- Vết sunfat cỡ 10⁻⁷ mol trong HCl chặn nhầm CaCO₃ + HCl, như thể là CaCO₃ + H₂SO₄.
- Sản phẩm của kim loại + HNO₃ chỉ ghi "NOx".
- Cu²⁺/Fe³⁺ + I⁻: manifest chưa nêu điều kiện pH ≤ 7; demo dùng hết I⁻ nên không còn I₃⁻.
- Chi tiết: `agy/agy-content-audit.md` mục P2, `agy/agy-data-audit.md` mục P2.

## 4. Lệnh kiểm tra (chạy tuần tự)

```
node scripts/test-dlab.mjs                 # unit + validation + gate 1 + foundation + library (138 test)
node scripts/dlab-sci-validate.mjs         # phương trình, tỉ lượng, khối lượng mol (độc lập)
node scripts/dlab-sci-matrix.mjs           # tạo lại ma trận
node scripts/dlab-manifest.mjs             # tạo lại REACTION_SUPPORT_MANIFEST.md
npx vite build
CHEMLAB_BROWSER=chromium node scripts/dlab-e2e.mjs
node scripts/dlab-guided-walk.mjs "http://[::1]:5180/"
```

Antigravity (chỉ đọc): `agy -p "$(cat prompt)" --mode plan --model gemini-4-neon-high --settings reports/chemlab-7.0/foundation/agy/agy-settings-readonly.json`.

## 5. Gate khoa học: trạng thái hiện tại

| Gate | Trạng thái | Lý do |
|---|---|---|
| 1. Scientific core | **PARTIAL** | Không còn P0/P1 đã xác nhận ở chức năng tuyên bố hỗ trợ; bảo toàn đã kiểm cho mọi demo. Còn 5 mục UNVERIFIED và một số giá trị mới cần đối chiếu nguồn. |
| 2. Equipment & interaction | PARTIAL | Bảo toàn khi rót/chuyển và lệnh bị từ chối không tác dụng phụ: có test sẵn. Đợt này không rà lại toàn bộ. |
| 3. Simulation & visualization | PARTIAL | Màu và hiện tượng lấy từ state (round 4). Chưa rà soát lại toàn bộ hình 3D. |
| 4. Guided & Sandbox | PARTIAL | Đã sửa các điều kiện có thể vượt qua mà Antigravity chỉ ra. Chưa có chuyên gia giáo dục duyệt nội dung. |
| 5. Final validation | **PARTIAL** | Đã có ma trận và báo cáo sửa lỗi. Còn UNVERIFIED và P2. FPS Firefox/WebKit chưa đạt (round 4). |

## 6. Kế hoạch đợt sau (theo thứ tự)

1. **Experiment Catalog:** UI chọn template theo `experimentTemplate`, lọc theo nhóm và `validationStatus`. Hiện chỉ có tab "Khám phá" với 29 thẻ.
2. **Thí nghiệm mới:** mỗi thí nghiệm là một mục manifest có demo, có lời giải tay và trạng thái kiểm chứng đúng, theo quy trình ở `FOUNDATION_ARCHITECTURE.md` §6–7. Ưu tiên kiểm chứng 5 mục kết tủa UNVERIFIED trước khi mở rộng.
3. **3D:** chỉ đọc `describe()` và `events()`. Không tự tạo hiệu ứng ngoài engine (bóng đổ, mô hình .glb là việc tùy chọn).
4. Thêm F01–F03 cho Firefox/WebKit, kiểm pixel canvas, và B/D qua UI.

## 7. Prompt tiếp tục (dùng độc lập)

> Tiếp tục ChemLab 7.0 Dynamic Lab trong `D:\EduLab\ChemLab`, nhánh `feature/chemlab-7.0-dynamic-laboratory`, từ commit mới nhất. Đọc `reports/chemlab-7.0/foundation/NEXT_PHASE_HANDOFF.md`, `FOUNDATION_ARCHITECTURE.md`, `FOUNDATION_VALIDATION.md`, `SCIENTIFIC_CORRECTIONS.md`. Giữ một engine, một state; mọi thao tác qua `sim.dispatch`; không tạo phản ứng hay sản phẩm khi chưa có nguồn và lời giải tay; không đổi trạng thái ma trận nếu thiếu bằng chứng; không chỉnh hằng số để test đạt; không hạ ngưỡng FPS. Việc của đợt này: [điền: Experiment Catalog / thí nghiệm mới / 3D]. Chạy `node scripts/test-dlab.mjs`, `node scripts/dlab-sci-validate.mjs`, `npx vite build`, `CHEMLAB_BROWSER=chromium node scripts/dlab-e2e.mjs`, Guided walk. Chỉ commit cục bộ bằng pathspec; không động vào 11 file `.claude/skills` đang staged; không push, merge hay deploy; báo PARTIAL trung thực.
