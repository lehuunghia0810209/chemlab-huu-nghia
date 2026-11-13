# ChemAI — Groq migration report

Ngày 2026-11-13. Worktree `D:\EduLab\.worktrees\chemlab-groq`, nhánh `feature/chemlab-groq-chemai`.

## Kết luận

**GROQ INTEGRATION READY — WAITING FOR API KEY**

Adapter Groq đã hoàn chỉnh và PASS toàn bộ kiểm thử mock và regression. Chưa có lần gọi Groq thật nào. Bật Groq cho người dùng còn phụ thuộc vào điều khoản Groq (≥ 18 tuổi, "not for consumer use") và chỉ được thử trong `internal_testing` với người lớn (xem mục 7).

## 1. Baseline thực tế (đã xác minh, không giả định)

| | |
|---|---|
| `origin/main` | `873417b242b4eb5edc4826c58a223ddfcf573ed1` (ChemLab 6.5.4) |
| Production canonical | `afea91b9-7c24-4bcd-b82c-deb533e8b93c`, commit `873417b`, success (Cloudflare API) |
| `GET https://chemlab-edulab.pages.dev/api/chat` | `{"ok":true,"service":"ChemAI","release":"6.5.4","access":false,"configured":false}` |
| Nhánh `feature/chemlab-6.5.4-chemai-access` | `9ae14d4` = `873417b` + 1 commit chỉ chứa báo cáo phát hành, nên **không** dùng làm baseline |
| Mã ChemAI baseline | Gemini là provider duy nhất (`functions/api/chat.js`), cổng quyền `functions/api/_access.js` (mặc định `disabled`), ngân sách Durable Object `CHEMAI_BUDGET` (`_limits.js`), không còn Workers AI |

Nhánh `feature/chemlab-groq-chemai` được tạo từ `origin/main` (`873417b`). Không sửa `main`.

## 2. Tài liệu Groq đã kiểm tra (console.groq.com/docs, 2026-11-13)

- Endpoint `POST https://api.groq.com/openai/v1/chat/completions`, header `Authorization: Bearer <key>`.
- `openai/gpt-oss-120b`: context 131 072, output tối đa 65 536, có JSON Object/Schema mode và reasoning. Không thấy thông báo ngừng hỗ trợ.
- Tham số cho gpt-oss:
  - `reasoning_effort` nhận `low | medium | high`.
  - `include_reasoning`.
  - `reasoning_format` **không** hỗ trợ.
  - `max_tokens` đã deprecated, dùng `max_completion_tokens`.
- Lỗi: 400, 401, 403, 404, 413, 422, 429 (header `retry-after`), 498 (flex capacity), 500, 502, 503. Thân lỗi có dạng `{error:{message,type,code?}}`.
- Hạn mức gpt-oss-120b (bảng Developer): 30 RPM, 1K RPD, 8K TPM, 200K TPD. Hạn mức thực tế xem ở trang limits của tài khoản.

## 3. Thiết kế

- **Chọn provider**: `CHEMAI_PROVIDER` chọn đúng một provider.
  - Không đặt hoặc `groq` → Groq.
  - `gemini` → Gemini.
  - Giá trị khác (`off`, `workers_ai`…) → ChemAI tắt.
  - **Không fallback tự động** giữa các provider: lỗi Groq không bao giờ chuyển sang Gemini, có test kiểm chứng.
- **Secret**:
  - Chỉ đọc đúng tên `GROQ_API_KEY`; tên sai như `" GROQ_API_KEY"` bị bỏ qua (fail-closed).
  - Key chỉ nằm trong header `Authorization` phía server.
  - Có test kiểm chứng key không xuất hiện trong body, response, log hay frontend.
  - `redact()` che thêm mẫu `gsk_…`.
