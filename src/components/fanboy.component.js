AFRAME.registerComponent('fanboy', {
    schema: {
        distance: { type: 'number', default: 0 },
        distanceDuration: { type: 'number', default: 5000 },
        hand: { type: 'string', default: 'right' },
        lane: { type: 'number', default: -1 },
        type: { type: 'string', default: 'hand' },
    },

    events: {
        contact: function(e) {
            if (this.contacted || !this.ready) {
                return;
            }

            this.contacted = true;

            const { lane, playerHand, velocity } = e.detail;

            const rightHand = !playerHand.classList.contains(this.data.hand);
            const rightType = playerHand.classList.contains(this.data.type);
            const rightVelocity =
                (this.data.type === 'hand' && velocity > .1) ||
                (this.data.type === 'fist' && velocity < .05);
            const approved = rightHand && rightType && rightVelocity;

            // this.handEl.removeChild(this.receiverEl);

            this.faceEl.setAttribute('src', `#${approved ? '' : 'not-'}approved-1`);
            this.faceEl.setAttribute('animation', 'property: opacity; from: 1; to: 0; dur: 1000; delay: 1000');
            this.handEl.setAttribute('animation', 'property: opacity; from: 1; to: 0; dur: 300; easing: linear');

            setTimeout(() => {
                this.el.emit('laneAvailable', { lane });
                this.el.parentNode.removeChild(this.el);
            }, 1250 + (Math.random() * 500));
        }
    },

    init: function() {
        const { hand, lane, type } = this.data;
        this.ready = false;

        const face = document.createElement('a-plane');
        face.setAttribute('animation', {
            property: 'opacity',
            from: 0,
            to: 1
        });
        face.setAttribute('material', {
            alphaTest: .5,
            shader: 'flat',
        });
        face.setAttribute('opacity', '0');
        face.setAttribute('position', '0 .2 0');
        face.setAttribute('scale', '.25 .25 .25');
        face.setAttribute('src', '#waiting-1');
        face.setAttribute('transparent', 'true');
        this.el.appendChild(face);

        const handEl = document.createElement('a-plane');
        const xUpdate = hand === 'left' ? -1 : 1;
        handEl.setAttribute('animation', {
            property: 'opacity',
            delay: 250,
            from: 0,
            to: 1
        });
        handEl.setAttribute('opacity', '0');
        handEl.setAttribute('position', {
            x: (.1 + (Math.random() / 10)) * -xUpdate,
            y: .1 + (type === 'hand' ? .25 : 0),
            z: .05
        });
        handEl.setAttribute('rotation', {
            x: 0,
            y: 0,
            z: Math.random() * 40 * xUpdate,
        });
        handEl.setAttribute('scale', {
            x: .2 * xUpdate,
            y: .2,
            z: .1
        });
        handEl.setAttribute('material', {
            alphaTest: .5,
            shader: 'flat',
        });
        handEl.setAttribute('src', `#${type}`);
        handEl.setAttribute('transparent', 'false');
        this.el.appendChild(handEl);

        setTimeout(() => {
            this.ready = true;
        }, 250);

        const receiver = document.createElement('a-box');
        receiver.setAttribute('dynamic-body', 'mass: 0; linearDamping: .99995; angularDamping: .999995;');
        receiver.setAttribute('material', 'opacity: 0.5; transparent: true');
        receiver.setAttribute('color', 'blue');
        receiver.setAttribute('scale', '.2 .2 .1');
        receiver.setAttribute('visible', 'false');
        receiver.setAttribute('hand-receiver', { lane });
        handEl.appendChild(receiver);

        this.faceEl = face;
        this.handEl = handEl;
        this.receiverEl = receiver;
    },

    update: function() {
        const { distance, distanceDuration } = this.data;
        this.el.setAttribute('animation', `property: object3D.position.z; to: ${distance}; dur: ${distanceDuration}`);
    }
});
