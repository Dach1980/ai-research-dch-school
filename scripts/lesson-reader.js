(() => {
 const lesson=window.DCH_DEMO_LESSON;
 if(!lesson?.pages?.length)return;
 const i18n={
 ru:{contents:"Содержание",lessonProgress:"Прогресс урока",allLessons:"Все уроки",courseContents:"Содержание модуля",courseLabel:"ВВОДНЫЙ МОДУЛЬ",localProgress:"Прогресс сохраняется в этом браузере",previous:"Предыдущая",next:"Следующая",unavailable:"Перевод этой страницы пока не подготовлен."},
 en:{contents:"Contents",lessonProgress:"Lesson progress",allLessons:"All lessons",courseContents:"Module contents",courseLabel:"INTRODUCTORY MODULE",localProgress:"Progress is saved in this browser",previous:"Previous",next:"Next",unavailable:"A translation for this page is not available yet."},
 zh:{contents:"目录",lessonProgress:"课程进度",allLessons:"全部课程",courseContents:"模块目录",courseLabel:"导论模块",localProgress:"进度保存在当前浏览器",previous:"上一页",next:"下一页",unavailable:"此页面的翻译尚未准备好。"}
 };
 const answers={q1:"a",q2:"c",q3:"a",q4:"c",q5:"c",q6:"a",q7:"c",q8:"c",q9:"b",q10:"2"};
 const $=id=>document.getElementById(id), buttons=[...document.querySelectorAll("[data-lang]")];
 const storageKey="dch-reader:"+lesson.id;
 let language="ru",current=0,state={read:[],positions:{},quiz:{}},frame=0;
 function loadState(){try{const value=JSON.parse(localStorage.getItem(storageKey)||"{}");state={read:Array.isArray(value.read)?value.read:[],positions:value.positions||{},quiz:value.quiz||{}};}catch(_){state={read:[],positions:{},quiz:{}};}}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(_){}}
 try{const saved=localStorage.getItem("dch-language");if(i18n[saved])language=saved;}catch(_){}
 loadState();
 const t=key=>i18n[language][key]||i18n.ru[key]||key;
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
  if(!i18n[next])return;language=next;try{localStorage.setItem("dch-language",language);}catch(_){}
  document.documentElement.lang=language==="zh"?"zh-CN":language;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(t(key))el.textContent=t(key);});
  buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lang===language)));
  renderPage(true);
 }
 function openToc(){$("reader-sidebar").classList.add("is-open");$("toc-backdrop").classList.add("is-visible");$("toc-open").setAttribute("aria-expanded","true");$("toc-close").focus();}
 function closeToc(){$("reader-sidebar").classList.remove("is-open");$("toc-backdrop").classList.remove("is-visible");$("toc-open").setAttribute("aria-expanded","false");}
 function renderQuizState(){
  document.querySelectorAll(".knowledge-check").forEach(form=>{
   const id=form.dataset.quiz;const saved=state.quiz[id]||{};
   Object.entries(saved).forEach(([name,value])=>{const input=form.elements.namedItem(name);if(input){if(input.length){[...input].forEach(x=>x.checked=x.value===value);}else input.value=value;}});
   const feedback=form.querySelector(".quiz-feedback");
   if(feedback&&saved.submitted){const result=scoreQuiz(id,saved);feedback.textContent=result.text;feedback.classList.add("is-visible");}
  });
 }
 function scoreQuiz(id,saved){
  const fields=id==="1"?["q1","q2","q3","q4","q5"]:["q6","q7","q8","q9","q10"];
  let score=0,answered=0;fields.forEach(k=>{if(saved[k]!==undefined&&saved[k]!==""){answered++;if(String(saved[k]).trim().toLowerCase()===answers[k])score++;}});
  const labels={ru:"Правильных ответов",en:"Correct answers",zh:"正确答案"};
  return {score,text:labels[language]+": "+score+" / 5"+(answered<5?" · "+(language==="ru"?"Ответьте на все вопросы для полного результата":language==="en"?"Answer all questions for a complete result":"请完成所有题目以获得完整结果"):"")};
 }
 document.addEventListener("submit",event=>{
  const form=event.target.closest(".knowledge-check");if(!form)return;event.preventDefault();
  const id=form.dataset.quiz,fields=id==="1"?["q1","q2","q3","q4","q5"]:["q6","q7","q8","q9","q10"],saved={};
  fields.forEach(name=>{const el=form.elements.namedItem(name);saved[name]=el?(el.length?[...el].find(x=>x.checked)?.value||"":el.value):"";});
  if(fields.some(k=>saved[k]==="")){const msg={ru:"Пожалуйста, ответьте на все пять вопросов этой страницы.",en:"Please answer all five questions on this page.",zh:"请回答本页全部五道题。"};form.querySelector(".quiz-feedback").textContent=msg[language];form.querySelector(".quiz-feedback").classList.add("is-visible");return;}
  saved.submitted=true;state.quiz[id]=saved;save();const result=scoreQuiz(id,saved),feedback=form.querySelector(".quiz-feedback");
  feedback.textContent=result.text;feedback.classList.add("is-visible");
  const btn=form.querySelector(".quiz-submit");btn.textContent=language==="ru"?"Ответы сохранены":language==="en"?"Answers saved":"答案已保存";
 });
 $("prev-page").addEventListener("click",()=>go(current-1));$("next-page").addEventListener("click",()=>go(current+1));
 $("toc-open").addEventListener("click",openToc);$("toc-close").addEventListener("click",closeToc);$("toc-backdrop").addEventListener("click",closeToc);
 buttons.forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang)));
 window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",()=>updateProgress(pageFraction()));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeToc();const target=e.target,typing=target&&(target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(target.tagName));if(typing||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==="ArrowLeft"){e.preventDefault();go(current-1);}if(e.key==="ArrowRight"){e.preventDefault();go(current+1);}});
 setLanguage(language);
})();