- **Model**: allowlist `openai/gpt-oss-120b` (mặc định) và `openai/gpt-oss-20b`. Model khác → 503 `AI_MODEL_NOT_ALLOWED`, không gọi upstream.
- **Request** (`groqChatBody`):
  - Gồm `system` = cùng `systemInstructions()` với Gemini (tiếng Việt, quy tắc chính xác Hóa học, LaTeX/KaTeX, an toàn, schema JSON) và một lượt `user` = cùng `buildInteractionInput()`. Lịch sử, CHEMLAB CONTEXT và CHEMLAB KNOWLEDGE được gắn nhãn là dữ liệu, không phải chỉ thị.
  - `response_format: {type: "json_object"}`, `reasoning_effort` (`GROQ_REASONING_EFFORT`, mặc định `low`), `include_reasoning: false`, `max_completion_tokens: 4096` (reasoning của gpt-oss nằm trong ngân sách này), `stream: false`.
- **Response**:
  - `choices[0].message.content` → parse JSON `{answer, actions, suggestions}` → `answerGuard` (đối chiếu Hóa học) → whitelist actions. Pipeline giống Gemini, dùng chung helper `structuredAnswer`.
  - `meta.provider = "Groq"`.
- **Lỗi và retry** (cùng model, tối đa 3 lần thử; mỗi lần thử thêm đều trừ ngân sách chung trước):

| Upstream | ChemAI | Retry |
|---|---|---|
| 401 / 403 | 502 `GROQ_AUTH_FAILED` (lỗi cấu hình, UI không gợi ý thử lại) | không |
| 404 | 502 `AI_MODEL_UNAVAILABLE` | không |
| 400 / 413 / 422 | 502 `GROQ_BAD_REQUEST` | không |
| 400 `json_validate_failed` | lấy mẫu lại | có |
| 429 | 429 `RATE_LIMITED`, chuyển tiếp `Retry-After` | 1 lần, nếu chờ ≤ 10 s |
| 498 / 503 | 503 `GROQ_OVERLOADED` | có |
| 500 / 502 / 504 / lỗi mạng | 502 `AI_UPSTREAM_ERROR` / `AI_REQUEST_FAILED` | có |
| Hết 52 s | 502 `AI_TIMEOUT` | — |
| Nội dung rỗng | 502 `AI_EMPTY_RESPONSE` | — |
| `finish_reason: length` | 502 `AI_INCOMPLETE` (không hiển thị JSON bị cắt) | — |
| `finish_reason: content_filter` | 422 `AI_BLOCKED` | — |
| Không phải JSON / thiếu `answer` | 502 `AI_REQUEST_FAILED` | — |

  Thông báo cho học sinh không nêu tên nhà cung cấp.
- **Giữ nguyên**:
  - Same-origin, rate limit theo IP, giới hạn kích thước body, safety gate (câu hỏi nguy hiểm không gọi model), chống trùng lặp, giới hạn đồng thời.
  - Ngân sách theo client/ngày (`CHEMAI_DAILY_LIMIT_PER_CLIENT`, mặc định 40) và toàn site (`CHEMAI_DAILY_LIMIT_CHAT`, mặc định 200, thấp hơn 1K RPD của Groq).
  - Thiếu `CHEMAI_BUDGET` → 503, không gọi.
- **Cổng quyền** (`_access.js`):
  - Trước đây chỉ Gemini bị giới hạn ở `internal_testing`; nay **mọi provider** đều vậy, vì điều khoản Groq cũng yêu cầu ≥ 18 tuổi.
  - Mặc định `disabled`; `student_access` vẫn bị từ chối trong code; JWT Access, allowlist email và host nội bộ không đổi.
- **Gemini**: adapter giữ nguyên trong mã nguồn, chỉ chạy khi `CHEMAI_PROVIDER=gemini`. `/api/feedback` (chấm bài viết, tắt mặc định) vẫn chỉ dùng Gemini, nên tự tắt khi chọn Groq. Chuyển feedback sang Groq không thuộc phạm vi nhiệm vụ này.
- **Workers AI**: không có đường gọi nào (`env.AI`, `@cf/`); test xác nhận mock `env.AI` không bao giờ được gọi.

## 4. File thay đổi

