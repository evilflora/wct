WF.generators = WF.generators || [];

//

const XP30 = 3000;
const XP40 = 4000;
const XP60 = 6000;
const XP80 = 8000;

// Exclude items matching at least one of these criteria
// - platinum-only items
// - removed items (different from items no longer available; some old items can't be obtained, but DE did not remove them from our inventories)
// - console exclusives
// - forum/community events or any other non-ingame events
// - Twitch drops
// - TennoCon

const AIRSUPPORT_MAPPING_END	= { LisetAutoHack: WF.TYPES.airsupport.liset, LisetMedStation: WF.TYPES.airsupport.mantis, LisetStun: WF.TYPES.airsupport.nightwave, LisetGoldenInstinct: WF.TYPES.airsupport.parallax, LisetBarrage: WF.TYPES.airsupport.scimitar, LisetKahl: WF.TYPES.airsupport.skaut, LisetTurret: WF.TYPES.airsupport.xiphos };
const ARMAMENT_EXCLUDE_END		= ["AutoCannon", "DecoyCountermeasure", "Blaster", "BlasterShotgun", "SmokeCountermeasure", "ShrapnelShotgun", "RailJackBeamWeapon", "PulseLaser"];
const BOBBLEHEAD_EXCLUDE_END	= ["/JackONaughtBobbleHead", "/CCTeamDOspreyBobbleHead", "/AladVBobbleHead", "/HexAmirBobbleHead", "/CaliberChicksAnnaKiBobbleHead", "/HexAoiBobbleHead", "/GrineerMarineArcticBobbleHead", "/GrineerMarineDesertBobbleHead", "/GrineerMarineAltDesertBobbleHead", "/CCTeamDBusterABobbleHead", "/HexArthurBobbleHead", "/AshBobbleHead", "/AshPrimeBobbleHead", "/AtlasBobbleHead", "/AtlasPrimeBobbleHead", "/CCTeamBRiotMoaBobbleHead", "/CCTeamBHyenaBobbleHead", "/BansheeBobbleHead", "/BansheePrimeBobbleHead", "/BaruukAltBobbleHead", "/BaruukBobbleHead", "/BaruukPrimeBobbleHead", "/SentientWarriorBobbleHead", "/BombastineBobbleHead", "/GrineerExcavationBossBobbleHead", "/CalibanBobbleHead", "/CalibanPrimeBobbleHead", "/ChromaBobbleHead", "/ChromaPrimeBobbleHead", "/ClemBobbleHead", "/SentientMeleeWarriorBobbleHead", "/DarvoBobbleHead", "/CCTeamCHackerBobbleHead", "/WFHeavyBobbleHead", "/WFHealerBobbleHead", "/WFChargerBobbleHead", "/WFTankBobbleHead", "/WFSniperBobbleHead", "/WFGruntBobbleHead", "/WFEngineerBobbleHead", "/WFHellionBobbleHead", "/WFBeastMasterBobbleHead", "/CCTeamDBusterBBobbleHead", "/HexEleanorBobbleHead", "/GrineerMarineAlt2DesertBobbleHead", "/GrineerMarineAltArcticBobbleHead", "/EmberBobbleHead", "/EmberPrimeBobbleHead", "/EquinoxCombinedBobbleHead", "/EquinoxDayBobbleHead", "/EquinoxNightBobbleHead", "/EquinoxPrimeBobbleHead", "/EquinoxPrimeDayBobbleHead", "/EquinoxPrimeNightBobbleHead", "/ExcaliburDexBobbleHead", "/ExcaliburJadeBobbleHead", "/ExcaliburObsidianBobbleHead", "/ExcaliburObsidianAzuraBobbleHead", "/ExcaliburPrimeBobbleHead", "/ExcaliburUmbraBobbleHead", "/ExcaliburArchwingBobbleHead", "/GrineerChampionsHeavyBobbleHead", "/GrineerChampionsHealerBobbleHead", "/GrineerChampionsChargerBobbleHead", "/GrineerChampionsTankBobbleHead", "/GrineerChampionsSniperBobbleHead", "/GrineerChampionsGruntBobbleHead", "/GrineerChampionsEngineerBobbleHead", "/GrineerChampionsHellionBobbleHead", "/GrineerChampionsBeastMasterBobbleHead", "/FrostBobbleHead", "/FrostHarkaBobbleHead", "/FrostPrimeBobbleHead", "/GaraBobbleHead", "/GaraPrimeBobbleHead", "/GarudaPrimeBobbleHead", "/GaussBobbleHead", "/GaussPrimeBobbleHead", "/GrendelBobbleHead", "/GrendelPrimeBobbleHead", "/OstHaiLukBobbleHead", "/HarrowBobbleHead", "/HarrowPrimeBobbleHead", "/HildrynPrimeBobbleHead", "/HydroidBobbleHead", "/OstHokBobbleHead", "/HydroidPrimeBobbleHead", "/GrineerHyekkaBobbleHead", "/InarosPrimeBobbleHead", "/InarosSarcophagusBobbleHead", "/IvaraBobbleHead", "/IvaraObsidianBobbleHead", "/IvaraPrimeBobbleHead", "/JackalBobbleHead", "/CCTeamBDisruptorBobbleHead", "/RhinoJadeBobbleHead", "/CCTeamCDeceptionBobbleHead", "/CaliberChicksJillianBobbleHead", "/TNWKahlBobbleHead", "/KelaDeThaymBobbleHead", "/KhoraBobbleHead", "/KhoraPrimeBobbleHead", "/OstKonzuBobbleHead", "/KullervoBobbleHead", "/GrineerMarineBobbleHead", "/LavosPrimeBobbleHead", "/HexLettieBobbleHead", "/CaliberChicksLillianBobbleHead", "/LimboBobbleHead", "/LimboPrimeBobbleHead", "/CCTeamAZanukaBobbleHead", "/LokiBobbleHead", "/LokiPrimeBobbleHead", "/LokiVervBobbleHead", "/CCTeamCMoaBobbleHead", "/MagPrimeBobbleHead", "/ItzalArchwingBobbleHead", "/MesaBobbleHead", "/MesaPrimeBobbleHead", "/MirageBobbleHead", "/MiragePrimeBobbleHead", "/CCTeamARifleBobbleHead", "/NekrosBobbleHead", "/NekrosPrimeBobbleHead", "/NezhaBobbleHead", "/NezhaPrimeBobbleHead", "/NidusBobbleHead", "/NidusPrimeBobbleHead", "/GrineerNightwatchMarineBobbleHead", "/GlassmakerBobbleHead", "/NovaBobbleHead", "/NovaPrimeBobbleHead", "/NyxBobbleHead", "/NyxPrimeBobbleHead", "/OberonBobbleHead", "/OberonPrimeBobbleHead", "/OctaviaPrimeBobbleHead", "/OrokinFelisBobbleHead", "/ExcaliburOpalBobbleHead", "/CCTeamASkateBobbleHead", "/PopcornBobbleHead", "/ExcaliburPrismaBobbleHead", "/ProteaPrimeBobbleHead", "/ExcaliburProtoBobbleHead", "/HexQuincyBobbleHead", "/CCTeamDBusterCBobbleHead", "/CCTeamBRaptorBobbleHead", "/RevenantPrimeBobbleHead", "/RhinoBobbleHead", "/RhinoDexBobbleHead", "/RhinoPrimeBobbleHead", "/SargusRukBobbleHead", "/SarynBobbleHead", "/SarynPrimeBobbleHead", "/SevagothPrimeBobbleHead", "/FrostSnowdayBobbleHead", "/StalkerBobbleHead", "/MirageTennobaumBobbleHead", "/TheLotusBobbleHead", "/CCTeamCStealthBobbleHead", "/TitaniaBobbleHead", "/TitaniaPrimeBobbleHead", "/TrinityBobbleHead", "/TrinityPrimeBobbleHead", "/TylRegorBobbleHead", "/ValkyrBobbleHead", "/ValkyrPrimeBobbleHead", "/VaubanBobbleHead", "/VaubanPrimeBobbleHead", "/CCTeamAHeavyBobbleHead", "/VentKidBoardBobbleHead", "/VoltBobbleHead", "/VoltPrimeBobbleHead", "/VorBobbleHead", "/WispPrimeBobbleHead", "/WukongBobbleHead", "/WukongPrimeBobbleHead", "/XakuPrimeBobbleHead", "/YareliPrimeBobbleHead", "/ZephyrBobbleHead", "/ZephyrPrimeBobbleHead"];
const COLOR_EXCLUDE_END			= ["ColourPickerKuvaLichElectric", "ColourPickerBastilleItem", "ColourPickerItem", "ColourPickerItemB", "ColourPickerItemD", "ColourPickerKuvaLichMag", "ExtraTonesItem", "ColourPickerCorpusItemA", "ColourPickerKuvaLichTrickster", "ColourPickerDaybreakItemA", "ColourPickerHeirloom", "ColourPickerDiscordItemA", "ColourPickerDojoItemA", "ColourPickerEmberHeirloom", "ColourPickerNightwave1999Item", "ColourPickerEximus", "ColourPickerKuvaLichIce", "ColourPickerFireItemA", "ColourPickerGrineerItemA", "ColourPickerKuvaLichFire", "ColourPickerIceItemA", "ColourPickerInfestedItemA", "ColourPickerJadeItem", "ExpandedLegacyTonesItem", "LegacyTonesItem", "ColourPickerJadeStalker", "ColourPickerLotus", "ColourPickerTMobileItemA", "ColourPickerMesaHeirloom", "ColourPickerNarmer", "BaseTonesItem", "ColourPickerSwitchItemA", "ColourPickerOrion", "ColourPickerOrokin", "ColourPickerPrimeWarframesItemA", "ColourPickerPrimeWarframesItemB", "ColourPickerPS4ItemA", "ColourPickerRWBItem", "ColourPickerRhinoHeirloom", "ColourPickerRollers", "ColourPickerKuvaLichPoison", "ColourPickerKalymos", "ColourPickerSirius", "NinjaColourPickerItem", "ColourPickerItemC", "ColourPickerDefaultsItemA", "ColourPickerDefaultsItemB", "ColourPickerDefaultsItemC", "ColourPickerTwilightItemA", "ColourPickerTwitchItemA", "ColourPickerKuvaLichBase", "ColourPickerValkyrHeirloom", "ColourPickerVaubanHeirloom", "ColourPickerAccessibilityItemA"]; // todo ExtraTonesItem & ExpandedLegacyTonesItem for operator / drifter
const DOMESTIK_EXCLUDE_END		= ["/LisetPropCleaningDroneYareliDeluxe", "/LisetPropCleaningDroneYareliPrime", "/LisetPropCleaningDroneYareli", "/LisetProp1999TankDrone", "/LisetPropCleaningDroneColorOne", "/LisetPropCleaningDroneColorTwo", "/LisetPropCleaningDroneColorThree", "/LisetPropCleaningDroneColorFour", "/LisetPropCleaningDroneColorFive", "/LisetPropCleaningDroneColorSix", "/LisetPropCleaningDrone", "/LisetPropCleaningDroneCaliberChicks", "/LisetPropCleaningDroneInfested", "/LisetPropOrokinMaggot", "/LisetPropCleaningDroneTwitch"];
const EMBLEM_EXCLUDE_END		= ["ClanEmblemItem", "AllianceEmblemItem", "Community10YearEmblemItem", "TennoGenBadgeItem", "WikiaBadgeItem", "TranslatorBadgeItem", "LotusGuideBadgeItem", "ZarimanEvolvingSekharaBadgeItemA", "1999CommunityARGBadgeItem", "SkullBadgeGoldItem", "SkullBadgeSilverItem", "SkullBadgeBronzeItem", "CYCCBBadgeItem", "CYOBBadgeItem", "CY17173MediaBadge", "CYDuowanMediaBadge", "CYPlayBadgeItem", "TennoCon2016BadgeItem", "XBoneJadeClemBadgeItem", "DrakeRifleBadgeItem", "PS5OkinaBadgeItem", "LeaderBadgeGhostItem", "LeaderBadgeMoonItem", "LeaderBadgeMountainItem", "LeaderBadgeShadowItem", "LeaderBadgeStormItem", "ZawVariantBadgeItemA", "ZawVariantBadgeItemB", "ZawVariantBadgeItemC", "PvpRepBadgeItem", "ExcaliburUmbraBadgeItem", "ZarimanEvolvingSekharaBadgeItemB", "ZarimanEvolvingSekharaBadgeItemC", "GolemRaidBadgeItem", "SevantiHaloBadgeItem", "NightmareSevantiHaloBadgeItem", "SevantiLegacyHaloBadgeItem"];
const EMOTE_EXCLUDE_END			= ["LegendaryAmirEmote", "LegendaryAoiEmote", "LegendaryArthurEmote", "LegendaryEleanorEmote", "LegendaryFlareEmote", "LegendaryKayaEmote", "LegendaryLettieEmote", "LegendaryLyonEmote", "LegendaryMarieEmote", "LegendaryMinervaEmote", "LegendaryQuincyEmote", "LegendaryRoatheEmote", "LegendaryRyokuEmote", "LegendaryVelimirEmote", "LegendaryWytchEmote", "Tennocon2019Emote", "Tennocon2020BEmote", "Tennocon2021Emote", "Tennocon2022Emote", "Tennocon2024Emote", "Tennocon2026Emote", "Tennocon2024EmoteAlt", "Tennocon2025Emote", "Tennocon2020AEmote", "ShrineFanDanceEmote", "ShrineDiceShakeEmote", "GaussGonnaGetchaEmote", "KhoraPrimeEmote", "HeirloomEmote", "DanceReachAcrossHips", "DanceOneHandHipPump", "DanceOneHandHipLookLeftRight", "DanceHandsUp", "DanceHeadphonesBop", "DanceSideStepTurn", "DanceLassoSidestep", "DanceTurnReverseTurn", "DanceElbowWave", "PunctualityEmote", "LNY2024DragonEmote", "LNY2026HorseEmote", "LNY2023Emote", "LNY2025SnakeEmote", "GrendelDeluxeIILetsRollEmote", "GaussDeluxeIILetsRaceEmote", "CaptainEmote", "BarterEmote"];
const EPHEMERA_EXCLUDE_END		= ["PeachBlossomsEphemera", "LunarEphemera", "LNYDragonEphemera", "LNYStonesEphemera", "LNYKaitheDagathEphemera", "EphemeraNezhaPrime", "EphemeraGaraPrime", "EphemeraPrimeA", "PrimeVorunaEphemera", "GrendelPrimeEphemera", "GarudaPrimeEphemera", "ProteaPrimeEphemera", "YareliPrimeEphemera", "BaruukPrimeEphemera", "NarmerEvolvingEphemeraA", "NarmerEvolvingEphemeraB", "NarmerEvolvingEphemeraC", "CitrineDeluxeEphemera", "DeimosEphemera", "GrendelDeluxeIIFootstepsEphemera", "CalibanDeluxeEphemera", "TennoCon2026Ephemera", "VoltDeluxeRaijinEphemera", "XakuDeluxeEphemera", "VorunaDeluxeEphemera", "NovaDeluxeAoandonEphemera", "ObsidianEphemeraA", "WerewolfEphemera", "LavosDeluxeEphemera", "SandmanEphemera", "NokkoEphemera", "TennoCon2021Ephemera", "TwitchEphemera", "OraxiaEphemera", "/BaruukDeluxeIIEphemera", "/FootstepsEasterEggs"];
const FISH_EXCLUDE_END			= ["/HolidayGrineerBootItem", "/DuviriFishAItem", "/DuviriFishBItem", "/DuviriFishCItem", "/DuviriFishDItem", "/DuviriFishEItem", "/OrokinBootItem"];
const FLOOF_EXCLUDE_END			= ["/PlushyOrdis", "/PlushyProtectorStalker", "/BirdPlush", "/FishPlush", "/DeerPlush", "/PlushyArthur", "/PlushyAoi", "/PlushyAmir", "/PlushyQuincy", "/PlushyLettie", "/PlushyEleanor", "/PlushyNokkoMushroom", "/PlushyLyon", "/PlushyMarie", "/PlushyRoathe", "/PlushyLotus", "/GaussPrimePlush", "/PlushyTiger", "/PlushyLNY2023Rabbit", "/PlushyLNY2024Dragon", "/PlushySnake", "/PlushyLNYMirage", "/PlushyLNYKaithe", "/TennoCon2024CosplayTrophy"];
const FOCUS_WAYBOUND_END		= ["/MoreAmmoFocusUpgrade", "/RegenAmmoFocusUpgrade", "/HealthMaxFocusUpgrade", "/HealthRegenFocusUpgrade", "/MoveSpeedFocusUpgrade", "/ProjectionStretchUpgrade", "/SecondChanceFocusUpgrade", "/SecondChanceDamageBuffFocusUpgrade", "/EnergyPoolFocusUpgrade", "/EnergyRestoreFocusUpgrade"];
const FOUNDER_EXCLUSIVE_INC		= ["/Powersuits/Excalibur/ExcaliburPrime", "LatoPrime", "SkanaPrime", "FounderLvl1Title", "FounderLvl2Title", "FounderLvl3Title", "FounderLvl4Title", "FoundersBadgeDiscipleItem", "FoundersBadgeHunterItem", "FoundersBadgeMasterItem", "FoundersBadgeGrandMasterItem", "FounderSigilDisciple", "FounderSigilHunter", "FounderSigilMaster", "FounderSigilGrandMaster"];
const FRAMEFIGHTER_INCLUDE		= ["Ash", "Atlas", "Banshee", "Baruuk", "Chroma", "Ember", "Equinox", "Excalibur", "Excalibur Umbra", "Frost", "Gara", "Garuda", "Gauss", "Grendel", "Harrow", "Hildryn", "Hydroid", "Inaros", "Ivara", "Khora", "Lavos", "Limbo", "Loki", "Mag", "Mesa", "Mirage", "Nekros", "Nezha", "Nidus", "Nova", "Nyx", "Oberon", "Octavia", "Protea", "Revenant", "Rhino", "Saryn", "Sevagoth", "Titania", "Trinity", "Valkyr", "Vauban", "Volt", "Wisp", "Wukong", "Xaku", "Yareli", "Zephyr"];
const FUR_COLOR_EXCLUDE_END		= ["/KubrowPetColorVibrantG", "/CatbrowPetColorTertiaryEntrati", "/KubrowPetColorVibrantB", "/CatbrowPetColorAccentsContest", "/CatbrowPetColorBaseC", "/KubrowPetColorVibrantA", "/PrimeCatbrowPetColorAccents", "/CatbrowPetColorBaseContest", "/KubrowPetColorMundaneI", "/GaraPrimeCatbrowPetColorTertiary", "/KubrowPetColorMundaneA", "/CatbrowPetColorTertiaryXmas", "/CatbrowPetColorSecondaryD", "/CatbrowPetColorSecondaryXmas", "/CatbrowPetColorBaseEntrati", "/CatbrowPetColorSecondaryHyekka", "/CatbrowPetColorTertiaryC", "/CatbrowPetColorBaseSolstice", "/KubrowPetColorSolsticeMundane", "/KubrowPetColorXmasVibrantA", "/PrimeCatbrowPetColorBaseA", "/CatbrowPetColorAccentsHyekka", "/CatbrowPetColorAccentsXmas", "/KubrowPetColorMidContest", "/KubrowColorWukongPrimeMundane", "/KubrowPetColorMidF", "/CatbrowPetColorBaseDaybreak", "/KubrowColorWukongPrimeVibrant", "/CatbrowPetColorSecondaryC", "/CatbrowPetColorBaseD", "/CatbrowPetColorTertiaryD", "/KubrowPetColorMidI", "/CatbrowPetColorBaseHyekka", "/KubrowPetColorMidLiquid", "/KubrowPetColorMundaneJ", "/PrimeCatbrowPetColorSecondaryA", "/KubrowPetColorMundaneG", "/CatbrowPetColorAccentsD", "/CatbrowPetColorSecondaryDaybreak", "/KubrowPetColorMidD", "/KubrowPetColorXmasMidB", "/KubrowPetColorVibrantE", "/KubrowPetColorPrimeA", "/KubrowPetColorMundaneE", "/KubrowPetColorVibrantI", "/KubrowPetColorXmasMidA", "/CatbrowPetColorSecondaryVampire", "/CatbrowPetColorTertiaryDaybreak", "/CatbrowPetColorAccentsSolstice", "/GaraPrimeCatbrowPetColorAccents", "/CatbrowPetColorTertiarySolstice", "/KubrowPetColorSolsticeVibrant", "/KubrowPetColorMidC", "/KubrowPetColorMidH", "/KubrowPetColorVibrantK", "/KhoraDeluxeColorSecondary", "/KubrowPetColorMundaneContest", "/GaraPrimeCatbrowPetColorBase", "/CatbrowPetColorTertiaryContest", "/KubrowPetColorMidJ", "/KubrowPetColorXmasMundaneB", "/KubrowPetColorMidG", "/KubrowPetColorPrimeD", "/KubrowPetColorPrimeC", "/KubrowPetColorVibrantContest", "/GaraPrimeCatbrowPetColorSecondary", "/KubrowPetColorMundaneK", "/KubrowPetColorVibrantF", "/PrimeCatbrowPetColorTertiaryA", "/ExtraOperatorSkinColors", "/KubrowPetColorMidK", "/KhoraDeluxeColorBase", "/KhoraDeluxeColorTertiary", "/CatbrowPetColorSecondaryEntrati", "/CatbrowPetColorBaseXmas", "/KubrowPetColorVibrantD", "/KubrowPetColorMundaneH", "/KubrowPetColorMidA", "/CatbrowPetColorAccentsC", "/KubrowPetColorVibrantC", "/CatbrowPetColorTertiaryHyekka", "/CatbrowPetColorAccentsDaybreak", "/KubrowPetColorMundaneLiquid", "/KubrowPetColorXmasMundaneA", "/KhoraDeluxeColorAccents", "/KubrowColorWukongPrimeMid", "/KubrowPetColorXmasVibrantB", "/KubrowPetColorVibrantJ", "/KubrowPetColorVibrantLiquid", "/CatbrowPetColorBaseVampire", "/KubrowPetColorVibrantH", "/CatbrowPetColorAccentsEntrati", "/KubrowPetColorMidE", "/CatbrowPetColorSecondaryContest", "/CatbrowPetColorSecondarySolstice", "/KubrowPetColorSolsticeMid", "/CatbrowPetColorBaseA", "/CatbrowPetColorSecondaryA", "/CatbrowPetColorTertiaryA"];
const FUR_PATTERN_EXCLUDE_END	= ["KubrowPetPatternLiquid", "KubrowPetPatternH", "InfestedPredatorPatternDefault", "InfestedCritterPatternDefault", "KubrowPetPatternD", "KubrowPetPatternHelminthDeluxe", "HelminthPetPatternClassic", "KubrowPetPatternInfested", "KubrowPetPatternC", "CatbrowPetPatternA", "CatbrowPetPatternHyekka", "EntratiCatbrowPattern", "KubrowPetPatternPrimeA", "CatbrowPetPatternD", "KubrowPetPatternF", "KubrowPetPatternE", "KubrowPetPatternG", "KubrowPetPatternXmasA", "CatbrowPetPatternC", "KubrowPetPatternXmasB", "KubrowPetPatternB", "KubrowPetPatternA", "CatbrowPetPatternB", "WukongPrimeKubrowPattern", "KubrowPetPatternI", "CatbrowPetPatternVampire", "XmasCatbrowSkin", "SolsticeCatbrowFur", "SolsticeKubrowFur", "PrimeCatbrowFur", "GaraPrimeCatbrowFur", "ContestKubrowFur", "ContestCatbrowFur", "DaybreakCatbrowFur"];
const GLOBAL_EXCLUDE_INC		= ["/Lotus/Upgrades/Mods/Randomized/Lotus", "/Lotus/Upgrades/Mods/Randomized/Player", "/Lotus/StoreItems/Upgrades/Mods/Randomized",	"/TransmuteCores/", "/Engineering/Base", "CloakPullFocusUpgrade", "DashElectricityFocusUpgrade", "CloakStaticFocusUpgrade", "BlastBurstFocusUpgrade", "DashFireFocusUpgrade", "BlastFireballFocusUpgrade", "DashDamageFocusUpgrade", "ElementalDamageFocusUpgrade", "BlastChargeFocusUpgrade", "CloakBlindFocusUpgrade", "BlastRadiusFocusUpgrade", "ArmourIncreaseFocusUpgrade", "DashReduceDamageFocusUpgrade", "MagneticFieldFocusUpgrade", "DashReduceArmourFocusUpgrade", "BlastDamagePickupFocusUpgrade", "CloakReduceDamageFocusUpgrade", "CloakAllyCloakFocusUpgrade", "ReflectDamageFocusUpgrade", "BlastSelfShieldFocusUpgrade", "BlastDisarmFocusUpgrade", "BlastConfuseFocusUpgrade", "DashFinisherFocusUpgrade", "DashSpeedFocusUpgrade", "CloakRevealFocusUpgrade", "SonarPvPAugmentCard", "CloakMeleeCritFocusUpgrade", "CloakShieldFocusUpgrade", "BlastAllyShieldFocusUpgrade", "DashShockwaveFocusUpgrade", "DashWaveFocusUpgrade", "AirborneMeleeAutoTargetBonus", "GroundingMeleeMod", "/Lotus/Upgrades/CosmeticEnhancers/Defensive/PoisonProcResist", "/Lotus/Upgrades/CosmeticEnhancers/Defensive/GasProcResist", "/Lotus/Upgrades/CosmeticEnhancers/Defensive/CorrosiveProcResist", "/Lotus/Upgrades/CosmeticEnhancers/Utility/SlowerBleedOutOnPredeath", "/Lotus/Upgrades/CosmeticEnhancers/Utility/DamageReductionDuringRevive", "/Lotus/Upgrades/CosmeticEnhancers/Utility/NoCostCastChanceAbility", "SiriusOrion/OrionSuit", "/Lotus/Types/Keys/DojoKey", "SolNode254", "SolNode255", "SolNode256", "AvatarResistanceOnDamageMod", "AvatarDamageResistanceLaserExpert", "AvatarDamageResistanceFireExpert", "HealthPickupGivesArmourMax", "AvatarDamageResistanceIceExpert", "AvatarAbilityStrengthModExpert", "AvatarDamageResistanceElectricityExpert", "AvatarShieldRechargeRateModExpert", "AvatarAbilityEfficiencyModExpert", "AvatarDamageToEnergyModExpert", "AvatarParryReflectModExpert", "AvatarDamageResistanceStun", "AvatarAbilityRangeModExpert", "/DangerRoomKey", "/AvatarImagePHGlyph", "/PunctureProcResist", "/Rank00Trophy", "TennoconConcert2025Display",
"VoidProjectionProteaIvaraVault"]; // temporary, prevent spoil
const GLYPH_EXCLUDE_END			= ["/AvatarImageChromaPrimePartner", "/AvatarImage13angTV", "/AvatarImage2020ZerO", "/AvatarImage4MORI4N", "/AvatarImageSixixgatsu", "/AvatarImageIm7heClown", "/AvatarImageAHR", "/AvatarImageAbsoluteCinemaGlyph", "/AvatarImageAccessibleGamer", "/AvatarImageAcolyteSynpai", "/AvatarImageAdelfosSelene", "/AvatarImageAdikDarkCero", "/AvatarImageAdmiralBahroo", "/AvatarImageAeonKnight", "/AvatarImageAesopYOLIAN", "/AvatarImageCreatorAGGP", "/AvatarImageAjingom", "/AvatarImageAkariayataka", "/ImageCorpusAladV", "/AvatarImageGlyphMashedAladV", "/AvatarImageAlainLove", "/AvatarImageAlbrechtHatCommunity", "/KalymosGrimoireGlyph", "/AvatarImageAlexanderDario", "/AvatarImageAlexandraLive", "/Halloween2019CheshireKavat", "/AvatarImageAlyekk", "/GlyphFactionAmalgam", "/AvatarImageAmazingBuriGlyph", "/AvatarImageAnaviIvy", "/AvatarImageAngryUnicorn", "/AvatarImageAngryIceberg", "/AvatarImageAnJetCat", "/AvatarImageAnnoyingKillah", "/ImageSyndicateAH", "/AvatarImageArborealKeyGlyph", "/NewWar2021Glyph", "/AvatarImageArgonSix", "/AvatarImageArthurInTheFridgeGlyph", "/AvatarImageItem6", "/ImageAshBright", "/ImageAshDark", "/AvatarImageAshAction", "/ImageAshDeluxe", "/ImageAshLocustBright", "/ImageAshLocustDark", "/ImageAshPrimeBright", "/ImageAshPrimeDark", "/ImageAshScorpionBright", "/ImageAshScorpionDark", "/ImageAshDeluxeII", "/AvatarImageAshi", "/AvatarImageAshisogiTenno", "/AvatarImageVitruvianGlyphA", "/AvatarImageTenshi", "/ImageBrawlerBright", "/ImageBrawlerDark", "/AvatarImageGlyphComicF", "/ImageAtlasDeluxe", "/AvatarImageLowPolyAtlas", "/ImageAtlasPrimeBright", "/ImageAtlasPrimeDark", "/ImageBrawlerAltTwoBright", "/ImageBrawlerAltTwoDark", "/ImageBrawlerAltBright", "/ImageBrawlerAltDark", "/AvatarImageAungelecette", "/AvatarImageFromThe70s", "/AvatarImageAuroraStarr", "/AvatarImageAvelna", "/AvatarImageAywi", "/AvatarImageAznitrous", "/AvatarImageAzrael", "/AvatarImageBabychanTH", "/AvatarImageBackyardisTV", "/AvatarImageBadNewsBaron", "/ImageBansheeChorusBright", "/ImageBansheeChorusDark", "/ImageBansheeBright", "/ImageBansheeDark", "/AvatarImageBansheeAction", "/ImageBansheePrimeBright", "/ImageBansheePrimeDark", "/ImageBansheeReverbBright", "/ImageBansheeReverbDark", "/ImageBansheeDeluxe", "/ImageBaruukDeluxe", "/ImagePacifistBright", "/ImagePacifistDark", "/ImagePacifistAltHelmBright", "/ImagePacifistAltHelmDark", "/ImageBaruukPrimeBright", "/ImageBaruukPrimeDark", "/AvatarImageBast", "/AvatarImageMrBearGaming", "/AvatarImageBennyfits", "/AvatarImageBigBytesPizzaGlyph", "/AvatarImageBigJimID", "/AvatarImageBikeman", "/EventGlyphCaviaBirdThree", "/AvatarImageBlackNato", "/AvatarImageBlackOni", "/AvatarImageBlazingCobalt", "/AvatarImageBlinkGlyph", "/AvatarImageGlyphMuckneyE", "/AvatarImageBlueberryCat", "/AvatarImageBluyayogamer", "/AvatarImageBocchanVT", "/ImageBombastineCommunity", "/Xmas2023BombastineGlyph", "/Halloween2019GhostChibiWisp", "/AvatarImageBoppBippGlyph", "/AvatarImageBRCommunityDiscord", "/AvatarImageBriannaKane", "/AvatarImageBricky", "/AvatarImageBrickyOrchid", "/AvatarImageBrighan", "/AvatarImageBrozime", "/AvatarImageSwitch2Glyph", "/AvatarImageBuff00n", "/AvatarImageBuriedDebts", "/AvatarImageBurnBxx", "/AvatarImageTitaniaButterflies", "/AvatarImageBwana", "/AvatarImageCalamityDeath", "/AvatarImageHalloween2016A", "/AvatarImageHalloween2016B", "/AvatarImageHalloween2016C", "/AvatarImageHalloween2016D", "/AvatarImageCaleyEmerald", "/ImageCalibanAltBright", "/ImageCalibanAltDark", "/ImageCalibanBright", "/ImageCalibanDark", "/ImageCalibanInAction", "/ImageCalibanDeluxe", "/ImageCalibanPrimeBright", "/ImageCalibanPrimeDark", "/AvatarImageCanalTenno", "/AvatarImageCanOfCraig", "/DeimosRevolverGlyph", "/ImageGrineerCaptainVor", "/AvatarImageCaptainTutu", "/AvatarImageCaptWalker", "/AvatarImageCarchara", "/AvatarImageGlyphCarolingOctavia", "/AvatarImageCasardis", "/AvatarImageCASTiELiX", "/AvatarImageCautionaryTail", "/AvatarImageGlyphMuckneyH", "/ImageCephalonCy", "/ImageCephalonSimaris", "/AvatarImageCephalonSquared", "/ImageSyndicateCS", "/AvatarImageCeratia", "/AvatarImageCGsKnackie", "/AvatarImageChacytay", "/AvatarImageChar", "/AvatarImageChassisGlyph", "/AvatarImageChatModerator", "/Community10YearOrdisGlyph", "/NokkoBabySecretGlyph", "/AvatarImageChelestra", "/CherryTreeGlyph", "/ImageChromaAmaruBright", "/ImageChromaAmaruDark", "/ImageChromaDracBright", "/ImageChromaDracDark", "/ImageChromaDeluxe", "/ImageChromaBright", "/ImageChromaDark", "/ImageChromaPrimeBright", "/ImageChromaPrimeDark", "/ImageCitrineDeluxe", "/ImageCitrineBright", "/ImageCitrineDark", "/ImageCitrineAltBright", "/ImageCitrineAltDark", "/AvatarImageClemKawaii", "/AvatarImageCodoma", "/AvatarImageCohhCarnage", "/AvatarImageCohony", "/AvatarImageColdScar", "/AvatarImageColdTiger", "/Community10YearAnniversaryGlyph", "/AvatarImageCommunityBaruuk", "/AvatarImageCommunityCaliban", "/AvatarImageCommunityCavaleroGraffiti", "/AvatarImageCommunityChroma", "/AvatarImageCommunityDagath", "/AvatarImageCommunityDante", "/AvatarImageDogDaysErraGlyph", "/AvatarImageDogDaysGareshGlyph", "/AvatarImageDogDays2024GrendelGlyph", "/AvatarImageDogDaysKelaGlyph", "/AvatarImageDogDaysRusalkaGlyph", "/AvatarImageCommunityEquinox", "/AvatarImageCommunityFollie", "/AvatarImageCommunityGaruda", "/AvatarImageCommunityGyre", "/AvatarImageCommunityHarrow", "/AvatarImageCommunityHildrynGlyph", "/AvatarImageInfestedLogoGlyph", "/AvatarImageCommunityJadeGlyph", "/AvatarImageCommunityKullervo", "/AvatarImageCommunityLavosGlyph", "/AvatarImageCommunityLimbo", "/AvatarImageCommunityLittleDuckGraffiti", "/AvatarImageCommunityMag", "/AvatarImageCommunityMotherGraffiti", "/AvatarImageCommunityNokkoGlyph", "/AvatarImageDJRoMGlyph", "/AvatarImageDrillbitGlyph", "/AvatarImageHarddriveGlyph", "/AvatarImageInfestedDJRoMGlyph", "/AvatarImageInfestedDrillbitGlyph", "/AvatarImageInfestedHarddriveGlyph", "/AvatarImageInfestedPacketGlyph", "/AvatarImageInfestedZekeGlyph", "/AvatarImagePacketGlyph", "/AvatarImageZekeGlyph", "/AvatarImageCommunityQorvex", "/AvatarImageLogoGlyph", "/AvatarImageCommunityRevenant", "/AvatarImageCommunitySaryn", "/AvatarImageCommunityStyanax", "/AvatarImageTennobaumTeshinGlyph", "/AvatarImageCommunityTitania", "/AvatarImageCommunityWisp", "/AvatarImageCommunityWukong", "/AvatarImageConclaveDiscord", "/AvatarImageConfusedWarframe", "/ImageConquera", "/ImageConquera2021C", "/ImageConquera2021D", "/ImageConquera2021A", "/AvatarImageConqueraGlyphIX", "/ImageConquera2022A", "/AvatarImageConqueraGlyphVI", "/AvatarImageConqueraGlyphVII", "/AvatarImageConqueraGlyphVIII", "/AvatarImageConqueraOrdis", "/AvatarImageGlyphCookieBoot", "/AvatarImageCopyKavat", "/AvatarImageCptKim", "/Halloween2019CreepyClem", "/AvatarImageCrestbear", "/ImageCorpusCrewman", "/ImageYouTubeCorpusA", "/ImageYouTubeCorpusB", "/AvatarImageCrowdi", "/AvatarImageCrusader", "/AvatarImageCyanfacade", "/AvatarImageChrisIsHD", "/Cyte09SupporterGlyph", "/ImageFrumentariusAltBright", "/ImageFrumentariusAltDark", "/ImageFrumentariusBright", "/ImageFrumentariusDark", "/AvatarImageDadefuye", "/AvatarImageDadXGotXGame", "/ImageDagathAltBright", "/ImageDagathAltDark", "/ImageDagathBright", "/ImageDagathDark", "/AvatarImageDaiDaiKiri", "/AvatarImageCreatorDanieltheDemon", "/AvatarImageDanily", "/AvatarImageD4NK3R", "/ImagePagemasterAltBright", "/ImagePagemasterAltDark", "/ImagePagemasterBright", "/ImagePagemasterDark", "/ImageDanteDeluxe", "/AvatarImageDanteGlyph", "/AvatarImageDappaDanMan", "/AvatarImageDarikaArt", "/AvatarImageDarkfreack", "/AvatarImageDarkSlayer", "/AvatarImageDasterCreations", "/AvatarImageDatLoon", "/AvatarImageHalloween2024SisterNoBloodGlyph", "/AvatarImageDayJoBo", "/AvatarImagedeathma666ot", "/AvatarImageDebbysheen", "/HeirloomGlyph", "/AvatarImageDeejayKnight", "/AvatarImageDeepBlueBeard", "/AvatarImageDentw", "/AvatarImagedepths", "/AvatarImageGlyphDesignerKedLotus", "/AvatarImageGlyphDesignerHannahIvara", "/AvatarImageGlyphDesignerKedKela", "/AvatarImageGlyphDesignerLigerNezha", "/AvatarImageGlyphDesignerLigerNidus", "/AvatarImageGlyphDesignerSteelsuitNidus", "/AvatarImageGlyphDesignerSteelsuitOberon", "/AvatarImageGlyphDesignerTreshClem", "/AvatarImageGlyphDesignerTreshLotus", "/AvatarImageGlyphDesignerHannahUmbra", "/AvatarImageDestrohido", "/AvatarImageHalloween2021Dethcube", "/AvatarImageDeuceTheGamer", "/AvatarImageDEUS", "/AvatarImageGlyphDELogo", "/AvatarImageDillyFrame", "/AvatarImageDimitriVTwo", "/AvatarImageDisfusional", "/AvatarImageDistantObserver", "/AvatarImageNightwaveAmirHijackGlyph", "/AvatarImageDJTechlive", "/AvatarImageCreatorDKDiamantes", "/AvatarImageDNexus", "/AvatarImageValentine2017A", "/AvatarImageValentine2017B", "/AvatarImageValentine2017C", "/AvatarImageValentine2017D", "/AvatarImageValentine2020Kuva", "/AvatarImageValentine2017E", "/AvatarImageValentine2020Alad", "/AvatarImageValentine2020Clem", "/AvatarImageValentine2020Key", "/AvatarImageLineOrion", "/AvatarImageLineRyoku", "/AvatarImageLineSirius", "/AvatarImageLineVena", "/AvatarImageDumpItGlyph", "/AvatarImageDyanaCsmythe", "/AvatarImageGooperatives", "/AvatarImageDynoes", "/AvatarImageGlyphLegendaryQuasars", "/AvatarImageEdrick", "/AvatarImageEduiy", "/AvatarImageElGrineerExiliado", "/AvatarImageElTioProd", "/AvatarImageEliceGameplay", "/AvatarImageEligibleMonster", "/AvatarImageElNoraEleo", "/ImageEmberBackdraftBright", "/ImageEmberBackdraftDark", "/AvatarImageItem7", "/ImageEmberBright", "/ImageEmberDark", "/HeirloomEmberGlyph", "/AvatarImageEmberAction", "/ImageEmberPheonixBright", "/ImageEmberPheonixDark", "/ImageEmberPrimeBright", "/ImageEmberPrimeDark", "/ImageEmberDeluxeII", "/ImageEmberDeluxe", "/AvatarImageEmovj", "/AvatarImageEmpyreanCap", "/AvatarImageEndotti", "/AvatarImageEndquar", "/AvatarImageGlyphErisTennocon2020Mech", "/AvatarImageGlyphErisTennocon2020Drone", "/ImageEquinoxDeluxe", "/ImageEquinoxBright", "/ImageEquinoxDark", "/ImageEquinoxPrimeBright", "/ImageEquinoxPrimeDark", "/ImageEquinoxSolsticeBright", "/ImageEquinoxSolsticeDark", "/AvatarImageEsp4him", "/AvatarImageModPackBlast", "/AvatarImageModPackCold", "/AvatarImageModPackCorrosive", "/AvatarImageModPackCritical", "/AvatarImageModPackDamage", "/AvatarImageModPackElectricity", "/AvatarImageModPackGas", "/AvatarImageModPackFire", "/AvatarImageModPackMagnetic", "/AvatarImageModPackRadiation", "/AvatarImageModPackToxin", "/AvatarImageModPackViral", "/AvatarImageEtainted", "/AvatarImageEterion", "/AvatarImageEveCaptura", "/ImageExcaliburAvalonBright", "/ImageExcaliburAvalonDark", "/ImageDexAnniversary", "/ImageExcaliburBright", "/ImageExcaliburDark", "/AvatarImageExcaliburAction", "/AvatarImageExcaliburActionXbox", "/AvatarImageGlyphMashedExcalibur", "/ImageExcaliburMordredBright", "/ImageExcaliburMordredDark", "/AvatarImageExcaliburChibi", "/AvatarImageExcaliburActionSony", "/AvatarImageExcaliburActionNintendo", "/ImageExcaliburPendragonBright", "/ImageExcaliburPendragonDark", "/ImageExcaliburPrimeBright", "/ImageExcaliburPrimeDark", "/ImageExcaliburProto", "/ImageExcaliburUmbraBright", "/ImageExcaliburUmbraDark", "/ImageExcaliburUmbraAltTwoBright", "/ImageExcaliburUmbraAltTwoDark", "/ImageExcaliburDeluxe", "/ImageGrineerChampionHealer", "/ImageGrineerChampionCharger", "/ImageGrineerChampionTank", "/ImageGrineerChampionSniper", "/ImageGrineerChampionGrunt", "/ImageGrineerChampionEngineer", "/ImageGrineerChampionHellion", "/ImageGrineerChampionBeastMaster", "/AvatarImageExtraCredits", "/AvatarImageFacelessBeanie", "/AvatarImageFashionFrameIsEndgame", "/RequiemFassGlyph", "/AvatarImageFated2Perish", "/AvatarImageFatefulYT", "/AvatarImageFattShane", "/AvatarImageFeelLikeAPlayer", "/AvatarImageFerreusDemon", "/AvatarImageGlyphFestiveFloof", "/EventGlyphCaviaFibonacci", "/AvatarImageFinlaena", "/AvatarImageFladBox", "/AvatarImagePixelFlare", "/AvatarImageCreatorFlareEyes", "/AvatarImageFloofyDwagon", "/AvatarImageFluffyMiracle", "/ImageFollieBright", "/ImageFollieDark", "/ImageFollieAltBright", "/ImageFollieAltDark", "/KahlSupporterPackGlyph", "/KahlStatueGlyph", "/ImageDeadlockProtocolB", "/AvatarImageFRCommunityDiscord", "/AvatarImageFR4GTP", "/AvatarImageFrancois", "/Halloween2019FrankenCorpus", "/AvatarImageFreddyCaps", "/ImageFrostAuroraBright", "/ImageFrostAuroraDark", "/AvatarImageGlyphSnowGlobeFrost", "/ImageFrostBright", "/ImageFrostDark", "/ImageFrostDeluxe", "/AvatarImageFrostAction", "/ImageFrostPrimeBright", "/ImageFrostPrimeDark", "/AvatarImageGlyphMashedFrostPrime", "/ImageFrostSquallBright", "/ImageFrostSquallDark", "/AvatarImageFrostyNovaPrime", "/AvatarImageFrozenbawz", "/AvatarImageHarcosMagyarokWarframe", "/AvatarImageGamingBitches", "/AvatarImageGara", "/ImageGlassBright", "/ImageGlassDark", "/ImageGaraDeluxe", "/ImageGaraPrimeCommunity", "/ImageGaraPrimeBright", "/ImageGaraPrimeDark", "/ImageGlassAltHelmBright", "/ImageGlassAltHelmDark", "/ImageGarudaAltHelmBright", "/ImageGarudaAltHelmDark", "/ImageGarudaBright", "/ImageGarudaDark", "/ImageGarudaDeluxe", "/ImageGarudaPrimeBright", "/ImageGarudaPrimeDark", "/AvatarImageGastel", "/ImageGaussBright", "/ImageGaussDark", "/ImageGaussDeluxe", "/ImageGaussAltBright", "/ImageGaussAltDark", "/ImageGaussDeluxeII", "/ImageGaussPrimeBright", "/ImageGaussPrimeDark", "/ImageGaussDeluxeIISupporter", "/AvatarImageGamingCommunityExpo", "/AvatarImageGamingCommunityExpoTwentyFour", "/AvatarImage2025GCX", "/AvatarImageGermanCommunityDiscord", "/AvatarImageKubrowKawaii2", "/AvatarImageGingy", "/AvatarImageGir8Tacos", "/AvatarImageGlamShatterskull", "/AvatarImageGlitchyGirl", "/AvatarImageGoguma", "/AvatarImageGoku", "/ImageDeadlockProtocolA", "/AvatarImageGorillaWolfGaming", "/AvatarImageGlyphMemeGreedyMilk", "/ImageGrendelAltBright", "/ImageGrendelAltDark", "/ImageGrendelBright", "/ImageGrendelDark", "/ImageGrendelPrimeBright", "/ImageGrendelPrimeDark", "/ImageGrendelDeluxeIISupporter", "/ImageGrendelDeluxeII", "/AvatarImageKubrowKawaii1", "/AvatarImageGriddark", "/AvatarImageGrimlockePrime", "/AvatarImageGrindHardSquad", "/ImageGrineerBallista", "/ImageGrineerLancer", "/ImageGrineerRoller", "/GuardianCon2018Glyph", "/AvatarImageLotusGuide", "/ImageGyreAltBright", "/ImageGyreAltDark", "/ImageGyreBright", "/ImageGyreDark", "/ImageGyreInAction", "/ImageGyrePrimeBright", "/ImageGyrePrimeDark", "/ImageGyreDeluxe", "/AvatarImageCreatorH3dsh0t", "/AvatarImageHappinessDark", "/ImagePriestAlt2HelmBright", "/ImagePriestAlt2HelmDark", "/ImagePriestBright", "/ImagePriestDark", "/AvatarImageHarrowAction", "/ImageHarrowPrimeBright", "/ImageHarrowPrimeDark", "/ImageHarrowDeluxe", "/ImagePriestAltHelmBright", "/ImagePriestAltHelmDark", "/PlagueStarGlyph", "/AvatarImageHenchAndScrapGlyph", "/ImageIronFrameAltBright", "/ImageIronFrameAltDark", "/ImageHildrynDeluxe", "/ImageIronFrameBright", "/ImageIronFrameDark", "/AvatarImageLowPolyHildryn", "/ImageHildrynPrimeBright", "/ImageHildrynPrimeDark", "/AvatarImageHjemdgGlyph", "/AvatarImageHokuProps", "/AvatarImageHomiInvocado", "/AvatarImageHotsHomStories", "/AvatarImageHunter", "/ImagePirateBright", "/ImagePirateDark", "/ImagePirateKetosBright", "/ImagePirateKetosDark", "/ImageHydroidPrimeBright", "/ImageHydroidPrimeDark", "/ImageHydroidDeluxe", "/AvatarImageHydroidFlag", "/ImagePirateTritonBright", "/ImagePirateTritonDark", "/AvatarImageHydroxate", "/AvatarImageHynkardSector", "/AvatarImageCreatorIflynn", "/AvatarImageIkedo", "/ImageSandmanAnubisBright", "/ImageSandmanAnubisDark", "/ImageSandmanCanopicBright", "/ImageSandmanCanopicDark", "/ImageSandmanBright", "/ImageSandmanDark", "/AvatarImageGlyphComicB", "/ImageInarosPrimeBright", "/ImageInarosPrimeDark", "/ImageInarosDeluxe", "/AvatarImageInexpensiveGamer", "/AvatarImageInfernoTheFirelord", "/GlyphFactionInfested", "/GlyphFactionDeimos", "/AvatarImageGlyphErisTennocon2020Monster", "/AvatarImageInfodiversao", "/AvatarImageInfraredMike", "/AvatarImageIQ", "/AvatarImageIrisillych", "/AvatarImageGlyphMuckneyD", "/AvatarImageToxickToe", "/ImageRangerBright", "/ImageRangerDark", "/AvatarImageGlyphComicD", "/ImageRangerLoxleyBright", "/ImageRangerLoxleyDark", "/ImageIvaraPrimeBright", "/ImageIvaraPrimeDark", "/ImageIvaraDeluxe", "/ImageRangerZirastraBright", "/ImageRangerZirastraDark", "/AvatarImageIvorysMoon", "/AvatarImageIwoply", "/AvatarImageJ3ubbleboy", "/AvatarImageHalloween2021Lotus", "/ImageJadeAltBright", "/ImageJadeAltDark", "/ImageJadeBright", "/ImageJadeDark", "/AvatarImageJadeInActionGlyph", "/AvatarImageCrazyBikerDude", "/RequiemJahuGlyph", "/AvatarImageJamieVoiceOver", "/AvatarImageJandoncom", "/AvatarImageJayNeverwhere", "/AvatarImageJessiThrower", "/AvatarImageGlyphJingleKavat", "/AvatarImageJoeyZero", "/AvatarImageGlyphJollyGrendel", "/AvatarImageJoriale", "/AvatarImageElCanalDeRow", "/AvatarImageJustHailey", "/AvatarImageJustOldPrime", "/AvatarImageJustPlayBP", "/AvatarImageK0yi", "/AvatarImageKillerBarbie", "/KahlCommunityGlyph", "/AvatarImageKalon", "/AvatarImageKalymosConeGlyph", "/AvatarImageKaoiji", "/AvatarImageKavatEnamel", "/AvatarImagePixelKaya", "/ImageGrineerKelaDeThaym", "/AvatarImageKengineer", "/AvatarImageKenshinWF", "/ImageKhoraAltHelmBright", "/ImageKhoraAltHelmDark", "/ImageKhoraBright", "/ImageKhoraDark", "/ImageKhoraPrimeBright", "/ImageKhoraPrimeDark", "/ImageKhoraDeluxe", "/RequiemKhraGlyph", "/ImageInarosMarsGlyph", "/AvatarImageKingGothalion", "/AvatarImageKingKongDonk", "/AvatarImageKingWolby", "/AvatarImageKirarahime", "/AvatarImageKirdy", "/AvatarImageKiwad", "/AvatarImageKoreanCommunityDiscord", "/ImageKoumeiBright", "/ImageKoumeiDark", "/KoumeiSupporterGlyph", "/ImageKoumeiAltBright", "/ImageKoumeiAltDark", "/AvatarImageKr1ptonPlayer", "/AvatarImageKrashOmnis", "/AvatarImageKretduy", "/AvatarImageKubrowEnamel", "/AvatarImageVitruvianGlyphC", "/ImageKullervoDeluxe", "/ImagePaxDuviricusBright", "/ImagePaxDuviricusDark", "/KullervoActionGlyph", "/ImagePaxDuviricusAltBright", "/ImagePaxDuviricusAltDark", "/AvatarImageStarterPackLotus", "/AvatarImageOroKittyEnamel", "/AvatarImagekyaii", "/AvatarImageKyriosYuudai", "/AvatarImageLifewater", "/AvatarImageGlyphLaborAward", "/AvatarImageLadyNovita", "/AvatarImageLadyTheLaddy", "/AvatarImageLaurieeeLG", "/ImageLavosAltBright", "/ImageLavosAltDark", "/ImageLavosBright", "/ImageLavosDark", "/AvatarImageLavosAction", "/ImageLavosDeluxe", "/ImageLavosPrimeBright", "/ImageLavosPrimeDark", "/AvatarImageLeDouble", "/AvatarImageLeamxp", "/AvatarImageLegendaryArkonisAelir", "/AvatarImageLegendaryBlackdeath", "/AvatarImageGlyphLegendaryCelestics", "/AvatarImageLegendaryElof", "/AvatarImageGlyphKiradien", "/AvatarImageGlyphLocoCrazy", "/AvatarImageGlyphMattaus", "/AvatarImageLegendaryOculox", "/AvatarImageLeoDoodling", "/AvatarImageLeonelGM", "/AvatarImageLeyzarViewGaming", "/AvatarImageLifeOfRio", "/AvatarImageLightmicke", "/AvatarImageLightningCosplay", "/AvatarImageLilLexi", "/ImageLimboAristeasBright", "/ImageLimboAristeasDark", "/ImageLimboBright", "/ImageLimboDark", "/ImageLimboDeluxe", "/ImageGraeaeLimboBright", "/ImageGraeaeLimboDark", "/ImageLimboPrimeBright", "/ImageLimboPrimeDark", "/AvatarImageLittleNavi", "/AvatarImageLluull", "/RequiemLohkGlyph", "/AvatarImageLokKingMacho", "/AvatarImageCreatorLokenPlays", "/ImageLokiEnigmaBright", "/ImageLokiEnigmaDark", "/ImageLokiEssenceBright", "/ImageLokiEssenceDark", "/AvatarImageItem8", "/ImageLokiBright", "/ImageLokiDark", "/AvatarImageLokiAction", "/ImageLokiDeluxe", "/AvatarImageLokiChibi", "/ImageLokiPrimeBright", "/ImageLokiPrimeDark", "/ImageLokiSwindleBright", "/ImageLokiSwindleDark", "/AvatarImageLordSaliak", "/AvatarImageLordschaby", "/AvatarImageGlyphMuckneyA", "/AvatarImageLotusChangeOfPlansGlyph", "/ImageLotusDeluxe", "/AvatarImageLotusKawaii", "/AvatarImageLuality", "/AvatarImageLucianPlaysAllDay", "/AvatarImageCreatorLunskee", "/AvatarImageLynxaria", "/AvatarImageLyonAllardMistletoeGlyph", "/AvatarImageMCIK", "/AvatarImageHypercaptai", "/SchoolDecalMadurai", "/ImageMagCoilBright", "/ImageMagCoilDark", "/ImageMagGaussBright", "/ImageMagGaussDark", "/AvatarImageItem5", "/ImageMagBright", "/ImageMagDark", "/AvatarImageMagAction", "/AvatarImageMagChibi", "/ImageMagDeluxe", "/ImageMagPrimeBright", "/ImageMagPrimeDark", "/AvatarImageMakarimorph", "/AvatarImageGlyphMAWEli", "/AvatarImageManInTheWallCommunity", "/AvatarImageMaomix", "/AvatarImageMarcoMeatball", "/AvatarImageMarieLerouxMistletoeGlyph", "/AvatarImageGlyphComicE", "/AvatarImageMCMonkeys", "/AvatarImageMCGamerCZ", "/AvatarImageMeCore", "/AvatarImageMedusaCaptures", "/AvatarImageMemeSage", "/AvatarImageMesaEnamel", "/ImageGunslingerBright", "/ImageGunslingerDark", "/HeirloomMesaGlyph", "/MesaHighNoonGlyph", "/ImageGunslingerAltBright", "/ImageGunslingerAltDark", "/AvatarImageOkinaGlyph", "/ImageMesaCortesBright", "/ImageMesaCortesDark", "/ImageGunslingerDeluxe", "/ImageMesaPrimeBright", "/ImageMesaPrimeDark", "/ImageMesaDeluxeB", "/ImageTennogenLocoCrazy", "/AvatarImageMGLblaze", "/AvatarImageMHBlacky", "/AvatarImageSuperxinvader", "/AvatarImageTheNextLevel", "/AvatarImageTVSBOH", "/AvatarImagePixelMinerva", "/ImageMirageBright", "/ImageMirageDark", "/ImageMirageHarlequinBright", "/ImageMirageHarlequinDark", "/ImageMirageInAction", "/AvatarImageGlyphMashedMirage", "/ImageMirageDeluxe", "/ImageMiragePrimeBright", "/ImageMiragePrimeDark", "/ImageTravelinMirageBright", "/ImageTravelinMirageDark", "/AvatarImageMischka", "/AvatarImageMissFwuffy", "/AvatarImageTennoForever", "/AvatarImageMjikThize", "/AvatarImageMK3Gaming", "/ImageCorpusMoa", "/AvatarImageCreatorMogamu", "/AvatarImageMooha", "/ImageTennogenEpsilon", "/AvatarImageGlyphMuckneyI", "/AvatarImageChillingGlyphFour", "/AvatarImageMovemberBaruukBright", "/AvatarImageMovemberBaruukBW", "/AvatarImageMovember", "/AvatarImageMozetas", "/AvatarImageMrMorgenstern", "/AvatarImageMrRoadBlock", "/AvatarImageMrSteelWar", "/AvatarImageMrWarframeGuy", "/AvatarImageHalloween2021Loid", "/AvatarImageMuSingTian", "/AvatarImageMylah", "/AvatarImageGlyphMuckneyG", "/AvatarImageCreatorN00blShowtek", "/SchoolDecalNaramon", "/NarmerEyeGlyph", "/AvatarImageGlyphStarterPackA", "/AvatarImageNeavo", "/TwitchNecraloidGlyph", "/ImageCorpusNefAnyo", "/AvatarImageGlyphMashedNefAnyo", "/AvatarImageNekrokrim", "/AvatarImageNekrosCalaca", "/ImageNekrosBright", "/ImageNekrosDark", "/AvatarImageNekrosAction", "/ImageNekrosDeluxe", "/ImageNekrosPrimeBright", "/ImageNekrosPrimeDark", "/ImageNekrosAraknidBright", "/ImageNekrosAraknidDark", "/ImageNekrosShroudBright", "/ImageNekrosShroudDark", "/AvatarImageNelosart", "/AvatarImageNeoNess", "/RequiemNetraGlyph", "/ImageSyndicateNL", "/ImageNezhaAltBright", "/ImageNezhaAltDark", "/ImageNezhaDeluxe", "/ImageNezhaBright", "/ImageNezhaDark", "/ImageNezhaAlt2Bright", "/ImageNezhaAlt2Dark", "/ImageNezhaPrimeBright", "/ImageNezhaPrimeDark", "/ImageNidusBright", "/ImageNidusDark", "/AvatarImageGlyphComicA", "/ImageNidusDeluxe", "/ImageNidusDeluxeMutated", "/ImageNidusPrimeBright", "/ImageNidusPrimeDark", "/ImageNidusPrionBright", "/ImageNidusPrionDark", "/AvatarImageVitruvianGlyphD", "/ImageNokkoBright", "/ImageNokkoDark", "/ImageNokkoAltBright", "/ImageNokkoAltDark", "/AvatarImageNononom", "/AvatarImageNoSympathyy", "/ImageNovaDeluxe", "/ImageNovaDeluxeII", "/ImageNovaAltBright", "/ImageNovaAltDark", "/ImageNovaBright", "/ImageNovaDark", "/AvatarImageNovaAction", "/ImageNovaPrimeBright", "/ImageNovaPrimeDark", "/ImageNovaQuantumBright", "/ImageNovaQuantumDark", "/ImageNovaSlipstreamBright", "/ImageNovaSlipstreamDark", "/AvatarImagenponesixtyone", "/AvatarImageNRDabears", "/Image2019Twitter", "/ImageNyxBright", "/ImageNyxDark", "/AvatarImageNyxAction", "/ImageNyxMenticideBright", "/ImageNyxMenticideDark", "/ImageNyxNemesis", "/ImageNyxDeluxe", "/ImageNyxPrimeBright", "/ImageNyxPrimeDark", "/AvatarImageGlyphMashedNyxPrime", "/ImageNyxVespaBright", "/ImageNyxVespaDark", "/AvatarImageNyxxtv", "/ImageOberonDeluxe", "/ImageOberonBright", "/ImageOberonDark", "/ImageOberonMarkhorBright", "/ImageOberonMarkhorDark", "/AvatarImageGlyphMashedOberon", "/ImageOberonAltBright", "/ImageOberonAltDark", "/ImageOberonPrimeBright", "/ImageOberonPrimeDark", "/ImageOctaviaCadenzaBright", "/ImageOctaviaCadenzaDark", "/ImageOctaviaBright", "/ImageOctaviaDark", "/AvatarImageGlyphComicC", "/AvatarImageOctaviaAction", "/AvatarImageOctaviaActionTwitch", "/ImageOctaviaDeluxe", "/ImageOctaviaPrimeBright", "/ImageOctaviaPrimeDark", "/AvatarImageOddieowl", "/AvatarImageOldGamer", "/AvatarImageOldDirtyDaz", "/AvatarImageOmniVoice", "/AvatarImageOOSIJ", "/ImageOraxiaAltBright", "/ImageOraxiaAltDark", "/ImageOraxiaBright", "/ImageOraxiaDark", "/AvatarImageGlyphMuckneyC", "/AvatarImageOriginalGamers", "/AvatarImageCreatorOriginalWickedfun", "/GlyphFactionOrokin", "/AvatarImageOrpheusDeluxe", "/ImageCorpusOsprey", "/AvatarImageOttofyre", "/AvatarImageOzku", "/AvatarImagePammyJammy", "/AvatarImagePandaahhhhh", "/AvatarImagePapaTLion", "/AvatarImagePartyCDGlyph", "/AvatarImageChillingGlyphTwo", "/ImageSyndicatePS", "/AvatarImagePhongFu", "/AvatarImageGlyphMemeShorts", "/AvatarImagePixelReboot", "/AvatarImagePlagueDirector", "/AvatarImagePlexiCosplay", "/AvatarImagePokketNinja", "/AvatarImagePorongo", "/AvatarImagePorphi", "/AvatarImagePostiTV", "/AvatarImageGlyphMemePotato", "/AvatarImagePrettyPoison", "/AvatarImagePrimedSoonGlyph", "/AvatarImagePrimedAverage", "/AvatarImageGlyphMemeProdman", "/AvatarImageProfessorBroman", "/ImageProteaDeluxe", "/ImageProteaBright", "/ImageProteaDark", "/ImageProteaAltTwoBright", "/ImageProteaAltTwoDark", "/ImageProteaPrimeBright", "/ImageProteaPrimeDark", "/ImageProteaAltBright", "/ImageProteaAltDark", "/AvatarImageHalloween2021Pumpkin", "/AvatarImagePunchL1ne", "/AvatarImagePurkinje", "/AvatarImagePurpleFlurp", "/AvatarImagePyrah", "/AvatarImagePyrrhicSerenity", "/ImageQorvexBright", "/ImageQorvexDark", "/ImageQorvexAltBright", "/ImageQorvexAltDark", "/AvatarImageQuadlyStop", "/AvatarImageQueenMisrule", "/AvatarImageCreatorQuiteShallow", "/AvatarImageQynchou", "/AvatarImageRagey", "/AvatarImageRagingTerror", "/AvatarImageRahetalius", "/AvatarImageRahny", "/ImageRailjackInAction", "/AvatarImageRainbowWaffles", "/AvatarImageRandomSurge", "/AvatarImageRavenZ", "/AvatarImageRawSteelClan", "/AvatarImageRebeccaWeress", "/AvatarImageReclaimJoey", "/ImageSyndicateRV", "/AvatarImageReddit", "/AvatarImageRedX", "/AvatarImageRegisteredLoserGlyph", "/AvatarImageRelentlessZen", "/AvatarImageRelli", "/AvatarImageRetroAlchemist", "/ImageRevenantBright", "/ImageRevenantDark", "/ImageRevenantDeluxe", "/ImageRevenantPrimeBright", "/ImageRevenantPrimeDark", "/ImageRevenantAltHelmBright", "/ImageRevenantAltHelmDark", "/AvatarImageRevengal", "/AvatarImageReyGanso", "/ImageRhinoDeluxeTwo", "/ImageRhinoBright", "/ImageRhinoDark", "/HeirloomRhinoGlyph", "/AvatarImageRhinoAction", "/AvatarImageRhinoChibi", "/ImageRhinoDeluxe", "/ImageRhinoPrimeBright", "/ImageRhinoPrimeDark", "/ImageRhinoThrakBright", "/ImageRhinoThrakDark", "/ImageRhinoVanguardBright", "/ImageRhinoVanguardDark", "/AvatarImageRickunPrime", "/AvatarImageRiesling", "/AvatarImageRIKENZ", "/AvatarImageRippz0r", "/RequiemRisGlyph", "/AvatarImageRitens", "/AvatarImageRLCGaming", "/AvatarImageRoatheMistletoeGlyph", "/AvatarImageRoyGaming", "/AvatarImageRoyalPrat", "/AvatarImageRundas", "/AvatarImageRustyFin", "/AvatarImageS0lstep", "/AvatarImageSabaiGuy", "/AvatarImageSabuuchi", "/AvatarImageVitruvianGlyphE", "/AvatarImageSapmatic", "/AvatarImageSarahTsang", "/ImageGrineerSargusRuk", "/ImageSarynChloraBright", "/ImageSarynChloraDark", "/ImageSarynBright", "/ImageSarynDark", "/ImageSarynHemlockBright", "/ImageSarynHemlockDark", "/AvatarImageSarynAction", "/ImageSarynDeluxe", "/ImageSarynPrimeBright", "/ImageSarynPrimeDark", "/AvatarImageSassyLotusGlyph", "/AvatarImageSaturnSixBarDiscord", "/SavePopcornGlyph", "/AvatarImageScallion", "/AvatarImageInarosScarabs", "/ImageScarletSpearGroundI", "/ImageScarletSpearGroundII", "/ImageScarletSpearGroundIII", "/ImageScarletSpearSpaceI", "/ImageScarletSpearSpaceII", "/ImageScarletSpearSpaceIII", "/ImageScarletSpearOperationI", "/ImageScarletSpearOperationII", "/ImageScarletSpearOperationIII", "/AvatarImageScarletMoon", "/AvatarImageAlthani", "/AvatarImageSealsdie", "/AvatarImageSearyn", "/AvatarImageSecriotMcFly", "/AvatarImageSeleste", "/Halloween2019GhoulGrave", "/AvatarImageChillingGlyphThree", "/AvatarImageSerafimPT", "/AvatarImageBBSChainWarden", "/AvatarImageSerganlkari", "/ImageSevagothDeluxe", "/ImageWraithBright", "/ImageWraithDark", "/AvatarImageSevagothAction", "/ImageWraithAltBright", "/ImageWraithAltDark", "/ImageSevagothPrimeBright", "/ImageSevagothPrimeDark", "/AvatarImageShadowFoxx", "/AvatarImageChillingGlyphOne", "/AvatarImageShanksy", "/AvatarImageSharlazard", "/AvatarImageShenpai", "/AvatarImageShenzhao", "/AvatarImageSherpaRage", "/AvatarImageShinobiFufu", "/AvatarImageShulGaming", "/AvatarImageShyAnaBanana", "/AvatarImageSiejoUmbra", "/AvatarImageSilentMashiko", "/AvatarImageSillfix", "/AvatarImageWarframeFR", "/AvatarImageSilvervale", "/ImageSiriusOrionBright", "/ImageSiriusOrionDark", "/AvatarImageGlyphSkiGauss", "/AvatarImageSkillUp", "/AvatarImageSlapsticklogic", "/Halloween2019SlimeLoki", "/AvatarImageSlivarito", "/AvatarImageSlycker", "/AvatarImageSmashley", "/AvatarImageSmettbonia", "/AvatarImageSmoodie", "/AvatarImageSn0wRC", "/AvatarImageVGWFR", "/AvatarImageSnootyDeath", "/AvatarImageCreatorSnowLit", "/AvatarImageWinter2016A", "/AvatarImageWinter2016B", "/AvatarImageWinter2016C", "/AvatarImageWinter2016D", "/AvatarImageGlyphMuckneyB", "/AvatarImageKubrowKawaii3", "/AvatarImageSp00nerism", "/AvatarImageSpacebeastx", "/AvatarImageSpaceWaifu", "/AvatarImageSpandy", "/AvatarImageSpecialEffectGlyph", "/AvatarImageSpiritualJedi", "/AvatarImageGlyphMashedStalker", "/AvatarImageStallordD", "/AvatarImageStarfinderSocietyGlyph", "/ImageSyndicateSM", "/AvatarImageStormcrown", "/AvatarImageStr8opticroyal", "/AvatarImageStreamingDownUnder", "/AvatarImageStrippin", "/AvatarImageStrongArmy", "/AvatarImageStudioCyen", "/ImageStyanaxAltCBright", "/ImageStyanaxAltCDark", "/ImageStyanaxAltDBright", "/ImageStyanaxAltDDark", "/ImageStyanaxBright", "/ImageStyanaxDark", "/ImageStyanaxInAction", "/ImageStyanaxPrimeBright", "/ImageStyanaxPrimeDark", "/ImageStyanaxAltBBright", "/ImageStyanaxAltBDark", "/ImageStyanaxDeluxe", "/AvatarImageSummerYuko", "/AvatarImageSummit1G", "/AvatarImageGlyphMuckneyJ", "/AvatarImageGlyphSurpriseIvara", "/AvatarImageCreatorTacticalPotato", "/EventGlyphCaviaTagfer", "/AvatarImageCreatorTanchan", "/OldPeaceTeaserGlyph", "/AvatarImageTavierCorsair", "/AvatarImageTBGKaru", "/AvatarImageTCN", "/AvatarImageTeawrex", "/ImageTempleBright", "/ImageTempleDark", "/TempleSupporterGlyph", "/ImageTempleAltBright", "/ImageTempleAltDark", "/TennoCon2023MerchGlyph", "/AvatarImageTdefton", "/AvatarImageTennoHelp", "/AvatarImageGlyphMuckneyF", "/AvatarImageTennoTranslator", "/TennoCon2017Glyph", "/TennoCon2018Glyph", "/TennoCon2019Glyph", "/Gamification2019Glyph", "/TennoCon2019SimarisGlyph", "/TennoCon2020Glyph", "/TennoCon2021Glyph", "/TennoCon2021MerchGlyph", "/TennoCon2022Glyph", "/TennoCon2022MerchGlyph", "/TennoCon2023BestInShowAwardGlyph", "/TennoCon2023CutenessAwardGlyph", "/TennoCon2023BestPetAwardGlyph", "/TennoCon2023FunniestAwardGlyph", "/TennoCon2023BestWorkmanshipAwardGlyph", "/TennoCon2023Glyph", "/TennoCon2024CutenessAwardGlyph", "/TennoCon2024BestPetAwardGlyph", "/TennoCon2024FunniestAwardGlyph", "/TennoCon2024BestInShowAwardGlyph", "/TennoCon2024BestWorkmanshipAwardGlyph", "/TennoCon2024Glyph", "/TennoCon2025FirstPlaceAwardGlyph", "/TennoCon2025SecondPlaceAwardGlyph", "/TennoCon2025ThirdPlaceAwardGlyph", "/TennoCon2025Glyph", "/TennoCon2026FirstPlaceAwardGlyph", "/TennoCon2026SecondPlaceAwardGlyph", "/TennoCon2026ThirdPlaceAwardGlyph", "/TennoCon2026BombasticAwardGlyph", "/TennoCon2026LotusChoiceAwardGlyph", "/TennoCon2026OrokinGoldAwardGlyph", "/TennoCon2026OstronIngenuityAwardGlyph", "/TennoCon2026BestWorkmanshipAwardGlyph", "/TennoCon2026CommunityArtShowcaseGlyph", "/TennoCon2026Glyph", "/AvatarImageTennoGen", "/TennoCon2020SimarisGlyph", "/AvatarImageTennoVIP2Glyph", "/AvatarImageTennoVIP", "/AvatarImageTennoVIP2026Glyph", "/AvatarImageTennoVIPXian2026Glpyh", "/AvatarImageTeshinVed", "/ImageTennogenDynline", "/ImageCorpusJackal", "/ImageTennogenInkary", "/ImageTennogenSharksteeth", "/AvatarImageTheDorTip", "/AvatarImageTheGamio", "/AvatarImageTheLadyEgo", "/AvatarImageThePandaNEight", "/AvatarImageTheReaperHunter", "/Xmas2023ThraxGlyph", "/AvatarImageThreshconeKawaii", "/AvatarImageDrakeRifle", "/AvatarImageTinBears", "/AvatarImageTioMario", "/AvatarImageTioRamon", "/ImageTitaniaAltBright", "/ImageTitaniaAltDark", "/ImageTitaniaDeluxeII", "/ImageTitaniaDeluxe", "/ImageTitaniaBright", "/ImageTitaniaDark", "/ImageTitaniaPrimeBright", "/ImageTitaniaPrimeDark", "/AvatarImageToastedTV", "/AvatarImageSzczebrzeszyniarz", "/AvatarImageTorkie", "/AvatarImageDayTotalN3wb", "/AvatarImageToYou", "/AvatarImageTrainsyTv", "/ImageTennogenFabpsi", "/AvatarImageTrashFrame", "/AvatarImageTriburos", "/Halloween2019TrickOrBalas", "/ImageTrinityAuraBright", "/ImageTrinityAuraDark", "/ImageTrinityBright", "/ImageTrinityDark", "/AvatarImageTrinityAction", "/ImageTrinityMeridianBright", "/ImageTrinityMeridianDark", "/ImageTrinityPrimeBright", "/ImageTrinityPrimeDark", "/ImageTrinityDeluxe", "/AvatarImageTrysmj", "/AvatarImageTwila", "/AvatarImageTyFighter", "/AvatarImageTygastripe", "/AvatarImageTylRegorGenesGlyph", "/AvatarImageUmbraAction", "/SchoolDecalUnairu", "/AvatarImageUncleCat", "/AvatarImageUnrealTournament", "/AvatarImageUnrealYuki", "/AvatarImageUpsideDownSmore", "/AvatarImageUreiFen", "/ImageUrielAltBright", "/ImageUrielAltDark", "/ImageUrielBright", "/ImageUrielDark", "/ImageValaCommunity", "/ImageValkyrBastetBright", "/ImageValkyrBastetDark", "/ImageValkyrDeluxeB", "/ImageValkyrDeluxe", "/ImageValkyrBright", "/ImageValkyrDark", "/HeirloomValkyrGlyph", "/AvatarImageValkyrAction", "/ImageValkyrKaraBright", "/ImageValkyrKaraDark", "/ImageValkyrPrimeBright", "/ImageValkyrPrimeDark", "/AvatarImageVamppire", "/AvatarImageVanthesque", "/AvatarImageVitruvianGlyphB", "/AvatarImageVarlinator", "/AvatarImageVashCowaii", "/AvatarImageVashka", "/ImageTrapperSoldierBright", "/ImageTrapperSoldierDark", "/ImageVaubanDeluxe", "/ImageTrapperAltBright", "/ImageTrapperAltDark", "/ImageTrapperGambitBright", "/ImageTrapperGambitDark", "/ImageTrapperBright", "/ImageTrapperDark", "/HeirloomVaubanGlyph", "/HeirloomVaubanGlyphSumo", "/AvatarImageVaubanAction", "/ImageVaubanPrimeBright", "/ImageVaubanPrimeDark", "/SchoolDecalVazarin", "/AvatarImageVecToR", "/AvatarImagePixelVelimir", "/AvatarImageGlyphDesignerVentersEmber", "/AvatarImageGlyphDesignerVentersMirage", "/AvatarImageGlyphDesignerVentersRegor", "/AvatarImageGlyphDesignerVentersHek", "/AvatarImageGlyphDesignerVentersAtlas", "/AvatarImageGlyphDesignerVentersVolt", "/AvatarImageVernoc", "/AvatarImageVeroz", "/AvatarImageLokiActionTwitch", "/AvatarImageCleoNaturin", "/AvatarImageVladislavaLynx", "/AvatarImageVnorberto", "/AvatarImageGlyphErisTennocon2020Gate", "/AvatarImageGlyphErisTennocon2020Bird", "/AvatarImageVoidFissureBR", "/AvatarImageVoli", "/AvatarImageVolkeris", "/ImageVoltDeluxeB", "/ImageVoltBright", "/ImageVoltDark", "/AvatarImageVoltAction", "/ImageVoltPrimeBright", "/ImageVoltPrimeDark", "/ImageVoltDeluxe", "/ImageVoltPulseBright", "/ImageVoltPulseDark", "/ImageVoltStormBright", "/ImageVoltStormDark", "/AvatarImageVoltTheHero", "/RequiemVomeGlyph", "/AvatarImageVorKawaii", "/AvatarImageVorticoseline", "/ImageVorunaAltBright", "/ImageVorunaAltDark", "/ImageVorunaBright", "/ImageVorunaDark", "/ImageVorunaDeluxe", "/ImageVorunaPrimeBright", "/ImageVorunaPrimeDark", "/AvatarImageCreatorVVhiteAngel", "/AvatarImageWalterDV", "/AvatarImageWanderbots", "/AvatarImageCommunityDiscord", "/AvatarImagePartnerUpdated", "/AvatarImageWarframeMadness", "/AvatarImageExcaliburMobile", "/AvatarImagePartner", "/AvatarImagePartnerMug", "/AvatarImageWarframeRunway", "/AvatarImageTennoChronicler", "/AvatarImageMadrinas", "/AvatarImageWarframeFanChannel", "/AvatarImageWarframeFlo", "/AvatarImageWarframeReliquary", "/AvatarImageWDTortoise", "/AvatarImageWealWest", "/Halloween2019Werefested", "/AvatarImageWhiskeyCat", "/AvatarImageWidescreenJohn", "/AvatarImageWinterB2016A", "/AvatarImageWinterB2016B", "/AvatarImageWinterB2016C", "/AvatarImageWinterB2016D", "/AvatarImageWinter2017B", "/AvatarImageWinterB2016E", "/AvatarImageWinterB2016F", "/AvatarImageWinterB2016G", "/AvatarImageWinter2017A", "/AvatarImageWinter2017C", "/AvatarImageWinter2017D", "/AvatarImageWinter2017E", "/AvatarImageWinter2017F", "/AvatarImageWinter2018A", "/AvatarImageWinter2018B", "/AvatarImageWinter2018C", "/AvatarImageWinter2018D", "/AvatarImageWinter2018E", "/ImageWispAltBright", "/ImageWispAltDark", "/ImageWispBright", "/ImageWispDark", "/ImageWispChibi", "/ImageWispPrimeBright", "/ImageWispPrimeDark", "/ImageWispDeluxe", "/AvatarImageWobbzie", "/AvatarImageWoxli", "/ImageMonkeyKingAltBright", "/ImageMonkeyKingAltDark", "/ImageMonkeyKingBright", "/ImageMonkeyKingDark", "/ImageMonkeyKingMacakBright", "/ImageMonkeyKingMacakDark", "/ImageWukongPrimeBright", "/ImageWukongPrimeDark", "/ImageWukongDeluxeB", "/ImageWukongDeluxe", "/ImageWukongDeluxeVED", "/ImageWukongDeluxeBSupporter", "/AvatarImageX3lp", "/ImageBrokenFrameBright", "/ImageBrokenFrameDark", "/ImageXakuDeluxe", "/ImageBrokenFrameAltBright", "/ImageBrokenFrameAltDark", "/ImageXakuDeluxeKintsugi", "/ImageXakuPrimeBright", "/ImageXakuPrimeDark", "/AvatarImageXandyPants", "/RequiemXataGlyph", "/AvatarImageCreatorXenogelion", "/AvatarImageXiaRose", "/AvatarImagexOGxSkeezy", "/AvatarImageXxVampixx", "/AvatarImageYantzi", "/ImageYareliCommunity", "/ImageYareliBright", "/ImageYareliDark", "/AvatarImageYareliAction", "/ImageYareliDeluxe", "/ImageYareliAltBright", "/ImageYareliAltDark", "/ImageYareliPrimeBright", "/ImageYareliPrimeDark", "/AvatarImageYourLuckyClover", "/AvatarImageZakguo", "/AvatarImageZanagoth", "/AvatarImageZarimanLogo", "/AvatarImageZarimanSupporterPackGlyph", "/AvatarImageZarionis", "/SchoolDecalZenurik", "/ImageZephyrCierzoBright", "/ImageZephyrCierzoDark", "/ImageZephyrBright", "/ImageZephyrDark", "/ImageZephyrDeluxe", "/ImageZephyrPrimeBright", "/ImageZephyrPrimeDark", "/ImageZephyrTenguBright", "/ImageZephyrTenguDark", "/AvatarImageZexiontat", "/AvatarImagezKoichi", "/AvatarImageZopney", "/AvatarImageZotbot", "/AvatarImageZxpfer", "/AvatarImageDesRPG", "/AvatarImageDramakins", "/AvatarImageKacchi", "/AvatarImageLovinDaTacos", "/AvatarImageSenastra", "/AvatarImageCreatorWgrates", "/AvatarImageDefault", "/ImageConquera2022B", "/ImageConquera2022C", "/ImageConquera2022D", "/AvatarImageHalloween2021Grineer", "/AvatarImageDogDays2024VorunaGlyph", "/AvatarImageDogDays2024YareliGlyph", "/AvatarImageDogDays2024LavosGlyph"];
const HELMET_EXCLUDE_END		= ["/TrinityHelmetAlt", "/FrostHelmetAlt", "/ExcaliburHelmetAlt", "/EmberHelmetAltB", "/AspAltHelmetB", "/DecreeAltHelmetB", "/MagHelmetAlt", "/TrapperHelmetAlt", "/LokiHelmetAlt", "/AntiAltHelmet", "/TrapperHelmetAltB", "/AspAltHelmet", "/NinjaHelmetAltB", "/JadeHelmetAlt", "/TrinityHelmetAltB", "/ExcaliburHelmetAltB", "/EmberHelmetAlt", "/VoltHelmetAltB", "/DecreeAltHelmet", "/NinjaHelmetAlt", "/FrostHelmetAltB", "/VoltHelmetAlt", "/LokiHelmetAltB", "/RhinoHelmetAlt", "/RhinoHelmetAltB", "/JadeHelmetAltB", "/KahlHelmetWater", "/SWBaihuHelmet", "/SWRSixAshCarabidHelmet", "/NinjaHelmet", "/SWIchneumonHelmet", "/NinjaDeluxeHelmet", "/AshPrimeHelmet", "/SWRyugaHelmet", "/AshDeluxeHelmet", "/SWTsukuyomiHelmet", "/SWRFiveAtlasArhatHelmet", "/SWAtlasBotLHelmet", "/SWAtlasGraxxHelmet", "/BrawlerHelmet", "/AtlasDeluxeHelmet", "/SWMonolithHelmet", "/AtlasPrimeHelmet", "/SWRSixAtlasTelamonHelmet", "/SWBansheeBotLHelmet", "/SWDominiaHelmet", "/SWRSixBansheeEchoHelmet", "/DecreeHelmet", "/BansheePrimeHelmet", "/SWSonorityHelmet", "/BansheeDeluxeHelmet", "/BansheeVoidShellHelmet", "/SWBedouinHelmet", "/SWBaruukBotlHelmet", "/BaruukDeluxeHelmet", "/SWBaruukGraxxHelmet", "/PacifistHelmet", "/SWBaruukPeacemakerHelmet", "/BaruukPrimeHelmet", "/BaruukDeluxeIIHelmet", "/SWShiraanHelmet", "/SWBaruukZamariuHelmet", "/ThanomechVoidRigDefaultHelmet", "/CYRhinoRubedoSkinHelmet", "/NecraMechCHelmetA", "/SentientHelmet", "/CalibanDeluxeHelmet", "/CalibanPrimeHelmet", "/SWCalibanScionHelmet", "/ChromaDeluxeHelmet", "/SWGraxxChromaHelmet", "/DragonHelmet", "/SWRThreeKaijuHelmet", "/SWMorkaiHelmet", "/ChromaPrimeHelmet", "/SWRThreeTarrasqueHelmet", "/SWThyrusHelmet", "/ChromaLNYHelmet", "/CitrineDeluxeHelmet", "/SWCitrineCelestisHelmet", "/GeodeHelmet", "/KahlHelmetTall", "/NecraMechCHelmetB", "/FrumentariusHelmet", "/DagathHelmet", "/DagathImmortalHelmet", "/SWVoiddaxHelmet", "/DagathDeluxeLNYHelmet", "/SWYhavanDagathSkinHelmet", "/PagemasterHelmet", "/PagemasterDeluxeHelmet", "/VoidrigDOTDHelmet", "/SWRSixEmberGraxxHelmet", "/EmberHeirloomHelmet", "/EmberHelmet", "/SWIgnitionHelmet", "/SWMagestyHelmet", "/EmberPrimeHelmet", "/EmberDeluxeIIHelmet", "/SWTechnopyreHelmet", "/EmberDeluxeHelmet", "/EmberVoidshellHelmet", "/EquinoxDeluxeHelmet", "/SWDivisaHelmet", "/AnimaHelmet", "/SWInsomniaHelmet", "/SWMegaeraHelmet", "/SWEquinoxOmniCombinedHelmet", "/EquinoxPrimeHelmet", "/DiscordExcaliburHelmet", "/SWRFourExcaliburApexHelmet", "/SWArturiusExcaliburHelmet", "/SWExcaliburBotLHelmet", "/SWRFourExcaliburCadutoHelmet", "/SWCorpraHelmet", "/ExcaliburDexHelmet", "/SWExaltationHelmet", "/SWRFourExcaliburGraxxHelmet", "/SWRFourGraxxAltHelmet", "/ExcaliburHelmet", "/SWIonExcaliburHelmet", "/SWIsurusExcaliburHelmet", "/ExcaliburXBoneSkinHelmet", "/ObsidianExcaliburHelmetB", "/ExcaliburPSPlusSkinHelmet", "/SWOgrantExcaliburHelmet", "/EsteemExcaliburHelmet", "/NintendoExcaliburHelmet", "/ExcaliburPrimeHelmet", "/VTExcaliburAvalonHelmet", "/VTExcaliburHelmet", "/VTExcaliburPendragonHelmet", "/ExcaliburTwitchSkinHelmet", "/ExcaliburProtoHelmet", "/SWRoninHelmet", "/SWRThreeSentientSlayerHelmet", "/ExcaliburUmbraHelmet", "/UmbraAltHelmet", "/ExcaliburUmbraAltHelmet", "/ExcaliburHelmetSWROne", "/ExcaliburVeilBreakerHelmet", "/ExcaliburDeluxeHelmet", "/InkblotHelmet", "/SWRSixFrostEmperorHelmet", "/SWRThreeFrostGrostHelmet", "/SWRThreeFrostHailstormHelmet", "/FrostDeluxeHelmet", "/FrostHeirloomHelmet", "/FrostHelmet", "/SWHimavatHelmet", "/SWHisameHelmet", "/SWIonFrostHelmet", "/SWRFourFrostJotunHelmet", "/SWMantaZHelmet", "/NintendoFrostHelmet", "/FrostPrimeHelmet", "/SWStrigidHelmet", "/SWSummitHelmet", "/FrostVoidShellHelmet", "/SWRThreeFrostVojnikHelmet", "/SWRThreeFrostZastrugaHelmet", "/SWGaraAdoraHelmet", "/GlassHelmet", "/GlassDeluxeHelmet", "/GaraPrimeHelmet", "/SWRouenHelmet", "/SWSilicaHelmet", "/SWZamariuHelmet", "/GarudaHelmet", "/GarudaDeluxeHelmet", "/GarudaPrimeHelmet", "/SWSakhuraHelmet", "/SWSuccessorHelmet", "/SWGarudaTengushinHelmet", "/SWTiamatHelmet", "/SWGaussAgitoHelmet", "/SWGaussGraxxHelmet", "/RunnerHelmet", "/GaussDeluxeHelmet", "/GaussDeluxeIIHelmet", "/SWGaussNitrolystHelmet", "/GaussPrimeAltHelmet", "/GaussPrimeHelmet", "/SWProfitasHelmet", "/KahlHelmetStandard", "/DevourerHelmet", "/SWMolochHelmet", "/GrendelDeluxeHelmet", "/GrendelPrimeHelmet", "/GrendelDeluxeIIHelmet", "/GrendelVoidshellHelmet", "/GyreHelmet", "/SWGyreKuvealMonarchHelmet", "/GyrePrimeHelmet", "/GyreDeluxeHelmet", "/SWAlgalystHelmet", "/SWGraxxHarrowHelmet", "/PriestHelmet", "/SWHierophaHelmet", "/HarrowPrimeHelmet", "/SWProfitasHarrowHelmet", "/HarrowDeluxeHelmet", "/SWVelesHelmet", "/TeshinArmourHead", "/HoodAdultDaxA", "/ShieldDeluxeHelmet", "/IronFrameHelmet", "/HildrynPrimeHelmet", "/SWHildrynSarcostemaHelmet", "/SWHildrynSigrunHelmet", "/SWGraxxHydroidHelmet", "/PirateDefaultHelmet", "/SWKarkinosHelmet", "/SWPoseidonHelmet", "/HydroidPrimeDefaultHelmet", "/HydroidDeluxeHelmet", "/SWRorqualHelmet", "/SandmanHelmet", "/SWHorusHelmet", "/SWKephriHelmet", "/MummyAlt03Helmet", "/SWOzymandiasHelmet", "/InarosPrimeHelmet", "/InarosDeluxeHelmet", "/TefilahIridosHelmet", "/SWArcuataHelmet", "/SWAstreaHelmet", "/SWIvaraGraxxHelmet", "/RangerHelmet", "/SWKuvaelHelmet", "/ObsidianIvaraHelmet", "/IvaraPrimeHelmet", "/IvaraDeluxeHelmet", "/SWYoukaiHelmet", "/SWIvaraZamariuHelmet", "/ChoirHelmet", "/JadeImmortalHelmet", "/DrifterNightwave1999Helmet", "/OperatorNightwave1999Helmet", "/InfestedNecraMechHelmet", "/SWKhoraFieraHelmet", "/SWKhoraGraxxHelmet", "/KhoraHelmet", "/SWLaveauHelmet", "/SWKhoraMithraHelmet", "/SWKhoraOiranHelmet", "/KhoraPrimeHelmet", "/KhoraPrimeAltHelmet", "/KhoraDeluxeHelmet", "/KoumeiHelmet", "/KulervoDeluxeHelmet", "/SWPaxAscophiliaHelmet", "/PaxDuviricusHelmet", "/HoodAdultDaxB", "/HoodDaxB", "/AlchemistHelmet", "/AlchemistDeluxeHelmet", "/SWLavosKuvaelHelmet", "/LavosPrimeHelmet", "/SWYersinHelmet", "/SWAureolusHelmet", "/SWLimboGraxxHelmet", "/MagicianHelmet", "/LimboDeluxeHelmet", "/LimboPrimeHelmet", "/SWVasionaHelmet", "/SWVenariHelmet", "/SWVistyxioHelmet", "/LimboVoidshellHelmet", "/SWErebusHelmet", "/SWRFourLokiErsatzHelmet", "/LokiHelmet", "/SWIncubusHelmet", "/SWJotunheimHelmet", "/LokiDeluxeHelmet", "/SWKodamaHelmet", "/SWLupuHelmet", "/NintendoLokitHelmet", "/LokiPrimeHelmet", "/SWRFiveLokiRogueHelmet", "/LokiTwitchHelmet", "/LokiVoidShellHelmet", "/SWRThreeAlataHelmet", "/DiscordMagHelmet", "/SWAnthroMagHelmet", "/SWMagCelestisHelmet", "/SWCorpraMagHelmet", "/SWFerroHelmet", "/SWGraxxMagHelmet", "/MagHeirloomHelmet", "/MagHelmet", "/SWInductionMagHelmet", "/SWROneMagHelmet", "/NintendoMagHelmet", "/SWRThreeOrbitHelmet", "/MagDeluxeHelmet", "/MagPrimeHelmet", "/SWToroidalMagHelmet", "/MagVoidShellHelmet", "/SWRThreeDeadEyeHelmet", "/SWDevilRangerHelmet", "/SWRThreeFalconHelmet", "/SWGraxxMesaHelmet", "/MesaHeirloomHelmet", "/CowgirlHelmet", "/SWCowgirlInsomniaHelmet", "/SWKudegraHelmet", "/SWMarletHelmet", "/SWMesnificentHelmet", "/MesaDeluxeHelmet", "/MesaPrimeHelmet", "/MesaPrimeAltHelmet", "/MesaDeluxeV2Helmet", "/MesaVoidShellHelmet", "/SWRFourMirageGraxxHelmet", "/HarlequinHelmet", "/SWRFourMirageJolliHelmet", "/SWKitsuneHelmet", "/SWMirageKuvaelHelmet", "/SWMithraHelmet", "/SWMorgaineHelmet", "/MirageLunarNewYearHelmet", "/MirageDeluxeHelmet", "/MiragePrimeHelmet", "/SWRFourMirageSigynHelmet", "/MirageVoidShellHelmet", "/SWNekrosAusirylystHelmet", "/SWCharonHelmet", "/SWNekrosGraxxHelmet", "/NecroHelmet", "/SWNekrosIonHelmet", "/NekrosDeluxeHelmet", "/SWRThreeLazarusHelmet", "/NekrosPrimeHelmet", "/NekrosVoidShellHelmet", "/SWDevineHelmet", "/SWDracunHelmet", "/NezhaDeluxeHelmet", "/NezhaHelmet", "/NezhaPrimeHelmet", "/SWYakshaHelmet", "/InfestationHelmet", "/SWKuvealScoungerHelmet", "/SWNightHunterHelmet", "/NidusDeluxeHelmet", "/NidusPrimeHelmet", "/SWTechnocystHelmet", "/NidusVoidShellHelmet", "/NokkoHelmet", "/NokkoAltHelmet", "/NovaDeluxeAoandonHelmet", "/NovaDeluxeHelmet", "/NovaDeluxeIIHelmet", "/SWCorpraHelmet", "/SWRThreeCygniHelmet", "/SWRThreeDeviceHelmet", "/SWRFourNovaFusionHelmet", "/SWRThreeGnovaHelmet", "/SWGraxxNovaHelmet", "/AntiHelmet", "/SWRThreeLamiaHelmet", "/SWNovaMithraHelmet", "/SWNetraselleNovaHelmet", "/NovaPrimeHelmet", "/SWRThreeStingerHelmet", "/SWTachyonHelmet", "/SWRThreeVisageHelmet", "/NovaVoidShellHelmet", "/SWAmpulexHelmet", "/SWAscophiliaHelmet", "/SWRFourNyxAthenaHelmet", "/SWAureliaHelmet", "/SWAuresHelmet", "/SWCarnifexHelmet", "/SWRSixNyxGraxxHelmet", "/JadeHelmet", "/NyxNemesisHelmet", "/NyxDeluxeHelmet", "/NyxPrimeHelmet", "/SWSaikouHelmet", "/SWTechnopsycheHelmet", "/SWOberonBotLHelmet", "/SWRFiveOberonDestrierHelmet", "/SWFeroshHelmet", "/PaladinDeluxeHelmet", "/PaladinHelmet", "/OberonPS4Helmet", "/OberonPS4Alt2Helmet", "/PaladinPrimeHelmet", "/SWTaurusHelmet", "/SWWendigoHelmet", "/SWOberonYoukaiHelmet", "/SWDivaHelmet", "/SWGiocosoHelmet", "/BardHelmet", "/BardTwitchHelmet", "/BardTwitchAltHelmet", "/OctaviaDeluxeHelmet", "/SWMandachoralystHelmet", "/SWNetrahymnHelmet", "/OctaviaPrimeHelmet", "/SWOctaviaYoukaiHelmet", "/SWOraxiaAgamvaHelmet", "/OraxiaHelmet", "/OrionHelmet", "/ProteaDeluxeHelmet", "/OdaliskHelmet", "/ProteaImmortalHelmet", "/SWKollapsarHelmet", "/ProteaPrimeAltHelmet", "/ProteaPrimeHelmet", "/SWTechnochronHelmet", "/ProteaVoidShellHelmet", "/VoidrigDSChromaHelmet", "/ConcreteFrameHelmet", "/SWQorvexSarcophagoHelmet", "/KahlHelmetPith", "/KahlHelmetHood", "/KahlHelmetDamaged", "/KahlHelmetDamagedWithMask", "/SWAhrimanHelmet", "/SWDraugenHelmet", "/RevenantHelmet", "/SWImmortuosHelmet", "/RevenantDeluxeHelmet", "/RevenantPrimeHelmet", "/SWTenebrusHelmet", "/SWRevenantWightHelmet", "/SWRhinoBotLHelmet", "/RhinoDeluxeV2Helmet", "/RhinoDexHelmet", "/SWRFourRhinoGraxxHelmet", "/RhinoHeirloomHelmet", "/RhinoHelmet", "/SWIonRhinoHelmet", "/JadeRhinoHelmet", "/SWMastodonHelmet", "/RhinoDeluxeHelmet", "/RhinoPrimeHelmet", "/RhinoRubedoSkinHelmet", "/SWScarabSectHelmet", "/SWTeutonicHelmet", "/RhinoChameleonAHelmet", "/SWWarlustHelmet", "/SWAmalgamaHelmet", "/SWBelladonnaHelmet", "/SWBotLSarynHelmet", "/SWRSixSarynGraxxHelmet", "/AspHelmet", "/SWIntegraHelmet", "/SWSarynIonHelmet", "/SWNapellusHelmet", "/SWSarynNighthunterHelmet", "/SWNitasModaHelmet", "/SarynDeluxeHelmet", "/SarynPrimeHelmet", "/WF1999SarynHelmet", "/SWVelenosaHelmet", "/SarynChameleonBHelmet", "/SarynLunarNewYearHelmet", "/SWSevagothEzrielHelmet", "/SevagothDeluxeHelmet", "/SevagothDeluxeShadowHelmet", "/WraithHelmet", "/SevagothPrimeHelmet", "/SevagothPrimeShadowHelmet", "/SWSevagothEzrielReaperHelmet", "/ReaperHelmet", "/SiriusHelmet", "/NecramechSnakeHelmet", "/KahlHelmetCorpus", "/SWStyanaxAresHelmet", "/HopliteHelmet", "/SWStyanaxHuzarrHelmet", "/StyanaxPrimeHelmetNoCloth", "/StyanaxPrimeHelmet", "/SWRaevuzStyanaxHelmet", "/StyanaxDeluxeHelmet", "/StyanaxVoidshellHelmet", "/TempleHelmet", "/TitaniaDeluxeIIHelmet", "/TitaniaDeluxeHelmet", "/FairyHelmet", "/SWLympharisHelmet", "/SWPixialystHelmet", "/TitaniaPrimeHelmet", "/SWUnseelieHelmet", "/SWVirajiHelmet", "/SWAncyraHelmet", "/SWTrinityBotLHelmet", "/TrinityHelmet", "/SWKnightessHelmet", "/SWRFiveTrinityMessiahHelmet", "/SWNightingaleHelmet", "/TrinityPrimeHelmet", "/TrinityDeluxeHelmet", "/KahlHelmetMushroom", "/DemonFrameHelmet", "/ValkyrDeluxeHelmet", "/SWRFiveValkyrCheetahHelmet", "/SWDelusionHelmet", "/BerserkerDeluxeHelmet", "/SWRFourValkyrGraxxHelmet", "/ValkyrHeirloomHelmet", "/BerserkerHelmet", "/SWIonHelmet", "/JadeValkyrHelmet", "/SWLeonessaHelmet", "/SWMithraValkyrHelmet", "/ValkyrPrimeHelmet", "/SWBonaparteHelmet", "/SWRFourVaubanChapelonHelmet", "/VaubanDeluxeHelmet", "/SWGraxxVaubanHelmet", "/VaubanHeirloomHelmet", "/TrapperDefaultHelmet", "/VaubanVoidSkinHelmet", "/VaubanPrimeHelmet", "/SWSuppressorHelmet", "/NecramechVoidRigDefaultHelmet", "/DiscordVoltHelmet", "/SWROneVoltHelmet", "/SWArresterVoltHelmet", "/SWCapacitorHelmet", "/VoltDeluxeBHelmet", "/SWFulgursorHelmet", "/SWRFourVoltGraxxHelmet", "/VoltHelmet", "/NintendoVoltHelmet", "/VoltPrimeHelmet", "/VoltTwitchHelmet", "/VoltDeluxeHelmet", "/VoltDeluxeRaijinHelmet", "/SWRelayVoltHelmet", "/SWTechnoshockHelmet", "/SWThalesVoltHelmet", "/VoltChameleonAHelmet", "/SWZenerHelmet", "/VorunaDemionnaHelmet", "/WerewolfHelmet", "/SWVorunaKuvaelDrahkaanisHelmet", "/VorunaDeluxeHelmet", "/VorunaPrimeHelmet", "/VorunaVoidShellHelmet", "/SWCelestisWispHelmet", "/SWCovenWispHelmet", "/SWDamasHelmet", "/SWDelusionHelmet", "/DexWispHelmet", "/SWWispGraxxHelmet", "/WispHelmet", "/WispPrimeHelmet", "/SWRaevuzHelmet", "/WispDeluxeHelmet", "/SWSycoraxWispHelmet", "/SWZamariuWispHelmet", "/SWAumanHelmet", "/MonkeyKingHelmet", "/SWWukongMithraHelmet", "/SWPiercingEyeHelmet", "/WukongPrimeHelmet", "/WukongDeluxeBHelmet", "/WukongDeluxeHelmet", "/MonkeyKingChamelionHelmet", "/SWRFiveWukongXingzheHelmet", "/SWXakuDeatheaHelmet", "/BrokenFrameHelmet", "/XakuDeluxeHelmet", "/XakuPrimeHelmet", "/XakuCosmosHelmet", "/XakuCosmosAltHelmet", "/KahlHelmetKavaLich3A", "/SWBatomorphaHelmet", "/YareliHelmet", "/YareliDeluxeHelmet", "/YareliPrimeHelmet", "/SWZephyrBotLHelmet", "/ZephyrQTCCHelmet", "/SWZephyrGraxxHelmet", "/SWRThreeHagoromoHelmet", "/ZephyrDeluxeHelmet", "/TenguHelmet", "/SWRFourZephyrMigisiHelmet", "/SWRThreeMonsoonHelmet", "/ZephyrPrimeHelmet", "/SWRThreeSkeironHelmet", "/SWStrafeHelmet", "/GaussDeluxeHorseHelmet", "/ErsatzHorseHelmetB", "/AnimaAltHelmetTwo", "/HarrowGeminiHelmetForHat", "/ErsatzHorseHelmetC", "/ErsatzHorseHelmetD", "/LotusHelmet", "/ErsatzHorseHelmetA"];
const MATERIAL_EXCLUDE_END		= ["Mirage", "Circuits", "DamasSteel", "Frost", "LeatherPackMap", "Intestine", "FrogSkin", "StackedWedge", "CarPaint", "TechMetalDots", "JasperStone", "LotusJacquard", "CremaMarble", "PerformanceFabric", "Shark", "Stitched", "PorcelainCracked", "CeramicBreak", "PearlescentPlastic", "Droplets", "WoodBurned", "CloudyStone", "PlasticMembrane", "LayeredStone", "Galvanized", "DuviriPattern", "Echo", "Trypophobia", "MarbleAlloy", "ShingledMetal", "GoldfishScale", "ScalesUniform", "MetalPolish", "GrossFlesh", "CarbonFiber"];
const MOD_BEASTS_INC			= ["beast", "kavat", "kubrow", "predasite", "vulpaphyla", "helminth charger"];
const MOD_DO_NOT_EXCLUDE		= ["/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert", "/Lotus/Upgrades/Mods/Melee/Expert/WeaponToxinDamageModExpert", "/Lotus/Upgrades/Mods/Melee/Expert/WeaponImpactDamageModExpert", "/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert", "Shotgun/Expert/WeaponElectricityDamageModExpert", "Shotgun/Expert/WeaponFreezeDamageModExpert", "Rifle/Expert/WeaponFreezeDamageModExpert", "Mods/Shotgun/Expert/WeaponCritDamageModExpert"];
const MOD_EXCLUDE_INC			= ["SampleAntiqueUpgrade", "/Railjack/Gunnery/Base", "/Railjack/Piloting/Base", "DamageRandomMod", "RateRandomMod"];
const MOD_EXCLUDE_END			= ["/TennokaiBaseMod", "/ArchwingWeaponElectricityDamageModExpert", "/ChargerFinisherMod", "/HBFireWorksMod", "/NecromechSprintEfficiencyMod", "Intermediate", "Beginner", "/WeaponAmmoMaxModExpert", "/WeaponBowConvertAmmoModExpert", "/AvatarDamageReductionInAirExpert", "/WeaponZoomFovModExpert", "/AvatarEnemyRadarModExpert", "/WeaponPistolZoomFovModExpert", "/AvatarFallingImpactModExpert", "/AvatarChanceToLootExpert", "/AvatarParryMeleeModExpert", "/AvatarSprintSpeedModExpert", "/WeaponGlaiveSpeedModExpert", "/AvatarMissionSpecificResistanceIceExpert", "/AvatarLootRadarModExpert", "/AvatarRevengeDamageMeleeExpert", "/AvatarKnockdownRecoveryModExpert", "/WeaponCritFireRateBonusModExpert", "/WeaponPowerDamageModExpert", "/WeaponMeleeFinisherDamageModExpert", "/WeaponSlashDamageModExpert", "/WeaponStunChanceModExpert", "/WeaponFireDamageModExpert", "/WeaponFreezeDamageModExpert", "/WeaponCritDamageModExpert", "/WeaponGlaivePowerthrowModExpert", "/WeaponMeleeDamageOnHeavyKillMod", "/WeaponMeleeChannelingEfficiencyModExpert", "/WeaponElectricityDamageModExpert", "/WeaponArmorPiercingDamageModExpert", "/WeaponCritChanceModExpert", "/WeaponImpactDamageModExpert", "/WeaponFireRateModExpert", "/WeaponToxinDamageModExpert", "/WeaponPunctureDepthModExpert", "/WeaponStatusChanceModExpert", "/WeaponFireIterationsModExpert", "/ProjectileExplosionChanceMod", "/BallisticaMod", "WeaponFactionDamageCorpusExpert", "/WeaponFactionDamageGrineerExpert", "/WeaponFactionDamageInfestedExpert", "/BowExplosionChanceModExpert", "/SniperReloadDamageModExpert", "/AvatarDamageResistancePoisonExpert"];
const MOD_IS_MELLE_END			= ["KubrowCritMod", "KubrowFireEventMeleeMod", "KubrowIceEventMeleeMod", "CompanionHunterSynergyMod", "KubrowMagneticEventMeleeMod", "KubrowMeleeDamageMod", "KubrowRadiationEventMeleeMod", "KubrowElectEventMeleeMod", "HelminthStrainFeverMod", "KubrowPoisonEventMeleeMod"];
const MOD_IS_ATAGRAPH_END		= ["/AvatarHealthMaxMod", "/KahlAvatarHealthMaxMod", "/InfestLinkAugmentCard", "/WarframeUmbraModA", "/Melee/WeaponFireRateMod", "/WeaponCritFireRateBonusMod", "/WeaponFireRateModExpert", "/Melee/WeaponCritDamageMod", "/Pistol/WeaponCritDamageMod", "/CritDamageChargeSpeedMod", "/PrimedWeaponCritDamageMod", "/Rifle/WeaponDamageAmountMod", "/WeaponDamageAmountInvisibleMod", "/SerratedRushMod", "/ShrineMaidenGunbrellaAugment", "/Pistol/WeaponFireIterationsMod", "/Shotgun/WeaponFireIterationsSPMod", "/Rifle/WeaponFireDamageMod", "/Shotgun/WeaponFireIterationsMod", "/MultishotDodgeMod", "/Pistol/WeaponFireIterationsSPMod", "/SentinelLootRadarEnemyRadarMod", "/SentinelLootRadarEnemyRadarExpertMod", "/GarudaBloodAugmentCard", "/GarudaShieldAugmentCard", "/GlaiveAugmentCard", "/SmokeScreenAugmentCard", "/AvatarAbilityEfficiencyMod"];
const MOD_IS_SECONDARY_INC		= ["zylok", "akjagara", "kunai", "detron", "embolist"];
const MOD_IS_AUGMENT_END		= ["AugmentCard", "DisablePassiveMod", "AugmentTwoCard", "Augment1Card"];
const MOD_PVEVP_END				= ["FasterMovementWhileAimingRifleMod", "RubicoLowZoom", "HigherAirAimFoVPistolMod", "HigherAirAimFoVShotgunMod", "SupraHigherAccuracyAiming", "MoreAccuracyLessRecoilSlidingShotgunMod", "TetraFasterProjAiming", "MoreAccuracyLessRecoilSlidingMod", "WeaponPistolZoomFovModExpert", "GunFuPvPAugmentCard", "HigherAirAimFoVRifleMod", "HolsterSpeedBonusMod", "FasterMovementWhileAimingShotgunlMod", "FasterMovementWhileAimingPistolMod", "MoreAccuracyLessRecoilSlidingPistolMod", "/PassiveReloadMod", "ColourPickerTwitchItemA", "MarelokMultishot", "ViperUnlimitedAmmo", "WeaponZoomFovMod", "WeaponPistolZoomFovMod", "DecoyPvPAugmentCard", "RangerQuiverPvPAugmentCard", "PrismPvPAugmentCard", "SlashDashPvPAugmentCard", "FireBlastPvPAugmentCard", "ShieldPvPAugmentCard", "SelfBulletAttractorPvPAugmentCard", "BrawlerSummonPvPAugmentCard", "GrakataUnlimitedAmmo", "MoreDamageonTripleTapRifleMod", "DaikyuMoreDamageOverDistanceMod", "DragonBreathAugmentCard", "IceSpikeAugmentCard", "IronSkinAugmentCard"];
const MOD_ROBOTS_INC			= ["robotic", "carrier", "shade", "hound", "moa", "diriga", "nautilus", "oxylus", "wyrm", "dethcube", "djinn", "helios", "taxon", "sentinel"];
const MOD_VEHICLES_INC			= ["archwing", "k-drive", "necramech", "elytron", "itzal", "odonata"];
const NODE_LOCATIONS			= { "SolNode": WF.TYPES.node.solar, "ClanNode": WF.TYPES.node.solar, "Junction": WF.TYPES.node.solar, "SettlementNode": WF.TYPES.node.solar, "CrewBattleNode": WF.TYPES.node.empyrean };
const NODE_MAPPING				= {"SolNode203": 138, "SolNode4": 51, "SolNode181": 177, "SolNode88": 51, "SolNode106": 51, "SolNode97": 51, "SolNode73": 51, "SolNode31": 55, "SolNode2": 18, "SolNode45": 51, "SolNode113": 51, "SolNode33": 69, "SolNode204": 138, "SolNode41": 51, "SolNode16": 51, "SolNode205": 138, "SolNode185": 50, "SolNode132": 163, "SolNode223": 3, "SolNode153": 279, "SolNode907": 69, "SolNode60": 69, "SolNode25": 51, "SolNode119": 3, "SolNode82": 55, "SolNode79": 24, "SolNode74": 51, "SolNode121": 51, "SolNode70": 55, "SolNode149": 163, "SolNode43": 51, "SolNode75": 24, "SolNode196": 177, "SolNode147": 163, "SolNode83": 69, "SolNode56": 51, "SolNode23": 18, "SolNode98": 69, "SolNode6": 52, "SolNode67": 55, "SolNode146": 163, "SolNode128": 18, "SolNode27": 24, "SolNode100": 51, "SolNode12": 3, "SolNode19": 49, "SolNode903": 24, "SolNode59": 24, "SolNode39": 24, "SolNode144": 163, "SolNode104": 41, "SolNode85": 20, "SolNode1": 52, "SolNode905": 51, "SolNode87": 51, "SolNode65": 45, "SettlementNode11": 157, "SolNode51": 51, "SolNode42": 55, "SolNode58": 51, "SolNode76": 51, "SolNode195": 177, "SettlementNode20": 100, "SolNode125": 51, "SolNode61": 24, "SolNode162": 279, "SolNode164": 279, "SolNode177": 177, "SolNode93": 55, "SolNode188": 177, "SettlementNode10": 157, "SolNode141": 163, "SolNode101": 18, "SolNode140": 163, "SolNode220": 138, "SolNode118": 52, "SolNode130": 3, "SolNode49": 52, "SolNode139": 163, "SolNode109": 18, "SolNode26": 24, "SolNode138": 163, "SolNode103": 3, "SolNode63": 24, "SolNode89": 24, "SolNode191": 177, "SolNode36": 51, "SolNode193": 100, "SolNode126": 51, "SolNode38": 51, "SettlementNode12": 157, "SolNode902": 18, "SolNode209": 138, "SolNode210": 138, "SolNode175": 279, "SolNode189": 177, "SolNode190": 177, "SolNode21": 51, "SolNode84": 52, "SolNode62": 52, "SolNode166": 279, "SolNode50": 55, "SolNode137": 163, "SolNode102": 51, "SolNode224": 3, "SolNode167": 279, "SolNode30": 51, "SolNode69": 69, "SolNode129": 24, "SolNode217": 138, "SolNode24": 24, "SolNode211": 138, "SolNode72": 51, "SolNode15": 24, "SolNode212": 138, "SolNode131": 163, "SolNode81": 51, "SolNode906": 55, "SolNode226": 3, "SolNode228": 24, "SolNode17": 52, "SolNode127": 52, "SolNode114": 44, "SolNode48": 51, "SolNode18": 55, "SettlementNode1": 157, "SolNode9": 69, "SolNode184": 177, "SolNode908": 52, "SolNode57": 52, "SolNode171": 279, "SolNode187": 177, "SettlementNode15": 157, "SettlementNode14": 157, "SettlementNode2": 157, "SolNode173": 279, "SolNode214": 138, "SolNode46": 51, "SolNode122": 69, "SettlementNode3": 157, "SolNode225": 3, "SolNode34": 69, "SolNode904": 51, "SolNode20": 55, "SolNode22": 18, "SolNode32": 55, "SolNode11": 51, "SolNode740": 55, "SolNode10": 51, "SolNode53": 51, "SolNode135": 163, "SolNode96": 55, "SolNode105": 69, "SolNode108": 25, "SolNode78": 52, "SolNode450": 18, "SolNode14": 51, "SolNode64": 69, "SolNode66": 18, "SolNode123": 18, "SolNode215": 138, "SolNode216": 138, "SolNode68": 51, "SolNode107": 18, "SolNode239": 50, "SolNode183": 177, "SolNode99": 51, "SolNode172": 279, "SolNode199": 177,};
const PET_ARMOR_EXCLUDE_END		= ["GrnAmphisKubrowArmor", "GrnAmphisKavatArmor", "KubrowArmorTrinityDeluxe", "TnTigrisKavatArmor", "TnTigrisKubrowArmor", "KubrowArmorC", "RevenantKavatArmor", "PrimeKubrowArmorA", "GrineerQueenArmor", "HelminthDeluxeArmor", "LNYKavatBoltorArmor", "Lunar2022KubrowArmor", "KubrowArmorStalker", "KubrowArmorA", "WukongPrimeKubrowArmor", "EmpyreanKavatArmor", "WispKavatArmor", "PacifistKubrowArmor", "UmbraKavatArmor", "KubrowArmorUmbra", "KubrowArmorBJade", "KubrowArmorB", "Twitch2021IfritKubrowArmor", "CatbrowArmorGaraPrime", "CatbrowArmorDuviri", "GrnQueenCatbrowArmor", "CatbrowArmorC", "CatbrowArmorB", "CatbrowArmorPrime", "Twitch2021MyrdinCatbrowArmor", "CatbrowArmorA"];
const POSTER_EXCLUDE_END		= ["SolarisPosterA", "SolarisPosterB", "SolarisPosterC", "SolarisPosterD", "SolarisPosterE", "SolarisPosterF", "SolarisPosterG", "ThisIsWhatYouAreAchievement", "TNWGlintTeshinDisplay", "TNWGlintUmbraDisplay", "TNWGlintOperatorDisplay", "CNY2021Poster", "CaliberChicksPoster", "EmpyreanPoster", "YareliQuestComic", "YareliAltCoverPoster", "ExplorationPoster", "VentKidPosterF", "VentKidPosterI", "VentKidPosterG", "VentKidPosterH", "VentKidPosterM", "VentKidPosterN", "VentKidPosterO", "VentKidPosterP", "VentKidPosterL", "VentKidPosterD", "VentKidPosterK", "VentKidPosterJ", "VentKidPosterE", "VentKidPosterA", "VentKidPosterC", "VentKidPosterB", "OrbiterPictureFrameD", "7thAnniversaryPoster", "8thAnniversaryPoster"];
const POSTER_BARO_END			= ["ParazonPoster", "KubrowKavatLowPolyPoster", "GarvLatroxPoster", "HeartOfDeimosAlbumCoverPoster", "EraHypnosisPoster", "BoredTennoPoster"];
const QUEST_SIDE_INC			= ["KubrowQuestKeyChain", "SpyQuestKeyChain", "KahlQuestKeyChain", "InfestedAladVQuestKeyChain", "GetClemQuestKeyChain", "GlassQuestKeyChain"];
const QUEST_WARFRAME_INC		= ["ProteaQuestKeyChain", "WraithQuestKeyChain", "DragonQuestKeyChain", "IndexQuestKeyChain", "BardQuestKeyChain", "MummyQuestKeyChain", "MirageQuestKeyChain", "RevenantQuestKeyChain", "FairyQuestKeyChain", "YareliQuestKeyChain", "LimboQuestKeyChain", "GolemQuestKeyChainItem"];
const RAILJACK_EXCLUDE_END		= ["TierA", "TierB", "TierC"];
const RAILJACK_TIERS_END		= [...RAILJACK_EXCLUDE_END, "TierD"];
const RECLIC_EXCLUDE_END		= ["T5VoidProjectionImmortal", "T5VoidProjectionImmortalOmni", "VoidProjection"];
const SIGIL_EXCLUDE_END			= ["BansheeDeluxeArmLeftArmor", "WukongDeluxeBSigil", "WeGameNewYearTigerSigil", "WeGameNewYearRabbitSigil", "WeGameNewYearDragonSigil", "WeGameNewYearSnakeSigil", "WeGameNewYearHorseSigil", "LavosDeluxeSigil", "GaussDeluxeIISigil", "GaussDeluxeIIDamageSigil", "ColourPickerHeirloom", "ColourPickerEmberHeirloom", "ColourPickerMesaHeirloom", "ColourPickerRhinoHeirloom", "ColourPickerValkyrHeirloom", "ColourPickerVaubanHeirloom", "PrimeAccessSigilSaryn", "PrimeAccessSigilLimbo", "PrimeAccessSigilFive", "StarterPackASigil", "StarterPackLotusSigil", "ArchwingSigil", "TwitchPrimeSigil", "BladeAndGunSigil", "DawnsEarlyLightSigil", "SigilVideoContest", "TennoLive2015Sigil", "TennoLivePromoSigil", "WikiaSigil", "TranslatorSigil", "TennoGenSigil", "LotusGuideSigil", "PS4OneYearSigil", "PS4TwoYearSigil", "PS4ThreeYearSigil", "PS4FourYearSigil", "PS4FiveYearSigil", "PS4RenownXSigil", "ObsidianIndraSigil", "PS4CrowSigil", "XBoneOneYearSigil", "XBoneTwoYearSigil", "XBoneThreeYearSigil", "XBoneFourYearSigil", "XBoneJadeSigil", "XboneJadeTwoSigil", "Community10YearAnniversarySigil", "NewWar2021Sigil", "GeodeSigil", "Cyte09Sigil", "KoumeiSigil", "TempleSigil", "DanteSigil", "HolidaySigilSnowflake", "FireSigil", "SparkSigil", "FormaSigil", "TwoToneSigil", "InktoberSigil", "JadeSigil", "KahlSupporterPackSigil", "BossSigilNefAnyo", "NarmerEyeSigil", "MechEventSigil", "VorDuviriSigil", "NecramechSigilSnake", "SigilSnake", "YareliSigil", "CNYRoosterCYSigil", "ZarimanSupporterPackSigil", "MonquisCYSigil", "MonquisSigil", "CNYRoosterPWSigil", "ClanSigilBasic", "AllianceSigilBasic", "OpticorConclaveVariantSigil"];
const SIGNA_EXCLUDE_END			= ["DexVinesCrown", "ChoirFrameHaloCrown", "TnTempleSignaCrown", "PrimeSevagothHaloCrown", "SWZamariuSignaCrown", "SWSignaPragmaticaCrown", "SWCenturioSignaCrown", "SWachetaSignaCrown"];
const SKIN_EXCLUDE_INC			= ["AdultFemaleHead", "FemaleHead", "MaleHead", "AdultHead", "Heads/Head", "ExtraAdult", "EyeBrows/EyeBrow", "Beards/Beard"];
const SKIN_EXCLUDE_SW			= ["/Lotus/Types/Game/Lotus", "/Lotus/Upgrades/Skins/RailJack", "/Lotus/Types/Game/CatbrowPet/BodyTypes", "/Lotus/Types/Game/KubrowPet/BodyTypes", "/Lotus/Upgrades/Skins/Operator/FacialMarkings"];
const SKIN_EXCLUDE_END			= ["/TnRevenantDeluxe2HKatanaSkin", "/PrimeSetThreeC", "/PrimeSetThreeL", "/PrimeSetThreeA", "/DeluxeAcceltraSkin", "/Halloween2023DOTDAcceltraSkin", "/Lunar2020AcceltraSkin", "/AcceltraDeluxe2Skin", "/HalloweenRegorAxeShield", "/AckBruntGrineerUrbanCamo", "/ErsatzHorseTailD", "/KahlEyepatchA", "/TitaniaDeluxeIIArchwingPistolsSkin", "/DuvArmorC", "/DuvArmorL", "/DuvArmorA", "/GaussDeluxeHorseSaddle", "/GaussDeluxeHorseTail", "/ErsatzBodySkinA", "/ErsatzHorseTailDefaultA", "/GrineerForestAfuris", "/BrassAndGoldAkbolto", "/HalloweenAklato", "/KintsukuroiAklato", "/StarryAklato", "/NintendoAklatoSkin", "/AkmagnusDakila", "/AkmagnusHiveLight", "/ObsidianAkmagnus", "/TekeluAkmagnusSkin", "/TekeluAkstilettoSkin", "/HalloweenAkvasto", "/GrineerForestDualVastos", "/AkvastosVoidSkin", "/TekeluAkvastoSkin", "/ExcaliburPrimeAlabasterSkin", "/NovaDeluxeIISniperSkin", "/ValkyrDeluxeArmorC", "/ValkyrDeluxeArmorL", "/ValkyrDeluxeArmorA", "/MotorcycleGraffitiSkin", "/CrpArSniperLichSkin", "/SupportDefaultArchwingSkin", "/WF1999VoltSkin", "/WF1999VoltAuxHat", "/HalloweenAmprex", "/IvaraPrimeCArmor", "/IvaraPrimeLArmor", "/IvaraPrimeAArmor", "/HoverboardStickerInfested", "/HalloweenAngstrum", "/AnkyrosVoidSkin", "/WF1999MagSkin", "/TnOraxiaArmorA", "/TnOraxiaArmorC", "/TnOraxiaArmorL", "/CrpHighArmorC", "/CrpHighArmorL", "/CrpHighArmorA", "/CosmosArcaTitronSkin", "/ArcataSkinA", "/ZephyrDeluxeShipSkin", "/SWArcosoliumSkin", "/KahlArmourAridFront", "/KahlArmourAridArms", "/KahlArmourWinterPack", "/KahlArmourWinterArmLeft", "/ExcaliburLasriaSkin", "/SWAsakageA", "/CorpusSpearGunSkin", "/NinjaAgileAnims", "/UnlockNinjaAgile", "/SWBaihuSkin", "/SWIchneumonSkin", "/AshAlternateSkin", "/NinjaDeluxeSuit", "/NinjaNobleAnims", "/UnlockNinjaNoble", "/AshPrimeSkin", "/SWRyugaSkin", "/AshDeluxeSkin", "/NinjaSkin", "/SWTsukuyomiSkin", "/SawHeavyUpperBack", "/SWAsteriaChestArmorC", "/EquinoxDeluxeSwordShieldSkin", "/PrimeSetMirageC", "/PrimeSetMirageL", "/PrimeSetMirageA", "/BrawlerAgileAnims", "/UnlockBrawlerAgile", "/SWAtlasBotLSkin", "/SWAtlasGraxxSkin", "/AtlasDeluxeSkin", "/SWMonolithSkin", "/BrawlerNobleAnims", "/UnlockBrawlerNoble", "/AtlasPrimeSkin", "/BrawlerSkin", "/ObsidianAttica", "/VenkraSniperSkin", "/FurisLArmor", "/FurisCArmor", "/PrimeAviaCArmor", "/PrimeAviaLArmor", "/PrimeAviaAArmor", "/FurisAArmor", "/SWAvyrdiShoulderArmorA", "/GrineerForestBallistica", "/OrnateBallistica", "/PaxDuviricusBodyBlades", "/DecreeAgileAnims", "/UnlockDecreeAgile", "/BansheeArmLeftArmor", "/SWBansheeBotLArmLeftArmor", "/SWBansheeBotLSkin", "/BansheeAlternateSkin", "/DecreeNobleAnims", "/UnlockDecreeNoble", "/BansheePrimeArmLeftArmor", "/BansheePrimeSkin", "/BansheeSkin", "/SWSonorityArmLeftArmor", "/SWSonoritySkin", "/BansheeDeluxeArmLeftArmor", "/BansheeDeluxeSuit", "/BansheeVoidShellArmLeftArmor", "/BansheeVoidShellSkin", "/MotorcycleMonsterSkin", "/PacifistAgileAnims", "/UnlockPacifistAgile", "/SWBedouinSkin", "/SWBaruukBotLSkin", "/BaruukDeluxeSkin", "/SWBaruukGraxxSkin", "/BaruukImmortalSkin", "/PacifistNobleAnims", "/UnlockPacifistNoble", "/SWBaruukPeacemakerSkin", "/BaruukPrimeSkin", "/BaruukDeluxeIIAux", "/BaruukDeluxeIISkin", "/SWShiraanSkin", "/PacifistSkin", "/SWBaruukZamariuSkin", "/TekeluBazaSkin", "/SwordWhipLowerBack", "/AshGeminiCaliberChicksRifleSkin", "/LisetSkinAshGemini", "/HildrynDeluxeAxeSkin", "/LisetSkinGarudaGemini", "/HoverboardStickerBaroA", "/KintsukuroiStaff", "/StarryStaff", "/VTBoar", "/BrassAndGoldBolto", "/OctaviaDeluxeBoltor", "/HalloweenBoltor", "/GrineerForestBoltor", "/LNY2025BoltorSkin", "/ObsidianBoltor", "/ThanomechVoidRigDefaultSkin", "/OberonDeluxeParis", "/NightwatchBrakk", "/HalloweenBraton", "/GrineerForestBraton", "/KintsukuroiBraton", "/StarryBraton", "/PS4Braton", "/PS4Mk1Braton", "/BratonDazzleCamo", "/KahlArmourAridLegs", "/GyreDeluxeArmorSetCArmor", "/GyreDeluxeArmorSetKArmor", "/GyreDeluxeArmorSetSArmor", "/VeilShoulderArmorA", "/NecraMechCSkin", "/CosmosBurstonSkin", "/HalloweenBuzlok", "/ErsatzHorseTailA", "/MotorcycleNakedBikeSkin", "/SentientAgileAnims", "/UnlockSentientAgile", "/SentientNobleAnims", "/UnlockSentientNoble", "/CalibanDeluxeAuxFloater", "/CalibanDeluxeSkin", "/CalibanPrimeAuxFloater", "/CalibanPrimeSkin", "/SentientSkin", "/HydroidDeluxeSpearGunSkin", "/JadeCarrier", "/JadeCassowarSkin", "/AlternateArrowA", "/AshDeluxeIIBowSkin", "/Lunar2023CedoSkin", "/TnCeramicArmorC", "/Halloween2024CeramicArmorC", "/Halloween2024CeramicArmorL", "/Halloween2024CeramicArmorA", "/TnCeramicArmorL", "/TnCeramicArmorA", "/CeramicTonfaSkin", "/Lunar2023CernosSkin", "/CestraDazzleCamo", "/InfChargerLisetSkin", "/ValkyrPrimeDangles", "/ChromaAgileAnims", "/UnlockChromaAgile", "/SWRFiveChromaDrevniSkin", "/ChromaDeluxeSkin", "/ChromaDeluxeWings", "/SWGraxxChromaSkin", "/ChromaAlternateSkin", "/SWMorkaiSkin", "/ChromaNobleAnims", "/UnlockChromaNoble", "/ChromaPrimeSkin", "/ChromaSkin", "/SWThyrusSkin", "/SWRSixChromaVojnikSkin", "/ChromaLNYSkin", "/ChromaLNYWings", "/JadeInfestedWings", "/TitaniaPrimeArchwingSkin", "/HoverboardStickerH", "/SevagothDlxWeaponSkin", "/BillowingArmorC", "/BillowingArmorL", "/BillowingArmorA", "/GeodeAgileAnims", "/UnlockGeodeAgile", "/CitrineDeluxeSkin", "/SWCitrineCelestisSkin", "/GeodeNobleAnims", "/UnlockGeodeNoble", "/GeodeSkin", "/Lunar2022HeavyBladeSkin", "/Lunar2022IgnisSkin", "/Lunar2022Zarr", "/ClawsHips", "/ObsidianColtekMask", "/SWCorachrixPauldrons", "/ObsidianCorinth", "/NintendoTnHeavyShotgunSkin", "/XakuBrokenNever", "/Halloween2023DOTDCorvasSkin", "/Halloween2023DOTDCycron", "/FrumentariusAgileAnims", "/UnlockFrumentariusAgile", "/FrumentariusNobleAnims", "/UnlockFrumentariusNoble", "/FrumentariusSkin", "/ProteaDeluxeSkinTonkor", "/SetThreeChestArmor", "/SetThreeArmArmor", "/SetThreeLegArmor", "/DagathAgileAnims", "/UnlockDagathAgile", "/DagathArmArmor", "/DagathImmortalArmArmor", "/DagathImmortalSkin", "/DagathNobleAnims", "/UnlockDagathNoble", "/DagathSkin", "/DagathDeluxeLNYSkin", "/SWYhavanDagathAArmor", "/SWYhavanDagathSkin", "/SWCrubbakDaggerSkin", "/DaggerHipsL", "/DaggerLowerBack", "/HalloweenDaikyu", "/BrassAndGoldDaikyu", "/IvaraDeluxeBallisticaSkin", "/PagemasterAgileAnims", "/UnlockPagemasterAgile", "/PagemasterNobleAnims", "/UnlockPagemasterNoble", "/PagemasterSkin", "/DanteDeluxeArmArmor", "/PagemasterDeluxeSkin", "/HalloweenDarkDagger", "/HalloweenDarkSplitSword", "/PCGamerDarkSwordDaggerHybridSkin", "/VTHalloweenDarkSword", "/HorseCrownEphemeraFear", "/PrimeStyanaxCArmor", "/PrimeStyanaxLArmor", "/PrimeStyanaxAArmor", "/VoidrigDOTDSkin", "/RhinoIronSkinDeluxeTwo", "/NidusDeluxeClawsSkin", "/CrpFncLArmor", "/PS4CrpFncLArmor", "/PS4CrpFncAArmor", "/CrpFncAArmor", "/TitaniaDeluxeGunbladeSkin", "/DeraDazzleCamo", "/HoverboardStickerL", "/GrineerForestDethcube", "/JadeDethcube", "/DetronDazzleCamo", "/JadeDexDakra", "/ObsidianDexDakra", "/NintendoDexDakra", "/JadeDexFuris", "/ObsidianDexFuris", "/TitaniaDeluxeArchwingPistolsSkin", "/MotorcycleColourShiftSkin", "/VoltDeluxeMaceSkin", "/SWDivaArmourC", "/TitaniaDeluxeArchwingSwordSkin", "/PrimeGaussArmourC", "/PrimeGaussArmourL", "/PrimeGaussArmourA", "/ErsatzHorseSaddleA", "/HalloweenDragonNikana", "/CYRubedoDrakgoonCamo", "/RubedoDrakgoonCamo", "/DrakgoonFlakCannonSkinPrimaryProjectileSkin", "/ValkyrDeluxeFistSkin", "/DualSwordHips", "/DualSwordStraight", "/DualSwordHighLow", "/DualCestraDazzleCamo", "/NightwatchDualCleavers", "/DualDaggerStraight", "/DualDaggerLowerBack", "/GrineerForestDualHeatSwords", "/JadeDualHeatSwords", "/JadeDualKamas", "/DualKatanaHips", "/DualSkanaInfestedSkin", "/SarynDeluxeSickle", "/FrostDeluxeDualSword", "/LNYHookSword", "/LokiDeluxeDualKamas", "/DualZorenCombustion", "/HalloweenDualZoren", "/GrineerForestDualZoren", "/DualZorenKuberus", "/PumpkinHead", "/SetTwoChestArmor", "/PrimeSetTwoChestArmor", "/PrimeSetTwoLegArmor", "/PrimeSetTwoArmArmor", "/SetTwoLegArmor", "/SetTwoArmArmor", "/EidolonLotusSkin", "/ShieldDeluxeBlastSkin", "/SWEklypsaStaffSkin", "/WF1999NyxSkin", "/DemolitionDefaultArchwingSkin", "/EmberAgileAnims", "/UnlockEmberAgile", "/SWRSixEmberGraxxSkin", "/EmberHeirloomSkin", "/SWIgnitionSkin", "/EmberAlternateSkin", "/SWMagestySkin", "/EmberNobleAnims", "/UnlockEmberNoble", "/EmberPrimeArmArmor", "/EmberPrimeSkin", "/EmberDeluxeIIChestArmor", "/EmberDeluxeIIArmArmor", "/EmberDeluxeIISkin", "/EmberSkin", "/SWTechnopyreSkin", "/EmberDeluxeSkin", "/EmberVoidshellSkin", "/InfEmbolistArmorC", "/InfEmbolistArmorL", "/InfEmbolistArmorA", "/MoaPetPersonalityC", "/MoaPetPersonalityB", "/MoaPetPersonalityA", "/MoaPetPersonalityD", "/SWEndocitosShoulderArmorA", "/HorseCrownEphemeraSnake", "/SphereSwordSkin", "/SetOneChestArmor", "/SetOneArmArmor", "/SetOneLegArmor", "/CosmosEpitaphSkin", "/AnimaAgileAnims", "/EquinoxDeluxeSkin", "/AnimaDayAgileAnims", "/UnlockAnimaDayAgile", "/AnimaDayNobleAnims", "/UnlockAnimaDayNoble", "/SWDivisaSkin", "/SWInsomniaSkin", "/SWMegaeraSkin", "/AnimaNightAgileAnims", "/UnlockAnimaAgile", "/AnimaNightNobleAnims", "/UnlockAnimaNoble", "/AnimaNobleAnims", "/EquinoxPrimeSkin", "/YinYangSkin", "/HoverboardStickerD", "/GrimoireEvilBaroSkin", "/HarrowDeluxeCArmor", "/HarrowDeluxeLArmor", "/HarrowDeluxeAArmor", "/SWEucyonChestArmor", "/ExcaliburAgileAnims", "/UnlockExcaliburAgile", "/DiscordExcalibur", "/SWRFourExcaliburApexSkin", "/SWExcaliburBotLSkin", "/SWRFourExcaliburCadutoSkin", "/SWCorpraSkin", "/ExcaliburDexSkin", "/SWExaltationSkin", "/SWRFourExcaliburGraxxSkin", "/ExcaliburAlternateSkin", "/SWIonExcaliburSkin", "/ExcaliburXBoneSkin", "/ExcaliburMask", "/ExcaliburNobleAnims", "/UnlockExcaliburNoble", "/ExcaliburPSPlusSkin", "/ObsidianExcaliburSkinB", "/EsteemExcalibur", "/NintendoExcalibur", "/ExcaliburPrimeSkin", "/VTExcaliburSkin", "/ExcaliburTwitchSkin", "/ExcaliburProtoSuit", "/SWRoninSkin", "/SWRThreeSentientSlayerSkin", "/ExcaliburSkin", "/ExcaliburUmbraAgileAnims", "/UnlockExcaliburUmbraAgile", "/ExcaliburUmbraNobleAnims", "/UnlockExcaliburUmbraNoble", "/UmbraSkin", "/SWROneExcaliburSkin", "/ExcaliburVeilBreakerSkin", "/ExcaliburDeluxeAgileAnims", "/UnlockExcaliburDeluxeAgile", "/ExcaliburDeluxeNobleAnims", "/UnlockExcaliburDeluxeNoble", "/ExcaliburDeluxeSkin", "/GrendelArchwingSkin", "/ErsatzHorseWingsA", "/HoverboardStickerM", "/GaussDeluxeIIArmourC", "/SWFhanEpakArmourC", "/MotorcycleRacingSkin", "/GauntletsInPlace", "/EmberDeluxeIIFlamethrowerSkin", "/WF1999TempleSkin", "/FluxRifleDazzleCamo", "/InkblotAgileAnims", "/UnlockInkblotAgile", "/InkblotNobleAnims", "/UnlockInkblotNoble", "/InkblotSkin", "/JadeFragor", "/NintendoFragor", "/TekeluFragorSkin", "/CaliberChicksIgnisSkin", "/FrostAgileAnims", "/UnlockFrostAgile", "/FrostArmArmor", "/FrostEmperorArmArmor", "/SWRSixFrostEmperorSkin", "/FrostXmasSkin", "/FrostGrostArmArmor", "/SWRThreeFrostGrostSkin", "/SWRThreeFrostHailstormSkin", "/FrostDeluxeSuit", "/FrostHeirloomArmArmor", "/FrostHeirloomSkin", "/SWHisameArmArmor", "/SWHisameSkin", "/FrostAlternateSkin", "/SWIonFrostArmArmor", "/SWIonFrostSkin", "/FrostNobleAnims", "/UnlockFrostNoble", "/NintendoFrost", "/FrostPrimeArmArmor", "/FrostPrimeSkin", "/FrostSkin", "/SWFrostStrigidArmArmor", "/SWFrostStrigidSkin", "/FrostVoidshellArmArmor", "/FrostVoidShellSkin", "/SWRThreeFrostVojnikSkin", "/FrostPrimeBodyCoat", "/FrostPrimeLegsCoat", "/GrineerForestFuris", "/Twitch2021FurisSkin", "/DuviriSwordTowerShieldSkin", "/CYRubedoGalatineCamo", "/GalatineClaymireSkin", "/HalloweenGalatine", "/SWMagestyGalatineSkin", "/ObsidianGalatine", "/RubedoGalatineCamo", "/OrnateGalatine", "/PagemasterDeluxeWarfanSkin", "/GrnAmphisCArmor", "/GrnAmphisLArmor", "/GrnAmphisAArmor", "/Halloween2023SOULGammacorSkin", "/GlassAgileAnims", "/UnlockGlassAgile", "/GaraAlternateSkin", "/GlassDeluxeSkin", "/GlassNobleAnims", "/UnlockGlassNoble", "/GaraPrimeSkin", "/GlassSkin", "/SWZamariuSkin", "/SWGarasuEyeAccessory", "/GarudaAgileAnims", "/UnlockGarudaAgile", "/GarudaDeluxeSkin", "/GarudaDeluxeClawsSkin", "/GarudaNobleAnims", "/UnlockGarudaNoble", "/GarudaPrimeSkin", "/GarudaPrimeClawsSkin", "/GarudaSkin", "/SWSuccessorSkin", "/SWSuccessorClawsSkin", "/GarudaClawsSkin", "/SWGarudaTengushinSkin", "/SWGarudaTengushinClawsSkin", "/SWTiamatSkin", "/SWTiamatClawsSkin", "/RunnerAgileAnims", "/UnlockRunnerAgile", "/SWGaussAgitoSkin", "/SWGaussGraxxSkin", "/GaussDeluxeSkin", "/GaussDeluxeIISkin", "/SWGaussNitrolystSkin", "/RunnerNobleAnims", "/UnlockRunnerNoble", "/GaussPrimeSkin", "/SWProfitasSkin", "/RunnerSkin", "/TnPersianCArmor", "/TnPersianLArmor", "/TnPersianAArmor", "/HoverboardStickerK", "/HoverboardStickerJ", "/SevagothDlxFishArmourA", "/SUVentkidsBoomerang", "/HalloweenGlaive", "/ObsidianGlaive", "/ProtoGlaive", "/TekeluGlaiveSkin", "/GlaiveInPlace", "/GlaiveUpperBack", "/SevagothDeluxeRopeAnchor", "/HalloweenGlaxion", "/XmasGlaxion", "/PrimeOctaviaArmourC", "/PrimeOctaviaArmourL", "/PrimeOctaviaArmourA", "/HalloweenGorgon", "/GorgonCamo", "/ObsidianGorgon", "/HalloweenGrakata", "/GrakataCamo", "/JadeGrakata", "/ObsidianGrattler", "/KahlArmourStandardBack", "/KahlArmourStandardFront", "/KahlArmourStandardLegs", "/KahlArmourStandardArms", "/GreatSwordHips", "/GreatSwordCrossed", "/GreatSwordUpperBack", "/HoverboardStickerPromoB", "/HoverboardStickerBaroB", "/KDriveVelocipodUncommonSkin", "/HalloweenTwinGremlins", "/GrnAkimboPistolsCamo", "/DevourerAgileAnims", "/UnlockDevourerAgile", "/SWMolochSkin", "/GrendelDeluxeSkin", "/DevourerNobleAnims", "/UnlockDevourerNoble", "/GrendelPrimeSkin", "/DevourerSkin", "/GrendelDeluxeIISkin", "/GrendelVoidshellSkin", "/Halloween2024GrimoireSkin", "/GrineerMask", "/HalloweenGrinlok", "/HarkonarGLARifle", "/NightwatchGrinlok", "/NintendoGaundaoSkin", "/GunbladeHipsL", "/GunbladeLowerBack", "/GunbladeHipsR", "/GunbladeUpperBack", "/TekeluGunsenSkin", "/DagathDeluxeLNYHorseBodySkin", "/DagathDeluxeLNYHorseTail", "/GyreAgileAnims", "/UnlockGyreAgile", "/SWGyreKuvealMonarchSkin", "/GyreNobleAnims", "/UnlockGyreNoble", "/GyrePrimeArmArmor", "/GyrePrimeSkin", "/GyreSkin", "/GyreDeluxeSkin", "/HalberdCrossed", "/SWAxonnakHammerSkin", "/SWJatKittagOgunSkin", "/RhinoDeluxeHammer", "/HoverboardStickerPromoC", "/GrineerTurbinesChestArmor", "/GrineerTurbinesLegArmor", "/GrineerTurbinesArmArmor", "/BaruukDeluxeSparring", "/PriestAgileAnims", "/UnlockPriestAgile", "/SWAlgalystSkin", "/SWGraxxHarrowSkin", "/PriestNobleAnims", "/UnlockPriestNoble", "/HarrowPrimeSkin", "/SWProfitasHarrowSkin", "/HarrowDeluxeSuit", "/PriestSkin", "/SWVelesSkin", "/Halloween2024DOTDHateSkin", "/TitaniaDeluxeIIArchwingSwordSkin", "/TitaniaDeluxeArmorC", "/TitaniaDeluxeArmorL", "/TitaniaDeluxeArmorA", "/GrineerForestHeatDagger", "/JadeHeatDagger", "/GrineerForestHeatSword", "/JadeHeatSword", "/SWArashiGreatswordSkin", "/SWDogmaHeavyBladeSkin", "/ChromaDeluxeSword", "/SWGrimstoneCleaver", "/SWIonGreatswordSkin", "/SWKarvrGreatswordSkin", "/SWKilzorathGreatswordSkin", "/SWKuvaelXimitotixHeavyBladeSkin", "/SWMithraGreatswordSkin", "/SWMizarGreatswordSkin", "/SWObanakk", "/SWSupremaGreatswordSkin", "/SWTengokenGreatswordSkin", "/HeavyHipsL", "/HeavyLowerBack", "/HeavyHipsR", "/HeavyUpperBack", "/NyxDeluxeShotgunSkin", "/RhinoIronSkinHeirloom", "/ObsidianHek", "/SolsticeHeliocor", "/ObsidianHelios", "/ErsatzHorseTailB", "/CNY2025ScytheSkin", "/IronFrameAgileAnims", "/UnlockIronFrameAgile", "/ShieldDeluxeBodySkin", "/IronFrameNobleAnims", "/UnlockIronFrameNoble", "/HildrynPrimeChestArmor", "/HildrynPrimeSkin", "/SWHildrynSarcostemaSkin", "/SWHildrynSigrunSkin", "/IronFrameSkin", "/ErsatzBodySkinDefault", "/ErsatzHorseTailDefault", "/LokiDeluxeAArmor", "/LokiDeluxeCArmor", "/LokiDeluxeLArmor", "/HydroidAgileAnims", "/UnlockHydroidAgile", "/SWGraxxHydroidSkin", "/HydroidAlternateSkin", "/HydroidNobleAnims", "/UnlockHydroidNoble", "/SWPoseidonSkin", "/HydroidPrimeArmArmor", "/HydroidPrimeSkin", "/HydroidDeluxeSuit", "/HydroidSkin", "/IAHGamesBratonSkin", "/InfestedFinsLegArmor", "/InfestedFinsChestArmor", "/InfestedFinsArmArmor", "/VorunaDeluxeAxeSkin", "/SWImpaktorFistsSkin", "/HalloweenImperator", "/OrnateImperator", "/ChromaPrimeArmorC", "/ChromaPrimeArmorL", "/ChromaPrimeArmorA", "/SandmanAgileAnims", "/UnlockSandmanAgile", "/SWHorusSkin", "/SandmanNobleAnims", "/UnlockSandmanNoble", "/SWOzymandiasSkin", "/InarosPrimeSkin", "/InarosDeluxeSkin", "/SandmanSkin", "/SWIncognitoEyeAccessory", "/SWInflatableShoulderArmorA", "/RhinoIronSkinNoEffects", "/SWIonShoulderArmorA", "/TefilahIridosSkin", "/ItzalArmourC", "/ItzalArmourL", "/ItzalArmourA", "/JadeStealthArchwingSkin", "/StealthDefaultArchwingSkin", "/RangerAgileAnims", "/UnlockRangerAgile", "/SWArcuataSkin", "/SWAstreaSkin", "/SWIvaraGraxxSkin", "/SWKuvaelSkin", "/RangerNobleAnims", "/UnlockRangerNoble", "/ObsidianIvaraExaltedBowSkin", "/ObsidianIvaraSkin", "/IvaraPrimeSkin", "/IvaraDeluxeBowSkin", "/IvaraDeluxeSuit", "/RangerSkin", "/SWYoukaiSkin", "/SWIvaraZamariuSkin", "/ChoirAgileAnims", "/UnlockChoirAgile", "/JadeAxaArmourC", "/JadeAxaArmourL", "/JadeAxaArmourA", "/JadeSetThreeChestArmor", "/JadeSetThreeLegArmor", "/JadeSetThreeArmArmor", "/JadeImmortalSkin", "/ChoirNobleAnims", "/UnlockChoirNoble", "/ChoirSkin", "/TnTempleArmorA", "/HalloweenJatKittag", "/NightwatchJatKittag", "/JatKittagNoxiousHammerSkin", "/HarkonarGrnFlameSpear", "/SWJotunheimMusicShoulder", "/HoverboardStickerF", "/CaliberChicksBratonSkin", "/KahlBody", "/JadeKama", "/InfestedNecraMechSkin", "/WF1999NovaSkin", "/WF1999NovaAuxHat", "/SummerSolsticeKesheg", "/KhoraAgileAnims", "/UnlockKhoraAgile", "/SWKhoraGraxxSkin", "/SWKhoraMithraSkin", "/SWKhoraOiranSkin", "/KhoraNobleAnims", "/UnlockKhoraNoble", "/KhoraPrimeSkin", "/KhoraSkin", "/KhoraDeluxeAgileAnims", "/UnlockKhoraDeluxeAgile", "/KhoraDeluxeNobleAnims", "/UnlockKhoraDeluxeNoble", "/KhoraDeluxeSuit", "/BaroMoaPetSkin", "/HoverboardStickerE", "/HoverboardStickerI", "/CaliberChicksArmourA", "/SWKishikamiC", "/GrnGunStockClubSkin", "/HarkonarGrnSpark", "/MotorcycleFlamesSkin", "/KoumeiAgileAnims", "/UnlockKoumeiAgile", "/KoumeiNobleAnims", "/UnlockKoumeiNoble", "/KoumeiSkin", "/KrackenCamo", "/SWRThreeKronenAritSkin", "/HalloweenKronen", "/SWKrtrimaArmorC", "/SWKrtrimaArmorL", "/SWKrtrimaArmorA", "/KahlEyepatchB", "/PrimeGarudaCArmor", "/PrimeGarudaLArmor", "/PrimeGarudaAArmor", "/PaxDuviricusAgileAnims", "/UnlockPaxDuviricusAgile", "/KullervoDeluxeBodyBlades", "/KullervoDeluxeArmArmor", "/KulervoDeluxeSkin", "/SWPaxAscophiliaBodyBlades", "/SWPaxAscophiliaSkin", "/PaxDuviricusNobleAnims", "/UnlockPaxDuviricusNoble", "/PaxDuviricusSkin", "/HalloweenKunai", "/KintsukuroiKunai", "/StarryKunai", "/KuvaLichArmourDChest", "/GrineerQueenArmourC", "/KuvaLichArmourEChest", "/GrineerQueenArmourL", "/KuvaLichArmourAChest", "/SWKuvaPumpChestArmor", "/GrineerQueenArmourA", "/KuvaLichArmourALegs", "/KuvaLichArmourCChest", "/KuvaLichArmourCArms", "/KuvaLichArmourFChest", "/KuvaLichArmourBChest", "/KuvaLichArmourBArms", "/SWLamassuShoulderArmorA", "/LankaDazzleCamo", "/HalloweenLato", "/KintsukuroiLato", "/StarryLato", "/PS4Lato", "/NintendoSemiAutoSkin", "/HalloweenLatoVandal", "/JadeLatron", "/AlchemistAgileAnims", "/UnlockAlchemistAgile", "/AlchemistDeluxeAuxShoulder", "/AlchemistDeluxeSuit", "/SWLavosKuvaelArmArmor", "/SWLavosKuvaelSkin", "/AlchemistNobleAnims", "/UnlockAlchemistNoble", "/LavosPrimeAuxShoulder", "/LavosPrimeArmArmor", "/LavosPrimeSkin", "/LavosArmArmor", "/AlchemistSkin", "/SWLavosYersinArmArmor", "/SWYersinSkin", "/LectaDazzleCamo", "/BunnyEars", "/HoverboardStickerA", "/WF1999TrinitySkin", "/EsteemLex", "/MagicianAgileAnims", "/UnlockMagicianAgile", "/SWLimboGraxxSkin", "/LimboImmortalSkin", "/LimboDeluxeSkin", "/MagicianNobleAnims", "/UnlockMagicianNoble", "/LimboPrimeSkin", "/MagicianSkin", "/SWVasionaSkin", "/SWVistyxioSkin", "/LimboVoidshellSkin", "/LisetSkinRelayEvent", "/InarosLisetSkin", "/LisetSkinHalloween", "/DexLisetSkin", "/LisetSkinSWROneHellkite", "/SWHerulystLisetSkin", "/LisetSkinFlavourItemB", "/LisetSkinJade", "/LisetSkinKotora", "/LisetSkinGrineerQueens", "/LisetSkinFlavourItemC", "/LisetSkinSWRThreeMaltzurOculus", "/SWMithraLisetSkin", "/LisetSkinObsidian", "/LisetSkinKaboom", "/LisetSkinPrime", "/LisetSkinVoidTrader", "/SWProtegeLisetSkin", "/LisetSkinSWROne", "/SWVammatarLisetSkin", "/LisetSkinTwitch", "/LisetSkinFlavourItemD", "/LisetSkinFlavourItemDefault", "/LokiAgileAnims", "/UnlockLokiAgile", "/SWErebusSkin", "/LokiAlternateSkin", "/SWIncubusSkin", "/SWJotunheimSkin", "/LokiDeluxeSuit", "/SWKodamaSkin", "/LokiNobleAnims", "/UnlockLokiNoble", "/NintendoLoki", "/LokiPrimeSkin", "/LokiSkin", "/LokiTwitchSkin", "/LokiVoidShellSkin", "/SWAritSkanaSkin", "/SWDeroSwordSkin", "/SWEisenSwordSkin", "/SWEzrielSwordSkin", "/FrostDeluxeSword", "/SWInsidiaSwordSkin", "/SWIonSwordSkin", "/InarosDeluxeSword", "/SWTengushenSwordSkin", "/LotusSkin", "/XakuDeluxeLotusSkin", "/NewWarLotusSkin", "/SWLumisEarAccessory", "/SWLumisLisetSkin", "/WeGameMacheteSkin", "/LNY2024DragonSigil", "/InfGrnWolfShoulderArmorA", "/HarrowGeminiSkin", "/HarrowGeminiAuxHat", "/SWKutherMachete", "/NightwatchMachete", "/SWUdjyatMachete", "/KhoraDeluxeKavatSkin", "/KhoraDeluxeVenariSkin", "/MagAgileAnims", "/UnlockMagAgile", "/SWRThreeAlataSkin", "/DiscordMag", "/SWMagCelestisSkin", "/SWCorpraMagSkin", "/SWFerroSkin", "/SWGraxxMagSkin", "/MagHeirloomSkin", "/MagAlternateSkin", "/SWROneMagSkin", "/MagMask", "/MagNobleAnims", "/UnlockMagNoble", "/NintendoMag", "/SWRThreeDipoleSkin", "/MagDeluxeSkin", "/MagPrimeArmArmor", "/MagPrimeSkin", "/MagSkin", "/MagVoidShellSkin", "/GrineerVHC", "/GrineerVHL", "/GrineerVHA", "/SummerSolsticeMaggorC", "/SummerSolsticeMaggorL", "/SummerSolsticeMaggorA", "/MagnusDakila", "/MagnusHiveLight", "/ObsidianMagnus", "/TekeluMagnusSkin", "/LisetInsectSkinCamo", "/LisetInsectSkinInaros", "/LisetInsectSkinHalloween", "/LisetInsectSkinExotic", "/LisetInsectSkinIridos", "/LisetInsectSkinGrineerQueens", "/SWLilieaeSkin", "/LisetInsectSkinNautilus", "/LisetInsectSkinPrimeTrader", "/LisetInsectSkinDefault", "/SWMantisVammatarSkin", "/GuideOfTheLotusArmArmor", "/HalloweenMarelok", "/HarkonarGLAPistol", "/NightwatchMarelok", "/UnmaskedLotusSkin", "/WF1999WispSkin", "/WF1999WispAuxHat", "/MagDeluxeTonfaSkin", "/RevenantMask", "/KahlEyepatchE", "/SWMaulleusHammerSkin", "/MechEventMausolonSkin", "/AlternateArrowC", "/MerulinaBoard", "/MerulinaDeluxe", "/PrimeMerulinaBoard", "/CowgirlAgileAnims", "/UnlockCowgirlAgile", "/SWDevilRangerSkin", "/SWGraxxMesaSkin", "/MesaHeirloomPoncho", "/MesaHeirloomArmGunSkin", "/MesaHeirloomSkin", "/MesaImmortallSkin", "/SWCowgirlInsomniaSkin", "/SWKudegraSkin", "/SWMarletSkin", "/SWMesnificentSkin", "/CowgirlNobleAnims", "/UnlockCowgirlNoble", "/MesaDeluxeArmGunSkin", "/MesaDeluxeSkin", "/MesaPrimeSkin", "/MesaDeluxeV2ArmGunSkin", "/MesaDeluxeV2Skin", "/CowgirlSkin", "/MesaVoidShellSkin", "/WukongDeluxeWhipSkin", "/WF1999SarynSkin", "/WF1999SarynAuxHatClosed", "/WF1999SarynAuxHat", "/HarlequinAgileAnims", "/UnlockHarlequinAgile", "/SWRFourMirageGraxxSkin", "/MirageAlternateSkin", "/SWKitsuneSkin", "/SWMirageKuvaelSkin", "/SWMithraSkin", "/SWMorgaineSkin", "/HarlequinNobleAnims", "/UnlockHarlequinNoble", "/MirageLunarNewYearSkin", "/MirageDeluxeAgileAnims", "/UnlockMirageDeluxeAgile", "/MirageDeluxeNobleAnims", "/UnlockMirageDeluxeNoble", "/MirageDeluxeSkin", "/MiragePrimeSkin", "/SWRFourMirageSigynSkin", "/MirageSkin", "/MirageVoidShellSkin", "/MirageXmasSkin", "/PrimeInarosArmorC", "/PrimeInarosArmorL", "/PrimeInarosArmorA", "/ProteaDeluxeThrowingSkin", "/MotorcycleTennoSkin", "/VaubanDeluxeAxe", "/NecroDangles", "/SolarisHammerSkinA", "/NecraArmorC", "/NecraArmorL", "/NecraArmorA", "/HorseCrownEphemeraFlower", "/HalloweenLotusSkin", "/Halloween2014ArmArmor", "/Lunar2023NagantakaSkin", "/SentNewWarArmorC", "/SentNewWarArmorL", "/SentNewWarArmorA", "/PrimeArmorEquinoxC", "/PrimeArmorEquinoxL", "/PrimeArmorEquinoxA", "/SentientLotusSkin", "/GrimoireSciFiSkin", "/TnLotusRapierSkin", "/NecroAgileAnims", "/UnlockNecroAgile", "/SWNekrosAusirylystSkin", "/SWNekrosGraxxSkin", "/NekrosAlternateSkin", "/NekrosDeluxeDangles", "/NekrosDeluxeSkin", "/NecroNobleAnims", "/UnlockNecroNoble", "/NekrosPrimeSkin", "/NekrosSkin", "/NekrosVoidShellSkin", "/MotorcycleLightsSkin", "/NezhaAgileAnims", "/UnlockNezhaAgile", "/SWDevineSkin", "/SWDracunSkin", "/NezhaDeluxeSkin", "/NezhaNobleAnims", "/UnlockNezhaNoble", "/NezhaPrimeSkin", "/NezhaSkin", "/SWYakshaSkin", "/TnArmorCurveC", "/TnArmorCurveL", "/TnArmorCurveA", "/KompressaDeluxeSkin", "/InfestationAgileAnims", "/UnlockInfestationAgile", "/NidusAlternateSkin", "/SWNidusKuvaelSkin", "/SWNightHunterSkin", "/InfestationNobleAnims", "/UnlockInfestationNoble", "/NidusDeluxeSkin", "/NidusPrimeSkin", "/InfestationSkin", "/SWTechnocystSkin", "/NidusVoidShellSkin", "/NoraShipDefault", "/UmbraDaxNikana", "/HalloweenNikana", "/DragonKatanaSheathLightning", "/KatanaSheathLightning", "/SWKhatuunKatanaSkin", "/SWKrtrimaKatanaSkin", "/KatanaCrossedL", "/SWMinosKatanaSkin", "/SWMithraKatanaSkin", "/ObsidianNikana", "/KatanaCrossedR", "/AshNikana", "/SWShinigamiKatanaSkin", "/KatanaHipsL", "/TekeluNikanaSkin", "/SWUndercutterKatanaSkin", "/UngulataKatana", "/PrimeLavosArmorC", "/PrimeLavosArmorL", "/PrimeLavosArmorA", "/SWNinurtaClawsSkin", "/PagemasterDeluxeGrimoireSkin", "/NokkoAgileAnims", "/UnlockNokkoAgile", "/NokkoNobleAnims", "/UnlockNokkoNoble", "/NokkoSkin", "/AntiMatterAgileAnims", "/UnlockAntiMatterAgile", "/NovaDeluxeAoandonSkin", "/NovaDeluxeSuit", "/NovaDeluxeIISuit", "/SWCorpraSkin", "/SWRThreeCygniSkin", "/SWRThreeDeviceSkin", "/SWRThreeGnovaSkin", "/SWGraxxNovaSkin", "/NovaAlternateSkin", "/SWRThreeLamiaSkin", "/SWNovaMithraSkin", "/SWNetraselleNovaSkin", "/AntiMatterNobleAnims", "/UnlockAntiMatterNoble", "/NovaPrimeSkin", "/NovaSkin", "/SWRThreeStingerSkin", "/SWRThreeVisageSkin", "/NovaVoidShellSkin", "/HalloweenNukor", "/LNY2024Nukor", "/NukorGrineerUrbanCamo", "/NunchakuHips", "/NunchakuCrossed", "/NunchakuLowerBack", "/EmberDeluxeDualPistolSkin", "/EmberDeluxePistolSkin", "/NvidiaBratonSkin", "/JadeAgileAnims", "/UnlockJadeAgile", "/SWAscophiliaSkin", "/SWRFourNyxAthenaSkin", "/SWAureliaSkin", "/SWAuresSkin", "/SWCarnifexSkin", "/SWRSixNyxGraxxSkin", "/NyxAlternateSkin", "/NyxNemesisSuit", "/JadeNobleAnims", "/UnlockJadeNoble", "/NyxDeluxeSuit", "/NyxPrimeSkin", "/SWSaikouSkin", "/NyxSkin", "/SWTechnopsycheSkin", "/PaladinAgileAnims", "/UnlockPaladinAgile", "/OberonArmArmor", "/SWOberonBotLArmArmor", "/SWOberonBotLSkin", "/PaladinDeluxeSuit", "/OberonAlternateSkin", "/PaladinNobleAnims", "/UnlockPaladinNoble", "/OberonPS4Skin", "/OberonPrimeArmArmor", "/PaladinPrimeSkin", "/PaladinSkin", "/SWOberonWendigoArmArmor", "/SWWendigoSkin", "/SWOberonYoukaiArmArmor", "/SWOberonYoukaiSkin", "/ObexDazzleCamo", "/OAArmorC", "/OAArmorL", "/OAArmorA", "/PS5ArmorC", "/PS5ArmorL", "/PS5ArmorA", "/BardAgileAnims", "/UnlockBardAgile", "/SWDivaSkin", "/BardTwitchSkin", "/OctaviaDeluxeSkin", "/SWMandachoralystSkin", "/SWNetrahymnSkin", "/BardNobleAnims", "/UnlockBardNoble", "/OctaviaPrimeSkin", "/BardSkin", "/SWOctaviaYoukaiSkin", "/ElixisOdonataSkin", "/ObsidianStandardArchwingSkin", "/PrimeDefaultArchwingSkin", "/StandardDefaultArchwingSkin", "/LNY2024Ogris", "/OgrisGrineerUrbanCamo", "/OgrisRocketLauncherSkinPrimaryProjectileSkin", "/PS5OkinaSkin", "/KahlEyepatchF", "/ExcaliburDeluxeNikana", "/HoverboardStickerNokkoB", "/HalloweenOpticor", "/SWMithraOpticorSkin", "/OpticorDazzleCamo", "/TnPagemasterArmorC", "/TnPagemasterArmorA", "/OraxiaAgileAnims", "/UnlockOraxiaAgile", "/OraxiaNobleAnims", "/UnlockOraxiaNoble", "/OraxiaSkin", "/OrionSkin", "/HalloweenOrthos", "/GrineerForestOrthos", "/Lunar2020OrthosSkin", "/OrthosMagestySkin", "/EsteemOrthos", "/BlackoutOrthos", "/OrnateOrthos", "/UmbraDaxGlaive", "/NewPlayerXPParisSkin", "/TnNewPlayerCArmor", "/TnNewPlayerLArmor", "/NewPlayerXPSkanaSkin", "/NewPlayerXPLatoSkin", "/NewPlayerXPBratonSkin", "/TnNewPlayerAArmor", "/NewPlayerXPBoSkin", "/NewPlayerXPKunaiSkin", "/PremiumBunnyEars", "/StalkC", "/StalkL", "/StalkA", "/RhinoIronSkinDeluxe", "/CeramicPistolSkin", "/TekeluPantheraSkin", "/XB1BallasSword", "/PS4BallasSword", "/SWIBallasSword", "/TnDeimosSupporterArmorC", "/TnDeimosSupporterArmorL", "/TnDeimosSupporterArmorA", "/LisetZarimanShipSkinD", "/LisetZarimanShipSkinA", "/LisetZarimanShipSkinC", "/LisetZarimanShipSkinB", "/LisetZarimanShipSkinCosmos", "/LisetZarimanShipDefault", "/HalloweenParis", "/GrineerForestParis", "/KintsukuroiParis", "/StarryParis", "/SWPaxisArmourC", "/SWPaxisShoulderArmor", "/ObsidianPennant", "/PentaDazzleCamo", "/MesaDeluxeDualPistolSkin", "/MesaDeluxePistolSkin", "/DaxDuviriParazonSkin", "/KullervoDeluxeSparringSkin", "/SWPiercingEyeChestArmor", "/SWPiercingEyeShoulderArmor", "/SWAphriaPolearmSkin", "/SWDivaPolearmSkin", "/SWIonPolearmSkin", "/SWJotunheimPolearmSkin", "/SWKalynexPolearmSkin", "/SWLahnssPolearmSkin", "/SWLympharisPolearmSkin", "/SWOsirisPolearm", "/SWPhorcysPolearmSkin", "/SWSkoposPolearm", "/SWUlceratedPolearm", "/HoverboardStickerPromoA", "/CrpCircC", "/HalloweenCrpCircC", "/HalloweenCrpCircL", "/HalloweenCrpCircA", "/CrpCircL", "/CrpCircA", "/RhinoIronSkinPrime", "/WispDeluxeFulminSkin", "/OdaliskAgileAnims", "/UnlockOdaliskAgile", "/ProteaDeluxeSkin", "/ProteaImmortalSkin", "/SWKollapsarSkin", "/OdaliskNobleAnims", "/UnlockOdaliskNoble", "/ProteaPrimeSkin", "/OdaliskSkin", "/SWTechnochronSkin", "/ProteaVoidShellSkin", "/VoidrigDSChromaSkin", "/SentEvoArmor3C", "/SentEvoArmor3L", "/SentEvoArmor3A", "/SentEvoArmor1C", "/SentEvoArmor2C", "/SentEvoArmor2L", "/SentEvoArmor2A", "/SentEvoArmor1L", "/SentEvoArmor1A", "/ProvaDazzleCamo", "/ObsidianFaceMaskArmour", "/GrnFaceMaskArmour", "/ErsatzBodySkinC", "/ErsatzHorseTailDefaultC", "/HoverboardStickerPromoD", "/KDriveVelocipodSkin", "/Lunar2020PyranaSkin", "/ConcreteAgileAnims", "/UnlockConcreteAgile", "/ConcreteNobleAnims", "/UnlockConcreteNoble", "/ConcreteFrameSkin", "/ObsidianQuanta", "/CrpIndexTwoCArmor", "/CrpIndexTwoLArmor", "/CrpIndexTwoAArmor", "/SummerSolsticeQuartakk", "/WF1999FrumentariusSkin", "/WF1999FrumentariusAuxHat", "/SWRaigoChestArmor", "/PrimeNezhaArmorC", "/PrimeNezhaArmorL", "/PrimeNezhaArmorA", "/MotorcycleMedicSkin", "/SWArashiRapierSkin", "/SWFeritaRapierSkin", "/SWNiDuhlRapierSkin", "/RapierHipsL", "/RapierBack", "/NovaDeluxePolearm", "/BaruukDeluxeIIMaceShield", "/RedeemerTNWNarmerSkin", "/TekeluRedeemerSkin", "/KahlArmourDamagedBack", "/KahlArmourDamagedLegs", "/KahlArmourDamagedArms", "/SpragHammerSkin", "/HarrowDeluxeSpearGun", "/GaraDeluxeSword", "/KahlEyepatchC", "/NidusDeluxeHipCloth", "/RevenantAgileAnims", "/UnlockRevenantAgile", "/SWAhrimanSkin", "/SWDraugenSkin", "/RevenantDeluxeSkin", "/RevenantNobleAnims", "/UnlockRevenantNoble", "/RevenantPrimeArmArmor", "/RevenantPrimeSkin", "/RevenantSkin", "/SWRevenantWightSkin", "/RhinoAgileAnims", "/UnlockRhinoAgile", "/SWRhinoBotLSkin", "/CYRhinoRubedoSkin", "/RhinoDeluxeV2AgileAnims", "/UnlockRhinoDeluxeV2Agile", "/RhinoDeluxeV2NobleAnims", "/UnlockRhinoDeluxeV2Noble", "/RhinoDeluxeV2Skin", "/RhinoDeluxeV2Wings", "/RhinoDexSkin", "/SWRFourRhinoGraxxSkin", "/RhinoHeirloomSkin", "/RhinoAlternateSkin", "/SWIonRhinoSkin", "/JadeRhinoSkin", "/SWMastodonSkin", "/RhinoNobleAnims", "/UnlockRhinoNoble", "/RhinoDeluxeSuit", "/RhinoPrimeSkin", "/RhinoRubedoSkin", "/SWScarabSectSkin", "/RhinoSkin", "/RhinoChameleonASkin", "/SWRFourRhinoVojnikSkin", "/KahlArmourAridBackWithACUnit", "/KahlArmourAridArmLeftWithACUnit", "/RixtyMOLAklatoSkin", "/GeminiDemonFrameSkin", "/GeminiDemonFrameAuxHat", "/HoverboardStickerNokkoA", "/SWROneSyandanaItem", "/CitrineDeluxeExaltedScytheSkin", "/MotorcycleRustSkin", "/AshGeminiSkin", "/AshGeminiAux", "/WinterSolsticeSalix", "/HalloweenSarpa", "/AspAgileAnims", "/UnlockAspAgile", "/SWAmalgamaSkin", "/SWBotLSkin", "/SWRSixSarynGraxxSkin", "/SarynAlternateSkin", "/SWIntegraSkin", "/SWSarynIonSkin", "/SWNapellusSkin", "/SWSarynNighthunterSkin", "/SWNitasModaSkin", "/AspNobleAnims", "/UnlockAspNoble", "/SarynDeluxeSuit", "/SarynPrimeSkin", "/SarynSkin", "/SWVelenosaSkin", "/SarynChameleonBSkin", "/SarynLunarNewYearSkin", "/WolfStalkerMask", "/ScarredLotusSkin", "/LisetBlueSkySkinInaros", "/LisetBlueSkySkinSound", "/LisetBlueSkySkinGrineerQueens", "/LisetBlueSkySkinDeluxe", "/LisetBlueSkySkinSplash", "/LisetBlueSkySkinPrimeTrader", "/LisetBlueSkyDefault", "/LisetBlueSkySkinStalker", "/ScindoCombustion", "/HalloweenScindo", "/GrineerForestScindo", "/ScindoKuberus", "/ObsidianScoliac", "/CalibanDlxScytheSkin", "/SWSeraphimChestArmor", "/MasseterDeluxeGreatswordSkin", "/ObsidianSerro", "/UnlockWraithAgile", "/WraithAgileAnims", "/SWSevagothEzrielSkin", "/SevagothDeluxeShadowClawsSkin", "/SevagothDeluxeShadowSkin", "/SevagothDeluxeArmRightArmor", "/SevagothDeluxeSkin", "/UnlockWraithNoble", "/WraithNobleAnims", "/SevagothPrimeSkin", "/SevagothPrimeShadowSkin", "/WraithSkin", "/SWSevagothEzrielReaperSkin", "/ReaperSkin", "/SevagothPrimeShadowClawsSkin", "/DOTD2025SheduSkin", "/CrpCubinatorArmorC", "/CrpCubinatorArmorL", "/CrpCubinatorArmorA", "/HoverboardStickerNokkoC", "/RailjackCArmor", "/RailjackLArmor", "/TnRailjackDataKnife", "/RailjackAArmor", "/HoverboardStickerC", "/SWSilicaiFistsSkin", "/HalloweenSilvaAndAegis", "/EvilBaroSilvaAndAegis", "/ObsidianSilvaAndAegis", "/HalloweenSimulor", "/CYSingleStaffSkin", "/SiriusOrionAgileAnims", "/UnlockSiriusOrionAgile", "/SiriusOrionNobleAnims", "/UnlockSiriusOrionNoble", "/SiriusSkin", "/HalloweenSkana", "/SkanaInfestedSkin", "/KintsukuroiSkana", "/StarrySkana", "/PS4Skana", "/LisetGrineerShipDOTD", "/LisetGrineerShipDefault", "/XakuBrokenAlways", "/Halloween2023DOTDSkiajatiSkin", "/HoverboardStickerO", "/NecramechSnakeSkin", "/SnipetronDazzleCamo", "/HalloweenSobek", "/SobekCamo", "/ErsatzHorseSaddleC", "/SolsticeSetThreeChestArmor", "/SolsticeSetThreeLegArmor", "/SolsticeSetThreeArmArmor", "/HalloweenSoma", "/Halloween2024DOTDSomaSkin", "/GrineerForestSoma", "/HuntsmanSoma", "/BansheeDeluxeSonicor", "/HalloweenSonicor", "/XmasSonicor", "/ObsidianSonicor", "/KahlArmourCorpusBack", "/CrpSistersC", "/CrpSistersL", "/CrpSistersA", "/PunchKickInPlace", "/SpectraDazzleCamo", "/LisetSkinTwitchPrime", "/SWSpicularisSpursArmorL", "/HalloweenSpira", "/ObsidianSpira", "/PrimeSetFourC", "/PrimeSetFourL", "/PrimeSetFourA", "/HoverboardStickerP", "/StaffLowerBack", "/StaffCrossed", "/StaffStraight", "/StahltaShockRifleSkinPrimaryProjectileSkin", "/StahltaShockRifleSkinSecondaryProjectileSkin", "/MotorcycleDefaultSkin", "/GlassDeluxeWings", "/TrinityDeluxeBo", "/HalloweenStradavar", "/TekeluStradavarSkin", "/BillowingPistolSkin", "/SummerSolsticeStubba", "/HopliteAgileAnims", "/UnlockHopliteAgile", "/SWStyanaxAresSkin", "/SWStyanaxHuzarrSkin", "/HopliteNobleAnims", "/UnlockHopliteNoble", "/StyanaxPrimeSkin", "/SWRaevuzStyanaxSkin", "/HopliteSkin", "/StyanaxDeluxeAuxChest", "/StyanaxDeluxeSkin", "/StyanaxVoidshellSkin", "/Halloween2023DOTDSuparna", "/SupraDazzleCamo", "/OberonDeluxeAckBrunt", "/SwordShieldUpward", "/SwordShieldDownward", "/SwordShieldDefault", "/SwordHipsL", "/SwordHipsR", "/SwordUpperBack", "/SWROneSybaris", "/AlternateArrowB", "/TnHvArmourC", "/TnHvArmourL", "/TnHvArmourA", "/PrimeSetOneChestArmor", "/PrimeSetOneLegArmor", "/PrimeSetOneArmArmor", "/LimboDeluxeCardSkin", "/DaxBowSkin", "/DaxArchgunSkin", "/DaxHammerSkin", "/DaxKatanaSkin", "/DaxLeverRifleSkin", "/DaxMageStaffSkin", "/DaxKunaiSkin", "/KahlEyepatchD", "/AtlasDeluxeSparring", "/TempleAgileAnims", "/UnlockTempleAgile", "/TempleNobleAnims", "/UnlockTempleNoble", "/TempleSkin", "/NezhaDeluxeDaggerSkin", "/NezhaDeluxeDualDaggerSkin", "/StyanaxDeluxeSpearSkin", "/StalkerShipDeluxeSkin", "/TetraDazzleCamo", "/NekrosDeluxeScytheSkin", "/Stache05", "/Stache06", "/Stache", "/Stache08", "/Stache10", "/Stache03", "/Stache09", "/Stache07", "/Stache02", "/Stache04", "/AlternoxDeluxeSkin", "/WukongDeluxeBKatanaSkin", "/WukongDeluxeBDualKatanaSkin", "/PS5TiberonSkin", "/EsteemTigris", "/TigrisVoidSkin", "/OrnateTigris", "/BrassAndGoldTipedo", "/FairyAgileAnims", "/UnlockFairyAgile", "/TitaniaDeluxeIISkin", "/TitaniaDeluxeSkin", "/SWLympharisSkin", "/TitaniaDeluxeIIAuxWings", "/FairyNobleAnims", "/UnlockFairyNoble", "/SWPixialystSkin", "/TitaniaPrimeSkin", "/FairySkin", "/SolsticeFairySkin", "/SWUnseelieSkin", "/SWBaGethTonfaSkin", "/SWHadesTonfaSkin", "/TonfaHips", "/TonfaCrossed", "/TonfaUpperBack", "/SWYamexTonfaSkin", "/HalloweenTonkor", "/JadeTonkor", "/NightwatchTonkor", "/GrendelDeluxeIIArmourC", "/TrinityAgileAnims", "/UnlockTrinityAgile", "/SWTrinityBotLSkin", "/TrinityAlternateSkin", "/SWKnightessSkin", "/TrinityMask", "/SWNightingaleSkin", "/TrinityNobleAnims", "/UnlockTrinityNoble", "/TrinityPrimeSkin", "/TrinitySkin", "/TrinityDeluxeSuit", "/HalloweenTwinGrakatas", "/JadeTwinGrakatas", "/NintendoGrineerAssaultRifleSkin", "/SummerSolsticeTwinRogga", "/AkimboViperCamo", "/ObsidianTwinVipers", "/RubedoAkimboViperCamo", "/SWArashiTwoHandedKatanaSkin", "/SWDogma", "/SWKsaraTwoHandedKatanaSkin", "/LongKatanaUpperBack", "/UmbraAArmor", "/UmbraCArmor", "/UmbraLArmor", "/DemonFrameAgileAnims", "/UnlockDemonFrameAgile", "/DemonFrameNobleAnims", "/UnlockDemonFrameNoble", "/DemonFrameSkin", "/KullervoTwoHandedSwordSkin", "/ErsatzHorseSaddleB", "/BerserkerAgileAnims", "/UnlockBerserkerAgile", "/BerserkerDeluxeAgileAnims", "/UnlockBerserkerDeluxeAgile", "/BerserkerDeluxeNobleAnims", "/UnlockBerserkerDeluxeNoble", "/ValkyrDeluxeSkin", "/SWDelusionSkin", "/BerserkerDeluxeSuit", "/SWRFourValkyrGraxxSkin", "/ValkyrHeirloomSkin", "/ValkyrAlternateSkin", "/JadeValkyrSkin", "/SWLeonessaSkin", "/SWMithraValkyrSkin", "/BerserkerNobleAnims", "/UnlockBerserkerNoble", "/ValkyrPrimeSkin", "/BerserkerSkin", "/BerserkerDangles", "/PrimeGyreArmorC", "/PrimeGyreArmorL", "/PrimeGyreArmorA", "/HalloweenVasto", "/GrineerForestVasto", "/VastoVoidSkin", "/TekeluVastoSkin", "/TrapperAgileAnims", "/UnlockTrapperAgile", "/SWBonaparteSkin", "/VaubanDeluxeSkin", "/SWGraxxVaubanSkin", "/VaubanHeirloomAux", "/VaubanHeirloomSkin", "/VaubanHeirloomAuxSleeveless", "/VaubanAlternateSkin", "/TrapperNobleAnims", "/UnlockTrapperNoble", "/VaubanVoidSkin", "/TrapperPrimeSkin", "/TrapperSkin", "/SWSuppressorSkin", "/GrineerForestVectis", "/VectisSharpshooter", "/VectisSilferer", "/OrnateVectis", "/ErsatzHorseTailC", "/WF1999FrostSkin", "/WF1999FrostAuxHat", "/GarudaGeminiSkin", "/GarudaGeminiChest", "/GarudaGeminiClawsSkin", "/VenariPrimeSkin", "/VenariSkin", "/AlchemistDeluxeShotgunSkin", "/KhoraDeluxeWhipBladeSkin", "/HalloweenArchSword", "/OrnateArchSword", "/GarudaDeluxeWarfanSkin", "/TwitchArmor2021C", "/TwitchArmor2021L", "/RedeemerTwitchSkin", "/TwitchArmor2021A", "/RevenantArmorL", "/RevenantArmorC", "/Halloween2023DOTDVetalaRevenantArmorL", "/Halloween2023DOTDVetalaRevenantArmorC", "/Halloween2023DOTDVetalaRevenantArmorA", "/PrimeRevenantArmourC", "/PrimeRevenantArmourL", "/PrimeRevenantArmourA", "/RevenantArmorA", "/HorseCrownEphemeraAngry", "/SWVikasaAegisArmorC", "/SWVikasaPlatingShoulderArmor", "/ViperCamo", "/ObsidianViper", "/RubedoViperCamo", "/GrimoireFantasySkin", "/NecramechVoidRigDefaultSkin", "/UnlockVoltAgile", "/VoltAgileAnims", "/DiscordVolt", "/SWROneVoltSkin", "/VoltArmArmor", "/SWCapacitorSkin", "/VoltDeluxeBSkin", "/SWFulgursorSkin", "/SWRFourVoltGraxxSkin", "/VoltAlternateSkin", "/VoltMask", "/UnlockVoltNoble", "/VoltNobleAnims", "/NintendoVolt", "/VoltPrimeArmArmor", "/VoltPrimeSkin", "/VoltTwitchSkin", "/VoltDeluxeSkin", "/VoltDeluxeRaijinSkin", "/VoltDeluxeRaijinAuxChest", "/VoltSkin", "/SWTechnoshockSkin", "/VoltChameleonArmArmor", "/VoltChameleonASkin", "/SWZenerSkin", "/UnlockWerewolfAgile", "/WerewolfAgileAnims", "/WerewolfArmArmor", "/SWWerewolfDemionnaArmArmor", "/VorunaDemionnaSkin", "/SWKuvaelArmArmor", "/SWVorunaKuvaelDrahkaanislSkin", "/VorunaDeluxeArmArmor", "/VorunaDeluxeSkin", "/UnlockWerewolfNoble", "/WerewolfNobleAnims", "/VorunaPrimeArmArmor", "/VorunaPrimeSkin", "/WerewolfSkin", "/WerewolfVoidshellArmArmor", "/VorunaVoidShellSkin", "/VulkarCamo", "/HoverboardStickerN", "/SWJotunheimWhipSkin", "/SWWuushWhipSkin", "/KDriveVelocipodRareSkin", "/UnlockWispAgile", "/WispAgileAnims", "/SWCelestisWispSkin", "/SWCovenWispSkin", "/SWDelusionSkin", "/DexWispSkin", "/SWWispGraxxSkin", "/WispAlternateSkin", "/UnlockWispNoble", "/WispNobleAnims", "/WispPrimeSkin", "/SWRaevuzSkin", "/WispSkin", "/WispDeluxeSkin", "/SWSycoraxWispSkin", "/SWZamariuWispSkin", "/HorseCrownEphemeraTeardrop", "/HoverboardStickerWolf", "/HoverboardStickerG", "/MonkeyKingAgileAnims", "/UnlockMonkeyKingAgile", "/SWAumanSkin", "/SWWukongMithraSkin", "/MonkeyKingNobleAnims", "/UnlockMonkeyKingNoble", "/SWPiercingEyeSkin", "/WukongPrimeSkin", "/WukongDeluxeBStaffSkin", "/WukongDeluxeBSkin", "/WukongDeluxeStaffSkin", "/WukongDeluxeArmArmor", "/WukongDeluxeSkin", "/MonkeyKingSkin", "/MonkeyKingChamelionSkin", "/ObsidianWyrm", "/SWXairaksArmorC", "/SWXairaksArmorL", "/BrokenFrameAgileAnims", "/UnlockBrokenFrameAgile", "/SWXakuDeatheaSkin", "/XakuDeluxeSkin", "/BrokenFrameNobleAnims", "/UnlockBrokenFrameNoble", "/XakuPrimeSkin", "/XakuCosmosSkin", "/BrokenFrameSkin", "/LisetGyroscopeSkinNekrognos", "/LisetGyroscopeSkinIfrit", "/LisetGyroscopeGrineerQueens", "/SWXiphosLilieaeSkin", "/LisetGyroscopeSkinPrimeTrader", "/LisetGyroscopeDefault", "/SWXulatuChestArmor", "/UnlockYareliAgile", "/YareliAgileAnims", "/UnlockYareliNoble", "/YareliNobleAnims", "/YareliDeluxeSkin", "/YareliPrimeSkin", "/YareliSkin", "/HoverboardStickerB", "/SummerSolsticeZarr", "/TnMilitaryDualDaggerSkin", "/ExcaliburDeluxeArmArmor", "/ExcaliburDeluxeSugatra", "/SWZenoriuEarAccessory", "/SWZenoriuFacialAccessory", "/SWZenoriuEyeAccessory", "/TenguAgileAnims", "/UnlockTenguAgile", "/SWZephyrBotLSkin", "/ZephyrQTCCBodySkin", "/SWZephyrGraxxSkin", "/SWRThreeHagoromoSkin", "/TenguDeluxeAgileAnims", "/UnlockTenguDeluxeAgile", "/TenguDeluxeNobleAnims", "/UnlockTenguDeluxeNoble", "/ZephyrDeluxeSkin", "/ZephyrAlternateSkin", "/TenguNobleAnims", "/UnlockTenguNoble", "/ZephyrPrimeAlternateSkin", "/SWRThreeSkeironSkin", "/TenguSkin", "/SWStrafeSkin", "/SWZhiviraShoulderArmorA", "/TnSubmachinegunDualPistolSkin", "/TnSubmachinegunPistolSkin", "/ZylokExilisSkin", "/TattooDuviriC", "/TattooLoveRose", "/TattooCorpusA", "/Hair1999Volt", "/TattooLoveFlower", "/PrimeAccessoriesCEar", "/Hair1999Mag", "/Hair1999Excalibur", "/TattooTennoG", "/SkirtAthletic", "/LeggingsAthletic", "/BodySuitAthletic", "/SleevesAthletic", "/SWAuresCrownFacialAcc", "/SWAuresEarAcc", "/MakeupMaskH", "/BaseOperatorAnims", "/TattooNightwaveCommando", "/MakeupMaskA", "/SWBlazeOculusEyeAcc", "/NewHairB", "/HairE", "/HairUOneBraid", "/NewHairA", "/TattooGrineerA", "/SWButterflyEyeAcc", "/SWCaeruleaVisorEyeAcc", "/TattooLoveFlowerB", "/SWChoroidEyeAcc", "/SkirtLasrianB", "/LeggingsOperatorLasrianB", "/SleevesOperatorLasrianB", "/HoodOperatorLasrianB", "/BodySuitOperatorLasrianB", "/TattooDuviriE", "/HoodPrimeD", "/LeggingsPrimeD", "/SleevesPrimeD", "/BodySuitPrimeD", "/TempleDots", "/TattooCorpusC", "/SkirtPrimeB", "/OperatorPrimeArmourBody", "/OperatorPrimeArmourLegs", "/OperatorPrimeArmourHead", "/OperatorPrimeArmourArms", "/ExtraAlbedoA", "/ExtraAlbedoB", "/AlbedoA", "/AlbedoB", "/AlbedoC", "/AlbedoD", "/AlbedoE", "/AlbedoF", "/AlbedoG", "/AlbedoH", "/AlbedoI", "/AlbedoJ", "/LegacyAlbedo", "/AlbedoK", "/AlbedoM", "/AlbedoN", "/AlbedoQ", "/AlbedoR", "/AlbedoS", "/AlbedoT", "/TattooTennoH", "/TattooTennoI", "/SWCorailDiademFacialAcc", "/HairA", "/HairB", "/HairP", "/HairC", "/Hair001Cap", "/HairZB", "/HairZ", "/HairVThree", "/HairVOne", "/HairVTwo", "/TattooCorpusE", "/EyepieceA", "/Hair1999Nyx", "/PrimeAccessoriesAFacial", "/TattooLoveHeart", "/SWEternaliaEyeAcc", "/TattooGrineerB", "/EyepieceB", "/SW1999F19CondrocEarsAcc", "/FemaleBody", "/Hair1999Temple", "/SWFrameFriendEarAcc", "/SWFrameFriendEarLAcc", "/SWFrameFriendEarRAcc", "/TattooTennoF", "/TattooCorpusD", "/SWGarasuFacialAcc", "/SWGarasuEarAcc", "/TattooGeodeBlack", "/TattooGeodeGrey", "/TattooGeode", "/BodySuitOperatorDemonframe", "/LeggingsOperatorDemonframe", "/HoodOperatorDemonframe", "/SkirtOperatorDemonframe", "/SleevesOperatorDemonframe", "/HoodGrunge", "/BodySuitGrunge", "/LeggingsGrunge", "/SkirtGrunge", "/SleevesGrunge", "/SWHaemadysMaskAcc", "/HoodZephyrDeluxe", "/LeggingsZephyrDeluxe", "/SleevesZephyrDeluxe", "/BodySuitZephyrDeluxe", "/SW1999Y2kEyeCAcc", "/TattooDuviriF", "/TattooGrineerE", "/TattooCorpusB", "/TattooGrineerC", "/SWIryaEyeAcc", "/EyepieceOperatorGlassesSensei", "/CaliberChicksJillianBandana", "/HairCaliberChicksJillian", "/SWJotunheimEyeAcc", "/SW1999Y2kEyeBAcc", "/MakeupMaskI", "/SWKatixEarAcc", "/Hair1999Nova", "/TattooDuviriD", "/SWKiritsuneEyeAcc", "/SWKonvalystEyeAcc", "/SkirtB", "/HoodB", "/LeggingsB", "/SleevesB", "/BodySuitB", "/HipSocketB", "/SW1999Y2kAccCEar", "/Hair1999Trinity", "/TattooTennoB", "/CaliberChicksLillianEyepatch", "/HairCaliberChicksLillian", "/Hair1999Loid", "/SWLumisEyeAcc", "/Hair1999Harrow", "/MaduraiAnims", "/MaleBody", "/HoodD", "/LeggingsD", "/SleevesD", "/BodySuitD", "/TattooDuviriG", "/Hair1999Wisp", "/EarpieceA", "/HairG", "/HairI", "/SWMillenniumVisorFacialAcc", "/Hair1999Saryn", "/Hair1999SarynNoGlasses", "/TattooTennoD", "/NaramonAnims", "/BodySuitPrimeE", "/LeggingsPrimeE", "/HoodPrimeE", "/SleevesPrimeE", "/HoodPrimeEChina", "/NoHood", "/EyepieceC", "/SkirtArabic", "/HoodArabic", "/LeggingsArabic", "/SleevesArabic", "/BodySuitArabic", "/HoodOutfit1A", "/LeggingsOutfit1A", "/SleevesOutfit1A", "/BodySuitOutfit1A", "/HoodOutfit3A", "/LeggingsOutfit3A", "/SleevesOutfit3A", "/BodySuitOutfit3A", "/OperatorCustomization", "/SWOptimaEyeAcc", "/SWPapillonEyeAcc", "/SW1999Y2kAccBEar", "/MakeupMaskF", "/SWPraesidiumFacialAcc", "/Hair1999Quincy", "/PrimeAccessoriesBFacial", "/RevenantDeluxeCrown", "/RevenantDeluxeMask", "/Hair1999Uriel", "/MakeupMaskC", "/MakeupMaskE", "/Hair1999Rusalka", "/Hair1999Ash", "/MakeupMaskJ", "/HoodPrimeA", "/LeggingsPrimeA", "/SleevesPrimeA", "/BodySuitPrimeA", "/TempleHornDouble", "/SWScleraOculusEyeAcc", "/TempleHornSingle", "/TattooDuviriB", "/Hair002Cap", "/HairH", "/HairD", "/HairM", "/HairN", "/Hair029RM", "/TattooGrineerD", "/DrifterAmpSkin", "/CircletA", "/SW1999Y2kEyeAAcc", "/SWSpicularisFacialAcc", "/SWSpicularisVisorEyeAcc", "/SleevesOperatorLasrianA", "/BodySuitOperatorLasrianA", "/HoodOperatorLasrianA", "/LeggingsOperatorLasrianA", "/SWStygeanEyeAcc", "/MakeupMaskG", "/LeggingsPrimeF", "/HoodPrimeF", "/BodySuitPrimeF", "/SleevesPrimeF", "/InkSiroccoAmpSkin", "/SkirtPrimeC", "/HoodPrimeC", "/LeggingsPrimeC", "/SleevesPrimeC", "/BodySuitPrimeC", "/HairK", "/HairL", "/PiercingA", "/UmbraBlindfold", "/UmbraCirclet", "/UmbraEarpiece", "/UmbraScarfHood", "/UnairuAnims", "/HairO", "/HairJ", "/HoodC", "/LeggingsC", "/SleevesC", "/BodySuitC", "/VayasPrimeDiadem", "/VayasPrimeEarpiece", "/VayasPrimeMask", "/VazarinAnims", "/Hair1999Frost", "/Hair1999Garuda", "/EarpieceB", "/TattooDuviriA", "/MakeupMaskB", "/OperatorNefAnyoMask", "/SWVuotoEyeAcc", "/CircletLaurel", "/TattooTennoC", "/MakeupMaskD", "/SWYureilystEyeAcc", "/ExcaliburDeluxeEarpiece", "/ExcaliburDeluxeMouthPiece", "/ExcaliburDeluxeEyepiece", "/SkirtG", "/MageArmourBody", "/MageArmourLegs", "/MageArmourHead", "/MageArmourArms", "/ZenurikAnims", "/HoodA", "/LeggingsA", "/SleevesA", "/BodySuitA", "/SkirtAdultAthletic", "/SleevesOperatorDrifterGoth", "/OperatorDrifterGothFaceAccessory", "/LeggingsOperatorDrifterGoth", "/BodySuitOperatorDrifterGoth", "/HoodOperatorDrifterGoth", "/SkirtDrifterGrineer", "/LeggingsAdultAthletic", "/BodySuitAdultAthletic", "/SleevesAdultAthletic", "/HairAdultN", "/SkirtAdultLasrianB", "/LeggingsAdultOperatorLasrianB", "/SleevesAdultOperatorLasrianB", "/HoodAdultOperatorLasrianB", "/BodySuitAdultOperatorLasrianB", "/HoodAdultPrimeD", "/LeggingsAdultPrimeD", "/SleevesAdultPrimeD", "/BodySuitAdultPrimeD", "/SkirtAdultPrimeB", "/BodySuitAdultPrimeB", "/LeggingsAdultPrimeB", "/HoodAdultPrimeB", "/SleevesAdultPrimeB", "/AdultAlbedoA", "/AdultAlbedoB", "/AdultAlbedoC", "/AdultAlbedoD", "/AdultAlbedoE", "/AdultAlbedoF", "/AdultAlbedoG", "/AdultAlbedoH", "/AdultAlbedoI", "/AdultAlbedoJ", "/AdultLegacyAlbedo", "/AdultAlbedoK", "/AdultAlbedoM", "/AdultAlbedoN", "/AdultAlbedoQ", "/AdultAlbedoR", "/AdultAlbedoS", "/AdultAlbedoT", "/AdultOperatorAgileAnims", "/SkirtAdultArabic", "/HoodAdultArabic", "/LeggingsAdultArabic", "/SleevesAdultArabic", "/BodySuitAdultArabic", "/SkirtAdultC", "/HoodAdultDrifterGrineer", "/LeggingsAdultDrifterGrineer", "/SleevesAdultDrifterGrineer", "/BodySuitAdultDrifterGrineer", "/HoodAdultC", "/HoodAdultOutfit1A", "/LeggingsAdultOutfit1A", "/SleevesAdultOutfit1A", "/BodySuitAdultOutfit1A", "/AdultOperatorNobleAnims", "/HoodAdultOutfit3A", "/LeggingsAdultOutfit3A", "/SleevesAdultOutfit3A", "/BodySuitAdultOutfit3A", "/LeggingsAdultC", "/SleevesAdultC", "/BodySuitAdultC", "/HoodAdultOperatorDrifterGoth", "/BodySuitAdultOperatorDrifterGoth", "/LeggingsAdultOperatorDrifterGoth", "/SleevesAdultOperatorDrifterGoth", "/BodySuitAdultOperatorDemonframe", "/LeggingsAdultOperatorDemonframe", "/HoodAdultOperatorDemonframe", "/SkirtAdultOperatorDemonframe", "/SleevesAdultOperatorDemonframe", "/HoodAdultGrunge", "/BodySuitAdultGrunge", "/LeggingsAdultGrunge", "/SkirtAdultGrunge", "/SleevesAdultGrunge", "/HoodAdultDeluxeA", "/LeggingsAdultDeluxeA", "/SleevesAdultDeluxeA", "/BodySuitAdultDeluxeA", "/SkirtAdultB", "/HoodAdultB", "/LeggingsAdultB", "/SleevesAdultB", "/BodySuitAdultB", "/HoodAdultD", "/LeggingsAdultD", "/SleevesAdultD", "/BodySuitAdultD", "/BodySuitAdultPrimeE", "/LeggingsAdultPrimeE", "/HoodAdultPrimeE", "/SleevesAdultPrimeE", "/HoodAdultPrimeEChina", "/HoodAdultPrimeA", "/LeggingsAdultPrimeA", "/SleevesAdultPrimeA", "/BodySuitAdultPrimeA", "/SleevesAdultOperatorLasrianA", "/BodySuitAdultOperatorLasrianA", "/HoodAdultOperatorLasrianA", "/LeggingsAdultOperatorLasrianA", "/LeggingsAdultPrimeF", "/HoodAdultPrimeF", "/BodySuitAdultPrimeF", "/SleevesAdultPrimeF", "/SkirtAdultPrimeC", "/HoodAdultPrimeC", "/LeggingsAdultPrimeC", "/SleevesAdultPrimeC", "/BodySuitAdultPrimeC", "/HoodDuviriAdultOperator", "/AdultUmbraScarfHood", "/HoodAdultNewC", "/LeggingsAdultNewC", "/SleevesAdultNewC", "/BodySuitAdultNewC", "/WolfHoodAdult", "/SkirtAdultG", "/BodySuitAdultG", "/LeggingsAdultG", "/HoodAdultG", "/SleevesAdultG", "/HoodAdultA", "/LeggingsAdultA", "/SleevesAdultA", "/BodySuitAdultA"];
const SKIN_SENTINEL_EXCLUDE_END	= ["CapsuleTail", "CarbuncleDethcubeSkin", "DefaultCarrierPrimeSkin", "DefaultCarrierSkin", "InfBatMask", "InfBatTail", "InfBatWings", "InfNightWaveWingsRight", "InfestedWings", "InfestedWingsRight", "GunHeadMask", "ColtekTail", "ColtekWings", "ColtekWingsRight", "DefaultDethcubePrimeSkin", "DefaultDethcubeSkin", "DiamondWings", "DiamondWingsRight", "NightwatchDirigaSkin", "DefaultDirigaSkin", "PersianDjinnSkin", "DefaultDjinnSkin", "DomeWings", "DomeWingsRight", "LNYDragonMask", "LNYDragonSentinelSkin", "LNYDragonTail", "LNYDragonWings", "HeimtPrimeSentinelMask", "HeimtPrimeSentinelTail", "HeimtPrimeSentinelWings", "DefaultHeliosPrimeSkin", "DefaultHeliosSkin", "HunhowMask", "IctusPrimeMask", "IctusPrimeTail", "IctusPrimeWings", "IctusPrimeWingsRight", "IctusMask", "IctusTail", "IctusWings", "IctusWingsRight", "/JetWings", "JetWingsRight", "KavatPetWingsRight", "HeliosDeluxeMask", "HeliosDeluxe", "HeliosDeluxeTail", "HeliosDeluxeWings", "/FishTail", "KubrowMask", "LotusMask", "InfestedMask", "/MechHeadMask", "DefaultNautilusPrimeSentinelSkin", "TnEmpyreanSocketMask", "TnEmpyreanSocketTail", "TnEmpyreanSocketWings", "DefaultEmpyreanSentinelSkin", "NautilusPrimeSentinelMask", "NautilusPrimeSentinelTail", "NautilusPrimeSentinelWings", "DethcubePrimeMask", "DethcubePrimeTail", "DethcubePrimeWings", "DethcubePrimeWingsRight", "OwlSentinelSkin", "DefaultOxylusSkin", "ParrotCarrierSkin", "ParrotMask", "ParrotTail", "ParrotWings", "ParrotWingsRight", "PrismaJetWingsRight", "TnHydroidDlxSentSkin", "TnHydroidDlxSentMask", "TnHydroidDlxSentTail", "TnHydroidDlxSentWings", "DefaultShadePrismaSkin", "DefaultShadeSkin", "SpriteShadeSkin", "OrokinMask", "OrokinTail", "OrokinWings", "OrokinWingsRight", "DefaultTaxonSkin", "InfestedTail", "PrimeSentinelMask", "PrimeSentinelTail", "PrimeSentinelWings", "PrimeSentinelWingsRight", "GardenerWingsRight", "GardenerWingsStatic", "GardenerWingsStaticRight", "DefaultWyrmPrimeSkin", "DefaultWyrmSkin"];
const SUGATRA_EXCLUDE_END		= ["CitrineSugatra", "SurakaPrimeDangle", "LNYBirdSugatra", "ESGrnSugatraMeleeDangle", "GrnMeleeDangle", "CatenoPrimeMeleeDangle", "PrimeDangleF", "LNYSnakeMeleeDangle", "/PrimeMeleeDangle", "PolearmFriendlyMeleeDangle", "ChromaDeluxeMeleeDangle", "WukongDlxSugatra", "LimboDeluxeDangle", "XBoxSugatra2MeleeDangle", "JadePatikaMeleeDangle", "KazeruPrimeMeleeDangle", "GrnQueensMeleeDangle", "WegameChinaKnotDangle", "LNYCarpSugatra", "VaubanDeluxeMeleeDangle", "SarynDeluxeMeleeDangle", "ScrollingPrimeMeleeDangle", "ObsidianSugatraMeleeDangle", "Obsidian2SugatraMeleeDangle", "SugatraNintendo", "TnSugatraNewPlayerXpMeleeDangle", "TennoMeleeDangle", "ChainTridentMeleeDangle", "CorpusMeleeDangle", "YareliDlxSugatra", "PrimeDangleEMeleeDangle", "IceMeleeDangle", "TnRailJackSugatra", "TwitchPrimeMeleeDangle", "SentSugatraNewWarDangle", "LotusPointMeleeDangle", "LNYFireSugatra", "CordsMeleeDangle", "TennoCon2022SugatraMeleeDangle", "EmbolistMeleeDangle", "NekrosDeluxeMeleeDangle", "RazorMeleeDangle", "ValaPrimeMeleeDangle"]; 
const SYANDANA_EXCLUDE_END		= ["/PrimeScarfG", "/HalloweenErosionCape", "/ErosionCape", "/LavosDeluxeSyandana", "/PaxDuviricusSyandana", "/SWAkSuraScarf", "/PacifistSyandana", "/SWAlocanaSyandana", "/PrimeAltraScarf", "/SapientCape", "/GrnAmphisScarf", "/IvaraPrimeCape", "/KazInfestedScarf", "/SWRThreeAquirosScarf", "/SWArcturusScarf", "/SWArmalystSyandana", "/SWAropanexSyandana", "/PrimeArtifexSyandana", "/TnBrokenFrameSyandana", "/EnergyScarfVoidSkin", "/EnergyScarf", "/PrimeAkrabuSyandana", "/PrimeRevenantCape", "/PrimeAviaSyandana", "/InfBatCape", "/SWAlyaScarf", "/EmberDeluxeSyandana", "/SWBodoScarf", "/GaussDeluxeCape", "/SWBoltaraScarf", "/TennoAngleCapeScarf", "/HildrynDeluxeSyandana", "/TnLargeCape", "/HydroidDeluxeBlazers", "/NezhaDeluxeScarf", "/PrimeScarfF", "/NokkoSyandana", "/TnVoltDeluxeSyandana", "/CenturionCape", "/SummerSolsticeCenturionCape", "/SWChemtankSyandana", "/EquinoxDeluxeCape", "/PrimeScarfV", "/MesaDeluxeSyandana", "/CitrineDeluxeSyandana", "/SWCoronaScarf", "/SWCovenantScarf", "/TnAshDeluxe2Syandana", "/NidusPrimeSyandana", "/SWCryonaScarf", "/KulervoDeluxeSyandana", "/BillowingCape", "/PrimeScarfDItem", "/NovaDeluxeScarf", "/UmbraDaxSyandana", "/SWDeruScarf", "/SWDespotScarf", "/GarudaDeluxeSyandana", "/SWDiablilloSyandana", "/SWDisconnectScarf", "/SWDominusCape", "/SWDraugenSyandana", "/SWDueVolpiScarf", "/SWEklisSyandana", "/PrimeWispSyandana", "/NyxDeluxeSyandana", "/SWEzrielSyandana", "/SWFeiSyandana", "/CrpCubinatorScarf", "/TennoFeathersCapeScarf", "/TitaniaPrimeShortSyandana", "/TitaniaPrimeSyandana", "/GlassDeluxeSyandana", "/SWGothicaSyandana", "/SWRSixSpitefireScarf", "/PrimeVorunaSyandana", "/GrineerTurbinesScarf", "/HornSkullScarfDefault", "/StyanaxDeluxeSyandana", "/TnGlassSyandana", "/SWIcariusScarf", "/HalloweenFireFlyScarf", "/FireFlyScarf", "/InfestedFinsScarf", "/HolidayTurtleNeckScarf", "/JadeTurtleNeckScarf", "/TurtleNeckScarf", "/PrimeChromaCape", "/SWIncubusScarf", "/PrimeCapeEquinox", "/Halloween2024U17TnoCapeScarf", "/U17TnoCapeItem", "/JadeSyandana", "/JadeBombyxScarf", "/TnLargeCapeXbox", "/SWRThreeJattukScarf", "/PrimeWukongSyandana", "/SWJotunheimMusic", "/SWJotunheimScarf", "/LasBackpackMedkitSyandana", "/PrimeInarosSyandana", "/KhoraPrimeSyandana", "/QuillCape", "/BaruukDeluxeCape", "/QuillCanistersSyandana", "/DeimosSupporterFireFlyBlueScarf", "/BaroCape2RazzaExilisScarf", "/BaroCape", "/SWKunshuScarf", "/GrnQueenScarf", "/GrnHoodedCape", "/HalloweenKyropteraScarf", "/BrassAndGoldScarf", "/MixerKyropteraScarf", "/April2015Scarf", "/GrnStrapsScarf", "/PrimeStyanaxSyandana", "/TnStyanaxSyandana", "/SWLaprosysSyandana", "/NefSyandanaScarf", "/GrendelDeluxeIISyandana", "/SWLunariusSyandana", "/DaxSquareCape", "/DaxTwoTailsCape", "/InfGrnWolfCape", "/GrnVhCape", "/SummerSolsticeMaggorCape", "/SWMaharliqaScarf", "/PrimeScarfAtlas", "/PrimeMerulinaSyandana", "/YareliCape", "/PrimeScarf", "/SWMithraScarf", "/TnGuandaoScarf", "/InfTentacleScarf", "/SWMushussuScarf", "/SWNaruScarf", "/PrimeNaveScarf", "/PriestScarf", "/LotusCapeItem", "/NeurovyrePrimeSyandana", "/SentSyandanaB", "/SWNighthunterSyandana", "/NoruPrimeScarf", "/NidusDeluxeScarf", "/SWRThreeNsaruScarf", "/TC2025OrokinScarf", "/TC2025EvolvedOrokinScarf", "/PrimeLimboCape", "/ObsidianAzureScarf", "/ObsidianCrowSyandana", "/ObsidianKyropteraScarf", "/ObsidianSamiaScarf", "/PS5Syandana", "/SWOfficiumScarf", "/NintendoTurtleNeckScarf", "/CrpAladScarf", "/TnNewPlayerSyandana", "/StalkerCapeItem", "/RhinoDeluxeScarf", "/TnLefaucheuxSyandana", "/TnSparrowCape", "/SWPaxisScarf", "/SWPistrisScarf", "/TnConcreteSyandana", "/NarmerEvolvingSyandanaCCape", "/NarmerEvolvingSyandanaBCape", "/NarmerEvolvingSyandanaACape", "/TnKorahSyandanaDeluxe", "/PrimeFlameScarf", "/FlameScarf", "/CrpMBundleSyandana", "/NovaIIDeluxeSyandana", "/SWRaijiScarf", "/SWRanulystSyandana", "/GrnTubeScarf", "/SWRauSyandana", "/TitaniaDeluxeV2Cape", "/TnPagemasterSyandana", "/SWRepalaScarf", "/SWRetrorolystSyandana", "/RevenantDeluxeCape", "/SWRhodoraSyandana", "/PrimeRhoptronSyandana", "/TnOdaliskSyandana", "/ArcherCape", "/TennoLeafDotCapeScarf", "/SWRSixSariScarf", "/SWSarvaHarnessScarf", "/SWScapulisScarf", "/InarosDlxCape", "/SWSciathinScarf", "/SWScyllaScarf", "/SWSenvictisSyandana", "/SWSeraphimScarf", "/PrimeOctaviaSyandana", "/SWSetharSyandana", "/SWSetkaScarf", "/SWShirokuSyandana", "/SWShurihoshiScarf", "/LimboDeluxeCape", "/TnRailjackSyandana", "/SWSildargScarf", "/SWSolidaScarf", "/InfCoralSyandana", "/SWSovereignScarf", "/TwitchPrimeScarf", "/AtlasDeluxeSyandana", "/SWStyxSyandana", "/WukongDeluxeSyandana", "/TnWispDeluxeSyandana", "/PrimeOberonCape", "/PrimeGrendelSyandana", "/TnOniSyandana", "/GarudaCape", "/PrimeSuratorSyandana", "/ShieldFrameCape", "/SWSydekoScarf", "/TnSmallBatteryCape", "/GaussDeluxeIISyandana", "/TennoConScarf", "/TennoCon2017Scarf", "/TennoCon2020Scarf", "/TennoCon2023Cape", "/TennoCon2024Scarf", "/TC2025Scarf", "/TC2025EvolvedScarf", "/SWTenuiSyandana", "/SWTeploScarf", "/IvaraDeluxeSyandana", "/InfScarfRibCage", "/SWTonacaScarf", "/PrimeGyreSyandana", "/TnGyreCape", "/SWTsujinasaSyandana", "/U17IntermScarfItem", "/UruPrimeScarf", "/RazorScarf", "/SWValestiScarf", "/GrnBannerScarfItem", "/HalloweenGrnBannerScarf", "/MagDeluxeScarf", "/TnOctaviaDeluxeCape", "/CrpModularScarf", "/PrimeTwitchScarf", "/VitamPrimeSyandana", "/TnAlchemistSyandana", "/TnWraitheSyandana", "/EmberDeluxeIISyandana", "/WispPrimeDefaultCape", "/SWXikonosSyandana", "/YamakoPrimeScarf", "/RubedoDinoSpikeScarf", "/DinoSpikeScarf", "/PS4ArmScarf", "/ArmScarf", "/SWZaikhyaScarf", "/SWZamariuSyandana",	]
const SENTITEL_EXCEPTION		= ["ZanukaPetMeleeWeaponPS", "ZanukaPetMeleeWeaponIP", "ZanukaPetMeleeWeaponIS"];
const SKINPET_EXCLUDE_END		= ["KubrowPetPatternLiquid", "KubrowPetPatternH", "KubrowPetPatternXmasC", "InfestedPredatorPatternDefault", "InfestedCritterPatternDefault", "KubrowPetPatternD", "DrahkKubrowPattern", "KubrowPetPatternDuviriWolf", "KubrowPetPatternHelminthDeluxe", "HelminthPetPatternClassic", "KubrowPetPatternInfested", "KubrowPetPatternC", "CatbrowPetPatternA", "CatbrowPetPatternHyekka", "EntratiCatbrowPattern", "KubrowPetPatternPrimeA", "DuviriCatbrowPattern", "CatbrowPetPatternD", "KubrowPetPatternF", "KubrowPetPatternE", "FeralCatbrowPattern", "KubrowPetPatternG", "KubrowPetPatternXmasA", "CatbrowPetPatternC", "KubrowPetPatternXmasB", "KubrowPetPatternB", "KubrowPetPatternA", "CatbrowPetPatternB", "WukongPrimeKubrowPattern", "KubrowPetPatternI", "CatbrowPetPatternVampire"];
const WEAPON_FIVE_EVOLUTION		= ["ZarimanPumpShotgun", "ZarimanDaggerWeapon", "ZarimanHeavyPistol", "EntratiWristGunWeapon", "ZarimanSemiAutoRifle", "ZarimanTonfaWeapon", "EntFistIncarnon", "ZarimanHeavyScytheWeapon"];
const WEAPON_INCARNON			= ["ParisScythe", "/Staff/Staff", "PrimeBoWeapon", "DualInfestedAxesWeapon", "Fist/Fist", "FuraxWraith", "LongSword/LongSword", "SkanaPrime", "PrismaSkana", "PaladinMaceWeapon", "NLMagistar", ...WEAPON_FIVE_EVOLUTION];
const WEAPON_INCARNON_FILTER	= ["Incarnon", "Spectral"];
const WEAPON_SKIN_INCLUDE_END	= ["WinterSolstice/SolsticeAcceltraSkin", "PvP/Melee/PvPAckBrunt", "Promo/Twitch/Twitch2021AfurisSkin", "Promo/Twitch/AkjagaraIridosSkin", "PvP/Pistols/PvPAklato", "PvP/Pistols/PvPAkLex", "Koumei/KoumeiWarfanSkin", "PvP/Pistols/PvPAkstiletto", "PvP/Pistols/PvPAkvasto", "EliteAlerts/EliteAlertAmprex", "PvP/Pistols/PvPAngstrum", "Promo/Twitch/TwitchAnkyros", "VoidTrader/BaroInarosPolearmSkin", "Promo/Seasonal/TennobaumArcaPlasmorSkin", "Halloween/DOTD2025AtomosSkin", "Promo/Seasonal/TennobaumAtomosSkin", "EliteAlerts/EliteAlertAtomos", "Camo/DesertAtteraxSkin", "EliteAlerts/EliteAlertAtterax", "Halloween/HalloweenBasmu", "Weapons/Daggers/AshGeminiDaggerSkin", "Weapons/Throwable/AshGeminiKunaiSkin", "Weapons/LongGuns/AshGeminiVectisSkin", "Weapons/Pistols/GarudaGeminiBallisticaSkin", "Weapons/LongGuns/GarudaGeminiNagantakaSkin", "Weapons/Claws/GarudaGeminiClawsSkin", "VoidTrader/VTBoarExilis", "Promo/Seasonal/TennobaumBoltor", "PvP/LongGuns/PvPBraton", "Promo/Seasonal/TennobaumBrokenWar", "Daybreak/DaybreakBubonicoSkin", "Weapons/LongGuns/SolsticeBurston", "Promo/Seasonal/TennobaumCantare", "Nightwave/DaybreakCedoSkin", "WinterSolstice/SolsticeCorinthSkin", "Necramech/MechWeapon/MechEventCortegeSkin", "Promo/Seasonal/XmasGlaiveSkin", "Promo/Seasonal/TennobaumCycronSkin", "PvP/Bows/PvPDaikyu", "VoidTrader/AshLeverianLiosPistol", "PvP/Melee/PvPDragonNikana", "Weapons/UnrealTournament/DrakgoonFlakCannonSkin", "Halloween/HalloweenDread", "Promo/Seasonal/TennobaumDualKeresSkin", "PvP/Melee/PvPDualSkana", "Weapons/DualSword/DualRibbonKamasSkin", "Melee/AxeML/StavikaDualSwordSkin", "DualAxe/DaggerAxe", "Deluxe/CalibanDeluxeBowSkin", "VoidTrader/ElixisLatronPistol", "Scythes/JadelightHate", "ValentinesDay/ValentinesArrow", "Nightwave/InfHeavyClawsSkin", "Dazzle/ShockExergisSkin", "Dazzle/ShockFalcorSkin", "Events/ArchRocketCrossbowGrineer", "Hammer/GrnHammer", "Promo/Seasonal/TennobaumFulminSkin", "PvP/Melee/PvPFurax", "WinterSolstice/SolsticeGalatineSkin", "Promo/Seasonal/Halloween2023DOTDGammacorSkin", "WinterSolstice/WinterSolsticeGammacorSkin", "PvP/Melee/PvPGlaive", "Nightwave/DayBreakGlaiveSkin", "Events/GlaxionPolar", "PvP/LongGuns/PvPGorgon", "SummerSolstice/SummerSolsticeGorgon", "SummerSolstice/SummerSolsticeGrakata", "Halloween/HalloweenGram", "Promo/Seasonal/TennobaumGramSkin", "PvP/LongGuns/PvPGrinlok", "Camo/DesertGrinlokSkin", "WinterSolstice/SolsticeGaundaoSkin", "CephWepSkins/CephGaundaoSkin", "Camo/DesertHekSkin", "Nightwave/CephPolearmSkin", "Halloween/Halloween2024DOTDIgnisSkin", "WinterSolstice/SolsticeIgnisSkin", "SummerSolstice/SummerIgnisSkin", "PvP/Melee/PvPJatKittag", "PvP/LongGuns/PvPKarak", "Camo/DesertKarakSkin", "VoidTrader/BaroArrow", "Yareli/KompressaDaybreakSkin", "PvP/Pistols/PvPKraken", "PvP/Melee/PvPKronen", "Weapons/Tonfa/KronenTwitchSkin", "Weapons/Redeemer/TnSpikeGunbladeSkin", "Events/AcolyteStalkerMios", "PvP/Pistols/PvPLato", "PvP/LongGuns/PvPLatron", "WinterSolstice/WinterSolsticeLatron", "Weapons/Staff/TnRibbonStaffSkin", "WinterSolstice/SolsticeLenzSkin", "PvP/Pistols/PvPLex", "VoidTrader/BaroScytheMacheteSkin", "Daybreak/DaybreakMagistarSkin", "PvP/Pistols/PvPMarelok", "Camo/DesertMarelokSkin", "Necramech/MechWeapon/MechEventMorghaSkin", "PvP/Melee/PvPNikana", "VoidTrader/ElixisNikana", "Hammer/NoodleHammerSkin", "Nightwave/DaybreakNukorSkin", "Promo/Seasonal/TennobaumOcucor", "Promo/Twitch/OgrisTwitchSkin", "Weapons/UnrealTournament/OgrisRocketLauncherSkin", "Halloween/DOTD2025OkinaSkin", "PvP/LongGuns/PvPOpticor", "VoidTrader/ElixisOpticor", "VoidTrader/ElixisBallasSword", "Events/InfQuantaInfestedAladV", "Promo/Warframe/PromoParis", "Promo/Seasonal/TennobaumParis", "Promo/Twitch/TwitchPentaSkin", "Dazzle/ShockPlinxSkin", "VoidTrader/PrismaArrow", "Weapons/DSPistols/LexHammer", "Weapons/Swords/LasriaSkanaSwordSkin", "Weapons/DSPistols/BroncoSpectre", "Weapons/DSPistols/LatoTekna", "Weapons/DSPistols/FurisVekesk", "Promo/Twitch/PyranaTwitchSkin", "CephWepSkins/CephPyranaSkin", "VoidTrader/VTQuanta", "WinterSolstice/SolsticeQuassusSkin", "Weapons/Rapier/CrpRapierSkin", "Weapons/Redeemer/RedeemerRelayWaterSkin", "VoidTrader/VTRedeemerSkin", "Weapons/Redeemer/RedeemerRelayFireSkin", "Leverian/NezhaLeverian/NezhaLeverianPolearm", "Festivities/JingleKnuckles", "CephWepSkins/CephRubicoSkin", "Axe/DaggerAxe", "HeavyAxe/GrnAxe", "Axe/SolsticeScindo", "PvP/Melee/PvPSkana", "WinterSolstice/SolsticeSkiajatiSkin", "Weapons/Rifle/SoaktronRifleSkin", "PvP/LongGuns/PvPSoma", "VoidTrader/ElixisSonicor", "Promo/Seasonal/CandyCaneEtherReaperSkin", "Promo/Seasonal/CandyCaneHateSkin", "Promo/Seasonal/CandyCaneReaperPrimeSkin", "Promo/Seasonal/CandyCaneScytheSkin", "Weapons/UnrealTournament/StahltaShockRifleSkin", "PvP/LongGuns/PvPStrun", "PvP/LongGuns/PvPSybaris", "Melee/Swords/TnShinaiSword/TnShinaiSwordSkin", "WinterSolstice/SolsticeTatsuSkin", "VoidTrader/ElixisTiberon", "VoidTrader/ElixisTigris", "Promo/Twitch/TigrisTwitchSkin", "PvP/Melee/PvPTipedo", "PvP/LongGuns/PvPTonkor", "Camo/DesertTonkorSkin", "Deluxe/ProteaDeluxeGlaiveSkin", "SummerSolstice/SummerSolsticeTwinGrakatas", "PvP/Pistols/PvPTwinVipers", "Nightwave/InfTwoHandedKatanaSkin", "PvP/Pistols/PvPVasto", "Promo/Twitch/TwitchRubicoSkin", "Weapons/Rapier/LasOcelotRapierSkin", "PvP/Pistols/PvPViper", "Events/OgrisOldSchool", "Weapons/Glaives/XorisExilisSkin"];

