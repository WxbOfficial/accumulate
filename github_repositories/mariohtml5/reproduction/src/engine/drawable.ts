import Fireball from '../code/fireball.ts';
import Shell from '../code/shell.ts';
import Camera from './camera.ts';
/**
	Base class for all drawable objects, makes ordering automatic.
	Code by Rob Kleffner, 2011
*/

export default class Drawable {
	ZOrder: number;

	X: number;
	Y: number;
	Layer: number;

	constructor() {
		this.ZOrder = 0;
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void { }
	Update(delta: number): void { }

	UpdateNoMove(delta: number): void { }
	CollideCheck(): void { }
	BumpCheck(xTile: number, yTile: number): void { }
	ShellCollideCheck(shell: Shell): boolean {
		return false;
	}
	FireballCollideCheck(fireball: Fireball): boolean {
		return false;
	}
};
