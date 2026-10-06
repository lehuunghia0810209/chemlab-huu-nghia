import './quiz.css'


/* =========================================================
   CHEMLAB 4.7
   LEARNING MODE 2.0
========================================================= */

const STORAGE_KEY =
  'chemlab-learning-4.7'


/* =========================================================
   TOPICS
========================================================= */

const TOPICS = {

  periodic: {
    name:
      'Bảng tuần hoàn',

    icon:
      '▦',

    description:
      'Nhóm, chu kỳ và tính chất nguyên tố.'
  },


  electron: {
    name:
      'Electron',

    icon:
      '◎',

    description:
      'Cấu hình electron và electron hóa trị.'
  },


  ions: {
    name:
      'Ion',

    icon:
      '±',

    description:
      'Điện tích ion và công thức hợp chất.'
  },


  equations: {
    name:
      'Phương trình',

    icon:
      '⚖',

    description:
      'Cân bằng phương trình hóa học.'
  },


  mol: {
    name:
      'Mol',

    icon:
      '∑',

    description:
      'Số mol, khối lượng và nồng độ.'
  },


  solubility: {
    name:
      'Tính tan',

    icon:
      '◫',

    description:
      'Quy tắc tan và kết tủa.'
  }

}


/* =========================================================
   QUESTION BANK
========================================================= */

