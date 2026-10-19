# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái: **PARTIAL**. Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **16/78** — g10-l1 … g10-l14 (Hóa 10 chương 1–3), g11-l1, g12-l15.
- Câu hỏi: **98** trong 3/21 chương (`g10-c1` … `g10-c3`); mỗi bài của các chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 3)

`npm run check` PASS (learning 162, question 178), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Ảnh chụp hình NaCl (390 px) và Lewis (1280 px, light) đã xem.

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), `097b5ee` (Batch 2), commit "ChemLab 6.4 batch 3" (chương 3 lớp 10).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Hóa 10 **Chương 4 — Phản ứng oxi hóa – khử**: g10-l15 (có hoạt động Lab `g10-redox-permanganate`), g10-l16 Ôn tập chương 4; câu hỏi `questions/g10-c4.js`. Sau đó chương 5 (g10-l17, l18), 6 (l19, l20), 7 (l21, l22, l23 — l23 hiện chưa có nội dung).
2. Mỗi chương: viết bài → thêm vào `FULL_LESSONS` → viết câu hỏi → thêm vào `QUESTION_CHAPTERS` → `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Sau đó: Hóa 11, Hóa 12.
