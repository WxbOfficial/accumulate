import Drawable from "../engine/drawable.ts";
import SpriteCuts from './spriteCuts.ts';
import Resources from '../engine/resources.ts';
import { Level } from "./level.ts";
import Camera from "../engine/camera.ts";
/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

export default class BackgroundRenderer extends Drawable {

	Level: Level;
	Width: number;
	Distance: number;
	TilesY: number;
	Background: Array<Array<{ X: number, Y: number, Width: number, Height: number }>>;

	constructor(level: Level, width: number, height: number, distance: number) {
		super();

		this.Level = level;
		this.Width = width;
		this.Distance = distance;
		this.TilesY = ((height / 32) | 0) + 1;

		this.Background = SpriteCuts.GetBackgroundSheet();
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void {
		var xCam = camera.X / this.Distance;
		var x = 0, y = 0, b: number, frame: { X: number, Y: number, Width: number, Height: number };

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
