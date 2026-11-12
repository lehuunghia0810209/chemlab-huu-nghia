# ChemLab 6.5.4 — Kiểm định bảo mật & Preview

Ngày: 2026-11-12. Không gọi Gemini/Workers AI thật. Không thay đổi secret, binding hay Production.

## Định danh

| Mục | Giá trị |
|---|---|
| Commit được kiểm định | `c71393b` (nhánh `feature/chemlab-6.5.4-chemai-access`, cha `ff13762`) |
| Preview deployment ID | `7c02268c-6f68-4d09-8cc3-896df41aa4f5` (environment `preview`, trạng thái deploy `success`) |
| Preview URL | https://7c02268c.chemlab-edulab.pages.dev · alias nhánh https://feature-chemlab-6-5-4-chemai.chemlab-edulab.pages.dev |
| Production sau khi push | Vẫn là `a522519a` (`ff13762`, 6.5.3); `GET /api/chat` trên Production vẫn báo `release 6.5.3` |

Commit tiếp theo trên nhánh chỉ thêm báo cáo này và `scripts/preview-locked-check.mjs` (script kiểm tra chỉ đọc); không đổi mã chạy.

## Cấu hình Cloudflare (đọc qua API, không in giá trị)

- Project `chemlab-edulab`, nguồn GitHub `chemlab-huu-nghia`; **production branch `main`**; preview cho mọi nhánh (`*`). Không có GitHub workflow trong repo. → Push nhánh feature chỉ tạo Preview (đã xác nhận bằng deployment `environment: preview`).
- Preview env: binding `AI`, Durable Object `CHEMAI_BUDGET`, biến `CHEMAI_BUDGET_SCOPE`, `CHEMAI_DAILY_NEURONS`. Không có `CHEMAI_ACCESS_MODE` → 6.5.4 khóa.
- Production env: `" GEMINI_API_KEY"` (tên có dấu cách), `CHEMAI_PROVIDER` (secret), `CHEMAI_DAILY_NEURONS`, binding `AI`, `CHEMAI_BUDGET`. Không đổi.
- **Cloudflare Access chưa được bật trên account** (API: `access.api.error.not_enabled`) → `approved_users`/`internal_testing` hiện không thể cấp quyền cho ai.

## Kiểm thử access control

| Phạm vi | Kết quả |
|---|---|
| Node (`scripts/test-chemai-access.mjs`, chữ ký RS256 thật, JWKS mock): không JWT, hết hạn, sai chữ ký, ký bằng khóa khác, sai `aud`, sai `iss`, `nbf` tương lai, `kid` lạ, thiếu email, email ngoài allowlist, `alg:none`, header/cookie/query giả, thiếu/sai cấu hình, JWKS lỗi, host Production, host Preview công khai, `student_access`, Gemini ngoài internal_testing; request bị từ chối không đọc body | **PASS** 14/14 |
| workerd local (`scripts/local-cloudflare-check.mjs`) | **PASS** 12/12 staging + 10/10 cổng |
| Preview thật (19 request): GET chat/feedback không lộ provider/model; POST chat + feedback với không JWT, JWT hết hạn, sai chữ ký, sai aud, thiếu email, `alg:none`, header/cookie giả, query giả → 403 `AI_ACCESS_LOCKED`; cross-origin → 403 | **PASS** 19/19 trên cả alias nhánh và URL deployment |
| Log Preview (`wrangler pages deployment tail`, chỉ đọc) | 10/21 request được tail ghi lại (tail chỉ lấy mẫu): mọi POST dừng tại `chemai.access` `reason: MODE_DISABLED`, 1–6 ms, không có sự kiện `chemai.chat` → không có lệnh gọi provider. 11 request còn lại không có log; kết luận "không gọi Google" cho các request đó dựa trên code + test |
| Mã: cổng chạy trước sameOrigin/rate limit/body/budget/provider; `student_access` từ chối cứng | Review diff `ff13762..c71393b` |

JWT trên Preview là token giả, không ký bằng khóa Access thật (Access chưa bật); đường xác minh chữ ký với team thật **NOT RUN**.

## Regression trình duyệt (local, bản build của `c71393b`)

