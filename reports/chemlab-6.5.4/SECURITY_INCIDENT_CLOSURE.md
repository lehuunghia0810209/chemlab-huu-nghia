# ChemLab 6.5.4 — Security Incident Closure

Ngày: 2026-11-13. Project Cloudflare Pages `chemlab-edulab`. Mọi kiểm tra chỉ dùng GET (và POST bị cổng từ chối trên 6.5.4); **không thực hiện AI inference**, không đọc/hiển thị giá trị secret.

## Kết luận (cập nhật 2026-11-13, đợt xác minh cuối)

**SECURITY BLOCKER (B1): CLOSED.** Không còn URL nào cho người ẩn danh dùng AI. Bằng chứng thực tế ở mục 8.

| Nhóm | Số | Trạng thái |
|---|---|---|
| Production cũ có `GEMINI_API_KEY` thật (Gemini mở) | 3 | **Đóng** — đã xóa (API: không còn tồn tại) |
| Production cũ mở Workers AI | 1 | **Đóng** — đã xóa |
| Preview cũ mở Workers AI, không alias | 3 | **Đóng** — đã xóa |
| Preview cũ mở Workers AI, mới nhất có alias của nhánh | 4 | **Đóng** — Cloudflare Access chặn trước Pages Functions (URL hash và alias) |
| Thu hồi Gemini key cũ | — | **Đóng theo xác nhận của chủ dự án.** Tôi không kiểm chứng độc lập được (không có quyền vào Google AI Studio, không dùng key để thử). Kể cả nếu key còn hiệu lực, không còn deployment nào đọc được nó: Production chỉ có tên sai `" GEMINI_API_KEY"` |

Còn một kiểm tra chức năng (không phải blocker bảo mật): Preview 6.5.4 với người đã đăng nhập Access. **PARTIAL**, xem mục 8.4.

## 1. Kiểm kê (trước khi xóa: 23 deployment)

Đọc qua Cloudflare API (`GET …/pages/projects/chemlab-edulab/deployments`), trạng thái AI lấy từ `GET /api/chat` của từng URL.

| Deployment | Môi trường | Nhánh / commit | Alias | Biến (chỉ tên) | `/api/chat` | Xử lý |
|---|---|---|---|---|---|---|
| `8583adb3-1096-4046-bbb2-1aeed6a828ad` | production | main `2ce2914` | — | `GEMINI_API_KEY` | OPEN Gemini, 6.5.0 | Đã xóa |
| `69508b59-d3ec-47aa-a3f1-ab11e6772b2e` | production | main `e8e204b` | — | `GEMINI_API_KEY` | OPEN Gemini, 6.2.0 | Đã xóa |
| `c2ddfea7-1c5c-420d-855c-2ddb2ed7aebe` | production | main `d06c3dd` | — | `GEMINI_API_KEY` | OPEN Gemini, 6.2.0 | Đã xóa |
| `7cad8281-8225-46da-a848-d35554e73f92` | production | main `35f0912` | — | `" GEMINI_API_KEY"`, `CHEMAI_PROVIDER`, `CHEMAI_DAILY_NEURONS` | OPEN Workers AI, 6.5.0 | Đã xóa |
| `69364d09-13f4-4cec-b0d4-9e26b31a6d44` | preview | evolution/next `8a2dd5a` | — | `CHEMAI_BUDGET_SCOPE`, `CHEMAI_DAILY_NEURONS` | OPEN Workers AI, 6.5.0 | Đã xóa |
| `fff5e414-3d84-4db6-b4ca-c42a289554a0` | preview | evolution/next `2fe6d02` | — | như trên | OPEN Workers AI, 6.5.0 | Đã xóa |
| `a8988d59-6446-4afd-8fcb-6a83ef71880b` | preview | evolution/next `da86e38` | — | như trên | OPEN Workers AI, 6.5.0 | Đã xóa |
| `35e7164b…` | preview | rc/chemlab-6.5.3-codex `ff13762` | `rc-chemlab-6-5-3-codex` (mới nhất của nhánh) | như trên | OPEN Workers AI, 6.5.3 | **Còn mở** |
| `f5ae151a…` | preview | hotfix/chemlab-6.5.2-chemai `cb14d83` | `hotfix-chemlab-6-5-2-chemai` (mới nhất) | như trên | OPEN Workers AI, 6.5.2 | **Còn mở** |
| `1f97dde4…` | preview | release/chemlab-6.5.1 `ede2dac` | `release-chemlab-6-5-1` (mới nhất) | như trên | OPEN Workers AI, 6.5.1 | **Còn mở** |
| `1ea5c4a4…` | preview | evolution/next `c798a1d` | `evolution-next` (mới nhất) | như trên | OPEN Workers AI, 6.5.0 | **Còn mở** |

