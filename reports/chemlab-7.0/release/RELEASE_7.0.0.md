# ChemLab 7.0.0: phát hành chính thức

Viết cho: chủ dự án và phiên phát triển kế tiếp. Ngày 2026-11-27.

## 1. Phạm vi phát hành

- **Phòng thí nghiệm động 7.0** (`#dlab`) gồm:
  - Bàn thí nghiệm mở (Sandbox từ bàn trống).
  - 5 bài có hướng dẫn (Guided).
  - Thư viện 22 thí nghiệm, chia 5 nhóm.
  - 31 thẻ Khám phá.
  - Mô phỏng 2D/3D theo state.
  - Ma trận kiểm chứng khoa học gồm 78 mục.
- **Lối vào:** mục "Phòng thí nghiệm động" ở thanh bên; thẻ "Phòng thí nghiệm động 7.0" ở trang Thí nghiệm (dùng được trên điện thoại); tìm qua Ctrl K.
- **Version** 7.0.0, cập nhật ở `package.json`, `appMeta`, `index.html`, manifest và cache service worker `chemlab-7.0.0-access-1`.
- **ChemAI:** mã không đổi. Biến `CHEMAI_PUBLIC_APPROVAL` đổi từ `groq:6.7.0` sang `groq:7.0.0` theo quyết định của chủ dự án ngày 2026-11-27, và chỉ đổi đúng biến này.

## 2. Phase 3 (commit Phase 3 trên nhánh `feature/chemlab-7.0-dynamic-laboratory`)

| Hạng mục | Kết quả |
|---|---|
| Điện hóa (3 thí nghiệm) | Pin Daniell (VALIDATED); Nernst khi pha loãng (APPROX, dung dịch lí tưởng); điện phân CuCl₂ (APPROX) |
| Oxi hóa – khử (2 thí nghiệm) | Cu²⁺ + I⁻, xác định chất hết trước (VALIDATED); Fe³⁺ + I⁻ khi dư KI (APPROX) |
| Catalog | Tìm kiếm không dấu; lọc theo nhóm, lớp, mức độ, mức kiểm chứng; đếm số thí nghiệm; "Về bàn trống" (hoàn tác được) |
| Sửa khoa học | Nernst theo ion tự do, chặn khi có phức NH₃; Fe³⁺/I⁻ chỉ tính khi pH < 3; sức chứa I₃⁻ dùng K = 710; báo OUT_OF_MODEL_RANGE thay vì im lặng; màu phenolphtalein theo Beer–Lambert |
| P03 | Tạo máy chậm một cách xác định (mỗi khung hình tải 60 ms), ngưỡng giữ nguyên |
| Accessibility | Điện cực nhúng được bằng điều khiển thông số (thao tác được bằng bàn phím) |

Rà soát độc lập (Antigravity, chỉ đọc): `reports/chemlab-7.0/phase3/agy/agy-phase3-science.md` nêu 2 P0, 5 P1 và 6 P2. Tôi đã đối chiếu lại từng điểm. Đã sửa: cả 2 P0, 4 trong 5 P1 và các P2 về cách viết và an toàn. P1 còn lại (vôn kế không báo khi điện cực đang có phản ứng phụ) được ghi ở §5.

## 3. Kiểm thử (mã RC, trước khi push)

| Lệnh | Kết quả |
|---|---|
| `node scripts/test-dlab.mjs` | PASS 138/138 |
| `node scripts/dlab-sci-validate.mjs` | PASS 131 |
| `npm run check` | PASS |
| `npm run build` (lệnh build của Cloudflare: `release:sync` + `check` + `vite build`) | PASS |
| E2E Dynamic Lab đầy đủ | Chromium 126/126 · Firefox 122/122 · WebKit 122/122 |
| `npm run check:browser` | PASS 448/448 |
| Guided walk | 5/5 bài, 0 lỗi console, 0 yêu cầu ChemAI |
| Kiểm 3D theo state (`scripts/dlab-3d-state.mjs`) | 5/6; 1 giới hạn P2 (§5) |
| Axe trên Catalog (sáng và tối) | PASS (trong E2E `EXP`) |

Hiệu năng đo trong E2E: máy Windows, trình duyệt headless, đồ họa phần mềm, chế độ "Cao", 480 hạt.

| Trình duyệt | "Cao" | "Tiết kiệm" |
|---|---|---|
| Chromium | 60 fps (p95 16,8 ms) | 60 fps |
| Firefox | 37,7 fps (p95 34,8 ms) | 35,8 fps |
| WebKit | 30,9 fps (p95 44 ms) | 35,1 fps |

Mức Firefox/WebKit này giống round 4 (môi trường headless, không phải hồi quy) và chưa được đo trên GPU thật.

