# ChemLab 7.0 — PROGRESS (điểm tiếp tục cho phiên sau)

Cập nhật: 2026-11-22 (phiên hoàn thiện Phase 5). Worktree `D:\EduLab\.worktrees\chemlab-7.0`, nhánh `feature/chemlab-7.0-dynamic-laboratory` (từ `origin/main` 8ce6f35). **Đã push nhánh (được chủ sở hữu duyệt); chưa merge, chưa deploy Production; version vẫn 6.7.0.** Checkout chính `D:\EduLab\ChemLab` không bị sửa.

## Phase hiện tại: 5/5 — PARTIAL (Preview sẵn sàng cho nghiệm thu)

| Phase | Trạng thái | Checkpoint |
|---|---|---|
| 1 Core & Workspace | PASS | dab9857, 30e41b0 |
| 2 Chemistry & Fluid | PASS | dab9857, 4f89127 (hằng số có nguồn, dime Cu) |
| 3 Advanced, Physics, Safety | PASS (giới hạn: SCIENTIFIC_VALIDATION §6–7) | dab9857 |
| 4 Lab Experience & UI/UX | PASS (cảm ứng: chỉ giả lập) | 30e41b0, 4f89127 (3D tương tác, hình ảnh) |
| 5 Validation, Perf, Release | PARTIAL — RELEASE_REPORT.md | b379911, 4f89127 + commit cuối |

## Phiên này đã làm

Đối chiếu nguồn và sửa 3 hằng số + thêm dime Cu (hết kết tủa Cu(OH)₂ giả; pH CuSO₄ khớp số đo); cảnh báo lực ion; 3D tương tác qua controller dùng chung; tự căn khung, sửa đáy cốc, bóng/phản quang, nhãn hư hỏng, đám mây kết tủa; nhúng quỳ bằng thông số; lệnh lỗi tự khôi phục; sửa `check:ui` hỏng từ b379911; test: 41 unit, E2E 40/37/37, 448/448; Lighthouse; hiệu năng/bộ nhớ qua CDP; Preview `4f89127` (Access 302).

## Còn lại / blocker

1. Chuyên gia duyệt SCIENTIFIC_VALIDATION §8 (D31).
2. Chủ sở hữu đăng nhập Access và chạy checklist RELEASE_REPORT §6, gồm điện thoại thật (D30, D34).
3. LCP mobile giả lập 2,9 s > 2,5 s — nguyên nhân: FCP app shell + chunk lười; hướng xử lý ở TEST_RESULTS §5 (ảnh hưởng toàn app, chưa làm).
4. Quyết định tách `CHEMAI_RELEASE` khỏi `APP_VERSION` hay giữ (RELEASE_REPORT §2) trước khi nâng 7.0.0.

## Tiếp tục chính xác từ đâu

Đọc `RELEASE_REPORT.md`. Nếu chủ sở hữu duyệt phát hành: làm §3 “Kế hoạch phát hành”. Lệnh kiểm: `npm run check`, `npx vite build`, `node scripts/dlab-e2e.mjs` (+ `CHEMLAB_BROWSER=firefox|webkit`, chạy tuần tự), `npm run check:browser`, `node scripts/dlab-visual-audit.mjs <nhãn>`, `node scripts/dlab-perf-audit.mjs`.
