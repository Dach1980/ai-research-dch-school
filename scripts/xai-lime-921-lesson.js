(function(){
"use strict";
const lesson=window.DCH_LIME_921;
if(!lesson)throw new Error("LIME 9.2.1 data missing");
if(!window.DCHLessonSVG||typeof window.DCHLessonSVG.render!=="function")throw new Error("Shared SVG renderer missing");
if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component missing");
const raw=(document.documentElement.lang||"ru").toLowerCase();
const locale=raw.startsWith("zh")?"zh":raw.startsWith("en")?"en":"ru";
const data=lesson.content[locale];
const labels={
ru:{outcomes:"Результаты обучения",practice:"Практическая работа",sources:"Источники и дополнительное чтение",quiz:"Проверка знаний",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",score:"Результат",install:"Установка",run:"Запуск",expected:"Ожидаемый результат",task:"Задание",steps:"Порядок выполнения",code:"Полный код практической работы"},
en:{outcomes:"Learning outcomes",practice:"Practical lab",sources:"Sources and further reading",quiz:"Knowledge check",submit:"Check answers",correct:"Correct",incorrect:"Incorrect",score:"Score",install:"Install",run:"Run",expected:"Expected result",task:"Task",steps:"Procedure",code:"Complete lab code"},
zh:{outcomes:"学习成果",practice:"实践实验",sources:"参考资料与延伸阅读",quiz:"知识检测",submit:"检查答案",correct:"正确",incorrect:"错误",score:"得分",install:"安装",run:"运行",expected:"预期结果",task:"任务",steps:"操作步骤",code:"完整实践代码"}
}[locale];
const el=id=>document.getElementById(id);
const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
document.title="9.2.1 — "+data.title+" — AI Research DCH School";
el("lesson-title").textContent=data.title;
el("lesson-lead").textContent=data.lead;
const outcomes=el("lesson-outcomes");
outcomes.classList.add("outcomes");
outcomes.append(make("h2","",labels.outcomes));
const outcomeList=make("ul");
data.outcomes.forEach(item=>outcomeList.append(make("li","",item)));
outcomes.append(outcomeList);
const sectionsRoot=el("lesson-sections");
data.sections.forEach((section,index)=>{
 const [key,title,paragraphs,diagramKey]=section;
 const article=make("section","xai-canonical-section");
 article.id="lime-921-"+key;
 const heading=make("h2","xai-canonical-section-title",title);
 const body=make("div","xai-canonical-section-content");
 paragraphs.forEach(text=>body.append(make("p","",text)));
 const spec=data.diagrams[diagramKey];
 if(!spec)throw new Error("Missing semantic diagram: "+diagramKey);
 const figure=window.DCHLessonSVG.render({
  id:"lime-921-"+locale+"-"+diagramKey,
  type:"lime-921-"+diagramKey,
  layout:"table",
  title:spec.title,
  description:spec.description,
  caption:spec.caption,
  scrollLabel:spec.title,
  columns:spec.columns,
  rows:spec.rows
 });
 figure.dataset.diagramKind=diagramKey;
 body.append(figure);
 article.append(heading,body);
 sectionsRoot.append(article);
});
const practice=el("lesson-practice");
practice.append(make("h2","",labels.practice));
practice.append(make("h3","",data.practice.title));
practice.append(make("p","",data.practice.intro));
practice.append(make("h3","",labels.task));
practice.append(make("p","",data.practice.task));
practice.append(make("h3","",labels.steps));
const steps=make("ol");
data.practice.steps.forEach(item=>steps.append(make("li","",item)));
practice.append(steps);
const codeBlock=(language,source)=>{
 const pre=make("pre","language-"+language);
 pre.dataset.language=language;
 pre.append(make("code","",source));
 return pre;
};
practice.append(make("h3","",labels.install),codeBlock("bash",data.practice.install));
practice.append(make("h3","",labels.run),codeBlock("bash",data.practice.run));
practice.append(make("h3","",labels.code),codeBlock("python",lesson.practiceCode));
const codeLink=make("p","practice-source-link");
const link=make("a","",locale==="ru"?"Открыть файл практики в репозитории":locale==="en"?"Open the lab file in the repository":"在仓库中打开实践文件");
link.href="practice/a-9-2-1-lime-neighborhood.py";link.target="_blank";link.rel="noopener noreferrer";
codeLink.append(link);practice.append(codeLink);
practice.append(make("h3","",labels.expected));
practice.append(make("p","",data.practice.expected));
const sources=el("lesson-sources");
sources.append(make("h2","",labels.sources));
const sourceList=make("ol");
data.sources.forEach(([label,url])=>{
 const item=make("li");const anchor=make("a","",label);
 anchor.href=url;anchor.target="_blank";anchor.rel="noopener noreferrer";
 item.append(anchor);sourceList.append(item);
});
sources.append(sourceList);
window.DCHLessonComponents.renderGlossary(el("lesson-glossary"),data.glossary,locale==="ru"?"Словарь терминов":locale==="en"?"Key terms":"术语词典");
const quiz=el("lesson-quiz");
quiz.append(make("h2","",labels.quiz));
const form=make("form","knowledge-check");
const feedback=make("div","quiz-feedback");
feedback.setAttribute("aria-live","polite");
data.quiz.forEach((question,index)=>{
 const fieldset=make("fieldset");
 fieldset.append(make("legend","",(index+1)+". "+question[0]));
 question[1].forEach((option,optionIndex)=>{
  const label=make("label");
  const input=document.createElement("input");
  input.type="radio";input.name="q"+index;input.value=String(optionIndex);input.required=true;
  label.append(input,make("span","",option));fieldset.append(label);
 });
 form.append(fieldset);
});
const submit=make("button","quiz-submit",labels.submit);submit.type="submit";
form.append(submit,feedback);
form.addEventListener("submit",event=>{
 event.preventDefault();
 let score=0;const results=make("ol");
 data.quiz.forEach((question,index)=>{
  const selected=form.querySelector('input[name="q'+index+'"]:checked');
  const correct=!!selected&&Number(selected.value)===question[2];
  if(correct)score++;
  const item=make("li");
  item.append(make("strong","",(index+1)+". "+(correct?labels.correct:labels.incorrect)));
  item.append(make("p","",question[3]));
  results.append(item);
 });
 feedback.replaceChildren(document.createTextNode(labels.score+": "+score+" / "+data.quiz.length),results);
 feedback.classList.add("is-visible");
});
quiz.append(form);
})();