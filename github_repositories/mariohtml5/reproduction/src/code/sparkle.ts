import NotchSprite from './notchSprite.js';
import Resources from '../engine/resources.js';
import LevelState from './levelState.js';

/**
	Represents a little sparkle object in the game.
	Code by Rob Kleffner, 2011
*/

export default class Sparkle extends NotchSprite {

	World: LevelState;
	Life: number;
	XPicStart: number;

	constructor(world: LevelState, x: number, y: number, xa: number, ya: number) {
		super();

		this.World = world;
		this.X = x;
		this.Y = y;
		this.Xa = xa;
		this.Ya = ya;
		this.XPic = (Math.random() * 2) | 0;
		this.YPic = 0;

		this.Life = 10 + ((Math.random() * 5) | 0);
		this.XPicStart = this.XPic;
		this.XPicO = 4;
		this.YPicO = 4;

		this.PicWidth = 8;
		this.PicHeight = 8;
		this.Image = Resources.Images["particles"];
	}
	Move(): void {
		if (this.Life > 10) {
			this.XPic = 7;
		} else {
			this.XPic = (this.XPicStart + (10 - this.Life) * 0.4) | 0;
		}

		if (this.Life-- < 0) {
			this.World.RemoveSprite(this);
		}

		this.X += this.Xa;
		this.Y += this.Ya;
	}
};
