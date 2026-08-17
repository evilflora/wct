const WF = window.WF || {};
window.WF = WF;

WF.SCHEMA_VERSION = 1;

// todo
// displays, market ?, noogles ?, posters ?, shawzin ?, syndicates and vendors ?, Baro Ki'Teer, Miscellaneous ? (and perhaps some earlier items on this list, because there are too few of them) 

WF.CATEGORY = {
  TODO:             { name: "todo",           label: "TODO / Unsorted" , description: "Unknown items are put here" },
  adversary:        { name: "adversary",      label: "Max Fusioned"    , description: "Weapons with a 60% Valence Bonus" },
  airsupport:       { name: "airsupport",     label: "Air Support"     , description: "Equipement / Orbiter / Landing Craft Customize screen" },
  arcade:           { name: "arcade",         label: "Arcades"         , description: "Use the Ludoplex" },
  arcane:           { name: "arcane",         label: "Arcanes"         , description: "Codex / Universe" },
  archweapon:       { name: "archweapon",     label: "Arch Weapons"    , description: "Profile / Equipement" },
  armament:         { name: "armament",       label: "Armaments (WIP)" , description: "???" },
  artgallery:       { name: "artgallery",     label: "Art Gallery"     , description: "Codex / Universe" },
  articula:         { name: "articula",       label: "Articulas"       , description: "Equipement / Orbiter / Decorate" },
  challenge:        { name: "challenge",      label: "Challenges"      , description: "Profile / Challenges" },
  companion:        { name: "companion",      label: "Companions"      , description: "Profile / Equipement" },
  domestik:         { name: "domestik",       label: "Domestik Drone"  , description: "Equipement / Orbiter / Decorate" },
  emblem:           { name: "emblem",         label: "Emblems (WIP)"   , description: "Arsenal / Warframe Appearance / ???" },
  enemy:            { name: "enemy",          label: "Factions (WIP)"  , description: "Codex / Universe" },
  ephemera:         { name: "ephemera",       label: "Ephemera"        , description: "Arsenal / Warframe Appearance / Arrachments" },
  floof:            { name: "floof",          label: "Floofs"          , description: "Equipement / Orbiter / Decorate" },
  focusschool:      { name: "focusschool",    label: "Focus School"    , description: "At your Operator/Drifter" },
  focusrepresent:   { name: "focusrepresent", label: "Focus Represent" , description: "At your Operator/Drifter" },
  fragment:         { name: "fragment",       label: "Fragments"       , description: "Codex / Universe" },
  framefighter:     { name: "framefighter",   label: "Frame Fighters"  , description: "Use the Ludoplex" },
  gear:             { name: "gear",           label: "Gears (WIP)"     , description: "Arsenal / Third tab" },
  incarnon:         { name: "incarnon",       label: "Incarnons"       , description: "Zariman / Cavalero" },
  intrinsic:        { name: "intrinsic",      label: "Intrinsics"      , description: "Railjack in Dojo or Configure Plexus in Orbiter. Drifter at Zariman / Dormizone." },
  glyph:            { name: "glyph",          label: "Glyphs (WIP)"    , description: "Click on your profile icon in the main menu" },
  helminth:         { name: "helminth",       label: "Helminth"        , description: "Big red mouth in the Orbiter or at the Backroom" },
  honoria:          { name: "honoria",        label: "Honoria"         , description: "Profile, bottom right" },
  mod:              { name: "mod",            label: "Mods"            , description: "Codex / Universe" },
  necramech:        { name: "necramech",      label: "Necramechs"      , description: "Profile / Equipement" },
  node:             { name: "node",           label: "Star Chart"      , description: "Profile / Stats" },
  object:           { name: "object",         label: "Objects (WIP)"   , description: "Codex / Universe" },
  peelypix:         { name: "peelypix",       label: "Peely Pix"       , description: "Höllvania Central Mall / Kaya Velasco" },
  poster:           { name: "poster",         label: "Posters (WIP)"   , description: "Equipement / Orbiter / Decorate" },
  quest:            { name: "quest",          label: "Quests"          , description: "Codex / Quets" },
  relic:            { name: "relic",          label: "Relics"          , description: "Codex / Universe" },
  scene:            { name: "scene",          label: "Scenes"          , description: "Arsenal / Warframe Appearance / Camera button" },
  sigil:            { name: "sigil",          label: "Sigils (WIP)"    , description: "Arsenal / Warframe Appearance / Sigils" },
  signa:            { name: "signa",          label: "Signa"           , description: "Arsenal / Warframe Appearance / Signa" },
  simulacrum:       { name: "simulacrum",     label: "Simulacrum"      , description: "Relay / Cephalon Simaris Room" },
  skin:             { name: "skin",           label: "Skins (WIP)"     , description: "???" },
  somachord:        { name: "somachord",      label: "Somachord"       , description: "Codex / Universe" },
  sumdali:          { name: "sumdali",        label: "Sumdali"         , description: "Equipement / Orbiter / Landing Craft Customize screen" },
  syandana:         { name: "syandana",       label: "Syandana (WIP)"  , description: "Arsenal / Warframe Appearance / ???" },
  vehicle:          { name: "vehicle",        label: "Vehicles"        , description: "Profile / Equipement" },
  trophy:           { name: "trophy" ,        label: "Trophies"        , description: "Equipement / Orbiter / Decorate" },
  warframe:         { name: "warframe",       label: "Warframes"       , description: "Profile / Equipement" },
  weapon:           { name: "weapon",         label: "Weapons"         , description: "Profile / Equipement" },
};