URL của mỗi deployment: `https://<8 ký tự đầu>.chemlab-edulab.pages.dev`; alias: `https://<alias>.chemlab-edulab.pages.dev`.

Được bảo vệ, không đụng tới: `a522519a` (Production hiện tại, canonical, 6.5.3), `4aa0dc00` (rollback 6.5.2). Các deployment khác còn lại đều `not-configured` hoặc LOCKED (6.5.4): `ff960100`, `0e870491`, `bc778d74`, `7c02268c`, `c37463e5`, `9351ade6`, `7c0b46d1`, `057abe5b` (404), `b34ab928`, `adf82fdf`.

## 2. Xóa deployment (chủ dự án phê duyệt 2026-11-13: "Phê duyệt xóa 7")

Script có chốt chặn: allowlist 7 ID; mỗi ID phải khớp đúng 1 deployment, đúng môi trường và commit; từ chối nếu có alias (không dùng `force`); từ chối cứng `a522519a`, `4aa0dc00` và canonical; kiểm tra canonical vẫn là `a522519a` trước khi xóa. Chạy dry-run trước, sau đó:

```
DELETE …/deployments/{id}   (không có ?force)
69364d09 … 7cad8281 … 8583adb3 … 69508b59 … c2ddfea7 … fff5e414 … a8988d59 → HTTP 200, success true (7/7)
```

## 3. Xác minh sau khi xóa

- Kiểm kê lại qua API: còn 16 deployment, không còn 7 ID trên; canonical vẫn `a522519a`.
- `GET https://<id>.chemlab-edulab.pages.dev/` và `/api/chat` cho 7 ID: **404 / 404** cả 7.
- Không còn deployment nào có `GEMINI_API_KEY` đúng tên. Production hiện tại vẫn chỉ có `" GEMINI_API_KEY"` (sai tên, code không đọc) → `configured:false`.

## 4. 4 deployment có alias — vì sao chưa xóa

Tài liệu Cloudflare (preview-deployments): "The latest deployment for a branch cannot be deleted." Tham số API `force` là "Allow deletion when a non-production deployment has an active alias" — **bị cấm trong nhiệm vụ này**, nên không dùng.

Cách xử lý hợp lệ, không force:

1. **(Chủ dự án đã chọn) Bật Access policy cho Preview.** Dashboard → Workers & Pages → `chemlab-edulab` → Settings → General → **Enable access policy**. Theo tài liệu, policy bảo vệ các URL preview (`*.chemlab-edulab.pages.dev`), không bảo vệ `chemlab-edulab.pages.dev` (Production). Điều kiện: phải bật Cloudflare Zero Trust trước. Onboarding yêu cầu chọn gói và nhập thông tin thanh toán, kể cả gói Free (không bị tính phí). Hiện API trả `Access is not enabled`, và token wrangler không có quyền Zero Trust, nên bước này chỉ chủ dự án làm được.
2. Push một commit mới lên từng nhánh để alias chuyển sang bản mới, rồi xóa bản cũ. Không chọn, vì phải sửa 4 nhánh khác, trong đó `evolution/next` là nhánh đang làm việc.

Sau khi bật Access cần xác minh: 4 alias và 4 URL hash phải chuyển hướng tới trang đăng nhập `*.cloudflareaccess.com`, không trả JSON từ `/api/chat`. Tài liệu không nêu rõ alias nhánh có được wildcard bao phủ hay không, nên phải kiểm tra thực tế.

Hệ quả: Preview 6.5.4 (`feature-chemlab-6-5-4-chemai…`) cũng sẽ yêu cầu đăng nhập Access. Điều này phù hợp với cổng `internal_testing` sau này.

