# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái: **PARTIAL**. Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **65/78** — toàn bộ Hóa 10 (g10-l1 … g10-l23), toàn bộ Hóa 11 (g11-l1 … g11-l25), Hóa 12 g12-l1 … g12-l17.
- Câu hỏi: **455** trong 18/21 chương (`g10-c1` … `g10-c7`, `g11-c1` … `g11-c6`, `g12-c1` … `g12-c5`); mỗi bài của các chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 16)

`npm run check:learning` PASS (learning 226, question 668), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Bài g12-l15 … g12-l17 và trang luyện tập từng bài (7 câu) mở trong Chrome không lỗi console.

Lưu ý cho test: `browser-smoke.mjs` dùng **g12-l29** làm bài “bản rút gọn” (bài thử thách như g12-l30 có quá ít bước). Khi viết g12-l29, đổi sang một bài thường còn rút gọn; khi không còn bài rút gọn thì bỏ check này.

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), `097b5ee` (Batch 2), `bd6ced1` (Batch 3), `9bd666b` (Batch 4), `a7b1700` (Batch 5), `0091c50` (Batch 6), `81a226b` (Batch 7), `3f38030` (Batch 8), `10f78b9` (Batch 9), `7574054` (Batch 10), `ce7e295` (Batch 11), `5d7bb3d` (Batch 12), `094b64f` (Batch 13), `d3e804f` (Batch 14), `8df82f9` (Batch 15), commit "ChemLab 6.4 batch 16" (Hóa 12 chương 5).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Hóa 12 **Chương 6 — Đại cương về kim loại**: g12-l18 … g12-l23 (không có thí nghiệm Lab có hóa chất); câu hỏi `questions/g12-c6.js`. Sau đó chương 7 (g12-l24 … l26), chương 8 (g12-l27 … l30; Lab g12-lesson-28 CuSO₄ + NH₃, g12-lesson-29 FeCl₃ + KSCN).
2. Mỗi chương: viết bài → thêm vào `FULL_LESSONS` → viết câu hỏi → thêm vào `QUESTION_CHAPTERS` → `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Hóa 12 tiếp theo theo chương (g12-l15 đã có nội dung, chỉ cần câu hỏi).
