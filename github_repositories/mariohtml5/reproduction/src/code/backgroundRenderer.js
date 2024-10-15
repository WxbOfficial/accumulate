import Drawable from "../engine/drawable.js";
import SpriteCuts from './spriteCuts.js';
import Resources from '../engine/resources.js';
/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

export default class BackgroundRenderer extends Drawable {
	constructor(level, width, height, distance) {
		super();

		this.Level = level;
		this.Width = width;
		this.Distance = distance;
		this.TilesY = ((height / 32) | 0) + 1;

		this.Background = SpriteCuts.GetBackgroundSheet();
	}
	Draw(context, camera) {
		var xCam = camera.X / this.Distance;
		var x = 0, y = 0, b = null, frame = null;

		//the OR truncates the decimal, quicker than Math.floor
		var xTileStart = (xCam / 32) | 0;
		//the +1 makes sure the right edge tiles get drawn
		var xTileEnd = (((xCam + this.Width) / 32) | 0);

		for (x = xTileStart; x <= xTileEnd; x++) {
			for (y = 0; y < this.TilesY; y++) {
				b = this.Level.GetBlock(x, y) & 0xff;
				frame = this.Background[b % 8][(b / 8) | 0];

				//bitshifting by five is the same as multiplying by 32
				context.drawImage(Resources.Images["background"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 5) - xCam) | 0, (y << 5) | 0, frame.Width, frame.Height);
			}
		}
	}
};
