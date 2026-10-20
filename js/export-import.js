/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

WF.exportImport = (function () {
  const MAX_PROGRESS_ENTRIES = 50000;
  const PROFILE_API_URL = "https://api.warframe.com/cdn/getProfileViewingData.php?playerId=";
  const ACCOUNT_ID_PATTERN = /^[0-9a-f]{24}$/; // Must mirror the input "pattern" attribute
  const MAX_PROFILE_FILE_BYTES = 2 * 1024 * 1024; // Reject unreasonably large files
  const MAX_SKILL_LEVEL = 10;
  const CHALLENGE_PREFIX = "/Lotus/Types/Challenges/";

  const HONORIA_MAP = Object.freeze({
    FromOnHigh: "FromOnHighTitle",
    SharpShooter: "SharpShooterTitle",
    ForgedInFire: "ForgedInFireTitle",
    Kaboom: "KaboomTitle",
    KillPhorid: "KillPhoridTitle",
    TheCameraAdds100Pounds: "TheCameraAdds100Title",
    SolveCipherUnder5Seconds: "SolveCipherUnder5Title",
    Rank4C: "MedalRank5Title", // Rank0C does not exist because Honoria is earned through purchase
    Rank8C: "MedalRank9Title", // Rank1C to Rank19C, easy to compare, Rank2C = 150, Wiki for Insign III say "Kill 150 enemies"
    Rank12C: "MedalRank13Title",
    Rank16C: "MedalRank17Title",
    Rank19C: "MedalRank20Title",
    Kill100InMission: "Kills100Title",
    NoWitnesses: "StealthKills100Title",
    Mercenary2: "Mercenary5InvasionsTitle", // i'm not 100% sure
  });

  const RANK_RULES = Object.freeze([
    { categories: ["weapon", "archweapon"], masteryXp: 3000, minXp: 450000 },
    { categories: ["warframe", "vehicle", "companion"], masteryXp: 6000, minXp: 900000 },
  ]);

  const PLAYER_SKILL_MAP = Object.freeze({
    LPS_GUNNERY: "Intrinsic/Railjack/Gunnery",
    LPS_ENGINEERING: "Intrinsic/Railjack/Engineering",
    LPS_TACTICAL: "Intrinsic/Railjack/Tactical",
    LPS_PILOTING: "Intrinsic/Railjack/Piloting",
    LPS_COMMAND: "Intrinsic/Railjack/Command",
    LPS_DRIFT_RIDING: "Intrinsic/Drifter/Riding",
    LPS_DRIFT_OPPORTUNITY: "Intrinsic/Drifter/Opportunity",
    LPS_DRIFT_ENDURANCE: "Intrinsic/Drifter/Endurance",
    LPS_DRIFT_COMBAT: "Intrinsic/Drifter/Combat",
  });

  let pendingMerge = null;

  function exportToFile() {
    const options = WF.options.load();

    const payload = {
      schema_version: WF.WCT_VERSION,
      exported_at: new Date().toISOString(),
      progress: WF.storage.loadForSync(),
    };

    if (options.includeOptionsInExport) {
      const exportedOptions = { ...options };
      if (!options.includeSyncKeyInExport) delete exportedOptions.syncKey;
      payload.options = exportedOptions;
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: `wf-checklist-${new Date().toISOString().slice(0, 10)}.json`
    });

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function isValidPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
    const progress = payload.progress;
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) return false;
    const keys = Object.keys(progress);
    if (keys.length > MAX_PROGRESS_ENTRIES) return false;
    return keys.every((key) => typeof progress[key] === "boolean");
  }

  async function importFromFile(file) {
    const text = await file.text();
    const payload = JSON.parse(text);

    if (!isValidPayload(payload)) {
      const errorLabel = "Invalid payload format";
      WF.logs.AddLog(errorLabel);
      throw new Error(errorLabel);
    }

    if (payload.schema_version > WF.WCT_VERSION) {
      const confirmed = window.confirm(
        `Imported file schema version (${payload.schema_version}) is higher than local (${WF.WCT_VERSION}); you may lose data if you export this edited save.\n\nDo you still want to force import this file?`
      );
      if (!confirmed) {
        const errorLabel = `Import canceled by the user, imported file schema version is higher than local.`;
        WF.toast.show(errorLabel, { type: "error", timeoutMs: 5000 });
        WF.logs.AddLog(errorLabel);
        throw new Error(errorLabel);
      }
    }

    let progressToSave = payload.progress;
    if (typeof WF.storage.runMigrations === "function") {
      progressToSave = WF.storage.runMigrations(progressToSave, WF.WCT_VERSION, payload.schema_version);
    }

    localStorage.setItem("wf_checklist_current_version", String(WF.WCT_VERSION));
    WF.storage.save(progressToSave);

    if (payload.options && typeof payload.options === "object") {
      WF.options.save({ ...WF.options.load(), ...payload.options });
      WF.logs.AddLog("Options replaced during import process.");
    }
  }

  function resolveSkillItems(playerSkills) {
    if (!playerSkills || typeof playerSkills !== "object") return [];

    const wantedNames = new Set();
    for (const [skillKey, pathPrefix] of Object.entries(PLAYER_SKILL_MAP)) {
      const level = Math.min(Number(playerSkills[skillKey]), MAX_SKILL_LEVEL);
      if (!Number.isInteger(level) || level < 1) continue;
      for (let i = 1; i <= level; i++) wantedNames.add(`${pathPrefix}${i}`);
    }
    if (wantedNames.size === 0) return [];

    return WF.data.filter((item) => {
      const name = item?.item_name;
      const index = name.indexOf("Intrinsic/");
      return index >= 0 && wantedNames.has(name.slice(index));
    });
  }

  function resolveChallengeItems(challengeProgress) {
    if (!Array.isArray(challengeProgress)) return [];

    const progressByName = new Map();
    for (const entry of challengeProgress) {
      if (typeof entry?.Name !== "string" || !Number.isFinite(Number(entry.Progress))) continue;
      progressByName.set(entry.Name, Number(entry.Progress));
    }
    if (progressByName.size === 0) return [];

    return WF.data.filter((item) => {
      const name = item?.item_name;
      if (!name.startsWith(CHALLENGE_PREFIX)) return false;

      const progress = progressByName.get(name.slice(CHALLENGE_PREFIX.length));
      const unlockAt = Number(item.unlockAt); // Stored as a string in WF.data
      return progress !== undefined && Number.isFinite(unlockAt) && progress >= unlockAt;
    });
  }

  function resolveWeaponItems(weapons) {
    if (!Array.isArray(weapons)) return [];

    const xpByType = new Map();
    for (const entry of weapons) {
      const xp = Number(entry?.xp);
      if (typeof entry?.type !== "string" || !Number.isFinite(xp)) continue;
      xpByType.set(entry.type, Math.max(xp, xpByType.get(entry.type) ?? 0));
    }
    if (xpByType.size === 0) return [];

    return WF.data.filter((item) => {
      const xp = xpByType.get(item?.item_name);
      if (xp === undefined) return false;

      const masteryXp = Number(item.mastery_xp);
      const rule = RANK_RULES.find((r) => r.categories.includes(item.category) && r.masteryXp === masteryXp);
      return !!rule && xp >= rule.minXp;
    });
  }

  function resolveCodexScans(scans) {
    if (!Array.isArray(scans)) return [];
    
    const progressByName = new Map();
    for (const entry of scans) {
      if (typeof entry?.type !== "string" || !Number.isFinite(Number(entry.scans))) continue;
      progressByName.set(entry.type, Number(entry.scans));
    }
    if (progressByName.size === 0) return [];

    return WF.data.filter((item) => {
      const name = item?.item_name;
      const progress = progressByName.get(name);
      const unlockAt = Number(item.unlockAt); // Stored as a string in WF.data
      return progress !== undefined && Number.isFinite(unlockAt) && progress >= unlockAt;
    });
  }

  function resolveMissionItems(missions) {
    if (!Array.isArray(missions)) return [];

    const wantedNames = new Set();
    for (const entry of missions) {
      if (typeof entry?.Tag !== "string" || !(Number(entry.Completes) >= 1)) continue;
      wantedNames.add(entry.Tag);
      if (Number(entry.Tier) === 1) wantedNames.add(`${entry.Tag}SP`);
    }
    if (wantedNames.size === 0) return [];

    return WF.data.filter((item) => typeof item?.item_name === "string" && wantedNames.has(item.item_name));
  }

  function getLastSegment(itemName) {
    return itemName.slice(itemName.lastIndexOf("/") + 1);
  }

  function resolveHonoriaItems(honoriaProgress) {
    if (!Array.isArray(honoriaProgress)) return [];

    const progressByName = new Map();
    for (const entry of honoriaProgress) {
      if (typeof entry?.Name !== "string" || !Number.isFinite(Number(entry.Progress))) continue;
      progressByName.set(entry.Name, Number(entry.Progress));
    }
    if (progressByName.size === 0) return [];

    const mappedHonoriaBySegment = new Map(
      Object.entries(HONORIA_MAP)
        .filter(([honoriaName]) => progressByName.has(honoriaName))
        .map(([honoriaName, segment]) => [segment, honoriaName])
    );

    return WF.data.filter((item) => {
      if (item?.category !== "honoria" || typeof item.item_name !== "string") return false;

      const segment = getLastSegment(item.item_name);
      const honoriaName = [segment, `${segment}Challenge`].find((name) => progressByName.has(name)) ?? mappedHonoriaBySegment.get(segment);
      if (honoriaName === undefined) return false;

      const unlockAt = Number(item.unlockAt); // Stored as a string in WF.data
      return Number.isFinite(unlockAt) && progressByName.get(honoriaName) >= unlockAt;
    });
  }

  function applyPendingMerge() {
    if (!pendingMerge || pendingMerge.items.length === 0) return 0;

    const names = pendingMerge.items.map((item) => item.item_name);
    WF.storage.setOwnedBulk(names, true);
    WF.logs.AddLog(`Public profile merge applied: ${names.length} item(s) set as owned.`);
    pendingMerge = null;
    return names.length;
  }

  async function readPublicProfileFile(file) {
    if (!(file instanceof File)) throw new Error("No file provided");
    if (file.size === 0 || file.size > MAX_PROFILE_FILE_BYTES) throw new Error("Invalid file size");

    let data;
    try {
      data = JSON.parse(await file.text());
    } catch (error) {
      throw new Error("File is not valid JSON");
    }

    const profile = Array.isArray(data?.Results) ? data.Results[0] : null;
    if (!profile || typeof profile !== "object") throw new Error("Missing Results[0] in profile file");

    const progress = WF.storage.load();
    const items = [
      ...resolveSkillItems(profile.PlayerSkills),
      ...resolveChallengeItems(profile.ChallengeProgress),
      ...resolveWeaponItems(data?.Stats?.Weapons),
      ...resolveMissionItems(profile.Missions),
      ...resolveHonoriaItems(profile.ChallengeProgress),
      ...resolveCodexScans(data?.Stats?.Scans),
    ].filter((item, index, all) => !progress[item.item_name] && all.indexOf(item) === index); // Skip owned and duplicates
    pendingMerge = { items };
    window.dispatchEvent(new CustomEvent("wf:profile-merge-ready", { detail: { items } }));
    return profile;
  }

  function isValidAccountId(value) {
    return typeof value === "string" && ACCOUNT_ID_PATTERN.test(value);
  }

  function initApiImport() {
    const idInput = document.getElementById("accountid");
    const openButton = document.getElementById("btn-import-api-open");
    const fileInput = document.getElementById("profile-file");
    const readButton = document.getElementById("btn-import-api-read");
    if (!idInput || !openButton || !fileInput || !readButton) return;

    let isReading = false;

    idInput.addEventListener("keydown", (event) => { if (event.key === "Enter") event.preventDefault(); });

    openButton.addEventListener("click", () => {
      if (!isValidAccountId(idInput.value.trim())) {
        const errorLabel = `ACCOUNTID is empty or wrong or invalid.`;
        WF.logs.AddLog(errorLabel);
        WF.toast.show(errorLabel, { type: "error", timeoutMs: 3000 });
        return;
      }
      const accountId = idInput.value.trim();
      if (!isValidAccountId(accountId)) return;
      window.open(PROFILE_API_URL + encodeURIComponent(accountId), "_blank", "noopener,noreferrer");
    });

    readButton.addEventListener("click", async () => {
      if (isReading || !(fileInput.files && fileInput.files.length === 1)) {
        const errorLabel = `No file selected`;
        WF.logs.AddLog(errorLabel);
        WF.toast.show(errorLabel, { type: "error", timeoutMs: 3000 });
        return;
      }
      if (isReading) return; // Guard against repeated clicks while parsing
      isReading = true;
      try {
        await readPublicProfileFile(fileInput.files[0]);
        WF.logs.AddLog("Public profile file read successfully.");
      } catch (error) {
        const errorLabel = `Public profile import failed: ${error.message}`;
        WF.logs.AddLog(errorLabel);
        WF.toast.show(errorLabel, { type: "error", timeoutMs: 3000 });
      } finally {
        isReading = false;
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initApiImport);
  else initApiImport();

  return { exportToFile, importFromFile, isValidPayload, readPublicProfileFile, applyPendingMerge };
})();