# Checkpoint ChemLab 6.4 — tạm dừng 2026-10-19

Trạng thái: **PARTIAL** — đang ở Batch 2 (Hóa 10, Chương 2). Không push, không merge, không deploy.

## 1. Đã hoàn thành

| Phase | Trạng thái | Bằng chứng |
| --- | --- | --- |
| 0 — Audit | Xong | `LEARNING_6.4.md` §1 (baseline: check PASS, build PASS, browser 251/251, a11y PASS) |
| 1 — Kiến trúc nội dung | Xong | block `mistakes`, callout `question`, `equation.condition` / `check:false`, `worked.table`; `FULL_LESSONS`; kiểm tra cân bằng phương trình |
| 3 — Practice Workspace | Xong (bản đầu) | `practiceApp.js`, `practice.css`, `practiceProgress.js`; 5 dạng câu hỏi; chế độ Luyện tập / Kiểm tra; kết quả, ôn câu sai; quiz 6.2 ở `#learning/practice/topics` |
| 4 — Ngân hàng câu hỏi | Hạ tầng xong; nội dung 1/21 chương | `answerEngine.js`, `questionBank.js`, `scripts/test-questions.mjs`; 28 câu (`questions/g10-c1.js`) |
| 2 — Nội dung bài học | 6/78 bài đầy đủ (+2 bài nháp) | xem §2 |
| 5–7 — UI, an toàn dữ liệu, QA | Làm song song từng batch | xem §4 |

## 2. Bài học

- **Đầy đủ, đã kiểm thử, đã commit (6, thuộc `FULL_LESSONS`):** g10-l1, g10-l2, g10-l3, g10-l4 (Chương 1 lớp 10), g11-l1, g12-l15. Ba bài mẫu 6.3 được bổ sung câu hỏi mở đầu và nhầm lẫn thường gặp.
- **Câu hỏi:** đủ ≥ 6 câu/bài, ≥ 3 dạng cho g10-l1…l4 (28 câu). Các bài khác chưa có câu hỏi.
- **Viết dở, CHƯA đăng ký, CHƯA kiểm thử (Batch 2):**
  - `src/learning/lessons/g10-l5.js` — Cấu tạo của bảng tuần hoàn (viết xong nội dung).
  - `src/learning/lessons/g10-l6.js` — Xu hướng biến đổi tính chất nguyên tử (viết xong nội dung; đã đổi hoạt động sang Atomic Explorer Na/K vì bảng tuần hoàn của ChemLab chưa có dữ liệu độ âm điện).
  - Hai file này chưa có trong `FULL_LESSONS` nên ứng dụng và test **chưa tải** chúng.
- **Chưa bắt đầu:** g10-l7, g10-l8, g10-l9, câu hỏi `questions/g10-c2.js`; toàn bộ chương còn lại (lớp 10 chương 3–7, lớp 11, lớp 12 trừ 2 bài mẫu).

Tiến độ thực: 6/78 bài đầy đủ (+2 bài nháp), 28/≥468 câu hỏi.

## 3. File và Git

- Nhánh `evolution/next`. Commit 6.4: `e107bbe` (Batch 1: hạ tầng, Practice, Hóa 10 chương 1). Commit checkpoint này đi kèm hai file nháp g10-l5, g10-l6 (chưa đăng ký nên không ảnh hưởng ứng dụng).
- Thay đổi của người dùng giữ nguyên, không đưa vào commit: `AGENTS.md` (staged), `.gitignore` (modified), `.claude/` (untracked).
- File chính đã tạo/sửa trong 6.4: `src/learning/{answerEngine,questionBank,practiceApp,practiceProgress,chemMath,lessonMeta,format,routes,catalog,learningApp,legacyAdapter}.js`, `src/learning/{learning,practice}.css`, `src/learning/lessons/g10-l2…l6.js`, `src/learning/questions/g10-c1.js`, `scripts/{test-learning,test-questions,browser-smoke,a11y-audit}.mjs`, `scripts/lib/{equation-check,practice-journeys}.mjs`, `package.json` (`check:learning`), `docs/learning/*`.
- Ghi chú: trong phiên này tôi đã lỡ chạy `git config core.safecrlf false` rồi hoàn tác ngay (`--unset`); cấu hình git hiện không thay đổi.

## 4. Kiểm thử

| Lệnh | Kết quả gần nhất |
| --- | --- |
| `npm run check:learning` | PASS (152 learning, 84 question checks) — chạy lúc tạo checkpoint |
| `npm run check` | PASS — trước commit `e107bbe` |
| `npm run build` | PASS — trước commit `e107bbe` |
| `npm run check:browser` | PASS 261/261 — trước commit `e107bbe` |
| `npm run check:a11y` | PASS, 72 lượt quét — trước commit `e107bbe` |

**Chưa chạy:** mọi kiểm thử cho g10-l5, g10-l6 (schema, cân bằng phương trình, render trên trình duyệt, responsive). Chưa có lỗi nào đang mở ngoài việc nội dung còn thiếu.

## 5. Bước tiếp theo (chính xác)

1. Đọc file này và `LEARNING_6.4.md` §3–5; `git status` để xác nhận g10-l5.js, g10-l6.js còn đó.
2. Rà lại g10-l5.js và g10-l6.js (nội dung đã viết, chỉ cần kiểm thử), rồi viết tiếp:
   - `g10-l7.js` — oxide/hydroxide cao nhất chu kì 3 (Na₂O…Cl₂O₇, NaOH…HClO₄; Al(OH)₃ lưỡng tính, dùng `Na[Al(OH)₄]`).
   - `g10-l8.js` — định luật tuần hoàn, ý nghĩa bảng tuần hoàn (ví dụ RH₃ có 8,82% H ⇒ R = P).
   - `g10-l9.js` — ôn tập chương 2 (Mg/Al có tổng Z = 25; RO₂ có 53,33% O ⇒ Si).
3. Viết `src/learning/questions/g10-c2.js`: ≥ 6 câu/bài cho g10-l5…l9, ≥ 3 dạng/bài, câu tính toán có `verify()` và `solution`.
4. Thêm `'g10-l5'…'g10-l9'` vào `FULL_LESSONS` (`src/learning/catalog.js`) và `'g10-c2'` vào `QUESTION_CHAPTERS` (`src/learning/questionBank.js`).
5. Chạy `node scripts/test-learning.mjs --write && node scripts/test-questions.mjs --write`, rồi `npm run check`, `npm run build`, `npm run check:browser`, `npm run check:a11y`; xem ảnh chụp 390px và 1280px cho các bài mới.
6. Cập nhật bảng Batch log trong `LEARNING_6.4.md` §4 và mục cần thẩm định trong `CONTENT_VERIFICATION.md`.
7. Commit với pathspec tường minh (`git commit -F msg -- <paths>`), không `git add -A`. Sau đó chuyển sang Hóa 10 Chương 3.
