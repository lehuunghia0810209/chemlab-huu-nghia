import { elements } from './data/elements.js'
import './seriesWorkspace.css'


/* =========================================================
   CHEMLAB 4.4.4
   LANTHANIDE / ACTINIDE SERIES WORKSPACE
========================================================= */


const SERIES_DATA = {

  lanthanide: {

    name:
      'Dãy Lantan',

    short:
      'La–Lu',

    range:
      '57–71',

    from:
      57,

    to:
      71,

    color:
      '#f472b6',

    description:
      '15 nguyên tố thuộc dãy Lantan, từ Lanthanum đến Lutetium.'

  },


  actinide: {

    name:
      'Dãy Actini',

    short:
      'Ac–Lr',

    range:
      '89–103',

    from:
      89,

    to:
      103,

    color:
      '#f97316',

    description:
      '15 nguyên tố thuộc dãy Actini, từ Actinium đến Lawrencium.'

  }

}


const normalizedElements =
  elements
    .map(
      normalizeElement
    )
    .filter(Boolean)


let lastTrigger =
  null


/* =========================================================
   INIT
========================================================= */

export function initSeriesWorkspace() {

  /*
    Dùng capture = true.

    Như vậy ChemLab xử lý click La–Lu / Ac–Lr
    TRƯỚC event cũ trong periodicWorkspace.js.
  */

  document.addEventListener(
    'click',
    handleGlobalClick,
    true
  )


  document.addEventListener(
    'keydown',
    handleKeyboard,
    true
  )

}


/* =========================================================
   GLOBAL CLICK
========================================================= */

