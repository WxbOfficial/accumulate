export default class UiHandler {
	constructor(scene, mode) {
		this.cursor = 0;
		this.active = false;
		this.scene = scene;
		this.mode = mode;
	}
	show(_args) {
		this.active = true;
	}

	getUi() {
		return this.scene.ui;
	}

	setCursor(cursor) {
		const changed = this.cursor !== cursor;
		if (changed)
			this.cursor = cursor;

		return changed;
	}

	clear() {
		this.active = false;
	}
}