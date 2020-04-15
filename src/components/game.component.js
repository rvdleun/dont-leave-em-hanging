AFRAME.registerComponent('game', {
    schema: {
        duration: { type: 'number', default: 60000 },
        enabled: { type: 'boolean', default: false },
    },

    init: function() {
        this.spawner = this.el.querySelector('#spawner');
        this.timer = this.el.querySelector('#timer');

        this.timer.addEventListener('animationcomplete__timer', () => this.onAnimationEnd() );
    },

    update: function() {
        const { duration, enabled } = this.data;

        if (!enabled) {
            return;
        }

        this.spawner.setAttribute('fanboy-spawner', 'enabled', true);

        this.timer.setAttribute('animation__setup', {
            property: 'geometry.thetaLength',
            to: 1,
            dur: 500,
        });
        this.timer.setAttribute('animation__timer', {
            property: 'geometry.thetaLength',
            from: 1,
            to: 360,
            delay: 750,
            dur: duration,
            easing: 'linear',
        });
    },

    onAnimationEnd: function() {
        this.spawner.setAttribute('fanboy-spawner', 'enabled', false);

        this.timer.removeAttribute('animation__setup');
        this.timer.removeAttribute('animation__timer');
    }
});
