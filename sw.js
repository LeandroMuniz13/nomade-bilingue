const V="nomade-v103";
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(["./","index.html","manifest.webmanifest"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x.startsWith("nomade-v")).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"||u.hostname==="upload.wikimedia.org"){e.respondWith(caches.open("nomade-fonts").then(c=>c.match(r).then(hit=>{if(hit&&hit.type==="opaque"&&r.mode==="cors")hit=undefined;const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res}).catch(()=>hit);if(hit){e.waitUntil(net.catch(()=>0));return hit}return net})));return}
 if(u.origin!==location.origin)return;
 const nav=r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html");
 if(nav){e.respondWith(fetch(new Request(r.url,{cache:"no-cache",credentials:"same-origin"})).then(res=>{if(!res.ok)throw 0;const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreVary:true}).then(h=>h||caches.match("index.html"))));return}
 e.respondWith(caches.match(r,{ignoreVary:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
