# BUP Informatics Backend v1

This starter backend is designed from the current BUP Informatics frontend baseline and maps directly to the core sections already present in the uploaded HTML prototype: authentication, studies, files/folders, datasets, charts, and summaries.

## Why this is the right next step
The current frontend is already a strong prototype, but its state is still browser-local. Backend v1 moves the project into a real application layer by replacing local-only storage with a Node.js + Express + PostgreSQL API.

## Included in v1
- Local auth endpoint for development (`/api/auth/login`)
- User/role lookup (`/api/auth/me`, `/api/users`)
- Study listing and creation (`/api/studies`)
- File upload metadata persistence (`/api/files/upload`)
- CSV dataset profiling on upload (`/api/datasets/:studyId`)
- Saved summaries (`/api/summaries`)
- PostgreSQL schema and seed scripts
- Placeholder path for Microsoft 365 / Entra integration later

## Recommended delivery phases

### Phase 1 — Backend foundation
Build and validate the API, DB schema, and local auth.
- [x] Express API
- [x] PostgreSQL schema
- [x] JWT auth
- [x] Study, file, dataset, summary modules

### Phase 2 — Frontend wiring
Patch the current BUP Informatics frontend so it stops using localStorage for these flows:
- login
- studies
- files/folders
- datasets
- summaries

### Phase 3 — Role enforcement
Enforce owner/admin/study/ops permissions in both frontend and backend.

### Phase 4 — Microsoft 365 login
Replace local login with Microsoft Entra sign-in.
- register app in BUP tenant
- verify Microsoft tokens in backend
- map Microsoft user identity to `app_users`

### Phase 5 — Production storage and deployment
Move uploads to object storage and deploy.
- Cloudflare R2 or AWS S3
- Railway / Azure / Render backend hosting
- PostgreSQL managed database

## Quick start
1. Copy `.env.example` to `.env`
2. Create PostgreSQL database `bup_informatics`
3. Run:
   - `npm install`
   - `npm run db:init`
   - `npm run db:seed`
   - `npm run dev`

The API will start on `http://localhost:8080` by default.

## Example login for development
These are seeded for local testing only:
- `owner@bup.local` / `datamac`
- `admin@bup.local` / `datamac`
- `manager@bup.local` / `datamac`
- `finance@bup.local` / `datamac`
- `studya@bup.local` / `datamac`

## Suggested frontend API mapping
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/studies`
- `POST /api/studies`
- `GET /api/files/:studyId`
- `POST /api/files/upload`
- `GET /api/datasets/:studyId`
- `GET /api/summaries/:studyId`
- `POST /api/summaries`

## Minimal login request
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bup.local","password":"datamac"}'
```

## Notes for Microsoft 365 migration
When BUP is ready, keep the app roles in PostgreSQL, but replace local password auth with Microsoft Entra authentication. The backend should verify the Microsoft token, find the matching user in `app_users`, and continue using the same authorization model.
