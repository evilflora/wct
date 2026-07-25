
WF.exportImport = (function () {
  function exportToFile() {
    const options = WF.options.load();

    const payload = {
      schema_version: WF.SCHEMA_VERSION,
      exported_at: new Date().toISOString(),
      progress: WF.storage.load(),
    };

    if (options.includeOptionsInExport) payload.options = options;

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wf-checklist-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importFromFile(file, onDone) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const payload = JSON.parse(event.target.result);

        if (payload.schema_version !== WF.SCHEMA_VERSION) {
          console.warn(`Fichier importé en version ${payload.schema_version}, attendu ${WF.SCHEMA_VERSION}.`);
        }

        WF.storage.mergeProgress(payload.progress || {}, "replace");

        if (payload.options) WF.options.save(payload.options);

        if (onDone) onDone(true);
      } catch (err) {
        console.error("Import échoué : fichier JSON invalide.", err);
        if (onDone) onDone(false);
      }
    };
    reader.readAsText(file);
  }

  return { exportToFile, importFromFile };
})();
