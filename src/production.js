import './production.css'


/* =========================================================
   CHEMLAB
   PRODUCTION RELEASE
========================================================= */

const PRODUCT = Object.freeze({

  name:
    'ChemLab',

  edition:
    'Huu Nghia Edition',

  version:
    '5.2.0',

  author:
    'Huu Nghia',

  release:
    'Production',

  description:
    'Interactive Chemistry Workspace'

})


let installPrompt =
  null


let productPanel =
  null


let errorCooldown =
  false


/* =========================================================
   START
========================================================= */

initProduction()


function initProduction() {

  /* -----------------------------------------------
     PRODUCT IDENTITY
  ----------------------------------------------- */

  document.title =
    `${PRODUCT.name} 5.2 | ${PRODUCT.author}`


  document.documentElement
    .setAttribute(
      'data-chemlab-version',
      PRODUCT.version
    )


  document.documentElement
    .setAttribute(
      'data-chemlab-edition',
      'huu-nghia'
    )


  /* -----------------------------------------------
     GLOBAL PRODUCT API
  ----------------------------------------------- */

  window.ChemLabProduct = {

    ...PRODUCT,

    get online() {

      return navigator.onLine

    },

    openAbout,

    openMenu,

    closeMenu,

    install:
      installApplication

  }


  /* -----------------------------------------------
     UI
  ----------------------------------------------- */

  createProductLauncher()

  setupNetworkStatus()

  setupInstallPrompt()

  setupKeyboard()

  setupErrorRecovery()

  setupServiceWorker()

  finishBoot()

}


/* =========================================================
   BOOT
========================================================= */

function finishBoot() {

  const boot =
    document.querySelector(
      '#chemlab-production-boot'
    )


  if (!boot) {
    return
  }


  /*
    Không giữ splash quá lâu.
    Chỉ tạo cảm giác sản phẩm hoàn chỉnh.
  */

  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          setTimeout(
            () => {

              boot.classList
                .add(
                  'is-done'
                )


              setTimeout(
                () =>
                  boot.remove(),
                450
              )

            },
            350
          )

        }
      )

    }
  )

}


/* =========================================================
   PRODUCT LAUNCHER
========================================================= */

function createProductLauncher() {

  document
    .querySelector(
      '.clprod-launcher'
    )
    ?.remove()


  const launcher =
    document.createElement(
      'div'
    )


  launcher.className =
    'clprod-launcher'


  launcher.innerHTML = `
    <button
      type="button"
      class="clprod-launch-button"
      aria-label="ChemLab — thông tin sản phẩm"
      aria-expanded="false"
      data-product-toggle
    >

      <span>
        HN
      </span>

      <i
        data-network-dot
        aria-hidden="true"
      ></i>

    </button>


    <section
      class="clprod-menu"
      data-product-menu
      hidden
    >

      <header>

        <div class="clprod-menu-logo">
          ⚗
        </div>


        <div>

          <span>
            PERSONAL EDITION
          </span>

          <strong>
            ChemLab
          </strong>

          <small>
            by Hữu Nghĩa
          </small>

        </div>

      </header>


      <div class="clprod-version">

        <div>

          <span>
            VERSION
          </span>

          <strong>
            ${PRODUCT.version}
          </strong>

        </div>


        <div>

          <span>
            STATUS
          </span>

          <strong data-product-network>
            Online
          </strong>

        </div>

      </div>


      <div class="clprod-menu-actions">

        <button
          type="button"
          data-product-about
        >

          <span>
            ◇
          </span>

          <div>

            <strong>
              Giới thiệu
            </strong>

            <small>
              Thông tin về ChemLab
            </small>

          </div>

          <b>
            →
          </b>

        </button>


        <button
          type="button"
          data-product-install
          hidden
        >

          <span>
            ↓
          </span>

          <div>

            <strong>
              Cài ChemLab
            </strong>

            <small>
              Sử dụng như một ứng dụng
            </small>

          </div>

          <b>
            →
          </b>

        </button>


        <button
          type="button"
          data-product-reload
        >

          <span>
            ↻
          </span>

          <div>

            <strong>
              Làm mới ChemLab
            </strong>

            <small>
              Tải lại workspace
            </small>

          </div>

          <b>
            →
          </b>

        </button>

      </div>


      <footer>

        <span
          class="clprod-status-dot"
          data-network-footer
        ></span>

        <p data-network-message>
          ChemLab đã sẵn sàng.
        </p>

      </footer>

    </section>
  `


  document.body
    .appendChild(
      launcher
    )


  productPanel =
    launcher


  launcher
    .querySelector(
      '[data-product-toggle]'
    )
    .addEventListener(
      'click',
      toggleMenu
    )


  launcher
    .querySelector(
      '[data-product-about]'
    )
    .addEventListener(
      'click',
      () => {

        closeMenu()

        openAbout()

      }
    )


  launcher
    .querySelector(
      '[data-product-reload]'
    )
    .addEventListener(
      'click',
      () => {

        window.location.reload()

      }
    )


  launcher
    .querySelector(
      '[data-product-install]'
    )
    .addEventListener(
      'click',
      installApplication
    )


  document.addEventListener(
    'pointerdown',
    event => {

      if (
        !productPanel ||
        productPanel.contains(
          event.target
        )
      ) {
        return
      }


      closeMenu()

    }
  )

}


