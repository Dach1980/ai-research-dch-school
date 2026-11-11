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
          <p><a class="text-link" href="${escapeHtml(data.reference.website)}" target="_blank" rel="noopener">Официальный сайт AIS ↗</a> · <a class="text-link" href="${escapeHtml(data.reference.research_repository)}" target="_blank" rel="noopener">Исследовательский репозиторий ↗</a></p>
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
      const governanceResponse = await fetch("../data/curriculum-governance-2026-11-11.json", { cache: "no-store" });
      if (!governanceResponse.ok) throw new Error("Governance HTTP " + governanceResponse.status);
      const governance = await governanceResponse.json();
      const summary = governance.coverage_summary;
      root.insertAdjacentHTML("beforeend",
        '<section class="admin-panel"><div class="roadmap-item-head"><span class="roadmap-id">DCH CURRICULUM GOVERNANCE</span><span class="roadmap-date">Обновлено: ' +
        escapeHtml(governance.updated_at) + '</span></div><h2>Каноническая программа DCH и аудит покрытия</h2>' +
        '<p>Канонический Track A: 16 модулей 11–26. Track B: ядро 27–39 с диагностическим входом. Track C: отдельная программа C0–C12.</p>' +
        '<div class="admin-grid roadmap-stats"><div class="admin-stat"><strong>' + summary.macro_modules +
        '</strong><span>Макромодулей A/B</span></div><div class="admin-stat"><strong>' + summary.catalog_lessons +
        '</strong><span>Lesson UID в каталоге</span></div><div class="admin-stat"><strong>' + summary.published +
        '</strong><span>Published</span></div><div class="admin-stat"><strong>' + summary.review +
        '</strong><span>На проверке</span></div></div>' +
        '<p class="muted">Каталог v3 пока migration_staging. Многие макромодули ещё не имеют точных catalog UID; отсутствующие UID не выдумываются. Предыдущий AIS crosswalk помечен как superseded и не используется как источник структуры DCH.</p>' +
        '<ul><li><a class="text-link" href="../docs/management/DCH_CANONICAL_CURRICULUM_DECISION_2026-11-11.md">Решение о канонической программе ↗</a></li>' +
        '<li><a class="text-link" href="../docs/management/DCH_CANONICAL_CURRICULUM_AND_COVERAGE_AUDIT_2026-11-11.md">Полный аудит и mapping ↗</a></li>' +
        '<li><a class="text-link" href="../docs/education/DCH_LAB_AND_ASSESSMENT_MATRIX_2026-11-11.md">Матрица лабораторных и оценивания ↗</a></li>' +
        '<li><a class="text-link" href="../docs/education/TRACK_A_B_PREREQUISITES_AND_DIAGNOSTIC_ROUTES_2026-11-11.md">Prerequisites и диагностические маршруты ↗</a></li>' +
        '<li><a class="text-link" href="../docs/education/TRACK_C_PRIMARY_SOURCE_AUDIT_2026-11-11.md">Аудит Track C по первичным источникам ↗</a></li></ul></section>');

    } catch (error) {
      root.innerHTML = '<section class="admin-panel"><h2>Не удалось загрузить чек-лист AIS</h2><p class="muted">Проверьте доступность data/ais-reference-checklist.json. ' + escapeHtml(error.message) + '</p></section>';
    }
  };
  load();
})();
