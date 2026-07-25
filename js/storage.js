WF.storage = (function () {
  const STORAGE_KEY = "wf_checklist_progress";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (err) {
      console.error("Unreadable or corrupted localStorage progress, reset.", err);
      return {};
    }
  }

  function save(progressMap) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    window.dispatchEvent(new CustomEvent("wf:progress-changed"));
  }

  function setOwned(itemName, owned) {
    const progress = load();
    progress[itemName] = owned;
    save(progress);
  }

  function setOwnedBulk(itemNames, owned) {
    const progress = load();
    itemNames.forEach((itemName) => { progress[itemName] = owned; });
    save(progress);
  }

  function mergeProgress(incomingMap, mode) {
    const current = mode === "merge" ? load() : {};
    Object.assign(current, incomingMap);
    save(current);
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("wf:progress-changed"));
  }

  return { load, save, setOwned, setOwnedBulk, mergeProgress, clearAll, STORAGE_KEY };
})();