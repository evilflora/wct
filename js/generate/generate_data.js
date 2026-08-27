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

const TEMP_LIST              = ["Atrox Fur Pattern", "Nexus Fur Patter", "Drahk Fur Pattern", "Underbrush Kubrow Pattern", "Neura Fur Pattern", "Fabled Fur Pattern", "Daybreak Fur Pattern"];

const AIRSUPPORT_MAPPING_END = { LisetAutoHack: WF.TYPES.airsupport.liset, LisetMedStation: WF.TYPES.airsupport.mantis, LisetStun: WF.TYPES.airsupport.nightwave, LisetGoldenInstinct: WF.TYPES.airsupport.parallax, LisetBarrage: WF.TYPES.airsupport.scimitar, LisetKahl: WF.TYPES.airsupport.skaut, LisetTurret: WF.TYPES.airsupport.xiphos };
const ARMAMENT_EXCLUDE_END   = ["AutoCannon", "DecoyCountermeasure", "Blaster", "BlasterShotgun", "SmokeCountermeasure", "ShrapnelShotgun", "RailJackBeamWeapon", "PulseLaser"];
const COLOR_EXCLUDE_END      = ["ColourPickerKuvaLichElectric", "ColourPickerBastilleItem", "ColourPickerItem", "ColourPickerItemB", "ColourPickerItemD", "ColourPickerKuvaLichMag", "ExtraTonesItem", "ColourPickerCorpusItemA", "ColourPickerKuvaLichTrickster", "ColourPickerDaybreakItemA", "ColourPickerHeirloom", "ColourPickerDiscordItemA", "ColourPickerDojoItemA", "ColourPickerEmberHeirloom", "ColourPickerNightwave1999Item", "ColourPickerEximus", "ColourPickerKuvaLichIce", "ColourPickerFireItemA", "ColourPickerGrineerItemA", "ColourPickerKuvaLichFire", "ColourPickerIceItemA", "ColourPickerInfestedItemA", "ColourPickerJadeItem", "ExpandedLegacyTonesItem", "LegacyTonesItem", "ColourPickerJadeStalker", "ColourPickerLotus", "ColourPickerTMobileItemA", "ColourPickerMesaHeirloom", "ColourPickerNarmer", "BaseTonesItem", "ColourPickerSwitchItemA", "ColourPickerOrion", "ColourPickerOrokin", "ColourPickerPrimeWarframesItemA", "ColourPickerPrimeWarframesItemB", "ColourPickerPS4ItemA", "ColourPickerRWBItem", "ColourPickerRhinoHeirloom", "ColourPickerRollers", "ColourPickerKuvaLichPoison", "ColourPickerKalymos", "ColourPickerSirius", "NinjaColourPickerItem", "ColourPickerItemC", "ColourPickerDefaultsItemA", "ColourPickerDefaultsItemB", "ColourPickerDefaultsItemC", "ColourPickerTwilightItemA", "ColourPickerTwitchItemA", "ColourPickerKuvaLichBase", "ColourPickerValkyrHeirloom", "ColourPickerVaubanHeirloom"];
const DOMESTIK_EXCLUDE_END   = ["/LisetPropCleaningDroneYareliDeluxe", "/LisetPropCleaningDroneYareliPrime", "/LisetPropCleaningDroneYareli", "/LisetProp1999TankDrone", "/LisetPropCleaningDroneColorOne", "/LisetPropCleaningDroneColorTwo", "/LisetPropCleaningDroneColorThree", "/LisetPropCleaningDroneColorFour", "/LisetPropCleaningDroneColorFive", "/LisetPropCleaningDroneColorSix", "/LisetPropCleaningDrone", "/LisetPropCleaningDroneCaliberChicks", "/LisetPropCleaningDroneInfested", "/LisetPropOrokinMaggot", "/LisetPropCleaningDroneTwitch"];
const EMBLEM_EXCLUDE_END     = ["ClanEmblemItem", "AllianceEmblemItem", "Community10YearEmblemItem", "TennoGenBadgeItem", "WikiaBadgeItem", "TranslatorBadgeItem", "LotusGuideBadgeItem", "ZarimanEvolvingSekharaBadgeItemA", "1999CommunityARGBadgeItem", "SkullBadgeGoldItem", "SkullBadgeSilverItem", "SkullBadgeBronzeItem", "CYCCBBadgeItem", "CYOBBadgeItem", "CY17173MediaBadge", "CYDuowanMediaBadge", "CYPlayBadgeItem", "TennoCon2016BadgeItem", "XBoneJadeClemBadgeItem", "DrakeRifleBadgeItem", "PS5OkinaBadgeItem", "LeaderBadgeGhostItem", "LeaderBadgeMoonItem", "LeaderBadgeMountainItem", "LeaderBadgeShadowItem", "LeaderBadgeStormItem", "ZawVariantBadgeItemA", "ZawVariantBadgeItemB", "ZawVariantBadgeItemC", "PvpRepBadgeItem", "ExcaliburUmbraBadgeItem", "ZarimanEvolvingSekharaBadgeItemB", "ZarimanEvolvingSekharaBadgeItemC", "GolemRaidBadgeItem", "SevantiHaloBadgeItem", "NightmareSevantiHaloBadgeItem", "SevantiLegacyHaloBadgeItem"];
const EMOTE_EXCLUDE_END      = ["LegendaryAmirEmote", "LegendaryAoiEmote", "LegendaryArthurEmote", "LegendaryEleanorEmote", "LegendaryFlareEmote", "LegendaryKayaEmote", "LegendaryLettieEmote", "LegendaryLyonEmote", "LegendaryMarieEmote", "LegendaryMinervaEmote", "LegendaryQuincyEmote", "LegendaryRoatheEmote", "LegendaryRyokuEmote", "LegendaryVelimirEmote", "LegendaryWytchEmote", "Tennocon2019Emote", "Tennocon2020BEmote", "Tennocon2021Emote", "Tennocon2022Emote", "Tennocon2024Emote", "Tennocon2026Emote", "Tennocon2024EmoteAlt", "Tennocon2025Emote", "Tennocon2020AEmote", "ShrineFanDanceEmote", "ShrineDiceShakeEmote", "GaussGonnaGetchaEmote", "KhoraPrimeEmote", "HeirloomEmote", "DanceReachAcrossHips", "DanceOneHandHipPump", "DanceOneHandHipLookLeftRight", "DanceHandsUp", "DanceHeadphonesBop", "DanceSideStepTurn", "DanceLassoSidestep", "DanceTurnReverseTurn", "DanceElbowWave", "PunctualityEmote", "LNY2024DragonEmote", "LNY2026HorseEmote", "LNY2023Emote", "LNY2025SnakeEmote", "GrendelDeluxeIILetsRollEmote", "GaussDeluxeIILetsRaceEmote", "CaptainEmote", "BarterEmote"];
const EPHEMERA_EXCLUDE_END   = ["PeachBlossomsEphemera", "LunarEphemera", "LNYDragonEphemera", "LNYStonesEphemera", "LNYKaitheDagathEphemera", "EphemeraNezhaPrime", "EphemeraGaraPrime", "EphemeraPrimeA", "PrimeVorunaEphemera", "GrendelPrimeEphemera", "GarudaPrimeEphemera", "ProteaPrimeEphemera", "YareliPrimeEphemera", "BaruukPrimeEphemera", "NarmerEvolvingEphemeraA", "NarmerEvolvingEphemeraB", "NarmerEvolvingEphemeraC", "CitrineDeluxeEphemera", "DeimosEphemera", "GrendelDeluxeIIFootstepsEphemera", "CalibanDeluxeEphemera", "TennoCon2026Ephemera", "VoltDeluxeRaijinEphemera", "XakuDeluxeEphemera", "VorunaDeluxeEphemera", "NovaDeluxeAoandonEphemera", "ObsidianEphemeraA", "WerewolfEphemera", "LavosDeluxeEphemera", "SandmanEphemera", "NokkoEphemera", "TennoCon2021Ephemera", "TwitchEphemera", "OraxiaEphemera"];
const FISH_EXCLUDE_END       = ["/HolidayGrineerBootItem", "/DuviriFishAItem", "/DuviriFishBItem", "/DuviriFishCItem", "/DuviriFishDItem", "/DuviriFishEItem", "/OrokinBootItem"];
const FLOOF_EXCLUDE_END      = ["/PlushyOrdis", "/PlushyProtectorStalker", "/BirdPlush", "/FishPlush", "/DeerPlush", "/PlushyArthur", "/PlushyAoi", "/PlushyAmir", "/PlushyQuincy", "/PlushyLettie", "/PlushyEleanor", "/PlushyNokkoMushroom", "/PlushyLyon", "/PlushyMarie", "/PlushyRoathe", "/PlushyLotus", "/GaussPrimePlush", "/PlushyTiger", "/PlushyLNY2023Rabbit", "/PlushyLNY2024Dragon", "/PlushySnake", "/PlushyLNYMirage", "/PlushyLNYKaithe", "/TennoCon2024CosplayTrophy"];
const FOCUS_WAYBOUND_END     = ["/MoreAmmoFocusUpgrade", "/RegenAmmoFocusUpgrade", "/HealthMaxFocusUpgrade", "/HealthRegenFocusUpgrade", "/MoveSpeedFocusUpgrade", "/ProjectionStretchUpgrade", "/SecondChanceFocusUpgrade", "/SecondChanceDamageBuffFocusUpgrade", "/EnergyPoolFocusUpgrade", "/EnergyRestoreFocusUpgrade"];
const FOUNDER_EXCLUSIVE_INC  = ["/Powersuits/Excalibur/ExcaliburPrime", "LatoPrime", "SkanaPrime", "FounderLvl1Title", "FounderLvl2Title", "FounderLvl3Title", "FounderLvl4Title", "FoundersBadgeDiscipleItem", "FoundersBadgeHunterItem", "FoundersBadgeMasterItem", "FoundersBadgeGrandMasterItem", "FounderSigilDisciple", "FounderSigilHunter", "FounderSigilMaster", "FounderSigilGrandMaster"];
const FRAMEFIGHTER_INCLUDE   = ["Ash", "Atlas", "Banshee", "Baruuk", "Chroma", "Ember", "Equinox", "Excalibur", "Excalibur Umbra", "Frost", "Gara", "Garuda", "Gauss", "Grendel", "Harrow", "Hildryn", "Hydroid", "Inaros", "Ivara", "Khora", "Lavos", "Limbo", "Loki", "Mag", "Mesa", "Mirage", "Nekros", "Nezha", "Nidus", "Nova", "Nyx", "Oberon", "Octavia", "Protea", "Revenant", "Rhino", "Saryn", "Sevagoth", "Titania", "Trinity", "Valkyr", "Vauban", "Volt", "Wisp", "Wukong", "Xaku", "Yareli", "Zephyr"];
const FUR_COLOR_EXCLUDE_END = ["KubrowPetColorVibrantG", "CatbrowPetColorTertiaryEntrati", "KubrowPetColorVibrantB", "CatbrowPetColorAccentsContest", "CatbrowPetColorBaseC", "KubrowPetColorVibrantA", "PrimeCatbrowPetColorAccents", "CatbrowPetColorBaseContest", "KubrowPetColorMundaneI", "GaraPrimeCatbrowPetColorTertiary", "KubrowPetColorMundaneA", "CatbrowPetColorTertiaryXmas", "CatbrowPetColorSecondaryD", "CatbrowPetColorSecondaryXmas", "CatbrowPetColorBaseEntrati", "CatbrowPetColorSecondaryHyekka", "CatbrowPetColorTertiaryC", "CatbrowPetColorBaseSolstice", "KubrowPetColorSolsticeMundane", "KubrowPetColorXmasVibrantA", "PrimeCatbrowPetColorBaseA", "CatbrowPetColorAccentsHyekka", "CatbrowPetColorAccentsXmas", "KubrowPetColorMidContest", "KubrowColorWukongPrimeMundane", "KubrowPetColorMidF", "CatbrowPetColorBaseDaybreak", "KubrowColorWukongPrimeVibrant", "CatbrowPetColorSecondaryC", "CatbrowPetColorBaseD", "CatbrowPetColorTertiaryD", "KubrowPetColorMidI", "CatbrowPetColorBaseHyekka", "KubrowPetColorMidLiquid", "KubrowPetColorMundaneJ", "PrimeCatbrowPetColorSecondaryA", "KubrowPetColorMundaneG", "CatbrowPetColorAccentsD", "CatbrowPetColorSecondaryDaybreak", "KubrowPetColorMidD", "KubrowPetColorXmasMidB", "KubrowPetColorVibrantE", "KubrowPetColorPrimeA", "KubrowPetColorMundaneE", "KubrowPetColorVibrantI", "KubrowPetColorXmasMidA", "CatbrowPetColorSecondaryVampire", "CatbrowPetColorTertiaryDaybreak", "CatbrowPetColorAccentsSolstice", "GaraPrimeCatbrowPetColorAccents", "CatbrowPetColorTertiarySolstice", "KubrowPetColorSolsticeVibrant", "KubrowPetColorMidC", "KubrowPetColorMidH", "KubrowPetColorVibrantK", "KhoraDeluxeColorSecondary", "KubrowPetColorMundaneContest", "GaraPrimeCatbrowPetColorBase", "CatbrowPetColorTertiaryContest", "KubrowPetColorMidJ", "KubrowPetColorXmasMundaneB", "KubrowPetColorMidG", "KubrowPetColorPrimeD", "KubrowPetColorPrimeC", "KubrowPetColorVibrantContest", "GaraPrimeCatbrowPetColorSecondary", "KubrowPetColorMundaneK", "KubrowPetColorVibrantF", "PrimeCatbrowPetColorTertiaryA", "ExtraOperatorSkinColors", "KubrowPetColorMidK", "KhoraDeluxeColorBase", "KhoraDeluxeColorTertiary", "CatbrowPetColorSecondaryEntrati", "CatbrowPetColorBaseXmas", "KubrowPetColorVibrantD", "KubrowPetColorMundaneH", "KubrowPetColorMidA", "CatbrowPetColorAccentsC", "KubrowPetColorVibrantC", "CatbrowPetColorTertiaryHyekka", "CatbrowPetColorAccentsDaybreak", "KubrowPetColorMundaneLiquid", "KubrowPetColorXmasMundaneA", "KhoraDeluxeColorAccents", "KubrowColorWukongPrimeMid", "KubrowPetColorXmasVibrantB", "KubrowPetColorVibrantJ", "KubrowPetColorVibrantLiquid", "CatbrowPetColorBaseVampire", "KubrowPetColorVibrantH", "CatbrowPetColorAccentsEntrati", "KubrowPetColorMidE", "CatbrowPetColorSecondaryContest", "CatbrowPetColorSecondarySolstice", "KubrowPetColorSolsticeMid", "CatbrowPetColorBaseA", "CatbrowPetColorSecondaryA", "CatbrowPetColorTertiaryA"];
const FUR_PATTERN_EXCLUDE_END= ["KubrowPetPatternLiquid", "KubrowPetPatternH", "InfestedPredatorPatternDefault", "InfestedCritterPatternDefault", "KubrowPetPatternD", "KubrowPetPatternHelminthDeluxe", "HelminthPetPatternClassic", "KubrowPetPatternInfested", "KubrowPetPatternC", "CatbrowPetPatternA", "CatbrowPetPatternHyekka", "EntratiCatbrowPattern", "KubrowPetPatternPrimeA", "CatbrowPetPatternD", "KubrowPetPatternF", "KubrowPetPatternE", "KubrowPetPatternG", "KubrowPetPatternXmasA", "CatbrowPetPatternC", "KubrowPetPatternXmasB", "KubrowPetPatternB", "KubrowPetPatternA", "CatbrowPetPatternB", "WukongPrimeKubrowPattern", "KubrowPetPatternI", "CatbrowPetPatternVampire", "XmasCatbrowSkin", "SolsticeCatbrowFur", "SolsticeKubrowFur", "PrimeCatbrowFur", "GaraPrimeCatbrowFur", "ContestKubrowFur", "ContestCatbrowFur", "DaybreakCatbrowFur"];
const GLOBAL_EXCLUDE_INC     = ["/Lotus/Upgrades/Mods/Randomized/Lotus", "/Lotus/Upgrades/Mods/Randomized/Player", "/Lotus/StoreItems/Upgrades/Mods/Randomized",  "/TransmuteCores/", "/Engineering/Base", "CloakPullFocusUpgrade", "DashElectricityFocusUpgrade", "CloakStaticFocusUpgrade", "BlastBurstFocusUpgrade", "DashFireFocusUpgrade", "BlastFireballFocusUpgrade", "DashDamageFocusUpgrade", "ElementalDamageFocusUpgrade", "BlastChargeFocusUpgrade", "CloakBlindFocusUpgrade", "BlastRadiusFocusUpgrade", "ArmourIncreaseFocusUpgrade", "DashReduceDamageFocusUpgrade", "MagneticFieldFocusUpgrade", "DashReduceArmourFocusUpgrade", "BlastDamagePickupFocusUpgrade", "CloakReduceDamageFocusUpgrade", "CloakAllyCloakFocusUpgrade", "ReflectDamageFocusUpgrade", "BlastSelfShieldFocusUpgrade", "BlastDisarmFocusUpgrade", "BlastConfuseFocusUpgrade", "DashFinisherFocusUpgrade", "DashSpeedFocusUpgrade", "CloakRevealFocusUpgrade", "SonarPvPAugmentCard", "CloakMeleeCritFocusUpgrade", "CloakShieldFocusUpgrade", "CloakHealOthersFocusUpgrade", "DashShockwaveFocusUpgrade", "DashWaveFocusUpgrade", "AirborneMeleeAutoTargetBonus", "GroundingMeleeMod", "/Lotus/Upgrades/CosmeticEnhancers/Defensive/PoisonProcResist", "/Lotus/Upgrades/CosmeticEnhancers/Defensive/GasProcResist", "/Lotus/Upgrades/CosmeticEnhancers/Defensive/CorrosiveProcResist", "/Lotus/Upgrades/CosmeticEnhancers/Utility/SlowerBleedOutOnPredeath", "/Lotus/Upgrades/CosmeticEnhancers/Utility/DamageReductionDuringRevive", "/Lotus/Upgrades/CosmeticEnhancers/Utility/NoCostCastChanceAbility", "SiriusOrion/OrionSuit", "/Lotus/Types/Keys/DojoKey", "SolNode254", "SolNode255", "SolNode256", "AvatarResistanceOnDamageMod", "AvatarDamageResistanceLaserExpert", "AvatarDamageResistanceFireExpert", "HealthPickupGivesArmourMax", "AvatarDamageResistanceIceExpert", "AvatarAbilityStrengthModExpert", "AvatarDamageResistanceElectricityExpert", "AvatarShieldRechargeRateModExpert", "AvatarAbilityEfficiencyModExpert", "AvatarDamageToEnergyModExpert", "AvatarParryReflectModExpert", "AvatarDamageResistanceStun", "AvatarAbilityRangeModExpert", "/DangerRoomKey", "/AvatarImagePHGlyph", "/PunctureProcResist", "/Rank00Trophy", "TennoconConcert2025Display",
"VoidProjectionProteaIvaraVault"]; // temporary, prevent spoil
const HELMET_EXCLUDE_END     = ["TrinityHelmetAlt", "FrostHelmetAlt", "ExcaliburHelmetAlt", "EmberHelmetAltB", "AspAltHelmetB", "DecreeAltHelmetB", "MagHelmetAlt", "TrapperHelmetAlt", "LokiHelmetAlt", "AntiAltHelmet", "TrapperHelmetAltB", "AspAltHelmet", "NinjaHelmetAltB", "JadeHelmetAlt", "TrinityHelmetAltB", "ExcaliburHelmetAltB", "EmberHelmetAlt", "VoltHelmetAltB", "DecreeAltHelmet", "NinjaHelmetAlt", "FrostHelmetAltB", "VoltHelmetAlt", "LokiHelmetAltB", "RhinoHelmetAlt", "RhinoHelmetAltB", "JadeHelmetAltB", "KahlHelmetWater", "SWBaihuHelmet", "SWRSixAshCarabidHelmet", "NinjaHelmet", "SWIchneumonHelmet", "NinjaDeluxeHelmet", "AshPrimeHelmet", "SWRyugaHelmet", "AshDeluxeHelmet", "SWTsukuyomiHelmet", "SWRFiveAtlasArhatHelmet", "SWAtlasBotLHelmet", "SWAtlasGraxxHelmet", "BrawlerHelmet", "AtlasDeluxeHelmet", "SWMonolithHelmet", "AtlasPrimeHelmet", "SWRSixAtlasTelamonHelmet", "SWBansheeBotLHelmet", "SWDominiaHelmet", "SWRSixBansheeEchoHelmet", "DecreeHelmet", "BansheePrimeHelmet", "SWSonorityHelmet", "BansheeDeluxeHelmet", "BansheeVoidShellHelmet", "SWBedouinHelmet", "SWBaruukBotlHelmet", "BaruukDeluxeHelmet", "SWBaruukGraxxHelmet", "PacifistHelmet", "SWBaruukPeacemakerHelmet", "BaruukPrimeHelmet", "BaruukDeluxeIIHelmet", "SWShiraanHelmet", "SWBaruukZamariuHelmet", "ThanomechVoidRigDefaultHelmet", "CYRhinoRubedoSkinHelmet", "NecraMechCHelmetA", "SentientHelmet", "CalibanDeluxeHelmet", "CalibanPrimeHelmet", "SWCalibanScionHelmet", "MonkArmourHead", "HoodAdultE", "ChromaDeluxeHelmet", "SWGraxxChromaHelmet", "DragonHelmet", "SWRThreeKaijuHelmet", "SWMorkaiHelmet", "ChromaPrimeHelmet", "SWRThreeTarrasqueHelmet", "SWThyrusHelmet", "ChromaLNYHelmet", "CitrineDeluxeHelmet", "SWCitrineCelestisHelmet", "GeodeHelmet", "KahlHelmetTall", "NecraMechCHelmetB", "FrumentariusHelmet", "DagathHelmet", "DagathImmortalHelmet", "SWVoiddaxHelmet", "DagathDeluxeLNYHelmet", "SWYhavanDagathSkinHelmet", "PagemasterHelmet", "PagemasterDeluxeHelmet", "VoidrigDOTDHelmet", "SWRSixEmberGraxxHelmet", "EmberHeirloomHelmet", "EmberHelmet", "SWIgnitionHelmet", "SWMagestyHelmet", "EmberPrimeHelmet", "EmberDeluxeIIHelmet", "SWTechnopyreHelmet", "EmberDeluxeHelmet", "EmberVoidshellHelmet", "EquinoxDeluxeHelmet", "SWDivisaHelmet", "AnimaHelmet", "SWInsomniaHelmet", "SWMegaeraHelmet", "SWEquinoxOmniCombinedHelmet", "EquinoxPrimeHelmet", "DiscordExcaliburHelmet", "SWRFourExcaliburApexHelmet", "SWArturiusExcaliburHelmet", "SWExcaliburBotLHelmet", "SWRFourExcaliburCadutoHelmet", "SWCorpraHelmet", "ExcaliburDexHelmet", "SWExaltationHelmet", "SWRFourExcaliburGraxxHelmet", "SWRFourGraxxAltHelmet", "ExcaliburHelmet", "SWIonExcaliburHelmet", "SWIsurusExcaliburHelmet", "ExcaliburXBoneSkinHelmet", "ObsidianExcaliburHelmetB", "ExcaliburPSPlusSkinHelmet", "SWOgrantExcaliburHelmet", "EsteemExcaliburHelmet", "NintendoExcaliburHelmet", "ExcaliburPrimeHelmet", "VTExcaliburAvalonHelmet", "VTExcaliburHelmet", "VTExcaliburPendragonHelmet", "ExcaliburTwitchSkinHelmet", "ExcaliburProtoHelmet", "SWRoninHelmet", "SWRThreeSentientSlayerHelmet", "ExcaliburUmbraHelmet", "UmbraAltHelmet", "ExcaliburUmbraAltHelmet", "ExcaliburHelmetSWROne", "ExcaliburVeilBreakerHelmet", "ExcaliburDeluxeHelmet", "InkblotHelmet", "SWRSixFrostEmperorHelmet", "SWRThreeFrostGrostHelmet", "SWRThreeFrostHailstormHelmet", "FrostDeluxeHelmet", "FrostHeirloomHelmet", "FrostHelmet", "SWHimavatHelmet", "SWHisameHelmet", "SWIonFrostHelmet", "SWRFourFrostJotunHelmet", "SWMantaZHelmet", "NintendoFrostHelmet", "FrostPrimeHelmet", "SWStrigidHelmet", "SWSummitHelmet", "FrostVoidShellHelmet", "SWRThreeFrostVojnikHelmet", "SWRThreeFrostZastrugaHelmet", "SWGaraAdoraHelmet", "GlassHelmet", "GlassDeluxeHelmet", "GaraPrimeHelmet", "SWRouenHelmet", "SWSilicaHelmet", "SWZamariuHelmet", "GarudaHelmet", "GarudaDeluxeHelmet", "GarudaPrimeHelmet", "SWSakhuraHelmet", "SWSuccessorHelmet", "SWGarudaTengushinHelmet", "SWTiamatHelmet", "SWGaussAgitoHelmet", "SWGaussGraxxHelmet", "RunnerHelmet", "GaussDeluxeHelmet", "GaussDeluxeIIHelmet", "SWGaussNitrolystHelmet", "GaussPrimeAltHelmet", "GaussPrimeHelmet", "SWProfitasHelmet", "KahlHelmetStandard", "DevourerHelmet", "SWMolochHelmet", "GrendelDeluxeHelmet", "GrendelPrimeHelmet", "GrendelDeluxeIIHelmet", "GrendelVoidshellHelmet", "GyreHelmet", "SWGyreKuvealMonarchHelmet", "GyrePrimeHelmet", "GyreDeluxeHelmet", "SWAlgalystHelmet", "SWGraxxHarrowHelmet", "PriestHelmet", "SWHierophaHelmet", "HarrowPrimeHelmet", "SWProfitasHarrowHelmet", "HarrowDeluxeHelmet", "SWVelesHelmet", "TeshinArmourHead", "HoodAdultDaxA", "ShieldDeluxeHelmet", "IronFrameHelmet", "HildrynPrimeHelmet", "SWHildrynSarcostemaHelmet", "SWHildrynSigrunHelmet", "SWGraxxHydroidHelmet", "PirateDefaultHelmet", "SWKarkinosHelmet", "SWPoseidonHelmet", "HydroidPrimeDefaultHelmet", "HydroidDeluxeHelmet", "SWRorqualHelmet", "SandmanHelmet", "SWHorusHelmet", "SWKephriHelmet", "MummyAlt03Helmet", "SWOzymandiasHelmet", "InarosPrimeHelmet", "InarosDeluxeHelmet", "TefilahIridosHelmet", "SWArcuataHelmet", "SWAstreaHelmet", "SWIvaraGraxxHelmet", "RangerHelmet", "SWKuvaelHelmet", "ObsidianIvaraHelmet", "IvaraPrimeHelmet", "IvaraDeluxeHelmet", "SWYoukaiHelmet", "SWIvaraZamariuHelmet", "ChoirHelmet", "JadeImmortalHelmet", "DrifterNightwave1999Helmet", "OperatorNightwave1999Helmet", "InfestedNecraMechHelmet", "SWKhoraFieraHelmet", "SWKhoraGraxxHelmet", "KhoraHelmet", "SWLaveauHelmet", "SWKhoraMithraHelmet", "SWKhoraOiranHelmet", "KhoraPrimeHelmet", "KhoraPrimeAltHelmet", "KhoraDeluxeHelmet", "KoumeiHelmet", "KulervoDeluxeHelmet", "SWPaxAscophiliaHelmet", "PaxDuviricusHelmet", "HoodAdultDaxB", "HoodDaxB", "AlchemistHelmet", "AlchemistDeluxeHelmet", "SWLavosKuvaelHelmet", "LavosPrimeHelmet", "SWYersinHelmet", "SWAureolusHelmet", "SWLimboGraxxHelmet", "MagicianHelmet", "LimboDeluxeHelmet", "LimboPrimeHelmet", "SWVasionaHelmet", "SWVenariHelmet", "SWVistyxioHelmet", "LimboVoidshellHelmet", "SWErebusHelmet", "SWRFourLokiErsatzHelmet", "LokiHelmet", "SWIncubusHelmet", "SWJotunheimHelmet", "LokiDeluxeHelmet", "SWKodamaHelmet", "SWLupuHelmet", "NintendoLokitHelmet", "LokiPrimeHelmet", "SWRFiveLokiRogueHelmet", "LokiTwitchHelmet", "LokiVoidShellHelmet", "SWRThreeAlataHelmet", "DiscordMagHelmet", "SWAnthroMagHelmet", "SWMagCelestisHelmet", "SWCorpraMagHelmet", "SWFerroHelmet", "SWGraxxMagHelmet", "MagHeirloomHelmet", "MagHelmet", "SWInductionMagHelmet", "SWROneMagHelmet", "NintendoMagHelmet", "SWRThreeOrbitHelmet", "MagDeluxeHelmet", "MagPrimeHelmet", "SWToroidalMagHelmet", "MagVoidShellHelmet", "SWRThreeDeadEyeHelmet", "SWDevilRangerHelmet", "SWRThreeFalconHelmet", "SWGraxxMesaHelmet", "MesaHeirloomHelmet", "CowgirlHelmet", "SWCowgirlInsomniaHelmet", "SWKudegraHelmet", "SWMarletHelmet", "SWMesnificentHelmet", "MesaDeluxeHelmet", "MesaPrimeHelmet", "MesaPrimeAltHelmet", "MesaDeluxeV2Helmet", "MesaVoidShellHelmet", "SWRFourMirageGraxxHelmet", "HarlequinHelmet", "SWRFourMirageJolliHelmet", "SWKitsuneHelmet", "SWMirageKuvaelHelmet", "SWMithraHelmet", "SWMorgaineHelmet", "MirageLunarNewYearHelmet", "MirageDeluxeHelmet", "MiragePrimeHelmet", "SWRFourMirageSigynHelmet", "MirageVoidShellHelmet", "SWNekrosAusirylystHelmet", "SWCharonHelmet", "SWNekrosGraxxHelmet", "NecroHelmet", "SWNekrosIonHelmet", "NekrosDeluxeHelmet", "SWRThreeLazarusHelmet", "NekrosPrimeHelmet", "NekrosVoidShellHelmet", "SWDevineHelmet", "SWDracunHelmet", "NezhaDeluxeHelmet", "NezhaHelmet", "NezhaPrimeHelmet", "SWYakshaHelmet", "InfestationHelmet", "SWKuvealScoungerHelmet", "SWNightHunterHelmet", "NidusDeluxeHelmet", "NidusPrimeHelmet", "SWTechnocystHelmet", "NidusVoidShellHelmet", "NokkoHelmet", "NokkoAltHelmet", "NovaDeluxeAoandonHelmet", "NovaDeluxeHelmet", "NovaDeluxeIIHelmet", "SWCorpraHelmet", "SWRThreeCygniHelmet", "SWRThreeDeviceHelmet", "SWRFourNovaFusionHelmet", "SWRThreeGnovaHelmet", "SWGraxxNovaHelmet", "AntiHelmet", "SWRThreeLamiaHelmet", "SWNovaMithraHelmet", "SWNetraselleNovaHelmet", "NovaPrimeHelmet", "SWRThreeStingerHelmet", "SWTachyonHelmet", "SWRThreeVisageHelmet", "NovaVoidShellHelmet", "SWAmpulexHelmet", "SWAscophiliaHelmet", "SWRFourNyxAthenaHelmet", "SWAureliaHelmet", "SWAuresHelmet", "SWCarnifexHelmet", "SWRSixNyxGraxxHelmet", "JadeHelmet", "NyxNemesisHelmet", "NyxDeluxeHelmet", "NyxPrimeHelmet", "SWSaikouHelmet", "SWTechnopsycheHelmet", "SWOberonBotLHelmet", "SWRFiveOberonDestrierHelmet", "SWFeroshHelmet", "PaladinDeluxeHelmet", "PaladinHelmet", "OberonPS4Helmet", "OberonPS4Alt2Helmet", "PaladinPrimeHelmet", "SWTaurusHelmet", "SWWendigoHelmet", "SWOberonYoukaiHelmet", "SWDivaHelmet", "SWGiocosoHelmet", "BardHelmet", "BardTwitchHelmet", "BardTwitchAltHelmet", "OctaviaDeluxeHelmet", "SWMandachoralystHelmet", "SWNetrahymnHelmet", "OctaviaPrimeHelmet", "SWOctaviaYoukaiHelmet", "SWOraxiaAgamvaHelmet", "OraxiaHelmet", "OrionHelmet", "ProteaDeluxeHelmet", "OdaliskHelmet", "ProteaImmortalHelmet", "SWKollapsarHelmet", "ProteaPrimeAltHelmet", "ProteaPrimeHelmet", "SWTechnochronHelmet", "ProteaVoidShellHelmet", "VoidrigDSChromaHelmet", "ConcreteFrameHelmet", "SWQorvexSarcophagoHelmet", "KahlHelmetPith", "KahlHelmetHood", "KahlHelmetDamaged", "KahlHelmetDamagedWithMask", "SWAhrimanHelmet", "SWDraugenHelmet", "RevenantHelmet", "SWImmortuosHelmet", "RevenantDeluxeHelmet", "RevenantPrimeHelmet", "SWTenebrusHelmet", "SWRevenantWightHelmet", "SWRhinoBotLHelmet", "RhinoDeluxeV2Helmet", "RhinoDexHelmet", "SWRFourRhinoGraxxHelmet", "RhinoHeirloomHelmet", "RhinoHelmet", "SWIonRhinoHelmet", "JadeRhinoHelmet", "SWMastodonHelmet", "RhinoDeluxeHelmet", "RhinoPrimeHelmet", "RhinoRubedoSkinHelmet", "SWScarabSectHelmet", "SWTeutonicHelmet", "RhinoChameleonAHelmet", "SWWarlustHelmet", "SWAmalgamaHelmet", "SWBelladonnaHelmet", "SWBotLSarynHelmet", "SWRSixSarynGraxxHelmet", "AspHelmet", "SWIntegraHelmet", "SWSarynIonHelmet", "SWNapellusHelmet", "SWSarynNighthunterHelmet", "SWNitasModaHelmet", "SarynDeluxeHelmet", "SarynPrimeHelmet", "WF1999SarynHelmet", "SWVelenosaHelmet", "SarynChameleonBHelmet", "SarynLunarNewYearHelmet", "SWSevagothEzrielHelmet", "SevagothDeluxeHelmet", "SevagothDeluxeShadowHelmet", "WraithHelmet", "SevagothPrimeHelmet", "SevagothPrimeShadowHelmet", "SWSevagothEzrielReaperHelmet", "ReaperHelmet", "SiriusHelmet", "NecramechSnakeHelmet", "KahlHelmetCorpus", "SWStyanaxAresHelmet", "HopliteHelmet", "SWStyanaxHuzarrHelmet", "StyanaxPrimeHelmetNoCloth", "StyanaxPrimeHelmet", "SWRaevuzStyanaxHelmet", "StyanaxDeluxeHelmet", "StyanaxVoidshellHelmet", "TempleHelmet", "TitaniaDeluxeIIHelmet", "TitaniaDeluxeHelmet", "FairyHelmet", "SWLympharisHelmet", "SWPixialystHelmet", "TitaniaPrimeHelmet", "SWUnseelieHelmet", "SWVirajiHelmet", "SWAncyraHelmet", "SWTrinityBotLHelmet", "TrinityHelmet", "SWKnightessHelmet", "SWRFiveTrinityMessiahHelmet", "SWNightingaleHelmet", "TrinityPrimeHelmet", "TrinityDeluxeHelmet", "KahlHelmetMushroom", "DemonFrameHelmet", "ValkyrDeluxeHelmet", "SWRFiveValkyrCheetahHelmet", "SWDelusionHelmet", "BerserkerDeluxeHelmet", "SWRFourValkyrGraxxHelmet", "ValkyrHeirloomHelmet", "BerserkerHelmet", "SWIonHelmet", "JadeValkyrHelmet", "SWLeonessaHelmet", "SWMithraValkyrHelmet", "ValkyrPrimeHelmet", "SWBonaparteHelmet", "SWRFourVaubanChapelonHelmet", "VaubanDeluxeHelmet", "SWGraxxVaubanHelmet", "VaubanHeirloomHelmet", "TrapperDefaultHelmet", "VaubanVoidSkinHelmet", "VaubanPrimeHelmet", "SWSuppressorHelmet", "NecramechVoidRigDefaultHelmet", "DiscordVoltHelmet", "SWROneVoltHelmet", "SWArresterVoltHelmet", "SWCapacitorHelmet", "VoltDeluxeBHelmet", "SWFulgursorHelmet", "SWRFourVoltGraxxHelmet", "VoltHelmet", "NintendoVoltHelmet", "VoltPrimeHelmet", "VoltTwitchHelmet", "VoltDeluxeHelmet", "VoltDeluxeRaijinHelmet", "SWRelayVoltHelmet", "SWTechnoshockHelmet", "SWThalesVoltHelmet", "VoltChameleonAHelmet", "SWZenerHelmet", "VorunaDemionnaHelmet", "WerewolfHelmet", "SWVorunaKuvaelDrahkaanisHelmet", "VorunaDeluxeHelmet", "VorunaPrimeHelmet", "VorunaVoidShellHelmet", "SWCelestisWispHelmet", "SWCovenWispHelmet", "SWDamasHelmet", "SWDelusionHelmet", "DexWispHelmet", "SWWispGraxxHelmet", "WispHelmet", "WispPrimeHelmet", "SWRaevuzHelmet", "WispDeluxeHelmet", "SWSycoraxWispHelmet", "SWZamariuWispHelmet", "SWAumanHelmet", "MonkeyKingHelmet", "SWWukongMithraHelmet", "SWPiercingEyeHelmet", "WukongPrimeHelmet", "WukongDeluxeBHelmet", "WukongDeluxeHelmet", "MonkeyKingChamelionHelmet", "SWRFiveWukongXingzheHelmet", "SWXakuDeatheaHelmet", "BrokenFrameHelmet", "XakuDeluxeHelmet", "XakuPrimeHelmet", "XakuCosmosHelmet", "XakuCosmosAltHelmet", "KahlHelmetKavaLich3A", "SWBatomorphaHelmet", "YareliHelmet", "YareliDeluxeHelmet", "YareliPrimeHelmet", "SWZephyrBotLHelmet", "ZephyrQTCCHelmet", "SWZephyrGraxxHelmet", "SWRThreeHagoromoHelmet", "ZephyrDeluxeHelmet", "TenguHelmet", "SWRFourZephyrMigisiHelmet", "SWRThreeMonsoonHelmet", "ZephyrPrimeHelmet", "SWRThreeSkeironHelmet", "SWStrafeHelmet"];
const MOD_BEASTS_INC         = ["beast", "kavat", "kubrow", "predasite", "vulpaphyla", "helminth charger"];
const MOD_DO_NOT_EXCLUDE     = ["/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert", "/Lotus/Upgrades/Mods/Melee/Expert/WeaponToxinDamageModExpert", "/Lotus/Upgrades/Mods/Melee/Expert/WeaponImpactDamageModExpert", "/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert", "Shotgun/Expert/WeaponElectricityDamageModExpert", "Shotgun/Expert/WeaponFreezeDamageModExpert", "Rifle/Expert/WeaponFreezeDamageModExpert", "Mods/Shotgun/Expert/WeaponCritDamageModExpert"];
const MOD_EXCLUDE_INC        = ["SampleAntiqueUpgrade", "/Railjack/Gunnery/Base", "/Railjack/Piloting/Base", "DamageRandomMod", "RateRandomMod"];
const MOD_EXCLUDE_END        = ["/TennokaiBaseMod", "/ArchwingWeaponElectricityDamageModExpert", "/ChargerFinisherMod", "/HBFireWorksMod", "/NecromechSprintEfficiencyMod", "Intermediate", "Beginner", "/WeaponAmmoMaxModExpert", "/WeaponBowConvertAmmoModExpert", "/AvatarDamageReductionInAirExpert", "/WeaponZoomFovModExpert", "/AvatarEnemyRadarModExpert", "/WeaponPistolZoomFovModExpert", "/AvatarFallingImpactModExpert", "/AvatarChanceToLootExpert", "/AvatarParryMeleeModExpert", "/AvatarSprintSpeedModExpert", "/WeaponGlaiveSpeedModExpert", "/AvatarMissionSpecificResistanceIceExpert", "/AvatarLootRadarModExpert", "/AvatarRevengeDamageMeleeExpert", "/AvatarKnockdownRecoveryModExpert", "/WeaponCritFireRateBonusModExpert", "/WeaponPowerDamageModExpert", "/WeaponMeleeFinisherDamageModExpert", "/WeaponSlashDamageModExpert", "/WeaponStunChanceModExpert", "/WeaponFireDamageModExpert", "/WeaponFreezeDamageModExpert", "/WeaponCritDamageModExpert", "/WeaponGlaivePowerthrowModExpert", "/WeaponMeleeDamageOnHeavyKillMod", "/WeaponMeleeChannelingEfficiencyModExpert", "/WeaponElectricityDamageModExpert", "/WeaponArmorPiercingDamageModExpert", "/WeaponCritChanceModExpert", "/WeaponImpactDamageModExpert", "/WeaponFireRateModExpert", "/WeaponToxinDamageModExpert", "/WeaponPunctureDepthModExpert", "/WeaponStatusChanceModExpert", "/WeaponFireIterationsModExpert", "/ProjectileExplosionChanceMod", "/BallisticaMod", "WeaponFactionDamageCorpusExpert", "/WeaponFactionDamageGrineerExpert", "/WeaponFactionDamageInfestedExpert", "/BowExplosionChanceModExpert", "/SniperReloadDamageModExpert", "/AvatarDamageResistancePoisonExpert"];
const MOD_IS_MELLE_END       = ["KubrowCritMod", "KubrowFireEventMeleeMod", "KubrowIceEventMeleeMod", "CompanionHunterSynergyMod", "KubrowMagneticEventMeleeMod", "KubrowMeleeDamageMod", "KubrowRadiationEventMeleeMod", "KubrowElectEventMeleeMod", "HelminthStrainFeverMod", "KubrowPoisonEventMeleeMod"];
const MOD_IS_ATAGRAPH_END    = ["/AvatarHealthMaxMod", "/KahlAvatarHealthMaxMod", "/InfestLinkAugmentCard", "/WarframeUmbraModA", "/Melee/WeaponFireRateMod", "/WeaponCritFireRateBonusMod", "/WeaponFireRateModExpert", "/Melee/WeaponCritDamageMod", "/Pistol/WeaponCritDamageMod", "/CritDamageChargeSpeedMod", "/PrimedWeaponCritDamageMod", "/Rifle/WeaponDamageAmountMod", "/WeaponDamageAmountInvisibleMod", "/SerratedRushMod", "/ShrineMaidenGunbrellaAugment", "/Pistol/WeaponFireIterationsMod", "/Shotgun/WeaponFireIterationsSPMod", "/Rifle/WeaponFireDamageMod", "/Shotgun/WeaponFireIterationsMod", "/MultishotDodgeMod", "/Pistol/WeaponFireIterationsSPMod", "/SentinelLootRadarEnemyRadarMod", "/SentinelLootRadarEnemyRadarExpertMod", "/GarudaBloodAugmentCard", "/GarudaShieldAugmentCard", "/GlaiveAugmentCard", "/SmokeScreenAugmentCard", "/AvatarAbilityEfficiencyMod"];
const MOD_IS_SECONDARY_INC   = ["zylok", "akjagara", "kunai", "detron", "embolist"];
const MOD_IS_AUGMENT_END     = ["AugmentCard", "DisablePassiveMod", "AugmentTwoCard", "Augment1Card"];
const MOD_PVEVP_END          = ["FasterMovementWhileAimingRifleMod", "RubicoLowZoom", "HigherAirAimFoVPistolMod", "HigherAirAimFoVShotgunMod", "SupraHigherAccuracyAiming", "MoreAccuracyLessRecoilSlidingShotgunMod", "TetraFasterProjAiming", "MoreAccuracyLessRecoilSlidingMod", "WeaponPistolZoomFovModExpert", "GunFuPvPAugmentCard", "HigherAirAimFoVRifleMod", "HolsterSpeedBonusMod", "FasterMovementWhileAimingShotgunlMod", "FasterMovementWhileAimingPistolMod", "MoreAccuracyLessRecoilSlidingPistolMod", "/PassiveReloadMod", "ColourPickerTwitchItemA", "MarelokMultishot", "ViperUnlimitedAmmo", "WeaponZoomFovMod", "WeaponPistolZoomFovMod", "DecoyPvPAugmentCard", "RangerQuiverPvPAugmentCard", "PrismPvPAugmentCard", "SlashDashPvPAugmentCard", "FireBlastPvPAugmentCard", "ShieldPvPAugmentCard", "SelfBulletAttractorPvPAugmentCard", "BrawlerSummonPvPAugmentCard", "GrakataUnlimitedAmmo", "MoreDamageonTripleTapRifleMod", "DaikyuMoreDamageOverDistanceMod", "DragonBreathAugmentCard", "IceSpikeAugmentCard", "IronSkinAugmentCard"];
const MOD_ROBOTS_INC         = ["robotic", "carrier", "shade", "hound", "moa", "diriga", "nautilus", "oxylus", "wyrm", "dethcube", "djinn", "helios", "taxon", "sentinel"];
const MOD_VEHICLES_INC       = ["archwing", "k-drive", "necramech", "elytron", "itzal", "odonata"];
const NODE_LOCATIONS         = { "SolNode": WF.TYPES.node.solar, "ClanNode": WF.TYPES.node.solar, "Junction": WF.TYPES.node.solar, "SettlementNode": WF.TYPES.node.solar, "CrewBattleNode": WF.TYPES.node.empyrean };
const NODE_MAPPING           = {"SolNode203": 138, "SolNode4": 51, "SolNode181": 177, "SolNode88": 51, "SolNode106": 51, "SolNode97": 51, "SolNode73": 51, "SolNode31": 55, "SolNode2": 18, "SolNode45": 51, "SolNode113": 51, "SolNode33": 69, "SolNode204": 138, "SolNode41": 51, "SolNode16": 51, "SolNode205": 138, "SolNode185": 50, "SolNode132": 163, "SolNode223": 3, "SolNode153": 279, "SolNode907": 69, "SolNode60": 69, "SolNode25": 51, "SolNode119": 3, "SolNode82": 55, "SolNode79": 24, "SolNode74": 51, "SolNode121": 51, "SolNode70": 55, "SolNode149": 163, "SolNode43": 51, "SolNode75": 24, "SolNode196": 177, "SolNode147": 163, "SolNode83": 69, "SolNode56": 51, "SolNode23": 18, "SolNode98": 69, "SolNode6": 52, "SolNode67": 55, "SolNode146": 163, "SolNode128": 18, "SolNode27": 24, "SolNode100": 51, "SolNode12": 3, "SolNode19": 49, "SolNode903": 24, "SolNode59": 24, "SolNode39": 24, "SolNode144": 163, "SolNode104": 41, "SolNode85": 20, "SolNode1": 52, "SolNode905": 51, "SolNode87": 51, "SolNode65": 45, "SettlementNode11": 157, "SolNode51": 51, "SolNode42": 55, "SolNode58": 51, "SolNode76": 51, "SolNode195": 177, "SettlementNode20": 100, "SolNode125": 51, "SolNode61": 24, "SolNode162": 279, "SolNode164": 279, "SolNode177": 177, "SolNode93": 55, "SolNode188": 177, "SettlementNode10": 157, "SolNode141": 163, "SolNode101": 18, "SolNode140": 163, "SolNode220": 138, "SolNode118": 52, "SolNode130": 3, "SolNode49": 52, "SolNode139": 163, "SolNode109": 18, "SolNode26": 24, "SolNode138": 163, "SolNode103": 3, "SolNode63": 24, "SolNode89": 24, "SolNode191": 177, "SolNode36": 51, "SolNode193": 100, "SolNode126": 51, "SolNode38": 51, "SettlementNode12": 157, "SolNode902": 18, "SolNode209": 138, "SolNode210": 138, "SolNode175": 279, "SolNode189": 177, "SolNode190": 177, "SolNode21": 51, "SolNode84": 52, "SolNode62": 52, "SolNode166": 279, "SolNode50": 55, "SolNode137": 163, "SolNode102": 51, "SolNode224": 3, "SolNode167": 279, "SolNode30": 51, "SolNode69": 69, "SolNode129": 24, "SolNode217": 138, "SolNode24": 24, "SolNode211": 138, "SolNode72": 51, "SolNode15": 24, "SolNode212": 138, "SolNode131": 163, "SolNode81": 51, "SolNode906": 55, "SolNode226": 3, "SolNode228": 24, "SolNode17": 52, "SolNode127": 52, "SolNode114": 44, "SolNode48": 51, "SolNode18": 55, "SettlementNode1": 157, "SolNode9": 69, "SolNode184": 177, "SolNode908": 52, "SolNode57": 52, "SolNode171": 279, "SolNode187": 177, "SettlementNode15": 157, "SettlementNode14": 157, "SettlementNode2": 157, "SolNode173": 279, "SolNode214": 138, "SolNode46": 51, "SolNode122": 69, "SettlementNode3": 157, "SolNode225": 3, "SolNode34": 69, "SolNode904": 51, "SolNode20": 55, "SolNode22": 18, "SolNode32": 55, "SolNode11": 51, "SolNode740": 55, "SolNode10": 51, "SolNode53": 51, "SolNode135": 163, "SolNode96": 55, "SolNode105": 69, "SolNode108": 25, "SolNode78": 52, "SolNode450": 18, "SolNode14": 51, "SolNode64": 69, "SolNode66": 18, "SolNode123": 18, "SolNode215": 138, "SolNode216": 138, "SolNode68": 51, "SolNode107": 18, "SolNode239": 50, "SolNode183": 177, "SolNode99": 51, "SolNode172": 279, "SolNode199": 177,};
const PET_ARMOR_EXCLUDE_END  = ["GrnAmphisKubrowArmor", "GrnAmphisKavatArmor", "KubrowArmorTrinityDeluxe", "TnTigrisKavatArmor", "TnTigrisKubrowArmor", "KubrowArmorC", "RevenantKavatArmor", "PrimeKubrowArmorA", "GrineerQueenArmor", "HelminthDeluxeArmor", "LNYKavatBoltorArmor", "Lunar2022KubrowArmor", "KubrowArmorStalker", "KubrowArmorA", "WukongPrimeKubrowArmor", "EmpyreanKavatArmor", "WispKavatArmor", "PacifistKubrowArmor", "UmbraKavatArmor", "KubrowArmorUmbra", "KubrowArmorBJade", "KubrowArmorB", "Twitch2021IfritKubrowArmor", "CatbrowArmorGaraPrime", "CatbrowArmorDuviri", "GrnQueenCatbrowArmor", "CatbrowArmorC", "CatbrowArmorB", "CatbrowArmorPrime", "Twitch2021MyrdinCatbrowArmor", "CatbrowArmorA"];
const POSTER_EXCLUDE_END     = ["SolarisPosterA", "SolarisPosterB", "SolarisPosterC", "SolarisPosterD", "SolarisPosterE", "SolarisPosterF", "SolarisPosterG", "ThisIsWhatYouAreAchievement", "TNWGlintTeshinDisplay", "TNWGlintUmbraDisplay", "TNWGlintOperatorDisplay", "CNY2021Poster", "CaliberChicksPoster", "EmpyreanPoster", "YareliQuestComic", "YareliAltCoverPoster", "ExplorationPoster", "VentKidPosterF", "VentKidPosterI", "VentKidPosterG", "VentKidPosterH", "VentKidPosterM", "VentKidPosterN", "VentKidPosterO", "VentKidPosterP", "VentKidPosterL", "VentKidPosterD", "VentKidPosterK", "VentKidPosterJ", "VentKidPosterE", "VentKidPosterA", "VentKidPosterC", "VentKidPosterB", "OrbiterPictureFrameD", "7thAnniversaryPoster", "8thAnniversaryPoster"];
const POSTER_BARO_END        = ["ParazonPoster", "KubrowKavatLowPolyPoster", "GarvLatroxPoster", "HeartOfDeimosAlbumCoverPoster", "EraHypnosisPoster", "BoredTennoPoster"];
const QUEST_SIDE_INC         = ["KubrowQuestKeyChain", "SpyQuestKeyChain", "KahlQuestKeyChain", "InfestedAladVQuestKeyChain", "GetClemQuestKeyChain", "GlassQuestKeyChain"];
const QUEST_WARFRAME_INC     = ["ProteaQuestKeyChain", "WraithQuestKeyChain", "DragonQuestKeyChain", "IndexQuestKeyChain", "BardQuestKeyChain", "MummyQuestKeyChain", "MirageQuestKeyChain", "RevenantQuestKeyChain", "FairyQuestKeyChain", "YareliQuestKeyChain", "LimboQuestKeyChain", "GolemQuestKeyChainItem"];
const RAILJACK_EXCLUDE_END   = ["TierA", "TierB", "TierC"];
const RAILJACK_TIERS_END     = [...RAILJACK_EXCLUDE_END, "TierD"];
const RECLIC_EXCLUDE_END     = ["T5VoidProjectionImmortal", "T5VoidProjectionImmortalOmni", "VoidProjection"];
const SIGIL_EXCLUDE_END      = ["BansheeDeluxeArmLeftArmor", "WukongDeluxeBSigil", "WeGameNewYearTigerSigil", "WeGameNewYearRabbitSigil", "WeGameNewYearDragonSigil", "WeGameNewYearSnakeSigil", "WeGameNewYearHorseSigil", "LavosDeluxeSigil", "GaussDeluxeIISigil", "GaussDeluxeIIDamageSigil", "ColourPickerHeirloom", "ColourPickerEmberHeirloom", "ColourPickerMesaHeirloom", "ColourPickerRhinoHeirloom", "ColourPickerValkyrHeirloom", "ColourPickerVaubanHeirloom", "PrimeAccessSigilSaryn", "PrimeAccessSigilLimbo", "PrimeAccessSigilFive", "StarterPackASigil", "StarterPackLotusSigil", "ArchwingSigil", "TwitchPrimeSigil", "BladeAndGunSigil", "DawnsEarlyLightSigil", "SigilVideoContest", "TennoLive2015Sigil", "TennoLivePromoSigil", "WikiaSigil", "TranslatorSigil", "TennoGenSigil", "LotusGuideSigil", "PS4OneYearSigil", "PS4TwoYearSigil", "PS4ThreeYearSigil", "PS4FourYearSigil", "PS4FiveYearSigil", "PS4RenownXSigil", "ObsidianIndraSigil", "PS4CrowSigil", "XBoneOneYearSigil", "XBoneTwoYearSigil", "XBoneThreeYearSigil", "XBoneFourYearSigil", "XBoneJadeSigil", "XboneJadeTwoSigil", "Community10YearAnniversarySigil", "NewWar2021Sigil", "GeodeSigil", "Cyte09Sigil", "KoumeiSigil", "TempleSigil", "DanteSigil", "HolidaySigilSnowflake", "FireSigil", "SparkSigil", "FormaSigil", "TwoToneSigil", "InktoberSigil", "JadeSigil", "KahlSupporterPackSigil", "BossSigilNefAnyo", "NarmerEyeSigil", "MechEventSigil", "VorDuviriSigil", "NecramechSigilSnake", "SigilSnake", "YareliSigil", "CNYRoosterCYSigil", "ZarimanSupporterPackSigil", "MonquisCYSigil", "MonquisSigil", "CNYRoosterPWSigil", "ClanSigilBasic", "AllianceSigilBasic", "OpticorConclaveVariantSigil"];
const SIGNA_EXCLUDE_END      = ["DexVinesCrown", "ChoirFrameHaloCrown", "TnTempleSignaCrown", "PrimeSevagothHaloCrown", "SWZamariuSignaCrown", "SWSignaPragmaticaCrown", "SWCenturioSignaCrown", "SWachetaSignaCrown"];
const SKIN_EXCLUDE_INC       = ["AdultFemaleHead", "FemaleHead", "MaleHead", "AdultHead", "Heads/Head", "ExtraAdult", "EyeBrows/EyeBrow", "Beards/Beard"];
const SKIN_EXCLUDE_SW        = ["/Lotus/Types/Game/Lotus", "/Lotus/Upgrades/Skins/RailJack", "/Lotus/Types/Game/CatbrowPet/BodyTypes", "/Lotus/Types/Game/KubrowPet/BodyTypes", "/Lotus/Upgrades/Skins/Operator/FacialMarkings"];
const SKIN_EXCLUDE_END       = ["TnRevenantDeluxe2HKatanaSkin"];
const SUGATRA_EXCLUDE_END    = ["CitrineSugatra", "SurakaPrimeDangle", "LNYBirdSugatra", "ESGrnSugatraMeleeDangle", "GrnMeleeDangle", "CatenoPrimeMeleeDangle", "PrimeDangleF", "LNYSnakeMeleeDangle", "/PrimeMeleeDangle", "PolearmFriendlyMeleeDangle", "ChromaDeluxeMeleeDangle", "WukongDlxSugatra", "LimboDeluxeDangle", "XBoxSugatra2MeleeDangle", "JadePatikaMeleeDangle", "KazeruPrimeMeleeDangle", "GrnQueensMeleeDangle", "WegameChinaKnotDangle", "LNYCarpSugatra", "VaubanDeluxeMeleeDangle", "SarynDeluxeMeleeDangle", "ScrollingPrimeMeleeDangle", "ObsidianSugatraMeleeDangle", "Obsidian2SugatraMeleeDangle", "SugatraNintendo", "TnSugatraNewPlayerXpMeleeDangle", "TennoMeleeDangle", "ChainTridentMeleeDangle", "CorpusMeleeDangle", "YareliDlxSugatra", "PrimeDangleEMeleeDangle", "IceMeleeDangle", "TnRailJackSugatra", "TwitchPrimeMeleeDangle", "SentSugatraNewWarDangle", "LotusPointMeleeDangle", "LNYFireSugatra", "CordsMeleeDangle", "TennoCon2022SugatraMeleeDangle", "EmbolistMeleeDangle", "NekrosDeluxeMeleeDangle", "RazorMeleeDangle", "ValaPrimeMeleeDangle"]; 
const SYANDANA_EXCLUDE_END   = ["PrimeScarfG", "HalloweenErosionCape", "ErosionCape", "LavosDeluxeSyandana", "PaxDuviricusSyandana", "SWAkSuraScarf", "PacifistSyandana", "SWAlocanaSyandana", "PrimeAltraScarf", "SapientCape", "GrnAmphisScarf", "IvaraPrimeCape", "KazInfestedScarf", "SWRThreeAquirosScarf", "SWArcturusScarf", "SWArmalystSyandana", "SWAropanexSyandana", "PrimeArtifexSyandana", "TnBrokenFrameSyandana", "EnergyScarfVoidSkin", "EnergyScarf", "PrimeAkrabuSyandana", "ZorbaScarf", "PrimeRevenantCape", "PrimeAviaSyandana", "InfBatCape", "SWAlyaScarf", "EmberDeluxeSyandana", "SWBodoScarf", "GaussDeluxeCape", "SWBoltaraScarf", "TennoAngleCapeScarf", "CephSyandana", "HildrynDeluxeSyandana", "TnLargeCape", "HydroidDeluxeBlazers", "NezhaDeluxeScarf", "PrimeScarfF", "NokkoSyandana", "TnVoltDeluxeSyandana", "CenturionCape", "SummerSolsticeCenturionCape", "SWChemtankSyandana", "EquinoxDeluxeCape", "PrimeScarfV", "ZephyrQTCCSyandana", "MesaDeluxeSyandana", "CitrineDeluxeSyandana", "SWCoronaScarf", "SWCovenantScarf", "TnAshDeluxe2Syandana", "NidusPrimeSyandana", "SWCryonaScarf", "KulervoDeluxeSyandana", "BillowingCape", "PrimeScarfDItem", "NovaDeluxeScarf", "UmbraDaxSyandana", "SWDeruScarf", "SWDespotScarf", "GarudaDeluxeSyandana", "DexScarf", "SWDiablilloSyandana", "SWDisconnectScarf", "SWDominusCape", "SWDraugenSyandana", "SWDueVolpiScarf", "SWEklisSyandana", "PrimeWispSyandana", "NyxDeluxeSyandana", "SWEzrielSyandana", "SWFeiSyandana", "CrpCubinatorScarf", "TennoFeathersCapeScarf", "TitaniaPrimeShortSyandana", "TitaniaPrimeSyandana", "GlassDeluxeSyandana", "LasNightwaveCape", "SWGothicaSyandana", "SWRSixSpitefireScarf", "PrimeVorunaSyandana", "GrineerTurbinesScarf", "HornSkullScarfDefault", "StyanaxDeluxeSyandana", "TnGlassSyandana", "SWIcariusScarf", "HalloweenFireFlyScarf", "FireFlyScarf", "InfestedFinsScarf", "HolidayTurtleNeckScarf", "JadeTurtleNeckScarf", "TurtleNeckScarf", "PrimeChromaCape", "SWIncubusScarf", "PrimeCapeEquinox", "Halloween2024U17TnoCapeScarf", "U17TnoCapeItem", "JadeSyandana", "JadeBombyxScarf", "TnLargeCapeXbox", "SiriusOrionBothSyandana", "SWRThreeJattukScarf", "PrimeWukongSyandana", "SWJotunheimMusic", "SWJotunheimScarf", "LasBackpackMedkitSyandana", "PrimeInarosSyandana", "KhoraPrimeSyandana", "QuillCape", "BaruukDeluxeCape", "QuillCanistersSyandana", "DeimosSupporterFireFlyBlueScarf", "BaroCape2RazzaExilisScarf", "/BaroCape", "SWKunshuScarf", "GrnQueenScarf", "/GrnHoodedCape", "HalloweenKyropteraScarf", "BrassAndGoldScarf", "MixerKyropteraScarf", "April2015Scarf", "GrnStrapsScarf", "PrimeStyanaxSyandana", "TnStyanaxSyandana", "SWLaprosysSyandana", "TnSundialCape", "NefSyandanaScarf", "GrendelDeluxeIISyandana", "SWLunariusSyandana", "DaxSquareCape", "DaxTwoTailsCape", "InfGrnWolfCape", "GrnVhCape", "SummerSolsticeMaggorCape", "SWMaharliqaScarf", "PrimeScarfAtlas", "PrimeMerulinaSyandana", "YareliCape", "PrimeScarf", "SWMithraScarf", "TnGuandaoScarf", "InfTentacleScarf", "SWMushussuScarf", "SWNaruScarf", "PrimeNaveScarf", "PriestScarf", "LotusCapeItem", "NeurovyrePrimeSyandana", "SentSyandanaB", "SWNighthunterSyandana", "NoruPrimeScarf", "NidusDeluxeScarf", "SWRThreeNsaruScarf", "TC2025OrokinScarf", "TC2025EvolvedOrokinScarf", "PrimeLimboCape", "ObsidianAzureScarf", "ObsidianCrowSyandana", "ObsidianKyropteraScarf", "ObsidianSamiaScarf", "PS5Syandana", "SWOfficiumScarf", "NintendoTurtleNeckScarf", "CrpAladScarf", "SiriusOrionLeftSyandana", "TnNewPlayerSyandana", "StalkerCapeItem", "RhinoDeluxeScarf", "TnLefaucheuxSyandana", "TnSparrowCape", "SWPaxisScarf", "SWPistrisScarf", "TnConcreteSyandana", "NarmerEvolvingSyandanaCCape", "NarmerEvolvingSyandanaBCape", "NarmerEvolvingSyandanaACape", "TnKorahSyandanaDeluxe", "PrimeFlameScarf", "FlameScarf", "CrpMBundleSyandana", "NovaIIDeluxeSyandana", "SWRaijiScarf", "SWRanulystSyandana", "GrnTubeScarf", "SWRauSyandana", "TitaniaDeluxeV2Cape", "TnPagemasterSyandana", "SWRepalaScarf", "SWRetrorolystSyandana", "RevenantDeluxeCape", "SWRhodoraSyandana", "PrimeRhoptronSyandana", "TnOdaliskSyandana", "ArcherCape", "TennoLeafDotCapeScarf", "SWRSixSariScarf", "SWSarvaHarnessScarf", "SWScapulisScarf", "InarosDlxCape", "SWSciathinScarf", "SWScyllaScarf", "SWSenvictisSyandana", "SWSeraphimScarf", "PrimeOctaviaSyandana", "SWSetharSyandana", "SWSetkaScarf", "SWShirokuSyandana", "SWShurihoshiScarf", "LimboDeluxeCape", "TnRailjackSyandana", "SWSildargScarf", "SiriusOrionRightSyandana", "SWSolidaScarf", "SolsticeCenturionCape", "InfCoralSyandana", "SWSovereignScarf", "TwitchPrimeScarf", "AtlasDeluxeSyandana", "SWStyxSyandana", "WukongDeluxeSyandana", "TnWispDeluxeSyandana", "PrimeOberonCape", "PrimeGrendelSyandana", "TnOniSyandana", "GarudaCape", "PrimeSuratorSyandana", "ShieldFrameCape", "SWSydekoScarf", "TnSmallBatteryCape", "GaussDeluxeIISyandana", "TennoConScarf", "TennoCon2017Scarf", "TennoCon2020Scarf", "TennoCon2023Cape", "TennoCon2024Scarf", "TC2025Scarf", "TC2025EvolvedScarf", "SWTenuiSyandana", "SWTeploScarf", "IvaraDeluxeSyandana", "InfScarfRibCage", "SWTonacaScarf", "PrimeGyreSyandana", "TnGyreCape", "SWTsujinasaSyandana", "U17IntermScarfItem", "UruPrimeScarf", "/RazorScarf", "ValdurBackCape", "SWValestiScarf", "GrnBannerScarfItem", "HalloweenGrnBannerScarf", "MagDeluxeScarf", "TnOctaviaDeluxeCape", "CrpModularScarf", "PrimeTwitchScarf", "VitamPrimeSyandana", "TnAlchemistSyandana", "TnWraitheSyandana", "EmberDeluxeIISyandana", "WispPrimeDefaultCape", "SWXikonosSyandana", "YamakoPrimeScarf", "RubedoDinoSpikeScarf", "/DinoSpikeScarf", "PS4ArmScarf", "ArmScarf", "SWZaikhyaScarf", "SWZamariuSyandana"]
const SENTITEL_EXCEPTION     = ["ZanukaPetMeleeWeaponPS", "ZanukaPetMeleeWeaponIP", "ZanukaPetMeleeWeaponIS"];
const SKINPET_EXCLUDE_END    = ["KubrowPetPatternLiquid", "KubrowPetPatternH", "KubrowPetPatternXmasC", "InfestedPredatorPatternDefault", "InfestedCritterPatternDefault", "KubrowPetPatternD", "DrahkKubrowPattern", "KubrowPetPatternDuviriWolf", "KubrowPetPatternHelminthDeluxe", "HelminthPetPatternClassic", "KubrowPetPatternInfested", "KubrowPetPatternC", "CatbrowPetPatternA", "CatbrowPetPatternHyekka", "EntratiCatbrowPattern", "KubrowPetPatternPrimeA", "DuviriCatbrowPattern", "CatbrowPetPatternD", "KubrowPetPatternF", "KubrowPetPatternE", "FeralCatbrowPattern", "KubrowPetPatternG", "KubrowPetPatternXmasA", "CatbrowPetPatternC", "KubrowPetPatternXmasB", "KubrowPetPatternB", "KubrowPetPatternA", "CatbrowPetPatternB", "WukongPrimeKubrowPattern", "KubrowPetPatternI", "CatbrowPetPatternVampire"];
const WEAPON_FIVE_EVOLUTION  = ["ZarimanPumpShotgun", "ZarimanDaggerWeapon", "ZarimanHeavyPistol", "EntratiWristGunWeapon", "ZarimanSemiAutoRifle", "ZarimanTonfaWeapon", "EntFistIncarnon", "ZarimanHeavyScytheWeapon"];
const WEAPON_INCARNON        = ["ParisScythe", "/Staff/Staff", "PrimeBoWeapon", "DualInfestedAxesWeapon", "Fist/Fist", "FuraxWraith", "LongSword/LongSword", "SkanaPrime", "PrismaSkana", "PaladinMaceWeapon", "NLMagistar", ...WEAPON_FIVE_EVOLUTION];
const WEAPON_INCARNON_FILTER = ["Incarnon", "Spectral"];
const WEAPON_SKIN_INCLUDE_END= ["WinterSolstice/SolsticeAcceltraSkin", "PvP/Melee/PvPAckBrunt", "Promo/Twitch/Twitch2021AfurisSkin", "Promo/Twitch/AkjagaraIridosSkin", "PvP/Pistols/PvPAklato", "PvP/Pistols/PvPAkLex", "Koumei/KoumeiWarfanSkin", "PvP/Pistols/PvPAkstiletto", "PvP/Pistols/PvPAkvasto", "EliteAlerts/EliteAlertAmprex", "PvP/Pistols/PvPAngstrum", "Promo/Twitch/TwitchAnkyros", "VoidTrader/BaroInarosPolearmSkin", "Promo/Seasonal/TennobaumArcaPlasmorSkin", "Halloween/DOTD2025AtomosSkin", "Promo/Seasonal/TennobaumAtomosSkin", "EliteAlerts/EliteAlertAtomos", "Camo/DesertAtteraxSkin", "EliteAlerts/EliteAlertAtterax", "Halloween/HalloweenBasmu", "Weapons/Daggers/AshGeminiDaggerSkin", "Weapons/Throwable/AshGeminiKunaiSkin", "Weapons/LongGuns/AshGeminiVectisSkin", "Weapons/Pistols/GarudaGeminiBallisticaSkin", "Weapons/LongGuns/GarudaGeminiNagantakaSkin", "Weapons/Claws/GarudaGeminiClawsSkin", "VoidTrader/VTBoarExilis", "Promo/Seasonal/TennobaumBoltor", "PvP/LongGuns/PvPBraton", "Promo/Seasonal/TennobaumBrokenWar", "Daybreak/DaybreakBubonicoSkin", "Weapons/LongGuns/SolsticeBurston", "Promo/Seasonal/TennobaumCantare", "Nightwave/DaybreakCedoSkin", "WinterSolstice/SolsticeCorinthSkin", "Necramech/MechWeapon/MechEventCortegeSkin", "Promo/Seasonal/XmasGlaiveSkin", "Promo/Seasonal/TennobaumCycronSkin", "PvP/Bows/PvPDaikyu", "VoidTrader/AshLeverianLiosPistol", "PvP/Melee/PvPDragonNikana", "Weapons/UnrealTournament/DrakgoonFlakCannonSkin", "Halloween/HalloweenDread", "Promo/Seasonal/TennobaumDualKeresSkin", "PvP/Melee/PvPDualSkana", "Weapons/DualSword/DualRibbonKamasSkin", "Melee/AxeML/StavikaDualSwordSkin", "DualAxe/DaggerAxe", "Deluxe/CalibanDeluxeBowSkin", "VoidTrader/ElixisLatronPistol", "Scythes/JadelightHate", "ValentinesDay/ValentinesArrow", "Nightwave/InfHeavyClawsSkin", "Dazzle/ShockExergisSkin", "Dazzle/ShockFalcorSkin", "Events/ArchRocketCrossbowGrineer", "Hammer/GrnHammer", "Promo/Seasonal/TennobaumFulminSkin", "PvP/Melee/PvPFurax", "WinterSolstice/SolsticeGalatineSkin", "Promo/Seasonal/Halloween2023DOTDGammacorSkin", "WinterSolstice/WinterSolsticeGammacorSkin", "PvP/Melee/PvPGlaive", "Nightwave/DayBreakGlaiveSkin", "Events/GlaxionPolar", "PvP/LongGuns/PvPGorgon", "SummerSolstice/SummerSolsticeGorgon", "SummerSolstice/SummerSolsticeGrakata", "Halloween/HalloweenGram", "Promo/Seasonal/TennobaumGramSkin", "PvP/LongGuns/PvPGrinlok", "Camo/DesertGrinlokSkin", "WinterSolstice/SolsticeGaundaoSkin", "CephWepSkins/CephGaundaoSkin", "Camo/DesertHekSkin", "Nightwave/CephPolearmSkin", "Halloween/Halloween2024DOTDIgnisSkin", "WinterSolstice/SolsticeIgnisSkin", "SummerSolstice/SummerIgnisSkin", "PvP/Melee/PvPJatKittag", "PvP/LongGuns/PvPKarak", "Camo/DesertKarakSkin", "VoidTrader/BaroArrow", "Yareli/KompressaDaybreakSkin", "PvP/Pistols/PvPKraken", "PvP/Melee/PvPKronen", "Weapons/Tonfa/KronenTwitchSkin", "Weapons/Redeemer/TnSpikeGunbladeSkin", "Events/AcolyteStalkerMios", "PvP/Pistols/PvPLato", "PvP/LongGuns/PvPLatron", "WinterSolstice/WinterSolsticeLatron", "Weapons/Staff/TnRibbonStaffSkin", "WinterSolstice/SolsticeLenzSkin", "PvP/Pistols/PvPLex", "VoidTrader/BaroScytheMacheteSkin", "Daybreak/DaybreakMagistarSkin", "PvP/Pistols/PvPMarelok", "Camo/DesertMarelokSkin", "Necramech/MechWeapon/MechEventMorghaSkin", "PvP/Melee/PvPNikana", "VoidTrader/ElixisNikana", "Hammer/NoodleHammerSkin", "Nightwave/DaybreakNukorSkin", "Promo/Seasonal/TennobaumOcucor", "Promo/Twitch/OgrisTwitchSkin", "Weapons/UnrealTournament/OgrisRocketLauncherSkin", "Halloween/DOTD2025OkinaSkin", "PvP/LongGuns/PvPOpticor", "VoidTrader/ElixisOpticor", "VoidTrader/ElixisBallasSword", "Events/InfQuantaInfestedAladV", "Promo/Warframe/PromoParis", "Promo/Seasonal/TennobaumParis", "Promo/Twitch/TwitchPentaSkin", "Dazzle/ShockPlinxSkin", "VoidTrader/PrismaArrow", "Weapons/DSPistols/LexHammer", "Weapons/Swords/LasriaSkanaSwordSkin", "Weapons/DSPistols/BroncoSpectre", "Weapons/DSPistols/LatoTekna", "Weapons/DSPistols/FurisVekesk", "Promo/Twitch/PyranaTwitchSkin", "CephWepSkins/CephPyranaSkin", "VoidTrader/VTQuanta", "WinterSolstice/SolsticeQuassusSkin", "Weapons/Rapier/CrpRapierSkin", "Weapons/Redeemer/RedeemerRelayWaterSkin", "VoidTrader/VTRedeemerSkin", "Weapons/Redeemer/RedeemerRelayFireSkin", "Leverian/NezhaLeverian/NezhaLeverianPolearm", "Festivities/JingleKnuckles", "CephWepSkins/CephRubicoSkin", "Axe/DaggerAxe", "HeavyAxe/GrnAxe", "Axe/SolsticeScindo", "PvP/Melee/PvPSkana", "WinterSolstice/SolsticeSkiajatiSkin", "Weapons/Rifle/SoaktronRifleSkin", "PvP/LongGuns/PvPSoma", "VoidTrader/ElixisSonicor", "Promo/Seasonal/CandyCaneEtherReaperSkin", "Promo/Seasonal/CandyCaneHateSkin", "Promo/Seasonal/CandyCaneReaperPrimeSkin", "Promo/Seasonal/CandyCaneScytheSkin", "Weapons/UnrealTournament/StahltaShockRifleSkin", "PvP/LongGuns/PvPStrun", "PvP/LongGuns/PvPSybaris", "Melee/Swords/TnShinaiSword/TnShinaiSwordSkin", "WinterSolstice/SolsticeTatsuSkin", "VoidTrader/ElixisTiberon", "VoidTrader/ElixisTigris", "Promo/Twitch/TigrisTwitchSkin", "PvP/Melee/PvPTipedo", "PvP/LongGuns/PvPTonkor", "Camo/DesertTonkorSkin", "Deluxe/ProteaDeluxeGlaiveSkin", "SummerSolstice/SummerSolsticeTwinGrakatas", "PvP/Pistols/PvPTwinVipers", "Nightwave/InfTwoHandedKatanaSkin", "PvP/Pistols/PvPVasto", "Promo/Twitch/TwitchRubicoSkin", "Weapons/Rapier/LasOcelotRapierSkin", "PvP/Pistols/PvPViper", "Events/OgrisOldSchool", "Weapons/Glaives/XorisExilisSkin"];

