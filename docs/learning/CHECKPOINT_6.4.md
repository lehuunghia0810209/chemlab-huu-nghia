# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái: **PARTIAL**. Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **63/78** — toàn bộ Hóa 10 (g10-l1 … g10-l23), toàn bộ Hóa 11 (g11-l1 … g11-l25), Hóa 12 g12-l1 … g12-l15.
- Câu hỏi: **434** trong 17/21 chương (`g10-c1` … `g10-c7`, `g11-c1` … `g11-c6`, `g12-c1` … `g12-c4`); mỗi bài của các chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 15)

`npm run check:learning` PASS (learning 224, question 639), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Bài g12-l12 … g12-l14 và trang luyện tập từng bài (7 câu) mở trong Chrome không lỗi console.

Lưu ý cho test: `browser-smoke.mjs` dùng **g12-l29** làm bài “bản rút gọn” (bài thử thách như g12-l30 có quá ít bước). Khi viết g12-l29, đổi sang một bài thường còn rút gọn; khi không còn bài rút gọn thì bỏ check này.

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), `097b5ee` (Batch 2), `bd6ced1` (Batch 3), `9bd666b` (Batch 4), `a7b1700` (Batch 5), `0091c50` (Batch 6), `81a226b` (Batch 7), `3f38030` (Batch 8), `10f78b9` (Batch 9), `7574054` (Batch 10), `ce7e295` (Batch 11), `5d7bb3d` (Batch 12), `094b64f` (Batch 13), `d3e804f` (Batch 14), commit "ChemLab 6.4 batch 15" (Hóa 12 chương 4).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Hóa 12 **Chương 5 — Pin điện và điện phân**: g12-l15 đã có nội dung (chỉ thiếu câu hỏi); viết g12-l16 Điện phân, g12-l17 ôn tập; câu hỏi `questions/g12-c5.js` (cho cả g12-l15). Sau đó chương 6 (g12-l18 … l23), 7 (l24 … l26), 8 (l27 … l30; Lab g12-lesson-28, g12-lesson-29).
2. Mỗi chương: viết bài → thêm vào `FULL_LESSONS` → viết câu hỏi → thêm vào `QUESTION_CHAPTERS` → `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Hóa 12 tiếp theo theo chương (g12-l15 đã có nội dung, chỉ cần câu hỏi).
