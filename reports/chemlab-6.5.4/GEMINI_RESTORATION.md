# ChemLab 6.5.4 — Khôi phục ChemAI dùng Gemini

Ngày: 2026-11-12. Worktree `D:\EduLab\.worktrees\chemlab-6.5.4`, nhánh `feature/chemlab-6.5.4-chemai-access`. **Không gọi Gemini thật** — mọi PASS dưới đây là **mock PASS**. Không đổi secret, binding, Preview cũ hay Production.

## 1. Implementation Gemini cũ tìm thấy ở đâu

| Nguồn | Nội dung |
|---|---|
| Git `2abf925` → `da21745` → `d06c3dd` (ChemLab 6.2) | Backend `generateContent` + retry/fallback; bản Gemini cuối cùng từng chạy trên Production |
| Git `96c0ecd`, `fb4636f`, `1f33ce9` (6.5.0) | Feedback rubric, ngân sách theo lần gọi, fail-closed khi thiếu ngân sách |
| Git `2b3eb06` | Chuyển mặc định sang Workers AI; mã Gemini vẫn giữ sau `CHEMAI_PROVIDER=gemini` |
| Worktree `D:\EduLab\.worktrees\chemlab-gemini` (nhánh `feature/chemai-gemini-6.5.3`, **chưa commit**, 2026-11-05) | Bản khôi phục Gemini đầy đủ nhất: đưa safetyGate, answerGuard, quy tắc chính xác/toán/an toàn, ẩn `thought`, `MAX_TOKENS`, allowlist model, giới hạn theo client, chặn request trùng sang đường Gemini; thêm relay Vercel `sin1` |

`functions/` không đổi giữa base của worktree đó (`d6fcffc`) và `ff13762`, nên patch được áp bằng `git apply --3way` mà không có xung đột.

## 2. Phần tái sử dụng

- Toàn bộ adapter Gemini 6.2/6.5: `requestGemini` (`POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`, key qua header `x-goog-api-key`), `requestGeminiResilient` (tối đa 4 lần thử, backoff ≤ 10 s chỉ cho 408/429/5xx, fallback model khi 404), timeout 52 s, phân loại lỗi (auth, FAILED_PRECONDITION vùng/billing, quota, model), ngân sách ngày chính xác (Durable Object) trừ trước mỗi lần gọi, structured JSON `answer/actions/suggestions`.
- Từ worktree `chemlab-gemini` (trừ relay): allowlist `gemini-3.8-flash`, `gemini-3.6-flash`; fallback ngoài allowlist bị bỏ qua; safetyGate trước ngân sách; chặn câu hỏi trùng đang chạy (409); tối đa 6 lệnh gọi đồng thời mỗi isolate; giới hạn 40 câu/ngày/client (IPv6 gộp /64); ngân sách mặc định 200 lần gọi/ngày; `answerGuard` đối chiếu đáp án với dữ liệu ChemLab; ẩn phần `thought`; `MAX_TOKENS` → `AI_INCOMPLETE`; thông báo lỗi cho người dùng không lộ tên biến/secret; prompt có quy tắc chính xác GDPT 2018, LaTeX/KaTeX, an toàn thực hành.
- Frontend ChemAI, Markdown/KaTeX (`src/ai/markdown.js`, `mathRender.js`) và cổng quyền 6.5.4 giữ nguyên.

**Không lấy relay Vercel**: đó là hạ tầng mới (project Vercel, secret HMAC), cần chủ dự án quyết định. Mã relay vẫn ở worktree `chemlab-gemini` nếu cần (xem §9).

## 3. Phần Workers AI đã thay thế / gỡ bỏ

| Trước | Sau |
|---|---|
| `CHEMAI_PROVIDER` chọn `workers_ai` (mặc định) hoặc `gemini` | Gemini là provider duy nhất. `CHEMAI_PROVIDER` chỉ còn là **công tắc tắt**: đặt giá trị khác `gemini` → ChemAI tắt (`AI_NOT_CONFIGURED`), không chuyển provider |
| `functions/api/_workersAI.js` (142 dòng), nhánh `workersAIChat`, bảng lỗi Workers AI, prompt Markdown riêng | Đã xóa. `dailyClientKey` (gộp IPv6 /64) chuyển vào `chat.js` |
| `scripts/test-workers-ai.mjs` | Đã xóa; các ca còn ý nghĩa (safety gate, guard, kill switch, prompt) viết lại trên Gemini trong `test-chemai-guard.mjs` |
| `GET /api/chat` báo `provider: Workers AI` | Báo `provider: Gemini` (chỉ cho người đã qua cổng) |

