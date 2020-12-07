var version = "v1::";
const urlsToCache = ["index.html", "offline.html"];

self.addEventListener("install", function (event) {
  console.log("WORKER: install event in progress.");
  event.waitUntil(
    caches
      .open(version + "fundamentals")
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log("WORKER: install completed");
      })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("WORKER: fetch event in progress.");
  if (event.request.method !== "GET") {
    console.log(
      "WORKER: fetch event ignored.",
      event.request.method,
      event.request.url
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);
      console.log(
        "WORKER: fetch event",
        cached ? "(cached)" : "(network)",
        event.request.url
      );
      return cached || networked;

      function fetchedFromNetwork(response) {
        var cacheCopy = response.clone();

        console.log("WORKER: fetch response from network.", event.request.url);

        caches
          // We open a cache to store the response for this request.
          .open(version + "pages")
          .then(function add(cache) {
            cache.put(event.request, cacheCopy);
          })
          .then(function () {
            console.log(
              "WORKER: fetch response stored in cache.",
              event.request.url
            );
          });
        return response;
      }
      function unableToResolve() {
        console.log("WORKER: fetch request failed in both cache and network.");
        return fetch(event.request).catch(()=> caches.match("offline.html"))
      }
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("WORKER: activate event in progress.");

  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keys
            .filter(function (key) {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        console.log("WORKER: activate completed.");
      })
  );
});
