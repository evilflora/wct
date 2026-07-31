const WF = window.WF || {};
window.WF = WF;

WF.SCHEMA_VERSION = 1;

WF.DEFAUT_ACTIVE_TAB = "warframe";

WF.ITEM_TYPES = {
  TODO:             { name: "todo",         label: "TODO / Unsorted"  , description: "Unknown items are put here" },
  adversary:        { name: "adversary",    label: "Max Fusioned"     , description: "Weapons with a 60% Valence Bonus" },
  airsupport:       { name: "airsupport",   label: "Air Support"      , description: "Equipement / Orbiter /Landing Craft Customize screen" },
  arcane:           { name: "arcane",       label: "Arcanes"          , description: "Codex / Universe" },
  archweapon:       { name: "archweapon",   label: "Arch Weapons"     , description: "Profile / Equipement" },
  armament:         { name: "armament",     label: "Armaments (WIP)"  , description: "???" },
  artgallery:       { name: "artgallery",   label: "Art Gallery"      , description: "Codex / Universe" },
  challenge:        { name: "challenge",    label: "Challenges"       , description: "Profile / Challenges" },
  companion:        { name: "companion",    label: "Companions"       , description: "Profile / Equipement" },
  enemy:            { name: "enemy",        label: "Factions"         , description: "Codex / Universe" },
  fish:             { name: "fish",         label: "Fish (WIP)"       , description: "???" },
  focusschool:      { name: "focusschool",  label: "Focus School"     , description: "At your Operator/Drifter" },
  fragment:         { name: "fragment",     label: "Fragments"        , description: "Codex / Universe" },
  framefighter:     { name: "framefighter", label: "Frame Fighters"   , description: "Use the Ludoplex" },
  gear:             { name: "gear",         label: "Gears (WIP)"      , description: "Arsenal / Third tab" },
  incarnon:         { name: "incarnon",     label: "Incarnons"        , description: "Zariman / Cavalero" },
  intrinsic:        { name: "intrinsic",    label: "Intrinsics"       , description: "Railjack in Dojo. Drifter at Zariman / Dormizone." },
  glyph:            { name: "glyph",        label: "Glyphs (WIP)"     , description: "Click on your profile icon in the main menu" },
  helminth:         { name: "helminth",     label: "Helminth"         , description: "Big red mouth in the Orbiter or at the Backroom" },
  honoria:          { name: "honoria",      label: "Honoria"          , description: "Profile, bottom right" },
  mod:              { name: "mod",          label: "Mods"             , description: "Codex / Universe" },
  necramech:        { name: "necramech",    label: "Necramechs"       , description: "Profile / Equipement" },
  node:             { name: "node",         label: "Star Chart"       , description: "Profile / Stats" },
  peelypix:         { name: "peelypix",     label: "Peely Pix"        , description: "Höllvania Central Mall / Kaya Velasco" },
  quest:            { name: "quest",        label: "Quests"           , description: "Codex / Quets" },
  relic:            { name: "relic",        label: "Relics"           , description: "Codex / Universe" },
  resource:         { name: "resource",     label: "Resources (WIP)"  , description: "???" },
  scene:            { name: "scene",        label: "Scenes"           , description: "Arsenal / Warframe Appearance / Camera button" },
  sigil:            { name: "sigil",        label: "Sigils (WIP)"     , description: "Arsenal / Warframe Appearance" },
  simulacrum:       { name: "simulacrum",   label: "Simulacrum"       , description: "Relay / Cephalon Simaris Room" },
  skin:             { name: "skin",         label: "Skins (WIP)"      , description: "???" },
  somachord:        { name: "somachord",    label: "Somachord"        , description: "Codex / Universe" },
  sumdali:          { name: "sumdali",      label: "Sumdali"          , description: "Equipement / Orbiter /Landing Craft Customize screen" },
  vehicle:          { name: "vehicle",      label: "Vehicles"         , description: "Profile / Equipement" },
  warframe:         { name: "warframe",     label: "Warframes"        , description: "Profile / Equipement" },
  weapon:           { name: "weapon",       label: "Weapons"          , description: "Profile / Equipement" },
};

