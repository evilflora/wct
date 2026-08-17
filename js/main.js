document.addEventListener("DOMContentLoaded", function () {
  WF.theme.init();
  
  const SCROLL_SHOW_THRESHOLD = 400;
  
  const CONFIRM_STEPS = ["CLICK 4 MORE TIME", "CLICK 3 MORE TIME", "CLICK 2 MORE TIME", "CLICK 1 MORE TIME", "PROCEED TO DELETE"];
  const DELETE_CONFIRM_TIMEOUT_MS = 2000;

  const getEl = (id) => document.getElementById(id);

  const sidebar                = getEl("sidebar");
  const sidebarOverlay         = getEl("sidebar-overlay");
  const syncOverlay            = getEl("sync-overlay");
  const syncKey                = getEl("sync-key");
  const syncActionBtn          = getEl("btn-sync-action");
  const syncPushBtn            = getEl("btn-sync-push");
  const syncPullBtn            = getEl("btn-sync-pull");
  const syncDisconnectBtn      = getEl("btn-sync-disconnect");
  const syncDeleteBtn          = getEl("btn-sync-delete");
  const infoOverlay            = getEl("info-overlay");
  const statsOverlay           = getEl("stats-overlay");
  const optionsOverlay         = getEl("options-overlay");
  const scrollTopBtn           = getEl("btn-scroll-top");
  const deleteBtn              = getEl("btn-delete-data");
  const changelogList          = getEl("info-changelog-list");
  const includeOptionsCheckbox = getEl("opt-include-options-in-export");
  const includeFounderCheckbox = getEl("opt-include-founder-pack-exclusive");
  const includePvpModsCheckbox = getEl("opt-include-pvp-mods");
  const importFileInput        = getEl("import-file-input");
  const themeSwatches          = document.querySelectorAll(".theme-swatch");

  const toggleOverlay = (overlay, show) => overlay.classList.toggle("visible", show);
  
  const tooltip = document.createElement("div");
  tooltip.id = "global-tooltip";
  tooltip.className = "global-tooltip";
  document.body.appendChild(tooltip);

  const appRoot = getEl("app");

  appRoot.addEventListener("mouseover", (event) => { // yay js, because i can't figure a way in css wtih content-visibility
    const el = event.target.closest(".item-info[data-tooltip]");
    if (!el) return;

    const rect = el.getBoundingClientRect();
    tooltip.textContent = el.dataset.tooltip;
    tooltip.style.left = rect.right + "px";
    tooltip.style.top = (rect.top - 6) + "px";
    tooltip.style.transform = "translate(-100%, -100%)";
    tooltip.classList.add("visible");
  });

  appRoot.addEventListener("mouseout", (event) => {
    const el = event.target.closest(".item-info[data-tooltip]");
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

  importFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    WF.exportImport.importFromFile(file, function (success) {
      if (success) {
        WF.render.renderAll();
        WF.theme.init();
      } else {
        alert("Invalid file, import canceled.");
      }
      event.target.value = "";
    });
  });

  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("visible", window.scrollY > SCROLL_SHOW_THRESHOLD);
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function openSidebar() {
    sidebar.classList.add("open");
    toggleOverlay(sidebarOverlay, true);
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    toggleOverlay(sidebarOverlay, false);
  }

  getEl("btn-sidebar-toggle").addEventListener("click", openSidebar);
  getEl("btn-sidebar-close").addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);
  
	async function generateRandomHash() {
		const bytes = crypto.getRandomValues(new Uint8Array(32));
		return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
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

  syncActionBtn.addEventListener("click", async () => {
		if (checkRealServer() == false) return;
    const inputVal = syncKey.value.trim();

    if (inputVal.length === 64) {
      const options = WF.options.load();
      WF.options.save({ ...options, syncKey: inputVal });
      updateSyncUIState();
      WF.toast.show(`Successfully connected. Use DOWNLOAD or UPLOAD to transfer data.`, { type: "success" });
    } else {
      const newHash = await generateRandomHash();
      if (WF.sync) {
        try {
          await WF.sync.pushData(newHash);

          const options = WF.options.load();
          WF.options.save({ ...options, syncKey: newHash });
          syncKey.value = newHash;

					WF.toast.show(`Successfully connected.`, { type: "success" });
        } catch (e) {
          syncKey.value = "";
          WF.toast.show(`Failed to connect. Please try again.`, { type: "error" });
        }
      }
      updateSyncUIState();
    }
  });

  syncPullBtn.addEventListener("click", async () => {
		if (checkRealServer() == false) return;
    const options = WF.options.load();
    if (options.syncKey && WF.sync) {
      try {
        const remoteObj = await WF.sync.pullData(options.syncKey);
        if (remoteObj) {
          applyRemoteData(remoteObj);
					WF.toast.show(`Successfully downloaded cloud data.`, { type: "success" });
        } else {
				  WF.toast.show(`No remote data found.`, { type: "error" });
        }
      } catch (e) {
				if (e.message === "CLIENT_RATE_LIMITED")
						WF.toast.show(`You are being rate limited, maximum 1 DOWNLOAD per 10 seconds.`, { timeoutMs: 3000, type: "info" });
				else
					WF.toast.show(`Failed to download cloud data.`, { type: "error" });
      }
    }
  });

  syncPushBtn.addEventListener("click", async () => {
		if (checkRealServer() == false) return;
    const options = WF.options.load();
    if (options.syncKey && WF.sync) {
      try {
        await WF.sync.pushData(options.syncKey);
				WF.toast.show(`Data successfully sent.`, { type: "success" });
      } catch (e) {
				if (e.message === "CLIENT_RATE_LIMITED" || e.message === "RATE_LIMITED")
					WF.toast.show(`You are being rate limited, maximum 1 UPLOAD per 10 seconds.`, { timeoutMs: 3000, type: "info" });
				else
					WF.toast.show(`Failed to send data.`, { type: "error" });
      }
    }
  });

  syncDisconnectBtn.addEventListener("click", () => {
    const options = WF.options.load();
    
		if (!confirm("Are you sure you want to disconnect? The key will be lost if it is not manually saved.")) return;
		
    if (WF.sync) {
      WF.sync.stopSync();
    }

    const updatedOptions = { ...options };
    delete updatedOptions.syncKey;
    WF.options.save(updatedOptions);

    syncKey.value = "";
    updateSyncUIState();
		WF.toast.show(`Disconnected. Local data preserved.`, { type: "success" });
  });

  syncDeleteBtn.addEventListener("click", async () => {
		if (checkRealServer() == false) return;
    const options = WF.options.load();
    const currentKey = options.syncKey;

    if (!currentKey) return;
    if (!confirm("Are you sure you want to remove this key and delete all cloud data?")) return;

    try {
      if (WF.sync) {
        await WF.sync.deleteRemoteData(currentKey);
      }
      
      const updatedOptions = { ...options };
      delete updatedOptions.syncKey;
      WF.options.save(updatedOptions);

      syncKey.value = "";
      updateSyncUIState();
			WF.toast.show(`Key removed and cloud data deleted.`, { type: "success" });
    } catch (e) {
      WF.toast.show(`Error deleting key and cloud data.`, { type: "error" });
    }
  });

  function openSync() {
    updateSyncUIState();
    toggleOverlay(syncOverlay, true);
  }

  function closeSync() {
    toggleOverlay(syncOverlay, false);
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
    resetDeleteButton();
  }

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
    deleteClickCount++;
    deleteBtn.classList.add("confirming");
    clearTimeout(deleteResetTimer);

    if (deleteClickCount <= CONFIRM_STEPS.length) {
      deleteBtn.textContent = CONFIRM_STEPS[CONFIRM_STEPS.length - 1];
    } else if (deleteClickCount > CONFIRM_STEPS.length) {
      WF.storage.clearAll();
      location.reload();
      return;
    }

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
    }
  });

  getEl("info-project-link-live").href = WF.PROJECT_URL;
  getEl("info-project-link-src").href = WF.PROJECT_SRC;

  function renderChangelog() {
    changelogList.textContent = "";

    if (!WF.CHANGELOG || WF.CHANGELOG.length === 0) {
      changelogList.innerHTML = '<li class="info-empty">No changelog entries yet.</li>';
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
      body.innerHTML = entry.text;

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

	function renderStatsTable() {
    const table = getEl("stats-table");
    table.textContent = "";
    const thead = document.createElement("thead");
    thead.innerHTML = "<tr><th>Category</th><th>Progress</th><th>%</th></tr>";
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

    const globalTr = document.createElement("tr");
    globalTr.className = "global-progression";
    globalTr.innerHTML = `<td><strong>Global progression</strong></td><td>${totalOwned}/${totalAll}</td><td>${globalPercent}%</td>`;
    fragment.appendChild(globalTr);

    rows.forEach(({ label, stats }) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${label}</td><td>${stats.owned}/${stats.total}</td><td>${stats.percent}%</td>`;
      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    table.append(thead, tbody);
  };

  function renderMasteryBreakdown() {
    const container = getEl("mastery-breakdown");
    container.textContent = "";

    const groups = WF.mastery.getBreakdown(WF.storage.load());
    const fragment = document.createDocumentFragment();

    groups.forEach((group, groupIndex) => {
      group.forEach((row) => {
        const item = document.createElement("div");
        item.className = "breakdown-item";
        item.innerHTML = `<span class="breakdown-value">${row.xp.toLocaleString()}</span><span class="breakdown-label">${row.label}</span>`;
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

  function openOptions() {
    const options = WF.options.load();
    includeOptionsCheckbox.checked = options.includeOptionsInExport;
    includeFounderCheckbox.checked = options.includeFounderItems;
    includePvpModsCheckbox.checked = options.includePvpMods;
    themeSwatches.forEach((swatch) => {
      const input = swatch.querySelector("input[type=color]");
      if (input) input.value = WF.theme.getColor(swatch.dataset.var);
    });
    toggleOverlay(optionsOverlay, true);
  }

  function closeOptions() {
    toggleOverlay(optionsOverlay, false);
  }

  getEl("btn-options-toggle").addEventListener("click", openOptions);
  getEl("btn-options-close").addEventListener("click", closeOptions);

  optionsOverlay.addEventListener("click", (event) => {
    if (event.target === optionsOverlay) closeOptions();
  });

  includeOptionsCheckbox.addEventListener("change", () => {
    WF.options.save({ ...WF.options.load(), includeOptionsInExport: includeOptionsCheckbox.checked });
  });

  includeFounderCheckbox.addEventListener("change", () => {
    WF.options.save({ ...WF.options.load(), includeFounderItems: includeFounderCheckbox.checked });
    WF.render.renderAll();
    WF.mastery.render();
  });
	
  includePvpModsCheckbox.addEventListener("change", () => {
    WF.options.save({ ...WF.options.load(), includePvpMods: includePvpModsCheckbox.checked });
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
});
