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

  function availableTypes(includeFounder) {
    return Object.keys(WF.ITEM_TYPES).filter((type) =>
      WF.data.some((item) => item.type === type && (includeFounder || !item.founder))
    );
  }

  function matchesFilterValue(itemValue, targetValue) {
    if (targetValue === "TODO") {
      if (Array.isArray(itemValue)) return itemValue.length === 0;
      return itemValue === null || itemValue === "null" || itemValue === undefined;
    }
    if (Array.isArray(itemValue)) return itemValue.includes(targetValue);
    return itemValue === targetValue;
  }

  function computePercent(items, progress) {
    const total = items.length;
    if (total === 0) return 0;
    let owned = 0;
    for (let i = 0; i < total; i++) {
      if (progress[items[i].item_name]) owned++;
    }
    if (owned === total) return 100;
    return Math.floor((owned / total) * 100);
  }

  function buildSidebarItem(container, type, progress, includeFounder) {
    const typeItems = WF.data.filter((item) => item.type === type && (includeFounder || !item.founder));
    const percent = computePercent(typeItems, progress);

    const btn = document.createElement("button");
    btn.className = "nav-item" + (type === activeType ? " active" : "");
    btn.dataset.type = type;
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

  function buildSidebar(types, progress, includeFounder) {
    const container = document.getElementById("sidebar-groups");
    if (!container) return;
    container.textContent = "";

    const availableSet = new Set(types);
    const categorizedTypes = new Set();
    const fragment = document.createDocumentFragment();
    const getTypeKey = (t) => t.name || t;

    WF.NAV_GROUPS.forEach((group) => {
      const groupTypes = group.types.map(getTypeKey).filter((t) => availableSet.has(t));
      const hasSubgroupTypes = (group.subgroups || []).some((sg) =>
        sg.types.map(getTypeKey).some((t) => availableSet.has(t))
      );
      if (groupTypes.length === 0 && !hasSubgroupTypes) return;

      const groupEl = document.createElement("div");
      groupEl.className = "nav-group";

      const label = document.createElement("div");
      label.className = "nav-group-label";
      label.textContent = group.label;
      groupEl.appendChild(label);

      groupTypes.forEach((type) => {
        categorizedTypes.add(type);
        buildSidebarItem(groupEl, type, progress, includeFounder);
      });

      (group.subgroups || []).forEach((subgroup) => {
        const subTypes = subgroup.types.map(getTypeKey).filter((t) => availableSet.has(t));
        if (subTypes.length === 0) return;

        const subEl = document.createElement("div");
        subEl.className = "nav-subgroup";

        const subLabel = document.createElement("div");
        subLabel.className = "nav-subgroup-label";
        subLabel.textContent = subgroup.label;
        subEl.appendChild(subLabel);

        subTypes.forEach((type) => {
          categorizedTypes.add(type);
          buildSidebarItem(subEl, type, progress, includeFounder);
        });

        groupEl.appendChild(subEl);
      });

      fragment.appendChild(groupEl);
    });

    const uncategorized = types.filter((t) => !categorizedTypes.has(t));
    if (uncategorized.length > 0) {
      const groupEl = document.createElement("div");
      groupEl.className = "nav-group";

      const label = document.createElement("div");
      label.className = "nav-group-label";
      label.textContent = "Other";
      groupEl.appendChild(label);

      uncategorized.forEach((type) => buildSidebarItem(groupEl, type, progress, includeFounder));
      fragment.appendChild(groupEl);
    }

    container.appendChild(fragment);
  }

function buildFilterRow(container, Options, currentValue, onSelect, progress, fieldName, existencePool) {
    if (!Options) return;

    const options = Object.values(Options);

    if (options.length === 0) return;

    const row = document.createElement("div");
    row.className = "filter-row";

    const values = ["all", ...options, "TODO"];
    values.forEach((value) => {
      const subset = value === "all" ? existencePool : existencePool.filter((item) => matchesFilterValue(item[fieldName], value));
      if (subset.length === 0) return; // le filtre n'existe pas dans ce type/subtype

      const percent = computePercent(subset, progress);

      const pill = document.createElement("button");
      pill.className = "filter-pill" + (value === currentValue ? " active" : "");
      pill.dataset.field = fieldName;
      pill.dataset.value = value;
      pill.textContent = `${value === "all" ? "All" : value} (${percent}%)`;
      pill.addEventListener("click", () => {
        onSelect(value);
        renderAll();
      });
      row.appendChild(pill);
    });

    if (row.children.length === 0) return;

    container.appendChild(row);
  }

  function buildProgressBar(container, items, progress) {
    const total = items.length;
    let owned = 0;
    for (let i = 0; i < total; i++) {
      if (progress[items[i].item_name]) owned++;
    }
    const percent = computePercent(items, progress);

    const wrap = document.createElement("div");
    wrap.className = "progress-wrap";
    wrap.innerHTML = `
      <div class="progress-label">${owned} / ${total} (${percent}%)</div>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
    `;
    container.appendChild(wrap);
  }

  function updateUIFast(currentPoolItems) {
    const progress = WF.storage.load();
    const includeFounder = WF.options.load().includeFounderItems;

    const total = currentPoolItems.length;
    let owned = 0;
    for (let i = 0; i < total; i++) {
      if (progress[currentPoolItems[i].item_name]) owned++;
    }
    const percent = computePercent(currentPoolItems, progress);

    const label = document.querySelector(".progress-label");
    const fill = document.querySelector(".progress-fill");
    if (label) label.textContent = `${owned} / ${total} (${percent}%)`;
    if (fill) fill.style.width = `${percent}%`;

    const activeNav = document.querySelector(`.nav-item[data-type="${activeType}"]`);
    if (activeNav) {
      const typeItems = WF.data.filter((item) => item.type === activeType && (includeFounder || !item.founder));
      const typePercent = computePercent(typeItems, progress);
      activeNav.textContent = `${typeLabel(activeType)} (${typePercent}%)`;
    }

    const typeBase = WF.data.filter((item) => item.type === activeType && (includeFounder || !item.founder));

    function getAncestorPoolFast(fieldName) {
      if (fieldName === "subtype") return typeBase;
      if (activeSubtype === "all") return typeBase;
      return typeBase.filter((item) => matchesFilterValue(item.subtype, activeSubtype));
    }

    const pills = document.querySelectorAll(".filter-pill[data-field][data-value]");
    pills.forEach((pill) => {
      const fieldName = pill.dataset.field;
      const value = pill.dataset.value;
      const ancestorPool = getAncestorPoolFast(fieldName);
      const subset = value === "all" ? ancestorPool : ancestorPool.filter((item) => matchesFilterValue(item[fieldName], value));
      const p = computePercent(subset, progress);
      pill.textContent = `${value === "all" ? "All" : value} (${p}%)`;
    });
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
    input.id = "search-input";
    input.className = "search-input";
    input.placeholder = "Search visible items...";
    input.value = searchQuery;
    input.addEventListener("input", (event) => {
      const cursorPos = event.target.selectionStart;
      searchQuery = event.target.value;
      renderAll();

      const newInput = document.getElementById(input.id);
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

  function buildItemList(container, items, progress, currentPoolItems) {
    const list = document.createElement("div");
    list.className = "item-list";

    const sortedItems = [...items].sort((a, b) => naturalCompare(a.display_name.en, b.display_name.en));
    const fragment = document.createDocumentFragment();

    sortedItems.forEach((item) => {
      const owned = !!progress[item.item_name];
      const row = document.createElement("label");
      const masteryXp = item.mastery_xp || null;
      const vaulted = item.vaulted || null;
      row.className = "item-row" + (owned ? " owned" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "item-checkbox-hidden";
      checkbox.checked = owned;
      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        WF.storage.setOwned(item.item_name, isChecked);

        if (hideChecked && isChecked) {
          row.remove();
        } else {
          row.classList.toggle("owned", isChecked);
        }

        updateUIFast(currentPoolItems);
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

        row.appendChild(divInfos);
      }

      fragment.appendChild(row);
    });

    list.appendChild(fragment);
    container.appendChild(list);
  }

  function renderAll() {
    const root = document.getElementById("app");
    root.textContent = "";

    const includeFounder = WF.options.load().includeFounderItems;
    const types = availableTypes(includeFounder);

    if (types.length === 0) {
      root.innerHTML = '<p class="empty-state">No data loaded.</p>';
      return;
    }

    const progress = WF.storage.load();

    if (activeType === null || !types.includes(activeType)) activeType = WF.DEFAUT_ACTIVE_TAB;

    const extraFilters = WF.EXTRA_FILTERS[activeType] || [];
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
    
	function getAncestorPool(fieldName) {
      if (fieldName === "subtype") return typeBase;
      if (activeSubtype === "all") return typeBase;
      return typeBase.filter((item) => matchesFilterValue(item.subtype, activeSubtype));
    }

    buildSidebar(types, progress, includeFounder);

    buildFilterRow(root, Object.values(WF.SUB_TYPES[activeType] || {}), activeSubtype, (value) => { activeSubtype = value; activeExtra = {}; }, progress, "subtype", getAncestorPool("subtype"));

    extraFilters.forEach((extra) => {
      const options = extra.optionsBySubtype ? extra.optionsBySubtype[activeSubtype] || null : extra.options;
      if (!options) return;

      if (extra.showIf) {
        const dependValue = activeExtra[extra.showIf.field] || "all";
        const matches = dependValue === extra.showIf.value || dependValue === "all";
        if (!matches) {
          activeExtra[extra.field] = "all";
          return;
        }
      }

      const currentValue = activeExtra[extra.field] || "all";
      buildFilterRow(root, options, currentValue, (value) => { activeExtra[extra.field] = value; }, progress, extra.field, getAncestorPool(extra.field));
    });

    const items = getFilteredPool(null);
    const visibleItems = hideChecked ? items.filter((item) => !progress[item.item_name]) : items;

    const query = searchQuery.trim().toLowerCase();
    const searchedItems = query ? visibleItems.filter((item) => item.display_name.en.toLowerCase().includes(query)) : visibleItems;

    buildProgressBar(root, searchedItems, progress);

    const actionsRow = document.createElement("div");
    actionsRow.className = "bulk-actions-row";
    buildBulkActions(actionsRow, searchedItems, progress);
    buildHideCheckedToggle(actionsRow);
    buildSearchCluster(actionsRow);
    root.appendChild(actionsRow);

    buildItemList(root, searchedItems, progress, searchedItems);
    
    WF.uiState.save({ activeType, activeSubtype, activeExtra });
  }

  function getTypeStats(type) {
    const progress = WF.storage.load();
    const includeFounder = WF.options.load().includeFounderItems;
    const items = WF.data.filter((item) => item.type === type && (includeFounder || !item.founder));
    let owned = 0;
    for (let i = 0; i < items.length; i++) {
      if (progress[items[i].item_name]) owned++;
    }
    return { owned, total: items.length, percent: computePercent(items, progress) };
  }

  return { renderAll, getTypeStats };
})();
