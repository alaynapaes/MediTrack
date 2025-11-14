self.addEventListener("install", () => {
    console.log("Service Worker Installed");
});

self.addEventListener("fetch", (event) => {
    // For now, no caching, just log
    console.log("Fetch intercepted for:", event.request.url);
});