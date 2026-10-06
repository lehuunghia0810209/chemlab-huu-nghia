import {
  initSeriesWorkspace
} from './seriesWorkspace.js'


/* =========================================================
   CHEMLAB 4.4.4
   ACCESSIBILITY
========================================================= */

export function initAccessibility() {

  const app =
    document.querySelector(
      '.workspace-app'
    )


  const drawer =
    document.querySelector(
      '#element-drawer'
    )


  if (!app) {
    return
  }


  /* =====================================================
     SERIES WORKSPACE

     Quan trọng:
     La–Lu / Ac–Lr giờ mở drawer,
     KHÔNG còn cuộn xuống.
  ===================================================== */

  initSeriesWorkspace()


  /* =====================================================
     BASIC LABELS
  ===================================================== */

  setLabel(
    '#balance-reactants',
    'Các chất phản ứng'
  )


  setLabel(
    '#balance-products',
    'Các sản phẩm'
  )


  setLabel(
    '#cc-volume-unit',
    'Đơn vị thể tích dung dịch'
  )


  /* =====================================================
     ALERT
  ===================================================== */

  document
    .querySelectorAll(
      '.cc-error, #balance-error'
    )
    .forEach(
      node => {

        node.setAttribute(
          'role',
          'alert'
        )

      }
    )


  /* =====================================================
     LIVE REGIONS
  ===================================================== */

  document
    .querySelectorAll(
      [
        '#balance-result',
        '#sol-result-card',
        '#learning-feedback',
        '#observation-title'
      ].join(',')
    )
    .forEach(
      node => {

        node.setAttribute(
          'aria-live',
          'polite'
        )


        node.setAttribute(
          'aria-atomic',
          'true'
        )

      }
    )


  bindCalculatorTabs()

  bindPressedStates()

  bindElementDrawer()

  bind3DDialogs()


  /* =====================================================
     HELPER
  ===================================================== */

  function setLabel(
    selector,
    text
  ) {

    document
      .querySelector(
        selector
      )
      ?.setAttribute(
        'aria-label',
        text
      )

  }


  /* =====================================================
     CALCULATOR TABS
  ===================================================== */

  function bindCalculatorTabs() {

    const container =
      document.querySelector(
        '.cc-tabs'
      )


    if (
      !container ||
      container.dataset
        .a11yReady
    ) {
      return
    }


    container.dataset
      .a11yReady =
      'true'


    container.setAttribute(
      'role',
      'tablist'
    )


    container.setAttribute(
      'aria-label',
      'Máy tính hóa học'
    )


    const getButtons =
      () =>
        [
          ...container
            .querySelectorAll(
              '[data-calc-tab]'
            )
        ]


    const sync =
      () => {

        getButtons()
          .forEach(
            button => {

              const active =
                button.classList
                  .contains(
                    'active'
                  )


              button.setAttribute(
                'role',
                'tab'
              )


              button.setAttribute(
                'aria-selected',
                String(
                  active
                )
              )


              button.tabIndex =
                active
                  ? 0
                  : -1

            }
          )

      }


    sync()


    new MutationObserver(
      sync
    )
      .observe(
        container,
        {

          subtree:
            true,

          attributes:
            true,

          attributeFilter: [
            'class'
          ]

        }
      )


    container.addEventListener(
      'keydown',
      event => {

        const buttons =
          getButtons()


        const index =
          buttons.indexOf(
            event.target
          )


        if (
          index <
          0
        ) {
          return
        }


        if (
          ![
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End'
          ].includes(
            event.key
          )
        ) {
          return
        }


        event.preventDefault()


        let next =
          index


        if (
          event.key ===
          'Home'
        ) {

          next = 0

        }


        if (
          event.key ===
          'End'
        ) {

          next =
            buttons.length -
            1

        }


        if (
          event.key ===
          'ArrowLeft'
        ) {

          next =
            (
              index -
              1 +
              buttons.length
            ) %
            buttons.length

        }


        if (
          event.key ===
          'ArrowRight'
        ) {

          next =
            (
              index +
              1
            ) %
            buttons.length

        }


        buttons[
          next
        ]?.click()


        buttons[
          next
        ]?.focus()

      }
    )

  }


  /* =====================================================
     PRESSED STATES
  ===================================================== */

  function bindPressedStates() {

    const selector =
      [

        '.category-filter',

        '.periodic-segmented button',

        '.learning-mode',

        '.difficulty-button',

        '.reagent-card',

        '[data-volume]',

        '#heat-button'

      ].join(',')


    const sync =
      () => {

        app
          .querySelectorAll(
            selector
          )
          .forEach(
            button => {

              button.setAttribute(
                'aria-pressed',

                String(
                  button.classList
                    .contains(
                      'active'
                    )
                )
              )

            }
          )

      }


    sync()


    new MutationObserver(
      sync
    )
      .observe(
        app,
        {

          subtree:
            true,

          attributes:
            true,

          attributeFilter: [
            'class'
          ]

        }
      )

  }


  /* =====================================================
     ELEMENT DRAWER
  ===================================================== */

  function bindElementDrawer() {

    if (!drawer) {
      return
    }


    let wasOpen =
      false


    let trigger =
      null


    const sync =
      () => {

        const open =
          drawer.classList
            .contains(
              'open'
            )


        drawer.setAttribute(
          'role',
          'dialog'
        )


        drawer.setAttribute(
          'aria-modal',
          'true'
        )


        drawer.setAttribute(
          'aria-label',
          'Thông tin hóa học'
        )


        drawer.setAttribute(
          'aria-hidden',
          String(
            !open
          )
        )


        const tabs =
          drawer.querySelector(
            '.ew-tabs'
          )


        if (tabs) {

          tabs.setAttribute(
            'role',
            'tablist'
          )


          tabs
            .querySelectorAll(
              '[data-ew-tab]'
            )
            .forEach(
              button => {

                const active =
                  button.classList
                    .contains(
                      'active'
                    )


                button.setAttribute(
                  'role',
                  'tab'
                )


                button.setAttribute(
                  'aria-selected',
                  String(
                    active
                  )
                )


                button.tabIndex =
                  active
                    ? 0
                    : -1

              }
            )

        }


        if (
          open &&
          !wasOpen
        ) {

          trigger =
            document.activeElement

        }


        if (
          !open &&
          wasOpen &&
          trigger?.isConnected
        ) {

          requestAnimationFrame(
            () => {

              trigger.focus()

            }
          )

        }


        wasOpen =
          open

      }


    sync()


    new MutationObserver(
      sync
    )
      .observe(
        drawer,
        {

          childList:
            true,

          subtree:
            true,

          attributes:
            true,

          attributeFilter: [
            'class'
          ]

        }
      )


    drawer.addEventListener(
      'keydown',
      event => {

        const tabs =
          [
            ...drawer
              .querySelectorAll(
                '[data-ew-tab]'
              )
          ]


        const index =
          tabs.indexOf(
            event.target
          )


        if (
          index >= 0 &&
          [
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End'
          ].includes(
            event.key
          )
        ) {

          event.preventDefault()


          let next =
            index


          if (
            event.key ===
            'Home'
          ) {

            next = 0

          }


          if (
            event.key ===
            'End'
          ) {

            next =
              tabs.length -
              1

          }


          if (
            event.key ===
            'ArrowLeft'
          ) {

            next =
              (
                index -
                1 +
                tabs.length
              ) %
              tabs.length

          }


          if (
            event.key ===
            'ArrowRight'
          ) {

            next =
              (
                index +
                1
              ) %
              tabs.length

          }


          tabs[
            next
          ]?.click()


          tabs[
            next
          ]?.focus()


          return

        }


        if (
          event.key ===
          'Tab' &&
          drawer.classList
            .contains(
              'open'
            )
        ) {

          trapFocus(
            event,
            drawer
          )

        }

      }
    )

  }


  /* =====================================================
     3D
  ===================================================== */

  function bind3DDialogs() {

    let activeDialog =
      null


    let trigger =
      null


    const sync =
      () => {

        const next =
          document.querySelector(
            '.atom-modal, .orbital-modal'
          )


        if (
          next ===
          activeDialog
        ) {
          return
        }


        if (next) {

          trigger =
            document.activeElement


          next.setAttribute(
            'role',
            'dialog'
          )


          next.setAttribute(
            'aria-modal',
            'true'
          )


          next.setAttribute(
            'aria-label',

            next.classList
              .contains(
                'atom-modal'
              )

              ? 'Mô hình nguyên tử 3D'

              : 'Mô hình orbital 3D'
          )


          requestAnimationFrame(
            () => {

              next
                .querySelector(
                  '.atom-close, .orbital-close'
                )
                ?.focus()

            }
          )

        }

        else if (
          trigger?.isConnected
        ) {

          requestAnimationFrame(
            () => {

              trigger.focus()

            }
          )

        }


        activeDialog =
          next

      }


    new MutationObserver(
      sync
    )
      .observe(
        document.body,
        {

          childList:
            true,

          subtree:
            true

        }
      )


    document.addEventListener(
      'keydown',
      event => {

        const dialog =
          document.querySelector(
            '.atom-modal, .orbital-modal'
          )


        if (!dialog) {
          return
        }


        if (
          event.key ===
          'Tab'
        ) {

          trapFocus(
            event,
            dialog
          )

        }

      },
      true
    )

  }


  /* =====================================================
     FOCUS TRAP
  ===================================================== */

  function trapFocus(
    event,
    root
  ) {

    const nodes =
      [
        ...root.querySelectorAll(
          [

            'button:not(:disabled)',

            'a[href]',

            'input:not(:disabled)',

            'select:not(:disabled)',

            'textarea:not(:disabled)',

            '[tabindex]:not([tabindex="-1"])'

          ].join(',')
        )
      ]
        .filter(
          node =>
            node.getClientRects()
              .length
        )


    if (
      !nodes.length
    ) {
      return
    }


    const first =
      nodes[0]


    const last =
      nodes[
        nodes.length -
        1
      ]


    if (
      event.shiftKey &&
      document.activeElement ===
      first
    ) {

      event.preventDefault()

      last.focus()

      return

    }


    if (
      !event.shiftKey &&
      document.activeElement ===
      last
    ) {

      event.preventDefault()

      first.focus()

    }

  }

}