const QUESTIONS = [

  /* =====================================================
     PERIODIC
  ===================================================== */

  {
    id:
      'periodic-01',

    topic:
      'periodic',

    difficulty:
      'easy',

    question:
      'Số hiệu nguyên tử của Oxygen (O) là bao nhiêu?',

    options:
      ['6', '7', '8', '16'],

    answer:
      '8',

    explanation:
      'Oxygen có số hiệu nguyên tử Z = 8, nghĩa là nguyên tử trung hòa có 8 proton và 8 electron.'
  },


  {
    id:
      'periodic-02',

    topic:
      'periodic',

    difficulty:
      'easy',

    question:
      'Sodium (Na) thuộc nhóm nào trong bảng tuần hoàn?',

    options:
      ['Nhóm 1', 'Nhóm 2', 'Nhóm 16', 'Nhóm 17'],

    answer:
      'Nhóm 1',

    explanation:
      'Na thuộc nhóm 1, nhóm kim loại kiềm.'
  },


  {
    id:
      'periodic-03',

    topic:
      'periodic',

    difficulty:
      'easy',

    question:
      'Chlorine (Cl) thuộc chu kỳ nào?',

    options:
      ['Chu kỳ 1', 'Chu kỳ 2', 'Chu kỳ 3', 'Chu kỳ 4'],

    answer:
      'Chu kỳ 3',

    explanation:
      'Cl có electron phân bố trên 3 lớp nên nằm ở chu kỳ 3.'
  },


  {
    id:
      'periodic-04',

    topic:
      'periodic',

    difficulty:
      'medium',

    question:
      'Nguyên tố nào sau đây thuộc nhóm khí hiếm?',

    options:
      ['Na', 'Cl', 'Ne', 'Mg'],

    answer:
      'Ne',

    explanation:
      'Neon (Ne) thuộc nhóm 18, nhóm khí hiếm.'
  },


  {
    id:
      'periodic-05',

    topic:
      'periodic',

    difficulty:
      'medium',

    question:
      'Nguyên tố thuộc nhóm 17 thường có bao nhiêu electron hóa trị?',

    options:
      ['1', '2', '7', '8'],

    answer:
      '7',

    explanation:
      'Các nguyên tố nhóm 17 có 7 electron ở lớp ngoài cùng.'
  },


  {
    id:
      'periodic-06',

    topic:
      'periodic',

    difficulty:
      'hard',

    question:
      'Fe có số hiệu nguyên tử 26. Fe thuộc loại nguyên tố nào?',

    options:
      [
        'Kim loại kiềm',
        'Kim loại chuyển tiếp',
        'Halogen',
        'Khí hiếm'
      ],

    answer:
      'Kim loại chuyển tiếp',

    explanation:
      'Iron (Fe) nằm ở khối d và được xếp vào nhóm kim loại chuyển tiếp.'
  },


  /* =====================================================
     ELECTRON
  ===================================================== */

  {
    id:
      'electron-01',

    topic:
      'electron',

    difficulty:
      'easy',

    question:
      'Nguyên tử Na trung hòa có bao nhiêu electron?',

    options:
      ['10', '11', '12', '23'],

    answer:
      '11',

    explanation:
      'Na có số hiệu nguyên tử 11 nên nguyên tử trung hòa có 11 electron.'
  },


  {
    id:
      'electron-02',

    topic:
      'electron',

    difficulty:
      'easy',

    question:
      'Na có bao nhiêu electron ở lớp ngoài cùng?',

    options:
      ['1', '2', '7', '8'],

    answer:
      '1',

    explanation:
      'Na có cấu hình ngoài cùng 3s¹ nên có 1 electron hóa trị.'
  },


  {
    id:
      'electron-03',

    topic:
      'electron',

    difficulty:
      'medium',

    question:
      'Cấu hình electron nào đúng cho Oxygen?',

    options:
      [
        '1s² 2s² 2p⁴',
        '1s² 2s² 2p⁶',
        '1s² 2s¹ 2p⁵',
        '1s² 2s² 2p²'
      ],

    answer:
      '1s² 2s² 2p⁴',

    explanation:
      'O có 8 electron: 1s² + 2s² + 2p⁴ = 8.'
  },


  {
    id:
      'electron-04',

    topic:
      'electron',

    difficulty:
      'medium',

    question:
      'Ion Mg²⁺ có bao nhiêu electron?',

    options:
      ['10', '12', '14', '24'],

    answer:
      '10',

    explanation:
      'Mg có Z = 12. Khi tạo Mg²⁺, Mg mất 2 electron nên còn 10 electron.'
  },


  {
    id:
      'electron-05',

    topic:
      'electron',

    difficulty:
      'medium',

    question:
      'Ion Al³⁺ có bao nhiêu electron?',

    options:
      ['10', '13', '16', '27'],

    answer:
      '10',

    explanation:
      'Al có 13 electron khi trung hòa. Al³⁺ mất 3 electron nên còn 10.'
  },


  {
    id:
      'electron-06',

    topic:
      'electron',

    difficulty:
      'hard',

    question:
      'Phân lớp d có thể chứa tối đa bao nhiêu electron?',

    options:
      ['2', '6', '10', '14'],

    answer:
      '10',

    explanation:
      'Phân lớp d gồm 5 orbital, mỗi orbital tối đa 2 electron nên chứa tối đa 10 electron.'
  },


  /* =====================================================
     IONS
  ===================================================== */

  {
    id:
      'ions-01',

    topic:
      'ions',

    difficulty:
      'easy',

    question:
      'Điện tích phổ biến của ion Sodium là gì?',

    options:
      ['Na⁺', 'Na²⁺', 'Na⁻', 'Na²⁻'],

    answer:
      'Na⁺',

    explanation:
      'Na thường mất 1 electron để tạo ion Na⁺.'
  },


  {
    id:
      'ions-02',

    topic:
      'ions',

    difficulty:
      'easy',

    question:
      'Điện tích của ion sulfate SO₄ là bao nhiêu?',

    options:
      ['1−', '2−', '1+', '2+'],

    answer:
      '2−',

    explanation:
      'Ion sulfate có công thức SO₄²⁻.'
  },


  {
    id:
      'ions-03',

    topic:
      'ions',

    difficulty:
      'medium',

    question:
      'Ca²⁺ kết hợp với Cl⁻ tạo công thức nào?',

    options:
      ['CaCl', 'CaCl₂', 'Ca₂Cl', 'Ca₂Cl₂'],

    answer:
      'CaCl₂',

    explanation:
      'Một Ca²⁺ cần hai Cl⁻ để tổng điện tích bằng 0.'
  },


  {
    id:
      'ions-04',

    topic:
      'ions',

    difficulty:
      'medium',

    question:
      'Al³⁺ kết hợp với SO₄²⁻ tạo công thức nào?',

    options:
      [
        'AlSO₄',
        'Al₂SO₄',
        'Al₂(SO₄)₃',
        'Al₃(SO₄)₂'
      ],

    answer:
      'Al₂(SO₄)₃',

    explanation:
      '2 Al³⁺ tạo +6 và 3 SO₄²⁻ tạo −6, vì vậy công thức là Al₂(SO₄)₃.'
  },


  {
    id:
      'ions-05',

    topic:
      'ions',

    difficulty:
      'hard',

    question:
      'NH₄⁺ kết hợp với PO₄³⁻ tạo công thức nào?',

    options:
      [
        'NH₄PO₄',
        '(NH₄)₂PO₄',
        '(NH₄)₃PO₄',
        'NH₄(PO₄)₃'
      ],

    answer:
      '(NH₄)₃PO₄',

    explanation:
      'Ba ion NH₄⁺ tạo tổng điện tích +3 để trung hòa một PO₄³⁻.'
  },


  {
    id:
      'ions-06',

    topic:
      'ions',

    difficulty:
      'hard',

    question:
      'Fe³⁺ kết hợp với OH⁻ tạo công thức nào?',

    options:
      [
        'FeOH',
        'Fe(OH)₂',
        'Fe(OH)₃',
        'Fe₃OH'
      ],

    answer:
      'Fe(OH)₃',

    explanation:
      'Một Fe³⁺ cần ba OH⁻ để tổng điện tích bằng 0.'
  },


  /* =====================================================
     EQUATIONS
  ===================================================== */

  {
    id:
      'equations-01',

    topic:
      'equations',

    difficulty:
      'easy',

    question:
      'Bộ hệ số đúng của H₂ + O₂ → H₂O là gì?',

    options:
      [
        '1 : 1 : 1',
        '2 : 1 : 2',
        '1 : 2 : 1',
        '2 : 2 : 1'
      ],

    answer:
      '2 : 1 : 2',

    explanation:
      '2H₂ + O₂ → 2H₂O bảo toàn 4 H và 2 O ở hai vế.'
  },


  {
    id:
      'equations-02',

    topic:
      'equations',

    difficulty:
      'medium',

    question:
      'Bộ hệ số đúng của Fe + O₂ → Fe₂O₃ là gì?',

    options:
      [
        '2 : 1 : 1',
        '4 : 3 : 2',
        '3 : 2 : 1',
        '2 : 3 : 2'
      ],

    answer:
      '4 : 3 : 2',

    explanation:
      'Phương trình cân bằng là 4Fe + 3O₂ → 2Fe₂O₃.'
  },


  {
    id:
      'equations-03',

    topic:
      'equations',

    difficulty:
      'medium',

    question:
      'Hệ số của NaOH trong phương trình NaOH + H₂SO₄ → Na₂SO₄ + H₂O là bao nhiêu?',

    options:
      ['1', '2', '3', '4'],

    answer:
      '2',

    explanation:
      'Phương trình: 2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O.'
  },


  {
    id:
      'equations-04',

    topic:
      'equations',

    difficulty:
      'hard',

    question:
      'Bộ hệ số đúng của Al + HCl → AlCl₃ + H₂ là gì?',

    options:
      [
        '1 : 3 : 1 : 1',
        '2 : 6 : 2 : 3',
        '2 : 3 : 2 : 1',
        '1 : 6 : 1 : 3'
      ],

    answer:
      '2 : 6 : 2 : 3',

    explanation:
      'Phương trình cân bằng: 2Al + 6HCl → 2AlCl₃ + 3H₂.'
  },


  {
    id:
      'equations-05',

    topic:
      'equations',

    difficulty:
      'hard',

    question:
      'Bộ hệ số đúng của KClO₃ → KCl + O₂ là gì?',

    options:
      [
        '1 : 1 : 1',
        '2 : 2 : 3',
        '2 : 1 : 3',
        '3 : 3 : 2'
      ],

    answer:
      '2 : 2 : 3',

    explanation:
      '2KClO₃ → 2KCl + 3O₂ bảo toàn K, Cl và O.'
  },


  /* =====================================================
     MOL
  ===================================================== */

  {
    id:
      'mol-01',

    topic:
      'mol',

    difficulty:
      'easy',

    question:
      '18 g H₂O tương ứng khoảng bao nhiêu mol H₂O?',

    options:
      [
        '0,5 mol',
        '1 mol',
        '2 mol',
        '18 mol'
      ],

    answer:
      '1 mol',

    explanation:
      'M(H₂O) ≈ 18 g/mol nên n = 18 / 18 = 1 mol.'
  },


  {
    id:
      'mol-02',

    topic:
      'mol',

    difficulty:
      'easy',

    question:
      'Khối lượng của 0,5 mol O₂ là bao nhiêu?',

    options:
      [
        '8 g',
        '16 g',
        '32 g',
        '64 g'
      ],

    answer:
      '16 g',

    explanation:
      'M(O₂) = 32 g/mol. m = n × M = 0,5 × 32 = 16 g.'
  },


  {
    id:
      'mol-03',

    topic:
      'mol',

    difficulty:
      'medium',

    question:
      'Theo quy ước 22,4 L/mol ở đktc, 11,2 L khí tương ứng bao nhiêu mol?',

    options:
      [
        '0,25 mol',
        '0,5 mol',
        '1 mol',
        '2 mol'
      ],

    answer:
      '0,5 mol',

    explanation:
      'n = V / 22,4 = 11,2 / 22,4 = 0,5 mol.'
  },


  {
    id:
      'mol-04',

    topic:
      'mol',

    difficulty:
      'medium',

    question:
      'Hòa tan 0,2 mol chất tan trong 0,5 L dung dịch. Nồng độ mol là bao nhiêu?',

    options:
      [
        '0,1 M',
        '0,2 M',
        '0,4 M',
        '2,5 M'
      ],

    answer:
      '0,4 M',

    explanation:
      'Cₘ = n / V = 0,2 / 0,5 = 0,4 mol/L.'
  },


  {
    id:
      'mol-05',

    topic:
      'mol',

    difficulty:
      'hard',

    question:
      'Số hạt trong 2 mol chất xấp xỉ bằng bao nhiêu?',

    options:
      [
        '6,02 × 10²³',
        '1,204 × 10²⁴',
        '3,01 × 10²³',
        '2 × 10²³'
      ],

    answer:
      '1,204 × 10²⁴',

    explanation:
      'N = n × Nₐ = 2 × 6,02 × 10²³ ≈ 1,204 × 10²⁴ hạt.'
  },


  /* =====================================================
     SOLUBILITY
  ===================================================== */

  {
    id:
      'solubility-01',

    topic:
      'solubility',

    difficulty:
      'easy',

    question:
      'Muối nitrate NO₃⁻ thường có tính tan như thế nào trong nước?',

    options:
      [
        'Hầu hết tan',
        'Hầu hết không tan',
        'Chỉ tan khi đun nóng',
        'Không có quy luật'
      ],

    answer:
      'Hầu hết tan',

    explanation:
      'Theo quy tắc tan phổ thông, hầu hết muối nitrate đều tan trong nước.'
  },


  {
    id:
      'solubility-02',

    topic:
      'solubility',

    difficulty:
      'easy',

    question:
      'Chất nào sau đây tạo kết tủa trắng điển hình?',

    options:
      [
        'NaCl',
        'KNO₃',
        'AgCl',
        'NaNO₃'
      ],

    answer:
      'AgCl',

    explanation:
      'AgCl ít tan trong nước và tạo kết tủa trắng.'
  },


  {
    id:
      'solubility-03',

    topic:
      'solubility',

    difficulty:
      'medium',

    question:
      'BaSO₄ trong nước được xem là gì?',

    options:
      [
        'Tan tốt',
        'Ít tan/không tan',
        'Khí',
        'Axit mạnh'
      ],

    answer:
      'Ít tan/không tan',

    explanation:
      'BaSO₄ rất ít tan trong nước và thường xuất hiện dưới dạng kết tủa trắng.'
  },


  {
    id:
      'solubility-04',

    topic:
      'solubility',

    difficulty:
      'medium',

    question:
      'Muối của kim loại kiềm như Na⁺ và K⁺ thường có tính tan như thế nào?',

    options:
      [
        'Thường tan',
        'Luôn kết tủa',
        'Chỉ tan trong axit',
        'Không tan'
      ],

    answer:
      'Thường tan',

    explanation:
      'Phần lớn muối của Na⁺, K⁺ và các kim loại kiềm tan tốt trong nước.'
  },


  {
    id:
      'solubility-05',

    topic:
      'solubility',

    difficulty:
      'hard',

    question:
      'Trộn AgNO₃ và NaCl trong dung dịch sẽ xuất hiện chất nào?',

    options:
      [
        'AgCl↓',
        'NaNO₃↓',
        'AgNO₃↓',
        'Cl₂↑'
      ],

    answer:
      'AgCl↓',

    explanation:
      'Ag⁺ + Cl⁻ → AgCl↓. AgCl là kết tủa trắng.'
  }

]