// for big list using END name meaning to be compare with EndsWith, create a set !

const SET_BOBBLEHEAD_EXCLUDE_END		= new Set(BOBBLEHEAD_EXCLUDE_END);
const SET_GLYPH_EXCLUDE_END					= new Set(GLYPH_EXCLUDE_END);
const SET_SKIN_EXCLUDE_END					= new Set(SKIN_EXCLUDE_END);
const SET_HELMET_EXCLUDE_END				= new Set(HELMET_EXCLUDE_END);
const SET_FUR_COLOR_EXCLUDE_END			= new Set(FUR_COLOR_EXCLUDE_END);
const SET_SYANDANA_EXCLUDE_END			= new Set(SYANDANA_EXCLUDE_END);

const NULL = "null";

//

const CATEGORY_MAPPERS = {
	"AirSupport"	: mapAirSupport,	// 7/7
	"Adversary"		: mapAdversary,		// 51 (check if your adversary weapon has 60% valence)
	"Arcade"		: mapArcade,		// 
	"Arcanes"		: mapArcane,		// 168 (64 warframe + 16 primary + 18 secondary + 12 melee + 8 kitgun + 8 zaw + 22 operator + 13 amp + 5 tektolyst
	"Arch-Gun"		: mapArchGun,		// 20/20
	"Arch-Melee"	: mapArchMelee,		// 8/8
	"Archwing"		: mapArchwing,		// 5/5
	"ArtGallery"	: mapArtGallery,	// 15/15
	"Articula"		: mapArticula,		// 
	"Challenge"		: mapChallenge,		// 212/212 
	"Domestik"		: mapDomestik,		// 
	"Emblem"		: mapEmblem,		// 
	"Emote"			: mapEmote,			// 
	"Enemy"			: mapEnemy,			// ?/1368 (is no more updated by WFCD)
	"Ephemera"		: mapEphemera,		// 
	"Archweapon"	: mapArchweapon,	// 
	"Fish"			: mapFish,			// KO
	"Floof"			: mapFloof,			// 
	"FocusSchool"	: mapFocusSchool,	// 85/85 (75 + 10 => 15 for each school + 2 waybound for each school)
	"Fragment"		: mapFragment,		// 222/222 (46 cephalon + 20 cetus + 5 gara + 13 ghoul + 35 solaris + 8 partnership + 68 prex + 11 tenet + 10 duviri + 5 albrecht + 1 isleweaver)
	"Framefighter"	: mapFramefighter,	// 48/48
	"Helminth"		: mapHelminth,		// 79/79 (66 frames + 13 metamorphosis)
	"Honoria"		: mapHonoria,		// 169/169 
	"Intrinsic"		: mapIntrinsic,		// 90/90 (50 railjack + 40 drifter)
	"Gear"			: mapGear,			// OK
	"Glyphs"		: mapGlyph,			// KO 956 ingame in "Change Glyph) vs 1672
	"Melee"			: mapMelee,			// 234/234 (223 normal + 11 zaw)
	"Misc"			: mapMisc,			// KO 
	"Mods"			: mapMod,			// 1441/1441 (No flawed mods nor unobtainable ones, but they still might be owned by a few.)
	"Node"			: mapNode,			// 560/580 (a few nodes are missings)
	"Object"		: mapObject,		// ?/?
	"PeelyPix"		: mapPeelyPix,		// 25/25 
	"Pets"			: mapPet,			// 17/17
	"Poster"		: mapPoster,		// 
	"Primary"		: mapPrimary,		// 203/203 (194 normal + 9 amp)
	"Quests"		: mapQuest,			// 45/45 prelude to war ? the new war ?
	"Railjack"		: mapArmament,		// KO
	"Relics"		: mapRelic,			// 772/772 (197 lith + 188 meso + 187 neo + 196 axi + 9 requiem)
	"Resources"		: mapResource,		// KO
	"Scene"			: mapScene,			// 200/200
	"Secondary"		: mapSecondary,		// 152/152 (146 normal + 6 kitgun)
	"Sentinels"		: mapSentinel,		// 48/48 (24 robotics + 24 robotic weapons)
	"Sigils"		: mapSigil,			// KO 240+ ingame in customization vs 331
	"Simulacrum"	: mapSimulacrum,	// 13/13
	"Skins"			: mapSkin,			// KO (holy shit)
	"Somachord"		: mapSomachord,		// 150/150 
	"Signa"			: mapSigna,			// 9/6
	"Sugatra"		: mapSugatra,		// 13/13
	"Sumdali"		: mapSumdali,		// 16/16
	"Syandana"		: mapSyandana,		// 38/38
	"Trophy"		: mapTrophy,		// 101/101
	"Vehicle"		: mapVehicle,		// 13/13 (1 plexus, 2 necramech, 5 k-drive, 5 archwing)
	"Weapon"		: mapWeapon,		// 591/591 => 589 + 2 founder 
	"Warframes"		: mapWarframe		// 117/117 => 116 (66 non prime + 50 prime) + 1 founder
};

