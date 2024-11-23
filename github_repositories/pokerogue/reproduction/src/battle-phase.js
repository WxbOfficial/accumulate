import { EnemyPokemon, PokemonMove } from "./pokemon.js";
import * as Utils from './utils.js';
import { allMoves, MOVE_CATEGORY } from "./move.js";
import { Mode } from './ui/ui.js';
import { Command } from "./ui/command-ui-handler.js";
import { Stat } from "./pokemon-stat.js";
import { ExpBoosterModifier, getNewModifierType, PokemonModifierType } from "./modifier.js";
import PartyUiHandler from "./ui/party-ui-handler.js";
import { doPokeballBounceAnim, getPokeballAtlasKey, getPokeballCatchMultiplier, getTintColor as getPokeballTintColor, PokeballType } from "./pokeball.js";
import { pokemonLevelMoves } from "./pokemon-level-moves.js";

export class BattlePhase {
	constructor(scene) {
		this.scene = scene;
	}

	start() {
		console.log(`Start Phase ${this.constructor.name}`);
	}

	end() {
		this.scene.shiftPhase();
	}
}

export class EncounterPhase extends BattlePhase {
	constructor(scene) {
		super(scene);
	}

	start() {
		super.start();

		const enemyPokemon = this.scene.getEnemyPokemon();
		enemyPokemon.tint(0, 0.5);
		this.scene.tweens.add({
			targets: [this.scene.arenaEnemy, enemyPokemon, this.scene.arenaPlayer, this.scene.trainer],
			x: (_target, _key, value, targetIndex) => targetIndex < 2 ? value + 300 : value - 300,
			duration: 2000,
			onComplete: () => {
				enemyPokemon.untint(100, 'Sine.easeOut');
				enemyPokemon.cry();
				enemyPokemon.showInfo();
				this.scene.ui.showText(`A wild ${enemyPokemon.name} appeared!`, null, () => this.end(), 1500);
			}
		});
	}

	end() {
		if (this.scene.getEnemyPokemon().shiny)
			this.scene.unshiftPhase(new ShinySparklePhase(this.scene, false));
		// TODO: Remove
		//this.scene.unshiftPhase(new SelectModifierPhase(this.scene));

		super.end();
	}
}

export class NextEncounterPhase extends BattlePhase {
	constructor(scene) {
		super(scene);
	}
	start() {
		super.start();

		this.scene.waveIndex++;

		console.log(this.scene.getPlayerPokemon(), this.scene.getParty().map(p => p.name), this.scene.getPlayerPokemon().id);

		this.scene.getEnemyPokemon().destroy();
		const newEnemyPokemon = new EnemyPokemon(this.scene, this.scene.randomSpecies(true), this.scene.getLevelForWave());
		this.scene.setEnemyPokemon(newEnemyPokemon);
		this.scene.field.add(newEnemyPokemon);
		this.scene.field.moveBelow(newEnemyPokemon, this.scene.getPlayerPokemon());
		newEnemyPokemon.tint(0, 0.5);
		this.scene.tweens.add({
			targets: [this.scene.arenaEnemy, this.scene.arenaEnemy2, newEnemyPokemon],
			x: '+=300',
			duration: 2000,
			onComplete: () => {
				this.scene.arenaEnemy.setX(this.scene.arenaEnemy2.x);
				this.scene.arenaEnemy2.setX(this.scene.arenaEnemy2.x - 300);
				newEnemyPokemon.untint(100, 'Sine.easeOut');
				newEnemyPokemon.cry();
				newEnemyPokemon.showInfo();
				this.scene.ui.showText(`A wild ${newEnemyPokemon.name} appeared!`, null, () => this.end(), 1500);
			}
		});
	}

	end() {
		if (this.scene.getEnemyPokemon().shiny)
			this.scene.unshiftPhase(new ShinySparklePhase(this.scene, false));

		this.scene.unshiftPhase(new CheckSwitchPhase(this.scene));

		super.end();
	}
}

