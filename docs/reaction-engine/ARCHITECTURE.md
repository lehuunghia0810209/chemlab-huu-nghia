# ChemLab Reaction Engine 2.0

## Luồng dữ liệu

```
chemicals.js (catalog) ─┐
reactions.js (96 phản ứng, dữ liệu hiện tượng) ─┤
                                              ▼
reactionEngine.js — điều kiện kích hoạt (chất có mặt, nhiệt độ, thứ tự)
                                              ▼
Lab state: nhật ký additions[{id, volume}] (nằm trong snapshot → undo/guided restore)
                                              ▼
engine/simulate.js — trạng thái hóa học tất định từ nhật ký
  ├─ stoichiometry.js   số mol · chất hạn chế · dư · sản phẩm · tan lại (lưỡng tính)
  ├─ engine/stepwise.js CO₃²⁻/SO₃²⁻ + HCl hai nấc, theo thứ tự thêm
  ├─ concentrations.js  0,1 M chỉ cho chất đã xác minh độ tan
  └─ acidBase.js        pH định lượng chỉ khi mọi chất thuộc danh sách đã xác minh
                                              ▼
virtualLab.js — panel Định lượng, quan sát, màu dung dịch
                                              ▼
beakerEffects.js — kết tủa/bọt khí chỉ vẽ theo trạng thái (không tự tạo số mol)
```

Kiểm định: `engine/profiles.js` phân loại mọi phản ứng; `engine/precipitates.js` là bảng duy nhất về chất kết tủa (màu vẽ + tên màu SGK). `npm run report:reactions` sinh `REACTION_COVERAGE.md`; `npm run check:chem` báo lỗi nếu ma trận cũ hơn dữ liệu.

## Quy tắc

- Một nguồn sự thật: nhật ký thao tác. Undo/reset chỉ đổi nhật ký → không trừ lượng chất hai lần, không có lượng âm (kiểm thử bảo toàn nguyên tố trên đầu ra engine và 200 chuỗi ngẫu nhiên cho mô hình hai nấc).
- Phản ứng dùng chung một chất với phản ứng khác → không tính riêng (định tính, có ghi lý do).
- Bọt khí = lượng khí *mới* sinh ra theo engine; kết tủa vẽ tỉ lệ số mol (minh họa, có ghi chú).
- Màu dung dịch sau phản ứng định lượng = màu các chất *còn tan*; phản ứng có dữ liệu màu riêng giữ màu của dữ liệu.
- Dung dịch không màu vẽ trong suốt; huyền phù và dung dịch có màu vẽ đục.
- Phản ứng không có hiện tượng không vẽ gì (đã bỏ hiệu ứng "flash" chung).

## Thay đổi hợp đồng kiểm thử

- "Na₂CO₃ + HCl giữ định tính" (EV-02e) được thay bằng kiểm thử nấc 1 / nấc 2 / đảo thứ tự, vì phản ứng nay được mô hình hóa.
- Bước Guided g11-l7 yêu cầu HCl dư (`minAmount: 50`): với tỉ lệ 1:1 mô hình hai nấc chỉ tạo HSO₃⁻, bài cũ hoàn thành bước trong khi cốc không có khí.

## Giới hạn đã biết

- Định lượng chỉ cho 36/96 phản ứng (acid/base mạnh, muối tan đã xác minh độ tan). Acid/base yếu, chất rắn, chất hữu cơ, chất oxi hóa chưa có nồng độ → định tính.
- Mô hình coi phản ứng xảy ra hoàn toàn và khí thoát hết; không có động học (tốc độ, thời gian là minh họa).
- Hai nấc carbonate/sulfite là mô hình lý tưởng hóa (thực tế có thể thoát ít khí sớm, khí còn hòa tan).
- Cu²⁺ + NH₃: chưa có nồng độ NH₃ → hiện màu phức ngay, không qua giai đoạn Cu(OH)₂.
- Fe³⁺ + SCN⁻ và este hóa: cân bằng, không tính lượng chất.
- pH khi có muối thủy phân/phản ứng tiêu thụ H⁺/OH⁻: chỉ hiện định tính.
- Catalog chưa có phản ứng H₂SO₄/HNO₃ + carbonate; nếu trộn, không có phản ứng nào được kích hoạt.
- Màu pha trộn của các dung dịch có màu khi không phản ứng là pha loãng RGB gần đúng.
