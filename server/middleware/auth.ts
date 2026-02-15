import { RequestHandler } from "express";
import Session from "../models/Session";

/**
 * Middleware to validate session and attach user info to request
 */
export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const session = await Session.findOne({ sessionId });

    // Check if session exists and is not expired
    if (!session || new Date() > session.expiresAt) {
      res.status(401).json({ message: "Session expired" });
      return;
    }

    // Attach userId to request for use in route handlers
    (req as any).userId = session.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

/**
 * Optional auth - doesn't fail if not authenticated, but attaches userId if available
 */
export const optionalAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      const session = await Session.findOne({ sessionId });
      if (session && new Date() <= session.expiresAt) {
        (req as any).userId = session.userId;
      }
    }
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Don't fail, just continue
  }
};
