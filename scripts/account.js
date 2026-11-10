const cfg=window.DCH_SUPABASE_CONFIG||{},$=id=>document.getElementById(id);
const copy={"ru":{"loading":"Загрузка…","title":"Личный кабинет","lead":"Управление учётной записью и доступом к обучению.","profile":"ВАШ ПРОФИЛЬ","notConfigured":"Авторизация не настроена","configHelp":"Проверьте конфигурацию Supabase.","signInRequired":"Войдите в аккаунт","signInHelp":"Для просмотра личного кабинета необходимо войти.","goSignIn":"Перейти ко входу","confirmed":"Email подтверждён","unconfirmed":"Email не подтверждён","logout":"Выйти из аккаунта","logoutError":"Не удалось завершить сеанс.","home":"Главная","lessons":"Лекции","footer":"AI Research DCH School · 2026","account":"Личный кабинет","language":"Язык","theme":"Переключить тему","user":"Пользователь"},"en":{"loading":"Loading…","title":"My account","lead":"Manage your account and learning access.","profile":"YOUR PROFILE","notConfigured":"Authentication is not configured","configHelp":"Check the Supabase configuration.","signInRequired":"Sign in to your account","signInHelp":"Please sign in to view your account.","goSignIn":"Go to sign in","confirmed":"Email confirmed","unconfirmed":"Email not confirmed","logout":"Sign out","logoutError":"Could not sign out.","home":"Home","lessons":"Lessons","footer":"AI Research DCH School · 2026","account":"My account","language":"Language","theme":"Toggle theme","user":"User"},"zh":{"loading":"正在加载…","title":"个人中心","lead":"管理您的账户和课程访问权限。","profile":"您的个人资料","notConfigured":"尚未配置身份验证","configHelp":"请检查 Supabase 配置。","signInRequired":"请登录账户","signInHelp":"登录后即可查看个人中心。","goSignIn":"前往登录","confirmed":"邮箱已验证","unconfirmed":"邮箱尚未验证","logout":"退出登录","logoutError":"无法退出登录。","home":"首页","lessons":"课程","footer":"AI Research DCH School · 2026","account":"个人中心","language":"语言","theme":"切换主题","user":"用户"}};
const params=new URLSearchParams(location.search);
let lang=params.get("lang")||localStorage.getItem("dch-language")||document.documentElement.lang||"ru";
if(!copy[lang])lang="ru";
const t=key=>copy[lang][key]||copy.ru[key]||key;
function applyLanguage(next,updateUrl=true){
 if(!copy[next])return;lang=next;localStorage.setItem("dch-language",lang);
 document.documentElement.lang=lang==="zh"?"zh-CN":lang;
 document.querySelectorAll("[data-lang]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.lang===lang)));
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(copy[lang][key])el.textContent=t(key)});
 document.title=t("title")+" — AI Research DCH School";
 if(updateUrl){const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState({}, "",url);}
}
document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",()=>applyLanguage(button.dataset.lang)));
let theme=localStorage.getItem("dch-theme")||"dark";
document.documentElement.dataset.theme=theme;
const themeButton=$("account-theme");
if(themeButton){const paint=()=>{themeButton.textContent=theme==="light"?"☾":"☼";themeButton.setAttribute("aria-label",t("theme"));};paint();themeButton.addEventListener("click",()=>{theme=theme==="light"?"dark":"light";localStorage.setItem("dch-theme",theme);document.documentElement.dataset.theme=theme;paint();});}
applyLanguage(lang,false);
function showStatus(name,status){$("account-name").textContent=name;$("account-status").textContent=status;}
if(!cfg.url||!cfg.anonKey){showStatus(t("notConfigured"),t("configHelp"));}
else{
 const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");
 const sb=createClient(cfg.url,cfg.anonKey,{auth:{autoRefreshToken:true,persistSession:true}});
 const {data:{session},error}=await sb.auth.getSession();
 if(error||!session){
  showStatus(t("signInRequired"),t("signInHelp"));
  const a=document.createElement("a");a.className="button primary";a.href="../auth/index.html?lang="+lang;a.textContent=t("goSignIn");$("account-logout").before(a);
 }else{
  const u=session.user;
  const name=u.user_metadata?.display_name||u.user_metadata?.full_name||u.email?.split("@")[0]||t("user");
  $("account-name").textContent=name;$("account-email").textContent=u.email||"";
  $("account-status").textContent=u.email_confirmed_at?t("confirmed"):t("unconfirmed");
  $("account-logout").hidden=false;
  $("account-logout").addEventListener("click",async()=>{
   const {error:signOutError}=await sb.auth.signOut();
   if(signOutError){$("account-status").textContent=signOutError.message||t("logoutError");return;}
   location.href="../index.html";
  });
 }
}