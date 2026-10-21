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

## 6.5.0 Final Completion (2026-10-21) — XONG phần kỹ thuật

| # | Nội dung | Commit |
| --- | --- | --- |
| F1 | Version 6.5.0 (release:sync), budget ChemAI theo từng lần gọi Gemini, editorialNote đề 2025/2026, PWA upgrade journeys 6.2→6.5, test | “ChemLab 6.5.0 F1” |
| F2 | Tài liệu: RELEASE (G1–G10, playbook, rollback), CLOUDFLARE_STAGING_VERIFICATION, PWA upgrade, EXAM_RELEASE_MATRIX, review packet, FINAL_6_5_0_COMPLETION, CODEX_FINAL_DELTA_HANDOFF; script staging-smoke, local-cloudflare-check, build-review-packet | “ChemLab 6.5.0 F2” |

Kiểm thử cuối: build+check PASS (exam 84, papers 850, feedback 20) · browser 359/359 (2 lần liên tiếp) · a11y 100 PASS · npm audit 0 · local Cloudflare runtime 12/12. NOT RUN: staging, Gemini thật, thiết bị thật, screen reader.

Verdict: TECHNICALLY COMPLETE — READY FOR OWNER ACCEPTANCE. Còn: G6/G7 (cần phê duyệt staging một lần, `docs/release/CLOUDFLARE_STAGING_VERIFICATION.md` §4), G8 thẩm định giáo viên, G10 phê duyệt phát hành; DTT 2–4 vẫn BLOCKED.

## ChemAI production hotfix (2026-10-21)

Production `main` = `2ce2914` (owner merged `evolution/next` @ `37f30b6`). Lỗi `400 FAILED_PRECONDITION`: không do code (model/endpoint/payload hợp lệ theo tài liệu Google). Nguyên nhân thuộc điều kiện tài khoản (Free Tier); giả thuyết mạnh nhất là Functions chạy tại colo HKG (Hồng Kông không thuộc vùng Gemini hỗ trợ). CHƯA xác nhận bằng log Google. Đã sửa: P1 fail-open (thiếu `CHEMAI_BUDGET` → 503, 0 lượt gọi), kiểm tra input trước khi trừ quota, mã `GEMINI_PRECONDITION_FAILED` + `reason`, log có cấu trúc + `requestId`, UI không retry lỗi cấu hình, timeout phía client 65 s. Chi tiết và việc của chủ dự án: `docs/release/CHEMAI_PRODUCTION_HOTFIX_6.5.md`. Kiểm thử: build PASS · workerd 14/14 · browser 362/362 · a11y PASS · audit 0. Preview/production/Gemini thật: NOT RUN.

Regression 6.2 → 6.5 (2026-10-21): request gửi tới Google giống hệt từng byte giữa `e8e204b`, `37f30b6`, `1f33ce9` (chỉ khác header `x-goog-api-client`); model 6.2 = 6.5 = `gemini-3.8-flash`. Không có regression trong code. Chưa xác minh: thông báo gốc của Google, biến Cloudflare theo thời gian. Phép thử an toàn cho chủ dự án: `docs/release/CHEMAI_PRODUCTION_HOTFIX_6.5.md` §5.1 (tail log + 1 câu hỏi trên deployment 6.2 `69508b59`).

## ChemAI → Cloudflare Workers AI (2026-10-21)

Provider mặc định `workers_ai` (`@cf/zai-org/glm-4.7-flash`, fallback `@cf/google/gemma-4-26b-a4b-it`, allowlist chỉ model miễn phí), Gemini giữ nguyên nhưng chỉ chạy khi `CHEMAI_PROVIDER=gemini`. Ngân sách Neurons chính xác qua Durable Object (giữ trước, hoàn lại theo `usage`), giới hạn mỗi client/ngày, chống trùng lặp, giới hạn đồng thời, timeout. Kiểm thử local PASS (workers-ai 20, workerd 16/16, browser 362/362, a11y, build). Workers AI thật và chất lượng model: NOT RUN (chờ xác minh gói Free + phê duyệt). Hướng dẫn: `docs/release/CHEMAI_WORKERS_AI.md`.
