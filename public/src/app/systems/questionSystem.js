define([
    'cog',
    'questions/tree'
], function(cog, Tree) {

    var QuestionSystem = cog.System.extend({
        defaults: {
            firstName: "Claire",
            birthDate: 1988,
            gender: "girl",
            otherGender: "guy",
            pronoun: "she",
            otherPronoun: "she",
            replace: null,
            pointer: "Basic1",
            setValue: null,
            friendName: "Pat",
            currentDate: 1988,
            otherName: "Robert"
        },

        configure: function(entities, events) {
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

            //t.innerText = this.replace(Tree.questions.Basic1.question);
            events.emit("changeQuestion", this.replace(Tree.questions.Basic1.question));
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

            if(Tree.questions[next].year) {
                this.currentDate = this.birthDate + Tree.questions[next].year;
            }

            this.pointer = next;

            var t = document.getElementById("questions");

            t.innerText = this.replace(Tree.questions[this.pointer].question);
        },

        'door event': function(choice, events) {
            var next = "";
            if(!Tree.questions[this.pointer].statement) {
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

            //var t = document.getElementById("questions");
            //t.innerText = this.replace(Tree.questions[this.pointer].question);

            events.emit("changeQuestion", this.replace(Tree.questions[this.pointer].question));
            if(!Tree.questions[this.pointer].statement) {
                events.emit("changeAnswer", Tree.questions[this.pointer].answers.agree.position, Tree.questions[this.pointer].answers.agree.answer);
                events.emit("changeAnswer", Tree.questions[this.pointer].answers.disagree.position, Tree.questions[this.pointer].answers.disagree.answer);
            } else {
                events.emit("changeAnswer", "up", "");
                events.emit("changeAnswer", "down", "");
                events.emit("changeAnswer", "left", "");
                events.emit("changeAnswer", "right", "");
            }
            events.emit("addMood");
        },

        'roomClear event': function() {
            console.log('cleared the room');
        }
    });

    cog.QuestionSystem = QuestionSystem;

    return QuestionSystem;
});