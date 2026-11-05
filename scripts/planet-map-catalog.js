(() => {
  const universe = document.querySelector("[data-planets-root]");
  const list = document.querySelector("[data-planets-list]");
  if (!universe || !list) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const positions = {"A.1":[50,49],"A.2":[72,31],"A.3":[28,30]};
  const descriptions = {
    "A.1": {text:"Первая остановка в изучении AI: определение искусственного интеллекта, устройство AI-систем, основные подходы и границы возможностей.", outcomes:["Объяснять понятие Artificial Intelligence","Различать интеллект и интеллектуальное поведение","Описывать основные подходы и ограничения AI"]},
    "A.2": {text:"Разбираем различия Artificial Intelligence, Machine Learning и Deep Learning, их взаимосвязь и примеры систем.", outcomes:["Различать AI, ML и DL","Объяснять вложенность этих понятий","Классифицировать системы по их механизму"]},
    "A.3": {text:"Исследуем, как алгоритм обучения использует примеры, настраивает параметры модели и почему важно обобщение на новые данные.", outcomes:["Различать данные, признаки и целевую переменную","Объяснять роль алгоритма обучения и функции потерь","Различать обучение и применение модели","Распознавать переобучение и утечку данных"]}
  };
  const renderDetails = (lesson, selectedId) => {
    const details = document.querySelector("#planetDetails");
    if (!details) return;
    const info = descriptions[lesson.id] || {text:"Опубликованный учебный материал Track A.",outcomes:[]};
    const prerequisites = (lesson.prerequisites || []).length
      ? "Рекомендуется предварительно пройти: " + lesson.prerequisites.join(", ") + "."
      : "Предварительная подготовка не требуется.";
    details.innerHTML =
      '<div class="side-top"><span class="side-tag">PLANET '+esc(lesson.id)+'</span><span class="level">'+esc(lesson.level === "beginner" ? "Начальный уровень" : lesson.level)+'</span></div>'+
      '<h2>'+esc(lesson.title)+'</h2><p class="side-desc">'+esc(info.text)+'</p>'+
      '<div class="side-divider"></div><span class="side-heading">После урока вы сможете</span>'+
      '<ul class="outcomes">'+info.outcomes.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
      '<p class="side-desc">'+esc(prerequisites)+'</p><div class="meta-grid">'+
      '<div class="meta-item"><small>Длительность</small><strong>'+esc(lesson.duration_min+"–"+lesson.duration_max+" минут")+'</strong></div>'+
      '<div class="meta-item"><small>Подготовка</small><strong>'+esc((lesson.prerequisites||[]).join(", ")||"Не требуется")+'</strong></div>'+
      '<div class="meta-item"><small>Формат</small><strong>Подробная лекция</strong></div>'+
      '<div class="meta-item"><small>Доступ</small><strong>'+esc(lesson.access==="open"?"Открытый урок":lesson.access)+'</strong></div></div>'+
      '<div class="side-actions"><a class="button primary" href="../'+esc(lesson.url)+'">Начать урок ↗</a><a class="button secondary" href="../tracks/understanding-ai.html">О Track A</a></div>';
    universe.querySelectorAll("[data-lesson-id]").forEach(node=>node.setAttribute("aria-pressed",String(node.dataset.lessonId===selectedId)));
  };
  const load = async () => {
    try {
      const responses = await Promise.all([
        fetch("../data/catalog/lessons.json",{cache:"no-store"}),
        fetch("../data/catalog/planets.json",{cache:"no-store"})
      ]);
      if (!responses[0].ok || !responses[1].ok) throw new Error("Не удалось загрузить JSON-каталог");
      const lessonData = await responses[0].json();
      const planetData = await responses[1].json();
      const lessons = new Map((lessonData.lessons||[]).filter(x=>x.status==="published").map(x=>[x.id,x]));
      const planets = (planetData.planets||[]).filter(p=>lessons.has(p.lesson_id));
      if (!planets.length) { list.innerHTML='<p class="map-note">Опубликованных планет пока нет.</p>'; return; }
      universe.querySelectorAll("[data-generated-planet]").forEach(node=>node.remove());
      planets.forEach((planet,index)=>{
        const lesson=lessons.get(planet.lesson_id);
        const position=positions[lesson.id]||[[50,49],[72,31],[28,30]][index%3];
        const button=document.createElement("button");
        button.type="button";
        button.className="planet-button";
        if(lesson.id==="A.2")button.classList.add("planet-a2");
        if(planet.accent_id==="teal")button.classList.add("planet-a3");
        if(planet.accent_id==="teal")button.classList.add("planet-teal");
        if(planet.accent_id==="blue")button.classList.add("planet-blue");
        if(planet.accent_id==="violet")button.classList.add("planet-violet");
        button.style.left=position[0]+"%";button.style.top=position[1]+"%";
        button.dataset.lessonId=lesson.id;button.dataset.generatedPlanet="true";
        button.setAttribute("aria-label","Выбрать планету "+lesson.id+": "+lesson.title);
        button.innerHTML='<span class="planet-core"><span style="font:800 14px Manrope">'+esc(lesson.id)+'</span></span><span class="planet-code">'+esc(lesson.id)+'</span><span class="planet-name">'+esc(lesson.title)+'</span>';
        button.addEventListener("click",()=>renderDetails(lesson,lesson.id));
        universe.appendChild(button);
      });
      list.innerHTML='<div class="side-top"><strong>Track A · Understanding AI</strong><span class="level">'+planets.length+' опубликовано</span></div>'+
        planets.map(planet=>{
          const lesson=lessons.get(planet.lesson_id);
          return '<div class="list-entry"><div><strong>'+esc(lesson.id)+' — '+esc(lesson.title)+'</strong><small>'+esc(lesson.level==="beginner"?"Начальный уровень":lesson.level)+' · '+esc(lesson.duration_min+"–"+lesson.duration_max+" минут")+'</small></div><div class="list-actions"><button type="button" data-select-lesson="'+esc(lesson.id)+'">Показать на карте</button><a class="button secondary" href="../'+esc(lesson.url)+'">Открыть урок ↗</a></div></div>';
        }).join("");
      list.querySelectorAll("[data-select-lesson]").forEach(button=>button.addEventListener("click",()=>{
        const lesson=lessons.get(button.dataset.selectLesson);
        if(lesson)renderDetails(lesson,lesson.id);
        const mapButton=document.getElementById("mapMode");
        if(mapButton)mapButton.click();
        universe.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
      }));
      renderDetails(lessons.get(planets[0].lesson_id),planets[0].lesson_id);
    } catch(error) {
      list.innerHTML='<p class="map-note">Не удалось загрузить каталог планет: '+esc(error.message)+'.</p>';
    }
  };
  load();
})();