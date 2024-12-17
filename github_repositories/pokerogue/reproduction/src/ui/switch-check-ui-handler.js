// import * as Phaser from 'phaser';
import { SwitchPhase } from "../battle-phase.js";
import { addTextObject, TextStyle } from "../text.js";
import AwaitableUiHandler from "./awaitable-ui-handler.js";
import { Mode } from "./ui.js";
export default class SwitchCheckUiHandler extends AwaitableUiHandler {
	constructor(scene) {
		super(scene, Mode.SWITCH_CHECK);
	}

	setup() {
		const ui = this.getUi();

		const switchCheckContainer = this.scene.add.container((this.scene.game.canvas.width / 6) - 49, -49);
		switchCheckContainer.setVisible(false);
		ui.add(switchCheckContainer);

		this.switchCheckContainer = switchCheckContainer;

		const switchCheckBg = this.scene.add.image(0, 0, 'boolean_window');
		switchCheckBg.setOrigin(0, 1);
		switchCheckContainer.add(switchCheckBg);

		this.switchCheckBg = switchCheckBg;

		const switchCheckText = addTextObject(this.scene, 0, 0, 'Yes\nNo', TextStyle.WINDOW, { maxLines: 2 });
		switchCheckText.setPositionRelative(switchCheckBg, 16, 9);
		switchCheckText.setLineSpacing(12);
		switchCheckContainer.add(switchCheckText);

		this.setCursor(0);
	}

	show(args) {
		if (args.length && args[0] instanceof Function) {
			super.show(args);

			this.awaitingActionInput = true;
			this.onActionInput = args[0];

			this.switchCheckContainer.setVisible(true);
			this.setCursor(this.cursor);
		}
	}

	processInput(keyCode) {
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;
		const ui = this.getUi();

		if (!this.awaitingActionInput)
			return;

		let success = false;

		if (keyCode === keyCodes.Z || keyCode === keyCodes.X) {
			success = true;
			if (keyCode === keyCodes.X)
				this.cursor = 1;
			if (this.onActionInput) {
				if (!this.cursor)
					this.scene.unshiftPhase(new SwitchPhase(this.scene, false, true));
				const originalOnActionInput = this.onActionInput;
				this.onActionInput = null;
				originalOnActionInput();
				this.clear();
			}
		} else {
			switch (keyCode) {
				case keyCodes.UP:
					if (this.cursor)
						success = this.setCursor(0);
					break;
				case keyCodes.DOWN:
					if (!this.cursor)
						success = this.setCursor(1);
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
			this.switchCheckContainer.add(this.cursorObj);
		}

		this.cursorObj.setPositionRelative(this.switchCheckBg, 12, this.cursor ? 33 : 17);

		return ret;
	}

	clear() {
		super.clear();
		this.switchCheckContainer.setVisible(false);
		this.eraseCursor();
	}

	eraseCursor() {
		if (this.cursorObj)
			this.cursorObj.destroy();
		this.cursorObj = null;
	}
}