/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.exportImport = (function () {
  const MAX_PROGRESS_ENTRIES = 50000;

  function exportToFile() {
    const options = WF.options.load();

    const payload = {
      schema_version: WF.SCHEMA_VERSION,
      exported_at: new Date().toISOString(),
      progress: WF.storage.loadForSync(),
    };

    if (options.includeOptionsInExport) {
      const exportedOptions = { ...options };
      if (!options.includeSyncKeyInExport) delete exportedOptions.syncKey;
      payload.options = exportedOptions;
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: `wf-checklist-${new Date().toISOString().slice(0, 10)}.json`
    });

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function isValidPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
    const progress = payload.progress;
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) return false;
    const keys = Object.keys(progress);
    if (keys.length > MAX_PROGRESS_ENTRIES) return false;
    return keys.every((key) => typeof progress[key] === "boolean");
  }

  async function importFromFile(file) {
    const text = await file.text();
    const payload = JSON.parse(text);

    if (!isValidPayload(payload)) throw new Error("Invalid payload format");

    if (payload.schema_version >= WF.SCHEMA_VERSION) {
      WF.toast.show(`Imported file come from a higher version and is not compatible with this version, please update.`, { type: "error", timeoutMs: 5000 });
      console.warn(`Imported file schema version (${payload.schema_version}) differs from expected (${WF.SCHEMA_VERSION}).`);
    }

    WF.storage.save(payload.progress);

    if (payload.options && typeof payload.options === "object") {
      WF.options.save({ ...WF.options.load(), ...payload.options });
    }
  }

  return { exportToFile, importFromFile, isValidPayload };
})();
