# ChemLab 7.1.0 — Phòng thí nghiệm thống nhất: báo cáo hoàn thiện và bàn giao

Viết cho: chủ dự án và người tiếp quản ChemLab sau khi tạm đóng dự án. Ngày 2026-11-27.

> Trạng thái phát hành, SHA, deployment và kết quả kiểm thử production: xem §8 (cập nhật sau khi phát hành).

## 1. Tổng quan

- **Version:** 7.1.0 (package.json, appMeta, index.html, manifest, service worker `chemlab-7.1.0-…`, qua `npm run release:sync`).
- **Production:** https://chemlab-edulab.pages.dev/ (Cloudflare Pages project `chemlab-edulab`, Git integration, nhánh `main`).
- **Mục tiêu đợt này:** gộp phòng thí nghiệm gốc và Phòng thí nghiệm động thành một; mở rộng thư viện theo chương trình THPT; sửa lỗi khoa học còn tồn; cải thiện hình ảnh.

## 2. Phòng thí nghiệm thống nhất

| Trước (7.0) | Sau (7.1) |
|---|---|
| Hai mục: "Thí nghiệm" (`#lab`: một cốc, phản ứng tra bảng + 78 bài học) và "Phòng thí nghiệm động" (`#dlab`) | Một mục **Phòng thí nghiệm** (`#lab`) với ba cách dùng: **Tự do · Thư viện thí nghiệm · Có hướng dẫn** |
| Bàn tự do cũ dùng bộ phản ứng tra bảng riêng | Bàn tự do duy nhất là bàn mô phỏng động (một engine, một state, một thư viện) |
| `#dlab` là trang riêng | `#dlab` (liên kết cũ, "trang mở gần nhất" đã lưu) mở cùng trang và được viết lại thành `#lab` |
| Điện thoại vào lab động qua thẻ ở trang Thí nghiệm | Nút "Thí nghiệm" ở thanh dưới mở thẳng bàn thí nghiệm |

- **Có hướng dẫn** liệt kê: 5 bài thực hành trên bàn (mô phỏng động) và 78 bài học theo chương trình lớp 10–12 (giữ nguyên câu hỏi, tiến độ đã lưu, liên kết từ mục Học tập).
- 21/78 bài học có bước thao tác hóa chất; **11** bài có thí nghiệm động tương ứng (nút "Làm trên bàn thí nghiệm" bày dụng cụ ngay trên bàn). 10 bài còn lại (chủ yếu hữu cơ, khí NH₃/SO₂) dùng "bàn minh họa của bài học", được ghi nhãn rõ là minh họa theo kịch bản, không phải mô phỏng định lượng. Bảng đầy đủ: `reports/chemlab-7.1/LEGACY_MAPPING.md` (`node scripts/legacy-mapping.mjs`).
- Chuyển từ "Có hướng dẫn" sang "Tự do" **giữ nguyên bàn** để tiếp tục khám phá; "Về bàn trống" mới xóa (có xác nhận, hoàn tác được).
- Mã: `src/labShell.js`, `src/labShell.css`, `src/routeModuleLoader.js` (`loadLabRoute`), `src/main.js` (alias), `src/dlab/ui/dlabApp.js` (`opts.onGuided`, `toFree`, API `layOut`, `showLibrary`, `mode`).
- Giới hạn còn lại: bàn minh họa của bài học vẫn dùng bộ phản ứng tra bảng cũ (`src/lab/reactions.js`) cho 10 bài chưa có mô hình động. Không có trong giao diện tự do; không xóa vì các bài học, câu hỏi và tiến độ phụ thuộc vào nó.

## 3. Thư viện thí nghiệm

42 thí nghiệm độc lập (22 của 7.0 + 20 mới), 8 nhóm, mọi kết quả do engine tính; mức kiểm chứng suy ra từ ma trận, không gõ tay. VALIDATED 22 · Xấp xỉ giáo dục 20 · UNVERIFIED 0.

| Nhóm | Số | Mới trong 7.1 |
|---|---|---|
| Axit – bazơ và chất chỉ thị | 11 | quỳ tím 3 môi trường; metyl da cam; môi trường dung dịch muối; thứ tự nhỏ axit–cacbonat; CH₃COOH + NaHCO₃ |
| Kết tủa, hòa tan và tạo phức | 12 | Fe(OH)₂; Mg(OH)₂ tan trong axit; phân biệt BaCO₃/BaSO₄; làm mềm nước cứng; kết tủa phân đoạn AgI/AgCl; nhận biết Fe³⁺ bằng KSCN |
| Kim loại | 6 | Na + nước (giáo viên biểu diễn) |
| Điện hóa | 3 | — |
| Oxi hóa – khử | 4 | KMnO₄ + Fe²⁺ (axit); Fe³⁺ oxi hóa I⁻ thử bằng hồ tinh bột |
| Tốc độ, năng lượng và cân bằng | 3 | nồng độ và tốc độ; nhiệt trung hòa; chuyển dịch cân bằng FeSCN²⁺ (Le Chatelier) |
| Kỹ thuật thực hành | 2 | dung dịch bão hòa NaCl; chất lỏng tan/không tan |
| Hữu cơ và sinh hóa | 1 | nhận biết tinh bột bằng iot |

