define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/playerComponent'

], function(cog, THREE, THREEComponent, SteeringComponent, PlayerComponent) {

    var PlayerSystem = cog.Factory.extend('SandboxSystem', {

        entityTag: 'Player',

        components: {
            object3d: {
                constructor: THREEComponent
            },
            steering: {
                constructor: SteeringComponent,
                defaults: {
                    maxSpeed: 20,
                    maxAcceleration: 3
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

            var entity = this.spawn();

            entity.components(SteeringComponent).behavior = 'seek';
            entity.components(SteeringComponent).target.x = 0;
            entity.components(SteeringComponent).target.y = 0;


            this.player = entity;

            events.emit('addToScene', entity);
        },

        'playerSeekDirection event': function(dx, dy) {
            var pos = this.player.components(THREEComponent).mesh.position;
            this.player.components(SteeringComponent).target.x = pos.x + dx * 50;
            this.player.components(SteeringComponent).target.y = pos.y + dy * 50;
        }
    });

    cog.SandboxSystem = PlayerSystem;

    return PlayerSystem;

});