export class SummonPhase extends BattlePhase {
	constructor(scene) {
		super(scene);
	}

	start() {
		super.start();

		this.preSummon();
	}

	preSummon() {
		this.scene.ui.showText(`Go! ${this.scene.getPlayerPokemon().name}!`);
		this.scene.trainer.play('trainer_m_pb');
		this.scene.tweens.add({
			targets: this.scene.trainer,
			x: -36,
			duration: 1000
		});
		this.scene.time.delayedCall(750, () => this.summon());
	}

	summon() {
		const pokeball = this.scene.add.sprite(36, 80, 'pb', 'pb');
		pokeball.setVisible(false);
		pokeball.setOrigin(0.5, 0.625);
		this.scene.field.add(pokeball);

		const playerPokemon = this.scene.getPlayerPokemon();

		pokeball.setVisible(true);
		this.scene.tweens.add({
			targets: pokeball,
			ease: 'Cubic.easeOut',
			duration: 150,
			x: 54,
			y: 70,
			onComplete: () => {
				this.scene.tweens.add({
					targets: pokeball,
					duration: 500,
					angle: 1440,
					x: 100,
					y: 132,
					ease: 'Cubic.easeIn',
					onComplete: () => {
						this.scene.sound.play('pb_rel');
						pokeball.destroy();
						this.scene.add.existing(playerPokemon);
						this.scene.field.add(playerPokemon);
						playerPokemon.showInfo();
						playerPokemon.setVisible(true);
						playerPokemon.setScale(0.5);
						playerPokemon.tint(getPokeballTintColor(playerPokemon.pokeball));
						playerPokemon.untint(250, 'Sine.easeIn');
						this.scene.tweens.add({
							targets: playerPokemon,
							duration: 250,
							ease: 'Sine.easeIn',
							scale: 1,
							onComplete: () => {
								playerPokemon.cry();
								playerPokemon.getSprite().clearTint();
								this.scene.time.delayedCall(1000, () => this.end());
							}
						});
					}
				});
			}
		});
	}

	end() {
		if (this.scene.getEnemyPokemon().shiny)
			this.scene.unshiftPhase(new ShinySparklePhase(this.scene, true));

		super.end();
	}
}

export class SwitchSummonPhase extends SummonPhase {
	constructor(scene, slotIndex, doReturn) {
		super(scene);

		this.slotIndex = slotIndex;
		this.doReturn = doReturn;
	}

	start() {
		super.start();
	}

	preSummon() {
		if (!this.doReturn) {
			this.switchAndSummon();
			return;
		}

		const playerPokemon = this.scene.getPlayerPokemon();

		this.scene.ui.showText(`Come back, ${this.scene.getPlayerPokemon().name}!`);
		this.scene.sound.play('pb_rel');
		playerPokemon.hideInfo();
		playerPokemon.tint(getPokeballTintColor(playerPokemon.pokeball), 1, 250, 'Sine.easeIn');
		this.scene.tweens.add({
			targets: playerPokemon,
			duration: 250,
			ease: 'Sine.easeIn',
			scale: 0.5,
			onComplete: () => {
				playerPokemon.setVisible(false);
				this.scene.field.remove(playerPokemon);
				this.scene.time.delayedCall(750, () => this.switchAndSummon());
			}
		});
	}

	switchAndSummon() {
		const party = this.scene.getParty();
		const switchedPokemon = party[this.slotIndex];
		party[this.slotIndex] = this.scene.getPlayerPokemon();
		party[0] = switchedPokemon;
		this.scene.ui.showText(`Go! ${switchedPokemon.name}!`);
		this.summon();
	}
}

export class CheckSwitchPhase extends BattlePhase {
	constructor(scene) {
		super(scene);
	}

	start() {
		super.start();

		this.scene.ui.showText('Will you switch\nPokémon?', null, () => {
			this.scene.ui.setMode(Mode.SWITCH_CHECK, () => this.end());
		});
	}
}

export class CommandPhase extends BattlePhase {
	constructor(scene) {
		super(scene);
	}

