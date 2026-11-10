const cfg = window.DCH_SUPABASE_CONFIG || {};
if (cfg.url && cfg.anonKey) {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  const sb = createClient(cfg.url, cfg.anonKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
  const accountUrl = new URL("../account/index.html", import.meta.url).href;
  const signInUrl = new URL("../auth/index.html", import.meta.url).href;
  const lang = (document.documentElement.lang || "ru").toLowerCase();
  const words = lang.startsWith("zh")
    ? { account: "个人中心", signIn: "登录", user: "用户", open: "打开个人中心" }
    : lang.startsWith("en")
      ? { account: "My account", signIn: "Sign in", user: "User", open: "Open account" }
      : { account: "Личный кабинет", signIn: "Войти", user: "Пользователь", open: "Открыть личный кабинет" };

  const header = document.querySelector(".site-header,.reader-header,.auth-header");
  const slot = header?.querySelector(".nav,.reader-tools,.auth-header-tools") || header;
  if (slot) {
    const wrap = document.createElement("div");
    wrap.className = "account-nav";
    const render = async session => {
      wrap.replaceChildren();
      const link = document.createElement("a");
      link.className = session?.user ? "account-user-link" : "account-nav-link";
      link.href = session?.user ? accountUrl : signInUrl;
      if (session?.user) {
        const name = session.user.user_metadata?.display_name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] || words.user;
        link.textContent = name;
        link.setAttribute("aria-label", words.open);
      } else {
        link.textContent = words.signIn;
        link.setAttribute("aria-label", words.signIn);
      }
      wrap.append(link);
      if (!wrap.isConnected) slot.append(wrap);
    };
    const { data: { session } } = await sb.auth.getSession();
    await render(session);
    sb.auth.onAuthStateChange((_event, next) => { render(next); });
  }
}