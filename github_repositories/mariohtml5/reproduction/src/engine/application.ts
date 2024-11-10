import GameCanvas from './gameCanvas.ts';
import GameTimer from './gameTimer.ts';
import { GameStateContext } from './state.ts';
import { GameState } from './state.js';
import { KeyboardInput } from './keyboardInput.ts';

/**
	Simple demo of the engine.
	Code by Rob Kleffner, 2011
*/

export default class Application {
	canvas: null | GameCanvas;
	timer: null | GameTimer;
	stateContext: null | GameStateContext;

	constructor() {
		this.canvas = null;
		this.timer = null;
		this.stateContext = null;
	}
	Update(delta: number): void {

		this.stateContext!.Update(delta);

		this.canvas!.BeginDraw();

		this.stateContext!.Draw(this.canvas!.BackBufferContext2D!);

		this.canvas!.EndDraw();
	}
	Initialize(defaultState: GameState, resWidth: number, resHeight: number): void {
		this.canvas = new GameCanvas();
		this.timer = new GameTimer();
		KeyboardInput.Initialize();
		this.canvas!.Initialize("canvas", resWidth, resHeight);
		this.timer!.UpdateObject = this;

		this.stateContext = new GameStateContext(defaultState);

		this.timer!.Start();
	}
};