const NULL = "null";

//

const CATEGORY_MAPPERS = {
  "AirSupport"  : mapAirSupport,   // 7/7
  "Adversary"   : mapAdversary,    // 51 (check if your adversary weapon has 60% valence)
  "Arcade"      : mapArcade,       // 
  "Arcanes"     : mapArcane,       // 168 (64 warframe + 16 primary + 18 secondary + 12 melee + 8 kitgun + 8 zaw + 22 operator + 13 amp + 5 tektolyst
  "Arch-Gun"    : mapArchGun,      // 20/20
  "Arch-Melee"  : mapArchMelee,    // 8/8
  "Archwing"    : mapArchwing,     // 5/5
  "ArtGallery"  : mapArtGallery,   // 15/15
  "Articula"    : mapArticula,     // 
  "Challenge"   : mapChallenge,    // 212/212 
  "Domestik"    : mapDomestik,     // 
  "Emblem"      : mapEmblem,       // 
  "Emote"       : mapEmote,        // 
  "Enemy"       : mapEnemy,        // ?/1368 (is no more updated by WFCD)
  "Ephemera"    : mapEphemera,     // 
  "Archweapon"  : mapArchweapon,   // 
  "Fish"        : mapFish,         // KO
  "Floof"       : mapFloof,        // 
  "FocusSchool" : mapFocusSchool,  // 85/85 (75 + 10 => 15 for each school + 2 waybound for each school)
  "Fragment"    : mapFragment,     // 222/222 (46 cephalon + 20 cetus + 5 gara + 13 ghoul + 35 solaris + 8 partnership + 68 prex + 11 tenet + 10 duviri + 5 albrecht + 1 isleweaver)
  "Framefighter": mapFramefighter, // 48/48
  "Helminth"    : mapHelminth,     // 79/79 (66 frames + 13 metamorphosis)
  "Honoria"     : mapHonoria,      // 169/169 
  "Intrinsic"   : mapIntrinsic,    // 90/90 (50 railjack + 40 drifter)
  "Gear"        : mapGear,         // OK
  "Glyphs"      : mapGlyph,        // KO 956 ingame in "Change Glyph) vs 1672
  "Melee"       : mapMelee,        // 234/234 (223 normal + 11 zaw)
  "Misc"        : mapMisc,         // KO 
  "Mods"        : mapMod,          // 1441/1441 (No flawed mods nor unobtainable ones, but they still might be owned by a few.)
  "Node"        : mapNode,         // 560/580 (a few nodes are missings)
  "Object"      : mapObject,       // ?/?
  "PeelyPix"    : mapPeelyPix,     // 25/25 
  "Pets"        : mapPet,          // 17/17
  "Poster"      : mapPoster,       // 
  "Primary"     : mapPrimary,      // 203/203 (194 normal + 9 amp)
  "Quests"      : mapQuest,        // 45/45 prelude to war ? the new war ?
  "Railjack"    : mapArmament,     // KO
  "Relics"      : mapRelic,        // 772/772 (197 lith + 188 meso + 187 neo + 196 axi + 9 requiem)
  "Resources"   : mapResource,     // KO
  "Scene"       : mapScene,        // 200/200
  "Secondary"   : mapSecondary,    // 152/152 (146 normal + 6 kitgun)
  "Sentinels"   : mapSentinel,     // 48/48 (24 robotics + 24 robotic weapons)
  "Sigils"      : mapSigil,        // KO 240+ ingame in customization vs 331
  "Simulacrum"  : mapSimulacrum,   // 13/13
  "Skins"       : mapSkin,         // KO (holy shit)
  "Somachord"   : mapSomachord,    // 150/150 
  "Signa"       : mapSigna,        // 9/6
  "Sugatra"     : mapSugatra,      // 13/13
  "Sumdali"     : mapSumdali,      // 16/16
  "Syandana"    : mapSyandana,     // 38/38
  "Trophy"      : mapTrophy,       // 101/101
  "Vehicle"     : mapVehicle,      // 13/13 (1 plexus, 2 necramech, 5 k-drive, 5 archwing)
  "Weapon"      : mapWeapon,       // 591/591 => 589 + 2 founder 
  "Warframes"   : mapWarframe      // 117/117 => 116 (66 non prime + 50 prime) + 1 founder
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
  
  const mapper = CATEGORY_MAPPERS[raw.category] || mapTodo;
  return mapper(raw);
}

