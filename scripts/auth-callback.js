const params=new URLSearchParams(location.search);
let lang=params.get("lang")||localStorage.getItem("dch-language")||"ru";
const words={
ru:{checking:"Проверяем ссылку…",wait:"Пожалуйста, подождите.",ok:"Email подтверждён",success:"Ваш адрес электронной почты успешно подтверждён. Теперь можно перейти к учебным материалам.",go:"Перейти к урокам",bad:"Не удалось подтвердить email",error:"Ссылка недействительна или срок её действия истёк. Вернитесь на страницу входа и запросите новую ссылку.",signin:"Перейти ко входу",newPassword:"Новый пароль",confirmPassword:"Повторите пароль",save:"Сохранить пароль",mismatch:"Пароли не совпадают или содержат менее 8 символов.",updated:"Пароль успешно изменён. Теперь можно войти в аккаунт.",updateError:"Не удалось изменить пароль. Запросите новую ссылку восстановления.",change:"Изменение пароля",enter:"Введите новый пароль для аккаунта.",passwordChanged:"Пароль изменён",show:"Показать пароль",hide:"Скрыть пароль"},
en:{checking:"Verifying your link…",wait:"Please wait.",ok:"Email confirmed",success:"Your email address has been successfully confirmed. You can now continue to the learning library.",go:"Open the learning library",bad:"Email confirmation failed",error:"This link is invalid or has expired. Return to sign in and request a new confirmation email.",signin:"Go to sign in",newPassword:"New password",confirmPassword:"Confirm password",save:"Update password",mismatch:"Passwords must match and contain at least 8 characters.",updated:"Your password has been updated. You can now sign in.",updateError:"The password could not be updated. Request a new reset link.",change:"Change password",enter:"Enter a new password for your account.",passwordChanged:"Password updated",show:"Show password",hide:"Hide password"},
zh:{checking:"正在验证链接…",wait:"请稍候。",ok:"邮箱已验证",success:"您的电子邮箱已成功验证。现在可以进入课程库继续学习。",go:"进入课程库",bad:"邮箱验证失败",error:"此链接无效或已过期。请返回登录页面并重新申请验证邮件。",signin:"前往登录",newPassword:"新密码",confirmPassword:"确认新密码",save:"更新密码",mismatch:"密码必须一致且至少包含 8 个字符。",updated:"密码已成功更新。现在可以登录。",updateError:"无法更新密码，请重新申请密码重置链接。",change:"修改密码",enter:"请输入账户的新密码。",passwordChanged:"密码已更新",show:"显示密码",hide:"隐藏密码"}
};
if(!words[lang])lang="ru";
const w=words[lang];document.documentElement.lang=lang==="zh"?"zh-CN":lang;localStorage.setItem("dch-language",lang);
const title=document.getElementById("callback-title"),message=document.getElementById("callback-message"),link=document.getElementById("callback-link"),form=document.getElementById("recovery-form");
const themeButton=document.getElementById("callback-theme");let theme=localStorage.getItem("dch-theme")||"dark";document.documentElement.dataset.theme=theme;
function paintTheme(){if(themeButton){themeButton.textContent=theme==="light"?"☾":"☼";themeButton.setAttribute("aria-label",lang==="ru"?"Переключить тему":lang==="en"?"Toggle theme":"切换主题");}}
paintTheme();themeButton?.addEventListener("click",()=>{theme=theme==="light"?"dark":"light";localStorage.setItem("dch-theme",theme);document.documentElement.dataset.theme=theme;paintTheme();});
document.querySelectorAll("[data-lang]").forEach(button=>{button.setAttribute("aria-pressed",String(button.dataset.lang===lang));button.addEventListener("click",()=>{const url=new URL(location.href);url.searchParams.set("lang",button.dataset.lang);location.href=url.href;});});
const cfg=window.DCH_SUPABASE_CONFIG||{};
function setSignInLink(){link.hidden=false;link.href="index.html?lang="+lang;link.textContent=w.signin;}
if(!cfg.url?.startsWith("https://")||cfg.url.includes("YOUR_PROJECT_REF")||!cfg.anonKey||cfg.anonKey.includes("YOUR_SUPABASE")){title.textContent=w.bad;message.textContent=w.error;setSignInLink();}
else{
 const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");
 const sb=createClient(cfg.url,cfg.anonKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
 try{
  const tokenHash=params.get("token_hash"),type=params.get("type"),recovery=params.get("mode")==="recovery"||type==="recovery";
  if(tokenHash&&type){const {error}=await sb.auth.verifyOtp({token_hash:tokenHash,type});if(error)throw error;}
  const {data,error}=await sb.auth.getSession();if(error)throw error;if(!data.session)throw new Error("No verified session");
  if(recovery){
   title.textContent=w.change;message.textContent=w.enter;
   document.getElementById("new-password-label").textContent=w.newPassword;document.getElementById("confirm-password-label").textContent=w.confirmPassword;document.getElementById("recovery-submit").textContent=w.save;form.hidden=false;link.hidden=true;
   form.addEventListener("submit",async e=>{e.preventDefault();const p=document.getElementById("new-password").value,c=document.getElementById("confirm-password").value;if(p.length<8||p!==c){message.textContent=w.mismatch;return;}const {error:updateError}=await sb.auth.updateUser({password:p});if(updateError){message.textContent=w.updateError;return;}await sb.auth.signOut();title.textContent=w.passwordChanged;message.textContent=w.updated;form.hidden=true;setSignInLink();});
  }else{title.textContent=w.ok;message.textContent=w.success;link.hidden=false;link.textContent=w.go;link.href=lang==="ru"?"../lessons/index.html":lang==="en"?"../lessons/index-en.html":"../lessons/index-zh.html";}
 }catch(e){title.textContent=w.bad;message.textContent=w.error;setSignInLink();}
}
function installRecoveryPasswordToggles(){
 document.querySelectorAll('#recovery-form input[type="password"]').forEach(input=>{
  if(input.dataset.visibilityReady)return;input.dataset.visibilityReady="true";
  const wrap=document.createElement("span");wrap.className="password-field-wrap";input.parentNode.insertBefore(wrap,input);wrap.append(input);
  const button=document.createElement("button");button.type="button";button.className="password-toggle";button.textContent="◉";button.setAttribute("aria-label",w.show);
  button.addEventListener("click",()=>{const visible=input.type==="password";input.type=visible?"text":"password";button.textContent=visible?"◎":"◉";button.setAttribute("aria-label",visible?w.hide:w.show);input.focus();});wrap.append(button);
 });
}
const recoveryObserver=new MutationObserver(()=>{if(!form.hidden){installRecoveryPasswordToggles();recoveryObserver.disconnect();}});
recoveryObserver.observe(form,{attributes:true,attributeFilter:["hidden"]});
installRecoveryPasswordToggles();
