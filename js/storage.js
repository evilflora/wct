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
