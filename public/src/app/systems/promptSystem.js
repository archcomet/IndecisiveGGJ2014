define([
    'cog',
    'jquery',
    'jquery.easing'

], function (cog, $) {

    var PromptSystem = cog.System.extend('PromptSystem', {

        defaults: {

            animateCount: 0
        },

        configure: function () {

            this.animatePrompt();
        },

        update: function () {

            this.animatePrompt()
        },


        animatePrompt: function () {


            if (this.animateCount) { //A count can be put here if we need to throttle how often this gets called.
                var $prompt = $("#prompt"),
                    defLeft = (window.innerWidth / 2 - 250),
                    defTop = (window.innerHeight / 2 - 150),
                    maxLeft = 200,
                    maxTop = 100,
                    leftPos = defLeft + (Math.random() - 0.5) * maxLeft,
                    topPos = defTop + (Math.random() - 0.5) * maxTop;

                $prompt.animate({
                    left: leftPos,
                    top: topPos
                }, {
                    duration: 8000,
                    easing: "easeInOutSine"
                });
                this.animateCount = 0;
            }
            else {
                this.animateCount++
            }
        },

        'changeText event': function(text) {
            document.getElementById("prompt").innerText = text;
        }

    });

    cog.PromptSystem = PromptSystem;

    return PromptSystem;

});