function handleGlobalClick(
  event
) {

  const seriesCard =
    event.target.closest(
      '.series-jump-card'
    )


  if (seriesCard) {

    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    lastTrigger =
      seriesCard


    const series =
      getSeriesFromCard(
        seriesCard
      )


    if (series) {

      openSeriesDrawer(
        series
      )

    }


    return

  }


  const elementButton =
    event.target.closest(
      '[data-series-element-number]'
    )


  if (elementButton) {

    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    const number =
      Number(
        elementButton.dataset
          .seriesElementNumber
      )


    openRealElement(
      number
    )


    return

  }


  const closeButton =
    event.target.closest(
      '[data-series-close]'
    )


  if (closeButton) {

    event.preventDefault()

    event.stopPropagation()

    closeSeriesDrawer()

  }

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleKeyboard(
  event
) {

  const seriesCard =
    event.target.closest(
      '.series-jump-card'
    )


  if (
    seriesCard &&
    (
      event.key ===
        'Enter' ||
      event.key ===
        ' '
    )
  ) {

    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    lastTrigger =
      seriesCard


    const series =
      getSeriesFromCard(
        seriesCard
      )


    if (series) {

      openSeriesDrawer(
        series
      )

    }

  }

}


/* =========================================================
   FIND SERIES
========================================================= */

function getSeriesFromCard(
  card
) {

  const target =
    String(
      card.dataset
        .seriesTarget ||
      ''
    )
      .toLowerCase()


  if (
    target.includes(
      'lanthan'
    )
  ) {

    return SERIES_DATA
      .lanthanide

  }


  if (
    target.includes(
      'actin'
    )
  ) {

    return SERIES_DATA
      .actinide

  }


  const text =
    card.textContent
      .toLowerCase()


  if (
    text.includes(
      'la–lu'
    ) ||
    text.includes(
      'la-lu'
    ) ||
    text.includes(
      '57–71'
    )
  ) {

    return SERIES_DATA
      .lanthanide

  }


  if (
    text.includes(
      'ac–lr'
    ) ||
    text.includes(
      'ac-lr'
    ) ||
    text.includes(
      '89–103'
    )
  ) {

    return SERIES_DATA
      .actinide

  }


  return null

}


/* =========================================================
   OPEN SERIES DRAWER
========================================================= */

function openSeriesDrawer(
  series
) {

  const drawer =
    document.querySelector(
      '#element-drawer'
    )


  if (!drawer) {

    console.error(
      '[ChemLab] Không tìm thấy #element-drawer'
    )

    return

  }


  const seriesElements =
    normalizedElements.filter(
      element =>
        element.number >=
          series.from &&
        element.number <=
          series.to
    )


  drawer.style.setProperty(
    '--series-color',
    series.color
  )


  drawer.style.setProperty(
    '--element-accent',
    series.color
  )


  drawer.innerHTML = `
    <div class="element-drawer-inner series-drawer">

      <!-- ===============================================
           TOP
      ================================================ -->

      <div class="series-drawer-top">

        <div>

          <span class="series-drawer-eyebrow">
            NHÓM NGUYÊN TỐ
          </span>

          <strong>
            ${series.range}
          </strong>

        </div>


        <button
          type="button"
          class="series-drawer-close"
          data-series-close
          aria-label="Đóng"
        >
          ×
        </button>

      </div>


      <!-- ===============================================
           HERO
      ================================================ -->

      <div class="series-drawer-hero">

        <div class="series-drawer-symbol">

          <span>
            ${
              series ===
              SERIES_DATA.lanthanide
                ? '*'
                : '**'
            }
          </span>

          <strong>
            ${series.short}
          </strong>

        </div>


        <div class="series-drawer-heading">

          <span>
            ${series.range}
          </span>

          <h2>
            ${series.name}
          </h2>

          <p>
            ${series.description}
          </p>

        </div>

      </div>


      <!-- ===============================================
           INFO
      ================================================ -->

      <div class="series-summary-grid">

        <div>

          <span>
            SỐ NGUYÊN TỐ
          </span>

          <strong>
            ${seriesElements.length}
          </strong>

        </div>


        <div>

          <span>
            TỪ
          </span>

          <strong>
            ${
              seriesElements[0]
                ?.symbol ||
              '—'
            }
          </strong>

        </div>


        <div>

          <span>
            ĐẾN
          </span>

          <strong>
            ${
              seriesElements[
                seriesElements.length -
                1
              ]?.symbol ||
              '—'
            }
          </strong>

        </div>


        <div>

          <span>
            KHỐI
          </span>

          <strong>
            f
          </strong>

        </div>

      </div>


      <!-- ===============================================
           ELEMENT LIST
      ================================================ -->

      <div class="series-elements-head">

        <div>

          <span>
            DANH SÁCH
          </span>

          <h3>
            Chọn nguyên tố
          </h3>

        </div>


        <small>
          Bấm để xem chi tiết
        </small>

      </div>


      <div class="series-elements-list">

        ${
          seriesElements
            .map(
              (
                element,
                index
              ) =>
                createElementButton(
                  element,
                  index,
                  series.color
                )
            )
            .join('')
        }

      </div>


      <!-- ===============================================
           NOTE
      ================================================ -->

      <div class="series-drawer-note">

        <span>
          💡
        </span>

        <p>
          Bấm vào một nguyên tố để mở đầy đủ
          <strong>
            Tổng quan · Electron · Ion · Đồng vị · 3D · So sánh
          </strong>.
        </p>

      </div>

    </div>
  `


  drawer.classList.add(
    'open'
  )


  drawer.setAttribute(
    'aria-hidden',
    'false'
  )


  showBackdrop()


  requestAnimationFrame(
    () => {

      drawer
        .querySelector(
          '[data-series-close]'
        )
        ?.focus()

    }
  )

}


/* =========================================================
   ELEMENT BUTTON
========================================================= */

function createElementButton(
  element,
  index,
  color
) {

  return `
    <button
      type="button"
      class="series-element-button"
      data-series-element-number="${element.number}"
      style="
        --series-item-delay:
        ${index * 22}ms;

        --series-item-color:
        ${color};
      "
    >

      <span class="series-element-number">
        ${element.number}
      </span>


      <strong class="series-element-symbol">
        ${element.symbol}
      </strong>


      <div class="series-element-name">

        <strong>
          ${element.name}
        </strong>

        <span>
          ${formatMass(
            element.mass
          )}
        </span>

      </div>


      <span
        class="series-element-arrow"
        aria-hidden="true"
      >
        →
      </span>

    </button>
  `

}


/* =========================================================
   OPEN REAL ELEMENT
========================================================= */

function openRealElement(
  number
) {

  /*
    Đây là điểm quan trọng.

    Không tự tạo drawer nguyên tố lần thứ hai.

    ChemLab tìm đúng card nguyên tố thật
    đã được periodicWorkspace tạo ra,
    sau đó gọi click().

    Nhờ vậy toàn bộ hệ thống:
    Tổng quan
    Electron
    Ion
    Đồng vị
    3D
    So sánh

    vẫn sử dụng đúng code hiện tại.
  */

  const realCard =
    document.querySelector(
      `.workspace-element-card[data-number="${number}"]`
    )


  if (!realCard) {

    console.error(
      '[ChemLab] Không tìm thấy nguyên tố:',
      number
    )

    return

  }


  realCard.click()

}


/* =========================================================
   CLOSE
========================================================= */

function closeSeriesDrawer() {

  const drawer =
    document.querySelector(
      '#element-drawer'
    )


  drawer?.classList.remove(
    'open'
  )


  drawer?.setAttribute(
    'aria-hidden',
    'true'
  )


  hideBackdrop()


  requestAnimationFrame(
    () => {

      lastTrigger?.focus()

    }
  )

}


/* =========================================================
   BACKDROP
========================================================= */

function showBackdrop() {

  let backdrop =
    document.querySelector(
      '#element-drawer-backdrop'
    )


  if (!backdrop) {

    backdrop =
      document.createElement(
        'div'
      )


    backdrop.id =
      'element-drawer-backdrop'


    backdrop.className =
      'drawer-backdrop'


    document.body
      .appendChild(
        backdrop
      )

  }


  backdrop.hidden =
    false

}


function hideBackdrop() {

  const backdrop =
    document.querySelector(
      '#element-drawer-backdrop'
    )


  if (backdrop) {

    backdrop.hidden =
      true

  }

}


/* =========================================================
   NORMALIZE
========================================================= */

function normalizeElement(
  raw,
  index
) {

  if (!raw) {
    return null
  }


  /*
    Hỗ trợ data dạng array.
  */

  if (
    Array.isArray(
      raw
    )
  ) {

    return {

      number:
        Number(
          raw[0] ??
          index + 1
        ),

      symbol:
        raw[1],

      name:
        raw[2],

      mass:
        raw[3],

      category:
        raw[4]

    }

  }


  /*
    Hỗ trợ data dạng object.
  */

  return {

    ...raw,

    number:
      Number(
        raw.number ??
        raw.atomicNumber ??
        raw.atomic_number ??
        index + 1
      ),

    symbol:
      raw.symbol,

    name:
      raw.name,

    mass:
      raw.mass ??
      raw.atomicMass ??
      raw.atomic_mass ??
      '—',

    category:
      raw.category

  }

}


/* =========================================================
   MASS
========================================================= */

function formatMass(
  mass
) {

  const match =
    String(
      mass
    )
      .replace(
        ',',
        '.'
      )
      .match(
        /\d+(?:\.\d+)?/
      )


  if (!match) {

    return String(
      mass
    )

  }


  const value =
    Number(
      match[0]
    )


  if (
    !Number.isFinite(
      value
    )
  ) {

    return String(
      mass
    )

  }


  return value
    .toLocaleString(
      'vi-VN',
      {
        maximumFractionDigits:
          4
      }
    )

}