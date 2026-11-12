# 07 — Deployment readiness

## Git

- Nhánh `feature/chemlab-6.5.4-chemai-access` (đã push), base `ff13762`.
- Commits: `c71393b` cổng quyền → `e71c522` báo cáo Preview → `2e12406` Gemini là provider duy nhất → `b3b8ea8` trạng thái "đã đăng nhập chưa duyệt" + test lỗi provider (+ commit báo cáo 06–08).
- Không merge vào `main`, không force-push, không đổi worktree khác.

## Preview

- Deployment `0e870491-51e8-42e7-a3b8-f4edc8cd10cf` (commit `b3b8ea8`), alias https://feature-chemlab-6-5-4-chemai.chemlab-edulab.pages.dev.
- ChemAI khóa (môi trường Preview không có `CHEMAI_ACCESS_MODE`, không có `GEMINI_API_KEY`); mọi kiểm tra Preview PASS (xem 06).

## Cloudflare (đọc qua API, không thay đổi)

- Project `chemlab-edulab`, production branch `main`, preview cho mọi nhánh, không có GitHub workflow.
- Production hiện tại: `a522519a` (6.5.3, `ff13762`), biến: `" GEMINI_API_KEY"` (sai tên), `CHEMAI_PROVIDER`, `CHEMAI_DAILY_NEURONS`, binding `AI`, `CHEMAI_BUDGET`.
- Preview: `CHEMAI_BUDGET_SCOPE`, `CHEMAI_DAILY_NEURONS`, binding `AI`, `CHEMAI_BUDGET`.
- Cloudflare Access: chưa bật trên account.

Nếu 6.5.4 lên Production với cấu hình hiện tại: `CHEMAI_ACCESS_MODE` không đặt → khóa; key sai tên → không cấu hình. Hai lớp đều fail-closed.

## Giới hạn live API

Không gọi Gemini thật. Để thử nội bộ cần đủ tất cả các điều kiện sau, và chủ dự án phê duyệt từng bước:
1. Xác nhận điều khoản Google cho phép kiểm thử nội bộ với người lớn (điều khoản cấm dịch vụ "likely to be accessed by individuals under the age of 18").
2. Bật Cloudflare Access, tạo ứng dụng Access cho một host Preview riêng; đặt `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`, `CHEMAI_INTERNAL_HOSTS`, `CHEMAI_ACCESS_MODE=internal_testing` cho Preview.
3. Secret `GEMINI_API_KEY` đúng tên cho Preview; `CHEMAI_DAILY_LIMIT_CHAT=1`.
4. Xử lý vị trí: Function ở HKG bị Google từ chối; có thể cần relay vùng cố định (thiết kế sẵn ở worktree `chemlab-gemini`).
5. Chạy `scripts/chemai-eval.mjs <preview> --confirm --max-calls 1`.

## Deployment blockers

| # | Blocker | Loại | Ai xử lý |
|---|---|---|---|
| B1 | **Deployment cũ còn mở AI không xác thực**: 8 deployment Workers AI (7 Preview + Production `7cad8281`) và 3 deployment Production cũ (`8583adb3`, `69508b59`, `c2ddfea7`) có `GEMINI_API_KEY` thật được chụp lại. Không phụ thuộc vào 6.5.4, và đổi biến môi trường hiện tại không đóng được | Bảo mật / tuân thủ | Chủ dự án: rotate Gemini key; xóa hoặc bảo vệ các deployment đó (xem 03) |
| B2 | Điều khoản Gemini (dưới 18 tuổi, "not for consumer use") | Tuân thủ | Chủ dự án / pháp lý |
| B3 | Cloudflare Access chưa bật | Hạ tầng | Chủ dự án |
| B4 | Vị trí HKG bị Google từ chối | Hạ tầng | Chủ dự án quyết định relay |
| B5 | Secret sai tên trên Production | Cấu hình | Chủ dự án (chỉ khi quyết định bật) |

B2–B5 chỉ chặn việc **bật Gemini thật**. B1 là rủi ro hiện hữu nên xử lý ngay, độc lập với việc phát hành 6.5.4.

## Phát hành 6.5.4 với Gemini khóa

Về kỹ thuật đã sẵn sàng để chủ dự án review: access control đã kiểm chứng, không có request tới provider khi khóa, regression toàn bộ PASS, PWA upgrade PASS, Preview đã xác minh. Cần phê duyệt riêng để merge `main`.

## Rollback

- Production hiện tại / mục tiêu rollback: `a522519a` (6.5.3, `ff13762`). Rollback trước đó: `4aa0dc00` (6.5.2).
- Cách làm: Cloudflare Dashboard → chemlab-edulab → Deployments → `a522519a` → "Rollback to this deployment", hoặc revert merge trên `main` rồi push.
- PWA: 6.5.4 dùng cache `chemlab-6.5.4-access-1`; rollback về 6.5.3 dùng lại `chemlab-6.5.3-brand-1`. Journey PWA upgrade/rollback và dữ liệu học tập giữ nguyên đều PASS.
- Không xóa deployment rollback.
