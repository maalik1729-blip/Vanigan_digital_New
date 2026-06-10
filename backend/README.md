# TNVS Backend

Standalone Express REST API — deploy on Railway.app

## Setup locally

```bash
cd backend
npm install
cp .env.example .env   # fill in your DB credentials
npm run dev            # runs on http://localhost:4000
```

## Deploy on Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select this repo → set root directory to `backend`
3. Add environment variables (from .env.example)
4. Railway auto-deploys on every push

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /health | Health check |
| GET | /api/public/members | List members |
| POST | /api/public/members | Add member |
| GET | /api/public/organizer | List organizers |
| POST | /api/public/organizer | Add organizer |
| GET | /api/public/business | List businesses |
| GET | /api/public/business/:id | Get business by ID |
| POST | /api/public/business | Add business |
| GET | /api/public/categories | List categories + stats |
| GET | /api/public/categories/:cat/subcategories | Subcategories |
| GET | /api/voter-search?epic=XXX | Search by EPIC ID |