//

WF.generators.push({
	id: "all",
	label: "All.json (WFCD)",

	run: function (rawItems) {
		if(!Array.isArray(rawItems)) {
			throw new Error("All.json must be from WFCD.");
		}
		
		const startTime = performance.now();
		
		rawItems = rawItems.concat(CUSTOM_ENTRIES);
		
		const entries = rawItems.flatMap(mapItem);
		
		const endTime = performance.now();
		const duration = (endTime - startTime).toFixed(2);
		
		return buildFileContent(entries, rawItems.length, duration);
	},
});

function mapItem(raw) {
	const isExcluded = GLOBAL_EXCLUDE_INC.some(element => raw.uniqueName.includes(element)); // sorry, no weird items
	if(isExcluded) return [];
	
	const mapper = CATEGORY_MAPPERS[raw.category] || mapUnknow;
	return mapper(raw);
}

function getEndoCost(rarity, maxRank) {
	const baseCost = WF.ENDO[rarity.toLowerCase()];
	if (!baseCost || maxRank < 0) return 0;
	return baseCost * (Math.pow(2, maxRank) - 1);
}

//

function mapUnknow(raw) {
	return [entry(raw, WF.CATEGORY.UNKNOWN.name, NULL, { source_category: raw.type || "unknown" })];
}

