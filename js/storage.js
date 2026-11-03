/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.storage = (function () {
  const STORAGE_KEY = "wf_checklist_progress";
  const ARCHIVE_KEY = "wf_checklist_archived_progress";
  const VERSION_KEY = "wf_checklist_current_version";

  const MIGRATION_VERSIONS = [20261003000000, 20261010000000, 20261020000000, 20261024000000];
  const MIGRATIONS_PATH = "../migrations/min/";
  const loadedMigrations = new Map();

  let _cache = null;

  function readArchive() {
    try {
      const raw = localStorage.getItem(ARCHIVE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn("Unreadable archived progress, ignored.", err);
      return {};
    }
  }

  function parseVersion(value) {
    const num = Number(value);
    return value !== null && value !== "" && Number.isSafeInteger(num) && num >= 0 ? num : null;
  }

  function renameKeys(map, renames) {
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    let changed = false;

    renames.forEach(([oldKey, newKey]) => {
      if (typeof oldKey !== "string" || typeof newKey !== "string" || oldKey === newKey) return;
      if (oldKey === "__proto__" || newKey === "__proto__") return;
      if (!hasOwn(map, oldKey)) return;

      if (!hasOwn(map, newKey)) map[newKey] = map[oldKey];
      delete map[oldKey];
      changed = true;
    });

    return changed;
  }

  function getPendingVersions(fromVersion, targetVersion) {
    const target = parseVersion(targetVersion);
    if (target === null) return [];

    const current = parseVersion(fromVersion) ?? 0;
    return MIGRATION_VERSIONS.filter((version) => version > current && version <= target).sort((a, b) => a - b);
  }

  async function loadMigration(version) {
    if (loadedMigrations.has(version)) return;

    const module = await import(`${MIGRATIONS_PATH}${version}.min.js`);
    if (!Array.isArray(module.default)) throw new TypeError(`Migration ${version} does not export a renames array.`);
    loadedMigrations.set(version, module.default);
  }

  async function ensureMigrations(fromVersion = null, targetVersion = WF.WCT_VERSION) {
    const from = fromVersion ?? localStorage.getItem(VERSION_KEY);
    await Promise.all(getPendingVersions(from, targetVersion).map(loadMigration));
  }

  function findMissingMigrations() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) return [];
      return getPendingVersions(localStorage.getItem(VERSION_KEY), WF.WCT_VERSION).filter((version) => !loadedMigrations.has(version));
    } catch (err) {
      console.warn("Could not inspect pending migrations.", err);
      return [];
    }
  }

  function runMigrations(progressMap, targetVersion, fromVersion = null) {
    const target = parseVersion(targetVersion);
    if (target === null) return progressMap;

    const current = parseVersion(fromVersion ?? localStorage.getItem(VERSION_KEY)) ?? 0;
    if (current >= target) return progressMap;

    const pendingVersions = getPendingVersions(current, target);
    if (pendingVersions.length === 0) return progressMap;

    const missing = pendingVersions.filter((version) => !loadedMigrations.has(version));
    if (missing.length > 0) throw new Error(`Migration(s) ${missing.join(", ")} not loaded: await WF.storage.ensureMigrations() first.`);

    const pending = pendingVersions.map((version) => ({ version, renames: loadedMigrations.get(version) }));

    try {
      const archive = readArchive();
      let progressChanged = false;
      let archiveChanged = false;

      pending.forEach(({ renames }) => {
        progressChanged = renameKeys(progressMap, renames) || progressChanged;
        archiveChanged = renameKeys(archive, renames) || archiveChanged;
      });

      if (progressChanged) localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      if (archiveChanged) localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
      console.info(`Applied ${pending.length} storage migration(s) up to ${target}.`);
    } catch (err) {
      console.error("Storage migration failed to persist.", err);
    }

    return progressMap;
  }

  function pruneOrphanKeys(progressMap) {
    if (!WF.data) return progressMap;

    const validKeys = new Set(WF.data.map((item) => item.item_name));
    const orphanKeys = Object.keys(progressMap).filter((key) => !validKeys.has(key));

    if (orphanKeys.length > 0) {
      const archive = readArchive();
      orphanKeys.forEach((key) => { archive[key] = progressMap[key]; delete progressMap[key]; });
      try {
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      } catch (err) {
        console.error("Failed to archive orphan keys.", err);
        return progressMap;
      }
      console.info(`Archived ${orphanKeys.length} orphan key(s).`, orphanKeys);
    }

    return progressMap;
  }

  function load() {
    if (_cache) return _cache;

    const missing = findMissingMigrations();
    if (missing.length > 0) throw new Error(`Storage not ready, migration(s) ${missing.join(", ")} not loaded: await WF.storage.ready first.`);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        _cache = {};
        return _cache;
      }

      const parsed = JSON.parse(raw);
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new TypeError("Progress is not a plain object.");

      const targetVersion = typeof WF.WCT_VERSION !== "undefined" ? WF.WCT_VERSION : null;
      const storedVersion = parseVersion(localStorage.getItem(VERSION_KEY)) ?? 0;

      const migrated = runMigrations(parsed, targetVersion);
      _cache = pruneOrphanKeys(migrated);

      if (targetVersion !== null && targetVersion > storedVersion) {
        localStorage.setItem(VERSION_KEY, String(targetVersion));
        const logLabel = `Version updated. Go to NEWS to see the changelog.`;
        if (WF.logs) WF.logs.AddLog(logLabel);
        if (WF.toast) WF.toast.show(logLabel, { type: "info", timeoutMs: 0 });
      }
    } catch (err) {
      console.error("Unreadable or corrupted localStorage progress, reset.", err);
      _cache = {};
    }
    return _cache;
  }

  function loadForSync() {
    return { ...readArchive(), ...load() };
  }

  function save(progressMap) {
    _cache = progressMap;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      window.dispatchEvent(new CustomEvent("wf:progress-changed"));
    } catch (err) {
      console.error("Failed to save progress to localStorage.", err);
      if (WF.toast) WF.toast.show("Save failed: browser storage is full or unavailable.", { type: "error", timeoutMs: 0, key: "wf-storage-full" });
      throw err; 
    }
  }

  function setOwned(itemName, owned) {
    const progress = load();
    if (!!progress[itemName] === !!owned) return;
    progress[itemName] = !!owned;
    save(progress);
  }

  function setOwnedBulk(itemNames, owned) {
    const progress = load();
    let hasChanged = false;

    itemNames.forEach((itemName) => {
      if (!!progress[itemName] !== !!owned) {
        progress[itemName] = !!owned;
        hasChanged = true;
      }
    });

    if (hasChanged) save(progress);
  }

  function clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ARCHIVE_KEY);
      _cache = null;
      window.dispatchEvent(new CustomEvent("wf:progress-changed"));
    } catch (err) {
      console.error("Failed to clear progress from localStorage.", err);
    }
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    _cache = null;
    ensureMigrations()
      .then(() => {
        if (WF.render) WF.render.renderAll();
        if (WF.mastery) WF.mastery.render();
      })
      .catch((err) => console.error("Could not refresh progress changed in another tab.", err));
  });

  const ready = (async function () {
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) return;
    } catch (err) {
      console.warn("Storage unavailable, no migration to load.", err);
      return;
    }
    await ensureMigrations();
  })();
  ready.catch((err) => console.error("Storage migrations could not be loaded.", err));

  return { load, loadForSync, save, setOwned, setOwnedBulk, clearAll, runMigrations, ensureMigrations, ready, STORAGE_KEY, ARCHIVE_KEY };
})();