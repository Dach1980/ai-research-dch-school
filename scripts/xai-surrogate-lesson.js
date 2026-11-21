(function(){"use strict";
const lesson=window.DCH_SURROGATE_912;if(!lesson)throw new Error("Surrogate lesson data missing");
const raw=(document.documentElement.lang||"ru").toLowerCase(),locale=raw.startsWith("zh")?"zh":raw.startsWith("en")?"en":"ru",data=lesson.content[locale];
const labels={ru:["Результаты обучения","Практическая работа","Источники и дополнительное чтение","Проверка знаний","Проверить ответы","Верно","Неверно","Результат","Установка","Запуск","Ожидаемые наблюдения","Словарь терминов","Задание"],en:["Learning outcomes","Practical lab","Sources and further reading","Knowledge check","Check answers","Correct","Incorrect","Score","Install","Run","Expected observations","Key terms","Task"],zh:["学习成果","实践实验","参考资料与延伸阅读","知识检测","检查答案","正确","错误","得分","安装","运行","预期观察","术语词典","任务"]}[locale];
const el=id=>document.getElementById(id),make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
document.title="9.1.2 — "+data.title+" — AI Research DCH School";el("lesson-title").textContent=data.title;el("lesson-lead").textContent=data.lead;
const out=el("lesson-outcomes");out.append(make("h2","",labels[0]));const ul=make("ul");data.outcomes.forEach(x=>ul.append(make("li","",x)));out.append(ul);
function fig(kind){if(!window.DCHLessonSVG)throw new Error("Shared SVG renderer missing");const zh=locale==="zh",en=locale==="en";let s;
if(kind==="pipeline"){const nodes=zh?[
["1. 输入样本 xᵢ","从数据集或选定邻域中取样本"],
["2. 查询原始模型 f","对每个样本计算预测 f(xᵢ)"],
["3. 组成训练数据 D","配对保存输入 xᵢ 与模型输出 f(xᵢ)"],
["4. 训练代理模型 g","让简单模型学习复现 f 的输出"],
["5. 检查 fidelity","比较同一批输入上的 f(xᵢ) 与 g(xᵢ)"],
["6. 解释适用范围","报告近似效果、复杂度与局限"]
]:en?[
["1. Input samples xᵢ","Take examples from the data or a selected neighbourhood"],
["2. Query original f","Compute prediction f(xᵢ) for each example"],
["3. Build training set D","Pair each input xᵢ with the output f(xᵢ)"],
["4. Train surrogate g","Fit a simpler model to reproduce f's outputs"],
["5. Check fidelity","Compare f(xᵢ) and g(xᵢ) on the same inputs"],
["6. State the scope","Report fit, complexity, and limitations"]
]:[
["1. Входные объекты xᵢ","Берём объекты из данных или выбранной окрестности"],
["2. Запрос к исходной f","Для каждого объекта вычисляем прогноз f(xᵢ)"],
["3. Формируем выборку D","Сохраняем пары: вход xᵢ и выход f(xᵢ)"],
["4. Обучаем суррогат g","Простая модель учится воспроизводить выходы f"],
["5. Проверяем fidelity","Сравниваем f(xᵢ) и g(xᵢ) на одних объектах"],
["6. Указываем границы","Описываем качество приближения, сложность и ограничения"]
];s={type:"surrogate-training-pipeline",layout:"grid",id:"surrogate-"+locale+"-flow",title:zh?"代理模型训练流程":en?"Surrogate-model training workflow":"Процесс обучения суррогатной модели",description:zh?"输入样本经过原始模型生成目标输出，再用于训练和评估代理模型。":en?"Input samples are queried against the original model; its outputs train and evaluate the surrogate.":"Входные объекты проходят через исходную модель; её прогнозы становятся целевыми значениями для обучения и проверки суррогата.",caption:zh?"代理模型学习的是原始模型的输出，而不是自动学习真实标签；局部任务还要限定样本邻域。":en?"The surrogate learns original-model outputs, not automatically the true labels; a local task also restricts the sample neighbourhood.":"Суррогат обучается на выходах исходной модели, а не автоматически на истинных метках; для локальной задачи дополнительно ограничивают окрестность объектов.",scrollLabel:zh?"代理模型训练流程":en?"Surrogate training workflow":"Этапы обучения суррогата",nodes:nodes.map((n,i)=>({id:"step-"+(i+1),title:n[0],detail:n[1],tone:i===3?"accent":"surface"}))};}
else if(kind==="scope"){const t=zh?["x₀ 附近的邻域","输入范围","模型输出","邻近样本","其他区域"]:en?["Neighbourhood around x₀","Input domain","Model response","Nearby points","Other regions"]:["Окрестность около x₀","Область входов","Выход модели","Близкие точки","Другие области"];s={type:"surrogate-scope",layout:"scatter",id:"surrogate-"+locale+"-scope",title:t[0],description:t[0],caption:zh?"局部结论仅限选定区域；几何距离不一定等于语义接近。":en?"A local conclusion is limited to the selected region; geometric distance is not always semantic proximity.":"Локальный вывод ограничен выбранной областью; геометрическая близость не всегда предметная.",scrollLabel:t[0],xLabel:t[1],yLabel:t[2],neighborhood:{center:[.49,.52],radius:.29,label:"x₀",nearby:[[.39,.58],[.55,.62],[.58,.43],[.43,.39],[.51,.48],[.34,.49],[.62,.55],[.46,.69],[.66,.39]],distant:[[.08,.18],[.16,.83],[.86,.16],[.91,.78],[.78,.91],[.12,.55],[.84,.53]]},observedLabel:t[3],syntheticLabel:t[4]};}
else{const t=zh?["代理模型复杂度","与 f 的一致性","简单模型","更复杂的模型"]:en?["Surrogate complexity","Agreement with f","Simpler model","More complex model"]:["Сложность суррогата","Согласованность с f","Простая модель","Более сложная модель"];s={type:"surrogate-tradeoff",layout:"plot",id:"surrogate-"+locale+"-tradeoff",title:t[0]+" / "+t[1],description:zh?"可能的权衡，并非普遍定律。":en?"A possible trade-off, not a universal law.":"Возможный компромисс, а не универсальный закон.",caption:zh?"复杂度提高可能改善一致性，但降低可解释性。":en?"Greater complexity may improve agreement but reduce interpretability.":"Рост сложности может улучшить согласованность, но снизить понятность.",scrollLabel:t[0],xLabel:t[0],yLabel:t[1],points:[[.02,.18],[.12,.30],[.22,.38],[.32,.52],[.42,.55],[.52,.68],[.62,.71],[.72,.82],[.82,.85],[.92,.91],[.99,.94]],annotations:[{x:.05,y:.18,text:t[2]},{x:.66,y:.82,text:t[3]}],sparseLabel:zh?"示意":en?"Schematic":"Схематично"};}
const f=window.DCHLessonSVG.render(s);f.classList.add("lime-figure");return f;}
const sections=el("lesson-sections");data.sections.forEach(s=>{const sec=make("section","xai-canonical-section");sec.id="surrogate-"+s[0];sec.append(make("h2","xai-canonical-section-title",s[1]));const body=make("div","xai-canonical-section-content");s[2].forEach(p=>body.append(make("p","",p)));if(s[0]==="objective"){
const math=locale==="ru"?{
intro:"Сначала выбираем модель g из допустимого семейства G. Для каждой такой модели оцениваем, насколько её прогнозы отличаются от прогнозов исходной модели f, а затем добавляем штраф за излишнюю сложность.",
definitionsTitle:"Обозначения в общей формуле",
definitions:[["g*","Искомый суррогат: модель, которая минимизирует заданный критерий."],["arg min","Операция выбора такого g, при котором выражение в квадратных скобках минимально."],["g ∈ G","g выбирается из семейства допустимых моделей G — например, линейных моделей или деревьев ограниченной глубины."],["D","Набор входных объектов, на которых сравниваются прогнозы f и g."],["f(x)","Прогноз исходной модели для объекта x."],["g(x)","Прогноз суррогатной модели для того же объекта x."],["L(f,g;D)","Общая ошибка согласования прогнозов f и g на наборе D."],["Ω(g)","Штраф за сложность суррогата: например, за число признаков, глубину дерева или число правил."],["λ","Неотрицательный коэффициент, задающий силу штрафа за сложность. Большое λ сильнее поощряет простые модели."]],
localIntro:"Для локального объяснения вводим объект x₀, прогноз которого хотим понять. Вместо одинакового вклада всех точек учитываем их релевантность объекту x₀.",
localDefinitionsTitle:"Обозначения в локальной формуле",
localDefinitions:[["x₀","Конкретный объект, для которого строится объяснение."],["xᵢ","i-й объект из набора D; индекс i позволяет перечислить все N объектов."],["wₓ₀(xᵢ)","Вес объекта xᵢ относительно x₀. Чем точка релевантнее выбранной окрестности, тем больше её вклад."],["ℓ(f(xᵢ), g(xᵢ))","Локальная ошибка на одном объекте: насколько прогнозы f и g расходятся именно на xᵢ."],["N","Количество объектов в наборе D."],["Σᵢ₌₁ᴺ","Суммирование вкладов всех N объектов выборки."],["Lₓ₀","Суммарная взвешенная ошибка в задаче объяснения объекта x₀."]],
exampleTitle:"Числовой пример: как считается локальная ошибка",
exampleIntro:"Предположим, мы объясняем объект x₀ и используем абсолютную ошибку между прогнозами. В таблице три точки; веса условные и нужны только для демонстрации вычисления.",
exampleHeaders:["Объект","f(xᵢ)","g(xᵢ)","Вес","Абс. ошибка","Вклад в сумму"],
exampleRows:[["x₁","0,80","0,75","0,8","0,05","0,04"],["x₂","0,70","0,65","1,0","0,05","0,05"],["x₃","0,40","0,50","0,3","0,10","0,03"]],
exampleResult:"Итого: 0,04 + 0,05 + 0,03 = 0,12. Это иллюстративная взвешенная ошибка для трёх точек, а не результат обучения конкретной реализации LIME.",
distinction:"Важно: ℓ — ошибка на одной точке, а Lₓ₀ — сумма взвешенных ошибок по набору точек. В общей формуле L обозначает агрегированную ошибку, а Ω(g) отдельно отвечает за простоту."
}:locale==="en"?{
intro:"First, choose a candidate g from the allowed family G. For each candidate, measure how much its predictions differ from the original model f, then add a penalty for unnecessary complexity.",
definitionsTitle:"Symbols in the general objective",
definitions:[["g*","The sought surrogate: the model that minimizes the stated objective."],["arg min","Choose the value of g that makes the expression in brackets as small as possible."],["g ∈ G","g is selected from an allowed family G, such as linear models or depth-limited trees."],["D","The set of input examples on which predictions from f and g are compared."],["f(x)","The original model's prediction for input x."],["g(x)","The surrogate's prediction for the same input x."],["L(f,g;D)","The aggregate disagreement between f and g over dataset D."],["Ω(g)","A penalty for surrogate complexity, such as feature count, tree depth, or number of rules."],["λ","A non-negative coefficient controlling the complexity penalty. A larger λ favours simpler models more strongly."]],
localIntro:"For a local explanation, introduce x₀, the instance whose prediction we want to understand. Points do not contribute equally: their relevance to x₀ determines their weight.",
localDefinitionsTitle:"Symbols in the local objective",
localDefinitions:[["x₀","The particular instance being explained."],["xᵢ","The i-th example in D; the index i enumerates all N examples."],["wₓ₀(xᵢ)","The weight of xᵢ relative to x₀. More relevant points receive a larger contribution."],["ℓ(f(xᵢ), g(xᵢ))","The per-example loss: how much the predictions of f and g differ on xᵢ."],["N","The number of examples in dataset D."],["Σᵢ₌₁ᴺ","Sum the contributions of all N examples."],["Lₓ₀","The total weighted loss for explaining instance x₀."]],
exampleTitle:"Worked example: calculating local loss",
exampleIntro:"Suppose we explain x₀ and use absolute difference between predictions. The table contains three examples; the weights are illustrative and only demonstrate the calculation.",
exampleHeaders:["Example","f(xᵢ)","g(xᵢ)","Weight","Abs. error","Weighted term"],
exampleRows:[["x₁","0.80","0.75","0.8","0.05","0.04"],["x₂","0.70","0.65","1.0","0.05","0.05"],["x₃","0.40","0.50","0.3","0.10","0.03"]],
exampleResult:"Total: 0.04 + 0.05 + 0.03 = 0.12. This is an illustrative weighted loss for three examples, not the output of a specific LIME implementation.",
distinction:"Remember: ℓ is the loss for one example, while Lₓ₀ aggregates weighted losses across examples. In the general objective, L is the aggregate loss and Ω(g) separately controls simplicity."
}:{
intro:"首先，从允许的模型集合 G 中选择候选模型 g。对每个候选模型，衡量它与原始模型 f 的预测差异，再加入对模型复杂度的惩罚。",
definitionsTitle:"一般优化目标中的符号",
definitions:[["g*","所求的代理模型：使目标表达式最小的模型。"],["arg min","选择使方括号内表达式尽可能小的 g。"],["g ∈ G","g 从允许的模型集合 G 中选择，例如线性模型或限制深度的决策树。"],["D","用于比较 f 与 g 预测结果的输入样本集合。"],["f(x)","原始模型对输入 x 的预测。"],["g(x)","代理模型对同一输入 x 的预测。"],["L(f,g;D)","在数据集 D 上衡量 f 与 g 预测差异的总体损失。"],["Ω(g)","代理模型复杂度惩罚，例如特征数量、树深度或规则数量。"],["λ","控制复杂度惩罚强度的非负系数；λ 越大，越偏向简单模型。"]],
localIntro:"进行局部解释时，引入需要解释预测的对象 x₀。不同样本的贡献不相同：它们相对于 x₀ 的相关程度决定权重。",
localDefinitionsTitle:"局部优化目标中的符号",
localDefinitions:[["x₀","需要解释的特定样本。"],["xᵢ","D 中第 i 个样本；索引 i 用于枚举全部 N 个样本。"],["wₓ₀(xᵢ)","样本 xᵢ 相对于 x₀ 的权重；越相关的样本贡献通常越大。"],["ℓ(f(xᵢ), g(xᵢ))","单个样本上的损失：f 与 g 对 xᵢ 的预测差异。"],["N","数据集 D 中的样本数量。"],["Σᵢ₌₁ᴺ","对全部 N 个样本的贡献求和。"],["Lₓ₀","解释 x₀ 时的加权总损失。"]],
exampleTitle:"数值示例：计算局部损失",
exampleIntro:"假设我们解释 x₀，并使用预测值之间的绝对差。表中有三个样本；权重仅用于演示计算。",
exampleHeaders:["样本","f(xᵢ)","g(xᵢ)","权重","绝对误差","加权项"],
exampleRows:[["x₁","0.80","0.75","0.8","0.05","0.04"],["x₂","0.70","0.65","1.0","0.05","0.05"],["x₃","0.40","0.50","0.3","0.10","0.03"]],
exampleResult:"总和：0.04 + 0.05 + 0.03 = 0.12。这是三个样本的示意加权损失，并非某个 LIME 实现的运行结果。",
distinction:"请注意：ℓ 表示单个样本的损失，Lₓ₀ 表示跨样本加权汇总的损失。在一般目标中，L 是汇总损失，而 Ω(g) 单独控制模型简洁性。"
};
const sectionLead=make("p","",math.intro);body.append(sectionLead);
const forms=[
["g* = arg min(g ∈ G) [ L(f,g;D) + λ Ω(g) ]",locale==="ru"?"Общая задача: минимизировать ошибку согласования и штраф за сложность.":locale==="en"?"General objective: minimize disagreement plus the complexity penalty.":"一般目标：最小化预测差异与复杂度惩罚。"],
["Lₓ₀(f,g;D) = Σᵢ₌₁ᴺ wₓ₀(xᵢ) · ℓ(f(xᵢ),g(xᵢ))",locale==="ru"?"Локальная ошибка: складываем ошибки отдельных точек с учётом их весов.":locale==="en"?"Local loss: sum per-example errors after weighting each example.":"局部损失：对每个样本的误差加权后求和。"],
["g*ₓ₀ = arg min(g ∈ G) [ Lₓ₀(f,g;D) + λ Ω(g) ]",locale==="ru"?"Итоговая локальная задача: хорошее приближение около x₀ при контролируемой сложности.":locale==="en"?"Combined local objective: fit near x₀ while controlling complexity.":"局部优化目标：在控制复杂度的同时拟合 x₀ 附近的行为。"]
];
forms.forEach(([expr,note])=>{const f=make("div","formula");f.append(make("div","formula-expression",expr),make("p","formula-note",note));body.append(f);});
body.append(make("h3","",math.definitionsTitle));
function addTable(headers,rows){const wrap=make("div","xai-table-wrap"),table=make("table"),thead=make("thead"),tr=make("tr");headers.forEach(h=>tr.append(make("th","",h)));thead.append(tr);table.append(thead);const tbody=make("tbody");rows.forEach(row=>{const r=make("tr");row.forEach((cell,i)=>r.append(make(i===0?"th":"td","",cell)));tbody.append(r);});table.append(tbody);wrap.append(table);body.append(wrap);}
addTable(locale==="ru"?["Обозначение","Смысл"]:locale==="en"?["Symbol","Meaning"]:["符号","含义"],math.definitions);
body.append(make("p","",math.localIntro),make("h3","",math.localDefinitionsTitle));
addTable(locale==="ru"?["Обозначение","Смысл"]:locale==="en"?["Symbol","Meaning"]:["符号","含义"],math.localDefinitions);
body.append(make("h3","",math.exampleTitle),make("p","",math.exampleIntro));
addTable(math.exampleHeaders,math.exampleRows);
body.append(make("p","",math.exampleResult),make("p","formula-note",math.distinction));
}if(s[3])body.append(fig(s[3]));sec.append(body);sections.append(sec);});
const p=data.practice,pr=el("lesson-practice");pr.append(make("h2","",labels[1]),make("h3","",p.title),make("p","",p.intro),make("h3","",labels[12]),make("p","",p.task),make("p","",labels[8]+": python -m pip install numpy matplotlib scikit-learn"));const pre=make("pre","language-python"),code=make("code","language-python");code.textContent=lesson.practiceCode;pre.dataset.language="python";pre.append(code);pr.append(pre,make("p","",labels[9]+": python lessons/practice/a-9-1-2-local-surrogate-models.py"),make("h3","",labels[10]),make("p","",p.expected));
const src=el("lesson-sources");src.append(make("h2","",labels[2]));const ol=make("ol");data.sources.forEach(([name,url])=>{const li=make("li"),a=make("a","",name);a.href=url;a.target="_blank";a.rel="noopener noreferrer";li.append(a);ol.append(li);});src.append(ol);
if(!window.DCHLessonComponents)throw new Error("Canonical glossary component missing");window.DCHLessonComponents.renderGlossary(el("lesson-glossary"),data.glossary,labels[11]);
const quiz=el("lesson-quiz");quiz.append(make("h2","",labels[3]));const form=make("form","knowledge-check"),feedback=make("div","quiz-feedback");feedback.setAttribute("aria-live","polite");data.quiz.forEach((q,i)=>{const fs=make("fieldset");fs.append(make("legend","",(i+1)+". "+q[0]));q[1].forEach((v,j)=>{const label=make("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=String(j);input.required=true;label.append(input,make("span","",v));fs.append(label);});form.append(fs);});const submit=make("button","quiz-submit",labels[4]);submit.type="submit";form.append(submit,feedback);form.addEventListener("submit",e=>{e.preventDefault();let score=0;const result=make("ol");data.quiz.forEach((q,i)=>{const chosen=form.querySelector('input[name="q'+i+'"]:checked'),ok=chosen&&Number(chosen.value)===q[2];if(ok)score++;const li=make("li");li.append(make("strong","",(i+1)+". "+(ok?labels[5]:labels[6])),make("p","",q[3]));result.append(li);});feedback.replaceChildren(document.createTextNode(labels[7]+": "+score+" / "+data.quiz.length),result);feedback.classList.add("is-visible");});quiz.append(form);
})();