import Drawable from './drawable.js';
/**
	Represents a sprite sheet for a font.
	Code by Rob Kleffner, 2011
*/

export default class SpriteFont extends Drawable {
	constructor(strings, image, letterWidth, letterHeight, letters) {
		super();

		this.Image = image;
		this.Letters = letters;
		this.LetterWidth = letterWidth;
		this.LetterHeight = letterHeight;
		this.Strings = strings;
	}
	Draw(context, camera) {
		for (var s = 0; s < this.Strings.length; s++) {
			var string = this.Strings[s];
			for (var i = 0; i < string.String.length; i++) {
				var code = string.String.charCodeAt(i);
				context.drawImage(this.Image, this.Letters[code].X, this.Letters[code].Y, this.LetterWidth, this.LetterHeight, string.X + this.LetterWidth * (i + 1), string.Y, this.LetterWidth, this.LetterHeight);
			}
		}
	}
};
