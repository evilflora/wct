let loadedRawData = null;

document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("raw-file-input");
  const fileStatus = document.getElementById("file-status");
  const output = document.getElementById("output-area");

  function setLoadedData(data, sourceLabel) {
    loadedRawData = data;
    fileStatus.textContent = `Loaded: ${sourceLabel} (${Array.isArray(data) ? data.length : "?"} entries)`;
    fileStatus.classList.remove("error");

    if (WF.generators.length > 0) runGenerator(WF.generators[0]);
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

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        setLoadedData(JSON.parse(e.target.result), file.name);
      } catch (err) {
        setLoadError(`Invalid JSON in ${file.name}`);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("btn-clear-output").addEventListener("click", () => {
    output.value = "";
  });

  document.getElementById("btn-copy-output").addEventListener("click", () => {
    if (!output.value) return; output.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      alert("Copy failed — please select and copy manually.");
    }
    output.setSelectionRange(0, 0);
  });
});