# Alpha Kids — Tech

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4 (`@theme` in `app/globals.css`)
- TypeScript strict
- Zod 4 (request/response contracts)
- Zustand (in-page conversation state only)

## Folder layout

```text
app/                      thin routes + layout
  api/coach/route.ts      HTTP boundary
features/coach/           domain UI, hooks, store, client api
  components/             barrel index + nested by concern
    desk/ board/ composer/ check-in/ ui/
  types/                  all feature types + barrel index
  i18n/messages/          locale catalogs
styles/                   named CSS (coach-desk atmosphere)
shared/                   domain-agnostic UI/helpers
lib/server/coach/         service, mock, safety, schema
docs/                     PRODUCT + TECH
.cursor/rules/            agent rules
```

One-way deps: `app` → `features` → `shared`. Shared never imports features.

## Coach (current)

Replies are **mock / deterministic**.

- Entry: `getCoachReply` in `lib/server/coach/service.ts`
- Implementation: `mock.ts` + `safety.ts`
- Contract: Zod schemas in `schema.ts`
- Timed check-ins: `checkIn.dueInMinutes` drives an in-page reminder (Zustand + ticker). No persistence across reloads.
- Reply language: optional `language` on the request (UI toggle). Falls back to script detection if omitted.
- UI i18n: `shared/i18n/locales.ts` (locale registry) + `features/coach/i18n/messages/*` (string catalogs). Components use `useLocale()` / `getMessages()` only. No user-facing strings in JSX.
- To add a locale: extend `LOCALE_CODES` + `LOCALES`, add `messages/<code>.ts`, register in `messages/index.ts`, and extend server mock/schema content as needed.

Do **not** add LLM SDKs (`openai`, Anthropic, Gemini, etc.) or API keys until this doc is updated.

### Future LLM swap

Replace the body of `getCoachReply` (or swap `mock.ts`) behind the same Zod response shape. UI should not care.

## Env

None required to run locally today.

## Quality

- ≤ 350 lines/file
- No `console.*` in product code
- `npm run typecheck` and `npm run lint` before done
