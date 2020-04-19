AFRAME.registerSystem('score', {
    modifier: 1,
    score: 0,
    scoreString: '0000000',
    scores: [],

    register: function(score) {
        this.scores.push(score);
        this.showScore(score);
    },

    setScore: function(score, animate) {
        this.score = Math.max(0, score);
        this.scoreString = this.score.toString().padStart(7, '0');
        this.showScores(animate);
    },

    addToScore: function(diff, animate) {
        this.setScore(this.score + (diff * Math.floor(this.modifier)), animate);
    },

    showScores(animate) {
        this.scores.forEach(score => this.showScore(score, animate));
    },

    showScore(component, animate) {
        component.showScore(`${this.scoreString} (${Math.floor(this.modifier).toString()}X)`, animate);
    },

    adjustModifier: function(diff) {
        this.modifier = Math.min(4, Math.max(1, this.modifier + diff));
        this.showScores();
    },

    resetModifier: function() {
        this.modifier = 1;
        this.showScores();
    }
});

AFRAME.registerComponent('score', {
    init: function() {
        this.system.register(this);
    },

    showScore: function(score, animate) {
        this.el.setAttribute('text', 'value', score);

        if (animate) {
            this.el.setAttribute('animation', {
                property: 'object3D.scale.x',
                dur: 250 + Math.random() * 100,
                from: 10.5 + (Math.random() * 2),
                to: 10,
            });
        }
    }
});
