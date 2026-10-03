/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.storage = (function () {
  const STORAGE_KEY = "wf_checklist_progress";
  const ARCHIVE_KEY = "wf_checklist_archived_progress";
  const VERSION_KEY = "wf_checklist_current_version";

  let _cache = null;

  function readArchive() {
    try {
      const raw = localStorage.getItem(ARCHIVE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn("Unreadable archived progress, ignored.", err);
      return {};
    }
  }

  const MIGRATIONS = [
    { version: 20261003000000, renames: [
      ["/Lotus/Types/Items/Fish/Deimos/InfestedCommonDFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedCommonD" ],
      ["/Lotus/Types/Items/Fish/Deimos/HybridRareAFishItem"          , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyHybridRareA" ],
      ["/Lotus/Types/Items/Fish/Deimos/InfestedCommonBFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedCommonB" ],
      ["/Lotus/Types/Items/Fish/Eidolon/GrineerBootItem"             , "/Lotus/Types/Items/ShipDecos/BothRareBootTrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusBootItem"              , "/Lotus/Types/Items/ShipDecos/Venus/CrewmanBootTrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusWarmCommonFishBItem"   , "/Lotus/Types/Items/ShipDecos/Venus/CorpusWarmCommonFishBTrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/OrokinBothRareFishAItem"     , "/Lotus/Types/Items/ShipDecos/Venus/OrokinBothRareFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/BothCommonFishAItem"         , "/Lotus/Types/Items/ShipDecos/BothCommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/OrokinUncommonAFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyOrokinUncommonA" ],
      ["/Lotus/Types/Items/Fish/Deimos/InfestedCommonAFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedCommonA" ],
      ["/Lotus/Types/Items/Fish/Eidolon/NightRareFishBItem"          , "/Lotus/Types/Items/ShipDecos/NightRareFishBTrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/OrokinRareAFishItem"          , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyOrokinRareA" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusWarmCommonFishAItem"   , "/Lotus/Types/Items/ShipDecos/Venus/CorpusWarmCommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusCoolUncommonFishAItem" , "/Lotus/Types/Items/ShipDecos/Venus/CorpusCoolUncommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/InfestedRareAFishItem"        , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedRareA" ],
      ["/Lotus/Types/Items/Fish/Eidolon/NightLegendaryFishAItem"     , "/Lotus/Types/Items/ShipDecos/NightLegendaryFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/InfestedUncommonAFishItem"    , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedUncommonA" ],
      ["/Lotus/Types/Items/Fish/Eidolon/BothCommonFishBItem"         , "/Lotus/Types/Items/ShipDecos/BothCommonFishBTrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/BothUncommonFishBItem"       , "/Lotus/Types/Items/ShipDecos/BothUncommonFishBTrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/DayCommonFishBItem"          , "/Lotus/Types/Items/ShipDecos/DayCommonFishBTrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusWarmUncommonFishAItem" , "/Lotus/Types/Items/ShipDecos/Venus/CorpusWarmUncommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/InfestedCommonCFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedCommonC" ],
      ["/Lotus/Types/Items/Fish/Deimos/InfestedCommonEFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyInfestedCommonE" ],
      ["/Lotus/Types/Items/Fish/Solaris/SolarisWarmRareFishAItem"    , "/Lotus/Types/Items/ShipDecos/Venus/SolarisWarmRareFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/DayCommonFishAItem"          , "/Lotus/Types/Items/ShipDecos/DayCommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusBothUncommonFishAItem" , "/Lotus/Types/Items/ShipDecos/Venus/CorpusBothUncommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/DayUncommonFishBItem"        , "/Lotus/Types/Items/ShipDecos/DayUncommonFishBTrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/BothRareFishAItem"           , "/Lotus/Types/Items/ShipDecos/BothRareFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/OrokinLegendaryAFishItem"     , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyOrokinLegendaryA" ],
      ["/Lotus/Types/Items/Fish/Eidolon/NightRareFishAItem"          , "/Lotus/Types/Items/ShipDecos/NightRareFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/HybridUncommonAFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyHybridUncommonA" ],
      ["/Lotus/Types/Items/Fish/Solaris/SolarisCoolUncommonFishAItem", "/Lotus/Types/Items/ShipDecos/Venus/SolarisCoolUncommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/CorpusCoolCommonFishAItem"   , "/Lotus/Types/Items/ShipDecos/Venus/CorpusCoolCommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/SolarisBothCommonFishAItem"  , "/Lotus/Types/Items/ShipDecos/Venus/SolarisBothCommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/BothUncommonFishAItem"       , "/Lotus/Types/Items/ShipDecos/BothUncommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/OrokinBothLegendaryFishAItem", "/Lotus/Types/Items/ShipDecos/Venus/OrokinBothLegendaryFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/SolarisCoolCommonFishAItem"  , "/Lotus/Types/Items/ShipDecos/Venus/SolarisCoolCommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Eidolon/DayUncommonFishAItem"        , "/Lotus/Types/Items/ShipDecos/DayUncommonFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Solaris/OrokinCoolRareFishAItem"     , "/Lotus/Types/Items/ShipDecos/Venus/OrokinCoolRareFishATrophy" ],
      ["/Lotus/Types/Items/Fish/Deimos/HybridUncommonBFishItem"      , "/Lotus/Types/Items/ShipDecos/Deimos/FishTrophyHybridUncommonB" ],
      ["/Lotus/Types/Items/Fish/Eidolon/DayCommonFishCItem"          , "/Lotus/Types/Items/ShipDecos/DayCommonFishCTrophy" ]] 
    },
  ];

  function parseVersion(value) {
    const num = Number(value);
    return value !== null && value !== "" && Number.isSafeInteger(num) && num >= 0 ? num : null;
  }

  function renameKeys(map, renames) {
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    let changed = false;

    renames.forEach(([oldKey, newKey]) => {
      if (typeof oldKey !== "string" || typeof newKey !== "string" || oldKey === newKey) return;
      if (oldKey === "__proto__" || newKey === "__proto__") return;
      if (!hasOwn(map, oldKey)) return;

      if (!hasOwn(map, newKey)) map[newKey] = map[oldKey];
      delete map[oldKey];
      changed = true;
    });

    return changed;
  }

  function runMigrations(progressMap, targetVersion) {
    const target = parseVersion(targetVersion);
    if (target === null) return progressMap;

    const current = parseVersion(localStorage.getItem(VERSION_KEY)) ?? 0;
    if (current >= target) return progressMap;

    const pending = MIGRATIONS
      .filter((m) => m.version > current && m.version <= target)
      .sort((a, b) => a.version - b.version);
    if (pending.length === 0) return progressMap;

    try {
      const archive = readArchive();
      let progressChanged = false;
      let archiveChanged = false;

      pending.forEach(({ renames }) => {
        progressChanged = renameKeys(progressMap, renames) || progressChanged;
        archiveChanged = renameKeys(archive, renames) || archiveChanged;
      });

      if (progressChanged) localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      if (archiveChanged) localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
      console.info(`Applied ${pending.length} storage migration(s) up to ${target}.`);
    } catch (err) {
      console.error("Storage migration failed to persist.", err);
    }

    return progressMap;
  }

  function pruneOrphanKeys(progressMap) {
    if (!WF.data || typeof WF.WCT_VERSION === "undefined") return progressMap;

    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion === String(WF.WCT_VERSION)) return progressMap;

    const validKeys = new Set(WF.data.map((item) => item.item_name));
    const orphanKeys = Object.keys(progressMap).filter((key) => !validKeys.has(key));

    if (orphanKeys.length > 0) {
      const archive = readArchive();
      orphanKeys.forEach((key) => { archive[key] = progressMap[key]; delete progressMap[key]; });
      try {
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      } catch (err) {
        console.error("Failed to archive orphan keys.", err);
        return progressMap;
      }
      console.info(`Archived ${orphanKeys.length} orphan key(s).`, orphanKeys);
    }

    localStorage.setItem(VERSION_KEY, String(WF.WCT_VERSION));

    return progressMap;
  }

  function load() {
    if (_cache) return _cache;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        _cache = {};
        return _cache;
      }

      const parsed = JSON.parse(raw);
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new TypeError("Progress is not a plain object.");

      const migrated = runMigrations(parsed, typeof WF.WCT_VERSION !== "undefined" ? WF.WCT_VERSION : null);
      _cache = pruneOrphanKeys(migrated);
    } catch (err) {
      console.error("Unreadable or corrupted localStorage progress, reset.", err);
      _cache = {};
    }
    return _cache;
  }

  function loadForSync() {
    return { ...readArchive(), ...load() };
  }

  function save(progressMap) {
    _cache = progressMap;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      window.dispatchEvent(new CustomEvent("wf:progress-changed"));
    } catch (err) {
      console.error("Failed to save progress to localStorage.", err);
      if (WF.toast) WF.toast.show("Save failed: browser storage is full or unavailable.", { type: "error", timeoutMs: 0, key: "wf-storage-full" });
      throw err; 
    }
  }

  function setOwned(itemName, owned) {
    const progress = load();
    if (!!progress[itemName] === !!owned) return;
    progress[itemName] = !!owned;
    save(progress);
  }

  function setOwnedBulk(itemNames, owned) {
    const progress = load();
    let hasChanged = false;

    itemNames.forEach((itemName) => {
      if (!!progress[itemName] !== !!owned) {
        progress[itemName] = !!owned;
        hasChanged = true;
      }
    });

    if (hasChanged) save(progress);
  }

  function clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ARCHIVE_KEY);
      _cache = null;
      window.dispatchEvent(new CustomEvent("wf:progress-changed"));
    } catch (err) {
      console.error("Failed to clear progress from localStorage.", err);
    }
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    _cache = null;
    if (WF.render) WF.render.renderAll();
    if (WF.mastery) WF.mastery.render();
  });

  return { load, loadForSync, save, setOwned, setOwnedBulk, clearAll, STORAGE_KEY, ARCHIVE_KEY };
})();