import Sprite from './sprite.ts';
import Camera from './camera.ts';
/**
	For sprites that are only a portion of an image.
	Code by Rob Kleffner, 2011
*/

export default class FrameSprite extends Sprite {
	FrameX: number;
	FrameY: number;
	FrameWidth: number;
	FrameHeight: number;

	constructor() {
		super();

		this.FrameX = 0;
		this.FrameY = 0;
		this.FrameWidth = 0;
		this.FrameHeight = 0;
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void {
		context.drawImage(this.Image!, this.FrameX, this.FrameY, this.FrameWidth, this.FrameHeight, this.X - camera.X, this.Y - camera.Y, this.FrameWidth, this.FrameHeight);
	}
};
