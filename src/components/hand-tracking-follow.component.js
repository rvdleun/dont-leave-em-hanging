AFRAME.registerComponent('hand-tracking-follow', {
    schema: {
        hand: { default: 'left', oneOf: ['left', 'right'] },
    },

    tick: function() {
        const system = this.el.sceneEl.systems['hand-tracking-mesh'];

        if (!system || !system.hands) {
            return;
        }

        const { hand } = this.data;
        const data = system.hands[hand];
        const jointPose = data[16];

        console.log(jointPose);

        if (!jointPose) {
            return;
        }

        this.el.setAttribute('position', `${jointPose.position.x - .025} ${jointPose.position.y + 1.45} ${jointPose.position.z - 0.025}`);
    }
});
