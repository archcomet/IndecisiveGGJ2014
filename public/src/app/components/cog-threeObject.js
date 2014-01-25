define([
    'cog'
], function(cog) {

    var THREEObject = cog.Component.extend('cog.THREEObject', {
        eventTarget: 'THREEObject'
    }, {
        defaults: {
            mesh: null
        }
    });

    cog.THREEObject = THREEObject;

    return THREEObject;
});