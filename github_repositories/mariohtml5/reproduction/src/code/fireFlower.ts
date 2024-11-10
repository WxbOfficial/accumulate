import NotchSprite from './notchSprite.ts';
import Resources from '../engine/resources.ts';
import Mario from './setup.ts';
import { Level } from './level.ts';
import LevelState from './levelState.ts';

/**
	Represents a fire powerup.
	Code by Rob Kleffner, 2011
*/

export default class FireFlower extends NotchSprite {

	Width: number;
	Height: number;
	World: LevelState;
	Facing: number;
	Life: number

	constructor(world: LevelState, x: number, y: number) {
		super();

		this.Width = 4;
		this.Height = 24;

		this.World = world;
		this.X = x;
		this.Y = y;
		this.Image = Resources.Images["items"];

		this.XPicO = 8;
		this.YPicO = 15;
		this.XPic = 1;
		this.YPic = 0;
		this.Height = 12;
		this.Facing = 1;
		this.PicWidth = this.PicHeight = 16;

		this.Life = 0;
	}
	CollideCheck(): void {
		var xMarioD = Mario.MarioCharacter!.X - this.X, yMarioD = Mario.MarioCharacter!.Y - this.Y;
		if (xMarioD > -16 && xMarioD < 16) {
			if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter!.Height) {
				Mario.MarioCharacter!.GetFlower();
				this.World.RemoveSprite(this);
			}
		}
	}
	Move(): void {
		if (this.Life < 9) {
			this.Layer = 0;
			this.Y--;
			this.Life++;
			return;
		}
	}
};