function getEndoCost(rarity, maxRank) {
  const baseCost = WF.ENDO[rarity.toLowerCase()];
  if (!baseCost || maxRank < 0) return 0;
  return baseCost * (Math.pow(2, maxRank) - 1);
}

//

function mapTodo(raw) {
  return [entry(raw, WF.CATEGORY.TODO.name, NULL, { source_category: raw.type || "unknown" })];
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
  const itemName      = escapeQuotes(raw.uniqueName);
  const displayName   = escapeQuotes(raw.name);
  let   rarityField   = escapeQuotes(raw.rarity) || NULL;
  let   typeField = raw.type ? `${escapeQuotes(raw.type.split(" ")[0])}` : NULL;
  let   level         = raw.levelStats ? raw.levelStats.length - 1 : 0;
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

function mapChallenge(raw) { return [entry(raw, WF.CATEGORY.challenge.name, NULL)]; }

function mapDomestik(raw) {
  let typeField = NULL;

  if(DOMESTIK_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];

       if(raw.uniqueName.endsWith("LisetPropCleaningDroneBeachcomber") || 
          raw.uniqueName.endsWith("DogDays2024LisetPropCleaningDroneBeachcomber")) typeField = WF.TYPES.domestik.dogday;
  else if(raw.uniqueName.endsWith("LisetPropCleaningDroneBaroPink") ||
          raw.uniqueName.endsWith("LisetPropCleaningDroneBaro") ||
          raw.uniqueName.endsWith("LisetPropCleaningDroneBeachcomber") ||
          raw.uniqueName.endsWith("LisetPropCleaningDroneGrineer") ||
          raw.uniqueName.endsWith("LisetPropCleaningDroneDuviri"))                 typeField = WF.TYPES.domestik.baro;
  else if(raw.uniqueName.endsWith("LisetPropCleaningDroneAshGemini") || 
          raw.uniqueName.endsWith("LisetPropCleaningDroneGarudaGemini"))           typeField = WF.TYPES.domestik.hunhow;
  else if(raw.uniqueName.endsWith("LisetPropCleaningDroneTenno"))                  typeField = WF.TYPES.domestik.nightwave;

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
  const typeField   = raw.type ? `${escapeQuotes(raw.type.split(" ")[0])}` : NULL;
  return [entry(raw, WF.CATEGORY.enemy.name, typeField)]; 
}

function mapEphemera(raw) {
  let typeField = WF.TYPES.ephemera.oneoff;

  if(EPHEMERA_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))         return [];

        if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Kuva"))          typeField = WF.TYPES.ephemera.vengeful;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Corpus"))        typeField = WF.TYPES.ephemera.sister;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/InfestedLich"))  typeField = WF.TYPES.ephemera.coda;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Jade"))          typeField = WF.TYPES.ephemera.aspirus;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Ink"))           typeField = WF.TYPES.ephemera.atramentum;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Avatar"))        typeField = WF.TYPES.ephemera.body;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Conquera"))      typeField = WF.TYPES.ephemera.conquera;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Baro"))          typeField = WF.TYPES.ephemera.baro; 
   else if(raw.uniqueName.endsWith("FootstepsEasterEggs"))                           typeField = WF.TYPES.ephemera.easter;// need to be before "step"
   else if(raw.uniqueName.endsWith("FootstepsEidolon") ||
           raw.uniqueName.endsWith("FootstepsMaple"))                                typeField = WF.TYPES.ephemera.oneoff;// need to be before "step"
   else if(raw.uniqueName.endsWith("GarudaBloodEphemera") || 
           raw.uniqueName.endsWith("AshGeminiEphemera"))                             typeField = WF.TYPES.ephemera.constellation;
   else if(raw.uniqueName.endsWith("HydroidDeluxeEphemera") || 
           raw.uniqueName.endsWith("DogDaysEphemera"))                               typeField = WF.TYPES.ephemera.summer;
   else if(raw.uniqueName.endsWith("BatsEphemera") ||
           raw.uniqueName.endsWith("BatWingsEphemera") || 
           raw.uniqueName.endsWith("WebEphemera"))                                   typeField = WF.TYPES.ephemera.halloween;
   else if(raw.uniqueName.endsWith("CupidWingsEphemera"))                            typeField = WF.TYPES.ephemera.valentine;
   else if(raw.uniqueName.endsWith("SnowEphemera"))                                  typeField = WF.TYPES.ephemera.winter;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Archon"))        typeField = WF.TYPES.ephemera.shard;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/Footsteps"))     typeField = WF.TYPES.ephemera.step;
   else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Effects/VoidAngel"))     typeField = WF.TYPES.ephemera.zariman;

  return [entry(raw, WF.CATEGORY.ephemera.name, typeField)]; 
}

