AFRAME.registerComponent('player-hand', {
    events: {
        gripdown: function() {
            this.gripDown = true;
            this.updateHand();
        },
        gripup: function() {
            this.gripDown = false;
            this.updateHand();
        },
        triggerdown: function() {
            this.triggerDown = true;
            this.updateHand();
        },
        triggerup: function() {
            this.triggerDown = false;
            this.updateHand();
        },
    },

    init: function() {
        this.gripDown = false;
        this.triggerDown = false;
        this.nextVelocityCheck = 0;
        this.velocityChecks = [];

        this.playerHand = this.el.querySelector('.player-hand');
    },

    tick: function(time, delta) {
        this.nextVelocityCheck-=delta;
        if (this.nextVelocityCheck < 0) {
            const { velocityChecks } = this;
            velocityChecks.push(this.el.object3D.position.clone());

            if (velocityChecks.length === 3) {
                let velocity = 0;
                for (let i = 1; i < velocityChecks.length; i++) {
                    velocity+=velocityChecks[i-1].distanceTo(velocityChecks[i]);
                }

                this.playerHand.setAttribute('data-velocity', velocity.toString());
                velocityChecks.shift();
            }

            this.nextVelocityCheck = 50;
        }
    },

    updateHand: function() {
        const { classList } = this.playerHand;
        classList.remove('fist');
        classList.remove('hand');

        classList.add(this.gripDown && this.triggerDown ? 'fist' : 'hand');
    }
});
