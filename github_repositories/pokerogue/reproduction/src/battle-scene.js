// import * as Phaser from 'phaser';
import { ArenaType, Arena } from './arena.js';
import UI from './ui/ui.js';
import { EncounterPhase, SummonPhase, CommandPhase } from './battle-phase.js';
import { PlayerPokemon, EnemyPokemon } from './pokemon.js';
import { allSpecies } from './pokemon-species.js';
import * as Utils from './utils.js';
import { ModifierBar, ConsumablePokemonModifier, ConsumableModifier, PokemonModifier } from './modifier.js';
import { PokeballType } from './pokeball.js';

export default class BattleScene extends Phaser.Scene {

	constructor() {
		super('battle');
		this.pokeballCounts = Object.fromEntries(Utils.getEnumValues(PokeballType).map(t => [t, 0]));
		this.trainerId = Utils.randInt(65536);
		this.secretId = Utils.randInt(65536);
		this.phaseQueue = [];
		this.phaseQueuePrepend = [];
	}

	loadImage(key, folder, filename) {
		if (!filename)
			filename = `${key}.png`;
		this.load.image(key, `images/${folder}/${filename}`);
	}

	loadAtlas(key, folder, filenameRoot) {
		if (!filenameRoot)
			filenameRoot = key;
		if (folder)
			folder += '/';
		this.load.atlas(key, `images/${folder}${filenameRoot}.png`, `images/${folder}/${filenameRoot}.json`);
	}

	loadSe(key, folder, filenames) {
		if (!filenames)
			filenames = `${key}.wav`;
		if (!folder)
			folder = '';
		else
			folder += '/';
		if (!Array.isArray(filenames))
			filenames = [filenames];
		for (let f of filenames) {
			this.load.audio(key, `audio/se/${folder}${f}`);
		}
	}

	loadBgm(key, filename) {
		if (!filename)
			filename = `${key}.mp3`;
		this.load.audio(key, `audio/bgm/${filename}`);
	}

	preload() {
		// Load menu images
		this.loadImage('bg', 'ui');
		this.loadImage('bg_command', 'ui');
		this.loadImage('bg_fight', 'ui');
		this.loadAtlas('prompt', 'ui');
		this.loadImage('cursor', 'ui');
		this.loadImage('pbinfo_player', 'ui');
		this.loadImage('pbinfo_enemy', 'ui');
		this.loadImage('overlay_lv', 'ui');
		this.loadAtlas('numbers', 'ui');
		this.loadAtlas('overlay_hp', 'ui');
		this.loadImage('overlay_exp', 'ui');
		this.loadImage('level_up_stats', 'ui');
		this.loadImage('boolean_window', 'ui');

		this.loadImage('party_bg', 'ui');
		this.loadAtlas('party_slot_main', 'ui');
		this.loadAtlas('party_slot', 'ui');
		this.loadImage('party_slot_overlay_lv', 'ui');
		this.loadImage('party_slot_hp_bar', 'ui');
		this.loadAtlas('party_slot_hp_overlay', 'ui');
		this.loadAtlas('party_pb', 'ui');
		this.loadImage('party_message', 'ui');
		this.loadImage('party_message_large', 'ui');
		this.loadAtlas('party_cancel', 'ui');

		// Load arena images
		for (let a = 1; a <= 15; a++) {
			const arenaId = Utils.padInt(a, 2);
			this.loadImage(`arena_${arenaId}`, 'arenas', `${arenaId}.png`);
			this.loadImage(`arena_${arenaId}a`, 'arenas', `${arenaId}a.png`);
			this.loadImage(`arena_${arenaId}b`, 'arenas', `${arenaId}b.png`);
		}

		// Load trainer images
		this.loadImage('trainer_m', 'trainer');
		this.loadAtlas('trainer_m_pb', 'trainer');

		// Load pokemon-related images
		this.loadImage(`pkmn__back__sub`, 'pokemon/back', 'sub.png');
		this.loadImage(`pkmn__sub`, 'pokemon', 'sub.png');
		this.loadAtlas('shiny', 'effects');

		this.loadAtlas('pb', '');
		this.loadAtlas('items', '');

		for (let i = 0; i < 6; i++)
			this.loadAtlas(`pokemon_icons_${i}`, 'ui');

		this.loadSe('select');
		this.loadSe('menu_open');
		this.loadSe('hit');
		this.loadSe('hit_strong');
		this.loadSe('hit_weak');
		this.loadSe('faint');
		this.loadSe('flee');
		this.loadSe('exp');
		this.loadSe('level_up');
		this.loadSe('shiny');
		this.loadSe('restore');
		this.loadSe('error');

		this.loadSe('pb');
		this.loadSe('pb_rel');
		this.loadSe('pb_throw');
		this.loadSe('pb_bounce_1');
		this.loadSe('pb_bounce_2');
		this.loadSe('pb_move');
		this.loadSe('pb_catch');
		this.loadSe('pb_lock');

		this.loadSe('m_bubble');
		this.loadSe('m_bubble3');
		this.loadSe('m_crabhammer');

		this.loadBgm('level_up_fanfare');
	}

