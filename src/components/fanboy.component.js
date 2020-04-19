AFRAME.registerSystem('fanboy', {
    approvedText: ['YEAH!', 'WOO!', 'NICE!', 'COOL!', 'AWESOME!'],

    analyzeContact: function(e, data) {
        const { playerHand, velocity } = e.detail;
        const rightHand = !playerHand.classList.contains(data.hand);
        const rightType = playerHand.classList.contains(data.type);
        const rightVelocity =
            (data.type === 'hand' && velocity > .2) ||
            (data.type === 'fist' && velocity < .2);
        const approved = rightHand && rightType && rightVelocity;

        return { approved, rightHand, rightType, rightVelocity };
    },

    getApprovalText: function() {
        return this.approvedText[Math.floor(Math.random() * this.approvedText.length)];
    }
});

AFRAME.registerComponent('fanboy', {
    schema: {
        active: { type: 'boolean', default: false },
        canContact: { type: 'boolean', default: true },
        debugContact: { type: 'boolean', default: false },
        debugContactApproved: { type: 'boolean', default: false },
        distance: { type: 'number', default: 0 },
        distanceDuration: { type: 'number', default: 5000 },
        hand: { type: 'string', default: 'right' },
        hasSound: { type: 'boolean', default: true },
        lane: { type: 'number', default: -1 },
        type: { type: 'string', default: 'hand' },
    },

    events: {
        contact: function(e) {
            if (!this.data.canContact || this.contacted || !this.ready) {
                return;
            }

            this.contacted = true;

            const { approved, rightHand, rightType, rightVelocity } = this.system.analyzeContact(e, this.data);
            const { score } = this.el.sceneEl.systems;

            let text = '';
            if (!rightHand) {
                text = 'Wrong hand';
                score.addToScore(rightType && rightVelocity ? 50 : 15, true);
                score.resetModifier();
            } else if (!rightType) {
                text = (this.data.type === 'hand' ? 'High five' : 'Fist bump') + '\nrequested';
                score.addToScore(25, true);
                score.resetModifier();
            } else if(!rightVelocity) {
                text = (this.data.type === 'hand' ? 'Too slow' : 'Too fast');
                score.addToScore(25, true);
                score.resetModifier();
            } else {
                text = this.system.getApprovalText();
                score.addToScore(100, true);
                score.adjustModifier(.25);
            }

            this.handEl.emit('playSound');
            if (approved) {
                this.fadeHand('#0f0', '#0f0', text);
                this.setFace('approved', 5);
                this.playReactionSound('approved', 9);

                this.faceEl.setAttribute('animation__ascend', 'property: object3D.position.y; to: 3; dur: 2000');
            } else {
                this.fadeHand('#f00', '#f00', text);
                this.setFace('not-approved', 3);
                this.playReactionSound('not-approved', 5);
            }

            setTimeout(() => {
                this.el.emit('removeFanboy', { emitLaneAvailable: true });
            }, approved ? 0 : 1000);
        },

        fadeHand: function(e) {
            if (this.fadingHand) {
                return;
            }

            this.fadingHand = true;

            const { from, to, text } = e.detail;
            this.fadeHand(from, to, text);
        },

        playReactionSound: function(e) {
            const { id, no } = e.detail;
            this.playReactionSound(id, no);
        },

        removeFanboy: function(e) {
            if (this.removing) {
                return;
            }

            this.removing = true;
            const { lane } = this.data;

            this.faceEl.setAttribute('animation', 'property: components.material.material.opacity; from: 1; to: 0; dur: 1000; easing: linear');
            this.textEl.setAttribute('animation__opacity_gone', 'property: opacity; from: 1; to: 0; dur: 250; delay: 1000; easing: linear');

            setTimeout(() => {
                if (e.detail && e.detail.emitLaneAvailable) {
                    this.el.emit('laneAvailable', { lane }, true);
                }

                this.el.parentNode.parentNode.removeChild(this.el.parentNode);
            }, 1250);
        },

        setFace: function(e) {
            const { id, no } = e.detail;
            this.setFace(id, no);
        },
    },

    init: function() {
        const { debugContact, hasSound, lane } = this.data;
        this.timeLeft = 3000;
        this.ready = false;
        this.worried = false;

        /**
         * Setup face
         */
        const face = document.createElement('a-plane');
        face.setAttribute('animation', {
            property: 'components.material.material.opacity',
            from: 0,
            to: 1
        });
        face.setAttribute('animation__position', {
            property: 'object3D.position.y',
            to: .25 + (Math.random() * .1),
            dir: 'alternate',
            dur: 250 + (Math.random() * 250),
            loop: true,
        });
        face.setAttribute('material', {
            alphaTest: .5,
            shader: 'flat',
        });
        face.setAttribute('position', '0 .2 0');
        face.setAttribute('scale', '.25 .25 .25');
        face.setAttribute('transparent', 'true');

        if (hasSound) {
            face.setAttribute('sound', {
                on: 'playSound',
                volume: .666,
            });
        }

        this.el.appendChild(face);

        /**
         * Setup hand
         */
        const handEl = document.createElement('a-plane');
        handEl.setAttribute('opacity', '0');
        handEl.setAttribute('transparent', 'false');

        if (hasSound) {
            handEl.setAttribute('sound', {
                on: 'playSound',
                src: `#high-five-${Math.floor(Math.random() * 3) + 1}`,
                volume: 1,
            });
        }

        this.el.appendChild(handEl);

        const textEl = document.createElement('a-text');
        textEl.setAttribute('align', 'center');
        textEl.setAttribute('font', 'mozillavr');
        textEl.setAttribute('opacity', '1');
        textEl.setAttribute('animation__scale', {
            property: 'scale',
            from: '.225 .225 .1',
            to: '.275 .275 .1',
            dir: 'alternate',
            dur: 500,
            easing: 'linear',
            loop: true,
        });
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

        this.setupHand();

        if (Math.random() <= .005) {
            face.setAttribute('src', `#waiting-vincent`);
        } else {
            this.setFace('waiting', 3);
        }

        setTimeout(() => {
            this.ready = true;
        }, 250);

        if (debugContact) {
            this.setupDebugContact();
        }
    },

    update: function(oldData) {
        const { distance, distanceDuration, hand, type } = this.data;

        if (!!distance) {
            this.el.setAttribute('animation', `property: object3D.position.z; to: ${distance}; dur: ${distanceDuration}`);
        }

        if (oldData.hand !== hand || oldData.type !== type) {
            this.setupHand();
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

                this.fadeHand('#700', '#F00', 'Too late!');
                this.setFace('sad', 3);
                this.playReactionSound('sad', 5);
                this.el.emit('removeFanboy', { emitLaneAvailable: true });
                this.el.sceneEl.systems.score.addToScore(-500);
                this.el.sceneEl.systems.score.resetModifier();
            } else {
                this.setFace('worried', 3);
                this.playReactionSound('worried', 6);
                this.timeLeft = 2000;
                this.worried = true;
            }
        }
    },

    fadeHand: function(from, to, text) {
        this.handEl.setAttribute('animation__color', {
            property: 'components.material.material.color',
            to,
            dur: 500,
            easing: 'linear',
            type: 'color'
        });
        this.handEl.setAttribute('animation__position', {
            property: 'object3D.position.y',
            to: '0',
            dur: 2000,
            easing: 'linear'
        });
        this.textEl.setAttribute('animation__color', {
            property: 'color',
            from,
            to,
            dur: 1000,
            easing: 'linear',
            type: 'color'
        });
        this.textEl.setAttribute('animation__opacity', 'property: opacity; from: 0; to: 1; dur: 250; easing: linear');
        this.handEl.setAttribute('animation', 'property: components.material.material.opacity; from: 1; to: 0; dur: 300; easing: linear');

        this.textEl.setAttribute('value', text);
    },

    playReactionSound: function(id, no) {
        this.faceEl.setAttribute('sound', 'src', `#reaction-${id}-${Math.floor(Math.random() * no) + 1}`);
        this.faceEl.emit('playSound');
    },

    setFace: function(id, no) {
        this.faceEl.setAttribute('src', `#${id}-${Math.floor(Math.random() * no) + 1}`);
    },

    setupDebugContact: function() {
        const { debugContactApproved } = this.data;
        setTimeout(() => {
            const playerHand = document.createElement('a-entity');
            playerHand.classList.add(this.data.hand === 'left' ? 'right' : 'left');
            playerHand.classList.add(debugContactApproved ? this.data.type : `not-` + this.data.type);

            this.el.emit('contact', {
                playerHand,
                velocity: 5,
            });
        }, 3000);
    },

    setupHand: function() {
        const { hand, type } = this.data;
        const { handEl, textEl } = this;

        const xUpdate = hand === 'left' ? -1 : 1;
        const handPosition = {
            x: (.1 + (Math.random() / 10)) * -xUpdate,
            y: .1 + (type === 'hand' ? .25 : 0),
            z: .05
        };
        const handRotation = Math.random() * 40 * xUpdate;
        handEl.setAttribute('animation', {
            property: 'components.material.material.opacity',
            dur: Math.floor(Math.random() * 100) + 1000,
            to: 1
        });
        handEl.setAttribute('animation__rotation', {
            property: 'object3D.rotation.z',
            to: Math.random() * 40 * xUpdate + (Math.random() * 1),
            dir: 'alternate',
            dur: 250 + (Math.random() * 250),
            loop: true,
        });
        handEl.setAttribute('material', {
            alphaTest: .5,
            shader: 'flat',
        });
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
        handEl.setAttribute('src', `#${type}`);

        textEl.setAttribute('position', {
            x: handPosition.x,
            y: handPosition.y,
            z: handPosition.z + .05,
        });
        textEl.setAttribute('rotation', {
            x: 0,
            y: 0,
            z: -30 + (Math.random() * 60),
        });
    }
});