WF.DEFAUT_ACTIVE_TAB = WF.CATEGORY.warframe.name;

WF.TYPES = {
  adversary:          { kuva: "kuva", tenet: "tenet", coda: "coda" },
  arcane:             { warframe: "warframe", primary: "primary", secondary: "secondary", melee: "melee", kitgun: "kitgun", zaw: "zaw", operator: "operator", amp: "amp", tektolyst: "tektolyst" },
  archweapon:         { archgun: "archgun", archmelee: "archmelee" },
  armament:           { base: "base", mk4: "mk iv" },
  companion:          { robotic: "robotics", beast: "beast", deimos: "deimos" },
  companion_category: { sentinel: "sentinel", moa: "moa", hound: "hound", kubrow: "kubrow", kavat: "kavat", predasite: "predasite", vulpaphyla: "vulpaphyla", sentinel_weapon: "sentinel weapon", moa_weapon: "moa weapon", hound_weapon: "hound weapon" },
  domestik:           { dogday: "Dog Days", baro: "Baro Ki'Teer", hunhow: "Hunhow", nightwave: "Nightwave"},
  enemy:              { grineer: "Grineer", corpus: "Corpus", infestation: "Infestation", unaffiliated: "Unaffiliated", orokin: "Orokin", sentient: "Sentient", stalker: "Stalker", narmer: "Narmer", murmur: "Murmur", scaldra: "Scaldra", techrot: "Techrot", anarchs: "Anarchs" },
  ephemera:           { vengeful: "Vengeful", sister: "Sisters", coda: "Coda", aspirus: "Aspirus", atramentum: "Atramentum", body: "Body", conquera: "Conquera", constellation: "Constellations", baro: "Baro Ki'Teer", oneoff: "One-Offs", easter: "Easter", halloween: "Halloween", summer: "Summer", valentine: "Valentines", winter: "Winter", shard: "Shard", step: "Step", zariman: "Zariman"},
  focusrepresent:     { poster: "Poster", glyph: "Vosphene Glyph" },
  focusschool:        { zenurik: "zenurik", unairu: "unairu", vazarin: "vazarin", naramon: "naramon", madurai: "madurai" },
  fragment:           { cephalon: "cephalon", cetus: "cetus", gara: "gara", ghouls: "ghouls", solaris: "solaris", partnership: "partnership", prex: "prex", tenet: "tenet", duviri: "duviri", albrecht: "albrecht", isleweaver: "isleweaver" },
  fragment_category:  { other: "other", warframe: "warframe", palladino: "palladino", heirloom: "heirloom", deimos: "deimos" },
  gear:               { gear: "Gear", specter: "Specter", bait: "Fish Bait", key: "Key" },
  incarnon:           { four: "Four", five: "Five" },
  intrinsic:          { railjack: "railjack", drifter: "drifter" },
  intrinsic_category: { command: "command", engineering: "engineering", gunnery: "gunnery", piloting: "piloting", tactical: "tactical", combat: "combat", endurance: "endurance", opportunity: "opportunity", riding: "riding" },
  helminth:           { warframe: "Warframe", metamorphosis: "Metamorphosis" },
  honoria:            { suffix: "Suffix", prefix: "Prefix", both: "Both" },
  mod:                { pve: "pve", pvp: "pvp" },
  mod_category:       { warframe: "Warframe", aura: "Aura", augment: "Augment", primary: "Primary", secondary: "Pistol", melee: "Melee", stance: "Stance", exilus: "Exilus", vehicle: "Vehicles", archgun: "ArchGun", archmelee: "ArchMelee", robotic: "Robotic", beast: "Beast", railjack: "Railjack", antique: "Antique", parazon: "Parazon", tome: "Tome", atagraph: "Atagraph" },
  node:               { solar: "solar system", empyrean: "empyrean", tau: "tau" },
  node_difficulty:    { normal: "normal", steel: "steel path" },
  node_solar:         { mercury: "mercury", venus: "venus", earth: "earth", mars: "mars", phobos: "phobos", ceres: "ceres", jupiter: "jupiter", europa: "europa", saturn: "saturn", uranus: "uranus", neptune: "neptune", pluto: "pluto", sedna: "sedna", eris: "eris", void: "void", lua: "lua", deimos: "deimos", hollvania: "höllvania", duviri: "duviri", zariman: "zariman", kuva: "kuva fortress", dark: "dark refractory" },
  node_empyrean:      { earth: "earth", venus: "venus", saturn: "saturn", uranus: "uranus", neptune: "neptune", pluto: "pluto", veil: "veil proxima" },
  object:             { resource:  "Resources", ayatan: "Ayatan", miscellaneous: "Miscellaneous" },
	peelypix:           { normal: "normal", chromatic: "chromatic" },
	quest:              { main: "main quest", side: "side quest", warframe: "warframe quest" },
  relic:              { lith: "lith", meso: "meso", neo: "neo", axi: "axi", requiem: "requiem" },
  relic_rank:         { intact: "intact", radiant: "radiant", other: "other" },
  relic_vanguard:     { vanguard: "vanguard" },
  signa:              { event: "Event", nightwave: "Nightwave", baro: "Baro Ki'Teer", hunhow: "Hunhow" },
  skin:               { skin: "Skin", ship: "Ship Decoration", misc: "Misc", palette: "Color Palette", note: "Note Packs", emotes: "Emotes", fur_color: "Fur Color", fur_pattern: "Fur Pattern", theme_background: "Theme Background", themes: "Themes", arcade: "Arcade Minigame Unlock", theme_sound: "Theme Sound", syandana: "Syandana", skins: "Skins", fish: "Fish", glyph: "Glyph", resource: "Resource", emblem: "emblem", poster: "poster", floof: "floof", ephemera: "ephemera", drone: "drone", signa: "signa"},
  somachord:          { baro: "Baro Ki'Teer", aoi: "Aoi", fragment: "Fragment", hunhow: "Hunhow", aspirant: "Aspirant Zorba", varzia: "Varzia", shop: "Shop", awakening: "Awakening Quest", teshin: "Teshin", koumei: "Koumei's Shrine" },
  trophy:             { mastery: "Mastery", planet: "Planets", fish: "Fish" },
  trophy_fish:        { poe: "Plain Of Eidolon", ov: "Orb Vallis", cd: "Cambion Drift" },
  vehicle:            { archwing: "archwing", necramech: "necramech", plexus: "plexus", kdrive: "k-drive" },
  weapon:             { primary: "primary", secondary: "secondary", melee: "melee" },
  weapon_category:    { normal: "normal", amp: "amp", kitgun: "kitgun", zaw: "zaw" },
  
  // shared TYPES
  rarity:             { common: "common", uncommon: "uncommon", rare: "rare", legendary: "legendary" },
  rank:               { normal: "non prime", prime: "prime" },
};

