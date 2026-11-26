# ChemLab 7.0 — Foundation Architecture

Viết cho: kỹ sư (người hoặc AI) phát triển tiếp Dynamic Lab.

**Nguyên tắc:** một engine, một state. Không có engine thứ hai và không có kết quả nào gắn cứng theo thẻ thí nghiệm. Foundation chuẩn hóa và mở rộng engine sẵn có (`src/dlab/engine/`), không viết lại.

```
Dữ liệu khoa học (data/materials.js, reactions.js, validation.js)
  → State (sim.state: mol / mL / °C)
  → Lệnh (sim.dispatch: contract.js → safety.js → handler, có rollback)
  → Engine (chemistry.js: pH, Ksp, phức amin, oxi hóa – khử; processes.js: động học, nhiệt, điện hóa, rót…)
  → Ghi chú (noteOnce) → state.events (domain.js classifyNote)
  → 2D (render2d.js) · 3D (render3d.js) · Bảng Quan sát · Guided (guided.js) · Sandbox (manifest DISCOVER)
```

## 1. Module

| Đường dẫn | Vai trò |
|---|---|
| `src/dlab/data/materials.js` | Ion (điện tích, thủy phân, phức amin), hằng số axit, Ksp, chất lỏng, khí, chất chỉ thị, hóa chất trong tủ (id, công thức, nồng độ, nguy hiểm). |
| `src/dlab/data/reactions.js` | Quy tắc động học kim loại/chất rắn (`KINETIC`), oxi hóa – khử ion (`ION_REDOX`), điện hóa (`ELECTRO`), danh sách không phản ứng (`NO_REACTION`), cảnh báo "chưa hỗ trợ" (`UNSUPPORTED_HINTS`, `ION_HINTS`, `SOLVENT_HINTS`). |
| `src/dlab/data/manifest.js` | Danh mục 75 quá trình mà lab tuyên bố, kèm demo. `DISCOVER` = 29 thẻ Sandbox. |
| `src/dlab/data/validation.js` | **Mới:** trạng thái kiểm chứng của từng mục manifest kèm bằng chứng. Mặc định là UNVERIFIED. |
| `src/dlab/engine/chemistry.js` | Cân bằng: pH theo cân bằng điện tích, Ksp, phức amin theo từng nấc, oxi hóa – khử nhanh, trộn, rót ra. |
| `src/dlab/engine/processes.js` | Các quá trình theo từng bước thời gian, màu, ghi chú (`noteOnce` giờ phát thêm `state.events`). |
| `src/dlab/engine/safety.js` | Chặn và cảnh báo an toàn (`assess`). |
| `src/dlab/engine/contract.js` | **Mới:** hợp đồng lệnh thống nhất (`COMMAND_CONTRACT`, `contractProblems`). |
| `src/dlab/engine/domain.js` | **Mới:** `SPECIES`, `describe()`, `classifyNote()`, `containerOfNote()`, `experimentTemplate()`. |
| `src/dlab/engine/sim.js` | State, `dispatch` (outcome), bước thời gian cố định, undo/reset, snapshot/restore. |
| `src/dlab/persistence.js` | Lưu/mở bài (schema, kiểm tra hợp lệ, migrate). |
| `src/dlab/ui/dlabApp.js` | UI 2D/3D, thư viện, thanh thao tác, Guided, Sandbox; mọi thao tác đều gọi `sim.dispatch`. Cung cấp `window.ChemLabDynamicLab.describe(id)` và `.events(since)`. |

## 2. State khoa học chuẩn

`sim.state` là nguồn duy nhất:
- **Vật chứa:** `contents = { liquids: {water, ethanol, oil: mL}, ions: {id: mol}, precipitates: {id: mol}, indicators: {id: giọt} }`, cùng với `T` (°C), `pH` (suy ra; `null` khi thang pH không áp dụng), `gasOut` (mol khí đã thoát), `vis` (chỉ dùng để hiển thị).
- **Chất rắn:** là vật trên bàn (`type: 'solid'`, `reagent`, `massG`, `in`, `coat`).

Ion của hệ yếu (SO₄, OAc, NH₃, CO₃) và kim loại tạo phức được lưu theo **tổng phân tích**; dạng tồn tại (speciation) được giải từ pH.

`describe(state, id)` trả về trạng thái khoa học của một vật chứa, có đơn vị rõ ràng:

```
{ id, type, capacityML, volumeML, T, pH, ionicStrength,
  liquids{mL}, dissolved{mol}, complexes{mol}, precipitates{mol}, indicators, solids[{reagent, massG, coat}],
  gasReleased{mol}, unsupported, units: { amount: 'mol', liquid: 'mL', T: '°C' } }
```

`SPECIES`: registry thống nhất gồm `id` (khóa ổn định), `formula`, `name` (hiển thị), `phase` (aq/s/l/g), `charge` (`null` với hệ yếu vì điện tích phụ thuộc pH), `molarMass`, `Ksp`, `group`.

**Bất biến:**
- Kiểm tra sau mỗi lệnh (`checkInvariants`): không có lượng âm, NaN hay nhiệt độ vô lý; nếu vi phạm thì rollback.
- Kiểm tra bằng test:
  - Bảo toàn nguyên tố cho mọi demo (test `gate 1`).
  - Không chuyển nhiều hơn lượng đang có: `pourExact`, `aspirate`, `dispense` đều giới hạn theo lượng sẵn có.
  - Chất tràn ra ngoài sức chứa được ghi vào `state.spill` (vẫn bảo toàn), không bị mất.

## 3. Lệnh (dùng chung cho 2D, 3D, Guided, Sandbox và test)

