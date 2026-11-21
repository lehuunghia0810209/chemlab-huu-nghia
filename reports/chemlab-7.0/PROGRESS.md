# ChemLab 7.0 — PROGRESS (điểm tiếp tục cho phiên sau)

Cập nhật: 2026-11-22. Worktree `D:\EduLab\.worktrees\chemlab-7.0`, nhánh `feature/chemlab-7.0-dynamic-laboratory` (từ `origin/main` 8ce6f35). **Chưa push, chưa deploy.** Checkout chính `D:\EduLab\ChemLab` không bị sửa.

## Phase hiện tại: 5/5 — PARTIAL

| Phase | Trạng thái | Checkpoint |
|---|---|---|
| 1 Core & Workspace | PASS | dab9857, 30e41b0 |
| 2 Chemistry & Fluid | PASS | dab9857 |
| 3 Advanced, Physics, Safety | PASS (giới hạn ở SCIENTIFIC_VALIDATION §4–5) | dab9857 |
| 4 Lab Experience & UI/UX | PASS (cảm ứng thật chưa kiểm trên thiết bị) | 30e41b0 + commit Phase 5 |
| 5 Validation, Perf, Release | PARTIAL — xem RELEASE_REPORT.md | commit Phase 5 |

## Đã xong

- Engine: `src/dlab/engine/*` (chemistry, processes, safety, sim), registry `src/dlab/data/*`, lưu trữ `src/dlab/persistence.js`, Guided `src/dlab/guided.js`.
- UI: `src/dlab/ui/dlabApp.js`, `render2d.js`, `render3d.js`, `dlab.css`; route `#dlab` trong `src/main.js` + `src/routeModuleLoader.js`; thẻ lối vào trong lab cũ (`src/virtualLab.css`).
- Test: `npm run check:dlab` (36 unit/integration, có trong `npm run check`), `node scripts/dlab-e2e.mjs` (29 journey, `CHEMLAB_BROWSER=firefox|webkit`, `DLAB_ONLY=S07,M01`).

## Quyết định kiến trúc

- JS + Vite + Three.js sẵn có; không thêm dependency.
- State JSON là nguồn sự thật; bước cố định 1/60 s; Undo = snapshot JSON (40).
- pH bằng cân bằng điện tích; Ksp bằng bisection; kết tủa đầu cần Q > 10·Ksp.
- Màu: tracer 10×14, “bake” khi có lần thêm rời rạc mới, ngoại suy màu khi đậm đặc tại điểm tiếp xúc.
- Inspector chỉ vá text khi chỉ số thay đổi (tránh nút bị thay khi đang bấm).
- Không đổi version 6.7.0 (ràng buộc `CHEMAI_PUBLIC_APPROVAL`).

## Còn lại / blocker

1. Chuyên gia duyệt hằng số và lời văn Guided (D31).
2. Chủ sở hữu quyết định push nhánh để tạo Preview (Access) và kiểm tra Preview; đặt approval `groq:7.0.0` trước khi lên main (D34).
3. Kiểm thử cảm ứng trên thiết bị thật (D30).
4. Hồ sơ hóa chất 39/≈50 mục tiêu; quy tắc phản ứng dị thể 8 + cân bằng Ksp 8 + trung hòa/khí CO₂ tự động.

## Tiếp tục chính xác từ đâu

Đọc `RELEASE_REPORT.md` → nếu chủ sở hữu duyệt: làm các bước “Kế hoạch phát hành”. Nếu cần mở rộng: thêm hóa chất vào `REAGENTS` (kèm nguồn), thêm quy tắc vào `KINETIC`, thêm fixture độc lập vào `scripts/test-dlab.mjs`.
