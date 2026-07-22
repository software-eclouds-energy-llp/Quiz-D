# AI & LLM Live Quiz — Multiplayer Edition

A Kahoot-style live quiz: one person hosts on a shared screen, everyone else
joins from their own phone/laptop with a 4-character room code. Questions are
timed, answers stream in live as a bar chart, and the leaderboard updates
after every question.

**What's new in this version:**
- An **admin console** (`admin.html`) to build and edit quiz question sets
  through a UI — no more hand-editing arrays in `questions.js`.
- The host picks which quiz to play on a new **setup screen** before opening
  the room.
- A **last-place dare** — an optional, skippable, silly forfeit the host can
  spin for whoever finishes last.
- **Randomized answer order** — each time a room is created, the questions
  themselves are shuffled into a fresh order, and every question's four
  options are also shuffled (the correct answer moves with its text), so
  nothing is predictably in the same slot game after game. The shuffle
  happens once, at room creation, and is embedded in the room — so the
  host and every player see the exact same game, it's just different
  from the last time it was played.
- **Automatic pacing** — the host no longer has to click through every
  question. If every currently-joined player answers before time's up,
  the question reveals immediately instead of waiting out the full
  countdown; and the reveal screen itself auto-continues to the next
  question (or the final results) after a few seconds, with a countdown
  hint next to the button. Tapping "Reveal Answer Now" / "Next Question"
  at any point still jumps ahead immediately, so the host always has a
  manual override.
- **No-repeat dare picking** — the last-place dare is chosen at random and
  won't land on the same line two games in a row (remembered across the
  page reload between games via `sessionStorage`); the slot-machine spin
  itself also avoids flashing the same line twice back-to-back.
- **anime.js**-powered motion throughout: staggered card entrances, a
  slot-machine dare reveal, a pulsing timer in the final seconds, animated
  leaderboard rows, and a streak badge for players on a hot streak.
- **Enhanced mobile responsiveness**: fluid clamp()-based type and spacing,
  48px+ touch targets throughout, `env(safe-area-inset-*)` padding for
  notched phones, a landscape/short-screen breakpoint so the question
  screen still fits without scrolling, horizontally-scrollable admin tabs,
  and stacked buttons/leaderboards on narrow screens.
- **Alpine.js** (loaded from a CDN, ~15KB, `defer`red) powers small
  interactive bits: a live-validated join form on `player.html` (auto
  uppercases the room code, disables Join until both fields are valid), a
  tap-to-copy room code with a toast confirmation on `host.html`, a
  persistent offline/reconnecting badge on every page, and a "jump to
  Save" button on long question lists in `admin.html`. All the real-time
  game logic (Firebase listeners, timers, scoring) is untouched vanilla JS
  — Alpine only wraps self-contained UI state.
- **Hardened for embedded WebViews** — e.g. this game running inside a
  native app's in-app browser, not just a normal mobile browser tab — via
  a new shared `webview-fit.js` (loaded early on every page):
  - A `--vh` CSS custom property, kept in sync with `visualViewport`, as a
    fallback under `100dvh` for older WebView engines that mis-measure
    `100vh`/don't support `dvh` at all.
  - `copyToClipboard()` falls back to a hidden-textarea + `execCommand`
    trick when the async Clipboard API is unavailable or blocked (common
    in embedded WebViews without a permission prompt UI).
  - `openOrNavigate()` falls back to navigating the current WebView when
    `window.open(..., "_blank")` silently does nothing, which is the
    default in most app WebView wrappers (no `onCreateWindow`/
    `WKUIDelegate` handler set up on the native side).
  - Focused inputs auto-scroll into view, since some WebView hosts don't
    resize the page for the on-screen keyboard.
  - CSS-level fixes: `overscroll-behavior: none` (kills the rubber-band
    bounce that reads as "broken" inside an app shell), `touch-action:
    manipulation` (no double-tap-zoom jump, pinch-zoom still works), and
    `-webkit-touch-callout: none` on buttons/chips so long-press doesn't
    pop a native Copy/Share menu over game controls.

Files:
- `index.html` — landing page (Host / Join / Manage)
- `host.html` — the host console (quiz picker, room code, live votes, reveal, leaderboard, dare)
- `player.html` — the player screen (join, answer, feedback, streaks)
- `admin.html` — **new** — create/edit/delete quiz sets and the dare list
- `questions.js` — the *built-in default* quiz + starter dare pack (used to seed the admin console; edit it only if you want to change the built-in fallback)
- `style.css` — shared styling
- `webview-fit.js` — **new** — shared fixes for running inside an embedded/native-app WebView (viewport height, clipboard, window.open fallbacks)
- `firebase-init.js` — **you need to edit this one** (see Step 1 below)

GitHub Pages only serves static files — it can't run a live server — so all
live sync (room state, votes, scores, and now quiz sets + dares) is handled
by **Firebase Realtime Database**, which has a free tier that's more than
enough for this. Setup takes about 5 minutes and needs no credit card.

Every page is plain HTML/JS (no build step, no framework) — Firebase pushes
state changes and each page just re-renders the relevant chunk of the DOM.
**anime.js** (loaded from a CDN, ~17KB) drives the motion on top of that:
card entrances, button pops, the countdown pulse, and the dare reveal.

## Step 1 — Create a free Firebase project

1. Go to <https://console.firebase.google.com> and sign in with any Google account.
2. Click **Add project**, give it any name (e.g. `ai-quiz-live`), and finish
   the wizard (you can skip Google Analytics).
3. In the left sidebar, click **Build → Realtime Database**, then
   **Create Database**. Pick any location. When asked about security rules,
   choose **Start in test mode** for now (see Step 2 below to lock it down).
