# True Friends Quiz — v2.1.0-beta Plan

**Status:** Planning
**Based on:** AirConsole Senior Producer Review (Andreas, March 2026)
**Building on top of:** v2.0.0 (React + TypeScript)

---

## Review Summary

Andreas from AirConsole gave three concrete improvement areas:

1. **Visual Polish** — The game needs more refinement and a more engaging visual experience.
2. **"Gamey" Feel** — Stronger feedback, progression, and playful elements to enhance competition and achievement.
3. **Category Control** — Let players choose or influence the category of questions during gameplay.

---

## Improvement Area 1: Visual Polish

### Goal

Make the game feel premium, lively, and visually cohesive — not just functional.

### Planned Changes

#### 1.1 Consistent Design System

- Define a clear color palette (primary, secondary, accent, background, surface) as CSS variables
- Standardize typography scale (font sizes, weights, line heights) across screen and controller
- Create consistent spacing tokens (padding, margin, gap) across all components
- Apply uniform border-radius strategy throughout

#### 1.2 Background & Atmosphere

- Add an animated or textured background to the screen (subtle particle system, gradient animation, or illustrated scene)
- Remove flat/plain backgrounds in favor of layered depth (background → content cards → foreground elements)
- Add atmospheric lighting effects (subtle glow, shadows on cards)

#### 1.3 Component Polish

- **Question cards**: More stylized presentation — larger font, better contrast, category color coding
- **Player avatars**: Add border/ring effects per player color; animate on join
- **Score displays**: Styled number counters, player-colored score badges
- **Buttons**: Consistent hover/active/press states with subtle animations
- **Category badges**: More visually distinct — icon + color per category

#### 1.4 Phase-Specific Improvements

- **Lobby**: Animated player join notifications; styled "waiting for players" state
- **Picking**: Show countdown timer with animated ring/bar; host highlight effect
- **Reveal**: More dramatic reveal animation — flip card, slide-in, or staggered reveal
- **Leaderboard**: Enhanced podium with animated rankings, trophy icon for 1st place, better spacing

#### 1.5 Transitions & Micro-animations

- Smooth phase transition animations (fade, slide, or scale between phases)
- Number count-up animation when scores update on Reveal
- Button press feedback (scale down on touch, ripple effect)
- Loading/waiting states with animated indicators instead of static text

#### 1.6 Controller UI Polish

- Consistent button styling across all controller views
- Clear visual hierarchy for the active action (big, obvious tap target)
- Phase-appropriate color themes (e.g., warm colors for picking, cool for guessing)
- Better "waiting" state designs — not just text, but an animated idle state

---

## Improvement Area 2: "Gamey" Feel — Stronger Feedback, Progression & Competition

### Goal

Make every action feel rewarding. Players should feel the stakes, excitement, and sense of competition throughout.

### Planned Changes

#### 2.1 Enhanced Feedback Loops

**Correct/Wrong Answer Feedback**

- Full-screen flash effect on reveal (green for correct, red for wrong) on controllers
- Sound effects: distinct correct-answer chime, wrong-answer buzz, timeout sound
- Controller vibration patterns: short double-buzz for correct, long single buzz for wrong

**Scoring Moments**

- Animated score pop-up (+100!) on Reveal for each correct guesser
- Point total counter animates up (count-up effect) after each round
- "Streak" indicator if a player guesses correctly multiple rounds in a row

#### 2.2 Progression & Round Structure

**Round Progress Bar**

- Persistent progress indicator on screen showing current round / total rounds
- Visual "chapter" markers so players know how far through the game they are

**"Hot Seat" Indicator**

- When it's a player's turn as host: larger avatar, glowing highlight, name announcement animation
- Other players' controllers show whose turn it is with that player's profile color

**Mid-Game Leaderboard Peek**

- After each Reveal, briefly show a mini leaderboard (top 3) before advancing
- Players always know their current rank relative to others

#### 2.3 Playful Competition Elements

**Player Taunting / Reactions (Optional)**

- During Guessing phase, players can send a quick emoji reaction (👆 "I know!", 🤔 "Hmm...")
- Reactions appear on screen briefly above the player's avatar

**Speed Bonus**

- Players who answer faster get a small bonus (e.g., first to answer correctly gets +20 extra points)
- Visual indicator on screen showing who answered first

**"Last Chance" Tension**

- When the guessing timer hits the last 5 seconds, add urgency: red timer, pulsing animation, tension sound effect

#### 2.4 End-of-Game Celebrations

**Winner Celebration**

- Full confetti burst for 1st place (already partially implemented — enhance)
- Winner's name animates prominently
- Controller for 1st place shows a trophy/crown animation with haptic buzz

**Per-Player Stats Screen**

