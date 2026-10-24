/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

import migration20261003 from "../migrations/min/20261003000000.min.js"; // because i'm using the Minify storage file i need to go the parent folder
import migration20261010 from "../migrations/min/20261010000000.min.js"; // because i'm using the Minify storage file i need to go the parent folder
import migration20261020 from "../migrations/min/20261020000000.min.js"; // because i'm using the Minify storage file i need to go the parent folder
import migration20261024 from "../migrations/min/20261024000000.min.js"; // because i'm using the Minify storage file i need to go the parent folder

WF.storage = (function () {
  const STORAGE_KEY = "wf_checklist_progress";
  const ARCHIVE_KEY = "wf_checklist_archived_progress";
  const VERSION_KEY = "wf_checklist_current_version";

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

  const MIGRATIONS = [
    { version: 20261003000000, renames: migration20261003 },
    { version: 20261010000000, renames: migration20261010 },
    { version: 20261020000000, renames: migration20261020 },
    { version: 20261024000000, renames: migration20261024 },
  ];

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

  function runMigrations(progressMap, targetVersion, fromVersion = null) {
    const target = parseVersion(targetVersion);
    if (target === null) return progressMap;

    const current = parseVersion(fromVersion ?? localStorage.getItem(VERSION_KEY)) ?? 0;
    if (current >= target) return progressMap;

    const pending = MIGRATIONS
      .filter((m) => m.version > current && m.version <= target)
      .sort((a, b) => a.version - b.version);
    if (pending.length === 0) return progressMap;

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
    if (WF.render) WF.render.renderAll();
    if (WF.mastery) WF.mastery.render();
  });

  return { load, loadForSync, save, setOwned, setOwnedBulk, clearAll, runMigrations, STORAGE_KEY, ARCHIVE_KEY };
})();