	start() {
		super.start();

		//interp(this.scene);

		this.scene.ui.setMode(Mode.COMMAND);
	}

	handleCommand(command, cursor) {
		const playerPokemon = this.scene.getPlayerPokemon();
		const enemyPokemon = this.scene.getEnemyPokemon();
		let success;
		let delayed;

		switch (command) {
			case Command.FIGHT:
				if (playerPokemon.trySelectMove(cursor)) {
					const playerPhase = new PlayerMovePhase(this.scene, playerPokemon, playerPokemon.moveset[cursor]);
					delayed = playerPokemon.stats[Stat.SPD] < enemyPokemon.stats[Stat.SPD]
						|| (playerPokemon.stats[Stat.SPD] === enemyPokemon.stats[Stat.SPD] && Utils.randInt(2) === 1);
					this.scene.pushPhase(playerPhase);
					success = true;
				}
				break;
			case Command.BALL:
				this.scene.unshiftPhase(new AttemptCapturePhase(this.scene, PokeballType.POKEBALL));
				success = true;
				break;
			case Command.POKEMON:
				this.scene.unshiftPhase(new SwitchSummonPhase(this.scene, cursor, true));
				success = true;
				break;
		}
		if (success) {
			const enemyMove = enemyPokemon.getNextMove();
			const enemyPhase = new EnemyMovePhase(this.scene, enemyPokemon, enemyMove);
			if (delayed)
				this.scene.unshiftPhase(enemyPhase);
			else
				this.scene.pushPhase(enemyPhase);
			this.end();
		}

		return success;
	}

	end() {
		super.end();
		this.scene.ui.setMode(Mode.MESSAGE);
	}
}

export class PokemonPhase extends BattlePhase {
	constructor(scene, player) {
		super(scene);

		this.player = player;
	}

	getPokemon() {
		return this.player ? this.scene.getPlayerPokemon() : this.scene.getEnemyPokemon();
	}
}

class MovePhase extends BattlePhase {
	constructor(scene, pokemon, move) {
		super(scene);

		this.pokemon = pokemon;
		this.move = move;
	}

	canMove() {
		return !!this.pokemon.hp;
	}

	start() {
		if (!this.canMove()) {
			this.end();
			return;
		}
		this.scene.ui.showText(`${this.pokemon.name} used\n${this.move.getName()}!`, null, () => this.end(), 500);
		if (this.move.getMove().category !== MOVE_CATEGORY.STATUS)
			this.scene.unshiftPhase(this.getDamagePhase());
	}
}

export class PlayerMovePhase extends MovePhase {
	constructor(scene, pokemon, move) {
		super(scene, pokemon, move);
	}

	getDamagePhase() {
		return new PlayerMoveEffectPhase(this.scene, this.move);
	}
}

export class EnemyMovePhase extends MovePhase {
	constructor(scene, pokemon, move) {
		super(scene, pokemon, move);
	}

	getDamagePhase() {
		return new EnemyMoveEffectPhase(this.scene, this.move);
	}
}

class MoveEffectPhase extends PokemonPhase {
	constructor(scene, player, move) {
		super(scene, player);

		this.move = move;
	}

	start() {
		this.getTargetPokemon().apply(this.getUserPokemon(), this.move, () => this.end());
		if (this.getTargetPokemon().hp <= 0) {
			this.scene.pushPhase(new FaintPhase(this.scene, !this.player));
		}
	}
}

export class PlayerMoveEffectPhase extends MoveEffectPhase {
	constructor(scene, move) {
		super(scene, true, move);
	}

	getUserPokemon() {
		return this.scene.getPlayerPokemon();
	}

	getTargetPokemon() {
		if (this.move.getMove().category === MOVE_CATEGORY.STATUS)
			return this.getUserPokemon();
		return this.scene.getEnemyPokemon();
	}
}

export class EnemyMoveEffectPhase extends MoveEffectPhase {
	constructor(scene, move) {
		super(scene, false, move);
	}