/* =========================================================
   INIT
========================================================= */

export function initQuiz() {

  document
    .querySelector(
      '#quiz'
    )
    ?.remove()


  const root =
    document.createElement(
      'section'
    )


  root.id =
    'quiz'


  root.className =
    'chem-learning-v3'


  document.body
    .appendChild(
      root
    )


  let data =
    loadLearningData()


  let selectedMode =
    'practice'


  let selectedTopic =
    'all'


  let selectedDifficulty =
    'mixed'


  let selectedCount =
    10


  let session =
    null


  renderHome()


  /* =====================================================
     HOME
  ===================================================== */

  function renderHome() {

    data =
      normalizeLearningData(
        data
      )


    const level =
      getLevel(
        data.xp
      )


    const nextLevelXP =
      getLevelStartXP(
        level + 1
      )


    const currentLevelXP =
      getLevelStartXP(
        level
      )


    const levelProgress =
      clamp(
        (
          data.xp -
          currentLevelXP
        ) /
        Math.max(
          1,
          nextLevelXP -
          currentLevelXP
        ) *
        100,
        0,
        100
      )


    root.innerHTML = `
      <div class="cl-learn">


        <!-- ===============================================
             DASHBOARD
        ================================================ -->

        <section class="cl-learn-dashboard">


          <div class="cl-learn-profile">

            <div class="cl-learn-level">

              <span>
                CẤP
              </span>

              <strong>
                ${level}
              </strong>

            </div>


            <div class="cl-learn-profile-copy">

              <span>
                TIẾN ĐỘ HỌC TẬP
              </span>

              <h2>
                Learning Mode
              </h2>

              <p>
                Luyện tập, phát hiện điểm yếu
                và ôn lại những câu bạn từng làm sai.
              </p>


              <div class="cl-level-progress">

                <div>

                  <span>
                    ${data.xp} XP
                  </span>

                  <span>
                    ${
                      Math.max(
                        0,
                        nextLevelXP -
                        data.xp
                      )
                    }
                    XP tới cấp ${level + 1}
                  </span>

                </div>


                <div class="cl-progress-track">

                  <i
                    style="
                      width:
                      ${levelProgress}%
                    "
                  ></i>

                </div>

              </div>

            </div>

          </div>


          <div class="cl-learn-stats">

            ${statCard(
              '⚡',
              data.xp,
              'Tổng XP'
            )}

            ${statCard(
              '🔥',
              data.streak,
              'Ngày liên tiếp'
            )}

            ${statCard(
              '◎',
              `${getAccuracy(data)}%`,
              'Chính xác'
            )}

            ${statCard(
              '↻',
              data.reviewQueue.length,
              'Cần ôn lại'
            )}

          </div>

        </section>


        <!-- ===============================================
             MASTERY
        ================================================ -->

        <section class="cl-mastery">

          <div class="cl-section-head">

            <div>

              <span>
                MASTERY
              </span>

              <h3>
                Mức độ thành thạo
              </h3>

            </div>


            <small>
              Cập nhật sau mỗi câu trả lời
            </small>

          </div>


          <div class="cl-mastery-grid">

            ${
              Object
                .entries(
                  TOPICS
                )
                .map(
                  ([id,topic]) =>
                    masteryCard(
                      id,
                      topic,
                      data
                    )
                )
                .join('')
            }

          </div>

        </section>


        <!-- ===============================================
             SESSION SETUP
        ================================================ -->

        <section class="cl-learning-setup">

          <div class="cl-section-head">

            <div>

              <span>
                PHIÊN HỌC
              </span>

              <h3>
                Bạn muốn học theo cách nào?
              </h3>

            </div>

          </div>


          <div
            id="cl-mode-grid"
            class="cl-mode-grid"
          >

            ${modeCard({
              id:
                'practice',

              icon:
                '▶',

              title:
                'Luyện tập',

              description:
                'Làm câu hỏi theo chủ đề và độ khó bạn chọn.',

              badge:
                'Mặc định'
            })}


            ${modeCard({
              id:
                'review',

              icon:
                '↻',

              title:
                'Ôn câu sai',

              description:
                'Làm lại những câu bạn từng trả lời sai.',

              badge:
                `${data.reviewQueue.length} câu`
            })}


            ${modeCard({
              id:
                'weak',

              icon:
                '◒',

              title:
                'Cần ôn thêm',

              description:
                'ChemLab ưu tiên các chủ đề có mastery thấp.',

              badge:
                getWeakTopicLabel(
                  data
                )
            })}

          </div>


          <!-- TOPIC -->

          <div class="cl-setup-block">

            <div class="cl-setup-title">

              <span>
                CHỦ ĐỀ
              </span>

            </div>


            <div
              id="cl-topic-options"
              class="cl-topic-options"
            >

              <button
                type="button"
                data-topic="all"
                class="${
                  selectedTopic ===
                  'all'
                    ? 'active'
                    : ''
                }"
              >
                Tất cả
              </button>


              ${
                Object
                  .entries(
                    TOPICS
                  )
                  .map(
                    ([id,topic]) => `
                      <button
                        type="button"
                        data-topic="${id}"
                        class="${
                          selectedTopic ===
                          id
                            ? 'active'
                            : ''
                        }"
                      >
                        ${topic.icon}
                        ${topic.name}
                      </button>
                    `
                  )
                  .join('')
              }

            </div>

          </div>


          <!-- DIFFICULTY -->

          <div class="cl-setup-block">

            <div class="cl-setup-title">

              <span>
                ĐỘ KHÓ
              </span>

            </div>


            <div
              id="cl-difficulty-options"
              class="cl-choice-row"
            >

              ${difficultyButton(
                'easy',
                'Dễ',
                selectedDifficulty
              )}

              ${difficultyButton(
                'medium',
                'Trung bình',
                selectedDifficulty
              )}

              ${difficultyButton(
                'hard',
                'Khó',
                selectedDifficulty
              )}

              ${difficultyButton(
                'mixed',
                'Trộn',
                selectedDifficulty
              )}

            </div>

          </div>


          <!-- COUNT -->

          <div class="cl-setup-block">

            <div class="cl-setup-title">

              <span>
                SỐ CÂU
              </span>

            </div>


            <div
              id="cl-count-options"
              class="cl-choice-row"
            >

              ${countButton(
                5,
                selectedCount
              )}

              ${countButton(
                10,
                selectedCount
              )}

              ${countButton(
                15,
                selectedCount
              )}

            </div>

          </div>


          <div class="cl-start-row">

            <div id="cl-start-note">

              ${
                getStartNote(
                  selectedMode,
                  data
                )
              }

            </div>


            <button
              id="cl-start"
              class="cl-start-button"
              type="button"
            >

              <span>
                Bắt đầu
              </span>

              <strong>
                →
              </strong>

            </button>

          </div>

        </section>


        <!-- ===============================================
             INSIGHTS
        ================================================ -->

        <section class="cl-insights">

          <div class="cl-weak-panel">

            <div class="cl-section-head">

              <div>

                <span>
                  CẦN ÔN THÊM
                </span>

                <h3>
                  Chủ đề cần chú ý
                </h3>

              </div>

            </div>


            ${renderWeakTopics(data)}

          </div>


          <div class="cl-history-panel">

            <div class="cl-section-head">

              <div>

                <span>
                  LỊCH SỬ
                </span>

                <h3>
                  Phiên học gần đây
                </h3>

              </div>

            </div>


            ${renderHistory(data)}

          </div>

        </section>

      </div>
    `


    bindHomeEvents()

    updateStartButton()

  }


  /* =====================================================
     HOME EVENTS
  ===================================================== */

  function bindHomeEvents() {

    root
      .querySelector(
        '#cl-mode-grid'
      )
      ?.addEventListener(
        'click',
        event => {

          const button =
            event.target.closest(
              '[data-mode]'
            )


          if (!button) {
            return
          }


          selectedMode =
            button.dataset.mode


          root
            .querySelectorAll(
              '[data-mode]'
            )
            .forEach(
              item => {

                item.classList.toggle(
                  'active',
                  item === button
                )

              }
            )


          updateStartButton()

        }
      )


    root
      .querySelector(
        '#cl-topic-options'
      )
      ?.addEventListener(
        'click',
        event => {

          const button =
            event.target.closest(
              '[data-topic]'
            )


          if (!button) {
            return
          }


          selectedTopic =
            button.dataset.topic


          setSingleActive(
            '#cl-topic-options [data-topic]',
            button
          )


          updateStartButton()

        }
      )


    root
      .querySelector(
        '#cl-difficulty-options'
      )
      ?.addEventListener(
        'click',
        event => {

          const button =
            event.target.closest(
              '[data-difficulty]'
            )


          if (!button) {
            return
          }


          selectedDifficulty =
            button.dataset
              .difficulty


          setSingleActive(
            '#cl-difficulty-options [data-difficulty]',
            button
          )


          updateStartButton()

        }
      )


    root
      .querySelector(
        '#cl-count-options'
      )
      ?.addEventListener(
        'click',
        event => {

          const button =
            event.target.closest(
              '[data-count]'
            )


          if (!button) {
            return
          }


          selectedCount =
            Number(
              button.dataset.count
            )


          setSingleActive(
            '#cl-count-options [data-count]',
            button
          )


          updateStartButton()

        }
      )


    root
      .querySelector(
        '#cl-start'
      )
      ?.addEventListener(
        'click',
        startSession
      )

  }


  /* =====================================================
     START BUTTON
  ===================================================== */

  function updateStartButton() {

    const button =
      root.querySelector(
        '#cl-start'
      )


    const note =
      root.querySelector(
        '#cl-start-note'
      )


    const pool =
      buildQuestionPool()


    const available =
      pool.length


    if (button) {

      button.disabled =
        available === 0


      const label =
        button.querySelector(
          'span'
        )


      if (label) {

        label.textContent =
          available > 0
            ? `Bắt đầu · ${Math.min(
                selectedCount,
                available
              )} câu`
            : 'Chưa có câu để học'

      }

    }


    if (note) {

      note.innerHTML =
        getStartNote(
          selectedMode,
          data,
          available
        )

    }

  }


  /* =====================================================
     QUESTION POOL
  ===================================================== */

  function buildQuestionPool() {

    let pool =
      [...QUESTIONS]


    if (
      selectedMode ===
      'review'
    ) {

      const queue =
        new Set(
          data.reviewQueue
        )


      pool =
        pool.filter(
          question =>
            queue.has(
              question.id
            )
        )

    }


    if (
      selectedMode ===
      'weak'
    ) {

      const weakTopics =
        getWeakTopics(
          data
        )
          .map(
            item =>
              item.id
          )


      if (
        weakTopics.length
      ) {

        pool =
          pool.filter(
            question =>
              weakTopics.includes(
                question.topic
              )
          )

      }

    }


    if (
      selectedTopic !==
      'all'
    ) {

      const filtered =
        pool.filter(
          question =>
            question.topic ===
            selectedTopic
        )


      if (
        filtered.length ||
        selectedMode ===
        'practice'
      ) {

        pool =
          filtered

      }

    }


    if (
      selectedDifficulty !==
      'mixed'
    ) {

      const filtered =
        pool.filter(
          question =>
            question.difficulty ===
            selectedDifficulty
        )


      if (
        filtered.length ||
        selectedMode ===
        'practice'
      ) {

        pool =
          filtered

      }

    }


    return pool

  }


  /* =====================================================
     START SESSION
  ===================================================== */

  function startSession() {

    const pool =
      shuffle(
        buildQuestionPool()
      )


    if (
      !pool.length
    ) {
      return
    }


    const count =
      Math.min(
        selectedCount,
        pool.length
      )


    session = {

      mode:
        selectedMode,

      topic:
        selectedTopic,

      difficulty:
        selectedDifficulty,

      questions:
        pool
          .slice(
            0,
            count
          )
          .map(
            randomizeQuestion
          ),

      index:
        0,

      correct:
        0,

      wrong:
        0,

      xp:
        0,

      answers:
        [],

      answered:
        false,

      selectedAnswer:
        null

    }


    renderQuestion()

  }


  /* =====================================================
     QUESTION
  ===================================================== */

  function renderQuestion() {

    if (!session) {
      return
    }


    const question =
      session.questions[
        session.index
      ]


    if (!question) {

      finishSession()

      return

    }


    session.answered =
      false


    session.selectedAnswer =
      null


    const progress =
      (
        session.index /
        session.questions.length
      ) *
      100


    const topic =
      TOPICS[
        question.topic
      ]


    root.innerHTML = `
      <div class="cl-session">


        <header class="cl-session-top">

          <button
            id="cl-exit-session"
            class="cl-session-back"
            type="button"
          >
            ← Thoát
          </button>


          <div class="cl-session-progress">

            <div>

              <span>
                Câu
                ${session.index + 1}
                /
                ${session.questions.length}
              </span>

              <strong>
                +${session.xp} XP
              </strong>

            </div>


            <div class="cl-progress-track">

              <i
                style="
                  width:
                  ${progress}%
                "
              ></i>

            </div>

          </div>


          <div class="cl-session-score">

            <span>
              Đúng
            </span>

            <strong>
              ${session.correct}
            </strong>

          </div>

        </header>


        <main class="cl-question-card">

          <div class="cl-question-meta">

            <span>
              ${topic.icon}
              ${topic.name}
            </span>

            <span
              class="
                cl-difficulty
                ${question.difficulty}
              "
            >
              ${
                difficultyLabel(
                  question.difficulty
                )
              }
            </span>

          </div>


          <span class="cl-question-number">
            CÂU ${session.index + 1}
          </span>


          <h2>
            ${question.question}
          </h2>


          <div
            id="cl-answer-grid"
            class="cl-answer-grid"
          >

            ${
              question.options
                .map(
                  (option,index) => `
                    <button
                      type="button"
                      class="cl-answer-option"
                      data-answer="${escapeAttribute(option)}"
                    >

                      <span>
                        ${String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <strong>
                        ${option}
                      </strong>

                    </button>
                  `
                )
                .join('')
            }

          </div>


          <div
            id="cl-feedback"
            class="cl-feedback"
            hidden
          ></div>

        </main>


        <footer class="cl-session-footer">

          <div>

            ${
              session.mode ===
                'review'

                ? '↻ Đang ôn câu sai'

                : session.mode ===
                  'weak'

                  ? '◒ Đang ưu tiên chủ đề yếu'

                  : '▶ Luyện tập'
            }

          </div>


          <button
            id="cl-next-question"
            class="cl-next-button"
            type="button"
            disabled
          >

            ${
              session.index ===
                session.questions.length - 1

                ? 'Xem kết quả'

                : 'Câu tiếp theo'
            }

            →

          </button>

        </footer>

      </div>
    `


    bindQuestionEvents()

  }


  /* =====================================================
     QUESTION EVENTS
  ===================================================== */

  function bindQuestionEvents() {

    root
      .querySelector(
        '#cl-exit-session'
      )
      ?.addEventListener(
        'click',
        () => {

          session =
            null


          renderHome()

        }
      )


    root
      .querySelector(
        '#cl-answer-grid'
      )
      ?.addEventListener(
        'click',
        event => {

          const button =
            event.target.closest(
              '[data-answer]'
            )


          if (
            !button ||
            session.answered
          ) {
            return
          }


          answerQuestion(
            button.dataset.answer,
            button
          )

        }
      )


    root
      .querySelector(
        '#cl-next-question'
      )
      ?.addEventListener(
        'click',
        () => {

          if (
            !session.answered
          ) {
            return
          }


          session.index++


          if (
            session.index >=
            session.questions.length
          ) {

            finishSession()

          }

          else {

            renderQuestion()

          }

        }
      )

  }


  /* =====================================================
     ANSWER QUESTION
     MASTER + REVIEW FIX ĐÃ ĐƯỢC GẮN SẴN Ở ĐÂY
  ===================================================== */

  function answerQuestion(
    answer,
    clickedButton
  ) {

    const question =
      session.questions[
        session.index
      ]


    if (!question) {
      return
    }


    const correct =
      answer ===
      question.answer


    session.answered =
      true


    session.selectedAnswer =
      answer


    const gainedXP =
      correct
        ? xpForDifficulty(
            question.difficulty
          )
        : 2


    session.xp +=
      gainedXP


    if (correct) {

      session.correct++

    }

    else {

      session.wrong++

    }


    session.answers.push({

      id:
        question.id,

      topic:
        question.topic,

      correct,

      answer,

      expected:
        question.answer

    })


    /* ===================================================
       UPDATE PERMANENT STATISTICS
    =================================================== */

    data.totalAnswered++


    if (correct) {

      data.totalCorrect++

    }


    data.xp +=
      gainedXP


    /* ===================================================
       MASTERY
    =================================================== */

    updateMasteryObject(
      data,
      question.topic,
      correct
    )


    /* ===================================================
       REVIEW QUEUE
    =================================================== */

    const reviewQueue =
      new Set(
        data.reviewQueue
      )


    if (correct) {

      reviewQueue.delete(
        question.id
      )

    }

    else {

      reviewQueue.add(
        question.id
      )

    }


    data.reviewQueue =
      [...reviewQueue]


    /* ===================================================
       SAVE
    =================================================== */

    saveLearningData(
      data
    )


    /* ===================================================
       ANSWER BUTTON STATES
    =================================================== */

    root
      .querySelectorAll(
        '[data-answer]'
      )
      .forEach(
        button => {

          button.disabled =
            true


          const value =
            button.dataset.answer


          if (
            value ===
            question.answer
          ) {

            button.classList.add(
              'correct'
            )

          }


          if (
            button ===
              clickedButton &&
            !correct
          ) {

            button.classList.add(
              'wrong'
            )

          }

        }
      )


    /* ===================================================
       FEEDBACK
    =================================================== */

    const feedback =
      root.querySelector(
        '#cl-feedback'
      )


    if (feedback) {

      feedback.hidden =
        false


      feedback.className =
        `cl-feedback ${
          correct
            ? 'correct'
            : 'wrong'
        }`


      feedback.innerHTML = `
        <div class="cl-feedback-icon">

          ${
            correct
              ? '✓'
              : '!'
          }

        </div>


        <div>

          <strong>

            ${
              correct
                ? 'Chính xác!'
                : `Đáp án đúng: ${question.answer}`
            }

          </strong>


          <p>
            ${question.explanation}
          </p>

        </div>


        <span class="cl-feedback-xp">
          +${gainedXP} XP
        </span>
      `

    }


    const nextButton =
      root.querySelector(
        '#cl-next-question'
      )


    if (nextButton) {

      nextButton.disabled =
        false

    }

  }


  /* =====================================================
     FINISH SESSION
  ===================================================== */

  function finishSession() {

    if (!session) {
      return
    }


    const accuracy =
      Math.round(
        session.correct /
        session.questions.length *
        100
      )


    let bonus =
      0


    if (
      accuracy ===
      100
    ) {

      bonus =
        20


      data.xp +=
        bonus


      session.xp +=
        bonus

    }


    updateStreak(
      data
    )


    data.history.unshift({

      id:
        Date.now(),

      date:
        new Date()
          .toISOString(),

      correct:
        session.correct,

      total:
        session.questions.length,

      xp:
        session.xp,

      accuracy,

      mode:
        session.mode

    })


    data.history =
      data.history
        .slice(
          0,
          10
        )


    saveLearningData(
      data
    )


    const finished =
      session


    session =
      null


    renderResult(
      finished,
      accuracy,
      bonus
    )

  }


  /* =====================================================
     RESULT
  ===================================================== */

  function renderResult(
    finished,
    accuracy,
    bonus
  ) {

    const level =
      getLevel(
        data.xp
      )


    const weakTopics =
      getWeakTopics(
        data
      )
        .slice(
          0,
          3
        )


    root.innerHTML = `
      <div class="cl-result">


        <div class="cl-result-hero">

          <div class="cl-result-score">

            <strong>
              ${accuracy}%
            </strong>

            <span>
              chính xác
            </span>

          </div>


          <span class="cl-result-eyebrow">
            HOÀN THÀNH PHIÊN HỌC
          </span>


          <h2>
            ${
              resultTitle(
                accuracy
              )
            }
          </h2>


          <p>
            Bạn trả lời đúng

            <strong>
              ${finished.correct}
            </strong>

            /
            ${finished.questions.length}
            câu.
          </p>

        </div>


        <div class="cl-result-stats">

          ${resultStat(
            '⚡',
            `+${finished.xp}`,
            'XP nhận được'
          )}

          ${resultStat(
            '✓',
            finished.correct,
            'Câu đúng'
          )}

          ${resultStat(
            '↻',
            finished.wrong,
            'Câu cần ôn'
          )}

          ${resultStat(
            '🔥',
            data.streak,
            'Streak'
          )}

        </div>


        ${
          bonus
            ? `
              <div class="cl-perfect-bonus">

                ✦ Perfect Session
                ·
                +${bonus} XP thưởng

              </div>
            `
            : ''
        }


        <section class="cl-result-review">

          <div class="cl-section-head">

            <div>

              <span>
                GỢI Ý TIẾP THEO
              </span>

              <h3>
                Nên học gì tiếp?
              </h3>

            </div>

          </div>


          ${
            weakTopics.length

              ? `
                <div class="cl-result-topic-list">

                  ${
                    weakTopics
                      .map(
                        item => `
                          <div>

                            <span>
                              ${
                                TOPICS[
                                  item.id
                                ].icon
                              }
                            </span>

                            <strong>
                              ${
                                TOPICS[
                                  item.id
                                ].name
                              }
                            </strong>

                            <small>
                              Mastery
                              ${item.score}%
                            </small>

                          </div>
                        `
                      )
                      .join('')
                  }

                </div>
              `

              : `
                <div class="cl-result-good">

                  Bạn đang có kết quả khá đồng đều
                  ở các chủ đề đã học.

                </div>
              `
          }

        </section>


        <div class="cl-result-actions">

          <button
            id="cl-result-home"
            type="button"
            class="secondary"
          >
            ← Về Learning
          </button>


          <button
            id="cl-result-review"
            type="button"
            ${
              data.reviewQueue.length
                ? ''
                : 'disabled'
            }
          >
            ↻ Ôn
            ${data.reviewQueue.length}
            câu sai
          </button>


          <button
            id="cl-result-again"
            type="button"
            class="primary"
          >
            Luyện tiếp →
          </button>

        </div>


        <div class="cl-result-level">

          <span>
            Cấp hiện tại
          </span>

          <strong>
            ${level}
          </strong>

          <small>
            ${data.xp} XP
          </small>

        </div>

      </div>
    `


    root
      .querySelector(
        '#cl-result-home'
      )
      ?.addEventListener(
        'click',
        renderHome
      )


    root
      .querySelector(
        '#cl-result-again'
      )
      ?.addEventListener(
        'click',
        () => {

          selectedMode =
            'practice'


          renderHome()

        }
      )


    root
      .querySelector(
        '#cl-result-review'
      )
      ?.addEventListener(
        'click',
        () => {

          if (
            !data.reviewQueue.length
          ) {
            return
          }


          selectedMode =
            'review'


          selectedTopic =
            'all'


          selectedDifficulty =
            'mixed'


          selectedCount =
            Math.min(
              10,
              data.reviewQueue.length
            )


          startSession()

        }
      )

  }


  /* =====================================================
     SINGLE ACTIVE
  ===================================================== */

  function setSingleActive(
    selector,
    selected
  ) {

    root
      .querySelectorAll(
        selector
      )
      .forEach(
        button => {

          button.classList.toggle(
            'active',
            button === selected
          )

        }
      )

  }

}


