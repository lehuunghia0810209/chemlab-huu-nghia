# ChemLab 6.5.4 — Fast release readiness

Ngày 2026-11-13. Nhánh `feature/chemlab-6.5.4-chemai-access`, worktree `D:\EduLab\.worktrees\chemlab-6.5.4`.

## Kết luận

**GO** — phát hành ChemLab 6.5.4 với ChemAI **khóa mặc định**, sau khi chủ dự án phê duyệt riêng lệnh push lên `main`.
**NO-GO** — bật Gemini thật (xem "Điều kiện còn chặn Gemini").

## 1. Release SHA và fast-forward

- Release = **đầu nhánh `feature/chemlab-6.5.4-chemai-access`**, là commit chứa báo cáo này (`docs(chemlab): 6.5.4 security closure and fast release readiness`). SHA chính xác lấy bằng `git rev-parse feature/chemlab-6.5.4-chemai-access`.
- Mã chạy được giống hệt commit đã chạy đủ ma trận `b3b8ea8`: `git diff b3b8ea8 <release> -- . ':!reports'` rỗng. Từ `b3b8ea8` trở đi chỉ thêm báo cáo.
- `origin/main` = `ff13762` (6.5.3), là tổ tiên trực tiếp → **fast-forward được** (`ff13762` + 6 commit).
- So với 6.5.3, phần ngoài ChemAI chỉ đổi số phiên bản: `index.html`, `package*.json`, `manifest`, `sw.js`, `appMeta.js`; thêm `.dev.vars.example`. Learning, Practice, Exam và Virtual Lab không đổi.

Lệnh phát hành (chỉ chạy khi chủ dự án phê duyệt; push không force sẽ bị từ chối nếu không fast-forward được):

```sh
cd D:\EduLab\.worktrees\chemlab-6.5.4
git fetch origin
git merge-base --is-ancestor origin/main feature/chemlab-6.5.4-chemai-access && echo FF-OK
git push origin feature/chemlab-6.5.4-chemai-access:main
```

Push lên `main` sẽ tự động deploy Production (production branch = `main`, không có GitHub workflow).

## 2. Security blocker

**Đã đóng** — `SECURITY_INCIDENT_CLOSURE.md`:
- Đã xóa 7 deployment.
- 4 Preview có alias đi sau Cloudflare Access; log tail cho thấy 0 lần gọi Functions, trong khi đối chứng ghi 3.
- Chủ dự án đã thu hồi Gemini key cũ.
- Chủ dự án kiểm tra tay Preview 6.5.4 sau khi đăng nhập Access: 5/5 PASS.

## 3. Release gates

