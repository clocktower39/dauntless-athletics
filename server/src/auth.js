import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "12h";

export const issueToken = (role, username) => {
  return jwt.sign({ role, username }, jwtSecret, { expiresIn: jwtExpiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

export const verifyPassword = (plaintext, hash) => {
  return bcrypt.compare(plaintext, hash);
};

export const requireRole = (role) => (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing auth token." });
  }

  try {
    const decoded = verifyToken(token);
    if (role && decoded.role !== role) {
      return res.status(403).json({ error: "Forbidden." });
    }
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
