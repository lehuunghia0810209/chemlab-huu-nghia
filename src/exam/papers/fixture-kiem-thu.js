// INTERNAL TEST FIXTURE — not an official paper. Written by ChemLab to exercise
// the exam engine (all three answer types, partial metadata). Shown only when
// the fixture flag is on (see catalog.js). Do not present it as an exam.
export default {
  id: 'fixture-kiem-thu',
  title: 'Đề kiểm thử nội bộ (không phải đề chính thức)',
  kind: 'fixture',
  blueprint: 'thpt-2025-hoa',
  license: 'internal-fixture',
  dataVersion: 1,
  timeLimitMinutes: 15,
  sections: [
    {
      part: 'I',
      questions: [
        {
          id: 'f-1',
          content: 'Chất nào sau đây là chất điện li mạnh?',
          options: [
            { id: 'A', text: 'HCl' },
            { id: 'B', text: 'CH₃COOH' },
            { id: 'C', text: 'H₂O' },
            { id: 'D', text: 'C₂H₅OH' }
          ],
          answer: 'A',
          solution: { text: 'HCl là acid mạnh, phân li hoàn toàn trong nước; CH₃COOH và H₂O điện li yếu; C₂H₅OH không điện li.', official: false },
          meta: { status: 'verified', chapters: ['g11-c1'], level: 'biet' }
        },
        {
          id: 'f-2',
          content: 'Kim loại nào sau đây không tác dụng với dung dịch HCl?',
          options: [
            { id: 'A', text: 'Fe' },
            { id: 'B', text: 'Zn' },
            { id: 'C', text: 'Cu' },
            { id: 'D', text: 'Mg' }
          ],
          answer: 'C',
          solution: { text: 'E°(Cu²⁺/Cu) = +0,34 V > 0 nên Cu không khử được ion H⁺.', official: false },
          meta: { status: 'verified', chapters: ['g12-c6'], level: 'biet' }
        },
        {
          id: 'f-3',
          content: 'Thủy phân hoàn toàn tinh bột trong môi trường acid thu được',
          options: [
            { id: 'A', text: 'glucose' },
            { id: 'B', text: 'fructose' },
            { id: 'C', text: 'saccharose' },
            { id: 'D', text: 'ethanol' }
          ],
          answer: 'A',
          solution: { text: 'Tinh bột gồm các mắt xích α-glucose nên thủy phân hoàn toàn tạo glucose.', official: false },
          meta: { status: 'unverified' }
        }
      ]
    },
    {
      part: 'II',
      questions: [
        {
          id: 'f-4',
          content: 'Cho các phát biểu về glucose.',
          statements: [
            { id: 'a', text: 'Phân tử glucose dạng mạch hở có 5 nhóm −OH.' },
            { id: 'b', text: 'Glucose tham gia phản ứng tráng bạc.' },
            { id: 'c', text: 'Glucose bị thủy phân trong môi trường acid.' },
            { id: 'd', text: 'Glucose làm mất màu nước bromine.' }
          ],
          answer: { a: true, b: true, c: false, d: true },
          solution: { text: 'Glucose CH₂OH[CHOH]₄CHO có 5 nhóm OH và nhóm CHO (tráng bạc, làm mất màu nước bromine); là monosaccharide nên không bị thủy phân.', official: false },
          meta: { status: 'verified', chapters: ['g12-c2'], level: 'hieu' }
        },
        {
          id: 'f-5',
          content: 'Xét pin điện hóa Zn–Cu ở điều kiện chuẩn (E°Zn²⁺/Zn = −0,76 V; E°Cu²⁺/Cu = +0,34 V).',
          statements: [
            { id: 'a', text: 'Zn là anode và bị oxi hóa.' },
            { id: 'b', text: 'Electron di chuyển qua cầu muối từ Zn sang Cu.' },
            { id: 'c', text: 'Sức điện động chuẩn của pin là 1,10 V.' },
            { id: 'd', text: 'Khối lượng thanh Cu giảm dần khi pin hoạt động.' }
          ],
          answer: { a: true, b: false, c: true, d: false },
          solution: { text: 'Zn → Zn²⁺ + 2e ở anode; electron đi qua dây dẫn mạch ngoài; E°pin = 0,34 − (−0,76) = 1,10 V; Cu²⁺ bị khử bám vào thanh Cu nên khối lượng tăng.', official: false },
          meta: { status: 'verified', chapters: ['g12-c5'], level: 'hieu' }
        }
      ]
    },
    {
      part: 'III',
      questions: [
        {
          id: 'f-6',
          content: 'Đốt cháy hoàn toàn 0,1 mol CH₄ cần bao nhiêu mol O₂?',
          answer: '0,2',
          solution: { text: 'CH₄ + 2O₂ → CO₂ + 2H₂O ⇒ n(O₂) = 2 × 0,1 = 0,2 mol.', official: false },
          meta: { status: 'verified', chapters: ['g11-c4'], level: 'hieu' }
        },
        {
          id: 'f-7',
          content: 'Cho 0,1 mol Zn tác dụng với dung dịch HCl dư. Tính thể tích H₂ thu được ở điều kiện chuẩn (24,79 L/mol), đơn vị lít, làm tròn đến hàng phần mười.',
          answer: '2,5',
          solution: { text: 'Zn + 2HCl → ZnCl₂ + H₂ ⇒ n(H₂) = 0,1 mol ⇒ V = 2,479 L ≈ 2,5 L.', official: false },
          meta: { status: 'verified', chapters: ['g12-c6'], level: 'vandung' }
        },
        {
          id: 'f-8',
          content: 'Tính pH của dung dịch HCl 0,01 M (coi HCl phân li hoàn toàn).',
          answer: '2',
          solution: { text: '[H⁺] = 0,01 = 10⁻² M ⇒ pH = 2.', official: false },
          meta: { status: 'verified', chapters: ['g11-c1'], level: 'vandung' }
        }
      ]
    }
  ]
}
