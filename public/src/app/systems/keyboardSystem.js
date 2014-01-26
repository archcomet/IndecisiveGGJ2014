define([
    'cog'

], function(cog) {

    var KeyboardSystem = cog.System.extend({

        defaults: {
            direction: {
                x: 0,
                y: 0
            }
        },

        configure: function(entities, events) {
            document.addEventListener ('keydown', this._handleInput.bind(this), true);
            document.addEventListener ('keyup', this._handleInput.bind(this), true);
        },

        _handleInput: function (event) {

            var multiplyer = (event.type == "keyup" ? 0 : 1);

            switch (event.keyCode) {
                case 87: // w
                    this.direction.y = .5 * multiplyer;
                    break;
                case 83: // s
                    this.direction.y = -.5 * multiplyer;
                    break;
                case 65: // a
                    this.direction.x = -.5 * multiplyer;
                    break;
                case 68: // d
                    this.direction.x = .5 * multiplyer;
                    break;
                default:
                    break;

            };
        },

        update: function(entities, events) {
            if(this.direction.x !== 0 || this.direction.y !== 0) {
                // dY is reversed
                events.emit("playerSeekDirection", this.direction.x, this.direction.y);
            } else {
                events.emit("playerStop");
            }
        }
    });

    cog.KeyboardSystem = KeyboardSystem;

    return KeyboardSystem;
});