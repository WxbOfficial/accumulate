// import * as Phaser from 'phaser';
import BattleScene from "./battle-scene.js";
import { getPokeballName, PokeballType } from "./pokeball.js";
import Pokemon from "./pokemon.js";
import { Stat, getStatName } from "./pokemon-stat.js";
import { addTextObject, TextStyle } from "./text.js";
import PartyUiHandler from "./ui/party-ui-handler.js";
import * as Utils from "./utils.js";

export class ModifierBar extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene, 1, 2);

		this.setScale(0.5);
	}

	addModifier(modifier) {
		const icon = modifier.getIcon(this.scene);
		this.add(icon);
		this.setModifierIconPosition(icon);
	}

	updateModifier(modifier, modifiers) {
		const index = modifiers.indexOf(modifier);
		if (index > -1) {
			this.getAt(index).destroy();
			const newIcon = modifier.getIcon(this.scene);
			this.addAt(newIcon, index);
			this.setModifierIconPosition(newIcon);
		}
	}

	setModifierIconPosition(icon) {
		const x = (this.getIndex(icon) % 12) * 26;
		const y = Math.floor((this.getIndex(icon) * 6) / (this.scene.game.canvas.width / 6)) * 20;

		icon.setPosition(x, y);
	}
}

export class Modifier {
	constructor(type) {
		this.type = type;
		this.stackCount = 1;
	}

	add(modifierBar, modifiers) {
		modifiers.push(this);

		modifierBar.addModifier(this);

		return true;
	}

	shouldApply(_args) {
		return true;
	}

	incrementStack() {
		this.stackCount++;
	}

	getIcon(scene) {
		const container = scene.add.container(0, 0);

		const item = scene.add.sprite(0, 12, 'items');
		item.setFrame(this.type.iconImage);
		item.setOrigin(0, 0.5);
		container.add(item);

		const stackText = this.getIconStackText(scene);
		if (stackText)
			container.add(stackText);

		return container;
	}

	getIconStackText(scene) {
		if (this.stackCount <= 1)
			return null;

		const text = addTextObject(scene, 16, 12, this.stackCount.toString(), TextStyle.PARTY, { fontSize: '66px' });
		text.setStroke('#424242', 16);
		text.setOrigin(1, 0);

		return text;
	}
}

export class ConsumableModifier extends Modifier {
	constructor(type) {
		super(type);
	}

	add(_modifierBar, _modifiers) {
		return true;
	}

	shouldApply(args) {
		return args.length === 1 && args[0] instanceof BattleScene;
	}
}

class AddPokeballModifier extends ConsumableModifier {
	constructor(type, pokeballType, count) {
		super(type);

		this.pokeballType = pokeballType;
		this.count = count;
	}

	apply(args) {
		args[0].pokeballCounts[this.pokeballType] += this.count;
		console.log(args[0].pokeballCounts);
		return true;
	}
}

export class PokemonModifier extends Modifier {
	constructor(type, pokemonId) {
		super(type);

		this.pokemonId = pokemonId;
	}

	shouldApply(args) {
		return args.length && args[0] === this.pokemonId;
	}

	getIcon(scene) {
		const container = scene.add.container(0, 0);

		const pokemon = this.getPokemon(scene);
		const pokemonIcon = scene.add.sprite(0, 8, pokemon.getIconAtlasKey());
		pokemonIcon.play(pokemon.getIconKey()).stop();
		pokemonIcon.setOrigin(0, 0.5);

		container.add(pokemonIcon);

		return container;
	}

	getPokemon(scene) {
		return scene.getParty().find(p => p.id === this.pokemonId);
	}
}

export class PokemonBaseStatModifier extends PokemonModifier {
	constructor(type, pokemonId, stat) {
		super(type, pokemonId);
		this.stat = stat;
	}

	add(modifierBar, modifiers) {
		for (let modifier of modifiers) {
			if (modifier instanceof PokemonBaseStatModifier) {
				const pokemonStatModifier = modifier;
				console.log(pokemonStatModifier.stat, this.stat, pokemonStatModifier.pokemonId === this.pokemonId && pokemonStatModifier.stat === this.stat);
				if (pokemonStatModifier.pokemonId === this.pokemonId && pokemonStatModifier.stat === this.stat) {
					pokemonStatModifier.incrementStack();
					modifierBar.updateModifier(pokemonStatModifier, modifiers);
					return true;
				}
			}
		}

		return super.add(modifierBar, modifiers);
	}

	shouldApply(args) {
		console.log(args, this.pokemonId, args);
		return super.shouldApply(args) && args.length === 2 && args[1] instanceof (Array);
	}

