# Session State — Next Evolution

- Branch: `evolution/next` (base `d06c3dd`). Không push/merge/deploy.
- File của người dùng giữ nguyên, không commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/`. Commit luôn dùng pathspec.

## Đã xong

**EV-01 — Scientific correctness (tools + lab data)**
- `src/chem/formula.js`, `src/chem/equation.js`: parser + cân bằng (nguyên tố + điện tích, phân số chính xác, cờ `unique`).
- Balancer và Chemistry Calculator dùng lõi chung.
- Sửa 22 phương trình trong `src/lab/reactions.js`.
- Test: `check:chem` 22 mục; `check:browser` 121 mục (thêm 6 kiểm thử công cụ).

## Kiểm thử gần nhất

`npm run check` PASS · `npm run build` PASS · `npm run check:browser` 121/121 PASS.

## Bước tiếp theo

Xem "Cơ hội tiếp theo" trong `EVOLUTION_AUDIT.md`. Ưu tiên: Compound/Reaction Studio dùng parser chung → mô hình pH theo nồng độ.
