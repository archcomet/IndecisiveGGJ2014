define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/playerComponent',
    'components/enemyAIComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, PlayerComponent, EnemyAIComponent) {

    var PlayerSystem = cog.Factory.extend('PlayerSystem', {

        entityTag: 'Player',

        components: {
            object3d: {
                constructor: THREEComponent
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
            player: null
        },

        spawn: function(config) {

            var entity = this._super(config),
                length = entity.components(PlayerComponent).length;

            var geometry = new THREE.CubeGeometry(length, length, length),
                material = new THREE.MeshPhongMaterial({
                        ambient: 0x333333,
                        color: 0x00ff00,
                        shininess: 100
                    });

            entity.components(THREEComponent).mesh = new THREE.Mesh(geometry, material);

            return entity;
        },

        configure: function(entities, events) {

            var entity = this.spawn(),
                steeringComponent = entity.components(SteeringComponent);

            steeringComponent.behavior = 'seek';
            steeringComponent.target.x = 0;
            steeringComponent.target.y = 0;

            this.player = entity;

            events.emit('addToScene', entity);
            events.emit('playSound', 'square');
        },

        update: function(entities, events) {
            var enemyPosition,
                enemies = entities.withComponents(EnemyAIComponent),
                playerPosition = this.player.components(THREEComponent).mesh.position,
                i = 0,
                n = enemies.length;

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
        },

        handleCollision: function(enemy) {

        },

        updateEvents: function(playerPosition, events) {
            // send events at doors
            if(playerPosition.y > -500 && playerPosition.y < 500) {
                if(playerPosition.x === 4000) {
                    events.emit("door", "right");
                    playerPosition.x = -3990;
                } else if(playerPosition.x === -4000) {
                    events.emit("door", "left");
                    playerPosition.x = 3990;
                }
            } else if(playerPosition.x > -500 && playerPosition.x < 500) {
                if(playerPosition.y === 2500) {
                    events.emit("door", "down");
                    playerPosition.y = -2490;
                } else if(playerPosition.y === -2500) {
                    events.emit("door", "up");
                    playerPosition.y = 2490;
                }
            }
        },

        'playerSeekDirection event': function(dx, dy) {
            var pos = this.player.components(THREEComponent).mesh.position,
                steering = this.player.components(SteeringComponent);

            steering.behavior = 'seek';
            steering.target.x = pos.x + dx * 50;
            steering.target.y = pos.y + dy * 50;
        },

        'playerStop event': function() {

            var steering = this.player.components(SteeringComponent);
            steering.behavior = undefined;
        }
    });

    cog.SandboxSystem = PlayerSystem;

    return PlayerSystem;

});