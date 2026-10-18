# Reaction Coverage Matrix

Sinh tự động bởi `npm run report:reactions` từ `src/lab/reactions.js` và `src/lab/engine/profiles.js`. Không sửa tay — `npm run check:chem` báo lỗi khi tài liệu cũ hơn dữ liệu.

Tổng: **96** phản ứng (ID duy nhất: 96).

| Mức hỗ trợ | Số phản ứng | Ý nghĩa |
|---|---|---|
| VERIFIED_QUANTITATIVE | 36 | Tính số mol, chất hạn chế, sản phẩm từ nồng độ đã xác minh (0,1 M) và phương trình đã kiểm tra |
| CONDITIONAL | 27 | Hiện tượng định tính, phụ thuộc điều kiện (nhiệt độ, chất dư, xúc tác) — xem cột Giới hạn |
| VERIFIED_QUALITATIVE | 33 | Hiện tượng định tính đã kiểm tra; thiếu dữ liệu để tính lượng chất |
| UNSUPPORTED | 0 | Chưa đủ căn cứ mô phỏng |
| INVALID | 0 | Dữ liệu sai (không được kích hoạt khi còn lỗi) |

Mọi phản ứng đều qua kiểm định toàn catalog trong `npm run check:chem`: chất phản ứng tồn tại, hiệu ứng hợp lệ, phương trình bảo toàn nguyên tố và điện tích (trừ phương trình chữ), ↓/↑ khớp hiệu ứng kết tủa/khí, màu kết tủa khớp bảng chất kết tủa, không dùng hiệu ứng chung chung. Cột "Kịch bản" đánh dấu phản ứng có thêm kiểm thử tình huống riêng.

