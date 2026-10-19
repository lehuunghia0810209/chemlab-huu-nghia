
const VERSION =
  'chemlab-6.2.0-evolution-1'


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

    )

  }
)



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

    )

  }
)



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



    if (
      url.origin !==
      self.location.origin
    ) {

      return

    }



    if (
      url.pathname.startsWith(
        '/api/'
      )
    ) {

      return

    }



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
