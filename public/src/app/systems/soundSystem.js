define([
    'cog'

], function(cog) {

    var SoundSystem = cog.System.extend('sandbox.SoundSystem', {

        /* holds the sound buffers */
        sounds : {},

        /* queue of audio events to handle, checked each update step */
        audioQueue: [],

        assetDirectory : "assets/",
        webAudioSupported : false,
        soundEnabled : false,
        _audioContext: null,
        events: null,

        /* audio event type values */
        REQ_PLAY: 0,
        REQ_MUTE: 1,
        REQ_UNMUTE: 2,
        REQ_STOP: 3,

        configure: function(entities, events, config) {

            this.events = events;

            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
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

                // todo: fix the problem with sound play with an initial gain of zero.
                this._playSound('square');
                this._playSound('triangle', 0);
                this._muteSound('triangle');
                this._playSound('circle', 0);
                this._muteSound('circle');

            }

        },

        update: function () {

            this._processAudioQueue();

        },

        _processAudioQueue: function () {

            if (this.audioQueue.length == 0) return;

            for (var i=0; i< this.audioQueue.length; i++) {

                var soundData = this.audioQueue[i];
                if (!soundData) continue;

                var sound = this.sounds[soundData.name];
                if (!sound) continue;

                console.log("processing audio queue. index=" + i);

                // since the sound was found, remove this item from the queue.
                this.audioQueue.splice(i, 1);

                switch (soundData.type) {
                    case this.REQ_PLAY:
                        console.log("playing sound [" + sound.name + "] with a gain of [" + soundData.gain + "]");
                        var soundSource = this._createSoundSource(sound, soundData.gain);
                        sound.sources = sound.sources || [];
                        sound.sources.push(soundSource);
                        soundSource.start(0);
                        break;
                    case this.REQ_STOP:
                        console.log("stopping sound [" + sound.name + "] with a gain of [" + soundData.gain + "]");
                        if (sound.sources) {
                            sound.sources.forEach(function(source) {
                                source.stop(0);
                            }, this);

                            sound.sources.length = 0;
                        }
                        break;
                    case this.REQ_MUTE:
                        console.log("mutting sound [" + sound.name + "] with a gain of [0]");
                        if (sound.sources) {
                            sound.sources.forEach(function(source) {
                                source.gain.value = 0;
                            }, this);
                        }
                        break;
                    case this.REQ_UNMUTE:
                        console.log("mutting sound [" + sound.name + "] with a gain of [1]");
                        if (sound.sources) {
                            sound.sources.forEach(function(source) {
                                source.gain.value = 1;
                            }, this);
                        }
                        break;
                }
            }

        },

        _createSoundSource: function(sound, gain) {

            var source = this._audioContext.createBufferSource();
            var gainNode = this._audioContext.createGain ? this._audioContext.createGain()
                : this._audioContext.createGainNode();

            gainNode.value = gain;
            source.buffer = sound.buffer;
            source.connect(gainNode);
            source.connect(this._audioContext.destination);

            // apply looping properties to buffer
            if (sound.loop) source.loop = true;
            return source;

        },

        /* audio retrieval functions */

        _loadSounds: function (sounds) {

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
                    }, function() {
                        console.log("SoundSystem: error downloading sound. error=" + e);
                    });

            }
            request.send();

        },

        /* audio manipulation functions */

        _playSound: function (name, gain) {

            if ( typeof gain === "undefined") {
                gain = 1;
            }

            this.audioQueue.push({ name: name, type: this.REQ_PLAY, gain: gain });

        },

        _stopSound: function (name) {

            this.audioQueue.push({name: name, type: this.REQ_STOP});

        },

        _muteSound: function (name) {

            this.audioQueue.push({ name: name, type: this.REQ_MUTE });

        },

        _unmuteSound: function (name) {

            this.audioQueue.push({ name: name, type: this.REQ_UNMUTE});

        },

        /* events */

        'playerShapeChanged event': function (shape) {

            switch (shape) {
                case 'square':
                    this._unmuteSound('square');
                    this._muteSound('circle');
                    this._muteSound('triangle');
                    break;
                case 'circle':
                    this._unmuteSound('circle');
                    this._muteSound('triangle');
                    this._muteSound('square');
                    break;
                case 'triangle':
                    this._unmuteSound('triangle');
                    this._muteSound('circle');
                    this._muteSound('square');
                    break;
            }

        },

        'goodCollision event': function () {

            this._playSound('positive_hit');

        },

        'badCollision event': function () {

            this._playSound('negative_hit');

        },

        'playSound event': function(name, gain) {

            this._playSound(name, gain);

        },

        'muteSound event': function(name) {

            this._muteSound(name);

        },

        'unmuteSound event': function(name) {

            this._unmuteSound(name);

        },

        'stopSound event': function(name) {

            this._stopSound(name);

        }
    });

    cog.SoundSystem = SoundSystem;

    return SoundSystem;

});