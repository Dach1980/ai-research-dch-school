(function(){
"use strict";
const lesson=window.DCH_ICE_812;
if(!lesson)throw new Error("ICE lesson data is missing");
const raw=(document.documentElement.lang||"ru").toLowerCase();
const locale=raw.startsWith("zh")?"zh":raw.startsWith("en")?"en":"ru";
const data=lesson.content[locale];
const L={
ru:{outcomes:"Результаты обучения",practice:"Практическая работа",sources:"Источники и дополнительное чтение",quiz:"Проверка знаний",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",score:"Результат",install:"Установка",run:"Запуск",expected:"Ожидаемые наблюдения",glossary:"Словарь терминов",task:"Задание",formula:"ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ)",formulaNote:"Изменяется только выбранный признак; остальные значения объекта фиксированы.",x:"Значение признака",y:"Прогноз модели",one:"Одна ICE-кривая",family:"Семейство ICE и среднее PDP",center:"Centered ICE относительно z₀"},
en:{outcomes:"Learning outcomes",practice:"Practical lab",sources:"Sources and further reading",quiz:"Knowledge check",submit:"Check answers",correct:"Correct",incorrect:"Incorrect",score:"Score",install:"Install",run:"Run",expected:"Expected observations",glossary:"Key terms",task:"Task",formula:"ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ)",formulaNote:"Only the selected feature changes; the observation's other values remain fixed.",x:"Feature value",y:"Model prediction",one:"One ICE curve",family:"ICE family and mean PDP",center:"Centered ICE relative to z₀"},
zh:{outcomes:"学习成果",practice:"实践实验",sources:"参考资料与延伸阅读",quiz:"知识检测",submit:"检查答案",correct:"正确",incorrect:"错误",score:"得分",install:"安装",run:"运行",expected:"预期观察",glossary:"术语词典",task:"任务",formula:"ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ)",formulaNote:"只改变关注特征；样本的其他取值保持不变。",x:"特征取值",y:"模型预测",one:"一条 ICE 曲线",family:"ICE 曲线族与平均 PDP",center:"相对于 z₀ 的 Centered ICE"}
}[locale];
const byId=id=>document.getElementById(id);
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
document.title="8.1.2 — "+data.title+" — AI Research DCH School";
byId("lesson-title").textContent=data.title;byId("lesson-lead").textContent=data.lead;
const out=byId("lesson-outcomes");out.append(make("h2","",L.outcomes));const ul=make("ul");data.outcomes.forEach(x=>ul.append(make("li","",x)));out.append(ul);
let diagramSequence=0;
function diagram(kind){
 const diagramId=++diagramSequence;
 const ru=locale==="ru",zh=locale==="zh";
 const words=kind==="one"?
  (ru?["Один объект","ICEᵢⱼ(z)","Другие признаки фиксированы","Индивидуальный прогноз"]:zh?["单个样本","ICEᵢⱼ(z)","其余特征固定","个体预测"]:["One observation","ICEᵢⱼ(z)","Other features fixed","Individual prediction"]):
  kind==="center"?
  (ru?["z₀","Базовое значение","Вычесть ICE(z₀)","Все линии проходят через ноль"]:zh?["z₀","基准取值","减去 ICE(z₀)","所有曲线经过零点"]:["z₀","Baseline value","Subtract ICE(z₀)","All curves pass through zero"]):
  (ru?["Объекты 1…n","Отдельные ICE-кривые","Точечное среднее","PDP"]:zh?["样本 1…n","个体 ICE 曲线","逐点平均","PDP"]:["Observations 1…n","Individual ICE curves","Pointwise mean","PDP"]);
 if(!window.DCHLessonSVG||typeof window.DCHLessonSVG.render!=="function")throw new Error("Shared SVG renderer is unavailable");
 if(kind==="one"||kind==="center"){
  const points=kind==="one"?[[.02,.08],[.18,.17],[.34,.29],[.5,.45],[.68,.63],[.84,.76],[.98,.9]]:[[.02,.12],[.18,.22],[.34,.35],[.5,.5],[.68,.61],[.84,.78],[.98,.9]];
  const spec={type:"ice-single-"+kind,layout:"plot",id:"ice-"+locale+"-"+kind+"-"+diagramId,title:kind==="one"?L.one:L.center,description:words.join(". "),caption:words.join(" → "),scrollLabel:words.join(" "),xLabel:L.x,yLabel:kind==="center"?(ru?"Изменение прогноза":zh?"预测变化":"Prediction change"):L.y,points,annotations:kind==="center"?[{x:.5,y:.87,text:"z₀"}]:[]};
  return window.DCHLessonSVG.render(spec);
 }
 const spec={type:"ice-family-pdp",layout:"flow",id:"ice-"+locale+"-family-"+diagramId,title:L.family,description:words.join(". "),caption:words.join(" → "),scrollLabel:L.family,nodes:words.map((w,i)=>({id:"step-"+i,title:w,detail:i===1?(ru?"Разные наклоны и уровни":zh?"不同斜率与水平":"Different slopes and levels"):i===2?(ru?"Среднее в каждой точке z":zh?"每个 z 处求平均":"Average at each z"): "",tone:i===3?"accent":"surface"}))};
 return window.DCHLessonSVG.render(spec);
}
const sections=byId("lesson-sections");
data.sections.forEach(s=>{
 const section=make("section","xai-canonical-section");section.id="ice-"+s[0];
 section.append(make("h2","xai-canonical-section-title",s[1]));
 const body=make("div","xai-canonical-section-content");
 s[2].forEach(p=>body.append(make("p","",p)));
 if(s[0]==="definition"){
  const f=make("div","formula");f.append(make("div","formula-expression",L.formula),make("p","formula-note",L.formulaNote));body.append(f);
 }
 if(["algorithm","reading","centered"].includes(s[0]))body.append(diagram(s[0]==="algorithm"?"family":s[0]==="reading"?"family":"center"));
 if(s[0]==="motivation")body.append(diagram("one"));
 section.append(body);sections.append(section);
});
const p= data.practice,pr=byId("lesson-practice");
pr.append(make("h2","",L.practice),make("h3","",p.title),make("p","",p.intro),make("h3","",L.task),make("p","",p.task),make("p","",L.install+": python -m pip install numpy pandas matplotlib scikit-learn"));
const pre=make("pre","language-python"),code=make("code","language-python");code.textContent=lesson.practiceCode;pre.dataset.language="python";pre.append(code);pr.append(pre,make("p","",L.run+": python lessons/practice/a-8-1-2-individual-conditional-expectation.py"),make("h3","",L.expected),make("p","",p.expected));
const src=byId("lesson-sources");src.append(make("h2","",L.sources));const ol=make("ol");data.sources.forEach(([label,url])=>{const li=make("li"),a=make("a","",label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";li.append(a);ol.append(li);});src.append(ol);
if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component unavailable");
window.DCHLessonComponents.renderGlossary(byId("lesson-glossary"),data.glossary,L.glossary);
const quiz=byId("lesson-quiz");quiz.append(make("h2","",L.quiz));const form=make("form","knowledge-check"),feedback=make("div","quiz-feedback");feedback.setAttribute("aria-live","polite");
data.quiz.forEach((q,i)=>{const fs=make("fieldset"),legend=make("legend","",(i+1)+". "+q[0]);fs.append(legend);q[1].forEach((option,j)=>{const label=make("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=String(j);label.append(input,make("span","",option));fs.append(label);});form.append(fs);});
const submit=make("button","quiz-submit",L.submit);submit.type="submit";form.append(submit,feedback);
form.addEventListener("submit",event=>{event.preventDefault();let score=0;const result=make("ol");data.quiz.forEach((q,i)=>{const chosen=form.querySelector('input[name="q'+i+'"]:checked'),ok=chosen&&Number(chosen.value)===q[2];if(ok)score++;const li=make("li"),why=make("p","",q[3]);li.append(make("strong","",(i+1)+". "+(ok?L.correct:L.incorrect)),why);result.append(li);});feedback.replaceChildren(document.createTextNode(L.score+": "+score+" / "+data.quiz.length),result);feedback.classList.add("is-visible");});
quiz.append(form);
})();