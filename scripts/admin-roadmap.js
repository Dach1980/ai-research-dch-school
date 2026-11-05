(() => {
  const root = document.querySelector("#roadmap-content");
  if (!root) return;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const statusLabels = {
    approved: "Согласовано", in_progress: "В работе", planned: "Запланировано",
    done: "Завершено", blocked: "Заблокировано"
  };
  const statusClass = (status) => ({
    approved: "approved", in_progress: "progress", planned: "planned",
    done: "done", blocked: "blocked"
  })[status] || "planned";
  const list = (items) => Array.isArray(items) && items.length
    ? "<ul>" + items.map(item => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>"
    : '<p class="muted">Пока не заполнено.</p>';
  const render = (data) => {
    const roadmap = Array.isArray(data.roadmap) ? data.roadmap : [];
    const reports = Array.isArray(data.audit_log) ? [...data.audit_log].sort((a,b) =>
      String(b.date || "").localeCompare(String(a.date || "")) ||
      String(b.id || "").localeCompare(String(a.id || ""))) : [];
    const counts = roadmap.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1; return acc;
    }, {});
    root.innerHTML = `
      <div class="roadmap-meta">Обновлено: <strong>${escapeHtml(data.updated_at)}</strong> · Источник: <code>data/audit-roadmap.json</code></div>
      <div class="admin-grid roadmap-stats">
        <div class="admin-stat"><strong>${roadmap.length}</strong><span>Этапов в Roadmap</span></div>
        <div class="admin-stat"><strong>${counts.done || 0}</strong><span>Завершено</span></div>
        <div class="admin-stat"><strong>${counts.in_progress || 0}</strong><span>В работе</span></div>
      </div>
      <section class="admin-panel"><h2>Зафиксированные принципы</h2>${list(data.principles)}</section>
      <section class="admin-panel"><h2>План развития школы</h2>
        <div class="roadmap-list">${roadmap.map(item => `
          <article class="roadmap-item">
            <div class="roadmap-item-head"><span class="roadmap-id">${escapeHtml(item.id)}</span><span class="roadmap-date">${escapeHtml(item.date)}</span><span class="roadmap-status ${statusClass(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span></div>
            <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.decision)}</p>
            <details><summary>Критерии приёмки и источники</summary>${list(item.acceptance)}<p class="muted"><strong>Основание:</strong> ${escapeHtml(item.source || "Не указано")}</p></details>
          </article>`).join("")}</div>
      </section>
      <section class="admin-panel"><h2>Отчёты о выполненных работах</h2>
        <p class="muted">Каждая запись содержит дату, результат, ограничения и ссылки на доказательства в репозитории. Новые отчёты добавляются в data/audit-roadmap.json.</p>
        <div class="audit-list">${reports.map(entry => `
          <article class="audit-entry">
            <div class="roadmap-item-head"><strong>${escapeHtml(entry.id)}</strong><span class="roadmap-date">${escapeHtml(entry.date)}</span><span class="audit-type">${escapeHtml(entry.type)}</span></div>
            <h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.result)}</p>
            ${entry.limitations?.length ? '<p class="muted"><strong>Ограничения:</strong> ' + escapeHtml(entry.limitations.join(" · ")) + '</p>' : ""}
            ${entry.evidence?.length ? '<details><summary>Доказательства и файлы</summary>' + list(entry.evidence) + '</details>' : ""}
          </article>`).join("")}</div>
      </section>
      <section class="admin-panel"><h2>Правила ведения Roadmap</h2>${list(data.notes)}</section>`;
  };
  fetch("../data/audit-roadmap.json", { cache: "no-store" })
    .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(render)
    .catch(error => { root.innerHTML = '<div class="warning">Не удалось загрузить Roadmap: ' + escapeHtml(error.message) + '. Проверьте data/audit-roadmap.json.</div>'; });
})();