# ChemLab Remake — UX Problems (Phase 0)

Dựa trên screenshots `baseline/*` và đọc markup trong source. Mức: P0 critical · P1 high · P2 medium · P3 low.

## App shell & navigation

| ID | Mức | Vấn đề | Bằng chứng |
|---|---|---|---|
| U1 | P1 | Badge "HN" cố định góc dưới phải đè lên launcher ChemAI (desktop) và mục "Thí nghiệm" của bottom nav (mobile) | `home-1440.png`, `home-390.png` |
| U2 | P2 | Hai lớp floating ở góc dưới phải trên mobile (ChemAI orb + HN) chồng lên nội dung và bottom nav | `*-390.png` |
| U3 | P2 | Topbar mobile có một nút settings rỗng (không thấy icon) | `home-390.png` |
| U4 | P2 | Tiêu đề trùng lặp: topbar hiển thị tên view, ngay dưới là hero card lặp lại cùng tên view | mọi view desktop |
| U5 | P2 | Sidebar 112px chỉ có 5 mục + nhãn "KHÁM PHÁ", phần lớn chiều cao trống; trạng thái "Sẵn sàng" không mang thông tin hữu ích cho học sinh | `*-1440.png` |
| U6 | P3 | Nhãn lẫn Anh/Việt: "Learning", "Learning Mode", "TOOL CENTER", "PERIODIC EXPLORER", "CHEMLAB TOOLBOX" | `main.js` VIEW_INFO, COMMANDS |

## Visual system

| ID | Mức | Vấn đề |
|---|---|---|
| V1 | P2 | Palette tím/violet chiếm ưu thế, không thống nhất; nhiều thành phần dùng nút đen (vd. "Đặt lại" ở Balancer) trong light mode |
| V2 | P2 | Mỗi khu vực một kiểu card, bo góc, viền, độ đậm khác nhau (hero bo 32px, card 16px, chip 12px…) |
| V3 | P2 | Typography không nhất quán: hero dashboard ~64px, eyebrow chữ hoa giãn rộng ~11px, nhãn bảng tuần hoàn 10–11px |
| V4 | P2 | `<meta name="color-scheme" content="dark">` trong khi light mode là mặc định theo hệ thống → form control native có thể render sai màu |

## Workspaces

| ID | Mức | Vấn đề |
|---|---|---|
| W1 | P1 | Tool Center không có bộ chọn công cụ (lỗi B1, đã sửa) |
| W2 | P2 | Bảng tuần hoàn trên mobile 390px chỉ thấy 4 cột; không có chế độ xem tập trung theo nhóm/chu kỳ |
| W3 | P2 | Virtual Lab: mô tả phản ứng bằng tiếng Anh (95/96) trong giao diện tiếng Việt |
| W4 | P2 | Virtual Lab mobile: hero + chế độ + bộ lọc chiếm toàn bộ màn hình đầu, không thấy cốc thí nghiệm |
| W5 | P2 | Learning: 3 tầng card lồng nhau, nhiều chỉ số "0" lặp lại (0%, 0/77, 0 bài học, 0 hoạt động) khi người dùng mới |
| W6 | P2 | Dashboard: hero chiếm gần hết màn hình đầu tiên; 3 thẻ thống kê đều là 0% với người dùng mới |

## 3D

| ID | Mức | Vấn đề |
|---|---|---|
| G1 | P1 (khoa học) | Orbital f tô sai pha; orbital dựng bằng ellipsoid không phản ánh hàm sóng; orbital "ngoài cùng" sai với nguyên tố ngoại lệ Aufbau |
| G2 | P2 | Không pause render khi tab ẩn / canvas ngoài viewport; không fallback khi mất WebGL context |
| G3 | P2 | Không tôn trọng `prefers-reduced-motion` trong các scene 3D |
