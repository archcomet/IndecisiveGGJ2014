define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/enemyAIComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, EnemyAIComponent) {

    var NEIGHBORHOOD = 1000;
    var EnemySystem = cog.Factory.extend('EnemySystem', {

        entityTag: 'Enemy',

        components: {
            object3d: {
                constructor: THREEComponent
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

            var enemyAI = entity.components(EnemyAIComponent),
                enemySteering = entity.components(SteeringComponent),
                enemyGeometry, enemyMaterial;

            enemySteering.maxSpeed *= cog.rand.arc4rand(1.75, 2.25);
            enemySteering.maxAcceleration *= cog.rand.arc4rand(0.75, 1.25);

            enemyAI.shape = cog.rand.arc4randInt(0, 2);

            switch(enemyAI.shape) {
                case EnemyAIComponent.SHAPE_SQUARE:
                    enemyGeometry = this.cubeGeometry;
                    enemyMaterial = this.preyMaterial;
                    break;

                case EnemyAIComponent.SHAPE_CIRCLE:
                    enemyGeometry = this.sphereGeometry;
                    enemyMaterial = this.predatorMaterial;
                    break;

                case EnemyAIComponent.SHAPE_TRIANGLE:
                    enemyGeometry = this.tetrahedronGeometry;
                    enemyMaterial = this.predatorMaterial;
                    break;
            }

            var mesh = new THREE.Mesh(enemyGeometry, enemyMaterial);

            if (config.position) {
                mesh.position.set(config.position.x, config.position.y, 0);
            }

            entity.components(THREEComponent).mesh = mesh;
            this.events.emit('addToScene', entity);

            return entity;
        },

        configure: function(entities, events) {

            this.events = events;
            this.player = entities.withTag('Player')[0];

            this.cubeGeometry = new THREE.CubeGeometry(150, 150, 150);
            this.sphereGeometry = new THREE.SphereGeometry(100);
            this.tetrahedronGeometry = new THREE.TetrahedronGeometry(150);

            this.preyMaterial = new THREE.MeshLambertMaterial({
                ambient: 0x000033,
                color: 0x0000ff,
                emissive: 0x000033,
                shininess: 50
            });

            this.predatorMaterial = new THREE.MeshLambertMaterial({
                ambient: 0x330000,
                color: 0xff0000,
                emissive: 0x000033,
                shininess: 50
            });

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

            switch(enemyEntity.components(EnemyAIComponent).state) {

                case EnemyAIComponent.AI_FLEE_PLAYER: this.handleFleeFromPlayer(enemyEntity, playerPosition); break;

                case EnemyAIComponent.AI_FLEE_CORNER: this.handleFleeFromCorner(enemyEntity, playerPosition); break;

                case EnemyAIComponent.AI_SEEK_PLAYER: this.handleSeekPlayer(enemyEntity, playerPosition); break;

                default: this.handleDefault(enemyEntity); break;
            }
        },

        handleFleeFromPlayer: function(enemyEntity, playerPosition) {

            var enemyAI = enemyEntity.components(EnemyAIComponent),
                enemySteering = enemyEntity.components(SteeringComponent),
                enemyObject3d = enemyEntity.components(THREEComponent).mesh,
                enemyPosition = enemyObject3d.position;

            if (enemyPosition.x >= 4000 - enemyAI.wallFleeTrigger ||
                enemyPosition.x <= -4000 + enemyAI.wallFleeTrigger ||
                enemyPosition.y >= 2500 - enemyAI.wallFleeTrigger ||
                enemyPosition.y <= -2500 + enemyAI.wallFleeTrigger )
            {

                var x = cog.rand.arc4rand(-2000, 2000),
                    y = cog.rand.arc4rand(-1000, 1000);

                enemySteering.behavior = 'seek';
                enemySteering.neighborhood = NEIGHBORHOOD;
                enemySteering.target.set(x, y, 0);
                enemyAI.state = EnemyAIComponent.AI_FLEE_CORNER;

                return;
            }

            enemySteering.behavior = 'flee';
            enemySteering.neighborhood = undefined;
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
            enemySteering.neighborhood = NEIGHBORHOOD;
            enemySteering.target.copy(playerPosition);
        },

        handleDefault: function(enemyEntity) {

            if (enemyEntity.components(EnemyAIComponent).shape === EnemyAIComponent.SHAPE_SQUARE) {
                enemyEntity.components(EnemyAIComponent).state = EnemyAIComponent.AI_FLEE_PLAYER;
            } else {
                enemyEntity.components(EnemyAIComponent).state = EnemyAIComponent.AI_SEEK_PLAYER;
            }
        }

    });

    cog.EnemySystem = EnemySystem;

    return EnemySystem;

});