define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'geometry/wallhorizontalgeometry',
    'geometry/wallverticalgeometry',
    'material/wallmaterial'

], function(cog, THREE, THREEComponent, SteeringComponent, wallHorizontalGeometryData, wallVerticalGeometryData, wallMaterialData) {

    var SandboxSystem = cog.System.extend('SandboxSystem', {

        configure: function(entities, events) {
            this.createWalls(entities, events);
        },

        createWalls: function(entities, events) {

            this.createWallEntity(entities, events, wallHorizontalGeometryData, wallMaterialData, 0, 2550, 0);
            this.createWallEntity(entities, events, wallHorizontalGeometryData, wallMaterialData, 0, -2550, 0);

            this.createWallEntity(entities, events, wallVerticalGeometryData, wallMaterialData, 4050, 0, 0);
            this.createWallEntity(entities, events, wallVerticalGeometryData, wallMaterialData, -4050, 0, 0);

        },

        createWallEntity: function(entities, events, geometryData, materialData, x, y, z) {

            var wallEntity = entities.add('wall');

            var wallComponent = wallEntity.components.assign(THREEComponent, { geometryData: geometryData,
                                                                                materialData: materialData });

            wallComponent.mesh.position.set(x, y, z);

            events.emit('addToScene', wallEntity);
        }
    });

    cog.SandboxSystem = SandboxSystem;

    return SandboxSystem;

});