AFRAME.registerComponent('fanboy-circle', {
    schema: {
        distance: { type: 'number', default: 3.5 },
        enabled: { type: 'boolean', default: false },
        noFanboys: { type: 'number', default: 40 },
    },

    update: function() {
        const { distance, enabled, noFanboys } = this.data;

        if (!enabled) {
            return;
        }

        for(let rotation = 0; rotation < 360; rotation+=360 / noFanboys) {
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
            this.el.appendChild(entity);
        }
    }
});
