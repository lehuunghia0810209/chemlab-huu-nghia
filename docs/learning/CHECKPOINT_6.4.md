# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái: **PARTIAL**. Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **42/78** — toàn bộ Hóa 10 (g10-l1 … g10-l23), g11-l1 … g11-l18, g12-l15, g11-l1, g12-l15.
- Câu hỏi: **287** trong 11/21 chương (`g10-c1` … `g10-c7`, `g11-c1` … `g11-c4`); mỗi bài của các chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 9)

`npm run check` PASS (learning 203, question 437), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Ảnh chụp danh mục lớp 10 (1280 px) và bài 21 (390 px) đã xem.

Lưu ý cho test: `browser-smoke.mjs` dùng g12-l1 làm bài “bản rút gọn”; khi g12-l1 có nội dung đầy đủ, đổi sang một bài còn rút gọn (hoặc bỏ check khi không còn bài rút gọn).

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), `097b5ee` (Batch 2), `bd6ced1` (Batch 3), `9bd666b` (Batch 4), `a7b1700` (Batch 5), `0091c50` (Batch 6), `81a226b` (Batch 7), `3f38030` (Batch 8), commit "ChemLab 6.4 batch 9" (Hóa 11 chương 4).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Hóa 11 **Chương 5 — Dẫn xuất halogen – Alcohol – Phenol**: g11-l19, g11-l20 (Lab `g11-lesson-20`: glycerol + Cu(OH)₂), g11-l21 (Lab `g11-phenol-fecl3`), g11-l22 ôn tập; câu hỏi `questions/g11-c5.js`. Sau đó chương 6 (g11-l23 Lab `g11-lesson-23`, g11-l24 Lab `g11-lesson-24`, g11-l25).
2. Mỗi chương: viết bài → thêm vào `FULL_LESSONS` → viết câu hỏi → thêm vào `QUESTION_CHAPTERS` → `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Sau đó: Hóa 12 (g12-l15 đã có nội dung, cần câu hỏi).
