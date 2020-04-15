AFRAME.registerComponent('button-start', {
    schema: {
        fanboyCircle: { type: 'selector', default: '[fanboy-circle]' },
        game: { type: 'selector', default: '[game]' },
        titleScreen: { type: 'selector', default: '[title-screen' },
    },

    events: {
        click: function() {
            const { fanboyCircle, game, titleScreen } = this.data;

            fanboyCircle.setAttribute('fanboy-circle', 'enabled', false);
            game.setAttribute('game', 'enabled', true);
            titleScreen.setAttribute('title-screen', 'visible', false);
        }
    }
});
