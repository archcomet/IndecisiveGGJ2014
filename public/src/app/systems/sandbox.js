define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent'

], function(cog, THREE, THREEComponent, SteeringComponent) {

    var SandboxSystem = cog.System.extend('SandboxSystem', {

        configure: function(entities, events) {
            this.createWalls(entities, events);
        },

        createWalls: function(entities, events) {

            var horizontalWall = new THREE.CubeGeometry(8000, 100, 100),
                verticalWall = new THREE.CubeGeometry(100, 5200, 100);

            var wallMaterial = new THREE.MeshPhongMaterial({
                ambient: 0xff0000,
                color: 0xff0000,
                shininess: 50
            });

            this.createWallEntity(entities, events, horizontalWall, wallMaterial, 0, 2550, 0);
            this.createWallEntity(entities, events, horizontalWall, wallMaterial, 0, -2550, 0);

            this.createWallEntity(entities, events, verticalWall, wallMaterial, 4050, 0, 0);
            this.createWallEntity(entities, events, verticalWall, wallMaterial, -4050, 0, 0);

        },

        createWallEntity: function(entities, events, geometry, material, x, y, z) {

            var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);


            var wallEntity = entities.add('wall');
                wallEntity.components.assign(THREEComponent, {  mesh: mesh });

            events.emit('addToScene', wallEntity);
        }


    });

    cog.SandboxSystem = SandboxSystem;

    return SandboxSystem;

});