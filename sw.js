/* Service worker cho Justaseed: nhận Web Push và hiện thông báo */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}}
  e.waitUntil((async()=>{
    const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    if(cl.some(c=>c.visibilityState==='visible'))return; /* đang mở game thì không cần báo */
    await self.registration.showNotification(d.title||'Justaseed',{
      body:d.body||'',tag:d.tag||'justaseed',icon:d.icon||'icon-192.png',
      data:{url:d.url||self.registration.scope}
    });
  })());
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil((async()=>{
    const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of cl){if('focus' in c)return c.focus()}
    return self.clients.openWindow(url);
  })());
});
