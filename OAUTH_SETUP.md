# OAuth Setup Guide for IntentBot

## Overview
This guide explains how to set up GitHub and Google OAuth for the IntentBot application.

## Database Setup
- MongoDB required (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- User model with OAuth support
- Session persistence in database

---

## GitHub OAuth Setup

### Step 1: Create a GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the following:
   - **Application name**: IntentBot
   - **Homepage URL**: `http://localhost:8080` (for development)
   - **Authorization callback URL**: `http://localhost:8080/auth/github/callback`

### Step 2: Get Your Credentials
1. Click on your new app
2. Copy your **Client ID**
3. Generate and copy your **Client Secret** (keep it private!)

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

### Step 4: Test GitHub Login
1. Go to http://localhost:8080/login
2. Click "Continue with GitHub"
3. Authorize the app on GitHub
4. You should be automatically logged in and redirected to /chat

---

## Google OAuth Setup

### Step 1: Create a Google OAuth App
1. Go to https://console.cloud.google.com
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Select **"Web application"** as the application type

### Step 2: Configure OAuth Consent Screen
1. Go to **OAuth consent screen** tab
2. Select **External** as User Type
3. Fill in required fields:
   - App name: IntentBot
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com

### Step 3: Add Authorized Redirect URIs
In the OAuth 2.0 Client ID settings, add the following Authorized redirect URIs:
- `http://localhost:8080/auth/google/callback` (development)
- `https://yourdomain.com/auth/google/callback` (production)

### Step 4: Configure Environment Variables
Add to your `.env` file:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### Step 5: Add Google Sign-In Script
Add this to `index.html` in the `<head>` section:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Step 6: Test Google Login
1. Go to http://localhost:8080/login
2. Click "Continue with Google"
3. Select your Google account
4. You should be automatically logged in and redirected to /chat

---

## UI Design Updates

### Login & Signup Pages (ChatGPT Style)
✅ **Completed Updates:**
- Minimal, clean design
- OAuth buttons prominently displayed at the top
- "or" divider separating OAuth from email/password
- Simple form layout
- Responsive design for mobile and desktop
- Dark mode support with subtle styling
### Chat Page (ChatGPT Style)
✅ **Completed Updates:**
- Sidebar with chat history on the left
- Main chat area with message flow
- User messages on the right, assistant on the left
- Input area at the bottom with minimal design
- Header with user name and settings button
- Responsive design that adapts to screen size
- Clean, modern styling with proper spacing

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current user info
- `PATCH /api/auth/profile` - Update profile (e.g. profile picture)
- `POST /api/auth/google` - Google OAuth callback
- `POST /api/auth/github` - GitHub OAuth callback

### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get specific conversation
- `POST /api/conversations/:id/messages` - Add message to conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `PATCH /api/conversations/:id` - Update conversation title

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | `abc123...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret (backend only) | `xyz789...` |
| `VITE_GITHUB_CLIENT_ID` | GitHub client ID for frontend | `abc123...` |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID | `abc123...` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app secret (backend only) | `xyz789...` |
| `VITE_GOOGLE_CLIENT_ID` | Google client ID for frontend | `abc123...` |
| `NODE_ENV` | Environment (development/production) | `development` |

---

## Troubleshooting

### GitHub OAuth Issues
- **"Invalid state parameter"**: Clear browser cache and try again
- **"Authorization code invalid"**: Code has expired, try logging in again
- **"Redirect URI mismatch"**: Ensure callback URL matches exactly in GitHub settings

### Google OAuth Issues
- **"Uncaught (in promise) popup_closed_by_user"**: User closed the Google sign-in popup
- **"Credential not parsed"**: Ensure Google Sign-In script is loaded in index.html
- **"Invalid client ID"**: Check that VITE_GOOGLE_CLIENT_ID is correct

### Database Issues
- **"MongoDB connection failed"**: Check MONGODB_URI is correct and network access is enabled
- **"Session not found"**: Server restarted, user needs to login again (now persisted in DB)

---

## Testing Checklist

- [ ] Email/password signup creates new user
- [ ] Email/password login works
- [ ] GitHub OAuth login works
- [ ] Google OAuth login works
- [ ] Chat page loads after login
- [ ] Conversations are saved to database
- [ ] Previous conversations load from sidebar
- [ ] Settings page is accessible
- [ ] Logout works and clears session
- [ ] Responsive design works on mobile
- [ ] Dark mode works correctly

---

## Production Deployment

When deploying to production:

1. **Update callback URLs** in GitHub and Google settings to your production domain
2. **Update environment variables** with production credentials
3. **Set `NODE_ENV=production`**
4. **Use HTTPS** for all OAuth redirects
5. **Secure environment variables** - never expose secrets in frontend code
6. **Verify MongoDB** has proper security rules and network access from production servers

---

## Next Steps

1. ✅ Set up MongoDB (already done)
2. 🔄 Set up GitHub OAuth (see instructions above)
3. 🔄 Set up Google OAuth (see instructions above)
4. ✅ Update UI to ChatGPT style (completed)
5. ✅ Test all OAuth flows (ready to test)

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review OAuth provider documentation (GitHub/Google)
- Check browser console for detailed error messages
- Verify all environment variables are set correctly
