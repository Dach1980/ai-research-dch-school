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
      const crosswalkResponse = await fetch("../data/ais-dch-crosswalk.json", { cache: "no-store" });
      if (!crosswalkResponse.ok) throw new Error("Crosswalk HTTP " + crosswalkResponse.status);
      const crosswalk = await crosswalkResponse.json();
      root.innerHTML = `
        <section class="admin-panel">
          <div class="roadmap-item-head"><span class="roadmap-id">ВНЕШНИЙ РЕФЕРЕНС</span><span class="roadmap-date">Обновлено: ${escapeHtml(data.updated_at)}</span></div>
          <h2>${escapeHtml(data.reference.name)}</h2>
          <p class="muted">Авторы: ${data.reference.authors.map(escapeHtml).join(" · ")}</p>
          <p><a class="text-link" href="${escapeHtml(data.reference.website)}" target="_blank" rel="noopener">Сайт AIS ↗</a> · <a class="text-link" href="${escapeHtml(data.reference.research_repository)}" target="_blank" rel="noopener">Исследовательский репозиторий ↗</a></p>
          <p>${(data.reference.author_channels || []).map(channel => `<a class="text-link" href="${escapeHtml(channel.url)}" target="_blank" rel="noopener">${escapeHtml(channel.name)} ↗</a> <span class="muted">— ${escapeHtml(channel.author)}</span>`).join(" · ")}</p>
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
      const coverageGroups = [...new Set(crosswalk.crosswalk.map(item => item.group))];
      const counts = crosswalk.crosswalk.reduce((acc, item) => {
        acc[item.coverage] = (acc[item.coverage] || 0) + 1;
        return acc;
      }, {});
      const groupHtml = coverageGroups.map(group => {
        const items = crosswalk.crosswalk.filter(item => item.group === group);
        const itemHtml = items.map(item =>
          '<details class="roadmap-item"><summary><div class="roadmap-item-head"><span class="roadmap-id">DCH ' +
          escapeHtml(item.dch_module) + '</span><span class="roadmap-status ' +
          (item.coverage === "Сильное" ? "done" : "progress") + '">' + escapeHtml(item.coverage) +
          '</span></div><strong>' + escapeHtml(item.dch_title) + '</strong></summary><p><strong>AIS:</strong> ' +
          escapeHtml(item.ais_modules) + '</p><p><strong>Темы пересечения:</strong> ' +
          escapeHtml(item.topic_overlap) + '</p><p><strong>Prerequisites DCH:</strong> ' +
          escapeHtml(item.prerequisites) + '</p><p class="muted">' + escapeHtml(item.assessment) +
          '</p></details>'
        ).join("");
        return '<h3>' + escapeHtml(group) + '</h3><div class="roadmap-list">' + itemHtml + '</div>';
      }).join("");
      root.insertAdjacentHTML("beforeend",
        '<section class="admin-panel"><div class="roadmap-item-head"><span class="roadmap-id">CURRICULUM CROSSWALK</span><span class="roadmap-date">Снимок: ' +
        escapeHtml(crosswalk.updated_at) + '</span></div><h2>Матрица AIS → DCH: все 40 модулей</h2><p class="muted">Сопоставление по содержанию, а не по совпадению номеров. Источник AIS — публичный каталог; полный lesson-level аудит не подразумевается.</p>' +
        '<div class="admin-grid roadmap-stats"><div class="admin-stat"><strong>' + crosswalk.totals.dch_modules +
        '</strong><span>Модулей DCH</span></div><div class="admin-stat"><strong>' + (counts["Сильное"] || 0) +
        '</strong><span>Сильное покрытие</span></div><div class="admin-stat"><strong>' + (counts["Частичное"] || 0) +
        '</strong><span>Частичное</span></div><div class="admin-stat"><strong>' + (counts["Нет прямого аналога"] || 0) +
        '</strong><span>Нет прямого аналога</span></div></div>' + groupHtml +
        '<p><a class="text-link" href="../docs/education/AIS_DCH_CURRICULUM_CROSSWALK_2026-11-11.md">Открыть полный отчёт и матрицу ↗</a></p></section>');

    } catch (error) {
      root.innerHTML = '<section class="admin-panel"><h2>Не удалось загрузить чек-лист AIS</h2><p class="muted">Проверьте доступность data/ais-reference-checklist.json. ' + escapeHtml(error.message) + '</p></section>';
    }
  };
  load();
})();
