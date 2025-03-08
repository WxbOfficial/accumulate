
export default class MouseManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.startListeners();
	}

	startListeners() {
		this.canvasEvent.el.addEventListener('mousedown', this.canvasEvent.onMouseDown);
		this.canvasEvent.el.addEventListener('mousemove', this.canvasEvent.onMouseMove);
		this.canvasEvent.el.addEventListener('mouseup', this.canvasEvent.onMouseUp);
		this.canvasEvent.el.addEventListener('mouseenter', this.canvasEvent.onMouseEnter);
		this.canvasEvent.el.addEventListener('mouseleave', this.canvasEvent.onMouseLeave);
		this.canvasEvent.el.addEventListener('wheel', this.canvasEvent.onMouseWheel, { passive: true });
	}

	stopListeners() {
		this.canvasEvent.el.removeEventListener('mousedown', this.canvasEvent.onMouseDown);
		this.canvasEvent.el.removeEventListener('mousemove', this.canvasEvent.onMouseMove);
		this.canvasEvent.el.removeEventListener('mouseup', this.canvasEvent.onMouseUp);
		this.canvasEvent.el.removeEventListener('mouseenter', this.canvasEvent.onMouseEnter);
		this.canvasEvent.el.removeEventListener('mouseleave', this.canvasEvent.onMouseLeave);
		this.canvasEvent.el.removeEventListener('wheel', this.canvasEvent.onMouseWheel);
	}

	destroy() {
		this.stopListeners();

		this.canvasEvent = null;
	}
}