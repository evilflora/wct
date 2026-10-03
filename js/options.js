/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.options = (function () {
  
  const STORAGE_KEY = "wf_checklist_options";
  const DEFAULTS = {
    includeOptionsInExport: false,
    includeSyncKeyInExport: false,
    includeFounderItems: false,
    includePvpItems: false,
    syncKey: null,
  };

  let _cache = null;

  function load() {
    if (_cache) return _cache;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _cache = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch (err) {
      console.error("Unreadable or corrupted localStorage options, reset.", err);
      _cache = { ...DEFAULTS };
    }
    return _cache;
  }

  function save(optionsMap) {
    const sanitized = { ...optionsMap, themeColors: WF.theme ? WF.theme.sanitizeColors(optionsMap.themeColors) : {} };
    _cache = sanitized;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (err) {
      console.error("Failed to save options to localStorage.", err);
      if (WF.toast) WF.toast.show("Options could not be saved: browser storage is full.", { type: "error", key: "wf-options-full" });
    }
  }

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) _cache = null;
  });

  return { load, save, DEFAULTS, STORAGE_KEY };
})();
