define([
    'cog',
    'three',
    'components/threeComponent'
], function(cog, THREE, THREEComponent) {

    var composer;
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


            var light = new THREE.PointLight( 0xffffff, 1.5, 10000);
            light.color.setHSL(0.55, 0.9, 0.5);
            light.position.set( 0, 700, 500 );
            this.scene.add(light);

            light = new THREE.PointLight( 0xffffff, 1.5, 10500);
            light.color.setHSL(0.0, 0.9, 0.5);
            light.position.set( 0, 0, 2000 );
            this.scene.add(light);


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
            var playerEntity = entities.withTag('Player')[0],
                playerObject3d = playerEntity.components(THREEComponent).mesh,
                playerPosition = playerObject3d.position;

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
        }

    });

    cog.THREESystem = THREESystem;

    return THREESystem;
});