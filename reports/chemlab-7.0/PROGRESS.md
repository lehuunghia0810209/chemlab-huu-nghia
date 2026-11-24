# ChemLab 7.0 — PROGRESS (điểm tiếp tục cho phiên sau)

Cập nhật: 2026-11-23 (UX rescue & 3D redesign, xem `UX_RESCUE_REPORT.md`). Phát triển tại `D:\EduLab\ChemLab` (worktree cũ đã gỡ 2026-11-22), nhánh `feature/chemlab-7.0-dynamic-laboratory` (từ `origin/main` 8ce6f35). **Đã push nhánh (được chủ sở hữu duyệt); chưa merge, chưa deploy Production; version vẫn 6.7.0.** Checkout chính `D:\EduLab\ChemLab` không bị sửa.

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

## Phiên 2026-11-23 — UX rescue

Bố cục "bàn trước, điều khiển sau", thanh thao tác theo ngữ cảnh, tìm kiếm thư viện, bảng Quan sát (đang diễn ra / kết luận / an toàn, nhật ký gộp), hướng dẫn nhanh, khung phóng to 2D, 3D dựng lại (thủy tinh, mặt thoáng ngang, bóng, vòng chọn, camera giới hạn, Góc mặc định/Vừa khung, tự chuyển Tiết kiệm khi không có GPU). Sửa lỗi hộp thoại liên tiếp làm không thả được natri. Test: 45 unit, E2E 47/44/44, 448/448. Chưa push. Chi tiết và giới hạn: `UX_RESCUE_REPORT.md`.

## Phiên 2026-11-24 — Guided Lab: kẹp, thời gian chờ, nhãn 3D

Nghiệm thu của chủ sở hữu (Preview 7a0c804): không gắp được đinh sắt ra khỏi cốc, chờ lâu ở 4×, kẹp hiện "Natri 0,1 g", khó phân biệt vật trong 3D. Đã tái hiện bằng chuột thật trên 7a0c804 và sửa tận gốc:
- Lệnh `grab` mới; vật được kẹp là đối tượng thật (`holder`).
- Vùng bấm khớp hình vẽ, vật nhỏ được ưu tiên trong cả 2D và 3D.
- Lớp phủ không còn chặn chuột.
- Kẹp và thìa đưa ra đúng chất và khối lượng theo bước.
- Thanh bước Guided có "Tua đến hiện tượng", chạy chính mô hình.
- Nhãn lấy từ trạng thái mô phỏng, dùng chung cho 2D và 3D.

Thời gian chờ lâu là do đinh 0,1 g, hệ quả của khối lượng mặc định sai; tốc độ 4× vẫn đúng. Chi tiết, bằng chứng trước/sau và giới hạn: `GUIDED_TONGS_REPORT.md`. Chưa push.

## Phiên 2026-11-24 (2) — Sửa lỗi sau QA của Codex

**CL7-QA-001** (19 lần bấm “5 giọt”) có ba nguyên nhân:
- Lỗi engine: giọt sinh ra dưới miệng cốc rơi ra bàn, mất 40–70% dung dịch.
- Mô hình cần khoảng 3 mL NaOH, nhưng hướng dẫn chỉ ghi “vài lần”.
- Mỗi lần chỉ hút được 1 mL.

Sau khi sửa:
- Bước 1 bài Kết tủa còn 8 thao tác, có dòng tiến độ định lượng lấy từ mô hình.
- Ống nhỏ giọt có nút 10 giọt, nhập số mL và “Hút thêm”.

Các thay đổi khác:
- Sửa `patch()` làm lệch tên và đích trong ô chọn (có thể nhỏ nhầm cốc).
- Thư viện tách thành Tủ hóa chất và Kệ dụng cụ.
- 3D: phản hồi thả đúng/sai và nút Nhìn vật chọn.
- 2D: bàn không tự dịch khi người dùng đang thao tác.
- Đinh vẽ đúng hình trên bàn; nhãn tránh panel.
- Lớp Cu tính theo độ dày, nên thời gian chờ không còn phụ thuộc cỡ đinh.

Test: DLab 53/53, E2E 59/56/55 (WebKit P01 29,1 fps), 448/448, 5/5 Guided Lab.

Chi tiết: `POST_CODEX_QA_FIX_REPORT.md`. Chưa push.

## Phiên 2026-11-24 (3) — Complete Lab Rebuild (directive 5 phase)

Quyết định kiến trúc: KEEP lõi (một state, một engine), REFACTOR có trọng điểm.

**Lỗi bài Kết tủa bước 5** có hai nguyên nhân:
- Đích mặc định là cốc gần nhất.
- `34fd4de` mang lựa chọn “Thả vào” sang vật khác.

Đã sửa và có test G09.

**Antigravity** (`agy`, chỉ đọc) đã review 2 vòng. Đã kiểm chứng và sửa 4 lỗi P0 và 12 lỗi P1:
- Bảo toàn chất, vượt quá lượng axit.
- “Chưa hỗ trợ” thay cho im lặng; thêm kết tủa.
- Điều kiện bước Guided, vật bị cất, Hoàn tác/Đặt lại.

**3D:** lớp dầu, catot, dây.

**Test:** unit 57/57; E2E 61/58/58; 448/448; 5/5 bài.

Commits: `fc43ae4`, `1707961`, `6f2bc1c`, `a306197`, `15e6d45`, cộng commit báo cáo. Chi tiết và phần chưa làm: `COMPLETE_LAB_REBUILD_REPORT.md` §18. Chưa push.

## Còn lại / blocker

1. Chuyên gia duyệt SCIENTIFIC_VALIDATION §8 (D31).
2. Chủ sở hữu đăng nhập Access và chạy checklist RELEASE_REPORT §6, gồm điện thoại thật (D30, D34).
3. LCP mobile giả lập 2,9 s > 2,5 s — nguyên nhân: FCP app shell + chunk lười; hướng xử lý ở TEST_RESULTS §5 (ảnh hưởng toàn app, chưa làm).
4. Quyết định tách `CHEMAI_RELEASE` khỏi `APP_VERSION` hay giữ (RELEASE_REPORT §2) trước khi nâng 7.0.0.

## Tiếp tục chính xác từ đâu

Đọc `RELEASE_REPORT.md`. Nếu chủ sở hữu duyệt phát hành: làm §3 “Kế hoạch phát hành”. Lệnh kiểm: `npm run check`, `npx vite build`, `node scripts/dlab-e2e.mjs` (+ `CHEMLAB_BROWSER=firefox|webkit`, chạy tuần tự), `npm run check:browser`, `node scripts/dlab-visual-audit.mjs <nhãn>`, `node scripts/dlab-perf-audit.mjs`.