| Bộ | Kết quả |
|---|---|
| `browser-smoke.mjs` Chromium (42 suite: layout, tools, lab, learning, practice, exam, CSP, PWA upgrade/offline/persistence, ChemAI) | **PASS** 418/418 |
| Firefox | **PASS** 418/418 |
| WebKit | **PASS** 418/418 |
| `a11y-audit.mjs` (axe WCAG A/AA + keyboard focus) | **PASS** |
| `npm run check` (chem 49, learning 242, questions 783, exam 84, papers 850, UI 76, AI) | **PASS** |
| `npm audit` | 0 lỗ hổng |
| Build tái lập: 2 lần build local | 304/304 file giống hệt |
| Build kiểu Cloudflare (Node 22.16.0/npm 10.9.2, `git archive` LF) | 302/304 giống hệt; `_headers`, `robots.txt` chỉ khác CRLF của worktree Windows (nội dung trùng) |

## Kiểm tra Preview trên trình duyệt (`scripts/preview-locked-check.mjs`)

Mọi request không phải GET tới `/api/*` bị chặn và đếm. 1440 px và 390 px.

| | Chromium | Firefox | WebKit |
|---|---|---|---|
| 28 kiểm tra: ChemAI hiện, thông báo khóa đúng, không ô nhập/nút gửi hoạt động, không lộ provider/model, không tràn ngang, máy tính khối lượng mol, cân bằng PT ion, các route Periodic/Lab/Learning, danh mục đề thi + trang bắt đầu, SW active với cache `chemlab-6.5.4-access-1`, CSP, 0 POST `/api/*`, console sạch | **PASS** 28/28 | **PASS** 28/28 | **PASS** 28/28 |

`staging-smoke.mjs` trên Preview: **PASS** 12/12 (CSP, X-Frame-Options, SW 6.5.4, manifest, cache bất biến, no-store, release 6.5.4, cross-origin 403).

Lần chạy đầu của script: FAIL 2/28 ở mỗi trình duyệt do script dùng sai route `#exam` (Exam nằm ở `#learning/exam`). Đã sửa script, không đổi ứng dụng.

## Rủi ro còn tồn đọng

1. **BLOCKER (có sẵn từ trước, ngoài mã 6.5.4):** các deployment Preview cũ vẫn mở ChemAI công khai qua Workers AI vì môi trường Preview có binding `AI` + `CHEMAI_BUDGET`. Đã xác nhận bằng `GET /api/chat` (không gửi câu hỏi): `rc-chemlab-6-5-3-codex`, `evolution-next`, `release-chemlab-6-5-1`.chemlab-edulab.pages.dev đều báo `configured:true`, provider Workers AI. Ai có URL, kể cả học sinh, có thể dùng. Cách đóng (chủ dự án, trên Dashboard): gỡ binding `AI` khỏi môi trường Preview, hoặc xóa các deployment/nhánh Preview cũ. Tôi không thay đổi binding theo yêu cầu.
2. Cloudflare Access chưa bật: không ai được cấp quyền (đúng ý đồ khóa), nhưng xác minh với Access thật chưa làm được.
3. Điều khoản Gemini (bản 23/03/2026) không cho phép dịch vụ có khả năng được người dưới 18 tuổi truy cập; ChemAI không được mở cho học sinh qua Gemini.
4. `" GEMINI_API_KEY"` trên Production còn sai tên; không ảnh hưởng vì cổng khóa.
5. Đổi tên cache SW → PWA đã cài tải shell mới khi Production lên 6.5.4 (đã có journey PWA upgrade PASS trên 3 trình duyệt).

## Kết luận

**CONDITIONAL — BLOCKERS REMAIN**

Bản 6.5.4 (`c71393b`, Preview `7c02268c`) đạt mọi kiểm định: không tìm thấy đường vòng nào trong mã 6.5.4; ChemAI khóa, không lộ cấu hình; các chức năng Hóa học không hồi quy. Blocker còn lại là đường mở AI có sẵn từ trước trên các Preview cũ (mục 1). Chủ dự án cần đóng nó trước khi xem xét Production. Không triển khai Production. ChemAI chưa mở cho học sinh.
