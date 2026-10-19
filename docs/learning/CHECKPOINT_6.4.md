# Checkpoint ChemLab 6.4

Cập nhật sau mỗi batch. Trạng thái nội dung: **78/78 bài, 21/21 chương có câu hỏi — kiểm thử tự động PASS**; nội dung mới ở mức kiểm tra nội bộ, chưa qua thẩm định giáo viên/chuyên gia (xem `CONTENT_VERIFICATION.md`). Không push, không merge, không deploy.

## Tiến độ

- Bài đầy đủ (`FULL_LESSONS`): **78/78** — toàn bộ Hóa 10, 11, 12.
- Câu hỏi: **537** trong 21/21 chương; mỗi bài của các chương này có ≥ 6 câu, ≥ 3 dạng.
- Hạ tầng (answer engine, ngân hàng câu hỏi, Practice Workspace, kiểm tra cân bằng phương trình, báo cáo coverage) hoàn thành ở Batch 1 — xem `LEARNING_6.4.md` §2–3.
- Batch log: `LEARNING_6.4.md` §4.

## Kiểm thử gần nhất (Batch 19)

`npm run check:learning` PASS (learning 239, question 782), `npm run build` PASS, `npm run check:browser` 261/261, `npm run check:a11y` PASS. Bài g12-l27 … g12-l30 và trang luyện tập từng bài mở trong Chrome không lỗi console; ảnh 390 px bài 29 đã xem.

Lưu ý cho test: không còn bài “bản rút gọn”; `browser-smoke.mjs` kiểm tra g12-l29 (bài rút gọn cuối cùng trước đây) mở dạng đầy đủ. `legacyAdapter.js` vẫn giữ nhưng hiện không còn bài nào dùng.

## Git

- Commit 6.4: `e107bbe` (Batch 1), `c5c21a6` (checkpoint giữa Batch 2), `097b5ee` (Batch 2), `bd6ced1` (Batch 3), `9bd666b` (Batch 4), `a7b1700` (Batch 5), `0091c50` (Batch 6), `81a226b` (Batch 7), `3f38030` (Batch 8), `10f78b9` (Batch 9), `7574054` (Batch 10), `ce7e295` (Batch 11), `5d7bb3d` (Batch 12), `094b64f` (Batch 13), `d3e804f` (Batch 14), `8df82f9` (Batch 15), `6302baf` (Batch 16), `17893bb` (Batch 17), `83892c1` (Batch 18), commit "ChemLab 6.4 batch 19" (Hóa 12 chương 8).
- Không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` của người dùng.

## Bước tiếp theo

1. Nội dung đã đủ 78 bài. Việc còn lại: giáo viên/chuyên gia đối chiếu các mục trong `CONTENT_VERIFICATION.md` với SGK in; cân nhắc precache bài học cho chế độ offline khi phát hành (xem `LEARNING_6.4.md` §6).
2. Khi sửa nội dung bài hoặc câu hỏi: `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write` → `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y` → xem ảnh chụp → cập nhật batch log và file này → commit với pathspec tường minh.
3. Khi phát hành: bump version + `npm run release:sync` (chưa làm, theo yêu cầu không bump version).
