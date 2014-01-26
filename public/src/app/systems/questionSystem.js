define([
    'cog',
    'questions/tree'
], function(cog, Tree) {

    var QuestionSystem = cog.System.extend({
        defaults: {
            firstName: "Pat",
            birthDate: 1988,
            gender: "girl",
            pronoun: "she",
            replace: null,
            pointer: "Basic1",
            setValue: null
        },

        configure: function(entities, events) {
            var t = document.getElementById("questions");

            this.replace = function(text) {
                text = text.split("{name}").join(this.firstName);
                text = text.split("{year}").join("" + this.birthDate);
                text = text.split("{pronoun}").join(this.pronoun);
                return text.charAt(0).toUpperCase() + text.slice(1);;
            }.bind(this);
            this.setValue = function(value) {
                var values = value.split(" ");
                switch(values[0]) {
                    case "gender":
                        if(values[1] === "girl") {
                            this.gender = "girl";
                            this.pronoun = "she";
                        } else {
                            this.gender = "guy";
                            this.pronoun = "he";
                        }
                }
            }.bind(this);

            t.innerText = this.replace(Tree.questions.Basic1.question);
        },

        update: function(entities, events) {

        },

        'button event': function(input) {
            var next = "";
            if(!Tree.questions[this.pointer].statement) {
                var answers = Tree.questions[this.pointer].answers;
                if(input === 'x') {
                    next = answers.agree.next;
                    if(answers.agree.command) {
                        this.setValue(answers.agree.command);
                    }
                } else if(input === 'o') {
                    next = answers.disagree.next;
                    if(answers.agree.command) {
                        this.setValue(answers.disagree.command);
                    }
                }
            }

            if(!next) {
                next = Tree.questions[this.pointer].next;
            }

            this.pointer = next;

            var t = document.getElementById("questions");

            t.innerText = this.replace(Tree.questions[this.pointer].question);
        }
    });

    cog.QuestionSystem = QuestionSystem;

    return QuestionSystem;
});