## 4. Đích phát hành (đã xác minh)

- **GitHub:** `lehuunghia0810209/chemlab-huu-nghia`, nhánh production `main`.
- **Cloudflare Pages:** project `chemlab-edulab`; production branch `main`; build `npm run build`, thư mục ra `dist`; Git integration đang bật.
- **Trước phát hành:** production là deployment `e1d7dc13` = commit `8ce6f35` (ChemLab 6.7.0).
- **Rollback:**
  - Nhanh nhất: Cloudflare → Deployments → `e1d7dc13` → Rollback. Bản này giữ biến `groq:6.7.0` đã cố định khi build nên ChemAI trả lời được ngay. Sau đó đặt biến về `groq:6.7.0` trước lần deploy 6.7.x tiếp theo.
  - Mốc Git: tag `chemlab-6.7.0` trỏ vào `8ce6f35`.

## 5. Giới hạn còn lại (không chặn phát hành)

- **3D:** dung dịch màu nhạt (ví dụ Cu²⁺ ≈ 0,2 M) gần như không thấy màu; 2D và state vẫn đúng. Mức P2.
- **Nernst:** dùng dung dịch lí tưởng. Ở 0,05–0,5 M, độ giảm khi pha loãng ngoài thực tế chỉ khoảng một nửa; điều này đã ghi trong thí nghiệm và nhãn là APPROX.
- **Vôn kế:** không báo khi điện cực đang có phản ứng phụ (ví dụ Zn trong axit); suất điện động khi đó vẫn tính theo Nernst. Mức P1, chưa sửa, không có trong thí nghiệm nào của thư viện.
- **Cu²⁺/I⁻:** mô hình tính đến pH 7, trong khi Cu(OH)₂ thực tế kết tủa từ pH ≈ 5.
- **Phần chưa được kiểm chứng:** ma trận còn 5 mục UNVERIFIED và 36 mục UNSUPPORTED (có nhãn rõ, không hiện như kết quả). Chưa có chuyên gia giáo dục duyệt nội dung. Chưa kiểm trên điện thoại hoặc GPU thật.

## 6. Phát hành và kiểm tra trên production (2026-11-27)

| Bước | Kết quả |
|---|---|
| Tag rollback `chemlab-6.7.0` → `8ce6f35` | Đã push lên GitHub |
| `CHEMAI_PUBLIC_APPROVAL` `groq:6.7.0` → `groq:7.0.0`, đổi trước khi push | Chỉ biến này đổi (`cf-inventory-before.json` / `cf-inventory-after.json`); bản 6.7.0 đang chạy vẫn `access:true` |
| `git push origin HEAD:main` | SUCCESS, fast-forward `8ce6f35..9143b88`, không force |
| Cloudflare Pages | SUCCESS, deployment production `2ee3d496` = `9143b88`, https://chemlab-edulab.pages.dev |
| GET `/api/chat` (không gửi câu hỏi) | `release 7.0.0`, `access:true`, `configured:true` |
| Service worker | `chemlab-7.0.0-access-1` |
| `node scripts/dlab-prod-smoke.mjs https://chemlab-edulab.pages.dev 7.0.0 … <browser>` | Chromium 24/24 · Firefox 24/24 · WebKit 24/24 |

Smoke kiểm tra trên website thật:
- Trang chủ 200, hiển thị version 7.0.0.
- Mục thanh bên mở `#dlab`; nạp lại trực tiếp `#dlab` vẫn chạy.
- Catalog có 22 thí nghiệm; lọc theo nhóm và tìm không dấu hoạt động.
- "Về bàn trống" hoạt động.
- Cu²⁺ + I⁻ làm qua thanh rót cho kết quả đúng chất hết trước.
- 2D vẽ được; 3D khởi tạo được; Guided khởi động được.
- Các trang Bảng tuần hoàn, Công cụ, Học tập, Thí nghiệm vẫn mở được; trang Thí nghiệm có thẻ 7.0.
- Ở 390 px: thẻ ở trang Thí nghiệm mở được lab, không có cuộn ngang.
- 0 lỗi console, 0 request lỗi, không có yêu cầu ChemAI nào ngoài GET.

Ghi chú WebKit: khi Playwright chụp ảnh, nó chèn một thẻ `<style>`, và CSP của ChemLab chặn đúng thẻ này ("Refused to apply a stylesheet", `style-src-elem`, inline). Đã kiểm chứng: cùng trang, không chụp ảnh thì 0 lỗi; chụp ảnh thì 1 lỗi. Đây là hiện tượng của công cụ kiểm thử, không phải lỗi của trang. Script chỉ bỏ qua đúng thông báo đó trong lúc chụp ảnh.

Ảnh và kết quả: `reports/chemlab-7.0/release/prod-smoke/`.
