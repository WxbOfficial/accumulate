// import * as Phaser from 'phaser';
import { getLevelTotalExp, getLevelRelExp } from './exp.js';
import * as Utils from './utils.js';

export default class BattleInfo extends Phaser.GameObjects.Container {
	constructor(scene, x, y, player) {
		super(scene, x, y);
		this.player = player;
		this.lastHp = -1;
		this.lastMaxHp = -1;
		this.lastHpFrame = null;
		this.lastExp = -1;
		this.lastLevelExp = -1;
		this.lastLevel = -1;
		this.lastName = null;

		// Initially invisible and shown via Pokemon.showInfo
		this.setVisible(false);

		const box = this.scene.add.image(0, 0, `pbinfo_${player ? 'player' : 'enemy'}`);
		box.setOrigin(1, 0.5);
		this.add(box);

		const nameText = this.scene.add.text(player ? -115 : -124, player ? -15.2 : -11.2, '', {
			color: '#404040',
			font: '72px emerald'
		});
		nameText.setShadow(4, 4, '#ded6b5');
		nameText.setOrigin(0, 0);
		nameText.setScale(0.1666666667);
		this.add(nameText);

		this.nameText = nameText;

		const levelContainer = this.scene.add.container(player ? -41 : -50, player ? -10 : -5);
		this.add(levelContainer);

		this.levelContainer = levelContainer;

		const levelOverlay = this.scene.add.image(0, 0, 'overlay_lv');
		levelContainer.add(levelOverlay);

		const hpBar = this.scene.add.image(player ? -61 : -71, player ? -1 : 4.5, 'overlay_hp');
		hpBar.setOrigin(0);
		this.add(hpBar);

		this.hpBar = hpBar;

		const levelNumbersContainer = this.scene.add.container(9.5, 0);
		levelContainer.add(levelNumbersContainer);

		this.levelNumbersContainer = levelNumbersContainer;

		if (this.player) {
			const hpNumbersContainer = this.scene.add.container(-15, 10);
			this.add(hpNumbersContainer);

			this.hpNumbersContainer = hpNumbersContainer;

			const expBar = this.scene.add.image(-98, 18, 'overlay_exp');
			expBar.setOrigin(0);
			expBar.setScale(0, 1);
			this.add(expBar);

			this.expBar = expBar;
		}
	}

	initInfo(battler) {
		this.nameText.setText(battler.name);
		this.lastName = battler.species.name;

		this.hpBar.setScale(battler.hp / battler.getMaxHp(), 1);
		if (this.player)
			this.setHpNumbers(battler.hp, battler.getMaxHp());
		this.lastHp = battler.hp;
		this.lastHpFrame = this.hpBar.scaleX > 0.5 ? 'high' : this.hpBar.scaleX > 0.25 ? 'medium' : 'low';
		this.lastMaxHp = battler.getMaxHp();

		this.setLevel(battler.level);
		this.lastLevel = battler.level;

		if (this.player) {
			this.expBar.setScale(battler.levelExp / getLevelTotalExp(battler.level, battler.species.growthRate), 1);
			this.lastExp = battler.exp;
			this.lastLevelExp = battler.levelExp;
		}
	}

	updateInfo(battler, callback) {
		if (!this.scene)
			return;

		if (this.lastName !== battler.species.name) {
			this.nameText.setText(battler.name);
			this.lastName = battler.species.name;
		}

		const updatePokemonHp = () => {
			const duration = Utils.clampInt(Math.abs((this.lastHp) - battler.hp) * 5, 250, 5000);
			this.scene.tweens.add({
				targets: this.hpBar,
				ease: 'Sine.easeOut',
				scaleX: battler.hp / battler.getMaxHp(),
				duration: duration,
				onUpdate: () => {
					if (this.player && this.lastHp !== battler.hp) {
						const tweenHp = Math.ceil(this.hpBar.scaleX * battler.getMaxHp());
						this.setHpNumbers(tweenHp, battler.getMaxHp());
						this.lastHp = tweenHp;
					}

					const hpFrame = this.hpBar.scaleX > 0.5 ? 'high' : this.hpBar.scaleX > 0.25 ? 'medium' : 'low';
					if (hpFrame !== this.lastHpFrame) {
						this.hpBar.setFrame(hpFrame);
						this.lastHpFrame = hpFrame;
					}
				},
				onComplete: () => {
					if (callback) {
						callback();
						callback = null;
					}
				}
			});
			if (!this.player)
				this.lastHp = battler.hp;
			this.lastMaxHp = battler.getMaxHp();
		};

		if (this.player && this.lastExp !== battler.exp) {
			const originalCallback = callback;
			callback = () => this.updatePokemonExp(battler, originalCallback);
		}

		if (this.lastHp !== battler.hp || this.lastMaxHp !== battler.getMaxHp())
			updatePokemonHp();
		else if (!this.player && this.lastLevel !== battler.level) {
			this.setLevel(battler.level);
			this.lastLevel = battler.level;
			if (callback)
				callback();
		} else if (callback)
			callback();
	}

