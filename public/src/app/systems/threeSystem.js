define([
    'cog',
    'three',
    'components/threeComponent'
], function(cog, THREE, THREEComponent) {

    var composer;
    var directionalLight;
    var pointLights = [];
    var THREESystem = cog.System.extend({

        properties: {
            renderer: {
                value: null,
                writable: true
            },
            camera: {
                value: null,
                writable: true
            },
            scene: {
                value: null,
                writable: true
            }
        },

        configure: function() {

            this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha:true } );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.autoClear = false;
            this.renderer.clearColor(0x000000, 0);

            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 15000);
            this.camera.position.x = 0;
            this.camera.position.y = -500;
            this.camera.position.z = 4500;

            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.scene = new THREE.Scene();
            //this.scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
            //this.scene.fog.color.setHSL( 0.51, 0.4, 0.01 );

            // door lights
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( -4000, 300, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( 4000, 300, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( -4000, -300, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( 4000, -300, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( -300, 2500, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( 300, 2500, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( -300, -2500, 300 );
            this.scene.add(light);
            pointLights.push(light);
            var light = new THREE.PointLight( 0x1dfff1, 0.9, 2000);
            light.position.set( 300, -2500, 300 );
            this.scene.add(light);
            pointLights.push(light);

            var light = new THREE.PointLight( 0x9e24ff, 2.5, 12000);
            light.position.set( 0, 0, -5000 );
            this.scene.add(light);
            pointLights.push(light);

            document.getElementById('container').appendChild(this.renderer.domElement);
            window.addEventListener('resize', this.onWindowResize.bind(this), false );

        },


        update: function(entities, events, dt) {
            var playerEntity, playerThree, playerPosition;

            playerEntity = entities.withTag('Player')[0];
            playerThree = playerEntity.components(THREEComponent);
            playerPosition = (playerThree.mesh) ? playerThree.mesh.position : new THREE.Vector3();

            var length = playerPosition.length() * 0.02;

            var lookTarget = new THREE.Vector3();
            lookTarget.copy(playerPosition);
            lookTarget.normalize();
            lookTarget.multiplyScalar(length);

            this.camera.lookAt(lookTarget);

            // Render the scene
            this.render();
        },

        render: function() {
            // For not post processing
            this.renderer.render(this.scene, this.camera);
        },

        onWindowResize: function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );


            this.camera.updateProjectionMatrix();
        },

        'addToScene event': function(threeObject) {

            if (threeObject instanceof cog.Entity) {

                this.scene.add(threeObject.components(THREEComponent).mesh);

            } else if (threeObject instanceof THREEComponent) {

                this.scene.add(threeObject.mesh);

            } else if (threeObject instanceof THREE.Object3D) {

                this.scene.add(threeObject);
            }
        },

        'removeFromScene event': function(threeObject) {

            if (threeObject instanceof cog.Entity) {

                this.scene.remove(threeObject.components(THREEComponent).mesh);

            } else if (threeObject instanceof THREEComponent) {

                this.scene.remove(threeObject.mesh);

            } else if (threeObject instanceof THREE.Object3D) {

                this.scene.remove(threeObject);
            }
        },

        'THREEComponent removed event': function(threeObject) {
            this.scene.remove(threeObject.mesh);
        }

    });

    cog.THREESystem = THREESystem;

    return THREESystem;
});