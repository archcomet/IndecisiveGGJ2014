define([
    'cog',
    'three'
], function(cog, THREE) {

    var EnemyComponent = cog.Component.extend('EnemyComponent', {
    });

    cog.EnemyComponent = EnemyComponent;

    return EnemyComponent;
});