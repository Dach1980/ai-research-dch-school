const cfg=window.DCH_SUPABASE_CONFIG||{};
if(cfg.url&&cfg.anonKey){
 const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");
 const sb=createClient(cfg.url,cfg.anonKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
 const accountUrl=new URL("../account/index.html",import.meta.url).href;
 const signInUrl=new URL("../auth/index.html",import.meta.url).href;
 const header=document.querySelector(".site-header,.reader-header,.auth-header");
 const slot=header?.querySelector(".nav,.reader-tools,.auth-header-tools")||header;
 if(slot){
  const wrap=document.createElement("div");wrap.className="account-nav";
  const link=document.createElement("a");link.className="account-nav-link";link.href=accountUrl;link.textContent="Личный кабинет";
  const signIn=document.createElement("a");signIn.className="account-nav-link";signIn.href=signInUrl;signIn.textContent="Войти";
  const render=async(session)=>{
   wrap.replaceChildren();
   if(session?.user){
    const name=session.user.user_metadata?.display_name||session.user.user_metadata?.full_name||session.user.email?.split("@")[0]||"Пользователь";
    const userLink=document.createElement("a");userLink.className="account-user-link";userLink.href=accountUrl;userLink.textContent=name;userLink.setAttribute("aria-label","Открыть личный кабинет");
    wrap.append(userLink);
   }else wrap.append(signIn);
   slot.append(wrap);
  };
  const {data:{session}}=await sb.auth.getSession();await render(session);
  sb.auth.onAuthStateChange((_event,next)=>{render(next);});
 }
}
