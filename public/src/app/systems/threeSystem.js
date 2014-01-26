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


            var light = new THREE.PointLight( 0xff0000, 1.0, 4000);
            light.position.set( -4000, 2500, 300 );
            this.scene.add(light);
            pointLights.push(light);

            var light = new THREE.PointLight( 0xff0000, 1.0, 4000);
            light.position.set( 4000, 2500, 300 );
            this.scene.add(light);
            pointLights.push(light);

            var light = new THREE.PointLight( 0xff0000, 1.0, 4000);
            light.position.set( -4000, -2500, 300 );
            this.scene.add(light);
            pointLights.push(light);

            var light = new THREE.PointLight( 0xff0000, 1.0, 4000);
            light.position.set( 4000, -2500, 300 );
            this.scene.add(light);
            pointLights.push(light);

            var light = new THREE.PointLight( 0x4444ff, 2.5, 12000);
            light.position.set( 0, 0, -5000 );
            this.scene.add(light);
            pointLights.push(light);

            // light = new THREE.PointLight( 0xffffff, 1.0, 10000);
            // light.color.setRGB(1.0, 1.0, 1.0);
            // light.position.set( 0, 0, -500 );
            // this.scene.add(light);
            // pointLights.push(light);

            /*light = new THREE.PointLight( 0xffffff, 1.5, 10500);
            light.color.setRGB(0.5, 0.5, 0.5);
            light.position.set( 400, 0, 500 );
            this.scene.add(light);*/

            // directionalLight = new THREE.DirectionalLight( 0x999999, 0.5 );
            // directionalLight.position.set( 0, 0, 500 );
            // this.scene.add( directionalLight );


            document.getElementById('container').appendChild(this.renderer.domElement);
            window.addEventListener('resize', this.onWindowResize.bind(this), false );

            // This adds a few post processing effects
            this.composePostProcessing();
        },

        composePostProcessing: function(){
          var renderModel = new THREE.RenderPass( this.scene, this.camera );
          var effectBloom = new THREE.BloomPass( 1.3 );
          var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

          effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

          var width = window.innerWidth || 2;
          var height = window.innerHeight || 2;

          effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );

          effectCopy.renderToScreen = true;

          this.composer = new THREE.EffectComposer( this.renderer );

          this.composer.addPass( renderModel );
          this.composer.addPass( effectFXAA );
          this.composer.addPass( effectBloom );
          this.composer.addPass( effectCopy );
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

            for(var i = 0; i < pointLights.lenght; i++)
              pointLights[i].position.x += 10;
        },

        render: function() {
            // For not post processing
            this.renderer.render(this.scene, this.camera);

            // TODO: For awesome post processing, but doesn't work :C
            // this.renderer.clear();
            // this.composer.render();
        },

        onWindowResize: function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );


            this.camera.updateProjectionMatrix();

            this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

            this.composer.reset();
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