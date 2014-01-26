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
                "next": "Basic3"
            },
            "Basic3": {
                "question": "{name} as born a she.",
                "answers": {
                    "agree": {
                        "answer": "That's right.",
                        "command": "gender girl"
                    },
                    "disagree": {
                        "answer": "That's wrong.",
                        "command": "gender guy"
                    }
                },
                "next": "Baby1"
            },
            "Baby1": {
                "question": "{pronoun} learned to walk in {year}.",
                "statement": true,
                "next": "Baby2"
            },

            "Baby2": {
                "question": "{name} lived in a very loving family.",
                "answers": {
                    "agree": {
                        "answer": "That's right.",
                        "next": "Baby3"
                    },
                    "disagree": {
                        "answer": "That's wrong.",
                        "next": "Baby2_wrong"
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
                "next": "Childhood2"
            },
            "Childhood2": {
                "question": "During recess, {pronoun} always played with another kid, {namefriend}.",
                "statement": true,
                "next": "Childhood3"
            },
            "Childhood3": {
                "question": "{namefriend} was oftern very mean to {name}.",
                "statement": true,
                "next": "Childhood4"
            }
        }
    }
);