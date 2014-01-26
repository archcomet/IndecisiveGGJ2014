define([
    'jquery',
    'jquery.easing'

], function ($) {

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
                    maxLeft = window.innerWidth / 2,
                    maxTop = window.innerHeight / 2,
                    leftPos = Math.floor(Math.random() * maxLeft),
                    topPos = Math.floor(Math.random() * maxTop);


                $prompt.animate({
                    left: leftPos,
                    top: topPos
                }, {
                    duration: 3000,
                    easing: "easeInOutSine"
                });
                this.animateCount = 0;
            }
            else {
                this.animateCount++
            }
        }





    });

    cog.PromptSystem = PromptSystem;

    return PromptSystem;

});