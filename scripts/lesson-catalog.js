(() => {
  const root = document.querySelector("[data-lesson-catalog]");
  if (!root) return;
  const base = root.dataset.base || "../";
  const locale = document.documentElement.lang || "ru";
  const trackId = root.dataset.trackId || "";
  const duration = lesson => lesson.duration_min === lesson.duration_max
    ? `${lesson.duration_min} мин.`
    : `${lesson.duration_min}–${lesson.duration_max} минут`;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const catalog = window.DCHCatalogCompat;
  if (!catalog) {
    root.innerHTML = '<p class="notice">Не загружен адаптер учебного каталога.</p>';
    return;
  }
  catalog.load({ baseUrl: base + "data/catalog", schemaVersion: 2 })
    .then(data => {
      const tracks = new Map(data.tracks.map(item => [item.id, item]));
      const themes = new Map(data.themes.map(item => [item.id, item]));
      const modules = data.modules.filter(item => !trackId || item.track_id === trackId);
      const lessons = data.lessons.filter(item =>
        item.status === "published" && (!trackId || item.track_id === trackId)
      );
      if (!lessons.length) {
        root.innerHTML = '<p class="muted">Опубликованных уроков пока нет.</p>';
        return;
      }
      const groups = modules.map(module => {
        const theme = themes.get(module.theme_id);
        const items = lessons.filter(lesson => lesson.module_id === module.id);
        if (!items.length) return "";
        return `<section class="catalog-module" aria-labelledby="module-${esc(module.id)}">
          <p class="eyebrow">${esc(tracks.get(module.track_id)?.code || "")} · THEME ${esc(theme?.id || "")}</p>
          <h3>${esc(theme?.title || "")}</h3>
          <div class="catalog-module-heading"><span>MODULE ${esc(module.id)}</span><strong>${esc(module.title)}</strong></div>
          <div class="catalog-lesson-list">${items.map(lesson => {
            const href = base + ((lesson.url_i18n && lesson.url_i18n[locale]) || lesson.url);
            const title = (lesson.title_i18n && lesson.title_i18n[locale]) || lesson.title;
            const level = lesson.level === "beginner" ? "Начальный уровень" :
              lesson.level === "intermediate" ? "Средний уровень" : "Продвинутый уровень";
            const access = lesson.access === "open" ? "Открытый урок" :
              lesson.access === "registered" ? "После регистрации" : "Платный урок";
            return `<a class="module" href="${esc(href)}">
              <strong>Урок ${esc(lesson.id)} · ${esc(title)}</strong>
              <span>${esc(duration(lesson))} · ${esc(level)} · ${esc(access)}</span>
            </a>`;
          }).join("")}</div>
        </section>`;
      }).join("");
      root.innerHTML = groups || '<p class="muted">Для этого направления пока нет опубликованных уроков.</p>';
    })
    .catch(error => {
      root.innerHTML = '<p class="notice">Не удалось загрузить каталог уроков: ' + esc(error.message) + '.</p>';
    });
})();