WF.SUB_TYPES = {
  adversary:          { kuva: "kuva", tenet: "tenet", coda: "coda" },
  arcane:             { warframe: "warframe", primary: "primary", secondary: "secondary", melee: "melee", kitgun: "kitgun", zaw: "zaw", operator: "operator", amp: "amp", tektolyst: "tektolyst" },
  archweapon:         { archgun: "archgun", archmelee: "archmelee" },
  companion:          { robotic: "robotics", beast: "beast", deimos: "deimos" },
  companion_category: { sentinel: "sentinel", moa: "moa", hound: "hound", kubrow: "kubrow", kavat: "kavat", predasite: "predasite", vulpaphyla: "vulpaphyla", sentinel_weapon: "sentinel weapon", moa_weapon: "moa weapon", hound_weapon: "hound weapon" },
  fish:               { poe: "Plain Of Eidolon", ov: "Orb Vallis", cd: "Cambion Drift" },
  fish_size:          { other: "Other", small: "Small", medium: "Medium", large: "Large" },
  focusschool:        { zenurik: "zenurik", unairu: "unairu", vazarin: "vazarin", naramon: "naramon", madurai: "madurai" },
  fragment:           { cephalon: "cephalon", cetus: "cetus", gara: "gara", ghouls: "ghouls", solaris: "solaris", partnership: "partnership", prex: "prex", tenet: "tenet", duviri: "duviri", albrecht: "albrecht", isleweaver: "isleweaver" },
  fragment_category:  { other: "other", warframe: "warframe", palladino: "rell palladino", heirloom: "heirloom", deimos: "deimos" },
  gear:               { gear: "Gear", specter: "Specter", bait: "Fish Bait", key: "Key" },
  incarnon:           { four: "Four", five: "Five" },
  intrinsic:          { railjack: "railjack", drifter: "drifter" },
  intrinsic_category: { command: "command", engineering: "engineering", gunnery: "gunnery", piloting: "piloting", tactical: "tactical", combat: "combat", endurance: "endurance", opportunity: "opportunity", riding: "riding" },
  helminth:           { warframe: "Warframe", metamorphosis: "Metamorphosis" },
  honoria:            { suffix: "Suffix", prefix: "Prefix" },
  mod:                { pve: "pve", pvp: "pvp" },
  mod_category:       { warframe: "Warframe", aura: "Aura", augment: "Augment", primary: "Primary", secondary: "Pistol", melee: "Melee", stance: "Stance", exilus: "Exilus", vehicle: "Vehicles", archgun: "ArchGun", archmelee: "ArchMelee", robotic: "Robotic", beast: "Beast", railjack: "Railjack", antique: "Antique", parazon: "Parazon", tome: "Tome", atagraph: "Atagraph" },
  node:               { solar: "solar system", empyrean: "empyrean", tau: "tau" },
  node_difficulty:    { normal: "normal", steel: "steel path" },
  node_solar:         { mercury: "mercury", venus: "venus", earth: "earth", mars: "mars", phobos: "phobos", ceres: "ceres", jupiter: "jupiter", europa: "europa", saturn: "saturn", uranus: "uranus", neptune: "neptune", pluto: "pluto", sedna: "sedna", eris: "eris", void: "void", lua: "lua", deimos: "deimos", hollvania: "höllvania", duviri: "duviri", zariman: "zariman", kuva: "kuva fortress", dark: "dark refractory" },
  node_empyrean:      { earth: "earth", venus: "venus", saturn: "saturn", uranus: "uranus", neptune: "neptune", pluto: "pluto", veil: "veil proxima" },
  peelypix:           { normal: "normal", chromatic: "chromatic" },
  quest:              { main: "main quest", side: "side quest", warframe: "warframe quest" },
  armament:           { base: "base", mk4: "mk iv" },
  relic:              { lith: "lith", meso: "meso", neo: "neo", axi: "axi", requiem: "requiem" },
  relic_rank:         { intact: "intact", radiant: "radiant", other: "other" },
  relic_vanguard:     { vanguard: "vanguard" },
  skin:               { skin: "Skin", ship: "Ship Decoration", misc: "Misc", palette: "Color Palette", note: "Note Packs", emotes: "Emotes", fur_color: "Fur Color", fur_pattern: "Fur Pattern", theme_background: "Theme Background", Themes: "Themes", arcade: "Arcade Minigame Unlock", theme_sound: "Theme Sound", syandana: "Syandana", skins: "Skins", fish: "Fish", glyph: "Glyph", resource: "Resource", emblem: "emblem", poster: "poster", floof: "floof", ephemera: "ephemera", drone: "drone", signa : "signa"},
  somachord:          { baro: "Baro Ki'Teer", aoi: "Aoi", fragment: "Fragment", hunhow: "Hunhow", aspirant: "Aspirant Zorba", varzia: "Varzia", shop: "Shop", awakening: "Awakening Quest", teshin: "Teshin", koumei: "Koumei's Shrine" },
  vehicle:            { archwing: "archwing", necramech: "necramech", plexus: "plexus", kdrive: "k-drive" },
  weapon:             { primary: "primary", secondary: "secondary", melee: "melee" },
  weapon_category:    { normal: "normal", amp: "amp", kitgun: "kitgun", zaw: "zaw" },
  
  // shared SUB_TYPES
  rarity:             { common: "common", uncommon: "uncommon", rare: "rare", legendary: "legendary" },
  rank:               { normal: "non prime", prime: "prime" },
};

