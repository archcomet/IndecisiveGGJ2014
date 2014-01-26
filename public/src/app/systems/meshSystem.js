define([
    'cog',
    'three',
    'components/threeComponent',
    'components/materialComponent',
    'components/shapeComponent'

], function(cog, THREE, THREEComponent, MaterialComponent, ShapeComponent) {

    var MeshSystem = cog.System.extend('MeshSystem', {

        configure: function(entities, events) {
            this.events = events;
        },

        update:function(entities) {

            var entity, entityShape, entityMaterial, entityThree,
                entityArray = entities.withComponents(ShapeComponent, MaterialComponent),
                i = 0,
                n = entityArray.length;


            for (; i < n; ++i) {
                entity = entityArray[i];
                entityShape = entity.components(ShapeComponent);
                entityMaterial = entity.components(MaterialComponent);

                if (entityShape.needsUpdate || entityMaterial.needsUpdate) {
                    entityThree = entity.components(THREEComponent);
                    this.updateMesh(entityThree, entityShape, entityMaterial);
                }
            }
        },

        updateMesh: function(entityThree, entityShape, entityMaterial) {

            var geometry, material, position;

            switch(entityShape.geometryType) {
                case ShapeComponent.TYPE_SQUARE:
                    geometry = entityShape.squareGeometry;
                    break;

                case ShapeComponent.TYPE_CIRCLE:
                    geometry = entityShape.circleGeometry;
                    break;

                case ShapeComponent.TYPE_TRIANGLE:
                    geometry = entityShape.triangleGeometry;
                    break;
            }


            switch(entityMaterial.materialType) {
                case MaterialComponent.TYPE_PREY:
                    material = entityMaterial.preyMaterial;
                    break;

                case MaterialComponent.TYPE_PREDATOR:
                    material = entityMaterial.predatorMaterial;
                    break;

                case MaterialComponent.TYPE_SQUARE:
                    material = entityMaterial.squareMaterial;
                    break;

                case MaterialComponent.TYPE_TRIANGLE:
                    material = entityMaterial.triangleMaterial;
                    break;

                case MaterialComponent.TYPE_CIRCLE:
                    material = entityMaterial.circleMaterial;
                    break;

            }

            position = entityThree.mesh ? entityThree.mesh.position : entityThree.spawnPosition;

            if (!entityThree.mesh) {

                // spawning
                entityThree.mesh = new THREE.Mesh(geometry, material);
                entityThree.mesh.position.copy(entityThree.spawnPosition);
                this.events.emit('addToScene', entityThree);

            } else if (entityShape.needsUpdate) {

                // replacing mesh
                this.events.emit('removeFromScene', entityThree.mesh);
                entityThree.mesh = new THREE.Mesh(geometry, material);
                entityThree.mesh.position.set(position.x, position.y, position.z);
                this.events.emit('addToScene', entityThree);

            } else {

                // replacing material
                entityThree.mesh.material = material;

            }

            entityShape.needsUpdate = false;
            entityMaterial.needsUpdate = false;
        }

    });

    cog.MeshSystem = MeshSystem;

    return MeshSystem;

});