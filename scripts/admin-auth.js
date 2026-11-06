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
    const {data:{user},error:userError}=await supabase.auth.getUser();
    if(userError)throw userError;
    if(!user){
      setMessage("Для доступа к административной панели необходимо войти в подтверждённый аккаунт.");
      const link=document.createElement("a");link.className="button primary";link.href="../auth/index.html";link.textContent="Войти в аккаунт";gate.append(link);
    }else if(!user.email_confirmed_at){
      setMessage("Email аккаунта не подтверждён. Подтвердите адрес и войдите повторно.","error");
    }else{
      const {data:role,error:roleError}=await supabase.from("school_admins").select("role").eq("user_id",user.id).eq("is_active",true).maybeSingle();
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
    const code=error?.code||"";
    const messageText=error?.message||"";
    if(code==="PGRST205" || /Could not find the table ['"]public\.school_admins['"] in the schema cache/i.test(messageText)){
      setMessage("Supabase не видит таблицу public.school_admins. Обычно это означает, что миграция 004_school_admin_roles.sql не применена к этому проекту, либо PostgREST ещё не обновил схему. Проверьте таблицу в Database → Tables и историю миграций. Если таблица существует, выполните NOTIFY pgrst, 'reload schema' в SQL Editor и обновите страницу. Техническая ошибка: "+messageText,"error");
    }else if(code==="42501" || /permission denied|row-level security/i.test(messageText)){
      setMessage("Таблица административных ролей доступна, но запрос запрещён правами PostgreSQL/RLS. Проверьте GRANT SELECT для authenticated и политику Admins read own role из миграции 004. "+messageText,"error");
    }else{
      setMessage("Не удалось проверить административные права. Проверьте доступность Supabase, миграцию 004 и политики RLS. "+messageText,"error");
    }
  }
}
