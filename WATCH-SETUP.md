# Apple Watch → half.html

The app reads runs out of `half-runs.json`. The Shortcut doesn't write to that file —
it drops one small JSON file per workout into a `half-inbox/` folder, and the app folds
them in and deletes them on the next sync.

Why: creating a **new** file through the GitHub API needs nothing but the token.
Editing an existing one needs its current `sha`, which means a read-modify-write inside
Shortcuts and a race condition every time two things save at once. The inbox sidesteps
all of it.

## The payload

One file per run, any unique name, e.g. `half-inbox/2026-10-01-0612.json`:

```json
{
  "date": "2026-10-01",
  "type": "easy",
  "dist": 3.14,
  "sec": 2060,
  "elev": 40,
  "hr": 138,
  "hrmax": 162,
  "notes": ""
}
```

`dist` in miles, `sec` total seconds, `elev` in feet, `type` one of
`easy · long · tempo · walkrun · hike · race`. Everything except `date` and `dist`
is optional. Runs that arrive this way show up tagged **watch** in the week list.

## The GitHub call

One "Get Contents of URL" action:

- **URL** `https://api.github.com/repos/alvinthechipmunk123/index/contents/half-inbox/RUNFILE.json`
- **Method** `PUT`
- **Headers**
  - `Authorization` → `Bearer <your fine-grained token>`
  - `Accept` → `application/vnd.github+json`
- **Request Body** JSON:
  - `message` → `watch run`
  - `content` → the run JSON, **base64 encoded** (Shortcuts: *Base64 Encode* action, line breaks off)

Same token as the ☁ panel in the app — fine-grained, `index` repo only, Contents
read/write. Store it in the Shortcut, not in a note.

## Building the Shortcut

1. **Find Health Samples** → Workouts, sorted by End Date, newest first, Limit 1.
   *(This is the part I can't test from here. Depending on your iOS version the action
   may be called Find Workouts, or may only expose workout-level fields through a
   Repeat block. If the workout fields aren't reachable, fall back to step 1b.)*
1b. *Fallback:* **Ask for Input** ×4 — distance, time, avg HR, climb — read off the
   Fitness app. Twenty seconds, still beats typing into a form.
2. **Format** the pieces into the JSON above (Text action with variables inline).
3. **Base64 Encode** that text.
4. **Get Contents of URL** as specified above.
5. **Show Notification** with the response so a failure is visible — a 401 means the
   token, a 404 means the path.

Then: **Automation → When a Workout ends → run this Shortcut.** Ask Before Running off
once it's proven itself.

## Checking it worked

Open the app and hit ☁ → Sync now. The button reads `git · +1 from watch` when it
picks something up, and the run appears in its week. If the inbox file is still sitting
in the repo, the app didn't have a token when it synced — paste it in the ☁ panel and
sync again.
