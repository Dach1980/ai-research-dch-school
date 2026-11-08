(() => {
 const db=window.DCH_SUPABASE_CLIENT;if(!db)return;
 const $=id=>document.getElementById(id),owner=window.DCH_ADMIN_ROLE==="owner";
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const say=(id,s)=>{const e=$(id);if(e)e.textContent=s;};
 async function ownerCall(action,extra){
  const r=await db.functions.invoke("school-admin-management",{body:Object.assign({action},extra||{})});
  if(r.error)throw r.error;if(r.data&&r.data.error)throw new Error(r.data.error);return r.data;
 }
 async function loadCatalog(){
  const root=$("admin-content-list");if(!root)return;
  const r=await db.from("lesson_catalog").select("id,title,visibility,is_published,sort_order").order("sort_order");
  if(r.error){root.textContent=r.error.message;return;}
  const aliasPanel=document.createElement("section");
  aliasPanel.className="roadmap-item";
  aliasPanel.innerHTML='<strong>Проверка legacy alias → v3 UID</strong><p>Диагностический режим: только чтение. Результат не меняет lesson_catalog, содержимое или права доступа.</p><div class="admin-alias-controls"><select id="alias-source"><option value="supabase.lesson_catalog">Supabase lesson_id</option><option value="catalog_v2">Catalog v2 legacy_id</option><option value="static_site">URL статической страницы</option></select><select id="alias-kind"><option value="lesson_id">lesson_id</option><option value="legacy_id">legacy_id</option><option value="v2_id">v2_id</option><option value="localized_url">localized_url</option></select><input id="alias-value" type="text" maxlength="512" placeholder="Старый slug / ID / путь" style="max-width:32rem"><select id="alias-locale"><option value="">Без локали</option><option value="ru">RU</option><option value="en">EN</option><option value="zh">中文</option></select><button class="admin-tab" id="alias-resolve" type="button">Найти UID</button></div><pre id="alias-result" aria-live="polite">Результат появится здесь.</pre>';
  root.prepend(aliasPanel);
  const aliasSource=aliasPanel.querySelector("#alias-source");
  const aliasKind=aliasPanel.querySelector("#alias-kind");
  aliasSource.addEventListener("change",()=>{
   const kinds={"supabase.lesson_catalog":["lesson_id"],"catalog_v2":["legacy_id","v2_id"],"static_site":["localized_url"]};
   aliasKind.replaceChildren(...kinds[aliasSource.value].map(value=>{const option=document.createElement("option");option.value=value;option.textContent=value;return option;}));
  });
  aliasPanel.querySelector("#alias-resolve").addEventListener("click",async()=>{
   const output=aliasPanel.querySelector("#alias-result");
   output.textContent="Проверка…";
   const result=await db.functions.invoke("resolve-lesson-alias",{body:{
    source_system:aliasSource.value,alias_kind:aliasKind.value,
    alias_value:aliasPanel.querySelector("#alias-value").value.trim(),
    locale:aliasPanel.querySelector("#alias-locale").value||null
   }});
   if(result.error){output.textContent="Ошибка resolver: "+result.error.message;return;}
   output.textContent=JSON.stringify(result.data,null,2);
  });
  root.innerHTML=(r.data||[]).map(x=>'<article class="roadmap-item"><strong>'+esc(x.id)+'</strong> · '+esc(x.title&&x.title.ru||x.id)+' · '+(x.is_published?"Опубликован":"Черновик")+' · '+esc(x.visibility)+' <button class="admin-tab" data-toggle="'+esc(x.id)+'">'+(x.is_published?"Снять с публикации":"Опубликовать")+'</button><button class="admin-tab" data-payload="'+esc(x.id)+'">JSON-содержимое</button></article>').join("");
  root.querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",async()=>{
   const item=r.data.find(x=>x.id===b.dataset.toggle);
   const u=await db.from("lesson_catalog").update({is_published:!item.is_published,updated_at:new Date().toISOString()}).eq("id",item.id);
   say("content-message",u.error?u.error.message:"Статус сохранён.");if(!u.error)loadCatalog();
  }));
  root.querySelectorAll("[data-payload]").forEach(b=>b.addEventListener("click",async()=>{
   $("payload-lesson-id").value=b.dataset.payload;
   const p=await db.from("lesson_content").select("payload").eq("lesson_id",b.dataset.payload).maybeSingle();
   $("payload-json").value=JSON.stringify(p.data&&p.data.payload||{},null,2);
   say("payload-message",p.error?p.error.message:"JSON загружен.");
  }));
 }
 $("catalog-create")?.addEventListener("click",async()=>{
  const id=$("catalog-id").value.trim(),ru=$("catalog-ru").value.trim(),en=$("catalog-en").value.trim(),zh=$("catalog-zh").value.trim();
  if(!id||!ru||!en||!zh){say("content-message","Заполните ID и названия на трёх языках.");return;}
  const r=await db.from("lesson_catalog").upsert({id,title:{ru,en,zh},visibility:$("catalog-visibility").value,is_published:$("catalog-published").checked,sort_order:Number($("catalog-order").value||100)});
  say("content-message",r.error?r.error.message:"Запись каталога сохранена.");if(!r.error)loadCatalog();
 });
 $("payload-save")?.addEventListener("click",async()=>{
  let payload;try{payload=JSON.parse($("payload-json").value);}catch(e){say("payload-message","Некорректный JSON.");return;}
  const id=$("payload-lesson-id").value.trim();if(!id){say("payload-message","Не выбран lesson_id.");return;}
  const r=await db.from("lesson_content").upsert({lesson_id:id,payload,updated_at:new Date().toISOString()},{onConflict:"lesson_id"});
  say("payload-message",r.error?r.error.message:"JSON-содержимое сохранено.");
 });
 async function loadUsers(){
  const root=$("admin-users-list");if(!root)return;if(!owner){root.textContent="Только владелец может управлять учётными записями.";return;}
  try{
   const r=await ownerCall("list_users");
   root.innerHTML='<table class="admin-table"><thead><tr><th>Email</th><th>Подтверждён</th><th>Последний вход</th><th>Статус</th><th></th></tr></thead><tbody>'+(r.users||[]).map(u=>'<tr><td>'+esc(u.email)+'<br><code>'+esc(u.id)+'</code></td><td>'+(u.email_confirmed_at?"Да":"Нет")+'</td><td>'+esc(u.last_sign_in_at||"—")+'</td><td>'+(u.banned_until?"Приостановлен":"Активен")+'</td><td><button class="admin-tab" data-account="'+esc(u.id)+'" data-active="'+(u.banned_until?"true":"false")+'">'+(u.banned_until?"Активировать":"Приостановить")+'</button></td></tr>').join("")+'</tbody></table>';
   root.querySelectorAll("[data-account]").forEach(b=>b.addEventListener("click",async()=>{try{await ownerCall("set_user_status",{user_id:b.dataset.account,active:b.dataset.active==="true"});say("users-message","Статус изменён.");loadUsers();}catch(e){say("users-message",e.message);}}));
  }catch(e){root.textContent="Ошибка списка пользователей: "+e.message;}
 }
 $("grant-admin")?.addEventListener("click",async()=>{try{await ownerCall("grant_admin",{user_id:$("admin-user-id").value.trim(),role:$("admin-user-role").value});say("permissions-message","Роль выдана.");}catch(e){say("permissions-message",e.message);}});
 $("revoke-admin")?.addEventListener("click",async()=>{try{await ownerCall("revoke_admin",{user_id:$("admin-user-id").value.trim()});say("permissions-message","Роль отозвана.");}catch(e){say("permissions-message",e.message);}});
 $("grant-entitlement")?.addEventListener("click",async()=>{
  if(!owner){say("entitlement-message","Только владелец может выдавать доступ.");return;}
  const uid=$("entitlement-user-id").value.trim(),lesson=$("entitlement-lesson-id").value.trim(),product=$("entitlement-product-id").value.trim();
  if(!uid||(!lesson&&!product)){say("entitlement-message","Нужен user_id и lesson_id или product_id.");return;}
  const r=await db.from("lesson_entitlements").insert({user_id:uid,lesson_id:lesson||null,product_id:product||null,status:$("entitlement-status").value,expires_at:$("entitlement-expiry").value||null});
  say("entitlement-message",r.error?r.error.message:"Доступ сохранён.");
 });
 async function loadEntitlements(){
  const root=$("admin-entitlements-list");if(!root)return;
  const r=await db.from("lesson_entitlements").select("id,user_id,lesson_id,product_id,status,granted_at,expires_at").order("granted_at",{ascending:false}).limit(100);
  if(r.error){root.textContent=r.error.message;return;}
  root.innerHTML='<table class="admin-table"><thead><tr><th>Пользователь</th><th>Урок / продукт</th><th>Статус</th><th>Окончание</th><th></th></tr></thead><tbody>'+(r.data||[]).map(x=>'<tr><td><code>'+esc(x.user_id)+'</code></td><td>'+esc(x.lesson_id||x.product_id)+'</td><td>'+esc(x.status)+'</td><td>'+esc(x.expires_at||"Без срока")+'</td><td>'+(owner&&x.status==="active"?'<button class="admin-tab" data-revoke-entitlement="'+esc(x.id)+'">Отозвать</button>':"—")+'</td></tr>').join("")+'</tbody></table>';
  root.querySelectorAll("[data-revoke-entitlement]").forEach(b=>b.addEventListener("click",async()=>{
   const u=await db.from("lesson_entitlements").update({status:"revoked"}).eq("id",b.dataset.revokeEntitlement);
   say("entitlement-message",u.error?u.error.message:"Разрешение отозвано.");if(!u.error)loadEntitlements();
  }));
 }
 async function loadAudit(){
  const root=$("admin-db-audit");if(!root)return;
  const r=await db.from("school_admin_audit").select("id,actor_user_id,action,entity_type,entity_id,created_at").order("created_at",{ascending:false}).limit(100);
  if(r.error){root.textContent=r.error.message;return;}
  root.innerHTML='<table class="admin-table"><thead><tr><th>Дата</th><th>Действие</th><th>Объект</th><th>Инициатор</th></tr></thead><tbody>'+(r.data||[]).map(x=>'<tr><td>'+esc(x.created_at)+'</td><td>'+esc(x.action)+'</td><td>'+esc(x.entity_type)+' · '+esc(x.entity_id)+'</td><td><code>'+esc(x.actor_user_id||"service")+'</code></td></tr>').join("")+'</tbody></table>';
 }
 $("tab-content")?.addEventListener("click",loadCatalog);$("tab-users")?.addEventListener("click",loadUsers);$("tab-audit")?.addEventListener("click",loadAudit);$("tab-entitlements")?.addEventListener("click",loadEntitlements);
 loadCatalog();loadAudit();loadEntitlements();if(owner)loadUsers();
})();