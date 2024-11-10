import BackgroundRenderer from '../code/backgroundRenderer.ts';
import BulletBill from '../code/bulletBill.ts';
import Character from '../code/character.ts';
import CoinAnim from '../code/coinAnim.ts';
import Enemy from '../code/enemy.ts';
import Fireball from '../code/fireball.ts';
import FireFlower from '../code/fireFlower.ts';
import FlowerEnemy from '../code/flowerEnemy.ts';
import Mushroom from '../code/mushroom.ts';
import Particle from '../code/particle.ts';
import Shell from '../code/shell.ts';
import { AnimatedSprite } from './animatedSprite.ts';
import Camera from './camera.ts';
import SpriteFont from './spriteFont.ts';

/**
	Class to help manage and draw a collection of sprites.
	Code by Rob Kleffner, 2011
*/

export type DrawableObject = BackgroundRenderer | AnimatedSprite | SpriteFont | Mushroom | FireFlower | CoinAnim | Particle | FlowerEnemy | Enemy | Shell | Fireball | Character | BulletBill;

export default class DrawableManager {

	Unsorted: boolean;
	Objects: Array<DrawableObject>;

	constructor() {
		this.Unsorted = true;
		this.Objects = [];
	}
	Add(object: DrawableObject): void {
		this.Objects.push(object);
		this.Unsorted = true;
	}
	AddRange(objects: Array<DrawableObject>): void {
		this.Objects = this.Objects.concat(objects);
		this.Unsorted = true;
	}
	Clear(): void {
		this.Objects.splice(0, this.Objects.length);
	}
	Contains(obj: DrawableObject): boolean {
		var i = this.Objects.length;
		while (i--) {
			if (this.Objects[i] === obj) {
				return true;
			}
		}
		return false;
	}
	Remove(object: DrawableObject): void {
		var index = this.Objects.indexOf(object);
		this.Objects.splice(index, 1);
	}
	RemoveAt(index: number): void {
		this.Objects.splice(index, 1);
	}
	RemoveRange(index: number, length: number): void {
		this.Objects.splice(index, length);
	}
	RemoveList(items: Array<DrawableObject>): void {
		var i = 0, j = 0;
		for (j = 0; j < items.length; i++) {
			for (i = 0; i < this.Objects.length; i++) {
				if (this.Objects[i] === items[j]) {
					this.Objects.splice(i, 1);
					items.splice(j, 1);
					j--;
					break;
				}
			}
		}
	}
	Update(delta: number): void {
		var i = 0;
		for (i = 0; i < this.Objects.length; i++) {
			if (this.Objects[i].Update!) {
				this.Objects[i].Update(delta);
			}
		}
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void {

		//sort the sprites based on their 'z depth' to get the correct drawing order
		if (this.Unsorted) {
			this.Unsorted = false;
			this.Objects.sort(function (x1, x2) { return x1.ZOrder - x2.ZOrder; });
		}

		var i = 0;
		for (i = 0; i < this.Objects.length; i++) {
			if (this.Objects[i].Draw!) {
				this.Objects[i].Draw(context, camera);
			}
		}
	}
};
