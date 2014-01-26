define([
    'cog',
    'questions/tree'
], function(cog, Tree) {

    var QuestionSystem = cog.System.extend({
        defaults: {
            firstName: "Alex",
            birthDate: 1988,
            gender: "girl",
            otherGender: "guy",
            pronoun: "she",
            otherPronoun: "she",
            replace: null,
            pointer: "Basic1",
            setValue: null,
            friendName: "Sam",
            currentDate: 1988,
            otherName: "Robert"
        },

        configure: function(entities, events) {
            function gup (name) {
                // Taken from stack overflow
                name = RegExp ('[?&]' + name.replace (/([[\]])/, '\\$1') + '=([^&#]*)');
                return (window.location.href.match (name) || ['', ''])[1];
            }
            this.firstName = gup("name") || "Claire";
            this.birthDate = parseInt(gup("birthdate") || 1988);

            var t = document.getElementById("questions");

            this.replace = function(text) {
                text = text.split("{name}").join(this.firstName);
                text = text.split("{year}").join("" + this.currentDate);
                text = text.split("{pronoun}").join(this.pronoun);
                text = text.split("{friendName}").join(this.friendName);
                text = text.split("{otherGender}").join(this.otherGender);
                text = text.split("{otherPronoun}").join(this.otherPronoun);
                text = text.split("{otherName}").join(this.otherName);
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
                        break;
                    case "attraction":
                        if(values[1] === "other") {
                        } else {
                            this.otherGender = this.gender;
                            this.otherPronoun = this.pronoun;
                        }
                        break;
                }
            }.bind(this);

            events.emit("changeQuestion", this.replace(Tree.questions.Basic1.question));
        },

        update: function(entities, events) {

        },

        'door event': function(choice, events) {
            var next = "";
            if(Tree.questions[this.pointer].answers) {
                var answers = Tree.questions[this.pointer].answers;
                if(choice === answers.agree.position) {
                    next = answers.agree.next;
                    if(answers.agree.command) {
                        this.setValue(answers.agree.command);
                    }
                } else if(choice === answers.disagree.position) {
                    next = answers.disagree.next;
                    if(answers.agree.command) {
                        this.setValue(answers.disagree.command);
                    }
                } else {
                    return;
                }
            }

            if(!next) {
                next = Tree.questions[this.pointer].next;
            }

            if(!next) {
                return;
            }

            if(Tree.questions[next].year) {
                this.currentDate = this.birthDate + Tree.questions[next].year;
            }

            this.pointer = next;

            var doorStr = "";
            switch(choice) {
                case "up":
                    doorStr = "SOUTH";
                    break;
                case "left":
                    doorStr = "WEST";
                    break;
                case "right":
                    doorStr = "EAST";
                    break;
                case "down":
                    doorStr = "NORTH";
                    break;
            }

            events.emit("changeQuestion", this.replace(Tree.questions[this.pointer].question));
            if(Tree.questions[this.pointer].answers) {
                events.emit("changeAnswer", Tree.questions[this.pointer].answers.agree.position, Tree.questions[this.pointer].answers.agree.answer);
                events.emit("changeAnswer", Tree.questions[this.pointer].answers.disagree.position, Tree.questions[this.pointer].answers.disagree.answer);
            } else {
                events.emit("changeAnswer", "up", "");
                events.emit("changeAnswer", "down", "");
                events.emit("changeAnswer", "left", "");
                events.emit("changeAnswer", "right", "");
            }
            events.emit('changeRoom', { door: doorStr, enemyCount: Tree.questions[this.pointer].spawn });
            events.emit("addMood");
        },

        'roomClear event': function() {
            console.log('cleared the room');
        }
    });

    cog.QuestionSystem = QuestionSystem;

    return QuestionSystem;
});