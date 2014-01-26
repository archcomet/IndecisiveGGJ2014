define([
    'jquery'

], function ($) {

    var PromptSystem = cog.System.extend('PromptSystem', {

        configure: function () {

            this.animatePrompt();

        },

        update: function () {

            this.animatePrompt();
        },

        animatePrompt: function () {
            var newq = this.createNewPosition();
            var $prompt = $("#prompt");
            $prompt.animate({ top: newq[0], left: newq[1]}, 7000);
            $prompt.animate({step: function() {
                $prompt.css('transform','rotate('+newq[2]+'deg)');
            }}, 100)

        },

        createNewPosition: function () {

            var h = $(window).height() - 400;
            var w = $(window).width() - 400;

            var nh = Math.floor(Math.random() * h);
            var nw = Math.floor(Math.random() * w);
            var na = Math.floor(Math.random() * 100);

            return [nh, nw, na];
        }

    });

    cog.PromptSystem = PromptSystem;

    return PromptSystem;

});