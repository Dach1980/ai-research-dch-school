(function () {
"use strict";
const lesson = window.DCH_FEATURE_IMPORTANCE_LESSON;
if (!lesson) return;
const lang = (document.documentElement.lang || "ru").toLowerCase();
const locale = lang.startsWith("zh") ? "zh" : lang.startsWith("en") ? "en" : "ru";
const pick = value => value && (value[locale] || value.ru) || "";
const labels = {
 ru:{outcomes:"Результаты обучения",practice:"Практическое задание",sources:"Источники и дополнительное чтение",terms:"Словарь терминов",quiz:"Самопроверка",submit:"Проверить ответы",correct:"Верно",incorrect:"Пока неверно",score:"Результат"},
 en:{outcomes:"Learning outcomes",practice:"Practical assignment",sources:"References and further reading",terms:"Key terms",quiz:"Self-check",submit:"Check answers",correct:"Correct",incorrect:"Not quite",score:"Score"},
 zh:{outcomes:"学习目标",practice:"实践任务",sources:"参考文献与延伸阅读",terms:"术语词典",quiz:"自我检测",submit:"检查答案",correct:"正确",incorrect:"还不正确",score:"得分"}
}[locale];
const title = document.getElementById("lesson-title");
const lead = document.getElementById("lesson-lead");
const outcomes = document.getElementById("lesson-outcomes");
const sections = document.getElementById("lesson-sections");
const practice = document.getElementById("lesson-practice");
const sources = document.getElementById("lesson-sources");
const glossary = document.getElementById("lesson-glossary");
const quizRoot = document.getElementById("lesson-quiz");
if (title) title.textContent = pick(lesson.title);
if (lead) lead.textContent = pick(lesson.lead);
document.title = lesson.code + " — " + pick(lesson.title) + " — AI Research DCH School";
if (outcomes) {
  const heading = document.createElement("h2");
  heading.textContent = labels.outcomes;
  const list = document.createElement("ul");
  (lesson.outcomes[locale] || lesson.outcomes.ru).forEach(item => {
    const li = document.createElement("li"); li.textContent = item; list.appendChild(li);
  });
  outcomes.append(heading, list);
}
function diagram() {
 const copy = {
  ru:{global:"Глобальная",local:"Локальная",scope1:"Вся выборка",scope2:"Один объект",a:"Признак A",b:"Признак B",c:"Признак C",note:"Условные значения",globalMetric:"относительная глобальная оценка",localMetric:"локальный вклад со знаком",caption:"Глобальный рейтинг использует общую шкалу; локальные вклады показывают направление и величину относительно нуля.",desc:"Слева показан глобальный рейтинг признаков на общей шкале. Справа показаны локальные вклады относительно нулевой оси."},
  en:{global:"Global",local:"Local",scope1:"Whole dataset",scope2:"One case",a:"Feature A",b:"Feature B",c:"Feature C",note:"Illustrative values",globalMetric:"relative global score",localMetric:"signed local contribution",caption:"The global ranking uses a shared scale; local contributions show direction and magnitude relative to zero.",desc:"The left panel shows global feature ranking on a shared scale. The right panel shows local contributions around a zero axis."},
  zh:{global:"全局",local:"局部",scope1:"整个数据集",scope2:"单个样本",a:"特征 A",b:"特征 B",c:"特征 C",note:"示意数值",globalMetric:"相对全局得分",localMetric:"带符号的局部贡献",caption:"全局排名使用统一尺度；局部贡献相对于零点显示方向和大小。",desc:"左侧展示统一尺度上的全局特征排名，右侧展示以零点为中心的局部贡献。"}
 }[locale];
 return '<figure class="feature-importance-figure"><svg class="feature-importance-svg" viewBox="0 0 720 370" role="img" aria-labelledby="fi-title fi-desc"><title id="fi-title">'+copy.global+' / '+copy.local+'</title><desc id="fi-desc">'+copy.desc+'</desc><rect class="fi-panel" x="12" y="12" width="338" height="336" rx="18"/><rect class="fi-panel" x="370" y="12" width="338" height="336" rx="18"/><text class="fi-heading" x="32" y="48">'+copy.global+'</text><text class="fi-muted" x="32" y="73">'+copy.scope1+'</text><text class="fi-label" x="32" y="118">'+copy.a+'</text><rect class="fi-bar" x="132" y="99" width="150" height="24" rx="6"/><text class="fi-value" x="290" y="117">0.85</text><text class="fi-label" x="32" y="166">'+copy.b+'</text><rect class="fi-bar alt" x="132" y="147" width="96" height="24" rx="6"/><text class="fi-value" x="236" y="165">0.56</text><text class="fi-label" x="32" y="214">'+copy.c+'</text><rect class="fi-bar alt" x="132" y="195" width="46" height="24" rx="6"/><text class="fi-value" x="186" y="213">0.27</text><line class="fi-axis" x1="132" y1="240" x2="308" y2="240"/><line class="fi-axis" x1="132" y1="236" x2="132" y2="244"/><line class="fi-axis" x1="220" y1="236" x2="220" y2="244"/><line class="fi-axis" x1="308" y1="236" x2="308" y2="244"/><text class="fi-axis-label" x="132" y="260" text-anchor="middle">0</text><text class="fi-axis-label" x="220" y="260" text-anchor="middle">0.5</text><text class="fi-axis-label" x="308" y="260" text-anchor="middle">1.0</text><text class="fi-context" x="32" y="300">'+copy.note+' · '+copy.globalMetric+'</text><text class="fi-heading" x="392" y="48">'+copy.local+'</text><text class="fi-muted" x="392" y="73">'+copy.scope2+'</text><text class="fi-label" x="392" y="118">'+copy.a+'</text><line class="fi-zero" x1="560" y1="88" x2="560" y2="228"/><rect class="fi-bar" x="560" y="99" width="60" height="24" rx="6"/><text class="fi-value" x="626" y="117">+0.71</text><text class="fi-label" x="392" y="166">'+copy.b+'</text><rect class="fi-negative" x="520" y="147" width="40" height="24" rx="6"/><text class="fi-value" x="565" y="165">−0.43</text><text class="fi-label" x="392" y="214">'+copy.c+'</text><rect class="fi-bar alt" x="560" y="195" width="24" height="24" rx="6"/><text class="fi-value" x="590" y="213">+0.19</text><text class="fi-axis-label" x="520" y="250" text-anchor="middle">−</text><text class="fi-axis-label" x="560" y="250" text-anchor="middle">0</text><text class="fi-axis-label" x="620" y="250" text-anchor="middle">+</text><text class="fi-context" x="392" y="300">'+copy.note+' · '+copy.localMetric+'</text></svg><figcaption>'+copy.note+' — '+copy.caption</figcaption></figure>';
}
if (sections) lesson.pages.forEach((page, index) => {
 const section = document.createElement("section");
 section.className = "xai-canonical-section";
 section.id = "section-" + page.id;
 const h = document.createElement("h2");
 h.className = "xai-canonical-section-title";
 h.textContent = pick(page.title);
 const body = document.createElement("div");
 body.className = "xai-canonical-section-content";
 body.innerHTML = pick(page.content);
 if (page.id === "meaning") {
   const holder = body.querySelector("[data-feature-diagram]");
   if (holder) holder.outerHTML = diagram();
 }
 section.append(h, body);
 sections.appendChild(section);
});
if (practice) { practice.innerHTML = pick(lesson.practice); const h=practice.querySelector("h2"); if(h) h.textContent=labels.practice; }
if (sources) { sources.innerHTML = pick(lesson.sources); const h=sources.querySelector("h2"); if(h) h.textContent=labels.sources; }
if (glossary) {
 const h = document.createElement("h2"); h.textContent = labels.terms;
 const grid = document.createElement("div"); grid.className = "glossary-grid";
 (lesson.glossary[locale] || lesson.glossary.ru).forEach((term, i) => {
   const card = document.createElement("article"); card.className = "glossary-entry";
   const number = document.createElement("span"); number.className = "term-index"; number.textContent = String(i+1).padStart(2,"0");
   const name = document.createElement("strong"); name.className = "term"; name.textContent = term[0];
   const definition = document.createElement("p"); definition.textContent = term[1];
   card.append(number, name, definition); grid.appendChild(card);
 });
 glossary.append(h, grid);
}
if (quizRoot) {
 const h = document.createElement("h2"); h.textContent = labels.quiz;
 const form = document.createElement("form"); form.className = "knowledge-check";
 const feedback = document.createElement("div"); feedback.className = "quiz-feedback"; feedback.setAttribute("aria-live","polite");
 lesson.quiz.forEach((item, i) => {
   const field = document.createElement("fieldset");
   const legend = document.createElement("legend"); legend.textContent = (i+1)+". "+pick(item.q); field.appendChild(legend);
   item.o[locale].forEach((option, j) => {
     const label = document.createElement("label");
     const input = document.createElement("input"); input.type="radio"; input.name="q"+i; input.value=String(j);
     const span = document.createElement("span"); span.textContent=option;
     label.append(input, span); field.appendChild(label);
   });
   form.appendChild(field);
 });
 const button = document.createElement("button"); button.type="submit"; button.className="quiz-submit"; button.textContent=labels.submit;
 form.append(button, feedback);
 form.addEventListener("submit", event => {
   event.preventDefault();
   let score=0; const notes=[];
   lesson.quiz.forEach((item,i)=>{
     const chosen=form.querySelector('input[name="q'+i+'"]:checked');
     const ok=chosen && Number(chosen.value)===item.a; if(ok) score++;
     notes.push('<li><strong>'+(i+1)+'. '+(ok?labels.correct:labels.incorrect)+'</strong> — '+item.e[locale]+'</li>');
   });
   feedback.innerHTML='<p>'+labels.score+': '+score+' / '+lesson.quiz.length+'</p><ol>'+notes.join("")+'</ol>';
   feedback.classList.add("is-visible");
 });
 quizRoot.append(h, form);
}
})();