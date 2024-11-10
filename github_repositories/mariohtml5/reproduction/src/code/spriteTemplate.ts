import Enemy, { EnemyType } from './enemy.ts';
import FlowerEnemy from './flowerEnemy.ts';
import LevelState from './levelState.ts';

/**
	Creates a specific type of sprite based on the information given.
	Code by Rob Kleffner, 2011
*/

export default class SpriteTemplate {

	Type: EnemyType;
	Winged: boolean;
	LastVisibleTick: number;
	IsDead: boolean;
	Sprite: null | FlowerEnemy | Enemy;;

	constructor(type: EnemyType, winged: boolean) {
		this.Type = type;
		this.Winged = winged;
		this.LastVisibleTick = -1;
		this.IsDead = false;
		this.Sprite = null;
	}
	Spawn(world: LevelState, x: number, y: number, dir: number): void {
		if (this.IsDead) {
			return;
		}

		if (this.Type === Enemy.Flower) {
			this.Sprite = new FlowerEnemy(world, x * 16 + 15, y * 16 + 24);
		} else {
			this.Sprite = new Enemy(world, x * 16 + 8, y * 16 + 15, dir, this.Type, this.Winged);
		}
		this.Sprite.SpriteTemplate = this;
		world.AddSprite(this.Sprite);
	}
};

