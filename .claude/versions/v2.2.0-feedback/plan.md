# Plan — AirConsole QA Feedback (Andreas, June 2026)

> **Executor note (Haiku):** Follow every step literally. Exact file paths, line
> anchors, and full code blocks are provided. Do NOT invent extra changes. After
> all tasks, run the verification in the last section. All edits use the existing
> code style (2-space indent, double quotes, TypeScript).

## Decisions already made by the product owner

| Feedback item | Decision |
|---|---|
| No audio plays despite the sound toggle | **Fix music playback only** (NO sound effects added) |
| Mixed languages on phones | **Force the screen's language onto all phones** (UI + questions) |
| Category voting is slow in big groups | **No change** — leave it exactly as it is |
| Four questions to choose from | **Auto-assign one question + a "Reroll" button** |

There are **3 work tasks**: Task 1 (music), Task 2 (language), Task 3 (reroll).
Tasks are independent and can be done in any order.

---

## Background facts (already verified — do not re-investigate)

- `vite.config.ts` uses `base: "./"`. Every other asset reference in the app uses
  `` `${import.meta.env.BASE_URL}Assets/...` ``. Only `musicManager.ts` uses
  root-absolute `/Assets/...` paths — these **404 in the deployed AirConsole
  build**, which is why no music ever plays. This is the primary music bug.
- All 7 locales (`en, el, es, fr, de, tr, ar`) have **identical question IDs and
  index-aligned answers** (e.g. EN `["Red","Blue",...]` == DE `["Rot","Blau",...]`
  in the same order). Gameplay is index-based, so forcing one shared language is
  safe.
- The screen already includes a `language` field in almost every message it sends
  to controllers. Controllers currently **ignore it** and instead auto-detect the
  phone's own browser language — that is the source of the mixed-language bug.

---

# TASK 1 — Fix background music

## 1A. Fix the asset paths (the real bug)

**File:** `src/screen/musicManager.ts`

Replace the top `TRACKS` constant (lines 1–5):

```ts
const TRACKS = [
  "/Assets/music/Compressed/BackgroundMusic1.ogg",
  "/Assets/music/Compressed/BackgroundMusic2.ogg",
  "/Assets/music/Compressed/BackgroundMusic3.ogg",
];
```

with:

```ts
const BASE = import.meta.env.BASE_URL;
const TRACKS = [
  `${BASE}Assets/music/Compressed/BackgroundMusic1.ogg`,
  `${BASE}Assets/music/Compressed/BackgroundMusic2.ogg`,
  `${BASE}Assets/music/Compressed/BackgroundMusic3.ogg`,
];
```

> Leave the `.ogg` format unchanged. Music plays on the **screen** (Chrome on
> AirConsole), which supports OGG fine. (OGG would be a problem only on iPhone
> controllers — but we are not adding any phone audio.)

## 1B. Diagnose & soften the second failure (autoplay)

There are **two separate music failures** — keep them straight:

- **Failure A — wrong asset path (production):** the old `/Assets/...` paths 404
  in the deployed AirConsole build (served from a sub-path). This is what
  Andreas's QA saw as "no audio." **Fixed entirely by 1A.** In real AirConsole the
  screen iframe permits autoplay (official AirConsole games have screen music), so
  once the files load, music plays.
- **Failure B — autoplay policy (local symptom):** `musicManager.play()` runs
  from a network-message promise callback with **no user gesture on the screen
  document**, so Chrome may reject `audio.play()` with `NotAllowedError` and the
  empty `.catch` hides it. This is the most likely cause of the "music doesn't
  start at game start" symptom **when testing locally** (`pnpm dev` in a browser
  tab you never clicked inside). It generally does NOT affect real AirConsole.

> ⚠️ **Important limitation, read before implementing:** On AirConsole the
> **screen never receives any pointer/keyboard/touch events** — every gesture
> happens on the phones. So the `window`-listener "unlock on first interaction"
> code below is a **best-effort safety net only** (it helps in the local dev tab
> and any context where the screen does get input). It is **not** a guaranteed
> production fix, and production correctness comes from 1A + AirConsole's iframe
> allowing autoplay. Do **not** present this as "the autoplay fix."

**Step 1 — diagnose first (do this before deciding 1B is even needed).**
Temporarily change the empty catch in `playTrack` to log the reason, run
`pnpm dev`, start a game, and watch the **screen** browser console:

