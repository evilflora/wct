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

WF.SUBTYPES = {
  adversary:          ["kuva", "tenet", "coda"],
  arcane:             ["warframe", "primary", "secondary", "melee", "kitgun", "zaw", "operator", "amp", "tektolyst_artifact"],
  archweapon:         ["archgun", "archmelee"],
  companion:          ["robotics", "beast", "deimos"],
  companion_category: ["sentinel", "moa", "hound", "kubrow", "kavat", "predasite", "vulpaphyla", "sentinel weapon", "moa weapon", "hound weapon"],
  fish:               ["Plain Of Eidolon", "Orb Vallis", "Cambion Drift"],
  fish_size:          ["Other", "Small", "Medium", "Large"],
  focusschool:        ["zenurik", "unairu", "vazarin", "naramon", "madurai"],
  fragment:           ["cephalon", "cetus", "gara", "ghouls", "solaris", "partnership", "prex", "tenet", "duviri", "albrecht", "isleweaver"],
  fragment_category:  ["other", "warframe", "rell palladino", "heirloom", "deimos"],
  gear:               ["Gear", "Specter", "Fish Bait", "Key"],
  incarnon:           ["Four", "Five"],
  intrinsic:          ["railjack", "drifter"],
  intrinsic_category: ["command", "engineering", "gunnery", "piloting", "tactical", "combat", "endurance", "opportunity", "riding"],
  helminth:           ["Warframe", "Metamorphosis"],
  honoria:            ["Suffix", "Prefix"],
  mod:                ["pve", "pvp"],
  mod_category:       ["Warframe", "Aura", "Augment", "Primary", "Pistol", "Melee", "Stance", "Exilus", "Vehicles", "ArchGun", "ArchMelee", "Robotic", "Beast", "Railjack", "Antique", "Parazon", "Tome", "Atagraph"],
  node:               ["solar system", "empyrean", "tau"],
  node_difficulty:    ["normal", "steel path"],
  node_solar:         ["mercury", "venus", "earth", "mars", "phobos", "ceres", "jupiter", "europa", "saturn", "uranus", "neptune", "pluto", "sedna", "eris", "void", "lua", "deimos", "höllvania", "duviri", "zariman", "kuva fortress", "dark refractory"],
  node_empyrean:      ["earth", "venus", "saturn", "uranus", "neptune", "pluto", "veil proxima"],
  peelypix:           ["normal", "chromatic"],
  quest:              ["main quest", "side quest", "warframe quest"],
  armament:           ["base", "mk iv"],
  relic:              ["lith", "meso", "neo", "axi", "requiem"],
  relic_rank:         ["intact", "radiant", "other"],
  relic_vanguard:     ["vanguard"],
  skin:               ["Skin", "Ship Decoration", "Misc", "Color Palette", "Note Packs", "Emotes", "Fur Color", "Fur Pattern", "Theme Background", "Themes", "Arcade Minigame Unlock", "Theme Sound", "Syandana", "Skins", "Fish", "Glyph", "Resource"],
  somachord:          ["Baro Ki'Teer", "Aoi", "Fragment", "Hunhow", "Aspirant Zorba", "Varzia", "Shop", "Awakening Quest", "Teshin", "Koumei's Shrine"],
  vehicle:            ["archwing", "necramech", "plexus", "k-drive"],
  weapon:             ["primary", "secondary", "melee"],
  weapon_category:    ["normal", "amp", "kitgun", "zaw"],
  
  // shared subtypes
  rarity:             ["common", "uncommon", "rare", "legendary"],
  rank:               ["non prime", "prime"],
};

