# Job Application Tracker

**Keep job applications and follow-up details in one workspace.**

A Next.js and TypeScript project with Firebase authentication, application-entry forms, and a dashboard. It explores the account, form, API, and database layers needed for a personal job-search tracker.

## What is included

- Email/password registration and login.
- A dashboard for application records.
- Add and edit screens with a shared application form.
- Firebase client and Admin integrations.
- Application read/update logic and API request helpers.

## Run locally

Use Node.js/npm and a Firebase project with Authentication and Realtime Database enabled.

```bash
npm install
npm run dev
```

Configure `.env.local` using the names read by the client and Admin modules:

| Module | Settings |
|---|---|
| `lib/firebase.ts` | `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_DATABASE_URL`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` |
| `lib/firebase-admin.ts` | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_DATABASE_URL` |

Open the URL printed by Next.js. Firebase Admin values are server credentials; do not give them the `NEXT_PUBLIC_` prefix.

## Architecture

```mermaid
flowchart LR
  Pages[Next.js pages] --> Forms[Application forms]
  Pages --> Auth[Firebase Authentication]
  Forms --> Actions[Application helpers]
  Actions --> API[Next.js API handlers]
  Actions --> DB[(Realtime Database)]
  API --> DB
```

## Implementation guide

- [`app/`](app): dashboard, account, add, and edit pages.
- [`app/actions.ts`](app/actions.ts): application helpers and authenticated requests.
- [`pages/api/`](pages/api): HTTP endpoints.
- [`lib/`](lib): Firebase configuration and supporting code.

## Current integration boundary

The code uses different application path conventions: helpers request `/api/job-applications` and read `job-applications/...`, while the included `pages/api/applications` route uses `applications/...`. Reconcile these paths and the required request fields before relying on the complete create/edit/delete workflow. The README describes the available implementation; it does not claim that these integration gaps have been fixed.

For a production bundle, use `npm run build` followed by `npm start` after completing service configuration.
