define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/playerComponent',
    'components/enemyAIComponent',
    'components/shapeComponent',
    'components/materialComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, PlayerComponent, EnemyAIComponent, ShapeComponent, MaterialComponent) {

    var CUBE_GEO = new THREE.CubeGeometry(200, 200, 200);

    var SPHERE_GEO = new THREE.SphereGeometry(150);

    var TETRAHEDRON_GEO = new THREE.TetrahedronGeometry(200);

    var MATERIAL = new THREE.MeshPhongMaterial({
        ambient: 0x333333,
        color: 0x00ff00,
        emissive: 0xaaaaaa,
        shininess: 100
    });

    var PlayerSystem = cog.Factory.extend('PlayerSystem', {

        entityTag: 'Player',

        components: {
            object3d: {
                constructor: THREEComponent
            },
            material: {
                constructor: MaterialComponent,
                defaults: {
                    materialType: MaterialComponent.TYPE_PREY,
                    preyMaterial: MATERIAL,
                    needsUpdate: true
                }
            },
            shape: {
                constructor: ShapeComponent,
                defaults: {
                    squareGeometry: CUBE_GEO,
                    triangleGeometry: TETRAHEDRON_GEO,
                    circleGeometry: SPHERE_GEO,
                    needsUpdate: true
                }
            },

            steering: {
                constructor: SteeringComponent,
                defaults: {
                    maxSpeed: 20,
                    maxAcceleration: 3,
                    avoidCorners: false
                }
            },
            player: {
                constructor: PlayerComponent
            }
        },

        defaults: {
            player: null,
            currentShape: null,
            inputShape: null
        },

        configure: function(entities, events) {

            var entity = this.spawn(),
                steeringComponent = entity.components(SteeringComponent);

            steeringComponent.behavior = 'seek';
            steeringComponent.target.x = 0;
            steeringComponent.target.y = 0;

            this.events = events;
            this.player = entity;
        },

        update: function(entities, events) {
            var enemyPosition,
                enemies = entities.withComponents(EnemyAIComponent),
                playerPosition = this.player.components(THREEComponent).mesh.position,
                playerSteering = this.player.components(SteeringComponent),
                i = 0,
                n = enemies.length;

            this.events = events;

            var enemyOffset = new THREE.Vector3(),
                enemyOffsetLength;

            for(; i < n; ++i) {
                enemyPosition = enemies[i].components(THREEComponent).mesh.position;

                enemyOffset.copy(enemyPosition);
                enemyOffset.sub(playerPosition);

                enemyOffsetLength = enemyOffset.length();

                if (enemyOffsetLength < 200) {
                    this.handleCollision(enemies[i]);
                    events.emit('enemyCollisionEvent', enemies[i], this.player);
                }
            }

            this.updateEvents(playerPosition, events);

            if (this.direction) {
                playerSteering.behavior = 'seek';
                playerSteering.target.x = playerPosition.x + this.direction.dx * 50;
                playerSteering.target.y = playerPosition.y + this.direction.dy * 50;

            } else {
                playerSteering.behavior = undefined;
            }

            this.direction = null;
        },

        handleCollision: function(enemy) {

            var enemyPosition = enemy.components(THREEComponent).mesh.position,
                enemyGeometry = enemy.components(ShapeComponent).geometryType,
                playerGeometry = this.player.components(ShapeComponent).geometryType;

            if (enemyGeometry === playerGeometry) {
                this.events.emit('playSound', 'shape_appear');
                this.events.emit('goodCollision', enemyPosition);

            } else {

                this.events.emit('playSound', 'shape_disappear');
                this.events.emit('badCollision', enemyPosition);
            }

            this.events.emit('despawn Enemy', enemy);
        },

        updateEvents: function(playerPosition, events) {
            // send events at doors
            if(playerPosition.y > -500 && playerPosition.y < 500) {
                if(playerPosition.x === 4000) {
                    events.emit("door", "right", events);
                    playerPosition.x = -3990;
                } else if(playerPosition.x === -4000) {
                    events.emit("door", "left", events);
                    playerPosition.x = 3990;
                }
            } else if(playerPosition.x > -500 && playerPosition.x < 500) {
                if(playerPosition.y === 2500) {
                    events.emit("door", "down", events);
                    playerPosition.y = -2490;
                } else if(playerPosition.y === -2500) {
                    events.emit("door", "up", events);
                    playerPosition.y = 2490;
                }
            }
        },

        'playerSeekDirection event': function(dx, dy) {
            this.direction = {
                dx: dx,
                dy: dy
            };
        },

        'playerChangeShape event': function(geometryType) {
            if (this.currentShape !== geometryType) {
                var shape = this.player.components(ShapeComponent);

                shape.geometryType = geometryType;
                shape.needsUpdate = true;

                switch(geometryType) {
                    case ShapeComponent.TYPE_SQUARE:
                        this.events.emit('unmuteSound', 'square');
                        this.events.emit('muteSound', 'triangle');
                        this.events.emit('muteSound', 'mystery');
                        break;
                    case ShapeComponent.TYPE_TRIANGLE:
                        this.events.emit('unmuteSound', 'triangle');
                        this.events.emit('muteSound', 'square');
                        this.events.emit('muteSound', 'mystery');
                        break;
                    case ShapeComponent.TYPE_CIRCLE:
                        this.events.emit('unmuteSound', 'mystery');
                        this.events.emit('muteSound', 'square');
                        this.events.emit('muteSound', 'triangle');
                        break;
                }

                this.currentShape = geometryType;
            }
        }
    });

    cog.SandboxSystem = PlayerSystem;

    return PlayerSystem;

});