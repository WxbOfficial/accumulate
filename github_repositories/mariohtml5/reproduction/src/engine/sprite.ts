import Drawable from './drawable.ts';
import Camera from './camera.ts';
/**
	Represents a simple static sprite.
	Code by Rob Kleffner, 2011
*/

export default class Sprite extends Drawable {
	X: number;
	Y: number;
	Image: null | HTMLImageElement;

	constructor() {
		super();

		this.X = 0;
		this.Y = 0;
		this.Image = null;
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void {
		context.drawImage(this.Image!, this.X - camera.X, this.Y - camera.Y);
	}
};
