import { RequestHandler } from "express";
import User from "../models/User";
import Session from "../models/Session";
import { connectDB } from "../db";

// Helper to generate simple IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const handleGoogleOAuth: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const { code } = req.body;

    if (!code) {
      res.status(400).json({ message: "Authorization code is required" });
      return;
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.VITE_GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: "http://localhost:8080/auth/google/callback",
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("Token exchange error:", error);
      res.status(401).json({ message: "Failed to exchange authorization code" });
      return;
    }

    const { access_token } = await tokenResponse.json();

    // Get user info using access token
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      res.status(401).json({ message: "Failed to get user info from Google" });
      return;
    }

    const googleUser = await userResponse.json();

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        email: googleUser.email,
        name: googleUser.name,
        oauth: {
          provider: "google",
          providerId: googleUser.id,
          profileImage: googleUser.picture,
        },
        profileImage: googleUser.picture,
      });
      await user.save();
    } else if (!user.oauth) {
      // Link Google account if user exists
      user.oauth = {
        provider: "google",
        providerId: googleUser.id,
        profileImage: googleUser.picture,
      };
      if (!user.profileImage) {
        user.profileImage = googleUser.picture;
      }
      await user.save();
    }

    // Create session
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      sessionId,
      userId: user._id.toString(),
      expiresAt,
    });
    await session.save();

    // Set session cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Google login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Google login failed",
    });
  }
};

export const handleGithubOAuth: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const { code } = req.body;

    if (!code) {
      res.status(400).json({ message: "Code is required" });
      return;
    }

    // Exchange code for access token (you need GitHub app credentials)
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.status(500).json({ message: "GitHub OAuth not configured" });
      return;
    }

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      res.status(401).json({ message: "Invalid GitHub code" });
      return;
    }

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const githubUser = await userResponse.json();

    // Find or create user
    let user = await User.findOne({ email: githubUser.email });

    if (!user) {
      user = new User({
        email: githubUser.email || `${githubUser.login}@github.local`,
        name: githubUser.name || githubUser.login,
        oauth: {
          provider: "github",
          providerId: githubUser.id.toString(),
          profileImage: githubUser.avatar_url,
        },
        profileImage: githubUser.avatar_url,
      });
      await user.save();
    } else if (!user.oauth) {
      // Link GitHub account if user exists
      user.oauth = {
        provider: "github",
        providerId: githubUser.id.toString(),
        profileImage: githubUser.avatar_url,
      };
      if (!user.profileImage) {
        user.profileImage = githubUser.avatar_url;
      }
      await user.save();
    }

    // Create session
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      sessionId,
      userId: user._id.toString(),
      expiresAt,
    });
    await session.save();

    // Set session cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "GitHub login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "GitHub login failed",
    });
  }
};
