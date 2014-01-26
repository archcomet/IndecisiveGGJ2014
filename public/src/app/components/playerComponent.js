define([
    'cog',
    'three'
], function(cog, THREE) {

    var PlayerComponent = cog.Component.extend('PlayerComponent', {

        defaults: {

        }

    });

    cog.PlayerComponent = PlayerComponent;

    return PlayerComponent;
});