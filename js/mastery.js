function itemMasteryXp(item) {
  return +item.mastery_xp || 0;
}

const MASTERY_BREAKDOWN_GROUPS = [
  [
    { label: "Warframes",               match: (item) => item.category === WF.CATEGORY.warframe.name },
    { label: "Primary Weapons",         match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.primary   && item.weapon_category === WF.TYPES.weapon_category.normal },
    { label: "Secondary Weapons",       match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.secondary && item.weapon_category === WF.TYPES.weapon_category.normal },
    { label: "Melee Weapons",           match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.melee },
    { label: "Kitguns",                 match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.secondary && item.weapon_category === WF.TYPES.weapon_category.kitgun },
  ],
  [
    { label: "Missions",                match: (item) => item.category === WF.CATEGORY.node.name && item.node_difficulty === WF.TYPES.node_difficulty.normal },
    { label: "The Steel Path Missions", match: (item) => item.category === WF.CATEGORY.node.name && item.node_difficulty === WF.TYPES.node_difficulty.steel },
    { label: "Railjack Intrinsics",     match: (item) => item.category === WF.CATEGORY.intrinsic.name && item.type === WF.TYPES.intrinsic.railjack },
    { label: "Drifter Intrinsics",      match: (item) => item.category === WF.CATEGORY.intrinsic.name && item.type === WF.TYPES.intrinsic.drifter },
  ],
  [
    { label: "Sentinels",               match: (item) => item.category === WF.CATEGORY.companion.name && item.type === WF.TYPES.companion.robotic && item.companion_category === WF.TYPES.companion_category.sentinel },
    { label: "Sentinel Weapons",        match: (item) => item.category === WF.CATEGORY.companion.name && item.type === WF.TYPES.companion.robotic && item.companion_category.includes(WF.CATEGORY.weapon.name) },
    { label: "Companions",              match: (item) => (item.category === WF.CATEGORY.companion.name && item.type !== WF.TYPES.companion.robotic) || (
                                                          item.category === WF.CATEGORY.companion.name && 
                                                          ((item.type === WF.TYPES.companion.robotic && item.companion_category === WF.TYPES.companion_category.moa) || 
                                                           (item.type === WF.TYPES.companion.robotic && item.companion_category === WF.TYPES.companion_category.hound))) ||
                                                           (item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.plexus) },
  ],
  [
    { label: "Archwing",                match: (item) => item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.archwing },
    { label: "Archgun",                 match: (item) => item.category === WF.CATEGORY.archweapon.name && item.type === WF.TYPES.archweapon.archgun },
    { label: "Archmelee",               match: (item) => item.category === WF.CATEGORY.archweapon.name && item.type === WF.TYPES.archweapon.archmelee },
    { label: "Amps",                    match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.primary && item.weapon_category === WF.TYPES.weapon_category.amp },
    { label: "K-Drives",                match: (item) => item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.kdrive },
    { label: "Necramechs",              match: (item) => item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.necramech },
  ],
];

WF.mastery = (function () {
  function xpRequiredForRank(rank) {
    if (rank <= 30) return WF.MASTERY.XP_PER_RANK * rank * rank;
    return WF.MASTERY.LEGENDARY_BASE_XP + ((rank - 30) * WF.MASTERY.LEGENDARY_XP_PER_RANK);
  }

  function computeTotalXp(progress) {
    const includeFounder = WF.options.load().includeFounderItems;
    let total = 0;

    for (let i = 0; i < WF.data.length; i++) {
      const item = WF.data[i];
      if (item.founder && !includeFounder) continue;
      if (progress[item.item_name]) total += itemMasteryXp(item);
    }

    return total;
  }

  function rankForXp(totalXp) {
    let rank = 0;
    while (xpRequiredForRank(rank + 1) <= totalXp) rank++;
    return rank;
  }

  function rankLabel(rank) {
    return rank <= 30 ? `MR ${rank}` : `LR ${rank - 30}`;
  }

  function getInfo(progress) {
    const totalXp = computeTotalXp(progress);
    const rank = rankForXp(totalXp);
    const currentRankXp = xpRequiredForRank(rank);
    const nextRankXp = xpRequiredForRank(rank + 1);
    const xpInCurrentRank = totalXp - currentRankXp;
    const xpToNextRank = nextRankXp - currentRankXp;
    const percent = xpToNextRank > 0 ? Math.min(100, Math.floor((xpInCurrentRank / xpToNextRank) * 100)) : 0;

    return { totalXp, label: rankLabel(rank), xpInCurrentRank, xpToNextRank, percent };
  }

  function render() {
    const masteryXpBar = document.getElementById("mastery-progress-fill");
    if (!masteryXpBar) return;

    const info = getInfo(WF.storage.load());

    masteryXpBar.style.width = `${info.percent}%`;

    const labelEl = document.getElementById("mastery-rank-label");
    const progressTextEl = document.getElementById("mastery-progress-text");
    const totalTextEl = document.getElementById("mastery-total-text");

    if (labelEl) labelEl.textContent = info.label;
    if (progressTextEl) {
      progressTextEl.textContent = `Next rank in ${(info.xpToNextRank - info.xpInCurrentRank).toLocaleString()} (${info.xpInCurrentRank.toLocaleString()} / ${info.xpToNextRank.toLocaleString()})`;
    }
    if (totalTextEl) totalTextEl.textContent = `Total : ${info.totalXp.toLocaleString()}`;
  }

  function getBreakdown(progress) {
    const includeFounder = WF.options.load().includeFounderItems;

    const ownedItems = WF.data.filter((item) => {
      if (item.founder && !includeFounder) return false;
      return !!progress[item.item_name];
    });

    return MASTERY_BREAKDOWN_GROUPS.map((group) =>
      group.map((row) => {
        let xp = 0;
        for (let i = 0; i < ownedItems.length; i++) {
          const item = ownedItems[i];
          if (row.match(item)) xp += itemMasteryXp(item);
        }
        return { label: row.label, xp };
      })
    );
  }

  return { xpRequiredForRank, computeTotalXp, rankForXp, rankLabel, getInfo, render, itemMasteryXp, getBreakdown };
})();
