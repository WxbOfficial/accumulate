import { RenderType } from './canvas_engine_option.js';
import CanvasEvents from './events/canvas_events.js';
import Camera2d from './camera/camera2d.js';
import CanvasRenderer from './renderer/canvas_renderer.js';
import CanvasEngineOption from './canvas_engine_option.js';
import CanvasScene from './scene/canvas_scene.js';


export default class CanvasEngine {

	constructor(el, canvasOption = CanvasEngineOption) {

		this.evnets = new CanvasEvents(el);

		if (canvasOption.renderType === RenderType.canvas) {
			this.renderer = new CanvasRenderer(el, canvasOption);
			this.camera = new Camera2d();
		} else {
			throw new Error(`CanvasEngine 未知类型的 renderType ${canvasOption.renderType}`);
		}

		this.scene = new CanvasScene();

		this.nextRenderHandle = -1;
	}

	render() {

		this.renderer.render(this.scene, this.camera);
	}

	requestRender() {
		if (this.nextRenderHandle === -1) {
			this.nextRenderHandle = requestAnimationFrame(() => {
				this.nextRenderHandle = -1;
				this.render();
			});
		}
	}
}