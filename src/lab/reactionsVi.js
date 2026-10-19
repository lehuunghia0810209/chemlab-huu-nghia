
const NEUTRALIZATION = 'Phản ứng trung hòa'

const VI = {
  'hcl-naoh': [NEUTRALIZATION, 'Acid và base trung hòa lẫn nhau.'],
  'hcl-koh': [NEUTRALIZATION, 'Hydrochloric acid phản ứng với potassium hydroxide.'],
  'h2so4-naoh': [NEUTRALIZATION, 'Sulfuric acid phản ứng với sodium hydroxide.'],
  'h2so4-koh': [NEUTRALIZATION, 'Sulfuric acid phản ứng với potassium hydroxide.'],
  'hno3-naoh': [NEUTRALIZATION, 'Nitric acid phản ứng với sodium hydroxide.'],
  'h3po4-naoh': [NEUTRALIZATION, 'Phosphoric acid bị trung hòa.'],
  'methanoic-naoh': [NEUTRALIZATION, 'Methanoic acid phản ứng với sodium hydroxide.'],
  'ethanoic-naoh': [NEUTRALIZATION, 'Ethanoic acid phản ứng với sodium hydroxide.'],
  'propanoic-naoh': [NEUTRALIZATION, 'Propanoic acid phản ứng với sodium hydroxide.'],
  'benzoic-naoh': [NEUTRALIZATION, 'Benzoic acid phản ứng với sodium hydroxide.'],
  'oxalic-naoh': [NEUTRALIZATION, 'Oxalic acid bị trung hòa.'],
  'hcl-nh3': ['Tạo muối ammonium', 'Ammonia trung hòa hydrochloric acid.'],

  'cuso4-naoh': ['Kết tủa xanh lam', 'Tạo kết tủa copper(II) hydroxide.'],
  'cucl2-naoh': ['Kết tủa xanh lam', 'Tạo kết tủa copper(II) hydroxide.'],
  'fecl3-naoh': ['Kết tủa nâu đỏ', 'Tạo kết tủa iron(III) hydroxide.'],
  'feso4-naoh': ['Kết tủa trắng xanh', 'Tạo kết tủa iron(II) hydroxide.'],
  'fecl2-naoh': ['Kết tủa trắng xanh', 'Tạo kết tủa iron(II) hydroxide.'],
  'mgcl2-naoh': ['Kết tủa trắng', 'Tạo kết tủa magnesium hydroxide.'],
  'znso4-naoh': ['Kết tủa trắng', 'Tạo kết tủa zinc hydroxide.'],
  'alcl3-naoh': ['Kết tủa trắng', 'Tạo kết tủa aluminium hydroxide.'],
  'agno3-nacl': ['Kết tủa trắng', 'Tạo kết tủa silver chloride.'],
  'agno3-kcl': ['Kết tủa trắng', 'Tạo kết tủa silver chloride.'],
  'agno3-kbr': ['Kết tủa vàng nhạt', 'Tạo kết tủa silver bromide.'],
  'agno3-ki': ['Kết tủa vàng', 'Tạo kết tủa silver iodide.'],
  'pbno3-ki': ['Kết tủa vàng', 'Tạo kết tủa lead(II) iodide.'],
  'bacl2-na2so4': ['Kết tủa trắng', 'Tạo kết tủa barium sulfate.'],
  'bano3-na2so4': ['Kết tủa trắng', 'Tạo kết tủa barium sulfate.'],
  'pbno3-na2so4': ['Kết tủa trắng', 'Tạo kết tủa lead(II) sulfate.'],
  'cacl2-na2co3': ['Kết tủa trắng', 'Tạo kết tủa calcium carbonate.'],
  'mgcl2-na2co3': ['Kết tủa trắng', 'Tạo kết tủa magnesium carbonate.'],
  'bacl2-na2co3': ['Kết tủa trắng', 'Tạo kết tủa barium carbonate.'],
  'cuso4-na2co3': ['Kết tủa xanh lục', 'Tạo kết tủa copper(II) carbonate.'],
  'agno3-na2co3': ['Kết tủa vàng nhạt', 'Tạo kết tủa silver carbonate.'],
  'cacl2-na3po4': ['Kết tủa trắng', 'Tạo kết tủa calcium phosphate.'],
  'fecl3-na3po4': ['Kết tủa màu nhạt', 'Tạo kết tủa iron(III) phosphate.'],
  'cuso4-na2s': ['Kết tủa đen', 'Tạo kết tủa copper(II) sulfide.'],
  'fecl2-na2s': ['Kết tủa đen', 'Tạo kết tủa iron(II) sulfide.'],
  'agno3-na2s': ['Kết tủa đen', 'Tạo kết tủa silver sulfide.'],

  'na2co3-hcl': ['Giải phóng khí CO₂', 'Có hiện tượng sủi bọt khí.'],
  'nahco3-hcl': ['Giải phóng khí CO₂', 'Xuất hiện bọt khí carbon dioxide.'],
  'caco3-hcl': ['Giải phóng khí CO₂', 'Xuất hiện bọt khí carbon dioxide.'],
  'mgco3-hcl': ['Giải phóng khí CO₂', 'Xuất hiện bọt khí carbon dioxide.'],
  'na2so3-hcl': ['Giải phóng khí SO₂', 'Mô phỏng tạo bọt khí.'],
  'nh4cl-naoh': ['Giải phóng khí NH₃', 'Đun nóng làm thoát khí ammonia (mô phỏng).'],
  'ethanoic-nahco3': ['Giải phóng khí CO₂', 'Carboxylic acid gây sủi bọt khí.'],
  'propanoic-nahco3': ['Giải phóng khí CO₂', 'Carboxylic acid gây sủi bọt khí.'],
  'methanoic-nahco3': ['Giải phóng khí CO₂', 'Carboxylic acid gây sủi bọt khí.'],
  'benzoic-nahco3': ['Giải phóng khí CO₂', 'Carboxylic acid gây sủi bọt khí.'],
  'h2o2-heat': ['Giải phóng khí O₂', 'Khi đun nóng, hydrogen peroxide phân hủy nhanh hơn (mô phỏng).'],

  'fecl3-kscn': ['Phức màu đỏ máu', 'Tạo phức chất màu đỏ đậm.'],
  'cuso4-nh3': ['Phức xanh lam đậm', 'Dung dịch chuyển sang màu xanh lam đậm.'],
  'cucl2-nh3': ['Phức xanh lam đậm', 'Dung dịch chuyển sang màu xanh lam đậm.'],
  'phenol-fecl3': ['Phức màu tím', 'Xuất hiện màu tím.'],
  'starch-iodine': ['Nhận biết tinh bột', 'Xuất hiện màu xanh tím đậm.'],
  'iodine-thiosulfate': ['Iodine mất màu', 'Màu nâu của iodine biến mất.'],
  'ethene-bromine': ['Nước bromine mất màu', 'Màu vàng nâu biến mất.'],
  'propene-bromine': ['Nước bromine mất màu', 'Màu vàng nâu biến mất.'],
  'ethyne-bromine': ['Nước bromine mất màu', 'Màu nước bromine nhạt dần.'],
  'phenol-bromine': ['Nước bromine mất màu', 'Nước bromine mất màu và xuất hiện kết tủa màu trắng.'],
  'ethene-kmno4': ['Thử với permanganate', 'Màu tím nhạt dần và xuất hiện chất rắn màu nâu (mô phỏng).'],
  'propene-kmno4': ['Thử với permanganate', 'Màu tím nhạt dần và xuất hiện chất rắn màu nâu.'],

  'glucose-cu-room': ['Phức xanh lam đậm', 'Ở nhiệt độ thường tạo phức màu xanh lam đậm.'],
  'glucose-cu-hot': ['Kết tủa đỏ gạch', 'Khi đun nóng tạo kết tủa copper(I) oxide màu đỏ gạch.'],
  'fructose-cu-room': ['Phức xanh lam đậm', 'Ở nhiệt độ thường tạo phức màu xanh lam đậm.'],
  'fructose-cu-hot': ['Kết tủa đỏ gạch', 'Khi đun nóng tạo kết tủa copper(I) oxide màu đỏ gạch.'],
  'maltose-cu-room': ['Phức xanh lam đậm', 'Ở nhiệt độ thường tạo phức màu xanh lam đậm.'],
  'maltose-cu-hot': ['Kết tủa đỏ gạch', 'Khi đun nóng tạo kết tủa copper(I) oxide màu đỏ gạch.'],
  'lactose-cu-room': ['Phức xanh lam đậm', 'Ở nhiệt độ thường tạo phức màu xanh lam đậm.'],
  'lactose-cu-hot': ['Kết tủa đỏ gạch', 'Khi đun nóng tạo kết tủa copper(I) oxide màu đỏ gạch.'],
  'glycerol-cu': ['Nhận biết glycerol', 'Tạo dung dịch màu xanh lam đậm.'],
  'glycol-cu': ['Nhận biết polyalcohol', 'Tạo dung dịch màu xanh lam đậm.'],
  'albumin-biuret': ['Phản ứng biuret', 'Xuất hiện màu tím.'],

  'ethanol-dichromate': ['Oxi hóa alcohol', 'Màu da cam của dichromate chuyển dần sang xanh lục (mô phỏng).'],
  'propan1ol-dichromate': ['Oxi hóa alcohol', 'Thuốc thử oxi hóa đổi màu.'],
  'propan2ol-dichromate': ['Oxi hóa alcohol', 'Thuốc thử oxi hóa đổi màu.'],
  'methanal-dichromate': ['Oxi hóa aldehyde', 'Thuốc thử oxi hóa đổi màu.'],
  'ethanal-dichromate': ['Oxi hóa aldehyde', 'Thuốc thử oxi hóa đổi màu.'],
  'propanal-dichromate': ['Oxi hóa aldehyde', 'Thuốc thử oxi hóa đổi màu.'],
  'h2o2-kmno4-acid': ['Permanganate mất màu', 'Màu tím của permanganate biến mất và có khí thoát ra.'],
  'h2o2-ki-acid': ['Tạo iodine', 'Hỗn hợp chuyển sang màu nâu giống màu iodine.'],
  'feso4-kmno4-acid': ['Đổi màu do oxi hóa – khử', 'Màu tím của permanganate nhạt dần.'],

  'ester-ethanol-ethanoic': ['Phản ứng ester hóa', 'Tạo ethyl ethanoate (mô phỏng).'],
  'ester-methanol-ethanoic': ['Phản ứng ester hóa', 'Tạo methyl ethanoate (mô phỏng).'],
  'ester-ethanol-methanoic': ['Phản ứng ester hóa', 'Tạo ethyl methanoate (mô phỏng).'],
  'ethylEthanoate-naoh': ['Xà phòng hóa ethyl ethanoate', 'Ethyl ethanoate bị thủy phân trong môi trường kiềm (xà phòng hóa), tạo sodium ethanoate và ethanol.'],
  'methylEthanoate-naoh': ['Xà phòng hóa methyl ethanoate', 'Methyl ethanoate bị thủy phân trong môi trường kiềm (xà phòng hóa), tạo sodium ethanoate và methanol.'],
  'ethylFormate-naoh': ['Xà phòng hóa ethyl methanoate', 'Ethyl methanoate bị thủy phân trong môi trường kiềm (xà phòng hóa), tạo sodium methanoate và ethanol.'],
  'triglycerideOil-naoh': ['Xà phòng hóa chất béo', 'Chất béo (triglyceride) phản ứng với sodium hydroxide khi đun nóng, tạo glycerol và muối sodium của acid béo (xà phòng).'],
  'sucrose-hcl-heat': ['Thủy phân saccharose', 'Mô phỏng phản ứng thủy phân có xúc tác acid.'],
  'maltose-hcl-heat': ['Thủy phân maltose', 'Mô phỏng phản ứng thủy phân có xúc tác acid.'],
  'phenol-naoh': ['Phenol phản ứng với base', 'Phenol phản ứng với sodium hydroxide.'],
  'oxalic-cacl2': ['Kết tủa trắng', 'Tạo kết tủa calcium oxalate.'],
  'fe2so43-naoh': ['Kết tủa nâu đỏ', 'Tạo kết tủa iron(III) hydroxide.'],
  'baoh2-h2so4': ['Kết tủa trắng và trung hòa', 'Tạo kết tủa barium sulfate.'],
  'cuso4-baoh2': ['Mô phỏng hai kết tủa', 'Mô phỏng hỗn hợp kết tủa xanh lam và trắng.'],
  'agno3-kscn': ['Kết tủa trắng', 'Tạo kết tủa silver thiocyanate.']
}

const MESSAGES = {
  'Esterification simulated.': 'Đã mô phỏng phản ứng ester hóa.',
  'Sucrose hydrolysis simulated.': 'Đã mô phỏng thủy phân saccharose.',
  'Maltose hydrolysis simulated.': 'Đã mô phỏng thủy phân maltose.'
}

export function reactionTitle(reaction) {
  return VI[reaction?.id]?.[0] || reaction?.title || ''
}

export function reactionDescription(reaction) {
  return VI[reaction?.id]?.[1] || reaction?.description || ''
}

export function reactionMessage(text) {
  return MESSAGES[text] || text
}

export function hasTranslation(id) {
  return Boolean(VI[id])
}
