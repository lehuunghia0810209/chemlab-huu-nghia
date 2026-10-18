# Session State — Next Evolution

- Branch: `evolution/next` (base `d06c3dd`). Không push/merge/deploy.
- File của người dùng giữ nguyên, không commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/`. Commit luôn dùng pathspec.

## Đã xong

| Commit | Milestone |
|---|---|
| `78d399a` | EV-01 — `src/chem/formula.js` + `equation.js`; Balancer/Calculator dùng lõi chung; sửa 22 phương trình Lab |
| `b0dd7bb` | EV-01b — Compound/Reaction Studio dùng parser + bộ cân bằng chung; cảnh báo nghiệm không duy nhất; nhãn trạng thái khí/rắn |
| `3b19629` | EV-02a — pH Virtual Lab tính từ số mol (acid/base mạnh 0,1 M, Kw, Ka₂ HSO₄⁻); acid/base yếu chỉ hiển thị < 7 / ≈ 7 / > 7 |
| `fd65bc9` | EV-02b — Hoàn tác (snapshot), khóa trong chế độ Guided |
| `2aa9a11` | EV-02c — Khuấy chỉ tạo bọt khi đã có phản ứng sinh khí |
| `c904cc0` | EV-03 — 14 phân tử 3D (hình học thực nghiệm, có test), thẻ trong Compound Studio; Tool Center không còn tải Three.js |
| `2aee851` | EV-04/06 — Bài học → mô hình 3D: bước kiến thức có `models` (g10-l12, g10-l13, g11 N₂), mở Compound Studio đè lên bài và quay lại đúng bước |
| `1f52c34` | EV-05 — Bảng tính tan: Ag₂SO₄/Li₃PO₄ ít tan; 7 cặp "không tồn tại trong nước" kèm phương trình |
| `2230e63` | EV-07 — đo LCP/CLS/tương tác có throttling, phiên dài 3D/Lab (xem EVOLUTION_AUDIT.md) |
| `2870b80` | A11y — `npm run check:a11y` (axe-core 4.14 + kiểm tra bàn phím/focus); sửa tương phản, ARIA bảng tuần hoàn, tên nút, vòng focus, focus trong Studio/drawer |
| `b8e0427` | EV-02d — Lab định lượng: số mol, chất hạn chế, chất dư, sản phẩm (khối lượng kết tủa) cho phản ứng có nồng độ xác định |
| `0a4b1dd` | QA — kiểm thử browser trọn bài Guided g11-l2 |
| `49a3cd0` | EV-02e — kết tủa định lượng: 0,1 M cho 30 muối tan đã kiểm độ tan; 38 phản ứng có số mol/chất hạn chế/sản phẩm; Al(OH)₃, Zn(OH)₂ tan lại trong NaOH dư; hình kết tủa theo số mol; sửa pH khi có chất tiêu thụ OH⁻ |

## Kiểm thử gần nhất

`npm run check` PASS (chem 35) · `npm run build` PASS · `npm run check:browser` 165/165 PASS · `npm run check:a11y` PASS (44 lần quét axe + kiểm tra bàn phím).

Quy trình QA đầy đủ: `npm run check` → `npm run build` → `npm run check:browser` → `npm run check:a11y`.

## Còn mở

- pH cho acid/base yếu, hệ đệm: chưa có nồng độ trong catalog → vẫn định tính.
- Định tính có lý do: Fe³⁺/SCN⁻ (cân bằng), Na₂CO₃/Na₂SO₃ + HCl (hai nấc), CuSO₄/MgCl₂ + Na₂CO₃ (carbonate base). Có thể mô hình hai nấc carbonate sau.
- pH khi có muối phản ứng/thủy phân chỉ định tính.
- Lần mở chi tiết nguyên tố đầu tiên ~280 ms (CPU 4×); các lần sau < 150 ms.

## Bước tiếp theo

Người dùng review nhánh `evolution/next` (chưa push). Ứng viên tiếp: mô hình hai nấc Na₂CO₃ + HCl (khí chỉ xuất hiện sau nấc 1 — cần đồng bộ hiệu ứng bọt khí); mở rộng thư viện phân tử.
