// Hóa học 10 · Chương 1 · Bài 2 — Nguyên tố hóa học.
// Isotope abundances: IUPAC/CIAAW representative values (rounded).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l2',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm nguyên tố hóa học, số hiệu nguyên tử và kí hiệu nguyên tử.',
    'Phát biểu được khái niệm đồng vị và nguyên tử khối.',
    'Tính được nguyên tử khối trung bình dựa vào số khối (hoặc khối lượng) và phần trăm số nguyên tử của các đồng vị, ví dụ từ phổ khối lượng.'
  ],
  prerequisites: [
    'Bài 1: nguyên tử gồm proton, neutron, electron; số p = số e.',
    'Khối lượng nguyên tử ≈ số p + số n (amu).'
  ],
  sources: [
    programme('Nguyên tố hóa học'),
    textbook(10, 2),
    'Thành phần đồng vị tự nhiên: bảng của IUPAC/CIAAW (làm tròn).'
  ],
  verification: VERIFICATION,
  steps: [
    {
      id: 'objectives',
      kind: 'objectives',
      title: 'Bài này giúp em',
      blocks: [
        {
          type: 'callout',
          tone: 'question',
          title: 'Câu hỏi mở đầu',
          text: 'Bảng tuần hoàn ghi nguyên tử khối của chlorine là 35,45 chứ không phải một số nguyên. Nếu khối lượng nguyên tử ≈ số proton + số neutron, vì sao lại có phần thập phân?'
        },
        {
          type: 'list',
          items: [
            'Hiểu số hiệu nguyên tử Z và số khối A, đọc được kí hiệu nguyên tử.',
            'Biết thế nào là nguyên tố hóa học và đồng vị.',
            'Tính nguyên tử khối trung bình từ thành phần đồng vị.',
            'Giải ngược: tìm phần trăm đồng vị khi biết nguyên tử khối trung bình.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        {
          type: 'list',
          items: [
            'Hạt nhân chứa proton (+1) và neutron (0); lớp vỏ chứa electron (−1).',
            'Nguyên tử trung hòa: số proton = số electron.'
          ]
        }
      ]
    },
    {
      id: 'nucleus',
      kind: 'concept',
      title: 'Số hiệu nguyên tử và số khối',
      blocks: [
        {
          type: 'p',
          text: 'Hạt nhân có Z proton nên mang điện tích **Z+**. Số **Z** được gọi là **số hiệu nguyên tử**; trong nguyên tử trung hòa, Z cũng là số electron.'
        },
        {
          type: 'equation',
          text: 'A = Z + N',
          note: 'A: số khối · Z: số proton · N: số neutron. A là số nguyên, gần bằng khối lượng nguyên tử tính theo amu.'
        },
        {
          type: 'p',
          text: 'Ví dụ: nguyên tử sodium có 11 proton và 12 neutron nên Z = 11, A = 11 + 12 = 23.'
        }
      ]
    },
    {
      id: 'element',
      kind: 'concept',
      title: 'Nguyên tố hóa học và kí hiệu nguyên tử',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên tố hóa học',
          text: 'Là tập hợp những nguyên tử có **cùng số đơn vị điện tích hạt nhân** (cùng số proton Z). Z quyết định nguyên tử thuộc nguyên tố nào.'
        },
        {
          type: 'p',
          text: 'Mọi nguyên tử có Z = 8 đều là oxygen, dù số neutron là 8, 9 hay 10. Đến nay đã biết 118 nguyên tố.'
        },
        { type: 'heading', text: 'Kí hiệu nguyên tử' },
        {
          type: 'equation',
          text: 'ᴬ_Z X   ví dụ   ²³₁₁Na,   ³⁵₁₇Cl',
          note: 'Số khối A viết phía trên bên trái, số hiệu Z viết phía dưới bên trái kí hiệu nguyên tố X.',
          check: false
        },
        {
          type: 'table',
          caption: 'Đọc kí hiệu nguyên tử',
          head: ['Kí hiệu', 'Z (số p = số e)', 'A', 'N = A − Z'],
          rows: [
            ['²³₁₁Na', '11', '23', '12'],
            ['³⁵₁₇Cl', '17', '35', '18'],
            ['⁵⁶₂₆Fe', '26', '56', '30']
          ]
        }
      ]
    },
    {
      id: 'isotopes',
      kind: 'concept',
      title: 'Đồng vị',
      blocks: [
        {
          type: 'callout',
          title: 'Đồng vị',
          text: 'Các đồng vị của một nguyên tố là những nguyên tử có **cùng số proton** nhưng **khác số neutron**, do đó khác số khối.'
        },
        {
          type: 'table',
          caption: 'Một số đồng vị',
          head: ['Nguyên tố', 'Đồng vị', 'Số neutron', 'Ghi chú'],
          rows: [
            ['Hydrogen (Z = 1)', '¹H, ²H, ³H', '0, 1, 2', '²H gọi là deuterium (D), ³H là tritium (T)'],
            ['Carbon (Z = 6)', '¹²C, ¹³C, ¹⁴C', '6, 7, 8', '¹⁴C phóng xạ, dùng xác định tuổi mẫu vật cổ'],
            ['Chlorine (Z = 17)', '³⁵Cl, ³⁷Cl', '18, 20', 'Khoảng 76% ³⁵Cl và 24% ³⁷Cl']
          ]
        },
        {
          type: 'list',
          items: [
            'Các đồng vị có cùng số electron nên có **tính chất hóa học gần như giống nhau**.',
            'Chúng khác nhau về khối lượng nên một số tính chất vật lí (khối lượng riêng, tốc độ khuếch tán) khác nhau.',
            'Nhiều đồng vị phóng xạ có ứng dụng: ¹³¹I trong y học, ¹⁴C trong khảo cổ.'
          ]
        }
      ]
    },
    {
      id: 'average-mass',
      kind: 'concept',
      title: 'Nguyên tử khối trung bình',
      blocks: [
        {
          type: 'p',
          text: 'Nguyên tố trong tự nhiên là hỗn hợp các đồng vị. **Nguyên tử khối trung bình** là trung bình có trọng số theo phần trăm số nguyên tử của từng đồng vị.'
        },
        {
          type: 'equation',
          text: 'Ā = (A₁·x₁ + A₂·x₂ + …) / 100',
          note: 'Aᵢ: số khối (hoặc khối lượng) của đồng vị i · xᵢ: phần trăm số nguyên tử của đồng vị i.'
        },
        {
          type: 'p',
          text: 'Thành phần đồng vị được đo bằng **phổ khối lượng**: mỗi đồng vị cho một vạch ở giá trị m/z riêng, chiều cao vạch tỉ lệ với phần trăm số nguyên tử.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Vì sao Cl là 35,45?',
          text: 'Chlorine gồm khoảng 75,76% ³⁵Cl và 24,24% ³⁷Cl. Dùng số khối ta được khoảng 35,48; dùng khối lượng chính xác của từng đồng vị (34,969 và 36,966 amu) ta được 35,45 như trong bảng tuần hoàn.'
        }
      ]
    },
    {
      id: 'example-average',
      kind: 'example',
      title: 'Ví dụ 1 — Tính nguyên tử khối trung bình',
      blocks: [
        {
          type: 'worked',
          problem: 'Phổ khối lượng của magnesium cho ba vạch: ²⁴Mg chiếm 78,99%, ²⁵Mg chiếm 10,00% và ²⁶Mg chiếm 11,01% số nguyên tử. Tính nguyên tử khối trung bình của Mg.',
          steps: [
            'Áp dụng Ā = (A₁x₁ + A₂x₂ + A₃x₃) / 100.',
            'Ā = (24 × 78,99 + 25 × 10,00 + 26 × 11,01) / 100.',
            'Ā = (1895,76 + 250,00 + 286,26) / 100 = 2432,02 / 100 ≈ 24,32.'
          ],
          answer: 'Nguyên tử khối trung bình của Mg ≈ 24,32 (bảng tuần hoàn ghi 24,305 vì dùng khối lượng chính xác của các đồng vị).'
        }
      ]
    },
    {
      id: 'example-reverse',
      kind: 'example',
      title: 'Ví dụ 2 — Tìm phần trăm đồng vị',
      blocks: [
        {
          type: 'worked',
          problem: 'Copper có hai đồng vị ⁶³Cu và ⁶⁵Cu, nguyên tử khối trung bình là 63,54. Tính phần trăm số nguyên tử mỗi đồng vị.',
          steps: [
            'Gọi phần trăm ⁶³Cu là x (%), thì ⁶⁵Cu là (100 − x).',
            'Ta có: (63x + 65(100 − x)) / 100 = 63,54.',
            '6500 − 2x = 6354 ⇒ x = 73.'
          ],
          answer: '⁶³Cu chiếm 73%, ⁶⁵Cu chiếm 27% số nguyên tử.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Kiểm tra nhanh kết quả',
          text: 'Ā phải nằm giữa hai số khối và gần đồng vị nhiều hơn: 63,54 gần 63 hơn 65, đúng với ⁶³Cu chiếm phần lớn.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Tra cứu đồng vị trong bảng tuần hoàn',
      blocks: [
        {
          type: 'p',
          text: 'Mở thẻ nguyên tố chlorine trong bảng tuần hoàn của ChemLab. Tìm số hiệu nguyên tử, nguyên tử khối và các đồng vị bền, rồi tự kiểm tra lại phép tính 35,45 ở trên.'
        },
        {
          type: 'activity',
          title: 'Bảng tuần hoàn — Chlorine (Cl)',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'periodic', element: 17 }
        }
      ]
    },
    {
      id: 'check',
      kind: 'check',
      title: 'Kiểm tra nhanh',
      blocks: [
        {
          type: 'quiz',
          id: 'g10-l2-c1',
          question: 'Nguyên tố hóa học là tập hợp các nguyên tử có cùng',
          options: [
            { id: 'a', text: 'số neutron' },
            { id: 'b', text: 'số khối' },
            { id: 'c', text: 'số proton' },
            { id: 'd', text: 'khối lượng' }
          ],
          correct: 'c',
          explanation: 'Số proton (số đơn vị điện tích hạt nhân Z) quyết định nguyên tố. Các đồng vị cùng nguyên tố khác số neutron và số khối.'
        },
        {
          type: 'quiz',
          id: 'g10-l2-c2',
          question: 'Nguyên tử ³⁹₁₉K có số neutron là',
          options: [
            { id: 'a', text: '19' },
            { id: 'b', text: '20' },
            { id: 'c', text: '39' },
            { id: 'd', text: '58' }
          ],
          correct: 'b',
          explanation: 'N = A − Z = 39 − 19 = 20.'
        },
        {
          type: 'quiz',
          id: 'g10-l2-c3',
          question: 'Cặp nguyên tử nào là đồng vị của nhau?',
          options: [
            { id: 'a', text: '¹⁴₆C và ¹⁴₇N' },
            { id: 'b', text: '⁴⁰₁₈Ar và ⁴⁰₂₀Ca' },
            { id: 'c', text: '¹⁶₈O và ¹⁸₈O' },
            { id: 'd', text: '²³₁₁Na và ²⁴₁₂Mg' }
          ],
          correct: 'c',
          explanation: '¹⁶O và ¹⁸O cùng Z = 8 nhưng khác số khối. Các cặp còn lại khác Z nên là hai nguyên tố khác nhau.'
        },
        {
          type: 'quiz',
          id: 'g10-l2-c4',
          question: 'Boron có hai đồng vị ¹⁰B (20%) và ¹¹B (80%). Nguyên tử khối trung bình của boron là',
          options: [
            { id: 'a', text: '10,2' },
            { id: 'b', text: '10,5' },
            { id: 'c', text: '10,8' },
            { id: 'd', text: '11,0' }
          ],
          correct: 'c',
          explanation: 'Ā = (10 × 20 + 11 × 80) / 100 = (200 + 880) / 100 = 10,8.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết',
      blocks: [
        {
          type: 'list',
          items: [
            'Số hiệu nguyên tử Z = số proton = số electron (nguyên tử trung hòa).',
            'Số khối A = Z + N; kí hiệu nguyên tử ᴬ_Z X.',
            'Nguyên tố hóa học: các nguyên tử cùng Z. Đồng vị: cùng Z, khác N.',
            'Nguyên tử khối trung bình Ā = Σ(Aᵢ·xᵢ) / 100.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hai nguyên tử có cùng số khối là đồng vị.', right: 'Đồng vị phải **cùng số proton**; ¹⁴C và ¹⁴N cùng A nhưng là hai nguyên tố khác nhau.' },
            { wrong: 'Số neutron N = A + Z.', right: '**N = A − Z**.' },
            { wrong: 'Nguyên tử khối trung bình là trung bình cộng các số khối.', right: 'Phải **nhân với phần trăm** số nguyên tử của từng đồng vị (trung bình có trọng số).' },
            { wrong: 'Các đồng vị có tính chất hóa học khác nhau.', right: 'Các đồng vị cùng số electron nên tính chất hóa học **gần như giống nhau**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Cấu trúc lớp vỏ electron nguyên tử** — orbital, lớp, phân lớp và cấu hình electron.'
        }
      ]
    }
  ]
}
