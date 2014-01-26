define([
    'cog',
    'three'
], function(cog, THREE) {

    var EnemyAIComponent = cog.Component.extend('EnemyAIComponent', {

        AI_NONE: 0,
        AI_FLEE_CORNER: 1,
        AI_FLEE_PLAYER: 2,
        AI_SEEK_PLAYER: 3

    },{

        defaults: {
            state: 0
        }

    });

    cog.EnemyComponent = EnemyAIComponent;

    return EnemyAIComponent;
});