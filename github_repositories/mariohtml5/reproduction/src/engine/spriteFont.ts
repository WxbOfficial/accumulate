import Drawable from './drawable.ts';
import Camera from './camera.ts';
/**
	Represents a sprite sheet for a font.
	Code by Rob Kleffner, 2011
*/

export default class SpriteFont extends Drawable {
	Image: HTMLImageElement;
	Letters: Array<{ X: number; Y: number }>;
	LetterWidth: number;
	LetterHeight: number;
	Strings: Array<any>;

	constructor(strings: Array<any>, image: HTMLImageElement, letterWidth: number, letterHeight: number, letters: Array<{ X: number; Y: number }>) {
		super();

		this.Image = image;
		this.Letters = letters;
		this.LetterWidth = letterWidth;
		this.LetterHeight = letterHeight;
		this.Strings = strings;
	}
	Draw(context: CanvasRenderingContext2D, camera: Camera): void {
		for (var s = 0; s < this.Strings.length; s++) {
			var string = this.Strings[s];
			for (var i = 0; i < string.String.length; i++) {
				var code = string.String.charCodeAt(i);
				context.drawImage(this.Image, this.Letters[code].X, this.Letters[code].Y, this.LetterWidth, this.LetterHeight, string.X + this.LetterWidth * (i + 1), string.Y, this.LetterWidth, this.LetterHeight);
			}
		}
	}
};

