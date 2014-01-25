define([
    'cog'
], function(cog) {

    var THREEComponent = cog.Component.extend('cog.THREEComponent', {
        eventTarget: 'THREEComponent'
    }, {
        defaults: {
            mesh: null
        }
    });

    cog.THREEComponent = THREEComponent;

    return THREEComponent;
});