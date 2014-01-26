define([
    'cog',
], function(cog) {

    var BackgroundSystem = cog.System.extend({

        configure: function(entities, events) {
        },

        update: function(entities, events) {
        },

        'addMood event': function(mood) {
            var bg = document.getElementById('background');
            var div = document.createElement('div');
            if(mood === 'positive') {
                div.style.backgroundColor = "#777";
            } else {
                div.style.backgroundColor = "#222";
            }
            div.style.width = "300px";
            div.style.height = "300px";
            bg.appendChild(div);
        }
    });

    cog.BackgroundSystem = BackgroundSystem;

    return BackgroundSystem;
});
