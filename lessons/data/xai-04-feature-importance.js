window.DCH_FEATURE_IMPORTANCE_LESSON = {
 uid:"les-a-0171", code:"7.2.1",
 title:{ru:"Важность признаков (Feature Importance)",en:"Feature Importance",zh:"特征重要性"},
 lead:{ru:"Важность признаков помогает понять поведение модели.",en:"Feature importance helps explain model behaviour.",zh:"特征重要性帮助理解模型行为。"},
 outcomes:{ru:["Различать глобальную и локальную важность.","Объяснять коэффициенты и MDI.","Учитывать корреляции и масштаб."],en:["Distinguish global and local importance.","Explain coefficients and MDI.","Account for correlation and scale."],zh:["区分全局与局部重要性。","解释系数与 MDI。","考虑相关性与尺度。"]},
 pages:[
 {id:"meaning",title:{ru:"1. Что измеряет важность?",en:"1. What does importance measure?",zh:"1. 重要性衡量什么？"},content:{
 ru:"<p><strong>Feature importance</strong> — оценка роли признака в поведении конкретной модели на заданных данных.</p><p><strong>Глобальная важность</strong> агрегирует множество наблюдений; <strong>локальная</strong> относится к одному объекту.</p><div data-feature-diagram></div>",
 en:"<p><strong>Feature importance</strong> estimates a feature's role in a particular model on given data.</p><p><strong>Global importance</strong> aggregates observations; <strong>local importance</strong> concerns one case.</p><div data-feature-diagram></div>",
 zh:"<p><strong>特征重要性</strong>估计特征在给定数据上对特定模型行为的作用。</p><p><strong>全局重要性</strong>汇总多个观测；<strong>局部重要性</strong>针对单个样本。</p><div data-feature-diagram></div>"
 }}
 ],
 practice:{ru:"<h2>Практика</h2><p>Сравните коэффициенты LogisticRegression и MDI RandomForest на Breast Cancer dataset.</p>",en:"<h2>Practice</h2><p>Compare LogisticRegression coefficients and RandomForest MDI on the Breast Cancer dataset.</p>",zh:"<h2>实践</h2><p>在乳腺癌数据集上比较逻辑回归系数与随机森林 MDI。</p>"},
 sources:{ru:"<h2>Источники</h2><ol><li>Breiman (2001), Random Forests.</li></ol>",en:"<h2>References</h2><ol><li>Breiman (2001), Random Forests.</li></ol>",zh:"<h2>参考文献</h2><ol><li>Breiman (2001), Random Forests.</li></ol>"},
 glossary:{ru:[["Важность","Роль признака."],["MDI","Уменьшение impurity."]],en:[["Importance","Feature role."],["MDI","Impurity decrease."]],zh:[["重要性","特征作用。"],["MDI","不纯度下降。"]]},
 quiz:[{q:{ru:"Что такое global importance?",en:"What is global importance?",zh:"什么是全局重要性？"},o:{ru:["Агрегат","Локальная оценка"],en:["Aggregate","Local estimate"],zh:["汇总","局部估计"]},a:0,e:{ru:"По выборке.",en:"Across the dataset.",zh:"跨数据集汇总。"}}]
};