define(function() {

    var math = {

        vectorAngle: function (v1, v2) {
            return Math.acos((v1.x * v2.x + v1.y * v2.y) /
                Math.sqrt((v1.x * v1.x + v1.y * v1.y) * (v2.x * v2.x + v2.y * v2.y)));
        },

        vectorLength: function (v) {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        },

        vectorSquaredLength:function (v) {
            return v.x * v.x + v.y * v.y;
        },

        vectorNorm: function (v) {

            var invLength, length = math.vectorLength(v);
            if (length < Number.MIN_VALUE) {
                return {
                    x: 0,
                    y: 0
                };
            }
            invLength = 1.0 / length;
            return {
                x: v.x * invLength,
                y: v.y * invLength
            };
        }
    };

    return math;

});