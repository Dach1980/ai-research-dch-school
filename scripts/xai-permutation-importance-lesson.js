(function(){
"use strict";
const lesson=window.DCH_PERMUTATION_IMPORTANCE_LESSON;if(!lesson)return;
const lang=(document.documentElement.lang||"ru").toLowerCase();
const locale=lang.startsWith("zh")?"zh":lang.startsWith("en")?"en":"ru";
const pick=v=>v&&typeof v==="object"?(v[locale]||v.ru||""):v||"";
const labels=lesson.labels[locale];
const el=id=>document.getElementById(id);
el("lesson-title").textContent=pick(lesson.title);
el("lesson-lead").textContent=pick(lesson.lead);
document.title="7.2.2 — "+pick(lesson.title)+" — AI Research DCH School";
const outcomes=el("lesson-outcomes");const oh=document.createElement("h2");oh.textContent=labels.outcomes;const ul=document.createElement("ul");
lesson.outcomes[locale].forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li)});outcomes.append(oh,ul);
const sections=el("lesson-sections");
const svg=(type)=>{
 const first=type==="pfi-workflow";
 const c=locale==="ru"?{title:"Перестановочная важность признаков",desc:"Схематичное представление оценки модели после перестановки признаков.",caption:"Схема иллюстрирует различие между индивидуальной и групповой перестановкой; числовой шкалы нет.",scroll:"Прокручиваемая схема"}:locale==="zh"?{title:"特征置换重要性",desc:"模型在特征置换后的评估示意图。",caption:"该图比较单独置换与联合置换；不表示数值刻度。",scroll:"可滚动示意图"}:{title:"Permutation feature importance",desc:"Illustration of model evaluation after feature permutation.",caption:"The diagram contrasts individual and group permutation; it is not a numeric scale.",scroll:"Scrollable diagram"};
 const labels=locale==="ru"?(first?[["model","Обученная модель","и оценочная выборка"],["baseline","Исходная","метрика качества"],["shuffle","Перемешать","один столбец"],["drop","Измерить","падение метрики"]]:[["individual","Индивидуальная перестановка","Коррелирующий признак может компенсировать потерю информации"],["proxy","Резервная информация","Модель использует связанный признак"],["joint","Совместная перестановка","Перемешиваются оба связанных признака"],["group","Групповая информация","Совместная зависимость становится заметнее"]]):locale==="zh"?(first?[["model","已训练模型","与评估数据"],["baseline","基准","模型指标"],["shuffle","打乱","一个特征列"],["drop","测量","指标下降"]]:[["individual","单独置换","相关特征可能补偿信息损失"],["proxy","冗余信息","模型使用相关特征"],["joint","联合置换","同时打乱相关特征"],["group","组信息","联合依赖更加明显"]]):(first?[["model","Fitted model","+ evaluation data"],["baseline","Baseline","model score"],["shuffle","Shuffle","one feature column"],["drop","Measure","score decrease"]]:[["individual","Individual permutation","A correlated feature may compensate"],["proxy","Redundant signal","The model uses a related feature"],["joint","Joint permutation","Shuffle both related features"],["group","Group information","Joint reliance becomes visible"]]);
 return window.DCHLessonSVG.render({type:type,layout:first?"flow":"grid",id:"pfi-"+type,title:c.title,description:c.desc,caption:c.caption,scrollLabel:c.scroll,nodes:labels.map(([id,title,detail],i)=>({id,title,detail,tone:(!first&&i===3)?"bad":(first&&i===2)?"accent":"surface"}))});
};
lesson.sections[locale].forEach((s,i)=>{
 const section=document.createElement("section");section.className="xai-canonical-section";section.id="pfi-"+s[0];
 const h=document.createElement("h2");h.className="xai-canonical-section-title";h.textContent=s[1];
 const body=document.createElement("div");body.className="xai-canonical-section-content";
 const formulaAt=s.indexOf("formula");const parts=s.slice(2).filter((x,i)=>x!=="diagram"&&x!=="diagram2"&&x!=="formula"&&!(formulaAt>=0&&i+2===formulaAt+1));
 parts.forEach((p,j)=>{const node=document.createElement("p");node.innerHTML=p;body.append(node)});
 if(s.includes("formula")){const box=document.createElement("div");box.className="formula";const expr=document.createElement("div");expr.className="formula-expression";expr.innerHTML=s[s.indexOf("formula")+1];box.append(expr);body.append(box)}
 const diagramType=s.slice(2).find(x=>x==="diagram"||x==="diagram2");
 if(diagramType)body.append(svg(diagramType==="diagram"?"pfi-workflow":"pfi-correlation"));
 section.append(h,body);sections.append(section);
});
const p=lesson.practice[locale],practice=el("lesson-practice");
practice.innerHTML='<h2>'+labels.practice+'</h2><h3>'+p.title+'</h3><p>'+p.intro+'</p><p>'+p.explain+'</p><pre class="code-block"><code class="language-python"></code></pre><h3>'+(locale==="ru"?"Задание для самостоятельной работы":locale==="en"?"Independent exercise":"独立练习")+'</h3><p>'+p.task+'</p>';
practice.querySelector("code").textContent=p.code;
const sources=el("lesson-sources");sources.innerHTML='<h2>'+labels.sources+'</h2>';
const sl=document.createElement("ul");lesson.sources[locale].forEach(s=>{const li=document.createElement("li");const a=document.createElement("a");a.href=s[1];a.target="_blank";a.rel="noopener noreferrer";a.textContent=s[0];li.append(a);sl.append(li)});sources.append(sl);
const nav=el("lesson-navigation");nav.className="lesson-nav";nav.setAttribute("aria-label",locale==="ru"?"Навигация по уроку":locale==="en"?"Lesson navigation":"课程导航");
nav.innerHTML='<a class="button button-secondary" href="../lessons/a-7-1-3-les-a-0170'+(locale==="ru"?"":locale==="en"?"-en":"-zh")+'.html">← '+labels.previous+'</a><span class="button is-disabled" aria-disabled="true">'+labels.next+' · 7.2.3</span>';
const glossary=el("lesson-glossary");if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component is not loaded");window.DCHLessonComponents.renderGlossary(glossary,lesson.glossary[locale],labels.terms);
const quiz=el("lesson-quiz");quiz.innerHTML='<h2>'+labels.quiz+'</h2>';const form=document.createElement("form");form.className="knowledge-check";const feedback=document.createElement("div");feedback.className="quiz-feedback";feedback.setAttribute("aria-live","polite");
lesson.quiz[locale].forEach((q,i)=>{const field=document.createElement("fieldset");const legend=document.createElement("legend");legend.textContent=(i+1)+". "+q.q;field.append(legend);q.o.forEach((o,j)=>{const label=document.createElement("label");const input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=String(j);const span=document.createElement("span");span.textContent=o;label.append(input,span);field.append(label)});form.append(field)});
const button=document.createElement("button");button.type="submit";button.className="quiz-submit";button.textContent=labels.submit;form.append(button,feedback);form.addEventListener("submit",e=>{e.preventDefault();let score=0;const list=document.createElement("ol");lesson.quiz[locale].forEach((q,i)=>{const chosen=form.querySelector('input[name="q'+i+'"]:checked');const ok=chosen&&Number(chosen.value)===q.a;if(ok)score++;const li=document.createElement("li");const strong=document.createElement("strong");strong.textContent=(i+1)+". "+(ok?labels.correct:labels.incorrect)+" — ";li.append(strong,document.createTextNode(q.e));list.append(li)});feedback.replaceChildren(document.createTextNode(labels.score+": "+score+" / "+lesson.quiz[locale].length),list);feedback.classList.add("is-visible")});quiz.append(form);
})();