function mapArchweapon(raw, type) {
  let xpReward = raw.name.includes("Kuva") ? XP40 : XP30;
  const isVaulted = getIsVaulted(raw);
  let returnValue = [entry(raw, WF.CATEGORY.archweapon.name, type, { mastery_xp: xpReward, ...(isVaulted && { vaulted: isVaulted }) })];
  
  if(raw.tags) {
    // if(raw.tags.includes("Kuva Lich"))  // only 20 out of 21 kuva weapon has this tags so I cant use it, so close to be perfect
    if(raw.uniqueName.startsWith("/Lotus/Weapons/Grineer/") && raw.name.includes("Kuva")) {
        returnValue.push(mapAdversary(raw, WF.TYPES.adversary.kuva));
    }
    // if(raw.tags.includes("Technocyte")) // only  6 out of 14 coda weapon has this tags so I cant use it
    if(raw.uniqueName.startsWith("/Lotus/Weapons/Infested/") && raw.name.includes("Coda")) {
        returnValue.push(mapAdversary(raw, WF.TYPES.adversary.coda));
    }
    if(raw.tags.includes("Tenet")) {
        returnValue.push(mapAdversary(raw, WF.TYPES.adversary.tenet)); // bingo 16/16 mapped
    }
  }

  return returnValue;
}

