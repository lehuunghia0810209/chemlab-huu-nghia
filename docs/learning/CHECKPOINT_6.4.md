# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái: **PARTIAL**. Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **11/78** — g10-l1 … g10-l9 (Hóa 10 chương 1–2), g11-l1, g12-l15.
- Câu hỏi: **63** trong 2/21 chương (`g10-c1`, `g10-c2`); mỗi bài của hai chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 2)

`npm run check` PASS (learning 157, question 131), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Ảnh chụp 390/1280 px đã xem; đã sửa lỗi chữ đậm trong callout và khối "Nhầm lẫn thường gặp".

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), commit "ChemLab 6.4 batch 2" (chương 2 lớp 10).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Hóa 10 **Chương 3 — Liên kết hóa học**: g10-l10 Quy tắc octet, g10-l11 Liên kết ion, g10-l12 Liên kết cộng hóa trị, g10-l13 Liên kết hydrogen và tương tác van der Waals, g10-l14 Ôn tập chương 3; câu hỏi `questions/g10-c3.js`.
2. Mỗi chương: viết bài → thêm vào `FULL_LESSONS` → viết câu hỏi → thêm vào `QUESTION_CHAPTERS` → `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Sau đó: Hóa 10 chương 4–7 (g10-l15 … g10-l23), Hóa 11, Hóa 12.
