import './ionEngineReset.css'

export function initIonEngineReset() {
  const engine =
    document.querySelector('#ion-engine')

  if (!engine) return

  const header =
    engine.querySelector(
      '.compound-builder-head'
    )

  if (
    !header ||
    header.querySelector(
      '#ion-reset-builder'
    )
  ) {
    return
  }

  header.classList.add(
    'compound-builder-head-reset'
  )

  const button =
    document.createElement('button')

  button.id =
    'ion-reset-builder'

  button.className =
    'ion-reset-builder'

  button.type =
    'button'

  button.innerHTML = `
    <span aria-hidden="true">↻</span>
    Đặt lại
  `

  button.setAttribute(
    'aria-label',
    'Đặt lại cặp ion về Natri và Chloride'
  )

  header.appendChild(button)

  button.addEventListener(
    'click',
    () => resetIonBuilder(button)
  )
}

function resetIonBuilder(button) {
  const engine =
    document.querySelector('#ion-engine')

  if (!engine) return

  button.disabled = true
  button.classList.add('loading')

  /* Xóa tìm kiếm */

  const search =
    engine.querySelector('#ion-search')

  if (search) {
    search.value = ''

    search.dispatchEvent(
      new Event(
        'input',
        { bubbles: true }
      )
    )
  }

  /* Chuyển về Tất cả */

  const allFilter =
    engine.querySelector(
      '[data-ion-filter="all"]'
    )

  allFilter?.click()

  requestAnimationFrame(() => {
    /* Chọn Na+ */

    engine
      .querySelector(
        '[data-ion-id="na"]'
      )
      ?.click()

    requestAnimationFrame(() => {
      /* Chọn Cl- */

      engine
        .querySelector(
          '[data-ion-id="cl"]'
        )
        ?.click()

      button.classList.remove(
        'loading'
      )

      button.disabled = false

      showResetFeedback()
    })
  })
}

function showResetFeedback() {
  let toast =
    document.querySelector(
      '#ion-reset-toast'
    )

  if (!toast) {
    toast =
      document.createElement('div')

    toast.id =
      'ion-reset-toast'

    toast.className =
      'ion-reset-toast'

    toast.setAttribute(
      'role',
      'status'
    )

    document.body.appendChild(toast)
  }

  toast.textContent =
    'Đã đặt lại: Na⁺ + Cl⁻'

  toast.classList.remove('show')

  void toast.offsetWidth

  toast.classList.add('show')

  clearTimeout(
    toast._timer
  )

  toast._timer =
    setTimeout(() => {
      toast.classList.remove('show')
    }, 1800)
}