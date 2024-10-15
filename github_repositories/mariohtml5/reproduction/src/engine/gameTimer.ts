
import Application from './application.ts';

/**
	Represents a very basic game timer.
	Code by Rob Kleffner, 2011
*/

export default class GameTimer {
	FramesPerSecond: number;
	LastTime: number;
	IntervalFunc: number;
	UpdateObject: null | Application;

	constructor() {
		this.FramesPerSecond = 1000 / 30;
		this.LastTime = 0;
		this.IntervalFunc = -1;
		this.UpdateObject = null;
	}
	Start(): void {
		this.LastTime = new Date().getTime();
		var self = this;
		this.IntervalFunc = setInterval(function () { self.Tick(); }, this.FramesPerSecond);
	}
	Tick(): void {
		if (this.UpdateObject != null) {
			var newTime = new Date().getTime();
			var delta = (newTime - this.LastTime) / 1000;
			this.LastTime = newTime;

			this.UpdateObject.Update(delta);
		}
	}
	Stop(): void {
		clearInterval(this.IntervalFunc);
	}
};
