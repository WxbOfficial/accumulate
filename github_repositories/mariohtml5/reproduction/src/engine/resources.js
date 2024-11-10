/**
	Represents a simple static sprite.
	Code by Rob Kleffner, 2011
*/

const Resources = {
	Images: {},
	Sounds: {},

	Destroy() {
		delete this.Images;
		delete this.Sounds;
		return this;
	},

	//***********************/
	//Images
	AddImage(name, src) {
		var tempImage = new Image();
		this.Images[name] = tempImage;
		tempImage.src = src;
		return this;
	},

	AddImages(array) {
		for (var i = 0; i < array.length; i++) {
			var tempImage = new Image();
			this.Images[array[i].name] = tempImage;
			tempImage.src = array[i].src;
		}
		return this;
	},

	ClearImages() {
		delete this.Images;
		this.Images = new Object();
		return this;
	},

	RemoveImage(name) {
		delete this.Images[name];
		return this;
	},

	//***********************/
	//Sounds
	AddSound(name, src, maxChannels) {
		this.Sounds[name] = [];
		this.Sounds[name].index = 0;
		if (!maxChannels) {
			maxChannels = 3;
		}
		for (var i = 0; i < maxChannels; i++) {
			this.Sounds[name][i] = new Audio(src);
		}
		return this;
	},

	ClearSounds() {
		delete this.Sounds;
		this.Sounds = {};
		return this;
	},

	RemoveSound(name) {
		delete this.Sounds[name];
		return this;
	},

	PlaySound(name, loop) {
		if (this.Sounds[name].index >= this.Sounds[name].length) {
			this.Sounds[name].index = 0;
		}
		if (loop) {
			this.Sounds[name][this.Sounds[name].index].addEventListener("ended", this.LoopCallback, false);
		}
		this.Sounds[name][this.Sounds[name].index++].play();
		return this.Sounds[name].index;
	},

	PauseChannel(name, index) {
		if (!this.Sounds[name][index].paused) {
			this.Sounds[name][index].pause();
		}
		return this;
	},

	PauseSound(name) {
		for (var i = 0; i < this.Sounds[name].length; i++) {
			if (!this.Sounds[name][i].paused) {
				this.Sounds[name][i].pause();
			}
		}
		return this;
	},

	ResetChannel(name, index) {
		this.Sounds[name][index].currentTime = 0;
		this.StopLoop(name, index);
		return this;
	},

	ResetSound(name) {
		for (var i = 0; i < this.Sounds[name].length; i++) {
			this.Sounds[name].currentTime = 0;
			this.StopLoop(name, i);
		}
		return this;
	},

	StopLoop(name, index) {
		this.Sounds[name][index].removeEventListener("ended", this.LoopCallback, false);
	},

	LoopCallback() {
		this.currentTime = -1;
		this.play();
	}
};

export default Resources;
