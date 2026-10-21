// Hóa học 10 · Chương 2 · Bài 5 — Cấu tạo của bảng tuần hoàn các nguyên tố hóa học.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l5',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được về lịch sử phát minh định luật tuần hoàn và bảng tuần hoàn.',
    'Mô tả được cấu tạo của bảng tuần hoàn: ô, chu kì, nhóm.',
    'Nêu được nguyên tắc sắp xếp các nguyên tố trong bảng tuần hoàn dựa theo cấu hình electron.',
    'Phân loại được nguyên tố dựa theo cấu hình electron (s, p, d, f) và theo tính chất (kim loại, phi kim, khí hiếm).'
  ],
  prerequisites: [
    'Bài 3: viết cấu hình electron, xác định số electron lớp ngoài cùng.',
    'Số hiệu nguyên tử Z = số proton = số electron.'
  ],
  sources: [
    programme('Cấu tạo của bảng tuần hoàn các nguyên tố hóa học'),
    textbook(10, 5)
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
          text: 'Năm 1869, D. I. Mendeleev xếp 63 nguyên tố đã biết vào một bảng và còn chừa ô trống cho những nguyên tố chưa ai tìm thấy. Ngày nay, chỉ cần biết số hiệu nguyên tử, em có thể suy ra một nguyên tố nằm ở hàng nào, cột nào. Quy luật sắp xếp đó là gì?'
        },
        {
          type: 'list',
          items: [
            'Hiểu ba nguyên tắc sắp xếp các nguyên tố trong bảng tuần hoàn.',
            'Đọc được thông tin trong một ô nguyên tố.',
            'Phân biệt chu kì, nhóm A, nhóm B và các khối s, p, d, f.',
            'Xác định vị trí nguyên tố từ cấu hình electron và ngược lại.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Cấu hình electron, ví dụ Na: 1s² 2s² 2p⁶ 3s¹.', 'Electron lớp ngoài cùng quyết định tính chất hóa học.'] }
      ]
    },
    {
      id: 'principles',
      kind: 'concept',
      title: 'Nguyên tắc sắp xếp',
      blocks: [
        {
          type: 'p',
          text: 'Mendeleev sắp xếp các nguyên tố theo chiều tăng nguyên tử khối và đặt các nguyên tố có tính chất giống nhau vào cùng cột. Bảng tuần hoàn hiện đại sắp xếp theo **số hiệu nguyên tử**, dựa trên cấu hình electron:'
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Các nguyên tố được xếp theo chiều **tăng dần điện tích hạt nhân** (Z).',
            'Các nguyên tố có **cùng số lớp electron** được xếp thành một hàng (chu kì).',
            'Các nguyên tố có **cùng số electron hóa trị** được xếp thành một cột (nhóm).'
          ]
        },
        {
          type: 'callout',
          title: 'Electron hóa trị',
          text: 'Là những electron có khả năng tham gia hình thành liên kết hóa học, thường nằm ở lớp ngoài cùng (với nguyên tố nhóm A) hoặc ở lớp ngoài cùng và phân lớp sát ngoài cùng chưa bão hòa (với nguyên tố nhóm B).'
        }
      ]
    },
    {
      id: 'cell-period',
      kind: 'concept',
      title: 'Ô nguyên tố và chu kì',
      blocks: [
        {
          type: 'p',
          text: 'Mỗi nguyên tố chiếm một **ô**. Số thứ tự của ô bằng số hiệu nguyên tử Z. Ô thường ghi kí hiệu, tên, nguyên tử khối trung bình, độ âm điện, cấu hình electron rút gọn.'
        },
        {
          type: 'callout',
          title: 'Chu kì',
          text: 'Là dãy các nguyên tố có cùng số lớp electron, xếp theo chiều Z tăng. **Số thứ tự chu kì = số lớp electron.**'
        },
        {
          type: 'table',
          caption: 'Bảng tuần hoàn có 7 chu kì',
          head: ['Chu kì', 'Số nguyên tố', 'Loại', 'Bắt đầu – kết thúc'],
          rows: [
            ['1', '2', 'Chu kì nhỏ', 'H – He'],
            ['2', '8', 'Chu kì nhỏ', 'Li – Ne'],
            ['3', '8', 'Chu kì nhỏ', 'Na – Ar'],
            ['4', '18', 'Chu kì lớn', 'K – Kr'],
            ['5', '18', 'Chu kì lớn', 'Rb – Xe'],
            ['6', '32', 'Chu kì lớn', 'Cs – Rn'],
            ['7', '32', 'Chu kì lớn', 'Fr – Og']
          ]
        },
        {
          type: 'p',
          text: 'Mỗi chu kì (trừ chu kì 1) bắt đầu bằng một kim loại kiềm và kết thúc bằng một khí hiếm.'
        }
      ]
    },
    {
      id: 'groups-blocks',
      kind: 'concept',
      title: 'Nhóm và khối nguyên tố',
      blocks: [
        {
          type: 'p',
          text: '**Nhóm** là tập hợp các nguyên tố có cấu hình electron tương tự nhau nên tính chất hóa học gần giống nhau, xếp thành một cột. Bảng tuần hoàn có 18 cột, chia thành 8 nhóm A (IA → VIIIA) và 8 nhóm B (IIIB → VIIIB, IB, IIB; nhóm VIIIB gồm 3 cột).'
        },
        {
          type: 'table',
          caption: 'Khối nguyên tố theo phân lớp có electron cuối cùng',
          head: ['Khối', 'Electron cuối cùng điền vào', 'Thuộc nhóm', 'Ví dụ'],
          rows: [
            ['s', 'phân lớp ns', 'IA, IIA (và He)', 'Na: 3s¹; Ca: 4s²'],
            ['p', 'phân lớp np', 'IIIA → VIIIA', 'Al: 3s²3p¹; Cl: 3s²3p⁵'],
            ['d', 'phân lớp (n−1)d', 'các nhóm B', 'Fe: [Ar]3d⁶4s²'],
            ['f', 'phân lớp (n−2)f', 'họ lanthanide, actinide', 'xếp thành hai hàng cuối bảng']
          ]
        },
        {
          type: 'callout',
          title: 'Số thứ tự nhóm A',
          text: 'Với nguyên tố nhóm A: **số thứ tự nhóm = số electron lớp ngoài cùng** (= số electron hóa trị).'
        },
        {
          type: 'list',
          items: [
            'Khối s và p (nhóm A, trừ H, He, B) phần lớn là kim loại ở bên trái, phi kim ở bên phải phía trên, khí hiếm ở nhóm VIIIA.',
            'Các nguyên tố khối d và f đều là kim loại.'
          ]
        }
      ]
    },
    {
      id: 'example-position',
      kind: 'example',
      title: 'Ví dụ 1 — Từ Z đến vị trí',
      blocks: [
        {
          type: 'worked',
          problem: 'Xác định vị trí (ô, chu kì, nhóm, khối) của các nguyên tố có Z = 17 và Z = 19. Cho biết mỗi nguyên tố là kim loại, phi kim hay khí hiếm.',
          table: {
            caption: 'Phân tích cấu hình',
            head: ['Z', 'Cấu hình', 'Số lớp', 'e lớp ngoài cùng', 'Electron cuối'],
            rows: [
              ['17', '1s² 2s² 2p⁶ 3s² 3p⁵', '3', '7', '3p'],
              ['19', '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹', '4', '1', '4s']
            ]
          },
          steps: [
            'Z = 17: ô số 17; 3 lớp electron ⇒ chu kì 3; 7 electron lớp ngoài cùng ⇒ nhóm VIIA; electron cuối vào 3p ⇒ khối p. Đây là chlorine, phi kim.',
            'Z = 19: ô số 19; 4 lớp ⇒ chu kì 4; 1 electron lớp ngoài cùng ⇒ nhóm IA; electron cuối vào 4s ⇒ khối s. Đây là potassium, kim loại.'
          ],
          answer: 'Cl: ô 17, chu kì 3, nhóm VIIA, khối p, phi kim. K: ô 19, chu kì 4, nhóm IA, khối s, kim loại.'
        }
      ]
    },
    {
      id: 'example-reverse',
      kind: 'example',
      title: 'Ví dụ 2 — Từ vị trí đến cấu hình',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tố X ở chu kì 3, nhóm VA. Viết cấu hình electron và tính Z của X.',
          steps: [
            'Chu kì 3 ⇒ có 3 lớp electron, lớp ngoài cùng là lớp 3.',
            'Nhóm VA ⇒ có 5 electron lớp ngoài cùng: 3s² 3p³.',
            'Cấu hình đầy đủ: 1s² 2s² 2p⁶ 3s² 3p³ ⇒ Z = 2 + 2 + 6 + 2 + 3 = 15.'
          ],
          answer: 'X có cấu hình 1s²2s²2p⁶3s²3p³, Z = 15 (phosphorus), là phi kim thuộc khối p.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Khám phá bảng tuần hoàn',
      blocks: [
        {
          type: 'p',
          text: 'Mở bảng tuần hoàn, chọn phosphorus và kiểm tra lại: chu kì, nhóm, khối và cấu hình electron có khớp với ví dụ 2 không? Thử lọc theo khối s, p, d, f để thấy các vùng của bảng.'
        },
        {
          type: 'activity',
          title: 'Bảng tuần hoàn — Phosphorus (P)',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'periodic', element: 15 }
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
          id: 'g10-l5-c1',
          question: 'Các nguyên tố trong bảng tuần hoàn hiện đại được sắp xếp theo chiều tăng dần của',
          options: [
            { id: 'a', text: 'nguyên tử khối' },
            { id: 'b', text: 'điện tích hạt nhân' },
            { id: 'c', text: 'số neutron' },
            { id: 'd', text: 'độ âm điện' }
          ],
          correct: 'b',
          explanation: 'Bảng tuần hoàn hiện đại xếp theo Z tăng dần. Mendeleev ban đầu dùng nguyên tử khối, nhưng có vài cặp ngoại lệ (Ar – K, Te – I).'
        },
        {
          type: 'quiz',
          id: 'g10-l5-c2',
          question: 'Nguyên tố có cấu hình 1s² 2s² 2p⁶ 3s² thuộc',
          options: [
            { id: 'a', text: 'chu kì 2, nhóm IIA' },
            { id: 'b', text: 'chu kì 3, nhóm IIA' },
            { id: 'c', text: 'chu kì 3, nhóm IIB' },
            { id: 'd', text: 'chu kì 2, nhóm VIIIA' }
          ],
          correct: 'b',
          explanation: '3 lớp electron ⇒ chu kì 3; electron cuối vào phân lớp s với 2 electron lớp ngoài cùng ⇒ nhóm IIA (magnesium).'
        },
        {
          type: 'quiz',
          id: 'g10-l5-c3',
          question: 'Chu kì 4 có bao nhiêu nguyên tố?',
          options: [
            { id: 'a', text: '8' },
            { id: 'b', text: '18' },
            { id: 'c', text: '32' },
            { id: 'd', text: '2' }
          ],
          correct: 'b',
          explanation: 'Chu kì 4 gồm 2 nguyên tố khối s (4s), 10 nguyên tố khối d (3d) và 6 nguyên tố khối p (4p): 18 nguyên tố.'
        },
        {
          type: 'quiz',
          id: 'g10-l5-c4',
          question: 'Nguyên tố có electron cuối cùng điền vào phân lớp 3d thuộc khối',
          options: [
            { id: 'a', text: 's' },
            { id: 'b', text: 'p' },
            { id: 'c', text: 'd' },
            { id: 'd', text: 'f' }
          ],
          correct: 'c',
          explanation: 'Khối được gọi theo phân lớp chứa electron cuối cùng. Các nguyên tố khối d thuộc nhóm B và đều là kim loại.'
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
            'Ba nguyên tắc: Z tăng dần; cùng số lớp electron → cùng chu kì; cùng số electron hóa trị → cùng nhóm.',
            'Số thứ tự ô = Z; số thứ tự chu kì = số lớp electron; số thứ tự nhóm A = số electron lớp ngoài cùng.',
            '7 chu kì (1–3 nhỏ, 4–7 lớn); 18 cột gồm 8 nhóm A và 8 nhóm B.',
            'Khối s, p (nhóm A) và khối d, f (nhóm B, đều là kim loại).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Số thứ tự chu kì bằng số electron lớp ngoài cùng.', right: 'Số thứ tự chu kì bằng **số lớp electron**; số electron lớp ngoài cùng cho biết **nhóm A**.' },
            { wrong: 'K (…3p⁶4s¹) ở chu kì 3 vì có lớp 3p⁶.', right: 'K có 4 lớp electron nên ở **chu kì 4**, nhóm IA.' },
            { wrong: 'Bảng tuần hoàn hiện đại xếp theo nguyên tử khối tăng dần.', right: 'Xếp theo **số hiệu nguyên tử** (điện tích hạt nhân) tăng dần.' },
            { wrong: 'Mọi nguyên tố khối s đều là kim loại.', right: 'H (1s¹) và He (1s²) thuộc khối s nhưng **không phải kim loại**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Xu hướng biến đổi một số tính chất của nguyên tử** — bán kính, độ âm điện, tính kim loại và phi kim.'
        }
      ]
    }
  ]
}
