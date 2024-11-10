/**
	Displays the title screen and menu.
	Code by Rob Kleffner, 2011
*/

import { GameState } from "../engine/state.ts";
import DrawableManager from '../engine/drawableManager.ts';
import Camera from '../engine/camera.ts'
import BackgroundGenerator from './backgroundGenerator.ts';
import BackgroundRenderer from './backgroundRenderer.ts';
import { LevelType } from './level.ts';
import Sprite from '../engine/sprite.ts';
import Resources from '../engine/resources.ts';
import SpriteCuts from './spriteCuts.ts';
import SpriteFont from '../engine/spriteFont.ts';
import MapState from './mapState.ts';
import Character from './character.ts';
import Mario from './setup.ts';
import { KeyboardInput, Keys } from '../engine/keyboardInput.ts';
import { GameStateContext } from '../engine/state.ts';

export default class TitleState extends GameState {
	drawManager?: null | DrawableManager;
	camera?: null | Camera;
	logoY: null | number;
	bounce: null | number;
	font?: null | SpriteFont;

	title: Sprite;
	logo: Sprite;

	constructor() {
		super();

		this.drawManager = null;
		this.camera = null;
		this.logoY = null;
		this.bounce = null;
		this.font = null;
	}
	Enter(): void {
		this.drawManager = new DrawableManager();
		this.camera = new Camera();

		var bgGenerator = new BackgroundGenerator(2048, 15, true, LevelType.Overground);
		var bgLayer0 = new BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 2);
		bgGenerator.SetValues(2048, 15, false, LevelType.Overground);
		var bgLayer1 = new BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 1);

		this.title = new Sprite();
		this.title.Image = Resources.Images["title"];
		this.title.X = 0, this.title.Y = 120;

		this.logo = new Sprite();
		this.logo.Image = Resources.Images["logo"];
		this.logo.X = 0, this.logo.Y = 0;

		this.font = SpriteCuts.CreateRedFont();
		this.font.Strings[0] = { String: "Press S to Start", X: 96, Y: 120 };

		this.logoY = 20;

		this.drawManager.Add(bgLayer0);
		this.drawManager.Add(bgLayer1);

		this.bounce = 0;

		Mario.GlobalMapState = new MapState();
		//set up the global main character variable
		Mario.MarioCharacter = new Character();
		Mario.MarioCharacter.Image = Resources.Images["smallMario"];

		Mario.PlayTitleMusic!();
	}
	Exit(): void {
		Mario.StopMusic!();

		this.drawManager!.Clear();
		delete this.drawManager;
		delete this.camera;
		delete this.font;
	}
	Update(delta: number): void {
		this.bounce! += delta * 2;
		this.logoY = 20 + Math.sin(this.bounce!) * 10;

		this.camera!.X += delta * 25;

		this.drawManager!.Update(delta);
	}
	Draw(context: CanvasRenderingContext2D): void {
		this.drawManager!.Draw(context, this.camera!);

		context.drawImage(Resources.Images["title"], 0, 120);
		context.drawImage(Resources.Images["logo"], 0, this.logoY!);

		this.font!.Draw(context, this.camera!);
	}
	CheckForChange(context: GameStateContext): void {
		if (KeyboardInput.IsKeyDown(Keys.S)) {
			context.ChangeState(Mario.GlobalMapState!);
		}
	}
};
