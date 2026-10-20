# Checkpoint ChemLab 6.5

Branch `evolution/next`. Không push, không merge, không deploy, không bump version (package/SW vẫn 6.2.0 — quy trình release: `docs/release/RELEASE_6.5.md`).

Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng. Commit luôn dùng pathspec tường minh.

Trạng thái: **IMPLEMENTATION COMPLETE — AWAITING INDEPENDENT FINAL AUDIT.** 8 đề READY_FOR_OWNER_RELEASE (owner-attested), 3 đề ôn DTT bị chặn chờ quyết định — chưa phát hành. Bàn giao audit: `docs/audit/CODEX_HANDOFF_6.5.md`.

## Milestones

| # | Nội dung | Trạng thái | Commit |
| --- | --- | --- | --- |
| M1–M7 | Exam engine, UI, ChemAI rubric, release prep | Xong | `512cb51` … `9a47d99` |
| R1 | Đề tham khảo 2025 (28 câu, đáp án chính thức) | Xong | `0ecc6a5` |
| R2 | Đề minh họa (28 câu) + EXR-002 bằng chứng gốc | Xong | `83753d2` |
| R3 | EXR-003/005/006/007, EXR-004 (register) | Xong — chưa staging | `6d57b7f` |
| R4 | Sở GD&ĐT Đồng Nai, khảo sát 2026 lần 1: ca 1 (mã 0301), ca 2 (mã 0325) | Xong | `29052b1` |
| R5 | Đề tốt nghiệp 2025 (mã 0338), 2026 (mã 0330) — đáp án đối chiếu đáp án chính thức của Bộ | Xong | `bd46600` |
| R6 | Đề ôn DTT 5, 6 (giáo viên biên soạn); DTT 2, 3, 4 BLOCKED | Xong | `509cb71` |
| R7 | Final QA toàn hệ thống, tài liệu bàn giao | Xong | commit “ChemLab 6.5 R7” |

## Kiểm thử gần nhất (2026-10-20, sau R6)

`npm run build` (gồm `npm run check`: project, chem 47, learning 242, question 782/537, exam 84, exam papers 848, ui 76, ai mock, feedback 19) PASS, release:sync không tạo diff; `npm run check:browser` 352/352 (gồm R2: 8 đề làm đủ 28 câu qua giao diện = 10/10; R3: mọi hình/bảng/phương trình ở 320 px light và 390 px dark); `npm run check:a11y` 100 scans PASS.

Nguồn đề: thư mục của chủ dự án `dethihoa` trên Desktop (OneDrive) — không đưa vào repo. Công cụ đọc docx/WMF chỉ dùng tạm trong scratchpad, không thuộc sản phẩm.

## Tiếp tục

1. Đọc file này, `git status`, `git log --oneline -10`.
2. Fixture đề kiểm thử: `localStorage['chemlab-exam-fixtures'] = '1'` (hoặc `vite dev`).
3. Việc còn lại thuộc chủ dự án: quyết định phát hành 8 đề và xử lí 3 đề DTT bị chặn (`docs/exam/EXAM_SOURCES.md` §2b), cấu hình Cloudflare và staging (`docs/release/RELEASE_6.5.md`), thẩm định giáo viên (`docs/learning/TEACHER_REVIEW_REGISTER.md`), audit độc lập.