WF.EXTRA_FILTERS = {
  weapon: [
    {
      field: "weapon_category",
      optionsBySubtype: {
        [WF.SUB_TYPES.weapon.primary]: [WF.SUB_TYPES.weapon_category.normal, WF.SUB_TYPES.weapon_category.amp],
        [WF.SUB_TYPES.weapon.secondary]: [WF.SUB_TYPES.weapon_category.normal, WF.SUB_TYPES.weapon_category.kitgun],
        [WF.SUB_TYPES.weapon.melee]: [WF.SUB_TYPES.weapon_category.normal, WF.SUB_TYPES.weapon_category.zaw],
      },
    },
    { field: "rank", options: WF.SUB_TYPES.rank },
  ],
  warframe: [
    { field: "rank", options: WF.SUB_TYPES.rank },
  ],
  fish: [
    { field: "fish_size", options: WF.SUB_TYPES.fish_size},
  ],
  intrinsic: [
    {
      field: "intrinsic_category",
      optionsBySubtype: {
        all: WF.SUB_TYPES.intrinsic_category,
        [WF.SUB_TYPES.intrinsic.railjack]: [WF.SUB_TYPES.intrinsic_category.command, WF.SUB_TYPES.intrinsic_category.engineering, WF.SUB_TYPES.intrinsic_category.gunnery, WF.SUB_TYPES.intrinsic_category.piloting, WF.SUB_TYPES.intrinsic_category.tactical],
        [WF.SUB_TYPES.intrinsic.drifter]: [WF.SUB_TYPES.intrinsic_category.combat, WF.SUB_TYPES.intrinsic_category.endurance, WF.SUB_TYPES.intrinsic_category.opportunity, WF.SUB_TYPES.intrinsic_category.riding],
      },
    },
  ],
  fragment: [
    {
      field: "fragment_category",
      optionsBySubtype: {
        [WF.SUB_TYPES.fragment.prex]: WF.SUB_TYPES.fragment_category,
      },
    },
  ],
  skin: [
    { field: "skin_category", options: WF.SUB_TYPES.skin_category},
  ],
  node: [
    { field: "node_difficulty", options: WF.SUB_TYPES.node_difficulty },
    {
      field: "node_solar",
      optionsBySubtype: {
        [WF.SUB_TYPES.node.solar]: WF.SUB_TYPES.node_solar,
        [WF.SUB_TYPES.node.empyrean]: WF.SUB_TYPES.node_empyrean,
        // "all": [...WF.SUB_TYPES.node_solar, ...WF.SUB_TYPES.node_empyrean], // hummmmmmm nope, too messy
      },
    },
  ],
  relic: [
    { field: "relic_rank", options: WF.SUB_TYPES.relic_rank },
  ],
  arcane: [
    { field: "rarity", options: WF.SUB_TYPES.rarity },
  ],
  mod: [
    { field: "mod_category", options: WF.SUB_TYPES.mod_category },
    { field: "rarity", options: WF.SUB_TYPES.rarity },
  ],
  companion: [
    {
      field: "companion_category",
      optionsBySubtype: {
        all: WF.SUB_TYPES.companion_category,
        [WF.SUB_TYPES.companion.robotic]: [WF.SUB_TYPES.companion_category.sentinel, WF.SUB_TYPES.companion_category.sentinel_weapon, WF.SUB_TYPES.companion_category.moa,  WF.SUB_TYPES.companion_category.moa_weapon, WF.SUB_TYPES.companion_category.hound, WF.SUB_TYPES.companion_category.hound_weapon],
        [WF.SUB_TYPES.companion.beast]: [WF.SUB_TYPES.companion_category.kubrow, WF.SUB_TYPES.companion_category.kavat],
        [WF.SUB_TYPES.companion.deimos]: [WF.SUB_TYPES.companion_category.predasite, WF.SUB_TYPES.companion_category.vulpaphyla],
      },   
    },
    { field: "rank", options: WF.SUB_TYPES.rank },
  ],
};

