import NotchSprite from './notchSprite.js';
import Resources from '../engine/resources.js';
import Mario from './setup.js';
import Sparkle from './sparkle.js';

/**
	Represents a bullet bill enemy.
	Code by Rob Kleffner, 2011
*/

export default class BulletBill extends NotchSprite {
	constructor(world, x, y, dir) {
		super();

		this.Image = Resources.Images["enemies"];
		this.World = world;
		this.X = x;
		this.Y = y;
		this.Facing = dir;

		this.XPicO = 8;
		this.YPicO = 31;
		this.Height = 12;
		this.Width = 4;
		this.PicWidth = 16;
		this.YPic = 5;
		this.XPic = 0;
		this.Ya = -5;
		this.DeadTime = 0;
		this.Dead = false;
		this.Anim = 0;
	}
	CollideCheck() {
		if (this.Dead) {
			return;
		}

		var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
		if (xMarioD > -16 && xMarioD < 16) {
			if (yMarioD > -this.Height && yMarioD < this.World.Mario.Height) {
				if (Mario.MarioCharacter.Y > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
					Mario.MarioCharacter.Stomp(this);
					this.Dead = true;

					this.Xa = 0;
					this.Ya = 1;
					this.DeadTime = 100;
				} else {
					Mario.MarioCharacter.GetHurt();
				}
			}
		}
	}
	Move() {
		var i = 0, sideWaysSpeed = 4;
		if (this.DeadTime > 0) {
			this.DeadTime--;

			if (this.DeadTime === 0) {
				this.DeadTime = 1;
				for (i = 0; i < 8; i++) {
					this.World.AddSprite(new Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
				}
				this.World.RemoveSprite(this);
			}

			this.X += this.Xa;
			this.Y += this.Ya;
			this.Ya *= 0.95;
			this.Ya += 1;

			return;
		}

		this.Xa = this.Facing * sideWaysSpeed;
		this.XFlip = this.Facing === -1;
		this.Move(this.Xa, 0);
	}
	SubMove(xa, ya) {
		this.X += xa;
		return true;
	}
	FireballCollideCheck(fireball) {
		if (this.DeadTime !== 0) {
			return false;
		}

		var xD = fireball.X - this.X, yD = fireball.Y - this.Y;
		if (xD > -16 && xD < 16) {
			if (yD > -this.Height && yD < fireball.Height) {
				return true;
			}
		}
		return false;
	}
	ShellCollideCheck(shell) {
		if (this.DeadTime !== 0) {
			return false;
		}

		var xD = shell.X - this.X, yD = shell.Y - this.Y;
		if (xD > -16 && xD < 16) {
			if (yD > -this.Height && yD < shell.Height) {
				Engine.Resources.PlaySound("kick");
				this.Dead = true;
				this.Xa = 0;
				this.Ya = 1;
				this.DeadTime = 100;
				return true;
			}
		}
		return false;
	}
};
