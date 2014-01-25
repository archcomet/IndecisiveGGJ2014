define([
    'cog',
    'three',
    'box2d',
    'components/cog-threeObject',
    'components/cog-box2dObject'

], function(cog, THREE, Box2D, THREEObject, Box2DObject) {

    var PyramidSystem = cog.System.extend('sandbox.Pyramid', {

        configure: function(entities, events, config) {

            var length = 100,
                bodyDef, shape, cube, material;

            // Physics defs for ground
            bodyDef = new Box2D.b2BodyDef();

            shape = new Box2D.b2EdgeShape();
            shape.Set(new Box2D.b2Vec2(-40, 0.0), new Box2D.b2Vec2(40.0, 0.0));

            // Create ground entity
            var ground = entities.add('ground');
            ground.components.assign(Box2DObject, {
                bodyDef: bodyDef,
                shape: shape
            });


            // Shape for cubes
            cube = new THREE.CubeGeometry(length, length, length);

            material = new THREE.MeshPhongMaterial({
                ambient: 0x333333,
                color: 0xffffff,
                shininess: 50
            });

            // Phsyics defs for cubes
            bodyDef = new Box2D.b2BodyDef();
            bodyDef.set_type( Box2D.b2_dynamicBody );

            shape = new Box2D.b2PolygonShape();
            shape.SetAsBox((length/100)/2, (length/100)/2);


            var box, mesh,
                x = new THREE.Vector3(-750, 75),
                y = new THREE.Vector3(),
                dx = new THREE.Vector3(56.25, 125),
                dy = new THREE.Vector3(112.5, 0.0);

            for (var i = 0; i <15; ++i) {
                y.copy(x);

                for (var j = i; j < 15; ++j) {

                    mesh = new THREE.Mesh(cube, material);
                    mesh.position.copy(y);

                    bodyDef.set_position(new Box2D.b2Vec2(y.x / 100, y.y / 100));

                    box = entities.add('pyramidBox');
                    box.components.assign(THREEObject, {
                        mesh: mesh
                    });
                    box.components.assign(Box2DObject, {
                        bodyDef: bodyDef,
                        shape: shape,
                        density: 5.0
                    });

                    box.components(Box2DObject).body.userData = mesh;

                    events.emit('addToScene', box);

                    y.add(dy);
                }

                x.add(dx);
            }
        }

    });

    cog.PyramidSystem = PyramidSystem;

    return PyramidSystem;

});