WF.undo = (function () {
  "use strict";

  const STORAGE_KEY = "wf_checklist_undo_stack";
  const MAX_ENTRIES = 10;
  const UNDO_EVENT = "wf:undo-changed";

  function sanitizeStack(raw) {
    if (!Array.isArray(raw)) return [];

    const clean = [];
    for (const entry of raw) {
      if (!entry || !Number.isSafeInteger(entry.index) || !Array.isArray(entry.changes)) continue;

      const changes = entry.changes
        .filter((c) => c && typeof c.uniqueName === "string" && c.uniqueName.length > 0 && typeof c.previous === "boolean")
        .map((c) => ({ uniqueName: c.uniqueName, previous: c.previous }));

      if (changes.length > 0) clean.push({ index: entry.index, changes });
    }

    clean.sort((a, b) => a.index - b.index);
    return clean.slice(-MAX_ENTRIES);
  }

  function loadStack() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? sanitizeStack(JSON.parse(raw)) : [];
    } catch (err) {
      WF.logs.AddLog("Undo stack could not be loaded, starting empty", "error", err);
      return [];
    }
  }

  let stack = loadStack();

  function notify() {
    window.dispatchEvent(new CustomEvent(UNDO_EVENT));
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
    } catch (err) {
      WF.logs.AddLog("Undo stack could not be saved", "error", err);
    }
    notify();
  }

  function record(uniqueNames, newState) {
    try {
      if (!Array.isArray(uniqueNames) || typeof newState !== "boolean") return false;

      const progress = WF.storage.load() || {};
      const seen = new Set();
      const changes = [];

      for (const name of uniqueNames) {
        if (typeof name !== "string" || name.length === 0 || seen.has(name)) continue;
        seen.add(name);

        const previous = !!progress[name];
        if (previous !== newState) changes.push({ uniqueName: name, previous });
      }

      if (changes.length === 0) return false;

      const index = stack.length > 0 ? stack[stack.length - 1].index + 1 : 1;
      stack.push({ index, changes });

      while (stack.length > MAX_ENTRIES) stack.shift();

      persist();
      return true;
    } catch (err) {
      WF.logs.AddLog("Undo record failed", "error", err);
      return false;
    }
  }

  function undoLast() {
    const entry = stack[stack.length - 1];
    if (!entry) return 0;

    const validNames = new Set(WF.data.map((item) => item.item_name));
    const next = { ...WF.storage.load() };
    let restored = 0;

    for (const { uniqueName, previous } of entry.changes) {
      if (!validNames.has(uniqueName)) continue;
      next[uniqueName] = previous;
      restored++;
    }

    if (restored > 0) WF.storage.save(next);

    stack.pop();
    persist();
    return restored;
  }

  function peek() {
    const entry = stack[stack.length - 1];
    if (!entry) return null;

    return {
      count: entry.changes.length,
      restoreTo: entry.changes[0].previous,
      uniqueNames: entry.changes.map((change) => change.uniqueName),
    };
  }

  function clear() {
    stack = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      WF.logs.AddLog("Undo stack could not be cleared", "error", err);
    }
    notify();
  }

  const size = () => stack.length;

  window.addEventListener("storage", (event) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;

    try {
      stack = event.key === null || event.newValue === null ? [] : sanitizeStack(JSON.parse(event.newValue));
    } catch (err) {
      WF.logs.AddLog("Undo stack from another tab is unreadable, reset", "error", err);
      stack = [];
    }
    notify();
  });

  return { record, undoLast, clear, size, peek };
})();