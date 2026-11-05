(() => {
  const root = document.querySelector("[data-lesson-catalog]");
  if (!root) return;
  const base = root.dataset.base || "../";
  const locale = document.documentElement.lang || "ru";
  const trackId = root.dataset.trackId || "";
  const duration = lesson => lesson.duration_min === lesson.duration_max
    ? `${lesson.duration_min} мин.`
    : `${lesson.duration_min}–${lesson.duration_max} минут`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  fetch(base + "data/catalog/lessons.json", { cache: "no-store" })
    .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(data => {
      const lessons = (data.lessons || []).filter(item =>
        item.status === "published" && (!trackId || item.track_id === trackId)
      );
      if (!lessons.length) {
        root.innerHTML = '<p class="muted">Опубликованных уроков пока нет.</p>';
        return;
      }
      root.innerHTML = lessons.map(lesson => {
        const href = base + ((lesson.url_i18n && lesson.url_i18n[locale]) || lesson.url);
        const title = (lesson.title_i18n && lesson.title_i18n[locale]) || lesson.title;
        const level = lesson.level === "beginner" ? "Начальный уровень" :
          lesson.level === "intermediate" ? "Средний уровень" : "Продвинутый уровень";
        const access = lesson.access === "open" ? "Открытый урок" :
          lesson.access === "registered" ? "После регистрации" : "Платный урок";
        return `<a class="module" href="${escapeHtml(href)}">
          <strong>Планета ${escapeHtml(lesson.id)} · ${escapeHtml(title)}</strong>
          <span>${escapeHtml(duration(lesson))} · ${escapeHtml(level)} · ${escapeHtml(access)}</span>
        </a>`;
      }).join("");
    })
    .catch(error => {
      root.innerHTML = '<p class="notice">Не удалось загрузить каталог уроков: ' + escapeHtml(error.message) + '.</p>';
    });
})();
