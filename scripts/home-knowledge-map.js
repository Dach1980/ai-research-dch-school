(() => {
  const root = document.querySelector("[data-home-knowledge-map]");
  if (!root) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const raw = document.documentElement.lang || "ru";
  const locale = raw.toLowerCase().startsWith("zh") ? "zh" : raw.toLowerCase().startsWith("en") ? "en" : "ru";
  const messages = {ru:{open:"Открыть урок ↗",empty:"Опубликованные уроки появятся здесь после проверки."},en:{open:"Open lesson ↗",empty:"Published lessons will appear here after review."},zh:{open:"打开课程 ↗",empty:"课程通过审核后将在此显示。"}}[locale];
  const titles = {
    "1.1.1":{en:"What Is Artificial Intelligence?",zh:"什么是人工智能？"},
    "1.1.2":{en:"A Brief History of Artificial Intelligence",zh:"人工智能发展简史"},
    "1.1.3":{en:"Symbolic AI and Machine Learning",zh:"符号人工智能与机器学习"},
    "1.1.4":{en:"AI, Machine Learning and Deep Learning",zh:"人工智能、机器学习与深度学习"}
  };
  const catalog = window.DCHCatalogCompat;
  if (!catalog) { root.textContent = messages.empty; return; }
  catalog.load({baseUrl:root.dataset.catalogBase || "data/catalog",schemaVersion:3}).then(data => {
    const lessons = data.lessons.filter(x => x.status==="published" && x.content_state==="published" && x.track_uid==="trk-a").sort((a,b)=>a.code.localeCompare(b.code,undefined,{numeric:true}));
    if (!lessons.length) { root.textContent = messages.empty; return; }
    root.innerHTML = lessons.map(lesson => {
      const title = lesson.title_i18n?.[locale] || titles[lesson.code]?.[locale] || lesson.title;
      const href = lesson.url_i18n?.[locale] || lesson.url_i18n?.ru;
      return '<a class="'+esc(root.dataset.cardClass || "home-planet")+'" href="'+esc(href)+'"><b>'+esc(lesson.code)+'</b><strong>'+esc(title)+'</strong><span>'+esc(messages.open)+'</span></a>';
    }).join("");
  }).catch(() => { root.textContent = messages.empty; });
})();