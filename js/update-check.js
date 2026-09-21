/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.updateCheck = (function () {
	const LAST_SEEN_KEY = "wf_checklist_last_seen_version";
	const FILE_NAME = "version.js";
	const CHECK_INTERVAL_MS = 60000;
	const FETCH_TIMEOUT_MS = 5000;
	const TOAST_KEY = "wf-update-available";

	let checkIntervalId = null;
	let currentRemoteVersion = null;

	const updateToggle = document.getElementById("btn-update-toggle");
	if (updateToggle) {
		updateToggle.addEventListener("click", () => showUpdateAvailable());
	}

	function isLocalCopy() {
		return window.location.protocol === "file:";
	}

	function updateMessage() {
		return isLocalCopy()
			? "A new version is available, download it from"
			: "A new version is available, refresh this page (Ctrl+F5) to get it.";
	}

	function updateLink() {
		return isLocalCopy() ? { href: WF.PROJECT_URL, text: "GitHub" } : null;
	}

	function markVersionAsSeen() {
		if (!currentRemoteVersion) return;
		try {
			localStorage.setItem(LAST_SEEN_KEY, String(currentRemoteVersion));
		} catch (err) {
			console.warn("Unable to persist last seen version.", err);
		}
	}

	function showUpdateAvailable() {
		WF.toast.show(updateMessage(), {
			key: TOAST_KEY,
			link: updateLink(),
			timeoutMs: 0,
			type: "info",
			onClose: markVersionAsSeen
		});
	}

	function versionFileUrl() {
		return `${WF.PROJECT_URL}js/${FILE_NAME}`;
	}

	function showChangelogNotice() {
		const notice = document.getElementById("update-available-notice");
		if (notice) {
			notice.textContent = updateMessage();
			const link = updateLink();
			if (link) {
				notice.appendChild(document.createTextNode(" "));
				const anchor = document.createElement("a");
				anchor.href = link.href;
				anchor.textContent = link.text;
				anchor.target = "_blank";
				anchor.rel = "noopener noreferrer";
				notice.appendChild(anchor);
			}
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

	function readLastSeenVersion() {
		const raw = localStorage.getItem(LAST_SEEN_KEY);
		if (raw === null) return 0;
		const parsed = Number(raw);
		return Number.isNaN(parsed) ? 0 : parsed;
	}

	async function check() {
		const localVersion = Number(WF.WCT_VERSION);
		if (!localVersion || Number.isNaN(localVersion)) return true;

		try {
			const response = await fetch(versionFileUrl(), {
				cache: "no-store",
				signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
			});
			if (!response.ok) return false;

			const text = await response.text();
			const match = text.match(/WF\.WCT_VERSION\s*=\s*(\d+)/);
			if (!match) return false;

			const remoteVersion = Number(match[1]);
			if (Number.isNaN(remoteVersion) || remoteVersion <= localVersion) return true;

			currentRemoteVersion = remoteVersion;

			if (readLastSeenVersion() >= remoteVersion) {
				stopPeriodicCheck();
				return true;
			}

			showChangelogNotice();
			showUpdateAvailable();
			stopPeriodicCheck();
			return true;
		} catch (err) {
			console.warn("Error while fetching remote version.", err);
			return false;
		}
	}

	async function init() {
		const isSettled = await check();
		if (isSettled) return;
		checkIntervalId = setInterval(check, CHECK_INTERVAL_MS);
	}

	return { check, init };
})();

document.addEventListener("DOMContentLoaded", () => { WF.updateCheck.init(); });
