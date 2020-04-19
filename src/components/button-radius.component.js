AFRAME.registerComponent('button-radius', {
    schema: {
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

    STORAGE_KEY: 'settings-radius',
    radiuses: [
        { description: '180', value: '180' },
        { description: '360', value: '360', default: true },
    ],
    selectedRadius: null,

    init: function() {
        this.setRadius(window.localStorage.getItem(this.STORAGE_KEY));
    },

    setRadius: function(radius) {
        let settings = this.radiuses.find(search => search.value === radius);
        if (!settings) {
            settings = this.radiuses.find(search => search.default);
        }

        this.data.spawner.setAttribute('fanboy-spawner', 'radiuses', settings.value);
        this.el.setAttribute('button', 'text', settings.description );
        this.selectedRadius = settings;
        window.localStorage.setItem(this.STORAGE_KEY, radius);
    }
});
