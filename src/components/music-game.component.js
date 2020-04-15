AFRAME.registerComponent('music-game', {
    schema: {
        playing: { type: 'boolean', default: false },
    },

    events: {
        'sound-loaded': function() {
            this.trackLoaded = true;
            this.track = this.el.components['sound'].pool.children[0];
            this.track.setLoop(true);
            this.track.setLoopStart(5.325);
            this.track.setLoopEnd(105.4);
            this.update();
        }
    },

    update: function() {
        if (!this.trackLoaded) {
            return;
        }

        const { playing } = this.data;

        if (playing) {
            this.el.components['sound'].stopSound();
            this.el.removeAttribute('animation');

            this.track.offset = 0;
            this.track.setVolume(.6);
            this.el.components['sound'].playSound();
        }
    },

    tick: function(time, delta) {
        if (this.trackLoaded && this.data.playing === false && this.track.isPlaying) {
            const volume = this.track.getVolume() - delta / 2000;
            if (volume < 0) {
                this.el.components['sound'].stopSound();
            } else {
                this.track.setVolume(volume);
            }
        }
    }
});
