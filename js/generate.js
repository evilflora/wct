/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

let loadedRawData = null;

document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("raw-file-input");
  const fileStatus = document.getElementById("file-status");
  const output = document.getElementById("output-area");

  function setLoadedData(data, sourceLabel) {
    loadedRawData = data;
    fileStatus.textContent = `Loaded: ${sourceLabel} (${Array.isArray(data) ? data.length : "?"} entries)`;
    fileStatus.classList.remove("error");

    if (WF.generators && WF.generators.length > 0) runGenerator(WF.generators[0]);
  }

  function setLoadError(message) {
    loadedRawData = null;
    fileStatus.textContent = message;
    fileStatus.classList.add("error");
  }

  function runGenerator(generator) {
    if (!loadedRawData) {
      output.value = "";
      alert("Load a JSON file first, then run a generator.");
      return;
    }

    output.value = "";

    try {
      output.value = generator.run(loadedRawData);
    } catch (err) {
      output.value = `Error: ${err.message}`;
    }
  }

  fileInput.addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      setLoadedData(JSON.parse(text), file.name);
    } catch (err) {
      console.error("Raw file could not be read.", err);
      setLoadError(`Invalid or unreadable JSON in ${file.name}`);
    } finally {
      event.target.value = "";
    }
  });

  document.getElementById("btn-clear-output").addEventListener("click", () => {
    output.value = "";
  });

  document.getElementById("btn-copy-output").addEventListener("click", async () => {
    if (!output.value) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(output.value);
        return;
      } catch (err) {
        console.debug("Clipboard API unavailable, falling back.", err);
      }
    }

    output.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      alert("Copy failed, please select and copy manually.");
    }
    output.setSelectionRange(0, 0);
  });
});