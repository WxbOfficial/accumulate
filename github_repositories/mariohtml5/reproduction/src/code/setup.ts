/**
	Just create the global mario object.
	Code by Rob Kleffner, 2011
*/
import MapState from './mapState.ts';
import Character from './character.ts';

type MarioType = {
	GlobalMapState: null | MapState;
	MarioCharacter: null | Character;

	PlayMusic?: Function;
	PlayTitleMusic?: Function;
	PlayMapMusic?: Function;
	PlayOvergroundMusic?: Function;
	PlayUndergroundMusic?: Function;
	PlayCastleMusic?: Function;
	StopMusic?: Function;
}

/**
	Just create the global mario object.
	Code by Rob Kleffner, 2011
*/

/*
* using cross platform MIDI library MIDI.js http://www.midijs.net/
*/

var midifiles = {
	"title": "midi/title.mid",
	"map": "midi/map.mid",
	"background": "midi/background.mid",
	"overground": "midi/overground.mid",
	"underground": "midi/underground.mid",
	"castle": "midi/castle.mid",
};

const Mario: MarioType = {
	GlobalMapState: null,
	MarioCharacter: null,

	PlayMusic(name: string) {
		if (name in midifiles) {
			// Currently we stop all playing tracks when playing a new one
			// MIDIjs can't play multiple at one time
			//MIDIjs.stop();;
			//MIDIjs.play(midifiles[name]);
		} else {
			console.error("Cannot play music track " + name + " as i have no data for it.");
		}
	},
	PlayTitleMusic() {
		Mario.PlayMusic!("title");
	},
	PlayMapMusic() {
		Mario.PlayMusic!("map");
	},
	PlayOvergroundMusic() {
		Mario.PlayMusic!("background");
	},
	PlayUndergroundMusic() {
		Mario.PlayMusic!("underground");
	},
	PlayCastleMusic() {
		Mario.PlayMusic!("castle");
	},
	StopMusic() {
		//MIDIjs.stop();
	},
};


export default Mario;