import Camera from '../engine/camera.ts';
import Drawable from '../engine/drawable.ts';
import Character from './character.ts';
import Fireball from './fireball.ts';
import Shell from './shell.ts';
import SpriteTemplate from './spriteTemplate.ts';
/**
	Notch made his own sprite class for this game. Rather than hack around my own,
		I directly ported his to JavaScript and used that where needed.
	Code by Rob Kleffner, 2011
*/

export default class NotchSprite extends Drawable {
	XOld: number;
	YOld: number;
	X: number;
	Y: number;
	Xa: number;
	Ya: number;

	XPic: number;
	YPic: number;
	XPicO: number;
	YPicO: number;

	PicWidth: number;
	PicHeight: number;
	XFlip: boolean;
	YFlip: boolean;
	Visible: boolean;
	Image?: HTMLImageElement;

	Delta: number;
	SpriteTemplate: null | SpriteTemplate;
	Layer: number;


	constructor(image?: HTMLImageElement) {
		super();

		this.XOld = 0; this.YOld = 0;
		this.X = 0; this.Y = 0;
		this.Xa = 0; this.Ya = 0;
		this.XPic = 0; this.YPic = 0;
		this.XPicO = 0; this.YPicO = 0;
		this.PicWidth = 32; this.PicHeight = 32;
		this.XFlip = false; this.YFlip = false;
		this.Visible = true;
		this.Image = image;
		this.Delta = 0;
		this.SpriteTemplate = null;
		this.Layer = 1;
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void {
		var xPixel = 0, yPixel = 0;
		if (!this.Visible) {
			return;
		}

		xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
		yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;

		context.save();
		context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
		context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
		context.drawImage(this.Image!, this.XPic * this.PicWidth, this.YPic * this.PicHeight, this.PicWidth, this.PicHeight,
			this.XFlip ? (320 - xPixel - this.PicWidth) : xPixel, this.YFlip ? (240 - yPixel - this.PicHeight) : yPixel, this.PicWidth, this.PicHeight);
		context.restore();
	}
	Update(delta: number): void {
		this.XOld = this.X;
		this.YOld = this.Y;
		this.Move();
		this.Delta = delta;
	}
	UpdateNoMove(delta: number): void {
		this.XOld = this.X;
		this.YOld = this.Y;
		this.Delta = 0;
	}
	Move(): void {
		this.X += this.Xa;
		this.Y += this.Ya;
	}
	GetX(delta: number): number {
		return ((this.XOld + (this.X - this.XOld) * delta) | 0) - this.XPicO;
	}
	GetY(delta: number): number {
		return ((this.YOld + (this.Y - this.YOld) * delta) | 0) - this.YPicO;
	}
	CollideCheck(): void { }
	BumpCheck(xTile: number, yTile: number): void { }
	Release(mario: Character): void { }
	ShellCollideCheck(shell: Shell): boolean {
		return false;
	}
	FireballCollideCheck(fireball: Fireball): boolean {
		return false;
	}
};
