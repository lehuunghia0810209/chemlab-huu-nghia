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
| (docs) | EV-07 — đo LCP/CLS/tương tác có throttling, phiên dài 3D/Lab (xem EVOLUTION_AUDIT.md) |

## Kiểm thử gần nhất

`npm run check` PASS (chem 28) · `npm run build` PASS (không còn cảnh báo chunk > 500 kB) · `npm run check:browser` 150/150 PASS.

## Còn mở

- pH cho acid/base yếu, hệ đệm: chưa có nồng độ trong catalog → vẫn định tính.
- Phản ứng trong Lab là định tính (không tiêu thụ chất phản ứng; kết tủa không tan lại khi dư acid).
- Chưa có kiểm thử browser cho toàn bộ luồng guided g11-lesson-02 (đã mô phỏng logic bằng script).
- Lần mở chi tiết nguyên tố đầu tiên ~280 ms (CPU 4×); các lần sau < 150 ms.
- Chưa có kiểm thử a11y bằng công cụ (axe chưa cài).

## Bước tiếp theo

Người dùng review nhánh `evolution/next` (chưa push). Ứng viên tiếp: cài axe để kiểm tra a11y; phản ứng Lab theo lượng chất (tiêu thụ chất phản ứng); mở rộng thư viện phân tử.
