# ChemLab 7.0 — Release report (Phase 5, phiên hoàn thiện 2026-11-22)

## Trạng thái tổng thể: PARTIAL — Preview sẵn sàng cho nghiệm thu thủ công

Lý do chưa RELEASE READY (tiêu chí không bị nới):
- **D31** hằng số đã đối chiếu nguồn, nhưng còn mục **PENDING EXPERT REVIEW** (SCIENTIFIC_VALIDATION §8); chưa có chuyên gia thẩm định.
- **D30** cảm ứng chỉ kiểm bằng giả lập (CDP touch, 320/390/768 px); chưa có thiết bị thật.
- **LCP mobile** (Lighthouse giả lập 4G chậm) 2,9 s > mục tiêu 2,5 s; desktop 0,6 s đạt.
- Preview đã triển khai nhưng nằm sau Cloudflare Access; agent không có phiên đăng nhập nên **chưa ai kiểm tra nội dung Preview**.

## 1. Preview

| Mục | Giá trị |
|---|---|
| Nhánh | `feature/chemlab-7.0-dynamic-laboratory` (push với refspec tường minh; `main` không đổi = `8ce6f35`) |
| Commit ứng dụng | `4f89127` (commit tài liệu sau đó chỉ đổi `reports/`) |
| Cloudflare Pages | check-run "Cloudflare Pages" = success, "Deploy successful" cho `4f89127` |
| Preview URL (theo commit) | https://65f0a1a1.chemlab-edulab.pages.dev |
| Branch Preview URL | https://feature-chemlab-7-0-dynamic.chemlab-edulab.pages.dev (luôn trỏ commit mới nhất của nhánh) |
| Cloudflare Access | Cả hai URL trả 302 → `chemlab-edulab-pages.cloudflareaccess.com/cdn-cgi/access/login/…` (không gửi thông tin đăng nhập) |
| Production | `https://chemlab-edulab.pages.dev/` trả 200, hiển thị 6.7.0 — không bị ảnh hưởng |

Mở Lab trên Preview: `<Preview URL>/#dlab`. **Không gửi câu hỏi ChemAI trên Preview** (dùng chung Durable Object `CHEMAI_BUDGET` với Production).

## 2. Version, ChemAI và cache — phân tích (không thay đổi cơ chế)

| Thành phần | Nguồn | Liên kết |
|---|---|---|
| Version ứng dụng | `package.json` → `release:sync` → `src/appMeta.js` `APP_VERSION` | |
| ChemAI release | `functions/api/chat.js` dùng chính `APP_VERSION` (`release: APP_VERSION`) | cùng một số |
| `CHEMAI_PUBLIC_APPROVAL` | biến môi trường Cloudflare Pages (Production) | `functions/api/_access.js:108` yêu cầu khớp chính xác `"<provider>:<release>"`, ví dụ `groq:6.7.0`; sai → `PUBLIC_NOT_APPROVED`, ChemAI khóa (fail-closed) |
| Môi trường | Pages: biến Production và Preview tách riêng; biến "đóng băng" theo từng deployment | Preview không mở ChemAI public (host không thuộc `CHEMAI_PUBLIC_HOSTS`) |
| Cache service worker | `public/sw.js` `VERSION = 'chemlab-6.7.0-access-1'` (do `release:sync` sinh) | đổi version → namespace cache mới → luồng nâng cấp PWA hiện có |

Nhận định: việc buộc approval theo version là **có chủ đích** (comment ở `_access.js`: "a new release or another provider needs a new approval" — chủ sở hữu xác nhận lại điều khoản nhà cung cấp cho từng bản). Hệ quả: nâng 6.7.0 → 7.0.0 mà chưa đặt `groq:7.0.0` sẽ khóa ChemAI trên Production ngay khi deploy.

Phương án tách (đề xuất, **chưa làm** — là thay đổi cơ chế bảo mật, ngoài phạm vi được duyệt): thêm hằng `CHEMAI_RELEASE` riêng trong `src/appMeta.js` (chỉ đổi khi mã/nhà cung cấp ChemAI đổi), dùng nó thay `APP_VERSION` trong `accessOptions`; giữ nguyên quy tắc so khớp chính xác. Khi đó 7.0.0 (chỉ đổi Lab) không cần approval mới. Cần chủ sở hữu quyết định vì nó nới quy tắc "mỗi bản phát hành phải duyệt lại".

