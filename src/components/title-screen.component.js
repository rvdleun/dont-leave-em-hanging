AFRAME.registerComponent('title-screen', {
    schema: {
        scoreFront: { type: 'selector', default: '#score-front' },
        tutorial: { type: 'selector', default: '#tutorial' },
        visible: { type: 'boolean', default: true }
    },

    update: function() {
        const { visible } = this.data;

        document.querySelectorAll('[player-cursor]').forEach(cursor => cursor.setAttribute('player-cursor', 'enabled', visible));

        this.data.scoreFront.setAttribute('animation__visible', {
            delay: visible ? 0 : 1000,
            property: 'scale',
            to: visible ? '0 0 0' : '10 10 10',
            dur: visible ? 500 : 1000,
        });

        this.data.tutorial.setAttribute('animation', {
            delay: visible ? 0 : 1000,
            property: 'scale',
            to: visible ? '1 1 1' : '0 0 0',
            dur: visible ? 500 : 1000,
        });

        this.el.setAttribute('animation', {
            delay: visible ? 150 : 0,
            property: 'scale',
            to: visible ? '1.25 1.25 1.25' : '0 0 0',
            dur: 1000,
        })

        setTimeout(() => {
            this.el.setAttribute('visible', visible);
        }, visible ? 0 : 3000);
    }
});
