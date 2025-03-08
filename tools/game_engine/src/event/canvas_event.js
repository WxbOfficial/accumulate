import CanvasEventProcess from './canvas_event_process.js';
import MouseManager from './mouse/mouse_manager.js';
import Vector2 from '../math/vector2.js';

const _vector2 = new Vector2();

export default class CanvasEvent extends CanvasEventProcess {
	constructor(el, options = {}) {
		super();

		this.el = el;

		this.topOnly = options.topOnly || true;

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);

		this.scene = null;

		this.mouseManager = new MouseManager(this);

		if ('ontouchstart' in document.documentElement || (navigator.maxTouchPoints && navigator.maxTouchPoints >= 1)) {
			this.touchManager = new TouchManager(this);
		}
	}

	bindScene(scene) {
		this.scene = scene;
	}

	onMouseDown(e) {
		_vector2.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);
		this.processDownEvents(_vector2.x, _vector2.y);
	}
	onMouseMove(e) {
		_vector2.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);
		this.processMoveEvents(_vector2.x, _vector2.y);
	}
	onMouseUp(e) {
		_vector2.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);
		this.processUpEvents(_vector2.x, _vector2.y);
	}
	onMouseEnter(e) {

	}
	onMouseLeave(e) {

	}
	onMouseWheel(e) {
		_vector2.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);
		this.scene.emit(e.type, e.deltaX, e.deltaY, e.deltaZ, _vector2.x, _vector2.y);
	}

	destroy() {
		super.destroy();

		if (this.mouseManager !== null) {
			this.mouseManager.destroy();
			this.mouseManager = null;
		}

		if (this.touchManager !== null) {
			this.touchManager.destroy();
			this.touchManager = null;
		}

		this.el = null;
		this.execute = null;

		this.scene = null;
	}
}