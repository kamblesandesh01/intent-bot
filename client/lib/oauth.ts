/**
 * OAuth utility functions for handling Google and GitHub authentication
 */

export const initiateGithubOAuth = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  
  if (!clientId) {
    alert(
      "GitHub OAuth is not configured.\n\nTo set up GitHub OAuth:\n" +
      "1. Go to https://github.com/settings/developers\n" +
      "2. Create a new OAuth App\n" +
      "3. Set Authorization callback URL to: " + window.location.origin + "/auth/github/callback\n" +
      "4. Add VITE_GITHUB_CLIENT_ID to your .env file"
    );
    return;
  }

  const redirectUri = `${window.location.origin}/auth/github/callback`;
  const scope = "user:email";
  const state = Math.random().toString(36).substring(7);
  
  // Store state in sessionStorage for verification
  sessionStorage.setItem("oauth_state", state);
  
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  window.location.href = authUrl.toString();
};

export const initiateGoogleOAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    alert(
      "Google OAuth is not configured.\n\nTo set up Google OAuth:\n" +
      "1. Go to https://console.cloud.google.com\n" +
      "2. Create a new project and set up OAuth 2.0\n" +
      "3. Add authorized redirect URI: " + window.location.origin + "/auth/google/callback\n" +
      "4. Add VITE_GOOGLE_CLIENT_ID to your .env file\n" +
      "5. Add your Gmail account under Audience → Test users"
    );
    return;
  }

  // Use OAuth 2.0 redirect flow
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = "openid email profile";
  const state = Math.random().toString(36).substring(7);
  
  // Store state in sessionStorage for verification
  sessionStorage.setItem("oauth_state", state);
  
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "offline");

  window.location.href = authUrl.toString();
};

// Parse JWT token (basic implementation)
export const parseJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
};
