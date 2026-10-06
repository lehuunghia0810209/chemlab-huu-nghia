const STORAGE_KEY =
  'chemlab-v5-user-preferences'


const DEFAULTS = {

  theme:
    'system',

  fontSize:
    'normal',

  density:
    'comfortable',

  reduceMotion:
    false,

  highContrast:
    false

}


function loadPreferences() {

  try {

    const raw =
      localStorage.getItem(
        STORAGE_KEY
      )


    if (!raw) {

      return {
        ...DEFAULTS
      }

    }


    return {

      ...DEFAULTS,

      ...JSON.parse(raw)

    }

  }

  catch {

    return {
      ...DEFAULTS
    }

  }

}


function savePreferences(
  prefs
) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      prefs
    )
  )

}


function resolveTheme(
  theme
) {

  if (
    theme !==
    'system'
  ) {

    return theme

  }


  return window
    .matchMedia(
      '(prefers-color-scheme: light)'
    )
    .matches

    ? 'light'

    : 'dark'

}


function applyPreferences(
  prefs
) {

  const root =
    document.documentElement


  const theme =
    resolveTheme(
      prefs.theme
    )


  root.dataset.theme =
    theme


  root.dataset.themeMode =
    prefs.theme


  root.dataset.fontSize =
    prefs.fontSize


  root.dataset.density =
    prefs.density


  root.dataset.reduceMotion =
    prefs.reduceMotion

      ? 'true'

      : 'false'


  root.dataset.contrast =
    prefs.highContrast

      ? 'high'

      : 'normal'


  document
    .querySelector(
      'meta[name="theme-color"]'
    )
    ?.setAttribute(

      'content',

      theme === 'light'

        ? '#f6f7fb'

        : '#080910'

    )

}


export function applySavedPreferences() {

  applyPreferences(
    loadPreferences()
  )

}


