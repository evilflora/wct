WF.updateCheck = (function () {
  const TOAST_DURATION_MS = 3000;
  const LAST_SEEN_KEY = "wf_checklist_last_seen_version";
  const FILE_NAME = "version.js";

  function isLocalCopy() {
    return window.location.protocol === "file:";
  }

  function updateMessage() {
    return isLocalCopy()
      ? `A new version is available, download it from <a id="info-project-link" href="${WF.PROJECT_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>.`
      : `A new version is available, refresh this page (Ctrl+F5) to get it.`;
  }

  function versionFileUrl() {
    const rawBase = WF.PROJECT_URL.replace("github.com", "raw.githubusercontent.com");
    return `${rawBase}js/${FILE_NAME}`;
  }

  function showToast() {
    const toast = document.createElement("div");
    toast.className = "update-toast";
    toast.innerHTML = updateMessage();
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("visible"));

    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, TOAST_DURATION_MS);
  }

  function showChangelogNotice() {
    const notice = document.getElementById("update-available-notice");
    if (!notice) return;
    notice.innerHTML = updateMessage();
    notice.classList.remove("hidden");
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

    showToast();
    localStorage.setItem(LAST_SEEN_KEY, String(remoteVersion));
  }

  return { check };
})();

document.addEventListener("DOMContentLoaded", WF.updateCheck.check);
