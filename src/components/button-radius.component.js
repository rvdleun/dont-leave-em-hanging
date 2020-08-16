AFRAME.registerComponent('button-radius', {
    schema: {
        highScore: { type: 'selector', default: '[high-score]' },
        spawner: { type: 'selector', default: '[fanboy-spawner]' }
    },

    events: {
        click: function () {
            let index = this.radiuses.findIndex(search => search === this.selectedRadius);
            index++;

            if (index >= this.radiuses.length) {
                index = 0;
            }
            this.setRadius(this.radiuses[index].value);
        }
    },

    STORAGE_KEY: 'dleh.settings-radius',
    radiuses: [
        { description: '180', value: '180', default: true },
        { description: '360', value: '360' },
    ],
    selectedRadius: null,

    init: function() {
        // this.setRadius(window.localStorage.getItem(this.STORAGE_KEY));
        this.setRadius('360');
    },

    setRadius: function(radius) {
        let settings = this.radiuses.find(search => search.value === radius);
        if (!settings) {
            settings = this.radiuses.find(search => search.default);
        }

        this.data.highScore.setAttribute('high-score', 'radius', settings.value);
        this.data.spawner.setAttribute('fanboy-spawner', 'radius', settings.value);
        this.el.setAttribute('button', 'text', settings.description );
        this.selectedRadius = settings;
        window.localStorage.setItem(this.STORAGE_KEY, settings.value);
    }
});