/* =========================================================
   MODE CARD
========================================================= */

function modeCard({
  id,
  icon,
  title,
  description,
  badge
}) {

  return `
    <button
      type="button"
      class="
        cl-mode-card
        ${
          id ===
          'practice'
            ? 'active'
            : ''
        }
      "
      data-mode="${id}"
    >

      <div class="cl-mode-icon">
        ${icon}
      </div>


      <div>

        <span>
          ${badge}
        </span>

        <strong>
          ${title}
        </strong>

        <p>
          ${description}
        </p>

      </div>


      <i>
        →
      </i>

    </button>
  `

}


/* =========================================================
   DIFFICULTY BUTTON
========================================================= */

function difficultyButton(
  id,
  label,
  selected
) {

  return `
    <button
      type="button"
      data-difficulty="${id}"
      class="${
        selected ===
        id
          ? 'active'
          : ''
      }"
    >
      ${label}
    </button>
  `

}


/* =========================================================
   COUNT BUTTON
========================================================= */

function countButton(
  count,
  selected
) {

  return `
    <button
      type="button"
      data-count="${count}"
      class="${
        Number(selected) ===
        count
          ? 'active'
          : ''
      }"
    >
      ${count} câu
    </button>
  `

}


/* =========================================================
   STAT CARD
========================================================= */

