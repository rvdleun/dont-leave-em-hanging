AFRAME.registerSystem('score', {
    score: 0,
    scoreString: '000000',
    scores: [],

    register: function(score) {
        this.scores.push(score);
        this.showScore(score);
    },

    setScore: function(score, animate) {
        this.score = Math.max(0, score);
        this.scoreString = score.toString().padStart(6, '0');
        this.showScores(animate);
    },

    addToScore: function(diff, animate) {
        this.setScore(this.score + diff, animate);
    },

    showScores(animate) {
        this.scores.forEach(score => this.showScore(score, animate));
    },

    showScore(component, animate) {
        component.showScore(this.scoreString, animate);
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
