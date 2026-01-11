import express from "express";
import { issueToken, verifyPassword } from "../auth.js";

const router = express.Router();
const debugAuth = process.env.DEBUG_LOGS === "true";

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    if (debugAuth) {
      console.log("[auth] Missing username or password.");
    }
    return res.status(400).json({ error: "Username and password are required." });
  }

  const candidates = [
    {
      role: "admin",
      username: process.env.ADMIN_USERNAME,
      hash: process.env.ADMIN_PASSWORD_HASH,
    },
    {
      role: "owner",
      username: process.env.OWNER_USERNAME,
      hash: process.env.OWNER_PASSWORD_HASH,
    },
  ];

  const match = candidates.find((entry) => entry.username === username);

  if (!match || !match.hash) {
    if (debugAuth) {
      console.log(`[auth] Invalid credentials for username: ${username}`);
    }
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const valid = await verifyPassword(password, match.hash);
  if (!valid) {
    if (debugAuth) {
      console.log(`[auth] Invalid password for username: ${username}`);
    }
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = issueToken(match.role, match.username);
  if (debugAuth) {
    console.log(`[auth] Login success for username: ${username} role: ${match.role}`);
  }
  return res.json({ token, role: match.role });
});

export default router;
