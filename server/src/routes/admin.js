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

const isValidTime = (value) => {
  if (typeof value !== "string") return false;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
};

const DEFAULT_ORG_ID = 1;
const DEFAULT_SEASON_ID = 1;

const buildSurveyPayload = (survey, questions) => ({
  id: survey.id,
  title: survey.title,
  description: survey.description,
  commentPrompt: survey.comment_prompt,
  isActive: survey.is_active,
  createdAt: survey.created_at,
  questions: questions
    .filter((question) => question.survey_id === survey.id)
    .map((question) => ({
      id: question.id,
      text: question.prompt,
      order: question.sort_order,
    })),
});

router.use(requireRole("admin"));

router.get("/surveys", async (_req, res) => {
  const surveysResult = await query(
    "SELECT id, title, description, comment_prompt, is_active, created_at FROM surveys ORDER BY created_at DESC"
  );
  const questionsResult = await query(
    "SELECT id, survey_id, prompt, sort_order FROM survey_questions ORDER BY sort_order ASC"
  );

  const surveys = surveysResult.rows.map((survey) =>
    buildSurveyPayload(survey, questionsResult.rows)
  );

  return res.json({ surveys });
});

router.post("/surveys", async (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";
  const commentPrompt =
    typeof req.body?.commentPrompt === "string" ? req.body.commentPrompt.trim() : "";
  const questions = Array.isArray(req.body?.questions) ? req.body.questions : [];

  if (!title) {
    return res.status(400).json({ error: "Survey title is required." });
  }

  const cleanedQuestions = questions
    .map((question) => ({
      text: typeof question?.text === "string" ? question.text.trim() : "",
    }))
    .filter((question) => question.text);

  if (cleanedQuestions.length === 0) {
    return res.status(400).json({ error: "At least one question is required." });
  }

  const client = await getClient();

  try {
    await client.query("BEGIN");
    const surveyResult = await client.query(
      "INSERT INTO surveys (title, description, comment_prompt) VALUES ($1, $2, $3) RETURNING id, title, description, comment_prompt, is_active, created_at",
      [title, description || null, commentPrompt || null]
    );

    const survey = surveyResult.rows[0];
    const questionRows = [];
    for (let i = 0; i < cleanedQuestions.length; i += 1) {
      const row = await client.query(
        "INSERT INTO survey_questions (survey_id, prompt, sort_order) VALUES ($1, $2, $3) RETURNING id, survey_id, prompt, sort_order",
        [survey.id, cleanedQuestions[i].text, i + 1]
      );
      questionRows.push(row.rows[0]);
    }

    await client.query("COMMIT");

    return res.status(201).json({
      survey: buildSurveyPayload(survey, questionRows),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to create survey." });
  } finally {
    client.release();
  }
});

router.put("/surveys/:id", async (req, res) => {
  const surveyId = Number(req.params.id);
  if (!Number.isInteger(surveyId)) {
    return res.status(400).json({ error: "Survey id is required." });
  }

  const body = req.body || {};
  const hasTitle = Object.prototype.hasOwnProperty.call(body, "title");
  const hasDescription = Object.prototype.hasOwnProperty.call(body, "description");
  const hasCommentPrompt = Object.prototype.hasOwnProperty.call(body, "commentPrompt");
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const description =
    typeof req.body?.description === "string" ? req.body.description.trim() : "";
  const commentPrompt =
    typeof req.body?.commentPrompt === "string" ? req.body.commentPrompt.trim() : "";
  const isActive = typeof req.body?.isActive === "boolean" ? req.body.isActive : null;

  const updateFields = [];
  const params = [];
  let paramIndex = 1;

  if (hasTitle) {
    if (!title) {
      return res.status(400).json({ error: "Survey title is required." });
    }
    updateFields.push(`title = $${paramIndex++}`);
    params.push(title);
  }
  if (hasDescription) {
    updateFields.push(`description = $${paramIndex++}`);
    params.push(description || null);
  }
  if (hasCommentPrompt) {
    updateFields.push(`comment_prompt = $${paramIndex++}`);
    params.push(commentPrompt || null);
  }
  if (isActive !== null) {
    updateFields.push(`is_active = $${paramIndex++}`);
    params.push(isActive);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  params.push(surveyId);

  const result = await query(
    `UPDATE surveys SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING id, title, description, comment_prompt, is_active, created_at`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Survey not found." });
  }

  const questionsResult = await query(
    "SELECT id, survey_id, prompt, sort_order FROM survey_questions WHERE survey_id = $1 ORDER BY sort_order ASC",
    [surveyId]
  );

  return res.json({
    survey: buildSurveyPayload(result.rows[0], questionsResult.rows),
  });
});

router.delete("/surveys/:id", async (req, res) => {
  const surveyId = Number(req.params.id);
  if (!Number.isInteger(surveyId)) {
    return res.status(400).json({ error: "Survey id is required." });
  }

  const result = await query("DELETE FROM surveys WHERE id = $1 RETURNING id", [surveyId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Survey not found." });
  }

  return res.json({ surveyId, deleted: true });
});

router.put("/surveys/:id/questions", async (req, res) => {
  const surveyId = Number(req.params.id);
  if (!Number.isInteger(surveyId)) {
    return res.status(400).json({ error: "Survey id is required." });
  }

  const questions = Array.isArray(req.body?.questions) ? req.body.questions : [];
  const cleanedQuestions = questions
    .map((question) => ({
      text: typeof question?.text === "string" ? question.text.trim() : "",
    }))
    .filter((question) => question.text);

  if (cleanedQuestions.length === 0) {
    return res.status(400).json({ error: "At least one question is required." });
  }

  const client = await getClient();

  try {
    await client.query("BEGIN");

    const surveyResult = await client.query(
      "SELECT id, title, description, comment_prompt, is_active, created_at FROM surveys WHERE id = $1",
      [surveyId]
    );
    if (surveyResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Survey not found." });
    }

    const responseCheck = await client.query(
      "SELECT 1 FROM responses WHERE survey_id = $1 LIMIT 1",
      [surveyId]
    );
    if (responseCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Survey has responses and cannot be edited." });
    }

    await client.query("DELETE FROM survey_questions WHERE survey_id = $1", [surveyId]);

    const questionRows = [];
    for (let i = 0; i < cleanedQuestions.length; i += 1) {
      const row = await client.query(
        "INSERT INTO survey_questions (survey_id, prompt, sort_order) VALUES ($1, $2, $3) RETURNING id, survey_id, prompt, sort_order",
        [surveyId, cleanedQuestions[i].text, i + 1]
      );
      questionRows.push(row.rows[0]);
    }

    await client.query("COMMIT");

    return res.json({
      survey: buildSurveyPayload(surveyResult.rows[0], questionRows),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to update survey questions." });
  } finally {
    client.release();
  }
});

router.get("/organizations", async (req, res) => {
  const orgId = Number(req.query.org_id) || DEFAULT_ORG_ID;
  const type = typeof req.query.type === "string" ? req.query.type.trim() : "";
  const hasParentId = Object.prototype.hasOwnProperty.call(req.query, "parent_id");
  const parentValue = hasParentId ? String(req.query.parent_id || "") : "";
  const parentId =
    hasParentId && parentValue && parentValue !== "null" ? Number(parentValue) : null;

  if (hasParentId && parentValue && parentValue !== "null" && !Number.isInteger(parentId)) {
    return res.status(400).json({ error: "parent_id must be a number or null." });
  }

  const params = [orgId];
  const filters = ["organizations.org_id = $1", "organizations.deleted_at IS NULL"];

  if (type) {
    params.push(type);
    filters.push(`organizations.type = $${params.length}`);
  }

  if (hasParentId) {
    if (parentId === null) {
      filters.push("organizations.parent_id IS NULL");
    } else {
      params.push(parentId);
      filters.push(`organizations.parent_id = $${params.length}`);
    }
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT id, org_id, parent_id, name, type, status, created_at
     FROM organizations
     ${whereClause}
     ORDER BY name ASC`,
    params
  );

  return res.json({ organizations: result.rows });
});

router.post("/organizations", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const type = typeof req.body?.type === "string" ? req.body.type.trim() : "";
  const status = typeof req.body?.status === "string" ? req.body.status.trim() : "active";
  const orgId = Number(req.body?.org_id) || DEFAULT_ORG_ID;
  const hasParentId = Object.prototype.hasOwnProperty.call(req.body || {}, "parent_id");
  const rawParentId = req.body?.parent_id;
  const isParentNull = rawParentId === null || rawParentId === "";
  const parentId = Number(rawParentId);

  if (!name) {
    return res.status(400).json({ error: "Organization name is required." });
  }
  if (!type) {
    return res.status(400).json({ error: "Organization type is required." });
  }
  if (hasParentId && !isParentNull && !Number.isInteger(parentId)) {
    return res.status(400).json({ error: "parent_id must be a valid organization." });
  }
  if (hasParentId && !isParentNull) {
    const parentResult = await query(
      "SELECT id FROM organizations WHERE id = $1 AND deleted_at IS NULL",
      [parentId]
    );
    if (parentResult.rowCount === 0) {
      return res.status(404).json({ error: "Parent organization not found." });
    }
  }

  const result = await query(
    `INSERT INTO organizations (org_id, parent_id, name, type, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, org_id, parent_id, name, type, status, created_at`,
    [orgId, hasParentId && !isParentNull ? parentId : null, name, type, status || "active"]
  );

  return res.status(201).json({ organization: result.rows[0] });
});

router.put("/organizations/:id", async (req, res) => {
  const organizationId = Number(req.params.id);
  if (!Number.isInteger(organizationId)) {
    return res.status(400).json({ error: "Organization id is required." });
  }

  const body = req.body || {};
  const hasName = Object.prototype.hasOwnProperty.call(body, "name");
  const hasType = Object.prototype.hasOwnProperty.call(body, "type");
  const hasStatus = Object.prototype.hasOwnProperty.call(body, "status");
  const hasParentId = Object.prototype.hasOwnProperty.call(body, "parent_id");

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const type = typeof body?.type === "string" ? body.type.trim() : "";
  const status = typeof body?.status === "string" ? body.status.trim() : "";
  const rawParentId = body?.parent_id;
  const isParentNull = rawParentId === null || rawParentId === "";
  const parentId = Number(rawParentId);

  const updates = [];
  const params = [];
  let idx = 1;

  if (hasName) {
    if (!name) {
      return res.status(400).json({ error: "Organization name is required." });
    }
    updates.push(`name = $${idx++}`);
    params.push(name);
  }

  if (hasType) {
    if (!type) {
      return res.status(400).json({ error: "Organization type is required." });
    }
    updates.push(`type = $${idx++}`);
    params.push(type);
  }

  if (hasStatus) {
    if (!status) {
      return res.status(400).json({ error: "Organization status is required." });
    }
    updates.push(`status = $${idx++}`);
    params.push(status);
  }

  if (hasParentId) {
    if (isParentNull) {
      updates.push(`parent_id = $${idx++}`);
      params.push(null);
    } else if (Number.isInteger(parentId)) {
      if (parentId === organizationId) {
        return res.status(400).json({ error: "Organization cannot be its own parent." });
      }
      const parentResult = await query(
        "SELECT id FROM organizations WHERE id = $1 AND deleted_at IS NULL",
        [parentId]
      );
      if (parentResult.rowCount === 0) {
        return res.status(404).json({ error: "Parent organization not found." });
      }
      updates.push(`parent_id = $${idx++}`);
      params.push(parentId);
    } else {
      return res.status(400).json({ error: "parent_id must be a valid organization." });
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  params.push(organizationId);

  const result = await query(
    `UPDATE organizations SET ${updates.join(", ")}
     WHERE id = $${idx} AND deleted_at IS NULL
     RETURNING id, org_id, parent_id, name, type, status, created_at`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Organization not found." });
  }

  return res.json({ organization: result.rows[0] });
});

router.delete("/organizations/:id", async (req, res) => {
  const organizationId = Number(req.params.id);
  if (!Number.isInteger(organizationId)) {
    return res.status(400).json({ error: "Organization id is required." });
  }

  const result = await query(
    "UPDATE organizations SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id",
    [organizationId]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Organization not found." });
  }

  return res.json({ organizationId, deleted: true });
});

router.get("/seasons", async (req, res) => {
  const orgId = Number(req.query.org_id) || DEFAULT_ORG_ID;
  const result = await query(
    `SELECT id, org_id, name, start_date, end_date, is_active
     FROM seasons
     WHERE deleted_at IS NULL AND org_id = $1
     ORDER BY is_active DESC, start_date DESC NULLS LAST, name ASC`,
    [orgId]
  );
  return res.json({ seasons: result.rows });
});

router.post("/seasons", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const orgId = Number(req.body?.org_id) || DEFAULT_ORG_ID;
  const startDate = req.body?.start_date || null;
  const endDate = req.body?.end_date || null;
  const isActive = typeof req.body?.is_active === "boolean" ? req.body.is_active : false;

  if (!name) {
    return res.status(400).json({ error: "Season name is required." });
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");
    if (isActive) {
      await client.query(
        "UPDATE seasons SET is_active = FALSE WHERE org_id = $1 AND deleted_at IS NULL",
        [orgId]
      );
    }
    const result = await client.query(
      `INSERT INTO seasons (org_id, name, start_date, end_date, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, org_id, name, start_date, end_date, is_active`,
      [orgId, name, startDate, endDate, isActive]
    );
    await client.query("COMMIT");
    return res.status(201).json({ season: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to create season." });
  } finally {
    client.release();
  }
});

router.put("/seasons/:id", async (req, res) => {
  const seasonId = Number(req.params.id);
  if (!Number.isInteger(seasonId)) {
    return res.status(400).json({ error: "Season id is required." });
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const startDate = req.body?.start_date || null;
  const endDate = req.body?.end_date || null;
  const isActive = typeof req.body?.is_active === "boolean" ? req.body.is_active : null;

  const updates = [];
  const params = [];
  let idx = 1;

  if (name) {
    updates.push(`name = $${idx++}`);
    params.push(name);
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "start_date")) {
    updates.push(`start_date = $${idx++}`);
    params.push(startDate);
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "end_date")) {
    updates.push(`end_date = $${idx++}`);
    params.push(endDate);
  }
  if (isActive !== null) {
    updates.push(`is_active = $${idx++}`);
    params.push(isActive);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");
    if (isActive) {
      await client.query(
        "UPDATE seasons SET is_active = FALSE WHERE org_id = (SELECT org_id FROM seasons WHERE id = $1) AND deleted_at IS NULL",
        [seasonId]
      );
    }
    params.push(seasonId);
    const result = await client.query(
      `UPDATE seasons SET ${updates.join(", ")} WHERE id = $${idx} AND deleted_at IS NULL
       RETURNING id, org_id, name, start_date, end_date, is_active`,
      params
    );
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Season not found." });
    }
    await client.query("COMMIT");
    return res.json({ season: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to update season." });
  } finally {
    client.release();
  }
});

router.delete("/seasons/:id", async (req, res) => {
  const seasonId = Number(req.params.id);
  if (!Number.isInteger(seasonId)) {
    return res.status(400).json({ error: "Season id is required." });
  }

  const result = await query(
    "UPDATE seasons SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id",
    [seasonId]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Season not found." });
  }
  return res.json({ seasonId, deleted: true });
});


router.get("/invites", async (req, res) => {
  const organizationId = req.query.organization_id
    ? Number(req.query.organization_id)
    : null;
  const surveyId = req.query.survey_id ? Number(req.query.survey_id) : null;
  const params = [];
  const filters = [];

  if (organizationId) {
    params.push(organizationId);
    filters.push(`invites.organization_id = $${params.length}`);
  }

  if (surveyId) {
    params.push(surveyId);
    filters.push(`invites.survey_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT invites.id, invites.organization_id, invites.survey_id, invites.used_at, invites.created_at,
            organizations.name AS organization_name, organizations.type AS organization_type,
            surveys.title AS survey_title
     FROM invites
     JOIN organizations ON organizations.id = invites.organization_id
     JOIN surveys ON surveys.id = invites.survey_id
     ${whereClause}
     ORDER BY invites.created_at DESC`,
    params
  );

  return res.json({ invites: result.rows });
});

router.post("/invites", async (req, res) => {
  const organizationId = Number(req.body?.organization_id);
  const surveyId = Number(req.body?.survey_id);
  const count = Number(req.body?.count || 1);

  if (!Number.isInteger(organizationId)) {
    return res.status(400).json({ error: "organization_id is required." });
  }

  if (!Number.isInteger(surveyId)) {
    return res.status(400).json({ error: "survey_id is required." });
  }

  if (!Number.isInteger(count) || count < 1 || count > 50) {
    return res.status(400).json({ error: "count must be between 1 and 50." });
  }

  const baseUrl = normalizeBaseUrl(process.env.SURVEY_BASE_URL);
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const organizationResult = await client.query(
      "SELECT id, name, type FROM organizations WHERE id = $1 AND deleted_at IS NULL",
      [organizationId]
    );

    const surveyResult = await client.query(
      "SELECT id, title FROM surveys WHERE id = $1",
      [surveyId]
    );

    if (organizationResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Organization not found." });
    }

    if (surveyResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Survey not found." });
    }

    const invites = [];
    for (let i = 0; i < count; i += 1) {
      const token = crypto.randomBytes(32).toString("base64url");
      const tokenHash = hashToken(token);

      const inviteResult = await client.query(
        "INSERT INTO invites (survey_id, organization_id, token_hash) VALUES ($1, $2, $3) RETURNING id, created_at",
        [surveyId, organizationId, tokenHash]
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
      organization: organizationResult.rows[0],
      survey: surveyResult.rows[0],
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
      `SELECT invites.id, invites.organization_id, invites.survey_id, invites.used_at,
              organizations.name AS organization_name, organizations.type AS organization_type,
              surveys.title AS survey_title
       FROM invites
       JOIN organizations ON organizations.id = invites.organization_id
       JOIN surveys ON surveys.id = invites.survey_id
       WHERE invites.id = $1 FOR UPDATE`,
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
      "INSERT INTO invites (survey_id, organization_id, token_hash) VALUES ($1, $2, $3) RETURNING id, created_at",
      [invite.survey_id, invite.organization_id, tokenHash]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      organization: {
        id: invite.organization_id,
        name: invite.organization_name,
        type: invite.organization_type,
      },
      survey: { id: invite.survey_id, title: invite.survey_title },
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
  const organizationId = req.query.organization_id
    ? Number(req.query.organization_id)
    : null;
  const surveyId = req.query.survey_id ? Number(req.query.survey_id) : null;
  const params = [];
  const filters = [];

  if (organizationId) {
    params.push(organizationId);
    filters.push(`responses.organization_id = $${params.length}`);
  }

  if (surveyId) {
    params.push(surveyId);
    filters.push(`responses.survey_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT responses.id, responses.organization_id, responses.survey_id,
            organizations.name AS organization_name, organizations.type AS organization_type,
            surveys.title AS survey_title,
            responses.answers, responses.comment, responses.created_at
     FROM responses
     JOIN organizations ON organizations.id = responses.organization_id
     JOIN surveys ON surveys.id = responses.survey_id
     ${whereClause}
     ORDER BY responses.created_at DESC`,
    params
  );

  return res.json({ responses: result.rows });
});

router.get("/teams", async (req, res) => {
  const organizationId = req.query.organization_id
    ? Number(req.query.organization_id)
    : null;
  const params = [];
  const filters = [];

  if (organizationId) {
    params.push(organizationId);
    filters.push(`teams.organization_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT teams.id, teams.org_id, teams.organization_id, teams.season_id, teams.name, teams.sport, teams.level, teams.season,
            teams.location, teams.notes, teams.created_at,
            organizations.name AS organization_name,
            organizations.type AS organization_type,
            seasons.name AS season_name,
            COUNT(contacts.id)::int AS contact_count
     FROM teams
     LEFT JOIN organizations ON organizations.id = teams.organization_id
     LEFT JOIN seasons ON seasons.id = teams.season_id
     LEFT JOIN contacts ON contacts.team_id = teams.id
     ${whereClause}
     GROUP BY teams.id, organizations.name, organizations.type, seasons.name
     ORDER BY teams.created_at DESC`,
    params
  );

  return res.json({ teams: result.rows });
});

router.post("/teams", async (req, res) => {
  const rawOrganizationId = req.body?.organization_id;
  const organizationId = Number(rawOrganizationId);
  const hasOrganizationId = Number.isInteger(organizationId) && organizationId > 0;
  const rawSeasonId = req.body?.season_id;
  const seasonId = Number(rawSeasonId);
  const hasSeasonId = Number.isInteger(seasonId) && seasonId > 0;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const sport = typeof req.body?.sport === "string" ? req.body.sport.trim() : "";
  const level = typeof req.body?.level === "string" ? req.body.level.trim() : "";
  const season = typeof req.body?.season === "string" ? req.body.season.trim() : "";
  const location = typeof req.body?.location === "string" ? req.body.location.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (!name) {
    return res.status(400).json({ error: "Team name is required." });
  }

  if (hasOrganizationId) {
    const organizationResult = await query(
      "SELECT id FROM organizations WHERE id = $1 AND deleted_at IS NULL",
      [organizationId]
    );
    if (organizationResult.rowCount === 0) {
      return res.status(404).json({ error: "Organization not found." });
    }
  }

  const result = await query(
    `INSERT INTO teams (org_id, organization_id, season_id, name, sport, level, season, location, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, org_id, organization_id, season_id, name, sport, level, season, location, notes, created_at`,
    [
      DEFAULT_ORG_ID,
      hasOrganizationId ? organizationId : null,
      hasSeasonId ? seasonId : DEFAULT_SEASON_ID,
      name,
      sport || null,
      level || null,
      season || null,
      location || null,
      notes || null,
    ]
  );

  return res.status(201).json({ team: result.rows[0] });
});

router.put("/teams/:id", async (req, res) => {
  const teamId = Number(req.params.id);
  if (!Number.isInteger(teamId)) {
    return res.status(400).json({ error: "Team id is required." });
  }

  const rawOrganizationId = req.body?.organization_id;
  const organizationId = Number(rawOrganizationId);
  const hasOrganizationId = Object.prototype.hasOwnProperty.call(
    req.body || {},
    "organization_id"
  );
  const isValidOrganizationId = Number.isInteger(organizationId) && organizationId > 0;
  const rawSeasonId = req.body?.season_id;
  const seasonId = Number(rawSeasonId);
  const hasSeasonId = Object.prototype.hasOwnProperty.call(req.body || {}, "season_id");
  const isValidSeasonId = Number.isInteger(seasonId) && seasonId > 0;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const sport = typeof req.body?.sport === "string" ? req.body.sport.trim() : "";
  const level = typeof req.body?.level === "string" ? req.body.level.trim() : "";
  const season = typeof req.body?.season === "string" ? req.body.season.trim() : "";
  const location = typeof req.body?.location === "string" ? req.body.location.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (hasOrganizationId && isValidOrganizationId) {
    const organizationResult = await query(
      "SELECT id FROM organizations WHERE id = $1 AND deleted_at IS NULL",
      [organizationId]
    );
    if (organizationResult.rowCount === 0) {
      return res.status(404).json({ error: "Organization not found." });
    }
  }
  if (hasSeasonId && isValidSeasonId) {
    const seasonResult = await query("SELECT id FROM seasons WHERE id = $1", [seasonId]);
    if (seasonResult.rowCount === 0) {
      return res.status(404).json({ error: "Season not found." });
    }
  }

  const updateFields = [];
  const params = [];
  let paramIndex = 1;

  if (name) {
    updateFields.push(`name = $${paramIndex++}`);
    params.push(name);
  }

  if (hasOrganizationId) {
    updateFields.push(`organization_id = $${paramIndex++}`);
    params.push(isValidOrganizationId ? organizationId : null);
  }

  if (hasSeasonId) {
    updateFields.push(`season_id = $${paramIndex++}`);
    params.push(isValidSeasonId ? seasonId : null);
  }

  updateFields.push(`sport = $${paramIndex++}`);
  params.push(sport || null);

  updateFields.push(`level = $${paramIndex++}`);
  params.push(level || null);

  updateFields.push(`season = $${paramIndex++}`);
  params.push(season || null);

  updateFields.push(`location = $${paramIndex++}`);
  params.push(location || null);

  updateFields.push(`notes = $${paramIndex++}`);
  params.push(notes || null);

  params.push(teamId);

  const result = await query(
    `UPDATE teams SET ${updateFields.join(", ")} WHERE id = $${paramIndex}
     RETURNING id, org_id, organization_id, season_id, name, sport, level, season, location, notes, created_at`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Team not found." });
  }

  return res.json({ team: result.rows[0] });
});

router.delete("/teams/:id", async (req, res) => {
  const teamId = Number(req.params.id);
  if (!Number.isInteger(teamId)) {
    return res.status(400).json({ error: "Team id is required." });
  }

  const result = await query("DELETE FROM teams WHERE id = $1 RETURNING id", [teamId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Team not found." });
  }

  return res.json({ teamId, deleted: true });
});

router.get("/contacts", async (req, res) => {
  const teamId = req.query.team_id ? Number(req.query.team_id) : null;
  const params = [];
  const filters = [];

  if (teamId) {
    params.push(teamId);
    filters.push(`contacts.team_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT contacts.id, contacts.team_id, contacts.name, contacts.role, contacts.audience,
            contacts.email, contacts.phone, contacts.notes, contacts.created_at,
            teams.name AS team_name, organizations.name AS organization_name, organizations.type AS organization_type
     FROM contacts
     JOIN teams ON teams.id = contacts.team_id
     LEFT JOIN organizations ON organizations.id = teams.organization_id
     ${whereClause}
     ORDER BY contacts.created_at DESC`,
    params
  );

  return res.json({ contacts: result.rows });
});

router.post("/contacts", async (req, res) => {
  const teamId = Number(req.body?.team_id);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const role = typeof req.body?.role === "string" ? req.body.role.trim() : "";
  const audience = typeof req.body?.audience === "string" ? req.body.audience.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (!Number.isInteger(teamId) || teamId < 1) {
    return res.status(400).json({ error: "team_id is required." });
  }

  if (!name) {
    return res.status(400).json({ error: "Contact name is required." });
  }

  const teamResult = await query("SELECT id FROM teams WHERE id = $1", [teamId]);
  if (teamResult.rowCount === 0) {
    return res.status(404).json({ error: "Team not found." });
  }

  const result = await query(
    `INSERT INTO contacts (team_id, name, role, audience, email, phone, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, team_id, name, role, audience, email, phone, notes, created_at`,
    [teamId, name, role || null, audience || null, email || null, phone || null, notes || null]
  );

  return res.status(201).json({ contact: result.rows[0] });
});

router.put("/contacts/:id", async (req, res) => {
  const contactId = Number(req.params.id);
  if (!Number.isInteger(contactId)) {
    return res.status(400).json({ error: "Contact id is required." });
  }

  const body = req.body || {};
  const hasTeamId = Object.prototype.hasOwnProperty.call(body, "team_id");
  const teamId = Number(req.body?.team_id);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const role = typeof req.body?.role === "string" ? req.body.role.trim() : "";
  const audience = typeof req.body?.audience === "string" ? req.body.audience.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (hasTeamId) {
    if (!Number.isInteger(teamId) || teamId < 1) {
      return res.status(400).json({ error: "team_id must be a valid team." });
    }
    const teamResult = await query("SELECT id FROM teams WHERE id = $1", [teamId]);
    if (teamResult.rowCount === 0) {
      return res.status(404).json({ error: "Team not found." });
    }
  }

  const updateFields = [];
  const params = [];
  let paramIndex = 1;

  if (name) {
    updateFields.push(`name = $${paramIndex++}`);
    params.push(name);
  }

  if (hasTeamId) {
    updateFields.push(`team_id = $${paramIndex++}`);
    params.push(teamId);
  }

  if (role || role === "") {
    updateFields.push(`role = $${paramIndex++}`);
    params.push(role || null);
  }

  if (audience || audience === "") {
    updateFields.push(`audience = $${paramIndex++}`);
    params.push(audience || null);
  }

  if (email || email === "") {
    updateFields.push(`email = $${paramIndex++}`);
    params.push(email || null);
  }

  if (phone || phone === "") {
    updateFields.push(`phone = $${paramIndex++}`);
    params.push(phone || null);
  }

  if (notes || notes === "") {
    updateFields.push(`notes = $${paramIndex++}`);
    params.push(notes || null);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  params.push(contactId);

  const result = await query(
    `UPDATE contacts SET ${updateFields.join(", ")} WHERE id = $${paramIndex}
     RETURNING id, team_id, name, role, audience, email, phone, notes, created_at`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Contact not found." });
  }

  return res.json({ contact: result.rows[0] });
});

router.delete("/contacts/:id", async (req, res) => {
  const contactId = Number(req.params.id);
  if (!Number.isInteger(contactId)) {
    return res.status(400).json({ error: "Contact id is required." });
  }

  const result = await query("DELETE FROM contacts WHERE id = $1 RETURNING id", [contactId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Contact not found." });
  }

  return res.json({ contactId, deleted: true });
});

router.get("/coaches", async (_req, res) => {
  const result = await query(
    `SELECT coaches.id, coaches.org_id, coaches.name, coaches.email, coaches.phone, coaches.created_at,
            COUNT(coach_team.team_id)::int AS team_count
     FROM coaches
     LEFT JOIN coach_team ON coach_team.coach_id = coaches.id
     GROUP BY coaches.id
     ORDER BY coaches.created_at DESC`
  );
  return res.json({ coaches: result.rows });
});

router.post("/coaches", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const orgId = Number(req.body?.org_id) || DEFAULT_ORG_ID;

  if (!name) {
    return res.status(400).json({ error: "Coach name is required." });
  }

  const result = await query(
    `INSERT INTO coaches (org_id, name, email, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, org_id, name, email, phone, created_at`,
    [orgId, name, email || null, phone || null]
  );

  return res.status(201).json({ coach: result.rows[0] });
});

router.put("/coaches/:id", async (req, res) => {
  const coachId = Number(req.params.id);
  if (!Number.isInteger(coachId)) {
    return res.status(400).json({ error: "Coach id is required." });
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";

  const updateFields = [];
  const params = [];
  let paramIndex = 1;

  if (name) {
    updateFields.push(`name = $${paramIndex++}`);
    params.push(name);
  }
  if (email || email === "") {
    updateFields.push(`email = $${paramIndex++}`);
    params.push(email || null);
  }
  if (phone || phone === "") {
    updateFields.push(`phone = $${paramIndex++}`);
    params.push(phone || null);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  params.push(coachId);

  const result = await query(
    `UPDATE coaches SET ${updateFields.join(", ")} WHERE id = $${paramIndex}
     RETURNING id, org_id, name, email, phone, created_at`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Coach not found." });
  }

  return res.json({ coach: result.rows[0] });
});

router.delete("/coaches/:id", async (req, res) => {
  const coachId = Number(req.params.id);
  if (!Number.isInteger(coachId)) {
    return res.status(400).json({ error: "Coach id is required." });
  }

  const result = await query("DELETE FROM coaches WHERE id = $1 RETURNING id", [coachId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Coach not found." });
  }

  return res.json({ coachId, deleted: true });
});

router.post("/coach-teams", async (req, res) => {
  const coachId = Number(req.body?.coach_id);
  const teamId = Number(req.body?.team_id);
  const seasonId = Number(req.body?.season_id) || DEFAULT_SEASON_ID;
  const role = typeof req.body?.role === "string" ? req.body.role.trim() : "";

  if (!Number.isInteger(coachId)) {
    return res.status(400).json({ error: "coach_id is required." });
  }
  if (!Number.isInteger(teamId)) {
    return res.status(400).json({ error: "team_id is required." });
  }

  const result = await query(
    `INSERT INTO coach_team (coach_id, team_id, season_id, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (coach_id, team_id, season_id) DO NOTHING
     RETURNING coach_id, team_id, season_id, role`,
    [coachId, teamId, seasonId, role || null]
  );

  return res.status(201).json({ assignment: result.rows[0] || null });
});

router.delete("/coach-teams", async (req, res) => {
  const coachId = Number(req.body?.coach_id);
  const teamId = Number(req.body?.team_id);
  const seasonId = Number(req.body?.season_id) || DEFAULT_SEASON_ID;

  if (!Number.isInteger(coachId) || !Number.isInteger(teamId)) {
    return res.status(400).json({ error: "coach_id and team_id are required." });
  }

  const result = await query(
    `DELETE FROM coach_team WHERE coach_id = $1 AND team_id = $2 AND season_id = $3`,
    [coachId, teamId, seasonId]
  );

  return res.json({ coachId, teamId, seasonId, deleted: result.rowCount > 0 });
});

router.get("/coach-teams", async (req, res) => {
  const coachId = req.query.coach_id ? Number(req.query.coach_id) : null;
  const teamId = req.query.team_id ? Number(req.query.team_id) : null;
  const params = [];
  const filters = [];

  if (coachId) {
    params.push(coachId);
    filters.push(`coach_team.coach_id = $${params.length}`);
  }

  if (teamId) {
    params.push(teamId);
    filters.push(`coach_team.team_id = $${params.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT coach_team.coach_id, coach_team.team_id, coach_team.season_id, coach_team.role,
            coaches.name AS coach_name, teams.name AS team_name, seasons.name AS season_name
     FROM coach_team
     JOIN coaches ON coaches.id = coach_team.coach_id
     JOIN teams ON teams.id = coach_team.team_id
     LEFT JOIN seasons ON seasons.id = coach_team.season_id
     ${whereClause}
     ORDER BY coaches.name ASC, teams.name ASC`,
    params
  );

  return res.json({ assignments: result.rows });
});

router.get("/practices", async (req, res) => {
  const teamId = req.query.team_id ? Number(req.query.team_id) : null;
  const params = [];
  const filters = [];

  if (teamId) {
    params.push(teamId);
    filters.push(`practices.team_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT practices.id, practices.team_id, practices.contact_id, practices.day_of_week,
            practices.start_time, practices.end_time, practices.location, practices.notes,
            practices.created_at, teams.name AS team_name,
            organizations.name AS organization_name, organizations.type AS organization_type,
            contacts.name AS contact_name, contacts.role AS contact_role
     FROM practices
     JOIN teams ON teams.id = practices.team_id
     LEFT JOIN organizations ON organizations.id = teams.organization_id
     LEFT JOIN contacts ON contacts.id = practices.contact_id
     ${whereClause}
     ORDER BY practices.day_of_week ASC, practices.start_time ASC`,
    params
  );

  return res.json({ practices: result.rows });
});

router.post("/practices", async (req, res) => {
  const teamId = Number(req.body?.team_id);
  const contactId = req.body?.contact_id ? Number(req.body.contact_id) : null;
  const dayOfWeek = Number(req.body?.day_of_week);
  const startTime = req.body?.start_time;
  const endTime = req.body?.end_time;
  const location = typeof req.body?.location === "string" ? req.body.location.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (!Number.isInteger(teamId) || teamId < 1) {
    return res.status(400).json({ error: "team_id is required." });
  }
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return res.status(400).json({ error: "day_of_week must be between 0 and 6." });
  }
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return res.status(400).json({ error: "start_time and end_time must be HH:MM." });
  }
  if (startTime >= endTime) {
    return res.status(400).json({ error: "end_time must be after start_time." });
  }

  const teamResult = await query("SELECT id FROM teams WHERE id = $1", [teamId]);
  if (teamResult.rowCount === 0) {
    return res.status(404).json({ error: "Team not found." });
  }

  if (contactId) {
    const contactResult = await query(
      "SELECT id FROM contacts WHERE id = $1 AND team_id = $2",
      [contactId, teamId]
    );
    if (contactResult.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found for this team." });
    }
  }

  const result = await query(
    `INSERT INTO practices (team_id, contact_id, day_of_week, start_time, end_time, location, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, team_id, contact_id, day_of_week, start_time, end_time, location, notes, created_at`,
    [teamId, contactId, dayOfWeek, startTime, endTime, location || null, notes || null]
  );

  return res.status(201).json({ practice: result.rows[0] });
});

router.put("/practices/:id", async (req, res) => {
  const practiceId = Number(req.params.id);
  if (!Number.isInteger(practiceId)) {
    return res.status(400).json({ error: "Practice id is required." });
  }

  const teamId = Number(req.body?.team_id);
  const contactId = req.body?.contact_id ? Number(req.body.contact_id) : null;
  const dayOfWeek = Number(req.body?.day_of_week);
  const startTime = req.body?.start_time;
  const endTime = req.body?.end_time;
  const location = typeof req.body?.location === "string" ? req.body.location.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (!Number.isInteger(teamId) || teamId < 1) {
    return res.status(400).json({ error: "team_id is required." });
  }
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return res.status(400).json({ error: "day_of_week must be between 0 and 6." });
  }
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return res.status(400).json({ error: "start_time and end_time must be HH:MM." });
  }
  if (startTime >= endTime) {
    return res.status(400).json({ error: "end_time must be after start_time." });
  }

  const teamResult = await query("SELECT id FROM teams WHERE id = $1", [teamId]);
  if (teamResult.rowCount === 0) {
    return res.status(404).json({ error: "Team not found." });
  }

  if (contactId) {
    const contactResult = await query(
      "SELECT id FROM contacts WHERE id = $1 AND team_id = $2",
      [contactId, teamId]
    );
    if (contactResult.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found for this team." });
    }
  }

  const result = await query(
    `UPDATE practices
     SET team_id = $1, contact_id = $2, day_of_week = $3, start_time = $4, end_time = $5,
         location = $6, notes = $7
     WHERE id = $8
     RETURNING id, team_id, contact_id, day_of_week, start_time, end_time, location, notes, created_at`,
    [teamId, contactId, dayOfWeek, startTime, endTime, location || null, notes || null, practiceId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Practice not found." });
  }

  return res.json({ practice: result.rows[0] });
});

router.delete("/practices/:id", async (req, res) => {
  const practiceId = Number(req.params.id);
  if (!Number.isInteger(practiceId)) {
    return res.status(400).json({ error: "Practice id is required." });
  }

  const result = await query("DELETE FROM practices WHERE id = $1 RETURNING id", [practiceId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Practice not found." });
  }

  return res.json({ practiceId, deleted: true });
});

export default router;
