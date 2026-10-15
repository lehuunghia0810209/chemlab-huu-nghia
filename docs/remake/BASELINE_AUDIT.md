# ChemLab Remake — Baseline Audit (Phase 0)

Ngày: 2026-10-15 · Branch gốc: `main` @ `da21745` · Branch remake: `remake/ultimate-ui`

Mọi số liệu dưới đây được đo trực tiếp trên repository / trình duyệt trong phiên audit này.

## 1. Kiểm thử có sẵn

| Lệnh | Kết quả |
|---|---|
| `npm run check:project` | PASS — version 6.2.0; 103 hóa chất, 96 phản ứng, 21 chương, 77 bài, 78 hoạt động, 372 bước, 188 câu hỏi |
| `npm run check:ui` | PASS — 71/71 (kiểm tra tĩnh dựa trên chuỗi trong source) |
| `npm run check:ai` | PASS — mock Gemini (retry 503, fallback) |
| `npm run build` | PASS — cảnh báo chunk > 500 kB |

Lưu ý: `check:ui` là kiểm tra **tĩnh** (grep chuỗi trong source), không chạy giao diện thật. Nó không phát hiện lỗi runtime ở mục 3.

## 2. Bundle (vite build, trước remake)

| Asset | Kích thước | gzip |
|---|---|---|
| `OrbitControls-*.js` (Three.js core + OrbitControls) | 562 kB | 139 kB |
| `index-*.css` (CSS global) | 297 kB | 53 kB |
| `index-*.js` (shell + periodic + progress) | 111 kB | 30 kB |
| `progressSummary-*.js` (curriculum data) | 90 kB | 23 kB |
| `virtualLab-*.js` | 65 kB | 16 kB |

Three.js chỉ được tải khi mở mô hình 3D / Orbital Atlas (đã xác minh: không có request tới chunk Three.js ở Home, Periodic, Lab).

Hiệu năng runtime (localhost, không throttle, SW warm): LCP 32–80 ms, CLS 0. Các số này **không đại diện** cho mạng/thiết bị thực; cần đo lại bằng throttling ở milestone tối ưu.

## 3. Lỗi runtime phát hiện bằng trình duyệt

| ID | Mức | Mô tả | Bằng chứng |
|---|---|---|---|
| B1 | P1 | Tool Center không render bộ chọn công cụ. `initToolHub` ném `TypeError: t is not iterable` | `toolHub.js`: tool `compound`/`reaction` không có `selectors` → `findToolElement(root, undefined)` → `for…of undefined`. **Đã sửa** (default `selectors = []`), xác minh: hub render 7 công cụ, không lỗi console |
| B2 | P1 | Badge "HN" (production.js) che launcher ChemAI trên desktop và che mục "Thí nghiệm" của bottom nav trên mobile 390px | `baseline/home-1440.png`, `baseline/home-390.png` |
| B3 | P3 | `GET /api/chat` trả 404 khi chạy `vite preview` (không có Pages Functions) — chỉ ảnh hưởng môi trường local | console |

## 4. Kiến trúc CSS

- 36 file CSS, **55.523 dòng**, 2.125 `!important`.
- 1.957 mã màu hex + 1.688 `rgb(a)` hardcode.
- 6 hệ token rời rạc: `--cl-*`, `--cl6-*`, `--zp-*`, `--v4-*`, `--guided-*`, `--element-*`.
- 11 file CSS **global** được import trong `main.js` theo thứ tự "file sau đè file trước": `style.css` → `workspace.css` → `chemlab-v4.css` → `design-system.css` → `chemlab5.css` → `responsive/*` → `userPreferences.css` → `zperiodLight.css` (4.396 dòng, 643 `!important`, lớp override light mode) → `experience.css` → `final/final-6.css` → `ai/chemAI.css`.
- Các file global style chéo cho mọi workspace (vd. `zperiodLight.css` chứa rule cho progress, lab, tools, periodic, learning). Đã thử tắt lớp global: CSS module còn lại không tự đứng được → không thể gỡ từng file riêng lẻ.

## 5. Dead code (đã xác minh không được import ở đâu)

`src/orbital3d.js` (1.351 dòng, đã được `elementOrbital3D.js` thay thế), `src/counter.js` (template Vite), `src/home.css`, `src/periodic.css`, `src/elementWorkspace.css`, `src/elementWorkspace442.css`.

## 6. 3D / Graphics

| File | Renderer | Pause khi ẩn | Context loss | Reduced motion | Ghi chú |
|---|---|---|---|---|---|
| `atom3d.js` | WebGLRenderer riêng | Không | Không | Không | Mô hình vỏ electron (Bohr), có ghi chú "chỉ dùng để trực quan" |
| `elementOrbital3D.js` | WebGLRenderer riêng | Không | Không | Không | Orbital dựng bằng ellipsoid ghép |
| `orbitalAtlas.js` | WebGLRenderer riêng | Không | Không | Không | **Không có `cancelAnimationFrame`** |
| `orbital3d.js` | — | — | — | — | Dead code |

Vấn đề khoa học đã xác minh trong `elementOrbital3D.js`:
- Orbital p/d/f là các khối cầu kéo giãn, không xuất phát từ hàm sóng.
- Dấu pha orbital f sai: thùy tại (−1, 1, 1) có xyz < 0 nhưng được tô màu pha dương (index chẵn).
- `getOuterOrbital` điền electron thuần Aufbau → sai với các ngoại lệ (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, Pt, Au, La, Ce, Gd…).

## 7. Virtual Lab

- Render bằng DOM/CSS, không dùng WebGL; có IntersectionObserver, xử lý `visibilitychange`, hỗ trợ reduced motion.
- Hiệu ứng có cơ sở dữ liệu trong `reactions.js`: `precipitate` (38, có màu), `solutionColor` (28), `flash` (21), `gas` (12), `removePrecipitate` (9), `message` (7), `foam` (1).
- **95/96 phản ứng có `title`/`description` bằng tiếng Anh**, hiển thị trực tiếp cho học sinh trong khung quan sát.

## 8. Screenshots

`docs/remake/baseline/{home,periodic,tools,learning,lab}-{1440,390}.png`, chụp trên bản build production qua `vite preview`, Playwright CLI (Chromium).
