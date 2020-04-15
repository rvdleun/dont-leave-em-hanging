AFRAME.registerComponent('fanboy-circle', {
    schema: {
        distance: { type: 'number', default: 3.5 },
        enabled: { type: 'boolean', default: false },
        noFanboys: { type: 'number', default: 30 },
        radius: { type: 'number', default: 270 },
    },

    init: function() {
        const container = document.createElement('a-entity');
        this.el.appendChild(container);

        this.container = container;
        this.fanboys = [];
    },

    update: function() {
        const { distance, enabled, noFanboys, radius } = this.data;

        if (!enabled) {
            this.fanboys.forEach(fanboy => {
                fanboy.emit('fadeHand', { from: '#fff', to: '#fff', text: '' });
                fanboy.emit('removeFanboy');
            });
            return;
        }

        this.fanboys = [];
        for(let rotation = 0; rotation < radius; rotation+=radius / noFanboys) {
            const entity = document.createElement('a-entity');
            entity.setAttribute('rotation', {
                x: 0,
                y: rotation,
                z: 0,
            });

            const fanboy = document.createElement('a-entity');
            fanboy.setAttribute('fanboy', {
                canContact: false,
                distance: -distance,
                hand: Math.random() < .5 ? 'left': 'right',
                type: Math.random() < .5 ? 'fist' : 'hand',
            });
            fanboy.setAttribute('position', {
                x: 0,
                y: 0,
                z: -distance
            });
            entity.appendChild(fanboy);
            this.container.appendChild(entity);

            this.fanboys.push(fanboy);
        }
    }
});
