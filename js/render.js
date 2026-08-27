WF.render = (function () {
  const savedUiState = WF.uiState.load();
  const all  = "all";
  const todo = "todo";

  const ITEM_BADGES = [
    { key: "vaulted",   text: "V", tooltip: (item) => `Vaulted since ${item.vaulted.toLocaleString()}` },
    { key: "masteryXp", text: "X", tooltip: (item) => `${item.masteryXp.toLocaleString()} Mastery XP` },
    { key: "hidden",    text: "H", tooltip: ()     => `Hidden until owned or discovered` },
  ];

  const SEARCH_DEBOUNCE_MS = 200;
  const SIDEBAR_SEARCH_MAX_LENGTH = 64;
  const SIDEBAR_SEARCH_MAX_RESULTS = 15;
  const SIDEBAR_SEARCH_MIN_LENGTH = 3;
  const SIDEBAR_SEARCH_DROPDOWN_MIN_WIDTH = 320;

  let activeCategory = savedUiState.activeCategory || null;
  let activeType = savedUiState.activeType || all;
  let activeFilter = savedUiState.activeFilter || {};
  let hideChecked = false;
  let searchQuery = "";
  let lastRenderedPool = [];
  let searchDebounceTimer = null;
  let sidebarSearchQuery = "";
  let sidebarSearchDebounceTimer = null;
  let sidebarSearchResultsEl = null;
  let sidebarSearchMountEl = null;

  const lowerCache = new Map();
  function lower(str) {
    let cached = lowerCache.get(str);
    if (cached === undefined) {
      cached = str.toLowerCase();
      lowerCache.set(str, cached);
    }
    return cached;
  }

  function matchesCategory(item, category) {
    return lower(item.category) === lower(category);
  }

  function categoryLabel(category) {
    return (WF.CATEGORY[category] && WF.CATEGORY[category].label) || category;
  }

  function availableCategories(includeFounder, includePvpItems) {
    return Object.keys(WF.CATEGORY).filter((category) =>
      WF.data.some((item) => matchesCategory(item, category) && (includeFounder || !item.founder) && (includePvpItems || !item.conclave))
    );
  }

  function matchesFilterValue(itemValue, targetValue) {
    targetValue = lower(targetValue);

    if (targetValue === todo) {
      if (Array.isArray(itemValue)) return itemValue.length === 0;
      return itemValue === null || itemValue === undefined || lower(itemValue) === "null";
    }

    if (Array.isArray(itemValue)) return itemValue.some((value) => lower(value) === targetValue);
    if (itemValue === null || itemValue === undefined) return false;

    return lower(itemValue) === targetValue;
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

  let cache = { category: null, includeFounder: null, includePvpItems: null, typeBase: [], filters: [] };

  function getTypeBaseAndFilters(includeFounder, includePvpItems) {
    if (cache.category === activeCategory && cache.includeFounder === includeFounder && cache.includePvpItems === includePvpItems) {
      return cache;
    }
    cache = {
      category: activeCategory,
      includeFounder,
      includePvpItems,
      typeBase: WF.data.filter((item) => matchesCategory(item, activeCategory) && (includeFounder || !item.founder) && (includePvpItems || !item.conclave)),
      filters: WF.FILTERS[activeCategory] || [],
    };
    return cache;
  }

  function buildSidebarItem(container, category, progress, includeFounder, includePvpItems) {
    const typeItems = WF.data.filter((item) => matchesCategory(item, category) && (includeFounder || !item.founder) && (includePvpItems || !item.conclave));
    const percent = computePercent(typeItems, progress);

    const btn = document.createElement("button");
    btn.className = "nav-item" + (category === activeCategory ? " active" : "");
    btn.dataset.category = category;
    btn.textContent = `${categoryLabel(category)} (${percent}%)`;
    btn.addEventListener("click", () => {
      activeCategory = category;
      activeType = all;
      activeFilter = {};
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

  function getSidebarSearchResultsEl() {
    if (!sidebarSearchResultsEl) {
      sidebarSearchResultsEl = document.createElement("div");
      sidebarSearchResultsEl.className = "sidebar-search-results";
      document.body.appendChild(sidebarSearchResultsEl);
    }
    return sidebarSearchResultsEl;
  }

  function positionSidebarSearchResults(wrapEl) {
    const resultsEl = getSidebarSearchResultsEl();
    const rect = wrapEl.getBoundingClientRect();
    const width = Math.max(rect.width, SIDEBAR_SEARCH_DROPDOWN_MIN_WIDTH);

    resultsEl.style.top = `${rect.bottom + 4}px`;
    resultsEl.style.width = `${width}px`;
  }

  function hideSidebarSearchResults() {
    if (sidebarSearchResultsEl) sidebarSearchResultsEl.classList.remove("visible");
  }

  function showSidebarSearchResults(wrapEl, includeFounder, includePvpItems) {
    const resultsEl = getSidebarSearchResultsEl();
    renderSidebarSearchResults(resultsEl, includeFounder, includePvpItems);

    if (sidebarSearchQuery.trim().length < SIDEBAR_SEARCH_MIN_LENGTH) {
      resultsEl.classList.remove("visible");
      return;
    }

    positionSidebarSearchResults(wrapEl);
    resultsEl.classList.add("visible");
  }

  function renderSidebarSearchResults(resultsEl, includeFounder, includePvpItems) {
    resultsEl.textContent = "";
    const progress = WF.storage.load();

    const query = sidebarSearchQuery.trim().toLowerCase();
    if (query.length < SIDEBAR_SEARCH_MIN_LENGTH) return;

    const allMatches = WF.data.filter((item) => (includeFounder || !item.founder) && (includePvpItems || !item.conclave) && item.display_name.en.toLowerCase().includes(query));
    const matches = allMatches.slice(0, SIDEBAR_SEARCH_MAX_RESULTS);

    if (matches.length === 0) {
      const empty = document.createElement("div");
      empty.className = "sidebar-search-empty";
      empty.innerHTML = `No results (<a href="${WF.PROJECT_SRC}/issues" target="_blank" rel="noopener noreferrer">item missing ?</a>)`;
      empty.querySelector("a").addEventListener("mousedown", (event) => event.preventDefault());
      resultsEl.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    matches.forEach((item) => {
      const owned = !!progress[item.item_name];

      const resultBtn = document.createElement("button");
      resultBtn.type = "button";
      resultBtn.className = "sidebar-search-result" + (owned ? " owned" : "");

      const categoryEl = document.createElement("span");
      categoryEl.className = "sidebar-search-result-category";
      categoryEl.textContent = categoryLabel(item.category);

      const nameEl = document.createElement("span");
      nameEl.className = "sidebar-search-result-name";
      nameEl.textContent = item.display_name.en;

      resultBtn.append(categoryEl, nameEl);

      resultBtn.addEventListener("mousedown", (event) => event.preventDefault());

      resultBtn.addEventListener("click", () => {
        activeCategory = item.category;
        activeType = all;
        activeFilter = {};
        searchQuery = item.display_name.en;
        sidebarSearchQuery = "";

        hideSidebarSearchResults();
        renderAll();
        closeSidebarOnMobile();
      });

      fragment.appendChild(resultBtn);
    });

    resultsEl.appendChild(fragment);

    const remaining = allMatches.length - matches.length;
    if (remaining > 0) {
      const moreEl = document.createElement("div");
      moreEl.className = "sidebar-search-more";
      moreEl.textContent = `+${remaining} more result${remaining > 1 ? "s" : ""} (refine your search)`;
      resultsEl.appendChild(moreEl);
    }
  }

  function buildSidebarSearch(container, includeFounder, includePvpItems) {
    const wrap = document.createElement("div");
    wrap.classList.add("search-wrap");
    wrap.classList.add("search-wrap-padding");

    const input = document.createElement("input");
    input.type = "text";
    input.id = "sidebar-search-input";
    input.className = "search-input";
    input.placeholder = "Search all items...";
    input.maxLength = SIDEBAR_SEARCH_MAX_LENGTH;
    input.value = sidebarSearchQuery;

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "search-clear-btn";
    clearBtn.setAttribute("aria-label", "Clear search");
    clearBtn.textContent = "\u00d7";
    clearBtn.style.display = sidebarSearchQuery ? "flex" : "none";
    clearBtn.addEventListener("mousedown", (event) => event.preventDefault());

    clearBtn.addEventListener("click", () => {
      sidebarSearchQuery = "";
      input.value = "";
      clearBtn.style.display = "none";
      input.focus();
      showSidebarSearchResults(wrap, includeFounder, includePvpItems);
    });

    input.addEventListener("focus", () => {
      showSidebarSearchResults(wrap, includeFounder, includePvpItems);
    });

    input.addEventListener("blur", () => {
      hideSidebarSearchResults();
    });

    input.addEventListener("input", (event) => {
      sidebarSearchQuery = event.target.value;
      clearBtn.style.display = sidebarSearchQuery ? "flex" : "none";

      clearTimeout(sidebarSearchDebounceTimer);
      sidebarSearchDebounceTimer = setTimeout(() => {
        showSidebarSearchResults(wrap, includeFounder, includePvpItems);
      }, SEARCH_DEBOUNCE_MS);
    });

    wrap.append(input, clearBtn);
    container.appendChild(wrap);
  }

  function getSidebarSearchMountEl() {
    if (!sidebarSearchMountEl) {
      const sidebar = document.getElementById("sidebar");
      if (!sidebar) return null;
      sidebarSearchMountEl = document.createElement("div");
      sidebarSearchMountEl.id = "sidebar-search-mount";
      sidebar.insertBefore(sidebarSearchMountEl, sidebar.firstChild);
    }
    return sidebarSearchMountEl;
  }

  function buildSidebar(types, progress, includeFounder, includePvpItems) {
    const container = document.getElementById("sidebar-groups");
    if (!container) return;
    container.textContent = "";

    const searchMount = getSidebarSearchMountEl();
    if (searchMount) {
      searchMount.textContent = "";
      buildSidebarSearch(searchMount, includeFounder, includePvpItems);
    }

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

      groupTypes.forEach((category) => {
        categorizedTypes.add(category);
        buildSidebarItem(groupEl, category, progress, includeFounder, includePvpItems);
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

        subTypes.forEach((category) => {
          categorizedTypes.add(category);
          buildSidebarItem(subEl, category, progress, includeFounder, includePvpItems);
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

      uncategorized.forEach((category) => buildSidebarItem(groupEl, category, progress, includeFounder, includePvpItems));
      fragment.appendChild(groupEl);
    }

    container.appendChild(fragment);
    scrollActiveNavItemIntoView(container);
  }

  function scrollActiveNavItemIntoView(container) {
    const activeBtn = container.querySelector(".nav-item.active");
    if (!activeBtn) return;

    const scrollParent = container.closest("#sidebar") || container;
    const parentRect = scrollParent.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const isFullyVisible = btnRect.top >= parentRect.top && btnRect.bottom <= parentRect.bottom;
    if (isFullyVisible) return;

    activeBtn.scrollIntoView({ block: "start", inline: "nearest" });
  }

  function preserveFilterScroll(rebuildFn) {
    const zone = document.getElementById("wf-filters-zone");
    const scrollByField = {};
    zone.querySelectorAll(".filter-row").forEach((row) => { scrollByField[row.dataset.field] = row.scrollLeft; });
    const zoneScrollLeft = zone.scrollLeft;

    rebuildFn();

    zone.scrollLeft = zoneScrollLeft;
    zone.querySelectorAll(".filter-row").forEach((row) => {
      if (scrollByField[row.dataset.field] !== undefined) row.scrollLeft = scrollByField[row.dataset.field];
    });
  }

  function buildFilterRow(container, Options, currentValue, onSelect, progress, fieldName, existencePool) {
    if (!Options) return;

    const options = Object.values(Options);

    if (options.length === 0) return;

    const row = document.createElement("div");
    row.className = "filter-row";
    row.dataset.field = fieldName;

    const values = [all, ...options, todo];
    values.forEach((value) => {
      const subset = value === all ? existencePool : existencePool.filter((item) => matchesFilterValue(item[fieldName], value));
      if (subset.length === 0) return;

      const percent = computePercent(subset, progress);

      const pill = document.createElement("button");
      pill.className = "filter-pill" + (value === currentValue ? " active" : "");
      pill.dataset.field = fieldName;
      pill.dataset.value = value;
      pill.textContent = `${value === all ? all : value} (${percent}%)`;
      pill.addEventListener("click", () => {
        onSelect(value);

        if (fieldName === "type") {
          preserveFilterScroll(renderAll);
          return;
        }

        row.querySelectorAll(".filter-pill").forEach((p) => p.classList.toggle("active", p.dataset.value === value));
        renderUpdate();
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
    const includePvpItems = WF.options.load().includePvpItems;

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

    const { typeBase } = getTypeBaseAndFilters(includeFounder, includePvpItems);

    const activeNav = document.querySelector(`.nav-item[data-category="${activeCategory}"]`);
    if (activeNav) {
      const typePercent = computePercent(typeBase, progress);
      activeNav.textContent = `${categoryLabel(activeCategory)} (${typePercent}%)`;
    }

    function getAncestorPoolFast(fieldName) {
      if (fieldName === "type") return typeBase;
      if (activeType === all) return typeBase;
      return typeBase.filter((item) => matchesFilterValue(item.type, activeType));
    }

    const pills = document.querySelectorAll(".filter-pill[data-field][data-value]");
    pills.forEach((pill) => {
      const fieldName = pill.dataset.field;
      const value = pill.dataset.value;
      const ancestorPool = getAncestorPoolFast(fieldName);
      const subset = value === all ? ancestorPool : ancestorPool.filter((item) => matchesFilterValue(item[fieldName], value));
      const p = computePercent(subset, progress);
      pill.textContent = `${value === all ? "All" : value} (${p}%)`;
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
      renderUpdate();
    });
    container.appendChild(btn);
  }

  function buildHelpButton(container) {
    const categoryInfo = WF.CATEGORY[activeCategory];
    const description = categoryInfo && categoryInfo.description;
    if (!description) return;

    const wrap = document.createElement("div");
    wrap.className = "category-help";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-help-btn";
    btn.setAttribute("aria-label", "About this category");
    btn.textContent = categoryInfo.label + " ?";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      wrap.classList.toggle("open");
    });

    const tooltip = document.createElement("div");
    tooltip.className = "category-help-tooltip";
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

      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        renderUpdate();
        const newInput = document.getElementById(input.id);
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(cursorPos, cursorPos);
        }
      }, SEARCH_DEBOUNCE_MS);
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
        renderUpdate();
      });
      wrap.appendChild(clearBtn);
    }

    container.appendChild(wrap);
  }

  function createInfoBadge(text, tooltip) {
    const div = document.createElement("div");
    div.className = "item-info";
    div.setAttribute("data-tooltip", tooltip);
    const textEl = document.createElement("span");
    textEl.className = "item-info-text";
    textEl.textContent = text;
    div.append(textEl);
    return div;
  }

  function buildItemList(container, items, progress) {
    const list = document.createElement("div");
    list.className = "item-list";

    const sortedItems = [...items].sort((a, b) => naturalCompare(a.display_name.en, b.display_name.en));
    const fragment = document.createDocumentFragment();

    sortedItems.forEach((item) => {
      const owned = !!progress[item.item_name];
      const row = document.createElement("label");
      row.className = "item-row" + (owned ? " owned" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "item-checkbox-hidden";
      checkbox.checked = owned;
      checkbox.dataset.itemName = item.item_name;

      const name = document.createElement("span");
      name.className = "item-name";

      const nameInner = document.createElement("span");
      nameInner.className = "item-name-inner";
      nameInner.textContent = item.display_name.en;
      name.appendChild(nameInner);

      row.append(checkbox, name);

      const normalizedItem = { ...item, masteryXp: item.mastery_xp || null };
      const activeBadges = ITEM_BADGES.filter((badge) => normalizedItem[badge.key]);

      if (activeBadges.length > 0) {
        const divInfos = document.createElement("div");
        divInfos.className = "item-infos";
        activeBadges.forEach((badge) => {
          divInfos.append(createInfoBadge(badge.text, badge.tooltip(normalizedItem)));
        });
        row.appendChild(divInfos);
      }

      fragment.appendChild(row);
    });

    list.appendChild(fragment);
    container.appendChild(list);
  }

  function initDelegatedEvents(root) {
    if (root.dataset.wfDelegated === "1") return;
    root.dataset.wfDelegated = "1";

    root.addEventListener("change", (event) => {
      const checkbox = event.target.closest(".item-checkbox-hidden");
      if (!checkbox) return;

      const itemName = checkbox.dataset.itemName;
      const isChecked = checkbox.checked;
      const row = checkbox.closest(".item-row");

      WF.storage.setOwned(itemName, isChecked);

      if (hideChecked && isChecked) {
        if (row) row.remove();
      } else if (row) {
        row.classList.toggle("owned", isChecked);
      }

      updateUIFast(lastRenderedPool);
    });

    root.addEventListener("mouseover", (event) => {
      const row = event.target.closest(".item-row");
      if (!row) return;

      const nameEl = row.querySelector(".item-name");
      if (!nameEl || nameEl.classList.contains("is-scrolling")) return;

      const overflow = nameEl.scrollWidth - nameEl.clientWidth;
      if (overflow <= 1) return;

      nameEl.style.setProperty("--scroll-distance", `-${overflow}px`);
      nameEl.classList.add("is-scrolling");
    });

    root.addEventListener("mouseout", (event) => {
      const row = event.target.closest(".item-row");
      if (!row) return;
      if (event.relatedTarget && row.contains(event.relatedTarget)) return;

      const nameEl = row.querySelector(".item-name");
      if (nameEl) nameEl.classList.remove("is-scrolling");
    });
  }

  function ensureLayout(root) {
    if (root.dataset.wfReady === "1") return;
    root.innerHTML = '<div id="wf-filters-zone"></div><div id="wf-dynamic-zone"></div>';
    root.dataset.wfReady = "1";
    bindFilterWheelScroll();
  }

  function bindFilterWheelScroll() {
    const zone = document.getElementById("wf-filters-zone");
    zone.addEventListener("wheel", (e) => {
      const row = e.target.closest(".filter-row");
      if (!row || row.scrollWidth <= row.clientWidth) return; 
      if (e.shiftKey) return;

      row.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }

  function getFilteredPool(typeBase, filters, excludeField) {
    let pool = typeBase;

    if (excludeField !== "type" && activeType !== all) {
      pool = pool.filter((item) => matchesFilterValue(item.type, activeType));
    }

    filters.forEach((filter) => {
      if (filter.field === excludeField) return;
      const value = activeFilter[filter.field];
      if (value && value !== all) pool = pool.filter((item) => matchesFilterValue(item[filter.field], value));
    });

    return pool;
  }

  function renderStatic(progress, typeBase, filters) {
    const zone = document.getElementById("wf-filters-zone");
    zone.textContent = "";

    function getAncestorPool(fieldName) {
      if (fieldName === "type") return typeBase;
      if (activeType === all) return typeBase;
      return typeBase.filter((item) => matchesFilterValue(item.type, activeType));
    }

    buildFilterRow(zone, Object.values(WF.TYPES[activeCategory] || {}), activeType, (value) => { activeType = value; activeFilter = {}; }, progress, "type", getAncestorPool("type"));

    filters.forEach((filter) => {
      const options = filter.optionsBySubtype ? filter.optionsBySubtype[activeType] || null : filter.options;
      if (!options) return;

      if (filter.showIf) {
        const dependValue = activeFilter[filter.showIf.field] || all;
        const matches = dependValue === filter.showIf.value || dependValue === all;
        if (!matches) {
          activeFilter[filter.field] = all;
          return;
        }
      }

      const currentValue = activeFilter[filter.field] || all;
      buildFilterRow(zone, options, currentValue, (value) => { activeFilter[filter.field] = value; }, progress, filter.field, getAncestorPool(filter.field));
    });
  }

  function renderDynamic(progress, typeBase, filters) {
    const zone = document.getElementById("wf-dynamic-zone");
    zone.textContent = "";

    const items = getFilteredPool(typeBase, filters, null);
    const visibleItems = hideChecked ? items.filter((item) => !progress[item.item_name]) : items;

    const query = searchQuery.trim().toLowerCase();
    const searchedItems = query ? visibleItems.filter((item) => item.display_name.en.toLowerCase().includes(query)) : visibleItems;

    buildProgressBar(zone, searchedItems, progress);

    const actionsRow = document.createElement("div");
    actionsRow.className = "bulk-actions-row";
    buildBulkActions(actionsRow, searchedItems, progress);
    buildHideCheckedToggle(actionsRow);
    buildSearchCluster(actionsRow);
    zone.appendChild(actionsRow);

    buildItemList(zone, searchedItems, progress);

    lastRenderedPool = searchedItems;
  }

  function renderUpdate() {
    const includeFounder = WF.options.load().includeFounderItems;
    const includePvpItems = WF.options.load().includePvpItems;
    const progress = WF.storage.load();
    const { typeBase, filters } = getTypeBaseAndFilters(includeFounder, includePvpItems);
    renderDynamic(progress, typeBase, filters);
    WF.uiState.save({ activeCategory, activeType, activeFilter });
  }

  function renderAll() {
    const root = document.getElementById("app");
    initDelegatedEvents(root);

    const includeFounder = WF.options.load().includeFounderItems;
    const includePvpItems = WF.options.load().includePvpItems;
    const types = availableCategories(includeFounder, includePvpItems);

    if (types.length === 0) {
      root.innerHTML = '<p class="empty-state">No data loaded.</p>';
      root.dataset.wfReady = "";
      return;
    }

    ensureLayout(root);

    const progress = WF.storage.load();

    if (activeCategory === null || !types.includes(activeCategory)) activeCategory = WF.DEFAUT_ACTIVE_TAB;

    const { typeBase, filters } = getTypeBaseAndFilters(includeFounder, includePvpItems);

    const validTypes = new Set([all, ...Object.values(WF.TYPES[activeCategory] || {}), todo]);
    if (!validTypes.has(activeType)) {
      activeType = all;
      activeFilter = {};
    }

    const sanitizedFilter = {};
    filters.forEach((filter) => {
      const value = activeFilter[filter.field];
      if (!value || value === all) return;

      const options = filter.optionsBySubtype ? filter.optionsBySubtype[activeType] || null : filter.options;
      const validValues = options && new Set([all, ...Object.values(options), todo]);

      if (validValues && validValues.has(value)) sanitizedFilter[filter.field] = value;
    });
    activeFilter = sanitizedFilter;

    buildSidebar(types, progress, includeFounder, includePvpItems);
    renderStatic(progress, typeBase, filters);
    renderDynamic(progress, typeBase, filters);

    WF.uiState.save({ activeCategory, activeType, activeFilter });
  }

  function getCategoryStats(category) {
    const progress = WF.storage.load();
    const includeFounder = WF.options.load().includeFounderItems;
    const includePvpItems = WF.options.load().includePvpItems;
    const items = WF.data.filter((item) => matchesCategory(item, category) && (includeFounder || !item.founder) && (includePvpItems || !item.conclave));
    let owned = 0;
    for (let i = 0; i < items.length; i++) {
      if (progress[items[i].item_name]) owned++;
    }
    return { owned, total: items.length, percent: computePercent(items, progress) };
  }
  
  function renderFlagList(container, matching) {
    container.textContent = "";
    const progress = WF.storage.load();

    const byCategory = new Map();
    matching.forEach((item) => {
      if (!byCategory.has(item.category)) byCategory.set(item.category, []);
      byCategory.get(item.category).push(item);
    });

    const categories = [...byCategory.keys()].sort((a, b) => naturalCompare(categoryLabel(a), categoryLabel(b)));

    const fragment = document.createDocumentFragment();
    categories.forEach((category) => {
      const items = byCategory.get(category).sort((a, b) => naturalCompare(a.display_name.en, b.display_name.en));
      
      const header = document.createElement("div");
      header.className = "nav-group-label";
      header.textContent = `${categoryLabel(category)} (${items.length})`;;
      fragment.appendChild(header);

      const list = document.createElement("div");
      list.className = "item-list";

      items.forEach((item) => {
        const owned = !!progress[item.item_name];
        const row = document.createElement("div");
        row.className = "item-row" + (owned ? " owned" : "");

        const name = document.createElement("span");
        name.className = "item-name";
        const nameInner = document.createElement("span");
        nameInner.className = "item-name-inner";
        nameInner.textContent = item.display_name.en;
        name.appendChild(nameInner);

        row.appendChild(name);
        list.appendChild(row);
      });

      fragment.appendChild(list);
    });

    container.appendChild(fragment);
  }

  return { renderAll, getCategoryStats, renderFlagList };
})();