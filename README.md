# IntentBot

AI-powered intent-based chatbot with conversation history, profile pictures, and OAuth (GitHub & Google). Built with React, Express, MongoDB, and TypeScript.

**Live demo / deploy:** See [Where to deploy](#where-to-deploy) below for free hosting options.

---

## Features

- **Intent recognition** – Classifies user messages (greeting, question, request, feedback, help) and shows confidence
- **Conversations** – Create, rename, delete, and search chats; history persists after logout
- **Auth** – Email/password signup and login, plus GitHub and Google OAuth
- **Profile** – Upload/remove profile picture; avatars in chat and sidebar
- **Mobile-friendly** – Responsive layout and touch-friendly controls
- **Dark mode** – Theme toggle in header

---

## Tech stack

- **Frontend:** React 18, Vite 7, TypeScript, TailwindCSS, Radix UI, React Router 6
- **Backend:** Express 5, Node.js
- **Database:** MongoDB (Mongoose)
- **Auth:** Cookie-based sessions, bcrypt, OAuth 2.0

---

## Quick start

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- MongoDB (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### Install and run

```bash
# Clone the repo (after pushing to your GitHub)
git clone https://github.com/kamblesandesh01/intent-bot.git
cd intent-bot

# Install dependencies
pnpm install

# Copy env example and add your values
cp .env.example .env

# Start dev server (client + API on port 8080)
pnpm dev
```

Open [http://localhost:8080](http://localhost:8080).

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NODE_ENV` | Yes | `development` or `production` |
| `VITE_GITHUB_CLIENT_ID` | OAuth | GitHub OAuth client ID (frontend) |
| `GITHUB_CLIENT_SECRET` | OAuth | GitHub OAuth secret (backend only) |
| `VITE_GOOGLE_CLIENT_ID` | OAuth | Google OAuth client ID (frontend) |
| `GOOGLE_CLIENT_SECRET` | OAuth | Google OAuth secret (backend only) |

See [.env.example](.env.example) and [OAUTH_SETUP.md](OAUTH_SETUP.md) for OAuth setup.

### Optional: seed intents

```bash
pnpm run seed:intents
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Vite + Express) |
| `pnpm build` | Build client and server for production |
| `pnpm start` | Run production server |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm test` | Run Vitest tests |

---

## Where to deploy (free options)

You can host IntentBot for free on these platforms. All support Node.js + MongoDB (use [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster).

### 1. [Render](https://render.com) (recommended)

- **Free tier:** Web service + MongoDB Atlas.
- Steps:
  1. Push this repo to [GitHub](https://github.com/kamblesandesh01).
  2. Sign up at [Render](https://render.com).
  3. **New → Web Service**, connect your GitHub repo.
  4. **Build command:** `pnpm install && pnpm build`
  5. **Start command:** `pnpm start`
  6. Add env vars (e.g. `MONGODB_URI`, `NODE_ENV=production`, OAuth vars).
  7. Deploy. Your app URL will be like `https://intent-bot-xxxx.onrender.com`.
- For OAuth: set callback URLs to `https://your-app-name.onrender.com/auth/github/callback` and same for Google in GitHub/Google OAuth app settings.

### 2. [Railway](https://railway.app)

- **Free tier:** Limited monthly usage.
- Connect GitHub repo, set build (`pnpm install && pnpm build`) and start (`pnpm start`), add env vars, deploy. Use the generated URL for OAuth callbacks.

### 3. [Fly.io](https://fly.io)

- **Free tier:** Small VMs.
- Add a `Dockerfile` or use `fly launch` and set build/start to use Node. Add env vars in `fly secrets`.

### 4. [Vercel](https://vercel.com)

- Best if you split the app: **Vercel** for the React frontend (static export or Vite build) and **Render/Railway** for the Express API. Single-repo full-stack on Vercel is possible with serverless rewrites but requires adapting the Express app; Render is simpler for this stack.

---

## Push to your GitHub

From your project folder (no Git yet):

```bash
git init
git add .
git commit -m "Initial commit: IntentBot - intent-based chatbot"
git branch -M main
git remote add origin https://github.com/kamblesandesh01/intent-bot.git
git push -u origin main
```

If the repo already exists on GitHub with a README, you may need to pull first:

```bash
git pull origin main --allow-unrelated-histories
# resolve conflicts if any, then:
git push -u origin main
```

**Important:** Never commit `.env`. It’s in `.gitignore`; use `.env.example` as a template and set real values in your deployment dashboard.

---

## Project structure

```
client/          # React SPA (Vite)
server/          # Express API, auth, conversations, intents
shared/          # Types and validation (Zod)
```

See [AGENTS.md](AGENTS.md) for detailed conventions and [OAUTH_SETUP.md](OAUTH_SETUP.md) for OAuth.

---

## Author

**Sandesh Sanjay Kamble**  
- GitHub: [@kamblesandesh01](https://github.com/kamblesandesh01)  
- LinkedIn: [Sandesh Sanjay Kamble](https://www.linkedin.com/in/sandesh-sanjay-kamble/)

---

## License

MIT