```ts
    audio.play().catch((e) => console.warn("[music] play blocked:", e?.name));
```

- Clean play, no warning → the path bug (1A) was the whole story. You may skip the
  listener code below (still apply Step 3's tidy `catch`).
- `NotAllowedError` logged → autoplay is also in play locally; apply the
  best-effort listener net below, and note in the handoff that a real-device check
  on AirConsole is still required to confirm production audio.

**Step 2 (best-effort net) — File:** `src/screen/musicManager.ts`

1. Replace the `playTrack` method (currently lines 62–72):

```ts
  private playTrack(): void {
    if (this.playlist.length === 0) return;
    this.stop();
    const src = this.playlist[this.index % this.playlist.length]!;
    this.lastTrack = src;
    const audio = new Audio(src);
    audio.volume = VOLUME;
    audio.addEventListener("ended", this.handleEnded);
    this.audio = audio;
    audio.play().catch(() => {});
  }
```

with:

```ts
  private playTrack(): void {
    if (this.playlist.length === 0) return;
    this.stop();
    const src = this.playlist[this.index % this.playlist.length]!;
    this.lastTrack = src;
    const audio = new Audio(src);
    audio.volume = VOLUME;
    audio.addEventListener("ended", this.handleEnded);
    this.audio = audio;
    audio.play().catch((err) => {
      // Autoplay blocked (no user gesture yet) → retry on first interaction.
      if (err && err.name === "NotAllowedError") {
        this.armUnlock();
      }
    });
  }

  private readonly unlockEvents = ["pointerdown", "keydown", "touchstart"];

  private unlockHandler = (): void => {
    this.removeUnlock();
    if (this.enabled) this.audio?.play().catch(() => {});
  };

  private armUnlock(): void {
    for (const e of this.unlockEvents) {
      window.addEventListener(e, this.unlockHandler);
    }
  }

  private removeUnlock(): void {
    for (const e of this.unlockEvents) {
      window.removeEventListener(e, this.unlockHandler);
    }
  }
```

2. In the `stop()` method (currently lines 36–43), also tear down any armed
   unlock listeners. Change the body so the first line of `stop()` calls
   `this.removeUnlock();`:

```ts
  stop(): void {
    this.removeUnlock();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.removeEventListener("ended", this.handleEnded);
      this.audio = null;
    }
  }
```

> No other files change for Task 1. The existing call sites
> (`musicManager.play()` in `useScreenAirConsole.ts` at the `start_game`,
> `play_again`, and `toggle_music` handlers) already do the right thing once the
> paths resolve.

---

# TASK 2 — Force the screen's language onto all phones

**Goal:** every controller (phone) uses the language selected on the TV for both
its UI text **and** the question/answer text. Remove the per-phone browser
auto-detect.

## 2A. Add a dedicated `set_language` message type

**File:** `src/shared/types.ts`

In the `ScreenToControllerMessage` union (starts line 55), add this member. Put it
right after the `pick_category_update` member (after line 133, before the
`emoji_broadcast` member):

```ts
  | {
      action: "set_language";
      language: string;
    }
```

## 2B. Controller adopts the screen's language from any message

**File:** `src/controller/useControllerAirConsole.ts`

1. **Remove the phone browser auto-detect.** In `ac.onReady` delete the entire
   block (currently lines 35–46):

```ts
      // Auto-detect language
      const browserLang = (navigator.language || "en")
        .substring(0, 2)
        .toLowerCase();
      if (
        SUPPORTED_LANGUAGES.includes(browserLang as LanguageCode) &&
        browserLang !== stateRef.current.language
      ) {
        loadLanguage(browserLang as LanguageCode).then(() => {
          dispatch({ type: "SET_LANGUAGE", language: browserLang });
        });
      }
```

   (Leave the rest of `onReady` — device info, master detection,
   `updatePlayerIndex()` — intact.)

2. **Adopt the language carried by any incoming message.** Inside
   `ac.onMessage`, the `process` function begins at line 76 with
   `const process = () => {`. Insert this adoption check as the **first thing
   inside `process`**, before the `switch (data.action)`:

```ts
      const process = () => {
        // The screen is the single source of truth for language. Adopt the
        // language carried on any message so the phone UI + questions always
        // match the TV.
        const incomingLang = (data as { language?: string }).language;
        if (
          incomingLang &&
          SUPPORTED_LANGUAGES.includes(incomingLang as LanguageCode) &&
          incomingLang !== stateRef.current.language
        ) {
          loadLanguage(incomingLang as LanguageCode).then(() => {
            dispatch({ type: "SET_LANGUAGE", language: incomingLang });
          });
        }

        switch (data.action) {
```

   `SUPPORTED_LANGUAGES`, `LanguageCode`, `loadLanguage`, and `dispatch` are
   already imported in this file — do not add imports.

   > No new `case "set_language"` is needed: the adoption check above runs for
   > every message including `set_language`, and the existing `switch` simply
   > ignores unknown actions.

## 2C. Screen broadcasts language changes + syncs late joiners

**File:** `src/screen/useScreenAirConsole.ts`

1. **Broadcast on language change.** Find the `select_language` handler
   (currently lines 444–455). After the `dispatch({ type: "SET_LANGUAGE", ... })`
   call inside the `.then(...)`, add a broadcast so every phone updates. Replace:

```ts
        case "select_language": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          if (!SUPPORTED_LANGUAGES.includes(data.language as LanguageCode))
            break;
          loadLanguage(data.language as LanguageCode).then(() => {
            dispatch({
              type: "SET_LANGUAGE",
              language: data.language,
            });
          });
          break;
        }
```

   with:

```ts
        case "select_language": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          if (!SUPPORTED_LANGUAGES.includes(data.language as LanguageCode))
            break;
          loadLanguage(data.language as LanguageCode).then(() => {
            dispatch({
              type: "SET_LANGUAGE",
              language: data.language,
            });
            // Push the new language to every phone so all UIs stay consistent.
            ac.broadcast({
              action: "set_language",
              language: data.language,
            });
          });
          break;
        }
```

2. **Sync a phone that connects during the lobby.** Find `ac.onConnect`
   (currently lines 282–295). In the `if (s.phase === "lobby")` branch, send the
   current language to the new device. Replace:

```ts
    ac.onConnect = (deviceId: number) => {
      const s = stateRef.current;
      if (s.phase === "lobby") {
        debouncedLobbyUpdate();
      } else {
```

   with:

```ts
    ac.onConnect = (deviceId: number) => {
      const s = stateRef.current;
      if (s.phase === "lobby") {
        ac.message(deviceId, {
          action: "set_language",
          language: s.language,
        });
        debouncedLobbyUpdate();
      } else {
```

   (Leave the `else` branch — the "game in progress" message — unchanged; it
   already sends `language`, which the controller now adopts.)

3. **Avoid a lobby race.** The screen auto-detects its own browser language on
   `ac.onReady` (currently lines ~265–279) via an async `loadLanguage(...).then`.
   A phone that connected before that resolves would get the stale default and
   stay wrong in the lobby until the first gameplay message. Inside that
   `.then(...)` callback, right after its `dispatch({ type: "SET_LANGUAGE", ... })`,
   add a broadcast so any already-connected phones update:

```ts
        loadLanguage(browserLang as LanguageCode).then(() => {
          dispatch({ type: "SET_LANGUAGE", language: browserLang });
          ac.broadcast({ action: "set_language", language: browserLang });
        });
```

   (Edit only — do not duplicate the surrounding `if` guard.)

> Result: master picks language in Settings → screen stores it + broadcasts
> `set_language` → all phones load & switch. New phones get the language on
> connect. During gameplay, every `pick_category` / `pick_question` /
> `answer_question` / `guess_question` / `show_result` / `game_phase` message
> already carries `language`, so phones stay locked to the TV's language.

---

# TASK 3 — Auto-assign a question with a "Reroll" button

**Goal:** instead of showing the host 4 questions, the screen auto-assigns **one**
question. The host sees it with two buttons: **Use this** and **🎲 Reroll**.
Reroll fetches a different question from the same category group.

Category voting is UNCHANGED. Only what happens after a category is chosen
changes (the `category_selected` → `pick_question` step).

## 3A. Add the `reroll_question` message type

**File:** `src/shared/types.ts`

In the `ControllerToScreenMessage` union (starts line 143), add this member right
after the `question_selected` member (after line 152):

```ts
  | { action: "reroll_question" }
```

## 3B. Add two UI-text keys to the interface

**File:** `src/shared/types.ts`

In the `UiText` interface, after the `pickQuestion: string;` line (line 174), add:

```ts
  useThisQuestion: string;
  reroll: string;
```

## 3C. Add the two strings to all 7 locale files

For **each** of these files:
`src/shared/i18n/locales/{en,el,es,fr,de,tr,ar}/ui-text.json`

Add two new top-level keys next to the existing `"pickQuestion"` key. Use exactly
these values per language (these are plain words; the 🎲 emoji is added in the
component, not here):

| Locale | `useThisQuestion` | `reroll` |
|---|---|---|
| en | `Use this` | `Reroll` |
| el | `Επιλογή` | `Αλλαγή` |
| es | `Usar esta` | `Cambiar` |
| fr | `Utiliser` | `Changer` |
| de | `Diese nehmen` | `Neue Frage` |
| tr | `Bunu kullan` | `Değiştir` |
| ar | `استخدمها` | `تغيير` |

Example for `en/ui-text.json` (find `"pickQuestion": "...",` and add the two
lines after it):

```json
  "pickQuestion": "Pick a question for this round!",
  "useThisQuestion": "Use this",
  "reroll": "Reroll",
```

> Keep valid JSON (commas, quotes). Do not remove any existing keys.

## 3D. Screen: assign one question, handle reroll

**File:** `src/screen/useScreenAirConsole.ts`

1. **Add two refs.** Near the other `useRef` declarations (after line 49,
   `const revealCalledRef = useRef(false);`), add:

```ts
  const pickGroupRef = useRef<CategoryVoteOption | null>(null);
  const pickCandidateRef = useRef<number | null>(null);
```

   (`CategoryVoteOption` is already imported at line 15. `useRef` is imported at
   line 1.)

2. **Replace the `category_selected` handler** (currently lines 636–671) so it
   sends a SINGLE auto-assigned question:

```ts
        case "category_selected": {
          if (s.phase !== "picking") break;
          if (
            s.pickingSubStep !== "category_vote_result" &&
            s.pickingSubStep !== "category_vote"
          )
            break;
          const host = getHost(s);
          if (from !== host.deviceId) break;

          dispatch({ type: "CATEGORY_SELECTED" });

          // Auto-assign ONE question from the chosen group.
          const group = data.category as CategoryVoteOption;
          pickGroupRef.current = group;
          const { questions } = getQuestionsForGroup(
            questionsRef.current,
            s.usedQuestionIds,
            isAnyPlayerPremium(),
            group,
            1,
          );
          const q = questions[0];
          if (!q) break;
          pickCandidateRef.current = q.id;

          ac.message(host.deviceId, {
            action: "pick_question",
            questions: [
              {
                id: q.id,
                category: q.category,
                question: replaceNamePlaceholder(q.question, host.nickname),
                answers: q.answers,
              },
            ],
            language: s.language,
          });
          break;
        }
```

3. **Add a new `reroll_question` handler.** Place it immediately AFTER the
   `category_selected` handler's closing `}` (i.e. before the `emoji_reaction`
   case at line 673):

