/**
	Represents a simple static sprite.
	Code by Rob Kleffner, 2011
*/

type ResourcesType = {
	Images: {
		[key in string]: HTMLImageElement;
	};
	Sounds: {
		[key in string]: HTMLAudioElement;
	};
	Destroy(): ResourcesType;
	//***********************/
	//Images
	AddImage(name: string, src: string): ResourcesType;
	AddImages(array: Array<{ name?: string; src?: string }>): ResourcesType;
	ClearImages(): ResourcesType;
	RemoveImage(name: string): ResourcesType;
	//***********************/
	//Sounds
	AddSound(name: string, src: string, maxChannels: number | void): ResourcesType;
	ClearSounds(): ResourcesType;
	RemoveSound(name: string): ResourcesType;
	PlaySound(name: string, loop?: boolean): number;
	PauseChannel(name: string, index: number): ResourcesType;
	PauseSound(name: string): ResourcesType;
	ResetChannel(name: string, index: number): ResourcesType;
	ResetSound(name: string): ResourcesType;
	StopLoop(name: string, index: number): void;
	LoopCallback(): void;
}

const Resources: ResourcesType = {
	Images: {},
	Sounds: {},

	Destroy(): ResourcesType {
		delete this.Images;
		delete this.Sounds;
		return this;
	},
	//***********************/
	//Images
	AddImage(name: string, src: string): ResourcesType {
		var tempImage = new Image();
		this.Images[name] = tempImage;
		tempImage.src = src;
		return this;
	},
	AddImages(array: Array<{ name?: string; src?: string }>): ResourcesType {
		for (var i = 0; i < array.length; i++) {
			var tempImage = new Image();
			this.Images[array[i].name!] = tempImage;
			tempImage.src = array[i].src!;
		}
		return this;
	},
	ClearImages(): ResourcesType {
		delete this.Images;
		this.Images = new Object();
		return this;
	},
	RemoveImage(name: string): ResourcesType {
		delete this.Images[name];
		return this;
	},
	//***********************/
	//Sounds
	AddSound(name: string, src: string, maxChannels: number | void): ResourcesType {
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

	ClearSounds(): ResourcesType {
		delete this.Sounds;
		this.Sounds = {};
		return this;
	},

	RemoveSound(name: string): ResourcesType {
		delete this.Sounds[name];
		return this;
	},

	PlaySound(name: string, loop: boolean): number {
		if (this.Sounds[name].index >= this.Sounds[name].length) {
			this.Sounds[name].index = 0;
		}
		if (loop) {
			this.Sounds[name][this.Sounds[name].index].addEventListener("ended", this.LoopCallback, false);
		}
		this.Sounds[name][this.Sounds[name].index++].play();
		return this.Sounds[name].index;
	},

	PauseChannel(name: string, index: number): ResourcesType {
		if (!this.Sounds[name][index].paused) {
			this.Sounds[name][index].pause();
		}
		return this;
	},

	PauseSound(name: string): ResourcesType {
		for (var i = 0; i < this.Sounds[name].length; i++) {
			if (!this.Sounds[name][i].paused) {
				this.Sounds[name][i].pause();
			}
		}
		return this;
	},

	ResetChannel(name: string, index: number): ResourcesType {
		this.Sounds[name][index].currentTime = 0;
		this.StopLoop(name, index);
		return this;
	},

	ResetSound(name: string): ResourcesType {
		for (var i = 0; i < this.Sounds[name].length; i++) {
			this.Sounds[name].currentTime = 0;
			this.StopLoop(name, i);
		}
		return this;
	},

	StopLoop(name: string, index: number): void {
		this.Sounds[name][index].removeEventListener("ended", this.LoopCallback, false);
	},

	LoopCallback(): void {
		this.currentTime = -1;
		this.play();
	}
};

export default Resources;
