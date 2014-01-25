define([
    'cog',
    'math',
    'three',
    'components/threeComponent',
    'components/steeringComponent'

], function(cog, math, THREE, ThreeComponent, SteeringComponent) {
   'use strict';

    var SteeringSystem = cog.System.extend('SteeringSystem', {

        update: function(entities) {

            var steering, object3d,
                entityArray = entities.withComponents(SteeringComponent, ThreeComponent),
                i = 0,
                n = entityArray.length;

            for (; i < n; ++i) {
                steering = entityArray[i].components(SteeringComponent);
                object3d = entityArray[i].components(ThreeComponent).mesh;

                this.updateBehavior(steering, object3d);
                this.updatePosition(steering, object3d);
                this.updateRotation(steering, object3d);
            }
        },

        /*** behaviors ***/

        updateBehavior: function(steering, object3d) {
            if (!steering.behavior || !this[steering.behavior]) {
                return;
            }
            this[steering.behavior](steering, object3d);
            // rotate to velocity
        },

        arrival: function(steering, object3d) {

            var targetOffset = new THREE.Vector3();
            targetOffset.copy(steering.target);
            targetOffset.sub(steering.position);

            var distance = targetOffset.length(),
                rampedSpeed = steering.maxSpeed * (distance / steering.slowingDistance),
                clippedSpeed = steering.maxSpeed < rampedSpeed ? steering.maxSpeed : rampedSpeed;

            var desiredVelocity = targetOffset.multiplyScalar(clippedSpeed / distance);

            this.steerForVelocity(desiredVelocity, steering, object3d);
        },

        seek: function(steering, object3d) {

            var desiredVelocity = new THREE.Vector3();
            desiredVelocity.copy(steering.target);
            desiredVelocity.sub(steering.position);

            desiredVelocity.normalize();
            desiredVelocity.multiplyScalar(steering.maxSpeed);

            this.steerForVelocity(desiredVelocity, steering, object3d);
        },

        flee: function(steering, object3d) {

            var desiredVelocity = new THREE.Vector3();
            desiredVelocity.copy(steering.position);
            desiredVelocity.sub(steering.target);

            desiredVelocity.normalize();
            desiredVelocity.multiplyScalar(steering.maxSpeed);

            this.steerForVelocity(desiredVelocity, steering, object3d);
        },

        steerForVelocity: function(desiredVelocity, steering, object3d) {

            var steeringVelocity = desiredVelocity.sub(steering.velocity);
            steeringVelocity.normalize();
            steeringVelocity.multiplyScalar(steering.maxAcceleration);

            steering.velocity.add(steeringVelocity);
        },

        /*** simple vehicle ***/

        updatePosition: function(steering, object3d) {

            // Cap velocity
            if (steering.velocity.lengthSq() > steering.maxSpeed * steering.maxSpeed) {
                steering.velocity.normalize();
                steering.velocity.multiplyScalar(steering.maxSpeed);
            }

            // adjust position
            steering.position.add(steering.velocity);

            // clamp position

            if (steering.position.x > 4000) {
                steering.position.x = 4000;

            } else if (steering.position.x < -4000) {
                steering.position.x = -4000;
            }

            if (steering.position.y > 2500) {
                steering.position.y = 2500;

            } else if (steering.position.y < -2500) {
                steering.position.y = -2500;
            }

            object3d.position = steering.position;
        },

        updateRotation: function(steering, object3d) {

            var facing = new THREE.Vector3();
            facing.copy(steering.position);
            facing.add(steering.velocity);
            object3d.lookAt(facing);

        }

});

    cog.SteeringSystem = SteeringSystem;

    return SteeringSystem;

});