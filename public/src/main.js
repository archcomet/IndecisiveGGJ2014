(function() {
    'use strict';

    require.config({
        paths: {
            'cog': 'libs/cog',
            'box2d': 'libs/Box2dWeb-2.1.a.3',
            'three': 'libs/three',
            'systems': 'app/systems',
            'components': 'app/components',
            'jquery': 'libs/jquery.min'

        },

        shim: {
            'box2d': { exports: 'Box2D' },
            'three': { exports: 'THREE' }        }
    });

    require([
        'cog',
        'systems/threeSystem',
        'systems/steeringSystem',
        'systems/sandbox',
        'systems/prompt'

    ], function(cog, ThreeSystem, SteeringSystem, SandboxSystem, prompt) {

        var game = cog.createDirector({
            fixedDt: false
        });

        game.systems.add(ThreeSystem);
        game.systems.add(SteeringSystem);
        game.systems.add(SandboxSystem);
        game.systems.add(prompt);

        game.start();

        window.game = game;
    });

}());