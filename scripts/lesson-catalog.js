(() => {
  const root = document.querySelector("[data-lesson-catalog]");
  if (!root) return;
  const base = root.dataset.base || "../";
  const rawLocale = document.documentElement.lang || "ru";
  const locale = rawLocale.toLowerCase().startsWith("zh") ? "zh" : rawLocale.toLowerCase().startsWith("en") ? "en" : "ru";
  const trackUid = root.dataset.trackUid || (root.dataset.trackId === "track-a" ? "trk-a" : "");
  const labels = {
    ru:{theme:"ТЕМА",module:"МОДУЛЬ",lesson:"Урок",beginner:"Начальный уровень",intermediate:"Средний уровень",advanced:"Продвинутый уровень",open:"Открытый урок",registered:"После регистрации",paid:"Платный урок",empty:"Опубликованных уроков пока нет.",duration:"минут",durationPending:"Длительность уточняется"},
    en:{theme:"THEME",module:"MODULE",lesson:"Lesson",beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced",open:"Open lesson",registered:"Registration required",paid:"Paid lesson",empty:"No published lessons yet.",duration:"min",durationPending:"Duration to be confirmed"},
    zh:{theme:"主题",module:"模块",lesson:"课程",beginner:"初级",intermediate:"中级",advanced:"高级",open:"免费课程",registered:"注册后开放",paid:"付费课程",empty:"暂无已发布课程。",duration:"分钟",durationPending:"时长待确认"}
  }[locale];
  const translations = {
    "1.1.1":{en:"What Is Artificial Intelligence?",zh:"什么是人工智能？"},
    "1.1.2":{en:"A Brief History of Artificial Intelligence",zh:"人工智能发展简史"},
    "1.1.3":{en:"Symbolic AI and Machine Learning",zh:"符号人工智能与机器学习"},
    "1.1.4":{en:"AI, Machine Learning and Deep Learning",zh:"人工智能、机器学习与深度学习"}
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const catalog = window.DCHCatalogCompat;
  if (!catalog) { root.textContent = labels.empty; return; }
  catalog.load({baseUrl:base+"data/catalog",schemaVersion:3}).then(data => {
    const tracks = new Map(data.tracks.map(x => [x.uid,x]));
    const themes = new Map(data.themes.map(x => [x.uid,x]));
    const modules = new Map(data.modules.map(x => [x.uid,x]));
    const lessons = data.lessons.filter(x => x.status === "published" && x.content_state === "published" && (!trackUid || x.track_uid === trackUid));
    if (!lessons.length) { root.innerHTML = '<p class="muted">'+esc(labels.empty)+'</p>'; return; }
    const groups = new Map();
    lessons.forEach(lesson => {
      const module = modules.get(lesson.module_uid), theme = themes.get(lesson.theme_uid);
      if (!module || !theme) return;
      const key = module.uid;
      if (!groups.has(key)) groups.set(key,{module,theme,lessons:[]});
      groups.get(key).lessons.push(lesson);
    });
    root.innerHTML = [...groups.values()].map(({module,theme,lessons:items}) => {
      const track = tracks.get(theme.track_uid);
      return '<section class="catalog-module"><p class="eyebrow">'+esc(track?.code||"")+' · '+esc(labels.theme)+' '+esc(theme.number)+'</p><h3>'+esc((theme.title_i18n?.[locale] || theme.title))+'</h3><div class="catalog-module-heading"><span>'+esc(labels.module)+' '+esc(module.number)+'</span><strong>'+esc((module.title_i18n?.[locale] || module.title))+'</strong></div><div class="catalog-lesson-list">'+items.sort((a,b)=>a.code.localeCompare(b.code,undefined,{numeric:true})).map(lesson => {
        const href = lesson.url_i18n?.[locale] || lesson.url_i18n?.ru;
        const title = lesson.title_i18n?.[locale] || translations[lesson.code]?.[locale] || lesson.title;
        const duration = Number.isFinite(lesson.duration_min) && Number.isFinite(lesson.duration_max) ? (lesson.duration_min===lesson.duration_max?lesson.duration_min:lesson.duration_min+"–"+lesson.duration_max)+" "+labels.duration : labels.durationPending;
        const level = labels[lesson.level] || lesson.level;
        const access = labels[lesson.access] || lesson.access;
        return '<a class="module" href="'+esc(base+href)+'"><strong>'+esc(labels.lesson)+' '+esc(lesson.code)+' · '+esc(title)+'</strong><span>'+esc(duration)+' · '+esc(level)+' · '+esc(access)+'</span></a>';
      }).join("")+'</div></section>';
    }).join("");
  }).catch(() => { root.innerHTML = '<p class="muted">'+esc(labels.empty)+'</p>'; });
})();