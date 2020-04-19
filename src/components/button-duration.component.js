AFRAME.registerComponent('button-duration', {
    schema: {
        game: { type: 'selector', default: '[game]' },
        highScore: { type: 'selector', default: '[high-score]' },
    },

    events: {
        click: function () {
            let index = this.durations.findIndex(search => search === this.selectedDuration);
            index++;

            if (index >= this.durations.length) {
                index = 0;
            }
            this.setDuration(this.durations[index].value);
        }
    },

    STORAGE_KEY: 'dleh.settings-duration',
    durations: [
        { description: '1min', value: '60000' },
        { description: '3min', value: '180000' },
        { description: '5min', value: '300000', default: true },
        { description: '10min', value: '600000' },
    ],
    selectedDuration: null,

    init: function() {
        this.setDuration(window.localStorage.getItem(this.STORAGE_KEY));
    },

    setDuration: function(duration) {
        let settings = this.durations.find(search => search.value === duration);
        if (!settings) {
            settings = this.durations.find(search => search.default);
        }

        this.data.highScore.setAttribute('high-score', 'duration', settings.value);
        this.data.game.setAttribute('game', 'duration', settings.value);
        this.el.setAttribute('button', 'text', settings.description );
        this.selectedDuration = settings;
        window.localStorage.setItem(this.STORAGE_KEY, settings.value);
    }
});
