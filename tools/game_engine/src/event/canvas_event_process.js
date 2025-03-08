import CanvasEventType from './canvas_event_type.js';

export default class CanvasEventProcess {
	constructor() {
		this._temp = null;

		this._preMove = [];
		this._nowMove = [];

		this._drag = [];
	}

	processDownEvents(x, y) {
		let visibleObject = null, hasEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (visibleObject.hasListener(CanvasEventType.mousedown)) {
					visibleObject.emit(CanvasEventType.mousedown, x, y);
					hasEmit = true;

					if (this.topOnly) {
						break;
					}
				}
			}
		}

		if (!hasEmit) {
			this.scene.emit(CanvasEventType.mousedown, x, y);
		}

		visibleObject = null;
		hasEmit = null;
	}
	processMoveEvents(x, y) {
		let visibleObject = null, hasMoveEmit = false;

		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (
				(!this.topOnly || this._nowMove.length === 0) &&
				visibleObject.hitTest(x, y)
			) {
				this._nowMove.push(visibleObject);

				if (visibleObject.hasListener(CanvasEventType.mousemove)) {
					visibleObject.emit(CanvasEventType.mousemove, x, y);
					hasMoveEmit = true;
				}

				if (
					visibleObject.hasListener(CanvasEventType.mouseenter) &&
					!this._preMove.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.mouseenter, x, y);
				}
			} else {
				if (
					visibleObject.hasListener(CanvasEventType.mouseleave) &&
					this._preMove.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.mouseleave, x, y);
				}
			}
		}

		this._temp = this._preMove;
		this._preMove = this._nowMove;
		this._nowMove = this._temp;

		this._temp = null;
		this._nowMove.length = 0;

		if (!hasMoveEmit) {
			this.scene.emit(CanvasEventType.mousemove, x, y);
		}

		visibleObject = null;
		hasMoveEmit = null;
	}
	processUpEvents(x, y) {
		let visibleObject = null, hasEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (visibleObject.hasListener(CanvasEventType.mouseup)) {
					visibleObject.emit(CanvasEventType.mouseup, x, y);
					hasEmit = true;

					if (this.topOnly) {
						break;
					}
				}
			}
		}

		if (!hasEmit) {
			this.scene.emit(CanvasEventType.mouseup, x, y);
		}

		visibleObject = null;
		hasEmit = null;
	}

	destroy() {
		this._over = null;
		this._drag = null;
	}
}