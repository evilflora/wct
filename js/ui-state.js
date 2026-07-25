WF.uiState = (function () {
  const STORAGE_KEY = "wf_checklist_ui_state";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Unreadable or corrupted localStorage ui state, reset.", err);
      return {};
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  return { load, save, STORAGE_KEY };
})();
