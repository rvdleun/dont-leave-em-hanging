const approvedText = ['YEAH!', 'WOO!', 'NICE!', 'COOL!', 'AWESOME!'];

AFRAME.registerComponent('fanboy', {
    schema: {
        active: { type: 'boolean', default: false },
        distance: { type: 'number', default: null },
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

            const { playerHand, velocity } = e.detail;

            const rightHand = !playerHand.classList.contains(this.data.hand);
            const rightType = playerHand.classList.contains(this.data.type);
            const rightVelocity =
                (this.data.type === 'hand' && velocity > .2) ||
                (this.data.type === 'fist' && velocity < .2);
            const approved = rightHand && rightType && rightVelocity;

            if (!rightHand) {
                this.textEl.setAttribute('value', 'Wrong hand');
            } else if (!rightType) {
                this.textEl.setAttribute('value', (this.data.type === 'hand' ? 'High five' : 'Fist bump') + '\nrequested');
            } else if(!rightVelocity) {
                this.textEl.setAttribute('value', (this.data.type === 'hand' ? 'Too slow' : 'Too fast'));
            } else {
                this.textEl.setAttribute('value', approvedText[Math.floor(Math.random() * approvedText.length)]);
            }

            const faceSrc = approved ?
                `#approved-${Math.floor(Math.random() * 5) + 1}` :
                `#not-approved-${Math.floor(Math.random() * 3) + 1}`;
            this.handEl.setAttribute('animation__color', {
                property: 'material.color',
                to: approved ? '#0f0' : '#f00',
                dur: 500,
                easing: 'linear'
            });
            this.textEl.setAttribute('animation__color', {
                property: 'color',
                from: approved ? '#070' : '#700',
                to: approved ? '#0f0' : '#f00',
                dur: 1000,
                easing: 'linear'
            });
            this.textEl.setAttribute('animation__opacity', 'property: opacity; from: 0; to: 1; dur: 250; easing: linear');

            this.faceEl.setAttribute('src', faceSrc);
            this.el.emit('removeFanboy', { emitLaneAvailable: true });
        },

        removeFanboy: function(e) {
            const { lane } = this.data;

            this.faceEl.setAttribute('animation', 'property: opacity; from: 1; to: 0; dur: 1000; delay: 1000');
            this.handEl.setAttribute('animation', 'property: opacity; from: 1; to: 0; dur: 300; easing: linear');
            this.textEl.setAttribute('animation__opacity_gone', 'property: opacity; from: 1; to: 0; dur: 250; delay: 2000; easing: linear');

            setTimeout(() => {
                if (e.detail.emitLaneAvailable) {
                    this.el.emit('laneAvailable', { lane }, true);
                }

                this.el.parentNode.parentNode.removeChild(this.el.parentNode);
            }, 2250 + (Math.random() * 500));
        }
    },

    init: function() {
        const { hand, lane, type } = this.data;
        this.timeLeft = 3000;
        this.ready = false;
        this.worried = false;

        const faceSrc = Math.random() <= .01 ? 'vincent' : (Math.floor(Math.random() * 3) + 1).toString();
        const face = document.createElement('a-plane');
        face.setAttribute('animation', {
            property: 'opacity',
            from: 0,
            to: 1
        });
        face.setAttribute('animation__position', {
            property: 'object3D.position.y',
            to: .25 + (Math.random() * .1),
            dir: 'alternate',
            dur: 250 + (Math.random() * 250),
            ease: 'linear',
            loop: true,
        });
        face.setAttribute('material', {
            alphaTest: .5,
            shader: 'flat',
        });
        face.setAttribute('opacity', '0');
        face.setAttribute('position', '0 .2 0');
        face.setAttribute('scale', '.25 .25 .25');
        face.setAttribute('src', `#waiting-${faceSrc}`);
        face.setAttribute('transparent', 'true');
        this.el.appendChild(face);

        const handEl = document.createElement('a-plane');
        const xUpdate = hand === 'left' ? -1 : 1;
        const handPosition = {
            x: (.1 + (Math.random() / 10)) * -xUpdate,
            y: .1 + (type === 'hand' ? .25 : 0),
            z: .05
        };
        const handRotation = Math.random() * 40 * xUpdate;
        handEl.setAttribute('animation', {
            property: 'opacity',
            delay: 250,
            from: 0,
            to: 1
        });
        handEl.setAttribute('animation__rotation', {
            property: 'rotation',
            to: `0 0 ${Math.random() * 40 * xUpdate + (Math.random() * 1)}`,
            dir: 'alternate',
            dur: 250 + (Math.random() * 250),
            ease: 'linear',
            loop: true,
        });
        handEl.setAttribute('opacity', '0');
        handEl.setAttribute('position', handPosition);
        handEl.setAttribute('rotation', {
            x: 0,
            y: 0,
            z: handRotation,
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

        const textEl = document.createElement('a-text');
        textEl.setAttribute('align', 'center');
        textEl.setAttribute('opacity', '0');
        textEl.setAttribute('position', {
            x: handPosition.x,
            y: handPosition.y,
            z: handPosition.z + .05,
        });
        textEl.setAttribute('animation__scale', {
            property: 'scale',
            from: '.275 .275 .1',
            to: '.3 .3 .1',
            dir: 'alternate',
            dur: 500,
            easing: 'linear',
            loop: true,
        });
        textEl.setAttribute('value', 'TEST');
        this.el.appendChild(textEl);

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
        this.textEl = textEl;

        setTimeout(() => {
            this.ready = true;
        }, 250);
        //
        // setTimeout(() => {
        //     const playerHand = document.createElement('a-entity');
        //     playerHand.classList.add(this.data.hand === 'left' ? 'right' : 'left');
        //     playerHand.classList.add(this.data.type);
        //
        //     this.el.emit('contact', {
        //         playerHand,
        //         velocity: 5,
        //     });
        // }, 3000);
    },

    update: function() {
        const { distance, distanceDuration } = this.data;

        if (!!distance) {
            this.el.setAttribute('animation', `property: object3D.position.z; to: ${distance}; dur: ${distanceDuration}`);
        }
    },

    tick: function(time, delta) {
        if (!this.data.active || this.contacted) {
            return;
        }

        this.timeLeft-=delta;

        if (this.timeLeft < 0) {
            if (this.worried) {
                this.contacted = true;
                this.data.active = false;

                this.handEl.setAttribute('animation__color', {
                    property: 'material.color',
                    to: '#f00',
                    dur: 500,
                    easing: 'linear'
                });
                this.handEl.setAttribute('animation__position', {
                    property: 'object3D.position.y',
                    to: '0',
                    dur: 2000,
                    easing: 'linear'
                });
                this.textEl.setAttribute('animation__color', {
                    property: 'color',
                    from: '#700',
                    to: '#f00',
                    dur: 1000,
                    easing: 'linear'
                });
                this.textEl.setAttribute('animation__opacity', 'property: opacity; from: 0; to: 1; dur: 250; easing: linear');

                this.faceEl.setAttribute('src', `#sad-${Math.floor(Math.random() * 3) + 1}`);
                this.el.emit('removeFanboy', { emitLaneAvailable: true });

                this.textEl.setAttribute('value', 'Too late!');
            } else {
                this.faceEl.setAttribute('src', `#worried-${Math.floor(Math.random() * 3) + 1}`);
                this.timeLeft = 2000;
                this.worried = true;
            }
        }
    }
});
