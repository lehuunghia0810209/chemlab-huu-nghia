import './virtualLab.css'

import {
  CHEMICALS,
  CHEMICAL_ORDER
} from './lab/chemicals.js'

import {
  REACTIONS
} from './lab/reactions.js'

import {
  findAvailableReactions
} from './lab/reactionEngine.js'


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
    .querySelector(
      '#lab'
    )
    ?.remove()


  const reagents =
    CHEMICALS


  const reactions =
    REACTIONS


  const chemOrder =
    CHEMICAL_ORDER


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
          CHEMLAB V3
        </span>

        <h2>
          Phòng thí nghiệm ảo
        </h2>

        <p>
          Khám phá phản ứng vô cơ và hữu cơ bằng mô phỏng.
          Chọn hóa chất, điều chỉnh lượng, gia nhiệt và quan sát hiện tượng.
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


      <!-- ==================================================
           CHEMICAL LIBRARY
      =================================================== -->

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
            placeholder="Tìm HCl, Ethanol, Glucose..."
            autocomplete="off"
            aria-label="Tìm hóa chất"
          >


          <select
            id="lab-reagent-group"
            aria-label="Lọc nhóm chính"
          >

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
              Chỉ thị / thuốc thử
            </option>

          </select>

        </div>


        <select
          id="lab-reagent-family"
          aria-label="Lọc họ hóa chất"
          style="
            width:100%;
            margin:0 0 10px;
          "
        >

          <option value="all">
            Tất cả nhóm chức / họ chất
          </option>

        </select>


        <div
          id="reagent-list"
          class="reagent-list"
        ></div>


        <div class="vl-volume">

          <span>
            LƯỢNG THÊM
          </span>


          <div>

            <button data-volume="1">
              1 mL
            </button>


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


      <!-- ==================================================
           MAIN LAB
      =================================================== -->

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

                    <span>
                      250
                    </span>

                    <span>
                      188
                    </span>

                    <span>
                      125
                    </span>

                    <span>
                      63
                    </span>

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


        <!-- ==================================================
             CONTROLS
        =================================================== -->

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


        <!-- ==================================================
             DASHBOARD
        =================================================== -->

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


      <!-- ==================================================
           ANALYSIS
      =================================================== -->

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
     REFERENCES
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


  const reagentFamily =
    section.querySelector(
      '#lab-reagent-family'
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


  let additionHistory =
    []


  let triggeredReactions =
    new Set()


  let precipitate =
    null


  let currentColor =
    '#7ecbff'


  let lastIndicator =
    null


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
     FAMILY FILTER
  ========================================================= */

  buildFamilyOptions()


  function buildFamilyOptions() {

    const families =
      [
        ...new Set(

          chemOrder
            .map(
              id =>
                reagents[id]
                  ?.family
            )
            .filter(
              Boolean
            )

        )
      ]
        .sort(
          (
            a,
            b
          ) =>
            a.localeCompare(
              b
            )
        )


    families.forEach(
      family => {

        const option =
          document.createElement(
            'option'
          )


        option.value =
          family


        option.textContent =
          formatFamilyName(
            family
          )


        reagentFamily.appendChild(
          option
        )

      }
    )

  }


  /* =========================================================
     CHEMICAL CARDS
  ========================================================= */

  renderChemicalCards()


  function renderChemicalCards() {

    reagentList.innerHTML =
      ''


    chemOrder.forEach(
      id => {

        const reagent =
          reagents[id]


        if (!reagent) {
          return
        }


        const card =
          document.createElement(
            'button'
          )


        card.type =
          'button'


        card.className =
          'reagent-card'


        card.draggable =
          true


        card.dataset.reagent =
          id


        card.dataset.group =
          reagent.category ||
          'inorganic'


        card.dataset.family =
          reagent.family ||
          'other'


        card.dataset.search =
          [

            reagent.formula,

            reagent.name,

            reagent.category,

            reagent.family,

            ...(
              reagent.tags ||
              []
            )

          ]

            .filter(
              Boolean
            )

            .join(
              ' '
            )

            .toLowerCase()


        const hazardText =
          (
            reagent.hazards ||
            []
          )
            .join(
              ', '
            )


        card.title =
          [

            reagent.name,

            reagent.family
              ? formatFamilyName(
                  reagent.family
                )
              : '',

            hazardText
              ? `Simulation warning: ${hazardText}`
              : ''

          ]

            .filter(
              Boolean
            )

            .join(
              ' · '
            )


        card.innerHTML = `

          <div
            class="bottle"
            style="
              --c:${
                reagent.solutionColor ||
                reagent.color ||
                '#f8fbff'
              }
            "
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

            selectReagent(
              id
            )

          }
        )


        card.addEventListener(
          'dragstart',

          event => {

            event
              .dataTransfer
              ?.setData(
                'text/plain',
                id
              )


            selectReagent(
              id
            )

          }
        )


        reagentList.appendChild(
          card
        )

      }
    )

  }


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


    const family =
      reagentFamily.value


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
              .includes(
                query
              )


          const groupMatch =
            group ===
              'all' ||
            card
              .dataset
              .group ===
              group


          const familyMatch =
            family ===
              'all' ||
            card
              .dataset
              .family ===
              family


          card.hidden =
            !(
              queryMatch &&
              groupMatch &&
              familyMatch
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


  reagentFamily.addEventListener(
    'change',
    applyReagentFilter
  )


  /* =========================================================
     SELECT CHEMICAL
  ========================================================= */

  function selectReagent(
    id
  ) {

    const reagent =
      reagents[id]


    if (!reagent) {
      return
    }


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

            card
              .dataset
              .reagent ===
              id

          )

        }
      )


    addButton.disabled =
      false


    selectedName.textContent =
      reagent.name


    messageTitle.textContent =
      reagent.formula


    message.textContent =
      `${reagent.name} · ${formatFamilyName(
        reagent.family ||
        'other'
      )}. Nhấn “Thêm vào cốc” hoặc kéo hóa chất vào cốc.`

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
                button
                  .dataset
                  .volume
              )


            section
              .querySelectorAll(
                '[data-volume]'
              )
              .forEach(
                item => {

                  item.classList.toggle(
                    'active',
                    item ===
                      button
                  )

                }
              )

          }
        )

      }
    )


  /* =========================================================
     ADD BUTTON
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


  /* =========================================================
     DRAG DROP
  ========================================================= */

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
          ?.getData(
            'text/plain'
          )


      if (
        id &&
        reagents[id]
      ) {

        addReagent(
          id,
          selectedVolume
        )

      }

    }
  )


  /* =========================================================
     ADD CHEMICAL
  ========================================================= */

  function addReagent(
    id,
    amount
  ) {

    const reagent =
      reagents[id]


    if (!reagent) {
      return
    }


    const acceptedAmount =
      Math.min(

        Math.max(
          Number(
            amount
          ) ||
          0,

          0
        ),

        Math.max(
          250 -
          totalVolume,

          0
        )

      )


    if (
      acceptedAmount <=
      0
    ) {

      messageTitle.textContent =
        'Cốc đã đầy'


      message.textContent =
        'Cốc mô phỏng chỉ chứa tối đa 250 mL.'


      return

    }


    const wasEmpty =
      totalVolume ===
      0


    mixture[id] =
      (
        mixture[id] ||
        0
      ) +
      acceptedAmount


    totalVolume +=
      acceptedAmount


    if (
      !additionHistory
        .includes(
          id
        )
    ) {

      additionHistory.push(
        id
      )

    }


    if (
      reagent.indicator
    ) {

      lastIndicator =
        reagent.indicator

    }


    const reagentColor =
      reagent.solutionColor ||
      reagent.color ||
      '#f8fbff'


    animateDrop(
      reagentColor
    )


    currentColor =
      wasEmpty

        ? reagentColor

        : mixColors(
            currentColor,
            reagentColor
          )


    updateLiquid()

    checkReactions()

    updateDashboard()


    addLog(
      `Đã thêm ${formatNumber(
        acceptedAmount
      )} mL ${reagent.formula}.`
    )


    messageTitle.textContent =
      `Đã thêm ${reagent.formula}`


    message.textContent =
      `${formatNumber(
        acceptedAmount
      )} mL ${reagent.name} đã được thêm vào cốc.`

  }


  /* =========================================================
     DROP EFFECT
  ========================================================= */

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
        `${
          47 +
          Math.random() *
          6
        }%`


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
     LIQUID
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
      totalVolume >
      0

        ? 'Có dung dịch'

        : 'Cốc trống'


    volumeText.textContent =
      `${formatNumber(
        totalVolume
      )} mL`

  }


  /* =========================================================
     INDICATORS
  ========================================================= */

  function getDisplayedColor() {

    const pH =
      calculatePH()


    if (
      lastIndicator ===
      'phenolphthalein'
    ) {

      return pH >
        8.2

        ? '#ef4da0'

        : currentColor

    }


    if (
      lastIndicator ===
      'methylOrange'
    ) {

      if (
        pH <
        3.1
      ) {

        return '#e24735'

      }


      if (
        pH <
        4.4
      ) {

        return '#ee8c35'

      }


      return '#e4c33d'

    }


    if (
      lastIndicator ===
      'litmus'
    ) {

      if (
        pH <
        5
      ) {

        return '#d34a55'

      }


      if (
        pH >
        8
      ) {

        return '#4b64d8'

      }


      return '#806bb0'

    }


    return currentColor

  }


  /* =========================================================
     REACTION ENGINE
  ========================================================= */

  function checkReactions() {

    const pH =
      calculatePH()


    const available =
      findAvailableReactions(

        reactions,

        {

          mixture,

          temperature,

          heating,

          pH,

          additionHistory,

          triggeredIds:
            triggeredReactions,

          lightOn:
            false

        }

      )


    if (
      !available.length
    ) {

      return

    }


    available.forEach(
      reaction => {

        triggeredReactions.add(
          reaction.id
        )


        observationTitle.textContent =
          reaction.title


        observationText.textContent =
          reaction.description ||
          reaction.desc ||
          ''


        equationText.textContent =
          reaction.equation ||
          '—'


        messageTitle.textContent =
          reaction.title


        message.textContent =
          reaction.equation ||
          reaction.description ||
          'Phản ứng đã xảy ra.'


        reaction.effects
          ?.forEach(
            effect => {

              applyReactionEffect(
                effect
              )

            }
          )


        addLog(
          reaction.title
        )


        if (
          reaction.equation
        ) {

          addLog(
            reaction.equation
          )

        }

      }
    )

  }


  /* =========================================================
     EFFECTS
  ========================================================= */

  function applyReactionEffect(
    effect
  ) {

    if (!effect) {
      return
    }


    switch (
      effect.type
    ) {


      case 'gas':

        createBubbles(
          effect.amount ||
          20
        )

        break


      case 'precipitate':

        precipitate =
          effect.color ||
          '#f5f5f5'


        createPrecipitate(
          precipitate
        )

        break


      case 'removePrecipitate':

        precipitate =
          null


        precipitateLayer.innerHTML =
          ''

        break


      case 'solutionColor':

        if (
          effect.color
        ) {

          currentColor =
            effect.color


          updateLiquid()

        }

        break


      case 'flash':

        flashReaction()

        break


      case 'message':

        if (
          effect.text
        ) {

          message.textContent =
            effect.text

        }

        break


      default:

        console.warn(
          '[Virtual Lab] Unknown reaction effect:',
          effect
        )

    }

  }


  /* =========================================================
     GAS
  ========================================================= */

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

        i *
        55
      )

    }

  }


  /* =========================================================
     PRECIPITATE
  ========================================================= */

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
        `${
          Math.random() *
          500
        }ms`


      precipitateLayer.appendChild(
        particle
      )

    }

  }


  /* =========================================================
     FLASH
  ========================================================= */

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
            Number(
              reagents[id]
                ?.acidBase ||
              0
            ) *
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

    const pH =
      calculatePH()


    phText.textContent =
      pH.toFixed(
        1
      )


    phMarker.style.left =
      `${pH / 14 * 100}%`


    liquid.style.setProperty(
      '--liquid-color',
      getDisplayedColor()
    )


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
            volume >
            0
        )


    solutionCount.textContent =
      `${entries.length} chất`


    compositionList.innerHTML =
      ''


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
            ${
              reagents[id]
                ?.formula ||
              id
            }
          </span>


          <strong>
            ${formatNumber(
              volume
            )} mL
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
        ${escapeHTML(
          text
        )}
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


        messageTitle.textContent =
          'Đang khuấy'


        message.textContent =
          'Dung dịch đang được trộn đều.'

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


    additionHistory =
      []


    totalVolume =
      0


    precipitate =
      null


    lastIndicator =
      null


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


    messageTitle.textContent =
      'Cốc đã trống'


    message.textContent =
      'Bạn có thể bắt đầu một thí nghiệm mới.'


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


    selectedVolume =
      25


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


    section
      .querySelectorAll(
        '[data-volume]'
      )
      .forEach(
        button => {

          button.classList.toggle(

            'active',

            Number(
              button
                .dataset
                .volume
            ) ===
              25

          )

        }
      )


    reagentSearch.value =
      ''


    reagentGroup.value =
      'all'


    reagentFamily.value =
      'all'


    applyReagentFilter()


    logList.innerHTML =
      '<p class="log-empty">Chưa có hoạt động.</p>'


    messageTitle.textContent =
      'Bắt đầu thí nghiệm'


    message.textContent =
      'Chọn một hóa chất bên trái để bắt đầu.'

  }


  /* =========================================================
     TEMPERATURE
  ========================================================= */

  const temperatureTimer =
    window.setInterval(
      () => {

        if (
          heating &&
          totalVolume >
          0
        ) {

          temperature =
            Math.min(

              100,

              temperature +
              0.2

            )

        }

        else if (
          temperature >
          25
        ) {

          temperature =
            Math.max(

              25,

              temperature -
              0.08

            )

        }


        tempText.textContent =
          temperature
            .toFixed(
              1
            )


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
          totalVolume >
          0
        ) {

          checkReactions()

        }


        if (
          temperature >
            75 &&
          totalVolume >
            0 &&
          Math.random() >
            0.72
        ) {

          createSteam()

        }


        if (
          !section.isConnected
        ) {

          window.clearInterval(
            temperatureTimer
          )

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
     TILT
  ========================================================= */

  beakerWrap.addEventListener(
    'pointerdown',

    event => {

      dragging =
        true


      startX =
        event.clientX


      beakerWrap
        .setPointerCapture(
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

          dx /
          10,

          -12,

          12

        )

    }
  )


  function stopDrag(
    event
  ) {

    if (
      event?.pointerId
    ) {

      try {

        beakerWrap
          .releasePointerCapture(
            event.pointerId
          )

      }

      catch {}

    }


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


  beakerWrap.addEventListener(
    'lostpointercapture',

    () => {

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
  )


  /* =========================================================
     ANIMATION
  ========================================================= */

  function animationLoop() {

    tiltCurrent +=
      (
        tiltTarget -
        tiltCurrent
      ) *
      0.11


    liquidTilt +=
      (
        (
          -tiltCurrent *
          0.82
        ) -
        liquidTilt
      ) *
      0.11


    if (
      !dragging &&
      Math.abs(
        tiltCurrent
      ) <
      0.02
    ) {

      tiltCurrent =
        0

    }


    if (
      !dragging &&
      Math.abs(
        liquidTilt
      ) <
      0.02
    ) {

      liquidTilt =
        0

    }


    beakerWrap.style.setProperty(

      '--tilt',

      `${tiltCurrent}deg`

    )


    liquid.style.setProperty(

      '--liquid-tilt',

      `${liquidTilt}deg`

    )


    if (
      section.isConnected
    ) {

      requestAnimationFrame(
        animationLoop
      )

    }

  }


  /* =========================================================
     COLOR
  ========================================================= */

  function mixColors(
    a,
    b
  ) {

    const c1 =
      hexToRgb(
        a
      )


    const c2 =
      hexToRgb(
        b
      )


    if (!c1) {
      return b
    }


    if (!c2) {
      return a
    }


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
      String(
        hex ||
        ''
      )

        .replace(
          '#',
          ''
        )

        .trim()


    if (
      !/^[0-9a-f]{6}$/i
        .test(
          value
        )
    ) {

      return null

    }


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

            clamp(

              Math.round(
                value
              ),

              0,

              255

            )

              .toString(
                16
              )

              .padStart(
                2,
                '0'
              )

        )

        .join(
          ''
        )
    )

  }


  /* =========================================================
     HELPERS
  ========================================================= */

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


  function formatNumber(
    value
  ) {

    return Number(
      value
    )
      .toLocaleString(

        'vi-VN',

        {
          maximumFractionDigits:
            2
        }

      )

  }


  function formatFamilyName(
    value
  ) {

    return String(
      value ||
      'other'
    )

      .replace(
        /-/g,
        ' '
      )

      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      )

  }


  function escapeHTML(
    text
  ) {

    return String(
      text
    )

      .replace(
        /&/g,
        '&amp;'
      )

      .replace(
        /</g,
        '&lt;'
      )

      .replace(
        />/g,
        '&gt;'
      )

      .replace(
        /"/g,
        '&quot;'
      )

      .replace(
        /'/g,
        '&#039;'
      )

  }


  /* =========================================================
     START
  ========================================================= */

  updateLiquid()

  updateDashboard()


  requestAnimationFrame(
    animationLoop
  )

}