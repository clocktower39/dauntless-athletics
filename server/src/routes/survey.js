import express from "express";
import crypto from "crypto";
import { getClient, query } from "../db.js";

const router = express.Router();

const ratingKeys = ["q1", "q2", "q3", "q4", "q5"];

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const parseRatings = (payload) => {
  const result = {};
  const errors = [];

  ratingKeys.forEach((key) => {
    const value = Number(payload?.[key]);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      errors.push(`${key} must be an integer from 1 to 5.`);
    } else {
      result[key] = value;
    }
  });

  return { ratings: result, errors };
};

router.get("/:token", async (req, res) => {
  const tokenHash = hashToken(req.params.token);

  const result = await query(
    "SELECT invites.used_at, schools.name AS school_name FROM invites JOIN schools ON schools.id = invites.school_id WHERE invites.token_hash = $1",
    [tokenHash]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Invalid or expired link." });
  }

  const invite = result.rows[0];
  return res.json({
    schoolName: invite.school_name,
    used: Boolean(invite.used_at),
  });
});

router.post("/:token", async (req, res) => {
  const { ratings, errors } = parseRatings(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Invalid ratings.", details: errors });
  }

  const comment = typeof req.body?.comment === "string" ? req.body.comment.trim() : "";
  if (comment.length > 2000) {
    return res.status(400).json({ error: "Comment is too long." });
  }

  const tokenHash = hashToken(req.params.token);
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const inviteResult = await client.query(
      "SELECT id, school_id, used_at FROM invites WHERE token_hash = $1 FOR UPDATE",
      [tokenHash]
    );

    if (inviteResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Invalid or expired link." });
    }

    const invite = inviteResult.rows[0];
    if (invite.used_at) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "This link has already been used." });
    }

    await client.query(
      "INSERT INTO responses (school_id, invite_id, q1, q2, q3, q4, q5, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        invite.school_id,
        invite.id,
        ratings.q1,
        ratings.q2,
        ratings.q3,
        ratings.q4,
        ratings.q5,
        comment || null,
      ]
    );

    await client.query("UPDATE invites SET used_at = NOW() WHERE id = $1", [invite.id]);
    await client.query("COMMIT");

    return res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to save response." });
  } finally {
    client.release();
  }
});

export default router;