function mapAdversary(raw, type) {
	const newRaw = { ...raw };
	newRaw.uniqueName += "MaxValence";
	newRaw.name += " (60%)";
	return [entry(newRaw, WF.CATEGORY.adversary.name, type)];
}

function mapAirSupport(raw) {
	const key = raw.uniqueName.split('/').pop();
	const typeField = AIRSUPPORT_MAPPING_END[key] ?? NULL;
	return [entry(raw, WF.CATEGORY.airsupport.name, typeField)];
}

function mapArcade(raw) {
	return [entry(raw, WF.CATEGORY.arcade.name, NULL)];
}

function mapArcane(raw) {
	let	 rarityField	 = escapeQuotes(raw.rarity) || NULL;
	let	 typeField = raw.type ? `${escapeQuotes(raw.type.split(" ")[0])}` : NULL;
	let	 level				 = raw.levelStats ? raw.levelStats.length - 1 : 0;
	if(typeField == "Bow" || typeField == "Shotgun") typeField = WF.TYPES.arcane.primary;
	raw.name += ` [${level}/${level}]`;
	return [entry(raw, WF.CATEGORY.arcane.name, typeField, { rarity: rarityField })];
}

function mapArchGun(raw) { return mapArchweapon(raw, WF.TYPES.archweapon.archgun); }
function mapArchMelee(raw) { return mapArchweapon(raw, WF.TYPES.archweapon.archmelee); }
function mapArchwing(raw) { return mapVehicle(raw, WF.TYPES.vehicle.archwing, XP60); }

