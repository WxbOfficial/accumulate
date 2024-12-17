export var Type;
(function (Type) {
	Type[Type["NORMAL"] = 0] = "NORMAL";
	Type[Type["FIGHTING"] = 1] = "FIGHTING";
	Type[Type["FLYING"] = 2] = "FLYING";
	Type[Type["POISON"] = 3] = "POISON";
	Type[Type["GROUND"] = 4] = "GROUND";
	Type[Type["ROCK"] = 5] = "ROCK";
	Type[Type["BUG"] = 6] = "BUG";
	Type[Type["GHOST"] = 7] = "GHOST";
	Type[Type["STEEL"] = 8] = "STEEL";
	Type[Type["FIRE"] = 9] = "FIRE";
	Type[Type["WATER"] = 10] = "WATER";
	Type[Type["GRASS"] = 11] = "GRASS";
	Type[Type["ELECTRIC"] = 12] = "ELECTRIC";
	Type[Type["PSYCHIC"] = 13] = "PSYCHIC";
	Type[Type["ICE"] = 14] = "ICE";
	Type[Type["DRAGON"] = 15] = "DRAGON";
	Type[Type["DARK"] = 16] = "DARK";
	Type[Type["FAIRY"] = 17] = "FAIRY";
})(Type || (Type = {}));

