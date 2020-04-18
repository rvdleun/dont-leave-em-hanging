AFRAME.registerComponent('button', {
    schema: {
        backgroundColor: { type: 'string', default: '#000' },
        color: { type: 'string', default: '#fff' },
        text: { type: 'string', default: 'No text' },
    },

    events: {
        mouseenter: function() {
            this.fadeColorTo('#ffdc31');
            this.hovering = true;
        },
        mouseleave: function() {
            this.fadeColorTo(this.data.color);
            this.hovering = false;
        }
    },

    init: function() {
        this.hovering = false;

        const { backgroundColor, color, text } = this.data;

        const backgroundPlaneEl = document.createElement('a-plane');
        backgroundPlaneEl.setAttribute('color', backgroundColor);
        backgroundPlaneEl.setAttribute('data-raycastable', '');
        backgroundPlaneEl.setAttribute('position', '0 0 .1');
        backgroundPlaneEl.setAttribute('scale', '2.5 1 1');

        const borderPlaneEl = document.createElement('a-plane');
        borderPlaneEl.setAttribute('color', color);
        borderPlaneEl.setAttribute('position', '0 0 -.1');
        borderPlaneEl.setAttribute('scale', '2.75 1.1 1.1');
        this.el.appendChild(borderPlaneEl);

        const textEl = document.createElement('a-text');
        textEl.setAttribute('align', 'center');
        textEl.setAttribute('color', color);
        textEl.setAttribute('font', 'mozillavr');
        textEl.setAttribute('position', '0 0.2 .1');
        textEl.setAttribute('scale', '2 2 2');
        textEl.setAttribute('value', text);
        this.el.appendChild(textEl);

        this.el.appendChild(backgroundPlaneEl);

        this.borderPlaneEl = borderPlaneEl;
        this.textEl = textEl;

        document.querySelectorAll('[hand-controls]').forEach(handControls => {
            handControls.addEventListener('triggerdown', () => {
                if (this.hovering) {
                    this.fadeColorTo(this.data.color);
                    this.el.emit('click');
                }
            });
        });
    },

    fadeColorTo: function(color) {
        const animation = {
            dur: 250,
            easing: 'linear',
            to: color,
            type: 'color'
        };
        this.borderPlaneEl.setAttribute('animation', {
            ...animation,
            property: 'components.material.material.color',
        });
        this.textEl.setAttribute('animation', {
            ...animation,
            property: 'color'
        });
    }
});
