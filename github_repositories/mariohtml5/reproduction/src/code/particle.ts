import NotchSprite from './notchSprite.ts';
import Resources from '../engine/resources.ts';
import LevelState from './levelState.ts';

/**
	Represents a piece of a broken block.
	Code by Rob Kleffner, 2011
*/

export default class Particle extends NotchSprite {

	Life: number;
	World: LevelState;

	constructor(world: LevelState, x: number, y: number, xa: number, ya: number) {
		super();

		this.World = world;
		this.X = x;
		this.Y = y;
		this.Xa = xa;
		this.Ya = ya;
		this.XPic = (Math.random() * 2) | 0;
		this.YPic = 0;
		this.XPicO = 4;
		this.YPicO = 4;

		this.PicWidth = 8;
		this.PicHeight = 8;
		this.Life = 10;

		this.Image = Resources.Images["particles"];
	}
	Move(): void {
		if (this.Life - this.Delta < 0) {
			this.World.RemoveSprite(this);
		}
		this.Life -= this.Delta;

		this.X += this.Xa;
		this.Y += this.Ya;
		this.Ya *= 0.95;
		this.Ya += 3;
	}
};
