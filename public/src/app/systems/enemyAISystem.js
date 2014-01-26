define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/enemyAIComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, EnemyAIComponent) {

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
            var entity = this._super(config),
                mesh = new THREE.Mesh(this.geometry, this.material);

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

            this.geometry = new THREE.CubeGeometry(100, 100, 100);
            this.material = new THREE.MeshPhongMaterial({
                ambient: 0x333333,
                color: 0xffffff,
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
                enemySteering.target.set(x, y, 0);
                enemyAI.state = EnemyAIComponent.AI_FLEE_CORNER;

                return;
            }

            enemySteering.behavior = 'flee';
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

        },

        handleDefault: function(enemyEntity) {
            enemyEntity.components(EnemyAIComponent).state = EnemyAIComponent.AI_FLEE_PLAYER;
        }

    });

    cog.EnemySystem = EnemySystem;

    return EnemySystem;

});