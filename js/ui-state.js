/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.uiState = (function () {
  const STORAGE_KEY = "wf_checklist_ui_state";

  let _cache = null;

  function load() {
    if (_cache) return _cache;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _cache = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Unreadable or corrupted localStorage UI state, reset.", err);
      _cache = {};
    }
    return _cache;
  }

  function save(state) {
    _cache = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save UI state to localStorage.", err);
    }
  }

  return { load, save, STORAGE_KEY };
})();
