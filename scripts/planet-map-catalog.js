(() => {
  const universe = document.querySelector("[data-planets-root]");
  const list = document.querySelector("[data-planets-list]");
  if (!universe || !list) return;
  const localeRaw = document.documentElement.lang || "ru";
  const locale = localeRaw.toLowerCase().startsWith("zh") ? "zh" : localeRaw.toLowerCase().startsWith("en") ? "en" : "ru";
  const ui = {
    ru:{track:"Направление",theme:"ТЕМА",module:"МОДУЛЬ",lesson:"УРОК",beginner:"Начальный уровень",outcomes:"После урока вы сможете",prereq:"Рекомендуется предварительно пройти:",noPrereq:"Предварительная подготовка не требуется.",code:"Код урока",duration:"Длительность",related:"Соответствующие уроки",access:"Доступ",open:"Открытый урок",start:"Начать урок ↗",about:"О Track A",map:"Показать на карте",published:"опубликовано",empty:"Опубликованных уроков пока нет.",error:"Не удалось загрузить каталог знаний.",minutes:"минут"},
    en:{track:"TRACK",theme:"THEME",module:"MODULE",lesson:"LESSON",beginner:"Beginner",outcomes:"Learning outcomes",prereq:"Recommended prerequisites:",noPrereq:"No prerequisites required.",code:"Lesson code",duration:"Duration",related:"Related lessons",access:"Access",open:"Open lesson",start:"Start lesson ↗",about:"About Track A",map:"Show on map",published:"published",empty:"No published lessons yet.",error:"Could not load the knowledge catalogue.",minutes:"min"},
    zh:{track:"方向",theme:"主题",module:"模块",lesson:"课程",beginner:"初级",outcomes:"学完本课程后，你将能够",prereq:"建议先完成：",noPrereq:"无需先修课程。",code:"课程编号",duration:"时长",related:"关联课程",access:"访问权限",open:"开放课程",start:"开始学习 ↗",about:"关于Track A",map:"在地图中显示",published:"已发布",empty:"暂无已发布课程。",error:"无法加载知识目录。",minutes:"分钟"}
  }[locale];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const positions = {"A.1":[50,49],"A.2":[72,31],"A.3":[28,30],"A.4":[72,68],"A.5":[28,68],"A.6":[50,87],"A.7":[50,20],"A.8":[50,38]};
  const descriptions = {
    "A.1":{ru:"Первая остановка в изучении AI: определение искусственного интеллекта, устройство AI-систем, основные подходы и границы возможностей.",en:"An introduction to artificial intelligence: definitions, AI system structure, major approaches and their limits.",zh:"人工智能入门：人工智能的定义、AI系统结构、主要方法及其能力边界。"},
    "A.2":{ru:"Разбираем различия Artificial Intelligence, Machine Learning и Deep Learning, их взаимосвязь и примеры систем.",en:"Compare Artificial Intelligence, Machine Learning and Deep Learning, their relationships and practical examples.",zh:"比较人工智能、机器学习与深度学习，理解三者关系及实际应用示例。"},
    "A.3":{ru:"Исследуем, как алгоритм обучения использует примеры, настраивает параметры модели и почему важно обобщение на новые данные.",en:"Explore how learning algorithms use examples, adjust model parameters and generalize to unseen data.",zh:"了解学习算法如何利用样本调整模型参数，以及为什么模型必须能够泛化到新数据。"},
    "A.4":{ru:"Изучаем архитектуру модели, параметры и гиперпараметры, различия training и inference, а также место модели в AI-системе.",en:"Study model architecture, parameters and hyperparameters, training versus inference, and the model's role in an AI system.",zh:"学习模型架构、参数与超参数、训练与推理的区别，以及模型在AI系统中的作用。"},
    "A.5":{ru:"Учимся честно оценивать качество: разделять данные, выбирать метрики, анализировать ошибки, дисбаланс классов и утечку данных.",en:"Learn sound model evaluation: data splitting, metric selection, error analysis, class imbalance and data leakage.",zh:"学习可靠的模型评估方法：数据集划分、指标选择、错误分析、类别不平衡与数据泄漏。"},
    "A.6":{ru:"Изучаем обобщающую способность, недообучение и переобучение; читаем learning curves и выбираем способы улучшения модели.",en:"Study generalization, underfitting and overfitting, interpret learning curves and choose ways to improve a model.",zh:"学习泛化、欠拟合与过拟合，解读学习曲线并选择改进模型的方法。"},
    "A.7":{ru:"История развития AI: от математических предпосылок и Дартмутского семинара до глубокого обучения и генеративных моделей.",en:"Trace AI history from mathematical foundations and the Dartmouth workshop to deep learning and generative models.",zh:"回顾人工智能的发展历程：从数学基础和达特茅斯研讨会，到深度学习与生成式模型。"},
    "A.8":{ru:"Сравниваем явные правила, логический вывод, машинное обучение и гибридные AI-системы.",en:"Compare explicit rules, logical inference, machine learning and hybrid AI systems.",zh:"比较显式规则、逻辑推理、机器学习与混合式AI系统。"}
  };
  const outcomes = {
    "A.1":{
      en:["Explain the concept of Artificial Intelligence and its main interpretations.","Distinguish intelligence, intelligent behaviour and consciousness.","Describe the general structure of an AI system and major approaches to building one.","Give examples of AI tasks and explain system limitations."],
      zh:["解释人工智能的概念及其主要定义。","区分智能、智能行为与意识。","描述AI系统的基本结构及其主要构建方法。","举例说明AI任务并解释系统局限。"]},
    "A.2":{
      en:["Distinguish AI, Machine Learning and Deep Learning.","Explain the relationships between AI, ML and DL.","Give examples of AI systems that do not use machine learning.","Classify applied systems by the approach they use."],
      zh:["区分人工智能、机器学习与深度学习。","解释AI、ML与DL之间的关系。","举例说明不使用机器学习的AI系统。","根据所采用的方法对应用系统进行分类。"]},
    "A.3":{
      en:["Distinguish data, observations, features and the target variable.","Explain the roles of the learning algorithm, model, parameters and loss function.","Describe supervised and unsupervised learning with simple examples.","Explain generalization, underfitting and overfitting.","Recognize data leakage in a learning setup."],
      zh:["区分数据、观测、特征与目标变量。","解释学习算法、模型、参数和损失函数的作用。","用简单示例描述监督学习与无监督学习。","解释泛化、欠拟合与过拟合。","识别学习任务中的数据泄漏。"]},
    "A.4":{
      en:["Explain the difference between data, a learning algorithm and a model.","Distinguish architecture, parameters and hyperparameters.","Explain the stages of training and inference.","Compare linear models, decision trees and neural networks conceptually.","Describe the model's place in a complete AI system."],
      zh:["解释数据、学习算法与模型之间的区别。","区分模型架构、参数与超参数。","解释训练与推理阶段。","从概念层面比较线性模型、决策树和神经网络。","描述模型在完整AI系统中的位置。"]},
    "A.5":{
      en:["Distinguish training, validation and test datasets.","Choose metrics for regression and classification.","Interpret a confusion matrix, precision, recall and F1.","Recognize class imbalance, overfitting and data leakage.","Explain the limits and scope of an evaluation."],
      zh:["区分训练集、验证集与测试集。","选择回归与分类任务的评估指标。","解读混淆矩阵、精确率、召回率与F1。","识别类别不平衡、过拟合与数据泄漏。","解释评估的局限性与适用范围。"]},
    "A.6":{
      en:["Explain generalization and distinguish memorization from learning patterns.","Identify underfitting, good generalization and overfitting using training and validation error.","Interpret error curves against model complexity and dataset size.","Choose improvements such as regularization, early stopping, more data and sound validation."],
      zh:["解释泛化，并区分记忆训练样本与学习规律。","根据训练误差和验证误差识别欠拟合、良好泛化与过拟合。","结合模型复杂度和数据量解读误差曲线。","选择正则化、提前停止、增加数据和合理验证等改进方法。"]},
    "A.7":{
      en:["Explain the mathematical and computational foundations of AI.","Distinguish early precursors from the formation of AI as a discipline.","Compare symbolic, expert, statistical and neural approaches.","Explain AI winters and the conditions behind modern breakthroughs."],
      zh:["解释人工智能的数学与计算基础。","区分早期思想先驱与人工智能学科的正式形成。","比较符号主义、专家系统、统计方法与神经网络方法。","解释人工智能寒冬及现代突破出现的条件。"]},
    "A.8":{
      en:["Explain symbols, rules, knowledge bases and inference mechanisms.","Describe the machine-learning cycle.","Distinguish explicitly programmed logic from parameters learned from data.","Recognize hybrid AI systems."],
      zh:["解释符号、规则、知识库与推理机制。","描述机器学习的基本流程。","区分显式编写的逻辑与从数据中学习的参数。","识别混合式AI系统。"]}
  };
  const localizedUrl = lesson => (lesson.url_i18n && lesson.url_i18n[locale]) || lesson.url;
  const localizedTitle = lesson => (lesson.title_i18n && lesson.title_i18n[locale]) || lesson.title;
  const codeFor = lesson => lesson.v3_target_codes?.length ? lesson.v3_target_codes.join(" · ") : lesson.id;
  const renderDetails = (entry, selectedId) => {
    const {lesson,theme,module,track}=entry, details=document.querySelector("#planetDetails");
    if(!details)return;
    const key=lesson.legacy_id||lesson.id, codes=codeFor(lesson);
    const prereq=(lesson.prerequisites||[]).join(", ");
    const access=lesson.access==="open"?ui.open:lesson.access;
    const duration=lesson.duration_min===lesson.duration_max?String(lesson.duration_min):lesson.duration_min+"–"+lesson.duration_max;
    const outcomeList=locale==="ru"?(lesson.learning_outcomes||[]):(outcomes[key]?.[locale]||[]);
    details.innerHTML='<div class="side-top"><span class="side-tag">'+esc(ui.track)+' '+esc(track.code)+' · '+esc(ui.theme)+' '+esc(theme.id.split(".").pop())+' · '+esc(ui.module)+' '+esc(module.id.split(".").pop())+'</span><span class="level">'+esc(ui.beginner)+'</span></div>'+
      '<p class="side-tag">'+esc(ui.lesson)+' '+esc(codes)+'</p><h2>'+esc(localizedTitle(lesson))+'</h2><p class="side-desc">'+esc(descriptions[key]?.[locale]||"")+'</p>'+
      '<div class="side-divider"></div><span class="side-heading">'+esc(ui.outcomes)+'</span><ul class="outcomes">'+outcomeList.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
      '<p class="side-desc">'+esc(prereq?ui.prereq+" "+prereq+".":ui.noPrereq)+'</p><div class="meta-grid">'+
      '<div class="meta-item"><small>'+esc(ui.code)+'</small><strong>'+esc(codes)+'</strong></div>'+
      '<div class="meta-item"><small>'+esc(ui.duration)+'</small><strong>'+esc(duration+" "+ui.minutes)+'</strong></div>'+
      '<div class="meta-item"><small>'+esc(ui.related)+'</small><strong>'+esc(codes)+'</strong></div>'+
      '<div class="meta-item"><small>'+esc(ui.access)+'</small><strong>'+esc(access)+'</strong></div></div>'+
      '<div class="side-actions"><a class="button primary" href="../'+esc(localizedUrl(lesson))+'">'+esc(ui.start)+'</a><a class="button secondary" href="../tracks/understanding-ai'+(locale==="ru"?"":locale==="en"?"-en":"-zh")+'.html">'+esc(ui.about)+'</a></div>';
    universe.querySelectorAll("[data-lesson-id]").forEach(node=>node.setAttribute("aria-pressed",String(node.dataset.lessonId===selectedId)));
  };
  const scrollToDetails=()=>document.querySelector("#planetDetails")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  const load=async()=>{
    try{
      if(!window.DCHCatalogCompat)throw new Error("catalog adapter missing");
      const data=await window.DCHCatalogCompat.loadLegacyProjection({baseUrl:"../data/catalog"});
      const tracks=new Map(data.tracks.map(x=>[x.id,x])),themes=new Map(data.themes.map(x=>[x.id,x])),modules=new Map(data.modules.map(x=>[x.id,x]));
      const lessons=new Map(data.lessons.filter(x=>x.status==="published"&&x.track_id==="track-a").map(x=>[x.id,x]));
      const planets=data.planets.filter(p=>lessons.has(p.lesson_id)&&lessons.get(p.lesson_id).track_id==="track-a");
      if(!planets.length){list.innerHTML='<p class="map-note">'+esc(ui.empty)+'</p>';return;}
      universe.querySelectorAll("[data-generated-planet]").forEach(node=>node.remove());
      const entries=planets.map((planet,index)=>{
        const lesson=lessons.get(planet.lesson_id),module=modules.get(lesson.module_id),theme=themes.get(module.theme_id),track=tracks.get(theme.track_id),legacy=lesson.legacy_id||lesson.id;
        const code=codeFor(lesson),position=positions[legacy]||[[50,49],[72,31],[28,30]][index%3];
        const button=document.createElement("button");button.type="button";button.className="planet-button";
        if(legacy==="A.2")button.classList.add("planet-a2");if(legacy==="A.4")button.classList.add("planet-a4");if(legacy==="A.5")button.classList.add("planet-a5");
        if(planet.accent_id==="teal")button.classList.add("planet-a3","planet-teal");if(planet.accent_id==="blue")button.classList.add("planet-blue");if(planet.accent_id==="violet")button.classList.add("planet-violet");
        button.style.left=position[0]+"%";button.style.top=Math.min(78,Math.max(18,position[1]))+"%";button.dataset.lessonId=lesson.id;button.dataset.generatedPlanet="true";
        button.setAttribute("aria-label",ui.lesson+" "+code+": "+localizedTitle(lesson));
        button.innerHTML='<span class="planet-core"><span>'+esc(code)+'</span></span><span class="planet-code">'+esc(code)+'</span><span class="planet-name">'+esc(localizedTitle(lesson))+'</span>';
        const entry={planet,lesson,module,theme,track};button.addEventListener("click",()=>{renderDetails(entry,lesson.id);if(matchMedia("(max-width:900px)").matches)scrollToDetails();});
        universe.appendChild(button);return entry;
      });
      list.innerHTML='<div class="side-top"><strong>Track A · '+(locale==="ru"?"Understanding AI":locale==="en"?"Understanding AI":"理解人工智能")+'</strong><span class="level">'+entries.length+" "+esc(ui.published)+'</span></div>'+
        entries.map(({lesson,module,theme})=>'<div class="list-entry"><div><strong>'+esc(codeFor(lesson))+' — '+esc(localizedTitle(lesson))+'</strong><small>'+esc(ui.theme)+' '+esc(theme.id.split(".").pop())+' · '+esc(ui.module)+' '+esc(module.id.split(".").pop())+' · '+esc(lesson.duration_min+"–"+lesson.duration_max+" "+ui.minutes)+'</small></div><div class="list-actions"><button type="button" data-select-lesson="'+esc(lesson.id)+'">'+esc(ui.map)+'</button><a class="button secondary" href="../'+esc(localizedUrl(lesson))+'">'+esc(ui.start)+'</a></div></div>').join("");
      list.querySelectorAll("[data-select-lesson]").forEach(button=>button.addEventListener("click",()=>{const entry=entries.find(x=>x.lesson.id===button.dataset.selectLesson);if(entry)renderDetails(entry,entry.lesson.id);document.getElementById("mapMode")?.click();universe.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});}));
      renderDetails(entries[0],entries[0].lesson.id);
    }catch(error){list.innerHTML='<p class="map-note">'+esc(ui.error)+' '+esc(error.message)+'</p>';}
  };
  load();
})();