Quyết định trong phiên này: **giữ version 6.7.0 trên nhánh** (Preview hiển thị 6.7.0). Bản RC 7.0.0 là một bước riêng trong kế hoạch phát hành dưới đây.

## 3. Kế hoạch phát hành (chỉ khi chủ sở hữu duyệt)

1. Chủ sở hữu kiểm tra Preview theo checklist §6; chuyên gia duyệt SCIENTIFIC_VALIDATION §8 (sửa nếu cần).
2. Trên nhánh: đổi `package.json` → `7.0.0`; `npm run build` (prebuild = `release:sync` + `check`); hoàn nguyên thay đổi chỉ-xuống-dòng của `public/manifest.webmanifest`/`src/appMeta.js` nếu có.
3. `npm run check:browser` + `node scripts/dlab-e2e.mjs` × Chromium/Firefox/WebKit (chạy tuần tự, không song song).
4. Commit RC, push nhánh → Preview mới (kiểm tra commit trong check-run).
5. **Chủ sở hữu** đặt biến Production `CHEMAI_PUBLIC_APPROVAL=groq:7.0.0` (chỉ khóa này) **trước** bước 6.
6. Fast-forward `main` → Production. Kiểm tra: trang chủ, `#lab`, `#dlab`, một câu hỏi ChemAI thật, nâng cấp PWA.
7. Chỉ khi 7.0 ổn định mới cân nhắc thay phòng lab cũ bằng `#dlab` (thay đổi riêng).

## 4. Rollback

- Production hiện tại 6.7.0 = deployment `e1d7dc13` (commit `8ce6f35`). Rollback: Cloudflare Pages → "Rollback to this deployment" `e1d7dc13`, rồi đặt lại `CHEMAI_PUBLIC_APPROVAL=groq:6.7.0`.
- Mã: `git revert` các commit 7.0 (`dab9857`, `30e41b0`, `b379911`, `4f89127` và commit tài liệu) — `src/dlab/` là thư mục riêng; ngoài `src/main.js` (route), `src/routeModuleLoader.js` (thẻ lối vào), `src/virtualLab.css`, `package.json` (script) không có tệp cũ nào bị sửa.
- Dữ liệu: Dynamic Lab dùng IndexedDB riêng `chemlab-dynamic-lab`; không đụng tiến độ học tập/`localStorage` hiện có.

## 5. Tương tác 3D đã hỗ trợ (cùng Interaction Controller và Simulation Core với 2D)

| Thao tác | 3D | Bằng chứng |
|---|---|---|
| Chọn vật, khung chọn (Box3Helper), xem inspector | Có | T01 |
| Di chuyển dụng cụ trên mặt bàn (tia chiếu lên mặt phẳng z = 0) | Có | T02 |
| Nhấc lên, đặt xuống (settle như 2D) | Có | T02 |
| Nhúng giấy quỳ (giấy có texture 28 đoạn màu) | Có | T03 |
| Giữ cốc + lăn chuột / phím `[` `]` để nghiêng, rót (dòng chảy hiển thị) | Có | T04 |
| Xoay / phóng to / di chuyển camera (OrbitControls ở vùng trống) | Có | T05 |
| Phím mũi tên di chuyển vật đang chọn; Enter/Delete; Ctrl+Z | Có | (bắt phím ở canvas 3D trước OrbitControls) |
| Nút trong inspector (rót chính xác, nhỏ giọt, gắp, bật bếp, nguồn…) | Có (inspector dùng chung) | |
| Undo/Reset/thời gian/lưu khi đang ở 3D; chuyển 2D↔3D giữ nguyên state, lịch sử Undo | Có | S21, T05 |
| **Chỉ ở 2D:** kéo vật từ thư viện thả trực tiếp vào bàn (ở 3D bấm vào mục thư viện để thêm); dây điện, vũng tràn, nhãn nhiệt độ; mặt chất lỏng nằm ngang khi bình nghiêng (3D: lớp chất lỏng nghiêng theo bình — giới hạn hiển thị); pinch-zoom cảm ứng theo kiểu 2D (3D dùng cử chỉ OrbitControls) | | |

