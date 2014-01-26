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
            if (steering.behavior && this[steering.behavior]) {
                this[steering.behavior](steering, object3d);
            }
        },

        arrival: function(steering, object3d) {

            var targetOffset = new THREE.Vector3();
            targetOffset.copy(steering.target);
            targetOffset.sub(object3d.position);

            var distance = targetOffset.length(),
                rampedSpeed = steering.maxSpeed * (distance / steering.slowingDistance),
                clippedSpeed = steering.maxSpeed < rampedSpeed ? steering.maxSpeed : rampedSpeed;

            var desiredVelocity = targetOffset.multiplyScalar(clippedSpeed / distance);

            this.steerForVelocity(desiredVelocity, steering, object3d);
        },

        seek: function(steering, object3d) {

            var desiredVelocity = new THREE.Vector3();
            desiredVelocity.copy(steering.target);
            desiredVelocity.sub(object3d.position);

            var distance = object3d.position.distanceTo(steering.target);
            distance = distance < 10 ? 0 : distance;
            var speed = distance < steering.maxSpeed ? distance : steering.maxSpeed;

            desiredVelocity.normalize();
            desiredVelocity.multiplyScalar(speed);

            this.steerForVelocity(desiredVelocity, steering, object3d);
        },

        flee: function(steering, object3d) {

            var desiredVelocity = new THREE.Vector3();
            desiredVelocity.copy(object3d.position);
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

            var speed = steering.velocity.length();

            if (!steering.behavior) {
                speed *= (1 - steering.drag);
            }

            // Cap velocity
            if (speed > steering.maxSpeed) {
                speed = steering.maxSpeed;
            }

            steering.velocity.normalize();
            steering.velocity.multiplyScalar(speed);

            if (Math.abs(steering.velocity.x) < 0.0000001) {
                steering.velocity.x = 0;
            }

            if (Math.abs(steering.velocity.y) < 0.0000001) {
                steering.velocity.y = 0;
            }

            // adjust position
            object3d.position.add(steering.velocity);

            // clamp position

            if (object3d.position.x > 4000) {
                object3d.position.x = 4000;

            } else if (object3d.position.x < -4000) {
                object3d.position.x = -4000;
            }

            if (object3d.position.y > 2500) {
                object3d.position.y = 2500;

            } else if (object3d.position.y < -2500) {
                object3d.position.y = -2500;
            }

        },

        updateRotation: function(steering, object3d) {

            var facing = new THREE.Vector3();
            facing.copy(object3d.position);
            facing.add(steering.velocity);

            object3d.up.set(0, 1, 0);
            object3d.lookAt(facing);

        }

    });

    cog.SteeringSystem = SteeringSystem;

    return SteeringSystem;

});