export function initUserPreferences() {

  const topActions =
    document.querySelector(
      '.workspace-top-actions'
    )


  if (
    !topActions
  ) {

    return

  }


  document
    .querySelector(
      '#open-user-settings'
    )
    ?.remove()


  document
    .querySelector(
      '#user-settings-layer'
    )
    ?.remove()


  const trigger =
    document.createElement(
      'button'
    )


  trigger.id =
    'open-user-settings'


  trigger.className =
    'v5-top-button user-settings-trigger'


  trigger.type =
    'button'


  trigger.title =
    'Cài đặt'


  trigger.innerHTML = `
    <span>⚙</span>
  `


  topActions.appendChild(
    trigger
  )


  document.body.insertAdjacentHTML(

    'beforeend',

    `

    <div
      id="user-settings-layer"
      class="user-settings-layer"
      hidden
    >

      <section class="user-settings-panel">

        <header class="user-settings-head">

          <div>

            <span>
              CHEMLAB SETTINGS
            </span>

            <h2>
              Cài đặt
            </h2>

            <p>
              Tùy chỉnh trải nghiệm sử dụng ChemLab.
            </p>

          </div>


          <button
            id="close-user-settings"
            class="user-settings-close"
          >
            ×
          </button>

        </header>


        <div class="user-settings-body">

          <section class="setting-group">

            <div class="setting-copy">

              <strong>
                Giao diện
              </strong>

              <span>
                Chọn chế độ sáng, tối hoặc theo thiết bị.
              </span>

            </div>


            <div
              class="setting-segmented"
              data-setting="theme"
            >

              <button
                data-value="system"
              >
                System
              </button>

              <button
                data-value="dark"
              >
                Dark
              </button>

              <button
                data-value="light"
              >
                Light
              </button>

            </div>

          </section>


          <section class="setting-group">

            <div class="setting-copy">

              <strong>
                Cỡ chữ
              </strong>

              <span>
                Thay đổi kích thước chữ toàn ứng dụng.
              </span>

            </div>


            <div
              class="setting-segmented"
              data-setting="fontSize"
            >

              <button
                data-value="small"
              >
                90%
              </button>

              <button
                data-value="normal"
              >
                100%
              </button>

              <button
                data-value="large"
              >
                112%
              </button>

            </div>

          </section>


          <section class="setting-group">

            <div class="setting-copy">

              <strong>
                Mật độ giao diện
              </strong>

              <span>
                Chọn giao diện rộng hoặc gọn.
              </span>

            </div>


            <div
              class="setting-segmented"
              data-setting="density"
            >

              <button
                data-value="comfortable"
              >
                Comfortable
              </button>

              <button
                data-value="compact"
              >
                Compact
              </button>

            </div>

          </section>


          <label class="setting-toggle">

            <div class="setting-copy">

              <strong>
                Reduce motion
              </strong>

              <span>
                Giảm animation và chuyển động.
              </span>

            </div>


            <input
              type="checkbox"
              data-check="reduceMotion"
            >

            <i></i>

          </label>


          <label class="setting-toggle">

            <div class="setting-copy">

              <strong>
                High contrast
              </strong>

              <span>
                Tăng độ tương phản giao diện.
              </span>

            </div>


            <input
              type="checkbox"
              data-check="highContrast"
            >

            <i></i>

          </label>

        </div>


        <footer class="user-settings-footer">

          <button
            id="reset-user-settings"
            class="settings-reset"
          >
            Đặt lại
          </button>


          <button
            id="done-user-settings"
            class="settings-done"
          >
            Xong
          </button>

        </footer>

      </section>

    </div>

    `

  )


  const layer =
    document.querySelector(
      '#user-settings-layer'
    )


  const prefs =
    loadPreferences()


  function syncUI() {

    layer
      .querySelectorAll(
        '[data-setting]'
      )
      .forEach(
        group => {

          const key =
            group.dataset.setting


          group
            .querySelectorAll(
              'button'
            )
            .forEach(
              button => {

                button.classList.toggle(

                  'active',

                  button.dataset.value ===
                    prefs[key]

                )

              }
            )

        }
      )


    layer
      .querySelectorAll(
        '[data-check]'
      )
      .forEach(
        input => {

          input.checked =
            Boolean(
              prefs[
                input.dataset.check
              ]
            )

        }
      )

  }


  function update() {

    savePreferences(
      prefs
    )


    applyPreferences(
      prefs
    )


    syncUI()

  }


  trigger.addEventListener(
    'click',

    () => {

      layer.hidden =
        false


      requestAnimationFrame(
        () => {

          layer.classList.add(
            'open'
          )

        }
      )

    }
  )


  function close() {

    layer.classList.remove(
      'open'
    )


    setTimeout(
      () => {

        layer.hidden =
          true

      },

      160
    )

  }


  layer
    .querySelector(
      '#close-user-settings'
    )
    .addEventListener(
      'click',
      close
    )


  layer
    .querySelector(
      '#done-user-settings'
    )
    .addEventListener(
      'click',
      close
    )


  layer
    .querySelectorAll(
      '[data-setting] button'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',

          () => {

            const group =
              button.closest(
                '[data-setting]'
              )


            prefs[
              group.dataset.setting
            ] =
              button.dataset.value


            update()

          }
        )

      }
    )


  layer
    .querySelectorAll(
      '[data-check]'
    )
    .forEach(
      input => {

        input.addEventListener(
          'change',

          () => {

            prefs[
              input.dataset.check
            ] =
              input.checked


            update()

          }
        )

      }
    )


  layer
    .querySelector(
      '#reset-user-settings'
    )
    .addEventListener(
      'click',

      () => {

        Object.assign(
          prefs,
          DEFAULTS
        )


        update()

      }
    )


  layer.addEventListener(
    'click',

    event => {

      if (
        event.target ===
        layer
      ) {

        close()

      }

    }
  )


  document.addEventListener(
    'keydown',

    event => {

      if (
        event.key ===
        'Escape'
      ) {

        close()

      }

    }
  )


  syncUI()

}