	getUserPokemon() {
		return this.scene.getEnemyPokemon();
	}

	getTargetPokemon() {
		if (this.move.getMove().category === MOVE_CATEGORY.STATUS)
			return this.getUserPokemon();
		return this.scene.getPlayerPokemon();
	}
}

export class MessagePhase extends BattlePhase {
	constructor(scene, text, prompt) {
		super(scene);

		this.text = text;
		this.prompt = prompt;
	}

	start() {
		super.start();

		this.scene.ui.showText(this.text, null, () => this.end(), this.prompt ? 0 : 1500, this.prompt);
	}
}

export class FaintPhase extends PokemonPhase {
	constructor(scene, player) {
		super(scene, player);
	}

	start() {
		super.start();

		if (this.player) {
			this.scene.unshiftPhase(new MessagePhase(this.scene, `${this.getPokemon().name} fainted!`, true));
			this.scene.unshiftPhase(new SwitchPhase(this.scene, true, false));
		}
		else {
			this.scene.unshiftPhase(new MessagePhase(this.scene, `Foe ${this.getPokemon().name} fainted!`, true));
			this.scene.unshiftPhase(new VictoryPhase(this.scene));
		}

		const pokemon = this.getPokemon();
		pokemon.faintCry(() => {
			pokemon.hideInfo();
			this.scene.sound.play('faint');
			this.scene.tweens.add({
				targets: pokemon,
				duration: 500,
				y: pokemon.y + 150,
				ease: 'Sine.easeIn',
				onComplete: () => {
					pokemon.setVisible(false);
					pokemon.y -= 150;
					this.scene.field.remove(pokemon);
					this.end();
				}
			});
		});
	}
}

export class VictoryPhase extends PokemonPhase {
	constructor(scene) {
		super(scene, true);
	}

	start() {
		super.start();

		if (this.scene.getPlayerPokemon().level < 100)
			this.scene.unshiftPhase(new ExpPhase(this.scene));
		this.scene.unshiftPhase(new SelectModifierPhase(this.scene));
		this.scene.unshiftPhase(new NextEncounterPhase(this.scene));

		this.end();
	}
}

export class SwitchPhase extends BattlePhase {
	constructor(scene, isModal, doReturn) {
		super(scene);

		this.doReturn = doReturn;
		this.isModal = isModal;
	}

	start() {
		super.start();

		this.scene.ui.setMode(Mode.PARTY, this.isModal, (slotIndex) => {
			if (slotIndex && slotIndex < 6)
				this.scene.unshiftPhase(new SwitchSummonPhase(this.scene, slotIndex, this.doReturn));
			this.scene.ui.setMode(Mode.MESSAGE);
			super.end();
		}, PartyUiHandler.FilterNonFainted);
	}
}

export class ExpPhase extends PokemonPhase {
	constructor(scene) {
		super(scene, true);
	}

	start() {
		super.start();

		const pokemon = this.getPokemon();
		let exp = new Utils.IntegerHolder(this.scene.getEnemyPokemon().getExpValue(pokemon.level));
		this.scene.applyModifiers(ExpBoosterModifier, exp);
		this.scene.ui.showText(`${pokemon.name} gained\n${exp.value} EXP. Points!`, null, () => {
			const lastLevel = pokemon.level;
			let newLevel;
			pokemon.addExp(exp.value);
			newLevel = pokemon.level;
			if (newLevel > lastLevel)
				this.scene.unshiftPhase(new LevelUpPhase(this.scene, newLevel));
			pokemon.updateInfo(() => this.end());
		}, null, true);
	}
}

export class LevelUpPhase extends PokemonPhase {
	constructor(scene, level) {
		super(scene, true);

		this.level = level;
	}

