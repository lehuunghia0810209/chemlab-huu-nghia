/* =========================================================
   CHEMLAB 5.2.1
   PRODUCTION SERVICE WORKER
========================================================= */

const VERSION =
  'chemlab-5.2.1'


const STATIC_CACHE =
  `${VERSION}-static`


const RUNTIME_CACHE =
  `${VERSION}-runtime`


const CORE_FILES = [

  '/',

  '/index.html',

  '/manifest.webmanifest',

  '/favicon.svg'

]


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  'install',
  event => {

    event.waitUntil(

      caches
        .open(
          STATIC_CACHE
        )
        .then(
          cache =>
            cache.addAll(
              CORE_FILES
            )
        )
        .then(
          () =>
            self.skipWaiting()
        )

    )

  }
)


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  'activate',
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys => {

            return Promise.all(

              keys
                .filter(
                  key =>
                    ![
                      STATIC_CACHE,
                      RUNTIME_CACHE
                    ].includes(
                      key
                    )
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            )

          }
        )
        .then(
          () =>
            self.clients.claim()
        )

    )

  }
)


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  'fetch',
  event => {

    const request =
      event.request


    if (
      request.method !==
      'GET'
    ) {

      return

    }


    const url =
      new URL(
        request.url
      )


    /*
      Không cache tài nguyên bên ngoài.
    */

    if (
      url.origin !==
      self.location.origin
    ) {

      return

    }


    /* =====================================================
       PAGE NAVIGATION

       Network first.
       Nếu mất mạng -> dùng cached index.html.
    ===================================================== */

    if (
      request.mode ===
      'navigate'
    ) {

      event.respondWith(

        fetch(
          request
        )
          .then(
            response => {

              const copy =
                response.clone()


              caches
                .open(
                  RUNTIME_CACHE
                )
                .then(
                  cache =>
                    cache.put(
                      request,
                      copy
                    )
                )


              return response

            }
          )
          .catch(
            async () => {

              return (
                await caches.match(
                  request
                )
              ) ||
              (
                await caches.match(
                  '/index.html'
                )
              )

            }
          )

      )


      return

    }


    /* =====================================================
       HASHED VITE ASSETS

       Cache first vì tên file thay đổi khi build mới.
    ===================================================== */

    if (
      url.pathname.startsWith(
        '/assets/'
      )
    ) {

      event.respondWith(

        caches
          .match(
            request
          )
          .then(
            cached => {

              if (
                cached
              ) {

                return cached

              }


              return fetch(
                request
              )
                .then(
                  response => {

                    if (
                      !response ||
                      response.status !==
                        200
                    ) {

                      return response

                    }


                    const copy =
                      response.clone()


                    caches
                      .open(
                        RUNTIME_CACHE
                      )
                      .then(
                        cache =>
                          cache.put(
                            request,
                            copy
                          )
                      )


                    return response

                  }
                )

            }
          )

      )


      return

    }


    /* =====================================================
       OTHER SAME-ORIGIN FILES
    ===================================================== */

    event.respondWith(

      fetch(
        request
      )
        .then(
          response => {

            if (
              response &&
              response.status ===
                200
            ) {

              const copy =
                response.clone()


              caches
                .open(
                  RUNTIME_CACHE
                )
                .then(
                  cache =>
                    cache.put(
                      request,
                      copy
                    )
                )

            }


            return response

          }
        )
        .catch(
          () =>
            caches.match(
              request
            )
        )

    )

  }
)