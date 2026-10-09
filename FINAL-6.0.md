# ChemLab 6.0.0 — Final Evolution

ChemLab 6.0 là bản redesign cuối cùng của core ChemLab trước khi bước sang ChemAI 6.1.

## Trọng tâm

- App shell mới và route `home` làm điểm vào chính.
- Dashboard dùng trực tiếp dữ liệu Progress Storage hiện tại.
- Design system cuối (`src/final/final-6.css`) được load sau legacy CSS để đồng bộ toàn sản phẩm mà không rewrite chemistry engines.
- Navigation desktop/mobile 5 khu vực: Tổng quan, Bảng, Công cụ, Học tập, Thí nghiệm.
- Chem Flow trực quan: Nguyên tố → Ion → Hợp chất → Phản ứng → Thí nghiệm → Learning.
- Tool Center 2.0 có tìm kiếm/lọc công cụ.
- Public `window.ChemLabApp` context API chuẩn bị cho ChemAI 6.1.
- Route change event `chemlab:view-change` cho các integration sau này.
- Reduced-motion, focus states, touch targets và mobile bottom navigation được nâng cấp.
- Không thay đổi 103 chemicals / 96 reactions / curriculum / guided experiment engine.

## Kiểm tra tự động

`npm run check` chạy hai tầng:

1. `check:project`
   - syntax JS
   - relative imports
   - lazy route exports
   - CSS brace balance
   - 103 chemicals
   - 96 reactions
   - 21 chapters
   - 77 lessons
   - 78 guided activities
   - 372 guided steps
   - 188 guided questions

2. `check:ui`
   - release 6.x
   - final CSS import
   - Home route/app shell
   - route loader state
   - dashboard/Chem Flow
   - v6 storage key
   - 5-route mobile navigation
   - reduced motion
   - final layer không dùng `!important`

## Local QA bắt buộc trước khi push

```powershell
npm install
npm run check
npm run dev
```

Kiểm tra lần lượt:

- Tổng quan
- Bảng tuần hoàn
- Công cụ + search Tool Center
- Learning
- Lab
- Dark / Light
- mobile width
- Ctrl+K

Sau đó:

```powershell
npm run build
git add .
git commit -m "ChemLab 6.0 Final Evolution"
git push
```
