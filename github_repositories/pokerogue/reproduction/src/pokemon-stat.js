import { toPokemonUpperCase } from "./utils.js";

export var Stat;
(function (Stat) {
	Stat[Stat["HP"] = 0] = "HP";
	Stat[Stat["ATK"] = 1] = "ATK";
	Stat[Stat["DEF"] = 2] = "DEF";
	Stat[Stat["SPATK"] = 3] = "SPATK";
	Stat[Stat["SPDEF"] = 4] = "SPDEF";
	Stat[Stat["SPD"] = 5] = "SPD";
})(Stat || (Stat = {}));

export function getStatName(stat) {
	let ret;
	switch (stat) {
		case Stat.HP:
			ret = 'Max. HP';
			break;
		case Stat.ATK:
			ret = 'Attack';
			break;
		case Stat.DEF:
			ret = 'Defense';
			break;
		case Stat.SPATK:
			ret = 'Sp. Atk';
			break;
		case Stat.SPDEF:
			ret = 'Sp. Def';
			break;
		case Stat.SPD:
			ret = 'Speed';
			break;
	}
	return toPokemonUpperCase(ret);
}