	updatePokemonExp(battler, callback) {
		const levelUp = this.lastLevel < battler.level;
		const relLevelExp = getLevelRelExp(this.lastLevel + 1, battler.species.growthRate);
		const levelExp = levelUp ? relLevelExp : battler.levelExp;
		let ratio = levelExp / relLevelExp;
		let duration = ((levelExp - this.lastLevelExp) / relLevelExp) * 1650;
		this.scene.sound.play('exp');
		this.scene.tweens.add({
			targets: this.expBar,
			ease: 'Sine.easeIn',
			scaleX: ratio,
			duration: duration,
			onUpdate: () => {
				if (this.player && this.lastHp !== battler.hp) {
					const tweenHp = Math.ceil(this.hpBar.scaleX * battler.getMaxHp());
					this.setHpNumbers(tweenHp, battler.getMaxHp());
					this.lastHp = tweenHp;
				}

				const hpFrame = this.hpBar.scaleX > 0.5 ? 'high' : this.hpBar.scaleX > 0.25 ? 'medium' : 'low';
				if (hpFrame !== this.lastHpFrame) {
					this.hpBar.setFrame(hpFrame);
					this.lastHpFrame = hpFrame;
				}
			},
			onComplete: () => {
				this.scene.sound.stopByKey('exp');
				if (ratio === 1) {
					this.lastLevelExp = 0;
					this.lastLevel++;
					this.scene.sound.play('level_up');
					this.setLevel(this.lastLevel);
					this.scene.time.delayedCall(500, () => {
						this.expBar.setScale(0, 1);
						this.updateInfo(battler, callback);
					});
					return;
				} else {
					this.lastExp = battler.exp;
					this.lastLevelExp = battler.levelExp;
				}
				if (callback) {
					callback();
					callback = null;
				}
			}
		});
	}

	setLevel(level) {
		this.levelNumbersContainer.removeAll();
		const levelStr = level.toString();
		for (let i = 0; i < levelStr.length; i++)
			this.levelNumbersContainer.add(this.scene.add.image(i * 8, 0, 'numbers', levelStr[i]));
		this.levelContainer.setX((this.player ? -41 : -50) - 8 * Math.max(levelStr.length - 3, 0));
	}

	setHpNumbers(hp, maxHp) {
		if (!this.player)
			return;
		this.hpNumbersContainer.removeAll();
		const hpStr = hp.toString();
		const maxHpStr = maxHp.toString();
		let offset = 0;
		for (let i = maxHpStr.length - 1; i >= 0; i--)
			this.hpNumbersContainer.add(this.scene.add.image(offset++ * -8, 0, 'numbers', maxHpStr[i]));
		this.hpNumbersContainer.add(this.scene.add.image(offset++ * -8, 0, 'numbers', '/'));
		for (let i = hpStr.length - 1; i >= 0; i--)
			this.hpNumbersContainer.add(this.scene.add.image(offset++ * -8, 0, 'numbers', hpStr[i]));
	}
}

export class PlayerBattleInfo extends BattleInfo {
	constructor(scene) {
		super(scene, Math.floor(scene.game.canvas.width / 6) - 10, -72, true);
	}
}

export class EnemyBattleInfo extends BattleInfo {
	constructor(scene) {
		super(scene, 140, -141, false);
	}
}