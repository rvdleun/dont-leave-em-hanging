AFRAME.registerSystem('player-cursor', {
    playerCursors: [],

    register: function(playerCursor) {
        this.playerCursors.push(playerCursor);
    },

    setActive: function(activeCursor) {
        this.playerCursors.forEach(playerCursor => playerCursor.setAttribute('player-cursor', 'active', activeCursor === playerCursor));
    }
});

AFRAME.registerComponent('player-cursor', {
    schema: {
        active: { type: 'boolean', default: false },
        enabled: { type: 'boolean', default: true },
    },

    events: {
        triggerdown: function() {
            this.system.setActive(this.el);
        }
    },

    init: function() {
        this.system.register(this.el);
    },

    update: function() {
        const { active, enabled } = this.data;
        this.el.setAttribute('raycaster', 'far', active && enabled ? 1000 : 0);
    }
});
