define([
    'cog',
    'three',
    'components/threeComponent',
    'components/shapeComponent'

], function(cog, THREE, THREEComponent, ShapeComponent) {

    var DOORS = {

            NORTH: {
                xMin: -200,
                xMax: 200,
                yMin: 2200,
                yMax: 2500
            },

            EAST: {
                xMin: 3700,
                xMax: 4000,
                yMin: -200,
                yMax: 200
            },

            SOUTH: {
                xMin: -200,
                xMax: 200,
                yMin: -2500,
                yMax: -2200
            },

            WEST: {
                xMin: -4000,
                xMax: -3700,
                yMin: -200,
                yMax: 200
            }
    };


    var RoomSystem = cog.System.extend('RoomSystem', {

        defaults: {
            enemyCount: 0,
            roomActive: false,
            options: null
        },

        configure: function(entities, events) {
            this.events = events;
        },

        update: function(entities, events, dt) {
           if (this.enemyCount === 0 && this.roomActive) {
               events.emit('roomClear');
               this.roomActive = false;
           }
        },

        exitRoom: function() {
            this.events.emit('despawnAll Enemy');
        },

        enterRoom: function(options) {

            var door = 'NORTH',
                doorsLeft = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

            if (options && options.door) {
                door = options.door;
            }

            doorsLeft.splice( doorsLeft.indexOf(door), 1);

            if (options && options.enemyCount > 0) {

                var i = 0,
                    n = options.enemyCount;

                for(; i < n; ++i) {
                    this.events.emit('spawn Enemy', {
                        position: this.getRandomDoorPosition(doorsLeft)
                    });
                }

                this.roomActive = true;
                this.enemyCount = n;
            }
        },

        getRandomDoorPosition: function(doorsLeft) {
            var door = doorsLeft[cog.rand.arc4randInt(0, doorsLeft.length-1)],
                doorBox = DOORS[door];

            return {
                x: cog.rand.arc4rand(doorBox.xMin, doorBox.xMax),
                y: cog.rand.arc4rand(doorBox.yMin, doorBox.yMax)
            }
        },


        'changeRoom event': function(options) {
            this.exitRoom();
            this.enterRoom(options);
            this.options = options;
        },

        'despawn Enemy event': function() {

            this.enemyCount--;
        }

    });

    cog.RoomSystem = RoomSystem;

    return RoomSystem;

});