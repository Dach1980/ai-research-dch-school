(() => {
  const lesson = window.DCH_DEMO_LESSON;
  if (!lesson || !Array.isArray(lesson.pages) || !lesson.pages.length) return;

  const translations = {
    ru: { contents:"Содержание", lessonProgress:"Прогресс урока", allLessons:"Все уроки", courseContents:"Содержание урока", courseLabel:"ДЕМОНСТРАЦИОННЫЙ УРОК", localProgress:"Прогресс сохраняется в этом браузере", previous:"Предыдущая", next:"Следующая", unavailable:"Перевод этой страницы пока не подготовлен.", page:"Страница" },
    en: { contents:"Contents", lessonProgress:"Lesson progress", allLessons:"All lessons", courseContents:"Lesson contents", courseLabel:"READER DEMO", localProgress:"Progress is saved in this browser", previous:"Previous", next:"Next", unavailable:"A translation for this page is not available yet.", page:"Page" },
    zh: { contents:"目录", lessonProgress:"课程进度", allLessons:"全部课程", courseContents:"课程目录", courseLabel:"阅读器演示", localProgress:"进度保存在当前浏览器", previous:"上一页", next:"下一页", unavailable:"此页面的翻译尚未准备好。", page:"页面" }
  };
  const $ = (id) => document.getElementById(id);
  const languageButtons = [...document.querySelectorAll("[data-lang]")];
  const storageKey = "dch-reader:" + lesson.id;
  let language = "ru";
  let current = 0;
  let state = { read: [], positions: {} };
  let scrollFrame = 0;

  try {
    const savedLanguage = localStorage.getItem("dch-language");
    if (savedLanguage && translations[savedLanguage]) language = savedLanguage;
    const savedState = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (savedState && Array.isArray(savedState.read)) state = { read:savedState.read, positions:savedState.positions || {} };
  } catch (_) { /* Storage may be unavailable; the reader remains usable. */ }

  const t = (key) => translations[language][key] || translations.ru[key] || key;
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) { /* Ignore storage restrictions. */ }
  };
  const pageTitle = (page) => page.title[language] || page.title.ru || "";
  const isRead = (id) => state.read.includes(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function progressForPage() {
    const page = lesson.pages[current];
    const content = $("page-content");
    const maxScroll = content.scrollHeight - window.innerHeight * 0.72;
    if (maxScroll <= 12) return 0;
    const top = content.getBoundingClientRect().top + window.scrollY;
    return clamp((window.scrollY + window.innerHeight - top) / content.scrollHeight, 0, 1);
  }

  function updateProgress(fraction = 0) {
    const completed = lesson.pages.filter((page, index) => index !== current && isRead(page.id)).length;
    const currentFraction = isRead(lesson.pages[current].id) ? 1 : fraction;
    const percent = Math.round(((completed + currentFraction) / lesson.pages.length) * 100);
    $("progress-value").textContent = percent + "%";
    $("progress-fill").style.width = percent + "%";
    $("progress-track").setAttribute("aria-valuenow", String(percent));
  }

  function renderToc() {
    const nav = $("page-toc");
    nav.innerHTML = "";
    lesson.pages.forEach((page, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "toc-item" + (isRead(page.id) ? " is-read" : "");
      button.setAttribute("aria-current", index === current ? "page" : "false");
      button.innerHTML = '<span class="toc-number">' + String(index + 1).padStart(2, "0") + '</span><span></span><i class="toc-state" aria-hidden="true"></i>';
      button.children[1].textContent = pageTitle(page);
      button.addEventListener("click", () => goTo(index));
      nav.appendChild(button);
    });
  }

  function setLanguage(nextLanguage) {
    if (!translations[nextLanguage]) return;
    language = nextLanguage;
    try { localStorage.setItem("dch-language", language); } catch (_) {}
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (t(key)) element.textContent = t(key);
    });
    languageButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
    renderPage(false);
  }

  function renderPage(restorePosition = true) {
    const page = lesson.pages[current];
    const content = page.content[language];
    $("sidebar-course-title").textContent = lesson.module[language] || lesson.module.ru;
    $("lesson-module").textContent = (lesson.module[language] || lesson.module.ru).toLocaleUpperCase(language === "zh" ? "zh-CN" : language);
    $("lesson-duration").textContent = lesson.duration[language] || lesson.duration.ru;
    $("page-title").textContent = pageTitle(page);
    $("page-content").innerHTML = content || "";
    $("translation-notice").hidden = Boolean(content);
    $("translation-notice").textContent = t("unavailable");
    $("page-counter").textContent = (current + 1) + " / " + lesson.pages.length;
    $("prev-page").disabled = current === 0;
    $("next-page").disabled = current === lesson.pages.length - 1;
    renderToc();
    updateProgress(0);
    document.title = pageTitle(page) + " — AI Research DCH School";
    if (restorePosition) {
      const position = state.positions[language + ":" + page.id] || 0;
      window.scrollTo({ top:position, behavior:"auto" });
    }
  }

  function goTo(index) {
    if (index < 0 || index >= lesson.pages.length || index === current) return;
    const oldPage = lesson.pages[current];
    if (!isRead(oldPage.id)) state.read.push(oldPage.id);
    state.positions[language + ":" + oldPage.id] = window.scrollY;
    save();
    current = index;
    closeToc();
    renderPage(false);
    window.scrollTo({ top:0, behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      const page = lesson.pages[current];
      const fraction = progressForPage();
      state.positions[language + ":" + page.id] = window.scrollY;
      if (fraction >= 0.9 && !isRead(page.id)) {
        state.read.push(page.id);
        renderToc();
        save();
      }
      updateProgress(fraction);
      save();
    });
  }

  function openToc() {
    $("reader-sidebar").classList.add("is-open");
    $("toc-backdrop").classList.add("is-visible");
    $("toc-open").setAttribute("aria-expanded", "true");
    $("toc-close").focus();
  }
  function closeToc() {
    $("reader-sidebar").classList.remove("is-open");
    $("toc-backdrop").classList.remove("is-visible");
    $("toc-open").setAttribute("aria-expanded", "false");
  }

  $("prev-page").addEventListener("click", () => goTo(current - 1));
  $("next-page").addEventListener("click", () => goTo(current + 1));
  $("toc-open").addEventListener("click", openToc);
  $("toc-close").addEventListener("click", closeToc);
  $("toc-backdrop").addEventListener("click", closeToc);
  languageButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  window.addEventListener("scroll", onScroll, { passive:true });
  window.addEventListener("resize", () => updateProgress(progressForPage()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeToc();
    const target = event.target;
    const typing = target && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName));
    if (typing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(current - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(current + 1); }
  });

  setLanguage(language);
  renderPage(false);
})();