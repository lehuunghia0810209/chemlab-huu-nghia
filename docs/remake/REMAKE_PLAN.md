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

## Nhật ký

- **M0** — audit + sửa crash Tool Hub (B1).
- **M1** — `src/styles/{tokens,base,components,shell,dashboard}.css`, `src/shell/{icons,commandPalette}.js`; `main.js` viết lại (3.016 → ~560 dòng, giữ mọi route/hash/API); dashboard mới (nguyên tố hôm nay, tiếp tục học với tên bài thật, tiến độ, workspace, Chem Flow, lộ trình khối); dialog Cài đặt mới (focus trap, theo dõi theme hệ thống, giữ key `chemlab-v5-user-preferences`); menu sản phẩm "HN" gắn vào sidebar (hết che nút); boot screen bỏ độ trễ nhân tạo 350 ms; font Be Vietnam Pro tự host; `npm run check:browser` (Playwright + Chrome hệ thống, 103 kiểm tra). Lưới Lab cho phép cột giữa co lại (tránh tràn ngang khi sidebar rộng).

- **M2** — Lõi hóa học có kiểm thử: `src/chem/electronConfiguration.js` (Aufbau + 20 ngoại lệ NIST, cấu hình Z ≥ 104 gắn nhãn dự đoán), `src/chem/orbitalMath.js` (R_nl, hàm cầu thực l ≤ 3, lấy mẫu |ψ|², lưới bề mặt biên 90%), `src/chem/oxidationStates.js`; `npm run check:chem` (15 kiểm tra). **Sửa lỗi khoa học trên production:** cấu hình Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa, U, Np, Cm, Lr và số electron theo lớp; pha orbital f; số oxi hóa (vd. S chỉ có −2). `src/three/sceneHost.js` (vòng đời WebGL dùng chung). Atomic Explorer (vỏ electron + orbital, hạt nhân theo đồng vị phổ biến nhất). Bảng tuần hoàn viết lại (`src/periodic/`): nhóm IUPAC + A/B, xem trước, điều hướng phím mũi tên, chế độ danh sách, sheet chi tiết có focus trap. Orbital Atlas viết lại trên cùng lõi. Xóa 15 file cũ (≈ 13k dòng) và gỡ 547 rule CSS legacy.

- **M3** — Virtual Lab: bố cục mới (giữ mọi ID mà engine và Guided dùng), cốc thủy tinh có vạch chia khớp đúng mực chất lỏng, mặt khum, chuyển màu mượt; `src/lab/beakerEffects.js` (Canvas 2D: bọt khí nổi lên, kết tủa lắng tạo cặn; chỉ chạy khi có chuyển động); vòng lặp nghiêng cốc không còn chạy liên tục mỗi khung hình; 96 phản ứng có mô tả tiếng Việt (`reactionsVi.js`, có kiểm thử); thẻ hóa chất đang chọn kèm nhãn nguy hiểm (ăn mòn/độc/dễ cháy…) và lời nhắc an toàn. Guided Experiments chuyển sang token (cả hai theme), Việt hóa nhãn. Gỡ thêm ≈ 300 rule CSS legacy và các rule light-mode toàn cục đè màu chữ.

## Ranh giới

Không đổi: dữ liệu hóa học, curriculum, điều kiện hoàn thành guided experiment, storage keys/format, `/api/chat`, phiên bản `6.2.0`.
