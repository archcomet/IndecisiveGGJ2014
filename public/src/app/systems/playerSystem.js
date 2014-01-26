define([
    'jquery',
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent',
    'components/playerComponent',
    'components/enemyAIComponent',
    'components/shapeComponent',
    'components/materialComponent'

], function($, cog, THREE, THREEComponent, SteeringComponent, PlayerComponent, EnemyAIComponent, ShapeComponent, MaterialComponent) {

    var CUBE_GEO = new THREE.CubeGeometry(200, 200, 200);

    var SPHERE_GEO = new THREE.SphereGeometry(150);

    var TETRAHEDRON_GEO = new THREE.TetrahedronGeometry(200);

    var MATERIAL = new THREE.MeshPhongMaterial({
        ambient: 0x333333,
        color: 0xffffff,
        emissive: 0xaaaaaa,
        shininess: 100
    });

    var MATERIAL_SQUARE = new THREE.MeshPhongMaterial({
        // ambient: 0x333333,
        // color: 0xffffff,
        emissive: 0xff9600,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        shininess: 10
    });

    var MATERIAL_CIRCLE = new THREE.MeshPhongMaterial({
        // ambient: 0x333333,
        // color: 0xffffff,
        emissive: 0xffc3f4,
        shininess: 100
    });

    var MATERIAL_TRIANGLE = new THREE.MeshPhongMaterial({
        // ambient: 0x333333,
        // color: 0xffffff,
        // emissive: 0x20ff18,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        shininess: 50
    });

    var particleSystem;
    var particleGeometry;
    var particleMaterial;
    var particlesMoving = false;

    var PlayerSystem = cog.Factory.extend('PlayerSystem', {

        entityTag: 'Player',

        components: {
            object3d: {
                constructor: THREEComponent
            },
            material: {
                constructor: MaterialComponent,
                defaults: {
                    materialType: MaterialComponent.TYPE_SQUARE,
                    squareMaterial: MATERIAL_SQUARE,
                    triangleMaterial: MATERIAL_TRIANGLE,
                    circleMaterial: MATERIAL_CIRCLE,
                    needsUpdate: true
                }
            },
            shape: {
                constructor: ShapeComponent,
                defaults: {
                    squareGeometry: CUBE_GEO,
                    triangleGeometry: TETRAHEDRON_GEO,
                    circleGeometry: SPHERE_GEO,
                    needsUpdate: true
                }
            },

            steering: {
                constructor: SteeringComponent,
                defaults: {
                    maxSpeed: 60,
                    maxAcceleration: 3,
                    avoidCorners: false
                }
            },
            player: {
                constructor: PlayerComponent
            }
        },

        defaults: {
            player: null,
            currentShape: null,
            inputShape: null
        },

        configure: function(entities, events) {

            var entity = this.spawn(),
                steeringComponent = entity.components(SteeringComponent);

            steeringComponent.behavior = 'seek';
            steeringComponent.target.x = 0;
            steeringComponent.target.y = 0;

            this.events = events;
            this.player = entity;
            this.score = 0;
            this.scoreVisible = false;

            this.particleSystem = this.summonParticles(events);
        },

        update: function(entities, events) {
            var enemyPosition,
                enemies = entities.withComponents(EnemyAIComponent),
                playerPosition = this.player.components(THREEComponent).mesh.position,
                playerSteering = this.player.components(SteeringComponent),
                i = 0,
                n = enemies.length;

            this.events = events;

            var enemyOffset = new THREE.Vector3(),
                enemyOffsetLength;

            for(; i < n; ++i) {
                enemyPosition = enemies[i].components(THREEComponent).mesh.position;

                enemyOffset.copy(enemyPosition);
                enemyOffset.sub(playerPosition);

                enemyOffsetLength = enemyOffset.length();

                if (enemyOffsetLength < 200) {
                    this.handleCollision(enemies[i]);
                    events.emit('enemyCollisionEvent', enemies[i], this.player);
                }
            }

            this.updateEvents(playerPosition, events);

            if (this.direction) {
                playerSteering.behavior = 'seek';
                playerSteering.target.x = playerPosition.x + this.direction.dx * 50;
                playerSteering.target.y = playerPosition.y + this.direction.dy * 50;

            } else {
                playerSteering.behavior = undefined;
            }

            this.direction = null;
        },

        handleCollision: function(enemy) {

            var enemyPosition = enemy.components(THREEComponent).mesh.position,
                enemyGeometry = enemy.components(ShapeComponent).geometryType,
                playerGeometry = this.player.components(ShapeComponent).geometryType;

            if (enemyGeometry === playerGeometry) {
                this.events.emit('goodCollision', enemyPosition);
                this.score += 1000;
                this.resetParticles(this.player.components(THREEComponent).mesh.position.x,
                                  this.player.components(THREEComponent).mesh.position.y,
                                  this.particleGeometry, this.particleMaterial,
                                  0.5, 0.5, 1.0);

            } else {
                this.events.emit('badCollision', enemyPosition);
                this.score -= 10000;
                this.resetParticles(this.player.components(THREEComponent).mesh.position.x,
                                  this.player.components(THREEComponent).mesh.position.y,
                                  this.particleGeometry, this.particleMaterial,
                                  1.0, 0.5, 0.5);
            }

            if (!this.scoreVisible) {
                $('#score').show();
                this.scoreVisible = true;
            }
            $('#scoreNumber').text(this.score);

            this.events.emit('despawn Enemy', enemy);
        },

        updateEvents: function(playerPosition, events) {
            // send events at doors
            if(playerPosition.y > -500 && playerPosition.y < 500) {
                if(playerPosition.x === 4000) {
                    events.emit("door", "right", events);
                    playerPosition.x = -3990;
                } else if(playerPosition.x === -4000) {
                    events.emit("door", "left", events);
                    playerPosition.x = 3990;
                }
            } else if(playerPosition.x > -500 && playerPosition.x < 500) {
                if(playerPosition.y === 2500) {
                    events.emit("door", "up", events);
                    playerPosition.y = -2490;
                } else if(playerPosition.y === -2500) {
                    events.emit("door", "down", events);
                    playerPosition.y = 2490;
                }
            }
            this.updateParticles(this.particleMaterial, this.particleGeometry)
        },

        'playerSeekDirection event': function(dx, dy) {
            this.direction = {
                dx: dx,
                dy: dy
            };
        },

        'playerChangeShape event': function(geometryType) {
            if (this.currentShape !== geometryType) {
                var shape = this.player.components(ShapeComponent),
                    material = this.player.components(MaterialComponent);

                shape.geometryType = geometryType;
                shape.needsUpdate = true;

                switch(geometryType) {
                    case ShapeComponent.TYPE_SQUARE:
                        this.events.emit('playerShapeChanged', 'square');
                        material.materialType = 3;
                        material.needsUpdate = true;
                        break;
                    case ShapeComponent.TYPE_TRIANGLE:
                        this.events.emit('playerShapeChanged', 'triangle');
                        material.materialType = 4;
                        material.needsUpdate = true;
                        break;
                    case ShapeComponent.TYPE_CIRCLE:
                        this.events.emit('playerShapeChanged', 'circle');
                        material.materialType = 5;
                        material.needsUpdate = true;
                        break;
                }

                this.currentShape = geometryType;
            }
        },

        // particle effects
        summonParticles: function(events) {
          this.particleGeometry = new THREE.Geometry();
          sprite = THREE.ImageUtils.loadTexture( "textures/sprites/disc.png" );

          for ( i = 0; i < 100; i ++ ) {

            var vertex = new THREE.Vector3();
            vertex.x = 12 * Math.random() - 6;
            vertex.y = 12 * Math.random() - 6;
            vertex.z = 12 * Math.random() - 9;

            this.particleGeometry.vertices.push( vertex );

          }

          for(var i = 0; i < this.particleGeometry.vertices.length; i ++)
          {
            this.particleGeometry.vertices[i].x +=  12000;
            this.particleGeometry.vertices[i].y +=  12000;
          }

          this.particleMaterial = new THREE.ParticleSystemMaterial( { size: 15, sizeAttenuation: false, map: sprite, transparent: true } );
          this.particleMaterial.color.setHSL( 1.0, 0.3, 0.7 );

          particles = new THREE.ParticleSystem( this.particleGeometry, this.particleMaterial );
          particles.sortParticles = true;

          events.emit('addToScene', particles);
        //
        },

        updateParticles: function(particleMaterial, particleGeometry){
          // h = ( 360 * ( 1.0 + Date.now() ) % 360 ) / 360;
          // particleMaterial.color.setHSL( h, 0.5, 0.5 );
          if(this.particlesMoving)
          {
            for(var i = 0; i < particleGeometry.vertices.length; i ++)
            {
              particleGeometry.vertices[i].x += Math.sin(360/(i % 360)) * 100;// - Math.max(0,(1 * Math.abs(particleGeometry.vertices[i].x)));
              particleGeometry.vertices[i].y += Math.cos(360/(i % 360)) * 100;// - Math.max(0,(1 * Math.abs(particleGeometry.vertices[i].x))) ;
            }
            particleGeometry.verticesNeedUpdate = true;
          }
        },

        resetParticles: function(x, y, particleGeometry, particleMaterial, r, g, b){
          for(var i = 0; i < particleGeometry.vertices.length; i ++)
          {
            particleGeometry.vertices[i].x = x;// + Math.random() * 100 - 50;
            particleGeometry.vertices[i].y = y;// + Math.random() * 100 - 50;
          }
          particleGeometry.verticesNeedUpdate = true;
          particleMaterial.color.setRGB(r,g,b);
          this.particlesMoving = true;
        }
    });

    cog.SandboxSystem = PlayerSystem;

    return PlayerSystem;

});