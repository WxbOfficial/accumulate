/**
	Class that helps to manage keyboard input.
	Code by Rob Kleffner, 2011
*/
type KeysType = {
	[key in string]: number;
}

export const Keys: KeysType = {
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 80,
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40
};

type KeyboardInputTyps = {
	Pressed: Array<boolean>;
}

export const KeyboardInput = {
	Pressed: new Array(),

	Initialize(): void {
		var self = this;
		document.onkeydown = function (event) {
			self.KeyDownEvent(event);
		}
		document.onkeyup = function (event) {
			self.KeyUpEvent(event);
		}
	},

	IsKeyDown(key: number): boolean {
		if (this.Pressed[key] != null)
			return this.Pressed[key];
		return false;
	},

	KeyDownEvent(event: KeyboardEvent): void {
		this.Pressed[event.keyCode] = true;
		this.PreventScrolling(event);
	},

	KeyUpEvent(event: KeyboardEvent): void {
		this.Pressed[event.keyCode] = false;
		this.PreventScrolling(event);
	},

	PreventScrolling(event: KeyboardEvent): void {
		// 37: left, 38: up, 39: right, 40: down
		if (event.keyCode >= 37 && event.keyCode <= 40) {
			event.preventDefault();
		}
	}
};
