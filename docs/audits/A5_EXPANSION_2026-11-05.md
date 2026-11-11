# A.5 — расширение содержания и практикума

**Дата:** 2026-11-05  
**Статус:** расширение внесено в RU / EN / 中文; требуется CI и браузерная приёмка.

## Что добавлено во все три версии

1. Отдельный раздел о ROC curve и ROC-AUC: TPR/FPR, смысл площади под кривой и ограничения метрики.
2. Отдельный раздел о Precision–Recall curve и Average Precision (AP), включая объяснение, почему PR-подход особенно полезен при редком положительном классе.
3. Общая для трёх языков SVG-схема, связывающая ROC-AUC, PR-AUC/AP и K-fold cross-validation.
4. Раздел о K-fold cross-validation и выборе схемы разбиения: StratifiedKFold, GroupKFold и TimeSeriesSplit.
5. Практикум классификации на Python: синтетический дисбалансный набор данных, stratified train/test split, DummyClassifier baseline, Pipeline со StandardScaler и LogisticRegression, confusion matrix, precision, recall, F1, ROC-AUC, Average Precision и StratifiedKFold cross-validation.
6. Расширенный словарь: ROC-AUC, Average Precision, stratified split и K-fold cross-validation.

## Файлы

- `lessons/a-5-how-to-evaluate-a-model.html`
- `lessons/a-5-how-to-evaluate-a-model-en.html`
- `lessons/a-5-how-to-evaluate-a-model-zh.html`

## Проверки и ограничения

- Все три страницы обновлены в `main`.
- Новый SVG-блок ROC/PR/CV вставлен идентичным исходным SVG-кодом во все три страницы; подписи локализованы.
- Код использует scikit-learn API; автоматическое выполнение Python-примера и GitHub Actions после обновления необходимо подтвердить отдельно.
- Это методическое расширение, а не буквальное восстановление неизвестного первичного исходника A.5.
- Остальные пять уроков и общая унификация всех прежних иллюстраций ещё требуют полного аудита и доработки.
