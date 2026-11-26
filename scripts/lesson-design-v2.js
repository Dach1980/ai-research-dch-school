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

const professionalContent={
"10.2.1":{"ru":{"title":"Паспорт метода · глобальный SHAP","fields":[["Вопрос","Какие признаки обычно получают большие атрибуции на указанной выборке?"],["Вход","Матрица локальных SHAP одной модели, выхода и игры."],["Выход","Средние модули, подписанные средние, ранги и интервалы."],["Сравнение","PFI и SAGE отвечают на вопросы о качестве, а не просто размере вклада."],["Граница","Ранг зависит от выборки и фона; причинность не доказана."]],"question":"Если средний подписанный вклад равен нулю, обязательно ли средний модуль тоже равен нулю?","yes":"Да","no":"Нет","right":"Верно: противоположные знаки могут компенсироваться.","wrong":"Не совсем: +2 и −2 дают D=0, но I=2."},"en":{"title":"Method passport · global SHAP","fields":[["Question","Which features tend to have large attributions on the specified sample?"],["Input","Local SHAP matrix from one model, output and game."],["Output","Mean magnitudes, signed means, ranks and intervals."],["Comparison","PFI and SAGE address performance questions, not just attribution magnitude."],["Limit","Ranks depend on sample and background; causality is not established."]],"question":"If mean signed contribution is zero, must mean absolute contribution also be zero?","yes":"Yes","no":"No","right":"Correct: opposite signs may cancel.","wrong":"Not quite: +2 and −2 give D=0 but I=2."},"zh":{"title":"方法概览 · 全局 SHAP","fields":[["问题","指定样本中哪些特征通常具有较大归因？"],["输入","同一模型、输出与博弈的局部 SHAP 矩阵。"],["输出","平均绝对值、有符号均值、排序与区间。"],["比较","PFI 与 SAGE 回答性能问题，而非仅归因大小。"],["局限","排序依赖样本和背景，不能证明因果性。"]],"question":"有符号平均为零时，平均绝对值必然为零吗？","yes":"是","no":"否","right":"正确，相反符号可能抵消。","wrong":"不完全正确：+2 与 −2 的 D=0，但 I=2。"}},
"10.1.2":{
ru:{title:"Паспорт метода · вычисление SHAP",fields:[["Вопрос","Как распределить отличие прогноза от базы?"],["Вход","Модель, объект, скалярный выход, фон и правило маскирования."],["Выход","Подписанные вклады в единицах выбранного выхода."],["Тип и доступ","KernelSHAP — обращения к прогнозу; TreeSHAP — структура поддерживаемого дерева."],["Граница","Аддитивность не доказывает причинность; игра должна быть зафиксирована."]],question:"Один прогноз, два разных правила отсутствующих признаков. Обязаны ли вклады совпасть?",yes:"Да",no:"Нет",right:"Верно. Меняется игра, поэтому могут измениться вклады при том же прогнозе.",wrong:"Не совсем. Одинаковый прогноз не означает одинаковые коалиционные значения."},
en:{title:"Method passport · computing SHAP",fields:[["Question","How do we allocate the difference from a base value?"],["Input","Model, instance, scalar output, background and masking rule."],["Output","Signed contributions in the selected output units."],["Type and access","KernelSHAP queries predictions; TreeSHAP uses supported tree structure."],["Limit","Additivity is not causality; fix the game."]],question:"One prediction, two different missing-feature rules. Must contributions agree?",yes:"Yes",no:"No",right:"Correct. The game changes, so contributions may change with the prediction fixed.",wrong:"Not quite. The same prediction need not imply the same coalition values."},
zh:{title:"方法概览 · SHAP 计算",fields:[["问题","如何分配预测值与基值之间的差？"],["输入","模型、样本、标量输出、背景数据和掩蔽规则。"],["输出","使用所选输出单位的有符号贡献。"],["类型与访问","KernelSHAP 查询预测；TreeSHAP 利用受支持的树结构。"],["局限","可加性不等于因果性；必须固定博弈。"]],question:"同一预测，采用两种不同的缺失特征规则。贡献必然相同吗？",yes:"是",no:"否",right:"正确。博弈改变时，即使预测不变，贡献也可能改变。",wrong:"不完全正确。同一预测不意味着各联盟的价值相同。"}
},
"10.1.3":{
ru:{title:"Паспорт метода · локальный SHAP",fields:[["Вопрос","Почему один прогноз отличается от выбранной базы?"],["Вход","Один объект, модель, выбранный выход, фон и атрибуции."],["Выход","Подписанные вклады и локальная реконструкция прогноза."],["Визуализация","Waterfall для проверки суммы; force для баланса вкладов."],["Граница","Одна строка не определяет глобальную важность и не доказывает причинность."]],question:"Площадь получила +1,8 млн руб. SHAP-вклада для одной квартиры. Доказано ли, что увеличение площади вызовет рост рыночной цены на 1,8 млн?",yes:"Да",no:"Нет",right:"Верно. Это вклад в прогноз модели в выбранной игре, а не эффект вмешательства.",wrong:"Не совсем. Для причинного эффекта нужна отдельная причинная постановка."},
en:{title:"Method passport · local SHAP",fields:[["Question","Why does one prediction differ from its selected base?"],["Input","One instance, model, selected output, background and attributions."],["Output","Signed contributions and reconstruction of the local prediction."],["Visuals","Waterfall audits the sum; force displays competing contributions."],["Limit","One row establishes neither global importance nor causality."]],question:"Area has a +1.8 million RUB attribution for one apartment. Does this prove that increasing area causes a 1.8 million increase in market price?",yes:"Yes",no:"No",right:"Correct. This is a model attribution in a specified game, not an intervention effect.",wrong:"Not quite. A causal effect requires a separate causal setup."},
zh:{title:"方法概览 · 局部 SHAP",fields:[["问题","为什么单个预测偏离所选基值？"],["输入","单个样本、模型、所选输出、背景数据与归因。"],["输出","有符号贡献与局部预测重构。"],["可视化","瀑布图核对求和；力图展示相反贡献。"],["局限","单行样本不能确定全局重要性或证明因果关系。"]],question:"某公寓的面积归因为 +1.8 百万卢布。这是否证明增加面积会导致市场价格上涨 1.8 百万卢布？",yes:"是",no:"否",right:"正确。这是指定博弈中的模型归因，而不是干预效应。",wrong:"不完全正确。因果效应需要独立的因果设定。"}
}};
const professional=professionalContent[code]?.[lang];
if(professional){
 const p=make("details","dch-method-passport");p.dataset.methodPassport=code;
 p.append(make("summary","",professional.title));
 const dl=make("dl","dch-method-fields");
 professional.fields.forEach(([k,v])=>{const row=make("div");row.append(make("dt","",k),make("dd","",v));dl.append(row);});p.append(dl);
 const check=make("fieldset","dch-method-check");check.append(make("legend","",professional.question));
 const choices=make("div","dch-method-choices"),feedback=make("p","dch-method-feedback");feedback.setAttribute("role","status");
 [professional.yes,professional.no].forEach((label,i)=>{const b=make("button","",label);b.type="button";b.setAttribute("aria-pressed","false");b.addEventListener("click",()=>{Array.from(choices.children).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));feedback.textContent=i===1?professional.right:professional.wrong;feedback.dataset.correct=String(i===1);});choices.append(b);});
 check.append(choices,feedback);p.append(check);intro.append(p);
}

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
