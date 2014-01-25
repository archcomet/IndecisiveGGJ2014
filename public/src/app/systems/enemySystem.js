define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/enemyComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, EnemyComponent) {

    var EnemySystem = cog.Factory.extend('EnemySystem', {

        entityTag: 'Enemy',

        components: {
            object3d: {
                constructor: THREEComponent
            },
            steering: {
                constructor: SteeringComponent,
                defaults: {
                    maxSpeed: 7,
                    behavior: 'flee',
                        target: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                }
            },
            enemy: {
                constructor: EnemyComponent
            }
        },

        defaults: {
            player: null,
            material: null,
            geometry: null,
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

        update:function(entities, events) {

            var playerPosition = this.player.components(THREEComponent).mesh.position;

            this._entities.forEach(function(entity) {

                var enemyPosition = entity.components(THREEComponent).mesh;




                entity.components(SteeringComponent).target.copy(playerPosition);
            });
        }

    });

    cog.EnemySystem = EnemySystem;

    return EnemySystem;

});