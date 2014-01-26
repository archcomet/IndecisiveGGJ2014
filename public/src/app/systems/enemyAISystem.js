define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/enemyAIComponent',
    'components/materialComponent',
    'components/shapeComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, EnemyAIComponent, MaterialComponent, ShapeComponent) {

    var NEIGHBORHOOD = 400,
        CHASESPEED = 25,
        FLEESPEED = 11;

    var CUBE_GEO = new THREE.CubeGeometry(150, 150, 150);

    var SPHERE_GEO = new THREE.SphereGeometry(100);

    var TETRAHEDRON_GEO = new THREE.TetrahedronGeometry(150);

    var PREY_MAT  = new THREE.MeshLambertMaterial({
        ambient: 0x000033,
        color: 0x0000ff,
        emissive: 0x000033,
        shininess: 50
    });

    var PREDATOR_MAT = new THREE.MeshLambertMaterial({
        ambient: 0x330000,
        color: 0xff0000,
        emissive: 0x000033,
        shininess: 50
    });

    var EnemySystem = cog.Factory.extend('EnemySystem', {

        entityTag: 'Enemy',

        components: {
            object3d: {
                constructor: THREEComponent
            },
            material: {
                constructor: MaterialComponent,
                defaults: {
                    preyMaterial: PREY_MAT,
                    predatorMaterial: PREDATOR_MAT
                }
            },
            shape: {
                constructor: ShapeComponent,
                defaults: {
                    squareGeometry: CUBE_GEO,
                    triangleGeometry: TETRAHEDRON_GEO,
                    circleGeometry: SPHERE_GEO
                }
            },

            steering: {
                constructor: SteeringComponent,
                defaults: {
                    maxSpeed: 11,
                    behavior: 'flee',
                        target: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                }
            },
            enemyAI: {
                constructor: EnemyAIComponent
            }
        },

        defaults: {
            player: null,
            material: null,
            geometry: null
        },


        spawn: function(config) {
            var entity = this._super(config);

            var enemyThree = entity.components(THREEComponent),
                enemySteering = entity.components(SteeringComponent),
                enemyShape = entity.components(ShapeComponent),
                enemyMaterial = entity.components(MaterialComponent);

            enemySteering.maxSpeed *= cog.rand.arc4rand(1.75, 2.25);
            enemySteering.maxAcceleration *= cog.rand.arc4rand(0.75, 1.25);

            enemyShape.geometryType = cog.rand.arc4randInt(0, 2);
            enemyShape.needsUpdate = true;

            enemyThree.spawnPosition = new THREE.Vector3(config.position.x, config.position.y, 0);

            if (this.player.components(ShapeComponent).geometryType === enemyShape.geometryType) {
                enemyMaterial.materialType = MaterialComponent.TYPE_PREY;
                enemyMaterial.needsUpdate = true;
            } else {
                enemyMaterial.materialType = MaterialComponent.TYPE_PREDATOR;
                enemyMaterial.needsUpdate = true;
            }

            return entity;
        },

        configure: function(entities, events) {

            this.events = events;
            this.player = entities.withTag('Player')[0];

            for(var i = 0, n = 20; i < n; ++i) {
                this.spawn({
                    position: {
                        x: cog.rand.arc4rand(-4000, 4000),
                        y: cog.rand.arc4rand(-2500, 2500)
                    }
                })
            }
        },

        update:function() {
            var playerPosition = this.player.components(THREEComponent).mesh.position;
            for (var i = 0, n = this._entities.length; i < n; ++i) {
                this.updateEnemyState(this._entities[i], playerPosition);
            }
        },

        updateEnemyState: function(enemyEntity, playerPosition) {

            var enemyAI = enemyEntity.components(EnemyAIComponent);

            switch(enemyAI.state) {

                case EnemyAIComponent.AI_FLEE_PLAYER:
                    this.handleFleeFromPlayer(enemyEntity, playerPosition);
                    break;

                case EnemyAIComponent.AI_FLEE_CORNER:
                    this.handleFleeFromCorner(enemyEntity, playerPosition);
                    break;

                case EnemyAIComponent.AI_SEEK_PLAYER:
                    this.handleSeekPlayer(enemyEntity, playerPosition);
                    break;

                default:
                    this.handleDefault(enemyEntity);
                    break;
            }
        },

        handleFleeFromPlayer: function(enemyEntity, playerPosition) {

            var enemyAI = enemyEntity.components(EnemyAIComponent),
                enemySteering = enemyEntity.components(SteeringComponent),
                enemyObject3d = enemyEntity.components(THREEComponent).mesh,
                enemyPosition = enemyObject3d.position;

            if (enemyPosition.x >=  3500 ||
                enemyPosition.x <= -3500 ||
                enemyPosition.y >=  2000 ||
                enemyPosition.y <= -2000 )
            {

                var x = cog.rand.arc4rand(-2000, 2000),
                    y = cog.rand.arc4rand(-1000, 1000);

                enemySteering.behavior = 'seek';
                enemySteering.neighborhood = NEIGHBORHOOD;
                enemySteering.maxSpeed = FLEESPEED;
                enemySteering.target.set(x, y, 0);
                enemyAI.state = EnemyAIComponent.AI_FLEE_CORNER;

                return;
            }

            enemySteering.behavior = 'flee';
            enemySteering.neighborhood = undefined;
            enemySteering.maxSpeed = FLEESPEED;
            enemySteering.target.copy(playerPosition);
        },

        handleFleeFromCorner: function(enemyEntity, playerPosition) {

            var enemyAI = enemyEntity.components(EnemyAIComponent),
                enemySteering = enemyEntity.components(SteeringComponent),
                enemyObject3d = enemyEntity.components(THREEComponent).mesh,
                enemyPosition = enemyObject3d.position;

            var targetOffset = new THREE.Vector3();
            targetOffset.copy(enemySteering.target);
            targetOffset.sub(enemyPosition);

            if (targetOffset.length() < 1000){
                enemyAI.state = EnemyAIComponent.AI_FLEE_PLAYER;
                return;
            }

            var playerOffset = new THREE.Vector3();
            playerOffset.copy(playerPosition);
            playerOffset.sub(enemyPosition);

            if (playerOffset.length() < 1000){
                enemyAI.state = EnemyAIComponent.AI_FLEE_PLAYER;
            }
        },

        handleSeekPlayer: function(enemyEntity, playerPosition) {
            var enemySteering = enemyEntity.components(SteeringComponent);
            enemySteering.behavior = 'seek';
            enemySteering.maxSpeed = CHASESPEED;
            enemySteering.neighborhood = NEIGHBORHOOD;
            enemySteering.target.copy(playerPosition);
        },

        handleDefault: function(enemyEntity) {

            var enemyAI = enemyEntity.components(EnemyAIComponent),
                enemyShape = enemyEntity.components(ShapeComponent),
                playerShape = this.player.components(ShapeComponent);

            if (enemyShape.geometryType === playerShape.geometryType) {
                enemyAI.state = EnemyAIComponent.AI_FLEE_PLAYER;
            }
            else if (enemyAI.state === 0) {
                enemyAI.state = EnemyAIComponent.AI_SEEK_PLAYER;
            }

        },

        'playerChangeShape event': function() {
            var self = this,
                geometryType = this.player.components(ShapeComponent).geometryType;

            this._entities.forEach(function(entity) {

                var playerShape = self.player.components(ShapeComponent),
                    enemyShape = entity.components(ShapeComponent),
                    enemyMaterial = entity.components(MaterialComponent),
                    enemyAI = entity.components(EnemyAIComponent);

                if (enemyShape.geometryType === geometryType && enemyAI.state === EnemyAIComponent.AI_SEEK_PLAYER) {
                    enemyAI.state = EnemyAIComponent.AI_FLEE_PLAYER;
                }

                if (enemyShape.geometryType !== geometryType && enemyAI.state !== EnemyAIComponent.AI_SEEK_PLAYER) {
                    enemyAI.state = EnemyAIComponent.AI_SEEK_PLAYER;
                }

                var newType = (playerShape.geometryType === enemyShape.geometryType) ?
                    MaterialComponent.TYPE_PREY : MaterialComponent.TYPE_PREDATOR;

                if (newType !== enemyMaterial.materialType) {
                    enemyMaterial.materialType = newType;
                    enemyMaterial.needsUpdate = true;
                }
            });
        }

    });

    cog.EnemySystem = EnemySystem;

    return EnemySystem;

});