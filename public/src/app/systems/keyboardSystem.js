define([
    'cog',
    'components/shapeComponent'

], function(cog, ShapeComponent) {

    var KeyboardSystem = cog.System.extend({

        defaults: {
            direction: {
                x: 0,
                y: 0
            },
            inputShape: null
        },

        configure: function(entities, events) {
            document.addEventListener ('keydown', this._handleInput.bind(this), true);
            document.addEventListener ('keyup', this._handleInput.bind(this), true);
        },

        _handleInput: function (event) {

            var multiplyer = (event.type == "keyup" ? 0 : 1);

            switch (event.keyCode) {
                case 87: // w
                    this.direction.y = 1 * multiplyer;
                    break;
                case 83: // s
                    this.direction.y = -1 * multiplyer;
                    break;
                case 65: // a
                    this.direction.x = -1 * multiplyer;
                    break;
                case 68: // d
                    this.direction.x = 1 * multiplyer;
                    break;
                case 74: // j
                    this.inputShape = ShapeComponent.TYPE_SQUARE;
                    break;
                case 75: // k
                    this.inputShape = ShapeComponent.TYPE_TRIANGLE;
                    break;
                case 76: // l
                    this.inputShape = ShapeComponent.TYPE_CIRCLE;
                    break;
                default:
                    break;
            }

        },

        update: function(entities, events) {
            if(this.direction.x !== 0 || this.direction.y !== 0) {
                // dY is reversed
                events.emit("playerSeekDirection", this.direction.x, this.direction.y);
            }

            if (this.inputShape !== null) {
                events.emit('playerChangeShape', this.inputShape);
                this.inputShape = null;
            }
        }
    });

    cog.KeyboardSystem = KeyboardSystem;

    return KeyboardSystem;
});