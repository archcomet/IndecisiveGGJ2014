define([
    'cog',
    'three'
], function(cog, THREE) {

    var SteeringComponent = cog.Component.extend('SteeringComponent', {

        defaults: {

            // things to play with

            behavior: undefined, // 'seek', 'flee', 'arrival'

            maxSpeed: 10,
            maxAcceleration: 0.5,

            slowingDistance: 100,

            // things for calculations

            velocity: null,
            target: null
        },

        init: function(entity, props) {
            this._super(entity, props);

            var target = new THREE.Vector3();

            if (this.target) {
                target.set(this.target.x, this.target.y, this.target.z);
            }

            this.target = target;
            this.velocity = new THREE.Vector3();
        }

    });

    cog.SteeringComponent = SteeringComponent;

    return SteeringComponent;
});