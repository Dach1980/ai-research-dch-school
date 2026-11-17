(() => {
  const root = document.querySelector("[data-home-knowledge-map]");
  if (!root) return;
  const locale = (document.documentElement.lang || "ru").toLowerCase().startsWith("zh") ? "zh" :
    (document.documentElement.lang || "ru").toLowerCase().startsWith("en") ? "en" : "ru";
  const cardClass = "home-planet";
  const base = root.dataset.catalogBase || "data/catalog";
  const messages = {
    ru:{open:"Открыть урок ↗",review:"На проверке",empty:"Подготовленные уроки появятся здесь после локализации.",error:"Не удалось загрузить каталог знаний."},
    en:{open:"Open lesson ↗",review:"Under review",empty:"Prepared lessons will appear here after localization.",error:"The knowledge catalogue could not be loaded."},
    zh:{open:"打开课程 ↗",review:"审核中",empty:"课程完成本地化后将在此显示。",error:"无法加载知识目录。"}
  };
  const ui = messages[locale];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  fetch(base.replace(/\/$/,"") + "/catalog-v3.json")
    .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(data => {
      if (data.schema_version !== 3) throw new Error("Unsupported catalogue schema");
      const lessons = data.lessons
        .filter(item => item.track_uid === "trk-a" && ((item.status === "published" && item.content_state === "published") || (item.status === "review" && item.content_state === "localized")) && item.url_i18n?.[locale])
        .sort((a,b) => a.code.localeCompare(b.code, "en", {numeric:true}));
      if (!lessons.length) { root.innerHTML = '<p class="muted">' + esc(ui.empty) + '</p>'; return; }
      root.innerHTML = lessons.map(lesson => {
        const title = lesson.title_i18n?.[locale] || lesson.title;
        const href = lesson.url_i18n?.[locale];
        if (!href) return "";
        const underReview = lesson.status === "review";
        return '<a class="' + cardClass + (underReview ? ' home-planet-review' : '') + '" href="' + esc(href) + '"><b>' + esc(lesson.code) +
          '</b><strong>' + esc(title) + '</strong>' + (underReview ? '<small class="home-planet-status">' + esc(ui.review) + '</small>' : '') +
          '<span>' + esc(ui.open) + '</span></a>';
      }).join("");
    })
    .catch(() => { root.innerHTML = '<p class="muted">' + esc(ui.error) + '</p>'; });
})();