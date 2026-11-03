const lang=new URLSearchParams(location.search).get("lang")||localStorage.getItem("dch-language")||"ru";
const words={
ru:{checking:"Проверяем ссылку…",wait:"Пожалуйста, подождите.",ok:"Email подтверждён",success:"Ваш адрес электронной почты успешно подтверждён. Теперь можно перейти к учебным материалам.",go:"Перейти к урокам",bad:"Не удалось подтвердить email",error:"Ссылка недействительна или срок её действия истёк. Вернитесь на страницу входа и запросите новую ссылку.",signin:"Перейти ко входу",newPassword:"Новый пароль",confirmPassword:"Повторите пароль",save:"Сохранить пароль",mismatch:"Пароли не совпадают или содержат менее 8 символов.",updated:"Пароль успешно изменён. Теперь можно войти в аккаунт.",updateError:"Не удалось изменить пароль. Запросите новую ссылку восстановления."},
en:{checking:"Verifying your link…",wait:"Please wait.",ok:"Email confirmed",success:"Your email address has been successfully confirmed. You can now continue to the learning library.",go:"Open the learning library",bad:"Email confirmation failed",error:"This link is invalid or has expired. Return to sign in and request a new confirmation email.",signin:"Go to sign in",newPassword:"New password",confirmPassword:"Confirm password",save:"Update password",mismatch:"Passwords must match and contain at least 8 characters.",updated:"Your password has been updated. You can now sign in.",updateError:"The password could not be updated. Request a new reset link."},
zh:{checking:"正在验证链接…",wait:"请稍候。",ok:"邮箱已验证",success:"您的电子邮箱已成功验证。现在可以进入课程库继续学习。",go:"进入课程库",bad:"邮箱验证失败",error:"此链接无效或已过期。请返回登录页面并重新申请验证邮件。",signin:"前往登录",newPassword:"新密码",confirmPassword:"确认新密码",save:"更新密码",mismatch:"密码必须一致且至少包含 8 个字符。",updated:"密码已成功更新。现在可以登录。",updateError:"无法更新密码，请重新申请密码重置链接。"}
};
const w=words[lang]||words.ru;document.documentElement.lang=lang==="zh"?"zh-CN":lang;
const title=document.getElementById("callback-title"),message=document.getElementById("callback-message"),link=document.getElementById("callback-link"),form=document.getElementById("recovery-form");
const cfg=window.DCH_SUPABASE_CONFIG||{};
if(!cfg.url?.startsWith("https://")||cfg.url.includes("YOUR_PROJECT_REF")||!cfg.anonKey||cfg.anonKey.includes("YOUR_SUPABASE")){title.textContent=w.bad;message.textContent=w.error;link.hidden=false;link.href="index.html";link.textContent=w.signin}
else{
 const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");
 const sb=createClient(cfg.url,cfg.anonKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
 try{
  const params=new URLSearchParams(location.search),tokenHash=params.get("token_hash"),type=params.get("type"),recovery=params.get("mode")==="recovery"||type==="recovery";
  if(tokenHash&&type){const {error}=await sb.auth.verifyOtp({token_hash:tokenHash,type});if(error)throw error}
  const {data,error}=await sb.auth.getSession();if(error)throw error;if(!data.session)throw new Error("No verified session");
  if(recovery){
   title.textContent=lang==="ru"?"Изменение пароля":lang==="en"?"Choose a new password":"设置新密码";message.textContent=lang==="ru"?"Введите новый пароль для аккаунта.":lang==="en"?"Enter a new password for your account.":"请输入账户的新密码。";
   document.getElementById("new-password-label").textContent=w.newPassword;document.getElementById("confirm-password-label").textContent=w.confirmPassword;document.getElementById("recovery-submit").textContent=w.save;form.hidden=false;link.hidden=true;
   form.addEventListener("submit",async e=>{e.preventDefault();const p=document.getElementById("new-password").value,c=document.getElementById("confirm-password").value;if(p.length<8||p!==c){message.textContent=w.mismatch;return}const {error:updateError}=await sb.auth.updateUser({password:p});if(updateError){message.textContent=w.updateError;return}await sb.auth.signOut();title.textContent=lang==="ru"?"Пароль изменён":lang==="en"?"Password updated":"密码已更新";message.textContent=w.updated;form.hidden=true;link.hidden=false;link.href="index.html";link.textContent=w.signin});
  }else{title.textContent=w.ok;message.textContent=w.success;link.hidden=false;link.textContent=w.go;link.href="../lessons/index.html"}
 }catch(e){title.textContent=w.bad;message.textContent=w.error;link.hidden=false;link.href="index.html";link.textContent=w.signin}
}
