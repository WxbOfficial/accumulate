// import * as Phaser from 'phaser';
import BattleMessageUiHandler from './battle-message-ui-handler.js';
import CommandUiHandler from './command-ui-handler.js';
import PartyUiHandler from './party-ui-handler.js';
import FightUiHandler from './fight-ui-handler.js';
import MessageUiHandler from './message-ui-handler.js';
import SwitchCheckUiHandler from './switch-check-ui-handler.js';
import ModifierSelectUiHandler from './modifier-select-ui-handler.js';

export var Mode;
(function (Mode) {
	Mode[Mode["MESSAGE"] = 0] = "MESSAGE";
	Mode[Mode["COMMAND"] = 1] = "COMMAND";
	Mode[Mode["FIGHT"] = 2] = "FIGHT";
	Mode[Mode["SWITCH_CHECK"] = 3] = "SWITCH_CHECK";
	Mode[Mode["MODIFIER_SELECT"] = 4] = "MODIFIER_SELECT";
	Mode[Mode["PARTY"] = 5] = "PARTY";
})(Mode || (Mode = {}));

export default class UI extends Phaser.GameObjects.Container {

	constructor(scene) {
		super(scene, 0, scene.game.canvas.height / 6);

		this.mode = Mode.MESSAGE;
		this.handlers = [
			new BattleMessageUiHandler(scene),
			new CommandUiHandler(scene),
			new FightUiHandler(scene),
			new SwitchCheckUiHandler(scene),
			new ModifierSelectUiHandler(scene),
			new PartyUiHandler(scene)
		];
	}

	setup() {
		for (let handler of this.handlers) {
			handler.setup();
		}
	}

	getHandler() {
		return this.handlers[this.mode];
	}

	getMessageHandler() {
		return this.handlers[Mode.MESSAGE];
	}

	processInput(keyCode) {
		this.getHandler().processInput(keyCode);
	}

	showText(text, delay, callback, callbackDelay, prompt) {
		const handler = this.getHandler();
		if (handler instanceof MessageUiHandler)
			handler.showText(text, delay, callback, callbackDelay, prompt);
		else
			this.getMessageHandler().showText(text, delay, callback, callbackDelay, prompt);
	}

	clearText() {
		const handler = this.getHandler();
		if (handler instanceof MessageUiHandler)
			handler.clearText();
		else
			this.getMessageHandler().clearText();
	}

	setCursor(cursor) {
		const changed = this.getHandler().setCursor(cursor);
		if (changed)
			this.playSelect();

		return changed;
	}

	playSelect() {
		this.scene.sound.play('select');
	}

	playError() {
		this.scene.sound.play('error');
	}

	setMode(mode, ...args) {
		if (this.mode === mode)
			return;
		this.getHandler().clear();
		this.mode = mode;
		this.getHandler().show(args);
	}

	setModeWithoutClear(mode, ...args) {
		if (this.mode === mode)
			return;
		this.mode = mode;
		this.getHandler().show(args);
	}
}