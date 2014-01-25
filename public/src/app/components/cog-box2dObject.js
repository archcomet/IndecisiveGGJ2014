define([
    'cog'
], function(cog) {

    var Box2dObject = cog.Component.extend('cog.Box2dObject', {
        eventTarget: 'Box2dObject'
    }, {
        defaults: {
            body: null,
            bodyDef: null,
            shape: null,
            density: 0
        }
    });

    cog.Box2dObject = Box2dObject;

    return Box2dObject;
});