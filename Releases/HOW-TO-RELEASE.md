# How to cut a new release for AirConsole

A step-by-step checklist for building, packaging, and submitting a new version of
True Friends Quiz to the AirConsole developer console.

> TL;DR: bump the version → write release notes → `pnpm zip` → upload the zip in
> the AirConsole developer console → test the preview → submit for review.

---

## 0. Prerequisites (one-time)

- An AirConsole developer account: <https://developers.airconsole.com/> (log in
  with Google).
- The game already created in the developer console (the **game ID cannot be
  changed** once created). For an existing game you're just uploading a new
  version.
- Node.js 18+ and `pnpm` installed.

---

## 1. Pre-release checklist

Before you build, confirm:

- [ ] The change works in the **AirConsole simulator**
      (<https://www.airconsole.com/simulator/>) via a tunnel:
      `pnpm dev` then `cloudflared tunnel --url http://localhost:5173`.
      Test with **3+ controllers**.
- [ ] **Audio** plays on a real device/launch (autoplay can be blocked in a plain
      dev browser tab — verify on AirConsole, not just locally).
- [ ] **Language** switching from the master propagates to all phones (UI +
      questions).
- [ ] Content still meets **PEGI 12 / AirConsole content policy** (no sexually
      explicit content, no alcohol/drug focus, etc. — see v2.1.2 notes for the
      kind of items that were removed previously).
- [ ] Controller tap targets ≥ **44px**; the game handles connect/disconnect and
      pause/resume (ads) gracefully.
- [ ] `pnpm build` passes with no TypeScript errors.

Reference: AirConsole [Technical Requirements](https://developers.airconsole.com/technical-requirements)
and [Best Practices](https://developers.airconsole.com/best-practices).

---

## 2. Bump the version

Use semantic versioning (MAJOR.MINOR.PATCH). New features → bump MINOR; fixes
only → bump PATCH. Update **all** of these so they stay in sync:

- [ ] `package.json` → `"version"`
- [ ] `README.md` → the `# True Friends Quiz vX.Y.Z` title
- [ ] `src/app/pages/AboutPage.tsx` → the `v X.Y.Z` shown in "The Developer"

> The zip file name is derived automatically from `package.json` version
> (see step 4), so bump `package.json` first.

---

## 3. Write the release notes

- [ ] Create `Releases/notes/vX.Y.Z-release-notes.md` (copy the structure of the
      previous one). Group changes under clear headings (Audio, Content,
      Technical, Docs, etc.).
- [ ] If this release answers producer/QA feedback, also write a short reply
      email (see `Releases/notes/reply-to-airconsole-*.md` for the format).

---

## 4. Build & package the zip

From the project root:

```bash
pnpm zip
```

This runs `scripts/zip-game.ps1`, which:

1. Runs `npm run build` (`tsc -b && vite build`) → outputs `dist/`.
2. Packages the **contents of `dist/`** into
   `Releases/builds/True Friends Quiz Release vX.Y.Z.zip`, using forward-slash
   paths (Linux-compatible), **excluding the website-only files** (see below).

**Important — AirConsole requires `screen.html` and `controller.html` in the root
of the zip.** This is satisfied because the script zips the *contents* of `dist/`,
so both HTML files sit at the zip root (not inside a `dist/` folder). The build
uses `base: "./"` so all asset paths are relative and resolve wherever AirConsole
serves the files.

### What goes in the game zip (game-only / "Option B")

**Included — everything the game needs:**

```
screen.html                          TV entry point (AirConsole loads this)
controller.html                      phone entry point (AirConsole loads this)
_assets/
  client-*.js                        React runtime (shared)
  index-*.js                         shared bootstrap (screen + controller)
  screen-*.js  / screen-*.css        the screen app
  controller-*.js / controller-*.css the controller app
  questions-*.js   (7, one/language) question packs, lazy-loaded
  ui-text-*.js     (7, one/language) UI text, lazy-loaded
Assets/
  music/Compressed/*.ogg  (3)        background music (~5.5 MB)
  Logo/Logo.svg, Logo/Logo.png       logo shown on the lobby
```

**Excluded — public website only (not used by AirConsole):**

```
app.html                             the How-to-Play / About marketing site
_assets/app-*.js                     app.html's bundle
_assets/app-*.css                    app.html's styles
```

The exclusion is automatic — `scripts/zip-game.ps1` skips anything matching
`app.html`, `_assets/app-*.js`, or `_assets/app-*.css`, and prints what it skips.
If a future build adds new website-only entry points, add their patterns to the
`$excludePatterns` list in that script.

> Why exclude them? `app.html` is the marketing site, deployed separately via
> Docker/nginx. AirConsole only ever loads `screen.html` + `controller.html`, so
> the website files are dead weight in the game package.

**Sanity-check the zip:** open it and confirm `screen.html` and `controller.html`
are at the top level alongside `_assets/` and `Assets/`, and that **no `app.html`**
(or `app-*` chunks) are present.

---

## 5. Upload to the AirConsole developer console

1. Go to <https://developers.airconsole.com/> and open your game.
2. Click **choose file**, select
   `Releases/builds/True Friends Quiz Release vX.Y.Z.zip`, and click **update**.
3. Each upload creates a **new version** (it does not overwrite the previous one),
   so you can roll back if needed.

> Alternative (self-hosted): this project is also deployed via Docker/nginx (see
> `Dockerfile` / `nginx.conf`) and served at the public URL. If you point
> AirConsole at a hosted URL instead of uploading a zip, deploy that build first
> and make sure `screen.html`/`controller.html` are reachable at the root.

---

## 6. Test the preview, then submit for review

1. Use the **preview link** in the console to play the uploaded version end to
   end (3+ controllers, multiple languages, a full round, reroll, music).
2. When you're confident, click **submit for review**.
3. The AirConsole team tests the build and emails feedback on anything left to
   do. They will **not** launch the game publicly without your agreement.
4. When you get feedback, address it, bump the version again, and repeat from
   step 1. (Reply to the producer with what changed — see the reply-email note.)

Reference: AirConsole [Publishing your game](https://developers.airconsole.com/publishing-your-game)
and [Testing your game](https://developers.airconsole.com/testing-your-game).

---

## 7. After submission (housekeeping)

- [ ] Commit the version bump, release notes, and the new zip (the repo currently
      tracks `Releases/builds/*.zip`).
- [ ] Tag the release in git, e.g. `git tag v2.2.0 && git push --tags`
      (optional but recommended).
- [ ] Keep the previous zip in `Releases/builds/` as a rollback point.

---

## Quick command reference

```bash
pnpm install      # first time / after dependency changes
pnpm dev          # local dev server (with a tunnel for the simulator)
pnpm build        # type-check + production build → dist/
pnpm zip          # build + package the AirConsole upload zip
```
