AFRAME.registerComponent('tutorial', {
    steps: [
        { hand: 'right', type: 'hand' },
        { hand: 'left', type: 'hand' },
        { hand: 'right', type: 'fist' },
        { hand: 'left', type: 'fist' },
    ],

    events: {
        contact: function(e) {
            if (!this.active) {
                return;
            }

            const step = this.getCurrentStep();
            const { approved, rightHand, rightType, rightVelocity } = this.el.sceneEl.systems['fanboy'].analyzeContact(e, step);

            if (!rightHand) {
                this.showText('Use your other hand.', '#f00');
            } else if(!rightType) {
                this.showText(`Perform a ${step.type === 'hand' ? 'high five' : 'fist bump'}.`, '#f00');
            } else if(!rightVelocity) {
                this.showText(`Use ${step.type === 'hand' ? 'more' : 'less'} force.`, '#f00');
            } else {
                this.showText(this.el.sceneEl.systems['fanboy'].getApprovalText(), '#0f0');
                this.nextStep();
            }

            if (approved) {
                this.teacher.emit('playReactionSound', {
                    id: 'approved',
                    no: 9
                });
            } else {
                this.teacher.emit('playReactionSound', {
                    id: 'not-approved',
                    no: 5
                });
            }

            this.active = false;
            setTimeout(() => {
                this.active = true;
            }, 500);
        }
    },

    init: function() {
        const teacher = document.createElement('a-entity');
        teacher.setAttribute('fanboy', {
            canContact: false,
        });
        this.el.appendChild(teacher);
        this.teacher = teacher;

        const text = document.createElement('a-text');
        text.setAttribute('align', 'center');
        text.setAttribute('font', 'mozillavr');
        text.setAttribute('position', {
            x: 0,
            y: -.25,
            z: -.75,
        });
        text.setAttribute('animation__scale', {
            property: 'scale',
            from: '.45 .45 .1',
            to: '.525 .525 .1',
            dir: 'alternate',
            dur: 500,
            easing: 'linear',
            loop: true,
        });
        this.el.appendChild(text);
        this.text = text;

        this.active = true;
        this.currentStep = 0;
        this.showStep();
    },

    getCurrentStep: function() {
        return this.steps[this.currentStep];
    },

    nextStep: function() {
        this.currentStep++;
        if (this.currentStep >= this.steps.length) {
            this.currentStep = 0;
        }

        this.showStep();
    },

    showStep: function() {
        const step = this.getCurrentStep();
        console.log('step', step);
        this.teacher.setAttribute('fanboy', step);
    },

    showText: function(text, color) {
        console.log('Showing text', text, color);

        this.text.setAttribute('color', color);
        this.text.setAttribute('value', text);

        clearTimeout(this.textTimeout);
        this.textTimeout = setTimeout(() => {
            console.log('Clearing text');
            this.text.setAttribute('value', '');
        }, 3000)
    }
});
