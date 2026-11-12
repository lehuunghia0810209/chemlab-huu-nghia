# 01 — Architecture discovery

## Lịch sử Gemini trong Git

| Commit | Mốc |
|---|---|
| `237c6ef` | Sửa kết nối Gemini trên mobile (6.1/6.2) |
| `2abf925` | Backend `generateContent` (thay cách gọi cũ) |
| `da21745`, `d06c3dd` | ChemLab 6.2 Final: retry/fallback ổn định. **Bản Gemini cuối cùng chạy thành công trên Production** (deployment `c2ddfea7`, 2026-10-18) |
| `96c0ecd` | 6.5 M5: Feedback rubric `/api/feedback` dùng chung `requestGemini` |
| `fb4636f`, `1f33ce9` | 6.5.0: ngân sách theo từng lần gọi (Durable Object), fail-closed khi thiếu ngân sách, phân loại FAILED_PRECONDITION |
| `d2df1e0` | Xác minh lỗi Production: Google trả "User location is not supported" (Function chạy ở HKG) |
| `2b3eb06` | Mặc định chuyển sang Workers AI; Gemini chỉ khi `CHEMAI_PROVIDER=gemini` |
| `2fe6d02`, `8a2dd5a`, `22ec737` | Cải tiến chỉ áp cho Workers AI: KaTeX, answerGuard, safetyGate, quy tắc chính xác |
| Worktree `chemlab-gemini` (chưa commit, 2026-11-05) | Đưa các cải tiến trên sang đường Gemini + relay Vercel `sin1` |
| `c71393b` (6.5.4) | Cổng phân quyền `_access.js` |
| `2e12406` (6.5.4) | Gemini là provider duy nhất; xóa Workers AI |

## Kiến trúc Gemini cũ (6.2)

Browser `src/ai/chemAI.js` → `POST /api/chat` (Pages Function) → kiểm origin, rate limit theo IP, giới hạn body → `retrieveChemKnowledge` (nguyên tố, hóa chất, phản ứng, bài học liên quan) + ngữ cảnh màn hình đã làm sạch → `generateContent` với `system_instruction`, `responseMimeType: application/json` → JSON `answer/actions/suggestions` → frontend render Markdown.

## Phân loại

| Thành phần | Phân loại | Ghi chú |
|---|---|---|
| `requestGemini` / `generateContent`, header `x-goog-api-key` | REUSE | Endpoint còn được tài liệu hóa (xem 02) |
| `requestGeminiResilient` (retry 408/429/5xx, backoff ≤ 10 s, fallback khi 404 model) | REUSE | Giới hạn 4 lần thử, mỗi lần trừ ngân sách trước |
| Phân loại lỗi auth / precondition / quota / model | REUSE + UPDATE | Thông báo cho người dùng không còn nêu tên Secret/biến |
| Model `gemini-3.8-flash` / fallback `gemini-3.6-flash` | UPDATE | Thêm allowlist (chỉ model stable có free tier) |
| `retrieveChemKnowledge`, `sanitizeContext`, `sanitizeHistory` (≤ 10 mục) | PRESERVE | Ngữ cảnh tối thiểu, không gửi dữ liệu cá nhân |
| safetyGate, answerGuard, prompt chính xác/toán/an toàn, ẩn `thought`, `MAX_TOKENS` | REUSE (từ worktree `chemlab-gemini`) | Trước chỉ có trên Workers AI |
| Ngân sách Durable Object `CHEMAI_BUDGET`, worker `chemai-quota` | PRESERVE | Giới hạn dùng chung giữa isolates |
| Relay Vercel `sin1` | NOT ADOPTED | Hạ tầng mới, cần chủ dự án quyết định |
| `_workersAI.js`, nhánh `workersAIChat`, prompt Markdown riêng | REMOVE | Xem 03 |
| `_access.js`, frontend ChemAI, Markdown/KaTeX | PRESERVE | |

## Khác biệt quan trọng so với 6.2

- 6.2 không có cổng quyền: ai mở trang cũng gọi được Gemini. 6.5.4 từ chối trước khi đọc body, và Gemini chỉ được phép ở `internal_testing`.
- 6.2 không có ngân sách dùng chung giữa isolates; 6.5.4 bắt buộc có Durable Object, thiếu là từ chối.
- 6.2 không kiểm chứng đáp án Hóa học; 6.5.4 chạy answerGuard đối chiếu dữ liệu ChemLab.
- 6.2 thông báo lỗi có nhắc tên Secret; 6.5.4 không.
