const CACHE="edencover-layout-v9-fin-a-deux";
const FILES=["./", "./index.html", "./style.css", "./app.js", "./app.js?v=9", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./assets/edencover-bg.png", "./assets/edencover-logo-yellow.png", "./assets/grain.png", "./assets/stickers/chicken.png", "./assets/stickers/cookie.png", "./assets/stickers/disco.png", "./assets/stickers/gift.png", "./assets/stickers/joint.png", "./assets/stickers/lighter.png", "./assets/stickers/lip.png", "./assets/stickers/logo.png", "./assets/stickers/martini.png", "./assets/stickers/mic.png", "./assets/stickers/party.png", "./assets/stickers/sunglasses.png"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request).then(response=>response||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response})));
});
