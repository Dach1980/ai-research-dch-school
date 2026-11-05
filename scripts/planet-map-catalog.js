(() => {
  const universe = document.querySelector("[data-planets-root]");
  const list = document.querySelector("[data-planets-list]");
  if (!universe || !list) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  fetch("../data/catalog/lessons.json", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(async lessonData => {
      const planetResponse = await fetch("../data/catalog/planets.json", { cache: "no-store" });
      if (!planetResponse.ok) throw new Error("HTTP " + planetResponse.status);
      const planetData = await planetResponse.json();
      const lessons = new Map((lessonData.lessons || []).filter(x => x.status === "published").map(x => [x.id,x]));
      const planets = (planetData.planets || []).filter(p => lessons.has(p.lesson_id));
      if (!planets.length) {
        list.innerHTML = '<p class="map-note">Опубликованных планет пока нет.</p>';
        return;
      }
      const positions = [[50,49],[72,31],[28,30],[77,68],[25,70],[50,17]];
      const colors = { blue:"blue", violet:"violet", teal:"teal", amber:"amber" };
      const planetNodes = planets.map((planet,index) => {
        const lesson = lessons.get(planet.lesson_id);
        const [left,top] = positions[index % positions.length];
        const href = "../" + lesson.url;
        const node = document.createElement("a");
        node.className = "planet-button" + (index === 1 ? " planet-a2" : "");
        node.href = href;
        node.style.left = left + "%";
        node.style.top = top + "%";
        node.setAttribute("aria-label", "Открыть планету " + lesson.id + ": " + lesson.title);
        node.innerHTML = '<span class="planet-core"><span style="font:800 14px Manrope">' + esc(lesson.id) + '</span></span><span class="planet-code">' + esc(lesson.id) + '</span><span class="planet-name">' + esc(lesson.title) + '</span>';
        return node;
      });
      universe.querySelectorAll("[data-generated-planet]").forEach(node => node.remove());
      planetNodes.forEach(node => { node.dataset.generatedPlanet = "true"; universe.appendChild(node); });
      list.innerHTML = '<div class="side-top"><strong>Track A · Understanding AI</strong><span class="level">' + planets.length + ' опубликовано</span></div>' +
        planets.map(planet => {
          const lesson = lessons.get(planet.lesson_id);
          return '<div class="list-entry"><div><strong>' + esc(lesson.id) + ' — ' + esc(lesson.title) + '</strong><small>' +
            esc(lesson.level === "beginner" ? "Начальный уровень" : lesson.level) + ' · ' +
            esc(lesson.duration_min + "–" + lesson.duration_max + " минут") + '</small></div><a class="button secondary" href="../' + esc(lesson.url) + '">Открыть урок ↗</a></div>';
        }).join("");
    })
    .catch(error => {
      list.innerHTML = '<p class="map-note">Не удалось загрузить каталог планет: ' + esc(error.message) + '.</p>';
    });
})();
