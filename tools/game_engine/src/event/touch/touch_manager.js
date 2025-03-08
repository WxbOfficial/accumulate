
export default class TouchManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.startListeners();
	}

	startListeners() {
		// this.canvasEvent.el.addEventListener('mousedown', this.canvasEvent.execute);

		// this.canvasEvent.el.addEventListener('mousemove', this.canvasEvent.execute);
		// this.canvasEvent.el.addEventListener('mouseup', this.canvasEvent.execute);
		// this.canvasEvent.el.addEventListener('mouseenter', this.canvasEvent.execute);
		// this.canvasEvent.el.addEventListener('mouseleave', this.canvasEvent.execute);
		// this.canvasEvent.el.addEventListener('wheel', this.canvasEvent.execute, { passive: true });
	}

	stopListeners() {
		// this.canvasEvent.el.removeEventListener('mousedown', this.canvasEvent.execute);
		// this.canvasEvent.el.removeEventListener('mousemove', this.canvasEvent.execute);
		// this.canvasEvent.el.removeEventListener('mouseup', this.canvasEvent.execute);
		// this.canvasEvent.el.removeEventListener('mouseenter', this.canvasEvent.execute);
		// this.canvasEvent.el.removeEventListener('mouseleave', this.canvasEvent.execute);
		// this.canvasEvent.el.removeEventListener('wheel', this.canvasEvent.execute);
	}

	destroy() {

	}
}