Giới hạn rủi ro trong lúc chờ: 4 deployment này dùng ngân sách Workers AI chung `CHEMAI_BUDGET` (Durable Object, `CHEMAI_DAILY_NEURONS`) có rate limit theo IP, nên chi phí bị chặn trần theo ngày. Rủi ro vẫn là học sinh/người lạ dùng AI chưa kiểm định.

## 5. Thu hồi Gemini API key (chủ dự án thực hiện)

Không thể so sánh giá trị các key (không đọc secret), nên coi **mọi key** từng được đặt cho ChemLab là cần thu hồi:

1. Mở Google AI Studio → **API keys** (hoặc Google Cloud Console → APIs & Services → Credentials của project chứa key).
2. Với từng key dùng cho ChemLab: tạo key mới nếu cần, sau đó **Delete** key cũ. Không cần cập nhật Cloudflare: Production 6.5.3 không dùng key (tên biến sai, `configured:false`), nên thu hồi không ảnh hưởng chức năng.
3. Kiểm tra trang Usage/Quota của project Gemini trong 30 ngày gần nhất xem có lưu lượng bất thường không.
4. Không dán key mới vào chat, báo cáo hay repo. Chỉ đặt bằng `wrangler pages secret put GEMINI_API_KEY` khi có release gate riêng.

Tình trạng hiện tại: cả 3 deployment có key thật đã bị xóa, nên key không còn bị gọi được qua ChemLab. Chủ dự án đã thu hồi các key cũ (xác nhận ngày 2026-11-13). Kho mã: không có key thật trong `.dev.vars.example` hay lịch sử Git (quét mẫu `AIza…`); không có `.dev.vars`/`.env` local.

## 6. Production 6.5.3 và Preview 6.5.4 vẫn hoạt động

| Kiểm tra | Kết quả |
|---|---|
| Production `https://chemlab-edulab.pages.dev`: `/`, manifest, `sw.js`, `/api/chat` | 200; release 6.5.3; SW `chemlab-6.5.3-brand-1`; `configured:false` |
| `staging-smoke.mjs` của 6.5.3 (worktree `ff13762`) → Production | PASS 12/12 |
| `staging-smoke.mjs` của 6.5.4 → Production | 9/12 — 3 FAIL chỉ vì script kỳ vọng phiên bản 6.5.4 (đúng như mong đợi) |
| Access check 19 request → Preview 6.5.4 alias | PASS 19/19 (ẩn danh, giả header/cookie/query, POST chéo nguồn đều 403) |
| `staging-smoke.mjs` 6.5.4 → Preview 6.5.4 | PASS 12/12 |

## 7. Chưa làm / không làm

- Không force-delete; không xóa `a522519a`, `4aa0dc00`.
- Không đổi secret/binding; không merge `main`; không deploy Production 6.5.4; không bật Gemini.
- Chủ dự án tự bật Access và thu hồi key; tôi không thay đổi cấu hình Access.

## 8. Đợt xác minh cuối (sau khi chủ dự án thu hồi key và bật Access)

Mọi request đều là GET ẩn danh, không theo redirect. Không có POST nào được gửi tới deployment cũ.

### 8.1 Bốn deployment Workers AI còn lại

| URL | `/` | `/api/chat` |
|---|---|---|
| `35e7164b.…` / `rc-chemlab-6-5-3-codex.…` | 302 | 302 |
| `f5ae151a.…` / `hotfix-chemlab-6-5-2-chemai.…` | 302 | 302 |
| `1f97dde4.…` / `release-chemlab-6-5-1.…` | 302 | 302 |
| `1ea5c4a4.…` / `evolution-next.…` | 302 | 302 |

Mọi 302 đều chuyển tới `https://chemlab-edulab-pages.cloudflareaccess.com/cdn-cgi/access/login/<host>`. Thân phản hồi là trang "302 Found" chung, **không có JSON**, nên `/api/chat` không còn tiết lộ `configured`/`provider`/`release`.

**Bị chặn trước Pages Functions:**

- Phản hồi 302 không có `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` mà `_headers` của ChemLab luôn đặt. Nó chỉ có `Server: cloudflare` và cookie `CF_AppSession` của Access.
- Kiểm tra bằng log Functions. Mở `wrangler pages deployment tail` đồng thời trên `a522519a` (đối chứng), `35e7164b` và `1ea5c4a4`. Gửi 3 × GET `/api/chat` tới Production và 3 × tới mỗi URL hash và alias của hai deployment kia:

