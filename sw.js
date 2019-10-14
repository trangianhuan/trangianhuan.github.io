const VERSION = 4;
const CACHE_NAME = 'gosuk-v' + VERSION;
const urlsToCache = [
  '/js/jquery-3.4.1.min.js',
  '/js/jquery-ui.min.js',
  '/css/jquery-ui.css',
  '/css/quill.snow.css',
  '/icon/js/icon.js',
  'https://fonts.googleapis.com/css?family=Roboto',
  '/js/firebase-app.js',
  '/js/firebase-firestore.js',
  '/js/firebase-auth.js',
  //'/js/common.js',
  '/js/fuse.js',
];

self.importScripts('/icon/js/icon.js')
// var dataR = [ awesome_icons, chemistry, contact_us, countrys_flags, ecommerce_set, hacker, interface,
//  logistics_delivery, miscellaneous_elements, multimedia_collection, phone_icons, social_media_logos, social_network_logo_collection, vector_editing, vector_editing2, material_design, essential_compilation
//  ]
// dataR.forEach(e => {
//     urlsToCache = urlsToCache.concat(e)
// })

//urlsToCache = urlsToCache.concat(interface)

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log('[ServiceWorker] installed');
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache)
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Now ready to handle fetches!');
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {

        if (thisCacheName.includes("gosuk") && thisCacheName !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing cached files from old cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }

      }));
    }) // end caches.keys()
  ); // end e.waitUntil
});

function isImage(fetchRequest) {
    return fetchRequest.method === "GET"
           && fetchRequest.destination === "image";
}

self.addEventListener('fetch', function(event) {
  event.respondWith(
    //caches.open(CACHE_NAME).then(function(cache) {
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          return fetch(event.request).then(function(response) {
            if(isImage(event.request)){
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, response);
              });
            }
            return response.clone();
          });
        })
    //})
  );
});
