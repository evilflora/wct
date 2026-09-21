/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

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

  function pruneOrphanKeys(progressMap) {
    if (!WF.data || typeof WF.WCT_VERSION === "undefined") return progressMap;

    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion === String(WF.WCT_VERSION)) return progressMap;

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

    localStorage.setItem(VERSION_KEY, String(WF.WCT_VERSION));

    return progressMap;
  }

  function load() {
    if (_cache) return _cache;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _cache = raw ? pruneOrphanKeys(JSON.parse(raw)) : {};
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

  return { load, loadForSync, save, setOwned, setOwnedBulk, clearAll, STORAGE_KEY, ARCHIVE_KEY };
})();