| Tail | GET đã gửi | Sự kiện Functions |
|---|---|---|
| `a522519a` (đối chứng, Production) | 3 → 200 | **3** (`https://chemlab-edulab.pages.dev/api/chat`) |
| `35e7164b` | 6 → 302 | **0** |
| `1ea5c4a4` | 6 → 302 | **0** |

Tail ghi được sự kiện ở đối chứng nhưng 0 ở deployment bị chặn. Vậy request ẩn danh không tới được Pages Functions, nên không thể gọi Workers AI.

### 8.2 Bảy deployment đã xóa

- Cloudflare API: cả 7 ID không có trong danh sách deployment (16 còn lại), và `GET …/deployments/<id>` trả `success:false`.
- Truy cập ẩn danh trước khi bật Access: 404 cho cả `/` và `/api/chat` (mục 3).
- Sau khi bật Access: trả 302 về trang đăng nhập Access, vì Access chạy trước Pages ở biên. Không còn quan sát được 404 khi ẩn danh, nhưng việc deployment không tồn tại đã được xác nhận qua API.

### 8.3 Production 6.5.3: không đòi đăng nhập

| Kiểm tra | Kết quả |
|---|---|
| `https://chemlab-edulab.pages.dev/` | 200, không redirect, có CSP / `nosniff` / `X-Frame-Options: DENY` |
| `/api/chat` | 200 `{"configured":false,"provider":null,"release":"6.5.3"}` — trạng thái của 6.5.3, không có AI hoạt động; 6.5.4 sẽ trả `access:false` |
| `staging-smoke.mjs` của 6.5.3 (worktree `ff13762`) | PASS 12/12 |
| Canonical (API) | `a522519a` không đổi |

Lưu ý: Access policy bao phủ wildcard `*.chemlab-edulab.pages.dev`, nên URL hash của deployment Production (`a522519a.…`, `4aa0dc00.…`) cũng đòi đăng nhập. Chỉ tên miền chính `chemlab-edulab.pages.dev` là công khai. Rollback qua Dashboard không bị ảnh hưởng.

### 8.4 Preview 6.5.4: PARTIAL

- Ẩn danh: `feature-chemlab-6-5-4-chemai.…` và `ff960100.…` → 302 tới Access (đúng mong đợi).
- Deployment `ff960100` (commit `a919b4c`): `latest_stage` = success (API).
- Trước khi bật Access đã xác minh: kiểm tra truy cập 19/19, `staging-smoke` 12/12, `preview-locked-check` 28/28 trên Chromium, Firefox và WebKit (mục 6, file 06).
- **Chưa kiểm chứng** việc người đã đăng nhập Access dùng được trang. Tôi không có danh tính Access, và extension Chrome không kết nối. Chủ dự án kiểm tra tay:
  1. Mở `https://feature-chemlab-6-5-4-chemai.chemlab-edulab.pages.dev`, đăng nhập Access.
  2. Trang chủ hiện ChemLab 6.5.4. Công cụ tính, cân bằng phương trình và bài học mở được.
  3. Mở ChemAI: badge "Chưa mở", có thông báo khóa, không có ô nhập. ChemAI vẫn khóa với mọi người vì Preview không đặt `CHEMAI_ACCESS_MODE` — đúng thiết kế.
  4. Mở `/api/chat`: `{"ok":true,…,"access":false,"configured":false,"release":"6.5.4"}`.

## 9. Ghi chú cho giai đoạn sau

- Team domain Access: `https://chemlab-edulab-pages.cloudflareaccess.com` (khớp với `TEAM_DOMAIN` mà `_access.js` chấp nhận). Khi mở `internal_testing` cần thêm AUD của ứng dụng Access tương ứng. Hiện chưa đặt, nên ChemAI vẫn fail-closed.
- Các script kiểm tra Preview ẩn danh (`preview-locked-check`, `staging-smoke`, `previewcheck`) giờ sẽ dừng ở trang đăng nhập Access. Để tự động hóa cần một Access service token. Chưa tạo token này; nếu cần thì chủ dự án quyết định.
