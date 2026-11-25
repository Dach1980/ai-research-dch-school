(() => {
  const header = document.querySelector(".site-header");
  document.querySelectorAll("main .locale-links").forEach(node => node.remove());
  if (!header || header.querySelector(".language-switcher")) return;
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  const folder = path.slice(0, path.lastIndexOf("/") + 1);
  const pageFile = file.replace(/-(en|zh)(?=\.html$)/, "");
  const projectRootMatch = path.match(/^(.*?\/ai-research-dch-school\/)/);
  const projectRoot = projectRootMatch ? projectRootMatch[1] : "/";
  const pagePath = folder + pageFile;
  const relativePage = pagePath.startsWith(projectRoot) ? pagePath.slice(projectRoot.length) : pagePath.replace(/^\//, "");
  const isHome = relativePage === "" || relativePage === "index.html";
  const isLessonsIndex = relativePage === "lessons/index.html";
  const isMapIndex = relativePage === "learning-map/index.html";
  const isTrack = /^tracks\/(understanding-ai|inside-ai|building-with-ai)\.html$/.test(relativePage);
  const isLesson = /^lessons\/a-[a-z0-9.-]+\.html$/i.test(relativePage);
  const isFeedback = relativePage === "feedback/index.html";
  const isAuthor = /^about\/author\.html$/.test(relativePage);
  const isNews = /^news\/(index|001-school-launch|002-open-beta)\.html$/.test(relativePage);
  const isKnownPage = isHome || isLessonsIndex || isMapIndex || isTrack || isLesson || isFeedback || isAuthor || isNews;
  const target = locale => {
    const suffix = locale === "ru" ? "" : "-" + locale;
    if (!isKnownPage) return projectRoot + "index" + suffix + ".html";
    return folder + pageFile.replace(/\.html$/, "") + suffix + ".html";
  };
  const active = file.endsWith("-en.html") ? "en" : file.endsWith("-zh.html") ? "zh" : "ru";
  const box = document.createElement("div");
  box.className = "language-switcher";
  box.setAttribute("aria-label", "Language");
  [["RU", "ru"], ["EN", "en"], ["中文", "zh"]].forEach(([label, locale]) => {
    const link = document.createElement("a");
    link.lang = locale;
    link.href = target(locale);
    link.textContent = label;
    if (active === locale) {
      link.setAttribute("aria-current", "page");
      link.setAttribute("aria-label", label + " — current language");
    }
    box.appendChild(link);
  });
  const nav = header.querySelector(".nav");
  if (nav) nav.insertAdjacentElement("afterend", box);
  else header.appendChild(box);
})();