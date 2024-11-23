import { Type } from './type.js';

export var MOVE_CATEGORY;
(function (MOVE_CATEGORY) {
	MOVE_CATEGORY[MOVE_CATEGORY["PHYSICAL"] = 0] = "PHYSICAL";
	MOVE_CATEGORY[MOVE_CATEGORY["SPECIAL"] = 1] = "SPECIAL";
	MOVE_CATEGORY[MOVE_CATEGORY["STATUS"] = 2] = "STATUS";
})(MOVE_CATEGORY || (MOVE_CATEGORY = {}));

export default class Move {
	constructor(id, name, type, category, power, accuracy, pp, tm, effect, chance, generation) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.category = category;
		this.power = power;
		this.accuracy = accuracy;
		this.pp = pp;
		this.tm = tm;
		this.effect = effect;
		this.chance = chance;
		this.generation = generation;
	}
}
export var Moves;
(function (Moves) {
	Moves[Moves["POUND"] = 1] = "POUND";
	Moves[Moves["KARATE_CHOP"] = 2] = "KARATE_CHOP";
	Moves[Moves["DOUBLE_SLAP"] = 3] = "DOUBLE_SLAP";
	Moves[Moves["COMET_PUNCH"] = 4] = "COMET_PUNCH";
	Moves[Moves["MEGA_PUNCH"] = 5] = "MEGA_PUNCH";
	Moves[Moves["PAY_DAY"] = 6] = "PAY_DAY";
	Moves[Moves["FIRE_PUNCH"] = 7] = "FIRE_PUNCH";
	Moves[Moves["ICE_PUNCH"] = 8] = "ICE_PUNCH";
	Moves[Moves["THUNDER_PUNCH"] = 9] = "THUNDER_PUNCH";
	Moves[Moves["SCRATCH"] = 10] = "SCRATCH";
	Moves[Moves["VISE_GRIP"] = 11] = "VISE_GRIP";
	Moves[Moves["GUILLOTINE"] = 12] = "GUILLOTINE";
	Moves[Moves["RAZOR_WIND"] = 13] = "RAZOR_WIND";
	Moves[Moves["SWORDS_DANCE"] = 14] = "SWORDS_DANCE";
	Moves[Moves["CUT"] = 15] = "CUT";
	Moves[Moves["GUST"] = 16] = "GUST";
	Moves[Moves["WING_ATTACK"] = 17] = "WING_ATTACK";
	Moves[Moves["WHIRLWIND"] = 18] = "WHIRLWIND";
	Moves[Moves["FLY"] = 19] = "FLY";
	Moves[Moves["BIND"] = 20] = "BIND";
	Moves[Moves["SLAM"] = 21] = "SLAM";
	Moves[Moves["VINE_WHIP"] = 22] = "VINE_WHIP";
	Moves[Moves["STOMP"] = 23] = "STOMP";
	Moves[Moves["DOUBLE_KICK"] = 24] = "DOUBLE_KICK";
	Moves[Moves["MEGA_KICK"] = 25] = "MEGA_KICK";
	Moves[Moves["JUMP_KICK"] = 26] = "JUMP_KICK";
	Moves[Moves["ROLLING_KICK"] = 27] = "ROLLING_KICK";
	Moves[Moves["SAND_ATTACK"] = 28] = "SAND_ATTACK";
	Moves[Moves["HEADBUTT"] = 29] = "HEADBUTT";
	Moves[Moves["HORN_ATTACK"] = 30] = "HORN_ATTACK";
	Moves[Moves["FURY_ATTACK"] = 31] = "FURY_ATTACK";
	Moves[Moves["HORN_DRILL"] = 32] = "HORN_DRILL";
	Moves[Moves["TACKLE"] = 33] = "TACKLE";
	Moves[Moves["BODY_SLAM"] = 34] = "BODY_SLAM";
	Moves[Moves["WRAP"] = 35] = "WRAP";
	Moves[Moves["TAKE_DOWN"] = 36] = "TAKE_DOWN";
	Moves[Moves["THRASH"] = 37] = "THRASH";
	Moves[Moves["DOUBLE_EDGE"] = 38] = "DOUBLE_EDGE";
	Moves[Moves["TAIL_WHIP"] = 39] = "TAIL_WHIP";
	Moves[Moves["POISON_STING"] = 40] = "POISON_STING";
	Moves[Moves["TWINEEDLE"] = 41] = "TWINEEDLE";
	Moves[Moves["PIN_MISSILE"] = 42] = "PIN_MISSILE";
	Moves[Moves["LEER"] = 43] = "LEER";
	Moves[Moves["BITE"] = 44] = "BITE";
	Moves[Moves["GROWL"] = 45] = "GROWL";
	Moves[Moves["ROAR"] = 46] = "ROAR";
	Moves[Moves["SING"] = 47] = "SING";
	Moves[Moves["SUPERSONIC"] = 48] = "SUPERSONIC";
	Moves[Moves["SONIC_BOOM"] = 49] = "SONIC_BOOM";
	Moves[Moves["DISABLE"] = 50] = "DISABLE";
	Moves[Moves["ACID"] = 51] = "ACID";
	Moves[Moves["EMBER"] = 52] = "EMBER";
	Moves[Moves["FLAMETHROWER"] = 53] = "FLAMETHROWER";
	Moves[Moves["MIST"] = 54] = "MIST";
	Moves[Moves["WATER_GUN"] = 55] = "WATER_GUN";
	Moves[Moves["HYDRO_PUMP"] = 56] = "HYDRO_PUMP";
	Moves[Moves["SURF"] = 57] = "SURF";
	Moves[Moves["ICE_BEAM"] = 58] = "ICE_BEAM";
	Moves[Moves["BLIZZARD"] = 59] = "BLIZZARD";
	Moves[Moves["PSYBEAM"] = 60] = "PSYBEAM";
	Moves[Moves["BUBBLE_BEAM"] = 61] = "BUBBLE_BEAM";
	Moves[Moves["AURORA_BEAM"] = 62] = "AURORA_BEAM";
	Moves[Moves["HYPER_BEAM"] = 63] = "HYPER_BEAM";
	Moves[Moves["PECK"] = 64] = "PECK";
	Moves[Moves["DRILL_PECK"] = 65] = "DRILL_PECK";
	Moves[Moves["SUBMISSION"] = 66] = "SUBMISSION";
	Moves[Moves["LOW_KICK"] = 67] = "LOW_KICK";
	Moves[Moves["COUNTER"] = 68] = "COUNTER";
	Moves[Moves["SEISMIC_TOSS"] = 69] = "SEISMIC_TOSS";
	Moves[Moves["STRENGTH"] = 70] = "STRENGTH";
	Moves[Moves["ABSORB"] = 71] = "ABSORB";
	Moves[Moves["MEGA_DRAIN"] = 72] = "MEGA_DRAIN";
	Moves[Moves["LEECH_SEED"] = 73] = "LEECH_SEED";
	Moves[Moves["GROWTH"] = 74] = "GROWTH";
	Moves[Moves["RAZOR_LEAF"] = 75] = "RAZOR_LEAF";
	Moves[Moves["SOLAR_BEAM"] = 76] = "SOLAR_BEAM";
	Moves[Moves["POISON_POWDER"] = 77] = "POISON_POWDER";
	Moves[Moves["STUN_SPORE"] = 78] = "STUN_SPORE";
	Moves[Moves["SLEEP_POWDER"] = 79] = "SLEEP_POWDER";
	Moves[Moves["PETAL_DANCE"] = 80] = "PETAL_DANCE";
	Moves[Moves["STRING_SHOT"] = 81] = "STRING_SHOT";
	Moves[Moves["DRAGON_RAGE"] = 82] = "DRAGON_RAGE";
	Moves[Moves["FIRE_SPIN"] = 83] = "FIRE_SPIN";
	Moves[Moves["THUNDER_SHOCK"] = 84] = "THUNDER_SHOCK";
	Moves[Moves["THUNDERBOLT"] = 85] = "THUNDERBOLT";
	Moves[Moves["THUNDER_WAVE"] = 86] = "THUNDER_WAVE";
	Moves[Moves["THUNDER"] = 87] = "THUNDER";
	Moves[Moves["ROCK_THROW"] = 88] = "ROCK_THROW";
	Moves[Moves["EARTHQUAKE"] = 89] = "EARTHQUAKE";
	Moves[Moves["FISSURE"] = 90] = "FISSURE";
	Moves[Moves["DIG"] = 91] = "DIG";
	Moves[Moves["TOXIC"] = 92] = "TOXIC";
	Moves[Moves["CONFUSION"] = 93] = "CONFUSION";
	Moves[Moves["PSYCHIC"] = 94] = "PSYCHIC";
	Moves[Moves["HYPNOSIS"] = 95] = "HYPNOSIS";
	Moves[Moves["MEDITATE"] = 96] = "MEDITATE";
	Moves[Moves["AGILITY"] = 97] = "AGILITY";
	Moves[Moves["QUICK_ATTACK"] = 98] = "QUICK_ATTACK";
	Moves[Moves["RAGE"] = 99] = "RAGE";
	Moves[Moves["TELEPORT"] = 100] = "TELEPORT";
	Moves[Moves["NIGHT_SHADE"] = 101] = "NIGHT_SHADE";
	Moves[Moves["MIMIC"] = 102] = "MIMIC";
	Moves[Moves["SCREECH"] = 103] = "SCREECH";
	Moves[Moves["DOUBLE_TEAM"] = 104] = "DOUBLE_TEAM";
	Moves[Moves["RECOVER"] = 105] = "RECOVER";
	Moves[Moves["HARDEN"] = 106] = "HARDEN";
	Moves[Moves["MINIMIZE"] = 107] = "MINIMIZE";
	Moves[Moves["SMOKESCREEN"] = 108] = "SMOKESCREEN";
	Moves[Moves["CONFUSE_RAY"] = 109] = "CONFUSE_RAY";
	Moves[Moves["WITHDRAW"] = 110] = "WITHDRAW";
	Moves[Moves["DEFENSE_CURL"] = 111] = "DEFENSE_CURL";
	Moves[Moves["BARRIER"] = 112] = "BARRIER";
	Moves[Moves["LIGHT_SCREEN"] = 113] = "LIGHT_SCREEN";
	Moves[Moves["HAZE"] = 114] = "HAZE";
	Moves[Moves["REFLECT"] = 115] = "REFLECT";
	Moves[Moves["FOCUS_ENERGY"] = 116] = "FOCUS_ENERGY";
	Moves[Moves["BIDE"] = 117] = "BIDE";
	Moves[Moves["METRONOME"] = 118] = "METRONOME";
	Moves[Moves["MIRROR_MOVE"] = 119] = "MIRROR_MOVE";
	Moves[Moves["SELF_DESTRUCT"] = 120] = "SELF_DESTRUCT";
	Moves[Moves["EGG_BOMB"] = 121] = "EGG_BOMB";
	Moves[Moves["LICK"] = 122] = "LICK";
	Moves[Moves["SMOG"] = 123] = "SMOG";
	Moves[Moves["SLUDGE"] = 124] = "SLUDGE";
	Moves[Moves["BONE_CLUB"] = 125] = "BONE_CLUB";
	Moves[Moves["FIRE_BLAST"] = 126] = "FIRE_BLAST";
	Moves[Moves["WATERFALL"] = 127] = "WATERFALL";
	Moves[Moves["CLAMP"] = 128] = "CLAMP";
	Moves[Moves["SWIFT"] = 129] = "SWIFT";
	Moves[Moves["SKULL_BASH"] = 130] = "SKULL_BASH";
	Moves[Moves["SPIKE_CANNON"] = 131] = "SPIKE_CANNON";
	Moves[Moves["CONSTRICT"] = 132] = "CONSTRICT";
	Moves[Moves["AMNESIA"] = 133] = "AMNESIA";
	Moves[Moves["KINESIS"] = 134] = "KINESIS";
	Moves[Moves["SOFT_BOILED"] = 135] = "SOFT_BOILED";
	Moves[Moves["HIGH_JUMP_KICK"] = 136] = "HIGH_JUMP_KICK";
	Moves[Moves["GLARE"] = 137] = "GLARE";
	Moves[Moves["DREAM_EATER"] = 138] = "DREAM_EATER";
	Moves[Moves["POISON_GAS"] = 139] = "POISON_GAS";
	Moves[Moves["BARRAGE"] = 140] = "BARRAGE";
	Moves[Moves["LEECH_LIFE"] = 141] = "LEECH_LIFE";
	Moves[Moves["LOVELY_KISS"] = 142] = "LOVELY_KISS";
	Moves[Moves["SKY_ATTACK"] = 143] = "SKY_ATTACK";
	Moves[Moves["TRANSFORM"] = 144] = "TRANSFORM";
	Moves[Moves["BUBBLE"] = 145] = "BUBBLE";
	Moves[Moves["DIZZY_PUNCH"] = 146] = "DIZZY_PUNCH";
	Moves[Moves["SPORE"] = 147] = "SPORE";
	Moves[Moves["FLASH"] = 148] = "FLASH";
	Moves[Moves["PSYWAVE"] = 149] = "PSYWAVE";
	Moves[Moves["SPLASH"] = 150] = "SPLASH";
	Moves[Moves["ACID_ARMOR"] = 151] = "ACID_ARMOR";
	Moves[Moves["CRABHAMMER"] = 152] = "CRABHAMMER";
	Moves[Moves["EXPLOSION"] = 153] = "EXPLOSION";
	Moves[Moves["FURY_SWIPES"] = 154] = "FURY_SWIPES";
	Moves[Moves["BONEMERANG"] = 155] = "BONEMERANG";
	Moves[Moves["REST"] = 156] = "REST";
	Moves[Moves["ROCK_SLIDE"] = 157] = "ROCK_SLIDE";
	Moves[Moves["HYPER_FANG"] = 158] = "HYPER_FANG";
	Moves[Moves["SHARPEN"] = 159] = "SHARPEN";
	Moves[Moves["CONVERSION"] = 160] = "CONVERSION";
	Moves[Moves["TRI_ATTACK"] = 161] = "TRI_ATTACK";
	Moves[Moves["SUPER_FANG"] = 162] = "SUPER_FANG";
	Moves[Moves["SLASH"] = 163] = "SLASH";
	Moves[Moves["SUBSTITUTE"] = 164] = "SUBSTITUTE";
	Moves[Moves["STRUGGLE"] = 165] = "STRUGGLE";
	Moves[Moves["SKETCH"] = 166] = "SKETCH";
	Moves[Moves["TRIPLE_KICK"] = 167] = "TRIPLE_KICK";
	Moves[Moves["THIEF"] = 168] = "THIEF";
	Moves[Moves["SPIDER_WEB"] = 169] = "SPIDER_WEB";
	Moves[Moves["MIND_READER"] = 170] = "MIND_READER";
	Moves[Moves["NIGHTMARE"] = 171] = "NIGHTMARE";
	Moves[Moves["FLAME_WHEEL"] = 172] = "FLAME_WHEEL";
	Moves[Moves["SNORE"] = 173] = "SNORE";
	Moves[Moves["CURSE"] = 174] = "CURSE";
	Moves[Moves["FLAIL"] = 175] = "FLAIL";
	Moves[Moves["CONVERSION_2"] = 176] = "CONVERSION_2";
	Moves[Moves["AEROBLAST"] = 177] = "AEROBLAST";
	Moves[Moves["COTTON_SPORE"] = 178] = "COTTON_SPORE";
	Moves[Moves["REVERSAL"] = 179] = "REVERSAL";
	Moves[Moves["SPITE"] = 180] = "SPITE";
	Moves[Moves["POWDER_SNOW"] = 181] = "POWDER_SNOW";
	Moves[Moves["PROTECT"] = 182] = "PROTECT";
	Moves[Moves["MACH_PUNCH"] = 183] = "MACH_PUNCH";
	Moves[Moves["SCARY_FACE"] = 184] = "SCARY_FACE";
	Moves[Moves["FAINT_ATTACK"] = 185] = "FAINT_ATTACK";
	Moves[Moves["SWEET_KISS"] = 186] = "SWEET_KISS";
	Moves[Moves["BELLY_DRUM"] = 187] = "BELLY_DRUM";
	Moves[Moves["SLUDGE_BOMB"] = 188] = "SLUDGE_BOMB";
	Moves[Moves["MUD_SLAP"] = 189] = "MUD_SLAP";
	Moves[Moves["OCTAZOOKA"] = 190] = "OCTAZOOKA";
	Moves[Moves["SPIKES"] = 191] = "SPIKES";
	Moves[Moves["ZAP_CANNON"] = 192] = "ZAP_CANNON";
	Moves[Moves["FORESIGHT"] = 193] = "FORESIGHT";
	Moves[Moves["DESTINY_BOND"] = 194] = "DESTINY_BOND";
	Moves[Moves["PERISH_SONG"] = 195] = "PERISH_SONG";
	Moves[Moves["ICY_WIND"] = 196] = "ICY_WIND";
	Moves[Moves["DETECT"] = 197] = "DETECT";
	Moves[Moves["BONE_RUSH"] = 198] = "BONE_RUSH";
	Moves[Moves["LOCK_ON"] = 199] = "LOCK_ON";
	Moves[Moves["OUTRAGE"] = 200] = "OUTRAGE";
	Moves[Moves["SANDSTORM"] = 201] = "SANDSTORM";
	Moves[Moves["GIGA_DRAIN"] = 202] = "GIGA_DRAIN";
	Moves[Moves["ENDURE"] = 203] = "ENDURE";
	Moves[Moves["CHARM"] = 204] = "CHARM";
	Moves[Moves["ROLLOUT"] = 205] = "ROLLOUT";
	Moves[Moves["FALSE_SWIPE"] = 206] = "FALSE_SWIPE";
	Moves[Moves["SWAGGER"] = 207] = "SWAGGER";
	Moves[Moves["MILK_DRINK"] = 208] = "MILK_DRINK";
	Moves[Moves["SPARK"] = 209] = "SPARK";
	Moves[Moves["FURY_CUTTER"] = 210] = "FURY_CUTTER";
	Moves[Moves["STEEL_WING"] = 211] = "STEEL_WING";
	Moves[Moves["MEAN_LOOK"] = 212] = "MEAN_LOOK";
	Moves[Moves["ATTRACT"] = 213] = "ATTRACT";
	Moves[Moves["SLEEP_TALK"] = 214] = "SLEEP_TALK";
	Moves[Moves["HEAL_BELL"] = 215] = "HEAL_BELL";
	Moves[Moves["RETURN"] = 216] = "RETURN";
	Moves[Moves["PRESENT"] = 217] = "PRESENT";
	Moves[Moves["FRUSTRATION"] = 218] = "FRUSTRATION";
	Moves[Moves["SAFEGUARD"] = 219] = "SAFEGUARD";
	Moves[Moves["PAIN_SPLIT"] = 220] = "PAIN_SPLIT";
	Moves[Moves["SACRED_FIRE"] = 221] = "SACRED_FIRE";
	Moves[Moves["MAGNITUDE"] = 222] = "MAGNITUDE";
	Moves[Moves["DYNAMIC_PUNCH"] = 223] = "DYNAMIC_PUNCH";
	Moves[Moves["MEGAHORN"] = 224] = "MEGAHORN";
	Moves[Moves["DRAGON_BREATH"] = 225] = "DRAGON_BREATH";
	Moves[Moves["BATON_PASS"] = 226] = "BATON_PASS";
	Moves[Moves["ENCORE"] = 227] = "ENCORE";
	Moves[Moves["PURSUIT"] = 228] = "PURSUIT";
	Moves[Moves["RAPID_SPIN"] = 229] = "RAPID_SPIN";
	Moves[Moves["SWEET_SCENT"] = 230] = "SWEET_SCENT";
	Moves[Moves["IRON_TAIL"] = 231] = "IRON_TAIL";
	Moves[Moves["METAL_CLAW"] = 232] = "METAL_CLAW";
	Moves[Moves["VITAL_THROW"] = 233] = "VITAL_THROW";
	Moves[Moves["MORNING_SUN"] = 234] = "MORNING_SUN";
	Moves[Moves["SYNTHESIS"] = 235] = "SYNTHESIS";
	Moves[Moves["MOONLIGHT"] = 236] = "MOONLIGHT";
	Moves[Moves["HIDDEN_POWER"] = 237] = "HIDDEN_POWER";
	Moves[Moves["CROSS_CHOP"] = 238] = "CROSS_CHOP";
	Moves[Moves["TWISTER"] = 239] = "TWISTER";
	Moves[Moves["RAIN_DANCE"] = 240] = "RAIN_DANCE";
	Moves[Moves["SUNNY_DAY"] = 241] = "SUNNY_DAY";
	Moves[Moves["CRUNCH"] = 242] = "CRUNCH";
	Moves[Moves["MIRROR_COAT"] = 243] = "MIRROR_COAT";
	Moves[Moves["PSYCH_UP"] = 244] = "PSYCH_UP";
	Moves[Moves["EXTREME_SPEED"] = 245] = "EXTREME_SPEED";
	Moves[Moves["ANCIENT_POWER"] = 246] = "ANCIENT_POWER";
	Moves[Moves["SHADOW_BALL"] = 247] = "SHADOW_BALL";
	Moves[Moves["FUTURE_SIGHT"] = 248] = "FUTURE_SIGHT";
	Moves[Moves["ROCK_SMASH"] = 249] = "ROCK_SMASH";
	Moves[Moves["WHIRLPOOL"] = 250] = "WHIRLPOOL";
	Moves[Moves["BEAT_UP"] = 251] = "BEAT_UP";
	Moves[Moves["FAKE_OUT"] = 252] = "FAKE_OUT";
	Moves[Moves["UPROAR"] = 253] = "UPROAR";
	Moves[Moves["STOCKPILE"] = 254] = "STOCKPILE";
	Moves[Moves["SPIT_UP"] = 255] = "SPIT_UP";
	Moves[Moves["SWALLOW"] = 256] = "SWALLOW";
	Moves[Moves["HEAT_WAVE"] = 257] = "HEAT_WAVE";
	Moves[Moves["HAIL"] = 258] = "HAIL";
	Moves[Moves["TORMENT"] = 259] = "TORMENT";
	Moves[Moves["FLATTER"] = 260] = "FLATTER";
	Moves[Moves["WILL_O_WISP"] = 261] = "WILL_O_WISP";
	Moves[Moves["MEMENTO"] = 262] = "MEMENTO";
	Moves[Moves["FACADE"] = 263] = "FACADE";
	Moves[Moves["FOCUS_PUNCH"] = 264] = "FOCUS_PUNCH";
	Moves[Moves["SMELLING_SALTS"] = 265] = "SMELLING_SALTS";
	Moves[Moves["FOLLOW_ME"] = 266] = "FOLLOW_ME";
	Moves[Moves["NATURE_POWER"] = 267] = "NATURE_POWER";
	Moves[Moves["CHARGE"] = 268] = "CHARGE";
	Moves[Moves["TAUNT"] = 269] = "TAUNT";
	Moves[Moves["HELPING_HAND"] = 270] = "HELPING_HAND";
	Moves[Moves["TRICK"] = 271] = "TRICK";
	Moves[Moves["ROLE_PLAY"] = 272] = "ROLE_PLAY";
	Moves[Moves["WISH"] = 273] = "WISH";
	Moves[Moves["ASSIST"] = 274] = "ASSIST";
	Moves[Moves["INGRAIN"] = 275] = "INGRAIN";
	Moves[Moves["SUPERPOWER"] = 276] = "SUPERPOWER";
	Moves[Moves["MAGIC_COAT"] = 277] = "MAGIC_COAT";
	Moves[Moves["RECYCLE"] = 278] = "RECYCLE";
	Moves[Moves["REVENGE"] = 279] = "REVENGE";
	Moves[Moves["BRICK_BREAK"] = 280] = "BRICK_BREAK";
	Moves[Moves["YAWN"] = 281] = "YAWN";
	Moves[Moves["KNOCK_OFF"] = 282] = "KNOCK_OFF";
	Moves[Moves["ENDEAVOR"] = 283] = "ENDEAVOR";
	Moves[Moves["ERUPTION"] = 284] = "ERUPTION";
	Moves[Moves["SKILL_SWAP"] = 285] = "SKILL_SWAP";
	Moves[Moves["IMPRISON"] = 286] = "IMPRISON";
	Moves[Moves["REFRESH"] = 287] = "REFRESH";
	Moves[Moves["GRUDGE"] = 288] = "GRUDGE";
	Moves[Moves["SNATCH"] = 289] = "SNATCH";
	Moves[Moves["SECRET_POWER"] = 290] = "SECRET_POWER";
	Moves[Moves["DIVE"] = 291] = "DIVE";
	Moves[Moves["ARM_THRUST"] = 292] = "ARM_THRUST";
	Moves[Moves["CAMOUFLAGE"] = 293] = "CAMOUFLAGE";
	Moves[Moves["TAIL_GLOW"] = 294] = "TAIL_GLOW";
	Moves[Moves["LUSTER_PURGE"] = 295] = "LUSTER_PURGE";
	Moves[Moves["MIST_BALL"] = 296] = "MIST_BALL";
	Moves[Moves["FEATHER_DANCE"] = 297] = "FEATHER_DANCE";
	Moves[Moves["TEETER_DANCE"] = 298] = "TEETER_DANCE";
	Moves[Moves["BLAZE_KICK"] = 299] = "BLAZE_KICK";
	Moves[Moves["MUD_SPORT"] = 300] = "MUD_SPORT";
	Moves[Moves["ICE_BALL"] = 301] = "ICE_BALL";
	Moves[Moves["NEEDLE_ARM"] = 302] = "NEEDLE_ARM";
	Moves[Moves["SLACK_OFF"] = 303] = "SLACK_OFF";
	Moves[Moves["HYPER_VOICE"] = 304] = "HYPER_VOICE";
	Moves[Moves["POISON_FANG"] = 305] = "POISON_FANG";
	Moves[Moves["CRUSH_CLAW"] = 306] = "CRUSH_CLAW";
	Moves[Moves["BLAST_BURN"] = 307] = "BLAST_BURN";
	Moves[Moves["HYDRO_CANNON"] = 308] = "HYDRO_CANNON";
	Moves[Moves["METEOR_MASH"] = 309] = "METEOR_MASH";
	Moves[Moves["ASTONISH"] = 310] = "ASTONISH";
	Moves[Moves["WEATHER_BALL"] = 311] = "WEATHER_BALL";
	Moves[Moves["AROMATHERAPY"] = 312] = "AROMATHERAPY";
	Moves[Moves["FAKE_TEARS"] = 313] = "FAKE_TEARS";
	Moves[Moves["AIR_CUTTER"] = 314] = "AIR_CUTTER";
	Moves[Moves["OVERHEAT"] = 315] = "OVERHEAT";
	Moves[Moves["ODOR_SLEUTH"] = 316] = "ODOR_SLEUTH";
	Moves[Moves["ROCK_TOMB"] = 317] = "ROCK_TOMB";
	Moves[Moves["SILVER_WIND"] = 318] = "SILVER_WIND";
	Moves[Moves["METAL_SOUND"] = 319] = "METAL_SOUND";
	Moves[Moves["GRASS_WHISTLE"] = 320] = "GRASS_WHISTLE";
	Moves[Moves["TICKLE"] = 321] = "TICKLE";
	Moves[Moves["COSMIC_POWER"] = 322] = "COSMIC_POWER";
	Moves[Moves["WATER_SPOUT"] = 323] = "WATER_SPOUT";
	Moves[Moves["SIGNAL_BEAM"] = 324] = "SIGNAL_BEAM";
	Moves[Moves["SHADOW_PUNCH"] = 325] = "SHADOW_PUNCH";
	Moves[Moves["EXTRASENSORY"] = 326] = "EXTRASENSORY";
	Moves[Moves["SKY_UPPERCUT"] = 327] = "SKY_UPPERCUT";
	Moves[Moves["SAND_TOMB"] = 328] = "SAND_TOMB";
	Moves[Moves["SHEER_COLD"] = 329] = "SHEER_COLD";
	Moves[Moves["MUDDY_WATER"] = 330] = "MUDDY_WATER";
	Moves[Moves["BULLET_SEED"] = 331] = "BULLET_SEED";
	Moves[Moves["AERIAL_ACE"] = 332] = "AERIAL_ACE";
	Moves[Moves["ICICLE_SPEAR"] = 333] = "ICICLE_SPEAR";
	Moves[Moves["IRON_DEFENSE"] = 334] = "IRON_DEFENSE";
	Moves[Moves["BLOCK"] = 335] = "BLOCK";
	Moves[Moves["HOWL"] = 336] = "HOWL";
	Moves[Moves["DRAGON_CLAW"] = 337] = "DRAGON_CLAW";
	Moves[Moves["FRENZY_PLANT"] = 338] = "FRENZY_PLANT";
	Moves[Moves["BULK_UP"] = 339] = "BULK_UP";
	Moves[Moves["BOUNCE"] = 340] = "BOUNCE";
	Moves[Moves["MUD_SHOT"] = 341] = "MUD_SHOT";
	Moves[Moves["POISON_TAIL"] = 342] = "POISON_TAIL";
	Moves[Moves["COVET"] = 343] = "COVET";
	Moves[Moves["VOLT_TACKLE"] = 344] = "VOLT_TACKLE";
	Moves[Moves["MAGICAL_LEAF"] = 345] = "MAGICAL_LEAF";
	Moves[Moves["WATER_SPORT"] = 346] = "WATER_SPORT";
	Moves[Moves["CALM_MIND"] = 347] = "CALM_MIND";
	Moves[Moves["LEAF_BLADE"] = 348] = "LEAF_BLADE";
	Moves[Moves["DRAGON_DANCE"] = 349] = "DRAGON_DANCE";
	Moves[Moves["ROCK_BLAST"] = 350] = "ROCK_BLAST";
	Moves[Moves["SHOCK_WAVE"] = 351] = "SHOCK_WAVE";
	Moves[Moves["WATER_PULSE"] = 352] = "WATER_PULSE";
	Moves[Moves["DOOM_DESIRE"] = 353] = "DOOM_DESIRE";
	Moves[Moves["PSYCHO_BOOST"] = 354] = "PSYCHO_BOOST";
	Moves[Moves["ROOST"] = 355] = "ROOST";
	Moves[Moves["GRAVITY"] = 356] = "GRAVITY";
	Moves[Moves["MIRACLE_EYE"] = 357] = "MIRACLE_EYE";
	Moves[Moves["WAKE_UP_SLAP"] = 358] = "WAKE_UP_SLAP";
	Moves[Moves["HAMMER_ARM"] = 359] = "HAMMER_ARM";
	Moves[Moves["GYRO_BALL"] = 360] = "GYRO_BALL";
	Moves[Moves["HEALING_WISH"] = 361] = "HEALING_WISH";
	Moves[Moves["BRINE"] = 362] = "BRINE";
	Moves[Moves["NATURAL_GIFT"] = 363] = "NATURAL_GIFT";
	Moves[Moves["FEINT"] = 364] = "FEINT";
	Moves[Moves["PLUCK"] = 365] = "PLUCK";
	Moves[Moves["TAILWIND"] = 366] = "TAILWIND";
	Moves[Moves["ACUPRESSURE"] = 367] = "ACUPRESSURE";
	Moves[Moves["METAL_BURST"] = 368] = "METAL_BURST";
	Moves[Moves["U_TURN"] = 369] = "U_TURN";
	Moves[Moves["CLOSE_COMBAT"] = 370] = "CLOSE_COMBAT";
	Moves[Moves["PAYBACK"] = 371] = "PAYBACK";
	Moves[Moves["ASSURANCE"] = 372] = "ASSURANCE";
	Moves[Moves["EMBARGO"] = 373] = "EMBARGO";
	Moves[Moves["FLING"] = 374] = "FLING";
	Moves[Moves["PSYCHO_SHIFT"] = 375] = "PSYCHO_SHIFT";
	Moves[Moves["TRUMP_CARD"] = 376] = "TRUMP_CARD";
	Moves[Moves["HEAL_BLOCK"] = 377] = "HEAL_BLOCK";
	Moves[Moves["WRING_OUT"] = 378] = "WRING_OUT";
	Moves[Moves["POWER_TRICK"] = 379] = "POWER_TRICK";
	Moves[Moves["GASTRO_ACID"] = 380] = "GASTRO_ACID";
	Moves[Moves["LUCKY_CHANT"] = 381] = "LUCKY_CHANT";
	Moves[Moves["ME_FIRST"] = 382] = "ME_FIRST";
	Moves[Moves["COPYCAT"] = 383] = "COPYCAT";
	Moves[Moves["POWER_SWAP"] = 384] = "POWER_SWAP";
	Moves[Moves["GUARD_SWAP"] = 385] = "GUARD_SWAP";
	Moves[Moves["PUNISHMENT"] = 386] = "PUNISHMENT";
	Moves[Moves["LAST_RESORT"] = 387] = "LAST_RESORT";
	Moves[Moves["WORRY_SEED"] = 388] = "WORRY_SEED";
	Moves[Moves["SUCKER_PUNCH"] = 389] = "SUCKER_PUNCH";
	Moves[Moves["TOXIC_SPIKES"] = 390] = "TOXIC_SPIKES";
	Moves[Moves["HEART_SWAP"] = 391] = "HEART_SWAP";
	Moves[Moves["AQUA_RING"] = 392] = "AQUA_RING";
	Moves[Moves["MAGNET_RISE"] = 393] = "MAGNET_RISE";
	Moves[Moves["FLARE_BLITZ"] = 394] = "FLARE_BLITZ";
	Moves[Moves["FORCE_PALM"] = 395] = "FORCE_PALM";
	Moves[Moves["AURA_SPHERE"] = 396] = "AURA_SPHERE";
	Moves[Moves["ROCK_POLISH"] = 397] = "ROCK_POLISH";
	Moves[Moves["POISON_JAB"] = 398] = "POISON_JAB";
	Moves[Moves["DARK_PULSE"] = 399] = "DARK_PULSE";
	Moves[Moves["NIGHT_SLASH"] = 400] = "NIGHT_SLASH";
	Moves[Moves["AQUA_TAIL"] = 401] = "AQUA_TAIL";
	Moves[Moves["SEED_BOMB"] = 402] = "SEED_BOMB";
	Moves[Moves["AIR_SLASH"] = 403] = "AIR_SLASH";
	Moves[Moves["X_SCISSOR"] = 404] = "X_SCISSOR";
	Moves[Moves["BUG_BUZZ"] = 405] = "BUG_BUZZ";
	Moves[Moves["DRAGON_PULSE"] = 406] = "DRAGON_PULSE";
	Moves[Moves["DRAGON_RUSH"] = 407] = "DRAGON_RUSH";
	Moves[Moves["POWER_GEM"] = 408] = "POWER_GEM";
	Moves[Moves["DRAIN_PUNCH"] = 409] = "DRAIN_PUNCH";
	Moves[Moves["VACUUM_WAVE"] = 410] = "VACUUM_WAVE";
	Moves[Moves["FOCUS_BLAST"] = 411] = "FOCUS_BLAST";
	Moves[Moves["ENERGY_BALL"] = 412] = "ENERGY_BALL";
	Moves[Moves["BRAVE_BIRD"] = 413] = "BRAVE_BIRD";
	Moves[Moves["EARTH_POWER"] = 414] = "EARTH_POWER";
	Moves[Moves["SWITCHEROO"] = 415] = "SWITCHEROO";
	Moves[Moves["GIGA_IMPACT"] = 416] = "GIGA_IMPACT";
	Moves[Moves["NASTY_PLOT"] = 417] = "NASTY_PLOT";
	Moves[Moves["BULLET_PUNCH"] = 418] = "BULLET_PUNCH";
	Moves[Moves["AVALANCHE"] = 419] = "AVALANCHE";
	Moves[Moves["ICE_SHARD"] = 420] = "ICE_SHARD";
	Moves[Moves["SHADOW_CLAW"] = 421] = "SHADOW_CLAW";
	Moves[Moves["THUNDER_FANG"] = 422] = "THUNDER_FANG";
	Moves[Moves["ICE_FANG"] = 423] = "ICE_FANG";
	Moves[Moves["FIRE_FANG"] = 424] = "FIRE_FANG";
	Moves[Moves["SHADOW_SNEAK"] = 425] = "SHADOW_SNEAK";
	Moves[Moves["MUD_BOMB"] = 426] = "MUD_BOMB";
	Moves[Moves["PSYCHO_CUT"] = 427] = "PSYCHO_CUT";
	Moves[Moves["ZEN_HEADBUTT"] = 428] = "ZEN_HEADBUTT";
	Moves[Moves["MIRROR_SHOT"] = 429] = "MIRROR_SHOT";
	Moves[Moves["FLASH_CANNON"] = 430] = "FLASH_CANNON";
	Moves[Moves["ROCK_CLIMB"] = 431] = "ROCK_CLIMB";
	Moves[Moves["DEFOG"] = 432] = "DEFOG";
	Moves[Moves["TRICK_ROOM"] = 433] = "TRICK_ROOM";
	Moves[Moves["DRACO_METEOR"] = 434] = "DRACO_METEOR";
	Moves[Moves["DISCHARGE"] = 435] = "DISCHARGE";
	Moves[Moves["LAVA_PLUME"] = 436] = "LAVA_PLUME";
	Moves[Moves["LEAF_STORM"] = 437] = "LEAF_STORM";
	Moves[Moves["POWER_WHIP"] = 438] = "POWER_WHIP";
	Moves[Moves["ROCK_WRECKER"] = 439] = "ROCK_WRECKER";
	Moves[Moves["CROSS_POISON"] = 440] = "CROSS_POISON";
	Moves[Moves["GUNK_SHOT"] = 441] = "GUNK_SHOT";
	Moves[Moves["IRON_HEAD"] = 442] = "IRON_HEAD";
	Moves[Moves["MAGNET_BOMB"] = 443] = "MAGNET_BOMB";
	Moves[Moves["STONE_EDGE"] = 444] = "STONE_EDGE";
	Moves[Moves["CAPTIVATE"] = 445] = "CAPTIVATE";
	Moves[Moves["STEALTH_ROCK"] = 446] = "STEALTH_ROCK";
	Moves[Moves["GRASS_KNOT"] = 447] = "GRASS_KNOT";
	Moves[Moves["CHATTER"] = 448] = "CHATTER";
	Moves[Moves["JUDGMENT"] = 449] = "JUDGMENT";
	Moves[Moves["BUG_BITE"] = 450] = "BUG_BITE";
	Moves[Moves["CHARGE_BEAM"] = 451] = "CHARGE_BEAM";
	Moves[Moves["WOOD_HAMMER"] = 452] = "WOOD_HAMMER";
	Moves[Moves["AQUA_JET"] = 453] = "AQUA_JET";
	Moves[Moves["ATTACK_ORDER"] = 454] = "ATTACK_ORDER";
	Moves[Moves["DEFEND_ORDER"] = 455] = "DEFEND_ORDER";
	Moves[Moves["HEAL_ORDER"] = 456] = "HEAL_ORDER";
	Moves[Moves["HEAD_SMASH"] = 457] = "HEAD_SMASH";
	Moves[Moves["DOUBLE_HIT"] = 458] = "DOUBLE_HIT";
	Moves[Moves["ROAR_OF_TIME"] = 459] = "ROAR_OF_TIME";
	Moves[Moves["SPACIAL_REND"] = 460] = "SPACIAL_REND";
	Moves[Moves["LUNAR_DANCE"] = 461] = "LUNAR_DANCE";
	Moves[Moves["CRUSH_GRIP"] = 462] = "CRUSH_GRIP";
	Moves[Moves["MAGMA_STORM"] = 463] = "MAGMA_STORM";
	Moves[Moves["DARK_VOID"] = 464] = "DARK_VOID";
	Moves[Moves["SEED_FLARE"] = 465] = "SEED_FLARE";
	Moves[Moves["OMINOUS_WIND"] = 466] = "OMINOUS_WIND";
	Moves[Moves["SHADOW_FORCE"] = 467] = "SHADOW_FORCE";
	Moves[Moves["HONE_CLAWS"] = 468] = "HONE_CLAWS";
	Moves[Moves["WIDE_GUARD"] = 469] = "WIDE_GUARD";
	Moves[Moves["GUARD_SPLIT"] = 470] = "GUARD_SPLIT";
	Moves[Moves["POWER_SPLIT"] = 471] = "POWER_SPLIT";
	Moves[Moves["WONDER_ROOM"] = 472] = "WONDER_ROOM";
	Moves[Moves["PSYSHOCK"] = 473] = "PSYSHOCK";
	Moves[Moves["VENOSHOCK"] = 474] = "VENOSHOCK";
	Moves[Moves["AUTOTOMIZE"] = 475] = "AUTOTOMIZE";
	Moves[Moves["RAGE_POWDER"] = 476] = "RAGE_POWDER";
	Moves[Moves["TELEKINESIS"] = 477] = "TELEKINESIS";
	Moves[Moves["MAGIC_ROOM"] = 478] = "MAGIC_ROOM";
	Moves[Moves["SMACK_DOWN"] = 479] = "SMACK_DOWN";
	Moves[Moves["STORM_THROW"] = 480] = "STORM_THROW";
	Moves[Moves["FLAME_BURST"] = 481] = "FLAME_BURST";
	Moves[Moves["SLUDGE_WAVE"] = 482] = "SLUDGE_WAVE";
	Moves[Moves["QUIVER_DANCE"] = 483] = "QUIVER_DANCE";
	Moves[Moves["HEAVY_SLAM"] = 484] = "HEAVY_SLAM";
	Moves[Moves["SYNCHRONOISE"] = 485] = "SYNCHRONOISE";
	Moves[Moves["ELECTRO_BALL"] = 486] = "ELECTRO_BALL";
	Moves[Moves["SOAK"] = 487] = "SOAK";
	Moves[Moves["FLAME_CHARGE"] = 488] = "FLAME_CHARGE";
	Moves[Moves["COIL"] = 489] = "COIL";
	Moves[Moves["LOW_SWEEP"] = 490] = "LOW_SWEEP";
	Moves[Moves["ACID_SPRAY"] = 491] = "ACID_SPRAY";
	Moves[Moves["FOUL_PLAY"] = 492] = "FOUL_PLAY";
	Moves[Moves["SIMPLE_BEAM"] = 493] = "SIMPLE_BEAM";
	Moves[Moves["ENTRAINMENT"] = 494] = "ENTRAINMENT";
	Moves[Moves["AFTER_YOU"] = 495] = "AFTER_YOU";
	Moves[Moves["ROUND"] = 496] = "ROUND";
	Moves[Moves["ECHOED_VOICE"] = 497] = "ECHOED_VOICE";
	Moves[Moves["CHIP_AWAY"] = 498] = "CHIP_AWAY";
	Moves[Moves["CLEAR_SMOG"] = 499] = "CLEAR_SMOG";
	Moves[Moves["STORED_POWER"] = 500] = "STORED_POWER";
	Moves[Moves["QUICK_GUARD"] = 501] = "QUICK_GUARD";
	Moves[Moves["ALLY_SWITCH"] = 502] = "ALLY_SWITCH";
	Moves[Moves["SCALD"] = 503] = "SCALD";
	Moves[Moves["SHELL_SMASH"] = 504] = "SHELL_SMASH";
	Moves[Moves["HEAL_PULSE"] = 505] = "HEAL_PULSE";
	Moves[Moves["HEX"] = 506] = "HEX";
	Moves[Moves["SKY_DROP"] = 507] = "SKY_DROP";
	Moves[Moves["SHIFT_GEAR"] = 508] = "SHIFT_GEAR";
	Moves[Moves["CIRCLE_THROW"] = 509] = "CIRCLE_THROW";
	Moves[Moves["INCINERATE"] = 510] = "INCINERATE";
	Moves[Moves["QUASH"] = 511] = "QUASH";
	Moves[Moves["ACROBATICS"] = 512] = "ACROBATICS";
	Moves[Moves["REFLECT_TYPE"] = 513] = "REFLECT_TYPE";
	Moves[Moves["RETALIATE"] = 514] = "RETALIATE";
	Moves[Moves["FINAL_GAMBIT"] = 515] = "FINAL_GAMBIT";
	Moves[Moves["BESTOW"] = 516] = "BESTOW";
	Moves[Moves["INFERNO"] = 517] = "INFERNO";
	Moves[Moves["WATER_PLEDGE"] = 518] = "WATER_PLEDGE";
	Moves[Moves["FIRE_PLEDGE"] = 519] = "FIRE_PLEDGE";
	Moves[Moves["GRASS_PLEDGE"] = 520] = "GRASS_PLEDGE";
	Moves[Moves["VOLT_SWITCH"] = 521] = "VOLT_SWITCH";
	Moves[Moves["STRUGGLE_BUG"] = 522] = "STRUGGLE_BUG";
	Moves[Moves["BULLDOZE"] = 523] = "BULLDOZE";
	Moves[Moves["FROST_BREATH"] = 524] = "FROST_BREATH";
	Moves[Moves["DRAGON_TAIL"] = 525] = "DRAGON_TAIL";
	Moves[Moves["WORK_UP"] = 526] = "WORK_UP";
	Moves[Moves["ELECTROWEB"] = 527] = "ELECTROWEB";
	Moves[Moves["WILD_CHARGE"] = 528] = "WILD_CHARGE";
	Moves[Moves["DRILL_RUN"] = 529] = "DRILL_RUN";
	Moves[Moves["DUAL_CHOP"] = 530] = "DUAL_CHOP";
	Moves[Moves["HEART_STAMP"] = 531] = "HEART_STAMP";
	Moves[Moves["HORN_LEECH"] = 532] = "HORN_LEECH";
	Moves[Moves["SACRED_SWORD"] = 533] = "SACRED_SWORD";
	Moves[Moves["RAZOR_SHELL"] = 534] = "RAZOR_SHELL";
	Moves[Moves["HEAT_CRASH"] = 535] = "HEAT_CRASH";
	Moves[Moves["LEAF_TORNADO"] = 536] = "LEAF_TORNADO";
	Moves[Moves["STEAMROLLER"] = 537] = "STEAMROLLER";
	Moves[Moves["COTTON_GUARD"] = 538] = "COTTON_GUARD";
	Moves[Moves["NIGHT_DAZE"] = 539] = "NIGHT_DAZE";
	Moves[Moves["PSYSTRIKE"] = 540] = "PSYSTRIKE";
	Moves[Moves["TAIL_SLAP"] = 541] = "TAIL_SLAP";
	Moves[Moves["HURRICANE"] = 542] = "HURRICANE";
	Moves[Moves["HEAD_CHARGE"] = 543] = "HEAD_CHARGE";
	Moves[Moves["GEAR_GRIND"] = 544] = "GEAR_GRIND";
	Moves[Moves["SEARING_SHOT"] = 545] = "SEARING_SHOT";
	Moves[Moves["TECHNO_BLAST"] = 546] = "TECHNO_BLAST";
	Moves[Moves["RELIC_SONG"] = 547] = "RELIC_SONG";
	Moves[Moves["SECRET_SWORD"] = 548] = "SECRET_SWORD";
	Moves[Moves["GLACIATE"] = 549] = "GLACIATE";
	Moves[Moves["BOLT_STRIKE"] = 550] = "BOLT_STRIKE";
	Moves[Moves["BLUE_FLARE"] = 551] = "BLUE_FLARE";
	Moves[Moves["FIERY_DANCE"] = 552] = "FIERY_DANCE";
	Moves[Moves["FREEZE_SHOCK"] = 553] = "FREEZE_SHOCK";
	Moves[Moves["ICE_BURN"] = 554] = "ICE_BURN";
	Moves[Moves["SNARL"] = 555] = "SNARL";
	Moves[Moves["ICICLE_CRASH"] = 556] = "ICICLE_CRASH";
	Moves[Moves["V_CREATE"] = 557] = "V_CREATE";
	Moves[Moves["FUSION_FLARE"] = 558] = "FUSION_FLARE";
	Moves[Moves["FUSION_BOLT"] = 559] = "FUSION_BOLT";
})(Moves || (Moves = {}));

