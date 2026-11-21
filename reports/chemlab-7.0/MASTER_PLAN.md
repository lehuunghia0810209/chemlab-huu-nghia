# ChemLab 7.0 — Dynamic Virtual Laboratory: kế hoạch 5 Phase

Baseline: `origin/main` 8ce6f35 = Production ChemLab 6.7.0 (ChemAI Smart Hybrid). Checkout chính `D:\EduLab\ChemLab` (nhánh `evolution/next`, có thay đổi chưa commit của người dùng) **không bị động tới**; mọi việc làm trong worktree `D:\EduLab\.worktrees\chemlab-7.0`, nhánh `feature/chemlab-7.0-dynamic-laboratory`.

Quyết định nền tảng:
- Giữ stack hiện có: Vite + JavaScript ES modules, Three.js 0.186 đã có, test bằng script Node (`scripts/test-*.mjs`) và Playwright-core. Không thêm dependency.
- Phòng lab mới là view riêng `#dlab` (feature preview); phòng lab cũ giữ nguyên tới khi bản mới qua nghiệm thu.
- Không đổi version (6.7.0) trong lúc phát triển, vì `CHEMAI_PUBLIC_APPROVAL=groq:<version>` gắn với version ứng dụng.

| Phase | Nội dung | Điều kiện nghiệm thu |
|---|---|---|
| 1 | Simulation Core (state, clock bước cố định, lệnh, Undo, serialize, bất biến), registry dụng cụ/hóa chất, Workspace (header, thư viện, bàn, inspector, toolbar), kéo thả, rót | rót giữa hai bình bảo toàn lượng chất; UI đọc từ state; điều khiển thời gian; build + test |
| 2 | Chemistry Engine định lượng (pH, Ksp, nhiệt), giấy quỳ nhúng trực tiếp, chỉ thị, khuếch tán màu, khuấy, kết tủa/lắng, hòa tan/kết tinh | fixtures độc lập; giấy quỳ đúng vùng; không kết tủa giả |
| 3 | Chất rắn & vật lý (nổi/chìm/chuyển động), bọt khí, kim loại, nhiệt, Safety Engine, hư hỏng dụng cụ, điện hóa, hữu cơ | thí nghiệm end-to-end cho từng nhóm; Safety chặn/cảnh báo trước |
| 4 | Sandbox, 5 Guided Lab dùng chung core, Undo/Reset/Cleanup, IndexedDB, 2D/3D cùng state, ChemAI theo yêu cầu, UI/UX responsive | 25 kịch bản E2E |
| 5 | Kiểm chứng khoa học, E2E 3 trình duyệt, a11y, hiệu năng, regression toàn bộ, chuẩn bị RC/Preview, kế hoạch release/rollback | báo cáo D01–D34 |

Tài liệu: `PROGRESS.md` (điểm tiếp tục), `ARCHITECTURE.md`, `SCIENTIFIC_VALIDATION.md`, `TEST_RESULTS.md`, `RELEASE_REPORT.md`.