function mapArtGallery(raw) { return [entry(raw, WF.CATEGORY.artgallery.name, NULL)]; }

function mapArticula(raw) {
	return [entry(raw, WF.CATEGORY.articula.name, NULL)];
}

function mapBobbleHead(raw) {
	if(SET_BOBBLEHEAD_EXCLUDE_END.has(getLastSegment(raw.uniqueName))) return[];
	// todo Wolf of Saturn Six is WolfBobbleHead ?
	return [entry(raw, WF.CATEGORY.bobblehead.name, NULL)];
}

function mapChallenge(raw) { return [entry(raw, WF.CATEGORY.challenge.name, NULL)]; }

function mapDomestik(raw) {
	let typeField = NULL;

	if(DOMESTIK_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];

			 if(raw.uniqueName.endsWith("LisetPropCleaningDroneBeachcomber") || 
					raw.uniqueName.endsWith("DogDays2024LisetPropCleaningDroneBeachcomber")) typeField = WF.TYPES.domestik.dogday;
	else if(raw.uniqueName.endsWith("LisetPropCleaningDroneBaroPink") ||
					raw.uniqueName.endsWith("LisetPropCleaningDroneBaro") ||
					raw.uniqueName.endsWith("LisetPropCleaningDroneGrineer") ||
					raw.uniqueName.endsWith("LisetPropCleaningDroneDuviri"))								 typeField = WF.TYPES.domestik.baro;
	else if(raw.uniqueName.endsWith("LisetPropCleaningDroneAshGemini") || 
					raw.uniqueName.endsWith("LisetPropCleaningDroneGarudaGemini"))					 typeField = WF.TYPES.domestik.hunhow;
	else if(raw.uniqueName.endsWith("LisetPropCleaningDroneTenno"))									typeField = WF.TYPES.domestik.nightwave;

	return [entry(raw, WF.CATEGORY.domestik.name, typeField)]; 
}

