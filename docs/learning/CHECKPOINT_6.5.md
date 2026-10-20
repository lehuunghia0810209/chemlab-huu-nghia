# Checkpoint ChemLab 6.5

Branch `evolution/next`. Không push, không merge, không deploy, không bump version (package/SW vẫn 6.2.0 — quy trình release: `docs/release/RELEASE_6.5.md`).

Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng. Commit luôn dùng pathspec tường minh.

Trạng thái: **EXAM ENGINE COMPLETE — OFFICIAL EXAM CONTENT BLOCKED/PENDING RIGHTS.** Chờ audit độc lập (`docs/audit/CODEX_HANDOFF_6.5.md`).

## Milestones

| # | Nội dung | Trạng thái | Commit |
| --- | --- | --- | --- |
| M1 | Audit, Issue 77/78, nguồn cấu trúc đề, kiểm kê quyền | Xong | `512cb51` |
| M2 | Exam engine + `check:exam` (77 checks) | Xong | `512cb51` |
| M3 | Exam UI + browser journeys (35) + axe | Xong | `1f3180b` |
| M4 | Đề chính thức | **BLOCKED** — 4 đề có nguồn, 0 đủ quyền, 0 tích hợp | — |
| M5 | ChemAI rubric feedback + shared limits | Xong (mock; live AI chưa kiểm) | `96c0ecd` |
| M6 | Đo hiệu năng, quét responsive, chuẩn bị release | Xong (không đổi chunking: không có bằng chứng cần) | commit “ChemLab 6.5 M6–M7” |
| M7 | QA cuối, hồ sơ release/teacher review/Codex | Xong | commit “ChemLab 6.5 M6–M7” |

## Kiểm thử gần nhất

`npm run build` (gồm `npm run check`: project, chem 47, learning 242, question 782/537, exam 77, ui 76, ai mock, feedback 15) PASS; `npm run check:browser` 307/307; `npm run check:a11y` 92 scans PASS.

## Tiếp tục

1. Đọc file này, `git status`, `git log --oneline -8`.
2. Fixture đề kiểm thử: `localStorage['chemlab-exam-fixtures'] = '1'` (hoặc `vite dev`).
3. Việc còn lại thuộc chủ dự án: quyền sử dụng đề (`docs/exam/EXAM_SOURCES.md` §3), cấu hình Cloudflare và release (`docs/release/RELEASE_6.5.md`), thẩm định giáo viên (`docs/learning/TEACHER_REVIEW_REGISTER.md`), audit độc lập.
