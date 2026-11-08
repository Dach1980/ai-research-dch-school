/* Browser/CommonJS adapter for legacy split v1 and hierarchical bundle v2. */
(function (root) {
  "use strict";
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function uniqueIndex(items, label) {
    const index = new Map();
    (items || []).forEach((item) => {
      if (!item || typeof item.id !== "string" || !item.id) throw new Error(label + " item has no id");
      if (index.has(item.id)) throw new Error("Duplicate " + label + " id: " + item.id);
      index.set(item.id, item);
    });
    return index;
  }
  function normalizeV1(input) {
    const tracks = clone(input.tracks.tracks || []);
    const themes = [];
    const modules = clone(input.modules.modules || []).map((module) => {
      const track = tracks.find((item) => item.id === module.track_id);
      if (!track) throw new Error("Unknown track for module " + module.id);
      const themeId = module.id === "module-11" && module.track_id === "track-a"
        ? "theme-a1-foundations" : "legacy-theme-" + module.track_id.replace(/^track-/, "");
      module.theme_id = themeId;
      if (!themes.some((theme) => theme.id === themeId)) themes.push({
        id: themeId, track_id: module.track_id,
        code: themeId === "theme-a1-foundations" ? "A1" : track.code + "0",
        title: themeId === "theme-a1-foundations" ? "Основы AI и машинного обучения" : track.title + " (legacy grouping)",
        status: "in_progress"
      });
      return module;
    });
    const moduleIndex = uniqueIndex(modules, "module");
    const lessons = clone(input.lessons.lessons || []).map((lesson) => {
      const module = moduleIndex.get(lesson.module_id);
      if (!module || lesson.track_id !== module.track_id) throw new Error("Invalid module/track relation for lesson " + lesson.id);
      return lesson;
    });
    return { schema_version: 2, source_schema_version: 1, tracks, themes, modules, lessons, planets: clone(input.planets.planets || []) };
  }
  function normalizeV2(input) {
    if (!input || input.schema_version !== 2) throw new Error("Expected catalog schema_version 2");
    const result = clone(input);
    const tracks = uniqueIndex(result.tracks, "track");
    const themes = uniqueIndex(result.themes, "theme");
    const modules = uniqueIndex(result.modules, "module");
    uniqueIndex(result.lessons, "lesson");
    uniqueIndex(result.planets, "planet");
    result.themes.forEach((theme) => {
      if (!tracks.has(theme.track_id)) throw new Error("Theme " + theme.id + " references unknown track");
    });
    result.modules.forEach((module) => {
      const theme = themes.get(module.theme_id);
      if (!theme) throw new Error("Module " + module.id + " references unknown theme");
      module.track_id = theme.track_id;
    });
    result.lessons.forEach((lesson) => {
      const module = modules.get(lesson.module_id);
      if (!module) throw new Error("Lesson " + lesson.id + " references unknown module");
      lesson.track_id = module.track_id;
    });
    result.source_schema_version = 2;
    return result;
  }
  async function load(options) {
    const opts = options || {};
    const base = (opts.baseUrl || "").replace(/\/$/, "");
    const fetcher = opts.fetchImpl || root.fetch.bind(root);
    async function get(path) {
      const response = await fetcher(base + "/" + path);
      if (!response.ok) throw new Error("Catalog request failed (" + response.status + "): " + path);
      return response.json();
    }
    if (opts.schemaVersion === 2) return normalizeV2(await get("catalog-v2.json"));
    const names = ["tracks", "modules", "lessons", "planets"];
    const docs = await Promise.all(names.map((name) => get(name + ".json")));
    return normalizeV1({ tracks: docs[0], modules: docs[1], lessons: docs[2], planets: docs[3] });
  }
  const api = { normalizeV1, normalizeV2, load };
  root.DCHCatalogCompat = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
