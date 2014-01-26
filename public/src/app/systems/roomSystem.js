define([
    'cog',
    'three',
    'components/threeComponent',
    'components/shapeComponent'

], function(cog, THREE, THREEComponent, ShapeComponent) {

    var DOORS= {

            NORTH: {
                xMin: -200,
                xMax: 200,
                yMin: 2500,
                yMax: 2900
            },

            EAST: {
                xMin: 4000,
                xMax: 4400,
                yMin: -200,
                yMax: 200
            },

            SOUTH: {
                xMin: -200,
                xMax: 200,
                yMin: -2900,
                yMax: -2500
            },

            WEST: {
                xMin: -4400,
                xMax: -4000,
                yMin: -200,
                yMax: 200
            }
    };


    var RoomSystem = cog.System.extend('RoomSystem', {

        configure: function(entities, events) {
            this.events = events;
        },

        exitRoom: function() {
            this.events.emit('despawnAll Enemy');
        },

        enterRoom: function(options) {

            var door = options.door || 'NORTH',
                doorsLeft = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

            var index = doorsLeft.indexOf(door);
            doorsLeft.splice(index, 1);

//
//            var i = 0,  n = options.triangleCount || 0;
//
//            for(; i < n; ++i) {
//                this.events.emit('spawn Enemy', {
//                    geometryType: ShapeComponent.TYPE_TRIANGLE,
//                    position: {
//                        x: cog.rand.arc4rand(-4000, 4000),
//                        y: cog.rand.arc4rand(-2500, 2500)
//                    }
//                });
//            }
        },


        'changeRoom event': function(options) {
            this.exitRoom();
            this.enterRoom(options);
        }


    });

    cog.RoomSystem = RoomSystem;

    return RoomSystem;

});