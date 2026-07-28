WF.uiState = (function () {
  const STORAGE_KEY = "wf_checklist_ui_state";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Unreadable or corrupted localStorage UI state, reset.", err);
      return {};
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save UI state to localStorage.", err);
    }
  }

  return { load, save, STORAGE_KEY };
})();