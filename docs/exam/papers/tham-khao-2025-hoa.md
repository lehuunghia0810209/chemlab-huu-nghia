# Kiểm định đề `tham-khao-2025-hoa`

**Đề thi tham khảo Kỳ thi tốt nghiệp THPT từ năm 2025 — Hóa học** (Bộ GD&ĐT).

| Mục | Giá trị |
| --- | --- |
| Nguồn công bố | Cục Quản lý chất lượng, [trang công bố 18/10/2024](https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/de-thi-tham-khao-ky-thi-tot-nghiep-thpt-tu-nam-2025-159.html) → thư mục Google Drive chính thức → `04_HoaHoc.pdf` |
| Tệp gốc | 5 trang ảnh quét, có dấu Bộ GD&ĐT; trang 1–4 đề, trang 5 “ĐÁP ÁN ĐỀ THAM KHẢO”. SHA-256 `3f27e78f6d7afe590e481f182429d7770f907743b8dd6551a0da3fe22c63affb` (tệp không lưu trong repository) |
| Cấu trúc | 18 + 4 + 6 câu, 50 phút — khớp blueprint `thpt-2025-hoa` |
| Quyền sử dụng | `OWNER_ATTESTED` — chủ dự án xác nhận được phép sử dụng; văn bản cấp phép không được agent xem (bảo mật) |
| Đáp án | Chính thức (trang 5) — nhập hai lần độc lập: dữ liệu đề và bảng trong `scripts/test-exam-papers.mjs` |
| Lời giải | Lời giải tham khảo do ChemLab biên soạn (`solution.official = false`) |
| Phân loại chương | ChemLab gán theo nội dung (`meta.status = internal`); đề không công bố mức độ từng câu nên không gán |

## Phương pháp

1. Tải tệp gốc từ thư mục chính thức; render từng trang bằng pdf.js; đọc trực tiếp ảnh trang.
2. Chép nguyên văn: thứ tự câu, thứ tự phương án, số liệu, kí hiệu (chỉ số dưới/trên bằng kí tự Unicode, Δ_{f}H°_{298} bằng markup sub/sup). Bốn hình (cơ chế câu 13, bảng histidine câu 16, đồ thị Phần II câu 2, phương trình Phần II câu 3) là ảnh cắt từ bản gốc, có mô tả `alt`.
3. Tự giải độc lập toàn bộ 28 câu và so với đáp án chính thức: **28/28 khớp**. Đáp án số Phần III câu 1, 2, 5, 6 được tính lại bằng mã trong test.
4. Kiểm thử: `npm run check:exam` (cấu trúc, đáp án hai lần nhập, điểm tối đa = 10, ảnh tồn tại và đúng kích thước); browser journey R (làm bài, reload, nộp, điểm, xem lại, 390 px light/dark); axe.

## Checklist từng câu

Kí hiệu: ✓ đã đối chiếu với bản gốc. “Hình” = ảnh cắt từ bản gốc; “Bảng” = bảng chép lại dạng văn bản.

| Câu | Nội dung | Phương án / ý | Hình, bảng | Đáp án chính thức | Lời giải độc lập | Hiển thị |
| --- | --- | --- | --- | --- | --- | --- |
| I.1 | ✓ | ✓ A–D | — | A | ✓ ăn mòn hóa học | ✓ |
| I.2 | ✓ | ✓ | — | A | ✓ | ✓ |
| I.3 | ✓ | ✓ công thức polymer dạng (−…−)ₙ | — | D | ✓ chloroprene | ✓ |
| I.4 | ✓ | ✓ | — | A | ✓ | ✓ |
| I.5 | ✓ | ✓ chỉ số trên | — | B | ✓ Na⁺ 1s²2s²2p⁶ | ✓ |
| I.6 | ✓ “**không**” in đậm | ✓ | — | D | ✓ | ✓ |
| I.7 | ✓ 4 phát biểu (a)–(d) | ✓ | — | C | ✓ (a) sai | ✓ |
| I.8 | ✓ | ✓ | — | A | ✓ NH₃ thoát ra | ✓ |
| I.9 | ✓ | ✓ | — | B | ✓ M = 74 | ✓ |
| I.10 | ✓ | ✓ | — | B | ✓ | ✓ |
| I.11 | ✓ | ✓ | — | B | ✓ | ✓ |
| I.12 | ✓ | ✓ | — | A | ✓ | ✓ |
| I.13 | ✓ phương trình + điều kiện | ✓ | Hình cơ chế | D | ✓ ethylene có 5 liên kết σ | ✓ |
| I.14 | ✓ | ✓ | — | B | ✓ | ✓ |
| I.15 | ✓ | ✓ | — | A | ✓ | ✓ |
| I.16 | ✓ | ✓ | Hình bảng histidine | D | ✓ điện tích +1/0/−1 | ✓ cuộn ngang ở 390 px |
| I.17 | ✓ lời dẫn chung 17–18 | ✓ | Bảng E° | D | ✓ −0,13 < E° < 0,80 | ✓ |
| I.18 | ✓ lời dẫn chung 17–18 | ✓ | Bảng E° | B | ✓ 0,80 + 0,76 = 1,56 V | ✓ |
| II.1 | ✓ 4 bước thí nghiệm, m₁ | ✓ a–d | — | Đ Đ S S | ✓ 0,29 g > ~0,11 g tạp chất | ✓ |
| II.2 | ✓ Bước 1–3 | ✓ a–d | Hình đồ thị | S S Đ S | ✓ t(pH 7) = 60 s nhỏ nhất | ✓ |
| II.3 | ✓ | ✓ a–d | Hình phương trình; bảng số sóng IR | S Đ Đ Đ | ✓ 3350 cm⁻¹ chỉ thuộc O–H alcohol | ✓ |
| II.4 | ✓ | ✓ a–d | — | Đ S S Đ | ✓ phức aqua, liên kết cho – nhận | ✓ |
| III.1 | ✓ | — | — | 10,7 | ✓ 10,2 / 0,954 (test tính lại) | ✓ |
| III.2 | ✓ | — | — | 322 | ✓ (test tính lại) | ✓ |
| III.3 | ✓ 4 phương trình + điều kiện | — | — | 2134 | ✓ | ✓ |
| III.4 | ✓ | — | — | 7 | ✓ 4 bậc 1 + 3 bậc 2 | ✓ |
| III.5 | ✓ 2 phương trình | — | Bảng Δ_{f}H°_{298} | 1,03 | ✓ (test tính lại) | ✓ |
| III.6 | ✓ | — | — | 86,1 | ✓ (test tính lại) | ✓ |

## Còn chờ con người

- Giáo viên Hóa học đọc soát lời giải tham khảo và phân loại chương (xem `docs/learning/TEACHER_REVIEW_REGISTER.md`).
- Người thứ hai so lại bản số hóa với tệp gốc (agent đã tự so; chưa có người thứ hai).
