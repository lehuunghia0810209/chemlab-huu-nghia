# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái: **PARTIAL**. Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **20/78** — g10-l1 … g10-l18 (Hóa 10 chương 1–5), g11-l1, g12-l15.
- Câu hỏi: **126** trong 5/21 chương (`g10-c1` … `g10-c5`); mỗi bài của các chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 4)

`npm run check` PASS (learning 176, question 218), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Ảnh chụp bài 15 (1280 px) và bài 17 (390 px, light) đã xem.

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), `097b5ee` (Batch 2), `bd6ced1` (Batch 3), commit "ChemLab 6.4 batch 4" (chương 4–5 lớp 10).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Hóa 10 **Chương 6 — Tốc độ phản ứng** (g10-l19, g10-l20) và **Chương 7 — Nguyên tố nhóm halogen** (g10-l21, g10-l22, g10-l23 — l23 hiện chỉ có trong danh mục); câu hỏi `questions/g10-c6.js`, `g10-c7.js`.
2. Mỗi chương: viết bài → thêm vào `FULL_LESSONS` → viết câu hỏi → thêm vào `QUESTION_CHAPTERS` → `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Sau đó: Hóa 11, Hóa 12.
