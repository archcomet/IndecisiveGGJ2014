define([
    'cog'

], function(cog) {

    var ShapeComponent = cog.Component.extend('ShapeComponent', {

        TYPE_PREY: 1,
        TYPE_PREDATOR: 2

    },{

        defaults: {
            needsUpdate: false,
            materialType: 0,
            preyMaterial: null,
            predatorMaterial: null
        }
    });

    cog.ShapeComponent = ShapeComponent;

    return ShapeComponent;
});