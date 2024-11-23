import { toPokemonUpperCase } from "./utils.js";

export var PokeballType;
(function (PokeballType) {
	PokeballType[PokeballType["POKEBALL"] = 0] = "POKEBALL";
	PokeballType[PokeballType["GREAT_BALL"] = 1] = "GREAT_BALL";
	PokeballType[PokeballType["ULTRA_BALL"] = 2] = "ULTRA_BALL";
	PokeballType[PokeballType["MASTER_BALL"] = 3] = "MASTER_BALL";
})(PokeballType || (PokeballType = {}));

export function getPokeballAtlasKey(type) {
	switch (type) {
		case PokeballType.POKEBALL:
			return 'pb';
		case PokeballType.GREAT_BALL:
			return 'gb';
		case PokeballType.ULTRA_BALL:
			return 'ub';
		case PokeballType.MASTER_BALL:
			return 'mb';
	}
}

export function getPokeballName(type) {
	let ret;
	switch (type) {
		case PokeballType.POKEBALL:
			ret = 'Poké ball';
			break;
		case PokeballType.GREAT_BALL:
			ret = 'Great Ball';
			break;
		case PokeballType.ULTRA_BALL:
			ret = 'Ultra Ball';
			break;
		case PokeballType.MASTER_BALL:
			ret = 'Master Ball';
			break;
	}
	return toPokemonUpperCase(ret);
}

export function getPokeballCatchMultiplier(type) {
	switch (type) {
		case PokeballType.POKEBALL:
			return 1;
		case PokeballType.GREAT_BALL:
			return 1.5;
		case PokeballType.ULTRA_BALL:
			return 2;
		case PokeballType.MASTER_BALL:
			return -1;
	}
}

export function getTintColor(type) {
	switch (type) {
		case PokeballType.POKEBALL:
			return 0xd52929;
		case PokeballType.GREAT_BALL:
			return 0x94b4de;
		case PokeballType.ULTRA_BALL:
			return 0xe6cd31;
		case PokeballType.MASTER_BALL:
			return 0xa441bd;
	}
}

export function doPokeballBounceAnim(scene, pokeball, y1, y2, baseBounceDuration, callback) {
	let bouncePower = 1;
	let bounceYOffset = y1;
	let bounceY = y2;
	let yd = y2 - y1;

	const doBounce = () => {
		scene.tweens.add({
			targets: pokeball,
			y: y2,
			duration: bouncePower * baseBounceDuration,
			ease: 'Cubic.easeIn',
			onComplete: () => {
				scene.sound.play('pb_bounce_1', { volume: bouncePower });

				bouncePower = bouncePower > 0.01 ? bouncePower * 0.5 : 0;

				if (bouncePower) {
					bounceYOffset = yd * bouncePower;
					bounceY = y2 - bounceYOffset;

					scene.tweens.add({
						targets: pokeball,
						y: bounceY,
						duration: bouncePower * baseBounceDuration,
						ease: 'Cubic.easeOut',
						onComplete: () => doBounce()
					});
				} else if (callback)
					callback();
			}
		});
	};

	doBounce();
}