4. Click the gear icon next to **Project Overview → Project settings**.
   Under **Your apps**, click the `</>` (web) icon to register a new web app
   (any nickname is fine, no need for Firebase Hosting).
5. Firebase will show you a config object like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "ai-quiz-live.firebaseapp.com",
     databaseURL: "https://ai-quiz-live-default-rtdb.firebaseio.com",
     projectId: "ai-quiz-live",
     ...
   };
   ```
6. Open `firebase-init.js` in this folder and replace the placeholder values
   with your real ones (`apiKey`, `authDomain`, `databaseURL`, `projectId`).

## Step 2 — Lock down the database rules

Test mode leaves the database open to anyone for 30 days, which is fine for
a quick game night but worth tightening. In **Realtime Database → Rules**,
this version needs three top-level paths open instead of one — `rooms` (live
games), `questionSets` (quizzes built in the admin console), and `dares`
(the dare list):

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": true
    },
    "questionSets": {
      ".read": true,
      ".write": true
    },
    "dares": {
      ".read": true,
      ".write": true
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

This is fine for a casual/classroom quiz. It is **not** meant for anything
sensitive — anyone with the database URL could technically read or write to
these paths. There's no login system, so treat `admin.html` like an
unlisted-but-not-secret URL: don't publicize it if you don't want other
people editing your quiz sets.

## Step 3 — Put it on GitHub Pages

1. Create a new GitHub repository (public is fine, e.g. `ai-quiz-live`).
2. Upload all the files in this folder to the repo (drag-and-drop on
   github.com works, or `git add . && git commit -m "quiz" && git push`).
3. In the repo, go to **Settings → Pages**. Under **Build and deployment**,
   set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
   Save.
4. GitHub gives you a URL like `https://yourusername.github.io/ai-quiz-live/`.
   That's your quiz — share the link, or just the `/host.html` and
   `/player.html` paths. Keep `/admin.html` for yourself.

## Building quizzes in the admin console

Open `admin.html` (also linked from the bottom of `index.html`).

**Quiz Sets tab:**
- **＋ New blank set** starts an empty quiz; **Start from the default AI &
  LLM quiz** clones the built-in questions as a starting point you can edit.
- Each question has a text box, 4 option fields, and a radio button to mark
  the correct one. Use ↑ / ↓ to reorder, ✕ to remove.
- Nothing is written to Firebase until you click **Save changes** — so it's
  safe to experiment. **Cancel** discards edits.
- **Edit / Duplicate / Delete** on the list screen manage existing sets.

**Last-Place Dares tab:**
- A flat list of short, light-hearted forfeits. Add/edit/remove them, or
  click **Add starter pack** to pull in the defaults from `questions.js`.
  Click **Save changes** to publish.

## How to run a game

1. Host opens `host.html`. On the **setup screen**, pick which quiz to play
   (the built-in default, or any set built in the admin console) and choose
   whether to enable the end-of-game dare. Click **Create Room**.
2. Players open `player.html` on their own device, enter the room code and
   their name.
3. Host clicks **Start Game** once people have joined.
4. Each question is timed (per-set, default 20s). Players tap an answer; a
   live bar chart on the host screen fills in as answers arrive. Faster
   correct answers score more points (500–1000), wrong answers score 0. The
   countdown ring pulses in the final 5 seconds.
5. Host reveals the answer (auto-reveals when time runs out, or click
   **Reveal Answer Now**), then **Next Question**.
6. After the last question, everyone sees the final leaderboard with
   confetti for the top 3. If the dare was enabled, the host sees a **🎯
   Spin a Dare** button — clicking it runs a slot-machine style reveal and
   shows the result live to every player too. There's always a **skip it**
   option right next to it.

### About the dare feature

You asked whether a "least score gets a dare" concept would add something —
worth doing, but with two guardrails baked in: it's **opt-in per game** (the
host toggles it on the setup screen) and **skippable in the moment** (there's
a "no thanks" button right next to the spin button), so it stays a fun,
consensual bit rather than something that puts someone on the spot in front
of a group who didn't sign up for it. The dare pool itself is just silly
low-stakes stuff (do a robot dance, a dramatic apology speech, etc.) — edit
the list in `admin.html` to match your crowd.

## Data model (Firebase Realtime Database)

```
rooms/{code}
  status, qIndex, total, createdAt, hostLeft
  quizName, questionSeconds, dareEnabled
  questions: [ { q, options: [4 strings], answer(0-3) }, ... ]  ← embedded snapshot,
    so editing a set in admin.html never changes a game already in progress
  players/{playerId}: { name, score, joinedAt }
  answers/{qIndex}/{playerId}: { choice, correct, points, answeredAt }
  dare: { text, targetName, revealedAt }   ← written when host spins

questionSets/{setId}
  name, seconds, questions: [ { q, options, answer } ], createdAt, updatedAt

dares
  [ "dare text", "dare text", ... ]   ← flat array
```

## Known simplifications

- No login/accounts — names are just typed in, so nothing stops someone
  from picking a duplicate name.
- If a player closes their tab, they're removed from the room (so ghost
  players don't clutter the leaderboard) — they'd need to rejoin with a new
  code if the game already moved past the lobby.
- Scoring assumes each player's device clock is roughly correct; it's not
  cheat-proof, just built for a fun, casual live quiz.
- `admin.html` has no concurrent-editing protection — it's built for one
  person managing quizzes at a time. If two people edit the same set at
  once, the last **Save** wins.
- To change the *built-in default* quiz (the one that needs no admin setup),
  edit the `DEFAULT_QUESTIONS` array in `questions.js` — each question needs
  4 `options` and an `answer` index (0–3). Everything else should go through
  `admin.html` instead.