export function getTypeDamageMultiplier(attackType, defType) {
	switch (defType) {
		case Type.NORMAL:
			switch (attackType) {
				case Type.FIGHTING:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.POISON:
				case Type.GROUND:
				case Type.ROCK:
				case Type.BUG:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.GHOST:
				default:
					return 0;
			}
		case Type.FIGHTING:
			switch (attackType) {
				case Type.FLYING:
				case Type.PSYCHIC:
				case Type.FAIRY:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.POISON:
				case Type.GROUND:
				case Type.GHOST:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.DARK:
					return 1;
				case Type.ROCK:
				case Type.BUG:
					return 0.5;
				default:
					return 0;
			}
		case Type.FLYING:
			switch (attackType) {
				case Type.ROCK:
				case Type.ELECTRIC:
				case Type.ICE:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.POISON:
				case Type.GHOST:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.PSYCHIC:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.FIGHTING:
				case Type.BUG:
				case Type.GRASS:
					return 0.5;
				case Type.GROUND:
				default:
					return 0;
			}
		case Type.POISON:
			switch (attackType) {
				case Type.GROUND:
				case Type.PSYCHIC:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.ROCK:
				case Type.GHOST:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.ELECTRIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.DARK:
					return 1;
				case Type.FIGHTING:
				case Type.POISON:
				case Type.BUG:
				case Type.GRASS:
				case Type.FAIRY:
					return 0.5;
				default:
					return 0;
			}
		case Type.GROUND:
			switch (attackType) {
				case Type.WATER:
				case Type.GRASS:
				case Type.ICE:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.FLYING:
				case Type.GROUND:
				case Type.BUG:
				case Type.GHOST:
				case Type.STEEL:
				case Type.FIRE:
				case Type.PSYCHIC:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.POISON:
				case Type.ROCK:
					return 0.5;
				case Type.ELECTRIC:
				default:
					return 0;
			}
		case Type.ROCK:
			switch (attackType) {
				case Type.FIGHTING:
				case Type.GROUND:
				case Type.STEEL:
				case Type.WATER:
				case Type.GRASS:
					return 2;
				case Type.ROCK:
				case Type.BUG:
				case Type.GHOST:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.POISON:
				case Type.FIRE:
					return 0.5;
				default:
					return 0;
			}
		case Type.BUG:
			switch (attackType) {
				case Type.FLYING:
				case Type.ROCK:
				case Type.FIRE:
					return 2;
				case Type.NORMAL:
				case Type.POISON:
				case Type.BUG:
				case Type.GHOST:
				case Type.STEEL:
				case Type.WATER:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.FIGHTING:
				case Type.GROUND:
				case Type.GRASS:
					return 0.5;
				default:
					return 0;
			}
		case Type.GHOST:
			switch (attackType) {
				case Type.GHOST:
				case Type.DARK:
					return 2;
				case Type.FLYING:
				case Type.GROUND:
				case Type.ROCK:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.FAIRY:
					return 1;
				case Type.POISON:
				case Type.BUG:
					return 0.5;
				case Type.NORMAL:
				case Type.FIGHTING:
				default:
					return 0;
			}
		case Type.STEEL:
			switch (attackType) {
				case Type.FIGHTING:
				case Type.GROUND:
				case Type.FIRE:
					return 2;
				case Type.GHOST:
				case Type.WATER:
				case Type.ELECTRIC:
				case Type.DARK:
					return 1;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.ROCK:
				case Type.BUG:
				case Type.STEEL:
				case Type.GRASS:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.FAIRY:
					return 0.5;
				case Type.POISON:
				default:
					return 0;
			}
		case Type.FIRE:
			switch (attackType) {
				case Type.GROUND:
				case Type.ROCK:
				case Type.WATER:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.FLYING:
				case Type.POISON:
				case Type.GHOST:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.DRAGON:
				case Type.DARK:
					return 1;
				case Type.BUG:
				case Type.STEEL:
				case Type.FIRE:
				case Type.GRASS:
				case Type.ICE:
				case Type.FAIRY:
					return 0.5;
				default:
					return 0;
			}
		case Type.WATER:
			switch (attackType) {
				case Type.GRASS:
				case Type.ELECTRIC:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.FLYING:
				case Type.POISON:
				case Type.GROUND:
				case Type.ROCK:
				case Type.BUG:
				case Type.GHOST:
				case Type.PSYCHIC:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.ICE:
					return 0.5;
				default:
					return 0;
			}
		case Type.GRASS:
			switch (attackType) {
				case Type.FLYING:
				case Type.POISON:
				case Type.BUG:
				case Type.FIRE:
				case Type.ICE:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.ROCK:
				case Type.GHOST:
				case Type.STEEL:
				case Type.PSYCHIC:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.GROUND:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
					return 0.5;
				default:
					return 0;
			}
		case Type.ELECTRIC:
			switch (attackType) {
				case Type.GROUND:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.POISON:
				case Type.ROCK:
				case Type.BUG:
				case Type.GHOST:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.FLYING:
				case Type.STEEL:
				case Type.ELECTRIC:
					return 0.5;
				default:
					return 0;
			}
		case Type.PSYCHIC:
			switch (attackType) {
				case Type.BUG:
				case Type.GHOST:
				case Type.DARK:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.POISON:
				case Type.GROUND:
				case Type.ROCK:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.ICE:
				case Type.DRAGON:
				case Type.FAIRY:
					return 1;
				case Type.FIGHTING:
				case Type.PSYCHIC:
					return 0.5;
				default:
					return 0;
			}
		case Type.ICE:
			switch (attackType) {
				case Type.FIGHTING:
				case Type.ROCK:
				case Type.STEEL:
				case Type.FIRE:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.POISON:
				case Type.GROUND:
				case Type.BUG:
				case Type.GHOST:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.DRAGON:
				case Type.DARK:
				case Type.FAIRY:
					return 1;
				case Type.ICE:
					return 0.5;
				default:
					return 0;
			}
		case Type.DRAGON:
			switch (attackType) {
				case Type.ICE:
				case Type.DRAGON:
				case Type.FAIRY:
					return 2;
				case Type.NORMAL:
				case Type.FIGHTING:
				case Type.FLYING:
				case Type.POISON:
				case Type.GROUND:
				case Type.ROCK:
				case Type.BUG:
				case Type.GHOST:
				case Type.STEEL:
				case Type.PSYCHIC:
				case Type.DARK:
					return 1;
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
					return 0.5;
				default:
					return 0;
			}
		case Type.DARK:
			switch (attackType) {
				case Type.FIGHTING:
				case Type.BUG:
				case Type.FAIRY:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.POISON:
				case Type.GROUND:
				case Type.ROCK:
				case Type.STEEL:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.ICE:
				case Type.DRAGON:
					return 1;
				case Type.GHOST:
				case Type.DARK:
					return 0.5;
				case Type.PSYCHIC:
				default:
					return 0;
			}
		case Type.FAIRY:
			switch (attackType) {
				case Type.POISON:
				case Type.STEEL:
					return 2;
				case Type.NORMAL:
				case Type.FLYING:
				case Type.GROUND:
				case Type.ROCK:
				case Type.GHOST:
				case Type.FIRE:
				case Type.WATER:
				case Type.GRASS:
				case Type.ELECTRIC:
				case Type.PSYCHIC:
				case Type.ICE:
				case Type.FAIRY:
					return 1;
				case Type.FIGHTING:
				case Type.BUG:
				case Type.DARK:
					return 0.5;
				case Type.DRAGON:
				default:
					return 0;
			}
	}
}