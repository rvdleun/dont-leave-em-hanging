AFRAME.registerComponent('hand-receiver', {
    events: {
        collide: function(e) {
            const playerHand = e.detail.body.el;

            if (playerHand.classList.contains('player-hand') === false) {
                return;
            }

            const velocity = playerHand.getAttribute('data-velocity');
            this.el.emit('contact', { playerHand, velocity }, true);
        }
    },

    highlight: 0,
    tick: function(time, delta) {
        this.highlight-=delta;
        this.el.setAttribute('color', this.highlight < 0 ? 'blue' : 'yellow');
    }
});