	apply(args) {
		args[1][this.stat] = Math.min(Math.floor(args[1][this.stat] * (1 + this.stackCount * 0.1)), 999999);

		return true;
	}

	getIcon(scene) {
		const container = super.getIcon(scene);

		const item = scene.add.sprite(16, 16, 'items');
		item.setScale(0.5);
		item.setOrigin(0, 0.5);
		item.setTexture('items', this.type.iconImage);
		container.add(item);

		const stackText = this.getIconStackText(scene);
		if (stackText)
			container.add(stackText);

		return container;
	}
}

export class ConsumablePokemonModifier extends PokemonModifier {
	constructor(type, pokemonId) {
		super(type, pokemonId);
	}

	add(_modifierBar, _modifiers) {
		return true;
	}

	shouldApply(args) {
		return args.length === 1 && args[0] instanceof Pokemon && (this.pokemonId === -1 || args[0].id === this.pokemonId);
	}
}

export class PokemonHpRestoreModifier extends ConsumablePokemonModifier {
	constructor(type, pokemonId, restorePercent) {
		super(type, pokemonId);

		this.restorePercent = restorePercent;
	}

	apply(args) {
		const pokemon = args[0];
		pokemon.hp = Math.min(pokemon.hp + (this.restorePercent * 0.01) * pokemon.getMaxHp(), pokemon.getMaxHp());

		return true;
	}
}

export class ExpBoosterModifier extends Modifier {
	constructor(type) {
		super(type);
	}

	add(modifierBar, modifiers) {
		for (let modifier of modifiers) {
			if (modifier instanceof ExpBoosterModifier) {
				const expModifier = modifier;
				expModifier.incrementStack();
				modifierBar.updateModifier(expModifier, modifiers);
				return true;
			}
		}

		return super.add(modifierBar, modifiers);
	}

	apply(args) {
		args[0].value = Math.floor(args[0].value * (1 + (this.stackCount * 0.25)));

		return true;
	}
}

export class ShinyRateBoosterModifier extends Modifier {
	constructor(type) {
		super(type);
	}

	add(modifierBar, modifiers) {
		for (let modifier of modifiers) {
			if (modifier instanceof ShinyRateBoosterModifier) {
				const shinyRateModifier = modifier;
				shinyRateModifier.incrementStack();
				modifierBar.updateModifier(shinyRateModifier, modifiers);
				return true;
			}
		}

		return super.add(modifierBar, modifiers);
	}

	apply(args) {
		args[0].value = Math.pow(args[0].value * 0.5, this.stackCount + 1);

		return true;
	}
}

export var ModifierTier;
(function (ModifierTier) {
	ModifierTier[ModifierTier["COMMON"] = 0] = "COMMON";
	ModifierTier[ModifierTier["GREAT"] = 1] = "GREAT";
	ModifierTier[ModifierTier["ULTRA"] = 2] = "ULTRA";
	ModifierTier[ModifierTier["MASTER"] = 3] = "MASTER";
})(ModifierTier || (ModifierTier = {}));

export class ModifierType {
	constructor(name, description, newModifierFunc, iconImage) {
		this.name = name;
		this.description = description;
		this.iconImage = iconImage || name.replace(/[ \-]/g, '_').toLowerCase();
		this.newModifierFunc = newModifierFunc;
	}

	setTier(tier) {
		this.tier = tier;
	}

	newModifier(...args) {
		return this.newModifierFunc(this, args);
	}
}

class AddPokeballModifierType extends ModifierType {
	constructor(pokeballType, count, iconImage) {
		super(`${count}x ${getPokeballName(pokeballType)}`, `Receive ${getPokeballName(pokeballType)} x${count}`, (_type, _args) => new AddPokeballModifier(this, pokeballType, count), iconImage);
	}
}

export class PokemonModifierType extends ModifierType {
	constructor(name, description, newModifierFunc, selectFilter, iconImage) {
		super(name, description, newModifierFunc, iconImage);

		this.selectFilter = selectFilter;
	}
}

class PokemonHpRestoreModifierType extends PokemonModifierType {
	constructor(name, restorePercent, iconImage) {
		super(name, `Restore ${restorePercent}% HP for one POKéMON`, (_type, args) => new PokemonHpRestoreModifier(this, args[0], this.restorePercent), (pokemon) => {
			if (pokemon.hp >= pokemon.getMaxHp())
				return PartyUiHandler.NoEffectMessage;
			return null;
		}, iconImage);

		this.restorePercent = restorePercent;
	}
}