function statCard(
  icon,
  value,
  label
) {

  return `
    <div class="cl-stat-card">

      <span>
        ${icon}
      </span>

      <div>

        <strong>
          ${value}
        </strong>

        <small>
          ${label}
        </small>

      </div>

    </div>
  `

}


/* =========================================================
   RESULT STAT
========================================================= */

function resultStat(
  icon,
  value,
  label
) {

  return `
    <div>

      <span>
        ${icon}
      </span>

      <strong>
        ${value}
      </strong>

      <small>
        ${label}
      </small>

    </div>
  `

}


/* =========================================================
   MASTERY CARD
========================================================= */

function masteryCard(
  id,
  topic,
  data
) {

  const mastery =
    getTopicMastery(
      data,
      id
    )


  const status =
    mastery.total ===
      0

      ? 'Chưa học'

      : mastery.score >=
        80

        ? 'Tốt'

        : mastery.score >=
          60

          ? 'Đang tiến bộ'

          : 'Cần ôn'


  return `
    <div class="cl-mastery-card">

      <div class="cl-mastery-top">

        <span class="cl-mastery-icon">
          ${topic.icon}
        </span>


        <div>

          <strong>
            ${topic.name}
          </strong>

          <small>
            ${status}
          </small>

        </div>


        <b>
          ${
            mastery.total
              ? `${mastery.score}%`
              : '—'
          }
        </b>

      </div>


      <div class="cl-progress-track">

        <i
          style="
            width:
            ${
              mastery.total
                ? mastery.score
                : 0
            }%
          "
        ></i>

      </div>


      <p>
        ${
          mastery.total
            ? `${mastery.correct}/${mastery.total} câu đúng`
            : topic.description
        }
      </p>

    </div>
  `

}


