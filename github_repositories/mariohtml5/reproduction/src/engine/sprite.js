import Drawable from './drawable.js';
/**
	Represents a simple static sprite.
	Code by Rob Kleffner, 2011
*/

export default class Sprite extends Drawable {
	constructor() {
		super();

		this.X = 0;
		this.Y = 0;
		this.Image = null;
	}
	Draw(context, camera) {
		context.drawImage(this.Image, this.X - camera.X, this.Y - camera.Y);
	}
};
