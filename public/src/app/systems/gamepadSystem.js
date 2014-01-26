define([
    'cog',
    'gamepad'
], function(cog, Gamepad) {

    var GamepadSystem = cog.System.extend({

        defaults: {
            direction: {
                x: 0,
                y: 0
            }
        },

        configure: function(entities, events) {
            var gamepad = new Gamepad();

            gamepad.bind(Gamepad.Event.CONNECTED, function(device) {

            });

            gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {

            });

            gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(device) {
                var value = "";
                switch(device.control) {
                    case "FACE_1":
                        value = "x";
                        break;
                    case "FACE_2":
                        value = "o";
                        break;
                }
                if(value !== "") {
                    events.emit("button", value);
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
        }
    });

    cog.GamepadSystem = GamepadSystem;

    return GamepadSystem;
});