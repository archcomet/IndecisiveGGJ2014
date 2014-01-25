(function() {
    'use strict';

    require.config({
        paths: {
            'cog': 'libs/cog',
            'box2d': 'libs/box2d',
            'three': 'libs/three',
            'systems': 'app/systems',
            'components': 'app/components'
        },

        shim: {
            'box2d': { exports: 'Box2D' },
            'three': { exports: 'THREE' }
        }
    });

    require([
        'cog',
        'systems/cog-box2d',
        'systems/cog-three',
        'systems/sandbox-pyramid'

    ], function(cog, Box2DSystem, THREESystem, PyradmidSystem) {

        var game = cog.createDirector({
            fixedDt: true
        });

        game.systems.add(Box2DSystem);
        game.systems.add(THREESystem);
        game.systems.add(PyradmidSystem);


        game.start();

        window.game = game;
    });

}());