WF.NAV_GROUPS = [
  {
    label: "Profile",
    types: [WF.ITEM_TYPES.archweapon, WF.ITEM_TYPES.challenge, WF.ITEM_TYPES.companion, WF.ITEM_TYPES.honoria, WF.ITEM_TYPES.intrinsic, WF.ITEM_TYPES.node, WF.ITEM_TYPES.vehicle, WF.ITEM_TYPES.warframe, WF.ITEM_TYPES.weapon],
  },
  {
    label: "Codex",
    types: [WF.ITEM_TYPES.arcane, WF.ITEM_TYPES.artgallery, WF.ITEM_TYPES.fragment, WF.ITEM_TYPES.mod, WF.ITEM_TYPES.quest, WF.ITEM_TYPES.relic],
  },
  {
    label: "Upgrade",
    types: [WF.ITEM_TYPES.focusschool],
  },
  {
    label: "Collectible",
    types: [WF.ITEM_TYPES.airsupport, WF.ITEM_TYPES.armament, WF.ITEM_TYPES.scene, WF.ITEM_TYPES.fish, WF.ITEM_TYPES.framefighter, WF.ITEM_TYPES.gear, WF.ITEM_TYPES.helminth, WF.ITEM_TYPES.incarnon, WF.ITEM_TYPES.adversary, WF.ITEM_TYPES.peelypix, WF.ITEM_TYPES.resource, WF.ITEM_TYPES.simulacrum, WF.ITEM_TYPES.somachord, WF.ITEM_TYPES.sumdali],
  },
  {
    label: "Cosmetic (WIP)",
    types: [WF.ITEM_TYPES.glyph, WF.ITEM_TYPES.sigil, WF.ITEM_TYPES.skin],
  },
];

WF.MASTERY = {
  XP_PER_RANK: 2500,
  LEGENDARY_BASE_XP: 2250000,
  LEGENDARY_XP_PER_RANK: 147500,
};

WF.PROJECT_SRC = "https://github.com/evilflora/wct";
WF.PROJECT_URL = "https://evilflora.github.io/wct/";
 
WF.CHANGELOG = [
  { date: "2026/07/31 00:00:00", version: "43.0.8", text: `Fixed some UI glitches on mobile and added a site icon. </br>Fixed the wrong percentage shown in filters. </br>Search now changes the item count and percentage of the progress bar.</br> Tooltip is better than ever, but still does not work properly on mobile. ` },
  { date: "2026/07/28 00:00:00", version: "43.0.8", text: `Some refactoring, changes and optimizations. </br>It should work better on mobile, the UI should be better, too. ` },
  { date: "2026/07/27 00:00:00", version: "43.0.8", text: `Moved "import" / "export" to "options". </br>Updated project links to redirect to source code and live versions on GitHub. </br>Added a one-time toast notification if an update is found (if it works). </br>Added a label in "options" if an update is available. </br>The menu is now fixed at the top of the screen. </br>Fixed some scaling issues on mobile (I hope). </br>Fixed some typos from "Condex" to "Codex". </br>Updated project links. </br>Fixed once more "missions" and "the steel path mission" mastery_xp calculation.` },
  { date: "2026/07/26 00:00:00", version: "43.0.8", text: `<!> Selected "honoria", "helminth" and "air support" have been reset due to their uniqueName being changed</br> Fixed broken "armament" filter/generation` },
  { date: "2026/07/25 00:00:00", version: "43.0.8", text: `Added "The Maker" Quest. </br> Added themes color in "Options" </br> Added small icons "V" for "Vaulted" and "XP" for how much mastery this will give. </br> Added "Mastery Breakdown" in "Stats" like ingame in your profile.` },
  { date: "2026/07/13 00:00:00", version: "43.0.8", text: `The start of making this public and widely usable.` },
];
