AFRAME.registerComponent('title-screen', {
    schema: {
        visible: { type: 'boolean', default: true }
    },

    update: function() {
        const { visible } = this.data;

        document.querySelectorAll('[cursor]').forEach(cursor => cursor.setAttribute('raycaster', 'far', visible ? 1000 : 0));

        this.el.setAttribute('animation', {
            property: 'scale',
            to: visible ? '1.25 1.25 1.25' : '0 0 0',
            dur: 1000,
        })
    }
});
