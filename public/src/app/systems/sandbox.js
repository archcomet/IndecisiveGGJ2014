define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent'

], function(cog, THREE, THREEComponent, SteeringComponent) {

    var SandboxSystem = cog.System.extend('SandboxSystem', {

        configure: function(entities, events) {

            this.createWalls(entities, events);

            var length = 100, cube, material;

            cube = new THREE.CubeGeometry(length, length, length);

            material = new THREE.MeshPhongMaterial({
                ambient: 0x333333,
                color: 0xffffff,
                shininess: 50
            });

            var box, mesh,
                x = new THREE.Vector3(-750, 75, 0),
                y = new THREE.Vector3(),
                dx = new THREE.Vector3(56.25, 125),
                dy = new THREE.Vector3(112.5, 0.0);

            for (var i = 0; i < 15; ++i) {
                y.copy(x);

                for (var j = i; j < 15; ++j) {

                    mesh = new THREE.Mesh(cube, material);
                    mesh.position.copy(y);

                    box = entities.add('box');
                    box.components.assign(THREEComponent, {
                        mesh: mesh
                    });

                    box.components.assign(SteeringComponent, {
                        behavior: 'flee',
                        target: {
                            x: 0,
                            y: 500,
                            z: 0
                        }
                    });

                    events.emit('addToScene', box);

                    y.add(dy);
                }

                x.add(dx);
            }
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