| File | Thay đổi |
|---|---|
| `functions/api/chat.js` | Groq adapter (`chatProvider`, `groqConfigured`, `groqChatBody`, `requestGroq`, retry, `groqFailure`, `groqCall`); tách `chargeChat`, `structuredAnswer`, `callFailed` dùng chung cho hai provider; status trả provider/model đúng (chỉ khi đã qua cổng) |
| `functions/api/_access.js` | Giới hạn `internal_testing` áp cho mọi provider |
| `src/ai/chemAI.js` | Chỉ thêm mã lỗi Groq vào nhóm phân loại trạng thái; giao diện không đổi |
| `scripts/test-chemai-groq.mjs` (mới) | 16 nhóm kiểm thử mock Groq |
| `scripts/test-chemai-api.mjs`, `test-chemai-access.mjs`, `test-feedback-api.mjs`, `test-chemai-guard.mjs` | Env Gemini đặt `CHEMAI_PROVIDER: 'gemini'` tường minh (trước đây "không đặt" nghĩa là Gemini); status mặc định nay là Groq |
| `scripts/validate-final-ui.mjs` | Check "không còn backend OpenAI" vẫn cấm `OPENAI_` và `api.openai.com`; chỉ cho phép `gpt-` dưới dạng id model Groq `openai/gpt-oss-*`. Thêm check endpoint Groq và check key không có ở frontend |
| `scripts/local-cloudflare-check.mjs` | Thêm binding `GROQ_API_KEY` giả để chứng minh cổng chặn cả khi Groq đã cấu hình |
| `scripts/chemai-eval.mjs` | Dừng đánh giá khi gặp lỗi cấu hình Groq |
| `package.json` | `check:ai` chạy thêm `test-chemai-groq.mjs` |
| `.dev.vars.example` | Placeholder Groq (`CHEMAI_PROVIDER=groq`, `GROQ_API_KEY=your_groq_api_key_here`, `GROQ_MODEL`, `GROQ_REASONING_EFFORT`) |

Learning, Practice, Exam, Virtual Lab, dữ liệu Hóa học và UI ChemAI: không đổi.

## 5. Kiểm thử (chạy trong worktree này, ngày 2026-11-13)

| Kiểm tra | Lệnh | Kết quả |
|---|---|---|
| Groq mock | `node scripts/test-chemai-groq.mjs` | **PASS 16/16** (chọn provider, status, fail-closed, request schema, response, 401/403/404/400/413/422/429/498/500/502/503, json_validate_failed, rỗng/cắt/lọc/không phải JSON, mạng, timeout, ngân sách retry, safety gate, cổng quyền, không lộ key trong log) |
| Toàn bộ quality gate | `npm run check` | **PASS** (exit 0): project, chem 49, learning 242, questions 783, exam 84, papers 850, UI 78, access 15, Gemini API mock, Groq 16, feedback 20, markdown 11, eval 9, guard 23 |
| Build | `npm run build` | **PASS** |
| Secret scan `dist/` | mẫu `AIza…`, `gsk_…`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `x-goog-api-key`, `generativelanguage`, `api.groq.com`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`, `oauth_token`, `@cf/` | **PASS** — 0 file khớp |
| Secret scan mã nguồn | `gsk_[0-9A-Za-z_]{20,}`, `AIza…` trong `functions src scripts` | **PASS** — chỉ có key giả `gsk_test0nly0not0a0real0key0000` trong test; không có `.dev.vars`/`.env` |
| Workers AI | `env.AI`, `@cf/`, `_workersAI` trong `functions src` | **PASS** — 0 |
| Browser smoke | `CHEMLAB_BROWSER=chromium\|firefox\|webkit node scripts/browser-smoke.mjs` | **PASS 420/420 × 3** (bao gồm PWA upgrade 12, PWA 5) |
| Accessibility | `node scripts/a11y-audit.mjs` | **PASS** — axe không có vi phạm WCAG A/AA; kiểm tra focus PASS |
| Runtime Cloudflare local (workerd) | `node scripts/local-cloudflare-check.mjs` | **PASS 10/10** — có Groq và Gemini key giả, mọi chế độ đều 403 trước khi gọi AI |
| `npm audit` | `npm audit` | **PASS** — 0 lỗ hổng |
| Groq live | — | **NOT RUN** (chưa có key, chưa đủ điều kiện) |

Cảnh báo có sẵn từ baseline (không phải lỗi mới): `validate-project` in 15 dòng "Reaction … không có effect"; worktree 6.5.4 cũng in đúng 15 dòng này.

## 6. Cấu hình `GROQ_API_KEY` (chủ dự án, khi đã đủ điều kiện ở mục 7)

Chỉ dùng **Preview riêng**, không dùng Production.

1. Tạo key tại console.groq.com → API Keys. Không dán key vào chat, file, commit hay log.
2. Cloudflare Dashboard → Workers & Pages → `chemlab-edulab` → Settings → Variables and Secrets → môi trường **Preview**:
   - Secret `GROQ_API_KEY`, đúng tên, không có dấu cách.
   - `CHEMAI_PROVIDER=groq`.
   - (Tùy chọn) `GROQ_MODEL=openai/gpt-oss-120b`, `GROQ_REASONING_EFFORT=low`.
   - Không dùng `wrangler pages secret put`: wrangler 4 ghi lệnh này vào Production.
3. Cổng nội bộ, cũng trên Preview:
   - `CHEMAI_ACCESS_MODE=internal_testing`.
   - `CF_ACCESS_TEAM_DOMAIN=https://chemlab-edulab-pages.cloudflareaccess.com`.
   - `CF_ACCESS_AUD=<AUD của ứng dụng Access Preview>`.
   - `CHEMAI_APPROVED_EMAILS=<email người lớn được duyệt>`.
   - `CHEMAI_INTERNAL_HOSTS=<host alias Preview của nhánh Groq>`.
   - `CHEMAI_DAILY_LIMIT_CHAT=1` cho lần thử đầu.