```ts
        case "reroll_question": {
          if (s.phase !== "picking") break;
          if (s.pickingSubStep !== "question_pick") break;
          const host = getHost(s);
          if (from !== host.deviceId) break;
          const group = pickGroupRef.current;
          if (!group) break;

          // Exclude both already-used questions AND the one currently shown.
          const excludeIds =
            pickCandidateRef.current != null
              ? [...s.usedQuestionIds, pickCandidateRef.current]
              : s.usedQuestionIds;
          const { questions } = getQuestionsForGroup(
            questionsRef.current,
            excludeIds,
            isAnyPlayerPremium(),
            group,
            1,
          );
          const q = questions[0];
          if (!q) break;
          pickCandidateRef.current = q.id;

          ac.message(host.deviceId, {
            action: "pick_question",
            questions: [
              {
                id: q.id,
                category: q.category,
                question: replaceNamePlaceholder(q.question, host.nickname),
                answers: q.answers,
              },
            ],
            language: s.language,
          });
          break;
        }
```

   > The existing `question_selected` handler (lines 457–494) already works
   > unchanged: the host taps "Use this" → controller sends `question_selected`
   > with the question id → that question is marked used via `SELECT_QUESTION`.

## 3E. Controller: redesign the PickQuestion view

**File:** `src/controller/views/PickQuestion.tsx`

