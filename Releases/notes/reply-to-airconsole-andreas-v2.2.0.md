Subject: Re: True Friends Quiz — feedback addressed (v2.2.0)

Hi Andreas,

No worries at all about the delay — thank you for taking the time to test the
game again with the wider group, and for the detailed notes. They were really
helpful. I've just submitted a new build (v2.2.0) that addresses your points;
here's a quick rundown.

1) Audio
You were right — there was no sound. It turned out the music files were being
requested from the wrong path in the production build, so they silently failed
to load. That's now fixed, and music also starts right away on the waiting/lobby
screen rather than only after the game begins. For this build I've focused on
getting background music working reliably; button/action sound effects are next
on my list and I'll add them in a follow-up.

2) Language consistency
Good catch, and thanks for the clear suggestion. Every player's phone now
follows the language selected on the main screen — both the interface and the
questions — so there's no more mix of languages across devices. (This adjusts
the per-device language behavior from the previous review; matching the screen
felt like the most consistent experience for everyone at the same couch.)

3) Category voting
I've kept the category-voting step, but with two things that should keep it from
slowing the game down: first, it's optional — the host can switch it off in
settings for an even faster flow in larger groups. Second, the active player
doesn't have to wait for everyone to vote — there's a 5-second countdown, after
which they can lock in the category right away even if some players haven't voted
yet. That keeps the pace moving in bigger groups. If you feel it still drags even
with those, I'm very happy to revisit it.

4) Picking a question
This is now much snappier, along the lines you suggested. Instead of showing four
questions, the game auto-assigns one and the active player can simply use it or
reroll (up to 5 times). I also leaned into the social angle: each question is
shown on the main screen as it's rolled, so everyone can see it and shout for the
one they want the player to answer. It keeps the pace up while making the moment
more fun for the whole group.

Everything is in the new build and ready for another look whenever your team has
time. I'm happy to jump on a call or clarify any of the above.

Thanks again for the thoughtful feedback — it's genuinely making the game better.

Best,
Manolis
