define([
    'cog',
    'box2d'
], function(cog, Box2D) {

    //http://www.iforce2d.net/embox2d/testbed.html

    var Box2DSystem = cog.System.extend({

        properties: {
            world: {
                value: null,
                writable: true
            },
            gravity: {
                value: null,
                writable: true
            },
            velocityIterations: {
                value: 3,
                writable: true
            },
            positionIterations: {
                value: 2,
                writable: true
            }

        },

        configure: function() {
            this.gravity = new Box2D.b2Vec2(0.0, -10.0);
            this.world = new Box2D.b2World(this.gravity);
        },

        update: function(entities, events, dt) {

            this.world.Step(dt/1000, this.velocityIterations, this.positionIterations);

            var position, body = this.world.GetBodyList();

            while(body.a !== 0) {

                if (body.userData && body.userData.position) {
                    position = body.GetPosition();
                    body.userData.position.set(
                        position.get_x() * 100,
                        position.get_y() * 100,
                        0
                    );
                }

                body = body.GetNext();
            }
        },

        'Box2dObject assigned event': function(component) {
            component.body = this.world.CreateBody(component.bodyDef);
            component.body.CreateFixture(component.shape, component.density);
        }

    });

    cog.Box2DSystem = Box2DSystem;

    return Box2DSystem;
});