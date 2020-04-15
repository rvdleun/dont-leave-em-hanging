AFRAME.registerComponent('game', {
    schema: {
        duration: { type: 'number', default: 60000 },
        enabled: { type: 'boolean', default: false },
        fanboyCircle: { type: 'selector', default: '[fanboy-circle] '},
        radius: { type: 'number', default: 360 },
        titleScreen: { type: 'selector', default: '[title-screen] '},
    },

    init: function() {
        this.spawner = this.el.querySelector('#spawner');
        this.timer = this.el.querySelector('#timer');

        this.timer.addEventListener('animationcomplete__setup', () => this.onAnimationSetupEnd() );
        this.timer.addEventListener('animationcomplete__timer', () => this.onAnimationTimerEnd() );
    },

    update: function() {
        const { duration, enabled } = this.data;

        if (!enabled) {
            return;
        }

        this.spawner.setAttribute('fanboy-spawner', 'enabled', true);

        this.timer.setAttribute('animation__setup', {
            property: 'object3D.rotation.y',
            from: 90,
            to: 450,
            dur: 1000,
        });
        this.timer.setAttribute('animation__timer', {
            property: 'object3D.rotation.y',
            from: 90,
            to: -270,
            delay: 1250,
            dur: duration,
            easing: 'linear',
        });
    },

    onAnimationSetupEnd: function() {
        this.spawner.setAttribute('fanboy-spawner', 'enabled', true);
    },

    onAnimationTimerEnd: function() {
        this.el.setAttribute('game', 'enabled', false);
        this.spawner.setAttribute('fanboy-spawner', 'enabled', false);

        this.timer.removeAttribute('animation__setup');
        this.timer.removeAttribute('animation__timer');

        setTimeout(() => {
            this.data.fanboyCircle.setAttribute('fanboy-circle', 'enabled', true);
            this.data.titleScreen.setAttribute('title-screen', 'visible', true);
        }, 5000);
    }
});
