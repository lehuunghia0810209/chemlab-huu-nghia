# Checkpoint ChemLab 6.5

Branch `evolution/next`. Không push, không merge, không deploy, không bump version (package/SW vẫn 6.2.0 — xem mục Release).

Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng. Commit luôn dùng pathspec tường minh.

## Milestones

| # | Nội dung | Trạng thái | Commit |
| --- | --- | --- | --- |
| M1 | Audit, Issue 77/78, nguồn cấu trúc đề và kiểm kê quyền sử dụng | Xong | `512cb51` |
| M2 | Exam engine (blueprint, scoring, validator, catalog gate, session/timer/autosave) + `check:exam` | Xong | `512cb51` |
| M3 | Exam UI (catalog, chuẩn bị, làm bài, xác nhận nộp, kết quả) + browser journeys + axe | Xong | `1f3180b` |
| M4 | Tích hợp đề chính thức | **BLOCKED — chưa có quyền sử dụng** (0/4 đề) | — |
| M5 | ChemAI rubric feedback (Practice) | Đang làm | — |
| M6 | Tối ưu, PWA, release prep | Chưa | — |
| M7 | QA cuối, hồ sơ cho Codex | Chưa | — |

## Kiểm thử gần nhất (sau M3)

`npm run check` PASS (project, chem 47, learning 242, question 782, exam 77, ui 76, ai mock), `npx vite build` PASS, `npm run check:browser` 296/296, `npm run check:a11y` 88 scans PASS.

Lưu ý: `npm run build` chạy `prebuild` = `release:sync` + `check`; với version 6.2.0 không đổi thì `release:sync` không tạo diff.

## Tiếp tục

1. Đọc file này, `git status`, `git log --oneline -5`.
2. Fixture đề kiểm thử chỉ hiện khi `localStorage['chemlab-exam-fixtures'] = '1'` (hoặc `vite dev`).
3. Tài liệu nguồn/quyền: `docs/exam/EXAM_SOURCES.md`.
