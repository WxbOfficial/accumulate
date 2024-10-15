import Sprite from './sprite.js';
/**
	For sprites that are only a portion of an image.
	Code by Rob Kleffner, 2011
*/

export default class FrameSprite extends Sprite {
	constructor() {
		super();

		this.FrameX = 0;
		this.FrameY = 0;
		this.FrameWidth = 0;
		this.FrameHeight = 0;
	}
	Draw(context, camera) {
		context.drawImage(this.Image, this.FrameX, this.FrameY, this.FrameWidth, this.FrameHeight, this.X - camera.X, this.Y - camera.Y, this.FrameWidth, this.FrameHeight);
	}
};
