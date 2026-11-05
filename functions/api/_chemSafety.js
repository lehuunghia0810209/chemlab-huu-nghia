// Requests that must not reach the model: making something dangerous, or doing a hazardous
// experiment unsupervised. Answered with fixed text, so no Neurons and no chance of a procedure.
// Learning about hazards, first aid and textbook equations still goes to the model, whose
// prompt forbids amounts and procedures. Pattern matching cannot catch every wording.

const flat = value => String(value ?? '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLowerCase()

const HAZARDS = Object.freeze({
  explosive: /\b(thuoc no|chat no|min tu che|phao (tu che|no)|tnt|nitroglycerin|nitrocellulose|anfo|thermite)\b/,
  toxic_gas: /\b(khi doc|khi clo|chlorine gas|phosgene?|sarin|khi mu tat|mustard gas|hydrogen cyanide)\b/,
  poison: /\b(chat doc|thuoc doc|xyanua|cyanide|thach tin)\b/,
  drug: /\b(ma tuy|methamphetamine|heroin|cocaine|ketamin)\b/,
  acid_attack: /\b(tat axit|tat acid)\b/
})
// Without diacritics "bơm" (pump) and "bom" (bomb) are the same word.
const BOMB = /(?<![\p{L}\p{N}])bom(?![\p{L}\p{N}])/iu
const MAKE = /\b(cach (lam|che|tao|dieu che|pha|tong hop|san xuat)|tu (lam|che|pha|dieu che|tong hop)|lam sao de (tao|che|co)|huong dan[^.?!]{0,30}(lam|che|dieu che|tao|pha)|quy trinh (che|dieu che|tong hop|san xuat)|ti le (pha|tron)|cong thuc (che|pha|lam)|de (che|tao ra|lam ra))\b/
const MAKE_AT_HOME = /\b(lam|che|tao|dieu che|tong hop|pha)\b/
const AT_HOME = /\b(o nha|tai nha|trong nha|ngoai san|phong ngu|nha bep)\b/
const NO_PROTECTION = /\bkhong (can|co|deo|dung)\b[^.?!]{0,20}\b(kinh|gang|bao ho|tu hut|giao vien)\b/
const LEARNING = /\b(vi sao|tai sao|nguy co|nguy hiem nhu the nao|so cuu|phong tranh|phong ngua|bien phap an toan|xu ly khi|tac hai|anh huong|lich su|phuong trinh|phan ung nao|trong phong thi nghiem|cong nghiep|sgk|bai tap|de thi|ly thuyet|nguyen ly|nguyen tac)\b/
const BLEACH_MIX = /\b(tron|pha|ket hop|do)\b[^.?!]{0,40}\b(javen|nuoc tay|clorox|bleach|hypochlorite)\b[^.?!]{0,40}\b(acid|axit|giam|ammonia|amoniac|nuoc lau)\b/
const REACTIVE = /\b(natri|sodium|kali|potassium|kim loai kiem|h2so4 dac|acid sulfuric dac|axit sunfuric dac|acid dac|axit dac)\b/
const DOING = /\b(lam|thi nghiem|pha loang|cho vao|tha vao|thu)\b/

const CLOSING = 'Bạn có thể quan sát thí nghiệm an toàn trong **Virtual Lab** của ChemLab, hoặc hỏi về nguyên lý, nguy cơ và phương trình phản ứng. Nếu đã tiếp xúc với hóa chất, hãy báo ngay cho người lớn hoặc gọi cấp cứu 115.'

const REPLIES = Object.freeze({
  make: `**ChemAI không hướng dẫn tạo ra chất nguy hiểm.** Việc này có thể gây thương tích nặng hoặc tử vong, và có thể vi phạm pháp luật.\n\n${CLOSING}`,
  mix: `**Không tự trộn các hóa chất này.** Nước tẩy chứa hypochlorite khi gặp acid hoặc ammonia có thể sinh khí độc gây tổn thương đường hô hấp. Hãy để riêng từng loại và dùng theo nhãn.\n\n${CLOSING}`,
  supervised: `**Không nên làm thí nghiệm này khi không có giáo viên và đồ bảo hộ.** Hóa chất hoạt động mạnh chỉ nên dùng trong phòng thí nghiệm, có giáo viên giám sát, kính, găng tay và tủ hút phù hợp.\n\n${CLOSING}`
})

export function safetyGate(message) {
  const text = flat(message)
  const home = AT_HOME.test(text)
  const unprotected = NO_PROTECTION.test(text)
  if (BLEACH_MIX.test(text) && !LEARNING.test(text)) return { category: 'household_mix', answer: REPLIES.mix }
  if (REACTIVE.test(text) && DOING.test(text) && (home || unprotected)) return { category: 'unsupervised_lab', answer: REPLIES.supervised }
  // The hazard and the intent must share a sentence: a pasted exam passage can name an
  // explosive in one sentence and say "bằng cách làm giãn mạch" in the next.
  const raw = String(message ?? '').normalize('NFC').split(/[.?!\n]+/)
  for (const part of raw) {
    const sentence = flat(part)
    const hazard = BOMB.test(part) ? 'explosive' : Object.keys(HAZARDS).find(name => HAZARDS[name].test(sentence))
    if (!hazard) continue
    if (AT_HOME.test(sentence) ? MAKE_AT_HOME.test(sentence) : MAKE.test(sentence) && !LEARNING.test(sentence)) return { category: hazard, answer: REPLIES.make }
  }
  return null
}
