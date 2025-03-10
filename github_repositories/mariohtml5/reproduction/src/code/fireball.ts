import NotchSprite from './notchSprite.js';
import Resources from '../engine/resources.js';
import Sparkle from './sparkle.js';
import LevelState from './levelState.js';

/**
	Represents a fireball.
	Code by Rob Kleffner, 2011
*/

export default class Fireball extends NotchSprite {

	GroundInertia: number;
	AirInertia: number;
	World: LevelState;
	Facing: number;
	Height: number;
	Width: number;
	Dead: boolean;
	DeadTime: number;
	Anim: number;
	OnGround: boolean;

	FlipX: boolean;

	constructor(world: LevelState, x: number, y: number, facing: number) {
		super();

		this.GroundInertia = 0.89;
		this.AirInertia = 0.89;

		this.Image = Resources.Images["particles"];

		this.World = world;
		this.X = x;
		this.Y = y;
		this.Facing = facing;

		this.XPicO = 4;
		this.YPicO = 4;
		this.YPic = 3;
		this.XPic = 4;
		this.Height = 8;
		this.Width = 4;
		this.PicWidth = this.PicHeight = 8;
		this.Ya = 4;
		this.Dead = false;
		this.DeadTime = 0;
		this.Anim = 0;
		this.OnGround = false;
	}
	Move(): void {
		var i = 0, sideWaysSpeed = 8;

		if (this.DeadTime > 0) {
			for (i = 0; i < 8; i++) {
				this.World.AddSprite(new Sparkle(this.World, ((this.X + Math.random() * 8 - 4) | 0) + 4, ((this.Y + Math.random() * 8 - 4) | 0) + 2, Math.random() * 2 - 1 * this.Facing, Math.random() * 2 - 1));
			}
			this.World.RemoveSprite(this);
			return;
		}

		if (this.Facing != 0) {
			this.Anim++;
		}

		if (this.Xa > 2) {
			this.Facing = 1;
		}
		if (this.Xa < -2) {
			this.Facing = -1;
		}

		this.Xa = this.Facing * sideWaysSpeed;

		this.World.CheckFireballCollide(this);

		this.FlipX = this.Facing === -1;

		this.XPic = this.Anim % 4;

		if (!this.SubMove(this.Xa, 0)) {
			this.Die();
		}

		this.OnGround = false;
		this.SubMove(0, this.Ya);
		if (this.OnGround) {
			this.Ya = -10;
		}

		this.Ya *= 0.95;
		if (this.OnGround) {
			this.Xa *= this.GroundInertia;
		} else {
			this.Xa *= this.AirInertia;
		}

		if (!this.OnGround) {
			this.Ya += 1.5;
		}
	}
	SubMove(xa: number, ya: number): boolean {
		var collide = false;

		while (xa > 8) {
			if (!this.SubMove(8, 0)) {
				return false;
			}
			xa -= 8;
		}
		while (xa < -8) {
			if (!this.SubMove(-8, 0)) {
				return false;
			}
			xa += 8;
		}
		while (ya > 8) {
			if (!this.SubMove(0, 8)) {
				return false;
			}
			ya -= 8;
		}
		while (ya < -8) {
			if (!this.SubMove(0, -8)) {
				return false;
			}
			ya += 8;
		}

		if (ya > 0) {
			if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
				collide = true;
			} else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
				collide = true;
			} else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
				collide = true;
			} else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
				collide = true;
			}
		}
		if (ya < 0) {
			if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
				collide = true;
			} else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
				collide = true;
			} else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
				collide = true;
			}
		}

		if (xa > 0) {
			if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
				collide = true;
			}
			if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
				collide = true;
			}
			if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
				collide = true;
			}
		}
		if (xa < 0) {
			if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
				collide = true;
			}
			if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
				collide = true;
			}
			if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
				collide = true;
			}
		}

		if (collide) {
			if (xa < 0) {
				this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
				this.Xa = 0;
			}
			if (xa > 0) {
				this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
				this.Xa = 0;
			}
			if (ya < 0) {
				this.Y = (((this.Y - this.Height) / 16) | 0) * 16 + this.Height;
				this.Ya = 0;
			}
			if (ya > 0) {
				this.Y = (((this.Y - 1) / 16 + 1) | 0) * 16 - 1;
				this.OnGround = true;
			}

			return false;
		} else {
			this.X += xa;
			this.Y += ya;
			return true;
		}
	}
	IsBlocking(x: number, y: number, xa: number, ya: number): boolean {
		x = (x / 16) | 0;
		y = (y / 16) | 0;

		if (x === Math.floor(this.X / 16) && y === Math.floor(this.Y / 16)) {
			return false;
		}

		return this.World.Level!.IsBlocking(x, y, xa, ya);
	}
	Die(): void {
		this.Dead = true;
		this.Xa = -this.Facing * 2;
		this.Ya = -5;
		this.DeadTime = 100;
	}
};