Không có đường fallback nào sang Workers AI: code không còn đọc `env.AI`. Test xác nhận: kể cả khi có binding `AI`, số lệnh gọi Workers AI là 0. Binding `AI`/`CHEMAI_BUDGET` trên Cloudflare **không bị xóa** — các deployment lịch sử vẫn dùng chúng (xem rủi ro trong `PREVIEW_SECURITY_VERIFICATION.md`). Worker `chemai-quota` (Durable Object ngân sách) vẫn dùng cho Gemini.

## 4. File thay đổi (so với `e71c522`)

```
D  functions/api/_workersAI.js
M  functions/api/chat.js            (1247 → 1156 dòng)
M  functions/api/feedback.js        (dùng geminiConfigured/geminiModel/allowlist)
M  package.json                     (bỏ test-workers-ai khỏi check:ai)
D  scripts/test-workers-ai.mjs
M  scripts/test-chemai-api.mjs      (+ MAX_TOKENS, thought, allowlist, fallback, giới hạn client, request trùng, tên biến sai)
M  scripts/test-chemai-guard.mjs    (ca API chạy trên Gemini mock)
M  scripts/test-chemai-access.mjs   (đường dương: internal_testing → Gemini mock)
M  scripts/test-feedback-api.mjs, scripts/chemai-eval.mjs (từ worktree chemlab-gemini)
M  scripts/local-cloudflare-check.mjs, scripts/browser-smoke.mjs, scripts/a11y-audit.mjs (bỏ CHEMAI_PROVIDER/“Workers AI” trong mock)
M  docs/release/CHEMAI_WORKERS_AI.md (ghi chú: đã thay thế)
A  reports/chemlab-6.5.4/GEMINI_RESTORATION.md
```

Không đổi: `src/` (UI, Learning, Practice, Exam, Lab, Periodic, công cụ), `public/` (PWA), dữ liệu, `_access.js`.

## 5. Model và endpoint

Đối chiếu tài liệu Google ngày 2026-11-12 (aistudio.google.com/docs/models, /docs/deprecations, /docs/pricing, /api-reference/generate-content):

| | Giá trị | Bằng chứng |
|---|---|---|
| Model chính | `gemini-3.8-flash` | Model page: "Stable: `gemini-3.8-flash`"; deprecations: "No shutdown date announced"; pricing: free tier "Free of charge" |
| Fallback | `gemini-3.6-flash` | Badge "Stable"; không có ngày ngừng; có free tier |
| Endpoint | `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` | Vẫn được tài liệu hóa, không ghi deprecated. Interactions API là bề mặt mới song song, không được công bố là thay thế |
| Request | `system_instruction`, `contents`, `generationConfig.{maxOutputTokens: 1800, responseMimeType: application/json, thinkingConfig.thinkingLevel}` | Các trường có trong reference; `thinkingLevel` gửi `low/medium/high` (3.8-flash không hỗ trợ `minimal`) |
| Response | `candidates[].content.parts[].text`, `thought`, `finishReason` (`MAX_TOKENS`), `promptFeedback.blockReason` | Có trong reference |

Không dùng schema JSON phía Google (JSON được yêu cầu qua prompt + `responseMimeType`), giống bản 6.2. Free tier: Google có thể dùng nội dung để cải thiện sản phẩm và cho người duyệt đọc.

## 6. Cấu hình Cloudflare cần thiết (chưa thực hiện)

Chỉ cho môi trường kiểm thử nội bộ cô lập. Chủ dự án làm trên Dashboard:

| Biến | Giá trị |
|---|---|
| `GEMINI_API_KEY` (Secret, **đúng tên, không dấu cách**) | key Gemini. Production hiện có `" GEMINI_API_KEY"` (dấu cách đầu) — code không đọc tên này, nên vẫn tắt |
| `CHEMAI_ACCESS_MODE` | `internal_testing` (Gemini bị từ chối cứng ở `approved_users` và `student_access`) |
| `CHEMAI_INTERNAL_HOSTS` | host Preview riêng; host Production luôn bị từ chối |
| `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS` | Cloudflare Access (hiện **chưa bật** trên account) + email người lớn được duyệt |
| `CHEMAI_BUDGET` (+ `CHEMAI_BUDGET_SCOPE`) | đã có trên Preview |
| `CHEMAI_DAILY_LIMIT_CHAT` | nhỏ (ví dụ `1`) cho lần thử đầu |
| `CHEMAI_PROVIDER` | không đặt, hoặc `gemini`. Giá trị khác = tắt |
| `GEMINI_MODEL` (tuỳ chọn) | `gemini-3.8-flash` hoặc `gemini-3.6-flash` |

