define([
    'cog',
    'three',
    'components/threeComponent'
], function(cog, THREE, THREEComponent) {

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
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 15000);
            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.position.z = 4000;

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
        },

        update: function(entities, events, dt) {
            this.renderer.render(this.scene, this.camera);
        },

        onWindowResize: function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
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