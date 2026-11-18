(function () {
  "use strict";
  var lesson = window.DCH_DEMO_LESSON;
  var target = document.getElementById("lesson-sections");
  if (!lesson || !Array.isArray(lesson.pages) || !target) return;

  var locale = (document.documentElement.lang || "ru").toLowerCase();
  locale = locale.indexOf("zh") === 0 ? "zh" : locale.indexOf("en") === 0 ? "en" : "ru";
  var copy = {
    ru: {
      title: "Что такое XAI и зачем нужно объяснять модели?",
      lead: "Разберём, что именно объясняет XAI, чем объяснение отличается от прогноза и как выбирать методы, не приписывая им больше, чем они действительно показывают.",
      outcomesTitle: "Результаты обучения",
      outcomes: [
        "Объяснять назначение XAI и различать прогноз модели и объяснение её поведения.",
        "Различать Explainable AI и Mechanistic Interpretability, local и global объяснения.",
        "Классифицировать методы по доступу к модели, масштабу и типу объяснения.",
        "Выбирать метод под исследовательский вопрос и критически оценивать ограничения результата."
      ],
      section: "Раздел",
      quizCorrect: "Верно",
      quizIncorrect: "Неверно",
      quizTotal: "Правильных ответов",
      quizIncomplete: "Ответьте на все вопросы для полного результата",
      quizRequired: "Пожалуйста, ответьте на все вопросы этой части.",
      overall: "Общий результат самопроверки"
    },
    en: {
      title: "What is XAI and why should models be explained?",
      lead: "Learn what XAI explains, how an explanation differs from a prediction, and how to choose methods without claiming more than they actually show.",
      outcomesTitle: "Learning outcomes",
      outcomes: [
        "Explain the purpose of XAI and distinguish a model prediction from an explanation of its behaviour.",
        "Distinguish Explainable AI from Mechanistic Interpretability, and local from global explanations.",
        "Classify methods by model access, scope and explanation type.",
        "Choose a method for a research question and critically assess the limits of its result."
      ],
      section: "Section",
      quizCorrect: "Correct",
      quizIncorrect: "Not quite",
      quizTotal: "Correct answers",
      quizIncomplete: "Answer all questions for a complete result",
      quizRequired: "Please answer all questions in this part.",
      overall: "Overall self-check result"
    },
    zh: {
      title: "什么是 XAI？为什么需要解释模型？",
      lead: "了解 XAI 究竟解释什么、解释与预测有何区别，以及如何选择方法而不夸大其实际能够说明的内容。",
      outcomesTitle: "学习目标",
      outcomes: [
        "说明 XAI 的目的，并区分模型预测与对模型行为的解释。",
        "区分可解释人工智能与机制可解释性，以及局部解释与全局解释。",
        "根据模型访问方式、解释范围和解释类型对方法进行分类。",
        "针对研究问题选择方法，并批判性地评估结果的局限。"
      ],
      section: "章节",
      quizCorrect: "正确",
      quizIncorrect: "需要复习",
      quizTotal: "正确答案",
      quizIncomplete: "请回答所有问题以获得完整结果",
      quizRequired: "请回答本部分的全部问题。",
      overall: "自测总成绩"
    }
  }[locale];

  document.title = copy.title + " — AI Research DCH School";
  var h1 = document.getElementById("lesson-title");
  var lead = document.getElementById("lesson-lead");
  if (h1) h1.textContent = copy.title;
  if (lead) lead.textContent = copy.lead;

  var outcomes = document.getElementById("lesson-outcomes");
  if (outcomes) {
    var heading = document.createElement("h2");
    heading.textContent = copy.outcomesTitle;
    var list = document.createElement("ul");
    copy.outcomes.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    outcomes.append(heading, list);
  }

  lesson.pages.forEach(function (page, index) {
    var section = document.createElement("section");
    section.className = "xai-canonical-section";
    section.id = "xai-section-" + page.id;
    section.dataset.sectionId = page.id;
    var heading = document.createElement("h2");
    heading.className = "xai-canonical-section-title";
    heading.textContent = (index + 1) + ". " + (page.title[locale] || page.title.ru);
    var body = document.createElement("div");
    body.className = "xai-canonical-section-content";
    body.innerHTML = (page.content[locale] || page.content.ru || "").replace(/href="\.\.\/practice\//g, 'href="practice/');
    section.append(heading, body);
    target.appendChild(section);
  });

  // Distribute existing lesson material into semantic roots in the approved DOM order.
  var practiceRoot = document.getElementById("lesson-practice");
  var sourcesRoot = document.getElementById("lesson-sources");
  var glossaryRoot = document.getElementById("lesson-glossary");
  var quizRoot = document.getElementById("lesson-quiz");
  var splitLabels = {
    ru: { practice: "Мини-лаборатория: разложить один прогноз", sources: "Первоисточники по методам" },
    en: { practice: "Mini-lab: decompose one prediction", sources: "Primary method references" },
    zh: { practice: "迷你实验：分解一次预测", sources: "方法的主要文献" }
  }[locale];
  if (target && practiceRoot && sourcesRoot && glossaryRoot && quizRoot) {
    Array.prototype.forEach.call(target.querySelectorAll(".xai-canonical-section-content"), function (contentRoot) {
      var destination = contentRoot;
      Array.prototype.forEach.call(Array.from(contentRoot.childNodes), function (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches("h2") && node.textContent.trim() === splitLabels.practice) {
          destination = practiceRoot;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.matches("h3") && node.textContent.trim() === splitLabels.sources) {
          destination = sourcesRoot;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.matches("h2") && destination === sourcesRoot) {
          destination = contentRoot;
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.matches("section.lesson-glossary")) {
          while (node.firstChild) glossaryRoot.appendChild(node.firstChild);
          node.remove();
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.matches(".knowledge-check, .quiz-summary")) {
          quizRoot.appendChild(node);
          if (node.matches(".quiz-summary")) destination = contentRoot;
          return;
        }
        if (destination !== contentRoot) destination.appendChild(node);
      });
    });
  }

  var answers = { q1: "a", q2: "c", q3: "a", q4: "c", q5: "c", q6: "a", q7: "c", q8: "c" };
  var explanations = {
    ru: [
      "XAI изучает поведение модели и связь входов с прогнозом; сам прогноз не объясняет, как он получен.",
      "Объяснение — свидетельство для анализа, а не доказательство причинности, справедливости или правильности.",
      "MI исследует внутренние представления, компоненты и вычислительные цепочки.",
      "Local относится к одному объекту; global обобщает поведение на множестве объектов или модели.",
      "Model-agnostic не означает «подходит всегда»: нужны доступный интерфейс и корректные предположения метода.",
      "Permutation importance сравнивает выбранную метрику до и после перемешивания признака.",
      "PDP может исследовать сочетания значений, которых почти нет в данных, особенно при корреляции признаков.",
      "Среднее абсолютное значение SHAP по объектам даёт глобальную сводку силы вкладов, но не их направление."
    ],
    en: [
      "XAI studies model behaviour and the relation between inputs and predictions; the prediction alone does not explain how it was produced.",
      "An explanation is evidence for analysis, not proof of causality, fairness or correctness.",
      "MI investigates internal representations, components and computational pathways.",
      "Local refers to one instance; global summarises behaviour across instances or the model.",
      "Model-agnostic does not mean universally applicable: an accessible interface and method assumptions still matter.",
      "Permutation importance compares a chosen metric before and after shuffling a feature.",
      "PDP may evaluate combinations rarely found in the data, especially when features are correlated.",
      "Mean absolute SHAP values across instances summarise attribution magnitude, but not direction."
    ],
    zh: [
      "XAI 研究模型行为以及输入与预测之间的关系；单独的预测结果并不能说明它如何产生。",
      "解释是分析证据，不是因果性、公平性或正确性的证明。",
      "MI 研究模型内部表示、组件和计算路径。",
      "Local 指单个样本；Global 汇总多个样本或模型整体的行为。",
      "Model-agnostic 并不意味着任何情况下都适用；仍需可用接口并满足方法假设。",
      "Permutation importance 比较打乱某个特征前后指定指标的变化。",
      "特征相关时，PDP 可能评估数据中很少出现的特征组合。",
      "跨样本的 SHAP 绝对值均值可以汇总归因强度，但不表示方向。"
    ]
  }[locale];

  var storageKey = "dch-xai-4-2-1-quiz";
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch (_) { saved = {}; }
  document.querySelectorAll(".knowledge-check").forEach(function (form) {
    var prior = saved[form.dataset.quiz] || {};
    Object.keys(prior).forEach(function (name) {
      var input = form.elements.namedItem(name);
      if (!input) return;
      Array.prototype.forEach.call(input.length ? input : [input], function (item) {
        item.checked = item.value === prior[name];
      });
    });
  });

  function fieldsFor(id) { return id === "1" ? ["q1", "q2", "q3", "q4", "q5"] : ["q6", "q7", "q8"]; }
  function renderSummary() {
    var summary = document.getElementById("quiz-summary");
    if (!summary) return;
    var completed = ["1", "2"].filter(function (id) { return saved[id] && saved[id].submitted; });
    var total = 0, score = 0;
    completed.forEach(function (id) {
      fieldsFor(id).forEach(function (name) {
        total++;
        if (saved[id][name] === answers[name]) score++;
      });
    });
    summary.textContent = completed.length === 2
      ? copy.overall + ": " + score + " / 8"
      : (locale === "ru" ? "Выполнено частей: " : locale === "en" ? "Parts completed: " : "已完成部分：") + completed.length + " / 2";
  }
  function feedback(form, text, details) {
    var box = form.querySelector(".quiz-feedback");
    if (!box) return;
    box.replaceChildren();
    var p = document.createElement("p");
    p.textContent = text;
    box.appendChild(p);
    if (details && details.length) {
      var list = document.createElement("ul");
      details.forEach(function (detail) {
        var li = document.createElement("li");
        li.textContent = detail;
        list.appendChild(li);
      });
      box.appendChild(list);
    }
    box.classList.add("is-visible");
  }
  document.addEventListener("submit", function (event) {
    var form = event.target.closest(".knowledge-check");
    if (!form) return;
    event.preventDefault();
    var id = form.dataset.quiz;
    var fields = fieldsFor(id);
    var result = {};
    fields.forEach(function (name) {
      var group = form.elements.namedItem(name);
      result[name] = group ? (Array.prototype.find.call(group.length ? group : [group], function (input) { return input.checked; }) || {}).value || "" : "";
    });
    if (fields.some(function (name) { return !result[name]; })) {
      feedback(form, copy.quizRequired);
      return;
    }
    result.submitted = true;
    saved[id] = result;
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
    var score = 0, details = [];
    fields.forEach(function (name) {
      var correct = result[name] === answers[name];
      if (correct) score++;
      details.push(name.toUpperCase() + " — " + (correct ? copy.quizCorrect : copy.quizIncorrect) + ". " + explanations[name.slice(1) - 1]);
    });
    feedback(form, copy.quizTotal + ": " + score + " / " + fields.length, details);
    var button = form.querySelector(".quiz-submit");
    if (button) button.textContent = locale === "ru" ? "Ответы сохранены" : locale === "en" ? "Answers saved" : "答案已保存";
    renderSummary();
  });
  renderSummary();
})();