Replace the **entire file** with:

```tsx
import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

interface PickQuestionProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function PickQuestion({ ac }: PickQuestionProps) {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [locked, setLocked] = useState(false);
  const [rerolling, setRerolling] = useState(false);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // A new question arrived (initial assign or reroll result) → re-enable buttons.
  useEffect(() => {
    setLocked(false);
    setRerolling(false);
  }, [state.pickQuestions]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const q = state.pickQuestions[0];

  const handleUse = useCallback(() => {
    if (locked || rerolling || !q) return;
    setLocked(true);
    ac.current?.message(AirConsole.SCREEN, {
      action: "question_selected",
      questionId: q.id,
    });
  }, [ac, locked, rerolling, q]);

  const handleReroll = useCallback(() => {
    if (locked || rerolling) return;
    setRerolling(true);
    ac.current?.message(AirConsole.SCREEN, {
      action: "reroll_question",
    });
  }, [ac, locked, rerolling]);

  if (!q) return null;

  return (
    <div className="view active" id="view-pick">
      <div className="pick-title">{t("pickQuestion")}</div>
      <div className="question-options">
        <div
          className={`question-option${rerolling ? " rerolling" : ""}`}
          style={{ opacity: rerolling ? 0.6 : 1, pointerEvents: "none" }}
        >
          <span className="question-option-category">
            {(uiText?.categories as Record<string, string>)?.[q.category] ??
              q.category}
          </span>
          {q.question}
        </div>
      </div>
      <div className="pick-actions">
        <button
          className="ctrl-btn ctrl-start-btn"
          disabled={locked || rerolling}
          onPointerDown={handleUse}
        >
          {t("useThisQuestion")}
        </button>
        <button
          className="ctrl-btn ctrl-settings-btn"
          disabled={locked || rerolling}
          onPointerDown={handleReroll}
        >
          🎲 {t("reroll")}
        </button>
      </div>
    </div>
  );
}
```

