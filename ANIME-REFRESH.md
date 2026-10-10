# Alvin's Anime List: monthly refresh

`anime.html` is a single self-contained file and the only source. It is served at
https://alvinthechipmunk123.github.io/index/anime.html. A copy is also published as a
claude.ai artifact at https://claude.ai/artifact/PFVGBoNxYVyKAnXSQKamaA.

The refresh updates data only. Do not redesign, add features, or rewrite the show
write-ups. Alvin wants every change dated so later rounds append instead of overwrite.

## What lives where in `anime.html` (all inside the one `<script>`)

- `D` – the shows. 25 main entries, then 10 with `bench:1`. Fields: `ep` (episodes),
  `s` (US streamer codes: CR, NF, HU, PV, HD), `sn` (free-text streamer note), `y`, `w`.
- `FAN` – `id: [MyAnimeList score, ratings in thousands]`.
- `CHAR` – `id: [top character, favourites, runner-up, favourites]`.
- `MALID` – `id: MyAnimeList anime id`. Pages: `https://myanimelist.net/anime/<id>` and
  `https://myanimelist.net/anime/<id>/x/characters`.
- `AWARD` – one line of awards per show id.
- `UP` – Coming up. `d` is `YYYY-MM-DD`, `YYYY-MM` or `YYYY`; no `d` means announced
  without a date. `chk` is the day the entry was last checked.
- `FILMS` – the film shelf. `s` is the US streamer name, empty if unknown.
- `LOG` – the update log, newest first.
- `EDITION` – the date shown in the header. `FIRST` is the first edition date; never change it.

## Each month

1. Fan scores: re-read each MyAnimeList page and update `FAN` (and `CHAR` if the top two
   changed). The page prints the score with a stray trailing digit (8.841 means 8.84) and
   sometimes doubles the ratings count (942978942,978 means 942,978).
2. Streamers and episode counts: check each show on JustWatch US
   (`https://www.justwatch.com/us/tv-show/<slug>`) and update `s`, `sn`, `ep`. Ignore
   Amazon Channel duplicates, bundles and rent/buy.
3. Coming up: for every `UP` entry, check Wikipedia or the official source. Fill in dates
   that have been announced, fix dates that moved, and set `chk` to today on each entry
   you verified. Remove an entry only when the thing has fully finished airing and has
   been reflected in the show's `ep` and write-up; say so in the log line. Add newly
   announced seasons or films for shows on the list.
4. Films: update `m` and `s` the same way.
5. Set `EDITION` to today. Add one row at the top of `LOG`: `["YYYY-MM-DD", "what changed"]`,
   naming the specific changes (which scores moved by 0.05 or more, which dates landed,
   which streamers changed). If nothing changed, say that.
6. New shows are not added by the refresh. If something clearly belongs, mention it in the
   run summary for Alvin to decide.

## Before pushing

- Open `anime.html` in headless Chromium at 1280px and 400px wide. There must be no page
  errors and no horizontal overflow (`document.documentElement.scrollWidth - innerWidth` is 0),
  35 rows in the list, and the readout must show the new edition date.
- Use only values you read this run. If a source cannot be reached, leave that value as it
  is and name it in the log line as not re-checked. Never guess.
- If the QC fails or the file would not parse, do not push. Report what went wrong.

## Publishing: ping Alvin first

Alvin asked to be pinged before anything is pushed. So:

1. Do all the checks and prepare the updated `anime.html` locally. Run the QC.
2. Do NOT commit, push or republish yet.
3. Send Alvin a short message listing exactly what would change (scores that moved,
   dates that landed or shifted, streamer changes, anything not re-checked) and ask for
   a yes. Then stop and wait for his reply in that session.
4. Only after he says yes: commit `anime.html` to `main` in `alvinthechipmunk123/index`
   with a message like `anime: monthly refresh YYYY-MM-DD`, then update the claude.ai
   artifact at the URL above with the same page (read it first; the artifact body is
   `anime.html` without the doctype, html, head and body wrapper tags).
5. If he says no or asks for changes, do what he says instead.

Never touch `anime-picks.json`; that file holds Alvin's own seen marks and scores.