`sim.dispatch(cmd, { confirmed, record })` trả về `{ ok, outcome, verdict, ...kết quả }`:
1. `contractProblems(state, cmd)`: id tham chiếu phải tồn tại và có đúng chức năng (`EQUIPMENT[type].caps`); lượng phải là số dương hữu hạn; loại hóa chất phải phù hợp. Sai thì trả về `INVALID_INPUT`, **không thay đổi gì**, kể cả nhật ký và lịch sử undo.
2. `assess(state, cmd)` (an toàn): `SAFETY_BLOCKED` (state khoa học giữ nguyên; nhật ký và `state.events` ghi lại lần bị chặn) hoặc `NEEDS_CONFIRMATION` (cảnh báo chưa được xác nhận, chưa thay đổi gì).
3. Handler chạy rồi kiểm tra bất biến. Có lỗi thì khôi phục snapshot và trả lại lịch sử undo. Thành công thì trả về `APPLIED`.

Bảng `COMMAND_CONTRACT` trong `contract.js` liệt kê từng lệnh: `add`, `move`, `tilt`, `pourExact`, `aspirate`, `dispense`, `pick`, `grab`, `release`, `stir`, `burner`, `power`, `wire`, `link`, `co2`, `remove`, `cleanup`, `replace`, `newLitmus`, `addReagentTo`. Đơn vị: mL, g, giọt, V, mm (vị trí), rad (góc nghiêng). Undo, đặt lại, lưu/mở là phương thức của `sim` (`undo`, `markInitial`/`reset`, `snapshot`/`restore` + `persistence.js`).

## 4. Bộ giải quá trình (theo state, không theo thẻ)

Mỗi bước, mỗi vật chứa đều chạy qua cùng một chuỗi:
1. `ionHints`: các tổ hợp chưa hỗ trợ.
2. Rót theo góc nghiêng.
3. CO₂.
4. Nhiệt và sôi.
5. Kết tinh.
6. Chất rắn: chọn theo thứ tự `UNSUPPORTED_HINTS`, `SOLVENT_HINTS`, `KINETIC`, `NO_REACTION`, rồi so sánh E°.
7. `equilibrate`: Ksp, oxi hóa – khử ion, rồi Ksp lại; pH và phức amin được giải đồng thời.
8. Điện hóa.

Các điều kiện engine xét: ion có mặt (theo ngưỡng), pH, nồng độ, tỉ lệ dung môi, nhiệt độ. **Không chỗ nào tra theo id thẻ hay id bài**; Guided chỉ kiểm tra điều kiện hoàn thành bài trên state.

Kết quả chuẩn cho mỗi ghi chú (`classifyNote`):

| Kết quả | Khi nào |
|---|---|
| `APPLIED` | Quá trình được mô hình hóa đã chạy. Sự kiện mang `process` (id manifest) và `validation` (VALIDATED / EDUCATIONAL APPROXIMATION). |
| `UNVERIFIED` | Đã chạy, nhưng mục manifest tương ứng còn UNVERIFIED. Không bao giờ được trình bày như kết quả đã kiểm chứng. |
| `NO_REACTION_UNDER_MODELED_CONDITIONS` | Ghi chú `norx-`. |
| `UNSUPPORTED` | `unsup-`, `ionhint-`, `electro-unsup-`, `unsupported-hno3-`, `solvent-eth-`. |
| `OUT_OF_MODEL_RANGE` | `solvent-mix-` (pH không áp dụng khi nhiều etanol). |
| `INVALID_INPUT`, `SAFETY_BLOCKED` | Do `dispatch` trả về; lần bị chặn cũng có trong `state.events`. |
| `OBSERVATION` | Quan sát thuần (giấy quỳ, khuấy, giọt, tràn, cạn). |

## 5. Luồng quan sát

`state.events` (tối đa 200 sự kiện), mỗi sự kiện có dạng `{ t, key, kind, text, container, outcome, process, validation, state: { pH, T, volumeML } }`. Sự kiện **chỉ** sinh ra từ chỗ engine thực sự tính toán (`noteOnce`), nên không thể có sự kiện "kết tủa" khi engine không tạo kết tủa. Renderer đọc `describe()` hoặc state cho định lượng, và đọc `events` cho "chuyện gì vừa xảy ra"; renderer không tự tạo sản phẩm.

## 6. Thêm một phản ứng

1. Thêm dữ liệu vào `reactions.js` (`KINETIC` hoặc `ION_REDOX`, có phương trình cân bằng) hoặc vào `materials.js` (ví dụ Ksp mới trong `PRECIPITATES`), kèm nguồn trong chú thích.
2. Thêm mục manifest có demo; demo tự trở thành test registry và test bảo toàn `gate 1`.
3. `node scripts/dlab-sci-validate.mjs`: phương trình phải cân bằng và khớp tỉ lượng.
4. Thêm test định lượng có lời giải tay. Chỉ sau đó mới đặt trạng thái trong `data/validation.js` lên VALIDATED; thiếu bằng chứng thì để UNVERIFIED.
5. `node scripts/dlab-sci-matrix.mjs` và `node scripts/dlab-manifest.mjs`.

## 7. Thêm một thí nghiệm (template)

Thêm một mục manifest có `demo: { vessel, fill: [[reagent, mL]], pour | solid, run, expect }`, với hóa chất đã có trong tủ. `experimentTemplate(entry)` sẽ chuẩn hóa mục đó thành `{ id, category, objective, initialEquipment, initialChemicals, studentAction, expectedPhenomena, processRefs, conditions, validationStatus, limits }`. Thẻ Sandbox và journey E2E X06 tự nhận mục mới mà không cần viết thêm mã.
