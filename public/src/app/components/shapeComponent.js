define([
    'cog'

], function(cog) {

    var ShapeComponent = cog.Component.extend('ShapeComponent', {

        TYPE_SQUARE: 0,
        TYPE_CIRCLE: 1,
        TYPE_TRIANGLE: 2

    },{

        defaults: {
            needsUpdate: false,
            geometryType: 0,
            squareGeometry: null,
            triangleGeometry: null,
            circleGeometry: null
        }
    });

    cog.ShapeComponent = ShapeComponent;

    return ShapeComponent;
});