## 7. Mock tests

| Bộ | Kết quả (mock) |
|---|---|
| `test-chemai-access.mjs` (JWT RS256 thật/giả, host, mode, body không bị đọc khi từ chối, đường dương internal_testing → Gemini mock, 0 lệnh gọi Workers AI) | PASS 14/14 |
| `test-chemai-api.mjs` (adapter, model/fallback, key hợp lệ/thiếu/tên sai, request không hợp lệ, timeout/retry/backoff, 429/quota, precondition vùng/billing, ngân sách DO, rate limit, MAX_TOKENS, thought, allowlist, giới hạn client, request trùng, key không nằm trong URL, che key trong log) | PASS |
| `test-feedback-api.mjs` | PASS 20/20 |
| `test-chemai-guard.mjs` (kiểm chứng Hóa học, safety gate, kill switch, prompt) | PASS 23/23 (trước: 24; bỏ ca timeout Workers AI, timeout Gemini nằm trong test-chemai-api) |
| `test-chemai-markdown.mjs` (Markdown/KaTeX, HTML/`\href` vô hiệu) | PASS 11/11 |
| `test-chemai-eval.mjs` | PASS 9/9 |

**Live Gemini: NOT RUN.**

## 8. Browser và regression

| Kiểm thử | Kết quả |
|---|---|
| `npm run check` (chem 49, learning 242, questions 783/537 câu, exam 84, papers 850, UI 76, AI) | PASS |
| `browser-smoke.mjs` Chromium / Firefox / WebKit (42 suite gồm ChemAI gửi/nhận/đang xử lý/lỗi/thử lại/KaTeX/khóa, Learning, Practice, Exam, Lab, CSP, PWA upgrade/offline/persistence) | PASS 418/418 mỗi trình duyệt |
| `a11y-audit.mjs` | PASS |
| `local-cloudflare-check.mjs` (workerd thật) | PASS 12/12 + 10/10 |
| `npm audit` | 0 lỗ hổng |
| Secret trong `dist/` (`AIza…`, `GEMINI_API_KEY`, `x-goog-api-key`, `generativelanguage`, biến Access) | Không có |
| Build | PASS; tái lập kiểu Cloudflare: xem `PREVIEW_SECURITY_VERIFICATION.md` và commit RC |

ChemAI UI trong browser test dùng `/api/chat` giả lập; không thể hiện chất lượng câu trả lời thật của Gemini.

## 9. Giới hạn còn lại để bật Gemini thật

1. **Điều khoản Google** (bản 23/03/2026): cấm dịch vụ "likely to be accessed by individuals under the age of 18" và "not for consumer use". Không mở cho học sinh. Chỉ có thể cân nhắc kiểm thử nội bộ với người lớn, sau khi chủ dự án xác nhận phù hợp.
2. **Vị trí**: Google trả `User location is not supported` khi Pages Function chạy ở HKG (đã xác minh 2026-10-21). Gọi trực tiếp từ Cloudflare có thể vẫn bị từ chối. Phương án đã thiết kế: relay ở vùng cố định (Vercel `sin1`, mã trong worktree `chemlab-gemini`) — cần chủ dự án quyết định và phê duyệt từng bước.
3. **Cloudflare Access chưa bật** → chưa ai qua được cổng.
4. **Secret sai tên** `" GEMINI_API_KEY"` trên Production; chưa có secret đúng tên trên Preview.
5. Free tier: nội dung có thể được người duyệt của Google đọc → không gửi thông tin cá nhân.
6. Chưa đo `thinkingLevel=low` và trần 1800 token trên `gemini-3.8-flash` thật.

Live test cần: môi trường Preview riêng, `internal_testing` + Access bật + email người lớn được duyệt, secret đúng tên, `CHEMAI_DAILY_LIMIT_CHAT` nhỏ, một câu hỏi qua `scripts/chemai-eval.mjs --confirm --max-calls 1`, và phê duyệt rõ ràng của chủ dự án.

## 10. Kết luận

**Về kỹ thuật (mock): ĐẠT.** ChemAI chỉ còn dùng Gemini trên đường xử lý chính, không có fallback sang Workers AI, cổng quyền 6.5.4 giữ nguyên và chạy trước mọi lệnh gọi; giao diện và các module non-AI không đổi và không hồi quy.

**Về vận hành thật: CHƯA SẴN SÀNG.** Bị chặn bởi điều khoản Google (người dưới 18), vị trí HKG, Access chưa bật và secret sai tên. ChemAI vẫn khóa với tất cả mọi người, kể cả học sinh.
