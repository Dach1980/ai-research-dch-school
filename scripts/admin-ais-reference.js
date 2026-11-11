(() => {
  const root = document.querySelector("#ais-reference-content");
  if (!root) return;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const labels = {
    done: "Выполнено",
    in_progress: "В работе",
    planned: "Не начато"
  };
  const load = async () => {
    try {
      const response = await fetch("../data/ais-reference-checklist.json", { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      const groups = [...new Set(data.checklist.map(item => item.group))];
      const done = data.checklist.filter(item => item.status === "done").length;
      const progress = data.checklist.filter(item => item.status === "in_progress").length;
      const planned = data.checklist.filter(item => item.status === "planned").length;
      root.innerHTML = `
        <section class="admin-panel">
          <div class="roadmap-item-head"><span class="roadmap-id">ВНЕШНИЙ РЕФЕРЕНС</span><span class="roadmap-date">Обновлено: ${escapeHtml(data.updated_at)}</span></div>
          <h2>${escapeHtml(data.reference.name)}</h2>
          <p class="muted">Авторы: ${data.reference.authors.map(escapeHtml).join(" · ")}</p>
          <p><a class="text-link" href="${escapeHtml(data.reference.website)}" target="_blank" rel="noopener">Сайт AIS ↗</a> · <a class="text-link" href="${escapeHtml(data.reference.research_repository)}" target="_blank" rel="noopener">Исследовательский репозиторий ↗</a></p>
          <p class="muted">Текущий каталог AIS: Track A ${escapeHtml(data.reference.current_catalog.track_a)}; Track B ${escapeHtml(data.reference.current_catalog.track_b)}. ${escapeHtml(data.reference.current_catalog.note)}</p>
          <div class="admin-grid roadmap-stats">
            <div class="admin-stat"><strong>${done}</strong><span>Выполнено</span></div>
            <div class="admin-stat"><strong>${progress}</strong><span>В работе</span></div>
            <div class="admin-stat"><strong>${planned}</strong><span>Не начато</span></div>
            <div class="admin-stat"><strong>${data.checklist.length}</strong><span>Всего пунктов</span></div>
          </div>
        </section>
        ${groups.map(group => `
          <section class="admin-panel">
            <h2>${escapeHtml(group)}</h2>
            <div class="roadmap-list">
              ${data.checklist.filter(item => item.group === group).map(item => `
                <article class="roadmap-item">
                  <div class="roadmap-item-head"><span class="roadmap-id">${escapeHtml(item.id)}</span><span class="roadmap-status ${item.status === "done" ? "done" : item.status === "in_progress" ? "progress" : "planned"}">${labels[item.status] || "Не определено"}</span></div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.evidence || "")}</p>
                  ${item.note ? `<p class="muted"><strong>Осталось:</strong> ${escapeHtml(item.note)}</p>` : ""}
                </article>`).join("")}
            </div>
          </section>`).join("")}
        <section class="admin-panel">
          <h2>Документы и доказательства</h2>
          <ul>${data.source_documents.map(doc => `<li><a class="text-link" href="${escapeHtml(doc.url)}">${escapeHtml(doc.title)} ↗</a></li>`).join("")}</ul>
          <p class="muted">Статусы отражают наличие проверяемых артефактов в репозитории, а не субъективную оценку процента готовности. «Выполнено» не означает, что все последующие этапы автоматически приняты.</p>
        </section>`;
    } catch (error) {
      root.innerHTML = '<section class="admin-panel"><h2>Не удалось загрузить чек-лист AIS</h2><p class="muted">Проверьте доступность data/ais-reference-checklist.json. ' + escapeHtml(error.message) + '</p></section>';
    }
  };
  load();
})();
