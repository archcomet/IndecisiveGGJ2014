define([
    'cog'
], function(cog) {

    var THREEComponent = cog.Component.extend('cog.THREEComponent', {
        eventTarget: 'THREEComponent'
    }, {
        defaults: {
            mesh: null,
            spawnPosition: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    });

    cog.THREEComponent = THREEComponent;

    return THREEComponent;
});