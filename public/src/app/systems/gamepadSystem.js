define([
    'cog',
    'gamepad',
    'components/shapeComponent'
], function(cog, Gamepad, ShapeComponent) {

    var GamepadSystem = cog.System.extend({

        defaults: {
            direction: {
                x: 0,
                y: 0
            },
            inputShape: null
        },

        configure: function(entities, events) {
            var gamepad = new Gamepad();

            gamepad.bind(Gamepad.Event.CONNECTED, function(device) {

            });

            gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {

            });

            gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(device) {
                switch(device.control) {
                    case "START_FORWARD":

                        if(this.stopped) {
                            game.start();
                            this.stopped = false;
                        }
                        else {
                            game.stop();
                            this.stopped = true;
                        }
                        break;
                    case "FACE_2":
                        this.inputShape = ShapeComponent.TYPE_CIRCLE;
                        break;
                    case "FACE_3":
                        this.inputShape = ShapeComponent.TYPE_SQUARE;
                        break;
                    case "FACE_4":
                        this.inputShape = ShapeComponent.TYPE_TRIANGLE;
                        break;
                }
            }.bind(this));

            gamepad.bind(Gamepad.Event.BUTTON_UP, function(device) {

            });

            gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(device) {
                switch(device.axis) {
                    case "LEFT_STICK_X":
                        this.direction.x = device.value < 0.5 && device.value > -0.5 ? 0 : device.value;
                        break;
                    case "LEFT_STICK_Y":
                        this.direction.y = device.value < 0.5 && device.value > -0.5 ? 0 : device.value;
                        break;
                }
            }.bind(this));

            if(!gamepad.init()) {
                // Game pad not supported.
            }
        },

        update: function(entities, events) {
            if(this.direction.x !== 0 || this.direction.y !== 0) {
                // dY is reversed
                events.emit("playerSeekDirection", this.direction.x, -this.direction.y);
            }

            if (this.inputShape !== null) {
                events.emit('playerChangeShape', this.inputShape);
                this.inputShape = null;
            }
        }
    });

    cog.GamepadSystem = GamepadSystem;

    return GamepadSystem;
});