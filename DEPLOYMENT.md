# IntentBot Deployment Guide

This guide covers free deployment options for the IntentBot application.

## Prerequisites

Before deploying, ensure you have:
- ✅ Code pushed to GitHub (https://github.com/kamblesandesh01/intent-bot)
- ✅ MongoDB Atlas account with a free database cluster
- ✅ OAuth credentials (GitHub & Google) with callback URLs updated
- ✅ Environment variables configured in `.env.example`

---

## Recommended: Render.com (Easiest)

**Why Render?** Full-stack support, simple GitHub integration, free tier includes web service + free database hosting.

### Step-by-Step Setup

#### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub (easier, auto-linked)

#### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository: `intent-bot`
- Choose the repository and allow access

#### 3. Configure Build & Start Commands
- **Name:** `intent-bot` (or your preference)
- **Environment:** `Node`
- **Build Command:** `pnpm install && pnpm build`
- **Start Command:** `pnpm start`
- **Instance Type:** Free (0.5 CPU, 512 MB RAM)

#### 4. Add Environment Variables
Click **"Environment"** and add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NODE_ENV=production
VITE_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PING_MESSAGE=ping pong
```

> **Note:** Get `MONGODB_URI` from [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)

#### 5. Update OAuth Callback URLs
After deployment, Render will generate a URL like: `https://intent-bot-xxxx.onrender.com`

Update these in your OAuth apps:

**GitHub:**
- Settings → Developer settings → OAuth Apps → Your app
- Authorization callback URL: `https://intent-bot-xxxx.onrender.com/auth/github/callback`

**Google:**
- Google Cloud Console → Credentials → Your OAuth 2.0 Client ID
- Authorized redirect URIs: `https://intent-bot-xxxx.onrender.com/auth/google/callback`

#### 6. Deploy
- Click **"Create Web Service"**
- Render will build and deploy automatically
- Monitor progress in the **"Logs"** tab
- Once deployed, your app is live! 🎉

---

## Alternative: Railway.app

Railway offers a free monthly allowance ($5). Great for testing and small projects.

### Setup
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Set Build: `pnpm install && pnpm build`
4. Set Start: `pnpm start`
5. Add environment variables
6. Deploy

Generated URL format: `https://project-xxxx.railway.app`

---

## Alternative: Fly.io

Fly.io offers small free VMs. Requires Docker knowledge or `fly launch`.

### Quick Setup
```bash
# Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
fly launch
# Follow prompts, set build/start commands
# Add secrets: fly secrets set MONGODB_URI=...
fly deploy
```

---

## MongoDB Setup (Free Tier)

All services above work with MongoDB Atlas free tier:

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up (free)
3. Create a cluster (AWS, free tier)
4. Add a database user (username/password)
5. Whitelist IP: Allow access from anywhere (0.0.0.0/0) for deployment
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database?...`
7. Use this as `MONGODB_URI` in deployment environment

---

## Post-Deployment Checklist

- [ ] App loads at deployment URL
- [ ] Login/Signup pages work
- [ ] OAuth (GitHub/Google) redirects work
- [ ] Can create conversations
- [ ] Intent recognition displays confidence scores
- [ ] Profile picture upload works
- [ ] Mobile layout looks good
- [ ] Dark mode toggles correctly

### Debugging Issues

**"502 Bad Gateway" or build fails?**
- Check Build Logs for errors
- Ensure `pnpm` is available (already in package.json scripts)
- Verify all env vars are set

**OAuth redirects to home page?**
- Update callback URLs in GitHub/Google OAuth settings
- Ensure callback URL matches deployment URL exactly

**MongoDB connection fails?**
- Check `MONGODB_URI` format (user:password@host)
- Ensure IP whitelist includes deployment server
- Verify username and password are correct

**App is very slow?**
- Free tier resources (512MB RAM) may be limited
- Consider upgrading tier or optimizing queries

---

## Tips & Best Practices

1. **Environment Variables:** Never commit `.env`; always set in deployment dashboard
2. **Monitoring:** Check logs regularly for errors
3. **Database:** Backup your MongoDB data regularly
4. **Auto-restart:** Render auto-restarts on code push
5. **Custom Domain:** Both services support custom domains (paid tier)

---

## Need Help?

- Render Docs: [render.com/docs](https://render.com/docs)
- Railway Docs: [railway.app/docs](https://railway.app/docs)
- Fly.io Docs: [fly.io/docs](https://fly.io/docs)
- MongoDB Docs: [mongodb.com/docs](https://www.mongodb.com/docs)

Happy deploying! 🚀
