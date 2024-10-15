import { GameState, GameStateContext } from '../engine/state.js';
import DrawableManager from '../engine/drawableManager.js';
import Camera from '../engine/camera.js';
import { AnimatedSprite } from '../engine/animatedSprite.js';
import Resources from '../engine/resources.js';
import { KeyboardInput, Keys } from '../engine/keyboardInput.js';
import SpriteCuts from './spriteCuts.js';
import TitleState from './titleState.js';
import SpriteFont from '../engine/spriteFont.js';

/**
	State shown when the player loses!
	Code by Rob Kleffner, 2011
*/

export default class LoseState extends GameState {

	drawManager?: null | DrawableManager;
	camera?: null | Camera;
	gameOver?: null | AnimatedSprite;
	font?: null | SpriteFont;
	kissing: null | AnimatedSprite;
	wasKeyDown: boolean;

	constructor() {
		super();

		this.drawManager = null;
		this.camera = null;
		this.gameOver = null;
		this.font = null;
		this.wasKeyDown = false;
	}
	Enter(): void {
		this.drawManager = new DrawableManager();
		this.camera = new Camera();

		this.gameOver = new AnimatedSprite();
		this.gameOver.Image = Resources.Images["gameOverGhost"];
		this.gameOver.SetColumnCount(9);
		this.gameOver.SetRowCount(1);
		this.gameOver.AddNewSequence("turnLoop", 0, 0, 0, 8);
		this.gameOver.PlaySequence("turnLoop", true);
		this.gameOver.FramesPerSecond = 1 / 15;
		this.gameOver.X = 112;
		this.gameOver.Y = 68;

		this.font = SpriteCuts.CreateBlackFont();
		this.font.Strings[0] = { String: "Game over!", X: 116, Y: 160 };

		this.drawManager.Add(this.font);
		this.drawManager.Add(this.gameOver);
	}
	Exit(): void {
		this.drawManager!.Clear();
		delete this.drawManager;
		delete this.camera;
		delete this.gameOver;
		delete this.font;
	}
	Update(delta: number): void {
		this.drawManager!.Update(delta);
		if (KeyboardInput.IsKeyDown(Keys.S)) {
			this.wasKeyDown = true;
		}
	}
	Draw(context: CanvasRenderingContext2D): void {
		this.drawManager!.Draw(context, this.camera!);
	}
	CheckForChange(context: GameStateContext): void {
		if (this.wasKeyDown && !KeyboardInput.IsKeyDown(Keys.S)) {
			context.ChangeState(new TitleState());
		}
	}
};
