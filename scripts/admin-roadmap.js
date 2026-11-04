(() => {
  const root = document.querySelector("#audit-roadmap-content");
  if (!root) return;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const statusLabels = {
    approved: "Согласовано",
    in_progress: "В работе",
    planned: "Запланировано",
    done: "Завершено",
    blocked: "Заблокировано"
  };
  const statusClass = (status) => ({
    approved: "approved", in_progress: "progress", planned: "planned",
    done: "done", blocked: "blocked"
  })[status] || "planned";
  const list = (items) => Array.isArray(items) && items.length
    ? '<ul>' + items.map(item => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>'
    : '<p class="muted">Пока не заполнено.</p>';
  const render = (data) => {
    const counts = (data.roadmap || []).reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1; return acc;
    }, {});
    root.innerHTML = `
      <div class="roadmap-meta">Обновлено: <strong>${escapeHtml(data.updated_at)}</strong> · Источник данных: <code>data/audit-roadmap.json</code></div>
      <div class="admin-grid roadmap-stats">
        <div class="admin-stat"><strong>${(data.roadmap || []).length}</strong><span>Этапов в roadmap</span></div>
        <div class="admin-stat"><strong>${counts.approved || 0}</strong><span>Согласовано</span></div>
        <div class="admin-stat"><strong>${counts.in_progress || 0}</strong><span>В работе</span></div>
      </div>
      <section class="admin-panel"><h2>Зафиксированные принципы</h2>${list(data.principles)}</section>
      <section class="admin-panel"><h2>Roadmap</h2>
        <div class="roadmap-list">${(data.roadmap || []).map(item => `
          <article class="roadmap-item">
            <div class="roadmap-item-head"><span class="roadmap-id">${escapeHtml(item.id)}</span><span class="roadmap-date">${escapeHtml(item.date)}</span><span class="roadmap-status ${statusClass(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span></div>
            <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.decision)}</p>
            <details><summary>Критерии приёмки и источники</summary>${list(item.acceptance)}<p class="muted"><strong>Основание:</strong> ${escapeHtml(item.source || "Не указано")}</p></details>
          </article>`).join("")}</div>
      </section>
      <section class="admin-panel"><h2>Журнал аудита и решений</h2>
        <div class="audit-list">${(data.audit_log || []).map(entry => `
          <article class="audit-entry"><div class="roadmap-item-head"><strong>${escapeHtml(entry.id)}</strong><span class="roadmap-date">${escapeHtml(entry.date)}</span><span class="audit-type">${escapeHtml(entry.type)}</span></div>
          <h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.result)}</p>
          ${entry.limitations?.length ? '<p class="muted"><strong>Ограничения:</strong> ' + escapeHtml(entry.limitations.join(" · ")) + '</p>' : ""}
          ${entry.evidence?.length ? '<p class="muted"><strong>Доказательства:</strong> ' + escapeHtml(entry.evidence.join(" · ")) + '</p>' : ""}
          </article>`).join("")}</div>
      </section>
      <section class="admin-panel"><h2>Правила ведения записей</h2>${list(data.notes)}</section>`;
  };
  fetch("../data/audit-roadmap.json", { cache: "no-store" })
    .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
    .then(render)
    .catch(error => { root.innerHTML = '<div class="warning">Не удалось загрузить журнал: ' + escapeHtml(error.message) + '. Проверьте наличие data/audit-roadmap.json.</div>'; });
})();