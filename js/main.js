document.addEventListener("DOMContentLoaded", function () {
  WF.theme.init();
  
  const SCROLL_SHOW_THRESHOLD = 400;
  
  const CONFIRM_STEPS = ["CLICK 4 MORE TIME", "CLICK 3 MORE TIME", "CLICK 2 MORE TIME", "CLICK 1 MORE TIME", "PROCEED TO DELETE"];
  const DELETE_CONFIRM_TIMEOUT_MS = 2000;

  const getEl = (id) => document.getElementById(id);

  const sidebar                = getEl("sidebar");
  const sidebarOverlay         = getEl("sidebar-overlay");
  const infoOverlay            = getEl("info-overlay");
  const statsOverlay           = getEl("stats-overlay");
  const optionsOverlay         = getEl("options-overlay");
  const scrollTopBtn           = getEl("btn-scroll-top");
  const deleteBtn              = getEl("btn-delete-data");
  const changelogList          = getEl("info-changelog-list");
  const includeOptionsCheckbox = getEl("opt-include-options-in-export");
  const includeFounderCheckbox = getEl("opt-include-founder-pack-exclusive");
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

  function closeTypeHelp() {
    const openHelp = document.querySelector(".type-help.open");
    if (openHelp) openHelp.classList.remove("open");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeInfo();
      closeStats();
      closeOptions();
      closeTypeHelp();
    }
  });

  document.addEventListener("click", (event) => {
    const openHelp = document.querySelector(".type-help.open");
    if (openHelp && !openHelp.contains(event.target)) closeTypeHelp();
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
    
    WF.NAV_GROUPS.forEach((group) => {
      const rawTypes = [...group.types, ...(group.subgroups || []).flatMap((sg) => sg.types)];

      rawTypes.forEach((typeObj) => {
        const type = typeObj.name || typeObj;
        if (!WF.data.some((item) => item.type === type)) return;

        const stats = WF.render.getTypeStats(type);
        const label = typeObj.label || type;

        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${label}</td><td>${stats.owned}/${stats.total}</td><td>${stats.percent}%</td>`;
        fragment.appendChild(tr);
      });
    });

    tbody.appendChild(fragment);
    table.append(thead, tbody);
  }

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