export const allMoves = [
	[Moves.POUND, "Pound", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 35, "", "", -1, 1],
	[Moves.KARATE_CHOP, "Karate Chop", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 50, 100, 25, "", "High critical hit ratio.", -1, 1],
	[Moves.DOUBLE_SLAP, "Double Slap", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 15, 85, 10, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.COMET_PUNCH, "Comet Punch", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 18, 85, 15, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.MEGA_PUNCH, "Mega Punch", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 80, 85, 20, "", "", -1, 1],
	[Moves.PAY_DAY, "Pay Day", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 20, "", "Money is earned after the battle.", -1, 1],
	[Moves.FIRE_PUNCH, "Fire Punch", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 75, 100, 15, "TM67", "May burn opponent.", 10, 1],
	[Moves.ICE_PUNCH, "Ice Punch", Type.ICE, MOVE_CATEGORY.PHYSICAL, 75, 100, 15, "TM69", "May freeze opponent.", 10, 1],
	[Moves.THUNDER_PUNCH, "Thunder Punch", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 75, 100, 15, "TM68", "May paralyze opponent.", 10, 1],
	[Moves.SCRATCH, "Scratch", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 35, "", "", -1, 1],
	[Moves.VISE_GRIP, "Vise Grip", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 55, 100, 30, "", "", -1, 1],
	[Moves.GUILLOTINE, "Guillotine", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 30, 5, "", "One-Hit-KO, if it hits.", -1, 1],
	[Moves.RAZOR_WIND, "Razor Wind", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "", "Charges on first turn, attacks on second. High critical hit ratio.", -1, 1],
	[Moves.SWORDS_DANCE, "Swords Dance", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM88", "Sharply raises user's Attack.", -1, 1],
	[Moves.CUT, "Cut", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 50, 95, 30, "", "", -1, 1],
	[Moves.GUST, "Gust", Type.FLYING, MOVE_CATEGORY.SPECIAL, 40, 100, 35, "", "Hits Pokémon using Fly/Bounce/Sky Drop with double power.", -1, 1],
	[Moves.WING_ATTACK, "Wing Attack", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 60, 100, 35, "", "", -1, 1],
	[Moves.WHIRLWIND, "Whirlwind", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "In battles, the opponent switches. In the wild, the Pokémon runs.", -1, 1],
	[Moves.FLY, "Fly", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 90, 95, 15, "TM97", "Flies up on first turn, attacks on second turn.", -1, 1],
	[Moves.BIND, "Bind", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 15, 85, 20, "", "Traps opponent, damaging them for 4-5 turns.", 100, 1],
	[Moves.SLAM, "Slam", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 80, 75, 20, "", "", -1, 1],
	[Moves.VINE_WHIP, "Vine Whip", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 45, 100, 25, "", "", -1, 1],
	[Moves.STOMP, "Stomp", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 65, 100, 20, "", "May cause flinching.", 30, 1],
	[Moves.DOUBLE_KICK, "Double Kick", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 30, 100, 30, "", "Hits twice in one turn.", -1, 1],
	[Moves.MEGA_KICK, "Mega Kick", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 120, 75, 5, "", "", -1, 1],
	[Moves.JUMP_KICK, "Jump Kick", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 100, 95, 10, "", "If it misses, the user loses half their HP.", -1, 1],
	[Moves.ROLLING_KICK, "Rolling Kick", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 60, 85, 15, "", "May cause flinching.", 30, 1],
	[Moves.SAND_ATTACK, "Sand Attack", Type.GROUND, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Lowers opponent's Accuracy.", -1, 1],
	[Moves.HEADBUTT, "Headbutt", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 15, "", "May cause flinching.", 30, 1],
	[Moves.HORN_ATTACK, "Horn Attack", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 65, 100, 25, "", "", -1, 1],
	[Moves.FURY_ATTACK, "Fury Attack", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 15, 85, 20, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.HORN_DRILL, "Horn Drill", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 30, 5, "", "One-Hit-KO, if it hits.", -1, 1],
	[Moves.TACKLE, "Tackle", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 35, "", "", -1, 1],
	[Moves.BODY_SLAM, "Body Slam", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 85, 100, 15, "TM66", "May paralyze opponent.", 30, 1],
	[Moves.WRAP, "Wrap", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 15, 90, 20, "", "Traps opponent, damaging them for 4-5 turns.", 100, 1],
	[Moves.TAKE_DOWN, "Take Down", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 90, 85, 20, "TM01", "User receives recoil damage.", -1, 1],
	[Moves.THRASH, "Thrash", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 120, 100, 10, "", "User attacks for 2-3 turns but then becomes confused.", -1, 1],
	[Moves.DOUBLE_EDGE, "Double-Edge", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 120, 100, 15, "", "User receives recoil damage.", -1, 1],
	[Moves.TAIL_WHIP, "Tail Whip", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 30, "", "Lowers opponent's Defense.", -1, 1],
	[Moves.POISON_STING, "Poison Sting", Type.POISON, MOVE_CATEGORY.PHYSICAL, 15, 100, 35, "", "May poison the opponent.", 30, 1],
	[Moves.TWINEEDLE, "Twineedle", Type.BUG, MOVE_CATEGORY.PHYSICAL, 25, 100, 20, "", "Hits twice in one turn. May poison opponent.", 20, 1],
	[Moves.PIN_MISSILE, "Pin Missile", Type.BUG, MOVE_CATEGORY.PHYSICAL, 25, 95, 20, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.LEER, "Leer", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 30, "", "Lowers opponent's Defense.", 100, 1],
	[Moves.BITE, "Bite", Type.DARK, MOVE_CATEGORY.PHYSICAL, 60, 100, 25, "", "May cause flinching.", 30, 1],
	[Moves.GROWL, "Growl", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 40, "", "Lowers opponent's Attack.", -1, 1],
	[Moves.ROAR, "Roar", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "In battles, the opponent switches. In the wild, the Pokémon runs.", -1, 1],
	[Moves.SING, "Sing", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 55, 15, "", "Puts opponent to sleep.", -1, 1],
	[Moves.SUPERSONIC, "Supersonic", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 55, 20, "", "Confuses opponent.", -1, 1],
	[Moves.SONIC_BOOM, "Sonic Boom", Type.NORMAL, MOVE_CATEGORY.SPECIAL, -1, 90, 20, "", "Always inflicts 20 HP.", -1, 1],
	[Moves.DISABLE, "Disable", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Opponent can't use its last attack for a few turns.", -1, 1],
	[Moves.ACID, "Acid", Type.POISON, MOVE_CATEGORY.SPECIAL, 40, 100, 30, "", "May lower opponent's Special Defense.", 10, 1],
	[Moves.EMBER, "Ember", Type.FIRE, MOVE_CATEGORY.SPECIAL, 40, 100, 25, "", "May burn opponent.", 10, 1],
	[Moves.FLAMETHROWER, "Flamethrower", Type.FIRE, MOVE_CATEGORY.SPECIAL, 90, 100, 15, "TM125", "May burn opponent.", 10, 1],
	[Moves.MIST, "Mist", Type.ICE, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "User's stats cannot be changed for a period of time.", -1, 1],
	[Moves.WATER_GUN, "Water Gun", Type.WATER, MOVE_CATEGORY.SPECIAL, 40, 100, 25, "", "", -1, 1],
	[Moves.HYDRO_PUMP, "Hydro Pump", Type.WATER, MOVE_CATEGORY.SPECIAL, 110, 80, 5, "TM142", "", -1, 1],
	[Moves.SURF, "Surf", Type.WATER, MOVE_CATEGORY.SPECIAL, 90, 100, 15, "TM123", "Hits all adjacent Pokémon.", -1, 1],
	[Moves.ICE_BEAM, "Ice Beam", Type.ICE, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM135", "May freeze opponent.", 10, 1],
	[Moves.BLIZZARD, "Blizzard", Type.ICE, MOVE_CATEGORY.SPECIAL, 110, 70, 5, "TM143", "May freeze opponent.", 10, 1],
	[Moves.PSYBEAM, "Psybeam", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 65, 100, 20, "TM16", "May confuse opponent.", 10, 1],
	[Moves.BUBBLE_BEAM, "Bubble Beam", Type.WATER, MOVE_CATEGORY.SPECIAL, 65, 100, 20, "", "May lower opponent's Speed.", 10, 1],
	[Moves.AURORA_BEAM, "Aurora Beam", Type.ICE, MOVE_CATEGORY.SPECIAL, 65, 100, 20, "", "May lower opponent's Attack.", 10, 1],
	[Moves.HYPER_BEAM, "Hyper Beam", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 150, 90, 5, "TM163", "User must recharge next turn.", -1, 1],
	[Moves.PECK, "Peck", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 35, 100, 35, "", "", -1, 1],
	[Moves.DRILL_PECK, "Drill Peck", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 80, 100, 20, "", "", -1, 1],
	[Moves.SUBMISSION, "Submission", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 80, 80, 20, "", "User receives recoil damage.", -1, 1],
	[Moves.LOW_KICK, "Low Kick", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, -1, 100, 20, "TM12", "The heavier the opponent, the stronger the attack.", -1, 1],
	[Moves.COUNTER, "Counter", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, -1, 100, 20, "", "When hit by a Physical Attack, user strikes back with 2x power.", -1, 1],
	[Moves.SEISMIC_TOSS, "Seismic Toss", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, -1, 100, 20, "", "Inflicts damage equal to user's level.", -1, 1],
	[Moves.STRENGTH, "Strength", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "", "", -1, 1],
	[Moves.ABSORB, "Absorb", Type.GRASS, MOVE_CATEGORY.SPECIAL, 20, 100, 25, "", "User recovers half the HP inflicted on opponent.", -1, 1],
	[Moves.MEGA_DRAIN, "Mega Drain", Type.GRASS, MOVE_CATEGORY.SPECIAL, 40, 100, 15, "", "User recovers half the HP inflicted on opponent.", -1, 1],
	[Moves.LEECH_SEED, "Leech Seed", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 90, 10, "", "Drains HP from opponent each turn.", -1, 1],
	[Moves.GROWTH, "Growth", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Raises user's Attack and Special Attack.", -1, 1],
	[Moves.RAZOR_LEAF, "Razor Leaf", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 55, 95, 25, "", "High critical hit ratio.", -1, 1],
	[Moves.SOLAR_BEAM, "Solar Beam", Type.GRASS, MOVE_CATEGORY.SPECIAL, 120, 100, 10, "TM168", "Charges on first turn, attacks on second.", -1, 1],
	[Moves.POISON_POWDER, "Poison Powder", Type.POISON, MOVE_CATEGORY.STATUS, -1, 75, 35, "", "Poisons opponent.", -1, 1],
	[Moves.STUN_SPORE, "Stun Spore", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 75, 30, "", "Paralyzes opponent.", -1, 1],
	[Moves.SLEEP_POWDER, "Sleep Powder", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 75, 15, "", "Puts opponent to sleep.", -1, 1],
	[Moves.PETAL_DANCE, "Petal Dance", Type.GRASS, MOVE_CATEGORY.SPECIAL, 120, 100, 10, "", "User attacks for 2-3 turns but then becomes confused.", -1, 1],
	[Moves.STRING_SHOT, "String Shot", Type.BUG, MOVE_CATEGORY.STATUS, -1, 95, 40, "", "Sharply lowers opponent's Speed.", -1, 1],
	[Moves.DRAGON_RAGE, "Dragon Rage", Type.DRAGON, MOVE_CATEGORY.SPECIAL, -1, 100, 10, "", "Always inflicts 40 HP.", -1, 1],
	[Moves.FIRE_SPIN, "Fire Spin", Type.FIRE, MOVE_CATEGORY.SPECIAL, 35, 85, 15, "TM24", "Traps opponent, damaging them for 4-5 turns.", 100, 1],
	[Moves.THUNDER_SHOCK, "Thunder Shock", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 40, 100, 30, "", "May paralyze opponent.", 10, 1],
	[Moves.THUNDERBOLT, "Thunderbolt", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 90, 100, 15, "TM126", "May paralyze opponent.", 10, 1],
	[Moves.THUNDER_WAVE, "Thunder Wave", Type.ELECTRIC, MOVE_CATEGORY.STATUS, -1, 90, 20, "TM82", "Paralyzes opponent.", -1, 1],
	[Moves.THUNDER, "Thunder", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 110, 70, 10, "TM166", "May paralyze opponent.", 30, 1],
	[Moves.ROCK_THROW, "Rock Throw", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 50, 90, 15, "", "", -1, 1],
	[Moves.EARTHQUAKE, "Earthquake", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 100, 100, 10, "TM149", "Power is doubled if opponent is underground from using Dig.", -1, 1],
	[Moves.FISSURE, "Fissure", Type.GROUND, MOVE_CATEGORY.PHYSICAL, -1, 30, 5, "", "One-Hit-KO, if it hits.", -1, 1],
	[Moves.DIG, "Dig", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 80, 100, 10, "TM55", "Digs underground on first turn, attacks on second. Can also escape from caves.", -1, 1],
	[Moves.TOXIC, "Toxic", Type.POISON, MOVE_CATEGORY.STATUS, -1, 90, 10, "", "Badly poisons opponent.", -1, 1],
	[Moves.CONFUSION, "Confusion", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 50, 100, 25, "", "May confuse opponent.", 10, 1],
	[Moves.PSYCHIC, "Psychic", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM120", "May lower opponent's Special Defense.", 10, 1],
	[Moves.HYPNOSIS, "Hypnosis", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, 60, 20, "", "Puts opponent to sleep.", -1, 1],
	[Moves.MEDITATE, "Meditate", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Raises user's Attack.", -1, 1],
	[Moves.AGILITY, "Agility", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 30, "TM04", "Sharply raises user's Speed.", -1, 1],
	[Moves.QUICK_ATTACK, "Quick Attack", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 30, "", "User attacks first.", -1, 1],
	[Moves.RAGE, "Rage", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 20, 100, 20, "", "Raises user's Attack when hit.", -1, 1],
	[Moves.TELEPORT, "Teleport", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Allows user to flee wild battles; also warps player to last PokéCenter.", -1, 1],
	[Moves.NIGHT_SHADE, "Night Shade", Type.GHOST, MOVE_CATEGORY.SPECIAL, -1, 100, 15, "TM42", "Inflicts damage equal to user's level.", -1, 1],
	[Moves.MIMIC, "Mimic", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Copies the opponent's last move.", -1, 1],
	[Moves.SCREECH, "Screech", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 85, 40, "", "Sharply lowers opponent's Defense.", -1, 1],
	[Moves.DOUBLE_TEAM, "Double Team", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Raises user's Evasiveness.", -1, 1],
	[Moves.RECOVER, "Recover", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers half its max HP.", -1, 1],
	[Moves.HARDEN, "Harden", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Raises user's Defense.", -1, 1],
	[Moves.MINIMIZE, "Minimize", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Sharply raises user's Evasiveness.", -1, 1],
	[Moves.SMOKESCREEN, "Smokescreen", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Lowers opponent's Accuracy.", -1, 1],
	[Moves.CONFUSE_RAY, "Confuse Ray", Type.GHOST, MOVE_CATEGORY.STATUS, -1, 100, 10, "TM17", "Confuses opponent.", -1, 1],
	[Moves.WITHDRAW, "Withdraw", Type.WATER, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Raises user's Defense.", -1, 1],
	[Moves.DEFENSE_CURL, "Defense Curl", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Raises user's Defense.", -1, 1],
	[Moves.BARRIER, "Barrier", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Sharply raises user's Defense.", -1, 1],
	[Moves.LIGHT_SCREEN, "Light Screen", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 30, "TM75", "Halves damage from Special attacks for 5 turns.", -1, 1],
	[Moves.HAZE, "Haze", Type.ICE, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Resets all stat changes.", -1, 1],
	[Moves.REFLECT, "Reflect", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM74", "Halves damage from Physical attacks for 5 turns.", -1, 1],
	[Moves.FOCUS_ENERGY, "Focus Energy", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Increases critical hit ratio.", -1, 1],
	[Moves.BIDE, "Bide", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, -1, 10, "", "User takes damage for two turns then strikes back double.", -1, 1],
	[Moves.METRONOME, "Metronome", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM80", "User performs almost any move in the game at random.", -1, 1],
	[Moves.MIRROR_MOVE, "Mirror Move", Type.FLYING, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "User performs the opponent's last move.", -1, 1],
	[Moves.SELF_DESTRUCT, "Self-Destruct", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 200, 100, 5, "", "User faints.", -1, 1],
	[Moves.EGG_BOMB, "Egg Bomb", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 100, 75, 10, "", "", -1, 1],
	[Moves.LICK, "Lick", Type.GHOST, MOVE_CATEGORY.PHYSICAL, 30, 100, 30, "", "May paralyze opponent.", 30, 1],
	[Moves.SMOG, "Smog", Type.POISON, MOVE_CATEGORY.SPECIAL, 30, 70, 20, "", "May poison opponent.", 40, 1],
	[Moves.SLUDGE, "Sludge", Type.POISON, MOVE_CATEGORY.SPECIAL, 65, 100, 20, "", "May poison opponent.", 30, 1],
	[Moves.BONE_CLUB, "Bone Club", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 65, 85, 20, "", "May cause flinching.", 10, 1],
	[Moves.FIRE_BLAST, "Fire Blast", Type.FIRE, MOVE_CATEGORY.SPECIAL, 110, 85, 5, "TM141", "May burn opponent.", 10, 1],
	[Moves.WATERFALL, "Waterfall", Type.WATER, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "TM77", "May cause flinching.", 20, 1],
	[Moves.CLAMP, "Clamp", Type.WATER, MOVE_CATEGORY.PHYSICAL, 35, 85, 15, "", "Traps opponent, damaging them for 4-5 turns.", 100, 1],
	[Moves.SWIFT, "Swift", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 60, 999, 20, "TM32", "Ignores Accuracy and Evasiveness.", -1, 1],
	[Moves.SKULL_BASH, "Skull Bash", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 130, 100, 10, "", "Raises Defense on first turn, attacks on second.", 100, 1],
	[Moves.SPIKE_CANNON, "Spike Cannon", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 20, 100, 15, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.CONSTRICT, "Constrict", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 10, 100, 35, "", "May lower opponent's Speed by one stage.", 10, 1],
	[Moves.AMNESIA, "Amnesia", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM128", "Sharply raises user's Special Defense.", -1, 1],
	[Moves.KINESIS, "Kinesis", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, 80, 15, "", "Lowers opponent's Accuracy.", -1, 1],
	[Moves.SOFT_BOILED, "Soft-Boiled", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers half its max HP.", -1, 1],
	[Moves.HIGH_JUMP_KICK, "High Jump Kick", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 130, 90, 10, "", "If it misses, the user loses half their HP.", -1, 1],
	[Moves.GLARE, "Glare", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 30, "", "Paralyzes opponent.", -1, 1],
	[Moves.DREAM_EATER, "Dream Eater", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 100, 100, 15, "", "User recovers half the HP inflicted on a sleeping opponent.", -1, 1],
	[Moves.POISON_GAS, "Poison Gas", Type.POISON, MOVE_CATEGORY.STATUS, -1, 90, 40, "", "Poisons opponent.", -1, 1],
	[Moves.BARRAGE, "Barrage", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 15, 85, 20, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.LEECH_LIFE, "Leech Life", Type.BUG, MOVE_CATEGORY.PHYSICAL, 80, 100, 10, "TM95", "User recovers half the HP inflicted on opponent.", -1, 1],
	[Moves.LOVELY_KISS, "Lovely Kiss", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 75, 10, "", "Puts opponent to sleep.", -1, 1],
	[Moves.SKY_ATTACK, "Sky Attack", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 140, 90, 5, "", "Charges on first turn, attacks on second. May cause flinching. High critical hit ratio.", 30, 1],
	[Moves.TRANSFORM, "Transform", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User takes on the form and attacks of the opponent.", -1, 1],
	[Moves.BUBBLE, "Bubble", Type.WATER, MOVE_CATEGORY.SPECIAL, 40, 100, 30, "", "May lower opponent's Speed.", 10, 1],
	[Moves.DIZZY_PUNCH, "Dizzy Punch", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 10, "", "May confuse opponent.", 20, 1],
	[Moves.SPORE, "Spore", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Puts opponent to sleep.", -1, 1],
	[Moves.FLASH, "Flash", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Lowers opponent's Accuracy.", -1, 1],
	[Moves.PSYWAVE, "Psywave", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, -1, 100, 15, "", "Inflicts damage 50-150% of user's level.", -1, 1],
	[Moves.SPLASH, "Splash", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Doesn't do ANYTHING.", -1, 1],
	[Moves.ACID_ARMOR, "Acid Armor", Type.POISON, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Sharply raises user's Defense.", -1, 1],
	[Moves.CRABHAMMER, "Crabhammer", Type.WATER, MOVE_CATEGORY.PHYSICAL, 100, 90, 10, "", "High critical hit ratio.", -1, 1],
	[Moves.EXPLOSION, "Explosion", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 250, 100, 5, "", "User faints.", -1, 1],
	[Moves.FURY_SWIPES, "Fury Swipes", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 18, 80, 15, "", "Hits 2-5 times in one turn.", -1, 1],
	[Moves.BONEMERANG, "Bonemerang", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 50, 90, 10, "", "Hits twice in one turn.", -1, 1],
	[Moves.REST, "Rest", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 5, "TM85", "User sleeps for 2 turns, but user is fully healed.", -1, 1],
	[Moves.ROCK_SLIDE, "Rock Slide", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 75, 90, 10, "TM86", "May cause flinching.", 30, 1],
	[Moves.HYPER_FANG, "Hyper Fang", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 80, 90, 15, "", "May cause flinching.", 10, 1],
	[Moves.SHARPEN, "Sharpen", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Raises user's Attack.", -1, 1],
	[Moves.CONVERSION, "Conversion", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Changes user's type to that of its first move.", -1, 1],
	[Moves.TRI_ATTACK, "Tri Attack", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "", "May paralyze, burn or freeze opponent.", 20, 1],
	[Moves.SUPER_FANG, "Super Fang", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 90, 10, "", "Always takes off half of the opponent's HP.", -1, 1],
	[Moves.SLASH, "Slash", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "", "High critical hit ratio.", -1, 1],
	[Moves.SUBSTITUTE, "Substitute", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM103", "Uses HP to creates a decoy that takes hits.", -1, 1],
	[Moves.STRUGGLE, "Struggle", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 50, -1, -1, "", "Only usable when all PP are gone. Hurts the user.", -1, 1],
	[Moves.SKETCH, "Sketch", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 1, "", "Permanently copies the opponent's last move.", -1, 2],
	[Moves.TRIPLE_KICK, "Triple Kick", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 10, 90, 10, "", "Hits thrice in one turn at increasing power.", -1, 2],
	[Moves.THIEF, "Thief", Type.DARK, MOVE_CATEGORY.PHYSICAL, 60, 100, 25, "TM18", "Also steals opponent's held item.", -1, 2],
	[Moves.SPIDER_WEB, "Spider Web", Type.BUG, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Opponent cannot escape/switch.", -1, 2],
	[Moves.MIND_READER, "Mind Reader", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User's next attack is guaranteed to hit.", -1, 2],
	[Moves.NIGHTMARE, "Nightmare", Type.GHOST, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "The sleeping opponent loses 25% of its max HP each turn.", -1, 2],
	[Moves.FLAME_WHEEL, "Flame Wheel", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 60, 100, 25, "", "May burn opponent.", 10, 2],
	[Moves.SNORE, "Snore", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 50, 100, 15, "", "Can only be used if asleep. May cause flinching.", 30, 2],
	[Moves.CURSE, "Curse", Type.GHOST, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Ghosts lose 50% of max HP and curse the opponent; Non-Ghosts raise Attack, Defense and lower Speed.", -1, 2],
	[Moves.FLAIL, "Flail", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 100, 15, "", "The lower the user's HP, the higher the power.", -1, 2],
	[Moves.CONVERSION_2, "Conversion 2", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "User changes type to become resistant to opponent's last move.", -1, 2],
	[Moves.AEROBLAST, "Aeroblast", Type.FLYING, MOVE_CATEGORY.SPECIAL, 100, 95, 5, "", "High critical hit ratio.", -1, 2],
	[Moves.COTTON_SPORE, "Cotton Spore", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 100, 40, "", "Sharply lowers opponent's Speed.", -1, 2],
	[Moves.REVERSAL, "Reversal", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, -1, 100, 15, "TM134", "The lower the user's HP, the higher the power.", -1, 2],
	[Moves.SPITE, "Spite", Type.GHOST, MOVE_CATEGORY.STATUS, -1, 100, 10, "", "The opponent's last move loses 2-5 PP.", -1, 2],
	[Moves.POWDER_SNOW, "Powder Snow", Type.ICE, MOVE_CATEGORY.SPECIAL, 40, 100, 25, "", "May freeze opponent.", 10, 2],
	[Moves.PROTECT, "Protect", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM07", "Protects the user, but may fail if used consecutively.", -1, 2],
	[Moves.MACH_PUNCH, "Mach Punch", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 40, 100, 30, "", "User attacks first.", -1, 2],
	[Moves.SCARY_FACE, "Scary Face", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 10, "TM06", "Sharply lowers opponent's Speed.", -1, 2],
	[Moves.FAINT_ATTACK, "Faint Attack", Type.DARK, MOVE_CATEGORY.PHYSICAL, 60, 999, 20, "", "Ignores Accuracy and Evasiveness.", -1, 2],
	[Moves.SWEET_KISS, "Sweet Kiss", Type.FAIRY, MOVE_CATEGORY.STATUS, -1, 75, 10, "", "Confuses opponent.", -1, 2],
	[Moves.BELLY_DRUM, "Belly Drum", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User loses 50% of its max HP, but Attack raises to maximum.", -1, 2],
	[Moves.SLUDGE_BOMB, "Sludge Bomb", Type.POISON, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM148", "May poison opponent.", 30, 2],
	[Moves.MUD_SLAP, "Mud-Slap", Type.GROUND, MOVE_CATEGORY.SPECIAL, 20, 100, 10, "TM05", "Lowers opponent's Accuracy.", 100, 2],
	[Moves.OCTAZOOKA, "Octazooka", Type.WATER, MOVE_CATEGORY.SPECIAL, 65, 85, 10, "", "May lower opponent's Accuracy.", 50, 2],
	[Moves.SPIKES, "Spikes", Type.GROUND, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM90", "Hurts opponents when they switch into battle.", -1, 2],
	[Moves.ZAP_CANNON, "Zap Cannon", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 120, 50, 5, "", "Paralyzes opponent.", 100, 2],
	[Moves.FORESIGHT, "Foresight", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Resets opponent's Evasiveness, and allows Normal- and Fighting-type attacks to hit Ghosts.", -1, 2],
	[Moves.DESTINY_BOND, "Destiny Bond", Type.GHOST, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "If the user faints, the opponent also faints.", -1, 2],
	[Moves.PERISH_SONG, "Perish Song", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Any Pokémon in play when this attack is used faints in 3 turns.", -1, 2],
	[Moves.ICY_WIND, "Icy Wind", Type.ICE, MOVE_CATEGORY.SPECIAL, 55, 95, 15, "TM34", "Lowers opponent's Speed.", 100, 2],
	[Moves.DETECT, "Detect", Type.FIGHTING, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Protects the user, but may fail if used consecutively.", -1, 2],
	[Moves.BONE_RUSH, "Bone Rush", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 25, 90, 10, "", "Hits 2-5 times in one turn.", -1, 2],
	[Moves.LOCK_ON, "Lock-On", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User's next attack is guaranteed to hit.", -1, 2],
	[Moves.OUTRAGE, "Outrage", Type.DRAGON, MOVE_CATEGORY.PHYSICAL, 120, 100, 10, "TM156", "User attacks for 2-3 turns but then becomes confused.", -1, 2],
	[Moves.SANDSTORM, "Sandstorm", Type.ROCK, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM51", "Creates a sandstorm for 5 turns.", -1, 2],
	[Moves.GIGA_DRAIN, "Giga Drain", Type.GRASS, MOVE_CATEGORY.SPECIAL, 75, 100, 10, "TM111", "User recovers half the HP inflicted on opponent.", -1, 2],
	[Moves.ENDURE, "Endure", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM47", "Always left with at least 1 HP, but may fail if used consecutively.", -1, 2],
	[Moves.CHARM, "Charm", Type.FAIRY, MOVE_CATEGORY.STATUS, -1, 100, 20, "TM02", "Sharply lowers opponent's Attack.", -1, 2],
	[Moves.ROLLOUT, "Rollout", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 30, 90, 20, "", "Doubles in power each turn for 5 turns.", -1, 2],
	[Moves.FALSE_SWIPE, "False Swipe", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 40, "TM57", "Always leaves opponent with at least 1 HP.", -1, 2],
	[Moves.SWAGGER, "Swagger", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 85, 15, "", "Confuses opponent, but sharply raises its Attack.", -1, 2],
	[Moves.MILK_DRINK, "Milk Drink", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers half its max HP.", -1, 2],
	[Moves.SPARK, "Spark", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 65, 100, 20, "", "May paralyze opponent.", 30, 2],
	[Moves.FURY_CUTTER, "Fury Cutter", Type.BUG, MOVE_CATEGORY.PHYSICAL, 40, 95, 20, "", "Power increases each turn.", -1, 2],
	[Moves.STEEL_WING, "Steel Wing", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 70, 90, 25, "", "May raise user's Defense.", 10, 2],
	[Moves.MEAN_LOOK, "Mean Look", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Opponent cannot flee or switch.", -1, 2],
	[Moves.ATTRACT, "Attract", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "If opponent is the opposite gender, it's less likely to attack.", -1, 2],
	[Moves.SLEEP_TALK, "Sleep Talk", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM70", "User performs one of its own moves while sleeping.", -1, 2],
	[Moves.HEAL_BELL, "Heal Bell", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Heals the user's party's status conditions.", -1, 2],
	[Moves.RETURN, "Return", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 100, 20, "", "Power increases with higher Friendship.", -1, 2],
	[Moves.PRESENT, "Present", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 90, 15, "", "Either deals damage or heals.", -1, 2],
	[Moves.FRUSTRATION, "Frustration", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 100, 20, "", "Power decreases with higher Friendship.", -1, 2],
	[Moves.SAFEGUARD, "Safeguard", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 25, "", "The user's party is protected from status conditions.", -1, 2],
	[Moves.PAIN_SPLIT, "Pain Split", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "The user's and opponent's HP becomes the average of both.", -1, 2],
	[Moves.SACRED_FIRE, "Sacred Fire", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 100, 95, 5, "", "May burn opponent.", 50, 2],
	[Moves.MAGNITUDE, "Magnitude", Type.GROUND, MOVE_CATEGORY.PHYSICAL, -1, 100, 30, "", "Hits with random power.", -1, 2],
	[Moves.DYNAMIC_PUNCH, "Dynamic Punch", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 100, 50, 5, "", "Confuses opponent.", 100, 2],
	[Moves.MEGAHORN, "Megahorn", Type.BUG, MOVE_CATEGORY.PHYSICAL, 120, 85, 10, "", "", -1, 2],
	[Moves.DRAGON_BREATH, "Dragon Breath", Type.DRAGON, MOVE_CATEGORY.SPECIAL, 60, 100, 20, "", "May paralyze opponent.", 30, 2],
	[Moves.BATON_PASS, "Baton Pass", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 40, "TM132", "User switches out and gives stat changes to the incoming Pokémon.", -1, 2],
	[Moves.ENCORE, "Encore", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 5, "TM122", "Forces opponent to keep using its last move for 3 turns.", -1, 2],
	[Moves.PURSUIT, "Pursuit", Type.DARK, MOVE_CATEGORY.PHYSICAL, 40, 100, 20, "", "Double power if the opponent is switching out.", -1, 2],
	[Moves.RAPID_SPIN, "Rapid Spin", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 50, 100, 40, "", "Raises user's Speed and removes entry hazards and trap move effects.", 100, 2],
	[Moves.SWEET_SCENT, "Sweet Scent", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Lowers opponent's Evasiveness.", -1, 2],
	[Moves.IRON_TAIL, "Iron Tail", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 100, 75, 15, "", "May lower opponent's Defense.", 30, 2],
	[Moves.METAL_CLAW, "Metal Claw", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 50, 95, 35, "TM31", "May raise user's Attack.", 10, 2],
	[Moves.VITAL_THROW, "Vital Throw", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 70, 999, 10, "", "User attacks last, but ignores Accuracy and Evasiveness.", -1, 2],
	[Moves.MORNING_SUN, "Morning Sun", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers HP. Amount varies with the weather.", -1, 2],
	[Moves.SYNTHESIS, "Synthesis", Type.GRASS, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers HP. Amount varies with the weather.", -1, 2],
	[Moves.MOONLIGHT, "Moonlight", Type.FAIRY, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers HP. Amount varies with the weather.", -1, 2],
	[Moves.HIDDEN_POWER, "Hidden Power", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 60, 100, 15, "", "Type and power depends on user's IVs.", -1, 2],
	[Moves.CROSS_CHOP, "Cross Chop", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 100, 80, 5, "", "High critical hit ratio.", -1, 2],
	[Moves.TWISTER, "Twister", Type.DRAGON, MOVE_CATEGORY.SPECIAL, 40, 100, 20, "", "May cause flinching. Hits Pokémon using Fly/Bounce with double power.", 20, 2],
	[Moves.RAIN_DANCE, "Rain Dance", Type.WATER, MOVE_CATEGORY.STATUS, -1, -1, 5, "TM50", "Makes it rain for 5 turns.", -1, 2],
	[Moves.SUNNY_DAY, "Sunny Day", Type.FIRE, MOVE_CATEGORY.STATUS, -1, -1, 5, "TM49", "Makes it sunny for 5 turns.", -1, 2],
	[Moves.CRUNCH, "Crunch", Type.DARK, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "TM108", "May lower opponent's Defense.", 20, 2],
	[Moves.MIRROR_COAT, "Mirror Coat", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, -1, 100, 20, "", "When hit by a Special Attack, user strikes back with 2x power.", -1, 2],
	[Moves.PSYCH_UP, "Psych Up", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Copies the opponent's stat changes.", -1, 2],
	[Moves.EXTREME_SPEED, "Extreme Speed", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 80, 100, 5, "", "User attacks first.", -1, 2],
	[Moves.ANCIENT_POWER, "Ancient Power", Type.ROCK, MOVE_CATEGORY.SPECIAL, 60, 100, 5, "", "May raise all user's stats at once.", 10, 2],
	[Moves.SHADOW_BALL, "Shadow Ball", Type.GHOST, MOVE_CATEGORY.SPECIAL, 80, 100, 15, "TM114", "May lower opponent's Special Defense.", 20, 2],
	[Moves.FUTURE_SIGHT, "Future Sight", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 120, 100, 10, "", "Damage occurs 2 turns later.", -1, 2],
	[Moves.ROCK_SMASH, "Rock Smash", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 40, 100, 15, "", "May lower opponent's Defense.", 50, 2],
	[Moves.WHIRLPOOL, "Whirlpool", Type.WATER, MOVE_CATEGORY.SPECIAL, 35, 85, 15, "", "Traps opponent, damaging them for 4-5 turns.", 100, 2],
	[Moves.BEAT_UP, "Beat Up", Type.DARK, MOVE_CATEGORY.PHYSICAL, -1, 100, 10, "", "Each Pokémon in user's party attacks.", -1, 2],
	[Moves.FAKE_OUT, "Fake Out", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 40, 100, 10, "", "User attacks first, foe flinches. Only usable on first turn.", 100, 3],
	[Moves.UPROAR, "Uproar", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "", "User attacks for 3 turns and prevents sleep.", -1, 3],
	[Moves.STOCKPILE, "Stockpile", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Stores energy for use with Spit Up and Swallow.", -1, 3],
	[Moves.SPIT_UP, "Spit Up", Type.NORMAL, MOVE_CATEGORY.SPECIAL, -1, 100, 10, "", "Power depends on how many times the user performed Stockpile.", -1, 3],
	[Moves.SWALLOW, "Swallow", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "The more times the user has performed Stockpile, the more HP is recovered.", -1, 3],
	[Moves.HEAT_WAVE, "Heat Wave", Type.FIRE, MOVE_CATEGORY.SPECIAL, 95, 90, 10, "TM118", "May burn opponent.", 10, 3],
	[Moves.HAIL, "Hail", Type.ICE, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Non-Ice types are damaged for 5 turns.", -1, 3],
	[Moves.TORMENT, "Torment", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Opponent cannot use the same move in a row.", -1, 3],
	[Moves.FLATTER, "Flatter", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Confuses opponent, but raises its Special Attack.", -1, 3],
	[Moves.WILL_O_WISP, "Will-O-Wisp", Type.FIRE, MOVE_CATEGORY.STATUS, -1, 85, 15, "TM107", "Burns opponent.", -1, 3],
	[Moves.MEMENTO, "Memento", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 10, "", "User faints, sharply lowers opponent's Attack and Special Attack.", -1, 3],
	[Moves.FACADE, "Facade", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "TM25", "Power doubles if user is burned, poisoned, or paralyzed.", -1, 3],
	[Moves.FOCUS_PUNCH, "Focus Punch", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 150, 100, 20, "", "If the user is hit before attacking, it flinches instead.", -1, 3],
	[Moves.SMELLING_SALTS, "Smelling Salts", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 10, "", "Power doubles if opponent is paralyzed, but cures it.", -1, 3],
	[Moves.FOLLOW_ME, "Follow Me", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "In Double Battle, the user takes all the attacks.", -1, 3],
	[Moves.NATURE_POWER, "Nature Power", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Uses a certain move based on the current terrain.", -1, 3],
	[Moves.CHARGE, "Charge", Type.ELECTRIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Raises user's Special Defense and next Electric move's power increases.", -1, 3],
	[Moves.TAUNT, "Taunt", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 20, "TM87", "Opponent can only use moves that attack.", -1, 3],
	[Moves.HELPING_HAND, "Helping Hand", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM130", "In Double Battles, boosts the power of the partner's move.", -1, 3],
	[Moves.TRICK, "Trick", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, 100, 10, "TM109", "Swaps held items with the opponent.", -1, 3],
	[Moves.ROLE_PLAY, "Role Play", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User copies the opponent's Ability.", -1, 3],
	[Moves.WISH, "Wish", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "The user recovers HP in the following turn.", -1, 3],
	[Moves.ASSIST, "Assist", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "User performs a move known by its allies at random.", -1, 3],
	[Moves.INGRAIN, "Ingrain", Type.GRASS, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "User restores HP each turn. User cannot escape/switch.", -1, 3],
	[Moves.SUPERPOWER, "Superpower", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 120, 100, 5, "", "Lowers user's Attack and Defense.", 100, 3],
	[Moves.MAGIC_COAT, "Magic Coat", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Reflects moves that cause status conditions back to the attacker.", -1, 3],
	[Moves.RECYCLE, "Recycle", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User's used hold item is restored.", -1, 3],
	[Moves.REVENGE, "Revenge", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 60, 100, 10, "", "Power increases if user was hit first.", -1, 3],
	[Moves.BRICK_BREAK, "Brick Break", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 75, 100, 15, "TM58", "Breaks through Reflect and Light Screen barriers.", -1, 3],
	[Moves.YAWN, "Yawn", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Puts opponent to sleep in the next turn.", -1, 3],
	[Moves.KNOCK_OFF, "Knock Off", Type.DARK, MOVE_CATEGORY.PHYSICAL, 65, 100, 20, "", "Removes opponent's held item for the rest of the battle.", -1, 3],
	[Moves.ENDEAVOR, "Endeavor", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 100, 5, "", "Reduces opponent's HP to same as user's.", -1, 3],
	[Moves.ERUPTION, "Eruption", Type.FIRE, MOVE_CATEGORY.SPECIAL, 150, 100, 5, "", "Stronger when the user's HP is higher.", -1, 3],
	[Moves.SKILL_SWAP, "Skill Swap", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM98", "The user swaps Abilities with the opponent.", -1, 3],
	[Moves.IMPRISON, "Imprison", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "TM92", "Opponent is unable to use moves that the user also knows.", -1, 3],
	[Moves.REFRESH, "Refresh", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Cures paralysis, poison, and burns.", -1, 3],
	[Moves.GRUDGE, "Grudge", Type.GHOST, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "If the users faints after using this move, the PP for the opponent's last move is depleted.", -1, 3],
	[Moves.SNATCH, "Snatch", Type.DARK, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Steals the effects of the opponent's next move.", -1, 3],
	[Moves.SECRET_POWER, "Secret Power", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "", "Effects of the attack vary with the location.", 30, 3],
	[Moves.DIVE, "Dive", Type.WATER, MOVE_CATEGORY.PHYSICAL, 80, 100, 10, "", "Dives underwater on first turn, attacks on second turn.", -1, 3],
	[Moves.ARM_THRUST, "Arm Thrust", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 15, 100, 20, "", "Hits 2-5 times in one turn.", -1, 3],
	[Moves.CAMOUFLAGE, "Camouflage", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Changes user's type according to the location.", -1, 3],
	[Moves.TAIL_GLOW, "Tail Glow", Type.BUG, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Drastically raises user's Special Attack.", -1, 3],
	[Moves.LUSTER_PURGE, "Luster Purge", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 70, 100, 5, "", "May lower opponent's Special Defense.", 50, 3],
	[Moves.MIST_BALL, "Mist Ball", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 70, 100, 5, "", "May lower opponent's Special Attack.", 50, 3],
	[Moves.FEATHER_DANCE, "Feather Dance", Type.FLYING, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Sharply lowers opponent's Attack.", -1, 3],
	[Moves.TEETER_DANCE, "Teeter Dance", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Confuses all Pokémon.", -1, 3],
	[Moves.BLAZE_KICK, "Blaze Kick", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 85, 90, 10, "", "High critical hit ratio. May burn opponent.", 10, 3],
	[Moves.MUD_SPORT, "Mud Sport", Type.GROUND, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Weakens the power of Electric-type moves.", -1, 3],
	[Moves.ICE_BALL, "Ice Ball", Type.ICE, MOVE_CATEGORY.PHYSICAL, 30, 90, 20, "", "Doubles in power each turn for 5 turns.", -1, 3],
	[Moves.NEEDLE_ARM, "Needle Arm", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 60, 100, 15, "", "May cause flinching.", 30, 3],
	[Moves.SLACK_OFF, "Slack Off", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers half its max HP.", -1, 3],
	[Moves.HYPER_VOICE, "Hyper Voice", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM117", "", -1, 3],
	[Moves.POISON_FANG, "Poison Fang", Type.POISON, MOVE_CATEGORY.PHYSICAL, 50, 100, 15, "", "May badly poison opponent.", 50, 3],
	[Moves.CRUSH_CLAW, "Crush Claw", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 75, 95, 10, "", "May lower opponent's Defense.", 50, 3],
	[Moves.BLAST_BURN, "Blast Burn", Type.FIRE, MOVE_CATEGORY.SPECIAL, 150, 90, 5, "TM153", "User must recharge next turn.", -1, 3],
	[Moves.HYDRO_CANNON, "Hydro Cannon", Type.WATER, MOVE_CATEGORY.SPECIAL, 150, 90, 5, "TM154", "User must recharge next turn.", -1, 3],
	[Moves.METEOR_MASH, "Meteor Mash", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 90, 90, 10, "", "May raise user's Attack.", 20, 3],
	[Moves.ASTONISH, "Astonish", Type.GHOST, MOVE_CATEGORY.PHYSICAL, 30, 100, 15, "", "May cause flinching.", 30, 3],
	[Moves.WEATHER_BALL, "Weather Ball", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 50, 100, 10, "", "Move's power and type changes with the weather.", -1, 3],
	[Moves.AROMATHERAPY, "Aromatherapy", Type.GRASS, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Cures all status problems in your party.", -1, 3],
	[Moves.FAKE_TEARS, "Fake Tears", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 20, "TM03", "Sharply lowers opponent's Special Defense.", -1, 3],
	[Moves.AIR_CUTTER, "Air Cutter", Type.FLYING, MOVE_CATEGORY.SPECIAL, 60, 95, 25, "TM40", "High critical hit ratio.", -1, 3],
	[Moves.OVERHEAT, "Overheat", Type.FIRE, MOVE_CATEGORY.SPECIAL, 130, 90, 5, "TM157", "Sharply lowers user's Special Attack.", 100, 3],
	[Moves.ODOR_SLEUTH, "Odor Sleuth", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Resets opponent's Evasiveness, and allows Normal- and Fighting-type attacks to hit Ghosts.", -1, 3],
	[Moves.ROCK_TOMB, "Rock Tomb", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 60, 95, 15, "TM36", "Lowers opponent's Speed.", 100, 3],
	[Moves.SILVER_WIND, "Silver Wind", Type.BUG, MOVE_CATEGORY.SPECIAL, 60, 100, 5, "", "May raise all stats of user at once.", 10, 3],
	[Moves.METAL_SOUND, "Metal Sound", Type.STEEL, MOVE_CATEGORY.STATUS, -1, 85, 40, "", "Sharply lowers opponent's Special Defense.", -1, 3],
	[Moves.GRASS_WHISTLE, "Grass Whistle", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 55, 15, "", "Puts opponent to sleep.", -1, 3],
	[Moves.TICKLE, "Tickle", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Lowers opponent's Attack and Defense.", -1, 3],
	[Moves.COSMIC_POWER, "Cosmic Power", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Raises user's Defense and Special Defense.", -1, 3],
	[Moves.WATER_SPOUT, "Water Spout", Type.WATER, MOVE_CATEGORY.SPECIAL, 150, 100, 5, "", "The higher the user's HP, the higher the damage caused.", -1, 3],
	[Moves.SIGNAL_BEAM, "Signal Beam", Type.BUG, MOVE_CATEGORY.SPECIAL, 75, 100, 15, "", "May confuse opponent.", 10, 3],
	[Moves.SHADOW_PUNCH, "Shadow Punch", Type.GHOST, MOVE_CATEGORY.PHYSICAL, 60, 999, 20, "", "Ignores Accuracy and Evasiveness.", -1, 3],
	[Moves.EXTRASENSORY, "Extrasensory", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 80, 100, 20, "", "May cause flinching.", 10, 3],
	[Moves.SKY_UPPERCUT, "Sky Uppercut", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 85, 90, 15, "", "Hits the opponent, even during Fly.", -1, 3],
	[Moves.SAND_TOMB, "Sand Tomb", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 35, 85, 15, "", "Traps opponent, damaging them for 4-5 turns.", 100, 3],
	[Moves.SHEER_COLD, "Sheer Cold", Type.ICE, MOVE_CATEGORY.SPECIAL, -1, 30, 5, "", "One-Hit-KO, if it hits.", -1, 3],
	[Moves.MUDDY_WATER, "Muddy Water", Type.WATER, MOVE_CATEGORY.SPECIAL, 90, 85, 10, "", "May lower opponent's Accuracy.", 30, 3],
	[Moves.BULLET_SEED, "Bullet Seed", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 25, 100, 30, "TM56", "Hits 2-5 times in one turn.", -1, 3],
	[Moves.AERIAL_ACE, "Aerial Ace", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 60, 999, 20, "TM27", "Ignores Accuracy and Evasiveness.", -1, 3],
	[Moves.ICICLE_SPEAR, "Icicle Spear", Type.ICE, MOVE_CATEGORY.PHYSICAL, 25, 100, 30, "", "Hits 2-5 times in one turn.", -1, 3],
	[Moves.IRON_DEFENSE, "Iron Defense", Type.STEEL, MOVE_CATEGORY.STATUS, -1, -1, 15, "TM104", "Sharply raises user's Defense.", -1, 3],
	[Moves.BLOCK, "Block", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Opponent cannot flee or switch.", -1, 3],
	[Moves.HOWL, "Howl", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Raises Attack of allies.", -1, 3],
	[Moves.DRAGON_CLAW, "Dragon Claw", Type.DRAGON, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "TM78", "", -1, 3],
	[Moves.FRENZY_PLANT, "Frenzy Plant", Type.GRASS, MOVE_CATEGORY.SPECIAL, 150, 90, 5, "TM155", "User must recharge next turn.", -1, 3],
	[Moves.BULK_UP, "Bulk Up", Type.FIGHTING, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM64", "Raises user's Attack and Defense.", -1, 3],
	[Moves.BOUNCE, "Bounce", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 85, 85, 5, "", "Springs up on first turn, attacks on second. May paralyze opponent.", 30, 3],
	[Moves.MUD_SHOT, "Mud Shot", Type.GROUND, MOVE_CATEGORY.SPECIAL, 55, 95, 15, "TM35", "Lowers opponent's Speed.", 100, 3],
	[Moves.POISON_TAIL, "Poison Tail", Type.POISON, MOVE_CATEGORY.PHYSICAL, 50, 100, 25, "TM26", "High critical hit ratio. May poison opponent.", 10, 3],
	[Moves.COVET, "Covet", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 60, 100, 25, "", "Opponent's item is stolen by the user.", -1, 3],
	[Moves.VOLT_TACKLE, "Volt Tackle", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 120, 100, 15, "", "User receives recoil damage. May paralyze opponent.", 10, 3],
	[Moves.MAGICAL_LEAF, "Magical Leaf", Type.GRASS, MOVE_CATEGORY.SPECIAL, 60, 999, 20, "TM33", "Ignores Accuracy and Evasiveness.", -1, 3],
	[Moves.WATER_SPORT, "Water Sport", Type.WATER, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Weakens the power of Fire-type moves.", -1, 3],
	[Moves.CALM_MIND, "Calm Mind", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM129", "Raises user's Special Attack and Special Defense.", -1, 3],
	[Moves.LEAF_BLADE, "Leaf Blade", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 90, 100, 15, "", "High critical hit ratio.", -1, 3],
	[Moves.DRAGON_DANCE, "Dragon Dance", Type.DRAGON, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM100", "Raises user's Attack and Speed.", -1, 3],
	[Moves.ROCK_BLAST, "Rock Blast", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 25, 90, 10, "TM76", "Hits 2-5 times in one turn.", -1, 3],
	[Moves.SHOCK_WAVE, "Shock Wave", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 60, 999, 20, "", "Ignores Accuracy and Evasiveness.", -1, 3],
	[Moves.WATER_PULSE, "Water Pulse", Type.WATER, MOVE_CATEGORY.SPECIAL, 60, 100, 20, "TM11", "May confuse opponent.", 20, 3],
	[Moves.DOOM_DESIRE, "Doom Desire", Type.STEEL, MOVE_CATEGORY.SPECIAL, 140, 100, 5, "", "Damage occurs 2 turns later.", -1, 3],
	[Moves.PSYCHO_BOOST, "Psycho Boost", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 140, 90, 5, "", "Sharply lowers user's Special Attack.", 100, 3],
	[Moves.ROOST, "Roost", Type.FLYING, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "User recovers half of its max HP and loses the Flying type temporarily.", -1, 4],
	[Moves.GRAVITY, "Gravity", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 5, "", "Prevents moves like Fly and Bounce and the Ability Levitate for 5 turns.", -1, 4],
	[Moves.MIRACLE_EYE, "Miracle Eye", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 40, "", "Resets opponent's Evasiveness, removes Dark's Psychic immunity.", -1, 4],
	[Moves.WAKE_UP_SLAP, "Wake-Up Slap", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 70, 100, 10, "", "Power doubles if opponent is asleep, but wakes it up.", -1, 4],
	[Moves.HAMMER_ARM, "Hammer Arm", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 100, 90, 10, "", "Lowers user's Speed.", 100, 4],
	[Moves.GYRO_BALL, "Gyro Ball", Type.STEEL, MOVE_CATEGORY.PHYSICAL, -1, 100, 5, "", "The slower the user, the stronger the attack.", -1, 4],
	[Moves.HEALING_WISH, "Healing Wish", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "The user faints and the next Pokémon released is fully healed.", -1, 4],
	[Moves.BRINE, "Brine", Type.WATER, MOVE_CATEGORY.SPECIAL, 65, 100, 10, "", "Power doubles if opponent's HP is less than 50%.", -1, 4],
	[Moves.NATURAL_GIFT, "Natural Gift", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 100, 15, "", "Power and type depend on the user's held berry.", -1, 4],
	[Moves.FEINT, "Feint", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 30, 100, 10, "", "Only hits if opponent uses Protect or Detect in the same turn.", -1, 4],
	[Moves.PLUCK, "Pluck", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 60, 100, 20, "", "If the opponent is holding a berry, its effect is stolen by user.", -1, 4],
	[Moves.TAILWIND, "Tailwind", Type.FLYING, MOVE_CATEGORY.STATUS, -1, -1, 15, "TM113", "Doubles Speed for 4 turns.", -1, 4],
	[Moves.ACUPRESSURE, "Acupressure", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Sharply raises a random stat.", -1, 4],
	[Moves.METAL_BURST, "Metal Burst", Type.STEEL, MOVE_CATEGORY.PHYSICAL, -1, 100, 10, "", "Deals damage equal to 1.5x opponent's attack.", -1, 4],
	[Moves.U_TURN, "U-turn", Type.BUG, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "TM60", "User switches out immediately after attacking.", -1, 4],
	[Moves.CLOSE_COMBAT, "Close Combat", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 120, 100, 5, "TM167", "Lowers user's Defense and Special Defense.", 100, 4],
	[Moves.PAYBACK, "Payback", Type.DARK, MOVE_CATEGORY.PHYSICAL, 50, 100, 10, "", "Power doubles if the user was attacked first.", -1, 4],
	[Moves.ASSURANCE, "Assurance", Type.DARK, MOVE_CATEGORY.PHYSICAL, 60, 100, 10, "", "Power doubles if opponent already took damage in the same turn.", -1, 4],
	[Moves.EMBARGO, "Embargo", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Opponent cannot use items.", -1, 4],
	[Moves.FLING, "Fling", Type.DARK, MOVE_CATEGORY.PHYSICAL, -1, 100, 10, "TM43", "Power depends on held item.", -1, 4],
	[Moves.PSYCHO_SHIFT, "Psycho Shift", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, 100, 10, "", "Transfers user's status condition to the opponent.", -1, 4],
	[Moves.TRUMP_CARD, "Trump Card", Type.NORMAL, MOVE_CATEGORY.SPECIAL, -1, 999, 5, "", "The lower the PP, the higher the power.", -1, 4],
	[Moves.HEAL_BLOCK, "Heal Block", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Prevents the opponent from restoring HP for 5 turns.", -1, 4],
	[Moves.WRING_OUT, "Wring Out", Type.NORMAL, MOVE_CATEGORY.SPECIAL, -1, 100, 5, "", "The higher the opponent's HP, the higher the damage.", -1, 4],
	[Moves.POWER_TRICK, "Power Trick", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User's own Attack and Defense switch.", -1, 4],
	[Moves.GASTRO_ACID, "Gastro Acid", Type.POISON, MOVE_CATEGORY.STATUS, -1, 100, 10, "", "Cancels out the effect of the opponent's Ability.", -1, 4],
	[Moves.LUCKY_CHANT, "Lucky Chant", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Opponent cannot land critical hits for 5 turns.", -1, 4],
	[Moves.ME_FIRST, "Me First", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "User copies the opponent's attack with 1.5× power.", -1, 4],
	[Moves.COPYCAT, "Copycat", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Copies opponent's last move.", -1, 4],
	[Moves.POWER_SWAP, "Power Swap", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User and opponent swap Attack and Special Attack.", -1, 4],
	[Moves.GUARD_SWAP, "Guard Swap", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User and opponent swap Defense and Special Defense.", -1, 4],
	[Moves.PUNISHMENT, "Punishment", Type.DARK, MOVE_CATEGORY.PHYSICAL, -1, 100, 5, "", "Power increases when opponent's stats have been raised.", -1, 4],
	[Moves.LAST_RESORT, "Last Resort", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 140, 100, 5, "", "Can only be used after all other moves are used.", -1, 4],
	[Moves.WORRY_SEED, "Worry Seed", Type.GRASS, MOVE_CATEGORY.STATUS, -1, 100, 10, "", "Changes the opponent's Ability to Insomnia.", -1, 4],
	[Moves.SUCKER_PUNCH, "Sucker Punch", Type.DARK, MOVE_CATEGORY.PHYSICAL, 70, 100, 5, "", "User attacks first, but only works if opponent is readying an attack.", -1, 4],
	[Moves.TOXIC_SPIKES, "Toxic Spikes", Type.POISON, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM91", "Poisons opponents when they switch into battle.", -1, 4],
	[Moves.HEART_SWAP, "Heart Swap", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Stat changes are swapped with the opponent.", -1, 4],
	[Moves.AQUA_RING, "Aqua Ring", Type.WATER, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Restores a little HP each turn.", -1, 4],
	[Moves.MAGNET_RISE, "Magnet Rise", Type.ELECTRIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User becomes immune to Ground-type moves for 5 turns.", -1, 4],
	[Moves.FLARE_BLITZ, "Flare Blitz", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 120, 100, 15, "TM165", "User receives recoil damage. May burn opponent.", 10, 4],
	[Moves.FORCE_PALM, "Force Palm", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 60, 100, 10, "", "May paralyze opponent.", 30, 4],
	[Moves.AURA_SPHERE, "Aura Sphere", Type.FIGHTING, MOVE_CATEGORY.SPECIAL, 80, 999, 20, "TM112", "Ignores Accuracy and Evasiveness.", -1, 4],
	[Moves.ROCK_POLISH, "Rock Polish", Type.ROCK, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Sharply raises user's Speed.", -1, 4],
	[Moves.POISON_JAB, "Poison Jab", Type.POISON, MOVE_CATEGORY.PHYSICAL, 80, 100, 20, "TM83", "May poison the opponent.", 30, 4],
	[Moves.DARK_PULSE, "Dark Pulse", Type.DARK, MOVE_CATEGORY.SPECIAL, 80, 100, 15, "TM94", "May cause flinching.", 20, 4],
	[Moves.NIGHT_SLASH, "Night Slash", Type.DARK, MOVE_CATEGORY.PHYSICAL, 70, 100, 15, "", "High critical hit ratio.", -1, 4],
	[Moves.AQUA_TAIL, "Aqua Tail", Type.WATER, MOVE_CATEGORY.PHYSICAL, 90, 90, 10, "", "", -1, 4],
	[Moves.SEED_BOMB, "Seed Bomb", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "TM71", "", -1, 4],
	[Moves.AIR_SLASH, "Air Slash", Type.FLYING, MOVE_CATEGORY.SPECIAL, 75, 95, 15, "TM65", "May cause flinching.", 30, 4],
	[Moves.X_SCISSOR, "X-Scissor", Type.BUG, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "TM105", "", -1, 4],
	[Moves.BUG_BUZZ, "Bug Buzz", Type.BUG, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM162", "May lower opponent's Special Defense.", 10, 4],
	[Moves.DRAGON_PULSE, "Dragon Pulse", Type.DRAGON, MOVE_CATEGORY.SPECIAL, 85, 100, 10, "TM115", "", -1, 4],
	[Moves.DRAGON_RUSH, "Dragon Rush", Type.DRAGON, MOVE_CATEGORY.PHYSICAL, 100, 75, 10, "", "May cause flinching.", 20, 4],
	[Moves.POWER_GEM, "Power Gem", Type.ROCK, MOVE_CATEGORY.SPECIAL, 80, 100, 20, "TM101", "", -1, 4],
	[Moves.DRAIN_PUNCH, "Drain Punch", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 75, 100, 10, "TM73", "User recovers half the HP inflicted on opponent.", -1, 4],
	[Moves.VACUUM_WAVE, "Vacuum Wave", Type.FIGHTING, MOVE_CATEGORY.SPECIAL, 40, 100, 30, "", "User attacks first.", -1, 4],
	[Moves.FOCUS_BLAST, "Focus Blast", Type.FIGHTING, MOVE_CATEGORY.SPECIAL, 120, 70, 5, "TM158", "May lower opponent's Special Defense.", 10, 4],
	[Moves.ENERGY_BALL, "Energy Ball", Type.GRASS, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM119", "May lower opponent's Special Defense.", 10, 4],
	[Moves.BRAVE_BIRD, "Brave Bird", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 120, 100, 15, "TM164", "User receives recoil damage.", -1, 4],
	[Moves.EARTH_POWER, "Earth Power", Type.GROUND, MOVE_CATEGORY.SPECIAL, 90, 100, 10, "TM133", "May lower opponent's Special Defense.", 10, 4],
	[Moves.SWITCHEROO, "Switcheroo", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 10, "", "Swaps held items with the opponent.", -1, 4],
	[Moves.GIGA_IMPACT, "Giga Impact", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 150, 90, 5, "TM152", "User must recharge next turn.", -1, 4],
	[Moves.NASTY_PLOT, "Nasty Plot", Type.DARK, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM140", "Sharply raises user's Special Attack.", -1, 4],
	[Moves.BULLET_PUNCH, "Bullet Punch", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 40, 100, 30, "", "User attacks first.", -1, 4],
	[Moves.AVALANCHE, "Avalanche", Type.ICE, MOVE_CATEGORY.PHYSICAL, 60, 100, 10, "TM46", "Power doubles if user took damage first.", -1, 4],
	[Moves.ICE_SHARD, "Ice Shard", Type.ICE, MOVE_CATEGORY.PHYSICAL, 40, 100, 30, "", "User attacks first.", -1, 4],
	[Moves.SHADOW_CLAW, "Shadow Claw", Type.GHOST, MOVE_CATEGORY.PHYSICAL, 70, 100, 15, "TM61", "High critical hit ratio.", -1, 4],
	[Moves.THUNDER_FANG, "Thunder Fang", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 65, 95, 15, "TM09", "May cause flinching and/or paralyze opponent.", 10, 4],
	[Moves.ICE_FANG, "Ice Fang", Type.ICE, MOVE_CATEGORY.PHYSICAL, 65, 95, 15, "TM10", "May cause flinching and/or freeze opponent.", 10, 4],
	[Moves.FIRE_FANG, "Fire Fang", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 65, 95, 15, "TM08", "May cause flinching and/or burn opponent.", 10, 4],
	[Moves.SHADOW_SNEAK, "Shadow Sneak", Type.GHOST, MOVE_CATEGORY.PHYSICAL, 40, 100, 30, "", "User attacks first.", -1, 4],
	[Moves.MUD_BOMB, "Mud Bomb", Type.GROUND, MOVE_CATEGORY.SPECIAL, 65, 85, 10, "", "May lower opponent's Accuracy.", 30, 4],
	[Moves.PSYCHO_CUT, "Psycho Cut", Type.PSYCHIC, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "", "High critical hit ratio.", -1, 4],
	[Moves.ZEN_HEADBUTT, "Zen Headbutt", Type.PSYCHIC, MOVE_CATEGORY.PHYSICAL, 80, 90, 15, "TM59", "May cause flinching.", 20, 4],
	[Moves.MIRROR_SHOT, "Mirror Shot", Type.STEEL, MOVE_CATEGORY.SPECIAL, 65, 85, 10, "", "May lower opponent's Accuracy.", 30, 4],
	[Moves.FLASH_CANNON, "Flash Cannon", Type.STEEL, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "TM93", "May lower opponent's Special Defense.", 10, 4],
	[Moves.ROCK_CLIMB, "Rock Climb", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 90, 85, 20, "", "May confuse opponent.", 20, 4],
	[Moves.DEFOG, "Defog", Type.FLYING, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Lowers opponent's Evasiveness and clears fog.", -1, 4],
	[Moves.TRICK_ROOM, "Trick Room", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 5, "TM161", "Slower Pokémon move first in the turn for 5 turns.", -1, 4],
	[Moves.DRACO_METEOR, "Draco Meteor", Type.DRAGON, MOVE_CATEGORY.SPECIAL, 130, 90, 5, "TM169", "Sharply lowers user's Special Attack.", 100, 4],
	[Moves.DISCHARGE, "Discharge", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 80, 100, 15, "", "May paralyze opponent.", 30, 4],
	[Moves.LAVA_PLUME, "Lava Plume", Type.FIRE, MOVE_CATEGORY.SPECIAL, 80, 100, 15, "", "May burn opponent.", 30, 4],
	[Moves.LEAF_STORM, "Leaf Storm", Type.GRASS, MOVE_CATEGORY.SPECIAL, 130, 90, 5, "TM159", "Sharply lowers user's Special Attack.", 100, 4],
	[Moves.POWER_WHIP, "Power Whip", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 120, 85, 10, "", "", -1, 4],
	[Moves.ROCK_WRECKER, "Rock Wrecker", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 150, 90, 5, "", "User must recharge next turn.", -1, 4],
	[Moves.CROSS_POISON, "Cross Poison", Type.POISON, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "", "High critical hit ratio. May poison opponent.", 10, 4],
	[Moves.GUNK_SHOT, "Gunk Shot", Type.POISON, MOVE_CATEGORY.PHYSICAL, 120, 80, 5, "TM102", "May poison opponent.", 30, 4],
	[Moves.IRON_HEAD, "Iron Head", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 80, 100, 15, "TM99", "May cause flinching.", 30, 4],
	[Moves.MAGNET_BOMB, "Magnet Bomb", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 60, 999, 20, "", "Ignores Accuracy and Evasiveness.", -1, 4],
	[Moves.STONE_EDGE, "Stone Edge", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 100, 80, 5, "TM150", "High critical hit ratio.", -1, 4],
	[Moves.CAPTIVATE, "Captivate", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Sharply lowers opponent's Special Attack if opposite gender.", -1, 4],
	[Moves.STEALTH_ROCK, "Stealth Rock", Type.ROCK, MOVE_CATEGORY.STATUS, -1, -1, 20, "TM116", "Damages opponent switching into battle.", -1, 4],
	[Moves.GRASS_KNOT, "Grass Knot", Type.GRASS, MOVE_CATEGORY.SPECIAL, -1, 100, 20, "TM81", "The heavier the opponent, the stronger the attack.", -1, 4],
	[Moves.CHATTER, "Chatter", Type.FLYING, MOVE_CATEGORY.SPECIAL, 65, 100, 20, "", "Confuses opponent.", 100, 4],
	[Moves.JUDGMENT, "Judgment", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 100, 100, 10, "", "Type depends on the Arceus Plate being held.", -1, 4],
	[Moves.BUG_BITE, "Bug Bite", Type.BUG, MOVE_CATEGORY.PHYSICAL, 60, 100, 20, "", "Receives the effect from the opponent's held berry.", -1, 4],
	[Moves.CHARGE_BEAM, "Charge Beam", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 50, 90, 10, "TM23", "May raise user's Special Attack.", 70, 4],
	[Moves.WOOD_HAMMER, "Wood Hammer", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 120, 100, 15, "", "User receives recoil damage.", -1, 4],
	[Moves.AQUA_JET, "Aqua Jet", Type.WATER, MOVE_CATEGORY.PHYSICAL, 40, 100, 20, "", "User attacks first.", -1, 4],
	[Moves.ATTACK_ORDER, "Attack Order", Type.BUG, MOVE_CATEGORY.PHYSICAL, 90, 100, 15, "", "High critical hit ratio.", -1, 4],
	[Moves.DEFEND_ORDER, "Defend Order", Type.BUG, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Raises user's Defense and Special Defense.", -1, 4],
	[Moves.HEAL_ORDER, "Heal Order", Type.BUG, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "User recovers half its max HP.", -1, 4],
	[Moves.HEAD_SMASH, "Head Smash", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 150, 80, 5, "", "User receives recoil damage.", -1, 4],
	[Moves.DOUBLE_HIT, "Double Hit", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 35, 90, 10, "", "Hits twice in one turn.", -1, 4],
	[Moves.ROAR_OF_TIME, "Roar of Time", Type.DRAGON, MOVE_CATEGORY.SPECIAL, 150, 90, 5, "", "User must recharge next turn.", -1, 4],
	[Moves.SPACIAL_REND, "Spacial Rend", Type.DRAGON, MOVE_CATEGORY.SPECIAL, 100, 95, 5, "", "High critical hit ratio.", -1, 4],
	[Moves.LUNAR_DANCE, "Lunar Dance", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "The user faints but the next Pokémon released is fully healed.", -1, 4],
	[Moves.CRUSH_GRIP, "Crush Grip", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, -1, 100, 5, "", "More powerful when opponent has higher HP.", -1, 4],
	[Moves.MAGMA_STORM, "Magma Storm", Type.FIRE, MOVE_CATEGORY.SPECIAL, 100, 75, 5, "", "Traps opponent, damaging them for 4-5 turns.", 100, 4],
	[Moves.DARK_VOID, "Dark Void", Type.DARK, MOVE_CATEGORY.STATUS, -1, 50, 10, "", "Puts all adjacent opponents to sleep.", -1, 4],
	[Moves.SEED_FLARE, "Seed Flare", Type.GRASS, MOVE_CATEGORY.SPECIAL, 120, 85, 5, "", "May lower opponent's Special Defense.", 40, 4],
	[Moves.OMINOUS_WIND, "Ominous Wind", Type.GHOST, MOVE_CATEGORY.SPECIAL, 60, 100, 5, "", "May raise all user's stats at once.", 10, 4],
	[Moves.SHADOW_FORCE, "Shadow Force", Type.GHOST, MOVE_CATEGORY.PHYSICAL, 120, 100, 5, "", "Disappears on first turn, attacks on second. Can strike through Protect/Detect.", -1, 4],
	[Moves.HONE_CLAWS, "Hone Claws", Type.DARK, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Raises user's Attack and Accuracy.", -1, 5],
	[Moves.WIDE_GUARD, "Wide Guard", Type.ROCK, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Protects the user's team from multi-target attacks.", -1, 5],
	[Moves.GUARD_SPLIT, "Guard Split", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Averages Defense and Special Defense with the target.", -1, 5],
	[Moves.POWER_SPLIT, "Power Split", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Averages Attack and Special Attack with the target.", -1, 5],
	[Moves.WONDER_ROOM, "Wonder Room", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Swaps every Pokémon's Defense and Special Defense for 5 turns.", -1, 5],
	[Moves.PSYSHOCK, "Psyshock", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "TM54", "Inflicts damage based on the target's Defense, not Special Defense.", -1, 5],
	[Moves.VENOSHOCK, "Venoshock", Type.POISON, MOVE_CATEGORY.SPECIAL, 65, 100, 10, "TM45", "Inflicts double damage if the target is poisoned.", -1, 5],
	[Moves.AUTOTOMIZE, "Autotomize", Type.STEEL, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Reduces weight and sharply raises Speed.", -1, 5],
	[Moves.RAGE_POWDER, "Rage Powder", Type.BUG, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Forces attacks to hit user, not team-mates.", -1, 5],
	[Moves.TELEKINESIS, "Telekinesis", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Ignores opponent's Evasiveness for three turns, add Ground immunity.", -1, 5],
	[Moves.MAGIC_ROOM, "Magic Room", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Suppresses the effects of held items for five turns.", -1, 5],
	[Moves.SMACK_DOWN, "Smack Down", Type.ROCK, MOVE_CATEGORY.PHYSICAL, 50, 100, 15, "", "Makes Flying-type Pokémon vulnerable to Ground moves.", 100, 5],
	[Moves.STORM_THROW, "Storm Throw", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 60, 100, 10, "", "Always results in a critical hit.", 100, 5],
	[Moves.FLAME_BURST, "Flame Burst", Type.FIRE, MOVE_CATEGORY.SPECIAL, 70, 100, 15, "", "May also injure nearby Pokémon.", -1, 5],
	[Moves.SLUDGE_WAVE, "Sludge Wave", Type.POISON, MOVE_CATEGORY.SPECIAL, 95, 100, 10, "", "May poison opponent.", 10, 5],
	[Moves.QUIVER_DANCE, "Quiver Dance", Type.BUG, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Raises user's Special Attack, Special Defense and Speed.", -1, 5],
	[Moves.HEAVY_SLAM, "Heavy Slam", Type.STEEL, MOVE_CATEGORY.PHYSICAL, -1, 100, 10, "TM121", "The heavier the user, the stronger the attack.", -1, 5],
	[Moves.SYNCHRONOISE, "Synchronoise", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 120, 100, 10, "", "Hits any Pokémon that shares a type with the user.", -1, 5],
	[Moves.ELECTRO_BALL, "Electro Ball", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, -1, 100, 10, "TM72", "The faster the user, the stronger the attack.", -1, 5],
	[Moves.SOAK, "Soak", Type.WATER, MOVE_CATEGORY.STATUS, -1, 100, 20, "", "Changes the target's type to water.", -1, 5],
	[Moves.FLAME_CHARGE, "Flame Charge", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 50, 100, 20, "TM38", "Raises user's Speed.", 100, 5],
	[Moves.COIL, "Coil", Type.POISON, MOVE_CATEGORY.STATUS, -1, -1, 20, "", "Raises user's Attack, Defense and Accuracy.", -1, 5],
	[Moves.LOW_SWEEP, "Low Sweep", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 65, 100, 20, "TM39", "Lowers opponent's Speed.", 100, 5],
	[Moves.ACID_SPRAY, "Acid Spray", Type.POISON, MOVE_CATEGORY.SPECIAL, 40, 100, 20, "TM13", "Sharply lowers opponent's Special Defense.", 100, 5],
	[Moves.FOUL_PLAY, "Foul Play", Type.DARK, MOVE_CATEGORY.PHYSICAL, 95, 100, 15, "TM62", "Uses the opponent's Attack stat.", -1, 5],
	[Moves.SIMPLE_BEAM, "Simple Beam", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Changes target's ability to Simple.", -1, 5],
	[Moves.ENTRAINMENT, "Entrainment", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Makes target's ability same as user's.", -1, 5],
	[Moves.AFTER_YOU, "After You", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Gives target priority in the next turn.", -1, 5],
	[Moves.ROUND, "Round", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 60, 100, 15, "", "Power increases if teammates use it in the same turn.", -1, 5],
	[Moves.ECHOED_VOICE, "Echoed Voice", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 40, 100, 15, "", "Power increases each turn.", -1, 5],
	[Moves.CHIP_AWAY, "Chip Away", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 20, "", "Ignores opponent's stat changes.", -1, 5],
	[Moves.CLEAR_SMOG, "Clear Smog", Type.POISON, MOVE_CATEGORY.SPECIAL, 50, -1, 15, "", "Removes all of the target's stat changes.", -1, 5],
	[Moves.STORED_POWER, "Stored Power", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 20, 100, 10, "TM41", "Power increases when user's stats have been raised.", -1, 5],
	[Moves.QUICK_GUARD, "Quick Guard", Type.FIGHTING, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Protects the user's team from high-priority moves.", -1, 5],
	[Moves.ALLY_SWITCH, "Ally Switch", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "User switches with opposite teammate.", -1, 5],
	[Moves.SCALD, "Scald", Type.WATER, MOVE_CATEGORY.SPECIAL, 80, 100, 15, "", "May burn opponent.", 30, 5],
	[Moves.SHELL_SMASH, "Shell Smash", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Sharply raises user's Attack, Special Attack and Speed but lowers Defense and Special Defense.", -1, 5],
	[Moves.HEAL_PULSE, "Heal Pulse", Type.PSYCHIC, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Restores half the target's max HP.", -1, 5],
	[Moves.HEX, "Hex", Type.GHOST, MOVE_CATEGORY.SPECIAL, 65, 100, 10, "TM29", "Inflicts more damage if the target has a status condition.", -1, 5],
	[Moves.SKY_DROP, "Sky Drop", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 60, 100, 10, "", "Takes opponent into the air on first turn, drops them on second turn.", -1, 5],
	[Moves.SHIFT_GEAR, "Shift Gear", Type.STEEL, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Raises user's Attack and sharply raises Speed.", -1, 5],
	[Moves.CIRCLE_THROW, "Circle Throw", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 60, 90, 10, "", "In battles, the opponent switches. In the wild, the Pokémon runs.", -1, 5],
	[Moves.INCINERATE, "Incinerate", Type.FIRE, MOVE_CATEGORY.SPECIAL, 60, 100, 15, "", "Destroys the target's held berry.", -1, 5],
	[Moves.QUASH, "Quash", Type.DARK, MOVE_CATEGORY.STATUS, -1, 100, 15, "", "Makes the target act last this turn.", -1, 5],
	[Moves.ACROBATICS, "Acrobatics", Type.FLYING, MOVE_CATEGORY.PHYSICAL, 55, 100, 15, "TM14", "Stronger when the user does not have a held item.", -1, 5],
	[Moves.REFLECT_TYPE, "Reflect Type", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "User becomes the target's type.", -1, 5],
	[Moves.RETALIATE, "Retaliate", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 70, 100, 5, "", "Inflicts double damage if a teammate fainted on the last turn.", -1, 5],
	[Moves.FINAL_GAMBIT, "Final Gambit", Type.FIGHTING, MOVE_CATEGORY.SPECIAL, -1, 100, 5, "", "Inflicts damage equal to the user's remaining HP. User faints.", -1, 5],
	[Moves.BESTOW, "Bestow", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 15, "", "Gives the user's held item to the target.", -1, 5],
	[Moves.INFERNO, "Inferno", Type.FIRE, MOVE_CATEGORY.SPECIAL, 100, 50, 5, "", "Burns opponent.", 100, 5],
	[Moves.WATER_PLEDGE, "Water Pledge", Type.WATER, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "TM145", "Added effects appear if preceded by Fire Pledge or succeeded by Grass Pledge.", -1, 5],
	[Moves.FIRE_PLEDGE, "Fire Pledge", Type.FIRE, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "TM144", "Added effects appear if combined with Grass Pledge or Water Pledge.", -1, 5],
	[Moves.GRASS_PLEDGE, "Grass Pledge", Type.GRASS, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "TM146", "Added effects appear if preceded by Water Pledge or succeeded by Fire Pledge.", -1, 5],
	[Moves.VOLT_SWITCH, "Volt Switch", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 70, 100, 20, "TM48", "User must switch out after attacking.", -1, 5],
	[Moves.STRUGGLE_BUG, "Struggle Bug", Type.BUG, MOVE_CATEGORY.SPECIAL, 50, 100, 20, "TM15", "Lowers opponent's Special Attack.", 100, 5],
	[Moves.BULLDOZE, "Bulldoze", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 60, 100, 20, "TM28", "Lowers opponent's Speed.", 100, 5],
	[Moves.FROST_BREATH, "Frost Breath", Type.ICE, MOVE_CATEGORY.SPECIAL, 60, 90, 10, "", "Always results in a critical hit.", 100, 5],
	[Moves.DRAGON_TAIL, "Dragon Tail", Type.DRAGON, MOVE_CATEGORY.PHYSICAL, 60, 90, 10, "TM44", "In battles, the opponent switches. In the wild, the Pokémon runs.", -1, 5],
	[Moves.WORK_UP, "Work Up", Type.NORMAL, MOVE_CATEGORY.STATUS, -1, -1, 30, "", "Raises user's Attack and Special Attack.", -1, 5],
	[Moves.ELECTROWEB, "Electroweb", Type.ELECTRIC, MOVE_CATEGORY.SPECIAL, 55, 95, 15, "", "Lowers opponent's Speed.", 100, 5],
	[Moves.WILD_CHARGE, "Wild Charge", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 90, 100, 15, "TM147", "User receives recoil damage.", -1, 5],
	[Moves.DRILL_RUN, "Drill Run", Type.GROUND, MOVE_CATEGORY.PHYSICAL, 80, 95, 10, "TM106", "High critical hit ratio.", -1, 5],
	[Moves.DUAL_CHOP, "Dual Chop", Type.DRAGON, MOVE_CATEGORY.PHYSICAL, 40, 90, 15, "", "Hits twice in one turn.", -1, 5],
	[Moves.HEART_STAMP, "Heart Stamp", Type.PSYCHIC, MOVE_CATEGORY.PHYSICAL, 60, 100, 25, "", "May cause flinching.", 30, 5],
	[Moves.HORN_LEECH, "Horn Leech", Type.GRASS, MOVE_CATEGORY.PHYSICAL, 75, 100, 10, "", "User recovers half the HP inflicted on opponent.", -1, 5],
	[Moves.SACRED_SWORD, "Sacred Sword", Type.FIGHTING, MOVE_CATEGORY.PHYSICAL, 90, 100, 15, "", "Ignores opponent's stat changes.", -1, 5],
	[Moves.RAZOR_SHELL, "Razor Shell", Type.WATER, MOVE_CATEGORY.PHYSICAL, 75, 95, 10, "", "May lower opponent's Defense.", 50, 5],
	[Moves.HEAT_CRASH, "Heat Crash", Type.FIRE, MOVE_CATEGORY.PHYSICAL, -1, 100, 10, "", "The heavier the user, the stronger the attack.", -1, 5],
	[Moves.LEAF_TORNADO, "Leaf Tornado", Type.GRASS, MOVE_CATEGORY.SPECIAL, 65, 90, 10, "", "May lower opponent's Accuracy.", 50, 5],
	[Moves.STEAMROLLER, "Steamroller", Type.BUG, MOVE_CATEGORY.PHYSICAL, 65, 100, 20, "", "May cause flinching.", 30, 5],
	[Moves.COTTON_GUARD, "Cotton Guard", Type.GRASS, MOVE_CATEGORY.STATUS, -1, -1, 10, "", "Drastically raises user's Defense.", -1, 5],
	[Moves.NIGHT_DAZE, "Night Daze", Type.DARK, MOVE_CATEGORY.SPECIAL, 85, 95, 10, "", "May lower opponent's Accuracy.", 40, 5],
	[Moves.PSYSTRIKE, "Psystrike", Type.PSYCHIC, MOVE_CATEGORY.SPECIAL, 100, 100, 10, "", "Inflicts damage based on the target's Defense, not Special Defense.", -1, 5],
	[Moves.TAIL_SLAP, "Tail Slap", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 25, 85, 10, "", "Hits 2-5 times in one turn.", -1, 5],
	[Moves.HURRICANE, "Hurricane", Type.FLYING, MOVE_CATEGORY.SPECIAL, 110, 70, 10, "TM160", "May confuse opponent.", 30, 5],
	[Moves.HEAD_CHARGE, "Head Charge", Type.NORMAL, MOVE_CATEGORY.PHYSICAL, 120, 100, 15, "", "User receives recoil damage.", -1, 5],
	[Moves.GEAR_GRIND, "Gear Grind", Type.STEEL, MOVE_CATEGORY.PHYSICAL, 50, 85, 15, "", "Hits twice in one turn.", -1, 5],
	[Moves.SEARING_SHOT, "Searing Shot", Type.FIRE, MOVE_CATEGORY.SPECIAL, 100, 100, 5, "", "May burn opponent.", 30, 5],
	[Moves.TECHNO_BLAST, "Techno Blast", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 120, 100, 5, "", "Type depends on the Drive being held.", -1, 5],
	[Moves.RELIC_SONG, "Relic Song", Type.NORMAL, MOVE_CATEGORY.SPECIAL, 75, 100, 10, "", "May put the target to sleep.", 10, 5],
	[Moves.SECRET_SWORD, "Secret Sword", Type.FIGHTING, MOVE_CATEGORY.SPECIAL, 85, 100, 10, "", "Inflicts damage based on the target's Defense, not Special Defense.", -1, 5],
	[Moves.GLACIATE, "Glaciate", Type.ICE, MOVE_CATEGORY.SPECIAL, 65, 95, 10, "", "Lowers opponent's Speed.", 100, 5],
	[Moves.BOLT_STRIKE, "Bolt Strike", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 130, 85, 5, "", "May paralyze opponent.", 20, 5],
	[Moves.BLUE_FLARE, "Blue Flare", Type.FIRE, MOVE_CATEGORY.SPECIAL, 130, 85, 5, "", "May burn opponent.", 20, 5],
	[Moves.FIERY_DANCE, "Fiery Dance", Type.FIRE, MOVE_CATEGORY.SPECIAL, 80, 100, 10, "", "May raise user's Special Attack.", 50, 5],
	[Moves.FREEZE_SHOCK, "Freeze Shock", Type.ICE, MOVE_CATEGORY.PHYSICAL, 140, 90, 5, "", "Charges on first turn, attacks on second. May paralyze opponent.", 30, 5],
	[Moves.ICE_BURN, "Ice Burn", Type.ICE, MOVE_CATEGORY.SPECIAL, 140, 90, 5, "", "Charges on first turn, attacks on second. May burn opponent.", 30, 5],
	[Moves.SNARL, "Snarl", Type.DARK, MOVE_CATEGORY.SPECIAL, 55, 95, 15, "TM30", "Lowers opponent's Special Attack.", 100, 5],
	[Moves.ICICLE_CRASH, "Icicle Crash", Type.ICE, MOVE_CATEGORY.PHYSICAL, 85, 90, 10, "", "May cause flinching.", 30, 5],
	[Moves.V_CREATE, "V-create", Type.FIRE, MOVE_CATEGORY.PHYSICAL, 180, 95, 5, "", "Lowers user's Defense, Special Defense and Speed.", 100, 5],
	[Moves.FUSION_FLARE, "Fusion Flare", Type.FIRE, MOVE_CATEGORY.SPECIAL, 100, 100, 5, "", "Power increases if Fusion Bolt is used in the same turn.", -1, 5],
	[Moves.FUSION_BOLT, "Fusion Bolt", Type.ELECTRIC, MOVE_CATEGORY.PHYSICAL, 100, 100, 5, "", "Power increases if Fusion Flare is used in the same turn.", -1, 5]
].map(m => {
	let i = 0;
	return new Move(m[i++], m[i++], m[i++], m[i++], m[i++], m[i++], m[i++], m[i++], m[i++], m[i++], m[i++]);
});