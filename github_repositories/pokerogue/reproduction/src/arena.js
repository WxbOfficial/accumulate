import { allSpecies, getPokemonSpecies } from "./pokemon-species.js";
import { Stat } from "./pokemon-stat.js";
import { Species } from "./species.js";
import { Type } from './type.js';
import * as Utils from './utils.js';

export var ArenaType;
(function (ArenaType) {
	ArenaType[ArenaType["PLAINS"] = 1] = "PLAINS";
	ArenaType[ArenaType["GRASS"] = 2] = "GRASS";
	ArenaType[ArenaType["FOREST"] = 3] = "FOREST";
	ArenaType[ArenaType["WATER"] = 4] = "WATER";
	ArenaType[ArenaType["SWAMP"] = 5] = "SWAMP";
	ArenaType[ArenaType["SEA"] = 6] = "SEA";
	ArenaType[ArenaType["MOUNTAIN"] = 7] = "MOUNTAIN";
	ArenaType[ArenaType["LAND"] = 8] = "LAND";
	ArenaType[ArenaType["CAVE"] = 9] = "CAVE";
	ArenaType[ArenaType["DESERT"] = 10] = "DESERT";
	ArenaType[ArenaType["ARENA_BROWN"] = 11] = "ARENA_BROWN";
	ArenaType[ArenaType["ARENA_PURPLE"] = 12] = "ARENA_PURPLE";
	ArenaType[ArenaType["ARENA_BLUE"] = 13] = "ARENA_BLUE";
	ArenaType[ArenaType["ARENA_ORANGE"] = 14] = "ARENA_ORANGE";
	ArenaType[ArenaType["ARENA_PINK"] = 15] = "ARENA_PINK";
})(ArenaType || (ArenaType = {}));
;
var PoolTier;
(function (PoolTier) {
	PoolTier[PoolTier["COMMON"] = 0] = "COMMON";
	PoolTier[PoolTier["UNCOMMON"] = 1] = "UNCOMMON";
	PoolTier[PoolTier["RARE"] = 2] = "RARE";
	PoolTier[PoolTier["ULTRA_RARE"] = 3] = "ULTRA_RARE";
	PoolTier[PoolTier["LEGENDARY"] = 4] = "LEGENDARY";
})(PoolTier || (PoolTier = {}));

export class Arena {
	constructor(scene, type, bgm) {
		this.scene = scene;
		this.type = type;
		this.bgm = bgm;

		const predicate = arenaPoolPredicates[type] || (() => { });
		this.pokemonPool = Utils.getEnumValues(PoolTier).map(t => allSpecies.filter(p => predicate(p, t)));
	}

	randomSpecies(waveIndex) {
		const tier = Utils.randInt(5);
		const tierPool = this.pokemonPool[tier];
		let ret;
		if (!tierPool.length)
			ret = this.scene.randomSpecies();
		else
			ret = tierPool[Utils.randInt(tierPool.length)];
		const newSpeciesId = ret.getSpeciesForLevel(5);
		if (newSpeciesId !== ret.speciesId) {
			console.log('Replaced', Species[ret.speciesId], 'with', Species[newSpeciesId]);
			ret = getPokemonSpecies(newSpeciesId);
		}
		return ret;
	}

	playBgm() {
		this.scene.loadBgm(this.bgm);
		this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => this.scene.playBgm(this.bgm));
	}
}

const arenaPoolPredicates = {
	[ArenaType.PLAINS]: (p, t) => {
		if (p.isOfType(Type.GHOST) || p.isOfType(Type.STEEL) || p.isOfType(Type.ICE) || p.isOfType(Type.DRAGON))
			return false;
		for (let s in p.baseStats) {
			let threshold;
			const stat = parseInt(s);
			switch (stat) {
				case Stat.HP:
					threshold = 70;
					break;
				default:
					threshold = 60;
					break;
			}
			if (p.baseStats[s] > threshold) {
				if (p.baseTotal <= 300 && p.baseExp <= 75 && (p.isOfType(Type.NORMAL) || p.isOfType(Type.BUG) || p.isOfType(Type.GRASS)))
					return true;
				return false;
			}
		}
		return p.baseTotal <= 320 && p.baseExp <= 75;
	},
	[ArenaType.GRASS]: (p, t) => {
		switch (t) {
			case PoolTier.ULTRA_RARE:
				return [Species.ENTEI, Species.SUICUNE, Species.RAIKOU, Species.LATIOS, Species.LATIAS].map(s => getPokemonSpecies(s));
			case PoolTier.LEGENDARY:
				return [Species.MEW].map(s => getPokemonSpecies(s));
		}
		return p.isOfType(Type.NORMAL) || p.isOfType(Type.FAIRY) || p.isOfType(Type.GRASS) || p.isOfType(Type.BUG) || p.isOfType(Type.ELECTRIC);
	},
	[ArenaType.FOREST]: (p, t) => {
		switch (t) {
			case PoolTier.LEGENDARY:
				return getPokemonSpecies(Species.CELEBI);
		}
		return p.isOfType(Type.GRASS) || p.isOfType(Type.BUG) || p.isOfType(Type.POISON);
	},
	[ArenaType.WATER]: (p, t) => {
		switch (t) {
			case PoolTier.ULTRA_RARE:
				return [Species.UXIE, Species.MESPRIT, Species.AZELF].map(s => getPokemonSpecies(s));
		}
		return p.isOfType(Type.WATER);
	},
	[ArenaType.SWAMP]: (p, t) => {
		return p.isOfType(Type.GRASS) || p.isOfType(Type.WATER) || p.isOfType(Type.POISON);
	},
	[ArenaType.SEA]: (p, t) => {
		switch (t) {
			case PoolTier.ULTRA_RARE:
				return [Species.KYOGRE].map(s => getPokemonSpecies(s));
			case PoolTier.LEGENDARY:
				return [Species.LUGIA].map(s => getPokemonSpecies(s));
		}
		return p.isOfType(Type.WATER);
	},
	[ArenaType.MOUNTAIN]: (p, t) => {
		switch (t) {
			case PoolTier.ULTRA_RARE:
				return [Species.ARTICUNO, Species.ZAPDOS, Species.MOLTRES].map(s => getPokemonSpecies(s));
				break;
			case PoolTier.LEGENDARY:
				return [Species.HO_OH, Species.RAYQUAZA].map(s => getPokemonSpecies(s));
		}
		return p.isOfType(Type.FLYING) || p.isOfType(Type.GROUND) || p.isOfType(Type.ROCK) || p.isOfType(Type.ELECTRIC) || p.isOfType(Type.STEEL);
	},
	[ArenaType.LAND]: (p, t) => {
		switch (t) {
			case PoolTier.ULTRA_RARE:
				return [Species.GROUDON].map(s => getPokemonSpecies(s));
		}
		return p.isOfType(Type.GROUND);
	},
	[ArenaType.CAVE]: (p, t) => {
		switch (t) {
			case PoolTier.ULTRA_RARE:
				return [Species.REGIROCK, Species.REGICE, Species.REGISTEEL].map(s => getPokemonSpecies(s));
			case PoolTier.LEGENDARY:
				return [Species.MEWTWO, Species.REGIGIGAS].map(s => getPokemonSpecies(s));
		}
		return p.isOfType(Type.ROCK);
	},
	[ArenaType.DESERT]: (p, t) => {
		return p.isOfType(Type.GROUND) || p.isOfType(Type.ROCK);
	},
	[ArenaType.ARENA_PINK]: (p, t) => {
		return p.legendary || p.mythical;
	}
};