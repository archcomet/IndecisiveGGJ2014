define([
    'cog',
    'three',
    'components/threeComponent',
    'components/steeringComponent'

], function(cog, THREE, THREEComponent, SteeringComponent) {
    var lines = [];
    var hilbert;
    var hotSpot = 0;
    var SandboxSystem = cog.System.extend('SandboxSystem', {

        configure: function(entities, events) {
            this.createWalls(entities, events);
            lines = this.summonLines(entities, events);
            hilbert = this.summonLineCube(entities, events);
        },

        createWalls: function(entities, events) {

            var horizontalWall = new THREE.CubeGeometry(8000, 100, 100),
                verticalWall = new THREE.CubeGeometry(100, 5200, 100);

            var wallMaterial = new THREE.MeshPhongMaterial({
                ambient: 0xff0000,
                color: 0xff0000,
                shininess: 50
            });

            this.createWallEntity(entities, events, horizontalWall, wallMaterial, 0, 2550, 0);
            this.createWallEntity(entities, events, horizontalWall, wallMaterial, 0, -2550, 0);

            this.createWallEntity(entities, events, verticalWall, wallMaterial, 4050, 0, 0);
            this.createWallEntity(entities, events, verticalWall, wallMaterial, -4050, 0, 0);

            var line = new THREE.RenderableLine();
            line.v1.position = new THREE.Vector3(0, 0, 0);
            line.v2.position = new THREE.Vector3(1000, 0, 0);
            line.material = wallMaterial;

            events.emit('addToScene', line);

        },

        summonLines: function(entities, events) {
          var lines = [];
          var i, line, vertex1, vertex2, material, p,
            parameters = [
                          [ 0.25, 0xff7700, 1, 6 ],
                          [ 0.5, 0xff9900, 1, 7 ],
                          [ 0.75, 0xffaa00, 0.5, 4 ],
                          [ 1, 0xffaa00, 0.5, 1 ],
                          [ 1.25, 0x000833, 0.4, 5 ],
                          [ 3.0, 0xaaaaaa, 0.5, 9 ] ,
                          [ 3.5, 0xffffff, 0.5, 2 ],
                          [ 4.5, 0xffffff, 0.25, 1 ],
                          [ 5.5, 0xffffff, 0.125, 8 ],
                          [ 0.25, 0xff7700, 1, 6 ],
                          [ 0.5, 0xff9900, 1, 2 ],
                          [ 0.75, 0xffaa00, 0.75, 4 ],
                          [ 1, 0xffaa00, 0.5, 5 ],
                          [ 1.25, 0x000833, 0.3, 1 ],
                          [ 3.0, 0xaaaaaa, 0.5, 2 ] ,
                          [ 3.5, 0xffffff, 0.5, 3 ],
                          [ 4.5, 0xffffff, 0.25, 5 ],
                          [ 5.5, 0xffffff, 0.125, 8 ] ],

            lineGeometry = new THREE.Geometry();

            for ( i = 0; i < 1; i ++ ) {
              var vertex1 = new THREE.Vector3();
              vertex1.x = Math.random() * 2 - 1;
              // vertex1.y = Math.random() * 2 - 1;
              // vertex1.z = Math.random() * 2 - 1;
              vertex1.normalize();
              vertex1.multiplyScalar( 450 );

              vertex2 = vertex1.clone();
              vertex2.y += 8000;
              // vertex2.z += 1;//100;
              // vertex2.x += Math.random() * 100 - 50;
              // vertex2.multiplyScalar( Math.random() * 0.09 + 1 );

              lineGeometry.vertices.push( vertex1 );
              lineGeometry.vertices.push( vertex2 );

            }

            for( i = 0; i < parameters.length; ++ i ) {

              p = parameters[ i ];

              material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ], linewidth: p[ 3 ] } );
              material.transparent = true;
              line = new THREE.Line( lineGeometry, material, THREE.LinePieces );
              line.originalScale = p[ 0 ];
              line.updateMatrix();
              events.emit('addToScene', line );
              lines.push(line);
              line.position.y = 4000;
              line.rotation.x = 135;
              line.position.z = -400;

            }

            return lines;
        },

        lineUpdate: function(lines)
        {
          for(var i = 0; i < lines.length; i++)
          {
            lines[i].position.x = Math.random() * 20000 - 10000;
            lines[i].material.color.r = Math.random() * 0.7 - 0.0;
            lines[i].material.color.g = Math.random() * 0.7 - 0.0;
            lines[i].material.color.b = Math.random() * 0.7 - 0.0;
          }
        },

        summonLineCube: function(entities, events) {
          var geometry = new THREE.Geometry(),
          points = hilbert3D( new THREE.Vector3( 500,0,-4000 ), 10500.0, 2, 0, 1, 2, 3, 4, 5, 6, 7 ),
          colors = [], colors2 = [], colors3 = [];

          for ( i = 0; i < points.length; i ++ ) {
            geometry.vertices.push( points[ i ] );
            colors[ i ] = new THREE.Color( 0xffffff );
          }
          geometry.colors = colors;
          // lines
          material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors } );
          var line, p, scale = 0.3, d = 225;
          var parameters =  [
            [ material, scale*1.5, [-d,0,0],  geometry ]
          ];

          for ( i = 0; i < parameters.length; ++i ) {
            p = parameters[ i ];
            line = new THREE.Line( p[ 3 ],  p[ 0 ] );
            line.scale.x = line.scale.y = line.scale.z =  p[ 1 ];
            line.position.x = p[ 2 ][ 0 ];
            line.position.y = p[ 2 ][ 1 ];
            line.position.z = -100;
            events.emit('addToScene', line );
          }

          return geometry;

          function hilbert3D( center, side, iterations, v0, v1, v2, v3, v4, v5, v6, v7 ) {
            var half = side / 2,
              vec_s = [
              new THREE.Vector3( center.x - half, center.y + half, 0),//center.z - half ),
              new THREE.Vector3( center.x - half, center.y + half, 0),//center.z + half ),
              new THREE.Vector3( center.x - half, center.y - half, 0),//center.z + half ),
              new THREE.Vector3( center.x - half, center.y - half, 0),//center.z - half ),
              new THREE.Vector3( center.x + half, center.y - half, 0),//center.z - half ),
              new THREE.Vector3( center.x + half, center.y - half, 0),//center.z + half ),
              new THREE.Vector3( center.x + half, center.y + half, 0),//center.z + half ),
              new THREE.Vector3( center.x + half, center.y + half, 0)//center.z - half )
              ],
              vec = [ vec_s[ v0 ], vec_s[ v1 ], vec_s[ v2 ], vec_s[ v3 ], vec_s[ v4 ], vec_s[ v5 ], vec_s[ v6 ], vec_s[ v7 ] ];
            if( --iterations >= 0 ) {
              var tmp = [];
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 0 ], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 1 ], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 2 ], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 3 ], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 4 ], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 5 ], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 6 ], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7 ) );
              Array.prototype.push.apply( tmp, hilbert3D ( vec[ 7 ], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7 ) );
              return tmp;
            }
            return vec;
          }
        },

        lineCubeUpdate: function(lineCube, hotSpot) {
            for(var i = 0; i < lineCube.vertices.length; i++)
            {
              if(i == hotSpot)
              {
                lineCube.colors[i].setRGB(1,1,1);
              }
              else
              {
                lineCube.colors[i].setRGB(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
              }
              lineCube.colorsNeedUpdate = true;
            }
            hotSpot += 1;
            if(hotSpot > lineCube.vertices.length)
            {
              hotSpot = 0;
            }

            return hotSpot;
        },

        createWallEntity: function(entities, events, geometry, material, x, y, z) {

            var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);


            var wallEntity = entities.add('wall');
                wallEntity.components.assign(THREEComponent, {  mesh: mesh });

            events.emit('addToScene', wallEntity);
        },

        update: function(entities, events, dt)
        {
          this.lineUpdate(lines);
          hotSpot = this.lineCubeUpdate(hilbert, hotSpot);
        }


    });

    cog.SandboxSystem = SandboxSystem;

    return SandboxSystem;

});