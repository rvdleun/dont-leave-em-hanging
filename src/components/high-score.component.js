AFRAME.registerComponent('high-score', {
    schema: {
        duration: { type: 'string' },
        radius: { type: 'string' },
    },

    events: {
        updateHighScore: function(e) {
            const key = this.generateKey();
            if (!key) {
                return;
            }

            const { score } = e.detail;
            const highScore = window.localStorage.getItem(key);

            if (highScore && parseInt(highScore) > score) {
                return;
            }

            window.localStorage.setItem(key, score);
            this.update();
        }
    },

    STORAGE_KEY: 'dleh.high-score',

    update: function() {
        const key = this.generateKey();
        if (!key) {
            return;
        }

        let score = window.localStorage.getItem(key);
        if (!score) {
            score = '0';
        }

        this.el.setAttribute('value', `High score: ${score.padStart(6, '0')}`);
    },

    generateKey: function() {
        const { duration, radius } = this.data;

        if (!duration || !radius) {
            return null;
        }

        return `${this.STORAGE_KEY}-${duration}-${radius}`;
    }
});
