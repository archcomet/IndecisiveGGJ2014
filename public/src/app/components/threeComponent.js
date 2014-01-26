define([
    'cog',
    'three',
    'geometry/defaultgeometry',
    'material/defaultmaterial'
], function(cog, THREE, defaultGeometryData, defaultMaterialData) {

    var THREEComponent = cog.Component.extend('cog.THREEComponent', {
        eventTarget: 'THREEComponent'
        }, {
        defaults: {
            mesh:       null,
            geometry:   null,
            material:   null
        },
        init: function(entity, props) {

            this._super(entity, props);

            if (!props.geometryData) {

                this.geometry = this.loadGeometry(defaultGeometryData);
            } else {

                this.geometry = this.loadGeometry(props.geometryData);
            }

            if (!props.materialData) {

                this.material = this.loadMaterial(defaultMaterialData);
            } else {

                this.material = this.loadMaterial(props.materialData);
            }

            this.mesh = new THREE.Mesh(this.geometry, this.material);
        },

        loadGeometry: function(data) {

            var newGeometry;

            switch(data.shape) {

                case "cube": {

                    newGeometry = new THREE.CubeGeometry(data.x, data.y, data.z);
                    break;
                }

                case "cylinder": {

                    newGeometry = new THREE.CylinderGeometry(data.radiusTop, data.radiusBottom,
                        data.height, data.radiusSegments, data.heightSegments, data.openEnded);
                    break;
                }

                default: {

                    alert("ERROR[threeComponent.js]: Invalid data shape: " + data.shape);
                    break;
                }
            }

            return newGeometry;
        },

        loadMaterial: function(data) {

            var newMaterial;

            switch(data.shader) {

                case "phong": {

                    newMaterial = new THREE.MeshPhongMaterial({
                        ambient: data.ambient,
                        color: data.color,
                        shininess: data.shininess
                    });
                    break;
                }

                case "basic": {

                    newMaterial = new THREE.MeshBasicMaterial({
                        color: data.color,
                        wireframe: data.wireframe
                    });
                    break;
                }
                default: {
                    alert("ERROR[threeComponent.js]: Invalid data shader: " + data.shader);
                    break;
                }
            }
            if(this.mesh) {
                this.mesh.material = newMaterial;
            }

            return newMaterial;
        }
    });

    cog.THREEComponent = THREEComponent;

    return THREEComponent;
});