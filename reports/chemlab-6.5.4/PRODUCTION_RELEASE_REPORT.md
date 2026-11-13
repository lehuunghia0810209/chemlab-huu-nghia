# CHEMLAB 6.5.4 — PRODUCTION RELEASE REPORT

Ngày 2026-11-13. Phát hành theo ủy quyền của chủ dự án ("FULL RELEASE AUTHORIZATION"), ChemAI khóa mặc định.

## Kết luận: **SUCCESS**

## Release

| | |
|---|---|
| Git release SHA | `873417b242b4eb5edc4826c58a223ddfcf573ed1` (`origin/main`), fast-forward `ff13762..873417b`, không force |
| Production deployment | `afea91b9-7c24-4bcd-b82c-deb533e8b93c` — canonical, commit `873417b` |
| URL | https://chemlab-edulab.pages.dev (deployment URL `https://afea91b9.chemlab-edulab.pages.dev`, sau Access) |
| Build | Cloudflare Pages: queued → clone → build → deploy **success**, khoảng 1 phút. Preview cùng commit: `429eb47f`, success |
| Production trước đó | `a522519a` (6.5.3, `ff13762`) |

## Điều kiện trước deploy (đều PASS)

- Release SHA bằng HEAD, working tree sạch; `origin/main` = `ff13762`, không có commit lạ; fast-forward hợp lệ.
- Không có secret trong khoảng release; chỉ có một lần nhắc tên mẫu `oauth_token` trong báo cáo.
- Security blocker CLOSED; Access vẫn chặn các Preview (302 → `chemlab-edulab-pages.cloudflareaccess.com`).
- Gemini khóa: Production không có `CHEMAI_ACCESS_MODE` và không có `GEMINI_API_KEY` đúng tên.
- Gate chạy hôm nay trên mã giống hệt: `npm run check` PASS, build PASS, quét secret `dist/` 0, smoke Chromium 420/420. Firefox/WebKit 420/420, a11y, PWA dùng lại kết quả của `b3b8ea8`.
- Rollback `a522519a`, `4aa0dc00` còn và ở trạng thái success.

## Kiểm định sau deploy (chạy trên Production thật)

| Kiểm tra | Kết quả |
|---|---|
| `/` HTTP 200, không yêu cầu Access | PASS |
| Phiên bản hiển thị: title, footer "Edition • 6.5.4", manifest | PASS — 6.5.4 |
| `GET /api/chat` | PASS — `{"ok":true,"service":"ChemAI","release":"6.5.4","access":false,"configured":false}`, không lộ provider/model |
| `GET /api/feedback` | PASS — `enabled:false` |
| `POST /api/chat`, `POST /api/feedback` (cùng nguồn) | PASS — 403 `AI_ACCESS_LOCKED` + thông báo khóa |
| POST giả danh tính (`Cf-Access-Authenticated-User-Email`, JWT `alg:none`, cookie `CF_Authorization`, query `?access=1&mode=internal_testing`) | PASS — 403 |
| POST khác nguồn | PASS — 403 |
| `staging-smoke.mjs` | PASS 12/12 |
| `preview-locked-check.mjs` (1440 + 390 px): ChemAI khóa đúng vị trí và đúng thông báo, không có ô nhập; công cụ tính CuSO₄·5H₂O; cân bằng Fe²⁺/MnO₄⁻ 5:1:8:5:1:4; route bảng tuần hoàn/Lab/Learning; mở đề Exam; SW + cache 6.5.4; CSP; console sạch; 0 request non-GET `/api` | PASS 28/28 × Chromium, Firefox, WebKit |
| Journey Production: dữ liệu học tập và phiên ChemAI có sẵn giữ nguyên sau khi SW 6.5.4 cài + 2 lần tải lại; chỉ còn cache `chemlab-6.5.4-access-1`; Practice lưu câu trả lời qua reload; Virtual Lab HCl 0,1 M 25 mL → pH 1,0, + NaOH → 7,0; Learning hiện danh sách bài; console sạch; 0 request non-GET `/api` | PASS 7/7 × Chromium, Firefox, WebKit |
| Log Functions (`wrangler pages deployment tail afea91b9…`, lấy mẫu) | 15 sự kiện: GET chat 8, GET feedback 2, POST chat 3, POST feedback 2; log ChemAI chỉ có `chemai.access MODE_DISABLED 403` × 5; **0** sự kiện `chemai.chat`, `generativelanguage` hay `@cf/` → không có inference Gemini/Workers AI |

## Bảo mật và cấu hình

- Biến/binding Production (chỉ so tên/kiểu) trước và sau phát hành: **không đổi** (`" GEMINI_API_KEY"`, `CHEMAI_DAILY_NEURONS`, `CHEMAI_PROVIDER`; `AI`; `CHEMAI_BUDGET`; compat 2026-10-14).
- Access của Preview không bị ảnh hưởng: `429eb47f`, `feature-chemlab-6-5-4-chemai`, `evolution-next`, `afea91b9` → 302 tới trang đăng nhập Access. Tên miền chính vẫn công khai.
- Không đặt secret, không bật `student_access`, không gọi Gemini.

## PWA

Service worker 6.5.4 hoạt động và điều khiển trang, cache `chemlab-6.5.4-access-1`, không còn cache 6.5.0–6.5.3. Dữ liệu `chemlab-v1-progress` và `chemlab-v62-ai-session` giữ nguyên. Journey upgrade/rollback 6.5.3 ↔ 6.5.4 (local) PASS từ `b3b8ea8`.

## Trạng thái ChemAI

Nút ChemAI vẫn ở vị trí cũ; badge "Chưa mở"; thông báo "ChemAI đang được hoàn thiện và kiểm định. Tính năng hiện chưa được mở cho học sinh."; server từ chối mọi câu hỏi. Gemini đã khôi phục ở mức mã nguồn và mock, **chưa kích hoạt**.

## Rollback

Không cần rollback. Sẵn sàng: Dashboard → `chemlab-edulab` → Deployments → `a522519a` → Rollback to this deployment (6.5.3), hoặc `4aa0dc00` (6.5.2). Không xóa deployment nào.

## Lỗi đã xử lý trong phiên phát hành

Không có lỗi sản phẩm. Lưu ý vận hành: Git Bash đổi `/` trong đối số `curl -w` thành đường dẫn Windows. Đây chỉ là lỗi hiển thị; mã HTTP 200 đúng.

## Rủi ro còn lại

- Kích hoạt Gemini vẫn bị chặn bởi: điều khoản Google (≥ 18 tuổi), vùng HKG/billing, chưa có AUD Access + `internal_testing`, chưa có lần gọi live được phê duyệt.
- `wrangler pages secret put` (v4) không chọn được môi trường và ghi vào Production. Khi cần, đặt secret Preview qua Dashboard.
- Biến cũ `" GEMINI_API_KEY"` (giá trị đã bị thu hồi), `CHEMAI_PROVIDER`, `CHEMAI_DAILY_NEURONS` và binding `AI` không còn được 6.5.4 dùng. Có thể dọn trong một thay đổi cấu hình riêng; không gấp và không bắt buộc.
- Không chạy toàn bộ `browser-smoke` (420) trên Production, theo quy tắc không chạy bộ đó với URL live. Production được kiểm bằng các script chỉ đọc nêu trên.
