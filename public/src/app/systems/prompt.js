define([
    'jquery'

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


            if (this.animateCount === 60) {
                var $prompt = $("#prompt"),
                    theContainer = $("#container"),
                    maxLeft = theContainer.width()/5,
                    maxTop = theContainer.height()/5,
                    leftPos = Math.floor(Math.random() * maxLeft),
                    topPos = Math.floor(Math.random() * maxTop);


                $prompt.animate({
                    left: leftPos,
                    top: topPos
                }, 1000);
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