/* =========================================================
   WEAK TOPICS
========================================================= */

function renderWeakTopics(
  data
) {

  const weak =
    getWeakTopics(
      data
    )
      .slice(
        0,
        4
      )


  if (
    !weak.length
  ) {

    return `
      <div class="cl-empty-insight">

        <strong>
          Chưa đủ dữ liệu
        </strong>

        <span>
          Hoàn thành vài phiên học để ChemLab
          xác định chủ đề cần ôn.
        </span>

      </div>
    `

  }


  return `
    <div class="cl-weak-list">

      ${
        weak
          .map(
            item => {

              const topic =
                TOPICS[
                  item.id
                ]


              return `
                <div>

                  <span>
                    ${topic.icon}
                  </span>


                  <div>

                    <strong>
                      ${topic.name}
                    </strong>

                    <small>
                      ${item.correct}
                      /
                      ${item.total}
                      câu đúng
                    </small>

                  </div>


                  <b>
                    ${item.score}%
                  </b>

                </div>
              `

            }
          )
          .join('')
      }

    </div>
  `

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory(
  data
) {

  if (
    !data.history.length
  ) {

    return `
      <div class="cl-empty-insight">

        <strong>
          Chưa có phiên học
        </strong>

        <span>
          Phiên học hoàn thành sẽ xuất hiện tại đây.
        </span>

      </div>
    `

  }


  return `
    <div class="cl-history-list">

      ${
        data.history
          .slice(
            0,
            5
          )
          .map(
            entry => `
              <div>

                <span>
                  ${
                    historyModeIcon(
                      entry.mode
                    )
                  }
                </span>


                <div>

                  <strong>
                    ${
                      historyModeLabel(
                        entry.mode
                      )
                    }
                  </strong>

                  <small>
                    ${
                      formatDate(
                        entry.date
                      )
                    }
                  </small>

                </div>


                <b>
                  ${entry.accuracy}%
                </b>


                <em>
                  +${entry.xp} XP
                </em>

              </div>
            `
          )
          .join('')
      }

    </div>
  `

}


/* =========================================================
   GET TOPIC MASTERY
========================================================= */

function getTopicMastery(
  data,
  topic
) {

  const stats =
    data.mastery[
      topic
    ] ||
    {
      correct:
        0,

      total:
        0
    }


  const score =
    stats.total
      ? Math.round(
          stats.correct /
          stats.total *
          100
        )
      : 0


  return {

    ...stats,

    score

  }

}


/* =========================================================
   UPDATE MASTERY
========================================================= */

function updateMasteryObject(
  data,
  topic,
  correct
) {

  data.mastery[
    topic
  ] ??= {

    correct:
      0,

    total:
      0

  }


  data.mastery[
    topic
  ].total++


  if (correct) {

    data.mastery[
      topic
    ].correct++

  }

}


/* =========================================================
   WEAK TOPICS
========================================================= */

function getWeakTopics(
  data
) {

  return Object
    .keys(
      TOPICS
    )
    .map(
      id => {

        const mastery =
          getTopicMastery(
            data,
            id
          )


        return {

          id,

          ...mastery

        }

      }
    )
    .filter(
      item =>
        item.total >
          0 &&
        (
          item.score <
            75 ||
          item.total <
            4
        )
    )
    .sort(
      (a,b) => {

        if (
          a.score !==
          b.score
        ) {

          return (
            a.score -
            b.score
          )

        }


        return (
          a.total -
          b.total
        )

      }
    )

}


/* =========================================================
   WEAK TOPIC LABEL
========================================================= */

function getWeakTopicLabel(
  data
) {

  const weak =
    getWeakTopics(
      data
    )


  if (
    !weak.length
  ) {

    return 'Tự động'

  }


  return TOPICS[
    weak[0].id
  ].name

}


/* =========================================================
   START NOTE
========================================================= */

function getStartNote(
  mode,
  data,
  available = null
) {

  if (
    mode ===
    'review'
  ) {

    if (
      !data.reviewQueue.length
    ) {

      return `
        <span>
          ✓ Bạn chưa có câu sai cần ôn.
        </span>
      `

    }


    return `
      <span>
        ↻ Có

        <strong>
          ${data.reviewQueue.length}
        </strong>

        câu trong danh sách ôn.
      </span>
    `

  }


  if (
    mode ===
    'weak'
  ) {

    const weak =
      getWeakTopics(
        data
      )


    if (
      !weak.length
    ) {

      return `
        <span>
          ◒ Chưa đủ dữ liệu.
          ChemLab sẽ dùng câu hỏi tổng hợp.
        </span>
      `

    }


    return `
      <span>
        ◒ Ưu tiên

        <strong>
          ${
            TOPICS[
              weak[0].id
            ].name
          }
        </strong>.
      </span>
    `

  }


  if (
    available ===
    0
  ) {

    return `
      <span>
        Không có câu phù hợp với bộ lọc hiện tại.
      </span>
    `

  }


  return `
    <span>
      Chọn chủ đề và bắt đầu khi sẵn sàng.
    </span>
  `

}


/* =========================================================
   LEARNING DATA
========================================================= */

function normalizeLearningData(
  data
) {

  const normalized = {

    xp:
      Number(
        data?.xp
      ) ||
      0,

    streak:
      Number(
        data?.streak
      ) ||
      0,

    lastStudyDate:
      data?.lastStudyDate ||
      null,

    totalAnswered:
      Number(
        data?.totalAnswered
      ) ||
      0,

    totalCorrect:
      Number(
        data?.totalCorrect
      ) ||
      0,

    reviewQueue:
      Array.isArray(
        data?.reviewQueue
      )
        ? [
            ...new Set(
              data.reviewQueue
            )
          ]
        : [],

    mastery:
      {},

    history:
      Array.isArray(
        data?.history
      )
        ? data.history
        : []

  }


  Object
    .keys(
      TOPICS
    )
    .forEach(
      topic => {

        normalized.mastery[
          topic
        ] = {

          correct:
            Number(
              data?.mastery?.[
                topic
              ]?.correct
            ) ||
            0,

          total:
            Number(
              data?.mastery?.[
                topic
              ]?.total
            ) ||
            0

        }

      }
    )


  return normalized

}


/* =========================================================
   DEFAULT DATA
========================================================= */

function defaultLearningData() {

  return normalizeLearningData({

    xp:
      0,

    streak:
      0,

    lastStudyDate:
      null,

    totalAnswered:
      0,

    totalCorrect:
      0,

    reviewQueue:
      [],

    mastery:
      {},

    history:
      []

  })

}


/* =========================================================
   STORAGE
========================================================= */

function loadLearningData() {

  try {

    const raw =
      localStorage.getItem(
        STORAGE_KEY
      )


    if (!raw) {

      return defaultLearningData()

    }


    return normalizeLearningData(
      JSON.parse(
        raw
      )
    )

  }

  catch {

    return defaultLearningData()

  }

}


function saveLearningData(
  data
) {

  try {

    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify(
        normalizeLearningData(
          data
        )
      )
    )

  }

  catch {

    /*
      Nếu localStorage bị chặn,
      Learning vẫn hoạt động
      trong phiên hiện tại.
    */

  }

}


