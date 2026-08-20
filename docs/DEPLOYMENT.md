# Deploying Dead Air University

Dead Air University is a browser-first learning app. grok.me is one host, not a
runtime dependency. The same repository runs locally, on a conventional
Nitro/Vercel-compatible host, and on grok.me.

Learning state is **not** synced by a hosted URL.

## Local development

```text
npm install
npm test
npm run typecheck
npm run dev
```

`npm run dev` binds all interfaces on port 8080 so a local browser and the
Grok live preview can both reach it. That port is a **local-dev / preview**
convenience, not a production requirement.

No API keys are required. AI stays off until you turn it on in Settings.

Optional local secrets (never commit this file):

```text
.dau-secrets.json
```

Or set `DAU_SECRETS_FILE` to a readable path. This file is for a machine you
operate. Typical serverless hosts do not have a durable working directory.

## Local production preview

```text
npm run build
npm run preview
```

`preview` also uses port 8080 locally. A conventional host uses whatever port
that host assigns.

## Hosted production

Default build target is Nitro's `vercel` preset.

```text
npm run build
```

Escape hatch for another Nitro-compatible host:

```text
NITRO_PRESET=node-server npm run build
```

Do not invent extra vendors. If the host needs a start command, use the
standard Nitro output for the preset you chose.

### Environment variables

| Variable | Required | Role |
| --- | --- | --- |
| `DATABASE_URL` | No | Neon/Postgres for Better Auth only. Unset → PGLite fallback. Never stores learning progress. |
| `XAI_API_KEY` | No | Server-side xAI key |
| `OPENAI_API_KEY` | No | Server-side OpenAI key |
| `ANTHROPIC_API_KEY` | No | Server-side Anthropic key |
| `GEMINI_API_KEY` / `GOOGLE_API_KEY` | No | Server-side Gemini key |
| `DAU_LOCAL_API_KEY` | No | Optional key for a local OpenAI-compatible server |
| `DAU_LOCAL_BASE_URL` | No | Operator-trusted local-provider URL (may be non-loopback) |
| `DAU_SECRETS_FILE` | No | Path to a local secrets JSON. Not durable on serverless. |
| `NITRO_PRESET` | No | Defaults to `vercel` |
| `VITE_AUTH_ENABLED` | No | Set `false` to hide sign-in. Learning still works signed out. |
| `VITE_PUBLIC_HOSTNAME` | Injected on publish | Share-card host. Do not invent a `.env` for it. |

Server keys never enter the browser bundle. Status APIs report `env` / `file` /
`none` only.

Browser-supplied local provider URLs may only target loopback. A hosted server
will not fetch an arbitrary internal URL from Settings.

## Persistence model

| Data | Where | Refresh | Browser restart | Server restart | Other device |
| --- | --- | --- | --- | --- | --- |
| Progress, reviews, quizzes, courses | This browser (`localStorage`) | yes | yes | yes | no — export |
| Unfinished lesson | This tab (`sessionStorage`) | yes | no | yes | no |
| Browser fallback API keys | This browser | yes | yes | yes | no |
| Auth tables | PGLite / Neon | n/a | n/a | process-local / DB | accounts only, not learning |

Safari private mode or blocked storage: the app still boots against an in-memory
fallback. Progress will not survive a reload. Settings → Diagnostics shows this.

**A hosted URL is not cross-device sync.** Chrome on Windows, Safari on a Mac,
and Firefox on Linux each have their own graph until the learner exports and
imports an archive.

Cloud sync is not implemented. Do not treat sign-in as a progress store.

## Data portability

Settings → Export archive → Import on the other browser.

- Default export omits API keys
- Including keys requires two confirmations and writes plaintext credentials
- Replace import downloads a rollback file first
- Archives larger than 8 MB are rejected

## Grok Build / grok.me

Publish deploys this same app. No Grok-only code path is required for learning.

What persists: the visitor's browser storage.

What does **not** sync: another device, another profile, another browser.

Secrets: use the host's environment variables. Do not put keys in a published
client bundle or in a default export.

Grok preview chrome (PWA install page, Remix pill, preview host bridge) is
host tooling. The app runs without it.

## Manual smoke checklist (any host)

1. Open a clean profile. Home and a 10-minute session load with AI off.
2. Finish a seeded lesson and quiz. Refresh. Progress is still there.
3. Restart the browser. Progress is still there. An unfinished lesson is not.
4. Export. Import into a second clean profile. Courses, quizzes, reviews, and
   retired-topic history come back. No keys in the default file.
5. Settings → Diagnostics shows storage, curriculum counts, and AI off.
6. Turn AI on without a key. Navigation still works; generate refuses cleanly.

## Acceptance matrix

| Target | Status |
| --- | --- |
| Linux Chromium (this environment) | Automated tests + production build |
| Production SSR build | Automated (`npm run build`, `npm run typecheck`) |
| Clean browser profile | Automated persist/export tests; pending manual smoke |
| Existing browser state | Automated import merge/replace tests |
| Zero AI keys | Automated; AI default is off |
| Server-side AI key | Automated source resolution; values never in status |
| Browser fallback AI key | Automated; excluded from default export |
| Archive export/import | Automated, including the three completed courses |
| macOS Safari | Structurally supported; pending manual smoke |
| macOS Chrome/Chromium | Structurally supported; pending manual smoke |
| Windows Chrome/Edge | Structurally supported; pending manual smoke |
| Windows Firefox | Structurally supported; pending manual smoke |
| Linux Firefox | Structurally supported; pending manual smoke |

This environment cannot physically certify every OS/browser pair. Those rows
are not claimed as tested.
