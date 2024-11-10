/**
	Simple State pattern implementation for game states.
	Code by Rob Kleffner, 2011
*/

export class GameStateContext {
	State: null | GameState;
	constructor(defaultState: GameState) {
		this.State = null;

		if (defaultState != null) {
			this.State = defaultState;
			this.State.Enter();
		}
	}
	ChangeState(newState: GameState): void {
		if (this.State != null) {
			this.State.Exit();
		}
		this.State = newState;
		this.State!.Enter();
	}
	Update(delta: number): void {
		this.State!.CheckForChange(this);
		this.State!.Update(delta);
	}
	Draw(context: CanvasRenderingContext2D): void {
		this.State!.Draw(context);
	}
};

/**
 * Base game state class to at least ensure that all the functions exist.
 */
export class GameState {
	constructor() {
	}
	Enter(): void {
	}
	Exit(): void {
	}
	Update(delta: number): void {
	}
	Draw(context: CanvasRenderingContext2D): void {
	}
	CheckForChange(context: GameStateContext): void {
	}
}
