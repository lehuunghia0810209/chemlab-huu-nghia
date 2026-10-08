# ChemLab 5.2.1 — Stabilization

## Thay đổi
- Đồng bộ version production về 5.2.1.
- Thêm `src/appMeta.js` làm metadata runtime thống nhất.
- Thêm `scripts/sync-release.mjs` để đồng bộ version từ `package.json` sang app/PWA.
- Thêm `scripts/validate-project.mjs` để kiểm tra chemical, reaction, curriculum và Guided Lab trước build.
- `npm run build` giờ tự chạy release sync + validation trước Vite build.
- Thêm `public/_headers` cho Cloudflare Pages, gồm cache policy cho Service Worker, manifest, HTML và hashed assets.
- Loại bỏ `vercel.json` khỏi baseline Cloudflare.
- Đồng bộ nhãn version trong Main UI, Virtual Lab, Chemistry Calculator, Compound Studio, Reaction Studio và Atom 3D.

## Kiểm tra
- JavaScript syntax: PASS.
- Relative imports: PASS.
- Project validation: PASS.
- 103 chemicals.
- 96 reactions.
- 21 chapters / 77 lessons.
- 78 Guided Activities / 372 Guided Steps.
- 188 Guided quiz/prediction questions.

## Lưu ý build
Môi trường phân tích không thể hoàn tất `npm ci` vì dependency từ archive ban đầu là Windows-oriented và cài Linux mới bị giới hạn kết nối. Source đã qua syntax + integrity checks; hãy chạy `npm install` hoặc `npm ci`, sau đó `npm run build` trên máy Windows/repo Cloudflare để xác nhận bundle production.
