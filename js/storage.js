WF.storage = (function () {
  const STORAGE_KEY = "wf_checklist_progress";
  const VERSION_KEY = "wf_checklist_current_version";
  const DELETE = true;

  function pruneOrphanKeys(progressMap) {
    if (!WF.data || typeof WF.WCT_VERSION === "undefined") return progressMap;

    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion === String(WF.WCT_VERSION)) return progressMap;

    const validKeys = new Set(WF.data.map((item) => item.item_name));
    const orphanKeys = Object.keys(progressMap).filter((key) => !validKeys.has(key));

    if (orphanKeys.length > 0) {
      console.log("Deleted: ", orphanKeys);
      if (DELETE) {
        orphanKeys.forEach((key) => delete progressMap[key]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      }
    }

    localStorage.setItem(VERSION_KEY, String(WF.WCT_VERSION));
    
    return progressMap;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return pruneOrphanKeys(JSON.parse(raw));
    } catch (err) {
      console.error("Unreadable or corrupted localStorage progress, reset.", err);
      return {};
    }
  }

  function save(progressMap) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      window.dispatchEvent(new CustomEvent("wf:progress-changed"));
    } catch (err) {
      console.error("Failed to save progress to localStorage.", err);
    }
  }

  function setOwned(itemName, owned) {
    const progress = load();
    if (!!progress[itemName] === !!owned) return;
    progress[itemName] = owned;
    save(progress);
  }

  function setOwnedBulk(itemNames, owned) {
    const progress = load();
    let hasChanged = false;

    itemNames.forEach((itemName) => {
      if (!!progress[itemName] !== !!owned) {
        progress[itemName] = owned;
        hasChanged = true;
      }
    });

    if (hasChanged) save(progress);
  }

  function clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("wf:progress-changed"));
    } catch (err) {
      console.error("Failed to clear progress from localStorage.", err);
    }
  }

  return { load, save, setOwned, setOwnedBulk, clearAll, STORAGE_KEY };
})();