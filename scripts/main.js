// Shared responsive navigation and DCH brand assets.
const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(toggle&&nav){
  toggle.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(open));
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  }));
}

// Apply the supplied vector logo and favicon consistently across all pages
// that load this shared script, regardless of their directory depth.
const sharedScriptUrl=document.currentScript?.src;
if(sharedScriptUrl){
  const brandLogoUrl=new URL("../assets/logo-signature.svg",sharedScriptUrl).href;
  const faviconUrl=new URL("../assets/favicon.svg",sharedScriptUrl).href;
  document.querySelectorAll('img[src*="site-brand-icon.jpg"], img[src*="assets/logo.png"]').forEach(img=>{
    img.src=faviconUrl;
    img.alt="DCH";
  });
  document.querySelectorAll(".brand img").forEach(img=>{
    img.src=brandLogoUrl;
    img.alt="AI Research DCH School";
    img.removeAttribute("width");
    img.removeAttribute("height");
  });
  document.querySelectorAll(".brand > span").forEach(label=>label.remove());
  let favicon=document.querySelector('link[rel~="icon"]');
  if(!favicon){
    favicon=document.createElement("link");
    favicon.rel="icon";
    document.head.appendChild(favicon);
  }
  favicon.type="image/svg+xml";
  favicon.href=faviconUrl;
}

// Add a localized, privacy-preserving feedback entry point to every page
// that uses the shared navigation. The form opens the visitor's own mail app.
(() => {
  const lang = document.documentElement.lang === "en" ? "en" : document.documentElement.lang === "zh" ? "zh" : "ru";
  const labels = {
    ru: "Вопросы и пожелания",
    en: "Questions & feedback",
    zh: "问题与建议"
  };
  const path = window.location.pathname;
  if (path.includes("/feedback/")) return;
  const nav = document.querySelector(".nav");
  if (!nav || nav.querySelector('[data-feedback-link]')) return;
  const href = new URL("../feedback/index" + (lang === "ru" ? "" : "-" + lang) + ".html", sharedScriptUrl || window.location.href);
  href.searchParams.set("from", window.location.href);
  const link = document.createElement("a");
  link.href = href.href;
  link.textContent = labels[lang];
  link.setAttribute("data-feedback-link", "");
  nav.appendChild(link);
})();