	create() {
		this.load.setBaseURL();

		const field = this.add.container(0, 0);
		field.setScale(6);

		this.field = field;

		// Init arena
		const arenas = [
			new Arena(this, ArenaType.PLAINS, 'battle'),
			new Arena(this, ArenaType.GRASS, 'grass'),
			new Arena(this, ArenaType.FOREST, 'forest'),
			new Arena(this, ArenaType.WATER, 'water'),
			new Arena(this, ArenaType.SWAMP, 'swamp'),
			new Arena(this, ArenaType.SEA, 'sea'),
			new Arena(this, ArenaType.MOUNTAIN, 'mountain'),
			new Arena(this, ArenaType.LAND, 'land'),
			new Arena(this, ArenaType.CAVE, 'cave'),
			new Arena(this, ArenaType.DESERT, 'desert'),
			new Arena(this, ArenaType.ARENA_BROWN, 'elite_1'),
			new Arena(this, ArenaType.ARENA_BLUE, 'elite_2'),
			new Arena(this, ArenaType.ARENA_PURPLE, 'elite_3'),
			new Arena(this, ArenaType.ARENA_PINK, 'elite_4'),
			new Arena(this, ArenaType.ARENA_ORANGE, 'elite_5')
		];
		const arena = arenas[Utils.randInt(15)];

		this.arena = arena;

		this.arenaBg = this.add.image(0, 0, `arena_${Utils.padInt(arena.type, 2)}`);
		this.arenaPlayer = this.add.image(340, 20, `arena_${Utils.padInt(arena.type, 2)}a`);
		this.arenaEnemy = this.add.image(-240, 13, `arena_${Utils.padInt(arena.type, 2)}b`);
		this.arenaEnemy2 = this.add.image(-240, 13, `arena_${Utils.padInt(arena.type, 2)}b`);

		[this.arenaBg, this.arenaPlayer, this.arenaEnemy, this.arenaEnemy2].forEach(a => {
			a.setOrigin(0, 0);
			field.add(a);
		});
		//arena.playBgm();

		const fieldUI = this.add.container(0, this.game.canvas.height);
		fieldUI.setScale(6);

		this.fieldUI = fieldUI;

		const uiContainer = this.add.container(0, 0);
		uiContainer.setScale(6);

		this.uiContainer = uiContainer;

		this.modifiers = [];

		this.modifierBar = new ModifierBar(this);
		this.add.existing(this.modifierBar);
		uiContainer.add(this.modifierBar);

		this.waveIndex = 1;

		this.party = [];

		for (let s = 0; s < 3; s++) {
			const playerSpecies = this.randomSpecies();
			const playerPokemon = new PlayerPokemon(this, playerSpecies, 5);
			playerPokemon.setVisible(false);

			this.party.push(playerPokemon);
		}

		const enemySpecies = arena.randomSpecies(1);
		console.log(enemySpecies.name);
		const enemyPokemon = new EnemyPokemon(this, enemySpecies, this.getLevelForWave());

		this.add.existing(enemyPokemon);
		this.enemyPokemon = enemyPokemon;

		field.add(enemyPokemon);

		console.log(this.getPlayerPokemon().species.name, this.getPlayerPokemon().species.speciesId, this.getPlayerPokemon().stats);
		console.log(enemyPokemon.species.name, enemyPokemon.species.speciesId, enemyPokemon.stats);

		const trainerPbFrameNames = this.anims.generateFrameNames('trainer_m_pb', { zeroPad: 2, start: 1, end: 12 });
		this.anims.create({
			key: 'trainer_m_pb',
			frames: trainerPbFrameNames,
			frameRate: 16
		});

		const trainer = this.add.sprite(406, 132, 'trainer_m');
		trainer.setOrigin(0.5, 1);

		field.add(trainer);

		this.trainer = trainer;

		this.anims.create({
			key: 'prompt',
			frames: this.anims.generateFrameNumbers('prompt', { start: 1, end: 4 }),
			frameRate: 6,
			repeat: -1,
			showOnStart: true
		});

		const ui = new UI(this);
		this.uiContainer.add(ui);

		this.ui = ui;

		ui.setup();

		this.phaseQueue.push(new EncounterPhase(this), new SummonPhase(this));

		this.shiftPhase();

		this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
		this.cancelKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
	}

