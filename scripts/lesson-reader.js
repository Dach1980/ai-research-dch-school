(() => {
 const lesson=window.DCH_DEMO_LESSON;
 if(!lesson?.pages?.length)return;
 const i18n={
 ru:{contents:"Содержание",lessonProgress:"Прогресс урока",allLessons:"Все уроки",courseContents:"Содержание модуля",courseLabel:"ВВОДНЫЙ МОДУЛЬ",localProgress:"Прогресс сохраняется в этом браузере",previous:"Предыдущая",next:"Следующая",unavailable:"Перевод этой страницы пока не подготовлен.",themeDark:"☼ Светлая тема",themeLight:"☾ Тёмная тема"},
 en:{contents:"Contents",lessonProgress:"Lesson progress",allLessons:"All lessons",courseContents:"Module contents",courseLabel:"INTRODUCTORY MODULE",localProgress:"Progress is saved in this browser",previous:"Previous",next:"Next",unavailable:"A translation for this page is not available yet.",themeDark:"☼ Light theme",themeLight:"☾ Dark theme"},
 zh:{contents:"目录",lessonProgress:"课程进度",allLessons:"全部课程",courseContents:"模块目录",courseLabel:"导论模块",localProgress:"进度保存在当前浏览器",previous:"上一页",next:"下一页",unavailable:"此页面的翻译尚未准备好。",themeDark:"☼ 浅色主题",themeLight:"☾ 深色主题"}
 };
 const answers={q1:"a",q2:"c",q3:"a",q4:"c",q5:"c",q6:"a",q7:"c",q8:"c",q9:"b",q10:"2"};
 const explanations={
  ru:[
   "XAI изучает поведение модели и связь входов с прогнозом; сам прогноз не объясняет, как он получен.",
   "Объяснение — свидетельство для анализа, а не доказательство причинности, справедливости или правильности.",
   "MI исследует внутренние представления, компоненты и вычислительные цепочки.",
   "Local относится к одному объекту; global обобщает поведение на множестве объектов или модели.",
   "Model-agnostic не означает «подходит всегда»: нужен доступный интерфейс и корректные предположения метода.",
   "Permutation importance сравнивает выбранную метрику до и после перемешивания признака.",
   "PDP может исследовать сочетания значений, которых почти нет в данных, особенно при корреляции признаков.",
   "Среднее абсолютное значение SHAP по объектам даёт глобальную сводку силы вкладов, но не их направление.",
   "LIME строит простую модель, локально приближающую прогноз исходной модели.",
   "В формуле ровно два входа: debt_ratio и employment_norm."
  ],
  en:[
   "XAI studies model behaviour and the relation between inputs and predictions; the prediction alone does not explain how it was produced.",
   "An explanation is evidence for analysis, not proof of causality, fairness or correctness.",
   "MI investigates internal representations, components and computational pathways.",
   "Local refers to one instance; global summarises behaviour across instances or the model.",
   "Model-agnostic does not mean universally applicable: an accessible interface and method assumptions still matter.",
   "Permutation importance compares a chosen metric before and after shuffling a feature.",
   "PDP may evaluate combinations rarely found in the data, especially when features are correlated.",
   "Mean absolute SHAP values across instances summarise attribution magnitude, but not direction.",
   "LIME fits a simple model that locally approximates the original model's prediction.",
   "The formula has two inputs: debt_ratio and employment_norm."
  ],
  zh:[
   "XAI 研究模型行为以及输入与预测之间的关系；单独的预测结果并不能说明它如何产生。",
   "解释是分析证据，不是因果性、公平性或正确性的证明。",
   "MI 研究模型内部表示、组件和计算路径。",
   "Local 指单个样本；Global 汇总多个样本或模型整体的行为。",
   "Model-agnostic 并不意味着任何情况下都适用；仍需可用接口并满足方法假设。",
   "Permutation importance 比较打乱某个特征前后指定指标的变化。",
   "特征相关时，PDP 可能评估数据中很少出现的特征组合。",
   "跨样本的 SHAP 绝对值均值可以汇总归因强度，但不表示方向。",
   "LIME 拟合一个在局部近似原模型预测的简单模型。",
   "公式有两个输入：debt_ratio 和 employment_norm。"
  ]
 };
 const $=id=>document.getElementById(id), buttons=[...document.querySelectorAll("[data-lang]")];
 const storageKey="dch-reader:"+lesson.id;
 let language="ru",current=0,state={read:[],positions:{},quiz:{}},frame=0;
 function loadState(){try{const value=JSON.parse(localStorage.getItem(storageKey)||"{}");state={read:Array.isArray(value.read)?value.read:[],positions:value.positions||{},quiz:value.quiz||{}};}catch(_){state={read:[],positions:{},quiz:{}};}}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(_){}}
 try{const saved=localStorage.getItem("dch-language");if(i18n[saved])language=saved;}catch(_){}
 loadState();
 const t=key=>i18n[language][key]||i18n.ru[key]||key;
 let theme="dark";try{const savedTheme=localStorage.getItem("dch-theme");if(savedTheme==="light"||savedTheme==="dark")theme=savedTheme;}catch(_){}
 function applyTheme(){document.documentElement.dataset.theme=theme;const b=$("theme-toggle");if(b){b.textContent=t(theme==="dark"?"themeDark":"themeLight");b.setAttribute("aria-label",t(theme==="dark"?"themeDark":"themeLight"));b.setAttribute("aria-pressed",String(theme==="light"));}}
 const title=p=>p.title[language]||p.title.ru;
 const done=id=>state.read.includes(id);
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function renderToc(){
  const nav=$("page-toc");nav.replaceChildren();
  lesson.pages.forEach((p,index)=>{const b=document.createElement("button");b.type="button";b.className="toc-item"+(done(p.id)?" is-read":"");b.setAttribute("aria-current",index===current?"page":"false");const n=document.createElement("span");n.className="toc-number";n.textContent=String(index+1).padStart(2,"0");const label=document.createElement("span");label.textContent=title(p);const dot=document.createElement("i");dot.className="toc-state";dot.setAttribute("aria-hidden","true");b.append(n,label,dot);b.addEventListener("click",()=>go(index));nav.append(b);});
 }
 function updateProgress(fraction=0){
  const completed=lesson.pages.filter((p,i)=>i!==current&&done(p.id)).length;
  const currentPart=done(lesson.pages[current].id)?1:fraction;
  const pct=Math.round((completed+currentPart)/lesson.pages.length*100);
  $("progress-value").textContent=pct+"%";$("progress-fill").style.width=pct+"%";$("progress-track").setAttribute("aria-valuenow",String(pct));
 }
 function pageFraction(){
  const el=$("page-content"),rect=el.getBoundingClientRect();
  const visible=Math.max(0,window.innerHeight-rect.top);
  return clamp(visible/Math.max(el.scrollHeight,1),0,1);
 }
 function renderPage(restore=true){
  const p=lesson.pages[current],html=p.content[language]||"";
  $("sidebar-course-title").textContent=lesson.module[language]||lesson.module.ru;
  $("lesson-module").textContent=(lesson.module[language]||lesson.module.ru).toLocaleUpperCase(language==="zh"?"zh-CN":language);
  $("lesson-duration").textContent=lesson.duration[language]||lesson.duration.ru;
  $("page-title").textContent=title(p);$("page-content").innerHTML=html;
  if(lesson.id==="xai-01-what-and-why"&&current===lesson.pages.length-1){
   const messages={ru:{title:"Продолжайте обучение в DCH School",body:"Эта глава завершает открытую вводную часть. Создайте аккаунт, чтобы открыть следующие бесплатные материалы и отслеживать обучение.",cta:"Создать бесплатный аккаунт →"},en:{title:"Continue learning at DCH School",body:"This chapter completes the open introduction. Create an account to unlock the next free lessons and keep track of your learning.",cta:"Create a free account →"},zh:{title:"继续在 DCH School 学习",body:"本章结束了公开入门部分。创建账户即可解锁后续免费课程并跟踪学习进度。",cta:"创建免费账户 →"}};
   const m=messages[language]||messages.ru,box=document.createElement("section");box.className="registration-invitation";
   const h=document.createElement("h2");h.textContent=m.title;const pText=document.createElement("p");pText.textContent=m.body;
   const a=document.createElement("a");a.className="page-button primary";a.textContent=m.cta;
   const target=new URL("../../auth/index.html",location.href);target.searchParams.set("mode","register");target.searchParams.set("next",new URL("../index.html",location.href).pathname);a.href=target.href;
   box.append(h,pText,a);$("page-content").append(box);
  }
  $("translation-notice").hidden=!!html;$("translation-notice").textContent=t("unavailable");
  $("page-counter").textContent=(current+1)+" / "+lesson.pages.length;
  $("prev-page").disabled=current===0;$("next-page").disabled=current===lesson.pages.length-1;
  renderToc();updateProgress(0);document.title=title(p)+" — AI Research DCH School";
  restorePosition();
  if(restore){const y=state.positions[language+":"+p.id]||0;window.scrollTo({top:y,behavior:"auto"});}
  renderQuizState();
 }
 function restorePosition(){/* keeps layout deterministic before scroll restoration */}
 function go(index){
  if(index<0||index>=lesson.pages.length||index===current)return;
  const old=lesson.pages[current];if(!done(old.id))state.read.push(old.id);
  state.positions[language+":"+old.id]=window.scrollY;save();current=index;closeToc();renderPage(false);
  window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 }
 function onScroll(){
  if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const p=lesson.pages[current],fraction=pageFraction();
   state.positions[language+":"+p.id]=window.scrollY;
   if(fraction>=.9&&!done(p.id)){state.read.push(p.id);renderToc();}
   updateProgress(fraction);save();
  });
 }
 function setLanguage(next){
  if(!i18n[next])return;
  if(next!==language){state.positions[language+":"+lesson.pages[current].id]=window.scrollY;save();}
  language=next;try{localStorage.setItem("dch-language",language);}catch(_){}
  document.documentElement.lang=language==="zh"?"zh-CN":language;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(t(key))el.textContent=t(key);});
  buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===language)));
  applyTheme();renderPage(true);
 }
 function openToc(){$("reader-sidebar").classList.add("is-open");$("toc-backdrop").classList.add("is-visible");$("toc-open").setAttribute("aria-expanded","true");$("toc-close").focus();}
 function closeToc(){$("reader-sidebar").classList.remove("is-open");$("toc-backdrop").classList.remove("is-visible");$("toc-open").setAttribute("aria-expanded","false");}
 function renderQuizState(){
  document.querySelectorAll(".knowledge-check").forEach(form=>{
   const id=form.dataset.quiz;const saved=state.quiz[id]||{};
   Object.entries(saved).forEach(([name,value])=>{const input=form.elements.namedItem(name);if(input){if(input.length){[...input].forEach(x=>x.checked=x.value===value);}else input.value=value;}});
   const feedback=form.querySelector(".quiz-feedback");
   if(feedback&&saved.submitted){const result=scoreQuiz(id,saved);renderQuizFeedback(feedback,result);}
  });
  const summary=document.getElementById("quiz-summary");
  if(summary){const groups=[state.quiz["1"],state.quiz["2"]].filter(Boolean);let correct=0,answered=0;groups.forEach(group=>Object.entries(group).forEach(([key,value])=>{if(!/^q\d+$/.test(key)||value==="")return;answered++;if(key==="q10"?Math.abs(Number(value)-2)<1e-9:String(value)===answers[key])correct++;}));const labels={ru:"Общий результат самопроверки",en:"Overall self-check result",zh:"自测总成绩"};summary.textContent=groups.length===2?labels[language]+": "+correct+" / 10":(language==="ru"?"Выполнено частей: "+groups.length+" из 2 · ответов: "+answered+" из 10":language==="en"?"Parts completed: "+groups.length+" of 2 · answers: "+answered+" of 10":"已完成部分："+groups.length+" / 2 · 已答题目："+answered+" / 10");}
 }
 function renderQuizFeedback(container,result){
  container.replaceChildren();
  const summary=document.createElement("p");summary.textContent=result.text;container.append(summary);
  const list=document.createElement("ul");
  result.details.forEach(detail=>{const item=document.createElement("li");item.textContent=detail;list.append(item);});
  container.append(list);container.classList.add("is-visible");
 }
 function scoreQuiz(id,saved){
  const fields=id==="1"?["q1","q2","q3","q4","q5"]:["q6","q7","q8","q9","q10"];
  let score=0,answered=0;const details=[];
  const labels={ru:{correct:"Верно",incorrect:"Неверно",total:"Правильных ответов"},en:{correct:"Correct",incorrect:"Not quite",total:"Correct answers"},zh:{correct:"正确",incorrect:"需要复习",total:"正确答案"}};
  fields.forEach(k=>{
   if(saved[k]===undefined||saved[k]==="")return;
   answered++;
   const correct=k==="q10"?Math.abs(Number(saved[k])-2)<1e-9:String(saved[k]).trim().toLowerCase()===answers[k];
   if(correct)score++;
   const index=Number(k.slice(1))-1;
   details.push(k.toUpperCase()+" — "+(correct?labels[language].correct:labels[language].incorrect)+". "+explanations[language][index]);
  });
  return {score,details,text:labels[language].total+": "+score+" / 5"+(answered<5?" · "+(language==="ru"?"Ответьте на все вопросы для полного результата":language==="en"?"Answer all questions for a complete result":"请完成所有题目以获得完整结果"):"")};
 }
 document.addEventListener("submit",event=>{
  const form=event.target.closest(".knowledge-check");if(!form)return;event.preventDefault();
  const id=form.dataset.quiz,fields=id==="1"?["q1","q2","q3","q4","q5"]:["q6","q7","q8","q9","q10"],saved={};
  fields.forEach(name=>{const el=form.elements.namedItem(name);saved[name]=el?(el.length?[...el].find(x=>x.checked)?.value||"":el.value):"";});
  if(fields.some(k=>saved[k]==="")){const msg={ru:"Пожалуйста, ответьте на все пять вопросов этой страницы.",en:"Please answer all five questions on this page.",zh:"请回答本页全部五道题。"};form.querySelector(".quiz-feedback").textContent=msg[language];form.querySelector(".quiz-feedback").classList.add("is-visible");return;}
  saved.submitted=true;state.quiz[id]=saved;save();const result=scoreQuiz(id,saved),feedback=form.querySelector(".quiz-feedback");
  renderQuizFeedback(feedback,result);
  const btn=form.querySelector(".quiz-submit");btn.textContent=language==="ru"?"Ответы сохранены":language==="en"?"Answers saved":"答案已保存";
 });
 $("theme-toggle")?.addEventListener("click",()=>{theme=theme==="dark"?"light":"dark";try{localStorage.setItem("dch-theme",theme);}catch(_){}applyTheme();});
 $("prev-page").addEventListener("click",()=>go(current-1));$("next-page").addEventListener("click",()=>go(current+1));
 $("toc-open").addEventListener("click",openToc);$("toc-close").addEventListener("click",closeToc);$("toc-backdrop").addEventListener("click",closeToc);
 buttons.forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang)));
 window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",()=>updateProgress(pageFraction()));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeToc();const target=e.target,typing=target&&(target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(target.tagName));if(typing||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==="ArrowLeft"){e.preventDefault();go(current-1);}if(e.key==="ArrowRight"){e.preventDefault();go(current+1);}});
 setLanguage(language);
})();