| ID | Phương trình | Nhóm | Hiện tượng | Điều kiện | Mức hỗ trợ | Giới hạn | Kịch bản |
|---|---|---|---|---|---|---|---|
| `hcl-naoh` | HCl + NaOH → NaCl + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `hcl-koh` | HCl + KOH → KCl + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUANTITATIVE | — |  |
| `h2so4-naoh` | H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `h2so4-koh` | H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUANTITATIVE | — |  |
| `hno3-naoh` | HNO₃ + NaOH → NaNO₃ + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUANTITATIVE | — |  |
| `h3po4-naoh` | H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: H₃PO₄ |  |
| `methanoic-naoh` | HCOOH + NaOH → HCOONa + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: HCOOH |  |
| `ethanoic-naoh` | CH₃COOH + NaOH → CH₃COONa + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: CH₃COOH | ✓ |
| `propanoic-naoh` | C₂H₅COOH + NaOH → C₂H₅COONa + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₂H₅COOH |  |
| `benzoic-naoh` | C₆H₅COOH + NaOH → C₆H₅COONa + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₆H₅COOH |  |
| `oxalic-naoh` | H₂C₂O₄ + 2NaOH → Na₂C₂O₄ + 2H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: H₂C₂O₄ |  |
| `hcl-nh3` | HCl + NH₃ → NH₄Cl | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: NH₃(aq) |  |
| `cuso4-naoh` | CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄ | precipitation | kết tủa Cu(OH)2 | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `cucl2-naoh` | CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl | precipitation | kết tủa Cu(OH)2 | — | VERIFIED_QUANTITATIVE | — |  |
| `fecl3-naoh` | FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl | precipitation | kết tủa Fe(OH)3 | — | VERIFIED_QUANTITATIVE | — |  |
| `feso4-naoh` | FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄ | precipitation | kết tủa Fe(OH)2 | — | VERIFIED_QUANTITATIVE | — |  |
| `fecl2-naoh` | FeCl₂ + 2NaOH → Fe(OH)₂↓ + 2NaCl | precipitation | kết tủa Fe(OH)2 | — | VERIFIED_QUANTITATIVE | — |  |
| `mgcl2-naoh` | MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl | precipitation | kết tủa Mg(OH)2 | — | VERIFIED_QUANTITATIVE | — |  |
| `znso4-naoh` | ZnSO₄ + 2NaOH → Zn(OH)₂↓ + Na₂SO₄ | precipitation, amphoteric, dissolution, multi-step | kết tủa Zn(OH)2; tan lại; nhiều nấc | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `alcl3-naoh` | AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl | precipitation, amphoteric, dissolution, multi-step | kết tủa Al(OH)3; tan lại; nhiều nấc | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `agno3-nacl` | AgNO₃ + NaCl → AgCl↓ + NaNO₃ | precipitation | kết tủa AgCl | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `agno3-kcl` | AgNO₃ + KCl → AgCl↓ + KNO₃ | precipitation | kết tủa AgCl | — | VERIFIED_QUANTITATIVE | — |  |
| `agno3-kbr` | AgNO₃ + KBr → AgBr↓ + KNO₃ | precipitation | kết tủa AgBr | — | VERIFIED_QUANTITATIVE | — |  |
| `agno3-ki` | AgNO₃ + KI → AgI↓ + KNO₃ | precipitation | kết tủa AgI | — | VERIFIED_QUANTITATIVE | — |  |
| `pbno3-ki` | Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃ | precipitation | kết tủa PbI2 | — | VERIFIED_QUANTITATIVE | — |  |
| `bacl2-na2so4` | BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl | precipitation | kết tủa BaSO4 | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `bano3-na2so4` | Ba(NO₃)₂ + Na₂SO₄ → BaSO₄↓ + 2NaNO₃ | precipitation | kết tủa BaSO4 | — | VERIFIED_QUANTITATIVE | — |  |
| `pbno3-na2so4` | Pb(NO₃)₂ + Na₂SO₄ → PbSO₄↓ + 2NaNO₃ | precipitation | kết tủa PbSO4 | — | VERIFIED_QUANTITATIVE | — |  |
| `cacl2-na2co3` | CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl | precipitation | kết tủa CaCO3 | — | VERIFIED_QUANTITATIVE | — |  |
| `mgcl2-na2co3` | MgCl₂ + Na₂CO₃ → MgCO₃↓ + 2NaCl | precipitation | kết tủa MgCO3 | — | VERIFIED_QUALITATIVE | Kết tủa thực tế là magnesium carbonate base, không đúng công thức MgCO₃, nên ChemLab không tính khối lượng. Kết tủa thực tế là magnesium carbonate base, không đúng công thức MgCO₃, nên ChemLab không tính khối lượng. |  |
| `bacl2-na2co3` | BaCl₂ + Na₂CO₃ → BaCO₃↓ + 2NaCl | precipitation | kết tủa BaCO3 | — | VERIFIED_QUANTITATIVE | — |  |
| `cuso4-na2co3` | CuSO₄ + Na₂CO₃ → CuCO₃↓ + Na₂SO₄ | precipitation | kết tủa CuCO3 | — | VERIFIED_QUALITATIVE | Kết tủa thực tế là copper(II) carbonate base, không đúng công thức CuCO₃, nên ChemLab không tính khối lượng. Kết tủa thực tế là copper(II) carbonate base, không đúng công thức CuCO₃, nên ChemLab không tính khối lượng. | ✓ |
| `agno3-na2co3` | 2AgNO₃ + Na₂CO₃ → Ag₂CO₃↓ + 2NaNO₃ | precipitation | kết tủa Ag2CO3 | — | VERIFIED_QUANTITATIVE | — |  |
| `cacl2-na3po4` | 3CaCl₂ + 2Na₃PO₄ → Ca₃(PO₄)₂↓ + 6NaCl | precipitation | kết tủa Ca3(PO4)2 | — | VERIFIED_QUANTITATIVE | — |  |
| `fecl3-na3po4` | FeCl₃ + Na₃PO₄ → FePO₄↓ + 3NaCl | precipitation | kết tủa FePO4 | — | VERIFIED_QUANTITATIVE | — |  |
| `cuso4-na2s` | CuSO₄ + Na₂S → CuS↓ + Na₂SO₄ | precipitation | kết tủa CuS | — | VERIFIED_QUANTITATIVE | — |  |
| `fecl2-na2s` | FeCl₂ + Na₂S → FeS↓ + 2NaCl | precipitation | kết tủa FeS | — | VERIFIED_QUANTITATIVE | — |  |
| `agno3-na2s` | 2AgNO₃ + Na₂S → Ag₂S↓ + 2NaNO₃ | precipitation | kết tủa Ag2S | — | VERIFIED_QUANTITATIVE | — |  |
| `na2co3-hcl` | Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑ | gas evolution, multi-step | khí CO₂; nhiều nấc | — | VERIFIED_QUANTITATIVE | Mô hình hai nấc lý tưởng theo thứ tự thêm; khí coi như thoát hết. | ✓ |
| `nahco3-hcl` | NaHCO₃ + HCl → NaCl + H₂O + CO₂↑ | gas evolution, multi-step | khí CO₂; nhiều nấc | — | VERIFIED_QUANTITATIVE | Mô hình hai nấc lý tưởng theo thứ tự thêm; khí coi như thoát hết. | ✓ |
| `caco3-hcl` | CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑ | gas evolution | khí CO₂ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: CaCO₃ |  |
| `mgco3-hcl` | MgCO₃ + 2HCl → MgCl₂ + H₂O + CO₂↑ | gas evolution | khí CO₂ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: MgCO₃ |  |
| `na2so3-hcl` | Na₂SO₃ + 2HCl → 2NaCl + H₂O + SO₂↑ | gas evolution, multi-step | khí SO₂; nhiều nấc | — | VERIFIED_QUANTITATIVE | Mô hình hai nấc lý tưởng theo thứ tự thêm; khí coi như thoát hết. |  |
| `nh4cl-naoh` | NH₄Cl + NaOH → NH₃↑ + NaCl + H₂O | gas evolution | khí NH₃ | đun nóng, ≥ 45 °C | VERIFIED_QUANTITATIVE | NH₃ tan tốt trong nước: cần đun nóng để khí thoát ra. Mô hình coi toàn bộ NH₃ thoát khỏi cốc. |  |
| `ethanoic-nahco3` | CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑ | gas evolution, acid–base | khí CO₂ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: CH₃COOH |  |
| `propanoic-nahco3` | C₂H₅COOH + NaHCO₃ → C₂H₅COONa + H₂O + CO₂↑ | gas evolution, acid–base | khí CO₂ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₂H₅COOH |  |
| `methanoic-nahco3` | HCOOH + NaHCO₃ → HCOONa + H₂O + CO₂↑ | gas evolution, acid–base | khí CO₂ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: HCOOH |  |
| `benzoic-nahco3` | C₆H₅COOH + NaHCO₃ → C₆H₅COONa + H₂O + CO₂↑ | gas evolution, acid–base | khí CO₂ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₆H₅COOH |  |
| `h2o2-heat` | 2H₂O₂ → 2H₂O + O₂↑ | gas evolution, redox, decomposition | khí O₂ | đun nóng, ≥ 55 °C | CONDITIONAL | Thiếu nồng độ: H₂O₂ H₂O₂ phân hủy chậm khi đun; trong thực hành thường dùng xúc tác MnO₂. Lượng O₂ không được tính. |  |
| `fecl3-kscn` | Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ | complex formation, reversible/equilibrium | đổi màu; thuận nghịch | — | CONDITIONAL | Đây là phản ứng thuận nghịch (cân bằng hóa học), không xảy ra hoàn toàn, nên ChemLab không tính lượng chất. Cân bằng tạo phức; màu đỏ máu đậm nhạt theo nồng độ, không tính được khi chưa có hằng số cân bằng đã kiểm chứng. | ✓ |
| `cuso4-nh3` | Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺ | complex formation, dissolution | đổi màu; tan lại | — | CONDITIONAL | Thiếu nồng độ: NH₃(aq) Cần NH₃ dư: ít NH₃ chỉ tạo Cu(OH)₂ xanh lam, NH₃ dư mới hòa tan thành phức [Cu(NH₃)₄]²⁺ xanh thẫm. Catalog chưa có nồng độ NH₃ nên mô phỏng hiện màu phức ngay. |  |
| `cucl2-nh3` | Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺ | complex formation, dissolution | đổi màu; tan lại | — | CONDITIONAL | Thiếu nồng độ: NH₃(aq) Cần NH₃ dư: ít NH₃ chỉ tạo Cu(OH)₂ xanh lam, NH₃ dư mới hòa tan thành phức [Cu(NH₃)₄]²⁺ xanh thẫm. Catalog chưa có nồng độ NH₃ nên mô phỏng hiện màu phức ngay. |  |
| `phenol-fecl3` | C₆H₅OH + Fe³⁺ → phức chất màu tím | complex formation | đổi màu | — | VERIFIED_QUALITATIVE | Phản ứng được mô phỏng định tính. | ✓ |
| `starch-iodine` | Hồ tinh bột + I₂ → hợp chất màu xanh tím | complex formation | đổi màu | — | VERIFIED_QUALITATIVE | Phản ứng được mô phỏng định tính. | ✓ |
| `iodine-thiosulfate` | I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻ | redox | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: I₂ |  |
| `ethene-bromine` | C₂H₄ + Br₂ → C₂H₄Br₂ | organic addition/substitution | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₂H₄, Br₂(aq) |  |
| `propene-bromine` | C₃H₆ + Br₂ → C₃H₆Br₂ | organic addition/substitution | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₃H₆, Br₂(aq) |  |
| `ethyne-bromine` | C₂H₂ + 2Br₂ → C₂H₂Br₄ | organic addition/substitution | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₂H₂, Br₂(aq) |  |
| `phenol-bromine` | C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ + 3HBr | precipitation, organic addition/substitution | kết tủa C6H2Br3OH; đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₆H₅OH, Br₂(aq) |  |
| `ethene-kmno4` | 3C₂H₄ + 2KMnO₄ + 4H₂O → 3C₂H₄(OH)₂ + 2MnO₂↓ + 2KOH | precipitation, redox | kết tủa MnO2; đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₂H₄, KMnO₄ |  |
| `propene-kmno4` | 3C₃H₆ + 2KMnO₄ + 4H₂O → 3C₃H₆(OH)₂ + 2MnO₂↓ + 2KOH | precipitation, redox | kết tủa MnO2; đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₃H₆, KMnO₄ |  |
| `glucose-cu-room` | 2C₆H₁₂O₆ + Cu(OH)₂ → (C₆H₁₁O₆)₂Cu + 2H₂O | complex formation, dissolution | đổi màu; tan lại | ≤ 50 °C | CONDITIONAL | Thiếu nồng độ: C₆H₁₂O₆ Cần Cu(OH)₂ mới điều chế trong NaOH dư. |  |
| `glucose-cu-hot` | C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → C₆H₁₁O₇Na + Cu₂O↓ + 3H₂O | precipitation, redox | kết tủa Cu2O | đun nóng, ≥ 65 °C | CONDITIONAL | Thiếu nồng độ: C₆H₁₂O₆ |  |
| `fructose-cu-room` | 2C₆H₁₂O₆ + Cu(OH)₂ → (C₆H₁₁O₆)₂Cu + 2H₂O | complex formation, dissolution | đổi màu; tan lại | ≤ 50 °C | CONDITIONAL | Thiếu nồng độ: C₆H₁₂O₆ Cần Cu(OH)₂ mới điều chế trong NaOH dư. |  |
| `fructose-cu-hot` | C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → C₆H₁₁O₇Na + Cu₂O↓ + 3H₂O | precipitation, redox | kết tủa Cu2O | đun nóng, ≥ 65 °C | CONDITIONAL | Thiếu nồng độ: C₆H₁₂O₆ |  |
| `maltose-cu-room` | 2C₁₂H₂₂O₁₁ + Cu(OH)₂ → (C₁₂H₂₁O₁₁)₂Cu + 2H₂O | complex formation, dissolution | đổi màu; tan lại | ≤ 50 °C | CONDITIONAL | Thiếu nồng độ: C₁₂H₂₂O₁₁ Cần Cu(OH)₂ mới điều chế trong NaOH dư. |  |
| `maltose-cu-hot` | Đường khử + Cu(OH)₂ (OH⁻, t°) → Cu₂O↓ đỏ gạch | precipitation, redox | kết tủa Cu2O | đun nóng, ≥ 65 °C | CONDITIONAL | Phản ứng được mô phỏng định tính. | ✓ |
| `lactose-cu-room` | 2C₁₂H₂₂O₁₁ + Cu(OH)₂ → (C₁₂H₂₁O₁₁)₂Cu + 2H₂O | complex formation, dissolution | đổi màu; tan lại | ≤ 50 °C | CONDITIONAL | Thiếu nồng độ: C₁₂H₂₂O₁₁ Cần Cu(OH)₂ mới điều chế trong NaOH dư. |  |
| `lactose-cu-hot` | Đường khử + Cu(OH)₂ (OH⁻, t°) → Cu₂O↓ đỏ gạch | precipitation, redox | kết tủa Cu2O | đun nóng, ≥ 65 °C | CONDITIONAL | Phản ứng được mô phỏng định tính. | ✓ |
| `glycerol-cu` | 2C₃H₅(OH)₃ + Cu(OH)₂ → [C₃H₅(OH)₂O]₂Cu + 2H₂O | complex formation, dissolution | đổi màu; tan lại | — | CONDITIONAL | Thiếu nồng độ: C₃H₈O₃ Cần Cu(OH)₂ mới điều chế trong NaOH. |  |
| `glycol-cu` | 2C₂H₄(OH)₂ + Cu(OH)₂ → [C₂H₄(OH)O]₂Cu + 2H₂O | complex formation, dissolution | đổi màu; tan lại | — | CONDITIONAL | Thiếu nồng độ: HOCH₂CH₂OH Cần Cu(OH)₂ mới điều chế trong NaOH. |  |
| `albumin-biuret` | Protein + Cu(OH)₂ (OH⁻) → phức chất màu tím | complex formation, dissolution | đổi màu; tan lại | — | CONDITIONAL | Phản ứng được mô phỏng định tính. Phản ứng màu biuret trong môi trường kiềm. | ✓ |
| `ethanol-dichromate` | C₂H₅OH + [O] → CH₃CHO + H₂O | redox | đổi màu | đun nóng, ≥ 50 °C | CONDITIONAL | Thiếu nồng độ: C₂H₅OH, K₂Cr₂O₇ |  |
| `propan1ol-dichromate` | CH₃CH₂CH₂OH + [O] → CH₃CH₂CHO + H₂O | redox | đổi màu | đun nóng, ≥ 50 °C | CONDITIONAL | Thiếu nồng độ: C₃H₇OH, K₂Cr₂O₇ |  |
| `propan2ol-dichromate` | CH₃CHOHCH₃ + [O] → CH₃COCH₃ + H₂O | redox | đổi màu | đun nóng, ≥ 50 °C | CONDITIONAL | Thiếu nồng độ: CH₃CHOHCH₃, K₂Cr₂O₇ |  |
| `methanal-dichromate` | HCHO + [O] → HCOOH | redox | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: HCHO, K₂Cr₂O₇ |  |
| `ethanal-dichromate` | CH₃CHO + [O] → CH₃COOH | redox | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: CH₃CHO, K₂Cr₂O₇ |  |
| `propanal-dichromate` | C₂H₅CHO + [O] → C₂H₅COOH | redox | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₂H₅CHO, K₂Cr₂O₇ |  |
| `h2o2-kmno4-acid` | 5H₂O₂ + 2MnO₄⁻ + 6H⁺ → 5O₂↑ + 2Mn²⁺ + 8H₂O | gas evolution, redox | khí 5O₂; đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: H₂O₂, KMnO₄ |  |
| `h2o2-ki-acid` | H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O | redox | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: H₂O₂ |  |
| `feso4-kmno4-acid` | 5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O | redox | đổi màu | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: KMnO₄ |  |
| `ester-ethanol-ethanoic` | CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O | reversible/equilibrium | thuận nghịch; không có hiện tượng rõ | đun nóng, ≥ 55 °C | CONDITIONAL | Đây là phản ứng thuận nghịch (cân bằng hóa học), không xảy ra hoàn toàn, nên ChemLab không tính lượng chất. Thuận nghịch, cần H₂SO₄ đặc làm xúc tác và đun nóng. |  |
| `ester-methanol-ethanoic` | CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O | reversible/equilibrium | thuận nghịch; không có hiện tượng rõ | đun nóng, ≥ 55 °C | CONDITIONAL | Đây là phản ứng thuận nghịch (cân bằng hóa học), không xảy ra hoàn toàn, nên ChemLab không tính lượng chất. Thuận nghịch, cần H₂SO₄ đặc làm xúc tác và đun nóng. |  |
| `ester-ethanol-methanoic` | HCOOH + C₂H₅OH ⇌ HCOOC₂H₅ + H₂O | reversible/equilibrium | thuận nghịch; không có hiện tượng rõ | đun nóng, ≥ 55 °C | CONDITIONAL | Đây là phản ứng thuận nghịch (cân bằng hóa học), không xảy ra hoàn toàn, nên ChemLab không tính lượng chất. Thuận nghịch, cần H₂SO₄ đặc làm xúc tác và đun nóng. |  |
| `ethylEthanoate-naoh` | CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH | hydrolysis | không có hiện tượng rõ | đun nóng, ≥ 55 °C | CONDITIONAL | Thiếu nồng độ: CH₃COOC₂H₅ |  |
| `methylEthanoate-naoh` | CH₃COOCH₃ + NaOH → CH₃COONa + CH₃OH | hydrolysis | không có hiện tượng rõ | đun nóng, ≥ 55 °C | CONDITIONAL | Thiếu nồng độ: CH₃COOCH₃ |  |
| `ethylFormate-naoh` | HCOOC₂H₅ + NaOH → HCOONa + C₂H₅OH | hydrolysis | không có hiện tượng rõ | đun nóng, ≥ 55 °C | CONDITIONAL | Thiếu nồng độ: HCOOC₂H₅ |  |
| `triglycerideOil-naoh` | (RCOO)₃C₃H₅ + 3NaOH → C₃H₅(OH)₃ + 3RCOONa | hydrolysis | bọt | đun nóng, ≥ 60 °C | CONDITIONAL | Phản ứng được mô phỏng định tính. Bọt minh họa xà phòng tạo thành; lượng chất không tính. | ✓ |
| `sucrose-hcl-heat` | C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose) | hydrolysis | không có hiện tượng rõ | đun nóng, ≥ 60 °C | CONDITIONAL | Thiếu nồng độ: C₁₂H₂₂O₁₁ |  |
| `maltose-hcl-heat` | C₁₂H₂₂O₁₁ + H₂O → 2C₆H₁₂O₆ (glucose) | hydrolysis | không có hiện tượng rõ | đun nóng, ≥ 60 °C | CONDITIONAL | Thiếu nồng độ: C₁₂H₂₂O₁₁ |  |
| `phenol-naoh` | C₆H₅OH + NaOH → C₆H₅ONa + H₂O | acid–base | không có hiện tượng rõ | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: C₆H₅OH |  |
| `oxalic-cacl2` | H₂C₂O₄ + CaCl₂ → CaC₂O₄↓ + 2HCl | precipitation | kết tủa CaC2O4 | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: H₂C₂O₄ |  |
| `fe2so43-naoh` | Fe₂(SO₄)₃ + 6NaOH → 2Fe(OH)₃↓ + 3Na₂SO₄ | precipitation | kết tủa Fe(OH)3 | — | VERIFIED_QUALITATIVE | Thiếu nồng độ: Fe₂(SO₄)₃ |  |
| `baoh2-h2so4` | Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O | acid–base, precipitation | kết tủa BaSO4 | — | VERIFIED_QUANTITATIVE | — | ✓ |
| `cuso4-baoh2` | CuSO₄ + Ba(OH)₂ → Cu(OH)₂↓ + BaSO₄↓ | precipitation | kết tủa Cu(OH)2, BaSO4 | — | VERIFIED_QUANTITATIVE | — |  |
| `agno3-kscn` | AgNO₃ + KSCN → AgSCN↓ + KNO₃ | precipitation | kết tủa AgSCN | — | VERIFIED_QUANTITATIVE | — |  |
