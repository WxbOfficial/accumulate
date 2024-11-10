/**
	State that loads all the resources for the game.
	Code by Rob Kleffner, 2011
*/

import { GameState } from '../engine/state.js';
import Resources from '../engine/resources.js';
import { Tile } from './level.js';
import Mario from './setup.js';
import MapState from './mapState.js';
import TitleState from './titleState.js';

export default class LoadingState extends GameState {
	constructor() {
		super();

		this.Images = [];
		this.ImagesLoaded = false;
		this.ScreenColor = 0;
		this.ColorDirection = 1;
		this.ImageIndex = 0;
		this.SoundIndex = 0;
	}
	Enter() {
		var i = 0;
		for (i = 0; i < 15; i++) {
			this.Images[i] = {};
		}

		this.Images[0].name = "background";
		this.Images[1].name = "endScene";
		this.Images[2].name = "enemies";
		this.Images[3].name = "fireMario";
		this.Images[4].name = "font";
		this.Images[5].name = "gameOverGhost";
		this.Images[6].name = "items";
		this.Images[7].name = "logo";
		this.Images[8].name = "map";
		this.Images[9].name = "mario";
		this.Images[10].name = "particles";
		this.Images[11].name = "racoonMario";
		this.Images[12].name = "smallMario";
		this.Images[13].name = "title";
		this.Images[14].name = "worldMap";

		this.Images[0].src = "./assets/images/bgsheet.png";
		this.Images[1].src = "./assets/images/endscene.gif";
		this.Images[2].src = "./assets/images/enemysheet.png";
		this.Images[3].src = "./assets/images/firemariosheet.png";
		this.Images[4].src = "./assets/images/font.gif";
		this.Images[5].src = "./assets/images/gameovergost.gif";
		this.Images[6].src = "./assets/images/itemsheet.png";
		this.Images[7].src = "./assets/images/logo.gif";
		this.Images[8].src = "./assets/images/mapsheet.png";
		this.Images[9].src = "./assets/images/mariosheet.png";
		this.Images[10].src = "./assets/images/particlesheet.png";
		this.Images[11].src = "./assets/images/racoonmariosheet.png";
		this.Images[12].src = "./assets/images/smallmariosheet.png";
		this.Images[13].src = "./assets/images/title.gif";
		this.Images[14].src = "./assets/images/worldmap.png";

		Resources.AddImages(this.Images);

		var testAudio = new Audio();

		if (testAudio.canPlayType("audio/mp3")) {
			Resources.AddSound("1up", "./assets/sounds/1-up.mp3", 1)
				.AddSound("breakblock", "./assets/sounds/breakblock.mp3")
				.AddSound("bump", "./assets/sounds/bump.mp3", 4)
				.AddSound("cannon", "./assets/sounds/cannon.mp3")
				.AddSound("coin", "./assets/sounds/coin.mp3", 5)
				.AddSound("death", "./assets/sounds/death.mp3", 1)
				.AddSound("exit", "./assets/sounds/exit.mp3", 1)
				.AddSound("fireball", "./assets/sounds/fireball.mp3", 1)
				.AddSound("jump", "./assets/sounds/jump.mp3")
				.AddSound("kick", "./assets/sounds/kick.mp3")
				.AddSound("pipe", "./assets/sounds/pipe.mp3", 1)
				.AddSound("powerdown", "./assets/sounds/powerdown.mp3", 1)
				.AddSound("powerup", "./assets/sounds/powerup.mp3", 1)
				.AddSound("sprout", "./assets/sounds/sprout.mp3", 1)
				.AddSound("stagestart", "./assets/sounds/stagestart.mp3", 1)
				.AddSound("stomp", "./assets/sounds/stomp.mp3", 2);
		} else {
			Resources.AddSound("1up", "./assets/sounds/1-up.wav", 1)
				.AddSound("breakblock", "./assets/sounds/breakblock.wav")
				.AddSound("bump", "./assets/sounds/bump.wav", 2)
				.AddSound("cannon", "./assets/sounds/cannon.wav")
				.AddSound("coin", "./assets/sounds/coin.wav", 5)
				.AddSound("death", "./assets/sounds/death.wav", 1)
				.AddSound("exit", "./assets/sounds/exit.wav", 1)
				.AddSound("fireball", "./assets/sounds/fireball.wav", 1)
				.AddSound("jump", "./assets/sounds/jump.wav", 1)
				.AddSound("kick", "./assets/sounds/kick.wav", 1)
				.AddSound("message", "./assets/sounds/message.wav", 1)
				.AddSound("pipe", "./assets/sounds/pipe.wav", 1)
				.AddSound("powerdown", "./assets/sounds/powerdown.wav", 1)
				.AddSound("powerup", "./assets/sounds/powerup.wav", 1)
				.AddSound("sprout", "./assets/sounds/sprout.wav", 1)
				.AddSound("stagestart", "./assets/sounds/stagestart.wav", 1)
				.AddSound("stomp", "./assets/sounds/stomp.wav", 1);
		}

		//load the array of tile behaviors
		Tile.LoadBehaviors();
	}
	Exit() {
		delete this.Images;
	}
	Update(delta) {
		if (!this.ImagesLoaded) {
			this.ImagesLoaded = true;
			var i = 0;
			for (i = 0; i < this.Images.length; i++) {
				if (Resources.Images[this.Images[i].name].complete !== true) {
					this.ImagesLoaded = false;
					break;
				}
			}
		}

		this.ScreenColor += this.ColorDirection * 255 * delta;
		if (this.ScreenColor > 255) {
			this.ScreenColor = 255;
			this.ColorDirection = -1;
		} else if (this.ScreenColor < 0) {
			this.ScreenColor = 0;
			this.ColorDirection = 1;
		}
	}
	Draw(context) {
		if (!this.ImagesLoaded) {
			var color = parseInt(this.ScreenColor, 10);
			context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
			context.fillRect(0, 0, 640, 480);
		} else {
			context.fillStyle = "rgb(0, 0, 0)";
			context.fillRect(0, 0, 640, 480);
		}
	}
	CheckForChange(context) {
		if (this.ImagesLoaded) {
			//set up the global map state variable
			Mario.GlobalMapState = new MapState();

			context.ChangeState(new TitleState());
		}
	}
};
