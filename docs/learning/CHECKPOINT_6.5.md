# Checkpoint ChemLab 6.5

Branch `evolution/next`. Không push, không merge, không deploy, không bump version (package/SW vẫn 6.2.0 — quy trình release: `docs/release/RELEASE_6.5.md`).

Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng. Commit luôn dùng pathspec tường minh.

Trạng thái: **2 ĐỀ CHÍNH THỨC READY_FOR_OWNER_RELEASE (owner-attested) — chưa phát hành.** Chờ audit độc lập (`docs/audit/CODEX_HANDOFF_6.5.md`, có ma trận EXR-001…007).

## Milestones

| # | Nội dung | Trạng thái | Commit |
| --- | --- | --- | --- |
| M1–M7 | Exam engine, UI, ChemAI rubric, release prep | Xong | `512cb51` … `9a47d99` |
| R1 | Đề tham khảo 2025 (28 câu, đáp án chính thức) | Xong | `0ecc6a5` |
| R2 | Đề minh họa (28 câu) + EXR-002 bằng chứng gốc | Xong | `83753d2` |
| R3 | EXR-003/007 (DO quota worker, fail-closed, cap đồng thời), EXR-006 (CSP + test), EXR-005 (test nâng cấp cache, tài liệu), EXR-004 (register) | Xong — chưa staging | commit “ChemLab 6.5 R3” |
| — | Đề tốt nghiệp 2025/2026, đề Đồng Nai | BLOCKED — không có bản gốc từ cơ quan ban hành | — |

## Kiểm thử gần nhất (2026-10-20)

`npm run build` (gồm `npm run check`: project, chem 47, learning 242, question 782/537, exam 79, exam papers 213, ui 76, ai mock, feedback 19) PASS, release:sync không tạo diff; `npm run check:browser` 334/334; `npm run check:a11y` 100 scans PASS.

## Tiếp tục

1. Đọc file này, `git status`, `git log --oneline -8`.
2. Fixture đề kiểm thử: `localStorage['chemlab-exam-fixtures'] = '1'` (hoặc `vite dev`).
3. Việc còn lại thuộc chủ dự án: quyết định phát hành 2 đề, deploy quota worker + staging plan (RELEASE §4), CSP trên staging, bump version (RELEASE §2), thẩm định giáo viên, audit độc lập.