function mapEmblem(raw) {
	if(EMBLEM_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	const isFounder = getIsFounder(raw.uniqueName);
	let conclaveItem = raw.uniqueName.endsWith("HolidayDeathMatchBadgeItem");
	return [entry(raw, WF.CATEGORY.emblem.name, NULL, { ...(isFounder && { founder: isFounder }), ...(conclaveItem && { conclave: conclaveItem }) })];
}

function mapEmote(raw) {
	if(EMOTE_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	return [entry(raw, WF.CATEGORY.emote.name, NULL)]; 
}

function mapEnemy(raw) { 
	const typeField	 = raw.type ? `${escapeQuotes(raw.type.split(" ")[0])}` : NULL;
	return [entry(raw, WF.CATEGORY.enemy.name, typeField)]; 
}

function mapEphemera(raw) {
	let typeField = WF.TYPES.ephemera.oneoff;

	if(EPHEMERA_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))				 return [];

				if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Kuva"))					typeField = WF.TYPES.ephemera.vengeful;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Corpus"))				typeField = WF.TYPES.ephemera.sister;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/InfestedLich"))	typeField = WF.TYPES.ephemera.coda;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Jade"))					typeField = WF.TYPES.ephemera.aspirus;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Ink"))					 typeField = WF.TYPES.ephemera.atramentum;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Avatar"))				typeField = WF.TYPES.ephemera.body;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Conquera"))			typeField = WF.TYPES.ephemera.conquera;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Baro"))					typeField = WF.TYPES.ephemera.baro; 
	 else if(raw.uniqueName.endsWith("FootstepsEasterEggs"))													 typeField = WF.TYPES.ephemera.easter;// need to be before "step"
	 else if(raw.uniqueName.endsWith("FootstepsEidolon") ||
					 raw.uniqueName.endsWith("FootstepsMaple"))																typeField = WF.TYPES.ephemera.oneoff;// need to be before "step"
	 else if(raw.uniqueName.endsWith("GarudaBloodEphemera") || 
					 raw.uniqueName.endsWith("AshGeminiEphemera"))														 typeField = WF.TYPES.ephemera.constellation;
	 else if(raw.uniqueName.endsWith("HydroidDeluxeEphemera") || 
					 raw.uniqueName.endsWith("DogDaysEphemera"))															 typeField = WF.TYPES.ephemera.summer;
	 else if(raw.uniqueName.endsWith("BatsEphemera") ||
					 raw.uniqueName.endsWith("BatWingsEphemera") || 
					 raw.uniqueName.endsWith("WebEphemera"))																	 typeField = WF.TYPES.ephemera.halloween;
	 else if(raw.uniqueName.endsWith("CupidWingsEphemera"))														typeField = WF.TYPES.ephemera.valentine;
	 else if(raw.uniqueName.endsWith("SnowEphemera"))																	typeField = WF.TYPES.ephemera.winter;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Archon"))				typeField = WF.TYPES.ephemera.shard;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Footsteps"))		 typeField = WF.TYPES.ephemera.step;
	 else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/VoidAngel"))		 typeField = WF.TYPES.ephemera.zariman;

	return [entry(raw, WF.CATEGORY.ephemera.name, typeField)]; 
}

