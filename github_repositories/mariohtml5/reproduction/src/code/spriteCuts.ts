import SpriteFont from '../engine/spriteFont.ts';
import Resources from '../engine/resources.ts';
/**
	Helper to cut up the sprites.
	Code by Rob Kleffner, 2011
*/

type SpriteCutsType = {

	/*********************
	 * Font related
	 ********************/
	CreateBlackFont(): SpriteFont;

	CreateRedFont(): SpriteFont;

	CreateGreenFont(): SpriteFont;

	CreateBlueFont(): SpriteFont;

	CreateYellowFont(): SpriteFont;

	CreatePinkFont(): SpriteFont;

	CreateCyanFont(): SpriteFont;

	CreateWhiteFont(): SpriteFont;

	GetCharArray(y: number): Array<{ X: number; Y: number }>;

	/*********************
	 * Spritesheet related
	 ********************/
	GetBackgroundSheet(): Array<Array<{ X: number, Y: number, Width: number, Height: number }>>;

	GetLevelSheet(): Array<Array<{ X: number, Y: number, Width: number, Height: number }>>;
}

const SpriteCuts: SpriteCutsType = {

	/*********************
	 * Font related
	 ********************/
	CreateBlackFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(0));
	},

	CreateRedFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(8));
	},

	CreateGreenFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(16));
	},

	CreateBlueFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(24));
	},

	CreateYellowFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(32));
	},

	CreatePinkFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(40));
	},

	CreateCyanFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(48));
	},

	CreateWhiteFont(): SpriteFont {
		return new SpriteFont([], Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(56));
	},

	GetCharArray(y: number): Array<{ X: number; Y: number }> {
		var letters: Array<{ X: number; Y: number }> = [];
		var i = 0;
		for (i = 32; i < 127; i++) {
			letters[i] = { X: (i - 32) * 8, Y: y };
		}
		return letters;
	},

	/*********************
	 * Spritesheet related
	 ********************/
	GetBackgroundSheet(): Array<Array<{ X: number, Y: number, Width: number, Height: number }>> {
		var sheet: Array<Array<{ X: number, Y: number, Width: number, Height: number }>> = [];
		var x = 0, y = 0, width = Resources.Images["background"].width / 32, height = Resources.Images["background"].height / 32;

		for (x = 0; x < width; x++) {
			sheet[x] = [];

			for (y = 0; y < height; y++) {
				sheet[x][y] = { X: x * 32, Y: y * 32, Width: 32, Height: 32 };
			}
		}
		return sheet;
	},

	GetLevelSheet(): Array<Array<{ X: number, Y: number, Width: number, Height: number }>> {
		var sheet: Array<Array<{ X: number, Y: number, Width: number, Height: number }>> = [], x = 0, y = 0, width = Resources.Images["map"].width / 16, height = Resources.Images["map"].height / 16;

		for (x = 0; x < width; x++) {
			sheet[x] = [];

			for (y = 0; y < height; y++) {
				sheet[x][y] = { X: x * 16, Y: y * 16, Width: 16, Height: 16 };
			}
		}
		return sheet;
	}
};

export default SpriteCuts;