/* =========================================================
   MENU
========================================================= */

function toggleMenu() {

  const menu =
    productPanel
      ?.querySelector(
        '[data-product-menu]'
      )


  if (!menu) {
    return
  }


  if (
    menu.hidden
  ) {

    openMenu()

  }

  else {

    closeMenu()

  }

}


function openMenu() {

  const menu =
    productPanel
      ?.querySelector(
        '[data-product-menu]'
      )


  const button =
    productPanel
      ?.querySelector(
        '[data-product-toggle]'
      )


  if (
    !menu ||
    !button
  ) {
    return
  }


  menu.hidden =
    false


  button.setAttribute(
    'aria-expanded',
    'true'
  )


  requestAnimationFrame(
    () => {

      menu.classList
        .add(
          'open'
        )

    }
  )

}


function closeMenu() {

  const menu =
    productPanel
      ?.querySelector(
        '[data-product-menu]'
      )


  const button =
    productPanel
      ?.querySelector(
        '[data-product-toggle]'
      )


  if (
    !menu ||
    !button ||
    menu.hidden
  ) {
    return
  }


  menu.classList
    .remove(
      'open'
    )


  button.setAttribute(
    'aria-expanded',
    'false'
  )


  setTimeout(
    () => {

      if (
        !menu.classList.contains(
          'open'
        )
      ) {

        menu.hidden =
          true

      }

    },
    170
  )

}


/* =========================================================
   ABOUT
========================================================= */