/* =========================================================
   STREAK
========================================================= */

function updateStreak(
  data
) {

  const today =
    localDateKey(
      new Date()
    )


  if (
    data.lastStudyDate ===
    today
  ) {

    return

  }


  const yesterday =
    new Date()


  yesterday.setDate(
    yesterday.getDate() -
    1
  )


  const yesterdayKey =
    localDateKey(
      yesterday
    )


  if (
    data.lastStudyDate ===
    yesterdayKey
  ) {

    data.streak++

  }

  else {

    data.streak =
      1

  }


  data.lastStudyDate =
    today

}


/* =========================================================
   ACCURACY
========================================================= */

function getAccuracy(
  data
) {

  if (
    !data.totalAnswered
  ) {

    return 0

  }


  return Math.round(
    data.totalCorrect /
    data.totalAnswered *
    100
  )

}


/* =========================================================
   XP
========================================================= */

function xpForDifficulty(
  difficulty
) {

  if (
    difficulty ===
    'hard'
  ) {

    return 20

  }


  if (
    difficulty ===
    'medium'
  ) {

    return 15

  }


  return 10

}


/* =========================================================
   LEVEL
========================================================= */

function getLevel(
  xp
) {

  return (
    Math.floor(
      Math.sqrt(
        Math.max(
          0,
          xp
        ) /
        100
      )
    ) +
    1
  )

}


