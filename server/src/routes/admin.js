import express from "express";
import crypto from "crypto";
import { query, getClient } from "../db.js";
import { requireRole } from "../auth.js";

const router = express.Router();

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const normalizeBaseUrl = (value) => {
  if (!value) return null;
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

router.use(requireRole("admin"));

router.get("/schools", async (_req, res) => {
  const result = await query(
    "SELECT id, name, created_at FROM schools ORDER BY name ASC"
  );
  return res.json({ schools: result.rows });
});

router.post("/schools", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    return res.status(400).json({ error: "School name is required." });
  }

  try {
    const result = await query(
      "INSERT INTO schools (name) VALUES ($1) RETURNING id, name, created_at",
      [name]
    );
    return res.status(201).json({ school: result.rows[0] });
  } catch (error) {
    return res.status(409).json({ error: "School already exists." });
  }
});

router.get("/invites", async (req, res) => {
  const schoolId = req.query.school_id ? Number(req.query.school_id) : null;
  const params = [];
  let whereClause = "";

  if (schoolId) {
    params.push(schoolId);
    whereClause = "WHERE invites.school_id = $1";
  }

  const result = await query(
    `SELECT invites.id, invites.school_id, invites.used_at, invites.created_at, schools.name AS school_name
     FROM invites
     JOIN schools ON schools.id = invites.school_id
     ${whereClause}
     ORDER BY invites.created_at DESC`,
    params
  );

  return res.json({ invites: result.rows });
});

router.post("/invites", async (req, res) => {
  const schoolId = Number(req.body?.school_id);
  const count = Number(req.body?.count || 1);

  if (!Number.isInteger(schoolId)) {
    return res.status(400).json({ error: "school_id is required." });
  }

  if (!Number.isInteger(count) || count < 1 || count > 50) {
    return res.status(400).json({ error: "count must be between 1 and 50." });
  }

  const baseUrl = normalizeBaseUrl(process.env.SURVEY_BASE_URL);
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const schoolResult = await client.query(
      "SELECT id, name FROM schools WHERE id = $1",
      [schoolId]
    );

    if (schoolResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "School not found." });
    }

    const invites = [];
    for (let i = 0; i < count; i += 1) {
      const token = crypto.randomBytes(32).toString("base64url");
      const tokenHash = hashToken(token);

      const inviteResult = await client.query(
        "INSERT INTO invites (school_id, token_hash) VALUES ($1, $2) RETURNING id, created_at",
        [schoolId, tokenHash]
      );

      invites.push({
        id: inviteResult.rows[0].id,
        token,
        link: baseUrl ? `${baseUrl}/${token}` : null,
        createdAt: inviteResult.rows[0].created_at,
      });
    }

    await client.query("COMMIT");

    return res.status(201).json({
      school: schoolResult.rows[0],
      invites,
      warning: baseUrl
        ? null
        : "SURVEY_BASE_URL is not set, links are omitted.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to create invites." });
  } finally {
    client.release();
  }
});

router.post("/invites/:id/regenerate", async (req, res) => {
  const inviteId = Number(req.params.id);
  if (!Number.isInteger(inviteId)) {
    return res.status(400).json({ error: "Invite id is required." });
  }

  const baseUrl = normalizeBaseUrl(process.env.SURVEY_BASE_URL);
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const inviteResult = await client.query(
      "SELECT invites.id, invites.school_id, invites.used_at, schools.name AS school_name FROM invites JOIN schools ON schools.id = invites.school_id WHERE invites.id = $1 FOR UPDATE",
      [inviteId]
    );

    if (inviteResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Invite not found." });
    }

    const invite = inviteResult.rows[0];
    if (invite.used_at) {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ error: "Invite already used. Reopen it before regenerating." });
    }

    await client.query("DELETE FROM invites WHERE id = $1", [inviteId]);

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);
    const newInviteResult = await client.query(
      "INSERT INTO invites (school_id, token_hash) VALUES ($1, $2) RETURNING id, created_at",
      [invite.school_id, tokenHash]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      school: { id: invite.school_id, name: invite.school_name },
      invites: [
        {
          id: newInviteResult.rows[0].id,
          token,
          link: baseUrl ? `${baseUrl}/${token}` : null,
          createdAt: newInviteResult.rows[0].created_at,
        },
      ],
      warning: baseUrl ? null : "SURVEY_BASE_URL is not set, links are omitted.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to regenerate invite." });
  } finally {
    client.release();
  }
});

router.post("/invites/:id/reopen", async (req, res) => {
  const inviteId = Number(req.params.id);
  if (!Number.isInteger(inviteId)) {
    return res.status(400).json({ error: "Invite id is required." });
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const inviteResult = await client.query(
      "SELECT id, used_at FROM invites WHERE id = $1 FOR UPDATE",
      [inviteId]
    );

    if (inviteResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Invite not found." });
    }

    await client.query("DELETE FROM responses WHERE invite_id = $1", [inviteId]);
    await client.query("UPDATE invites SET used_at = NULL WHERE id = $1", [inviteId]);

    await client.query("COMMIT");

    return res.json({ inviteId, reopened: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to reopen invite." });
  } finally {
    client.release();
  }
});

router.delete("/invites/:id", async (req, res) => {
  const inviteId = Number(req.params.id);
  if (!Number.isInteger(inviteId)) {
    return res.status(400).json({ error: "Invite id is required." });
  }

  const result = await query("DELETE FROM invites WHERE id = $1 RETURNING id", [inviteId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Invite not found." });
  }

  return res.json({ inviteId, deleted: true });
});

router.get("/responses", async (req, res) => {
  const schoolId = req.query.school_id ? Number(req.query.school_id) : null;
  const params = [];
  let whereClause = "";

  if (schoolId) {
    params.push(schoolId);
    whereClause = "WHERE responses.school_id = $1";
  }

  const result = await query(
    `SELECT responses.id, responses.school_id, schools.name AS school_name,
            responses.q1, responses.q2, responses.q3, responses.q4, responses.q5,
            responses.comment, responses.created_at
     FROM responses
     JOIN schools ON schools.id = responses.school_id
     ${whereClause}
     ORDER BY responses.created_at DESC`,
    params
  );

  return res.json({ responses: result.rows });
});

export default router;
