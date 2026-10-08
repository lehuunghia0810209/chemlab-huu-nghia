import { APP_VERSION } from './appMeta.js'

import './virtualLab.css'
import './lab/labFilters.css'

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
     UI
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
          CHEMLAB ${APP_VERSION}
        </span>


        <h2>
          Phòng thí nghiệm ảo
        </h2>


        <p>
          Khám phá ${chemOrder.length} hóa chất và
          ${reactions.length} phản ứng vô cơ, hữu cơ
          trong môi trường mô phỏng.
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


          <label
            class="lab-search-shell"
            for="lab-reagent-search"
          >

            <span
              class="lab-search-icon"
              aria-hidden="true"
            >
              ⌕
            </span>


            <input
              id="lab-reagent-search"
              type="search"
              placeholder="Tìm HCl, Ethanol, Glucose..."
              autocomplete="off"
              aria-label="Tìm hóa chất"
            >

          </label>


          <div class="lab-select-shell">

            <select
              id="lab-reagent-group"
              class="lab-filter-select"
              aria-label="Lọc nhóm hóa chất"
            >

              <option value="all">
                Tất cả hóa chất
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


            <span
              class="lab-select-arrow"
              aria-hidden="true"
            ></span>

          </div>

        </div>


        <!-- FAMILY FILTER -->

        <div class="lab-family-filter">


          <div class="lab-family-filter-head">

            <span>
              NHÓM / HỌ CHẤT
            </span>


            <strong id="lab-chemical-count">
              ${chemOrder.length} chất
            </strong>

          </div>


          <div
            class="
              lab-select-shell
              lab-select-shell-wide
            "
          >

            <select
              id="lab-reagent-family"
              class="lab-filter-select"
              aria-label="Lọc họ hóa chất"
            >

              <option value="all">
                Tất cả nhóm chức / họ chất
              </option>

            </select>


            <span
              class="lab-select-arrow"
              aria-hidden="true"
            ></span>

          </div>

        </div>


        <div
          id="reagent-list"
          class="reagent-list"
        ></div>


        <div
          id="lab-no-results"
          class="lab-no-results"
          hidden
        >
          Không tìm thấy hóa chất phù hợp.
        </div>


        <!-- VOLUME -->

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

                    </div>

                    <div
                      class="precipitate-layer"
                      id="precipitate-layer"
                    ></div>


                    <div
                      class="bubble-layer"
                      id="bubble-layer"
                    ></div>


                    <div
                      class="foam-layer"
                      id="foam-layer"
                    ></div>

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

            <div
              class="litmus-paper-result"
              id="litmus-paper-result"
              hidden
            >

              <i
                class="litmus-paper-strip"
                id="litmus-paper-strip"
                aria-hidden="true"
              ></i>

              <span id="litmus-paper-label">
                Giấy quỳ tím
              </span>

            </div>


            <strong id="lab-message-title">
              Bắt đầu thí nghiệm
            </strong>


            <span id="lab-message">
              Chọn một hóa chất bên trái để bắt đầu.
            </span>

          </div>

        </div>


        <!-- CONTROLS -->

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


        <!-- DASHBOARD -->

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


        <div
          class="info-box"
          id="reaction-observation"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >

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

  const $ =
    selector =>
      section.querySelector(
        selector
      )


  const reagentList =
    $('#reagent-list')


  const reagentSearch =
    $('#lab-reagent-search')


  const reagentGroup =
    $('#lab-reagent-group')


  const reagentFamily =
    $('#lab-reagent-family')


  const chemicalCount =
    $('#lab-chemical-count')


  const noResults =
    $('#lab-no-results')


  const addButton =
    $('#add-reagent')


  const liquid =
    $('#lab-liquid')


  const beakerWrap =
    $('#beaker-wrap')


  const beakerArea =
    $('#beaker-area')


  const bubbleLayer =
    $('#bubble-layer')


  const foamLayer =
    $('#foam-layer')


  const precipitateLayer =
    $('#precipitate-layer')


  const dropLayer =
    $('#drop-layer')


  const flameBase =
    $('#flame-base')


  const steamLayer =
    $('#steam-layer')


  const volumeText =
    $('#lab-volume')


  const stateText =
    $('#lab-state')


  const tempText =
    $('#temperature-value')


  const tempBar =
    $('#temperature-bar')


  const phText =
    $('#ph-value')


  const phMarker =
    $('#ph-marker')


  const solutionCount =
    $('#solution-count')


  const selectedName =
    $('#selected-name')


  const observationTitle =
    $('#observation-title')


  const observationPanel =
    $('#reaction-observation')


  const observationText =
    $('#observation-text')


  const equationText =
    $('#reaction-equation')


  const compositionList =
    $('#composition-list')


  const messageTitle =
    $('#lab-message-title')


  const message =
    $('#lab-message')


  const litmusPaperResult =
    $('#litmus-paper-result')


  const litmusPaperStrip =
    $('#litmus-paper-strip')


  const litmusPaperLabel =
    $('#litmus-paper-label')


  const logList =
    $('#lab-log-list')


  const stirButton =
    $('#stir-button')


  const heatButton =
    $('#heat-button')


  const emptyButton =
    $('#empty-button')


  const resetButton =
    $('#reset-lab')


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


  const bubbleTimers =
    new Set()


  let currentColor =
    '#7ecbff'


  let lastIndicator =
    null


  let lastLitmusTest =
    null


  let lastEmittedTemperature =
    Math.floor(
      temperature
    )


  /* =========================================================
     GUIDED LAB BRIDGE
  ========================================================= */

  function createLabSnapshot() {

    return {

      mixture:
        {
          ...mixture
        },


      additionHistory:
        [
          ...additionHistory
        ],


      totalVolume,

      temperature,

      heating,

      currentColor,

      lastIndicator,

      lastLitmusTest:
        lastLitmusTest

          ? {
              ...lastLitmusTest
            }

          : null,

      precipitate,


      triggeredReactionIds:
        [
          ...triggeredReactions
        ]

    }

  }


  function emitLabAction(
    type,
    detail = {}
  ) {

    window.dispatchEvent(

      new CustomEvent(
        'chemlab:lab-action',

        {

          detail: {

            type,

            ...detail,

            snapshot:
              createLabSnapshot()

          }

        }
      )

    )

  }


  function restoreLabSnapshot(
    snapshot
  ) {

    if (
      !snapshot ||
      typeof snapshot !==
        'object'
    ) {

      return

    }


    mixture =
      {
        ...(
          snapshot.mixture ||
          {}
        )
      }


    additionHistory =
      Array.isArray(
        snapshot.additionHistory
      )

        ? [
            ...snapshot.additionHistory
          ]

        : Object.keys(
            mixture
          )


    totalVolume =
      Math.max(
        0,
        Math.min(
          250,
          Number(
            snapshot.totalVolume ||
            0
          )
        )
      )


    temperature =
      Math.max(
        25,
        Math.min(
          100,
          Number(
            snapshot.temperature ||
            25
          )
        )
      )


    heating =
      snapshot.heating ===
      true


    currentColor =
      snapshot.currentColor ||
      '#7ecbff'


    lastIndicator =
      snapshot.lastIndicator ||
      null


    lastLitmusTest =
      snapshot.lastLitmusTest &&
      typeof snapshot.lastLitmusTest ===
        'object'

        ? {
            ...snapshot.lastLitmusTest
          }

        : null


    precipitate =
      snapshot.precipitate ||
      null


    triggeredReactions =
      new Set(

        Array.isArray(
          snapshot.triggeredReactionIds
        )

          ? snapshot.triggeredReactionIds

          : []

      )


    lastEmittedTemperature =
      Math.floor(
        temperature
      )


    clearPrecipitate()


    clearBubbles()


    clearFoam()


    renderLitmusPaperResult(
      lastLitmusTest
    )


    if (
      precipitate
    ) {

      createPrecipitate(
        precipitate
      )


      observationTitle.textContent =
        `Đang có kết tủa ${
          precipitateColorLabel(
            precipitate
          )
        }`


      observationText.textContent =
        `Hệ thống đã khôi phục kết tủa ${
          precipitateColorLabel(
            precipitate
          )
        } trong cốc.`

    }

    else {

      observationTitle.textContent =
        'Chưa có hiện tượng'


      observationText.textContent =
        'Tiến độ trước đó đã được phục hồi.'

    }


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


    updateLiquid()

    updateDashboard()


    messageTitle.textContent =
      'Đã khôi phục thí nghiệm'


    message.textContent =
      'Tiến độ trước đó đã được phục hồi.'

  }


  const handleRestoreLab =
    event => {

      restoreLabSnapshot(
        event.detail
      )

    }


  window.addEventListener(
    'chemlab:restore-lab',
    handleRestoreLab
  )


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
     FAMILY LABELS
  ========================================================= */

  const FAMILY_LABELS = {

    water:
      'Nước',

    acid:
      'Axit vô cơ',

    base:
      'Bazơ',

    salt:
      'Muối',

    carbonate:
      'Muối cacbonat',

    oxidizer:
      'Chất oxi hóa',

    reagent:
      'Thuốc thử',

    indicator:
      'Chỉ thị',

    'amphoteric-hydroxide':
      'Hiđroxit lưỡng tính',

    alkane:
      'Ankan',

    cycloalkane:
      'Xicloankan',

    alkene:
      'Anken',

    alkyne:
      'Ankin',

    aromatic:
      'Hiđrocacbon thơm',

    alcohol:
      'Ancol',

    polyol:
      'Ancol đa chức',

    phenol:
      'Phenol',

    aldehyde:
      'Anđehit',

    ketone:
      'Xeton',

    'carboxylic-acid':
      'Axit cacboxylic',

    'dicarboxylic-acid':
      'Axit đicacboxylic',

    ester:
      'Este',

    carbohydrate:
      'Đường / cacbohydrat',

    polysaccharide:
      'Polisaccarit',

    'amino-acid':
      'Amino axit',

    protein:
      'Protein'

  }


  function familyLabel(
    value
  ) {

    return (
      FAMILY_LABELS[
        value
      ] ||

      String(
        value ||
        'Khác'
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
    )

  }


  /* =========================================================
     RENDER CHEMICALS
  ========================================================= */

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


        const color =
          reagent.solutionColor ||
          reagent.color ||
          '#f8fbff'


        card.innerHTML = `

          <div
            class="bottle"
            style="--c:${color}"
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


        card.title =
          [

            reagent.name,

            familyLabel(
              reagent.family
            ),

            ...(
              reagent.hazards ||
              []
            )
              .map(
                item =>
                  `Simulation: ${item}`
              )

          ]
            .join(
              ' · '
            )


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
     FAMILY OPTIONS
  ========================================================= */

  function syncFamilyOptions(
    resetValue =
      false
  ) {

    const current =
      resetValue

        ? 'all'

        : reagentFamily.value


    const group =
      reagentGroup.value


    const families =
      [
        ...new Set(

          chemOrder

            .map(
              id =>
                reagents[id]
            )

            .filter(
              Boolean
            )

            .filter(
              item =>
                group ===
                  'all' ||
                item.category ===
                  group
            )

            .map(
              item =>
                item.family
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
            familyLabel(
              a
            )
              .localeCompare(
                familyLabel(
                  b
                ),
                'vi'
              )
        )


    reagentFamily.innerHTML = `

      <option value="all">
        Tất cả nhóm chức / họ chất
      </option>

    `


    families.forEach(
      family => {

        const option =
          document.createElement(
            'option'
          )


        option.value =
          family


        option.textContent =
          familyLabel(
            family
          )


        reagentFamily.appendChild(
          option
        )

      }
    )


    if (
      current !==
        'all' &&
      families.includes(
        current
      )
    ) {

      reagentFamily.value =
        current

    }

    else {

      reagentFamily.value =
        'all'

    }

  }


  /* =========================================================
     FILTER
  ========================================================= */

  function applyReagentFilter() {

    const query =
      normalizeSearch(
        reagentSearch.value
      )


    const group =
      reagentGroup.value


    const family =
      reagentFamily.value


    let visibleCount =
      0


    reagentList
      .querySelectorAll(
        '.reagent-card'
      )
      .forEach(
        card => {

          const queryMatch =
            !query ||

            normalizeSearch(
              card.dataset.search
            )
              .includes(
                query
              )


          const groupMatch =
            group ===
              'all' ||

            card.dataset.group ===
              group


          const familyMatch =
            family ===
              'all' ||

            card.dataset.family ===
              family


          const visible =
            queryMatch &&
            groupMatch &&
            familyMatch


          card.hidden =
            !visible


          if (
            visible
          ) {

            visibleCount++

          }

        }
      )


    chemicalCount.textContent =
      `${visibleCount} chất`


    noResults.hidden =
      visibleCount !==
      0

  }


  reagentSearch.addEventListener(
    'input',
    applyReagentFilter
  )


  reagentGroup.addEventListener(
    'change',

    () => {

      syncFamilyOptions(
        true
      )


      applyReagentFilter()

    }
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

            card.dataset.reagent ===
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
      `${
        reagent.name
      } · ${
        familyLabel(
          reagent.family
        )
      }. Nhấn “Thêm vào cốc” hoặc kéo hóa chất vào cốc.`

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


            syncVolumeButtons()

          }
        )

      }
    )


  function syncVolumeButtons() {

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
              selectedVolume

          )

        }
      )

  }


  /* =========================================================
     ADD / DROP
  ========================================================= */

  addButton.addEventListener(
    'click',

    () => {

      if (
        !selectedReagent
      ) {

        return

      }


      addReagent(
        selectedReagent,
        selectedVolume
      )

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
     ADD REAGENT
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


    if (
      reagent.indicator ===
      'litmusPaper'
    ) {

      testWithLitmusPaper()

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


    emitLabAction(
      'add',
      {

        chemical:
          id,

        amount:
          acceptedAmount

      }
    )


    checkReactions()

    updateDashboard()


    addLog(
      `Đã thêm ${
        formatNumber(
          acceptedAmount
        )
      } mL ${
        reagent.formula
      }.`
    )


    messageTitle.textContent =
      `Đã thêm ${reagent.formula}`


    message.textContent =
      `${
        formatNumber(
          acceptedAmount
        )
      } mL ${
        reagent.name
      } đã được thêm vào cốc.`

  }


  /* =========================================================
     PURPLE LITMUS PAPER TEST
  ========================================================= */

  function renderLitmusPaperResult(
    result
  ) {

    if (
      !litmusPaperResult ||
      !litmusPaperStrip ||
      !litmusPaperLabel
    ) {

      return

    }


    if (
      !result
    ) {

      litmusPaperResult.hidden =
        true

      litmusPaperStrip.style.removeProperty(
        '--litmus-color'
      )

      return

    }


    const labels = {

      acid:
        'Quỳ tím → đỏ · môi trường acid',

      base:
        'Quỳ tím → xanh · môi trường base',

      neutral:
        'Quỳ tím giữ màu tím · gần trung tính'

    }


    litmusPaperResult.hidden =
      false


    litmusPaperStrip.style.setProperty(
      '--litmus-color',
      result.color ||
      '#806bb0'
    )


    litmusPaperLabel.textContent =
      labels[
        result.result
      ] ||
      'Kết quả giấy quỳ tím'

  }


  function testWithLitmusPaper() {

    if (
      totalVolume <=
      0
    ) {

      messageTitle.textContent =
        'Chưa có dung dịch để thử'


      message.textContent =
        'Hãy thêm dung dịch vào cốc trước khi dùng giấy quỳ tím.'


      observationTitle.textContent =
        'Không thể thử giấy quỳ'


      observationText.textContent =
        'Cốc đang trống.'


      return

    }


    const pH =
      calculatePH()


    const result =

      pH <
        5

        ? 'acid'

        : pH >
            8

          ? 'base'

          : 'neutral'


    const color =

      result ===
        'acid'

        ? '#d94a58'

        : result ===
            'base'

          ? '#4567d9'

          : '#806bb0'


    const resultText =

      result ===
        'acid'

        ? 'Giấy quỳ tím chuyển sang màu đỏ, chứng tỏ dung dịch có môi trường acid.'

        : result ===
            'base'

          ? 'Giấy quỳ tím chuyển sang màu xanh, chứng tỏ dung dịch có môi trường base.'

          : 'Giấy quỳ tím gần như giữ nguyên màu tím, dung dịch đang ở vùng gần trung tính.'


    lastLitmusTest = {

      result,

      pH:
        Number(
          pH.toFixed(
            2
          )
        ),

      color

    }


    renderLitmusPaperResult(
      lastLitmusTest
    )


    observationPanel
      ?.classList
      .remove(
        'reaction-observed'
      )


    void observationPanel
      ?.offsetWidth


    observationPanel
      ?.classList
      .add(
        'reaction-observed'
      )


    observationTitle.textContent =

      result ===
        'acid'

        ? 'Giấy quỳ tím chuyển đỏ'

        : result ===
            'base'

          ? 'Giấy quỳ tím chuyển xanh'

          : 'Giấy quỳ tím không đổi màu rõ rệt'


    observationText.textContent =
      `${resultText} pH mô phỏng ≈ ${pH.toFixed(1)}.`


    equationText.textContent =

      result ===
        'acid'

        ? 'Quỳ tím + môi trường acid → đỏ'

        : result ===
            'base'

          ? 'Quỳ tím + môi trường base → xanh'

          : 'Quỳ tím + môi trường trung tính → tím'


    messageTitle.textContent =
      'Đã thử bằng giấy quỳ tím'


    message.textContent =
      resultText


    addLog(
      `Giấy quỳ tím: ${result}; pH ≈ ${pH.toFixed(1)}.`
    )


    emitLabAction(
      'indicator',
      {
        indicator:
          'litmusPaper',

        result,

        pH:
          Number(
            pH.toFixed(
              2
            )
          ),

        color
      }
    )

  }


  /* =========================================================
     DROP ANIMATION
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
      clamp(

        totalVolume /
        250 *
        78,

        0,

        78

      )


    liquid.style.height =
      `${height}%`


    bubbleLayer.style.height =
      `${height}%`


    foamLayer.style.height =
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
      `${
        formatNumber(
          totalVolume
        )
      } mL`

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


    if (
      lastIndicator ===
      'universal'
    ) {

      if (
        pH <=
        2
      ) {

        return '#d73027'

      }


      if (
        pH <=
        4
      ) {

        return '#f46d43'

      }


      if (
        pH <=
        6
      ) {

        return '#fdae61'

      }


      if (
        pH <
        8
      ) {

        return '#4caf66'

      }


      if (
        pH <=
        10
      ) {

        return '#3f8ed6'

      }


      if (
        pH <=
        12
      ) {

        return '#5650bd'

      }


      return '#7a3bb0'

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


    /*
      Reaction engine sắp priority cao trước.
      Chạy ngược để phản ứng quan trọng nhất
      được hiển thị cuối cùng.
    */

    ;[
      ...available
    ]

      .reverse()

      .forEach(
        reaction => {

          triggeredReactions.add(
            reaction.id
          )


          observationTitle.textContent =
            reaction.title


          observationText.textContent =
            reaction.description ||
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
              applyReactionEffect
            )


          updateReactionObservation(
            reaction
          )


          emitLabAction(
            'reaction',
            {

              reactionId:
                reaction.id,

              title:
                reaction.title

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
     REACTION EFFECT
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


      case 'foam':

        createFoam(
          effect.amount ||
          24
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


        clearPrecipitate()

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

          '[Virtual Lab] Unknown effect:',

          effect

        )

    }

  }


  function createFoam(
    amount = 24
  ) {

    clearFoam()


    const count =
      Math.max(
        10,
        Math.min(
          Number(
            amount
          ) ||
          24,
          42
        )
      )


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const bubble =
        document.createElement(
          'i'
        )


      const size =
        7 +
        Math.random() *
        13


      bubble.style.width =
        `${size}px`


      bubble.style.height =
        `${size}px`


      bubble.style.left =
        `${4 + Math.random() * 92}%`


      bubble.style.top =
        `${-8 + Math.random() * 18}px`


      bubble.style.animationDelay =
        `${Math.random() * .45}s`


      foamLayer.appendChild(
        bubble
      )

    }


    foamLayer.classList.add(
      'active'
    )

  }


  function clearFoam() {

    foamLayer.replaceChildren()


    foamLayer.classList.remove(
      'active'
    )

  }


  function clearPrecipitate() {

    precipitateLayer.replaceChildren()


    precipitateLayer.classList.remove(
      'has-precipitate',
      'is-light-precipitate'
    )


    precipitateLayer.style.removeProperty(
      '--precipitate-color'
    )


    precipitateLayer.style.removeProperty(
      '--sediment-height'
    )


    precipitateLayer.style.removeProperty(
      '--cloud-height'
    )

  }


  function precipitateColorLabel(
    color
  ) {

    const value =
      String(
        color || ''
      ).replace(
        '#',
        ''
      )


    const normalized =
      value.length === 3

        ? value
            .split('')
            .map(
              channel =>
                channel + channel
            )
            .join('')

        : value


    if (
      !/^[0-9a-f]{6}$/i.test(
        normalized
      )
    ) {

      return 'có màu'

    }


    const red =
      parseInt(
        normalized.slice(0, 2),
        16
      )


    const green =
      parseInt(
        normalized.slice(2, 4),
        16
      )


    const blue =
      parseInt(
        normalized.slice(4, 6),
        16
      )


    const brightness =
      (
        red * 299 +
        green * 587 +
        blue * 114
      ) / 255000


    const spread =
      Math.max(
        red,
        green,
        blue
      ) -
      Math.min(
        red,
        green,
        blue
      )


    if (
      brightness >= .88 &&
      spread <= 48
    ) {

      return 'trắng'

    }


    if (
      red > 180 &&
      green > 150 &&
      blue < 150 &&
      red > blue * 1.4 &&
      green > blue * 1.4
    ) {

      return 'vàng'

    }


    if (
      red > green * 1.22 &&
      green > blue * 1.12
    ) {

      return brightness < .58

        ? 'nâu'

        : 'vàng'

    }


    if (
      blue > red * 1.18 &&
      blue > green * 1.08
    ) {

      return 'xanh lam'

    }


    if (
      green > red * 1.08 &&
      green > blue * 1.06
    ) {

      return 'xanh lục'

    }


    if (
      brightness < .2
    ) {

      return 'sẫm màu'

    }


    return 'có màu'

  }


  function updateReactionObservation(
    reaction
  ) {

    if (observationPanel) {

      observationPanel
        .classList
        .remove(
          'reaction-observed'
        )


      void observationPanel.offsetWidth


      observationPanel
        .classList
        .add(
          'reaction-observed'
        )

    }

    const effects =
      reaction.effects ||
      []


    const precipitateEffect =
      effects.find(
        effect =>
          effect.type ===
          'precipitate'
      )


    const hasGas =
      effects.some(
        effect =>
          effect.type ===
          'gas'
      )


    const hasFoam =
      effects.some(
        effect =>
          effect.type ===
          'foam'
      )


    const changesColor =
      effects.some(
        effect =>
          effect.type ===
          'solutionColor'
      )


    const observations = []


    if (
      precipitateEffect
    ) {

      observations.push(
        `Xuất hiện kết tủa ${
          precipitateColorLabel(
            precipitateEffect.color
          )
        }.`
      )


      observations.push(
        'Dung dịch đục nhẹ, chất rắn đang lắng xuống đáy cốc.'
      )

    }


    if (hasGas) {

      observations.push(
        'Có khí thoát ra.'
      )

    }


    if (hasFoam) {

      observations.push(
        'Xuất hiện lớp bọt mô phỏng của xà phòng trên bề mặt hỗn hợp.'
      )

    }


    if (changesColor) {

      observations.push(
        'Dung dịch đổi màu.'
      )

    }


    if (!observations.length) {

      observationTitle.textContent =
        reaction.title ||
        'Phản ứng đã xảy ra'


      observationText.textContent =
        reaction.description ||
        'Chưa có hiện tượng quan sát rõ.'


      return

    }


    observationTitle.textContent =
      precipitateEffect

        ? `Kết tủa ${
            precipitateColorLabel(
              precipitateEffect.color
            )
          } xuất hiện`

        : hasGas

          ? 'Có khí thoát ra'

          : hasFoam

            ? 'Xuất hiện bọt xà phòng'

            : 'Dung dịch đổi màu'


    observationText.textContent =
      observations.join(' ')

  }


  function clearBubbles() {

    bubbleTimers.forEach(
      timer =>
        clearTimeout(
          timer
        )
    )


    bubbleTimers.clear()


    bubbleLayer.replaceChildren()

  }


  /* =========================================================
     BUBBLES
  ========================================================= */

  function createBubbles(
    count =
      12
  ) {

    const maxBubbles =
      window.matchMedia(
        '(max-width: 767px)'
      ).matches

        ? 10

        : 18


    const availableSlots =
      Math.max(
        0,
        maxBubbles -
          bubbleLayer.childElementCount
      )


    const bubbleCount =
      Math.min(
        Math.max(
          Math.round(
            Number(count) || 0
          ),
          0
        ),
        availableSlots
      )


    for (
      let i = 0;
      i < bubbleCount;
      i++
    ) {

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


      const duration =
        1.7 +
        Math.random() *
        1.2


      const delay =
        i * 55


      bubble.style.animationDuration =
        `${duration}s`


      bubble.style.animationDelay =
        `${delay}ms`


      bubbleLayer.appendChild(
        bubble
      )


      const timer =
        window.setTimeout(
          () => {

            bubble.remove()

            bubbleTimers.delete(
              timer
            )

          },

          duration * 1000 + delay + 150
        )


      bubbleTimers.add(
        timer
      )

    }

  }


  function createPrecipitate(
    color
  ) {

    clearPrecipitate()


    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches


    const mobile =
      window.matchMedia(
        '(max-width: 767px)'
      ).matches


    const liquidHeightPercent =
      clamp(
        totalVolume / 250 * 78,
        10,
        78
      )


    const lightColor =
      precipitateColorLabel(
        color
      ) === 'trắng'


    precipitateLayer.classList.add(
      'has-precipitate'
    )


    if (lightColor) {

      precipitateLayer.classList.add(
        'is-light-precipitate'
      )

    }


    precipitateLayer.style.setProperty(
      '--precipitate-color',
      color
    )


    precipitateLayer.style.setProperty(
      '--cloud-height',
      `${liquidHeightPercent}%`
    )


    precipitateLayer.style.setProperty(
      '--sediment-height',
      `${
        clamp(
          14 + totalVolume / 250 * 8,
          14,
          22
        )
      }px`
    )


    const cloud =
      document.createElement(
        'div'
      )


    cloud.className =
      'precipitate-cloud'


    cloud.setAttribute(
      'aria-hidden',
      'true'
    )


    const sediment =
      document.createElement(
        'div'
      )


    sediment.className =
      'precipitate-sediment'


    sediment.setAttribute(
      'aria-hidden',
      'true'
    )


    precipitateLayer.append(
      cloud,
      sediment
    )


    const particleCount =
      reducedMotion

        ? 8

        : mobile

          ? 8

          : 16


    for (
      let i = 0;
      i < particleCount;
      i++
    ) {

      const particle =
        document.createElement(
          'i'
        )


      particle.className =
        'precipitate-particle'


      particle.style.left =
        `${
          10 +
          Math.random() *
          80
        }%`


      particle.style.top =
        `${
          100 -
          liquidHeightPercent *
            (.2 + Math.random() * .65)
        }%`


      const size =
        4 +
        Math.random() *
        4


      particle.style.width =
        `${size}px`


      particle.style.height =
        `${size}px`


      particle.style.opacity =
        `${
          .45 +
          Math.random() *
          .4
        }`


      particle.style.animationDelay =
        reducedMotion

          ? '0ms'

          : `${
              Math.random() *
              850
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
            ${
              formatNumber(
                volume
              )
            } mL
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
        ${escapeHTML(text)}
      </p>

    `


    logList.prepend(
      item
    )

  }


  $('#clear-log')
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

  stirButton.addEventListener(
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


      emitLabAction(
        'heat',
        {
          heating
        }
      )


      checkReactions()

    }
  )


  /* =========================================================
     EMPTY / RESET
  ========================================================= */

  emptyButton.addEventListener(
    'click',
    emptyBeaker
  )


  resetButton.addEventListener(
    'click',
    resetLab
  )


  function emptyBeaker(
    {
      writeLog =
        true
    } = {}
  ) {

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


    lastLitmusTest =
      null


    currentColor =
      '#7ecbff'


    triggeredReactions.clear()


    clearPrecipitate()


    clearBubbles()


    clearFoam()


    renderLitmusPaperResult(
      null
    )


    observationTitle.textContent =
      'Chưa có hiện tượng'


    observationPanel
      ?.classList
      .remove(
        'reaction-observed'
      )


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


    if (
      writeLog
    ) {

      addLog(
        'Đã đổ bỏ dung dịch.'
      )

    }

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


    lastEmittedTemperature =
      25


    tempText.textContent =
      '25.0'


    tempBar.style.width =
      '0%'


    emptyBeaker({

      writeLog:
        false

    })


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


    reagentSearch.value =
      ''


    reagentGroup.value =
      'all'


    syncFamilyOptions(
      true
    )


    syncVolumeButtons()


    applyReagentFilter()


    logList.innerHTML =
      '<p class="log-empty">Chưa có hoạt động.</p>'


    messageTitle.textContent =
      'Bắt đầu thí nghiệm'


    message.textContent =
      'Chọn một hóa chất bên trái để bắt đầu.'

  }


  /* =========================================================
     TEMPERATURE ENGINE
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
              .2

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
              .08

            )

        }


        tempText.textContent =
          temperature
            .toFixed(
              1
            )


        const wholeTemperature =
          Math.floor(
            temperature
          )


        if (
          wholeTemperature !==
          lastEmittedTemperature
        ) {

          lastEmittedTemperature =
            wholeTemperature


          emitLabAction(
            'temperature',
            {
              temperature
            }
          )

        }


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
            .72
        ) {

          createSteam()

        }


        if (
          !section.isConnected
        ) {

          window.clearInterval(
            temperatureTimer
          )


          window.removeEventListener(
            'chemlab:restore-lab',
            handleRestoreLab
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
     ANIMATION LOOP
  ========================================================= */

  const animationStage =
    section.querySelector(
      '.vl-stage'
    )


  const animationView =
    section.closest(
      '.workspace-view'
    )


  let animationFrameId =
    null


  let animationStageVisible =
    false


  function scheduleAnimationLoop() {

    if (
      animationFrameId === null &&
      animationStageVisible &&
      !document.hidden &&
      !animationView?.hidden &&
      section.isConnected
    ) {

      animationFrameId =
        requestAnimationFrame(
          animationLoop
        )

    }

  }


  function stopAnimationLoop() {

    if (
      animationFrameId !== null
    ) {

      cancelAnimationFrame(
        animationFrameId
      )


      animationFrameId =
        null

    }

  }

  function animationLoop() {

    animationFrameId =
      null

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


    if (
      !dragging &&
      Math.abs(
        tiltCurrent
      ) <
      .02
    ) {

      tiltCurrent =
        0

    }


    if (
      !dragging &&
      Math.abs(
        liquidTilt
      ) <
      .02
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


    scheduleAnimationLoop()

  }


  /* =========================================================
     COLORS
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


  function normalizeSearch(
    value
  ) {

    return String(
      value ||
      ''
    )

      .normalize(
        'NFD'
      )

      .replace(
        /[\u0300-\u036f]/g,
        ''
      )

      .toLowerCase()

      .trim()

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

  renderChemicalCards()


  syncFamilyOptions(
    true
  )


  syncVolumeButtons()


  applyReagentFilter()


  updateLiquid()


  updateDashboard()


  if (
    animationStage &&
    'IntersectionObserver' in window
  ) {

    const animationObserver =
      new IntersectionObserver(
        entries => {

          animationStageVisible =
            entries.some(
              entry =>
                entry.isIntersecting
            )


          if (
            animationStageVisible
          ) {

            scheduleAnimationLoop()

          }

          else {

            stopAnimationLoop()

          }

        }
      )


    animationObserver.observe(
      animationStage
    )

  }

  else {

    animationStageVisible =
      true

  }


  if (
    animationView
  ) {

    const animationViewObserver =
      new MutationObserver(
        () => {

          if (
            animationView.hidden
          ) {

            stopAnimationLoop()

          }

          else {

            scheduleAnimationLoop()

          }

        }
      )


    animationViewObserver.observe(
      animationView,
      {
        attributes: true,
        attributeFilter: [
          'hidden'
        ]
      }
    )

  }


  document.addEventListener(
    'visibilitychange',
    () => {

      if (
        document.hidden
      ) {

        stopAnimationLoop()

      }

      else {

        scheduleAnimationLoop()

      }

    }
  )


  scheduleAnimationLoop()

}