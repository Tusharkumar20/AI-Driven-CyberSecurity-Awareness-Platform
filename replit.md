# Cybersecurity Awareness Platform

A full-stack web application that educates users about common cyber threats including Phishing, Malware, Ransomware, and DDoS attacks.

## Architecture

- **Frontend**: React 19 + Vite, running on port 5000
- **Backend**: Node.js + Express, running on port 3000
- **Database**: PostgreSQL (Replit built-in)
- **Auth**: Firebase (client SDK for frontend, Admin SDK for backend)

## Project Structure

```
Frontend/         - React/Vite app (port 5000)
  src/
    pages/        - Full page views (Login, Signup, Main, Profile, Phishing, Malware, etc.)
    components/   - Reusable components (Navbar, Quiz, MatrixBackground)
    config/       - Firebase client config
  vite.config.js  - Vite config (port 5000, host 0.0.0.0, proxy /api -> localhost:3000)

backend/          - Express API (port 3000)
  server.js       - Entry point
  config/         - Firebase Admin SDK init (reads FIREBASE_SERVICE_ACCOUNT_JSON secret)
  db/             - PostgreSQL connection (uses DATABASE_URL)
  middleware/     - Firebase token verification + user auto-creation
  routes/         - API routes (/api/profile)
  controllers/    - Profile get/update logic
```

## Database Schema

```sql
users (id, firebase_uid, email, created_at)
player_profiles (id, user_id, username, avatar_url, created_at)
```

## Required Secrets

- `VITE_FIREBASE_API_KEY` - Firebase web app API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT_JSON` - Full Firebase Admin SDK service account JSON (for backend)
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)

## Workflows

- **Start application**: `cd Frontend && npm run dev` (port 5000, webview)
- **Start Backend**: `cd backend && node server.js` (port 3000, console)

## API

- `GET /api/profile` - Get user profile (requires Firebase auth token)
- `PUT /api/profile` - Update username/avatar (requires Firebase auth token)
