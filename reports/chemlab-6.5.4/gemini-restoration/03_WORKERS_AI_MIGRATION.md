# 03 — Workers AI migration

## Đã thay thế

| Trước (6.5.0–6.5.3) | Sau (6.5.4) |
|---|---|
| Provider mặc định Workers AI (`@cf/zai-org/glm-4.7-flash`, fallback `gemma-4-26b-a4b-it`) | Gemini là provider duy nhất |
| `CHEMAI_PROVIDER` chọn `workers_ai`/`gemini` | Chỉ còn là **công tắc tắt**: không đặt hoặc `gemini` = dùng Gemini; mọi giá trị khác = ChemAI tắt (`AI_NOT_CONFIGURED`). Không bao giờ chuyển provider |
| safetyGate, answerGuard, chặn trùng, giới hạn client, hàng đợi đồng thời: chỉ trên Workers AI | Có trên đường Gemini |
| `test-workers-ai.mjs` | Các ca còn ý nghĩa viết lại trên Gemini (`test-chemai-guard.mjs`, `test-chemai-api.mjs`) |

## Đã xóa

- `functions/api/_workersAI.js` (danh sách model, ước tính Neurons, `runWorkersAI`, phân loại lỗi).
- Trong `chat.js`: `workersAIChat`, bảng lỗi Workers AI, prompt Markdown riêng, `PROVIDERS`/`chatProvider`.
- `scripts/test-workers-ai.mjs`, mục tương ứng trong `check:ai`.

Code 6.5.4 không còn đọc `env.AI`. Test xác nhận: có binding `AI` mà số lệnh gọi Workers AI vẫn là 0 (`test-chemai-access.mjs`).

## Còn giữ

- `dailyClientKey` (gộp IPv6 /64) chuyển vào `chat.js`.
- Worker `chemai-quota` (Durable Object `QuotaCounter`) và binding `CHEMAI_BUDGET`: ngân sách cho Gemini.
- Tham số `cost` trong `_limits.js` (dùng cho trừ nhiều đơn vị; Gemini dùng 1).
- `scripts/chemai-eval.mjs`: công cụ đánh giá live (cần `--confirm`), có `--max-calls` cho Gemini; phần đếm Neurons để nguyên.
- `docs/release/CHEMAI_WORKERS_AI.md`: giữ làm lịch sử, có ghi chú "Superseded in 6.5.4".
- Binding `AI` trên môi trường Preview và Production của Cloudflare: **không đổi**.

## Tình trạng deployment cũ (kiểm kê 2026-11-13)

Phương pháp: liệt kê deployment qua Cloudflare API (đọc), mỗi deployment một request `GET /api/chat` (chỉ đọc trạng thái, không gửi câu hỏi). Tên biến môi trường lấy từ API, không đọc giá trị.

**Mỗi deployment Pages giữ ảnh chụp biến/binding tại thời điểm deploy.** Bằng chứng: `8583adb3`, `c2ddfea7` có biến `GEMINI_API_KEY` (đúng tên) trong khi môi trường Production hiện tại chỉ có `" GEMINI_API_KEY"`. Vì vậy sửa hoặc gỡ binding trên môi trường hiện tại **không đóng** các deployment cũ; xóa Workers AI khỏi source 6.5.4 cũng không.

| Môi trường | Deployment | Ngày | Commit | Alias | Trạng thái ChemAI |
|---|---|---|---|---|---|
| preview | `bc778d74`, `7c02268c` | 11-12 | e71c522, c71393b | feature-chemlab-6-5-4-chemai | Khóa (6.5.4) |
| production | `a522519a` (hiện tại) | 11-10 | ff13762 | chemlab-edulab.pages.dev | Không cấu hình |
| preview | `35e7164b` | 11-10 | ff13762 | rc-chemlab-6-5-3-codex | **MỞ — Workers AI** |
| preview | `f5ae151a` | 11-04 | cb14d83 | hotfix-chemlab-6-5-2-chemai | **MỞ — Workers AI** |
| preview | `1f97dde4` | 11-04 | ede2dac | release-chemlab-6-5-1 | **MỞ — Workers AI** |
| preview | `1ea5c4a4`, `69364d09`, `a8988d59`, `fff5e414` | 10-21 | c798a1d, 8a2dd5a, da86e38, 2fe6d02 | evolution-next (1ea5c4a4) | **MỞ — Workers AI** |
| production | `7cad8281` | 10-21 | 35f0912 | — (URL hash) | **MỞ — Workers AI** |
| production | `8583adb3` | 10-21 | 2ce2914 | — | **Gemini đã cấu hình (key đúng tên)** |
| production | `69508b59` | 10-19 | e8e204b | — | **Gemini đã cấu hình** |
| production | `c2ddfea7` | 10-18 | d06c3dd | — | **Gemini đã cấu hình (key đúng tên)** |
| production | `4aa0dc00`, `c37463e5`, `9351ade6`, `b34ab928`, `adf82fdf` | 10-14…11-05 | | — | Không cấu hình |
| preview | `7c0b46d1` | 10-21 | 37f30b6 | — | Không cấu hình |
| preview | `057abe5b` | 10-21 | 0fa1663 | — | Không trả JSON |

Tổng: 21 deployment API trả về; **8 mở Workers AI, 3 có Gemini đã cấu hình**, tất cả không qua xác thực và truy cập được qua `https://<id>.chemlab-edulab.pages.dev`. Không gửi POST để xác minh khả năng gọi thật (sẽ gây lệnh gọi AI thật). Theo ghi nhận 6.5.0, `69508b59` bị Google từ chối do vị trí khi Function chạy ở HKG; từ colo khác có thể gọi được.

## Cách khép kín (chủ dự án quyết định; tôi chưa làm)

1. **Nhanh nhất cho Gemini:** thu hồi (rotate) Gemini API key cũ trong Google AI Studio. Ba deployment Gemini cũ mất quyền ngay, không cần xóa gì; tạo key mới khi cần với tên đúng `GEMINI_API_KEY`.
2. **Xóa các deployment mở** (Cloudflare Dashboard hoặc API `DELETE /pages/projects/chemlab-edulab/deployments/{id}`): 7 Preview + `7cad8281`, `8583adb3`, `69508b59`, `c2ddfea7`. Không động tới `a522519a` (Production hiện tại) và `4aa0dc00` (rollback 6.5.2). Không thể hoàn tác.
3. Hoặc bật Cloudflare Access cho preview deployments của project (bảo vệ `*.chemlab-edulab.pages.dev` ngoài domain Production). Cần kiểm tra lại URL hash của deployment Production cũ có được bảo vệ hay không.
4. Sau đó có thể gỡ binding `AI` khỏi Preview/Production cho các deployment mới (6.5.4 không dùng).