Mục tiêu 50–70 trong đề bài là định hướng; đợt này dừng ở 42 vì các thí nghiệm còn lại trong danh sách ứng viên (hữu cơ, khí, nhiệt độ – cân bằng NO₂/N₂O₄, xúc tác H₂O₂/MnO₂…) cần mô hình mới chưa kiểm chứng được. Không tạo thí nghiệm trùng chỉ để tăng số lượng.

## 4. Khoa học

Engine (mô hình mới, tổng quát, có nguồn trong mã):
- **Kết tủa cạnh tranh** (lỗi thật đã sửa): trước đây Cl⁻ + I⁻ + ít Ag⁺ tạo AgCl, và AgCl không chuyển thành AgI khi thêm I⁻. Nay các muối chung ion được giải lại, muối ít tan nhất nhận ion trước (`chemistry.js kspEquilibrium`).
- **MnO₄⁻ + 5Fe²⁺ + 8H⁺** (E° 1,51/0,771 V): chỉ khi pH ≤ 2; lượng phản ứng bị giới hạn bởi axit còn lại; thiếu axit thì báo OUT_OF_MODEL_RANGE (thực tế tạo MnO₂).
- **Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺**: K₁ = 10^3,03 (I = 0, Martell & Smith/NIST; Laurence 1956), giải đồng thời với thủy phân Fe³⁺; ε 4700 (Frank & Oswalt 1947). Báo khi SCN⁻ tự do > 5 mM (phức bậc cao không mô hình).
- **Hồ tinh bột – iot**: cần I₂ (≥ 2·10⁻⁵ M) và I⁻; mất màu trên ≈ 65 °C, có lại khi nguội.
- **AgSCN** (Ksp 1,03·10⁻¹², CRC); thuốc thử mới KMnO₄ 0,02 M, KSCN 0,1 M, dung dịch iot (I₂ 0,01 M trong KI 0,05 M), hồ tinh bột 1 %.
- **Vôn kế** (P1 tồn từ 7.0, đã sửa): điện cực đang phản ứng trực tiếp (Zn trong axit, Zn trong Cu²⁺, Cu trong Ag⁺) hoặc bị phủ kim loại khác → không hiển thị số, báo OUT_OF_MODEL_RANGE.
- **CaCO₃, BaCO₃** chuyển UNVERIFIED → VALIDATED nhờ lời giải độc lập (Ksp + phân bố cacbonat + cân bằng điện tích, ±3 %).

Ma trận kiểm chứng (`node scripts/dlab-sci-matrix.mjs`): 92 mục — VALIDATED 33, Xấp xỉ giáo dục 14, UNVERIFIED 3 (ZnCO₃, Ag₂CO₃, Zn(OH)₂; không thí nghiệm nào trong thư viện dùng chúng), UNSUPPORTED 34, chặn an toàn 8.

Giới hạn khoa học còn lại: hằng số ở lực ion 0 (dung dịch 0,2–0,5 M lệch vài phần mười đơn vị pH; FeSCN²⁺ đậm hơn thực tế ≈ vài lần ở I lớn); Nernst lí tưởng; tốc độ phản ứng là minh họa (bậc 1 theo H⁺ là giả thiết); Fe(OH)₂ không bị O₂ oxi hóa; Zn(OH)₂ không tan trong kiềm dư (có cảnh báo); phenolphtalein không mất màu trong kiềm rất đặc. Chưa có chuyên gia hóa học thẩm định.

## 5. Giao diện và đồ họa

- Ba chế độ trên cùng một thanh; tủ hóa chất đổi tên "Tủ hóa chất" để không trùng "Thư viện thí nghiệm"; bảng thư viện rộng hơn khi mở.
- 2D: mặt chất lỏng khum ở thành cốc, gợn khi khuấy/vừa rót, vòng lan tại điểm giọt/dòng chạm mặt (tắt theo "Giảm chuyển động" của hệ điều hành và của ChemLab); dung dịch pha sẵn khi "Bày dụng cụ" hiện đồng nhất; nhãn ghi FeSCN²⁺, MnO₄⁻; nhãn chai hồ tinh bột.
- 3D: tông màu nhạt được giãn màu khi hiển thị (state không đổi) — độ lệch màu đo được tăng ở các kịch bản chỉ thị, kết tủa, đồng bám. Cu²⁺ ≈ 0,2 M vẫn nhạt trong 3D ở chế độ sáng (P2).
- Sửa lỗi console "ResizeObserver loop…" khi chuyển trang chọn bài ↔ bàn.

## 6. Antigravity

- Nghiên cứu (chỉ đọc, gemini-4-neon-high): `reports/chemlab-7.1/agy/agy-research.md` — MnO₄⁻/Fe²⁺, FeSCN²⁺, hồ tinh bột, danh mục thí nghiệm GDPT 2018 theo SGK, kiểm lại Ksp/β. Các giá trị dùng trong mã được đối chiếu với nguồn đã biết trước khi tích hợp; liên kết của Antigravity là liên kết chuyển hướng tìm kiếm, không coi là bằng chứng nội dung.
- Rà soát độc lập bản RC: xem §8.

