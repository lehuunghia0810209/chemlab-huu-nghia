# 02 — Gemini implementation

## Endpoint và model

Đối chiếu tài liệu Google ngày 2026-11-12 (aistudio.google.com: `/docs/models`, `/docs/deprecations`, `/docs/pricing`, `/api-reference/generate-content`):

- Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`, key qua header `x-goog-api-key` (không nằm trong URL). Được tài liệu hóa, không ghi deprecated. Interactions API là bề mặt mới song song, không được công bố là thay thế.
- Model chính: `gemini-3.8-flash` — "Stable", "No shutdown date announced", free tier "Free of charge". Lý do: model Flash stable mới nhất, nhanh, chi phí thấp, đủ cho giải thích Hóa học THPT tiếng Việt (chất lượng tiếng Việt thực tế **chưa đo**).
- Fallback: `gemini-3.6-flash` — Stable, chưa có ngày ngừng, có free tier.
- Allowlist cứng 2 model trên; `GEMINI_MODEL`/`GEMINI_FALLBACK_MODELS` ngoài danh sách bị từ chối trước khi gọi. Đổi model chỉ cần sửa biến hoặc allowlist trong `chat.js`, không đụng UI.
- Request: `system_instruction`, `contents` (1 lượt user chứa câu hỏi + lịch sử ≤ 10 mục + ngữ cảnh + tri thức ChemLab), `generationConfig { maxOutputTokens: 1800, responseMimeType: 'application/json', thinkingConfig.thinkingLevel: low|medium|high }` (3.8-flash không hỗ trợ `minimal`).
- Response: `candidates[0].content.parts[].text` (bỏ phần `thought: true`), `finishReason`, `promptFeedback.blockReason`.

## Luồng backend (`functions/api/chat.js`)

1. `onRequestPost` → `chemAIAccess` (`_access.js`). Từ chối → 403 `AI_ACCESS_LOCKED`, body chưa được đọc.
2. sameOrigin → rate limit theo IP (18/phút/isolate) → body ≤ 64 KB.
3. `geminiConfigured` (secret `GEMINI_API_KEY`; `CHEMAI_PROVIDER` khác `gemini` = tắt) → allowlist model → ngân sách bắt buộc (`costBudgetConfigured`).
4. Parse/validate: JSON, câu hỏi ≤ 4000 ký tự, lịch sử, ngữ cảnh.
5. `geminiChat`: safetyGate (câu hỏi nguy hiểm → trả lời cố định, không gọi model) → chặn câu hỏi trùng đang chạy (409) → tối đa 6 lệnh gọi đồng thời mỗi isolate (503).
6. `geminiCall`: trừ hạn mức 40 câu/ngày/client (IPv6 gộp /64) → trừ ngân sách chung (`CHEMAI_DAILY_LIMIT_CHAT`, mặc định 200 lần gọi/ngày) → `requestGeminiResilient` (mỗi lần thử lại trừ thêm 1 đơn vị, hết ngân sách thì dừng) → timeout 52 s.
7. Xử lý phản hồi: blockReason/SAFETY/RECITATION → 422 `AI_BLOCKED`; `MAX_TOKENS` → 502 `AI_INCOMPLETE`; rỗng/không phải JSON/thiếu answer → 502 `AI_REQUEST_FAILED`; thành công → `answerGuard` đối chiếu dữ liệu ChemLab, thêm ghi chú sửa nếu sai.

`/api/feedback` dùng chung `requestGemini`, `geminiConfigured`, allowlist; 1 lần gọi, 900 token, 25 s.

## Xử lý lỗi

| Tình huống | Hành vi |
|---|---|
| Thiếu key / key sai tên `" GEMINI_API_KEY"` | 503 `AI_NOT_CONFIGURED`, không gọi |
| Key không hợp lệ (401/403) | 502 `GEMINI_AUTH_FAILED`, không retry |
| Model không tồn tại (404) | Thử fallback trong allowlist, rồi 502 `GEMINI_MODEL_UNAVAILABLE` |
| 400 / FAILED_PRECONDITION (vùng, billing) | 503 `GEMINI_PRECONDITION_FAILED` + `reason`, không retry |
| 429 | Retry có giới hạn theo `Retry-After`; hết quota → 429 |
| 500/502/503/504, mạng, timeout | Retry tối đa 4 lần, backoff mũ ≤ 10 s, rồi 502/503 |
| Bị chặn an toàn, rỗng, sai định dạng | 422 / 502, 1 lần gọi |

Thông báo cho người dùng bằng tiếng Việt, không nêu key, tên biến, URL hay nội dung lỗi gốc của Google.

## Bảo mật

Key chỉ ở server (header); log không có key, IP, header hay nội dung hội thoại; lỗi upstream bị cắt và che key (`redact`); bundle `dist/` không chứa key, tên biến, `x-goog-api-key` hay `generativelanguage`.

## File đã sửa (6.5.4, so với `ff13762`)

`functions/api/_access.js` (mới), `functions/api/chat.js`, `functions/api/feedback.js`, `functions/api/_workersAI.js` (xóa), `src/ai/chemAI.js`, `src/ai/chemAI.css`, phiên bản (`package.json`, `package-lock.json`, `src/appMeta.js`, `index.html`, `public/manifest.webmanifest`, `public/sw.js`), `.dev.vars.example`, các script test/kiểm tra, `docs/release/CHEMAI_WORKERS_AI.md`, báo cáo trong `reports/chemlab-6.5.4/`.
