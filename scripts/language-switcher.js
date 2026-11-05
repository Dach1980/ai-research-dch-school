(() => {
 const header=document.querySelector(".site-header");
 if(!header || header.querySelector(".language-switcher")) return;
 const path=window.location.pathname;
 const file=path.split("/").pop() || "index.html";
 const base=file.replace(/-(en|zh)(?=\.html$)/,"");
 const folder=path.slice(0,path.lastIndexOf("/")+1);
 const lessonPage=folder.includes("/lessons/") && /^a-[1-5]-.*\.html$/.test(base);
 const indexPage=base==="index.html" && (folder.endsWith("/lessons/") || folder.endsWith("/learning-map/") || path.endsWith("/ai-research-dch-school/") || path.endsWith("/ai-research-dch-school/index.html"));
 const trackPage=/^(understanding-ai|inside-ai|building-with-ai)\\.html$/.test(base) && folder.includes("/tracks/");
 const known=lessonPage || indexPage || trackPage;
 const target=locale=>{
  if(!known)return "/ai-research-dch-school/index"+(locale==="ru"?"":"-"+locale)+".html";
  return folder+base.replace(/\.html$/,"")+(locale==="ru"?"":"-"+locale)+".html";
 };
 const active=file.endsWith("-en.html")?"en":file.endsWith("-zh.html")?"zh":"ru";
 const box=document.createElement("div");box.className="language-switcher";box.setAttribute("aria-label","Language");
 [["RU","ru"],["EN","en"],["中文","zh"]].forEach(([label,locale])=>{
  const a=document.createElement("a");a.href=target(locale);a.textContent=label;
  if(active===locale)a.setAttribute("aria-current","page");
  box.appendChild(a);
 });
 const nav=header.querySelector(".nav");if(nav)nav.insertAdjacentElement("afterend",box);else header.appendChild(box);
})();