> Reuses existing button classes (`ctrl-btn`, `ctrl-start-btn`,
> `ctrl-settings-btn`) and the existing `question-option` / `pick-title` /
> `question-options` styles, so no CSS changes are required. The `pick-actions`
> wrapper is a plain flex container; if no rule exists it just stacks the two
> buttons, which is acceptable.

---

# Verification (run after ALL tasks)

From the project root (`c:\Users\Ntamas\Desktop\Personal\AirConsole\TrueFriendsQuiz`):

1. **Type-check + build (must pass with no errors):**

   ```
   pnpm build
   ```

   This runs `tsc -b && vite build`. Fix any TypeScript errors before continuing.
   Pay attention to: the new `set_language` / `reroll_question` message members,
   the two new `UiText` keys, and that all 7 `ui-text.json` files are still valid
   JSON.

2. **Manual smoke test in the AirConsole simulator:**

   ```
   pnpm dev
   ```

   Open the AirConsole simulator with the dev URL. With 3+ controllers:
   - **Music:** open the **screen** browser console first. Confirm there is **no
     404** on `Assets/music/...` (proves 1A). Then start a game: if music plays,
     done. If it does NOT play and you see `NotAllowedError` (from the Step-1
     diagnostic log in 1B), that is the local autoplay policy — click once inside
     the screen tab and music should start (the best-effort listener net), and
     flag that production audio must still be confirmed on a real AirConsole
     device/launch (where the screen iframe permits autoplay). Also verify the
     Settings music toggle stops/starts it. **Before committing, remove the
     temporary `console.warn` diagnostic** added in 1B Step 1.
   - **Language:** set the language on one phone's Settings; every phone's UI
     **and** the questions/answers switch to that language. Set a phone's own
     browser/device language differently from the chosen one — it must still show
     the chosen (screen) language everywhere.
   - **Reroll:** after a category is chosen, the host sees ONE question with
     "Use this" and "🎲 Reroll". Reroll shows a different question (same group).
     "Use this" advances to the answering phase.

3. Confirm category voting still behaves exactly as before (unchanged).

---

# Files touched (summary)

| File | Task |
|---|---|
| `src/screen/musicManager.ts` | 1A, 1B |
| `src/shared/types.ts` | 2A, 3A, 3B |
| `src/controller/useControllerAirConsole.ts` | 2B |
| `src/screen/useScreenAirConsole.ts` | 2C, 3D |
| `src/shared/i18n/locales/{en,el,es,fr,de,tr,ar}/ui-text.json` | 3C |
| `src/controller/views/PickQuestion.tsx` | 3E |

Nothing else should change. Category-vote files are untouched.