4. Push nhánh để tạo Preview (biến được chụp tại thời điểm deploy). Đăng nhập Access, sau đó `GET /api/chat` phải trả `provider:"Groq"` và `configured:true`.
5. Một lần gọi có phê duyệt: `node scripts/chemai-eval.mjs <preview-url> --confirm --max-calls 1`. Sau đó giáo viên đánh giá chất lượng câu trả lời.

Biến Preview hiện có (`CHEMAI_BUDGET_SCOPE`, `CHEMAI_DAILY_NEURONS`) và Production (`" GEMINI_API_KEY"`, `CHEMAI_PROVIDER`, `CHEMAI_DAILY_NEURONS`) không bị thay đổi trong nhiệm vụ này. Với 6.5.4 hoặc nhánh này, Production luôn fail-closed vì hai lớp: access `disabled` và không có `GROQ_API_KEY`. `CHEMAI_PROVIDER` của Production là secret nên không đọc được giá trị; dù giá trị là gì thì kết quả vẫn bị khóa.

## 7. Blocker còn lại

1. **Điều khoản Groq**:
   - Services Agreement mục 2: người dùng phải "18 years of age or older".
   - Phần mở đầu: "not for consumer use".
   - Mục 6.3: ứng dụng có khả năng bị người chưa thành niên truy cập thì khách hàng tự chịu trách nhiệm tuân thủ.
   - Vì vậy **không bật cho học sinh**. Chỉ thử nội bộ với người lớn, và cần chủ dự án/pháp lý xác nhận. Code tiếp tục từ chối `student_access` và `approved_users` cho mọi provider.
   - Điểm tích cực: theo mục 4.2, Groq không dùng input/output để huấn luyện, và có tùy chọn zero data retention.
2. **Chưa có `GROQ_API_KEY`**: chủ dự án tạo sau.
3. **Chưa có AUD Access và biến `internal_testing` trên Preview** (giống blocker của Gemini).
4. **Chưa có lần gọi live nào và chưa có đánh giá chất lượng**:
   - Chất lượng tiếng Việt/Hóa học của gpt-oss-120b, độ trễ, tỉ lệ `json_validate_failed`.
   - Mức `max_completion_tokens` 4096 với `reasoning_effort=low` cần được xác nhận bằng dữ liệu thật.
5. **Khi phát hành**: phải tăng phiên bản (`npm run release:sync` → cache SW mới) để trình duyệt nhận `chemAI.js` mới. Nhánh này giữ 6.5.4 vì nhiệm vụ không phải phát hành.

## 8. Git

- Nhánh `feature/chemlab-groq-chemai` (local, từ `873417b`). Commit chỉ trên nhánh này.
- Không push `main`, không merge, không deploy, không sửa secrets Production hay Cloudflare Access, không gọi Groq/Gemini thật.