| Gate | Trạng thái | Nguồn |
|---|---|---|
| `npm run check` (project, chem 49, learning 242, questions 783, exam 84, papers 850, UI 76, access 15, Gemini API mock, feedback 20, markdown 11, eval 9, guard 23) | **PASS — chạy lại hôm nay** | 0 FAIL |
| `npm run build` | **PASS — chạy lại hôm nay** | SW `chemlab-6.5.4-access-1`, manifest 6.5.4 |
| Quét secret trong `dist/` (`AIza…`, `GEMINI_API_KEY`, `x-goog-api-key`, `generativelanguage`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`, `oauth_token`, `@cf/`) | **PASS — chạy lại hôm nay** | 0 file khớp |
| Workers AI trong runtime (`functions`, `src`) | **PASS — chạy lại hôm nay** | Không còn `env.AI`, `@cf/`, `_workersAI` |
| Browser smoke Chromium (42 suite) | **PASS 420/420 — chạy lại hôm nay** | build mới |
| Browser smoke Firefox / WebKit 420/420, a11y, PWA upgrade/rollback, reproducible build, `npm audit` 0 | **PASS — dùng lại bằng chứng** của `b3b8ea8` (file `gemini-restoration/06_TEST_RESULTS.md`) | mã không đổi |
| Preview locked 28/28 × 3 engine, staging 12/12, access 19/19 | **PASS — dùng lại bằng chứng** của Preview `0e870491`/`ff960100` trước khi bật Access | mã không đổi |
| Production hiện tại | **PASS** | canonical `a522519a` = `ff13762`, success; rollback `4aa0dc00` (`d6fcffc`) còn, success |

## 4. Gemini — sẵn sàng kỹ thuật

| Mục | Trạng thái (code + mock) |
|---|---|
| Endpoint | `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`, key trong header `x-goog-api-key` (không ở URL) |
| Model | `gemini-3.8-flash`, fallback `gemini-3.6-flash`; model ngoài allowlist → 503 `AI_MODEL_NOT_ALLOWED` |
| Secret | Chỉ đọc `env.GEMINI_API_KEY`; tên sai `" GEMINI_API_KEY"` bị bỏ qua (fail-closed, có cảnh báo tên) |
| Workers AI | Đã gỡ khỏi runtime; `CHEMAI_PROVIDER` khác `gemini` = tắt |
| Timeout / retry | Tổng 52 s; tối đa 4 lần thử (chính, chính, fallback); backoff ≤ 10 s, tôn trọng `Retry-After`; retry với 408/429/5xx/lỗi mạng; 404 → fallback |
| Quota | Durable Object `CHEMAI_BUDGET`: 200 lần gọi/ngày toàn cục (`CHEMAI_DAILY_LIMIT_CHAT`), 40/ngày/client; 6 lần gọi đồng thời; mỗi lần retry đều bị tính; thiếu ngân sách → fail-closed |
| Parse | Bỏ phần `thought`; `SAFETY`/`blockReason` → 422; `MAX_TOKENS` → 502; rỗng, không phải JSON, HTML → 502; `answerGuard` đối chiếu Hóa học |
| Mock lỗi | Thiếu key → 503 `AI_NOT_CONFIGURED`; key không hợp lệ 401/403 → 502 `GEMINI_AUTH_FAILED`; model unavailable 404 → fallback, rồi 502 `GEMINI_MODEL_UNAVAILABLE`; `FAILED_PRECONDITION` (vùng, billing) → 503 — tất cả PASS trong `npm run check` |
| Live Gemini | **NOT RUN** |

## 5. Cấu hình để thử Gemini thật (chỉ nội bộ, người lớn đã xác thực)

Thực hiện trên một Preview riêng, **không** trên Production. Mỗi bước cần chủ dự án phê duyệt.

1. **Key mới**: tạo trong Google AI Studio, trong project có billing nếu cần (free tier bị từ chối ở một số vùng). Không dùng key cũ, không dán key vào chat, file hay log.
   - Đặt key qua **Dashboard**: Workers & Pages → `chemlab-edulab` → Settings → Variables and Secrets → chọn môi trường **Preview** → Add → Type **Secret** → tên chính xác `GEMINI_API_KEY` (không có dấu cách).
   - **Không dùng `wrangler pages secret put`**: wrangler 4 không có cờ chọn môi trường cho lệnh này, nên secret sẽ được ghi vào **Production**.
   - Biến Preview áp dụng cho mọi build Preview về sau, nhưng cổng chỉ mở với host trong `CHEMAI_INTERNAL_HOSTS`. Vì vậy chỉ đặt key sau khi bước 2–3 đã sẵn sàng.
2. **Access**: team domain `https://chemlab-edulab-pages.cloudflareaccess.com`. Lấy AUD của ứng dụng Access cho Preview.
3. **Biến Preview**: `CHEMAI_ACCESS_MODE=internal_testing`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS=<email người lớn được duyệt>`, `CHEMAI_INTERNAL_HOSTS=feature-chemlab-6-5-4-chemai.chemlab-edulab.pages.dev`, `CHEMAI_DAILY_LIMIT_CHAT=1`, `CHEMAI_PROVIDER=gemini` (hoặc để trống).
4. Deploy lại Preview (biến được chụp tại thời điểm deploy). Sau đó gọi một lần duy nhất: `node scripts/chemai-eval.mjs <preview> --confirm --max-calls 1`.

## 6. Điều kiện còn chặn Gemini

1. **Điều khoản Google**: người dùng phải ≥ 18 tuổi; cấm dịch vụ "likely to be accessed by individuals under the age of 18"; "not for consumer use"; tier miễn phí cho phép con người xem dữ liệu. ChemLab phục vụ học sinh → **không bật cho học sinh**. Chỉ được thử nội bộ với người lớn, và cần chủ dự án/pháp lý xác nhận.
2. **Vùng**: Pages Functions chạy ở HKG bị Google từ chối (`FAILED_PRECONDITION`, 6.5.3). Cần chọn: bật billing, hoặc dùng relay vùng cố định (bản thiết kế ở worktree `chemlab-gemini`, chưa merge).
3. Chưa có AUD Access và các biến `internal_testing` trên Preview.
4. Chưa có lần gọi live nào được phê duyệt, chưa có đánh giá chất lượng câu trả lời bởi giáo viên.

## 7. Phát hành 6.5.4 khóa AI

**Được.** Với cấu hình Production hiện tại:
- Không có `CHEMAI_ACCESS_MODE` → `disabled`: mọi POST trả 403 `AI_ACCESS_LOCKED` trước khi đọc body.
- `GEMINI_API_KEY` không tồn tại (chỉ có tên sai, giá trị đã bị thu hồi) → không cấu hình.
- Hai lớp độc lập đều fail-closed.
- Không cần đổi secret hay binding. `AI`, `CHEMAI_BUDGET`, `CHEMAI_PROVIDER` giữ nguyên; code 6.5.4 không dùng `AI`.

Kiểm tra Production sau deploy (ẩn danh, chỉ GET + POST bị khóa):

```sh
cd D:\EduLab\.worktrees\chemlab-6.5.4
curl -s https://chemlab-edulab.pages.dev/api/chat      # access:false, release "6.5.4", không có provider/model
node scripts/staging-smoke.mjs https://chemlab-edulab.pages.dev            # 12/12
CHEMLAB_BROWSER=chromium node scripts/preview-locked-check.mjs https://chemlab-edulab.pages.dev   # và firefox, webkit
```

Thêm vào đó:
- Theo dõi `wrangler pages deployment tail` trong vài phút: chỉ có sự kiện `chemai.access` 403, không có `chemai.chat`.
- Canonical mới phải trỏ đúng release SHA.

## 8. Rollback về 6.5.3

- Cloudflare Dashboard → Workers & Pages → `chemlab-edulab` → Deployments → `a522519a` (`ff13762`) → **Rollback to this deployment**. Có hiệu lực ngay, không cần build.
- Hoặc `git revert` các commit 6.5.4 trên `main` rồi push (không force).
- PWA tự quay về cache `chemlab-6.5.3-brand-1`. Dữ liệu học tập giữ nguyên (journey upgrade/rollback đã PASS).
- Rollback dự phòng xa hơn: `4aa0dc00` (6.5.2). Không xóa hai deployment này.