function openAbout() {

  document
    .querySelector(
      '.clprod-about-overlay'
    )
    ?.remove()


  const overlay =
    document.createElement(
      'div'
    )


  overlay.className =
    'clprod-about-overlay'


  overlay.innerHTML = `
    <section
      class="clprod-about"
      role="dialog"
      aria-modal="true"
      aria-label="Giới thiệu ChemLab"
    >

      <button
        type="button"
        class="clprod-about-close"
        data-about-close
        aria-label="Đóng"
      >
        ×
      </button>


      <div class="clprod-about-hero">

        <div class="clprod-about-logo">
          ⚗
        </div>


        <span>
          INTERACTIVE CHEMISTRY WORKSPACE
        </span>


        <h2>
          ChemLab
        </h2>


        <strong>
          Hữu Nghĩa Edition
        </strong>


        <p>
          Một workspace học hóa học tương tác
          kết hợp dữ liệu nguyên tố,
          công cụ tính toán,
          trực quan hóa và mô phỏng.
        </p>


        <div class="clprod-about-version">

          <span>
            VERSION ${PRODUCT.version}
          </span>

          <i></i>

          <span>
            PRODUCTION
          </span>

        </div>

      </div>


      <div class="clprod-about-features">

        ${aboutFeature(
          '118',
          'Nguyên tố',
          'Periodic Explorer'
        )}

        ${aboutFeature(
          '3D',
          'Atom & Orbital',
          'Trực quan hóa'
        )}

        ${aboutFeature(
          '⇌',
          'Reaction Studio',
          'Cân bằng phản ứng'
        )}

        ${aboutFeature(
          '◇',
          'Compound Studio',
          'Phân tích hợp chất'
        )}

        ${aboutFeature(
          '±',
          'Ion Engine',
          'Ghép ion'
        )}

        ${aboutFeature(
          '⌁',
          'Virtual Lab',
          'Mô phỏng phản ứng'
        )}

      </div>


      <div class="clprod-about-author">

        <span>
          DESIGNED & DEVELOPED BY
        </span>

        <strong>
          Hữu Nghĩa
        </strong>

        <p>
          ChemLab được xây dựng như một dự án
          học tập và khám phá hóa học,
          tập trung vào trải nghiệm trực quan,
          dễ sử dụng và khả năng liên kết
          giữa các công cụ.
        </p>

      </div>


      <footer>

        <span>
          © ${new Date().getFullYear()}
          Hữu Nghĩa
        </span>

        <span>
          ChemLab ${PRODUCT.version}
        </span>

      </footer>

    </section>
  `


  document.body
    .appendChild(
      overlay
    )


  requestAnimationFrame(
    () => {

      overlay.classList
        .add(
          'open'
        )

    }
  )


  function close() {

    overlay.classList
      .remove(
        'open'
      )


    setTimeout(
      () =>
        overlay.remove(),
      220
    )

  }


  overlay
    .querySelector(
      '[data-about-close]'
    )
    .addEventListener(
      'click',
      close
    )


  overlay.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        overlay
      ) {

        close()

      }

    }
  )


  const onKey =
    event => {

      if (
        event.key ===
        'Escape'
      ) {

        document.removeEventListener(
          'keydown',
          onKey
        )


        close()

      }

    }


  document.addEventListener(
    'keydown',
    onKey
  )

}


/* =========================================================
   ABOUT FEATURE
========================================================= */

function aboutFeature(
  icon,
  title,
  subtitle
) {

  return `
    <article>

      <strong>
        ${icon}
      </strong>

      <div>

        <span>
          ${title}
        </span>

        <small>
          ${subtitle}
        </small>

      </div>

    </article>
  `

}


/* =========================================================
   NETWORK
========================================================= */

function setupNetworkStatus() {

  updateNetworkStatus()


  window.addEventListener(
    'online',
    () => {

      updateNetworkStatus()

      showProductToast(
        'Đã kết nối lại Internet.',
        'success'
      )

    }
  )


  window.addEventListener(
    'offline',
    () => {

      updateNetworkStatus()

      showProductToast(
        'Bạn đang offline. Một số nội dung đã tải vẫn có thể sử dụng.',
        'warning'
      )

    }
  )

}


function updateNetworkStatus() {

  const online =
    navigator.onLine


  productPanel
    ?.querySelectorAll(
      '[data-network-dot], [data-network-footer]'
    )
    .forEach(
      dot => {

        dot.classList.toggle(
          'offline',
          !online
        )

      }
    )


  const status =
    productPanel
      ?.querySelector(
        '[data-product-network]'
      )


  if (
    status
  ) {

    status.textContent =
      online
        ? 'Online'
        : 'Offline'

  }


  const message =
    productPanel
      ?.querySelector(
        '[data-network-message]'
      )


  if (
    message
  ) {

    message.textContent =
      online
        ? 'ChemLab đã sẵn sàng.'
        : 'Đang hoạt động offline.'

  }

}


/* =========================================================
   PWA INSTALL
========================================================= */

function setupInstallPrompt() {

  window.addEventListener(
    'beforeinstallprompt',
    event => {

      event.preventDefault()


      installPrompt =
        event


      updateInstallButton()

    }
  )


  window.addEventListener(
    'appinstalled',
    () => {

      installPrompt =
        null


      updateInstallButton()


      showProductToast(
        'ChemLab đã được cài đặt.',
        'success'
      )

    }
  )

}


function updateInstallButton() {

  const button =
    productPanel
      ?.querySelector(
        '[data-product-install]'
      )


  if (!button) {
    return
  }


  button.hidden =
    !installPrompt

}


/* =========================================================
   INSTALL
========================================================= */

