(function () {
  "use strict";
  const lesson = window.DCH_LOCAL_GLOBAL_LESSON;
  if (!lesson) return;
  const localeRaw = (document.documentElement.lang || "ru").toLowerCase();
  const locale = localeRaw.startsWith("zh") ? "zh" : localeRaw.startsWith("en") ? "en" : "ru";
  const text = (value) => value && (value[locale] || value.ru || "");
  const title = document.getElementById("lesson-title");
  const lead = document.getElementById("lesson-lead");
  const outcomes = document.getElementById("lesson-outcomes");
  const body = document.getElementById("lesson-sections");
  const quizRoot = document.getElementById("lesson-quiz");
  if (title) title.textContent = text(lesson.title);
  if (lead) lead.textContent = text(lesson.lead);
  document.title = lesson.code + " — " + text(lesson.title) + " — AI Research DCH School";
  const labels = {
    ru:{outcomes:"Результаты обучения",quiz:"Самопроверка"},
    en:{outcomes:"Learning outcomes",quiz:"Self-check"},
    zh:{outcomes:"学习目标",quiz:"自我检查"}
  }[locale];
  if (outcomes) {
    const h = document.createElement("h2"); h.textContent = labels.outcomes;
    const ul = document.createElement("ul");
    lesson.outcomes[locale].forEach(item => { const li=document.createElement("li"); li.textContent=item; ul.appendChild(li); });
    outcomes.append(h,ul);
  }
  if (body) lesson.pages.forEach((page,index) => {
    const section=document.createElement("section");
    section.className="xai-canonical-section";
    section.id="section-"+page.id;
    const h=document.createElement("h2");
    h.className="xai-canonical-section-title";
    h.textContent=(index+1)+". "+text(page.title);
    const content=document.createElement("div");
    content.className="xai-canonical-section-content";
    content.innerHTML=text(page.content);
    section.append(h,content); body.appendChild(section);
  });
  if (quizRoot) {
    const q=lesson.quiz, qlabels=q.labels[locale];
    const section=document.createElement("section"); section.className="xai-canonical-section"; section.id="self-check";
    const h=document.createElement("h2"); h.className="xai-canonical-section-title"; h.textContent=qlabels.title;
    section.appendChild(h);
    const form=document.createElement("form"); form.className="knowledge-check"; form.noValidate=true;
    const savedKey="dch-xai-local-global-712-"+locale;
    let saved={}; try{saved=JSON.parse(localStorage.getItem(savedKey)||"{}");}catch(_){}
    q.questions.forEach((question,index)=>{
      const fieldset=document.createElement("fieldset");
      const legend=document.createElement("legend"); legend.textContent=(index+1)+". "+text(question.question);
      fieldset.appendChild(legend);
      question.options[locale].forEach((option,optIndex)=>{
        const label=document.createElement("label");
        const input=document.createElement("input"); input.type="radio"; input.name="q"+(index+1); input.value=String(optIndex); input.required=true;
        if(saved["q"+(index+1)]===String(optIndex)) input.checked=true;
        const span=document.createElement("span"); span.textContent=option;
        label.append(input,span); fieldset.appendChild(label);
      });
      form.appendChild(fieldset);
    });
    const button=document.createElement("button"); button.type="submit"; button.className="quiz-submit"; button.textContent=qlabels.submit;
    const feedback=document.createElement("div"); feedback.className="quiz-feedback"; feedback.setAttribute("role","status"); feedback.setAttribute("aria-live","polite");
    form.append(button,feedback);
    const summary=document.createElement("p"); summary.className="quiz-summary"; summary.setAttribute("aria-live","polite");
    if(Object.keys(saved).length===q.questions.length) summary.textContent=qlabels.score+": "+q.questions.filter((item,i)=>saved["q"+(i+1)]===String(item.answer)).length+" / "+q.questions.length;
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const result={}; q.questions.forEach((item,i)=>{const checked=form.querySelector('input[name="q'+(i+1)+'"]:checked'); if(checked) result["q"+(i+1)]=checked.value;});
      if(Object.keys(result).length!==q.questions.length){feedback.textContent=qlabels.required;feedback.classList.add("is-visible");return;}
      saved=result; try{localStorage.setItem(savedKey,JSON.stringify(result));}catch(_){}
      let score=0; const list=document.createElement("ol");
      q.questions.forEach((item,i)=>{
        const correct=result["q"+(i+1)]===String(item.answer); if(correct)score++;
        const li=document.createElement("li"); li.textContent=(correct?qlabels.correct:qlabels.incorrect)+". "+text(item.why); list.appendChild(li);
      });
      feedback.replaceChildren(); const resultLine=document.createElement("p"); resultLine.textContent=qlabels.score+": "+score+" / "+q.questions.length; feedback.append(resultLine,list); feedback.classList.add("is-visible");
      summary.textContent=qlabels.score+": "+score+" / "+q.questions.length;
      button.textContent=qlabels.saved;
    });
    section.append(form,summary); quizRoot.appendChild(section);
  }
})();