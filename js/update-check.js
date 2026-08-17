WF.updateCheck = (function () {
  const TOAST_DURATION_MS = 3000;
  const TOAST_UPDATE_MS = 3000;
  const LAST_SEEN_KEY = "wf_checklist_last_seen_version";
  const FILE_NAME = "version.js";
    
  const updateToggle = document.getElementById("btn-update-toggle");
  updateToggle.addEventListener("click", showUpdateAvailable);

  function isLocalCopy() {
    return window.location.protocol === "file:";
  }

  function updateMessage() {
    return isLocalCopy()
      ? `A new version is available, download it from <a id="info-project-link" href="${WF.PROJECT_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>.`
      : `A new version is available, refresh this page (Ctrl+F5) to get it.`;
  }
  
  function showUpdateAvailable()
  {
    WF.toast.show(updateMessage(), { timeoutMs: TOAST_UPDATE_MS, type: "info" });
  }

  function versionFileUrl() {
    const rawBase = WF.PROJECT_URL.replace("github.com", "raw.githubusercontent.com");
    return `${rawBase}js/${FILE_NAME}`;
  }

  function showChangelogNotice() {
    const notice = document.getElementById("update-available-notice");
    if (!notice) return;
    notice.innerHTML = updateMessage();
    notice.classList.remove("hidden");
    updateToggle.classList.remove("hidden");
  }

  async function check() {
    const localVersion = Number(WF.WCT_VERSION);
    if (!localVersion || Number.isNaN(localVersion)) return;

    let remoteVersion;

    try {
      const response = await fetch(versionFileUrl());
      if (!response.ok) return;

      const text = await response.text();
      const match = text.match(/WF\.WCT_VERSION\s*=\s*(\d+)/);
      if (!match) return;

      remoteVersion = Number(match[1]);
      if (Number.isNaN(remoteVersion)) return;
    } catch (err) {
      return;
    }

    if (remoteVersion <= localVersion) return;

    showChangelogNotice();

    const lastSeenVersion = Number(localStorage.getItem(LAST_SEEN_KEY));
    if (!Number.isNaN(lastSeenVersion) && lastSeenVersion >= remoteVersion) return;

    WF.toast.show(updateMessage(), { timeoutMs: TOAST_DURATION_MS, type: "info" });
    localStorage.setItem(LAST_SEEN_KEY, String(remoteVersion));
  }

  return { check };
})();

document.addEventListener("DOMContentLoaded", WF.updateCheck.check);
