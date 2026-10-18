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
| (EV-04/06) | Bài học → mô hình 3D: bước kiến thức có `models` (g10-l12, g10-l13, g11 N₂), mở Compound Studio đè lên bài và quay lại đúng bước |

## Kiểm thử gần nhất

`npm run check` PASS (chem 28) · `npm run build` PASS (không còn cảnh báo chunk > 500 kB) · `npm run check:browser` 146/146 PASS.

## Còn mở

- pH cho acid/base yếu, hệ đệm: chưa có nồng độ trong catalog → vẫn định tính.
- Phản ứng trong Lab là định tính (không tiêu thụ chất phản ứng; kết tủa không tan lại khi dư acid).
- Chưa có kiểm thử browser cho toàn bộ luồng guided g11-lesson-02 (đã mô phỏng logic bằng script).
- EV-05 (Tools Pro: ion/tính tan), EV-07 (đo hiệu năng có throttling, a11y bằng công cụ) chưa làm.

## Bước tiếp theo

EV-05: audit Ion Engine + Solubility Table so với dữ liệu tính tan chuẩn; EV-07: đo LCP/INP với CPU/network throttling.