WF.EXTRA_FILTERS = {
  weapon: [
    {
      field: "weapon_category",
      optionsBySubtype: {
        primary:   [WF.SUBTYPES.weapon_category[0], WF.SUBTYPES.weapon_category[1]],
        secondary: [WF.SUBTYPES.weapon_category[0], WF.SUBTYPES.weapon_category[2]],
        melee:     [WF.SUBTYPES.weapon_category[0], WF.SUBTYPES.weapon_category[3]],
      },
    },
    { field: "weapon_rank", options: WF.SUBTYPES.rank },
  ],
  warframe: [
    { field: "warframe_category", options: WF.SUBTYPES.rank },
  ],
  fish: [
    { field: "fish_size", options: WF.SUBTYPES.fish_size},
  ],
  intrinsic: [
    {
      field: "intrinsic_category",
      optionsBySubtype: {
        all:      WF.SUBTYPES.intrinsic_category,
        railjack: [WF.SUBTYPES.intrinsic_category[0], WF.SUBTYPES.intrinsic_category[1], WF.SUBTYPES.intrinsic_category[2], WF.SUBTYPES.intrinsic_category[3], WF.SUBTYPES.intrinsic_category[4]],
        drifter:  [WF.SUBTYPES.intrinsic_category[5], WF.SUBTYPES.intrinsic_category[6], WF.SUBTYPES.intrinsic_category[7], WF.SUBTYPES.intrinsic_category[8]],
      },
    },
  ],
  fragment: [
    {
      field: "fragment_category",
      optionsBySubtype: {
        prex:   WF.SUBTYPES.fragment_category,
      },
    },
  ],
  skin: [
    { field: "skin_category", options: WF.SUBTYPES.skin_category},
  ],
  node: [
    { field: "node_difficulty",   options: WF.SUBTYPES.node_difficulty },
    {
      field: "node_solar",
      optionsBySubtype: {
        "solar system": WF.SUBTYPES.node_solar,
        "empyrean": WF.SUBTYPES.node_empyrean,
        // "all": [...WF.SUBTYPES.node_solar, ...WF.SUBTYPES.node_empyrean], // hummmmmmm nope, too messy
      },
    },
  ],
  relic: [
    { field: "relic_rank",       options: WF.SUBTYPES.relic_rank },
  ],
  arcane: [
    { field: "rarity", options: WF.SUBTYPES.rarity },
  ],
  mod: [
    { field: "mod_category", options: WF.SUBTYPES.mod_category },
    { field: "rarity", options: WF.SUBTYPES.rarity },
  ],
  companion: [
    {
      field: "companion_category",
      optionsBySubtype: {
        robotics: [WF.SUBTYPES.companion_category[0], WF.SUBTYPES.companion_category[7], WF.SUBTYPES.companion_category[1],  WF.SUBTYPES.companion_category[8], WF.SUBTYPES.companion_category[2], WF.SUBTYPES.companion_category[9]],
        beast: [WF.SUBTYPES.companion_category[3], WF.SUBTYPES.companion_category[4]],
        deimos: [WF.SUBTYPES.companion_category[5], WF.SUBTYPES.companion_category[6]],
      },
    },
    { field: "companion_rank",   options: WF.SUBTYPES.rank, showIf: { field: "companion_category", value: WF.SUBTYPES.companion_category[0] } },
  ],
};

WF.NAV_GROUPS = [
  {
    label: "Profile",
    types: ["archweapon", "challenge", "companion", "honoria", "intrinsic", "node", "vehicle", "warframe", "weapon"],
  },
  {
    label: "Codex",
    types: ["arcane", "artgallery", "fragment", "mod", "quest", "relic"],
  },
  {
    label: "Upgrade",
    types: ["focusschool"],
  },
  {
    label: "Collectible",
    types: ["airsupport", "armament", "scene", "fish", "framefighter", "gear", "helminth", "incarnon", "adversary", "peelypix", "resource", "simulacrum", "somachord", "sumdali"],
  },
  {
    label: "Cosmetic (WIP)",
    types: ["glyph", "sigil", "skin"],
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
  { date: "2026/07/27 00:00:00", version: "43.0.8", text: `Moved "import" / "export" to "options". </br>Updated project links to redirect to source code and live versions on GitHub. </br>Added a one-time toast notification if an update is found (if it works). </br>Added a label in "options" if an update is available. </br>The menu is now fixed at the top of the screen. </br>Fixed some scaling issues on mobile (I hope). </br>Fixed some typos from "Condex" to "Codex". </br>Updated project links. </br>Fixed once more "missions" and "the steel path mission" mastery_xp calculation.` },
  { date: "2026/07/26 00:00:00", version: "43.0.8", text: `<!> Selected "honoria", "helminth" and "air support" have been reset due to their uniqueName being changed</br> Fixed broken "armament" filter/generation` },
  { date: "2026/07/25 00:00:00", version: "43.0.8", text: `Added "The Maker" Quest. </br> Added themes color in "Options" </br> Added small icons "V" for "Vaulted" and "XP" for how much mastery this will give. </br> Added "Mastery Breakdown" in "Stats" like ingame in your profile.` },
  { date: "2026/07/13 00:00:00", version: "43.0.8", text: `The start of making this public and widely usable.` },
];