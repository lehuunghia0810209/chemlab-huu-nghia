# ChemLab 7.0 — Kết quả kiểm thử (cập nhật 2026-11-22, phiên hoàn thiện Phase 5)

Môi trường: Windows 11, Node 24.21, Vite 8.3.6, playwright-core 1.64 (headless), build `dist/` từ worktree. Không có thiết bị cảm ứng thật.

## 1. Cổng chất lượng cuối (sau mọi thay đổi)

| Lệnh | Kết quả |
|---|---|
| `npm run check` | PASS (toàn bộ: project, chem 49, **Dynamic Lab 41/41**, learning 242, question 783, exam 84 + 850, final UI 78, ChemAI 15+16+31+27+20+19+9+23) |
| `npm run build` (prebuild = `release:sync` + `check`) | PASS sau khi sửa `check:ui` (xem lỗi 1 dưới). `release:sync` chỉ đổi kiểu xuống dòng của `public/manifest.webmanifest`, `src/appMeta.js` → đã hoàn nguyên, không commit |
| `node scripts/dlab-e2e.mjs` (Chromium) | **PASS 40/40** |
| `CHEMLAB_BROWSER=firefox node scripts/dlab-e2e.mjs` | **PASS 37/37** (3 journey cảm ứng CDP chỉ chạy trên Chromium) |
| `CHEMLAB_BROWSER=webkit node scripts/dlab-e2e.mjs` | **PASS 37/37** |
| `npm run check:browser` (regression toàn ChemLab) | **PASS 448/448** |
| A01 axe WCAG 2.2 AA (sáng + tối) | PASS trên 3 trình duyệt |
| S25 không có request ChemAI tốn token khi mô phỏng | PASS trên 3 trình duyệt (chỉ đếm request khác GET tới `/api/chat|ai|chemai`) |

Ghi chú trung thực: lần chạy song song 3 trình duyệt cùng lúc cho WebKit P01 = 27,5 FPS (FAIL ngưỡng 30) và Firefox S13 FAIL. Chạy tuần tự: WebKit P01 31,2 FPS PASS (tranh chấp CPU → **FLAKY khi chạy song song**). Firefox S13 FAIL cả khi tuần tự → nguyên nhân thật là test lấy mẫu pixel trúng dòng rót minh họa còn đang hiển thị; đã sửa test để chờ dòng rót kết thúc (không nới ngưỡng màu).

## 2. Unit / integration (`scripts/test-dlab.mjs`, 41)

Mới trong phiên này (5): lệnh lỗi không để lại dấu vết trong state/Undo · H₂SO₄ 0,25 M với Ka₂ CRC · CuSO₄ trong khoảng pH đo, không kết tủa giả, lực ion · tỉ lượng cho Zn/Fe + axit, Zn + Cu²⁺, Cu + Ag⁺, CaCO₃ + axit · Fe(OH)₃, Fe(OH)₂, Mg(OH)₂.

Đã có: registry, pH mạnh/yếu, trung hòa + nhiệt, AgCl/BaSO₄/AgI, Cu(OH)₂ tạo/tan, rót chính xác, rót nghiêng bảo toàn, 30 vs 60 FPS, tốc độ/pause, Undo, serialize→restore, Mg + HCl, Na + H₂O, Fe + CuSO₄, phản ứng không hỗ trợ, NaCl tan + KNO₃ kết tinh, CO₂ + nước vôi, giấy quỳ, khuếch tán + khuấy, kết tủa lắng/lơ lửng, Safety Na, hư hỏng dụng cụ, Faraday, Nernst, bất biến, lưu/migrate, 5 Guided Lab.

## 3. E2E (`scripts/lib/dlab-journeys.mjs`) — trạng thái + pixel canvas + sự kiện con trỏ thật

S01–S25, M01, R01, A01, P01/P01b, P02 (như trước) và mới:

| ID | Nội dung | Kết quả |
|---|---|---|
| T01 | 3D: bấm chọn vật → khung chọn + inspector | PASS ×3 |
| T02 | 3D: kéo cốc trên bàn, nhấc lên (y > 40 mm), đặt xuống (y = 0), thể tích giữ nguyên | PASS ×3 |
| T03 | 3D: nhúng giấy quỳ vào HCl → phần ngập đỏ, phần trên khô | PASS ×3 |
| T04 | 3D: giữ cốc + lăn chuột → nghiêng, rót sang cốc khác, bảo toàn A + B + đổ = 60 mL | PASS ×3 |
| T05 | 3D: kéo vùng trống chỉ xoay camera (state không đổi); Undo thao tác 3D trong 2D | PASS ×3 |
| TC320 / TC390 / TC768 | Cảm ứng giả lập (CDP `Input.dispatchTouchEvent`, `hasTouch`, `isMobile`): kéo cốc, nhúng quỳ bằng ngón tay, pinch chỉ đổi khung nhìn, không tràn ngang | PASS (Chromium) |
| TC02 | Thay cho kéo: "Nhúng bằng thông số" 15 mm vào NaOH → vùng xanh, "Lấy ra", phần trên khô (390 px) | PASS ×3 |

**Không có kiểm thử trên thiết bị cảm ứng thật.** Checklist cho người dùng: `RELEASE_REPORT.md` §6.

## 4. Lỗi phát hiện trong phiên này và đã sửa

1. **`check:ui` FAIL "home is a valid route"** — có từ commit `b379911` (đổi `VALID_VIEWS` thành `new Set([...NAV_VIEWS, 'dlab'])`; kiểm tra tĩnh cần danh sách rõ ràng). Báo cáo trước ghi `npm run check` PASS là **không đúng với `b379911`** (lần chạy đó trước thay đổi bottom nav). Sửa: liệt kê route trực tiếp.
2. **Kết tủa Cu(OH)₂ giả trong CuSO₄** khi dùng hằng số đúng nguồn — thiếu dime Cu₂(OH)₂²⁺. Sửa trong engine (xem SCIENTIFIC_VALIDATION §3).
3. **Lệnh lỗi làm hỏng state**: `add` với loại dụng cụ không tồn tại để lại vật thiếu thuộc tính (phát hiện khi viết script chụp ảnh). Sửa: kiểm tra loại + `dispatch` khôi phục state và lịch sử Undo khi lệnh ném lỗi.
4. **Đáy cốc vẽ nghiêng** (đường viền trái kết thúc ở y = −2, phải ở y = 0).
5. **Kết tủa hiện thành một dải ngang** thay vì đám mây hạt.
6. **Dụng cụ quá nhỏ** (cốc 100 mL ≈ 60 px trên khung 560 px) → tự căn khung theo vật trên bàn + nút "Vừa khung".
7. Firefox S13 lấy mẫu pixel trúng dòng rót (lỗi test, xem §1).

## 5. Lighthouse (`reports/chemlab-7.0/lighthouse-summary.json`)

Lighthouse 12.8.2 qua `npx` (không thêm vào package.json), headless Chromium (Playwright chromium-1248), `vite preview` của `dist/` trên localhost, throttling `simulate` mặc định (mobile: Moto G Power, 4G chậm; desktop preset).

| Trang | Perf | A11y | BP | LCP | FCP | TBT | CLS | Tổng tải |
|---|---|---|---|---|---|---|---|---|
| `#dlab` desktop | 99 | 100 | 100 | 0,61 s | 0,54 s | 0 ms | 0,007 | 286 KiB |
| `#dlab` mobile | 90 | 100 | 100 | **2,94 s** | 2,53 s | 94 ms | 0 | 286 KiB |
| Trang chủ desktop (regression) | 100 | 100 | 100 | 0,50 s | 0,50 s | 0 ms | 0 | 238 KiB |
| Trang chủ mobile (regression) | 96 | 100 | 100 | 2,37 s | 2,12 s | 0 ms | 0 | 238 KiB |