function mapArchweapon(raw, type) {
	let xpReward = raw.name.includes("Kuva") ? XP40 : XP30;
	const isVaulted = getIsVaulted(raw);
	let returnValue = [entry(raw, WF.CATEGORY.archweapon.name, type, { mastery_xp: xpReward, ...(isVaulted && { vaulted: isVaulted }) })];
	
	if(raw.tags) {
		 if(raw.tags.includes("Kuva Lich")) {
				returnValue.push(mapAdversary(raw, WF.TYPES.adversary.kuva));
		}
		 if(raw.tags.includes("Technocyte")) {
				returnValue.push(mapAdversary(raw, WF.TYPES.adversary.coda));
		}
		if(raw.tags.includes("Tenet")) {
				returnValue.push(mapAdversary(raw, WF.TYPES.adversary.tenet));
		}
	}

	return returnValue;
}

function mapFish(raw) {
	if(raw.uniqueName.includes("Medium") || raw.uniqueName.includes("Large")) return [];
	if(FISH_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))		return [];
	const type = WF.TYPES.trophy.fish;
	let trophy_fish = WF.TYPES.trophy_fish.poe;
	 
	if(raw.uniqueName.includes("/Fish/Solaris/"))			{ trophy_fish = WF.TYPES.trophy_fish.ov; }
	else if(raw.uniqueName.includes("/Fish/Deimos/"))	{ trophy_fish = WF.TYPES.trophy_fish.cd; }

	let subName = NULL;

	if(raw.uniqueName.includes("GrineerBootItem"))		 { trophy_fish = WF.TYPES.trophy_fish.poe; subName = " (Grineer)"; }
	else if(raw.uniqueName.includes("CorpusBootItem")) { trophy_fish = WF.TYPES.trophy_fish.ov;	subName = " (Corpus)"; }
	//else if(raw.uniqueName.includes("OrokinBootItem")) { trophy_fish = WF.TYPES.trophy_fish.cd;	subName = " (Orokin)"; } // trophy does not exist, why ?
	
	if(subName !== NULL) raw.name += subName;
	
	return mapTrophy(raw, type, trophy_fish);
}