async function installApplication() {

  if (
    !installPrompt
  ) {

    showProductToast(
      'Trình duyệt chưa cung cấp tùy chọn cài đặt.',
      'info'
    )


    return

  }


  try {

    installPrompt.prompt()


    await installPrompt
      .userChoice

  }

  catch (
    error
  ) {

    console.warn(
      '[ChemLab] Install prompt:',
      error
    )

  }


  installPrompt =
    null


  updateInstallButton()

}


/* =========================================================
   SERVICE WORKER
========================================================= */

function setupServiceWorker() {

  if (
    !(
      'serviceWorker'
      in navigator
    )
  ) {

    return

  }


  /*
    Không bật Service Worker ở npm run dev.

    Điều này rất quan trọng:
    tránh cache localhost và gây ra
    các lỗi "sửa code nhưng trình duyệt
    vẫn chạy code cũ".
  */

  if (
    !import.meta.env.PROD
  ) {

    cleanupDevelopmentWorkers()

    return

  }


  window.addEventListener(
    'load',
    async () => {

      try {

        const registration =
          await navigator
            .serviceWorker
            .register(
              '/sw.js',
              {
                scope:
                  '/'
              }
            )


        console.info(
          '[ChemLab] Offline support ready:',
          registration.scope
        )

      }

      catch (
        error
      ) {

        console.warn(
          '[ChemLab] Service Worker:',
          error
        )

      }

    }
  )

}


/* =========================================================
   DEV SERVICE WORKER CLEANUP
========================================================= */

async function cleanupDevelopmentWorkers() {

  try {

    const registrations =
      await navigator
        .serviceWorker
        .getRegistrations()


    for (
      const registration
      of registrations
    ) {

      const url =
        registration
          .active
          ?.scriptURL ||
        registration
          .waiting
          ?.scriptURL ||
        ''


      if (
        url.includes(
          location.host
        )
      ) {

        await registration
          .unregister()

      }

    }

  }

  catch {

    /* ignore */

  }

}


/* =========================================================
   KEYBOARD
========================================================= */

function setupKeyboard() {

  document.addEventListener(
    'keydown',
    event => {

      /*
        Alt + I
        Product information
      */

      if (
        event.altKey &&
        event.key
          .toLowerCase() ===
          'i'
      ) {

        event.preventDefault()

        toggleMenu()

      }

    }
  )

}


/* =========================================================
   ERROR RECOVERY
========================================================= */

function setupErrorRecovery() {

  window.addEventListener(
    'error',
    event => {

      handleProductionError(
        event.error ||
        event.message
      )

    }
  )


  window.addEventListener(
    'unhandledrejection',
    event => {

      handleProductionError(
        event.reason
      )

    }
  )

}


function handleProductionError(
  error
) {

  console.error(
    '[ChemLab Production]',
    error
  )


  /*
    Trong dev đã có Console của Vite.
    Không cần làm phiền người dùng.
  */

  if (
    !import.meta.env.PROD
  ) {

    return

  }


  /*
    Không spam toast nếu một module
    phát sinh nhiều lỗi liên tiếp.
  */

  if (
    errorCooldown
  ) {

    return

  }


  errorCooldown =
    true


  showProductToast(
    'Một phần của ChemLab vừa gặp lỗi. Các chức năng khác vẫn có thể tiếp tục sử dụng.',
    'warning'
  )


  setTimeout(
    () => {

      errorCooldown =
        false

    },
    12000
  )

}


/* =========================================================
   TOAST
========================================================= */

function showProductToast(
  message,
  type = 'info'
) {

  document
    .querySelector(
      '.clprod-toast'
    )
    ?.remove()


  const toast =
    document.createElement(
      'div'
    )


  toast.className =
    `clprod-toast ${type}`


  toast.innerHTML = `
    <span>
      ${
        type ===
          'success'
          ? '✓'
          : type ===
            'warning'
            ? '!'
            : 'i'
      }
    </span>


    <p>
      ${escapeHTML(
        message
      )}
    </p>
  `


  document.body
    .appendChild(
      toast
    )


  requestAnimationFrame(
    () => {

      toast.classList
        .add(
          'show'
        )

    }
  )


  setTimeout(
    () => {

      toast.classList
        .remove(
          'show'
        )


      setTimeout(
        () =>
          toast.remove(),
        230
      )

    },
    3000
  )

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ||
    ''
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