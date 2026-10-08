# ChemLab 5.2.2 — Architecture & UX Cleanup

## Mục tiêu

ChemLab 5.2.2 giữ nguyên dữ liệu hóa học và logic mô phỏng, nhưng giảm tải ban đầu, cải thiện khả năng phục hồi khi module lỗi và nâng trải nghiệm đọc/bấm trên desktop lẫn mobile.

## Thay đổi chính

- Chuyển `Tools`, `Learning` và `Lab` sang lazy-load theo route.
- `Three.js` và `Orbital Atlas` không còn nằm trong static dependency graph của màn hình Periodic.
- Thêm `routeModuleLoader.js` để tách logic tải route khỏi `main.js`.
- Dùng `Promise.allSettled()` cho Tool Center và Lab để một module phụ lỗi không kéo sập cả route.
- Thêm progress bar khi tải route, skeleton cards, trạng thái sidebar và nút retry.
- Thêm `aria-busy`, live status và reduced-motion cho loading UX.
- Thêm `experience.css` với glass surface, soft glow, shimmer/skeleton và microinteraction theo ngôn ngữ ChemLab; các pattern được lấy cảm hứng từ thư viện UI mã nguồn mở Uiverse chứ không tạo dependency runtime vào Uiverse.
- Tăng readability/touch target cho Learning, Guided Lab, Tool Hub và Ion Engine.
- Loại bỏ 6 file legacy không còn reachable từ import graph:
  - `src/counter.js`
  - `src/orbital3d.js`
  - `src/elementWorkspace.css`
  - `src/elementWorkspace442.css`
  - `src/home.css`
  - `src/periodic.css`
- Mở rộng `scripts/validate-project.mjs` để kiểm tra syntax của toàn bộ JS và kiểm tra relative imports, bao gồm dynamic imports.

## Kiểm tra

`npm run check`:

- 103 chemicals
- 96 reactions
- 21 chapters
- 77 lessons
- 78 guided activities
- 372 guided steps
- 188 guided questions
- 36 JavaScript files syntax-checked
- 30 CSS files checked for balanced blocks
- 83 relative imports checked
- 10 lazy-route exports checked
- PASS

## Tác động dependency graph

Ước lượng theo static source import graph:

- Static JS: ~806.9 KB -> ~190.0 KB (giảm khoảng 76%)
- Static CSS: ~604.1 KB -> ~438.0 KB (giảm khoảng 27%)
- Static bare imports của route đầu: `three`/OrbitControls -> không còn

Kích thước bundle production thực tế phải được xác nhận bằng `npm run build` trên môi trường cài dependency đúng nền tảng.
