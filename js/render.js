WF.render = (function () {
  const savedUiState = WF.uiState.load();
  let activeType = savedUiState.activeType || null;
  let activeSubtype = savedUiState.activeSubtype || "all";
  let activeExtra = savedUiState.activeExtra || {};
  let hideChecked = false;
  let searchQuery = "";

  function typeLabel(type) {
    return (WF.ITEM_TYPES[type] && WF.ITEM_TYPES[type].label) || type;
  }

  function availableTypes() {
    const includeFounder = WF.options.load().includeFounderItems;
    return Object.keys(WF.ITEM_TYPES).filter((type) => WF.data.some((item) => item.type === type && (includeFounder || !item.founder)));
  }

  function matchesFilterValue(itemValue, targetValue) {
    if (Array.isArray(itemValue)) return itemValue.includes(targetValue);
    return itemValue === targetValue;
  }

  function computePercent(items, progress) {
    if (items.length === 0) return 0;
    const owned = items.filter((item) => progress[item.item_name]).length;
    if (owned === items.length) return 100;
    return Math.floor((owned / items.length) * 100);
  }

  function buildSidebarItem(container, type, progress) {
    const includeFounder = WF.options.load().includeFounderItems;
    const typeItems = WF.data.filter((item) => item.type === type && (includeFounder || !item.founder));
    const percent = computePercent(typeItems, progress);

    const btn = document.createElement("button");
    btn.className = "nav-item" + (type === activeType ? " active" : "");
    btn.textContent = `${typeLabel(type)} (${percent}%)`;
    btn.addEventListener("click", () => {
      activeType = type;
      activeSubtype = "all";
      activeExtra = {};
      searchQuery = "";
      renderAll();
      closeSidebarOnMobile();
    });
    container.appendChild(btn);
  }

  function closeSidebarOnMobile() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!sidebar || !overlay) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
    }
  }

  function buildSidebar(types, progress) {
    const container = document.getElementById("sidebar-groups");
    if (!container) return;
    container.innerHTML = "";

    const availableSet = new Set(types);
    const categorizedTypes = new Set();

    WF.NAV_GROUPS.forEach((group) => {
      const groupTypes = group.types.filter((t) => availableSet.has(t));
      const hasSubgroupTypes = (group.subgroups || []).some((sg) => sg.types.some((t) => availableSet.has(t)));
      if (groupTypes.length === 0 && !hasSubgroupTypes) return;

      const groupEl = document.createElement("div");
      groupEl.className = "nav-group";

      const label = document.createElement("div");
      label.className = "nav-group-label";
      label.textContent = group.label;
      groupEl.appendChild(label);

      groupTypes.forEach((type) => {
        categorizedTypes.add(type);
        buildSidebarItem(groupEl, type, progress);
      });

      (group.subgroups || []).forEach((subgroup) => {
        const subTypes = subgroup.types.filter((t) => availableSet.has(t));
        if (subTypes.length === 0) return;

        const subEl = document.createElement("div");
        subEl.className = "nav-subgroup";

        const subLabel = document.createElement("div");
        subLabel.className = "nav-subgroup-label";
        subLabel.textContent = subgroup.label;
        subEl.appendChild(subLabel);

        subTypes.forEach((type) => {
          categorizedTypes.add(type);
          buildSidebarItem(subEl, type, progress);
        });

        groupEl.appendChild(subEl);
      });

      container.appendChild(groupEl);
    });

    const uncategorized = types.filter((t) => !categorizedTypes.has(t));
    if (uncategorized.length > 0) {
      const groupEl = document.createElement("div");
      groupEl.className = "nav-group";

      const label = document.createElement("div");
      label.className = "nav-group-label";
      label.textContent = "Other";
      groupEl.appendChild(label);

      uncategorized.forEach((type) => buildSidebarItem(groupEl, type, progress));
      container.appendChild(groupEl);
    }
  }

  function buildFilterRow(container, options, currentValue, onSelect, poolItems, progress, fieldName) {
    if (!options || options.length === 0) return;

    const row = document.createElement("div");
    row.className = "filter-row";

    const values = ["all", ...options];
    values.forEach((value) => {
      const subset = value === "all" ? poolItems : poolItems.filter((item) => matchesFilterValue(item[fieldName], value));
      const percent = computePercent(subset, progress);

      const pill = document.createElement("button");
      pill.className = "filter-pill" + (value === currentValue ? " active" : "");
      pill.textContent = `${value === "all" ? "All" : value} (${percent}%)`;
      pill.addEventListener("click", () => {
        onSelect(value);
        renderAll();
      });
      row.appendChild(pill);
    });

    container.appendChild(row);
  }

  function buildProgressBar(container, items, progress) {
    const total = items.length;
    const owned = items.filter((item) => progress[item.item_name]).length;
    const percent = computePercent(items, progress);

    const wrap = document.createElement("div");
    wrap.className = "progress-wrap";
    wrap.innerHTML = `
      <div class="progress-label">${owned} / ${total} (${percent}%)</div>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
    `;
    container.appendChild(wrap);
  }

  function buildBulkActions(container, visibleItems, progress) {
    const allOwned = visibleItems.length > 0 && visibleItems.every((item) => progress[item.item_name]);

    const btn = document.createElement("button");
    btn.className = "bulk-toggle-btn";
    btn.textContent = allOwned ? "Deselect all visible" : "Select all visible";
    btn.disabled = visibleItems.length === 0;
    btn.addEventListener("click", () => {
      WF.storage.setOwnedBulk(visibleItems.map((item) => item.item_name), !allOwned);
      renderAll();
    });
    container.appendChild(btn);
  }

  function buildHideCheckedToggle(container) {
    const btn = document.createElement("button");
    btn.className = "bulk-toggle-btn" + (hideChecked ? " active" : "");
    btn.textContent = "Hide checked";
    btn.addEventListener("click", () => {
      hideChecked = !hideChecked;
      renderAll();
    });
    container.appendChild(btn);
  }

  function buildHelpButton(container) {
    const typeInfo = WF.ITEM_TYPES[activeType];
    const description = typeInfo && typeInfo.description;
    if (!description) return;

    const wrap = document.createElement("div");
    wrap.className = "type-help";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "type-help-btn";
    btn.setAttribute("aria-label", "About this category");
    btn.textContent = typeInfo.label + " ?";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      wrap.classList.toggle("open");
    });

    const tooltip = document.createElement("div");
    tooltip.className = "type-help-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.textContent = description;

    wrap.append(btn, tooltip);
    container.appendChild(wrap);
  }

  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  function buildSearchCluster(container) {
    const cluster = document.createElement("div");
    cluster.className = "search-cluster";
    buildHelpButton(cluster);
    buildSearchInput(cluster);
    container.appendChild(cluster);
  }

  function buildSearchInput(container) {
    const wrap = document.createElement("div");
    wrap.className = "search-wrap";

    const input = document.createElement("input");
    input.type = "text";
    input.id = "seach-input";
    input.className = "search-input";
    input.placeholder = "Search visible items...";
    input.value = searchQuery;
    input.addEventListener("input", (event) => {
      const cursorPos = event.target.selectionStart;
      searchQuery = event.target.value;
      renderAll();

      const newInput = document.querySelector(".search-input");
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(cursorPos, cursorPos);
      }
    });
    wrap.appendChild(input);

    if (searchQuery) {
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "search-clear-btn";
      clearBtn.setAttribute("aria-label", "Clear search");
      clearBtn.textContent = "\u00d7";
      clearBtn.addEventListener("click", () => {
        searchQuery = "";
        renderAll();
      });
      wrap.appendChild(clearBtn);
    }

    container.appendChild(wrap);
  }

  function buildItemList(container, items, progress) {
    const list = document.createElement("div");
    list.className = "item-list";

    const sortedItems = [...items].sort((a, b) => naturalCompare(a.display_name.en, b.display_name.en));

    sortedItems.forEach((item) => {
      const owned = !!progress[item.item_name];
      const row = document.createElement("label");
      const masteryXp = item.mastery_xp || null;
      const vaulted   = item.vaulted    || null;
      row.className = "item-row" + (owned ? " owned" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "item-checkbox-hidden";
      checkbox.checked = owned;
      checkbox.addEventListener("change", () => {
        WF.storage.setOwned(item.item_name, checkbox.checked);
        renderAll();
      });

      const name = document.createElement("span");
      name.className = "item-name";
      name.textContent = item.display_name.en;
      
      row.append(checkbox, name);
      
      if (masteryXp || vaulted) {
        const divInfos = document.createElement("div");
        divInfos.className = "item-infos";

        if (vaulted) {
          const div = document.createElement("div");
          div.className = "item-info";
          div.setAttribute("data-tooltip", `Vaulted since ${vaulted.toLocaleString()}`);
          
          const text = document.createElement("span");
          text.className = "item-info-text";
          text.textContent = "V";

          div.append(text);
          divInfos.append(div);
        }

        if (masteryXp) {
          const div = document.createElement("div");
          div.className = "item-info";
          div.setAttribute("data-tooltip", `${masteryXp.toLocaleString()} Mastery XP`);

          const text = document.createElement("span");
          text.className = "item-info-text";
          text.textContent = "XP";

          div.append(text);
          divInfos.append(div);
        }

        row.append(checkbox, divInfos);
      }
      
      list.appendChild(row);
    });

    container.appendChild(list);
  }

  function renderAll() {
    const root = document.getElementById("app");
    root.innerHTML = "";

    const types = availableTypes();
    if (types.length === 0) {
      root.innerHTML = '<p class="empty-state">Aucune donnée chargée. Ajoutez un fichier dans js/data/.</p>';
      return;
    }

    const progress = WF.storage.load();

    if (activeType === null || !types.includes(activeType)) activeType = WF.DEFAUT_ACTIVE_TAB;

    const extraFilters = WF.EXTRA_FILTERS[activeType] || [];
    const includeFounder = WF.options.load().includeFounderItems;
    const typeBase = WF.data.filter((item) => item.type === activeType && (includeFounder || !item.founder));

    function getFilteredPool(excludeField) {
      let pool = typeBase;

      if (excludeField !== "subtype" && activeSubtype !== "all") {
        pool = pool.filter((item) => matchesFilterValue(item.subtype, activeSubtype));
      }

      extraFilters.forEach((extra) => {
        if (extra.field === excludeField) return;
        const value = activeExtra[extra.field];
        if (value && value !== "all") pool = pool.filter((item) => matchesFilterValue(item[extra.field], value));
      });

      return pool;
    }

    buildSidebar(types, progress);

    buildFilterRow(root, WF.SUBTYPES[activeType], activeSubtype, (value) => {
      activeSubtype = value;
      activeExtra = {};
    }, getFilteredPool("subtype"), progress, "subtype");

    extraFilters.forEach((extra) => {
      const options = extra.optionsBySubtype ? extra.optionsBySubtype[activeSubtype] || null : extra.options;
      if (!options) return;

      if (extra.showIf) {
        const dependValue = activeExtra[extra.showIf.field] || "all";
        const matches = dependValue === extra.showIf.value || dependValue === "all";
        if (!matches) { activeExtra[extra.field] = "all"; return; }
      }

      const currentValue = activeExtra[extra.field] || "all";
      buildFilterRow(root, options, currentValue, (value) => { activeExtra[extra.field] = value; }, getFilteredPool(extra.field), progress, extra.field);
    });

    const items = getFilteredPool(null);
    const visibleItems = hideChecked ? items.filter((item) => !progress[item.item_name]) : items;

    const query = searchQuery.trim().toLowerCase();
    const searchedItems = query ? visibleItems.filter((item) => item.display_name.en.toLowerCase().includes(query)) : visibleItems;

    buildProgressBar(root, items, progress);

    const actionsRow = document.createElement("div");
    actionsRow.className = "bulk-actions-row";
    buildBulkActions(actionsRow, searchedItems, progress);
    buildHideCheckedToggle(actionsRow);
    buildSearchCluster(actionsRow);
    root.appendChild(actionsRow);

    buildItemList(root, searchedItems, progress);
    
    WF.uiState.save({ activeType, activeSubtype, activeExtra });
  }

  function getTypeStats(type) {
    const progress = WF.storage.load();
    const includeFounder = WF.options.load().includeFounderItems;
    const items = WF.data.filter((item) => item.type === type && (includeFounder || !item.founder));
    const owned = items.filter((item) => progress[item.item_name]).length;
    return { owned, total: items.length, percent: computePercent(items, progress) };
  }

  return { renderAll, getTypeStats };
})();