## 6. Checklist kiểm tra thủ công (Preview, đăng nhập Access) — gồm điện thoại thật

Mở `https://feature-chemlab-7-0-dynamic.chemlab-edulab.pages.dev/#dlab`.

1. **Giấy quỳ**: thư viện → Chỉ thị → Giấy quỳ tím; kéo xuống cốc HCl chỉ ngập một phần → chỉ phần ngập đỏ; nhúng sâu hơn → vùng đỏ dài hơn; kéo ra → giữ màu. Thử "Nhúng bằng thông số" trong inspector.
2. **Chất chỉ thị**: cốc NaOH + vài giọt phenolphtalein (ống nhỏ giọt) → hồng xuất hiện ở chỗ giọt rơi rồi lan; bấm Khuấy → đều màu nhanh hơn.
3. **Kim loại**: Guided Lab "Kim loại"; hoặc kẹp → đinh sắt → thả vào CuSO₄ → lớp đồng đỏ, dung dịch nhạt màu. Na (0,1 g) vào cốc nước ≥ 50 mL → hộp thoại cảnh báo trước, mẩu nổi, chạy, nhỏ dần, có bọt.
4. **Kết tủa**: CuSO₄ + NaOH → đám hạt xanh, lắng dần; Khuấy → lơ lửng lại. CuSO₄ riêng: **không** có kết tủa; inspector có dòng "Lực ion" và cảnh báo mô hình lý tưởng.
5. **Điện hóa**: Guided Lab "Điện phân" → bật nguồn → hộp thoại cảnh báo Cl₂ → Cu bám catot.
6. **3D**: "Xem 3D" → kéo cốc, nhấc lên, đặt xuống; giữ cốc trên cốc khác + lăn chuột → rót; nhúng quỳ; kéo vùng trống để xoay; "Xem 2D" → mọi thứ giữ nguyên; Hoàn tác.
7. **Cảnh báo/hư hỏng**: ống đong lên bếp → bị chặn; cốc nóng + nước lạnh → nứt (nhãn "Nứt"); đun tiếp → "Vỡ — không dùng được", không nhận chất lỏng; Dọn dẹp.
8. **Lưu/Mở**: Lưu → tải lại trang → Mở → thí nghiệm khôi phục.
9. **Điện thoại thật (iPhone/Android)**: không tràn ngang; nút Thư viện/Chi tiết mở ngăn kéo; kéo cốc bằng ngón tay; giữ cốc và dùng "Rót chính xác"; nhúng quỳ bằng ngón tay và bằng thông số; pinch phóng to không làm dịch chuyển dụng cụ; xoay ngang màn hình.
10. Không bấm "Gửi" trong ChemAI trên Preview.

## 7. D01–D34

