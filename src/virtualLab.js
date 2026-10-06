import './virtualLab.css'


export function initVirtualLab() {

  const host =
    document.querySelector(
      '#lab-host'
    ) ||
    document.querySelector(
      'main'
    )

  if (!host) return


  document
    .querySelector('#lab')
    ?.remove()


  /* =========================================================
     CHEMICAL LIBRARY
  ========================================================= */

  const reagents = {

    water: {
      name:
        'Water',

      formula:
        'H₂O',

      color:
        '#dff7ff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    hcl: {
      name:
        'Hydrochloric acid',

      formula:
        'HCl',

      color:
        '#f4fbff',

      acidBase:
        -1,

      group:
        'inorganic'
    },


    h2so4: {
      name:
        'Sulfuric acid',

      formula:
        'H₂SO₄',

      color:
        '#f4fbff',

      acidBase:
        -1.2,

      group:
        'inorganic'
    },


    hno3: {
      name:
        'Nitric acid',

      formula:
        'HNO₃',

      color:
        '#f4fbff',

      acidBase:
        -1,

      group:
        'inorganic'
    },


    naoh: {
      name:
        'Sodium hydroxide',

      formula:
        'NaOH',

      color:
        '#f4fbff',

      acidBase:
        1,

      group:
        'inorganic'
    },


    koh: {
      name:
        'Potassium hydroxide',

      formula:
        'KOH',

      color:
        '#f4fbff',

      acidBase:
        1,

      group:
        'inorganic'
    },


    caoh2: {
      name:
        'Calcium hydroxide',

      formula:
        'Ca(OH)₂',

      color:
        '#f4fbff',

      acidBase:
        .8,

      group:
        'inorganic'
    },


    nh3: {
      name:
        'Ammonia solution',

      formula:
        'NH₃(aq)',

      color:
        '#f4fbff',

      acidBase:
        .65,

      group:
        'inorganic'
    },


    nh4cl: {
      name:
        'Ammonium chloride',

      formula:
        'NH₄Cl',

      color:
        '#f4fbff',

      acidBase:
        -.22,

      group:
        'inorganic'
    },


    cuso4: {
      name:
        'Copper(II) sulfate',

      formula:
        'CuSO₄',

      color:
        '#2d8fff',

      acidBase:
        -.1,

      group:
        'inorganic'
    },


    fecl3: {
      name:
        'Iron(III) chloride',

      formula:
        'FeCl₃',

      color:
        '#d29a3e',

      acidBase:
        -.15,

      group:
        'inorganic'
    },


    feso4: {
      name:
        'Iron(II) sulfate',

      formula:
        'FeSO₄',

      color:
        '#8db487',

      acidBase:
        -.05,

      group:
        'inorganic'
    },


    nacl: {
      name:
        'Sodium chloride',

      formula:
        'NaCl',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    agno3: {
      name:
        'Silver nitrate',

      formula:
        'AgNO₃',

      color:
        '#f8fbff',

      acidBase:
        -.05,

      group:
        'inorganic'
    },


    bacl2: {
      name:
        'Barium chloride',

      formula:
        'BaCl₂',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    bano3: {
      name:
        'Barium nitrate',

      formula:
        'Ba(NO₃)₂',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    pbno3: {
      name:
        'Lead(II) nitrate',

      formula:
        'Pb(NO₃)₂',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    na2co3: {
      name:
        'Sodium carbonate',

      formula:
        'Na₂CO₃',

      color:
        '#f8fbff',

      acidBase:
        .45,

      group:
        'inorganic'
    },


    nahco3: {
      name:
        'Sodium hydrogen carbonate',

      formula:
        'NaHCO₃',

      color:
        '#f8fbff',

      acidBase:
        .25,

      group:
        'inorganic'
    },


    na2so4: {
      name:
        'Sodium sulfate',

      formula:
        'Na₂SO₄',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    /* KI — COLORLESS */

    ki: {
      name:
        'Potassium iodide',

      formula:
        'KI',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    kscn: {
      name:
        'Potassium thiocyanate',

      formula:
        'KSCN',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'inorganic'
    },


    kmno4: {
      name:
        'Potassium permanganate',

      formula:
        'KMnO₄',

      color:
        '#7b2cbf',

      acidBase:
        0,

      group:
        'inorganic'
    },


    k2cr2o7: {
      name:
        'Potassium dichromate',

      formula:
        'K₂Cr₂O₇',

      color:
        '#f08a24',

      acidBase:
        0,

      group:
        'inorganic'
    },


    /* PHENOLPHTHALEIN — COLORLESS */

    indicator: {
      name:
        'Phenolphthalein',

      formula:
        'C₂₀H₁₂O₄',

      color:
        '#f8fbff',

      acidBase:
        0,

      indicator:
        true,

      group:
        'indicator'
    },


    iodine: {
      name:
        'Iodine solution',

      formula:
        'I₂',

      color:
        '#9a5b2e',

      acidBase:
        0,

      group:
        'indicator'
    },


    /* ORGANIC */

    ethanol: {
      name:
        'Ethanol',

      formula:
        'C₂H₅OH',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'organic'
    },


    ethanoic: {
      name:
        'Ethanoic acid',

      formula:
        'CH₃COOH',

      color:
        '#f8fbff',

      acidBase:
        -.45,

      group:
        'organic'
    },


    glucose: {
      name:
        'Glucose solution',

      formula:
        'C₆H₁₂O₆',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'organic'
    },


    glycerol: {
      name:
        'Glycerol',

      formula:
        'C₃H₈O₃',

      color:
        '#f8fbff',

      acidBase:
        0,

      group:
        'organic'
    },


    starch: {
      name:
        'Starch solution',

      formula:
        '(C₆H₁₀O₅)ₙ',

      color:
        '#f3f5fb',

      acidBase:
        0,

      group:
        'organic'
    }

  }


  /* =========================================================
     REACTIONS
  ========================================================= */

  const reactions = [

    {
      needs:
        ['hcl','naoh'],

      title:
        'Phản ứng trung hòa',

      equation:
        'HCl + NaOH → NaCl + H₂O',

      desc:
        'Hydrochloric acid và sodium hydroxide tạo muối và nước.',

      effect:
        'neutral'
    },


    {
      needs:
        ['hcl','koh'],

      title:
        'Phản ứng trung hòa',

      equation:
        'HCl + KOH → KCl + H₂O',

      desc:
        'Hydrochloric acid và potassium hydroxide tạo muối và nước.',

      effect:
        'neutral'
    },


    {
      needs:
        ['h2so4','naoh'],

      title:
        'Phản ứng trung hòa',

      equation:
        'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',

      desc:
        'Sulfuric acid phản ứng với sodium hydroxide.',

      effect:
        'neutral'
    },


    {
      needs:
        ['cuso4','naoh'],

      title:
        'Xuất hiện kết tủa xanh',

      equation:
        'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',

      desc:
        'Tạo kết tủa copper(II) hydroxide màu xanh.',

      effect:
        'precipitate',

      color:
        '#39a9ff'
    },


    {
      needs:
        ['fecl3','naoh'],

      title:
        'Xuất hiện kết tủa nâu đỏ',

      equation:
        'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',

      desc:
        'Tạo kết tủa iron(III) hydroxide màu nâu đỏ.',

      effect:
        'precipitate',

      color:
        '#a15431'
    },


    {
      needs:
        ['feso4','naoh'],

      title:
        'Xuất hiện kết tủa xanh lục',

      equation:
        'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄',

      desc:
        'Tạo kết tủa iron(II) hydroxide màu xanh lục.',

      effect:
        'precipitate',

      color:
        '#7aa66d'
    },


    {
      needs:
        ['agno3','nacl'],

      title:
        'Xuất hiện kết tủa trắng',

      equation:
        'AgNO₃ + NaCl → AgCl↓ + NaNO₃',

      desc:
        'Tạo kết tủa silver chloride màu trắng.',

      effect:
        'precipitate',

      color:
        '#f5f5f5'
    },


    {
      needs:
        ['agno3','ki'],

      title:
        'Xuất hiện kết tủa vàng',

      equation:
        'AgNO₃ + KI → AgI↓ + KNO₃',

      desc:
        'Tạo kết tủa silver iodide màu vàng.',

      effect:
        'precipitate',

      color:
        '#efd03f'
    },


    {
      needs:
        ['pbno3','ki'],

      title:
        'Xuất hiện kết tủa vàng',

      equation:
        'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',

      desc:
        'Tạo kết tủa lead(II) iodide màu vàng.',

      effect:
        'precipitate',

      color:
        '#f4d03f'
    },


    {
      needs:
        ['bacl2','na2so4'],

      title:
        'Xuất hiện kết tủa trắng',

      equation:
        'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',

      desc:
        'Tạo kết tủa barium sulfate màu trắng.',

      effect:
        'precipitate',

      color:
        '#f4f4f4'
    },


    {
      needs:
        ['na2co3','hcl'],

      title:
        'Khí CO₂ thoát ra',

      equation:
        'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',

      desc:
        'Dung dịch sủi bọt do carbon dioxide được tạo thành.',

      effect:
        'gas'
    },


    {
      needs:
        ['nahco3','hcl'],

      title:
        'Khí CO₂ thoát ra',

      equation:
        'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',

      desc:
        'Sodium hydrogen carbonate phản ứng với acid tạo carbon dioxide.',

      effect:
        'gas'
    },


    {
      needs:
        ['nh4cl','naoh'],

      title:
        'Khí NH₃ thoát ra',

      equation:
        'NH₄Cl + NaOH → NH₃↑ + NaCl + H₂O',

      desc:
        'Khi gia nhiệt, ammonia được giải phóng.',

      effect:
        'gas',

      requiresHeat:
        true,

      minTemp:
        45
    },


    {
      needs:
        ['fecl3','kscn'],

      title:
        'Dung dịch chuyển đỏ',

      equation:
        'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',

      desc:
        'Xuất hiện màu đỏ đặc trưng của phức iron(III) thiocyanate.',

      effect:
        'solutionColor',

      color:
        '#b71d3d'
    },


    /* ======================
       ORGANIC REACTIONS
    ====================== */

    {
      needs:
        ['ethanoic','nahco3'],

      title:
        'Ethanoic acid + bicarbonate',

      equation:
        'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑',

      desc:
        'Phản ứng tạo nhiều bọt carbon dioxide.',

      effect:
        'gas'
    },


    {
      needs:
        ['ethanol','ethanoic','h2so4'],

      title:
        'Esterification',

      equation:
        'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',

      desc:
        'Ethanol và ethanoic acid tạo ethyl ethanoate khi gia nhiệt với sulfuric acid làm xúc tác.',

      effect:
        'ester',

      requiresHeat:
        true,

      minTemp:
        55
    },


    {
      needs:
        [
          'glucose',
          'cuso4',
          'naoh'
        ],

      title:
        'Glucose tạo phức xanh lam',

      equation:
        'Glucose + Cu(OH)₂ → phức Cu(II) màu xanh lam',

      desc:
        'Ở nhiệt độ thường glucose hòa tan Cu(OH)₂ tạo dung dịch xanh lam.',

      effect:
        'dissolvePrecipitate',

      color:
        '#185adb'
    },


    {
      needs:
        [
          'glucose',
          'cuso4',
          'naoh'
        ],

      title:
        'Glucose khử Cu(II)',

      equation:
        'C₆H₁₂O₆ + 2Cu(OH)₂ → C₆H₁₂O₇ + Cu₂O↓ + 2H₂O',

      desc:
        'Khi đun nóng, xuất hiện kết tủa Cu₂O màu đỏ gạch.',

      effect:
        'precipitate',

      color:
        '#c85a32',

      requiresHeat:
        true,

      minTemp:
        65
    },


    {
      needs:
        [
          'glycerol',
          'cuso4',
          'naoh'
        ],

      title:
        'Glycerol tạo phức xanh lam',

      equation:
        'Glycerol + Cu(OH)₂ → phức Cu(II)',

      desc:
        'Glycerol hòa tan Cu(OH)₂ tạo dung dịch xanh lam đậm.',

      effect:
        'dissolvePrecipitate',

      color:
        '#195ecf'
    },


    {
      needs:
        ['starch','iodine'],

      title:
        'Starch–iodine test',

      equation:
        'Starch + I₂ → starch–iodine complex',

      desc:
        'Xuất hiện màu xanh tím đậm đặc trưng của starch.',

      effect:
        'solutionColor',

      color:
        '#18204d'
    }

  ]


  const chemOrder = [

    'water',

    'hcl',
    'h2so4',
    'hno3',

    'naoh',
    'koh',
    'caoh2',
    'nh3',
    'nh4cl',

    'cuso4',
    'fecl3',
    'feso4',

    'nacl',
    'agno3',
    'bacl2',
    'bano3',
    'pbno3',

    'na2co3',
    'nahco3',
    'na2so4',

    'ki',
    'kscn',
    'kmno4',
    'k2cr2o7',

    'indicator',
    'iodine',

    'ethanol',
    'ethanoic',
    'glucose',
    'glycerol',
    'starch'

  ]


  /* =========================================================
     BUILD UI
  ========================================================= */

  const section =
    document.createElement(
      'section'
    )


  section.id =
    'lab'


  section.className =
    'virtual-lab-v2'


  section.innerHTML = `

    <div class="vl-head">

      <div>

        <span>
          CHEMLAB V2
        </span>

        <h2>
          Phòng thí nghiệm ảo
        </h2>

        <p>
          Chọn hoặc kéo hóa chất vào cốc để quan sát
          phản ứng, pH và nhiệt độ theo thời gian thực.
        </p>

      </div>


      <div class="vl-live">

        <i></i>

        <b>
          Đang mô phỏng
        </b>

      </div>

    </div>


    <div class="vl-layout">

      <aside class="vl-shelf panel">

        <div class="panel-label">
          HÓA CHẤT
        </div>

        <h3>
          Kho thí nghiệm
        </h3>


        <div class="lab-reagent-tools">

          <input
            id="lab-reagent-search"
            type="search"
            placeholder="Tìm HCl, Ethanol..."
            autocomplete="off"
          >


          <select id="lab-reagent-group">

            <option value="all">
              Tất cả
            </option>

            <option value="inorganic">
              Vô cơ
            </option>

            <option value="organic">
              Hữu cơ
            </option>

            <option value="indicator">
              Chỉ thị
            </option>

          </select>

        </div>


        <div
          id="reagent-list"
          class="reagent-list"
        ></div>


        <div class="vl-volume">

          <span>
            LƯỢNG THÊM
          </span>

          <div>

            <button data-volume="10">
              10 mL
            </button>

            <button
              data-volume="25"
              class="active"
            >
              25 mL
            </button>

            <button data-volume="50">
              50 mL
            </button>

          </div>

        </div>


        <button
          id="add-reagent"
          class="primary-btn"
          disabled
        >
          + Thêm vào cốc
        </button>

      </aside>


      <div class="vl-main">

        <div
          class="vl-stage panel"
          id="beaker-area"
        >

          <div class="stage-grid"></div>


          <div class="stage-badge left">

            <span>
              THỂ TÍCH
            </span>

            <strong id="lab-volume">
              0 mL
            </strong>

          </div>


          <div class="stage-badge right">

            <span>
              TRẠNG THÁI
            </span>

            <strong id="lab-state">
              Cốc trống
            </strong>

          </div>


          <div class="beaker-scene">

            <div
              class="steam-layer"
              id="steam-layer"
            ></div>


            <div
              class="beaker-wrap"
              id="beaker-wrap"
            >

              <div class="beaker-body">

                <div class="beaker-top"></div>


                <div class="beaker-inner">

                  <div class="beaker-scale">

                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>

                  </div>


                  <div class="liquid-mask">

                    <div
                      class="liquid"
                      id="lab-liquid"
                    >

                      <div class="liquid-top"></div>

                      <div
                        class="bubble-layer"
                        id="bubble-layer"
                      ></div>

                      <div
                        class="precipitate-layer"
                        id="precipitate-layer"
                      ></div>

                    </div>

                  </div>


                  <div
                    class="drop-layer"
                    id="drop-layer"
                  ></div>

                </div>

              </div>

            </div>


            <div
              class="flame-box"
              id="flame-base"
            >

              <div class="flame-outer"></div>

              <div class="flame-core"></div>

              <div class="flame-stand"></div>

            </div>


            <div class="scene-shadow"></div>

          </div>


          <div class="stage-note">

            <strong id="lab-message-title">
              Bắt đầu thí nghiệm
            </strong>

            <span id="lab-message">
              Chọn một hóa chất bên trái để bắt đầu.
            </span>

          </div>

        </div>


        <div class="vl-controls panel">

          <button id="stir-button">
            Khuấy
          </button>

          <button id="heat-button">
            Bật lửa
          </button>

          <button id="empty-button">
            Đổ bỏ
          </button>

          <button id="reset-lab">
            Đặt lại
          </button>

          <span>
            Kéo ngang trên cốc để nghiêng
          </span>

        </div>


        <div class="vl-dashboard">

          <div class="meter panel">

            <span>
              NHIỆT ĐỘ
            </span>

            <strong>

              <b id="temperature-value">
                25.0
              </b>

              °C

            </strong>

            <div class="bar">
              <i id="temperature-bar"></i>
            </div>

          </div>


          <div class="meter panel">

            <span>
              ĐỘ pH
            </span>

            <strong id="ph-value">
              7.0
            </strong>

            <div class="ph-bar">
              <i id="ph-marker"></i>
            </div>

          </div>


          <div class="meter panel">

            <span>
              DUNG DỊCH
            </span>

            <strong id="solution-count">
              0 chất
            </strong>

            <small id="selected-name">
              Chưa chọn hóa chất
            </small>

          </div>

        </div>

      </div>


      <aside class="vl-side panel">

        <div class="panel-label">
          PHÂN TÍCH
        </div>

        <h3>
          Quan sát
        </h3>


        <div class="info-box">

          <span>
            HIỆN TƯỢNG
          </span>

          <strong id="observation-title">
            Chưa có hiện tượng
          </strong>

          <p id="observation-text">
            Thêm hóa chất vào cốc để bắt đầu mô phỏng.
          </p>

        </div>


        <div class="info-box">

          <span>
            PHƯƠNG TRÌNH
          </span>

          <strong id="reaction-equation">
            —
          </strong>

        </div>


        <div class="info-box">

          <span>
            TRONG CỐC
          </span>

          <div
            id="composition-list"
            class="composition-list"
          >

            <p>
              Cốc đang trống.
            </p>

          </div>

        </div>


        <div class="info-box log-box">

          <div class="log-head">

            <span>
              NHẬT KÝ
            </span>

            <button id="clear-log">
              Xóa
            </button>

          </div>


          <div
            id="lab-log-list"
            class="log-list"
          >

            <p class="log-empty">
              Chưa có hoạt động.
            </p>

          </div>

        </div>

      </aside>

    </div>

  `


  host.appendChild(
    section
  )


  /* =========================================================
     ELEMENT REFERENCES
  ========================================================= */

  const reagentList =
    section.querySelector(
      '#reagent-list'
    )


  const reagentSearch =
    section.querySelector(
      '#lab-reagent-search'
    )


  const reagentGroup =
    section.querySelector(
      '#lab-reagent-group'
    )


  const addButton =
    section.querySelector(
      '#add-reagent'
    )


  const liquid =
    section.querySelector(
      '#lab-liquid'
    )


  const beakerWrap =
    section.querySelector(
      '#beaker-wrap'
    )


  const beakerArea =
    section.querySelector(
      '#beaker-area'
    )


  const bubbleLayer =
    section.querySelector(
      '#bubble-layer'
    )


  const precipitateLayer =
    section.querySelector(
      '#precipitate-layer'
    )


  const dropLayer =
    section.querySelector(
      '#drop-layer'
    )


  const flameBase =
    section.querySelector(
      '#flame-base'
    )


  const steamLayer =
    section.querySelector(
      '#steam-layer'
    )


  const volumeText =
    section.querySelector(
      '#lab-volume'
    )


  const stateText =
    section.querySelector(
      '#lab-state'
    )


  const tempText =
    section.querySelector(
      '#temperature-value'
    )


  const tempBar =
    section.querySelector(
      '#temperature-bar'
    )


  const phText =
    section.querySelector(
      '#ph-value'
    )


  const phMarker =
    section.querySelector(
      '#ph-marker'
    )


  const solutionCount =
    section.querySelector(
      '#solution-count'
    )


  const selectedName =
    section.querySelector(
      '#selected-name'
    )


  const observationTitle =
    section.querySelector(
      '#observation-title'
    )


  const observationText =
    section.querySelector(
      '#observation-text'
    )


  const equationText =
    section.querySelector(
      '#reaction-equation'
    )


  const compositionList =
    section.querySelector(
      '#composition-list'
    )


  const messageTitle =
    section.querySelector(
      '#lab-message-title'
    )


  const message =
    section.querySelector(
      '#lab-message'
    )


  const logList =
    section.querySelector(
      '#lab-log-list'
    )


  const heatButton =
    section.querySelector(
      '#heat-button'
    )


  /* =========================================================
     STATE
  ========================================================= */

  let selectedReagent =
    null


  let selectedVolume =
    25


  let totalVolume =
    0


  let temperature =
    25


  let heating =
    false


  let mixture =
    {}


  let triggeredReactions =
    new Set()


  let precipitate =
    null


  let currentColor =
    '#7ecbff'


  let indicatorAdded =
    false


  let tiltCurrent =
    0


  let tiltTarget =
    0


  let liquidTilt =
    0


  let dragging =
    false


  let startX =
    0


  /* =========================================================
     CHEMICAL CARDS
  ========================================================= */

  chemOrder.forEach(
    id => {

      const reagent =
        reagents[id]


      const card =
        document.createElement(
          'button'
        )


      card.className =
        'reagent-card'


      card.draggable =
        true


      card.dataset.reagent =
        id


      card.dataset.group =
        reagent.group


      card.dataset.search =
        (
          reagent.formula +
          ' ' +
          reagent.name
        )
          .toLowerCase()


      card.innerHTML = `

        <div
          class="bottle"
          style="--c:${reagent.color}"
        >

          <i></i>
          <b></b>

        </div>


        <div class="reagent-text">

          <strong>
            ${reagent.formula}
          </strong>

          <span>
            ${reagent.name}
          </span>

        </div>

      `


      card.addEventListener(
        'click',

        () => {
          selectReagent(id)
        }
      )


      card.addEventListener(
        'dragstart',

        event => {

          event
            .dataTransfer
            .setData(
              'text/plain',
              id
            )


          selectReagent(id)

        }
      )


      reagentList.appendChild(
        card
      )

    }
  )


  /* =========================================================
     FILTER
  ========================================================= */

  function applyReagentFilter() {

    const query =
      (
        reagentSearch.value ||
        ''
      )
        .trim()
        .toLowerCase()


    const group =
      reagentGroup.value


    reagentList
      .querySelectorAll(
        '.reagent-card'
      )
      .forEach(
        card => {

          const queryMatch =
            !query ||
            card
              .dataset
              .search
              .includes(query)


          const groupMatch =
            group === 'all' ||
            card.dataset.group ===
              group


          card.hidden =
            !(
              queryMatch &&
              groupMatch
            )

        }
      )

  }


  reagentSearch.addEventListener(
    'input',
    applyReagentFilter
  )


  reagentGroup.addEventListener(
    'change',
    applyReagentFilter
  )


  /* =========================================================
     SELECT
  ========================================================= */

  function selectReagent(
    id
  ) {

    selectedReagent =
      id


    section
      .querySelectorAll(
        '.reagent-card'
      )
      .forEach(
        card => {

          card.classList.toggle(
            'active',

            card.dataset.reagent ===
              id
          )

        }
      )


    addButton.disabled =
      false


    selectedName.textContent =
      reagents[id].name


    messageTitle.textContent =
      reagents[id].formula


    message.textContent =
      'Nhấn “Thêm vào cốc” hoặc kéo hóa chất vào cốc.'

  }


  /* =========================================================
     VOLUME
  ========================================================= */

  section
    .querySelectorAll(
      '[data-volume]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',

          () => {

            selectedVolume =
              Number(
                button.dataset.volume
              )


            section
              .querySelectorAll(
                '[data-volume]'
              )
              .forEach(
                item => {

                  item.classList.toggle(
                    'active',
                    item === button
                  )

                }
              )

          }
        )

      }
    )


  /* =========================================================
     ADD CHEMICAL
  ========================================================= */

  addButton.addEventListener(
    'click',

    () => {

      if (
        selectedReagent
      ) {

        addReagent(
          selectedReagent,
          selectedVolume
        )

      }

    }
  )


  beakerArea.addEventListener(
    'dragover',

    event => {

      event.preventDefault()

      beakerArea
        .classList
        .add(
          'drag-over'
        )

    }
  )


  beakerArea.addEventListener(
    'dragleave',

    () => {

      beakerArea
        .classList
        .remove(
          'drag-over'
        )

    }
  )


  beakerArea.addEventListener(
    'drop',

    event => {

      event.preventDefault()


      beakerArea
        .classList
        .remove(
          'drag-over'
        )


      const id =
        event
          .dataTransfer
          .getData(
            'text/plain'
          )


      if (
        reagents[id]
      ) {

        addReagent(
          id,
          selectedVolume
        )

      }

    }
  )


  function addReagent(
    id,
    amount
  ) {

    const reagent =
      reagents[id]


    const wasEmpty =
      totalVolume ===
      0


    mixture[id] =
      (
        mixture[id] ||
        0
      ) +
      amount


    totalVolume =
      Math.min(
        250,

        totalVolume +
        amount
      )


    if (
      reagent.indicator
    ) {

      indicatorAdded =
        true

    }


    animateDrop(
      reagent.color
    )


    currentColor =
      wasEmpty

        ? reagent.color

        : mixColors(
            currentColor,
            reagent.color
          )


    updateLiquid()

    checkReactions()

    updateDashboard()


    addLog(
      `Đã thêm ${amount} mL ${reagent.formula}.`
    )


    messageTitle.textContent =
      `Đã thêm ${reagent.formula}`


    message.textContent =
      `${reagent.name} đã được thêm vào cốc.`

  }


  function animateDrop(
    color
  ) {

    for (
      let i = 0;
      i < 8;
      i++
    ) {

      const drop =
        document.createElement(
          'i'
        )


      drop.style.setProperty(
        '--drop-color',
        color
      )


      drop.style.left =
        `${47 + Math.random() * 6}%`


      drop.style.animationDelay =
        `${i * 50}ms`


      dropLayer.appendChild(
        drop
      )


      setTimeout(
        () => {
          drop.remove()
        },

        1000
      )

    }


    beakerWrap
      .classList
      .remove(
        'receive'
      )


    void beakerWrap.offsetWidth


    beakerWrap
      .classList
      .add(
        'receive'
      )

  }


  /* =========================================================
     LIQUID COLOR
  ========================================================= */

  function updateLiquid() {

    const height =
      Math.max(
        0,

        Math.min(
          78,

          totalVolume /
          250 *
          78
        )
      )


    liquid.style.height =
      `${height}%`


    liquid.style.setProperty(
      '--liquid-color',
      getDisplayedColor()
    )


    stateText.textContent =
      totalVolume > 0

        ? 'Có dung dịch'

        : 'Cốc trống'


    volumeText.textContent =
      `${Math.round(totalVolume)} mL`

  }


  function getDisplayedColor() {

    const ph =
      calculatePH()


    if (
      indicatorAdded &&
      ph > 8.2
    ) {

      return '#ef4da0'

    }


    return currentColor

  }


  /* =========================================================
     REACTION ENGINE
  ========================================================= */

  function checkReactions() {

    reactions.forEach(
      (
        reaction,
        index
      ) => {

        const ready =
          reaction
            .needs
            .every(
              id =>
                mixture[id] > 0
            )


        const blocked =
          reaction
            .forbids
            ?.some(
              id =>
                mixture[id] > 0
            )


        const key =
          `${index}-${reaction.needs.join('-')}`


        if (
          !ready ||
          blocked ||
          triggeredReactions.has(
            key
          )
        ) {

          return

        }


        if (
          reaction.requiresHeat &&
          !heating
        ) {

          return

        }


        if (
          reaction.minTemp &&
          temperature <
            reaction.minTemp
        ) {

          return

        }


        triggeredReactions.add(
          key
        )


        observationTitle.textContent =
          reaction.title


        observationText.textContent =
          reaction.desc


        equationText.textContent =
          reaction.equation


        messageTitle.textContent =
          reaction.title


        message.textContent =
          reaction.equation


        if (
          reaction.effect ===
          'neutral'
        ) {

          flashReaction()

        }


        if (
          reaction.effect ===
          'precipitate'
        ) {

          precipitate =
            reaction.color


          createPrecipitate(
            reaction.color
          )

        }


        if (
          reaction.effect ===
          'gas'
        ) {

          createBubbles(
            28
          )

        }


        if (
          reaction.effect ===
          'solutionColor'
        ) {

          currentColor =
            reaction.color


          updateLiquid()

          flashReaction()

        }


        if (
          reaction.effect ===
          'dissolvePrecipitate'
        ) {

          precipitate =
            null


          precipitateLayer.innerHTML =
            ''


          currentColor =
            reaction.color


          updateLiquid()

          flashReaction()

        }


        if (
          reaction.effect ===
          'ester'
        ) {

          flashReaction()

          createBubbles(
            8
          )

        }


        addLog(
          reaction.title
        )


        addLog(
          reaction.equation
        )

      }
    )

  }


  function createBubbles(
    count = 12
  ) {

    for (
      let i = 0;
      i < count;
      i++
    ) {

      setTimeout(
        () => {

          const bubble =
            document.createElement(
              'i'
            )


          bubble.style.left =
            `${
              8 +
              Math.random() *
              84
            }%`


          const size =
            6 +
            Math.random() *
            8


          bubble.style.width =
            `${size}px`


          bubble.style.height =
            `${size}px`


          bubble.style.animationDuration =
            `${
              1.7 +
              Math.random() *
              1.2
            }s`


          bubbleLayer.appendChild(
            bubble
          )


          setTimeout(
            () => {
              bubble.remove()
            },

            3000
          )

        },

        i * 55
      )

    }

  }


  function createPrecipitate(
    color
  ) {

    precipitateLayer.innerHTML =
      ''


    for (
      let i = 0;
      i < 40;
      i++
    ) {

      const particle =
        document.createElement(
          'i'
        )


      particle.style.left =
        `${
          4 +
          Math.random() *
          92
        }%`


      particle.style.setProperty(
        '--precipitate-color',
        color
      )


      particle.style.animationDelay =
        `${Math.random() * 500}ms`


      precipitateLayer.appendChild(
        particle
      )

    }

  }


  function flashReaction() {

    beakerWrap
      .classList
      .remove(
        'flash'
      )


    void beakerWrap.offsetWidth


    beakerWrap
      .classList
      .add(
        'flash'
      )

  }


  /* =========================================================
     PH
  ========================================================= */

  function calculatePH() {

    if (
      !totalVolume
    ) {

      return 7

    }


    let balance =
      0


    Object
      .entries(
        mixture
      )
      .forEach(
        (
          [
            id,
            volume
          ]
        ) => {

          balance +=
            reagents[id]
              .acidBase *
            volume

        }
      )


    return clamp(
      7 +
      balance /
      Math.max(
        totalVolume,
        1
      ) *
      6,

      1,
      13
    )

  }


  /* =========================================================
     DASHBOARD
  ========================================================= */

  function updateDashboard() {

    const ph =
      calculatePH()


    phText.textContent =
      ph.toFixed(1)


    phMarker.style.left =
      `${ph / 14 * 100}%`


    liquid.style.setProperty(
      '--liquid-color',
      getDisplayedColor()
    )


    const count =
      Object
        .keys(
          mixture
        )
        .filter(
          id =>
            mixture[id] >
            0
        )
        .length


    solutionCount.textContent =
      `${count} chất`


    compositionList.innerHTML =
      ''


    const entries =
      Object
        .entries(
          mixture
        )
        .filter(
          (
            [
              ,
              volume
            ]
          ) =>
            volume > 0
        )


    if (
      !entries.length
    ) {

      compositionList.innerHTML =
        '<p>Cốc đang trống.</p>'


      return

    }


    entries.forEach(
      (
        [
          id,
          volume
        ]
      ) => {

        const row =
          document.createElement(
            'div'
          )


        row.innerHTML = `

          <span>
            ${reagents[id].formula}
          </span>

          <strong>
            ${Math.round(volume)} mL
          </strong>

        `


        compositionList.appendChild(
          row
        )

      }
    )

  }


  /* =========================================================
     LOG
  ========================================================= */

  function addLog(
    text
  ) {

    logList
      .querySelector(
        '.log-empty'
      )
      ?.remove()


    const item =
      document.createElement(
        'div'
      )


    item.className =
      'log-item'


    const time =
      new Date()
        .toLocaleTimeString(
          'vi-VN',

          {
            hour:
              '2-digit',

            minute:
              '2-digit',

            second:
              '2-digit'
          }
        )


    item.innerHTML = `

      <span>
        ${time}
      </span>

      <p>
        ${text}
      </p>

    `


    logList.prepend(
      item
    )

  }


  section
    .querySelector(
      '#clear-log'
    )
    .addEventListener(
      'click',

      () => {

        logList.innerHTML =
          '<p class="log-empty">Chưa có hoạt động.</p>'

      }
    )


  /* =========================================================
     STIR
  ========================================================= */

  section
    .querySelector(
      '#stir-button'
    )
    .addEventListener(
      'click',

      () => {

        if (
          !totalVolume
        ) {

          messageTitle.textContent =
            'Cốc đang trống'


          message.textContent =
            'Hãy thêm hóa chất trước khi khuấy.'


          return

        }


        beakerWrap
          .classList
          .remove(
            'stir'
          )


        liquid
          .classList
          .remove(
            'swirl'
          )


        void beakerWrap.offsetWidth
        void liquid.offsetWidth


        beakerWrap
          .classList
          .add(
            'stir'
          )


        liquid
          .classList
          .add(
            'swirl'
          )


        if (
          precipitate
        ) {

          precipitateLayer
            .classList
            .remove(
              'shake'
            )


          void precipitateLayer.offsetWidth


          precipitateLayer
            .classList
            .add(
              'shake'
            )

        }


        createBubbles(
          6
        )


        addLog(
          'Đã khuấy dung dịch.'
        )

      }
    )


  /* =========================================================
     HEAT
  ========================================================= */

  heatButton.addEventListener(
    'click',

    () => {

      heating =
        !heating


      flameBase
        .classList
        .toggle(
          'on',
          heating
        )


      heatButton
        .classList
        .toggle(
          'active',
          heating
        )


      heatButton.textContent =
        heating

          ? 'Tắt lửa'

          : 'Bật lửa'


      addLog(
        heating

          ? 'Đã bật lửa.'

          : 'Đã tắt lửa.'
      )


      messageTitle.textContent =
        heating

          ? 'Đang gia nhiệt'

          : 'Đã tắt lửa'


      message.textContent =
        heating

          ? 'Nhiệt độ dung dịch đang tăng.'

          : 'Dung dịch sẽ nguội dần.'


      checkReactions()

    }
  )


  /* =========================================================
     EMPTY / RESET
  ========================================================= */

  section
    .querySelector(
      '#empty-button'
    )
    .addEventListener(
      'click',
      emptyBeaker
    )


  section
    .querySelector(
      '#reset-lab'
    )
    .addEventListener(
      'click',
      resetLab
    )


  function emptyBeaker() {

    mixture =
      {}


    totalVolume =
      0


    precipitate =
      null


    indicatorAdded =
      false


    currentColor =
      '#7ecbff'


    triggeredReactions.clear()


    precipitateLayer.innerHTML =
      ''


    bubbleLayer.innerHTML =
      ''


    observationTitle.textContent =
      'Chưa có hiện tượng'


    observationText.textContent =
      'Cốc đã được làm trống.'


    equationText.textContent =
      '—'


    updateLiquid()

    updateDashboard()


    addLog(
      'Đã đổ bỏ dung dịch.'
    )

  }


  function resetLab() {

    heating =
      false


    flameBase
      .classList
      .remove(
        'on'
      )


    heatButton
      .classList
      .remove(
        'active'
      )


    heatButton.textContent =
      'Bật lửa'


    temperature =
      25


    tempText.textContent =
      '25.0'


    tempBar.style.width =
      '0%'


    emptyBeaker()


    selectedReagent =
      null


    addButton.disabled =
      true


    selectedName.textContent =
      'Chưa chọn hóa chất'


    section
      .querySelectorAll(
        '.reagent-card'
      )
      .forEach(
        card => {

          card
            .classList
            .remove(
              'active'
            )

        }
      )


    logList.innerHTML =
      '<p class="log-empty">Chưa có hoạt động.</p>'

  }


  /* =========================================================
     TEMPERATURE ENGINE
  ========================================================= */

  setInterval(
    () => {

      if (
        heating &&
        totalVolume > 0
      ) {

        temperature =
          Math.min(
            100,

            temperature +
            .2
          )

      }

      else if (
        temperature > 25
      ) {

        temperature =
          Math.max(
            25,

            temperature -
            .08
          )

      }


      tempText.textContent =
        temperature
          .toFixed(1)


      tempBar.style.width =
        `${
          clamp(
            (
              temperature -
              25
            ) /
            75 *
            100,

            0,
            100
          )
        }%`


      if (
        heating &&
        totalVolume > 0
      ) {

        checkReactions()

      }


      if (
        temperature > 75 &&
        totalVolume > 0 &&
        Math.random() >
          .72
      ) {

        createSteam()

      }

    },

    300
  )


  function createSteam() {

    const steam =
      document.createElement(
        'i'
      )


    steam.style.left =
      `${
        48 +
        Math.random() *
        8
      }%`


    steamLayer.appendChild(
      steam
    )


    setTimeout(
      () => {

        steam.remove()

      },

      2600
    )

  }


  /* =========================================================
     BEAKER DRAG
  ========================================================= */

  beakerWrap.addEventListener(
    'pointerdown',

    event => {

      dragging =
        true


      startX =
        event.clientX


      beakerWrap.setPointerCapture(
        event.pointerId
      )


      beakerWrap
        .classList
        .add(
          'dragging'
        )

    }
  )


  beakerWrap.addEventListener(
    'pointermove',

    event => {

      if (
        !dragging
      ) {

        return

      }


      const dx =
        event.clientX -
        startX


      tiltTarget =
        clamp(
          dx / 10,
          -12,
          12
        )

    }
  )


  function stopDrag(
    event
  ) {

    try {

      beakerWrap
        .releasePointerCapture(
          event.pointerId
        )

    }

    catch {}


    dragging =
      false


    tiltTarget =
      0


    beakerWrap
      .classList
      .remove(
        'dragging'
      )

  }


  beakerWrap.addEventListener(
    'pointerup',
    stopDrag
  )


  beakerWrap.addEventListener(
    'pointercancel',
    stopDrag
  )


  /* =========================================================
     ANIMATION
  ========================================================= */

  function loop() {

    tiltCurrent +=
      (
        tiltTarget -
        tiltCurrent
      ) *
      .11


    liquidTilt +=
      (
        (
          -tiltCurrent *
          .82
        ) -
        liquidTilt
      ) *
      .11


    beakerWrap.style.setProperty(
      '--tilt',
      `${tiltCurrent}deg`
    )


    liquid.style.setProperty(
      '--liquid-tilt',
      `${liquidTilt}deg`
    )


    requestAnimationFrame(
      loop
    )

  }


  requestAnimationFrame(
    loop
  )


  /* =========================================================
     COLOR HELPERS
  ========================================================= */

  function mixColors(
    a,
    b
  ) {

    const c1 =
      hexToRgb(a)


    const c2 =
      hexToRgb(b)


    return rgbToHex(

      Math.round(
        (
          c1.r +
          c2.r
        ) /
        2
      ),

      Math.round(
        (
          c1.g +
          c2.g
        ) /
        2
      ),

      Math.round(
        (
          c1.b +
          c2.b
        ) /
        2
      )

    )

  }


  function hexToRgb(
    hex
  ) {

    const value =
      hex.replace(
        '#',
        ''
      )


    return {

      r:
        parseInt(
          value.slice(
            0,
            2
          ),
          16
        ),

      g:
        parseInt(
          value.slice(
            2,
            4
          ),
          16
        ),

      b:
        parseInt(
          value.slice(
            4,
            6
          ),
          16
        )

    }

  }


  function rgbToHex(
    r,
    g,
    b
  ) {

    return (
      '#' +

      [
        r,
        g,
        b
      ]

        .map(
          value =>
            value
              .toString(
                16
              )
              .padStart(
                2,
                '0'
              )
        )

        .join('')
    )

  }


  function clamp(
    value,
    min,
    max
  ) {

    return Math.max(
      min,

      Math.min(
        max,
        value
      )
    )

  }


  updateLiquid()
  updateDashboard()

}