WF.exportImport = (function () {
  function exportToFile() {
    const options = WF.options.load();

    const payload = {
      schema_version: WF.SCHEMA_VERSION,
      exported_at: new Date().toISOString(),
      progress: WF.storage.load(),
    };

    if (options.includeOptionsInExport) {
      payload.options = options;
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `wf-checklist-${new Date().toISOString().slice(0, 10)}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  function importFromFile(file, onDone) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const payload = JSON.parse(event.target.result);

        if (!payload || typeof payload !== "object") {
          throw new Error("Invalid payload format");
        }

        if (payload.schema_version !== WF.SCHEMA_VERSION) {
          console.warn(`Imported file schema version (${payload.schema_version}) differs from expected (${WF.SCHEMA_VERSION}).`);
        }

        WF.storage.save(payload.progress || {});

        if (payload.options && typeof payload.options === "object") {
          WF.options.save(payload.options);
        }

        if (typeof onDone === "function") onDone(true);
      } catch (err) {
        console.error("Import failed: invalid JSON file.", err);
        if (typeof onDone === "function") onDone(false);
      }
    };
    reader.readAsText(file);
  }

  return { exportToFile, importFromFile };
})();
