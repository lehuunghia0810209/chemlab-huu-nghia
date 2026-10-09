# ChemLab 6.2.0 — Final Lock

ChemLab 6.2 là bản phát hành cuối cùng của dự án. Bản này khóa phần lõi ChemLab 6.0, hoàn thiện ChemAI, chuyển AI backend sang Gemini và dọn các chi tiết production còn lại. Sau 6.2 không có roadmap 6.3/7.0; chỉ sửa lỗi vận hành nếu thật sự cần.

## Trạng thái final

- Dashboard / Home, Periodic, Tools, Learning, Virtual Lab và Chem Flow giữ kiến trúc ChemLab 6.
- 103 hóa chất, 96 phản ứng, 21 chương, 77 bài học, 78 Guided Activities, 372 Guided Steps và 188 Guided Questions vẫn nguyên vẹn.
- ChemAI lazy-load, hiểu context của workspace, quiz/Learning, nguyên tố đang xem và trạng thái Lab.
- ChemAI nói chuyện, giảng và hướng dẫn bằng tiếng Việt; ký hiệu nguyên tố, công thức, phương trình phản ứng, orbital, IUPAC và biểu thức toán giữ chuẩn quốc tế.
- AI actions vẫn bị giới hạn vào các workspace/tool đã whitelist; model không được thực thi mã tùy ý.

## ChemAI Gemini

Backend chạy tại Cloudflare Pages Function `/api/chat` và gọi Gemini Interactions API ổn định (`/v1/interactions`). Model mặc định là `gemini-3.8-flash`.

ChemAI dùng structured output để nhận ba phần: `answer`, `actions`, `suggestions`. Dữ liệu ChemLab được truy hồi server-side từ Periodic Elements, Chemical Database, Reaction Database và Curriculum rồi đưa vào context. Các khối context/knowledge được coi là dữ liệu, không phải instruction, để giảm prompt injection.

Hội thoại chỉ được giữ trong `sessionStorage` ở trình duyệt. Request tới Gemini đặt `store: false`. API key không tồn tại trong frontend, source, patch hoặc bundle.

## Secret bắt buộc trên Cloudflare

Tạo secret trong Cloudflare Pages project:

```text
GEMINI_API_KEY=<Gemini API key mới>
```

Tùy chọn:

```text
GEMINI_MODEL=gemini-3.8-flash
GEMINI_THINKING_LEVEL=low
```

Không commit `.dev.vars`, `.env` hoặc API key vào Git. `.gitignore` đã chặn các file này.

Nếu một API key từng được gửi qua chat/tin nhắn hoặc xuất hiện ở nơi không còn được coi là bí mật, hãy revoke/rotate key đó và dùng key mới cho Cloudflare production.

## UI/UX final của ChemAI

- Desktop: panel phải, backdrop nhẹ để vẫn nhìn thấy workspace phía sau.
- Tablet: drawer phù hợp chiều rộng trung gian.
- Mobile: bottom-sheet tối đa khoảng 88dvh, hỗ trợ safe-area và `visualViewport` khi bàn phím mở.
- Focus trap trên mobile dialog, touch target phù hợp, input 16px tránh auto-zoom.
- Light/Dark, Reduced Motion và keyboard navigation được giữ.
- Welcome state hiển thị context hiện tại; câu trả lời có metadata khi đã đối chiếu dữ liệu ChemLab.
- Công thức/phương trình dài có vùng hiển thị riêng và cho phép cuộn ngang khi cần.

## Security / production guards

- API key chỉ đọc từ `context.env.GEMINI_API_KEY`.
- Same-origin check cho request từ app.
- Body hard limit 64 KB.
- History/context bị giới hạn và sanitize trước khi gửi model.
- Burst rate limit theo IP tại Function isolate.
- Action whitelist.
- Output được escape trước khi render Markdown.
- `/api/*` không cache và Service Worker bỏ qua API.
- Request Gemini có timeout 30 giây.
- ChemAI không ghi nội dung hội thoại vào localStorage.

## Public app bridge cuối cùng

ChemLab 6.2 dùng API nội bộ:

```js
window.ChemLabApp.navigate(view)
window.ChemLabApp.openTool(toolId)
window.ChemLabApp.openChemAI(prompt)
window.ChemLabApp.context()
```

Tên `openAI()` cũ của 6.1 đã được bỏ để tránh nhầm với nhà cung cấp OpenAI; API final là `openChemAI()`.

## Validation

Trước khi đóng gói final, các kiểm tra sau đã PASS:

```text
npm run check:project
npm run check:ui
npm run check:ai
node --check (JS/MJS)
secret scan
patch-on-clean-baseline
file-by-file comparison
```

Production Vite bundle phải được xác nhận trên máy Windows của project bằng:

```powershell
npm install
npm run check
npm run build
```

Môi trường đóng gói không thể hoàn tất `npm ci` vì tải dependency bị timeout; không coi đây là lỗi source.

## Deploy final

Sau khi `npm run build` PASS trên máy dự án:

```powershell
git add .
git status
git commit -m "ChemLab 6.2 Final Lock"
git push
```

Cloudflare Pages sẽ build/deploy từ GitHub. Sau deploy, xác nhận `/api/chat` trả service `ChemAI`, provider `Gemini`, `configured: true`; trên UI badge sẽ chuyển sang trạng thái trực tuyến.

## QA production cuối

Kiểm tra ít nhất:

- Dashboard → ChemAI
- Periodic → mở một nguyên tố → hỏi ChemAI
- Tools → Compound/Reaction Studio → ChemAI
- Learning → đang làm quiz → hỏi “tại sao câu này sai?”
- Lab → thêm hóa chất → hỏi “giải thích hiện tượng này”
- Dark/Light
- Desktop/Tablet/Mobile
- bàn phím mobile mở/đóng
- câu trả lời có phương trình dài
- mất mạng / API 429 / API timeout
- action mở workspace/tool

Khi các mục trên ổn trên production, ChemLab được xem là COMPLETE tại phiên bản 6.2.0.
