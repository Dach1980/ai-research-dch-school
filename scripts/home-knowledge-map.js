(() => {
  const root = document.querySelector("[data-home-knowledge-map]");
  if (!root) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const locale = document.documentElement.lang || "ru";
  const cardClass = root.dataset.cardClass || "home-planet";
  const messages = {ru:{open:"Открыть урок ↗",empty:"${esc(ui.empty)}",error:"${esc(ui.error)}",missing:"${esc(ui.missing)}"},en:{open:"Open lesson ↗",empty:"Published lessons will appear here after review.",error:"The knowledge catalogue could not be loaded.",missing:"The knowledge catalogue is temporarily unavailable."},zh:{open:"打开课程 ↗",empty:"课程通过审核后将在此显示。",error:"无法加载知识目录。",missing:"知识目录暂时不可用。"}};
  const ui = messages[locale] || messages.en;
  if (!window.DCHCatalogCompat) {
    root.innerHTML = '<p class="muted">Каталог знаний временно недоступен.</p>';
    return;
  }
  window.DCHCatalogCompat.load({baseUrl:"data/catalog",schemaVersion:2})
    .then(data => {
      const lessons = data.lessons
        .filter(item => item.status === "published" && item.track_id === "track-a")
        .sort((a,b) => a.id.localeCompare(b.id, "en", {numeric:true}));
      if (!lessons.length) {
        root.innerHTML = '<p class="muted">Опубликованные уроки появятся здесь после проверки.</p>';
        return;
      }
      root.innerHTML = lessons.map(lesson => {
        const title = lesson.title_i18n?.[locale] || lesson.title;
        const href = (lesson.url_i18n && lesson.url_i18n[locale]) || lesson.url;
        return `<a class="${esc(cardClass)}" href="${esc(href)}"><b>${esc(lesson.id)}</b><strong>${esc(title)}</strong><span>${esc(ui.open)}</span></a>`;
      }).join("");
    })
    .catch(() => {
      root.innerHTML = '<p class="muted">Не удалось загрузить каталог знаний.</p>';
    });
})();