	update() {
		this.checkInput();
	}

	getParty() {
		return this.party;
	}

	getPlayerPokemon() {
		return this.getParty()[0];
	}

	getEnemyPokemon() {
		return this.enemyPokemon;
	}

	setEnemyPokemon(enemyPokemon) {
		this.enemyPokemon = enemyPokemon;
	}

	randomSpecies(fromArenaPool) {
		return fromArenaPool
			? this.arena.randomSpecies(1)
			: allSpecies[(Utils.randInt(allSpecies.length)) - 1];
	}

	getLevelForWave() {
		if (this.waveIndex === 1)
			return 5;
		let averageLevel = 5 + this.waveIndex * 0.5;

		if (this.waveIndex % 10 === 0)
			return averageLevel + 5;

		const deviation = 10 / this.waveIndex;

		return averageLevel + Math.round(Utils.randGauss(deviation));
	}

	checkInput() {
		if (this.blockInput)
			return;
		if (this.upKey.isDown)
			this.ui.processInput(this.upKey.keyCode);
		else if (this.downKey.isDown)
			this.ui.processInput(this.downKey.keyCode);
		else if (this.leftKey.isDown)
			this.ui.processInput(this.leftKey.keyCode);
		else if (this.rightKey.isDown)
			this.ui.processInput(this.rightKey.keyCode);
		else if (this.actionKey.isDown)
			this.ui.processInput(this.actionKey.keyCode);
		else if (this.cancelKey.isDown)
			this.ui.processInput(this.cancelKey.keyCode);
		else
			return;
		this.blockInput = true;
		this.time.delayedCall(250, () => {
			this.blockInput = false;
		});
	}

	playBgm(bgmName) {
		if (this.bgm) {
			this.bgm.stop();
			this.bgm.destroy();
		}
		this.bgm = this.sound.add(bgmName, { loop: true });
		this.bgm.play();
	}

	pauseBgm() {
		if (this.bgm)
			this.bgm.pause();
	}

	resumeBgm() {
		if (this.bgm && this.bgm.isPaused)
			this.bgm.resume();
	}

	getCurrentPhase() {
		return this.currentPhase;
	}

	pushPhase(phase) {
		this.phaseQueue.push(phase);
	}

	unshiftPhase(phase) {
		this.phaseQueuePrepend.push(phase);
	}

	clearPhaseQueue() {
		this.phaseQueue.splice(0, this.phaseQueue.length);
	}

	shiftPhase() {
		if (this.phaseQueuePrepend.length) {
			while (this.phaseQueuePrepend.length)
				this.phaseQueue.unshift(this.phaseQueuePrepend.pop());
		}
		if (!this.phaseQueue.length)
			this.populatePhaseQueue();
		this.currentPhase = this.phaseQueue.shift();
		this.currentPhase.start();
	}

	populatePhaseQueue() {
		this.phaseQueue.push(new CommandPhase(this));
	}

	addModifier(modifier) {
		if (modifier.add(this.modifierBar, this.modifiers))
			this.sound.play('restore');

		if (modifier instanceof ConsumableModifier) {
			const args = [this];
			if (modifier.shouldApply(args))
				modifier.apply(args);
			return;
		}

		if (modifier instanceof PokemonModifier) {
			for (let p in this.party) {
				const pokemon = this.party[p];

				if (modifier instanceof ConsumablePokemonModifier) {
					const args = [pokemon];
					if (modifier.shouldApply(args))
						modifier.apply(args);
				}

				pokemon.calculateStats();
				pokemon.updateInfo();
			}
		}
	}

	applyModifiers(modifierType, ...args) {
		const modifiers = this.modifiers.filter(m => m instanceof modifierType && m.shouldApply(args));
		for (let modifier of modifiers) {
			if (modifier.apply(args))
				console.log('Applied', modifier.type.name);
		}
	}
}