WF.FILTERS = {
  weapon: [
    {
      field: "weapon_category",
      optionsBySubtype: {
        [WF.TYPES.weapon.primary]: [WF.TYPES.weapon_category.normal, WF.TYPES.weapon_category.amp],
        [WF.TYPES.weapon.secondary]: [WF.TYPES.weapon_category.normal, WF.TYPES.weapon_category.kitgun],
        [WF.TYPES.weapon.melee]: [WF.TYPES.weapon_category.normal, WF.TYPES.weapon_category.zaw],
      },
    },
    { field: "rank", options: WF.TYPES.rank },
  ],
  warframe: [
    { field: "rank", options: WF.TYPES.rank },
  ],
  intrinsic: [
    {
      field: "intrinsic_category",
      optionsBySubtype: {
        all: WF.TYPES.intrinsic_category,
        [WF.TYPES.intrinsic.railjack]: [WF.TYPES.intrinsic_category.command, WF.TYPES.intrinsic_category.engineering, WF.TYPES.intrinsic_category.gunnery, WF.TYPES.intrinsic_category.piloting, WF.TYPES.intrinsic_category.tactical],
        [WF.TYPES.intrinsic.drifter]: [WF.TYPES.intrinsic_category.combat, WF.TYPES.intrinsic_category.endurance, WF.TYPES.intrinsic_category.opportunity, WF.TYPES.intrinsic_category.riding],
      },
    },
  ],
  fragment: [
    {
      field: "fragment_category",
      optionsBySubtype: {
        [WF.TYPES.fragment.prex]: WF.TYPES.fragment_category,
      },
    },
  ],
  skin: [
    { field: "skin_category", options: WF.TYPES.skin_category},
  ],
  node: [
    { field: "node_difficulty", options: WF.TYPES.node_difficulty },
    {
      field: "node_solar",
      optionsBySubtype: {
        [WF.TYPES.node.solar]: WF.TYPES.node_solar,
        [WF.TYPES.node.empyrean]: WF.TYPES.node_empyrean,
        // "all": [...WF.TYPES.node_solar, ...WF.TYPES.node_empyrean], // hummmmmmm nope, too messy
      },
    },
  ],
  relic: [
    { field: "relic_rank", options: WF.TYPES.relic_rank },
  ],
  arcane: [
    { field: "rarity", options: WF.TYPES.rarity },
  ],
  mod: [
    { field: "mod_category", options: WF.TYPES.mod_category },
    { field: "rarity", options: WF.TYPES.rarity },
  ],
  trophy: [
    {
      field: "trophy_fish",
      optionsBySubtype: {
        [WF.TYPES.trophy.fish]: WF.TYPES.trophy_fish,
      },
    },
  ],
  companion: [
    {
      field: "companion_category",
      optionsBySubtype: {
        all: WF.TYPES.companion_category,
        [WF.TYPES.companion.robotic]: [WF.TYPES.companion_category.sentinel, WF.TYPES.companion_category.sentinel_weapon, WF.TYPES.companion_category.moa,  WF.TYPES.companion_category.moa_weapon, WF.TYPES.companion_category.hound, WF.TYPES.companion_category.hound_weapon],
        [WF.TYPES.companion.beast]: [WF.TYPES.companion_category.kubrow, WF.TYPES.companion_category.kavat],
        [WF.TYPES.companion.deimos]: [WF.TYPES.companion_category.predasite, WF.TYPES.companion_category.vulpaphyla],
      },   
    },
    { field: "rank", options: WF.TYPES.rank },
  ],
};

