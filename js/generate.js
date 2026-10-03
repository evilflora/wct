/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const REPO_OWNER = "WFCD";
  const REPO_NAME = "warframe-items";
  const REPO_BRANCH = "master";
  const REPO_PATH = "data/json";
  const FETCH_CONCURRENCY = 6; // parallel downloads, merge order stays deterministic via index slots
  const FETCH_TIMEOUT_MS = 60000;

  // All.json no longer exists on WFCD; it is the pre-merged file and would create duplicates if added again. The others are intentionally ignored
  const EXCLUDED_FILES = new Set(["All.json", "Enemy.json", "Components.json", "Honoria.json"]);

  const btnGenerate = document.getElementById("btn-generate");
  const btnClear = document.getElementById("btn-clear-output");
  const btnCopy = document.getElementById("btn-copy-output");
  const btnDownloadRaw = document.getElementById("btn-download-raw");
  const btnDownloadResult = document.getElementById("btn-download-result");
  const fileStatus = document.getElementById("file-status");
  const progressFill = document.getElementById("progress-fill");
  const output = document.getElementById("output-area");

  // Merged raw data, kept in memory only (too large to display) and passed to the generator
  let loadedRawData = null;

  function setStatus(message, isError) {
    fileStatus.textContent = message;
    fileStatus.classList.toggle("error", !!isError);
  }

  function setProgress(done, total) {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    progressFill.style.width = `${pct}%`;
  }

  // Single source of truth for button states
  function updateButtons(busy) {
    btnGenerate.disabled = busy;
    btnDownloadRaw.disabled = busy || !loadedRawData;
    btnDownloadResult.disabled = busy || !output.value;
  }

  function downloadText(content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000); // delayed revoke, an immediate one can abort large downloads
  }

  function dateStamp() {
    return new Date().toISOString().slice(0, 10).replace(/-/g, "_");
  }


  // fetch() wrapper with timeout and HTTP status validation
  async function fetchJson(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });

      if (!res.ok) {
        let reason = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          if (body && typeof body.message === "string") reason = body.message; // e.g. GitHub rate limit message
        } catch (parseErr) {
          console.debug("Error body is not JSON.", parseErr);
        }
        throw new Error(reason);
      }

      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") throw new Error("request timed out");
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  // Lists the JSON files of data/json through the GitHub contents API
  async function listSourceFiles() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REPO_PATH}?ref=${REPO_BRANCH}`;

    let body;
    try {
      body = await fetchJson(url, { headers: { Accept: "application/vnd.github+json" } });
    } catch (err) {
      throw new Error(`Could not list "${REPO_PATH}": ${err.message}`);
    }

    if (!Array.isArray(body)) throw new Error(`Unexpected response while listing "${REPO_PATH}"`);

    return body
      .filter((e) => e && e.type === "file" && typeof e.name === "string" && e.name.endsWith(".json") && !EXCLUDED_FILES.has(e.name) && typeof e.download_url === "string")
      .sort((a, b) => a.name.localeCompare(b.name));
  }


  const isUniqueNameObject = (obj) => !!obj && typeof obj === "object" && !Array.isArray(obj) && "uniqueName" in obj;
  const isUniqueNameArray = (arr) => Array.isArray(arr) && arr.some(isUniqueNameObject);

  // Drops nested structures carrying their own "uniqueName" (e.g. component blueprints of a warframe);
  // only the root item is kept, with its plain fields
  function stripNestedUniqueNameStructures(value, isRoot) {
    if (Array.isArray(value)) {
      if (!isRoot && isUniqueNameArray(value)) return undefined;
      return value.map((item) => stripNestedUniqueNameStructures(item, false)).filter((item) => item !== undefined);
    }

    if (value && typeof value === "object") {
      if (!isRoot && isUniqueNameObject(value)) return undefined;
      const result = {};
      for (const key of Object.keys(value)) {
        const cleaned = stripNestedUniqueNameStructures(value[key], false);
        if (cleaned !== undefined) result[key] = cleaned;
      }
      return result;
    }

    return value;
  }

  const cleanItem = (item) => (isUniqueNameObject(item) ? stripNestedUniqueNameStructures(item, true) : item);

  // Downloads every source file with bounded concurrency and flattens them into one array (file order preserved)
  async function mergeAllFiles() {
    const files = await listSourceFiles();
    if (!files.length) throw new Error(`No JSON files found in "${REPO_PATH}"`);

    const slots = new Array(files.length).fill(null); // one slot per file keeps the merge order stable
    const failed = [];
    let nextIndex = 0;
    let done = 0;

    async function worker() {
      while (nextIndex < files.length) {
        const index = nextIndex++;
        const entry = files[index];
        setStatus(`Fetching ${Math.min(done + 1, files.length)}/${files.length}: ${entry.name}`);

        try {
          const content = await fetchJson(entry.download_url);
          if (Array.isArray(content)) {
            slots[index] = content.map(cleanItem);
          } else {
            failed.push(`${entry.name} (not a JSON array, skipped)`);
          }
        } catch (err) {
          console.error(`Failed to fetch ${entry.name}.`, err);
          failed.push(`${entry.name} (${err.message})`);
        }

        done += 1;
        setProgress(done, files.length);
      }
    }

    await Promise.all(Array.from({ length: Math.min(FETCH_CONCURRENCY, files.length) }, worker));

    const merged = [];
    for (const slot of slots) {
      if (slot) for (const item of slot) merged.push(item); // push loop avoids call-stack limits of spread on huge arrays
    }

    return { merged, total: files.length, failed };
  }

  async function runGenerator(generator) {
    loadedRawData = null;
    output.value = "";
    updateButtons(true);
    setProgress(0, 1);
    setStatus("Listing files in data/json...");

    try {
      const { merged, total, failed } = await mergeAllFiles();
      loadedRawData = merged;

      // A failed source file would silently produce an incomplete data file, so abort instead of generating
      if (failed.length) {
        setStatus(`Merge incomplete, generation aborted.\nFailed: ${failed.join(", ")}`, true);
        return;
      }
      setStatus("Generating...");
      output.value = generator.run(merged);

      setStatus(`Merged ${total}/${total} files (${merged.length} raw entries). Result ready.`);
    } catch (err) {
      console.error("Generation failed.", err);
      output.value = `Error: ${err.message}`;
      setStatus(`Generation failed: ${err.message}`, true);
    } finally {
      updateButtons(false);
    }
  }

  btnGenerate.addEventListener("click", function () {
    if (!WF.generators || WF.generators.length === 0) {
      setStatus("No generator loaded.", true);
      return;
    }
    runGenerator(WF.generators[0]);
  });

  btnClear.addEventListener("click", () => {
    output.value = "";
    updateButtons(false);
  });

  btnCopy.addEventListener("click", async () => {
    if (!output.value) return;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(output.value);
        return;
      } catch (err) {
        console.error("Failed to copy text using Clipboard API:", err);
        alert("Copy failed. Please select and copy manually.");
      }
    } else {
      console.warn("Clipboard API is not supported in this environment.");
      alert("Copy failed, Clipboard API is unavailable in this environment.");
    }
  });

  btnDownloadRaw.addEventListener("click", () => {
    if (loadedRawData) downloadText(JSON.stringify(loadedRawData), "application/json", `all_${dateStamp()}.json`);
  });

  btnDownloadResult.addEventListener("click", () => {
    if (output.value) downloadText(output.value, "text/javascript", "data_generated.js");
  });

  updateButtons(false);
});