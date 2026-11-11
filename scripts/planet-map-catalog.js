(() => {
  const universe = document.querySelector("[data-planets-root]");
  const list = document.querySelector("[data-planets-list]");
  if (!universe || !list) return;
  const locale = (document.documentElement.lang || "ru").toLowerCase().startsWith("zh") ? "zh" :
    (document.documentElement.lang || "ru").toLowerCase().startsWith("en") ? "en" : "ru";
  const ui = {
    ru:{empty:"В каталоге пока нет подготовленных уроков.",error:"Не удалось загрузить каталог планет.",theme:"ТЕМА",module:"МОДУЛЬ",lesson:"УРОК",level:"Начальный уровень",outcomes:"После урока вы сможете",prereq:"Предварительная подготовка не требуется.",code:"Код урока",access:"Доступ",open:"Открытый урок",start:"Начать урок ↗",about:"О Track A",select:"Показать на карте",openLink:"Открыть урок ↗",published:"опубликовано",review:"на проверке",planetCount:"планет опубликовано",reviewNote:"Материал подготовлен и проходит проверку"},
    en:{empty:"No prepared lessons in the catalogue yet.",error:"The lesson catalogue could not be loaded.",theme:"THEME",module:"MODULE",lesson:"LESSON",level:"Beginner",outcomes:"After this lesson, you will be able to",prereq:"No prerequisites required.",code:"Lesson code",access:"Access",open:"Open lesson",start:"Start lesson ↗",about:"About Track A",select:"Show on map",openLink:"Open lesson ↗",published:"published",review:"under review",planetCount:"published planets",reviewNote:"Content prepared and under review"},
    zh:{empty:"目录中暂无已准备的课程。",error:"无法加载课程目录。",theme:"主题",module:"模块",lesson:"课程",level:"初级",outcomes:"完成课程后，你将能够",prereq:"无需先修知识。",code:"课程代码",access:"访问权限",open:"免费课程",start:"开始学习 ↗",about:"关于 Track A",select:"在地图上显示",openLink:"打开课程 ↗",published:"已发布",review:"审核中",planetCount:"颗已发布行星",reviewNote:"课程内容已准备，正在审核"}
  }[locale];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const statusStyle = document.createElement("style"); statusStyle.textContent=".lesson-review-status{color:#f0c878;font-weight:700}.lesson-published-status{color:#8fd7b2;font-weight:700}"; document.head.appendChild(statusStyle);
  const positions = [[50,49],[72,31],[28,30],[72,68],[28,68],[50,87]];
  const descriptions = {
    "1.1.1":{ru:"Что такое искусственный интеллект, как устроены AI-системы и где проходят границы их возможностей.",en:"What artificial intelligence means, how AI systems work, and where their capabilities end.",zh:"人工智能的含义、AI 系统的工作方式及其能力边界。"},
    "1.1.2":{ru:"История развития искусственного интеллекта: ключевые идеи, подходы и этапы.",en:"A concise history of artificial intelligence, its key ideas, approaches and milestones.",zh:"人工智能发展历程中的关键思想、方法与里程碑。"},
    "1.1.3":{ru:"Сравнение явных правил и логического вывода с обучением закономерностям по данным.",en:"Compare explicit rules and logical inference with learning patterns from data.",zh:"比较显式规则、逻辑推理与从数据中学习规律的方法。"},
    "1.1.4":{ru:"Разбираем различия AI, Machine Learning и Deep Learning и их взаимосвязь.",en:"Understand the differences and relationships between AI, machine learning and deep learning.",zh:"理解人工智能、机器学习与深度学习之间的区别和联系。"}
  };
  const renderDetails = (lesson, theme, module) => {
    const details = document.querySelector("#planetDetails");
    if (!details) return;
    const title = lesson.title_i18n?.[locale] || lesson.title;
    const themeTitle = theme.title_i18n?.[locale] || theme.title;
    const moduleTitle = module.title_i18n?.[locale] || module.title;
    const prerequisites = (lesson.prerequisite_uids || []).map(uid => allLessons.find(x=>x.uid===uid)?.code).filter(Boolean);
    const prereqText = prerequisites.length ? (locale==="ru"?"Рекомендуется предварительно пройти: ":locale==="zh"?"建议先学习：":"Recommended first: ") + prerequisites.join(", ") + "." : ui.prereq;
    const outcomes = (lesson.learning_outcomes || []).map(x=>'<li>'+esc(x)+'</li>').join("");
    const href = lesson.url_i18n?.[locale] || "#";
    details.innerHTML =
      '<div class="side-top"><span class="side-tag">TRACK A · '+esc(ui.theme)+' '+esc(theme.number)+' · '+esc(ui.module)+' '+esc(module.number)+'</span><span class="level">'+esc(ui.level)+'</span></div>'+
      '<p class="side-tag">'+esc(ui.lesson)+' '+esc(lesson.code)+'</p><h2>'+esc(title)+'</h2><p class="side-desc">'+esc(descriptions[lesson.code]?.[locale] || "")+'</p>'+
      (outcomes ? '<div class="side-divider"></div><span class="side-heading">'+esc(ui.outcomes)+'</span><ul class="outcomes">'+outcomes+'</ul>' : '')+
      '<p class="side-desc">'+esc(prereqText)+'</p><div class="meta-grid">'+
      '<div class="meta-item"><small>'+esc(ui.code)+'</small><strong>'+esc(lesson.code)+'</strong></div>'+
      '<div class="meta-item"><small>'+esc(ui.access)+'</small><strong>'+esc(ui.open)+'</strong></div></div>'+
      '<div class="side-actions"><a class="button primary" href="../'+esc(href)+'">'+esc(ui.start)+'</a><a class="button secondary" href="../tracks/understanding-ai'+(locale==="ru"?"":locale==="en"?"-en":"-zh")+'.html">'+esc(ui.about)+'</a></div>';
    universe.querySelectorAll("[data-lesson-id]").forEach(node=>node.setAttribute("aria-pressed",String(node.dataset.lessonId===lesson.uid)));
  };
  let allLessons = [];
  const load = async () => {
    try {
      const response = await fetch("../data/catalog/catalog-v3.json");
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      if (data.schema_version !== 3) throw new Error("Unsupported catalogue schema");
      const tracks = new Map(data.tracks.map(x=>[x.uid,x]));
      const themes = new Map(data.themes.map(x=>[x.uid,x]));
      const modules = new Map(data.modules.map(x=>[x.uid,x]));
      allLessons = data.lessons;
      const track = tracks.get("trk-a");
      const sortByCode = (a,b) => a.code.localeCompare(b.code,"en",{numeric:true});
      const publishedLessons = data.lessons.filter(x=>x.track_uid==="trk-a"&&x.status==="published"&&x.content_state==="published"&&x.url_i18n?.[locale]).sort(sortByCode);
      const reviewLessons = data.lessons.filter(x=>x.track_uid==="trk-a"&&x.status==="review"&&x.content_state==="localized"&&x.url_i18n?.[locale]).sort(sortByCode);
      const listedLessons = [...publishedLessons,...reviewLessons].sort(sortByCode);
      if (!listedLessons.length) { list.innerHTML='<p class="map-note">'+esc(ui.empty)+'</p>'; return; }
      universe.querySelectorAll("[data-generated-planet]").forEach(node=>node.remove());
      const entries = publishedLessons.map((lesson,index)=>{
        const module=modules.get(lesson.module_uid),theme=themes.get(lesson.theme_uid);
        const title=lesson.title_i18n?.[locale]||lesson.title;
        const href=lesson.url_i18n?.[locale];
        const position=positions[index%positions.length];
        const button=document.createElement("button");
        button.type="button";button.className="planet-button";button.style.left=position[0]+"%";button.style.top=position[1]+"%";
        button.dataset.lessonId=lesson.uid;button.dataset.generatedPlanet="true";
        button.setAttribute("aria-label",ui.select+" "+lesson.code+": "+title);
        button.innerHTML='<span class="planet-core"><span style="font:800 11px Manrope">'+esc(lesson.code)+'</span></span><span class="planet-code">'+esc(lesson.code)+'</span><span class="planet-name">'+esc(title)+'</span>';
        button.addEventListener("click",()=>{renderDetails(lesson,theme,module);if(matchMedia("(max-width:900px)").matches)document.querySelector("#planetDetails")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});});
        universe.appendChild(button);
        return {lesson,module,theme,href,title};
      });
      const entryByUid = new Map(entries.map(entry=>[entry.lesson.uid,entry]));
      const reviewItems = reviewLessons.map(lesson=>({lesson,module:modules.get(lesson.module_uid),theme:themes.get(lesson.theme_uid),href:lesson.url_i18n[locale],title:lesson.title_i18n?.[locale]||lesson.title,review:true}));
      const allItems = [...entries,...reviewItems].sort((a,b)=>sortByCode(a.lesson,b.lesson));
      list.innerHTML='<div class="side-top"><strong>Track A · '+esc(track?.title || "Understanding AI")+'</strong><span class="level">'+publishedLessons.length+' '+esc(ui.planetCount)+'</span></div>'+
        allItems.map(({lesson,module,theme,href,title,review})=>'<div class="list-entry"><div><strong>'+esc(lesson.code)+' — '+esc(title)+'</strong><small>'+esc(ui.theme)+' '+esc(theme?.number ?? "")+' · '+esc(ui.module)+' '+esc(module?.number ?? "")+' · '+(review?'<span class="lesson-review-status">'+esc(ui.review)+'</span>':'<span class="lesson-published-status">'+esc(ui.published)+'</span>')+(review?'<br>'+esc(ui.reviewNote):'')+'</small></div><div class="list-actions">'+(review?'':'<button type="button" data-select-lesson="'+esc(lesson.uid)+'">'+esc(ui.select)+'</button>')+'<a class="button secondary" href="../'+esc(href)+'">'+esc(ui.openLink)+'</a></div></div>').join("");
      list.querySelectorAll("[data-select-lesson]").forEach(button=>button.addEventListener("click",()=>{
        const entry=entryByUid.get(button.dataset.selectLesson);
        if(entry)renderDetails(entry.lesson,entry.theme,entry.module);
        document.getElementById("mapMode")?.click();
        universe.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
      }));
      const first=entries[0];if(first)renderDetails(first.lesson,first.theme,first.module);
    } catch(error) { list.innerHTML='<p class="map-note">'+esc(ui.error)+' '+esc(error.message)+'</p>'; }
  };
  load();
})();