**Mục tiêu LCP ≤ 2,5 s: đạt trên desktop, KHÔNG đạt trên mobile giả lập (2,9–3,0 s qua 4 lần đo).** Nguyên nhân gốc (đo bằng PerformanceObserver): LCP = tiêu đề `h2` của lab, chỉ vẽ sau khi chunk `dlabApp` (≈ 41 kB gzip + CSS) tải xong → LCP ≈ FCP + 0,3–0,5 s; phần lớn còn lại là FCP của app shell (~2,1–2,7 s), chung với trang chủ (2,37 s). Đã thử vẽ khung tiêu đề cùng app shell: LCP không giảm và CLS tăng lên 0,081 → **đã hoàn nguyên**. Hướng xử lý đúng (chưa làm, ảnh hưởng toàn app): giảm FCP của app shell (font/CSS chặn render) hoặc preload chunk khi vào thẳng `#dlab`.

## 6. Hiệu năng render (`node scripts/dlab-perf-audit.mjs` → `perf-audit.json`)

Chromium headless (đồ họa phần mềm SwiftShader), 1440×900, 180 khung.

| Cảnh | FPS | p95 | Hạt |
|---|---|---|---|
| 2D thường (3 cốc) | 60 | 16,8 ms | 0 |
| 2D nhiều dụng cụ + hạt (8 cốc) | 60 | 16,7 ms | 480 |
| 2D tiết kiệm (8 cốc) | 60 | 16,7 ms | 480 |
| 3D thường (3 cốc) | 60 | 16,7 ms | 0 |
| 3D nhiều hạt (8 cốc) | **47,9** | 33,4 ms | 480 |
| 3D tiết kiệm (8 cốc) | 60 | 16,7 ms | 480 |

E2E P01 (cảnh bận 2D, 240 khung): Chromium 60 · Firefox 45 · WebKit 31 FPS (WebKit/Firefox headless trên Windows giới hạn rAF; chế độ tiết kiệm không đổi đáng kể → giới hạn môi trường). Mục tiêu 60 FPS cảnh thường desktop: **PASS (Chromium)**; 30 FPS chế độ giảm tải: **PASS ×3**. 3D cảnh bận đồ họa cao 48 FPS trên GPU phần mềm — chưa đo GPU thật.

Tải lười 3D: `render3d` 7,7 kB + `sceneHost` 380 kB + `three.core` 368 kB (chưa nén, chỉ khi bấm "Xem 3D"); bấm → canvas WebGL: 455 ms (localhost).

## 7. Bộ nhớ và vòng đời tài nguyên (CDP `Performance.getMetrics` + `HeapProfiler.collectGarbage`)

Chu kỳ: mở Lab → tạo 4 cốc + phản ứng → khuấy → Reset → mở 3D → đóng 3D → rời Lab (`#home`) → mở lại.

| Chỉ số | Kết quả 8 chu kỳ | Kết quả 60 chu kỳ (rút gọn) |
|---|---|---|
| Event listeners | 74 → 74 (không đổi) | 61 → 61 |
| `requestAnimationFrame` khi đã rời Lab | 0 lần/giây | — |
| Canvas WebGL còn lại sau đóng 3D | 0 | — |
| `.dlab-shell` | 1 (không bị tạo trùng) | — |
| DOM nodes (sau GC) | +9/chu kỳ | 1729 → 1730 (chu kỳ 10 → 60) |
| JS heap (sau GC) | 6,14 → 7,15 MB | 4,38 → 4,69 MB; **đứng yên 4,69 MB từ chu kỳ 50 → 60** |

Kết luận có giới hạn: không thấy tăng không giới hạn trong 60 chu kỳ; phần tăng ban đầu khớp với lịch sử Undo có giới hạn 40 snapshot. Đây **không** phải chứng minh tuyệt đối không rò rỉ (headless, không chụp heap snapshot so sánh đối tượng). Three.js: `disposeObject` giải phóng geometry, material, texture (gồm texture giấy quỳ mới), stream mesh, Box3Helper và listener khi đóng 3D.

## 8. Chụp ảnh trước/sau (`reports/chemlab-7.0/visual/`, tạo bằng `node scripts/dlab-visual-audit.mjs <nhãn>`)

`before-*` (bản `b379911`) và `after-*` (bản cuối): litmus-dip, pour, indicator-0.7s/3.7s, sodium-1.5s/5.5s, precipitate-forming/settled, damage-states, workspace-light/dark, mobile-390; thêm `after-3d-litmus`, `after-3d-pour`, `after-touch-390`.
