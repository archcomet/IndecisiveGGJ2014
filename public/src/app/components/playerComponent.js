define([
    'cog',
    'three'
], function(cog, THREE) {

    var PlayerComponent = cog.Component.extend('PlayerComponent', {

        defaults: {
            length: 200
        }

    });

    cog.PlayerComponent = PlayerComponent;

    return PlayerComponent;
});