WF.NAV_GROUPS = [
  {
    label: "Profile",
    types: [WF.CATEGORY.archweapon, WF.CATEGORY.challenge, WF.CATEGORY.companion, WF.CATEGORY.honoria, WF.CATEGORY.intrinsic, WF.CATEGORY.node, WF.CATEGORY.vehicle, WF.CATEGORY.warframe, WF.CATEGORY.weapon],
  },
  {
    label: "Codex",
    types: [WF.CATEGORY.arcane, WF.CATEGORY.artgallery, WF.CATEGORY.enemy, WF.CATEGORY.fragment, WF.CATEGORY.mod, WF.CATEGORY.object, WF.CATEGORY.quest, WF.CATEGORY.relic],
  },
  {
    label: "Upgrade",
    types: [WF.CATEGORY.adversary, WF.CATEGORY.focusschool, WF.CATEGORY.incarnon],
  },
  {
    label: "Collectible",
    types: [WF.CATEGORY.airsupport, WF.CATEGORY.armament, WF.CATEGORY.scene, WF.CATEGORY.framefighter, WF.CATEGORY.gear, WF.CATEGORY.helminth, WF.CATEGORY.peelypix, WF.CATEGORY.simulacrum, WF.CATEGORY.somachord],
  },
  {
    label: "Appearance",
    types: [WF.CATEGORY.ephemera, WF.CATEGORY.emblem, WF.CATEGORY.glyph, WF.CATEGORY.sigil, WF.CATEGORY.signa, WF.CATEGORY.skin, WF.CATEGORY.sumdali, WF.CATEGORY.syandana],
  },
  {
    label: "Decorations",
    types: [WF.CATEGORY.arcade, WF.CATEGORY.articula, WF.CATEGORY.domestik, WF.CATEGORY.floof, WF.CATEGORY.focusrepresent, WF.CATEGORY.poster, WF.CATEGORY.trophy],
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
  { date: "2026/08/16 00:00:00", version: "43.5.1", text: `todooooooooooooooooooooooooo` },
  { date: "2026/08/09 00:00:00", version: "43.0.8", text: `New items and new categories. </br>New badge for items hidden until owned. </br>Navigation menu order has changed a bit.` },
  { date: "2026/07/31 00:00:00", version: "43.0.8", text: `Fixed some UI glitches on mobile and added a site icon. </br>Fixed the wrong percentage shown in filters. </br>Search now changes the item count and percentage of the progress bar.</br> Tooltip is better than ever, but still does not work properly on mobile. ` },
  { date: "2026/07/28 00:00:00", version: "43.0.8", text: `Some refactoring, changes and optimizations. </br>It should work better on mobile, the UI should be better, too. ` },
  { date: "2026/07/27 00:00:00", version: "43.0.8", text: `Moved "import" / "export" to "options". </br>Updated project links to redirect to source code and live versions on GitHub. </br>Added a one-time toast notification if an update is found (if it works). </br>Added a label in "options" if an update is available. </br>The menu is now fixed at the top of the screen. </br>Fixed some scaling issues on mobile (I hope). </br>Fixed some typos from "Condex" to "Codex". </br>Updated project links. </br>Fixed once more "missions" and "the steel path mission" mastery_xp calculation.` },
  { date: "2026/07/26 00:00:00", version: "43.0.8", text: `<!> Selected "honoria", "helminth" and "air support" have been reset due to their uniqueName being changed</br> Fixed broken "armament" filter/generation` },
  { date: "2026/07/25 00:00:00", version: "43.0.8", text: `Added "The Maker" Quest. </br> Added themes color in "Options" </br> Added small icons "V" for "Vaulted" and "XP" for how much mastery this will give. </br> Added "Mastery Breakdown" in "Stats" like ingame in your profile.` },
  { date: "2026/07/13 00:00:00", version: "43.0.8", text: `The start of making this public and widely usable.` },
];
