// import * as Phaser from 'phaser';
import { addTextObject, TextStyle } from "../text.js";
import { toPokemonUpperCase } from "../utils.js";
import { Mode } from "./ui.js";
import UiHandler from "./uiHandler.js";

export var Command;
(function (Command) {
	Command[Command["FIGHT"] = 0] = "FIGHT";
	Command[Command["BALL"] = 1] = "BALL";
	Command[Command["POKEMON"] = 2] = "POKEMON";
	Command[Command["RUN"] = 3] = "RUN";
})(Command || (Command = {}));

export default class CommandUiHandler extends UiHandler {

	constructor(scene) {
		super(scene, Mode.COMMAND);
	}

	setup() {
		const ui = this.getUi();
		const commands = ['Fight', 'Ball', 'Pokémon', 'Run'].map(s => toPokemonUpperCase(s));

		this.commandsContainer = this.scene.add.container(216, -38.7);
		this.commandsContainer.setVisible(false);
		ui.add(this.commandsContainer);

		for (let c = 0; c < commands.length; c++) {
			const commandText = addTextObject(this.scene, c % 2 === 0 ? 0 : 55.8, c < 2 ? 0 : 16, commands[c], TextStyle.WINDOW);
			this.commandsContainer.add(commandText);
		}
	}

	show(args) {
		super.show(args);

		this.commandsContainer.setVisible(true);

		const messageHandler = this.getUi().getMessageHandler();
		messageHandler.bg.setTexture('bg_command');
		messageHandler.message.setWordWrapWidth(1110);
		messageHandler.showText(`What will\n${this.scene.getPlayerPokemon().name} do?`, 0);
		this.setCursor(this.cursor);
	}

	processInput(keyCode) {
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;
		const ui = this.getUi();

		let success = false;

		if (keyCode === keyCodes.X || keyCode === keyCodes.Z) {

			if (keyCode === keyCodes.Z) {
				switch (this.cursor) {
					case 0:
						ui.setMode(Mode.FIGHT);
						success = true;
						break;
					case 1:
						this.scene.getCurrentPhase().handleCommand(Command.BALL, this.cursor);
						success = true;
						break;
					case 2:
						ui.setMode(Mode.PARTY);
						success = true;
						break;
				}
			}
		} else {
			switch (keyCode) {
				case keyCodes.UP:
					if (this.cursor >= 2)
						success = this.setCursor(this.cursor - 2);
					break;
				case keyCodes.DOWN:
					if (this.cursor < 2)
						success = this.setCursor(this.cursor + 2);
					break;
				case keyCodes.LEFT:
					if (this.cursor % 2 === 1)
						success = this.setCursor(this.cursor - 1);
					break;
				case keyCodes.RIGHT:
					if (this.cursor % 2 === 0)
						success = this.setCursor(this.cursor + 1);
					break;
			}
		}

		if (success)
			ui.playSelect();
	}

	setCursor(cursor) {
		const ui = this.getUi();
		const ret = super.setCursor(cursor);

		if (!this.cursorObj) {
			this.cursorObj = this.scene.add.image(0, 0, 'cursor');
			ui.add(this.cursorObj);
		}

		this.cursorObj.setPosition(211 + (cursor % 2 === 1 ? 56 : 0), -31 + (cursor >= 2 ? 16 : 0));

		return ret;
	}

	clear() {
		super.clear();
		this.commandsContainer.setVisible(false);
		this.getUi().getMessageHandler().clearText();
		this.eraseCursor();
	}

	eraseCursor() {
		if (this.cursorObj)
			this.cursorObj.destroy();
		this.cursorObj = null;
	}
}