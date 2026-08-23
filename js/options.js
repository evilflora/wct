WF.options = (function () {
  const STORAGE_KEY = "wf_checklist_options";
  const DEFAULTS = {
    includeOptionsInExport: false,
    includeFounderItems: false,
    includePvpItems: false,
    syncKey: null,
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (err) {
      console.error("Unreadable or corrupted localStorage options, reset.", err);
      return { ...DEFAULTS };
    }
  }

  function save(optionsMap) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(optionsMap));
    } catch (err) {
      console.error("Failed to save options to localStorage.", err);
    }
  }

  return { load, save, STORAGE_KEY };
})();