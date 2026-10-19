


export function initAccessibility() {

  const app =
    document.querySelector(
      '#app-shell'
    )


  const drawer =
    document.querySelector(
      '#element-drawer'
    )


  if (!app) {
    return
  }



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

}