function getLevelStartXP(
  level
) {

  return Math.pow(
    Math.max(
      0,
      level - 1
    ),
    2
  ) * 100

}


/* =========================================================
   RANDOMIZE
========================================================= */

function randomizeQuestion(
  question
) {

  return {

    ...question,

    options:
      shuffle(
        question.options
      )

  }

}


function shuffle(
  array
) {

  const result =
    [...array]


  for (
    let i =
      result.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      )


    ;[
      result[i],
      result[j]
    ] = [
      result[j],
      result[i]
    ]

  }


  return result

}


/* =========================================================
   DIFFICULTY
========================================================= */

function difficultyLabel(
  difficulty
) {

  if (
    difficulty ===
    'easy'
  ) {

    return 'Dễ'

  }


  if (
    difficulty ===
    'medium'
  ) {

    return 'Trung bình'

  }


  return 'Khó'

}


/* =========================================================
   RESULT TITLE
========================================================= */

function resultTitle(
  accuracy
) {

  if (
    accuracy ===
    100
  ) {

    return 'Hoàn hảo!'

  }


  if (
    accuracy >=
    80
  ) {

    return 'Rất tốt!'

  }


  if (
    accuracy >=
    60
  ) {

    return 'Đang tiến bộ'

  }


  return 'Tiếp tục luyện tập'

}


/* =========================================================
   HISTORY
========================================================= */

function historyModeIcon(
  mode
) {

  if (
    mode ===
    'review'
  ) {

    return '↻'

  }


  if (
    mode ===
    'weak'
  ) {

    return '◒'

  }


  return '▶'

}


function historyModeLabel(
  mode
) {

  if (
    mode ===
    'review'
  ) {

    return 'Ôn câu sai'

  }


  if (
    mode ===
    'weak'
  ) {

    return 'Cần ôn thêm'

  }


  return 'Luyện tập'

}


/* =========================================================
   DATE
========================================================= */

function formatDate(
  iso
) {

  const date =
    new Date(
      iso
    )


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return '—'

  }


  return date
    .toLocaleDateString(
      'vi-VN',
      {
        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric'
      }
    )

}


function localDateKey(
  date
) {

  const year =
    date.getFullYear()


  const month =
    String(
      date.getMonth() +
      1
    )
      .padStart(
        2,
        '0'
      )


  const day =
    String(
      date.getDate()
    )
      .padStart(
        2,
        '0'
      )


  return (
    `${year}-${month}-${day}`
  )

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeAttribute(
  value
) {

  return String(
    value
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )

}


/* =========================================================
   CLAMP
========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  )

}