function mapFloof(raw) {
	if(FLOOF_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	return entry(raw, WF.CATEGORY.floof.name, NULL);
}

function mapFocusSchool(raw) {
	const schoolField = raw.polarity ? `${escapeQuotes(raw.polarity)}` : NULL;
	const schoolAbility = entry(raw, WF.CATEGORY.focusschool.name, schoolField);
	const isWayBoundAbility = FOCUS_WAYBOUND_END.some(element => raw.uniqueName.endsWith(element));

	if(isWayBoundAbility) {
			raw.uniqueName += "WayBound";
			raw.name += " (Way-Bound)";
			return [schoolAbility, entry(raw, WF.CATEGORY.focusschool.name, schoolField)];
	}

	return [schoolAbility];
}

function mapFragment(raw, type = NULL) {
	let subType = null; 
	if(type === NULL) type = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
	
	switch (type) {
		case WF.TYPES.fragment.prex:
			subType = WF.TYPES.fragment_category.warframe;
			if(raw.uniqueName.includes("/Emotions/")) subType = WF.TYPES.fragment_category.palladino;
			else if(raw.uniqueName.includes("Tenno") && !raw.uniqueName.includes("TennoCon")) subType = WF.TYPES.fragment_category.other;
			else if(raw.uniqueName.includes("TennoCon")) subType = WF.TYPES.fragment_category.deimos;
			else if(raw.uniqueName.endsWith("Heirloom")) subType = WF.TYPES.fragment_category.heirloom;
			break;
	}
		
	return [entry(raw, WF.CATEGORY.fragment.name, type, { ...( subType && { fragment_category: subType }) })];
}

function mapFramefighter(raw) {
	const newRaw = { ...raw };
	newRaw.uniqueName += "FrameFighter";
	return [entry(newRaw, WF.CATEGORY.framefighter.name, NULL)];
}

function mapHelminth(raw) {
	const typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
	return [entry(raw, WF.CATEGORY.helminth.name, typeField)];
}

function mapHonoria(raw) {
	const typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
	const isFounder = getIsFounder(raw.uniqueName);
	return [entry(raw, WF.CATEGORY.honoria.name, typeField, { ...(isFounder && { founder: isFounder }) })];
}

function mapIntrinsic(raw) {
	const typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
	const category = raw.uniqueName.split('/').pop().replace(/\d+$/, '').toLowerCase();
	return [entry(raw, WF.CATEGORY.intrinsic.name, typeField, { intrinsic_category: category, mastery_xp: 1500 })];
}

function mapGear(raw) {
	return [];
}

function mapGlyph(raw) {
	if(SET_GLYPH_EXCLUDE_END.has(getLastSegment(raw.uniqueName))) return[];
	return [entry(raw, WF.CATEGORY.glyph.name, NULL)];
}

function mapMaterialStructure(raw) {
	if(MATERIAL_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
	return [entry(raw, WF.CATEGORY.material_struct.name, NULL)]; 
}

function mapMelee(raw) {
	return mapWeapon(raw, WF.TYPES.weapon.melee, NULL); 
}

function mapMisc(raw) {
	if(raw.uniqueName.includes("/SUModularSecondarySet1/Barrel/") || raw.uniqueName.includes("/InfKitGun/Barrels/")) {
		return mapWeapon(raw, WF.TYPES.weapon.secondary, WF.TYPES.weapon_category.kitgun);
	} else if(raw.uniqueName.includes("/Barrel/SentAmpSet") || raw.uniqueName.includes("/Barrel/CorpAmpSet") || raw.uniqueName.includes("SentAmpTrainingBarrel")) {
		return mapWeapon(raw, WF.TYPES.weapon.primary, WF.TYPES.weapon_category.amp);
	} else if(raw.uniqueName.includes("ADeck") || raw.uniqueName.includes("BDeck") || raw.uniqueName.includes("CDeck")) {
		return mapVehicle(raw, WF.TYPES.vehicle.kdrive, XP60);
	} else if(raw.type && raw.type.startsWith("Captura")) {
		return mapScene(raw);
	} else if(raw.type && raw.type.startsWith("Simulacrum")) {
		return mapSimulacrum(raw);
	}
	return [];
}

function mapMod(raw) { // I know it's a fuc**ng mess
	let typeField = [WF.TYPES.mod.pve];
	let returnValue = [];
	let conclaveItem = false;
	
	if(MOD_EXCLUDE_INC.some(element => raw.uniqueName.includes(element)) ||
		(MOD_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)) && !MOD_DO_NOT_EXCLUDE.some(element => raw.uniqueName.includes(element)))) return [];
	if(raw.name.endsWith("setmod")) return []; // todo : could be temporary; the name might evolve in the future
	if(raw.uniqueName.startsWith("/Lotus/Upgrades/Focus")) return mapFocusSchool(raw); // or should I use subType === "Focus Way" ?
	
	let subType = raw.type ? [`${escapeQuotes(raw.type.split(" ")[0])}`] : [NULL];
	let fusionLimitField = raw.fusionLimit ?? -1;
	const rarityField = (escapeQuotes(raw.rarity) || NULL).toLowerCase();
	const endoCostToMax = getEndoCost(rarityField, fusionLimitField);
	
	if(MOD_PVEVP_END.some(element => raw.uniqueName.endsWith(element))) typeField.push(WF.TYPES.mod.pvp);
	else if(raw.uniqueName.includes("PvP")) {
		typeField = [WF.TYPES.mod.pvp];
		conclaveItem = true;
	}
	
	if(MOD_IS_AUGMENT_END.some(element => raw.uniqueName.endsWith(element))) subType.push(WF.TYPES.mod_category.augment);
	
	if(raw.compatName)
	{
		const compatLower = raw.compatName.toLowerCase();

		if(raw.uniqueName.includes("/BeastWeapon/") || MOD_IS_MELLE_END.some(element => raw.uniqueName.endsWith(element))) subType = [WF.TYPES.mod_category.melee];
		else if(raw.uniqueName.startsWith("/Lotus/Upgrades/CosmeticEnhancers/Peculiars")) subType.push(WF.TYPES.mod_category.warframe);
		else if(subType.includes("Secondary") || MOD_IS_SECONDARY_INC.some(element => compatLower.includes(element))) subType = [WF.TYPES.mod_category.secondary];
		else if(subType.includes("Shotgun")) subType = [WF.TYPES.mod_category.primary];
		else if(subType.includes("Warframe") && compatLower.startsWith("melee")) {
			subType.shift();
			subType.push(WF.TYPES.mod_category.melee);
		}
		else if(subType.includes("Posture") || subType.includes("Stance"))			subType = [WF.TYPES.mod_category.stance];
		else
		{
			if(MOD_BEASTS_INC.some(element => compatLower.includes(element))) {
				if(raw.uniqueName.endsWith("KubrowMechaOverdriveMod") || raw.uniqueName.endsWith("CatbrowSwipePrecept")) // I need to find a more elegant way :/
					subType = [WF.TYPES.mod_category.melee];
				else
					subType = [WF.TYPES.mod_category.beast];
			}
					 if(MOD_ROBOTS_INC.some(element => compatLower.includes(element)))		subType = [WF.TYPES.mod_category.robotic];
			else if(MOD_VEHICLES_INC.some(element => compatLower.includes(element)))	subType = [WF.TYPES.mod_category.vehicle];
			else if(raw.compatName.startsWith("Parazon"))															subType = [WF.TYPES.mod_category.parazon];
			else if(raw.compatName.startsWith("COMPANION"))														subType = [WF.TYPES.mod_category.beast, WF.TYPES.mod_category.robotic];
			else if(raw.compatName.startsWith("Archmelee"))														subType = [WF.TYPES.mod_category.archmelee];
			else if(raw.compatName.startsWith("Archgun"))															subType = [WF.TYPES.mod_category.archgun];
			else if(raw.compatName.startsWith("AURA"))																subType.push(WF.TYPES.mod_category.aura);
			else if(raw.uniqueName.includes("/Randomized/"))
			{
						 if(raw.compatName.includes("Companion"))				 										subType = [WF.TYPES.mod_category.beast, WF.TYPES.mod_category.robotic]; // I'm note sure, also "robotic" and "beast" codex tab does not contain any riven but are shown in "all"
				else if(subType.includes("Zaw"))																				subType = [WF.TYPES.mod_category.melee];
				else if(subType.includes("Kitgun"))																			subType = [WF.TYPES.mod_category.secondary];
				else if(raw.compatName.includes("Rifle"))																subType = [WF.TYPES.mod_category.primary];
				else if(raw.compatName.includes("Shotgun"))															subType = [WF.TYPES.mod_category.primary];
			}
		}
	}
	
	if(raw.isUtility) subType.push(WF.TYPES.mod_category.exilus);
	
	if(subType[0] === "Tektolyst") subType = WF.TYPES.mod_category.antique;
	if(subType[0] === "Plexus") {
		subType = [WF.TYPES.mod_category.railjack];
		if(raw.uniqueName.endsWith("Matrix") || raw.uniqueName.endsWith("MatrixAura")) subType.push(WF.TYPES.mod_category.aura);
	}
	
	if(raw.uniqueName.startsWith("/Lotus/Upgrades/Grimoire/")) {
			if(raw.uniqueName.endsWith("AuraMod"))				subType = [WF.TYPES.mod_category.exilus, WF.TYPES.mod_category.tome];
			else if(raw.uniqueName.endsWith("StrikeMod")) subType = [WF.TYPES.mod_category.tome];
	}
	
	if(MOD_IS_ATAGRAPH_END.some(element => raw.uniqueName.endsWith(element)))
	{
		const atagraph = { ...raw, uniqueName: `${raw.uniqueName}Atagraph`, name: `${raw.name} (Atagraph)` };
		returnValue.push(entry(atagraph, WF.CATEGORY.atagraph.name, typeField, { mod_category: WF.TYPES.mod_category.atagraph, rarity: rarityField, ...(conclaveItem && { conclave: conclaveItem }) }))
	}
	
	if(raw.uniqueName.includes("/Randomized/")) fusionLimitField = 0;
	
	if(fusionLimitField !== 0) {
		const maxRank = fusionLimitField < 0 ? "?" : fusionLimitField;
		if (fusionLimitField !== 0) raw.name = `${raw.name} (${maxRank}/${maxRank})`
	}
	returnValue.push(entry(raw, WF.CATEGORY.mod.name, typeField, { mod_category: subType, rarity: rarityField, fusionLimit: fusionLimitField, endoSpent: endoCostToMax, ...(conclaveItem && { conclave: conclaveItem }) }))
	
	return returnValue;
}

function mapNode(raw) {
	const match = Object.entries(NODE_LOCATIONS).find(([prefix]) => raw.uniqueName.includes(prefix));
	let system = match ? match[1] : NULL;
	const spRaw = { ...raw, uniqueName: `${raw.uniqueName}SP`, name: `${raw.name} (SP)` };
	let planetField = raw.systemName ? raw.systemName.toLowerCase() : NULL;
	let returnValue = [];
	let xpReward = NODE_MAPPING[raw.uniqueName] || 0;
	
	if(planetField && planetField.includes(WF.TYPES.node_solar.dark)) {
		planetField = WF.TYPES.node_solar.dark;
	}
	
	if(raw.uniqueName.includes("Junction")) xpReward = 1000;

	returnValue.push(entry(raw	, WF.CATEGORY.node.name, system, { node_solar: planetField, node_difficulty: WF.TYPES.node_difficulty.normal, ...(xpReward && { mastery_xp: xpReward }) }));
	returnValue.push(entry(spRaw, WF.CATEGORY.node.name, system, { node_solar: planetField, node_difficulty: WF.TYPES.node_difficulty.steel, ...(xpReward && { mastery_xp: xpReward }) }));

	return returnValue;
}

function mapObject(raw) { 
	const typeField	 = raw.type ? `${escapeQuotes(raw.type.split(" ")[0])}` : NULL;
	return [entry(raw, WF.CATEGORY.object.name, typeField)]; 
}

function mapPeelyPix(raw) { 
	let typeField = raw.type ? [`${escapeQuotes(raw.type.split(" ")[0])}`] : [NULL];
	return [entry(raw, WF.CATEGORY.peelypix.name, typeField)];
}

function mapPet(raw) {
	let category = NULL;
	let type		 = NULL;
	let rank		 = getIsPrime(raw);
	
	if(raw.uniqueName.endsWith("ChargerKubrowPetPowerSuit")) {
		type = WF.TYPES.companion.beast; 
		category = WF.TYPES.companion_category.kubrow;
	} 
	else if(raw.uniqueName.endsWith("KhoraKavatPowerSuit") || raw.uniqueName.endsWith("KhoraPrimeKavatPowerSuit")) {
		type = WF.TYPES.companion.beast;
		category = WF.TYPES.companion_category.kavat;
	}
	else
	{
		category = ((raw.name.split(" ")[1]) || NULL).toLowerCase();
		switch (category) {
			case WF.TYPES.companion_category.moa				: type = WF.TYPES.companion.robotic; break;
			case WF.TYPES.companion_category.hound			: type = WF.TYPES.companion.robotic; break;
			case WF.TYPES.companion_category.kubrow		 : type = WF.TYPES.companion.beast;	 break;
			case WF.TYPES.companion_category.kavat			: type = WF.TYPES.companion.beast;	 break;
			case WF.TYPES.companion_category.predasite	: type = WF.TYPES.companion.deimos;	break;
			case WF.TYPES.companion_category.vulpaphyla : type = WF.TYPES.companion.deimos;	break;
			default: return [];
		}
	}
	return [entry(raw, WF.CATEGORY.companion.name, type, { companion_category: category, rank: rank, mastery_xp: XP60 })];
}

function mapPoster(raw) {
	if(POSTER_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	let typeField = WF.TYPES.poster.other;
			 if(raw.uniqueName.includes("NokkoMushroomScrawlPoster")) typeField = WF.TYPES.poster.deepmines;
	else if(raw.uniqueName.includes("ShipDecos/Nokko"))					 typeField = WF.TYPES.poster.nightcap;
	else if(raw.uniqueName.includes("ChildDrawing"))							typeField = WF.TYPES.poster.neewa;
	else if(raw.uniqueName.includes("ZarimanApartment"))					typeField = WF.TYPES.poster.zariman;
	else if(raw.uniqueName.includes("ShipDecos/Focus"))					 typeField = WF.TYPES.poster.focus;
	else if(raw.uniqueName.includes("ShipDecos/Nightwave1999"))	 typeField = WF.TYPES.poster.fable;
	else if(raw.uniqueName.includes("ShipDecos/JS2M"))						typeField = WF.TYPES.poster.hunhow;
	else if(raw.uniqueName.endsWith("YareliComicCoverPoster") || 
					raw.uniqueName.endsWith("DogDays2025Poster"))				 typeField = WF.TYPES.poster.dogday;
	else if(raw.uniqueName.endsWith("WyrmiusPoster") || 
					raw.uniqueName.endsWith("DogDays2025Poster"))				 typeField = WF.TYPES.poster.dogday;
	else if(raw.uniqueName.endsWith("FrameFighterPoster") || 
					raw.uniqueName.endsWith("FlappyZephyrPoster") || 
					raw.uniqueName.endsWith("OlliesCrashCoursePoster") || 
					raw.uniqueName.endsWith("WyrmiusPoster"))						 typeField = WF.TYPES.poster.minigame;
	else if(raw.name.includes("On-Lyne"))												 typeField = WF.TYPES.poster.coda;
	else if(POSTER_BARO_END.some(element => raw.uniqueName.endsWith(element))) typeField = WF.TYPES.poster.baro;
	
	return [entry(raw, WF.CATEGORY.poster.name, typeField)];
}

function mapPrimary(raw) { return mapWeapon(raw, WF.TYPES.weapon.primary, NULL); }

function mapQuest(raw) {
	let category = WF.TYPES.quest.main;
	
	if(QUEST_SIDE_INC.some(element => raw.uniqueName.includes(element))) category = WF.TYPES.quest.side;
	if(QUEST_WARFRAME_INC.some(element => raw.uniqueName.includes(element))) category = WF.TYPES.quest.warframe;
	
	return [entry(raw, WF.CATEGORY.quest.name, category)];
}

function mapArmament(raw) {
	if(ARMAMENT_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	
	const foundIndex = RAILJACK_TIERS_END.findIndex(tier => raw.uniqueName.endsWith(tier));
	const indexTier = foundIndex === -1 ? 0 : 1;
	let typeField = NULL;
	let armament_type = NULL;
	
	if(indexTier > 0 && RAILJACK_EXCLUDE_END.findIndex(tier => raw.uniqueName.endsWith(tier)) >= 0) return [];
	
	if(indexTier > 0) { // fix mk tier, Mk Iii => Mk III
		let words = raw.name.split(" ");
		words[words.length - 1] = words[words.length - 1].toUpperCase();
		raw.name = `${words.join(" ")} (60%)`;
		typeField = words[0];
		armament_type = words[1];
	}
	
	return [entry(raw, WF.CATEGORY.armament.name, typeField, { ...(armament_type && { armament_type: armament_type }) })];
}

function mapRelic(raw) {
	const itemName = escapeQuotes(raw.uniqueName);
	const fullName = escapeQuotes(raw.name).split(" ");
	let type = fullName[0].toLowerCase();
	
	 // i can't put this in the GLOBAL_EXCLUDE_INC
	if(RECLIC_EXCLUDE_END.some(element => itemName.endsWith(element))) return [];
	
	if(type === WF.TYPES.relic_vanguard.vanguard) {
		 type = WF.TYPES.relic.axi;
	}
	
	let rank = fullName[2] || NULL; 
	let displayName = `${fullName[0]} ${fullName[1]}`;

	if(rank !== NULL && rank !== "Relic") { displayName += ` (${rank})`; }
	else { rank = WF.TYPES.relic_rank.other; }
	
	rank = rank.toLowerCase();
	if(!Object.values(WF.TYPES.relic_rank).some((element) => rank.includes(element))) return [];

	raw.name = displayName;

	return [entry(raw, WF.CATEGORY.relic.name, type, { relic_rank: rank })];
}

function mapResource(raw) { 
	return [];
}

function mapScene(raw) {
	if(raw.uniqueName.endsWith("PhotoboothTile")) return [];
	const match = Object.entries(WF.TYPES.scene).find(([key, value]) => raw.name.includes(value));
	const typeField = match ? match[0] : WF.TYPES.scene.other;
	return [entry(raw, WF.CATEGORY.scene.name, typeField)]
}

function mapSecondary(raw) {
	return mapWeapon(raw, WF.TYPES.weapon.secondary, NULL);
}

function mapSentinel(raw, category, xpReward) {
	const rank			= getIsPrime(raw);
	const isVaulted = getIsVaulted(raw);
	if(!category) category = WF.TYPES.companion_category.sentinel;
	if(!xpReward) xpReward = XP60;
	return [entry(raw, WF.CATEGORY.companion.name, WF.TYPES.companion.robotic, { companion_category: category, rank: rank, mastery_xp: xpReward, ...(isVaulted && { vaulted: isVaulted }) })];
}

function mapSigil(raw) {
	let conclaveItem = false;
	if(raw.uniqueName.includes("Heirloom") || raw.uniqueName.includes("TennoVIP") || raw.uniqueName.includes("TennoCon")) return [];
	if(SIGIL_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	if(raw.uniqueName.includes("SyndicateSigilConclave")) conclaveItem = true;
	const isFounder = getIsFounder(raw.uniqueName);
	return [entry(raw, WF.CATEGORY.sigil.name, NULL, { ...(isFounder && { founder: isFounder }), ...(conclaveItem && { conclave: conclaveItem })} )];
}

function mapSimulacrum(raw) {
	if(raw.uniqueName.endsWith("DangerRoomTile")) return []; // we can't put this in the GLOBAL_EXCLUDE_INC, it'll remove all of them
	return [entry(raw, WF.CATEGORY.simulacrum.name, NULL)];
}

function mapSkin(raw) {
	if(SKIN_EXCLUDE_SW.some(element => raw.uniqueName.startsWith(element)))	return [];
	if(SKIN_EXCLUDE_INC.some(element => raw.uniqueName.includes(element)))	return [];
	if(SET_SKIN_EXCLUDE_END.has(getLastSegment(raw.uniqueName)))						return [];

	let conclaveItem = raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/PvP") || raw.uniqueName.includes("LunaroSet");

	if(WEAPON_SKIN_INCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return mapSkinWeapon(raw, conclaveItem);
	
	let typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
	let skin_type = NULL;
	let category = WF.CATEGORY.skin_warframe.name;
	
	if(raw.uniqueName.includes("TextureOverrides")) return mapMaterialStructure(raw);
	
			 if(typeField === "Themes")			return [];
	else if(typeField === "Theme Background")	return [];
	else if(typeField === "Theme Sound")		return [];
	else if(typeField === "Note Packs")			return [];
	else if(typeField === "Misc")				return [];
	else if(raw.name.endsWith("Pattern") ||
			typeField === "Fur Pattern")		return mapPetCosmetic(raw, WF.TYPES.companion_cosmetic_type.fur_pattern);
	else if(typeField === "Fur Color")			return mapPetCosmetic(raw, WF.TYPES.companion_cosmetic_type.fur_color);
	else if(typeField === "Color Palette")		return mapSkinColor(raw);
	else if(typeField === "Emotes")				return mapEmote(raw);
	
			 if(raw.uniqueName.includes("ShipDecos/TarotCard"))						return mapFragment(raw, WF.TYPES.fragment.prex);
	else if(raw.uniqueName.includes("ShipDecos/CorpusGreed"))					return mapFragment(raw, WF.TYPES.fragment.tenet);
	else if(raw.uniqueName.includes("HoodOrnament"))									return mapSumdali(raw);
	else if(raw.uniqueName.includes("MeleeDangles"))									return mapSugatra(raw);
	else if(raw.uniqueName.endsWith("Syandana") || 
					raw.uniqueName.endsWith("Cape") || 
					raw.uniqueName.endsWith("Scarf") || 
					raw.uniqueName.includes("/Scarves/"))											return mapSyandana(raw);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/Titles"))		return []; // don't put this in GLOBAL_EXCLUDE_INC
	else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Clan") ||
					raw.name.endsWith("Emblem"))															return mapEmblem(raw);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/Vignettes"))				return mapArticula(raw);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/MasteryTrophies/"))	return mapTrophy(raw, WF.TYPES.trophy.mastery);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/PlanetTrophies/"))	return mapTrophy(raw, WF.TYPES.trophy.planet);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/Focus/") || 
					raw.uniqueName.includes("NokkoMushroomScrawlPoster") ||
					raw.uniqueName.includes("ChildDrawing"))																return mapPoster(raw);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/Operator/"))		return mapGlyph(raw);
	else if(raw.uniqueName.startsWith("/Lotus/Types/Items/Arcade/"))								return mapArcade(raw);
	else if(raw.uniqueName.includes("TauRankMedal/TauRankMedal"))										return mapEvolveSkin(raw, WF.TYPES.skin_evolve.insign);
	else if(raw.name.includes("Poster"))						return mapPoster(raw);
	else if(raw.name.includes("Floof"))							return mapFloof(raw);
	else if(raw.name.includes("Ephemera"))					return mapEphemera(raw);
	else if(raw.name.includes("Drone"))							return mapDomestik(raw);
	else if(raw.name.includes("Signa"))							return mapSigna(raw);
	else if(raw.uniqueName.includes("Motorcycle"))	return mapSkinOther(raw, WF.TYPES.skin_other.livery);
	else if(raw.uniqueName.includes("TennoCon") ||
					raw.uniqueName.includes("Tennocon"))		return [];
	else if(raw.uniqueName.endsWith("BobbleHead"))	return mapBobbleHead(raw);
	
	if(typeField === "Ship Decoration") 						return mapShipDecoration(raw);
	if(raw.uniqueName.includes("Kubrows/Collars"))	return mapPetCosmetic(raw, WF.TYPES.companion_cosmetic_type.collar);
	
			 if(raw.name.endsWith("Animation Set")) 	skin_type = WF.TYPES.skin_type.animation;
	else if(raw.uniqueName.includes("Helm"))			return mapSkinHelmet(raw);
	else if(raw.name.endsWith("Wings"))						skin_type = WF.TYPES.skin_type.wing;
	else if(raw.name.endsWith("Mask"))						skin_type = WF.TYPES.skin_type.mask;
	else if(raw.name.endsWith("Tail"))						skin_type = WF.TYPES.skin_type.tail;
	else if(raw.name.endsWith("Plate"))						skin_type = WF.TYPES.skin_type.plate;
	else if(raw.name.endsWith("Plates"))					skin_type = WF.TYPES.skin_type.plate;
	else if(raw.name.endsWith("Guard"))						skin_type = WF.TYPES.skin_type.guard;
	else if(raw.name.endsWith("Guards"))					skin_type = WF.TYPES.skin_type.guard;
	else if(raw.name.endsWith("Skin"))						skin_type = WF.TYPES.skin_type.skin;
	else if(raw.name.endsWith("Armor")) { 
			 if(raw.uniqueName.includes("Kubrows"))		return mapPetCosmetic(raw, WF.TYPES.companion_cosmetic_type.armor);
		else if(raw.uniqueName.includes("Catbrows"))return mapPetCosmetic(raw, WF.TYPES.companion_cosmetic_type.armor);
		skin_type = WF.TYPES.skin_type.armor;
	}
	else if(raw.name.endsWith("Holster"))					skin_type = WF.TYPES.skin_type.holster;
	else if(raw.name.endsWith("Sleeves"))					skin_type = WF.TYPES.skin_type.sleeve;
	else if(raw.name.endsWith("Leggings"))				skin_type = WF.TYPES.skin_type.legging;
	else if(raw.name.endsWith("Hood"))						skin_type = WF.TYPES.skin_type.hood;
	else if(raw.name.endsWith("Ink"))							skin_type = WF.TYPES.skin_type.ink;
	else if(raw.name.endsWith("Oculus"))					skin_type = WF.TYPES.skin_type.oculus;
	else if(raw.name.endsWith("Pauldrons"))				skin_type = WF.TYPES.skin_type.pauldron;
	else if(raw.name.endsWith("Pauldron"))				skin_type = WF.TYPES.skin_type.pauldron;
	else if(raw.name.endsWith("Suit"))						skin_type = WF.TYPES.skin_type.suit;
	else if(raw.name.endsWith("Greaves"))					skin_type = WF.TYPES.skin_type.greaves;
	
	if(raw.uniqueName.includes("Sentinel") || raw.uniqueName.endsWith("DesertDirigaSkin") || raw.uniqueName.endsWith("DOTD2025TaxonSkin"))
	{
		if(SKIN_SENTINEL_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
		category = WF.CATEGORY.sentinel_cosmetic.name;
	}
	else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Operator") || raw.uniqueName.endsWith("/DOTD2025OperatorMask"))
	{
		if(raw.uniqueName.includes("Adult") || raw.uniqueName.includes("Drifter")) {
			category = WF.CATEGORY.skin_drifter.name;
			typeField = NULL;
		} else {
			category = WF.CATEGORY.skin_operator.name;
			typeField = NULL;
		}
	}
	
	return [entry(raw, category, typeField, { ...(skin_type && { skin_type: skin_type }), ...(conclaveItem && { conclave: conclaveItem }) })];
}

function mapEvolveSkin(raw, type) {
	switch (type) {
		case WF.TYPES.skin_evolve.insign:
			let words = raw.name.split(" ");
			words[1] = words[1].toUpperCase();
			raw.name = words.join(" ");
			break;
	}

	return [entry(raw, WF.CATEGORY.skin_evolve.name, type)];
}

function mapSkinColor(raw) {
	if(COLOR_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	return [entry(raw, WF.CATEGORY.color_palette.name, NULL)];
}

function mapShipDecoration(raw) {
	let typeField = NULL
	if(raw.name.includes("Zariman")) typeField = WF.TYPES.ship_decoration.zariman;
	return [entry(raw, WF.CATEGORY.ship_decoration.name, typeField)];
}

function mapSkinOther(raw, typeField) {
	return [entry(raw, WF.CATEGORY.skin_other.name, typeField)];
}

function mapPetCosmetic(raw, subType) {
	let type = raw.uniqueName.includes("Kubrow") ? WF.TYPES.companion_cosmetic.kubrow : WF.TYPES.companion_cosmetic.kavat;
	
	switch(subType) {
		case WF.TYPES.companion_cosmetic_type.fur_color:
			 if(SET_FUR_COLOR_EXCLUDE_END.has(getLastSegment(raw.uniqueName))) return[];
			 type = [WF.TYPES.companion_cosmetic.kubrow, WF.TYPES.companion_cosmetic.kavat]; // each one can use the fur color of each other
		break;
		case WF.TYPES.companion_cosmetic_type.fur_pattern:
			 if(FUR_PATTERN_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
		break;
		case WF.TYPES.companion_cosmetic_type.armor:
			if(PET_ARMOR_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
		break;
	}
	
	return [entry(raw, WF.CATEGORY.companion_cosmetic.name, type, { ...(subType && { companion_cosmetic_type: subType }) })];
}

function mapSkinHelmet(raw) {
	if(SET_HELMET_EXCLUDE_END.has(getLastSegment(raw.uniqueName))) return [];
	return [entry(raw, WF.CATEGORY.skin_helmet.name, NULL)];
}

function mapSkinWeapon(raw, conclaveItem) {
	return [entry(raw, WF.CATEGORY.skin_weapon.name, NULL, { ...(conclaveItem && { conclave: conclaveItem }) })];
}

function mapSomachord(raw) {
	const typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
	return [entry(raw, WF.CATEGORY.somachord.name, typeField)];
}

function mapSigna(raw) {
	let typeField = NULL;
	if(raw.uniqueName.includes("Deluxe") || raw.uniqueName.includes("Heirloom")) return [];
	if(SIGNA_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))					return [];

			 if(raw.uniqueName.endsWith("GarudaBloodCrown") ||
					raw.uniqueName.endsWith("ProtoAshCrown"))					 typeField = WF.TYPES.signa.hunhow;
	else if(raw.uniqueName.endsWith("KiTeerSignaCrown"))				typeField = WF.TYPES.signa.baro;
	else if(raw.uniqueName.endsWith("OrfeoSignaCrown"))				 typeField = WF.TYPES.signa.nightwave;
	else if(raw.uniqueName.endsWith("Dex2026LotusHaloCrown") ||
					raw.uniqueName.endsWith("IsleweaverEventCrownA") ||
					raw.uniqueName.endsWith("IsleweaverEventCrownB") ||
					raw.uniqueName.endsWith("IsleweaverEventCrownC") ||
					raw.uniqueName.endsWith("LaurelHaloCrown"))				 typeField = WF.TYPES.signa.event;

	return [entry(raw, WF.CATEGORY.signa.name, typeField)];
}

function mapSugatra(raw) {
	if(SUGATRA_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
	return [entry(raw, WF.CATEGORY.sugatra.name, NULL)];
}

function mapSumdali(raw) {
	return [entry(raw, WF.CATEGORY.sumdali.name, NULL)];
}

function mapSyandana(raw) {
	if(SET_SYANDANA_EXCLUDE_END.has(getLastSegment(raw.uniqueName))) return [];
	let conclaveItem = raw.uniqueName.endsWith("ConclaveCape");
	return [entry(raw, WF.CATEGORY.syandana.name, NULL, { ...(conclaveItem && { conclave: conclaveItem }) })];
}

function mapTrophy(raw, type, trophy_fish) {
	return [entry(raw, WF.CATEGORY.trophy.name, type, { ...(trophy_fish && { trophy_fish: trophy_fish }) })];
}

function mapVehicle(raw, type, masteryxp) {
	if(raw.uniqueName.includes("RailjackPlexusSegment")) { type = WF.TYPES.vehicle.plexus; masteryxp = XP60;}
	return [entry(raw, WF.CATEGORY.vehicle.name, type, { mastery_xp: masteryxp })];
}

function mapWeapon(raw, type, category) {
	const rank			= getIsPrime(raw);
	const isFounder = getIsFounder(raw.uniqueName);
	const isVaulted = getIsVaulted(raw);
	
	let returnValue = [];
	let xpReward = raw.uniqueName.endsWith("BallasSwordWeapon") ? XP40 : XP30;
	
	if(raw.uniqueName.includes("TnDoppelgangerGrimoire") || (raw.uniqueName.includes("Pets/ZanukaPets") && !SENTITEL_EXCEPTION.some(element => raw.uniqueName.includes(element)))) return [];
	if(raw.uniqueName.includes("/Lotus/Weapons/Ostron/Melee/Modular") && !raw.uniqueName.includes("/Tips/PvPVariant") && !raw.uniqueName.includes("/Tip/Tip")) return [];
	
	if(category == NULL) {
		if(raw.uniqueName.includes("/SentinelWeapons/")) {
			return mapSentinel(raw, WF.TYPES.companion_category.sentinel_weapon, XP30);
		} else if(raw.uniqueName.includes("Pets/ZanukaPets")) {
			return mapSentinel(raw, WF.TYPES.companion_category.hound_weapon, XP30);
		}	else if(raw.uniqueName.includes("/MoaPets/MoaPetComponents/")) {
			return mapSentinel(raw, WF.TYPES.companion_category.moa_weapon, XP30);
		}	else if(raw.uniqueName.includes("/Melee/Modular")) { 
			type = WF.TYPES.weapon.melee; 
			category = WF.TYPES.weapon_category.zaw;
		} else if(raw.uniqueName.includes("/InfKitGun/Barrels/") || raw.uniqueName.includes("/SUModularSecondarySet1/Barrel/")) { 
			type = WF.TYPES.weapon.secondary; 
			category = WF.TYPES.weapon_category.kitgun;
		} else if(raw.uniqueName.includes("DrifterPistolPlayerWeapon")) { 
			type = WF.TYPES.weapon.primary; 
			category = WF.TYPES.weapon_category.amp;
		} else	{ 
			category = WF.TYPES.weapon_category.normal;
		}
	}
	
	if(raw.tags)
	{
		let typeField = NULL;

		if(raw.tags.some(tag => tag.toLowerCase().includes(WF.TYPES.adversary.kuva)))		typeField = WF.TYPES.adversary.kuva;
		if(raw.tags.some(tag => tag.toLowerCase().includes(WF.TYPES.adversary.tenet)))	typeField = WF.TYPES.adversary.tenet;
		if(raw.tags.some(tag => tag.toLowerCase().includes(WF.TYPES.adversary.coda)))		typeField = WF.TYPES.adversary.coda;

		if(typeField !== NULL)
		{
			xpReward = XP40;
			returnValue.push(mapAdversary(raw, typeField));
		}
	}
	
	returnValue.push(entry(raw, WF.CATEGORY.weapon.name, type, { weapon_category: category, rank: rank, mastery_xp: xpReward, ...(isFounder && { founder: isFounder }), ...(isVaulted && { vaulted: isVaulted }) }));
	
	const hasIncarnonAttack = raw.attacks?.some(({ name }) => WEAPON_INCARNON_FILTER.some(prefix => name.startsWith(prefix)));
	const isIncarnonWeapon = WEAPON_INCARNON.some(element => raw.uniqueName.endsWith(element));

	if(hasIncarnonAttack || isIncarnonWeapon) { //
			const isFiveEvolution = WEAPON_FIVE_EVOLUTION.some(element => raw.uniqueName.endsWith(element));
			const incarnonCap	= isFiveEvolution ? " (5/5)" : " (4/4)";
			const incarnonBase = isFiveEvolution ? " (0/5)" : " (0/4)";
			const rankMax	= { ...raw, uniqueName: `${raw.uniqueName}Incarnon`		, name: `${raw.name}${incarnonCap}` };
			const rankZero = { ...raw, uniqueName: `${raw.uniqueName}IncarnonBase`, name: `${raw.name}${incarnonBase}` };
			type = isFiveEvolution ? WF.TYPES.incarnon.five : WF.TYPES.incarnon.four;
			
			returnValue.push(entry(rankMax , WF.CATEGORY.incarnon.name, type, { ...(isFounder && { founder: isFounder }) }));
			returnValue.push(entry(rankZero, WF.CATEGORY.incarnon.name, WF.TYPES.incarnon.zero, { ...(isFounder && { founder: isFounder }) }));
	}

	return returnValue;
}

function mapWarframe(raw) {
	if(raw.uniqueName.includes("PowersuitAbilities/Helminth")) return [];
		
	const productCategory = escapeQuotes(raw.productCategory).toLowerCase();
	if(productCategory === "mechsuits") return mapVehicle(raw, WF.TYPES.vehicle.necramech, XP80);
	
	let returnValue = [];
	if(FRAMEFIGHTER_INCLUDE.includes(raw.name)) returnValue.push(mapFramefighter(raw));
	
	const rank			= getIsPrime(raw);
	const isFounder = getIsFounder(raw.uniqueName);
	const isVaulted = getIsVaulted(raw);
	
	returnValue.push(entry(raw, WF.CATEGORY.warframe.name, productCategory, { rank: rank, mastery_xp: XP60, ...(isFounder && { founder: isFounder }), ...(isVaulted && { vaulted: isVaulted }) }));
	
	return returnValue;
}

//

function getLastSegment(path) {
  const idx = path.lastIndexOf('/');
  return idx === -1 ? path : path.substring(idx);
}

function getIsFounder(raw) {
	return FOUNDER_EXCLUSIVE_INC.some(element => raw.includes(element));
}

function getIsPrime(raw) {
	return raw.isPrime ? WF.TYPES.rank.prime : WF.TYPES.rank.normal;
}

function getIsVaulted(raw) {
	return (raw.vaulted ? (raw.vaultDate ? raw.vaultDate : "No Data") : false );
}

function getIsCodexHidden(raw) {
	return (raw.codexSecret ? raw.codexSecret : false );
}

function getIsCodexExcluded(raw) {
	return (raw.excludeFromCodex ? raw.excludeFromCodex : false );
}

function formatFieldValue(value) {
	if(value === null || value === undefined) return NULL;
	if(Array.isArray(value)) return `[${value.map(v => `"${escapeQuotes(v)}"`).join(", ")}]`;
	if(typeof value === "object") {
		const entries = Object.entries(value).map(([k, v]) => `${k}: "${escapeQuotes(v)}"`).join(", ");
		return `{ ${entries} }`;
	}
	return `"${escapeQuotes(value)}"`;
}

function escapeQuotes(value) {
	return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g,'');
}

function entry(raw, category, type, extraFields = {}) {
	const isHidden	 = getIsCodexHidden(raw);
	const isExcluded = getIsCodexExcluded(raw);
	const fields = { item_name: raw.uniqueName, display_name: { en: raw.name }, category: category, type: type, ...((isHidden && !isExcluded) && { hidden: isHidden }), ...extraFields };
	const formatted = Object.entries(fields).filter(([_, value]) => value !== undefined).map(([key, value]) => `${key}: ${formatFieldValue(value)}`).join(", ");
	return `\t{ ${formatted} },`;
}

function buildFileContent(entries, totalRawCount, duration) {
	const dateET = new Date().toLocaleString("sv-SE", { timeZone: "America/New_York" });

	return [ // same date format as Digital Extremes' communication
		`// Generated with "generate.html" on ${dateET} ET in ${duration}ms - ${totalRawCount} items source, ${entries.length} lines created.`,
		`// Dont change this by hand, use my "generated.html" and download "all.json" from WFCD, or for custom data, use "js/generade/custom_data.js".`,
		`// If you don't know what you're doing, PLEASE do nothing.`,
		"WF.data = WF.data || [];",
		"",
		"WF.data.push(",
		entries.join("\n"),
		");",
		"",
	].join("\n");
}
