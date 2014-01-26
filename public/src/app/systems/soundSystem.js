define([
    'cog'

], function(cog) {

    var SoundSystem = cog.System.extend('sandbox.SoundSystem', {

        sounds : {},
        assetDirectory : "assets/",
        webAudioSupported : false,
        soundEnabled : false,
        _audioContext: null,


        configure: function(entities, events, config) {

            window.AudioContext = window.AudioContext || window.webkitAudioContext;

            try {
                this._audioContext = new AudioContext();
                this.webAudioSupported = true;
            }
            catch (e) {
                console.log ("SoundSystem: WebAudio API not supported.");
            }

            config = config || {};
            if (config.assetDirectory) {
                this.assetDirectory = config.assetDirectory;
            }

            if (this.webAudioSupported && config.soundEnabled) {
                this.soundEnabled = true;
                if (config.sounds) this._loadSounds(config.sounds);
            }

        },

        _loadSounds : function (sounds) {

            if (!this.webAudioSupported) {
                return;
            }

            for (var i=0; i < sounds.length; i++) {
                this._downloadSound(sounds[i]);
            }

        },

        _downloadSound: function (sound) {

            var fileName = sound.fileName;
            var name = sound.name;

            var url = this.assetDirectory + fileName;

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var soundSystem = this;
            request.onload = function() {

                soundSystem._audioContext.decodeAudioData(request.response,
                    function(buffer) {
                        sound.buffer = buffer;
                        soundSystem.sounds[name] = sound;
                    }, soundSystem._downloadError);

            }
            request.send();

        },

        _createSoundSource: function(sound) {

            var source = this._audioContext.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(this._audioContext.destination);

            // apply looping properties to buffer
            if (sound.loop) {
                source.loopStart = 0;
                source.loopEnd = 13.10;
                source.loop = true;
            }

            return source;

        },

        _downloadError: function (e) {
            console.log("SoundSystem: error downloading sound. error=" + e);
        },

        'playSound event': function(name) {

            var sound = this.sounds[name];
            if (sound) {

                var source = this._createSoundSource (sound);
                sound.sources = sound.sources || [];
                sound.sources.push(source);
                source.start(0);

            }

        },

        'stopSound event': function(name) {

            var sound = this.sounds[name];
            if (sound) {
                var source = null;
                for (var i =0; i < sound.sources.length; i++) {
                    source = sound.sources[i];
                    source.stop(0);
                }
                sound.sources.length = 0;
            }

        }
    });

    cog.SoundSystem = SoundSystem;

    return SoundSystem;

});