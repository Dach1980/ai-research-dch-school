(() => {
  const universe = document.querySelector("[data-planets-root]");
  const list = document.querySelector("[data-planets-list]");
  if (!universe || !list) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const positions = {
    "A.1":[50,49],"A.2":[72,31],"A.3":[28,30],
    "A.4":[72,68],"A.5":[28,68],"A.6":[50,87],"A.7":[50,20],"A.8":[50,38]
  };
  const descriptions = {
    "A.7": "История развития AI: от математических предпосылок и Дартмутского семинара до глубокого обучения и генеративных моделей.",
    "A.8": "Сравниваем явные правила, логический вывод, машинное обучение и гибридные AI-системы.",
    "A.1": "Первая остановка в изучении AI: определение искусственного интеллекта, устройство AI-систем, основные подходы и границы возможностей.",
    "A.2": "Разбираем различия Artificial Intelligence, Machine Learning и Deep Learning, их взаимосвязь и примеры систем.",
    "A.3": "Исследуем, как алгоритм обучения использует примеры, настраивает параметры модели и почему важно обобщение на новые данные.",
    "A.4": "Изучаем архитектуру модели, параметры и гиперпараметры, различия training и inference, а также место модели в AI-системе.",
    "A.5": "Учимся честно оценивать качество: разделять данные, выбирать метрики, анализировать ошибки, дисбаланс классов и утечку данных.",
    "A.6": "Изучаем обобщающую способность, недообучение и переобучение; читаем learning curves и выбираем способы улучшения модели."
  };
  const renderDetails = (lesson, selectedId, theme, module, track) => {
    const details = document.querySelector("#planetDetails");
    if (!details) return;
    const legacy = lesson.legacy_id || lesson.id;
    const displayCode = lesson.v3_target_codes && lesson.v3_target_codes.length === 1 ? lesson.v3_target_codes[0] : lesson.id;
    const info = descriptions[legacy] || "Опубликованный учебный материал Track A.";
    const prerequisiteLabels = {"A.1.1.1":"1.1.1","A.1.1.7":"1.1.2","A.7":"1.1.2"};
    const prerequisiteText = (lesson.prerequisites || []).map(id=>prerequisiteLabels[id]||id).join(", ");
    const prerequisites = (lesson.prerequisites || []).length
      ? "Рекомендуется предварительно пройти: " + prerequisiteText + "."
      : "Предварительная подготовка не требуется.";
    details.innerHTML =
      '<div class="side-top"><span class="side-tag">TRACK '+esc(track.code)+' · THEME '+esc(theme.id.split('.').pop())+' · MODULE '+esc(module.id.split('.').pop())+'</span><span class="level">'+esc(lesson.level === "beginner" ? "Начальный уровень" : lesson.level)+'</span></div>'+
      '<p class="side-tag">УРОК '+esc(displayCode)+'</p><h2>'+esc(lesson.title_i18n?.ru || lesson.title)+'</h2><p class="side-desc">'+esc(info)+'</p>'+
      '<div class="side-divider"></div><span class="side-heading">После урока вы сможете</span>'+
      '<ul class="outcomes">'+(lesson.learning_outcomes||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
      '<p class="side-desc">'+esc(prerequisites)+'</p><div class="meta-grid">'+
      '<div class="meta-item"><small>Код урока</small><strong>'+esc(displayCode)+'</strong></div>'+
      '<div class="meta-item"><small>Длительность</small><strong>'+esc(lesson.duration_min+"–"+lesson.duration_max+" минут")+'</strong></div>'+
      '<div class="meta-item"><small>Предыдущий ID</small><strong>'+esc(lesson.legacy_id||"—")+'</strong></div>'+
      '<div class="meta-item"><small>Доступ</small><strong>'+esc(lesson.access==="open"?"Открытый урок":lesson.access)+'</strong></div></div>'+
      '<div class="side-actions"><a class="button primary" href="../'+esc(lesson.url)+'">Начать урок ↗</a><a class="button secondary" href="../tracks/understanding-ai.html">О Track A</a></div>';
    universe.querySelectorAll("[data-lesson-id]").forEach(node=>node.setAttribute("aria-pressed",String(node.dataset.lessonId===selectedId)));
  };
  const load = async () => {
    try {
      if (!window.DCHCatalogCompat) throw new Error("Не загружен адаптер каталога");
      const data = await window.DCHCatalogCompat.loadLegacyProjection({baseUrl:"../data/catalog"});
      const tracks = new Map(data.tracks.map(x=>[x.id,x]));
      const themes = new Map(data.themes.map(x=>[x.id,x]));
      const modules = new Map(data.modules.map(x=>[x.id,x]));
      const lessons = new Map(data.lessons.filter(x=>x.status==="published").map(x=>[x.id,x]));
      const planets = data.planets.filter(p=>lessons.has(p.lesson_id) && lessons.get(p.lesson_id).track_id==="track-a");
      if (!planets.length) { list.innerHTML='<p class="map-note">Опубликованных планет пока нет.</p>'; return; }
      universe.querySelectorAll("[data-generated-planet]").forEach(node=>node.remove());
      const entries = planets.map((planet,index)=>{
        const lesson=lessons.get(planet.lesson_id);
        const module=modules.get(lesson.module_id);
        const theme=themes.get(module.theme_id);
        const track=tracks.get(theme.track_id);
        const legacy=lesson.legacy_id||lesson.id;
        const displayCode=lesson.v3_target_codes&&lesson.v3_target_codes.length===1?lesson.v3_target_codes[0]:"Legacy";
        const position=positions[legacy]||[[50,49],[72,31],[28,30]][index%3];
        const button=document.createElement("button");
        button.type="button";button.className="planet-button";
        if(legacy==="A.2")button.classList.add("planet-a2");
        if(legacy==="A.4")button.classList.add("planet-a4");
        if(legacy==="A.5")button.classList.add("planet-a5");
        if(planet.accent_id==="teal")button.classList.add("planet-a3","planet-teal");
        if(planet.accent_id==="blue")button.classList.add("planet-blue");
        if(planet.accent_id==="violet")button.classList.add("planet-violet");
        button.style.left=position[0]+"%";button.style.top=position[1]+"%";
        button.dataset.lessonId=lesson.id;button.dataset.generatedPlanet="true";
        button.setAttribute("aria-label","Выбрать урок "+displayCode+": "+lesson.title);
        button.innerHTML='<span class="planet-core"><span style="font:800 11px Manrope">'+esc(displayCode)+'</span></span><span class="planet-code">'+esc(displayCode)+'</span><span class="planet-name">'+esc(lesson.title)+'</span>';
        button.addEventListener("click",()=>{renderDetails(lesson,lesson.id,theme,module,track);if(matchMedia("(max-width:900px)").matches){document.querySelector("#planetDetails")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}});
        universe.appendChild(button);
        return {planet,lesson,module,theme,track};
      });
      list.innerHTML='<div class="side-top"><strong>Track A · Understanding AI</strong><span class="level">'+entries.length+' опубликовано</span></div>'+
        entries.map(({lesson,module,theme})=>{
          const displayCode=lesson.v3_target_codes&&lesson.v3_target_codes.length===1?lesson.v3_target_codes[0]:lesson.id;
          return '<div class="list-entry"><div><strong>'+esc(displayCode)+' — '+esc(lesson.title)+'</strong><small>Theme '+esc(theme.id.split('.').pop())+' · Module '+esc(module.id.split('.').pop())+' · '+esc(lesson.duration_min+"–"+lesson.duration_max+" минут")+'</small></div><div class="list-actions"><button type="button" data-select-lesson="'+esc(lesson.id)+'">Показать на карте</button><a class="button secondary" href="../'+esc(lesson.url)+'">Открыть урок ↗</a></div></div>';
        }).join("");
      list.querySelectorAll("[data-select-lesson]").forEach(button=>button.addEventListener("click",()=>{
        const entry=entries.find(x=>x.lesson.id===button.dataset.selectLesson);
        if(entry)renderDetails(entry.lesson,entry.lesson.id,entry.theme,entry.module,entry.track);
        document.getElementById("mapMode")?.click();
        universe.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
      }));
      const first=entries[0];renderDetails(first.lesson,first.lesson.id,first.theme,first.module,first.track);
    } catch(error) {
      list.innerHTML='<p class="map-note">Не удалось загрузить каталог планет: '+esc(error.message)+'.</p>';
    }
  };
  load();
})();