	start() {
		super.start();

		const pokemon = this.getPokemon();
		const prevStats = pokemon.stats.slice(0);
		pokemon.calculateStats();
		pokemon.updateInfo();
		this.scene.pauseBgm();
		this.scene.sound.play('level_up_fanfare');
		this.scene.ui.showText(`${this.getPokemon().name} grew to\nLV. ${this.level}!`, null, () => this.scene.ui.getMessageHandler().promptLevelUpStats(prevStats, false, () => this.end()), null, true);
		const levelMoves = pokemonLevelMoves[pokemon.species.speciesId];
		if (levelMoves) {
			for (let lm of levelMoves) {
				const level = lm[0];
				if (level < this.level)
					continue;
				else if (level > this.level)
					break;
				this.scene.unshiftPhase(new LearnMovePhase(this.scene, lm[1]));
			}
		}
		this.scene.time.delayedCall(1500, () => this.scene.resumeBgm());
	}
}

export class LearnMovePhase extends PokemonPhase {
	constructor(scene, moveId) {
		super(scene, true);

		this.moveId = moveId;
	}

	start() {
		super.start();

		const pokemon = this.getPokemon();
		const move = allMoves[this.moveId - 1];

		if (pokemon.moveset.length < 4) {
			pokemon.moveset.push(new PokemonMove(this.moveId, 0, 0));
			this.scene.sound.play('level_up_fanfare');
			this.scene.ui.showText(`${pokemon.name} learned\n${Utils.toPokemonUpperCase(move.name)}!`, null, () => this.end(), null, true);
		}
		else
			this.end();
	}
}

export class AttemptCapturePhase extends BattlePhase {
	constructor(scene, pokeballType) {
		super(scene);

		this.pokeballType = pokeballType;
	}

	start() {
		super.start();

		const pokemon = this.scene.getEnemyPokemon();
		this.originalY = pokemon.y;

		const _3m = 3 * pokemon.getMaxHp();
		const _2h = 2 * pokemon.hp;
		const catchRate = pokemon.species.catchRate;
		const pokeballMultiplier = getPokeballCatchMultiplier(this.pokeballType);
		const statusMultiplier = 1;
		const x = Math.round((((_3m - _2h) * catchRate * pokeballMultiplier) / _3m) * statusMultiplier);
		const y = Math.round(65536 / Math.sqrt(Math.sqrt(255 / x)));

		const pokeballAtlasKey = getPokeballAtlasKey(this.pokeballType);
		this.pokeball = this.scene.add.sprite(16, 80, 'pb', pokeballAtlasKey);
		this.pokeball.setOrigin(0.5, 0.625);
		this.scene.field.add(this.pokeball);

		this.scene.sound.play('pb_throw');
		this.scene.time.delayedCall(300, () => {
			this.scene.field.moveBelow(this.pokeball, pokemon);
		});
		this.scene.tweens.add({
			targets: this.pokeball,
			x: { value: 236, ease: 'Linear' },
			y: { value: 16, ease: 'Cubic.easeOut' },
			duration: 500,
			onComplete: () => {
				this.pokeball.setTexture('pb', `${pokeballAtlasKey}_opening`);
				this.scene.time.delayedCall(17, () => this.pokeball.setTexture('pb', `${pokeballAtlasKey}_open`));
				this.scene.sound.play('pb_rel');
				pokemon.tint(getPokeballTintColor(this.pokeballType));
				this.scene.tweens.add({
					targets: pokemon,
					duration: 250,
					ease: 'Sine.easeIn',
					scale: 0.25,
					y: 20,
					onComplete: () => {
						this.pokeball.setTexture('pb', `${pokeballAtlasKey}_opening`);
						pokemon.setVisible(false);
						this.scene.sound.play('pb_catch');
						this.scene.time.delayedCall(17, () => this.pokeball.setTexture('pb', `${pokeballAtlasKey}`));

						const doShake = this.pokeballType !== PokeballType.MASTER_BALL ? () => {
							let shakeCount = 0;
							const pbX = this.pokeball.x;
							const shakeCounter = this.scene.tweens.addCounter({
								from: 0,
								to: 1,
								repeat: 4,
								yoyo: true,
								ease: 'Cubic.easeOut',
								duration: 250,
								repeatDelay: 500,
								onUpdate: t => {
									if (shakeCount && shakeCount < 4) {
										const value = t.getValue();
										const directionMultiplier = shakeCount % 2 === 1 ? 1 : -1;
										this.pokeball.setX(pbX + value * 4 * directionMultiplier);
										this.pokeball.setAngle(value * 27.5 * directionMultiplier);
									}
								},
								onRepeat: t => {
									if (shakeCount++ < 3) {
										if (Utils.randInt(65536) < y)
											this.scene.sound.play('pb_move');
										else {
											shakeCounter.stop();
											this.release(shakeCount);
										}
									}
									else
										this.scene.sound.play('pb_lock');
								},
								onComplete: () => {
									this.catch();
								}
							});
						} : () => this.catch();

						this.scene.time.delayedCall(250, () => doPokeballBounceAnim(this.scene, this.pokeball, 16, 72, 350, doShake));
					}
				});
			}
		});
	}

