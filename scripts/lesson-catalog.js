(() => {
  const root = document.querySelector("[data-lesson-catalog]");
  if (!root) return;
  const base = root.dataset.base || "../";
  const locale = document.documentElement.lang || "ru";
  const trackId = root.dataset.trackId || "";
  const labels = {
    ru:{theme:"ТЕМА",module:"МОДУЛЬ",lesson:"Урок",beginner:"Начальный уровень",intermediate:"Средний уровень",advanced:"Продвинутый уровень",open:"Открытый урок",registered:"После регистрации",paid:"Платный урок",empty:"Опубликованных уроков пока нет.",duration:"минут"},
    en:{theme:"THEME",module:"MODULE",lesson:"Lesson",beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced",open:"Open lesson",registered:"Registration required",paid:"Paid lesson",empty:"No published lessons yet.",duration:"min"},
    zh:{theme:"主题",module:"模块",lesson:"课程",beginner:"初级",intermediate:"中级",advanced:"高级",open:"免费课程",registered:"注册后开放",paid:"付费课程",empty:"暂无已发布课程。",duration:"分钟"}
  };
  const ui = labels[locale] || labels.ru;
  const duration = lesson => {
    const value = lesson.duration_min === lesson.duration_max
      ? String(lesson.duration_min)
      : lesson.duration_min + "–" + lesson.duration_max;
    return value + " " + ui.duration;
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const catalog = window.DCHCatalogCompat;
  if (!catalog) {
    root.innerHTML = '<p class="notice">Catalog adapter not loaded.</p>';
    return;
  }
  catalog.loadLegacyProjection({ baseUrl: base + "data/catalog" })
    .then(data => {
      const tracks = new Map(data.tracks.map(item => [item.id, item]));
      const themes = new Map(data.themes.map(item => [item.id, item]));
      const modules = data.modules.filter(item => !trackId || item.track_id === trackId);
      const lessons = data.lessons.filter(item =>
        item.status === "published" && (!trackId || item.track_id === trackId)
      );
      if (!lessons.length) {
        root.innerHTML = '<p class="muted">' + esc(ui.empty) + '</p>';
        return;
      }
      const groups = modules.map(module => {
        const theme = themes.get(module.theme_id);
        const items = lessons.filter(lesson => lesson.module_id === module.id);
        if (!items.length) return "";
        const themeTitle = theme?.title_i18n?.[locale] || theme?.title || "";
        const moduleTitle = module.title_i18n?.[locale] || module.title || "";
        return `<section class="catalog-module" aria-labelledby="module-${esc(module.id)}">
          <p class="eyebrow">${esc(tracks.get(module.track_id)?.code || "")} · ${esc(ui.theme)} ${esc(theme?.id || "")}</p>
          <h3>${esc(themeTitle)}</h3>
          <div class="catalog-module-heading"><span>${esc(ui.module)} ${esc(module.id)}</span><strong id="module-${esc(module.id)}">${esc(moduleTitle)}</strong></div>
          <div class="catalog-lesson-list">${items.map(lesson => {
            const href = base + ((lesson.url_i18n && lesson.url_i18n[locale]) || lesson.url);
            const title = (lesson.title_i18n && lesson.title_i18n[locale]) || lesson.title;
            const level = ui[lesson.level] || lesson.level;
            const access = ui[lesson.access] || lesson.access;
            return `<a class="module" href="${esc(href)}">
              <strong>${esc(ui.lesson)} ${esc(lesson.id)} · ${esc(title)}</strong>
              <span>${esc(duration(lesson))} · ${esc(level)} · ${esc(access)}</span>
            </a>`;
          }).join("")}</div>
        </section>`;
      }).join("");
      root.innerHTML = groups || '<p class="muted">' + esc(ui.empty) + '</p>';
    })
    .catch(error => {
      root.innerHTML = '<p class="notice">Unable to load lesson catalogue: ' + esc(error.message) + '.</p>';
    });
})();
