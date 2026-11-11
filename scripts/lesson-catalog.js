(() => {
  const root = document.querySelector("[data-lesson-catalog]");
  if (!root) return;
  const base = root.dataset.base || "../";
  const locale = (document.documentElement.lang || "ru").toLowerCase().startsWith("zh") ? "zh" :
    (document.documentElement.lang || "ru").toLowerCase().startsWith("en") ? "en" : "ru";
  const trackUid = root.dataset.trackUid || ({ "track-a":"trk-a", "track-b":"trk-b", "track-c":"trk-c" }[root.dataset.trackId] || "trk-a");
  const labels = {
    ru:{theme:"ТЕМА",module:"МОДУЛЬ",lesson:"Урок",beginner:"Начальный уровень",intermediate:"Средний уровень",advanced:"Продвинутый уровень",open:"Открытый урок",registered:"После регистрации",paid:"Платный урок",empty:"Подготовленных уроков пока нет.",underReview:"На проверке",published:"Опубликовано"},
    en:{theme:"THEME",module:"MODULE",lesson:"Lesson",beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced",open:"Open lesson",registered:"Registration required",paid:"Paid lesson",empty:"No prepared lessons yet.",underReview:"Under review",published:"Published"},
    zh:{theme:"主题",module:"模块",lesson:"课程",beginner:"初级",intermediate:"中级",advanced:"高级",open:"免费课程",registered:"注册后开放",paid:"付费课程",empty:"暂无已准备课程。",underReview:"审核中",published:"已发布"}
  };
  const ui = labels[locale];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const statusStyle = document.createElement("style");
  statusStyle.textContent = ".lesson-status{display:inline-block;margin-left:8px;padding:2px 7px;border-radius:999px;font-size:10px;font-weight:700;vertical-align:middle}.lesson-status-review{color:#f0c878;background:#f0c87818;border:1px solid #f0c87855}.lesson-status-published{color:#8fd7b2;background:#8fd7b218;border:1px solid #8fd7b255}.module-review{border-style:dashed}";
  document.head.appendChild(statusStyle);
  fetch(base + "data/catalog/catalog-v3.json")
    .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(data => {
      if (data.schema_version !== 3) throw new Error("Unsupported catalogue schema");
      const themes = new Map(data.themes.map(item => [item.uid,item]));
      const modules = new Map(data.modules.map(item => [item.uid,item]));
      const lessons = data.lessons.filter(item => item.track_uid === trackUid &&
        ((item.status === "published" && item.content_state === "published") ||
         (item.status === "review" && item.content_state === "localized")) &&
        item.url_i18n?.[locale]);
      if (!lessons.length) { root.innerHTML = '<p class="muted">' + esc(ui.empty) + '</p>'; return; }
      const groups = new Map();
      lessons.sort((a,b) => a.code.localeCompare(b.code,"en",{numeric:true})).forEach(lesson => {
        const key = lesson.module_uid;
        if (!groups.has(key)) groups.set(key,[]);
        groups.get(key).push(lesson);
      });
      root.innerHTML = Array.from(groups.entries()).map(([moduleUid,items]) => {
        const module = modules.get(moduleUid);
        const theme = themes.get(module?.theme_uid);
        const themeTitle = theme?.title_i18n?.[locale] || theme?.title || "";
        const moduleTitle = module?.title_i18n?.[locale] || module?.title || "";
        return '<section class="catalog-module" aria-label="' + esc(moduleTitle) + '">' +
          '<p class="eyebrow">' + esc(ui.theme) + ' ' + esc(theme?.number ?? "") + '</p>' +
          '<h3>' + esc(themeTitle) + '</h3>' +
          '<div class="catalog-module-heading"><span>' + esc(ui.module) + ' ' + esc(module?.number ?? "") +
          '</span><strong>' + esc(moduleTitle) + '</strong></div>' +
          '<div class="catalog-lesson-list">' + items.map(lesson => {
            const href = lesson.url_i18n?.[locale];
            if (!href) return "";
            const title = lesson.title_i18n?.[locale] || lesson.title;
            const level = ui[lesson.level] || lesson.level || "";
            const access = ui[lesson.access] || lesson.access || "";
            const underReview = lesson.status === "review";
            return '<a class="module' + (underReview ? ' module-review' : '') + '" href="' + esc(base + href) + '">' +
              '<strong>' + esc(ui.lesson) + ' ' + esc(lesson.code) + ' · ' + esc(title) +
              (underReview ? ' <span class="lesson-status lesson-status-review">' + esc(ui.underReview) + '</span>' :
                ' <span class="lesson-status lesson-status-published">' + esc(ui.published) + '</span>') + '</strong>' +
              '<span>' + esc(level) + ' · ' + esc(access) + '</span></a>';
          }).join("") + '</div></section>';
      }).join("");
    })
    .catch(() => { root.innerHTML = '<p class="notice">' + (locale==="ru"?"Не удалось загрузить каталог уроков.":locale==="zh"?"无法加载课程目录。":"Unable to load the lesson catalogue.") + '</p>'; });
})();