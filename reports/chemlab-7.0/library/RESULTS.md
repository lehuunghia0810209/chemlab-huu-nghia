# ChemLab 7.0: Experiment Library Phase 2, kết quả kiểm thử

Ngày 2026-11-26/27. Nhánh `feature/chemlab-7.0-dynamic-laboratory`, nền commit `427476e`. Danh sách thí nghiệm và trạng thái ở `../foundation/EXPERIMENT_LIBRARY_PLAN.md` §2a.

## Lệnh đã chạy

| Lệnh | Kết quả |
|---|---|
| `node scripts/test-dlab.mjs` | PASS 132/132 (nền 129, thêm 3 test: lời giải tay axit–bazơ, demo `acid-base-ph`, demo `weak-acid-titration`) |
| `node scripts/dlab-sci-validate.mjs` | PASS 126 kiểm tra (phương trình trong thư viện, có ⇌) |
| `node scripts/dlab-sci-matrix.mjs` | 77 mục: 27 VALIDATED / 9 APPROX / 5 UNVERIFIED / 28 UNSUPPORTED / 8 chặn an toàn |
| `npx vite build` | PASS |
| `DLAB_ONLY=EXP` Chromium / Firefox / WebKit | PASS 18/18 mỗi trình duyệt (17 thí nghiệm qua UI và test tìm kiếm, lọc, "Bày lại", axe sáng/tối) |
| E2E Chromium đầy đủ | 120/121. Trượt P03 (xem dưới) |
| `node scripts/dlab-guided-walk.mjs` | PASS 5/5 bài, 0 lỗi console, 0 yêu cầu ChemAI |
| `npm run check` | PASS |
| `npm run check:browser` | PASS 448/448 |

**P03 (máy chậm, Chromium): FLAKY, môi trường.** Test yêu cầu khi bóp CPU 10× thì tốc độ khung hình phải dưới 25 fps, để chắc chắn đã tạo được tình huống máy chậm. Trong một khoảng thời gian, máy đạt 33–47 fps nên test trượt 3 lần liên tiếp: máy chạy nhanh hơn ngưỡng, không phải chậm đi. Sau khi build lại, P03 trên cùng mã nguồn qua 3/3, và qua 2/2 trên bản HEAD gốc. Mã thay đổi không chạy trong vòng lặp khung hình. Ngưỡng giữ nguyên.

## Bằng chứng ảnh (`shots/`, Chromium, máy thật)

- `library-1280x720-light.png`, `library-1366x768-{light,dark}.png`, `library-1440x900-light.png`: tab Khám phá ở cỡ laptop.
- `library-search-axit-yeu.png`: tìm kiếm không dấu.
- `<exp>-2d.png`, `<exp>-3d.png`, `<exp>-2d-closeup.png` cho phenolphthalein-endpoint, weak-acid-titration, iron-copper-sulfate, metals-in-acid, copper-silver-nitrate. Các bước làm qua thanh thao tác, sau đó chờ đến khi đạt `expectState`.
- `facts.json`: state cuối lúc chụp. pH 1,63 (dư HCl), 9,14 (tương đương CH₃COOH), Cu và Ag bám, H₂ từ Mg/Zn, Cu + HCl không có khí.

Tạo lại: `node scripts/dlab-library-shot2.mjs "http://[::1]:5180/" reports/chemlab-7.0/library/shots` (cần dev server).

## Giới hạn

- Độ đậm màu chất chỉ thị trên hình tỉ lệ với số giọt trên thể tích. Phenolphtalein 3 giọt trong 30 mL ở pH 9,1 chỉ hồng rất nhạt. Phần chữ quan sát đúng theo pH, nhưng mô hình độ đậm chưa được đối chiếu với thực tế.
- Chưa kiểm trên điện thoại hoặc GPU thật. Ảnh 3D chụp bằng Chromium headless.
- Tốc độ phản ứng kim loại là minh họa. pH dùng hoạt độ = nồng độ.
