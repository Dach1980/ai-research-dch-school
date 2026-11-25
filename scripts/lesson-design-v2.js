(function(){
"use strict";
const main=document.querySelector('main.lesson[data-lesson-design="v2"]');
if(!main||!window.DCHLessonPlanet)return;
const hero=main.querySelector(":scope > .lesson-standard-hero"),article=main.querySelector(":scope > .lesson-standard-article"),old=main.querySelector(":scope > .lesson-planet-banner"),outcomes=hero?.querySelector(":scope > #lesson-outcomes");
const title=hero?.querySelector(":scope > h1"),lead=hero?.querySelector(":scope > .lead"),eyebrow=hero?.querySelector(":scope > .eyebrow"),meta=hero?.querySelector(":scope > .lesson-meta");
if(!hero||!article||!old||!title||!lead||!eyebrow||!outcomes)return;
const lang=(document.documentElement.lang||"ru").slice(0,2);
const labels={
ru:{start:"Начать изучение",practice:"К практике",toc:"Содержание урока",progress:"Прокрутка урока",pause:"Приостановить анимацию",resume:"Возобновить анимацию",reduced:"Анимация отключена системой",show:"Показать результаты обучения",hide:"Скрыть результаты обучения"},
en:{start:"Start learning",practice:"Go to practice",toc:"Lesson contents",progress:"Reading scroll",pause:"Pause animation",resume:"Resume animation",reduced:"Animation disabled by system",show:"Show learning outcomes",hide:"Hide learning outcomes"},
zh:{start:"开始学习",practice:"前往练习",toc:"课程目录",progress:"阅读滚动进度",pause:"暂停动画",resume:"继续动画",reduced:"系统已关闭动画",show:"显示学习成果",hide:"隐藏学习成果"}
}[lang]||{};
const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e;};
const sections=Array.from(article.querySelectorAll("#lesson-sections > section, #lesson-practice, #lesson-sources, #lesson-glossary, #lesson-quiz")).filter(s=>s.id&&s.querySelector("h2"));
if(!sections.length)return;
const code=old.querySelector(".lesson-planet-sphere")?.textContent.trim()||eyebrow.textContent.match(/\d+\.\d+\.\d+/)?.[0]||"AI";
const intro=make("div","dch-v2-intro"),copy=make("div","dch-v2-copy"),actions=make("div","dch-v2-actions");
function anchor(target,txt,cls){const a=make("a",cls,txt);a.href="#"+target.id;return a;}
actions.append(anchor(sections[0],labels.start,"dch-v2-primary"));
const practice=article.querySelector("#lesson-practice");if(practice)actions.append(anchor(practice,labels.practice,"dch-v2-secondary"));
[eyebrow,title,lead,meta].filter(Boolean).forEach(n=>copy.append(n));copy.append(actions);
intro.append(copy,window.DCHLessonPlanet.create(code,labels));hero.insertBefore(intro,outcomes);old.remove();
const list=outcomes.querySelector(":scope > ul, :scope > ol"),heading=outcomes.querySelector(":scope > h2");
if(list&&heading){if(!list.id)list.id="dch-v2-outcomes-list";const toggle=make("button","dch-v2-outcomes-toggle",labels.hide);toggle.type="button";toggle.setAttribute("aria-controls",list.id);toggle.setAttribute("aria-expanded","true");heading.after(toggle);toggle.addEventListener("click",()=>{list.hidden=!list.hidden;toggle.setAttribute("aria-expanded",String(!list.hidden));toggle.textContent=list.hidden?labels.show:labels.hide;});}
const sidebar=make("aside","dch-v2-sidebar"),details=make("details","dch-v2-toc"),summary=make("summary","",labels.toc),nav=make("nav","dch-v2-toc-nav");
nav.setAttribute("aria-label",labels.toc);details.open=window.matchMedia("(min-width: 1050px)").matches;
const links=sections.map(s=>{const a=anchor(s,s.querySelector("h2").textContent.trim(),"dch-v2-toc-link");nav.append(a);return a;});
const progress=make("progress","dch-v2-progress");progress.max=100;progress.value=0;progress.setAttribute("aria-label",labels.progress);
const read=make("p","dch-v2-progress-label");read.textContent=labels.progress+" · 0%";
details.append(summary,read,progress,nav);sidebar.append(details);main.insertBefore(sidebar,article);
links.forEach(a=>a.addEventListener("click",()=>{if(window.matchMedia("(max-width:1049px)").matches)details.open=false;}));
let pending=false;function update(){pending=false;const rect=article.getBoundingClientRect(),start=window.scrollY+rect.top,range=Math.max(1,rect.height-window.innerHeight);const pct=Math.round(100*Math.max(0,Math.min(1,(window.scrollY-start)/range)));progress.value=pct;read.textContent=labels.progress+" · "+pct+"%";let active=0;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<=140)active=i;});links.forEach((a,i)=>{if(i===active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);if("ResizeObserver" in window)new ResizeObserver(schedule).observe(article);main.dataset.designReady="true";schedule();
})();
