(() => {
  const root = document.querySelector("[data-home-knowledge-map]");
  if (!root) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const locale = document.documentElement.lang || "ru";
  const cardClass = root.dataset.cardClass || "home-planet";
  const catalogBase = root.dataset.catalogBase || "data/catalog";
  const messages = {
    ru:{open:"Открыть урок ↗",empty:"Опубликованные уроки появятся здесь после проверки.",error:"Не удалось загрузить каталог знаний.",missing:"Каталог знаний временно недоступен."},
    en:{open:"Open lesson ↗",empty:"Published lessons will appear here after review.",error:"The knowledge catalogue could not be loaded.",missing:"The knowledge catalogue is temporarily unavailable."},
    zh:{open:"打开课程 ↗",empty:"课程通过审核后将在此显示。",error:"无法加载知识目录。",missing:"知识目录暂时不可用。"}
  };
  const ui = messages[locale] || messages.en;
  if (!window.DCHCatalogCompat) {
    root.innerHTML = `<p class="muted">${esc(ui.missing)}</p>`;
    return;
  }
  window.DCHCatalogCompat.loadLegacyProjection({baseUrl:catalogBase})
    .then(data => {
      const lessons = data.lessons
        .filter(item => item.status === "published" && item.track_id === "track-a")
        .sort((a,b) => a.id.localeCompare(b.id, "en", {numeric:true}));
      if (!lessons.length) {
        root.innerHTML = `<p class="muted">${esc(ui.empty)}</p>`;
        return;
      }
      root.innerHTML = lessons.map(lesson => {
        const title = lesson.title_i18n?.[locale] || lesson.title;
        const href = (lesson.url_i18n && lesson.url_i18n[locale]) || lesson.url;
        const displayCode = lesson.v3_target_codes && lesson.v3_target_codes.length ? lesson.v3_target_codes.join(" · ") : "—";
        return `<a class="${esc(cardClass)}" href="${esc(href)}"><b>${esc(displayCode)}</b><strong>${esc(title)}</strong><span>${esc(ui.open)}</span></a>`;
      }).join("");
    })
    .catch(() => {
      root.innerHTML = `<p class="muted">${esc(ui.error)}</p>`;
    });
})();