class PokemonReviveModifierType extends PokemonHpRestoreModifierType {
	constructor(name, restorePercent, iconImage) {
		super(name, restorePercent, iconImage);

		this.description = `Revive one POKéMON and restore ${restorePercent}% HP`;
		this.selectFilter = (pokemon) => {
			if (pokemon.hp)
				return PartyUiHandler.NoEffectMessage;
			return null;
		};
	}
}

class PokemonBaseStatBoosterModifierType extends PokemonModifierType {
	constructor(name, stat, _iconImage) {
		super(name, `Increases one POKéMON's base ${getStatName(stat)} by 10%`, (_type, args) => new PokemonBaseStatModifier(this, args[0], this.stat));

		this.stat = stat;
	}
}

class AllPokemonHpRestoreModifierType extends ModifierType {
	constructor(name, restorePercent, iconImage) {
		super(name, `Restore ${restorePercent}% HP for all POKéMON`, (_type, _args) => new PokemonHpRestoreModifier(this, -1, this.restorePercent), iconImage);

		this.restorePercent = restorePercent;
	}
}
class WeightedModifierType {
	constructor(modifierType, weight) {
		this.modifierType = modifierType;
		this.weight = weight;
	}

	setTier(tier) {
		this.modifierType.setTier(tier);
	}
}


const modifierPool = {
	[ModifierTier.COMMON]: [
		new WeightedModifierType(new AddPokeballModifierType(PokeballType.POKEBALL, 5, 'pb'), 2),
		new WeightedModifierType(new PokemonHpRestoreModifierType('POTION', 20), 3),
		new PokemonHpRestoreModifierType('SUPER POTION', 50),
		new PokemonBaseStatBoosterModifierType('HP-UP', Stat.HP),
		new PokemonBaseStatBoosterModifierType('PROTEIN', Stat.ATK),
		new PokemonBaseStatBoosterModifierType('IRON', Stat.DEF),
		new PokemonBaseStatBoosterModifierType('CALCIUM', Stat.SPATK),
		new PokemonBaseStatBoosterModifierType('ZINC', Stat.SPDEF),
		new PokemonBaseStatBoosterModifierType('CARBOS', Stat.SPD)
	].map(m => { m.setTier(ModifierTier.COMMON); return m; }),
	[ModifierTier.GREAT]: [
		new AddPokeballModifierType(PokeballType.GREAT_BALL, 5, 'gb'),
		new PokemonReviveModifierType('REVIVE', 50),
		new PokemonHpRestoreModifierType('HYPER POTION', 100)
	].map(m => { m.setTier(ModifierTier.GREAT); return m; }),
	[ModifierTier.ULTRA]: [
		new AddPokeballModifierType(PokeballType.ULTRA_BALL, 5, 'ub'),
		new AllPokemonHpRestoreModifierType('MAX POTION', 100),
		new ModifierType('LUCKY EGG', 'Increases gain of EXP. Points by 25%', (type, _args) => new ExpBoosterModifier(type))
	].map(m => { m.setTier(ModifierTier.ULTRA); return m; }),
	[ModifierTier.MASTER]: [
		new AddPokeballModifierType(PokeballType.MASTER_BALL, 1, 'mb'),
		new WeightedModifierType(new ModifierType('SHINY CHARM', 'Dramatically increases the chance of a wild POkéMON being shiny', (type, _args) => new ShinyRateBoosterModifier(type)), 2)
	].map(m => { m.setTier(ModifierTier.MASTER); return m; })
};
const modifierPoolThresholds = Object.fromEntries(new Map(Object.keys(modifierPool).map(t => {
	const thresholds = new Map();
	let i = 0;
	modifierPool[t].reduce((total, modifierType) => {
		total += modifierType instanceof WeightedModifierType ? modifierType.weight : 1;
		thresholds.set(total, i++);
		return total;
	}, 0);
	return [t, Object.fromEntries(thresholds)];
})));

console.log(modifierPoolThresholds);

export function getNewModifierType() {
	const tierValue = Utils.randInt(256);
	const tier = tierValue >= 52 ? ModifierTier.COMMON : tierValue >= 8 ? ModifierTier.GREAT : tierValue >= 1 ? ModifierTier.ULTRA : ModifierTier.MASTER;
	const thresholds = Object.keys(modifierPoolThresholds[tier]);
	const totalWeight = parseInt(thresholds[thresholds.length - 1]);
	const value = Utils.randInt(totalWeight);
	let index;
	for (let t of thresholds) {
		let threshold = parseInt(t);
		if (value < threshold) {
			index = modifierPoolThresholds[tier][threshold];
			break;
		}
	}
	let modifierType = modifierPool[tier][index];
	if (modifierType instanceof WeightedModifierType)
		return modifierType.modifierType;
	return modifierType;
}