function mapFish(raw) {
  if(raw.uniqueName.includes("Medium") || raw.uniqueName.includes("Large")) return [];
  if(FISH_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))    return [];
  const type = WF.TYPES.trophy.fish;
  let trophy_fish = WF.TYPES.trophy_fish.poe;
   
  if(raw.uniqueName.includes("/Fish/Solaris/"))      { trophy_fish = WF.TYPES.trophy_fish.ov; }
  else if(raw.uniqueName.includes("/Fish/Deimos/"))  { trophy_fish = WF.TYPES.trophy_fish.cd; }

  let subName = NULL;

  if(raw.uniqueName.includes("GrineerBootItem"))     { trophy_fish = WF.TYPES.trophy_fish.poe; subName = " (Grineer)"; }
  else if(raw.uniqueName.includes("CorpusBootItem")) { trophy_fish = WF.TYPES.trophy_fish.ov;  subName = " (Corpus)"; }
  //else if(raw.uniqueName.includes("OrokinBootItem")) { trophy_fish = WF.TYPES.trophy_fish.cd;  subName = " (Orokin)"; } // trophy does not exist, why ?
  
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
  return [entry(raw, WF.CATEGORY.glyph.name, NULL)]; // There aren't enough fields in the dataset to add TYPES.
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
  if(raw.uniqueName.startsWith("/Lotus/Upgrades/Focus") ||raw.uniqueName.startsWith("/Lotus/Upgrades/Mods/Sets/")) return mapFocusSchool(raw);
  
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
    else if(subType.includes("Posture") || subType.includes("Stance"))      subType = [WF.TYPES.mod_category.stance];
    else
    {
      if(MOD_BEASTS_INC.some(element => compatLower.includes(element))) {
        if(raw.uniqueName.endsWith("KubrowMechaOverdriveMod") || raw.uniqueName.endsWith("CatbrowSwipePrecept")) // I need to find a more elegant way :/
          subType = [WF.TYPES.mod_category.melee];
        else
          subType = [WF.TYPES.mod_category.beast];
      }
           if(MOD_ROBOTS_INC.some(element => compatLower.includes(element)))   subType = [WF.TYPES.mod_category.robotic];
      else if(MOD_VEHICLES_INC.some(element => compatLower.includes(element))) subType = [WF.TYPES.mod_category.vehicle];
      else if(raw.compatName.startsWith("Parazon"))   subType = [WF.TYPES.mod_category.parazon];
      else if(raw.compatName.startsWith("COMPANION")) subType = [WF.TYPES.mod_category.beast, WF.TYPES.mod_category.robotic];
      else if(raw.compatName.startsWith("Archmelee")) subType = [WF.TYPES.mod_category.archmelee];
      else if(raw.compatName.startsWith("Archgun"))   subType = [WF.TYPES.mod_category.archgun];
      else if(raw.compatName.startsWith("AURA"))      subType.push(WF.TYPES.mod_category.aura);
      else if(raw.uniqueName.includes("/Randomized/"))
      {
             if(raw.compatName.includes("Companion"))         subType = [WF.TYPES.mod_category.beast, WF.TYPES.mod_category.robotic]; // I'm note sure, also "robotic" and "beast" codex tab does not contain any riven but are shown in "all"
        else if(subType.includes("Zaw"))                     subType = [WF.TYPES.mod_category.melee];
        else if(subType.includes("Kitgun"))                  subType = [WF.TYPES.mod_category.secondary];
        else if(raw.compatName.includes("Rifle"))             subType = [WF.TYPES.mod_category.primary];
        else if(raw.compatName.includes("Shotgun"))           subType = [WF.TYPES.mod_category.primary];
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
      if(raw.uniqueName.endsWith("AuraMod"))        subType = [WF.TYPES.mod_category.exilus, WF.TYPES.mod_category.tome];
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

  returnValue.push(entry(raw  , WF.CATEGORY.node.name, system, { node_solar: planetField, node_difficulty: WF.TYPES.node_difficulty.normal, ...(xpReward && { mastery_xp: xpReward }) }));
  returnValue.push(entry(spRaw, WF.CATEGORY.node.name, system, { node_solar: planetField, node_difficulty: WF.TYPES.node_difficulty.steel, ...(xpReward && { mastery_xp: xpReward }) }));

  return returnValue;
}

function mapObject(raw) { 
  const typeField   = raw.type ? `${escapeQuotes(raw.type.split(" ")[0])}` : NULL;
  return [entry(raw, WF.CATEGORY.object.name, typeField)]; 
}

function mapPeelyPix(raw) { 
  let typeField = raw.type ? [`${escapeQuotes(raw.type.split(" ")[0])}`] : [NULL];
  return [entry(raw, WF.CATEGORY.peelypix.name, typeField)];
}

function mapPet(raw) {
  let category = NULL;
  let type     = NULL;
  let rank     = getIsPrime(raw);
  
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
      case WF.TYPES.companion_category.moa        : type = WF.TYPES.companion.robotic; break;
      case WF.TYPES.companion_category.hound      : type = WF.TYPES.companion.robotic; break;
      case WF.TYPES.companion_category.kubrow     : type = WF.TYPES.companion.beast;   break;
      case WF.TYPES.companion_category.kavat      : type = WF.TYPES.companion.beast;   break;
      case WF.TYPES.companion_category.predasite  : type = WF.TYPES.companion.deimos;  break;
      case WF.TYPES.companion_category.vulpaphyla : type = WF.TYPES.companion.deimos;  break;
      default: return [];
    }
  }
  return [entry(raw, WF.CATEGORY.companion.name, type, { companion_category: category, rank: rank, mastery_xp: XP60 })];
}

