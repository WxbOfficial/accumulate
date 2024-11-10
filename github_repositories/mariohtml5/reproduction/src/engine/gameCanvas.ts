/**
	Base class to represent a double buffered canvas object.
	Code by Rob Kleffner, 2011
*/

export default class GameCanvas {
	Canvas: null | HTMLCanvasElement;
	Context2D: null | CanvasRenderingContext2D;
	BackBuffer: null | HTMLCanvasElement;
	BackBufferContext2D: null | CanvasRenderingContext2D;
	constructor() {
		this.Canvas = null;
		this.Context2D = null;
		this.BackBuffer = null;
		this.BackBufferContext2D = null;
	}
	Initialize(canvasId: string, resWidth: number, resHeight: number): void {
		this.Canvas = (document.getElementById(canvasId) as HTMLCanvasElement);
		this.Context2D = this.Canvas.getContext("2d");
		this.BackBuffer = document.createElement("canvas");
		this.BackBuffer.width = resWidth;
		this.BackBuffer.height = resHeight;
		this.BackBufferContext2D = this.BackBuffer.getContext("2d");
	}
	BeginDraw(): void {
		this.BackBufferContext2D!.clearRect(0, 0, this.BackBuffer!.width, this.BackBuffer!.height);
		this.Context2D!.clearRect(0, 0, this.Canvas!.width, this.Canvas!.height);
	}
	EndDraw(): void {
		this.Context2D!.drawImage(this.BackBuffer!, 0, 0, this.BackBuffer!.width, this.BackBuffer!.height, 0, 0, this.Canvas!.width, this.Canvas!.height);
	}
};
