/**
	Base class to represent a double buffered canvas object.
	Code by Rob Kleffner, 2011
*/

export default class GameCanvas {
	constructor() {
		this.Canvas = null;
		this.Context2D = null;
		this.BackBuffer = null;
		this.BackBufferContext2D = null;
	}

	Initialize(canvasId, resWidth, resHeight) {
		this.Canvas = document.getElementById(canvasId);
		this.Context2D = this.Canvas.getContext("2d");
		this.BackBuffer = document.createElement("canvas");
		this.BackBuffer.width = resWidth;
		this.BackBuffer.height = resHeight;
		this.BackBufferContext2D = this.BackBuffer.getContext("2d");
	}

	BeginDraw() {
		this.BackBufferContext2D.clearRect(0, 0, this.BackBuffer.width, this.BackBuffer.height);
		this.Context2D.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
	}

	EndDraw() {
		this.Context2D.drawImage(this.BackBuffer, 0, 0, this.BackBuffer.width, this.BackBuffer.height, 0, 0, this.Canvas.width, this.Canvas.height);
	}
};