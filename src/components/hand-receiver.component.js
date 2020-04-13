AFRAME.registerComponent('hand-receiver', {
    schema: {
        lane: { type: 'number', default: -1 },
    },

    events: {
        collide: function(e) {
            const playerHand = e.detail.body.el;

            if (playerHand.classList.contains('player-hand') === false) {
                return;
            }

            const velocity = playerHand.getAttribute('data-velocity');
            console.log(velocity);
            this.el.emit('contact', { lane: this.data.lane, playerHand, velocity }, true);
        }
    },

    highlight: 0,
    tick: function(time, delta) {
        this.highlight-=delta;
        this.el.setAttribute('color', this.highlight < 0 ? 'blue' : 'yellow');

        // const test = document.querySelector('#test');
        // this.el.object3D.position.setY(test.object3D.position.y + 1.6);
        // console.log(this.el.object3D.position.y);
    }
});
