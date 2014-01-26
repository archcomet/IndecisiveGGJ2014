define([
    'cog'

], function(cog) {

    var ShapeComponent = cog.Component.extend('ShapeComponent', {

        TYPE_PREY: 1,
        TYPE_PREDATOR: 2,
        TYPE_SQUARE: 3,
        TYPE_TRIANGLE: 4,
        TYPE_CIRCLE: 5

    },{

        defaults: {
            needsUpdate: false,
            materialType: 0,
            preyMaterial: null,
            predatorMaterial: null,
            squareMaterial: null,
            triangleMaterial: null,
            circleMaterial: null
        }
    });

    cog.ShapeComponent = ShapeComponent;

    return ShapeComponent;
});