function mapPoster(raw) {
  if(POSTER_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
  let typeField = WF.TYPES.poster.other;
       if(raw.uniqueName.includes("NokkoMushroomScrawlPoster")) typeField = WF.TYPES.poster.deepmines;
  else if(raw.uniqueName.includes("ShipDecos/Nokko"))           typeField = WF.TYPES.poster.nightcap;
  else if(raw.uniqueName.includes("ChildDrawing"))              typeField = WF.TYPES.poster.neewa;
  else if(raw.uniqueName.includes("ZarimanApartment"))          typeField = WF.TYPES.poster.zariman;
  else if(raw.uniqueName.includes("ShipDecos/Focus"))           typeField = WF.TYPES.poster.focus;
  else if(raw.uniqueName.includes("ShipDecos/Nightwave1999"))   typeField = WF.TYPES.poster.fable;
  else if(raw.uniqueName.includes("ShipDecos/JS2M"))            typeField = WF.TYPES.poster.hunhow;
  else if(raw.uniqueName.endsWith("YareliComicCoverPoster") || 
          raw.uniqueName.endsWith("DogDays2025Poster"))         typeField = WF.TYPES.poster.dogday;
  else if(raw.uniqueName.endsWith("WyrmiusPoster") || 
          raw.uniqueName.endsWith("DogDays2025Poster"))         typeField = WF.TYPES.poster.dogday;
  else if(raw.uniqueName.endsWith("FrameFighterPoster") || 
          raw.uniqueName.endsWith("FlappyZephyrPoster") || 
          raw.uniqueName.endsWith("OlliesCrashCoursePoster") || 
          raw.uniqueName.endsWith("WyrmiusPoster"))             typeField = WF.TYPES.poster.minigame;
  else if(raw.name.includes("On-Lyne"))                         typeField = WF.TYPES.poster.coda;
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
  const indexTier = foundIndex === -1 ? 0 : 1; // old method => 0 : foundIndex + 1;
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
  //const match = Object.entries(WF.TYPES.scene).find(([key, value]) => raw.name.includes(value));
  //const typeField = match ? match[0] : WF.TYPES.scene.other;
  return [entry(raw, WF.CATEGORY.scene.name, NULL)]
}

function mapSecondary(raw) {
  return mapWeapon(raw, WF.TYPES.weapon.secondary, NULL);
}

function mapSentinel(raw, category, xpReward) {
  const rank      = getIsPrime(raw);
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

// Skin Mapping
function mapSkin(raw) {
  if(SKIN_EXCLUDE_SW.some(element => raw.uniqueName.startsWith(element)))       return [];
  if(SKIN_EXCLUDE_INC.some(element => raw.uniqueName.includes(element)))        return [];
  if(SKIN_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))        return [];
  if(WEAPON_SKIN_INCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return mapSkinWeapon(raw);
  
  let typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
  let skin_category = NULL;
  
  if(raw.uniqueName.includes("TextureOverrides")) return[]; // TODO
  
       if(typeField === "Themes")           return [];
  else if(typeField === "Theme Background") return [];
  else if(typeField === "Theme Sound")      return [];
  else if(typeField === "Note Packs")       return [];
  else if(typeField === "Misc")             return [];
  else if(raw.name.endsWith("Pattern") ||
          typeField === "Fur Pattern")      return mapPetCosmetic(raw, WF.TYPES.pet_cosmetic_type.fur_pattern);
  else if(typeField === "Fur Color")        return mapPetCosmetic(raw, WF.TYPES.pet_cosmetic_type.fur_color);
  else if(typeField === "Color Palette")    return mapSkinColor(raw);
  else if(typeField === "Emotes")           return mapEmote(raw);
  let conclaveItem = raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/PvP") || raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Armor/LunaroSet");
  
       if(raw.uniqueName.includes("ShipDecos/TarotCard"))                             return mapFragment(raw, WF.TYPES.fragment.prex);
  else if(raw.uniqueName.includes("ShipDecos/CorpusGreed"))                           return mapFragment(raw, WF.TYPES.fragment.tenet);
  else if(raw.uniqueName.includes("HoodOrnament"))                                    return mapSumdali(raw);
  else if(raw.uniqueName.includes("MeleeDangles"))                                    return mapSugatra(raw);
  else if(raw.uniqueName.endsWith("Syandana") || 
          raw.uniqueName.endsWith("Cape") || 
          raw.uniqueName.includes("/Scarves/"))                                       return mapSyandana(raw);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/Titles"))                     return []; // don't put this in GLOBAL_EXCLUDE_INC
  else if(raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Clan") ||
          raw.name.endsWith("Emblem"))                                                return mapEmblem(raw);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/Vignettes"))        return mapArticula(raw);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/MasteryTrophies/")) return mapTrophy(raw, WF.TYPES.trophy.mastery);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/PlanetTrophies/"))  return mapTrophy(raw, WF.TYPES.trophy.planet);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/Focus/") || 
          raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/NokkoMushroomScrawlPoster") || 
          raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/ChildDrawing"))     return mapPoster(raw);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/ShipDecos/Operator/"))        return mapGlyph(raw);
  else if(raw.uniqueName.startsWith("/Lotus/Types/Items/Arcade/"))                    return mapArcade(raw);
  else if(raw.uniqueName.includes("TauRankMedal/TauRankMedal"))                       return mapSkinChest(raw, WF.TYPES.chest.insign);
  else if(raw.name.includes("Poster"))                                                return mapPoster(raw);
  else if(raw.name.includes("Floof"))                                                 return mapFloof(raw);
  else if(raw.name.includes("Ephemera"))                                              return mapEphemera(raw);
  else if(raw.name.includes("Drone"))                                                 return mapDomestik(raw);
  else if(raw.name.includes("Signa"))                                                 return mapSigna(raw);
  
  if(typeField === "Ship Decoration") return mapShipDecoration(raw);
  if(raw.uniqueName.includes("Kubrows/Collars")) return mapPetCosmetic(raw, WF.TYPES.pet_cosmetic_type.collar);
  
       if(raw.name.endsWith("Animation Set")) typeField = WF.TYPES.skin.animation;
  else if(raw.name.endsWith("Helmet"))        return mapSkinHelmet(raw);
  else if(raw.name.endsWith("Wings"))         typeField = WF.TYPES.skin.wing;
  else if(raw.name.endsWith("Mask"))          typeField = WF.TYPES.skin.mask;
  else if(raw.name.endsWith("Tail"))          typeField = WF.TYPES.skin.tail;
  else if(raw.name.endsWith("Plate"))         typeField = WF.TYPES.skin.plate;
  else if(raw.name.endsWith("Plates"))        typeField = WF.TYPES.skin.plate;
  else if(raw.name.endsWith("Guard"))         typeField = WF.TYPES.skin.guard;
  else if(raw.name.endsWith("Guards"))        typeField = WF.TYPES.skin.guard;
  else if(raw.name.endsWith("Skin"))          typeField = WF.TYPES.skin.skin;
  else if(raw.name.endsWith("Armor")) { 
         if(raw.uniqueName.includes("Kubrows"))    return mapPetCosmetic(raw, WF.TYPES.pet_cosmetic_type.armor);
    else if(raw.uniqueName.includes("Catbrows"))   return mapPetCosmetic(raw, WF.TYPES.pet_cosmetic_type.armor);
    typeField = WF.TYPES.skin.armor;
  }
  else if(raw.name.endsWith("Holster"))       typeField = WF.TYPES.skin.holster;
  else if(raw.name.endsWith("Sleeves"))       typeField = WF.TYPES.skin.sleeve;
  else if(raw.name.endsWith("Leggings"))      typeField = WF.TYPES.skin.legging;
  else if(raw.name.endsWith("Hood"))          typeField = WF.TYPES.skin.hood;
  else if(raw.name.endsWith("Ink"))           typeField = WF.TYPES.skin.ink;
  else if(raw.name.endsWith("Oculus"))        typeField = WF.TYPES.skin.oculus;
  else if(raw.name.endsWith("Pauldrons"))     typeField = WF.TYPES.skin.pauldron;
  else if(raw.name.endsWith("Pauldron"))      typeField = WF.TYPES.skin.pauldron;
  else if(raw.name.endsWith("Suit"))          typeField = WF.TYPES.skin.suit;
  else if(raw.name.endsWith("Greaves"))       typeField = WF.TYPES.skin.greaves;
  
  return [entry(raw, WF.CATEGORY.skin.name, typeField, { ...(conclaveItem && { conclave: conclaveItem }) })];
}

