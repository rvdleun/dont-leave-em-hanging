AFRAME.registerComponent('button-difficulty', {
    schema: {
        highScore: { type: 'selector', default: '[high-score]' },
        spawner: { type: 'selector', default: '[fanboy-spawner]' }
    },

    events: {
        click: function () {
            let index = this.difficulties.findIndex(search => search === this.selectedDifficulty);
            index++;

            if (index >= this.difficulties.length) {
                index = 0;
            }
            this.setDifficulty(this.difficulties[index].value);
        }
    },

    STORAGE_KEY: 'dleh.settings-difficulty',
    difficulties: [
        { description: 'Normal', value: 'normal', default: true },
        { description: 'Only\nhigh fives', value: 'hand' },
    ],
    selectedDifficulty: null,

    init: function() {
        // this.setDifficulty(window.localStorage.getItem(this.STORAGE_KEY));
        this.setDifficulty('hand');
    },

    setDifficulty: function(difficulty) {
        let settings = this.difficulties.find(search => search.value === difficulty);
        if (!settings) {
            settings = this.difficulties.find(search => search.default);
        }

        this.data.highScore.setAttribute('high-score', 'difficulty', settings.value);
        this.data.spawner.setAttribute('fanboy-spawner', 'type', settings.value === 'normal' ? '' : settings.value);
        this.el.setAttribute('button', 'text', settings.description );
        this.selectedDifficulty = settings;
        window.localStorage.setItem(this.STORAGE_KEY, settings.value);
    }
});
