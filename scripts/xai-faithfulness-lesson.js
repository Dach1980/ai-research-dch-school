(function () {
"use strict";
const lesson = window.DCH_FAITHFULNESS_LESSON;
if (!lesson) throw new Error("Faithfulness lesson data is missing");
const lang = (document.documentElement.lang || "ru").toLowerCase();
const locale = lang.startsWith("zh") ? "zh" : lang.startsWith("en") ? "en" : "ru";
const data = lesson.content[locale];
const labels = {
 ru:{outcomes:"Результаты обучения",practice:"Практическая работа",sources:"Источники и дополнительное чтение",glossary:"Ключевые термины",quiz:"Проверка знаний",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",why:"Почему другие варианты неверны",score:"Результат",previous:"Предыдущий урок"},
 en:{outcomes:"Learning outcomes",practice:"Practical lab",sources:"Sources and further reading",glossary:"Key terms",quiz:"Knowledge check",submit:"Check answers",correct:"Correct",incorrect:"Incorrect",why:"Why the other options are incorrect",score:"Score",previous:"Previous lesson"},
 zh:{outcomes:"学习成果",practice:"实践实验",sources:"参考资料与延伸阅读",glossary:"关键术语",quiz:"知识检测",submit:"检查答案",correct:"正确",incorrect:"错误",why:"其他选项为何不正确",score:"得分",previous:"上一课"}
}[locale];
const el=id=>document.getElementById(id);
el("lesson-title").textContent=data.title;
el("lesson-lead").textContent=data.lead;
document.title="7.2.3 — "+data.title+" — AI Research DCH School";
const outcomes=el("lesson-outcomes");
const outcomeHeading=document.createElement("h2");outcomeHeading.textContent=labels.outcomes;
const outcomeList=document.createElement("ul");
data.outcomes.forEach(text=>{const li=document.createElement("li");li.textContent=text;outcomeList.append(li);});
outcomes.append(outcomeHeading,outcomeList);
function diagram(kind){
 const spec=lesson.diagrams[locale][kind];
 return window.DCHLessonSVG.render({
  type:"faithfulness-"+kind,
  layout:kind==="pipeline"?"grid":"flow",
  id:"faithfulness-"+kind,
  title:spec.title,
  description:spec.description,
  caption:spec.caption,
  scrollLabel:spec.scrollLabel,
  nodes:spec.nodes
 });
}
const sections=el("lesson-sections");
data.sections.forEach(sectionData=>{
 const section=document.createElement("section");
 section.className="xai-canonical-section";
 section.id="faithfulness-"+sectionData.id;
 const heading=document.createElement("h2");
 heading.className="xai-canonical-section-title";
 heading.textContent=sectionData.title;
 const body=document.createElement("div");
 body.className="xai-canonical-section-content";
 sectionData.paragraphs.forEach(markup=>{
  const p=document.createElement("p");p.innerHTML=markup;body.append(p);
 });
 if(sectionData.formula){
  const formula=document.createElement("div");formula.className="formula";
  const expression=document.createElement("div");expression.className="formula-expression";
  expression.textContent=sectionData.formula;formula.append(expression);if(sectionData.formulaNote){const note=document.createElement("p");note.className="formula-note";note.textContent=sectionData.formulaNote;formula.append(note);}body.append(formula);
 }
 if(sectionData.diagram)body.append(diagram(sectionData.diagram));
 section.append(heading,body);sections.append(section);
});
const practice=el("lesson-practice");
const p=data.practice;
const practiceHeading=document.createElement("h2");practiceHeading.textContent=labels.practice;
const labHeading=document.createElement("h3");labHeading.textContent=p.title;
const intro=document.createElement("p");intro.textContent=p.intro;
const explanation=document.createElement("p");explanation.textContent=p.explain;
const pre=document.createElement("pre");pre.dataset.language="python";pre.className="language-python";
const code=document.createElement("code");code.className="language-python";code.textContent=lesson.practiceCode;pre.append(code);
const taskHeading=document.createElement("h3");taskHeading.textContent=locale==="ru"?"Задание для самостоятельной работы":locale==="en"?"Independent exercise":"独立练习";
const task=document.createElement("p");task.textContent=p.task;
practice.append(practiceHeading,labHeading,intro,explanation,pre,taskHeading,task);
const sources=el("lesson-sources");
const sourcesHeading=document.createElement("h2");sourcesHeading.textContent=labels.sources;
const sourceList=document.createElement("ol");
data.sources.forEach(([name,url])=>{
 const li=document.createElement("li"),a=document.createElement("a");
 a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=name;li.append(a);sourceList.append(li);
});
sources.append(sourcesHeading,sourceList);
const glossary=el("lesson-glossary");
if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component is not loaded");
window.DCHLessonComponents.renderGlossary(glossary,data.glossary,labels.glossary);
const quiz=el("lesson-quiz");
const quizHeading=document.createElement("h2");quizHeading.textContent=labels.quiz;
const form=document.createElement("form");form.className="knowledge-check";
const feedback=document.createElement("div");feedback.className="quiz-feedback";feedback.setAttribute("aria-live","polite");
data.quiz.forEach((question,index)=>{
 const field=document.createElement("fieldset"),legend=document.createElement("legend");
 legend.textContent=(index+1)+". "+question.q;field.append(legend);
 question.o.forEach((option,optionIndex)=>{
  const label=document.createElement("label"),input=document.createElement("input"),span=document.createElement("span");
  input.type="radio";input.name="question-"+index;input.value=String(optionIndex);
  span.textContent=option;label.append(input,span);field.append(label);
 });
 form.append(field);
});
const submit=document.createElement("button");submit.type="submit";submit.className="quiz-submit";submit.textContent=labels.submit;
form.append(submit,feedback);
form.addEventListener("submit",event=>{
 event.preventDefault();let score=0;const results=document.createElement("ol");
 data.quiz.forEach((question,index)=>{
  const selected=form.querySelector('input[name="question-'+index+'"]:checked');
  const correct=selected&&Number(selected.value)===question.a;if(correct)score++;
  const item=document.createElement("li"),strong=document.createElement("strong"),why=document.createElement("p");
  strong.textContent=(index+1)+". "+(correct?labels.correct:labels.incorrect)+" — ";
  why.textContent=question.e;item.append(strong,why);
  const wrongHeading=document.createElement("p");wrongHeading.textContent=labels.why;item.append(wrongHeading);
  const wrongList=document.createElement("ul");
  question.why.forEach((reason,optionIndex)=>{
   if(optionIndex===question.a)return;
   const li=document.createElement("li");li.textContent=question.o[optionIndex]+": "+reason;wrongList.append(li);
  });
  item.append(wrongList);results.append(item);
 });
 feedback.replaceChildren(document.createTextNode(labels.score+": "+score+" / "+data.quiz.length),results);
 feedback.classList.add("is-visible");
});
quiz.append(quizHeading,form);
})();