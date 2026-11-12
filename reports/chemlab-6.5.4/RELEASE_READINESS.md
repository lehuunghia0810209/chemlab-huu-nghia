# ChemLab 6.5.4 — Sẵn sàng phát hành

## Đã khôi phục / hoàn thiện về kỹ thuật

- Cổng quyền ChemAI phía server, mặc định khóa, fail-closed, áp cho `/api/chat` và `/api/feedback`.
- Xác thực danh tính thật qua Cloudflare Access JWT (RS256) + danh sách email phía server; không token cứng, không bypass.
- `student_access` khóa cứng trong code; Gemini chỉ cho `internal_testing` trên host không phải Production.
- Trạng thái công khai không lộ provider/model/secret; cảnh báo tên biến có khoảng trắng (như `" GEMINI_API_KEY"`) chỉ cho người đã qua cổng.
- UI khóa với thông báo chuẩn, giữ vị trí ChemAI; không nút gửi khi chưa có quyền.
- Pipeline Gemini/Workers AI 6.5.3 giữ nguyên, có mock test (timeout, retry, fallback, lỗi, ngân sách, guard Hóa học).
- Phiên bản 6.5.4 (package, app meta, HTML, manifest, SW cache `chemlab-6.5.4-access-1`).

## Vẫn bị khóa

| Điều kiện | Trạng thái |
|---|---|
| Học sinh dùng ChemAI | Khóa (code) |
| Gemini ngoài kiểm thử nội bộ | Khóa (code) |
| Gemini thật trên Production | Không chạy được: vùng HKG bị Google từ chối; biến `" GEMINI_API_KEY"` sai tên (chưa sửa) |
| Cloudflare Access cho ChemAI | Chưa cấu hình (việc của chủ dự án trên Dashboard) |

## Điều khoản nhà cung cấp — mức xác minh

Đã đọc trực tiếp Gemini API Additional Terms of Service (https://aistudio.google.com/docs/terms, bản "Effective March 23, 2026") ngày 2026-11-12:

- "You must be 18 years of age or older to use the APIs."
- Không được dùng Services trong website/ứng dụng "directed towards or is likely to be accessed by individuals under the age of 18."
- Gemini API "is for developers building with Google AI models for professional or business purposes, not for consumer use."
- Unpaid Services: người duyệt có thể đọc input/output; "Do not submit sensitive, confidential, or personal information to the Unpaid Services."

ChemLab hướng tới học sinh THPT, nên việc mở Gemini cho học sinh **không phù hợp** với điều khoản hiện hành, bất kể vùng, gói trả phí hay phê duyệt của chủ dự án. Đây là đọc văn bản, không phải ý kiến pháp lý. Chưa xác minh: Google Cloud Service Terms (Vertex AI), điều khoản Cloudflare Workers AI cho người dùng vị thành niên.

## Có thể lên Production khi ChemAI vẫn khóa?

**Về kỹ thuật: có, sau khi qua Preview.** Bản 6.5.4 không cần biến môi trường mới trên Production (thiếu = khóa); mọi kiểm thử non-AI PASS; người dùng chỉ thấy ChemAI ở trạng thái khóa với thông báo mới. Rủi ro chính: SW cache đổi tên → PWA đã cài sẽ tải shell mới (cơ chế giống 6.5.3).

Điều kiện trước khi lên Production:
1. Chủ dự án duyệt diff và cho phép commit.
2. Deploy Preview, chạy `scripts/staging-smoke.mjs` trên URL Preview (chỉ GET + POST cross-origin).
3. Xác nhận trên Preview: `GET /api/chat` → `access:false`; `POST` → 403.
4. Chủ dự án phê duyệt promote.

**ChemAI chưa sẵn sàng phục vụ học sinh.** Không có phê duyệt và cơ sở tuân thủ cho việc đó.
