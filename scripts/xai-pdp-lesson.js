(function () {
"use strict";
const lesson=window.DCH_PDP_811;
if(!lesson)throw new Error("PDP lesson data is missing");
const lang=(document.documentElement.lang||"ru").toLowerCase();
const locale=lang.startsWith("zh")?"zh":lang.startsWith("en")?"en":"ru";
const data=lesson.content[locale];
const labels={
ru:{outcomes:"Результаты обучения",practice:"Практическая работа",sources:"Источники и дополнительное чтение",quiz:"Проверка знаний",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",why:"Пояснение",score:"Результат",install:"Установка",run:"Запуск",glossary:"Словарь терминов"},
en:{outcomes:"Learning outcomes",practice:"Practical lab",sources:"Sources and further reading",quiz:"Knowledge check",submit:"Check answers",correct:"Correct",incorrect:"Incorrect",why:"Explanation",score:"Score",install:"Install",run:"Run",glossary:"Key terms"},
zh:{outcomes:"学习成果",practice:"实践实验",sources:"参考资料与延伸阅读",quiz:"知识检测",submit:"检查答案",correct:"正确",incorrect:"错误",why:"解释",score:"得分",install:"安装",run:"运行",glossary:"术语词典"}
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
 const ru=locale==="ru",zh=locale==="zh";
 const words=ru?{workflow:"Как вычисляется PDP",ref:"Опорные строки",grid:"Сетка z",replace:"Замена признака",predict:"Прогнозы f",avg:"Среднее → PDP",curve:"Чтение кривой PDP",rise:"Средний прогноз растёт",level:"Рост замедляется",sparse:"Мало наблюдений",observed:"Наблюдаемые пары",synthetic:"Синтетические пары",area:"Площадь",rooms:"Комнаты",caption:"Схематичная иллюстрация; проверяйте область поддержки по реальным данным."}:zh?{workflow:"PDP 计算流程",ref:"参考样本行",grid:"网格 z",replace:"替换特征",predict:"模型预测 f",avg:"求平均 → PDP",curve:"读取 PDP 曲线",rise:"平均预测上升",level:"增长减缓",sparse:"观测稀疏",observed:"观测组合",synthetic:"合成组合",area:"房屋面积",rooms:"房间数",caption:"示意图；请根据真实数据检查支持区域。"}:{workflow:"How PDP is computed",ref:"Reference rows",grid:"Grid z",replace:"Replace feature",predict:"Predictions f",avg:"Average → PDP",curve:"Reading a PDP curve",rise:"Average prediction rises",level:"Growth slows",sparse:"Sparse observations",observed:"Observed pairs",synthetic:"Synthetic pairs",area:"Floor area",rooms:"Rooms",caption:"Conceptual illustration; inspect data support in the actual dataset."};
 const svg=se("svg",{viewBox:"0 0 760 420",role:"img",class:"pdp-svg","aria-labelledby":"pdp-"+locale+"-"+kind+"-title"});
 const title=se("title",{id:"pdp-"+locale+"-"+kind+"-title"},kind==="workflow"?words.workflow:kind==="reading"?words.curve:words.caption);svg.append(title,se("desc",{},words.caption));
 const ink="var(--lds-ink)",line="var(--lds-line)",surface="var(--lds-surface)",accent="var(--lds-accent)",good="var(--lds-good)",bad="var(--lds-bad)";
 if(kind==="workflow"){
  const boxes=[[25,110,145,95,words.ref],[215,110,125,95,words.grid],[385,110,150,95,words.replace],[580,110,155,95,words.predict]];
  boxes.forEach((b,i)=>{svg.append(se("rect",{x:b[0],y:b[1],width:b[2],height:b[3],rx:13,fill:i===2?accent:surface,stroke:line,"stroke-width":2}));svg.append(se("text",{x:b[0]+b[2]/2,y:164,"text-anchor":"middle",fill:i===2?"var(--lds-accent-ink)":ink,"font-size":18,"font-weight":650},b[4]));});
  [[170,157,215],[340,157,385],[535,157,580]].forEach(a=>svg.append(se("path",{d:"M"+a[0]+" "+a[1]+" H"+(a[2]-10)+" l-10 -7 m10 7 l-10 7",stroke:accent,"stroke-width":3,fill:"none"})));
  svg.append(se("path",{d:"M655 205 V275 H380",stroke:accent,"stroke-width":3,fill:"none"}));svg.append(se("rect",{x:245,y:275,width:270,height:65,rx:12,fill:surface,stroke:line,"stroke-width":2}));svg.append(se("text",{x:380,y:315,"text-anchor":"middle",fill:ink,"font-size":19,"font-weight":650},words.avg));
 }else if(kind==="reading"){
  svg.append(se("path",{d:"M95 45 V330 H700",stroke:ink,"stroke-width":2.5,fill:"none"}));
  [110,190,270].forEach(y=>svg.append(se("path",{d:"M95 "+y+" H700",stroke:line,"stroke-dasharray":"5 7"})));
  svg.append(se("path",{d:"M110 295 C190 275 225 230 300 205 S410 155 485 145 S590 140 680 138",stroke:accent,"stroke-width":5,fill:"none","stroke-linecap":"round"}));
  [[300,205],[590,140]].forEach(p=>svg.append(se("circle",{cx:p[0],cy:p[1],r:8,fill:good})));
  svg.append(se("rect",{x:125,y:55,width:235,height:48,rx:9,fill:surface,stroke:line}));svg.append(se("text",{x:242,y:85,"text-anchor":"middle",fill:ink,"font-size":17},words.rise));
  svg.append(se("rect",{x:425,y:55,width:250,height:48,rx:9,fill:surface,stroke:line}));svg.append(se("text",{x:550,y:85,"text-anchor":"middle",fill:ink,"font-size":17},words.level));
  svg.append(se("text",{x:395,y:370,"text-anchor":"middle",fill:ink,"font-size":18},ru?"Значение признака":zh?"特征取值":"Feature value"));
  svg.append(se("text",{x:25,y:205,transform:"rotate(-90 25 205)","text-anchor":"middle",fill:ink,"font-size":17},ru?"Средний прогноз":zh?"平均预测":"Average prediction"));
  svg.append(se("text",{x:590,y:305,fill:"var(--lds-muted)","font-size":15},words.sparse));
 }else{
  svg.append(se("path",{d:"M95 45 V330 H700",stroke:ink,"stroke-width":2.5,fill:"none"}));
  svg.append(se("path",{d:"M110 300 L675 85",stroke:line,"stroke-width":2,"stroke-dasharray":"7 7",fill:"none"}));
  for(let i=0;i<46;i++){const x=120+(i*37%500),y=Math.max(95,Math.min(315,285-(x-120)*.38+((i*71)%90)-45));svg.append(se("circle",{cx:x,cy:y,r:5,fill:good,opacity:.7}));}
  for(let x=145;x<670;x+=85)svg.append(se("circle",{cx:x,cy:165,r:6,fill:bad}));
  svg.append(se("rect",{x:115,y:55,width:245,height:48,rx:9,fill:surface,stroke:line}));svg.append(se("circle",{cx:135,cy:79,r:6,fill:good}));svg.append(se("text",{x:150,y:85,fill:ink,"font-size":16},words.observed));
  svg.append(se("rect",{x:390,y:55,width:260,height:48,rx:9,fill:surface,stroke:line}));svg.append(se("circle",{cx:410,cy:79,r:6,fill:bad}));svg.append(se("text",{x:425,y:85,fill:ink,"font-size":16},words.synthetic));
  svg.append(se("text",{x:395,y:375,"text-anchor":"middle",fill:ink,"font-size":18},words.area));svg.append(se("text",{x:25,y:205,transform:"rotate(-90 25 205)","text-anchor":"middle",fill:ink,"font-size":18},words.rooms));
 }
 const fig=h("figure","pdp-figure"),view=h("div","pdp-figure-viewport");view.setAttribute("role","region");view.setAttribute("aria-label",words.caption);view.tabIndex=0;view.append(svg);fig.append(view,h("figcaption","",words.caption));return fig;
}
const sections=el("lesson-sections");
data.sections.forEach(s=>{const section=h("section","xai-canonical-section");section.id="pdp-"+s.id;section.append(h("h2","xai-canonical-section-title",s.title));const body=h("div","xai-canonical-section-content");s.paragraphs.forEach(text=>body.append(h("p","",text)));if(s.id==="definition"||s.id==="two-way"){const f=h("div","formula");f.append(h("div","formula-expression",s.id==="definition"?"PDⱼ(z) = E[f(z, X₋ⱼ)]   |   PD̂ⱼ(z) = (1/n) Σᵢ f(z, xᵢ,₋ⱼ)":"PDⱼ,ₖ(zⱼ,zₖ) = E[f(zⱼ, zₖ, X₋(ⱼ,ₖ))]"));f.append(h("p","formula-note",ru?"Усреднение выполняется по опорной выборке; оно не является причинным эффектом.":zh?"平均值来自参考样本，并非因果效应。":"The average is over the reference sample; it is not a causal effect."));body.append(f);}if(s.diagram&&s.diagram!=="formula")body.append(figure(s.diagram));section.append(body);sections.append(section);});
const p=data.practice,practiceRoot=el("lesson-practice");practiceRoot.append(h("h2","",labels.practice),h("h3","",p.title),h("p","",p.intro),h("p","",p.explain),h("p","","Install: python -m pip install numpy pandas matplotlib scikit-learn"));
const pre=h("pre","language-python"),code=h("code","language-python");code.textContent=lesson.practiceCode;pre.dataset.language="python";pre.append(code);practiceRoot.append(pre,h("p","","Run: python lessons/practice/a-8-1-1-partial-dependence.py"),h("h3","",locale==="ru"?"Самостоятельная работа":locale==="zh"?"独立练习":"Independent exercise"),h("p","",p.task));
const sources=el("lesson-sources");sources.append(h("h2","",labels.sources));const ol=h("ol");data.sources.forEach(([name,url])=>{const li=h("li"),a=h("a","",name);a.href=url;a.target="_blank";a.rel="noopener noreferrer";li.append(a);ol.append(li);});sources.append(ol);
const glossary=el("lesson-glossary");if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component is not loaded");window.DCHLessonComponents.renderGlossary(glossary,data.glossary,labels.glossary);
const quiz=el("lesson-quiz");quiz.append(h("h2","",labels.quiz));const form=h("form","knowledge-check"),feedback=h("div","quiz-feedback");feedback.setAttribute("aria-live","polite");
data.quiz.forEach((q,i)=>{const field=h("fieldset"),legend=h("legend","",(i+1)+". "+q.q);field.append(legend);q.o.forEach((option,j)=>{const label=h("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=String(j);label.append(input,h("span","",option));field.append(label);});form.append(field);});
const button=h("button","quiz-submit",labels.submit);button.type="submit";form.append(button,feedback);
form.addEventListener("submit",event=>{event.preventDefault();let score=0;const results=h("ol");data.quiz.forEach((q,i)=>{const selected=form.querySelector('input[name="q'+i+'"]:checked'),ok=selected&&Number(selected.value)===q.a;if(ok)score++;const li=h("li"),strong=h("strong","",(i+1)+". "+(ok?labels.correct:labels.incorrect)+" — "),why=h("p","",q.e);li.append(strong,why);results.append(li);});feedback.replaceChildren(document.createTextNode(labels.score+": "+score+" / "+data.quiz.length),results);feedback.classList.add("is-visible");});
quiz.append(form);
})();