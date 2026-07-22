# AI & LLM Live Quiz — Multiplayer Edition

A Kahoot-style live quiz: one person hosts on a shared screen, everyone else
joins from their own phone/laptop with a 4-character room code. Questions are
timed, answers stream in live as a bar chart, and the leaderboard updates
after every question.

Files:
- `index.html` — landing page (Host / Join)
- `host.html` — the host console (room code, live votes, reveal, leaderboard)
- `player.html` — the player screen (join, answer, feedback)
- `questions.js` — the quiz questions (edit this to change the quiz)
- `style.css` — shared styling
- `firebase-init.js` — **you need to edit this one** (see Step 1 below)

GitHub Pages only serves static files — it can't run a live server — so the
live sync (room state, votes, scores) is handled by **Firebase Realtime
Database**, which has a free tier that's more than enough for this. Setup
takes about 5 minutes and needs no credit card.

`host.html` and `player.html` use **Alpine.js** (loaded from a CDN, no build
step) to render each screen. Firebase updates a plain JavaScript state
object, and Alpine reactively patches just the parts of the page that
changed — so switching between lobby → question → reveal → leaderboard
never blanks or reloads the page, it just updates in place.

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
you can use this — it limits reads/writes to the `rooms` path this app
actually uses, with no other restrictions (there's no login system here, so
it stays simple/open within that path):

```json
{
  "rules": {
    "rooms": {
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
`rooms`, they just can't guess room codes without seeing the host's screen.

## Step 3 — Put it on GitHub Pages

1. Create a new GitHub repository (public is fine, e.g. `ai-quiz-live`).
2. Upload all the files in this folder to the repo (drag-and-drop on
   github.com works, or `git add . && git commit -m "quiz" && git push`).
3. In the repo, go to **Settings → Pages**. Under **Build and deployment**,
   set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
   Save.
4. GitHub gives you a URL like `https://yourusername.github.io/ai-quiz-live/`.
   That's your quiz — share the link, or just the `/host.html` and
   `/player.html` paths.

## How to run a game

1. Host opens `host.html` on a screen everyone can see and shares the room
   code.
2. Players open `player.html` on their own device, enter the code and their
   name.
3. Host clicks **Start Game** once people have joined.
4. Each question is shown for 20 seconds. Players tap an answer; a live bar
   chart on the host screen fills in as answers arrive. Faster correct
   answers score more points (500–1000), wrong answers score 0.
5. Host reveals the answer (auto-reveals when time runs out, or click
   **Reveal Answer Now**), then **Next Question**.
6. After the last question, everyone sees the final leaderboard with a
   little confetti for the top 3.

## Known simplifications

- No login/accounts — names are just typed in, so nothing stops someone
  from picking a duplicate name.
- If a player closes their tab, they're removed from the room (so ghost
  players don't clutter the leaderboard) — they'd need to rejoin with a new
  code if the game already moved past the lobby.
- Scoring assumes each player's device clock is roughly correct; it's not
  cheat-proof, just built for a fun, casual live quiz.
- To change the questions, edit the `QUESTIONS` array in `questions.js` —
  each question needs 4 `options` and an `answer` index (0–3) for the
  correct one.
