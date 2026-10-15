# ChemLab Remake — Plan

Phong cách: **Linear/Vercel + Scientific Futurism**. Nguyên tắc: *Minimal interface. Rich interaction. Scientific clarity.*
Stack giữ nguyên: Vite · Vanilla JS · ES Modules · CSS · Three.js · Cloudflare Pages. Không thêm framework.

## Chiến lược CSS

CSS global legacy style chéo mọi workspace nên không thể gỡ từng file. Lộ trình:

1. Xây design system mới trong `src/styles/` (unlayered, load sau cùng).
2. App shell dùng **class mới** (`cl-*`) để không bị selector legacy bắt trúng; giữ nguyên ID và `data-*`.
3. Mỗi milestone workspace: viết lại CSS module tại chỗ trên token mới, rồi **gỡ các rule legacy của workspace đó** khỏi file global (theo tiền tố selector, có kiểm tra screenshot trước/sau).
4. Milestone cuối: xóa toàn bộ file CSS global legacy.

Theme dùng chung `html[data-theme="light|dark"]` (đã có trong `userPreferences.js`) → legacy và hệ mới cùng đổi theme trong giai đoạn chuyển tiếp.

## Design system

- Màu: Blue `#2563EB` / Electric `#3B82F6` / Cyan `#06B6D4`, nền dark navy `#0B1220`, light `#F8FAFC`. Semantic tokens: `--bg-*`, `--surface-*`, `--border-*`, `--text-*`, `--accent-*`, `--status-*`, `--focus-ring`.
- Chữ: **Be Vietnam Pro** (thiết kế cho tiếng Việt), tự host qua `@fontsource` để giữ offline/PWA; mono: JetBrains Mono → fallback hệ thống. Body 16px; caption tối thiểu 13px.
- Spacing 4px base: 4/8/12/16/20/24/32/40/48/64. Radius: 6/10/14/20. Motion: 120ms / 200ms / 320ms, `cubic-bezier(.2,.8,.2,1)`.
- Component: button (primary/secondary/ghost/danger, sm/md/lg), icon-button, card, chip, segmented, input/search, badge, kbd, tooltip, dialog, sheet, toast, skeleton, empty/error state.

## Milestones

| # | Nội dung | Tiêu chí hoàn thành |
|---|---|---|
| M0 | Audit, baseline, sửa lỗi Tool Hub (B1) | Tài liệu `docs/remake/*`, screenshots |
| M1 | Design foundation + App shell + Dashboard. Sửa U1–U6, V4 | Shell mới desktop/tablet/mobile; dashboard mới; theme switch; mọi route/command/hash cũ hoạt động |
| M2 | Periodic + Atomic/Orbital explorer. `src/three/sceneHost.js`, `src/chem/orbitalMath.js` (có test), orbital từ hàm sóng, mật độ xác suất, sửa G1–G3 | Test toán orbital PASS; 118 nguyên tố duyệt được trên 360px |
| M3 | Virtual Lab + Guided Experiments: workspace mode, dụng cụ, chất lỏng, hiệu ứng theo dữ liệu phản ứng, mô tả tiếng Việt | Thao tác chọn/đổ/trộn/reset; guided flow; dữ liệu không đổi |
| M4 | Tool Center + 7 công cụ | Mọi công cụ dùng token mới; kết quả tính toán không đổi |
| M5 | Learning + Quiz + Progress | Tiến độ cũ đọc được sau reload |
| M6 | ChemAI UI | Open/close, composer, lỗi/retry, mobile keyboard/safe-area |
| M7 | Xóa CSS legacy, polish, a11y, performance, QA toàn diện | Không còn file CSS global legacy; báo cáo cuối |

Mỗi milestone: `npm run check`, `npm run build`, Playwright ở 360/390/768/1024/1440, cả dark/light, kiểm tra console. Local commit theo milestone; **không push/deploy**.

## Ranh giới

Không đổi: dữ liệu hóa học, curriculum, điều kiện hoàn thành guided experiment, storage keys/format, `/api/chat`, phiên bản `6.2.0`.
