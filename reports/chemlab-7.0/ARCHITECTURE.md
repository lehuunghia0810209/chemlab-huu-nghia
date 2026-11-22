# ChemLab 7.0 — Dynamic Laboratory: kiến trúc thực tế

Nhánh `feature/chemlab-7.0-dynamic-laboratory`, worktree `D:\EduLab\.worktrees\chemlab-7.0`, gốc `origin/main` 8ce6f35 (6.7.0).

## Nguyên tắc

- **Một nguồn sự thật:** `sim.state` (JSON thuần). Renderer 2D/3D, Guided Lab, lưu trữ chỉ đọc trạng thái này.
- **Bước thời gian cố định:** `H = 1/60 s` mô phỏng. `advance(realSeconds)` nhân với tốc độ (0,25×–4×) rồi chạy số bước nguyên. Kết quả không phụ thuộc FPS (kiểm thử 30 vs 60 FPS cho JSON giống hệt).
- **Lệnh (command) + Safety trước khi chạy:** mọi thao tác làm thay đổi hóa học đi qua `sim.dispatch(cmd)` → `assess()` (ok / warn cần xác nhận / block) → lưu snapshot cho Undo → áp dụng → kiểm tra bất biến (không âm, nhiệt độ hữu hạn).
- **Ngẫu nhiên tất định:** mulberry32, hạt giống lưu trong `state.rng` (chuyển động mẩu Na, hạt kết tủa, bọt khí).
- **Không gọi AI:** mô phỏng hoàn toàn trong trình duyệt; ChemAI chỉ mở khi người dùng bấm “Hỏi ChemAI”.

## Mô-đun (`src/dlab/`)

| Tệp | Trách nhiệm |
|---|---|
| `data/materials.js` | Registry hóa chất (39 hồ sơ), ion, hằng số Ka/Ksp/Henry/Faraday, độ tan, chất chỉ thị, nguồn số liệu |
| `data/equipment.js` | Registry 23 loại dụng cụ, khả năng (capabilities), hình học khoang chứa, bảng thể tích ↔ mực chất lỏng, thể tích giữ lại khi nghiêng |
| `data/reactions.js` | 8 quy tắc phản ứng dị thể (rắn + dung dịch), 4 quy tắc “không phản ứng”, 4 gợi ý “chưa có mô hình”, điện hóa |
| `engine/chemistry.js` | Chemistry Engine: pH bằng cân bằng điện tích (bisection), cân bằng Ksp (kết tủa/hòa tan), nhiệt trung hòa, rút chất lỏng theo lớp |
| `engine/processes.js` | Fluid/Physics/Thermal/Electro/Visual theo bước: rót theo góc nghiêng, giọt, khuếch tán màu (lưới 10×14), hạt kết tủa, bọt khí, động học kim loại, hòa tan/kết tinh, đun/sôi/bay hơi, điện phân Faraday, pin Nernst, giấy quỳ, nhiệt kế, máy pH, hư hỏng dụng cụ |
| `engine/safety.js` | Safety Engine đánh giá lệnh trước khi chạy |
| `engine/sim.js` | Simulation Core: trạng thái, lệnh, lịch sử Undo (40 snapshot), Reset, clock, bất biến, kiểm kê nguyên tố |
| `persistence.js` | IndexedDB (`chemlab-dynamic-lab`), schema v1, kiểm tra dữ liệu khi mở, autosave |
| `guided.js` | 5 bài Guided Lab dạng dữ liệu, kiểm tra tiến độ bằng cách đọc trạng thái |
| `ui/dlabApp.js` | Workspace + Interaction Controller dùng chung cho 2D và 3D (`beginDrag` / `dragTo` / `tiltHeld` / `finishDrag` / `onKey`), tự căn khung (`fitView`, nút “Vừa khung”), inspector (gồm “Nhúng bằng thông số”, lực ion), hộp thoại an toàn, lưu/mở, Guided, ChemAI theo yêu cầu |
| `ui/render2d.js` | Renderer Canvas 2D (chỉ đọc) |
| `ui/render3d.js` | Renderer Three.js, tải lười khi bấm “Xem 3D”. Không đổi hóa học: chiếu tia con trỏ lên mặt phẳng bàn z = 0 → tọa độ thế giới (mm) giống 2D → gọi Interaction Controller (cùng lệnh `move`/`tilt`… qua `sim.dispatch`). Chọn vật (raycast), Box3Helper, giấy quỳ có texture 28 đoạn, dòng rót; OrbitControls chỉ hoạt động khi kéo vùng trống. `dispose()` gỡ listener, geometry, material, texture, renderer |

