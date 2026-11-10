(() => {
  const universe=document.querySelector("[data-planets-root]"),list=document.querySelector("[data-planets-list]");
  if(!universe||!list)return;
  const raw=document.documentElement.lang||"ru",locale=raw.toLowerCase().startsWith("zh")?"zh":raw.toLowerCase().startsWith("en")?"en":"ru";
  const ui={
    ru:{lesson:"Урок",theme:"ТЕМА",module:"МОДУЛЬ",duration:"Длительность",pending:"уточняется",access:"Доступ",open:"Открытый урок",start:"Начать урок ↗",map:"Показать на карте",published:"опубликовано",empty:"Опубликованных уроков пока нет.",minutes:"минут",outcomes:"Материалы урока"},
    en:{lesson:"Lesson",theme:"THEME",module:"MODULE",duration:"Duration",pending:"to be confirmed",access:"Access",open:"Open lesson",start:"Start lesson ↗",map:"Show on map",published:"published",empty:"No published lessons yet.",minutes:"min",outcomes:"Lesson materials"},
    zh:{lesson:"课程",theme:"主题",module:"模块",duration:"时长",pending:"待确认",access:"访问权限",open:"免费课程",start:"开始学习 ↗",map:"在地图中显示",published:"已发布",empty:"暂无已发布课程。",minutes:"分钟",outcomes:"课程内容"}
  }[locale];
  const titles={
    "1.1.1":{en:"What Is Artificial Intelligence?",zh:"什么是人工智能？"},
    "1.1.2":{en:"A Brief History of Artificial Intelligence",zh:"人工智能发展简史"},
    "1.1.3":{en:"Symbolic AI and Machine Learning",zh:"符号人工智能与机器学习"},
    "1.1.4":{en:"AI, Machine Learning and Deep Learning",zh:"人工智能、机器学习与深度学习"}
  };
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const catalog=window.DCHCatalogCompat;
  if(!catalog){list.textContent=ui.empty;return;}
  window.DCHCatalogCompat.load({baseUrl:"../data/catalog",schemaVersion:3}).then(data=>{
    const themes=new Map(data.themes.map(x=>[x.uid,x])),modules=new Map(data.modules.map(x=>[x.uid,x]));
    const lessons=data.lessons.filter(x=>x.track_uid==="trk-a"&&x.status==="published"&&x.content_state==="published").sort((a,b)=>a.code.localeCompare(b.code,undefined,{numeric:true}));
    if(!lessons.length){list.innerHTML='<p class="map-note">'+esc(ui.empty)+'</p>';return;}
    universe.querySelectorAll("[data-generated-planet]").forEach(x=>x.remove());
    const positions=[[50,25],[75,45],[50,68],[25,45]];
    lessons.forEach((lesson,i)=>{
      const button=document.createElement("button");button.type="button";button.className="planet-button";button.dataset.generatedPlanet="true";button.dataset.lessonUid=lesson.uid;
      button.style.left=positions[i%positions.length][0]+"%";button.style.top=positions[i%positions.length][1]+"%";
      const title=lesson.title_i18n?.[locale]||titles[lesson.code]?.[locale]||lesson.title;
      button.setAttribute("aria-label",ui.lesson+" "+lesson.code+": "+title);
      button.innerHTML='<span class="planet-core"><span>'+esc(lesson.code)+'</span></span><span class="planet-code">'+esc(lesson.code)+'</span><span class="planet-name">'+esc(title)+'</span>';
      button.addEventListener("click",()=>render(lesson));universe.appendChild(button);
    });
    function render(lesson){
      const theme=themes.get(lesson.theme_uid),module=modules.get(lesson.module_uid),title=lesson.title_i18n?.[locale]||titles[lesson.code]?.[locale]||lesson.title,href=lesson.url_i18n?.[locale]||lesson.url_i18n?.ru;
      const details=document.querySelector("#planetDetails");
      if(details)details.innerHTML='<p class="side-tag">'+esc(ui.theme)+' '+esc(theme?.number||"")+' · '+esc(ui.module)+' '+esc(module?.number||"")+'</p><h2>'+esc(ui.lesson)+' '+esc(lesson.code)+' · '+esc(title)+'</h2><div class="meta-grid"><div class="meta-item"><small>'+esc(ui.duration)+'</small><strong>'+esc(lesson.duration_min&&lesson.duration_max?(lesson.duration_min+"–"+lesson.duration_max+" "+ui.minutes):ui.pending)+'</strong></div><div class="meta-item"><small>'+esc(ui.access)+'</small><strong>'+esc(ui.open)+'</strong></div></div><div class="side-actions"><a class="button primary" href="../'+esc(href)+'">'+esc(ui.start)+'</a></div>';
      universe.querySelectorAll("[data-lesson-uid]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.lessonUid===lesson.uid)));
    }
    list.innerHTML='<div class="side-top"><strong>Track A · Understanding AI</strong><span class="level">'+lessons.length+' '+esc(ui.published)+'</span></div>'+lessons.map(lesson=>{
      const title=lesson.title_i18n?.[locale]||titles[lesson.code]?.[locale]||lesson.title,href=lesson.url_i18n?.[locale]||lesson.url_i18n?.ru;
      return '<div class="list-entry"><div><strong>'+esc(lesson.code)+' — '+esc(title)+'</strong><small>'+esc(ui.theme)+' 1 · '+esc(ui.module)+' 1 · '+esc(ui.duration)+': '+esc(ui.pending)+'</small></div><div class="list-actions"><button type="button" data-select-lesson="'+esc(lesson.uid)+'">'+esc(ui.map)+'</button><a class="button secondary" href="../'+esc(href)+'">'+esc(ui.start)+'</a></div></div>';
    }).join("");
    list.querySelectorAll("[data-select-lesson]").forEach(b=>b.addEventListener("click",()=>{const lesson=lessons.find(x=>x.uid===b.dataset.selectLesson);if(lesson)render(lesson);document.getElementById("mapMode")?.click();}));
    render(lessons[0]);
  }).catch(()=>{list.textContent=ui.empty;});
})();