	release(shakeCount) {
		const pokemon = this.scene.getEnemyPokemon();

		this.scene.sound.play('pb_rel');
		pokemon.setY(this.originalY);
		pokemon.cry();
		pokemon.tint(getPokeballTintColor(this.pokeballType));
		pokemon.setVisible(true);
		pokemon.untint(250, 'Sine.easeOut');

		const pokeballAtlasKey = getPokeballAtlasKey(this.pokeballType);
		this.pokeball.setTexture('pb', `${pokeballAtlasKey}_opening`);
		this.scene.time.delayedCall(17, () => this.pokeball.setTexture('pb', `${pokeballAtlasKey}_open`));

		this.scene.tweens.add({
			targets: pokemon,
			duration: 250,
			ease: 'Sine.easeOut',
			scale: 1
		});

		this.removePb();
		this.end();
	}

	catch() {
		console.log(this, 'catch');
		const pokemon = this.scene.getEnemyPokemon();
		this.scene.unshiftPhase(new VictoryPhase(this.scene));
		this.scene.ui.showText(`${pokemon.name} was caught!`, null, () => {
			pokemon.hideInfo();
			pokemon.addToParty();
			this.scene.field.remove(pokemon, true);
			this.removePb();
			this.end();
		}, 0, true);
	}

	removePb() {
		this.scene.tweens.add({
			targets: this.pokeball,
			duration: 250,
			delay: 250,
			ease: 'Sine.easeIn',
			alpha: 0,
			onComplete: () => this.pokeball.destroy()
		});
	}
}

export class SelectModifierPhase extends BattlePhase {
	constructor(scene) {
		super(scene);
	}

	start() {
		super.start();

		const types = [getNewModifierType(), getNewModifierType(), getNewModifierType()];

		this.scene.ui.setMode(Mode.MODIFIER_SELECT, types, (cursor) => {
			if (cursor < 0) {
				this.scene.ui.setMode(Mode.MESSAGE);
				super.end();
				return;
			}

			const modifierType = types[cursor];
			if (modifierType instanceof PokemonModifierType) {
				const pokemonModifierType = modifierType;
				this.scene.ui.setModeWithoutClear(Mode.PARTY, false, (slotIndex) => {
					if (slotIndex < 6) {
						this.scene.ui.setMode(Mode.MODIFIER_SELECT);
						this.scene.addModifier(types[cursor].newModifier(this.scene.getParty()[slotIndex].id));
						this.scene.ui.setMode(Mode.MESSAGE);
						super.end();
					}
					else
						this.scene.ui.setMode(Mode.MODIFIER_SELECT);
				}, pokemonModifierType.selectFilter);
			}
			else {
				this.scene.addModifier(types[cursor].newModifier());
				this.scene.ui.setMode(Mode.MESSAGE);
				super.end();
			}
		});
	}
}

export class ShinySparklePhase extends PokemonPhase {
	constructor(scene, player) {
		super(scene, player);
	}

	start() {
		super.start();

		this.getPokemon().sparkle();
		this.scene.time.delayedCall(1000, () => this.end());
	}
}
