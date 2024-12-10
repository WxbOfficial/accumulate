/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HTML5AudioSoundManager = require('./html5/HTML5AudioSoundManager');
var NoAudioSoundManager = require('./noaudio/NoAudioSoundManager');
var WebAudioSoundManager = require('./webaudio/WebAudioSoundManager');

/**
 * Creates a Web Audio, HTML5 Audio or No Audio Sound Manager based on config and device settings.
 *
 * Be aware of https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
 *
 * @function Phaser.Sound.SoundManagerCreator
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 *
 * @return {(Phaser.Sound.HTML5AudioSoundManager|Phaser.Sound.WebAudioSoundManager|Phaser.Sound.NoAudioSoundManager)} The Sound Manager instance that was created.
 */
var SoundManagerCreator = {

    create: function (game)
    {
        console.group('SoundManagerCreator create');
        var audioConfig = game.config.audio;
        var deviceAudio = game.device.audio;

        if (audioConfig.noAudio || (!deviceAudio.webAudio && !deviceAudio.audioData))
        {
            console.info('SoundManagerCreator create 是 NoAudioSoundManager');
            const result = new NoAudioSoundManager(game);
            console.groupEnd();
            return result;
        }

        if (deviceAudio.webAudio && !audioConfig.disableWebAudio)
        {
            console.info('SoundManagerCreator create 是 WebAudioSoundManager');
            const result = new WebAudioSoundManager(game);
            console.groupEnd();
            return result
        }

        console.info('SoundManagerCreator create 是 HTML5AudioSoundManager');
        const result = new HTML5AudioSoundManager(game);
        console.groupEnd();
        return result
    }

};

module.exports = SoundManagerCreator;
