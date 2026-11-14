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
      WF.logs.AddLog("Unreadable or corrupted localStorage UI state, reset", "error", err);
      _cache = {};
    }
    return _cache;
  }

  function save(state) {
    _cache = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      WF.logs.AddLog("Failed to save UI state to localStorage", "error", err);
    }
  }

  return { load, save, STORAGE_KEY };
})();
