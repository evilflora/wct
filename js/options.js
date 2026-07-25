WF.options = (function () {
  const STORAGE_KEY = "wf_checklist_options";
  const DEFAULTS = {
    includeOptionsInExport: false,
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(optionsMap));
  }

  return { load, save, STORAGE_KEY };
})();
