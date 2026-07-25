document.addEventListener("DOMContentLoaded", function () {
  WF.theme.init();

  document.getElementById("btn-export").addEventListener("click", () => {
    WF.exportImport.exportToFile();
  });

  document.getElementById("btn-import").addEventListener("click", () => {
    if (!confirm("This will replace your entire current progress with the imported file. Continue?")) return;
    document.getElementById("import-file-input").click();
  });

  document.getElementById("import-file-input").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    WF.exportImport.importFromFile(file, function (success) {
      if (success) {
        WF.render.renderAll();
        WF.theme.init(); // le fichier importé peut contenir des couleurs de thème (si "Save options" était coché à l'export)
      } else {
        alert("Invalid file, import canceled.");
      }
      event.target.value = "";
    });
  });

  const scrollTopBtn = document.getElementById("btn-scroll-top");
  const SCROLL_SHOW_THRESHOLD = 400;

  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("visible", window.scrollY > SCROLL_SHOW_THRESHOLD);
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
  }

  document.getElementById("btn-sidebar-toggle").addEventListener("click", openSidebar);
  document.getElementById("btn-sidebar-close").addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);

  const infoOverlay = document.getElementById("info-overlay");

  function openInfo() {
    infoOverlay.classList.add("visible");
  }

  function closeInfo() {
    infoOverlay.classList.remove("visible");
    resetDeleteButton();
  }

  const CONFIRM_STEPS = ["CLICK 4 MORE TIME", "CLICK 3 MORE TIME", "CLICK 2 MORE TIME", "CLICK 1 MORE TIME", "PROCEED TO DELETE"];
  const DELETE_CONFIRM_TIMEOUT_MS = 2000;
  const deleteBtn = document.getElementById("btn-delete-data");
  let deleteClickCount = 0;
  let deleteResetTimer = null;

  function resetDeleteButton() {
    deleteClickCount = 0;
    deleteBtn.textContent = deleteBtn.dataset.defaultLabel;
    deleteBtn.classList.remove("confirming");
    clearTimeout(deleteResetTimer);
  }

  document.getElementById("btn-info-toggle").addEventListener("click", openInfo);
  document.getElementById("btn-info-close").addEventListener("click", closeInfo);

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
      closeInfo();
      closeStats();
      closeOptions();
      closeTypeHelp();
    }
  });

  function closeTypeHelp() {
    const openHelp = document.querySelector(".type-help.open");
    if (openHelp) openHelp.classList.remove("open");
  }

  document.addEventListener("click", (event) => {
    const openHelp = document.querySelector(".type-help.open");
    if (openHelp && !openHelp.contains(event.target)) closeTypeHelp();
  });

  document.getElementById("info-project-link").href = WF.PROJECT_URL;

  const changelogList = document.getElementById("info-changelog-list");
  let expandedChangelogIndex = 0;

  function renderChangelog() {
    changelogList.innerHTML = "";

    if (WF.CHANGELOG.length === 0) {
      changelogList.innerHTML = '<li class="info-empty">No changelog entries yet.</li>';
      return;
    }

    WF.CHANGELOG.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = "changelog-entry" + (index === expandedChangelogIndex ? " expanded" : "");

      const header = document.createElement("button");
      header.type = "button";
      header.className = "changelog-entry-header";

      const dateEl = document.createElement("strong");
      dateEl.textContent = entry.date + ' - Game version: ' + entry.version ;

      header.append(dateEl);
      header.addEventListener("click", () => {
        expandedChangelogIndex = index;
        renderChangelog();
      });

      const body = document.createElement("p");
      body.className = "changelog-entry-text";
      body.innerHTML = entry.text;

      li.append(header, body);
      changelogList.appendChild(li);
    });
  }

  renderChangelog();

  const statsOverlay = document.getElementById("stats-overlay");

  function openStats() {
    renderStatsTable();
    renderMasteryBreakdown();
    statsOverlay.classList.add("visible");
  }

  function closeStats() {
    statsOverlay.classList.remove("visible");
  }

  document.getElementById("btn-stats-toggle").addEventListener("click", openStats);
  document.getElementById("btn-stats-close").addEventListener("click", closeStats);

  statsOverlay.addEventListener("click", (event) => {
    if (event.target === statsOverlay) closeStats();
  });

  document.querySelectorAll(".stats-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".stats-tab").forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      document.querySelectorAll(".stats-panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(`stats-panel-${tab.dataset.tab}`).classList.add("active");
    });
  });

  function renderStatsTable() {
    const table = document.getElementById("stats-table");
    table.innerHTML = "<thead><tr><th>Category</th><th>Progress</th><th>%</th></tr></thead>";

    const tbody = document.createElement("tbody");

    WF.NAV_GROUPS.forEach((group) => {
      const allTypes = [...group.types, ...(group.subgroups || []).flatMap((sg) => sg.types)];

      allTypes.forEach((type) => {
        if (!WF.data.some((item) => item.type === type)) return;

        const stats = WF.render.getTypeStats(type);
        const label = (WF.ITEM_TYPES[type] && WF.ITEM_TYPES[type].label) || type;

        const tr = document.createElement("tr");
        const labelCell = document.createElement("td");
        labelCell.textContent = label;
        const progressCell = document.createElement("td");
        progressCell.textContent = `${stats.owned}/${stats.total}`;
        const percentCell = document.createElement("td");
        percentCell.textContent = `${stats.percent}%`;

        tr.append(labelCell, progressCell, percentCell);
        tbody.appendChild(tr);
      });
    });

    table.appendChild(tbody);
  }
  function renderMasteryBreakdown() {
    const container = document.getElementById("mastery-breakdown");
    container.innerHTML = "";

    const groups = WF.mastery.getBreakdown(WF.storage.load());

    groups.forEach((group, groupIndex) => {
      group.forEach((row) => {
        const item = document.createElement("div");
        item.className = "breakdown-item";
        item.innerHTML = `<span class="breakdown-value">${row.xp.toLocaleString()}</span><span class="breakdown-label">${row.label}</span>`;
        container.appendChild(item);
      });

      // Un séparateur entre chaque groupe, jamais après le dernier.
      if (groupIndex < groups.length - 1) {
        const separator = document.createElement("div");
        separator.className = "breakdown-separator";
        container.appendChild(separator);
      }
    });
  }

  const optionsOverlay = document.getElementById("options-overlay");
  const includeOptionsCheckbox = document.getElementById("opt-include-options-in-export");
  const includeFounderCheckbox = document.getElementById("opt-include-founder-pack-exclusive");

  const themeSwatches = document.querySelectorAll(".theme-swatch");

  function openOptions() {
    const options = WF.options.load();
    includeOptionsCheckbox.checked = options.includeOptionsInExport;
    includeFounderCheckbox.checked = options.includeFounderItems;
    themeSwatches.forEach((swatch) => {
      swatch.querySelector("input[type=color]").value = WF.theme.getColor(swatch.dataset.var);
    });
    optionsOverlay.classList.add("visible");
  }

  function closeOptions() {
    optionsOverlay.classList.remove("visible");
  }

  document.getElementById("btn-options-toggle").addEventListener("click", openOptions);
  document.getElementById("btn-options-close").addEventListener("click", closeOptions);

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
    swatch.querySelector("input[type=color]").addEventListener("input", (event) => {
      WF.theme.setColor(swatch.dataset.var, event.target.value);
    });
  });

  document.getElementById("btn-theme-reset").addEventListener("click", () => {
    WF.theme.reset();
    themeSwatches.forEach((swatch) => {
      swatch.querySelector("input[type=color]").value = WF.theme.getColor(swatch.dataset.var);
    });
  });

  window.addEventListener("wf:progress-changed", WF.mastery.render);
  WF.mastery.render();

  WF.render.renderAll();
});