- After final leaderboard: show fun stats per player
  - "You guessed X/Y rounds correctly"
  - "You stumped everyone on [question topic]"
  - "Best guesser of the night: [name]"

---

## Improvement Area 3: Player Category Control

### Goal

Give players more agency over what kind of questions are asked, making the game feel more personalized and giving the host a meaningful choice.

### Planned Changes

#### 3.1 Host Category Vote (Primary Feature)

**How it works:**

- During the **Picking phase**, before the host sees the 4 questions, the host selects a **preferred category** from a small set (2–3 options shown)
- The 4 candidate questions shown to the host are then drawn from that chosen category
- This gives the host real control over the tone of their round

**Implementation:**

- Add a `category_vote` sub-step inside the Picking phase
- Screen shows: "[Host] is choosing a category..."
- Host controller shows: 2–3 category buttons (e.g., "Fun & Random", "Deep & Personal", "Would You Rather")
- After category selection, proceed to the existing question-picking flow but filtered by that category

**UX considerations:**

- Category options should have distinct icons/colors so they feel like a real choice
- Keep it quick — this should take ~5 seconds max, so show only 2–3 options, not all categories
- Fallback: if selected category has fewer than 4 unused questions, expand to adjacent categories automatically

#### 3.2 Audience Category Influence (Secondary / Optional)

**How it works:**

- While the host is picking their category, other players can each "vote" for a category they want
- The category with the most votes is shown to the host as a "Popular Choice" hint
- The host still has final say — this is influence, not control

**Implementation:**

- During the category selection step, broadcast a vote request to all non-host controllers
- Non-host controllers show: "Vote for the category you want to see!"
- After 5 seconds, tally votes, highlight the winning category on the host's screen as a suggestion

#### 3.3 Pre-Game Category Configuration (Enhancement to Existing)

- The existing pre-game category toggles (v2.0.0) are already available to the game master
- Improve the UI: show a preview of how many questions are available per category after toggling
- Add a "Reset to Default" button for category settings

---

## Implementation Priority & Phases

### Phase A — Quick Wins (High Impact, Low Effort)

These can be done first for immediate improvement:

1. **Visual**: CSS variable design system + consistent spacing/typography
2. **Visual**: Phase transition animations (fade between phases)
3. **Gamey**: Score pop-up animation on Reveal (+100! counter)
4. **Gamey**: Round progress bar on screen
5. **Gamey**: Last-5-second timer urgency effect (color + pulse)
6. **Category**: Host category vote in Picking phase (core feature)

### Phase B — Medium Effort Improvements

7. **Visual**: Enhanced Reveal animation (staggered/flip reveal)
8. **Visual**: Animated background on screen
9. **Gamey**: Mid-game mini leaderboard after each Reveal
10. **Gamey**: Speed bonus for first correct answer
11. **Gamey**: "Hot seat" host highlight animation
12. **Category**: Category vote count-up / popular choice hint from other players

### Phase C — Polish & Delight (Lower Priority, High Delight)

13. **Visual**: Player avatar join animations in Lobby
14. **Gamey**: Per-player end-of-game fun stats
15. **Gamey**: Emoji reactions during Guessing phase
16. **Visual**: Controller phase-specific color themes
17. **Gamey**: Streak indicator for consecutive correct guesses

---

## Files Most Likely to Change

| File                                | Reason                                            |
| ----------------------------------- | ------------------------------------------------- |
| `src/screen/phases/Picking.tsx`     | Category vote sub-step                            |
| `src/screen/phases/Reveal.tsx`      | Score animations, staggered reveal                |
| `src/screen/phases/Leaderboard.tsx` | Enhanced celebration, stats                       |
| `src/screen/phases/Guessing.tsx`    | Timer urgency, emoji reactions                    |
| `src/screen/phases/Lobby.tsx`       | Player join animations                            |
| `src/shared/styles/screen.css`      | Design system, transitions                        |
| `src/shared/styles/controller.css`  | Controller polish                                 |
| `src/shared/types.ts`               | New types for category votes                      |
| `src/screen/gameLogic.ts`           | Speed bonus, streak tracking, category vote logic |
| `src/controller/views/`             | All controller views need polish                  |

---

## Notes for Implementation

- **Category vote should not slow the game down** — keep the interaction under 10 seconds total (5s to pick category + existing question pick time)
- **Sound effects** — check AirConsole guidelines for audio; confirm formats and file size limits
- **Performance** — animations should use CSS transforms (not layout-triggering properties) to stay at 60fps on mobile
- **Accessibility** — ensure touch targets remain ≥44px on controllers after visual changes
- **Backwards compatibility** — the AirConsole message protocol from v2.0.0 may need new message types for category votes; ensure old controllers gracefully handle unknown messages