| ID | Trạng thái | Triển khai | Bằng chứng (test / ảnh) | Giới hạn |
|---|---|---|---|---|
| D01 Bàn thí nghiệm tự do | PASS | `ui/dlabApp.js`, `engine/sim.js` | S05, S23, M01; `after-workspace-*` | |
| D02 Scientific Workspace | PASS | header/thư viện/bàn/inspector/toolbar, "Vừa khung" | S01–S25, R01, A01 | |
| D03 Kéo thả, thao tác dụng cụ | PASS | Interaction Controller (2D + 3D) | S02–S05, S08, S10, T02, TC* | |
| D04 Rắn, lỏng, khí, dung dịch | PASS | `data/materials.js` (39 hồ sơ) | S10, S13, unit CO₂ | Khí: CO₂ từ bình + khí sản phẩm |
| D05 Giấy quỳ nhúng trực tiếp | PASS | `stepTools` litmus, texture 3D | S02–S04, T03, TC02; `after-litmus-dip`, `after-3d-litmus` | |
| D06 Chỉ thị theo trạng thái hóa học | PASS | `indicatorColor` + pH | S07, unit | Khoảng chuyển màu: PENDING đọc lại Harris |
| D07 Khuếch tán màu động | PASS (xấp xỉ hình ảnh) | tracer 10×14 | S07; `after-indicator-0.7s/3.7s` | |
| D08 Rót theo thao tác | PASS | `retainedVolumeAtTilt`, `lipPoint` | S05, T04; `after-pour`, `after-3d-pour` | 3D: lớp chất lỏng nghiêng theo bình |
| D09 Bảo toàn khi chuyển bình | PASS | `withdraw`/`mix` | S05, T04, unit | |
| D10 Chemistry Engine định lượng | PASS | `engine/chemistry.js` (+ dime Cu, lực ion) | 41 unit | Lý tưởng; cảnh báo I > 0,1 M |
| D11 Rắn nổi/chìm/biến đổi | PASS | `stepSolid` | unit Na, S11; `after-sodium-*` | Chuyển động Na: xấp xỉ |
| D12 Bọt khí theo phản ứng | PASS | `emitBubbles` theo mol khí | unit, S12 | |
| D13 Kết tủa và lắng | PASS | Ksp + hạt (đám mây theo dòng thuốc thử) | S09, unit 8 kết tủa; `after-precipitate-*` | Ksp Cu(OH)₂ PENDING |
| D14 Hòa tan và kết tinh | PASS | `stepDissolve`, `crystallize` | S10, unit NaCl/KNO₃ | Kết tinh chỉ có unit test |
| D15 Kim loại | PASS | `KINETIC` 8 quy tắc, tất cả có test tỉ lượng | S11, unit, Guided metals | Tốc độ: xấp xỉ |
| D16 Điện hóa | PASS | `stepElectro` | S12, unit Faraday/Nernst | Chỉ CuCl₂ và pin Zn–Cu |
| D17 Hữu cơ | PASS (phạm vi hẹp) | axit axetic, NaHCO₃, dầu/etanol | S13, Guided organic | Không có phản ứng hữu cơ tổng hợp |
| D18 Cảnh báo an toàn trước thao tác | PASS | `engine/safety.js` | S14, S15, unit | |
| D19 Dụng cụ hư hỏng | PASS | `damage()`; nhãn + màu + hình | S15, unit; `after-damage-states` | Ngưỡng là quy tắc minh họa |
| D20 Guided Lab | PASS | `guided.js` (5 bài) | S22 (UI), unit ×5 | |
| D21 Sandbox | PASS | | S23 | |
| D22 Pause/Resume | PASS | | S16 | |
| D23 Tốc độ 0,25×–4× | PASS | clock | S17, unit | |
| D24 Undo/Reset/Cleanup | PASS | + lệnh lỗi tự khôi phục | S18, S19, unit | |
| D25 Save/Load/Resume | PASS | `persistence.js` | S20, unit | |
| D26 2D/3D chung trạng thái + tương tác 3D | PASS | `render3d.js` + controller dùng chung | S21, T01–T05, P02 | Các mục "chỉ ở 2D" §5 |
| D27 ChemAI chỉ theo yêu cầu | PASS | nút "Hỏi ChemAI" điền sẵn câu hỏi | S25 ×3 | |
| D28 Không video dựng sẵn | PASS | không có asset video | mã nguồn | |
| D29 Không tiêu token khi mô phỏng | PASS | | S25 ×3 | |
| D30 Desktop + mobile | **PARTIAL** | responsive, drawer, nhập thông số thay kéo | M01, R01, TC320/390/768, TC02 | Chỉ giả lập; chưa thiết bị thật |
| D31 Scientific validation | **PARTIAL** | SCIENTIFIC_VALIDATION.md | đối chiếu nguồn, 41 unit | PENDING EXPERT REVIEW §8 |
| D32 Automated tests | PASS | | 41 unit; E2E 40/37/37 | Touch CDP chỉ Chromium |
| D33 Không regression | PASS | | `check` + `check:browser` 448/448 | |
| D34 Preview + rollback | **PARTIAL** | Preview deployed, Access 302, rollback sẵn | check-run success `4f89127` | Chưa ai kiểm tra nội dung Preview (cần đăng nhập Access) |
