import GameCanvas from './gameCanvas.js';
import GameTimer from './gameTimer.js';
import { GameStateContext } from './state.js';
import { KeyboardInput } from './keyboardInput.js';

/**
	Simple demo of the engine.
	Code by Rob Kleffner, 2011
*/

export default class Application {
	constructor() {
		this.canvas = null;
		this.timer = null;
		this.stateContext = null;
	}

	Update(delta) {

		this.stateContext.Update(delta);

		this.canvas.BeginDraw();

		this.stateContext.Draw(this.canvas.BackBufferContext2D);

		this.canvas.EndDraw();
	}

	Initialize(defaultState, resWidth, resHeight) {
		this.canvas = new GameCanvas();
		this.timer = new GameTimer();
		KeyboardInput.Initialize();
		this.canvas.Initialize("canvas", resWidth, resHeight);
		this.timer.UpdateObject = this;

		this.stateContext = new GameStateContext(defaultState);

		this.timer.Start();
	}
};