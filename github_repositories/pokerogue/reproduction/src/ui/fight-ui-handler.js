// import * as Phaser from 'phaser';
import { addTextObject, TextStyle } from "../text.js";
import { Command } from "./command-ui-handler.js";
import { Mode } from "./ui.js";
import UiHandler from "./uiHandler.js";

export default class FightUiHandler extends UiHandler {

	constructor(scene) {
		super(scene, Mode.FIGHT);
	}

	setup() {
		const ui = this.getUi();

		const movesContainer = this.scene.add.container(18, -38.7);
		ui.add(movesContainer);

		this.movesContainer = movesContainer;
	}

	show(args) {
		super.show(args);

		const messageHandler = this.getUi().getMessageHandler();
		messageHandler.bg.setTexture('bg_fight');
		this.setCursor(this.cursor);
		this.displayMoves();
	}

	processInput(keyCode) {
		const ui = this.getUi();
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;

		let success = false;

		if (keyCode === keyCodes.X || keyCode === keyCodes.Z) {
			if (keyCode === keyCodes.Z) {
				if (this.scene.getCurrentPhase().handleCommand(Command.FIGHT, this.cursor))
					success = true;
			} else {
				ui.setMode(Mode.COMMAND);
				success = true;
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

		this.cursorObj.setPosition(13 + (cursor % 2 === 1 ? 100 : 0), -31 + (cursor >= 2 ? 15 : 0));

		return ret;
	}

	displayMoves() {
		const moveset = this.scene.getPlayerPokemon().moveset;
		for (let m = 0; m < 4; m++) {
			const moveText = addTextObject(this.scene, m % 2 === 0 ? 0 : 100, m < 2 ? 0 : 16, '-', TextStyle.WINDOW);
			if (m < moveset.length)
				moveText.setText(moveset[m].getName());
			this.movesContainer.add(moveText);
		}
	}

	clear() {
		super.clear();
		this.clearMoves();
		this.eraseCursor();
	}

	clearMoves() {
		this.movesContainer.removeAll(true);
	}

	eraseCursor() {
		if (this.cursorObj)
			this.cursorObj.destroy();
		this.cursorObj = null;
	}
}