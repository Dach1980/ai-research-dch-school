const cfg=window.DCH_SUPABASE_CONFIG||{},$=id=>document.getElementById(id);
if(!cfg.url||!cfg.anonKey){$("account-name").textContent="Авторизация не настроена";$("account-status").textContent="Проверьте конфигурацию Supabase."; }
else{
 const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");const sb=createClient(cfg.url,cfg.anonKey,{auth:{autoRefreshToken:true,persistSession:true}});
 const {data:{session},error}=await sb.auth.getSession();
 if(error||!session){$("account-name").textContent="Войдите в аккаунт";$("account-status").textContent="Для просмотра личного кабинета необходимо войти.";const a=document.createElement("a");a.className="button primary";a.href="../auth/index.html";a.textContent="Перейти ко входу";$("account-logout").before(a);}
 else{const u=session.user;const name=u.user_metadata?.display_name||u.user_metadata?.full_name||u.email?.split("@")[0]||"Пользователь";$("account-name").textContent=name;$("account-email").textContent=u.email||"";$("account-status").textContent=u.email_confirmed_at?"Email подтверждён":"Email не подтверждён";$("account-logout").hidden=false;$("account-logout").addEventListener("click",async()=>{const {error}=await sb.auth.signOut();if(error){$("account-status").textContent=error.message;return}location.href="../index.html";});}
}
