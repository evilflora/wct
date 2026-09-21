/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

document.addEventListener("DOMContentLoaded", function () {
	WF.theme.init();
	
	const WELCOME_SEEN_KEY = "wf_checklist_welcome_seen";
	
	const CONFIRM_STEPS = ["CLICK 4 MORE TIME", "CLICK 3 MORE TIME", "CLICK 2 MORE TIME", "CLICK 1 MORE TIME", "PROCEED TO DELETE"];
	const DELETE_CONFIRM_TIMEOUT_MS = 2000;

	const getEl = (id) => document.getElementById(id);

	const NUMBER_FORMAT = new Intl.NumberFormat();
	const formatNumber = (value) => NUMBER_FORMAT.format(Number(value) || 0);

	const sidebar									= getEl("sidebar");
	const sidebarOverlay					= getEl("sidebar-overlay");
	const syncOverlay							= getEl("sync-overlay");
	const syncKey									= getEl("sync-key");
	const syncActionBtn						= getEl("btn-sync-action");
	const syncPushBtn							= getEl("btn-sync-push");
	const syncPullBtn							= getEl("btn-sync-pull");
	const syncDisconnectBtn				= getEl("btn-sync-disconnect");
	const syncDeleteBtn						= getEl("btn-sync-delete");
	const infoOverlay							= getEl("info-overlay");
	const statsOverlay						= getEl("stats-overlay");
	const optionsOverlay					= getEl("options-overlay");
	const deleteBtn								= getEl("btn-delete-data");
	const changelogList						= getEl("info-changelog-list");
	const includeOptionsCheckbox	= getEl("opt-include-options-in-export");
	const includeSyncKeyCheckbox	= getEl("opt-include-synckey-in-export");
	const includeFounderCheckbox	= getEl("opt-include-founder-pack-exclusive");
	const includePvpItemsCheckbox	= getEl("opt-include-pvp-mods");
	const importFileInput					= getEl("import-file-input");
	const themeSwatches						= document.querySelectorAll(".theme-swatch");
	const welcomeOverlay					= getEl("welcome-overlay");

	const toggleOverlay = (overlay, show) => overlay.classList.toggle("visible", show);
	
	const tooltip = document.createElement("div");
	tooltip.id = "global-tooltip";
	tooltip.className = "global-tooltip";
	document.body.appendChild(tooltip);

	document.addEventListener("mouseover", (event) => {
		const el = event.target.closest("[data-tooltip]");
		if (!el) return;

		const rect = el.getBoundingClientRect();
		tooltip.textContent = el.dataset.tooltip;
		tooltip.style.left = rect.right + "px";
		tooltip.style.top = (rect.top - 6) + "px";
		tooltip.style.transform = "translate(-100%, -100%)";
		tooltip.classList.add("visible");
	});

	document.addEventListener("mouseout", (event) => {
		const el = event.target.closest("[data-tooltip]");
		if (!el) return;
		if (el.contains(event.relatedTarget)) return;
		tooltip.classList.remove("visible");
	});

	getEl("btn-export").addEventListener("click", () => {
		WF.exportImport.exportToFile();
	});

	getEl("btn-import").addEventListener("click", () => {
		if (!confirm("This will replace your entire current progress with the imported file. Continue?")) return;
		importFileInput.click();
	});

	importFileInput.addEventListener("change", async function (event) {
		const file = event.target.files[0];
		if (!file) return;

		try {
			await WF.exportImport.importFromFile(file);
			WF.render.renderAll();
			WF.theme.init();
			WF.toast.show("Import successful.", { type: "success" });
		} catch (err) {
			console.error("Import failed.", err);
			WF.toast.show("Invalid file, import canceled.", { type: "error" });
		} finally {
			event.target.value = "";
		}
	});

	function initWelcome() {
		if (localStorage.getItem(WELCOME_SEEN_KEY)) return;
		openWelcome();
	}

	const sidebarToggleBtn = getEl("btn-sidebar-toggle");

	function openSidebar() {
		sidebar.classList.add("open");
		sidebarToggleBtn.setAttribute("aria-expanded", "true");
		toggleOverlay(sidebarOverlay, true);
	}

	function closeSidebar() {
		sidebar.classList.remove("open");
		sidebarToggleBtn.setAttribute("aria-expanded", "false");
		toggleOverlay(sidebarOverlay, false);
	}

	sidebarToggleBtn.addEventListener("click", openSidebar);
	sidebarOverlay.addEventListener("click", closeSidebar);
	
	function generateRandomHash() {
		const bytes = crypto.getRandomValues(new Uint8Array(32));
		return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
	
	function checkRealServer()
	{
		if (window.location.protocol === "file:") {
			WF.toast.show(`Sync only work when using web server / http server.`, { type: "error" }); 
			return false;
		}
		return true;
	}

	function applyRemoteData(remoteObj) {
		if (!remoteObj) return;
		if (remoteObj.data) WF.storage.save(remoteObj.data);
		if (remoteObj.options) WF.options.save(remoteObj.options);
		WF.render.renderAll();
		WF.mastery.render();
	}

	function updateSyncUIState() {
		const options = WF.options.load();
		const hasStoredKey = options.syncKey && options.syncKey.length === 64;
			
		if (hasStoredKey) {
			syncKey.value = options.syncKey;
			syncKey.readOnly = true;
			
			syncActionBtn.classList.add("hidden");
			syncPushBtn.classList.remove("hidden");
			syncPullBtn.classList.remove("hidden");
			syncDisconnectBtn.classList.remove("hidden");
			syncDeleteBtn.classList.remove("hidden");
		} else {
			syncKey.readOnly = false;
			syncPushBtn.classList.add("hidden");
			syncPullBtn.classList.add("hidden");
			syncDisconnectBtn.classList.add("hidden");
			syncDeleteBtn.classList.add("hidden");
			syncActionBtn.classList.remove("hidden");
			
			if (syncKey.value.trim().length === 64) {
				syncActionBtn.textContent = "SYNC";
			} else {
				syncActionBtn.textContent = "CREATE";
			}
		}
	}

	syncKey.addEventListener("input", () => {
		const options = WF.options.load();
		if (!options.syncKey) {
			if (syncKey.value.trim().length === 64) {
				syncActionBtn.textContent = "SYNC";
			} else {
				syncActionBtn.textContent = "CREATE";
			}
		}
	});

	async function withBusyButton(button, task) {
		if (button.disabled) return;
		button.disabled = true;
		button.setAttribute("aria-busy", "true");
		try { await task(); }
		finally { button.disabled = false; button.removeAttribute("aria-busy"); }
	}

	async function requireSync() {
		const sync = await (WF.syncReady || Promise.resolve(WF.sync || null));
		if (!sync) WF.toast.show(`Sync module unavailable (offline, blocked CDN).`, { type: "error", key: "wf-sync-unavailable" });
		return sync;
	}

	function reportSyncError(error, fallbackMessage, actionLabel) {
		if (error.message === "CLIENT_RATE_LIMITED" || error.message === "RATE_LIMITED") {
			WF.toast.show(`You are being rate limited, maximum 1 ${actionLabel} per 10 seconds.`, { timeoutMs: 3000, type: "info" });
			return;
		}
		if (error.message === "PAYLOAD_TOO_LARGE") {
			WF.toast.show(`Your save is too large to be synced (250 KB limit).`, { type: "error" });
			return;
		}
		WF.toast.show(fallbackMessage, { type: "error" });
	}

	syncActionBtn.addEventListener("click", () => withBusyButton(syncActionBtn, async () => {
		if (!checkRealServer()) return;
		const inputVal = syncKey.value.trim();

		if (inputVal.length === 64) {
			const options = WF.options.load();
			WF.options.save({ ...options, syncKey: inputVal });
			updateSyncUIState();
			WF.toast.show(`Successfully connected. Use DOWNLOAD or UPLOAD to transfer data.`, { type: "success" });
			return;
		}

		const sync = await requireSync();
		if (!sync) return;

		const newHash = generateRandomHash();
		try {
			await sync.pushData(newHash, { force: true });
			WF.options.save({ ...WF.options.load(), syncKey: newHash });
			syncKey.value = newHash;
			WF.toast.show(`Successfully connected.`, { type: "success" });
		} catch (err) {
			syncKey.value = "";
			reportSyncError(err, `Failed to connect. Please try again.`, "CREATE");
		}
		updateSyncUIState();
	}));

	syncPullBtn.addEventListener("click", () => withBusyButton(syncPullBtn, async () => {
		if (!checkRealServer()) return;
		const options = WF.options.load();
		if (!options.syncKey) return;

		const sync = await requireSync();
		if (!sync) return;

		try {
			const remoteObj = await sync.pullData(options.syncKey);
			if (remoteObj) {
				applyRemoteData(remoteObj);
				WF.toast.show(`Successfully downloaded cloud data.`, { type: "success" });
			} else {
				WF.toast.show(`No remote data found.`, { type: "error" });
			}
		} catch (err) {
			reportSyncError(err, `Failed to download cloud data.`, "DOWNLOAD");
		}
	}));

	syncPushBtn.addEventListener("click", () => withBusyButton(syncPushBtn, async () => {
		if (!checkRealServer()) return;
		const options = WF.options.load();
		if (!options.syncKey) return;

		const sync = await requireSync();
		if (!sync) return;

		try {
			await sync.pushData(options.syncKey);
			WF.toast.show(`Data successfully sent.`, { type: "success" });
		} catch (err) {
			if (err.message === "REMOTE_AHEAD") {
				WF.toast.show(`Cloud data is newer than this device. DOWNLOAD first, or confirm to overwrite it.`, { timeoutMs: 0, type: "error", key: "wf-sync-conflict" });
				if (!confirm("The cloud save was modified on another device after your last sync.\n\nOverwrite it with THIS device's data? The other device's changes will be lost.")) return;
				try {
					await sync.pushData(options.syncKey, { force: true });
					WF.toast.show(`Cloud data overwritten.`, { type: "success" });
				} catch (forcedErr) {
					reportSyncError(forcedErr, `Failed to send data.`, "UPLOAD");
				}
				return;
			}
			reportSyncError(err, `Failed to send data.`, "UPLOAD");
		}
	}));

	syncDisconnectBtn.addEventListener("click", () => {
		if (!confirm("Are you sure you want to disconnect? The key will be lost if it is not manually saved.")) return;

		const updatedOptions = { ...WF.options.load() };
		delete updatedOptions.syncKey;
		WF.options.save(updatedOptions);

		syncKey.value = "";
		updateSyncUIState();
		WF.toast.show(`Disconnected. Local data preserved.`, { type: "success" });
	});

	syncDeleteBtn.addEventListener("click", () => withBusyButton(syncDeleteBtn, async () => {
		if (!checkRealServer()) return;
		const options = WF.options.load();
		const currentKey = options.syncKey;

		if (!currentKey) return;
		if (!confirm("Are you sure you want to remove this key and delete all cloud data?")) return;

		const sync = await requireSync();
		if (!sync) return;

		try {
			await sync.deleteRemoteData(currentKey);

			const updatedOptions = { ...WF.options.load() };
			delete updatedOptions.syncKey;
			WF.options.save(updatedOptions);

			syncKey.value = "";
			updateSyncUIState();
			WF.toast.show(`Key removed and cloud data deleted.`, { type: "success" });
		} catch (err) {
			reportSyncError(err, `Error deleting key and cloud data.`, "DELETE");
		}
	}));

	const syncKeyRevealBtn = getEl("btn-sync-key-reveal");
	syncKeyRevealBtn.addEventListener("click", () => {
		const isRevealed = syncKey.type === "text";
		syncKey.type = isRevealed ? "password" : "text";
		syncKeyRevealBtn.setAttribute("aria-pressed", String(!isRevealed));
		syncKeyRevealBtn.textContent = isRevealed ? "Reveal" : "Hide";
	});

	function openSync() {
		updateSyncUIState();
		toggleOverlay(syncOverlay, true);
	}

	function closeSync() {
		toggleOverlay(syncOverlay, false);
		syncKey.type = "password";
		syncKeyRevealBtn.setAttribute("aria-pressed", "false");
		syncKeyRevealBtn.textContent = "Reveal";
	}
		
	getEl("btn-sync-toggle").addEventListener("click", openSync);
	getEl("btn-sync-close").addEventListener("click", closeSync);
	
	syncOverlay.addEventListener("click", (event) => {
		if (event.target === syncOverlay) closeSync();
	});
	
	function openInfo() {
		toggleOverlay(infoOverlay, true);
	}

	function closeInfo() {
		toggleOverlay(infoOverlay, false);
	}

	function openWelcome() {
		toggleOverlay(welcomeOverlay, true);
	}

	function closeWelcome() {
		toggleOverlay(welcomeOverlay, false);
		localStorage.setItem(WELCOME_SEEN_KEY, "1");
	}

	getEl("btn-welcome-close").addEventListener("click", closeWelcome);

	welcomeOverlay.addEventListener("click", (event) => {
		if (event.target === welcomeOverlay) closeWelcome();
	});

	getEl("info-open-welcome").addEventListener("click", (event) => {
		event.preventDefault();
		closeInfo();
		openWelcome();
	});

	let deleteClickCount = 0;
	let deleteResetTimer = null;

	function resetDeleteButton() {
		deleteClickCount = 0;
		deleteBtn.textContent = deleteBtn.dataset.defaultLabel;
		deleteBtn.classList.remove("confirming");
		clearTimeout(deleteResetTimer);
	}

	getEl("btn-info-toggle").addEventListener("click", openInfo);
	getEl("btn-info-close").addEventListener("click", closeInfo);

	deleteBtn.addEventListener("click", () => {
		clearTimeout(deleteResetTimer);
		deleteClickCount++;

		if (deleteClickCount > CONFIRM_STEPS.length) {
			WF.storage.clearAll();
			location.reload();
			return;
		}

		deleteBtn.classList.add("confirming");
		deleteBtn.textContent = CONFIRM_STEPS[deleteClickCount - 1];
		deleteResetTimer = setTimeout(resetDeleteButton, DELETE_CONFIRM_TIMEOUT_MS);
	});

	infoOverlay.addEventListener("click", (event) => {
		if (event.target === infoOverlay) closeInfo();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeSync();
			closeInfo();
			closeStats();
			closeOptions();
			closeWelcome();
		}
	});

	getEl("info-project-link-live").href = WF.PROJECT_URL;
	getEl("info-project-link-src").href = WF.PROJECT_SRC;

	function renderChangelog() {
		changelogList.textContent = "";

		if (!WF.CHANGELOG || WF.CHANGELOG.length === 0) {
			const emptyLi = document.createElement("li");
			emptyLi.className = "info-empty";
			emptyLi.textContent = "No changelog entries yet.";
			changelogList.appendChild(emptyLi);
			return;
		}

		const fragment = document.createDocumentFragment();

		WF.CHANGELOG.forEach((entry, index) => {
			const li = document.createElement("li");
			li.className = "changelog-entry" + (index === 0 ? " expanded" : "");

			const header = document.createElement("button");
			header.type = "button";
			header.className = "changelog-entry-header";

			const dateEl = document.createElement("strong");
			dateEl.textContent = `${entry.date} - Game version: ${entry.version}`;

			header.append(dateEl);

			const body = document.createElement("p");
			body.className = "changelog-entry-text";
			String(entry.text).split(/<\/?br\s*\/?>/i).forEach((chunk, chunkIndex) => {
				if (chunkIndex > 0) body.appendChild(document.createElement("br"));
				body.appendChild(document.createTextNode(chunk));
			});

			li.append(header, body);
			fragment.appendChild(li);
		});

		changelogList.appendChild(fragment);
	}

	changelogList.addEventListener("click", (event) => {
		const header = event.target.closest(".changelog-entry-header");
		if (!header) return;
		const entry = header.closest(".changelog-entry");
		const wasExpanded = entry.classList.contains("expanded");

		changelogList.querySelectorAll(".changelog-entry").forEach((el) => el.classList.remove("expanded"));
		if (!wasExpanded) entry.classList.add("expanded");
	});

	renderChangelog();

	function openStats() {
		renderStatsTable();
		renderMasteryBreakdown();
		renderEndoSpent();
		toggleOverlay(statsOverlay, true);
	}

	function closeStats() {
		toggleOverlay(statsOverlay, false);
	}

	getEl("btn-stats-toggle").addEventListener("click", openStats);
	getEl("btn-stats-close").addEventListener("click", closeStats);

	statsOverlay.addEventListener("click", (event) => {
		if (event.target === statsOverlay) closeStats();
	});

	const statsTabsContainer = document.querySelector(".stats-tabs") || statsOverlay;
	statsTabsContainer.addEventListener("click", (event) => {
		const tab = event.target.closest(".stats-tab");
		if (!tab) return;

		document.querySelectorAll(".stats-tab").forEach((t) => {
			t.classList.remove("active");
			t.setAttribute("aria-selected", "false");
		});
		tab.classList.add("active");
		tab.setAttribute("aria-selected", "true");

		document.querySelectorAll(".stats-panel").forEach((panel) => panel.classList.remove("active"));
		const targetPanel = getEl(`stats-panel-${tab.dataset.tab}`);
		if (targetPanel) targetPanel.classList.add("active");
	});

	function buildTableHead(labels) {
		const thead = document.createElement("thead");
		const tr = document.createElement("tr");
		labels.forEach((label) => {
			const th = document.createElement("th");
			th.scope = "col";
			th.textContent = label;
			tr.appendChild(th);
		});
		thead.appendChild(tr);
		return thead;
	}

	function appendTableRow(fragment, cells, className) {
		const tr = document.createElement("tr");
		if (className) tr.className = className;
		cells.forEach((cell) => {
			const td = document.createElement("td");
			if (cell && typeof cell === "object" && cell.strong) {
				const strong = document.createElement("strong");
				strong.textContent = cell.text;
				td.appendChild(strong);
			} else {
				td.textContent = cell;
			}
			tr.appendChild(td);
		});
		fragment.appendChild(tr);
	}

	function renderStatsTable() {
		const table = getEl("stats-table");
		table.textContent = "";
		const thead = buildTableHead(["Category", "Progress", "%"]);
		const tbody = document.createElement("tbody");
		const fragment = document.createDocumentFragment();
		const rows = [];

		WF.NAV_GROUPS.forEach((group) => {
			const rawTypes = [...group.types, ...(group.subgroups || []).flatMap((sg) => sg.types)];
			rawTypes.forEach((typeObj) => {
				const category = typeObj.name || typeObj;
				const stats = WF.render.getCategoryStats(category);
				if (stats.total === 0) return;
				rows.push({ label: typeObj.label || category, stats });
			});
		});

		const totalOwned = rows.reduce((sum, r) => sum + r.stats.owned, 0);
		const totalAll = rows.reduce((sum, r) => sum + r.stats.total, 0);
		const globalPercent = totalAll > 0 ? Math.round((totalOwned / totalAll) * 100) : 0;

		appendTableRow(fragment, [{ text: "Global progression", strong: true }, `${formatNumber(totalOwned)}/${formatNumber(totalAll)}`, `${globalPercent}%`], "global-progression");

		rows.forEach(({ label, stats }) => {
			appendTableRow(fragment, [label, `${formatNumber(stats.owned)}/${formatNumber(stats.total)}`, `${stats.percent}%`]);
		});

		tbody.appendChild(fragment);
		table.append(thead, tbody);
	};

	function openBreakdownItemList(groupIndex, rowIndex, label) {
		const matching = WF.mastery.getGroupRowItems(groupIndex, rowIndex).filter((item) => WF.mastery.itemMasteryXp(item) > 0);
		itemListTitle.textContent = `${label} (${matching.length})`;
		WF.render.renderFlagList(itemListBody, matching);
		toggleOverlay(itemListOverlay, true);
	}

	function renderMasteryBreakdown() {
		const container = getEl("mastery-breakdown");
		container.textContent = "";

		const groups = WF.mastery.getBreakdown(WF.storage.load());
		const fragment = document.createDocumentFragment();

		groups.forEach((group, groupIndex) => {
			group.forEach((row, rowIndex) => {
				const item = document.createElement("div");
				item.className = "breakdown-item";
				const valueEl = document.createElement("span");
				valueEl.className = "breakdown-value";
				valueEl.textContent = formatNumber(row.xp);
				const labelEl = document.createElement("span");
				labelEl.className = "breakdown-label";
				labelEl.textContent = row.label;
				item.append(valueEl, labelEl);

				const showBtn = document.createElement("button");
				showBtn.type = "button";
				showBtn.className = "item-info-btn";
				showBtn.textContent = "Show item list";
				showBtn.addEventListener("click", () => openBreakdownItemList(groupIndex, rowIndex, row.label));
				item.appendChild(showBtn);

				fragment.appendChild(item);
			});

			if (groupIndex < groups.length - 1) {
				const separator = document.createElement("div");
				separator.className = "breakdown-separator";
				fragment.appendChild(separator);
			}
		});

		container.appendChild(fragment);
	}
	
	function capitalizeFirstLetter(val) {
		return String(val).charAt(0).toUpperCase() + String(val).slice(1);
	}
	
	function renderEndoSpent() {
		const table = getEl("endo-spent");
		table.textContent = "";

		const thead = buildTableHead(["Rarity", "Mods Owned", "Mods Total", "Endo Spent", "Endo Total"]);
		const tbody = document.createElement("tbody");
		const fragment = document.createDocumentFragment();

		const progress = WF.storage.load();
		const includePvpItems = WF.options.load().includePvpItems;

		const modItems = WF.data.filter((item) => (item.category || "").toLowerCase() === "mod" && (includePvpItems || !item.conclave));

		const totalsByRarity = {};
		Object.keys(WF.ENDO).forEach((rarity) => { totalsByRarity[rarity] = { itemsTotal: 0, itemsOwned: 0, endoTotal: 0, endoSpent: 0 }; });

		const grand = { itemsTotal: 0, itemsOwned: 0, endoTotal: 0, endoSpent: 0 };

		for (const item of modItems) {
			const rarity = totalsByRarity[item.rarity];
			const owned = !!progress[item.item_name];
			const endo = +item.endoSpent || 0;

			rarity.itemsTotal += 1;
			rarity.endoTotal += endo;
			grand.itemsTotal += 1;
			grand.endoTotal += endo;

			if (owned) {
				rarity.itemsOwned += 1;
				rarity.endoSpent += endo;
				grand.itemsOwned += 1;
				grand.endoSpent += endo;
			}
		}

		appendTableRow(fragment, [{ text: "Total", strong: true }, formatNumber(grand.itemsOwned), formatNumber(grand.itemsTotal), formatNumber(grand.endoSpent), formatNumber(grand.endoTotal)], "global-progression");

		Object.keys(WF.ENDO).forEach((rarity) => {
			const r = totalsByRarity[rarity];
			appendTableRow(fragment, [capitalizeFirstLetter(rarity), formatNumber(r.itemsOwned), formatNumber(r.itemsTotal), formatNumber(r.endoSpent), formatNumber(r.endoTotal)]);
		});

		tbody.appendChild(fragment);
		table.append(thead, tbody);
	}

	function openOptions() {
		const options = WF.options.load();
		includeOptionsCheckbox.checked = options.includeOptionsInExport;
		includeSyncKeyCheckbox.checked = options.includeSyncKeyInExport;
		includeFounderCheckbox.checked = options.includeFounderItems;
		includePvpItemsCheckbox.checked = options.includePvpItems;
		themeSwatches.forEach((swatch) => {
			const input = swatch.querySelector("input[type=color]");
			if (input) input.value = WF.theme.getColor(swatch.dataset.var);
		});
		toggleOverlay(optionsOverlay, true);
	}

	function closeOptions() {
		toggleOverlay(optionsOverlay, false);
		resetDeleteButton();
	}

	getEl("btn-options-toggle").addEventListener("click", openOptions);
	getEl("btn-options-close").addEventListener("click", closeOptions);
	
	const itemListOverlay = getEl("item-list-overlay");
	const itemListTitle	 = getEl("item-list-title");
	const itemListBody		= getEl("item-list-body");

	function openItemList(title, flagField) {
		const matching = WF.data.filter((item) => item[flagField]);
		itemListTitle.textContent = `${title} (${matching.length})`;
		WF.render.renderFlagList(itemListBody, matching);
		toggleOverlay(itemListOverlay, true);
	}

	function closeItemList() {
		toggleOverlay(itemListOverlay, false);
	}

	getEl("opt-show-founder-items").addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		openItemList("Founder Exclusive Items", "founder");
	});

	getEl("opt-show-conclave-items").addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		openItemList("Conclave / PVP Items", "conclave");
	});

	getEl("btn-item-list-close").addEventListener("click", closeItemList);

	itemListOverlay.addEventListener("click", (event) => {
		if (event.target === itemListOverlay) closeItemList();
	});

	optionsOverlay.addEventListener("click", (event) => {
		if (event.target === optionsOverlay) closeOptions();
	});

	includeOptionsCheckbox.addEventListener("change", () => {
		WF.options.save({ ...WF.options.load(), includeOptionsInExport: includeOptionsCheckbox.checked });
		if(!includeOptionsCheckbox.checked) {
			includeSyncKeyCheckbox.checked = false;
			WF.toast.show(`Include SYNC secret key is now disabled.`, { type: "info", timeoutMs: 5000 });
		}
	});

	includeSyncKeyCheckbox.addEventListener("change", () => {
		if (includeOptionsCheckbox.checked) {
			WF.options.save({ ...WF.options.load(), includeSyncKeyInExport: includeSyncKeyCheckbox.checked });
			if (includeSyncKeyCheckbox.checked) WF.toast.show("Your export file will now contain your secret sync key. Keep it private.", { type: "info", timeoutMs: 5000 });
		} else {
			includeSyncKeyCheckbox.checked = false;
			WF.toast.show(`To export your SYNC key you need to enable "Save options when exporting" first.`, { type: "info", timeoutMs: 5000 });
		}

	});

	includeFounderCheckbox.addEventListener("change", () => {
		WF.options.save({ ...WF.options.load(), includeFounderItems: includeFounderCheckbox.checked });
		WF.render.renderAll();
		WF.mastery.render();
	});
	
	includePvpItemsCheckbox.addEventListener("change", () => {
		WF.options.save({ ...WF.options.load(), includePvpItems: includePvpItemsCheckbox.checked });
		WF.render.renderAll();
		WF.mastery.render();
	});

	themeSwatches.forEach((swatch) => {
		const colorInput = swatch.querySelector("input[type=color]");
		if (colorInput) {
			const varName = swatch.dataset.var;

			colorInput.addEventListener("input", (event) => {
				document.documentElement.style.setProperty(varName, event.target.value);
			});

			colorInput.addEventListener("change", (event) => {
				WF.theme.setColor(varName, event.target.value);
			});
		}
	});

	getEl("btn-theme-reset").addEventListener("click", () => {
		WF.theme.reset();
		themeSwatches.forEach((swatch) => {
			const input = swatch.querySelector("input[type=color]");
			if (input) input.value = WF.theme.getColor(swatch.dataset.var);
		});
	});

	window.addEventListener("wf:progress-changed", WF.mastery.render);
	WF.mastery.render();

	WF.render.renderAll();
	
	initWelcome();
});