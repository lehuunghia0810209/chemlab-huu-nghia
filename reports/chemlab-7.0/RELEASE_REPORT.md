# ChemLab 7.0 — Release report (Phase 5)

## Trạng thái tổng thể: PARTIAL

Lý do không phải RELEASE READY:
- D31: hằng số khoa học chưa được chuyên gia đối chiếu với bản gốc (xem `SCIENTIFIC_VALIDATION.md` §6).
- D34: chưa có Cloudflare Preview của bản 7.0 và chưa có phê duyệt (xem dưới).
- D30: cảm ứng thật (pinch, kéo bằng ngón tay trên thiết bị) chưa kiểm trên thiết bị thật; E2E mobile dùng sự kiện con trỏ trong viewport 390/320 px.

## Rủi ro phát hành đã xác định

1. **ChemAI bị khóa nếu đổi version mà không cập nhật approval.** Public mode yêu cầu `CHEMAI_PUBLIC_APPROVAL=groq:<APP_VERSION>` khớp chính xác. Đổi `package.json` sang 7.0.0 rồi phát hành khi biến vẫn là `groq:6.7.0` sẽ khóa ChemAI trên Production. Phải đặt `groq:7.0.0` **trước** khi push main (Pages đóng băng biến theo deployment). Agent không tự đổi biến này.
2. Preview dùng chung Durable Object `CHEMAI_BUDGET` với Production: không gửi câu hỏi ChemAI thật trên Preview.
3. Preview được bảo vệ bằng Cloudflare Access (302): kiểm tra Preview cần phiên đăng nhập của chủ sở hữu; không mở công khai.
4. Service worker: `release:sync` đổi cache namespace theo version → người dùng nhận bản mới qua luồng nâng cấp PWA hiện có (đã có journey kiểm thử trong `browser-smoke`).

## Kế hoạch phát hành (khi chủ sở hữu duyệt)

1. Chuyên gia duyệt `SCIENTIFIC_VALIDATION.md`; sửa nếu cần.
2. Đổi version `7.0.0` trong `package.json`, chạy `npm run build` (prebuild = `release:sync` + `check`).
3. `npm run check:browser` (3 trình duyệt) + `node scripts/dlab-e2e.mjs` (Chromium, Firefox, WebKit).
4. Push nhánh `feature/chemlab-7.0-dynamic-laboratory` → Cloudflare Pages tạo Preview; chủ sở hữu mở Preview (Access) và kiểm tra `#dlab`.
5. Chủ sở hữu đặt `CHEMAI_PUBLIC_APPROVAL=groq:7.0.0` (chỉ khóa này) **trước** bước 6.
6. Fast-forward `main` → Production. Kiểm tra: trang chủ, `#lab`, `#dlab`, ChemAI 1 câu hỏi thật, PWA nâng cấp.
7. Chỉ khi 7.0 ổn định mới cân nhắc thay phòng lab cũ bằng `#dlab` (một thay đổi riêng).

## Rollback

- Production hiện tại 6.7.0 = deployment `e1d7dc13` (commit 8ce6f35). Rollback = “Rollback to this deployment” trên Cloudflare Pages tới `e1d7dc13`, rồi đặt lại `CHEMAI_PUBLIC_APPROVAL=groq:6.7.0`.
- Mã: `git revert` hai commit `dab9857`, `30e41b0` (và các commit 7.0 sau đó) — dlab là thư mục riêng, phòng lab cũ không bị sửa nên revert sạch.
- Dữ liệu người dùng: Dynamic Lab lưu trong IndexedDB riêng `chemlab-dynamic-lab`; không đụng tiến độ học tập/`localStorage` hiện có, nên rollback không làm mất dữ liệu cũ.

## D01–D34

| ID | Trạng thái | Triển khai | Bằng chứng |
|---|---|---|---|
| D01 Bàn thí nghiệm tự do | PASS | `ui/dlabApp.js`, `engine/sim.js` | S05, S23, M01 |
| D02 Scientific Workspace | PASS | header/thư viện/bàn/inspector/toolbar | S01–S25, R01, A01 |
| D03 Kéo thả, thao tác dụng cụ | PASS | Interaction Controller | S02–S05, S08, S10, M01 |
| D04 Rắn, lỏng, khí, dung dịch | PASS (khí: CO₂ từ bình + khí sản phẩm H₂/CO₂/Cl₂) | `data/materials.js` | S10, S13, unit CO₂ |
| D05 Giấy quỳ nhúng trực tiếp | PASS | `stepLitmus` | S02–S04, unit litmus |
| D06 Chỉ thị theo trạng thái hóa học | PASS | `indicatorColor` + pH | S07, unit |
| D07 Khuếch tán màu động | PASS (xấp xỉ hình ảnh) | tracer 10×14 | S07, unit |
| D08 Rót theo thao tác | PASS | `retainedVolumeAtTilt`, `lipPoint` | S05 |
| D09 Bảo toàn khi chuyển bình | PASS | `withdraw`/`mix` | S05, unit |
| D10 Chemistry Engine định lượng | PASS | `engine/chemistry.js` | unit fixtures |
| D11 Rắn nổi/chìm/biến đổi | PASS | `stepSolid` | unit Na, S11 |
| D12 Bọt khí theo phản ứng | PASS | `emitBubbles` theo mol khí | unit, S12 |
| D13 Kết tủa và lắng | PASS | Ksp + hạt | S09, unit |
| D14 Hòa tan và kết tinh | PASS (kết tinh chỉ unit test) | `stepDissolve`, `crystallize` | S10, unit KNO₃ |
| D15 Kim loại | PASS | `KINETIC` | S11, unit, Guided metals |
| D16 Điện hóa | PASS | `stepElectro` | S12, unit Faraday/Nernst |
| D17 Hữu cơ | PASS | axit axetic, NaHCO₃, dầu/etanol | S13, Guided organic |
| D18 Cảnh báo an toàn trước thao tác | PASS | `engine/safety.js` | S14, S15, unit |
| D19 Dụng cụ hư hỏng | PASS | `damage()` | S15, unit |
| D20 Guided Lab | PASS (5 bài; 1 bài qua UI, 5 bài qua lệnh) | `guided.js` | S22, unit |
| D21 Sandbox | PASS | | S23 |
| D22 Pause/Resume | PASS | | S16 |
| D23 Tốc độ 0,25×–4× | PASS | clock | S17, unit |
| D24 Undo/Reset/Cleanup | PASS | | S18, S19, unit |
| D25 Save/Load/Resume | PASS | `persistence.js` | S20, unit |
| D26 2D/3D chung trạng thái | PASS (3D chỉ quan sát; thao tác ở 2D) | `render3d.js` | S21, P02 |
| D27 ChemAI chỉ theo yêu cầu | PASS | nút “Hỏi ChemAI” điền sẵn câu hỏi | S25 |
| D28 Không video dựng sẵn | PASS | không có asset video | mã nguồn |
| D29 Không tiêu token khi mô phỏng | PASS | | S25 |
| D30 Desktop + mobile | PARTIAL | responsive, drawer | M01, R01; chưa thử cảm ứng thật |
| D31 Scientific validation | PARTIAL | | SCIENTIFIC_VALIDATION.md; chờ chuyên gia |
| D32 Automated tests | PASS | | 36 unit + 31 E2E × 3 trình duyệt |
| D33 Không regression | PASS | | `check` + `check:browser` 448/448 |
| D34 Preview + rollback | PARTIAL | kế hoạch rollback sẵn | chưa push/Preview (cần duyệt) |