function mapSkinChest(raw, type) {
  switch (type) {
    case WF.TYPES.chest.insign:
      let words = raw.name.split(" ");
      words[1] = words[1].toUpperCase();
      raw.name = words.join(" ");
      break;
  }

  return [entry(raw, WF.CATEGORY.chest.name, type)];
}

function mapSkinColor(raw) {
  if(COLOR_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
  return [entry(raw, WF.CATEGORY.color_palette.name, NULL)];
}

function mapShipDecoration(raw) {
  return [entry(raw, WF.CATEGORY.ship_decoration.name, NULL)];
}

function mapPetCosmetic(raw, subType) {
  let type = raw.uniqueName.includes("Kubrow") ? WF.TYPES.pet_cosmetic.kubrow : WF.TYPES.pet_cosmetic.kavat;
  
  switch(subType) {
    case WF.TYPES.pet_cosmetic_type.fur_color:
       if(FUR_COLOR_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
       type = [WF.TYPES.pet_cosmetic.kubrow, WF.TYPES.pet_cosmetic.kavat]; // each one can use the fur color of each other
    break;
    case WF.TYPES.pet_cosmetic_type.fur_pattern:
       if(FUR_PATTERN_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
    break;
    case WF.TYPES.pet_cosmetic_type.armor:
      if(PET_ARMOR_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return[];
    break;
  }
  
  return [entry(raw, WF.CATEGORY.pet_cosmetic.name, type, { ...(subType && { pet_cosmetic_type: subType }) })];
}

function mapSkinHelmet(raw) {
  if(HELMET_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
  return [entry(raw, WF.CATEGORY.skin_helmet.name, NULL)];
}

function mapSkinWeapon(raw) {
  let conclaveItem = raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/PvP") || raw.uniqueName.startsWith("/Lotus/Upgrades/Skins/Armor/LunaroSet");
  return [entry(raw, WF.CATEGORY.skin_weapon.name, NULL, { ...(conclaveItem && { conclave: conclaveItem }) })];
}

function mapSomachord(raw) {
  const typeField = raw.type ? `${escapeQuotes(raw.type)}` : NULL;
  return [entry(raw, WF.CATEGORY.somachord.name, typeField)];
}

function mapSigna(raw) {
  let typeField = NULL;
  if(raw.uniqueName.includes("Deluxe") || raw.uniqueName.includes("Heirloom")) return [];
  if(SIGNA_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element)))          return [];

       if(raw.uniqueName.endsWith("GarudaBloodCrown") ||
          raw.uniqueName.endsWith("ProtoAshCrown"))           typeField = WF.TYPES.signa.hunhow;
  else if(raw.uniqueName.endsWith("KiTeerSignaCrown"))        typeField = WF.TYPES.signa.baro;
  else if(raw.uniqueName.endsWith("OrfeoSignaCrown"))         typeField = WF.TYPES.signa.nightwave;
  else if(raw.uniqueName.endsWith("Dex2026LotusHaloCrown") ||
          raw.uniqueName.endsWith("IsleweaverEventCrownA") ||
          raw.uniqueName.endsWith("IsleweaverEventCrownB") ||
          raw.uniqueName.endsWith("IsleweaverEventCrownC") ||
          raw.uniqueName.endsWith("LaurelHaloCrown"))         typeField = WF.TYPES.signa.event;

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
  if(SYANDANA_EXCLUDE_END.some(element => raw.uniqueName.endsWith(element))) return [];
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
  const rank      = getIsPrime(raw);
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
    }  else if(raw.uniqueName.includes("/MoaPets/MoaPetComponents/")) {
      return mapSentinel(raw, WF.TYPES.companion_category.moa_weapon, XP30);
    }  else if(raw.uniqueName.includes("/Melee/Modular")) { 
      type = WF.TYPES.weapon.melee; 
      category = WF.TYPES.weapon_category.zaw;
    } else if(raw.uniqueName.includes("/InfKitGun/Barrels/") || raw.uniqueName.includes("/SUModularSecondarySet1/Barrel/")) { 
      type = WF.TYPES.weapon.secondary; 
      category = WF.TYPES.weapon_category.kitgun;
    } else if(raw.uniqueName.includes("DrifterPistolPlayerWeapon")) { 
      type = WF.TYPES.weapon.primary; 
      category = WF.TYPES.weapon_category.amp;
    } else  { 
      category = WF.TYPES.weapon_category.normal;
    }
  }
  
  if(raw.tags)
  {
    let typeField = NULL;

    // if(raw.tags.includes("Kuva Lich"))  // only 20 out of 21 kuva weapon has this tags so I cant use it, so close to be perfect
    //if(raw.tags.some(tag => tag.toLowerCase().includes(WF.TYPES.adversary.kuva))) typeField = WF.TYPES.adversary.kuva;
    if(raw.uniqueName.startsWith("/Lotus/Weapons/Grineer/") && raw.name.toLowerCase().includes(WF.TYPES.adversary.kuva))  typeField = WF.TYPES.adversary.kuva;

    // bingo 16 out 16 mapped
    if(raw.tags.some(tag => tag.toLowerCase().includes(WF.TYPES.adversary.tenet)))                                        typeField = WF.TYPES.adversary.tenet;

    // if(raw.tags.includes("Technocyte"))  // only  6 out of 14 coda weapon has this tags so I cant use it
    //if(raw.tags.some(tag => tag.toLowerCase().includes(WF.TYPES.adversary.coda))) typeField = WF.TYPES.adversary.coda;
    if(raw.uniqueName.startsWith("/Lotus/Weapons/Infested/") && raw.name.toLowerCase().includes(WF.TYPES.adversary.coda)) typeField = WF.TYPES.adversary.coda;

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
      const incarnonCap  = isFiveEvolution ? " (5/5)" : " (4/4)";
      const incarnonBase = isFiveEvolution ? " (0/5)" : " (0/4)";
      const rankMax  = { ...raw, uniqueName: `${raw.uniqueName}Incarnon`    , name: `${raw.name}${incarnonCap}` };
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
  
  const rank      = getIsPrime(raw);
  const isFounder = getIsFounder(raw.uniqueName);
  const isVaulted = getIsVaulted(raw);
  
  returnValue.push(entry(raw, WF.CATEGORY.warframe.name, productCategory, { rank: rank, mastery_xp: XP60, ...(isFounder && { founder: isFounder }), ...(isVaulted && { vaulted: isVaulted }) }));
  
  return returnValue;
}

//

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
  const isHidden   = getIsCodexHidden(raw);
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
