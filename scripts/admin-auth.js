const config=window.DCH_SUPABASE_CONFIG||{};
const gate=document.getElementById("admin-gate");
const shell=document.querySelector(".admin-shell");
const message=document.getElementById("admin-gate-message");
const setMessage=(value,kind="info")=>{if(message){message.textContent=value;message.dataset.kind=kind;}};
if(shell)shell.hidden=true;

if(!gate||!shell){throw new Error("Admin access gate markup is missing");}
if(!config.url||!config.anonKey){
  setMessage("Supabase не настроен. Административный интерфейс закрыт.", "error");
}else{
  try{
    const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase=createClient(config.url,config.anonKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
    const {data:{session},error:sessionError}=await supabase.auth.getSession();
    if(sessionError)throw sessionError;
    if(!session?.user){
      setMessage("Для доступа к административной панели необходимо войти в подтверждённый аккаунт.");
      const link=document.createElement("a");link.className="button primary";link.href="../auth/index.html";link.textContent="Войти в аккаунт";gate.append(link);
    }else if(!session.user.email_confirmed_at){
      setMessage("Email аккаунта не подтверждён. Подтвердите адрес и войдите повторно.","error");
    }else{
      const {data:role,error:roleError}=await supabase.from("school_admins").select("role").eq("user_id",session.user.id).eq("is_active",true).maybeSingle();
      if(roleError)throw roleError;
      if(!role){
        setMessage("У этой учётной записи нет административных разрешений.","error");
      }else{
        shell.hidden=false;gate.hidden=true;
        window.DCH_SUPABASE_CLIENT=supabase;
        window.DCH_ADMIN_ROLE=role.role;
        const label=document.getElementById("admin-role");
        if(label)label.textContent=role.role==="owner"?"Владелец школы":"Редактор";
        await import("./admin-roadmap.js");
        await import("./admin-management.js");
      }
    }
  }catch(error){
    setMessage("Не удалось проверить административные права. Проверьте миграцию 004 и политики RLS. "+(error?.message||""),"error");
  }
}
