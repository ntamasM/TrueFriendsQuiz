# Claude Prompt: True Friends Quiz Question Audit

Act as an expert party game designer and content writer. I am developing a multiplayer trivia/party game called "True Friends Quiz" where one player (the Target) answers a personal question, and the other players try to guess what the Target chose.

The game features the following categories: `favorites`, `personality`, `wouldYouRather`, `deepPersonal`, `funRandom`, `experiencesDreams`, `deepSpicy`, `hotTakes`, `hypothetical`, `memories`, `relationships`, `moneyPower`, `darkSecrets`, `bodyCount`, `neverHaveIEver`, `afterDark`, `guilty`, `drunkConfessions`, `conspiracyTheories`, and `superlatives`.

## The Problem:

I have realized that some of my questions have "obvious" or "cop-out" answers that ruin the core mechanic of the game. For example, in a "Would You Rather" question like _"Would {name} rather be famous or rich?"_, having the options `["Famous", "Rich", "Both", "Neither"]` is bad game design because "Both" is an obvious, universally desirable answer. It removes the tension of forcing a difficult choice.

Good questions in this genre must have options that are mutually exclusive, equally tempting (or equally terrible), and reveal something specific about the person's personality rather than basic human nature.

## Your Task:

I want you to help me create a comprehensive plan to audit and fix my existing question database.

Please provide the following:

1. **Evaluation Criteria:** Define a strict set of rules for what makes a "good" vs. "bad" set of multiple-choice answers for this specific type of party game.
2. **Common Pitfalls:** Identify other common mistakes I might have made in the answers (e.g., overlapping answers, culturally specific answers that don't translate well, objectively "correct" moral choices).
3. **The Fix Strategy (The Plan):** Give me a step-by-step plan on how we will process my JSON files. How should I feed the data to you, and how will you return the corrected versions?
4. **Examples:** Rewrite the "Famous vs. Rich" example above to demonstrate your game design skills. Give me 3 different variations of how that specific question could be rewritten to force a difficult, balanced choice.

Once we agree on this plan, I will start pasting my JSON question blocks for you to evaluate and fix.