## Tích hợp vào ChemLab

- View mới `dlab` (hash `#dlab`), host `#dlab-host`, loader `loadDynamicLabRoute` lazy-import `dlab/ui/dlabApp.js` (chunk riêng ~121 kB, gzip ~41 kB; 3D thêm `render3d` ~5 kB + `three.core` đã có).
- Lối vào: thẻ “Thử Phòng thí nghiệm động 7.0” ở đầu phòng lab cũ, và mục trong Command Palette. Phòng lab cũ (`virtualLab.js`) giữ nguyên.
- Không đổi: ChemAI, Smart Hybrid Routing, Guard, quota, Groq, Cloudflare Functions, service worker, version (vẫn 6.7.0).

## Mô hình hóa học

- pH: giải `[H⁺] − Kw/[H⁺] + Σ z·c (ion mạnh) + đóng góp hệ yếu = 0` (HSO₄⁻, CH₃COOH, NH₄⁺, H₂CO₃/HCO₃⁻, thủy phân bậc 1 của Cu²⁺/Fe²⁺/Fe³⁺/Zn²⁺). Axit/bazơ mạnh biểu diễn qua ion đối (Cl⁻, Na⁺…), nên trung hòa là tự động.
- Kết tủa: với mỗi muối ít tan, tìm độ tiến ξ sao cho Q = Ksp (bisection lồng với pH). Kết tủa đầu tiên cần Q > 10·Ksp (vùng giả bền) để tránh kết tủa giả trong dung dịch muối thủy phân.
- Phản ứng dị thể: tốc độ = k·A·tác nhân (k minh họa), A theo hình dạng (dải, dây, viên, bột). Hệ số tỉ lượng, ΔH, sản phẩm là định lượng.
- Nhiệt: nhiệt dung chất lỏng + thủy tinh, mất nhiệt Newton, đun bằng bếp, sôi 100 °C + ẩn nhiệt 2257 J/g.

## Biểu diễn trực quan (tách khỏi định lượng)

Màu dung dịch = màu khối (từ thành phần + pH) trộn với trường tracer 10×14 (khuếch tán, khuấy tăng hệ số). Hạt kết tủa, bọt khí là trạng thái hình ảnh có giới hạn số lượng; lượng chất định lượng không phụ thuộc số hạt.

## Bổ sung phiên hoàn thiện Phase 5 (2026-11-22)

- **Hóa học:** cân bằng điện tích thêm dime Cu₂(OH)₂²⁺ (`freeMetal` giải cân bằng khối lượng bậc hai); `ionicStrength()` tính I = ½Σcz² và lưu vào `c.I` trong `refreshDerived`; hằng `IDEAL_I_LIMIT = 0.1` M quyết định cảnh báo trên inspector.
- **Lệnh nguyên tử:** `dispatch` chụp snapshot trước lệnh; nếu lệnh ném lỗi hoặc vi phạm bất biến thì khôi phục state và bỏ mục Undo vừa ghi.
- **Bằng chứng tái lập:** `scripts/dlab-visual-audit.mjs <nhãn>` (ảnh các thí nghiệm chính), `scripts/dlab-perf-audit.mjs` (FPS 2D/3D, chi phí tải lười 3D, vòng đời tài nguyên qua CDP).
