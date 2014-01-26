define([
    'cog',
    'three'
], function(cog, THREE) {

    var EnemyAIComponent = cog.Component.extend('EnemyAIComponent', {

        AI_NONE: 0,
        AI_FLEE_CORNER: 1,
        AI_FLEE_PLAYER: 2,
        AI_SEEK_PLAYER: 3,

        SHAPE_SQUARE: 0,
        SHAPE_CIRCLE: 1,
        SHAPE_TRIANGLE: 2

    },{

        defaults: {
            state: 0,
            shape: 0,
            wallFleeRange: 1000,
            wallFleeTrigger: 500
        }

    });




    cog.EnemyComponent = EnemyAIComponent;

    return EnemyAIComponent;
});