(function () {
"use strict";
const lesson=window.DCH_PDP_811;
if(!lesson)throw new Error("PDP lesson data is missing");
const lang=(document.documentElement.lang||"ru").toLowerCase();
const locale=lang.startsWith("zh")?"zh":lang.startsWith("en")?"en":"ru";
const data=lesson.content[locale];
const labels={
ru:{outcomes:"Результаты обучения",practice:"Практическая работа",sources:"Источники и дополнительное чтение",quiz:"Проверка знаний",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",why:"Пояснение",score:"Результат",install:"Установка",run:"Запуск",expected:"Ожидаемые наблюдения",glossary:"Словарь терминов"},
en:{outcomes:"Learning outcomes",practice:"Practical lab",sources:"Sources and further reading",quiz:"Knowledge check",submit:"Check answers",correct:"Correct",incorrect:"Incorrect",why:"Explanation",score:"Score",install:"Install",run:"Run",expected:"Expected observations",glossary:"Key terms"},
zh:{outcomes:"学习成果",practice:"实践实验",sources:"参考资料与延伸阅读",quiz:"知识检测",submit:"检查答案",correct:"正确",incorrect:"错误",why:"解释",score:"得分",install:"安装",run:"运行",expected:"预期观察",glossary:"术语词典"}
}[locale];
const el=id=>document.getElementById(id);
el("lesson-title").textContent=data.title;el("lesson-lead").textContent=data.lead;
document.title="8.1.1 — "+data.title+" — AI Research DCH School";
const h=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
const outcomes=el("lesson-outcomes");outcomes.append(h("h2","",labels.outcomes));const list=h("ul");
data.outcomes.forEach(x=>list.append(h("li","",x)));outcomes.append(list);
const NS="http://www.w3.org/2000/svg";
function se(tag,attrs,text){const n=document.createElementNS(NS,tag);Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=text;return n;}
function figure(kind){
 if(!window.DCHLessonSVG||typeof window.DCHLessonSVG.render!=="function")throw new Error("Shared SVG renderer is not loaded");
 const ru=locale==="ru",zh=locale==="zh";
 const words=ru?{
  workflow:"Как вычисляется PDP",ref:"Опорные строки",grid:"Сетка значений z",replace:"Заменить признак",predict:"Получить прогнозы",average:"Усреднить → PDP",
  curve:"Как читать PDP",rise:"Средний прогноз растёт",slow:"Прирост ослабевает",sparse:"Мало наблюдений",
  observed:"Наблюдаемые пары",synthetic:"Синтетические пары",area:"Площадь",rooms:"Число комнат",
  caption1:"Для каждого значения сетки модель прогнозирует все опорные строки; затем результаты усредняются.",
  caption2:"Кривая описывает средний отклик модели, а не реакцию каждого отдельного объекта.",
  caption3:"Независимая замена площади может нарушить наблюдаемую связь с числом комнат."
 }:zh?{
  workflow:"PDP 的计算流程",ref:"参考样本行",grid:"取值网格 z",replace:"替换特征",predict:"生成模型预测",average:"求平均 → PDP",
  curve:"如何读取 PDP",rise:"平均预测上升",slow:"增幅逐渐减小",sparse:"观测稀疏",
  observed:"观测组合",synthetic:"合成组合",area:"房屋面积",rooms:"房间数",
  caption1:"对于网格中的每个取值，模型预测所有参考样本行，然后计算平均值。",
  caption2:"曲线描述模型的平均响应，而不是每个个体的响应。",
  caption3:"独立替换面积可能破坏面积与房间数之间的观测关系。"
 }:{
  workflow:"How PDP is computed",ref:"Reference rows",grid:"Value grid z",replace:"Replace feature",predict:"Model predictions",average:"Average → PDP",
  curve:"How to read a PDP",rise:"Average prediction rises",slow:"Increase becomes smaller",sparse:"Sparse observations",
  observed:"Observed pairs",synthetic:"Synthetic pairs",area:"Floor area",rooms:"Room count",
  caption1:"At each grid value, the model predicts all reference rows; those predictions are then averaged.",
  caption2:"The curve describes the model's average response, not every individual observation.",
  caption3:"Replacing area independently can break its observed relationship with room count."
 };
 let spec;
 if(kind==="workflow"){
  spec={type:"pdp-workflow",layout:"flow",id:"pdp-"+locale+"-workflow",title:words.workflow,description:words.caption1,caption:words.caption1,scrollLabel:words.workflow,nodes:[
   {id:"reference",title:words.ref,detail:ru?"Данные для усреднения":zh?"用于平均的数据":"Rows used for averaging"},
   {id:"grid",title:words.grid,detail:ru?"Набор значений z":zh?"候选特征值":"Candidate feature values"},
   {id:"replace",title:words.replace,detail:ru?"Остальные столбцы сохраняются":zh?"保留其余列":"Keep other columns"},
   {id:"predict",title:words.predict,detail:"f(z, xᵢ,₋ⱼ)"},
   {id:"average",title:words.average,detail:ru?"Одна точка кривой":zh?"曲线上的一个点":"One point on the curve"}
  ]};
 }else if(kind==="reading"){
  spec={type:"pdp-curve-reading",layout:"plot",id:"pdp-"+locale+"-reading",title:words.curve,description:words.caption2,caption:words.caption2,scrollLabel:words.curve,
   xLabel:ru?"Значение признака":zh?"特征取值":"Feature value",
   yLabel:ru?"Средний прогноз":zh?"平均预测":"Average prediction",
   points:[[.02,.08],[.16,.18],[.29,.39],[.43,.56],[.58,.69],[.72,.75],[.86,.77],[.98,.78]],
   annotations:[{x:.08,y:.91,text:words.rise},{x:.63,y:.91,text:words.slow}],sparseLabel:words.sparse};
 }else{
  spec={type:"pdp-feature-dependence",layout:"scatter",id:"pdp-"+locale+"-correlation",title:words.caption3,description:words.caption3,caption:words.caption3,scrollLabel:words.caption3,
   xLabel:words.area,yLabel:words.rooms,observedLabel:words.observed,syntheticLabel:words.synthetic,
   observed:[[.08,.14],[.13,.2],[.2,.25],[.25,.31],[.31,.35],[.38,.4],[.43,.48],[.49,.52],[.55,.57],[.61,.63],[.68,.7],[.74,.73],[.81,.81],[.88,.87],[.94,.92]],
   synthetic:[[.12,.83],[.2,.7],[.3,.9],[.4,.16],[.5,.12],[.6,.92],[.7,.2],[.8,.12],[.9,.18],[.96,.75],[.18,.55],[.78,.45],[.35,.78],[.62,.28]]
  };
 }
 const figure=window.DCHLessonSVG.render(spec);
 figure.classList.add("pdp-figure");
 const viewport=figure.querySelector(".pfi-diagram-viewport");
 if(viewport)viewport.classList.add("pdp-figure-viewport");
 const svg=figure.querySelector("svg");
 if(svg)svg.classList.add("pdp-svg");
 return figure;
}
const sections=el("lesson-sections");
data.sections.forEach(s=>{const section=h("section","xai-canonical-section");section.id="pdp-"+s.id;section.append(h("h2","xai-canonical-section-title",s.title));const body=h("div","xai-canonical-section-content");s.paragraphs.forEach(text=>body.append(h("p","",text)));if(s.id==="definition"||s.id==="two-way"){const f=h("div","formula");f.append(h("div","formula-expression",s.id==="definition"?"PDⱼ(z) = E[f(z, X₋ⱼ)]   |   PD̂ⱼ(z) = (1/n) Σᵢ f(z, xᵢ,₋ⱼ)":"PDⱼ,ₖ(zⱼ,zₖ) = E[f(zⱼ, zₖ, X₋(ⱼ,ₖ))]"));f.append(h("p","formula-note",ru?"Усреднение выполняется по опорной выборке; оно не является причинным эффектом.":zh?"平均值来自参考样本，并非因果效应。":"The average is over the reference sample; it is not a causal effect."));body.append(f);}if(s.diagram&&s.diagram!=="formula")body.append(figure(s.diagram));section.append(body);sections.append(section);});
const p=data.practice,practiceRoot=el("lesson-practice");practiceRoot.append(h("h2","",labels.practice),h("h3","",p.title),h("p","",p.intro),h("p","",p.explain),h("p","",labels.install+": python -m pip install numpy pandas matplotlib scikit-learn"));
const pre=h("pre","language-python"),code=h("code","language-python");code.textContent=lesson.practiceCode;pre.dataset.language="python";pre.append(code);practiceRoot.append(pre,h("p","",labels.run+": python lessons/practice/a-8-1-1-partial-dependence.py"),h("h3","",locale==="ru"?"Самостоятельная работа":locale==="zh"?"独立练习":"Independent exercise"),h("p","",p.task),h("h3","",labels.expected),h("p","",p.expected));
const sources=el("lesson-sources");sources.append(h("h2","",labels.sources));const ol=h("ol");data.sources.forEach(([name,url])=>{const li=h("li"),a=h("a","",name);a.href=url;a.target="_blank";a.rel="noopener noreferrer";li.append(a);ol.append(li);});sources.append(ol);
const glossary=el("lesson-glossary");if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component is not loaded");window.DCHLessonComponents.renderGlossary(glossary,data.glossary,labels.glossary);
const quiz=el("lesson-quiz");quiz.append(h("h2","",labels.quiz));const form=h("form","knowledge-check"),feedback=h("div","quiz-feedback");feedback.setAttribute("aria-live","polite");
data.quiz.forEach((q,i)=>{const field=h("fieldset"),legend=h("legend","",(i+1)+". "+q.q);field.append(legend);q.o.forEach((option,j)=>{const label=h("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=String(j);label.append(input,h("span","",option));field.append(label);});form.append(field);});
const button=h("button","quiz-submit",labels.submit);button.type="submit";form.append(button,feedback);
form.addEventListener("submit",event=>{event.preventDefault();let score=0;const results=h("ol");data.quiz.forEach((q,i)=>{const selected=form.querySelector('input[name="q'+i+'"]:checked'),ok=selected&&Number(selected.value)===q.a;if(ok)score++;const li=h("li"),strong=h("strong","",(i+1)+". "+(ok?labels.correct:labels.incorrect)+" — "),why=h("p","",q.e);li.append(strong,why);results.append(li);});feedback.replaceChildren(document.createTextNode(labels.score+": "+score+" / "+data.quiz.length),results);feedback.classList.add("is-visible");});
quiz.append(form);
})();