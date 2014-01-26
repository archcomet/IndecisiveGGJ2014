define(
    {
        "questions": {
            "Basic1": {
                "question": "Meet {name}. That is you.",
                "input": true,
                "statement": true,
                "next": "Basic2"
            },
            "Basic2": {
                "question": "{name} was born in {year}.",
                "input": true,
                "statement": true,
                "next": "Basic3",
                "year": 0
            },
            "Basic3": {
                "question": "{name} was born a she.",
                "answers": {
                    "agree": {
                        "answer": "That's right.",
                        "command": "gender girl",
                        "position": "up"
                    },
                    "disagree": {
                        "answer": "That's wrong.",
                        "command": "gender guy",
                        "position": "left"
                    }
                },
                "next": "Baby1"
            },
            "Baby1": {
                "question": "{pronoun} learned to walk in {year}.",
                "statement": true,
                "next": "Baby2",
                "year": 1
            },

            "Baby2": {
                "question": "{name} lived in a very loving family.",
                "answers": {
                    "agree": {
                        "answer": "That's right.",
                        "next": "Baby3",
                        "position": "left"
                    },
                    "disagree": {
                        "answer": "That's wrong.",
                        "next": "Baby2_wrong",
                        "position": "right"
                    }
                }
            },
            "Baby2_wrong": {
                "question": "Oh. Sorry.",
                "statement": true,
                "next": "Baby3"
            },
            "Baby3": {
                "question": "Well, {pronoun} was a baby. Boring.",
                "statement": true,
                "next": "Baby4"
            },
            "Baby4": {
                "question": "Let's skip to childhood.",
                "statement": true,
                "next": "Childhood1"
            },
            "Childhood1": {
                "question": "Meet {name}. In {year}, {name} was at school.",
                "statement": true,
                "next": "Childhood2",
                "year": 7
            },
            "Childhood2": {
                "question": "During recess, {pronoun} played a lot with another kid, {friendName}.",
                "statement": true,
                "next": "Childhood3"
            },
            "Childhood3": {
                "question": "{friendName} was oftern very mean to {name}.",
                "statement": true,
                "next": "Childhood4"
            },
            "Childhood4": {
                "question": "One day, {friendName} lost her favorite toy, a doll. {name} really wanted that doll.",
                "statement": true,
                "next": "Childhood5"
            },
            "Childhood5": {
                "question": "That day, {name} found the doll on the floor.",
                "statement": true,
                "next": "Childhood6"
            },
            "Childhood6": {
                "question": "So {pronoun} kept it.",
                "answers": {
                    "agree": {
                        "answer": "That's true.",
                        "next": "Childhood7",
                        "position": "right"
                    },
                    "disagree": {
                        "answer": "No I didn't!",
                        "next": "Childhood6_wrong",
                        "position": "down"
                    }
                }
            },
            "Childhood6_wrong": {
                "question": "{name} gave the doll back. But {pronoun} was jealous of {friendName}. That's just as bad.",
                "statement": true,
                "next": "Childhood8"
            },
            "Childhood7": {
                "question": "That was mean.",
                "statement": true,
                "next": "Childhood8"
            },
            "Childhood8": {
                "question": "Let's skip to highschool.",
                "statement": true,
                "next": "Highschool1"
            },
            "Highschool1": {
                "question": "Meet {name}. In {year}, {name} was in highschool.",
                "statement": true,
                "next": "Highschool2",
                "year": 12
            },
            "Highschool2": {
                "question": "{pronoun} was a very good student.",
                "answers": {
                    "agree": {
                        "answer": "That's true.",
                        "next": "Highschool3",
                        "position": "left"
                    },
                    "disagree": {
                        "answer": "I always skipped class.",
                        "next": "Highschool2_wrong",
                        "position": "up"
                    }
                }
            },
            "Highschool3": {
                "question": "A nerd.",
                "statement": true,
                "next": "Highschool4"
            },
            "Highschool2_wrong": {
                "question": "Hippie.",
                "statement": true,
                "next": "Highschool4"
            },
            "Highschool4": {
                "question": "By the way, are you, hum...",
                "statement": true,
                "next": "Highschool5"
            },
            "Highschool5": {
                "question":  "Are you attracted to {otherGender}s?",
                "answers": {
                    "agree": {
                        "answer": "Yep.",
                        "command": "attraction other",
                        "position": "up"
                    },
                    "disagree": {
                        "answer": "Nope.",
                        "command": "attraction same",
                        "position": "left"
                    }
                },
                "next": "Highschool6"
            },
            "Highschool6": {
                "question": "In {year}, {name} had a huge crush on a {otherGender}. That {otherGender}'s name was {otherName}.",
                "year": 14,
                "statement": true,
                "next": "Highschool7"
            },
            "Highschool7": {
                "question": "{name} was thinking of that {otherGender}, like all the time.",
                "statement": true,
                "next": "Highschool8"
            },
            "Highschool8": {
                "question": "Like, OMG. All. The. Time.",
                "statement": true,
                "next": "Highschool9"
            },
            "Highschool9": {
                "question": "But {pronoun} never did anything about it.",
                "answers": {
                    "agree": {
                        "answer": "Yep.",
                        "next": "Highschool10",
                        "position": "right"
                    },
                    "disagree": {
                        "answer": "Nope.",
                        "next": "Highschool9_wrong",
                        "position": "down"
                    }
                }
            },
            "Highschool10": {
                "question": "Yet another thing to regret.",
                "statement": true,
                "next": "Highschool11"
            },
            "Highschool9_wrong": {
                "question": "Good for you!",
                "statement": true,
                "next": "Highschool9_wrong_2"
            },
            "Highschool9_wrong_2": {
                "question": "Are you guys still dating?",
                "answers": {
                    "agree": {
                        "answer": "Yep.",
                        "position": "left"
                    },
                    "disagree": {
                        "answer": "Nope.",
                        "position": "right"
                    }
                },
                "next": "Highschool11"
            },
            "Highschool11": {
                "question": "The following year was that atrocious exam {pronoun} failed.",
                "answers": {
                    "agree": {
                        "answer": "Yep.",
                        "position": "left"
                    },
                    "disagree": {
                        "answer": "Nope.",
                        "position": "right"
                    }
                },
                "next": "Highschool11"
            }
        }
    }
);
