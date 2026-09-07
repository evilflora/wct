/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.updateCheck = (function () {
	const LAST_SEEN_KEY = "wf_checklist_last_seen_version";
	const FILE_NAME = "version.js";
	const CHECK_INTERVAL_MS = 60000;

	let checkIntervalId = null;
	let currentRemoteVersion = null;

	const updateToggle = document.getElementById("btn-update-toggle");
	if (updateToggle) {
		updateToggle.addEventListener("click", () => showUpdateAvailable(3000));
	}

	function isLocalCopy() {
		return window.location.protocol === "file:";
	}

	function updateMessage() {
		return isLocalCopy()
			? `A new version is available, download it from <a id="info-project-link" href="${WF.PROJECT_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>.`
			: `A new version is available, refresh this page (Ctrl+F5) to get it.`;
	}

	function markVersionAsSeen() {
		if (currentRemoteVersion) {
			localStorage.getItem && localStorage.setItem(LAST_SEEN_KEY, String(currentRemoteVersion));
			stopPeriodicCheck();
		}
	}

	function showUpdateAvailable(duration) {
		WF.toast.show(updateMessage(), {
			timeoutMs: duration,
			type: "info",
			onClose: markVersionAsSeen
		});
	}

	function versionFileUrl() {
		const rawBase = WF.PROJECT_URL.replace("github.com", "raw.githubusercontent.com");
		return `${rawBase}js/${FILE_NAME}`;
	}

	function showChangelogNotice() {
		const notice = document.getElementById("update-available-notice");
		if (notice) {
			notice.innerHTML = updateMessage();
			notice.classList.remove("hidden");
		}
		if (updateToggle) {
			updateToggle.classList.remove("hidden");
		}
	}

	function stopPeriodicCheck() {
		if (checkIntervalId) {
			clearInterval(checkIntervalId);
			checkIntervalId = null;
		}
	}

	async function check() {
		const localVersion = Number(WF.WCT_VERSION);
		if (!localVersion || Number.isNaN(localVersion)) return;

		try {
			const response = await fetch(versionFileUrl());
			if (!response.ok) return;

			const text = await response.text();
			const match = text.match(/WF\.WCT_VERSION\s*=\s*(\d+)/);
			if (!match) return;

			const remoteVersion = Number(match[1]);
			if (Number.isNaN(remoteVersion) || remoteVersion <= localVersion) return;

			currentRemoteVersion = remoteVersion;

			const lastSeenVersion = Number(localStorage.getItem(LAST_SEEN_KEY));
			if (!Number.isNaN(lastSeenVersion) && lastSeenVersion >= remoteVersion) {
				stopPeriodicCheck();
				return;
			}

			showChangelogNotice();
			showUpdateAvailable(0);
		} catch (err) {
			console.log(`Error while fetching remote version.`);
		}
	}

	function init() {
		check();

		const lastSeenVersion = Number(localStorage.getItem(LAST_SEEN_KEY));
		if (Number.isNaN(lastSeenVersion) || !currentRemoteVersion || lastSeenVersion < currentRemoteVersion) {
			checkIntervalId = setInterval(check, CHECK_INTERVAL_MS);
		}
	}

	return { check, init };
})();

document.addEventListener("DOMContentLoaded", WF.updateCheck.init);