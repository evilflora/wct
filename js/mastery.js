/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

const MASTERY_BREAKDOWN_GROUPS = [
	[
		{ label: "Warframes",								category: "total", match: (item) => item.category === WF.CATEGORY.warframe.name },
		{ label: "Primary Weapons",					category: "total", match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.primary	 && item.weapon_category === WF.TYPES.weapon_category.normal },
		{ label: "Secondary Weapons",				category: "total", match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.secondary && item.weapon_category === WF.TYPES.weapon_category.normal },
		{ label: "Melee Weapons",						category: "total", match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.melee },
		{ label: "Kitguns",									category: "total", match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.secondary && item.weapon_category === WF.TYPES.weapon_category.kitgun },
	],
	[
		{ label: "Missions",								category: "mission", match: (item) => item.category === WF.CATEGORY.node.name && item.node_difficulty === WF.TYPES.node_difficulty.normal },
		{ label: "The Steel Path Missions",	category: "mission", match: (item) => item.category === WF.CATEGORY.node.name && item.node_difficulty === WF.TYPES.node_difficulty.steel },
		{ label: "Railjack Intrinsics",			category: "intrinsic", match: (item) => item.category === WF.CATEGORY.intrinsic.name && item.type === WF.TYPES.intrinsic.railjack },
		{ label: "Drifter Intrinsics",			category: "intrinsic", match: (item) => item.category === WF.CATEGORY.intrinsic.name && item.type === WF.TYPES.intrinsic.drifter },
	],
	[
		{ label: "Sentinels",								category: "total", match: (item) => item.category === WF.CATEGORY.companion.name && item.type === WF.TYPES.companion.robotic && item.companion_category === WF.TYPES.companion_category.sentinel },
		{ label: "Sentinel Weapons",				category: "total", match: (item) => item.category === WF.CATEGORY.companion.name && item.type === WF.TYPES.companion.robotic && item.companion_category.includes(WF.CATEGORY.weapon.name) },
		{ label: "Companions",							category: "total", match: (item) => (item.category === WF.CATEGORY.companion.name && item.type !== WF.TYPES.companion.robotic) || (
																													item.category === WF.CATEGORY.companion.name && 
																													((item.type === WF.TYPES.companion.robotic && item.companion_category === WF.TYPES.companion_category.moa) || 
																													 (item.type === WF.TYPES.companion.robotic && item.companion_category === WF.TYPES.companion_category.hound))) ||
																													 (item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.plexus) },
	],
	[
		{ label: "Archwing",								category: "total", match: (item) => item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.archwing },
		{ label: "Archgun",									category: "total", match: (item) => item.category === WF.CATEGORY.archweapon.name && item.type === WF.TYPES.archweapon.archgun },
		{ label: "Archmelee",								category: "total", match: (item) => item.category === WF.CATEGORY.archweapon.name && item.type === WF.TYPES.archweapon.archmelee },
		{ label: "Amps",										category: "total", match: (item) => item.category === WF.CATEGORY.weapon.name && item.type === WF.TYPES.weapon.primary && item.weapon_category === WF.TYPES.weapon_category.amp },
		{ label: "K-Drives",								category: "total", match: (item) => item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.kdrive },
		{ label: "Necramechs",							category: "total", match: (item) => item.category === WF.CATEGORY.vehicle.name && item.type === WF.TYPES.vehicle.necramech },
	],
];

WF.mastery = (function () {
	const NUMBER_FORMAT = new Intl.NumberFormat();

	function formatNumber(value) {
		return NUMBER_FORMAT.format(Number(value) || 0);
	}

	function itemMasteryXp(item) {
		return Number(item.mastery_xp) || 0;
	}
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
			progressTextEl.textContent = `Next rank in ${formatNumber(info.xpToNextRank - info.xpInCurrentRank)} (${formatNumber(info.xpInCurrentRank)} / ${formatNumber(info.xpToNextRank)})`;
		}
		if (totalTextEl) totalTextEl.textContent = `Total : ${formatNumber(info.totalXp)}`;
	}


	function getEligibleItems() {
		const options = WF.options.load();

		return WF.data.filter((item) => {
			if (item.founder && !options.includeFounderItems) return false;
			if (item.conclave && !options.includePvpItems) return false;
			return itemMasteryXp(item) > 0;
		});
	}

	function getBreakdown(progress) {
		const eligibleItems = getEligibleItems();

		return MASTERY_BREAKDOWN_GROUPS.map((group) =>
			group.map((row) => {
				let xp = 0;
				let owned = 0;
				let total = 0;

				for (const item of eligibleItems) {
					if (!row.match(item)) continue;

					total++;
					if (progress[item.item_name]) {
						owned++;
						xp += itemMasteryXp(item);
					}
				}

				return { label: row.label, xp, owned, total };
			})
		);
	}

	function getBreakdownFor(progress, category) {
		const rows = MASTERY_BREAKDOWN_GROUPS.flat();
		let xp = 0;
		let owned = 0;
		let total = 0;

		for (const item of getEligibleItems()) {
			if (!rows.some((row) => row.match(item) && row.category === category)) continue;

			total++;
			if (progress[item.item_name]) {
				owned++;
				xp += itemMasteryXp(item);
			}
		}
		return { xp, owned, total };
	}

	function getGroupRowItems(groupIndex, rowIndex) {
		const includeFounder = WF.options.load().includeFounderItems;
		const row = MASTERY_BREAKDOWN_GROUPS[groupIndex] && MASTERY_BREAKDOWN_GROUPS[groupIndex][rowIndex];
		if (!row) return [];
		return WF.data.filter((item) => (includeFounder || !item.founder) && row.match(item));
	}

	return { xpRequiredForRank, computeTotalXp, rankForXp, rankLabel, getInfo, render, itemMasteryXp, getBreakdown, getBreakdownFor, getGroupRowItems };
})();