## 7. Bàn giao kỹ thuật

- Chạy: `npm install`, `npm run dev` (Vite). Build: `npm run build` (= `release:sync` + `check` + `vite build`, đúng lệnh Cloudflare).
- Kiểm thử: `node scripts/test-dlab.mjs` (unit + kiểm chứng), `node scripts/dlab-sci-validate.mjs`, `node scripts/dlab-sci-matrix.mjs`, `npm run check`, `CHEMLAB_BROWSER=chromium node scripts/dlab-e2e.mjs <url>`, `npm run check:browser`, `node scripts/dlab-guided-walk.mjs <url>`, `node scripts/dlab-3d-state.mjs <url> <out>`, `node scripts/dlab-prod-smoke.mjs <origin> <version> <out> <browser>`, `node scripts/legacy-mapping.mjs`.
- Thêm thí nghiệm: thêm một mục dữ liệu vào `src/dlab/data/experiments71.js` (schema ở đầu `experiments.js`), chỉ dùng process có trong `manifest.js`; `expectState` được kiểm bằng unit test và E2E qua giao diện; tên test trong `tests` phải tồn tại.
- Thêm dữ liệu khoa học: hằng số ở `materials.js`/`reactions.js` kèm nguồn và điều kiện trong chú thích; trạng thái kiểm chứng ở `validation.js` chỉ VALIDATED khi có nguồn và lời giải độc lập trong `test-dlab.mjs`.
- Phát hành: bump version + `release:sync`; đặt `CHEMAI_PUBLIC_APPROVAL=groq:<version>` trên Cloudflare **trước** khi push (nếu không ChemAI công khai sẽ tắt); push fast-forward `main`; theo dõi deployment; chạy prod smoke trên 3 trình duyệt.
- Rollback: Cloudflare → Deployments → deployment trước → Rollback (biến môi trường được cố định theo deployment); mốc Git: tag phiên bản trước.

## 8. Kiểm thử và phát hành

### 8.1 Bản phát hành ứng viên (mã RC, trước khi push)

| Cổng | Lệnh | Kết quả |
|---|---|---|
| A. Khoa học | `node scripts/dlab-sci-validate.mjs` | PASS 167/167 (cân bằng nguyên tố/điện tích mọi phương trình, hệ số engine = phương trình, khối lượng mol IUPAC) |
| A/B. Engine | `node scripts/test-dlab.mjs` | PASS 163/163 (lời giải tay độc lập cho 11 mô hình mới, bảo toàn nguyên tố, an toàn, lưu/mở, hoàn tác) |
| | `npm run check` (dự án, hóa học, dlab, học tập, thi, UI, ChemAI) | PASS |
| | `npm run build` (đúng lệnh Cloudflare) | PASS |
| C. Thống nhất | `node scripts/legacy-mapping.mjs`; E2E route `#dlab` → `#lab`, bài học mở trong trang, nút "Làm trên bàn thí nghiệm" | PASS (78 bài giữ nguyên; 11/21 có thí nghiệm động) |
| D. Trình duyệt (E2E, 42 thí nghiệm qua giao diện + 37 thẻ khám phá + kéo thả, cảm ứng, 3D, lưu/mở) | `node scripts/dlab-e2e.mjs` | Chromium 152/152 · Firefox 148/148 · WebKit 148/148 |
| | `npm run check:browser` | PASS 448/448 |
| | `node scripts/dlab-guided-walk.mjs` | 5/5 bài, 0 lỗi console, 0 yêu cầu ChemAI |
| E. Hình ảnh 3D theo state | `node scripts/dlab-3d-state.mjs` | 5/6 (giới hạn P2: Cu²⁺ ≈ 0,2 M nhạt trong 3D, chế độ sáng) |
| F. Ổn định | E2E P01/P02 (cảnh bận, mở/đóng 3D nhiều lần), heap Chromium 11,9 MB → 11,9 MB | PASS |
| G. Truy cập | E2E A01 axe WCAG 2.2 AA (sáng/tối) trên `#view-lab` | PASS |
| H. Rà soát độc lập | Antigravity, xem `agy/REVIEW_DISPOSITION.md` | 1 P0 + 12 P1: đã sửa và có test hồi quy (trừ 2 mục P2 ghi là giới hạn) |

Hiệu năng (headless, đồ họa phần mềm, 480 hạt): Chromium 60 fps; Firefox 39,4 / 36,9 fps; WebKit 33,8 / 38,8 fps (Cao / Tiết kiệm). Ngưỡng không đổi. Chưa đo trên điện thoại và GPU thật.

Ghi chú quy trình: E2E phục vụ `dist` qua `vite preview`, nên phải `npm run build` trước khi chạy; một lượt chạy trên `dist` cũ đã cho 91 lỗi giả và được chạy lại.

### 8.2 Production

(cập nhật sau khi phát hành)
