import { APP_VERSION } from './appMeta.js'

import './virtualLab.css'

import {
  CHEMICALS,
  CHEMICAL_ORDER
} from './lab/chemicals.js'

import {
  REACTIONS
} from './lab/reactions.js'
import { reactionTitle, reactionDescription, reactionMessage } from './lab/reactionsVi.js'
import { createBeakerEffects } from './lab/beakerEffects.js'
import { computeAcidBase } from './lab/acidBase.js'
import { stockConcentration } from './lab/concentrations.js'
import { AMPHOTERIC } from './lab/stoichiometry.js'
import { engineDrivesGas, remainingFractions, simulateLab } from './lab/engine/simulate.js'
import { solidsOf } from './lab/engine/precipitates.js'

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



  const section =
    document.createElement(
      'section'
    )


  section.id =
    'lab'


  section.className =
    'virtual-lab-v2'


  section.innerHTML = `
    <header class="ui-page-head vl-head">
      <div>
        <span class="ui-eyebrow">Phòng thí nghiệm ảo</span>
        <h1>Phòng thí nghiệm</h1>
        <p>${chemOrder.length} hóa chất · ${reactions.length} phản ứng vô cơ và hữu cơ. Chọn hóa chất, thêm vào cốc rồi quan sát hiện tượng và phương trình.</p>
      </div>
      <p class="vl-safety" role="note">
        <span aria-hidden="true">!</span>
        Mô phỏng phục vụ học tập, không thay thế quy tắc an toàn trong phòng thí nghiệm thật.
      </p>
    </header>

    <div class="vl-layout">

      <aside class="vl-shelf panel" aria-labelledby="vl-shelf-title">
        <div class="vl-panel-head">
          <h2 id="vl-shelf-title">Hóa chất</h2>
          <strong id="lab-chemical-count" class="ui-badge">${chemOrder.length} chất</strong>
        </div>

        <div class="lab-reagent-tools">
          <label class="lab-search-shell" for="lab-reagent-search">
            <span class="lab-search-icon" aria-hidden="true">⌕</span>
            <input id="lab-reagent-search" type="search" placeholder="Tìm HCl, Ethanol, Glucose…" autocomplete="off" aria-label="Tìm hóa chất">
          </label>
          <div class="lab-select-shell">
            <select id="lab-reagent-group" class="lab-filter-select" aria-label="Lọc nhóm hóa chất">
              <option value="all">Tất cả</option>
              <option value="inorganic">Vô cơ</option>
              <option value="organic">Hữu cơ</option>
              <option value="indicator">Chỉ thị / thuốc thử</option>
            </select>
          </div>
          <div class="lab-select-shell lab-family-filter">
            <select id="lab-reagent-family" class="lab-filter-select" aria-label="Lọc họ hóa chất">
              <option value="all">Tất cả nhóm chức / họ chất</option>
            </select>
          </div>
        </div>

        <div id="reagent-list" class="reagent-list" aria-label="Danh sách hóa chất"></div>
        <div id="lab-no-results" class="lab-no-results" hidden>Không tìm thấy hóa chất phù hợp.</div>

        <div id="vl-selected" class="vl-selected" hidden aria-live="polite"></div>

        <div class="vl-volume" role="group" aria-label="Lượng thêm vào cốc">
          <span>Lượng thêm</span>
          <div>
            <button type="button" data-volume="1">1 mL</button>
            <button type="button" data-volume="10">10 mL</button>
            <button type="button" data-volume="25" class="active">25 mL</button>
            <button type="button" data-volume="50">50 mL</button>
          </div>
        </div>

        <button id="add-reagent" class="primary-btn" type="button" disabled>Thêm vào cốc</button>
      </aside>

      <div class="vl-main">
        <div class="vl-stage panel" id="beaker-area" aria-label="Khu vực thí nghiệm — có thể thả hóa chất vào cốc">
          <div class="stage-grid" aria-hidden="true"></div>

          <div class="stage-badge left">
            <span>Thể tích</span>
            <strong id="lab-volume">0 mL</strong>
          </div>
          <div class="stage-badge right">
            <span>Trạng thái</span>
            <strong id="lab-state">Cốc trống</strong>
          </div>

          <div class="beaker-scene">
            <div class="steam-layer" id="steam-layer" aria-hidden="true"></div>
            <div class="beaker-wrap" id="beaker-wrap" title="Kéo ngang để nghiêng cốc">
              <div class="beaker-body">
                <div class="beaker-top"></div>
                <div class="beaker-inner">
                  <div class="beaker-scale" aria-hidden="true">
                    <span>250</span>
                    <span>188</span>
                    <span>125</span>
                    <span>63</span>
                  </div>
                  <div class="liquid-mask">
                    <div class="liquid" id="lab-liquid"><div class="liquid-top"></div></div>
                    <div class="precipitate-layer" id="precipitate-layer"></div>
                    <div class="bubble-layer" id="bubble-layer"></div>
                    <div class="foam-layer" id="foam-layer"></div>
                  </div>
                  <div class="drop-layer" id="drop-layer"></div>
                </div>
              </div>
            </div>
            <div class="flame-box" id="flame-base" aria-hidden="true">
              <div class="flame-outer"></div>
              <div class="flame-core"></div>
              <div class="flame-stand"></div>
            </div>
            <div class="scene-shadow" aria-hidden="true"></div>
          </div>

          <div class="stage-note">
            <div class="litmus-paper-result" id="litmus-paper-result" hidden>
              <i class="litmus-paper-strip" id="litmus-paper-strip" aria-hidden="true"></i>
              <span id="litmus-paper-label">Giấy quỳ tím</span>
            </div>
            <strong id="lab-message-title">Bắt đầu thí nghiệm</strong>
            <span id="lab-message">Chọn một hóa chất để bắt đầu.</span>
          </div>
        </div>

        <div class="vl-controls panel" role="toolbar" aria-label="Thao tác với cốc">
          <button id="stir-button" type="button">Khuấy</button>
          <button id="heat-button" type="button" aria-pressed="false">Bật lửa</button>
          <button id="undo-button" type="button" disabled>Hoàn tác</button>
          <button id="empty-button" type="button">Đổ bỏ</button>
          <button id="reset-lab" type="button">Đặt lại</button>
          <span>Kéo ngang trên cốc để nghiêng</span>
        </div>

        <div class="vl-dashboard">
          <div class="meter panel">
            <span>Nhiệt độ</span>
            <strong><b id="temperature-value">25.0</b> °C</strong>
            <div class="bar"><i id="temperature-bar"></i></div>
          </div>
          <div class="meter panel">
            <span>Độ pH</span>
            <strong id="ph-value">7.0</strong>
            <div class="ph-bar"><i id="ph-marker"></i></div>
            <small id="ph-mode">Nước tinh khiết, 25 °C</small>
          </div>
          <div class="meter panel">
            <span>Dung dịch</span>
            <strong id="solution-count">0 chất</strong>
            <small id="selected-name">Chưa chọn hóa chất</small>
          </div>
        </div>
      </div>

      <aside class="vl-side panel" aria-labelledby="vl-side-title">
        <div class="vl-panel-head">
          <h2 id="vl-side-title">Quan sát</h2>
        </div>

        <div class="info-box" id="reaction-observation" role="status" aria-live="polite" aria-atomic="true">
          <span>Hiện tượng</span>
          <strong id="observation-title">Chưa có hiện tượng</strong>
          <p id="observation-text">Thêm hóa chất vào cốc để bắt đầu mô phỏng.</p>
        </div>

        <div class="info-box">
          <span>Phương trình</span>
          <strong id="reaction-equation">—</strong>
        </div>

        <div class="info-box stoich-box" id="stoich-box" hidden>
          <span>Định lượng</span>
          <div id="stoich-body"></div>
        </div>

        <div class="info-box">
          <span>Trong cốc</span>
          <div id="composition-list" class="composition-list"><p>Cốc đang trống.</p></div>
        </div>

        <div class="info-box log-box">
          <div class="log-head">
            <span>Nhật ký</span>
            <button id="clear-log" type="button">Xóa</button>
          </div>
          <div id="lab-log-list" class="log-list"><p class="log-empty">Chưa có hoạt động.</p></div>
        </div>
      </aside>
    </div>
  `

  host.appendChild(
    section
  )



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


  const stoichBox =
    $('#stoich-box')

  const stoichBody =
    $('#stoich-body')

  const phMode =
    $('#ph-mode')

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


  const undoButton =
    $('#undo-button')

  const undoStack = []

  const resetButton =
    $('#reset-lab')

  const beakerEffects =
    createBeakerEffects(
      section.querySelector('.liquid-mask')
    )



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

  let additions =
    []

  let gasBaseline = 0


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

      additions:
        additions.map(item => ({ ...item })),


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

    additions = Array.isArray(snapshot.additions)
      ? snapshot.additions.map(item => ({ id: item.id, volume: Number(item.volume) || 0 }))
      : [...new Set([...additionHistory, ...Object.keys(mixture)])]
          .filter(id => mixture[id] > 0)
          .map(id => ({ id, volume: mixture[id] }))


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


    heatButton.setAttribute('aria-pressed', String(heating))


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

    syncGasBaseline()
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

      undoStack.length = 0
      syncUndoButton()

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



  const HAZARD_LABELS = Object.freeze({
    corrosive: 'Ăn mòn',
    oxidizing: 'Chất oxi hóa',
    irritant: 'Gây kích ứng',
    toxic: 'Độc',
    flammable: 'Dễ cháy'
  })

  function renderSelectedReagent(reagent) {
    const host = section.querySelector('#vl-selected')
    if (!host) return
    const color = reagent.solutionColor || reagent.color || '#f8fbff'
    const hazards = (reagent.hazards || []).filter(item => HAZARD_LABELS[item])
    host.hidden = false
    host.innerHTML = `
      <span class="vl-selected__swatch" style="--c:${color}" aria-hidden="true"></span>
      <div class="vl-selected__copy">
        <strong>${escapeHTML(reagent.formula)}</strong>
        <span>${escapeHTML(reagent.name)} · ${escapeHTML(familyLabel(reagent.family))}</span>
        ${hazards.length ? `
          <ul class="vl-hazards" aria-label="Lưu ý an toàn với hóa chất thật">
            ${hazards.map(item => `<li data-hazard="${item}">${HAZARD_LABELS[item]}</li>`).join('')}
          </ul>` : ''}
      </div>
    `
  }


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

          card.setAttribute(
            'aria-pressed',
            String(card.dataset.reagent === id)
          )

        }
      )


    renderSelectedReagent(reagent)

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


    rememberForUndo()

    const wasEmpty =
      totalVolume ===
      0


    mixture[id] =
      (
        mixture[id] ||
        0
      ) +
      acceptedAmount

    additions.push({ id, volume: acceptedAmount })


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
      `${resultText} ${phSummary()}.`


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
      `Giấy quỳ tím: ${result}; ${phSummary()}.`
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



  function isClearColourless(color) {
    if (Object.keys(mixture).some(id => mixture[id] > 0 && reagents[id]?.state === 'suspension')) return false
    const rgb = hexToRgb(color)
    if (!rgb) return false
    const [red, green, blue] = [rgb.r, rgb.g, rgb.b].map(value => value / 255)
    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)
    return (max + min) / 2 > 0.9 && max - min < 0.14
  }

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

    beakerEffects.setLevel(height / 100)


    bubbleLayer.style.height =
      `${height}%`


    foamLayer.style.height =
      `${height}%`


    liquid.style.setProperty(

      '--liquid-color',

      getDisplayedColor()

    )

    liquid.style.setProperty(
      '--liquid-opacity',
      isClearColourless(getDisplayedColor()) ? '0.42' : '0.9'
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
            reactionTitle(reaction)


          observationText.textContent =
            reactionDescription(reaction) ||
            ''


          equationText.textContent =
            reaction.equation ||
            '—'


          messageTitle.textContent =
            reactionTitle(reaction)


          message.textContent =
            reaction.equation ||
            reactionDescription(reaction) ||
            'Phản ứng đã xảy ra.'


          reaction.effects
            ?.filter(effect => effect.type !== 'gas' || !engineDrivesGas(reaction, currentSimulation()))
            .forEach(
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
                reactionTitle(reaction)

            }
          )


          addLog(
            reactionTitle(reaction)
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


      case 'message':

        if (
          effect.text
        ) {

          message.textContent =
            reactionMessage(effect.text)

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


  function clearPrecipitate({ fade = false } = {}) {

    if (fade) beakerEffects.dissolvePrecipitate()
    else beakerEffects.clearPrecipitate()

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
      observationPanel.classList.remove('reaction-observed')
      void observationPanel.offsetWidth
      observationPanel.classList.add('reaction-observed')
    }

    const effects = reaction.effects || []
    const precipitateEffect = effects.find(effect => effect.type === 'precipitate')
    const solids = solidsOf(reaction)
    const solidNames = solids.map(solid => `${solid.label || precipitateColorLabel(solid.color || precipitateEffect?.color)} (${solid.display})`)
    const hasGas = effects.some(effect => effect.type === 'gas')
    const hasFoam = effects.some(effect => effect.type === 'foam')
    const changesColor = effects.some(effect => effect.type === 'solutionColor')
    const observations = []

    if (precipitateEffect) {
      observations.push(solidNames.length ? `Xuất hiện kết tủa ${solidNames.join(' và ')}.` : `Xuất hiện kết tủa ${precipitateColorLabel(precipitateEffect.color)}.`)
      observations.push('Dung dịch đục, chất rắn lắng dần xuống đáy cốc.')
    }
    if (hasGas) observations.push('Có khí thoát ra.')
    if (hasFoam) observations.push('Xuất hiện lớp bọt mô phỏng của xà phòng trên bề mặt hỗn hợp.')
    if (changesColor) observations.push('Dung dịch đổi màu.')

    if (!observations.length) {
      observationTitle.textContent = reactionTitle(reaction) || 'Phản ứng đã xảy ra'
      observationText.textContent = `${reactionDescription(reaction) || ''} Không thấy biến đổi rõ trong cốc (không kết tủa, không khí, không đổi màu).`.trim()
      return
    }

    observationTitle.textContent = precipitateEffect
      ? `Kết tủa ${solids.length ? solids.map(solid => solid.label || precipitateColorLabel(solid.color)).join(' và ') : precipitateColorLabel(precipitateEffect.color)} xuất hiện`
      : hasGas ? 'Có khí thoát ra'
        : hasFoam ? 'Xuất hiện bọt xà phòng'
          : 'Dung dịch đổi màu'
    observationText.textContent = observations.join(' ')
  }

  function clearBubbles() {
    bubbleTimers.forEach(timer => clearTimeout(timer))
    bubbleTimers.clear()
    beakerEffects.clearBubbles()
  }


  function createBubbles(count = 12) {
    beakerEffects.bubbles(Number(count) || 0)
  }

  function createPrecipitate(color) {
    clearPrecipitate()
    precipitateLayer.classList.add('has-precipitate')
    if (precipitateColorLabel(color) === 'trắng') {
      precipitateLayer.classList.add('is-light-precipitate')
    }
    precipitateLayer.style.setProperty('--precipitate-color', color)
    beakerEffects.precipitate(color)
  }



  const PRECIPITATE_REFERENCE_MOLES = 2.5e-3
  const AMPHOTERIC_REAGENT = Object.fromEntries(Object.entries(AMPHOTERIC).map(([id, item]) => [id, item.reagent]))
  const subscript = formula => String(formula).replace(/(?<=[A-Za-z)\]])\d+/g, digits => [...digits].map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join(''))
  const mmol = moles => `${(moles * 1000).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mmol`
  const grams = mass => `${mass.toLocaleString('vi-VN', { maximumSignificantDigits: 3 })} g`

  function currentSimulation() {
    return simulateLab({ additions, triggeredIds: triggeredReactions, reactions, reagents })
  }

  function syncGasBaseline() {
    gasBaseline = currentSimulation().gasMoles
  }

  function renderStepwise(result) {
    const { system, state } = result
    const row = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`
    const left = [
      state.dibasic > 1e-12 && `${system.labels.dibasic} ${mmol(state.dibasic)}`,
      state.monobasic > 1e-12 && `${system.labels.monobasic} ${mmol(state.monobasic)}`,
      state.acid > 1e-12 && `H⁺ dư ${mmol(state.acid)}`
    ].filter(Boolean)
    stoichBody.innerHTML = `
      <dl class="stoich-list">
        ${state.stage1 > 0 ? row(`Nấc 1 · ${system.stage1}`, mmol(state.stage1)) : ''}
        ${state.stage2 > 0 ? row(`Nấc 2 · ${system.stage2}`, mmol(state.stage2)) : ''}
        ${state.direct > 0 ? row(`Acid dư · ${system.direct}`, mmol(state.direct)) : ''}
        ${row(`${system.labels.gas}↑ đã thoát ra`, state.gas > 0 ? mmol(state.gas) : 'chưa có')}
        ${left.length ? row('Còn trong cốc', left.join(' · ')) : ''}
      </dl>
      <p class="stoich-note">Mô hình hai nấc lý tưởng, theo đúng thứ tự bạn thêm hóa chất: nhỏ acid vào muối thì nấc 1 xong mới có khí; cho muối vào acid dư thì có khí ngay. Thực tế có thể thoát ít khí sớm hơn và một phần khí còn hòa tan.</p>
    `

    if (state.gas > 0) {
      observationTitle.textContent = `Có khí ${system.labels.gas} thoát ra`
      observationText.textContent = system.id === 'sulfite'
        ? 'Sủi bọt khí SO₂ không màu, mùi hắc và độc — trong phòng thí nghiệm thật phải làm trong tủ hút.'
        : 'Sủi bọt khí CO₂ không màu.'
      equationText.textContent = state.direct > 0 && state.stage2 === 0 ? system.direct : system.stage2
    }
    else {
      observationTitle.textContent = 'Chưa có khí thoát ra'
      observationText.textContent = `H⁺ mới chuyển ${system.labels.dibasic} thành ${system.labels.monobasic} (nấc 1), chưa tạo khí ${system.labels.gas}.`
      equationText.textContent = system.stage1
    }
  }

  function syncSolutionColor(simulation) {
    const results = [...simulation.results.values()]
    if (!results.length || results.some(result => result.status !== 'quantitative')) return
    if ([...triggeredReactions].some(id => reactions.find(item => item.id === id)?.effects?.some(effect => effect.type === 'solutionColor'))) return
    const fractions = remainingFractions(simulation)
    let weight = 0
    const sum = { r: 0, g: 0, b: 0 }
    for (const [id, volume] of Object.entries(mixture)) {
      if (!(volume > 0)) continue
      const keep = fractions[id] ?? 1
      for (const [color, part] of [[reagents[id]?.solutionColor || reagents[id]?.color || '#f8fbff', volume * keep], ['#f8fbff', volume * (1 - keep)]]) {
        const rgb = hexToRgb(color)
        if (!rgb || part <= 0) continue
        sum.r += rgb.r * part
        sum.g += rgb.g * part
        sum.b += rgb.b * part
        weight += part
      }
    }
    if (weight > 0) currentColor = rgbToHex(sum.r / weight, sum.g / weight, sum.b / weight)
  }

  function renderStoichiometry() {
    const ids = [...triggeredReactions]
    const reaction = reactions.find(item => item.id === ids[ids.length - 1])
    stoichBox.hidden = !reaction

    const simulation = currentSimulation()
    syncSolutionColor(simulation)

    const newGas = simulation.gasMoles - gasBaseline
    gasBaseline = simulation.gasMoles
    if (newGas > 1e-9) {
      createBubbles(Math.round(Math.min(40, Math.max(6, newGas / 1e-4))))
    }

    if (!reaction) return
    const result = simulation.results.get(reaction.id)

    if (result?.kind === 'stepwise') {
      renderStepwise(result)
      return
    }

    if (!result || result.status === 'qualitative') {
      stoichBody.innerHTML = `<p>${escapeHTML(
        result?.reason
          ? result.reason
          : result?.missing
            ? `Phản ứng được mô phỏng định tính: dữ liệu chưa có nồng độ của ${result.missing.join(', ')}, nên ChemLab không tính lượng chất.`
            : 'Phản ứng được mô phỏng định tính.'
      )}</p>`
      return
    }

    const solidMoles = simulation.solidMoles
    const solidColor = reaction.effects?.find(effect => effect.type === 'precipitate')?.color
    if (solidColor && solidMoles <= 0 && precipitate) {
      precipitate = null
      clearPrecipitate({ fade: true })
      observationTitle.textContent = 'Kết tủa tan hết'
      observationText.textContent = `${subscript(result.dissolved?.formula || 'Kết tủa')} lưỡng tính tan trong ${reagents[AMPHOTERIC_REAGENT[reaction.id]]?.formula || 'kiềm'} dư, dung dịch trong trở lại.`
    }
    else if (solidColor && solidMoles > 0 && !precipitate) {
      precipitate = solidColor
      createPrecipitate(solidColor)
    }
    if (solidMoles > 0 && precipitate) {
      beakerEffects.setPrecipitateAmount(solidMoles / PRECIPITATE_REFERENCE_MOLES)
    }

    const row = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`
    const limiting = result.reactants.filter(item => result.limiting.includes(item.id))
    const products = result.products.filter(item => item.formula !== 'H2O' && item.moles > 0)
    const productLabel = item => `${subscript(item.formula)}${item.precipitate ? '↓' : ''}${item.gas ? '↑' : ''} ${mmol(item.moles)} (${grams(item.mass)})`
    stoichBody.innerHTML = `
      <dl class="stoich-list">
        ${row('Đã thêm', result.reactants.map(item => `${escapeHTML(item.formula)} ${mmol(item.moles)}`).join(' · '))}
        ${row(limiting.length === result.reactants.length ? 'Phản ứng vừa đủ' : 'Chất hết (hạn chế)', limiting.map(item => escapeHTML(item.formula)).join(', '))}
        ${result.excess.length ? row('Còn dư', result.excess.map(item => `${escapeHTML(item.formula)} ${mmol(item.moles)}`).join(' · ')) : ''}
        ${result.dissolved?.moles > 0 ? row(result.dissolved.complete ? 'Kết tủa tan hết' : 'Kết tủa tan một phần', `${subscript(result.dissolved.formula)} ${mmol(result.dissolved.moles)} tan trong kiềm dư`) : ''}
        ${row('Tạo thành', products.map(productLabel).join(' · ') + (products.length < result.products.length ? ' · và H₂O' : ''))}
      </dl>
      <p class="stoich-note">Tính từ thể tích × dung dịch gốc 0,1 M và hệ số phương trình, coi phản ứng xảy ra hoàn toàn${products.some(item => item.gas) ? ' và khí thoát hết khỏi cốc hở' : ''}.${solidMoles > 0 ? ' Lượng kết tủa vẽ trong cốc tỉ lệ với số mol, chỉ để minh họa — không phải thể tích hay kích thước hạt thật.' : ''}</p>
    `
  }

  function phSummary() {
    const { pH, mode } =
      computeAcidBase(
        mixture,
        reagents
      )

    return mode === 'estimate'
      ? 'pH chỉ ước tính định tính'
      : `pH = ${pH.toFixed(1)}`
  }

  function calculatePH() {
    return computeAcidBase(
      mixture,
      reagents
    ).pH
  }



  function updateDashboard() {

    const acidBase =
      computeAcidBase(
        mixture,
        reagents
      )

    const pH =
      acidBase.pH

    renderStoichiometry()

    const [modeLabel, modeTitle] = {
      empty: ['Cốc trống', 'Chưa có dung dịch trong cốc.'],
      quantitative: ['Từ số mol · gốc 0,1 M · 25 °C', 'pH tính từ số mol H⁺/OH⁻ của acid/base mạnh (dung dịch gốc 0,1 M), sau khi trung hòa và pha loãng; giả thiết 25 °C, bỏ qua hệ số hoạt độ.'],
      estimate: ['Chỉ định tính (acid/base yếu, muối)', 'Có acid/base yếu hoặc muối thủy phân: ChemLab chỉ cho biết môi trường acid/base, chưa tính giá trị pH.']
    }[acidBase.mode]

    phMode.textContent = modeLabel
    phMode.title = modeTitle

    phText.textContent =
      acidBase.mode === 'estimate'
        ? pH < 6.5 ? '< 7' : pH > 7.5 ? '> 7' : '≈ 7'
        : pH.toFixed(1)


    phMarker.style.left =
      `${pH / 14 * 100}%`


    liquid.style.setProperty(

      '--liquid-color',

      getDisplayedColor()

    )

    liquid.style.setProperty(
      '--liquid-opacity',
      isClearColourless(getDisplayedColor()) ? '0.42' : '0.9'
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
            } mL${
              stockConcentration(id) !== null
                ? ' · 0,1 M'
                : ''
            }
          </strong>

        `


        compositionList.appendChild(
          row
        )

      }
    )

  }



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


      const simulation = currentSimulation()
      const releasesGas =
        reactions.some(
          reaction =>
            triggeredReactions.has(reaction.id) &&
            reaction.effects?.some(effect => effect.type === 'gas') &&
            (!engineDrivesGas(reaction, simulation) || simulation.gasMoles > 0)
        )

      if (releasesGas) {
        createBubbles(6)
      }

      addLog(
        'Đã khuấy dung dịch.'
      )


      messageTitle.textContent =
        'Đang khuấy'


      message.textContent =
        'Dung dịch đang được trộn đều.'

    }
  )



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


      heatButton.setAttribute('aria-pressed', String(heating))


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



  emptyButton.addEventListener(
    'click',
    emptyBeaker
  )


  resetButton.addEventListener(
    'click',
    resetLab
  )


  undoButton.addEventListener('click', undoLastAction)


  function isGuidedActive() {
    return window.ChemLabGuidedLab?.context?.()?.mode === 'guided'
  }

  function syncUndoButton() {
    undoButton.disabled = !undoStack.length
  }

  function rememberForUndo() {
    undoStack.push(createLabSnapshot())
    if (undoStack.length > 20) undoStack.shift()
    syncUndoButton()
  }

  function undoLastAction() {
    if (isGuidedActive()) {
      messageTitle.textContent = 'Không hoàn tác trong thí nghiệm có hướng dẫn'
      message.textContent = 'Các bước đã hoàn thành được tính theo thao tác; hãy dùng “Đặt lại” nếu muốn làm lại.'
      return
    }

    const snapshot = undoStack.pop()
    if (!snapshot) return

    restoreLabSnapshot(snapshot)
    syncUndoButton()
    messageTitle.textContent = 'Đã hoàn tác'
    message.textContent = 'Cốc đã trở về trạng thái trước thao tác gần nhất.'
    addLog('Hoàn tác thao tác gần nhất.')
  }

  function emptyBeaker(
    {
      writeLog =
        true
    } = {}
  ) {

    if (writeLog && totalVolume > 0) {
      rememberForUndo()
    }

    mixture = {}
    additionHistory = []
    additions = []


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

    syncGasBaseline()
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


    heatButton.setAttribute('aria-pressed', String(heating))


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

    undoStack.length = 0
    syncUndoButton()


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


      scheduleAnimationLoop()

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



  const animationStage =
    section.querySelector(
      '.vl-stage'
    )


  const animationView =
    section.closest(
      '.app-view'
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


    if (dragging || tiltCurrent !== 0 || liquidTilt !== 0) {
      scheduleAnimationLoop()
    }

  }



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



  window.ChemLabLab = Object.freeze({

    context() {

      const snapshot =
        createLabSnapshot()


      return {

        mixture:
          snapshot.mixture,

        additionHistory:
          snapshot.additionHistory,

        totalVolume:
          snapshot.totalVolume,

        temperature:
          Math.round(
            Number(snapshot.temperature) * 10
          ) / 10,

        heating:
          snapshot.heating,

        currentColor:
          snapshot.currentColor,

        lastIndicator:
          snapshot.lastIndicator,

        lastLitmusTest:
          snapshot.lastLitmusTest,

        precipitate:
          snapshot.precipitate,

        triggeredReactionIds:
          snapshot.triggeredReactionIds,

        guided:
          window.ChemLabGuidedLab?.context?.() ||
          null

      }

    }

  })


  scheduleAnimationLoop()

}
