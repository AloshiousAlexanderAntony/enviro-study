const CACHE='enviro-study-v4';
const FILES=['./','index.html','sync.js','firebase-config.js','board.html','gate.html','tracker.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin&&!['fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com'].includes(u.host))return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
      return r;
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html')))
  );
});
