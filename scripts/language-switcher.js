(() => {
  const header = document.querySelector(".site-header");
  if (!header || header.querySelector(".language-switcher")) return;

  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  const folder = path.slice(0, path.lastIndexOf("/") + 1);
  const base = file.replace(/-(en|zh)(?=\.html$)/, "");
  const isHome = base === "index.html" &&
    (!/\/(lessons|learning-map|tracks|news|account|auth)\/$/.test(folder));
  const isCatalog = base === "index.html" &&
    (folder.endsWith("/lessons/") || folder.endsWith("/learning-map/"));
  const isLesson = folder.includes("/lessons/") && /^a-[1-6]-.*\.html$/.test(base);
  const isTrack = folder.includes("/tracks/") &&
    /^(understanding-ai|inside-ai|building-with-ai)\.html$/.test(base);
  const known = isHome || isCatalog || isLesson || isTrack;

  const target = locale => {
    const suffix = locale === "ru" ? "" : "-" + locale;
    if (isHome) return folder + "index" + suffix + ".html";
    if (known) return folder + base.replace(/\.html$/, "") + suffix + ".html";
    return folder + "index" + suffix + ".html";
  };

  const active = file.endsWith("-en.html") ? "en" : file.endsWith("-zh.html") ? "zh" : "ru";
  const box = document.createElement("div");
  box.className = "language-switcher";
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Language");
  [["RU", "ru"], ["EN", "en"], ["中文", "zh"]].forEach(([label, locale]) => {
    const link = document.createElement("a");
    link.href = target(locale);
    link.textContent = label;
    link.lang = locale === "zh" ? "zh-CN" : locale;
    if (active === locale) {
      link.setAttribute("aria-current", "page");
      link.setAttribute("aria-label", locale === "ru" ? "Русский, текущий язык" : locale === "en" ? "English, current language" : "中文，当前语言");
    } else {
      link.setAttribute("aria-label", locale === "ru" ? "Переключить на русский" : locale === "en" ? "Switch to English" : "切换到中文");
    }
    box.appendChild(link);
  });

  const nav = header.querySelector(".nav");
  if (nav) nav.insertAdjacentElement("afterend", box);
  else header.appendChild(box);
})();