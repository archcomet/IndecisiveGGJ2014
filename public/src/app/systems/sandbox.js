define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent'

], function(cog, THREE, THREEComponent, SteeringComponent) {

    var SandboxSystem = cog.System.extend('SandboxSystem', {

        configure: function(entities, events) {

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
        }

    });

    cog.SandboxSystem = SandboxSystem;

    return SandboxSystem;

});