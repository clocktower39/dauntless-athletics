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

router.put("/schools/:id", async (req, res) => {
  const schoolId = Number(req.params.id);
  if (!Number.isInteger(schoolId)) {
    return res.status(400).json({ error: "School id is required." });
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    return res.status(400).json({ error: "School name is required." });
  }

  try {
    const result = await query(
      "UPDATE schools SET name = $1 WHERE id = $2 RETURNING id, name, created_at",
      [name, schoolId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "School not found." });
    }
    return res.json({ school: result.rows[0] });
  } catch (error) {
    return res.status(409).json({ error: "School already exists." });
  }
});

router.delete("/schools/:id", async (req, res) => {
  const schoolId = Number(req.params.id);
  if (!Number.isInteger(schoolId)) {
    return res.status(400).json({ error: "School id is required." });
  }

  const result = await query("DELETE FROM schools WHERE id = $1 RETURNING id", [
    schoolId,
  ]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "School not found." });
  }

  return res.json({ schoolId, deleted: true });
});

router.get("/invites", async (req, res) => {
  const schoolId = req.query.school_id ? Number(req.query.school_id) : null;
  const surveyId = req.query.survey_id ? Number(req.query.survey_id) : null;
  const params = [];
  const filters = [];

  if (schoolId) {
    params.push(schoolId);
    filters.push(`invites.school_id = $${params.length}`);
  }

  if (surveyId) {
    params.push(surveyId);
    filters.push(`invites.survey_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT invites.id, invites.school_id, invites.survey_id, invites.used_at, invites.created_at,
            schools.name AS school_name, surveys.title AS survey_title
     FROM invites
     JOIN schools ON schools.id = invites.school_id
     JOIN surveys ON surveys.id = invites.survey_id
     ${whereClause}
     ORDER BY invites.created_at DESC`,
    params
  );

  return res.json({ invites: result.rows });
});

router.post("/invites", async (req, res) => {
  const schoolId = Number(req.body?.school_id);
  const surveyId = Number(req.body?.survey_id);
  const count = Number(req.body?.count || 1);

  if (!Number.isInteger(schoolId)) {
    return res.status(400).json({ error: "school_id is required." });
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

    const schoolResult = await client.query(
      "SELECT id, name FROM schools WHERE id = $1",
      [schoolId]
    );

    const surveyResult = await client.query(
      "SELECT id, title FROM surveys WHERE id = $1",
      [surveyId]
    );

    if (schoolResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "School not found." });
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
        "INSERT INTO invites (survey_id, school_id, token_hash) VALUES ($1, $2, $3) RETURNING id, created_at",
        [surveyId, schoolId, tokenHash]
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
      `SELECT invites.id, invites.school_id, invites.survey_id, invites.used_at,
              schools.name AS school_name, surveys.title AS survey_title
       FROM invites
       JOIN schools ON schools.id = invites.school_id
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
      "INSERT INTO invites (survey_id, school_id, token_hash) VALUES ($1, $2, $3) RETURNING id, created_at",
      [invite.survey_id, invite.school_id, tokenHash]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      school: { id: invite.school_id, name: invite.school_name },
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
  const schoolId = req.query.school_id ? Number(req.query.school_id) : null;
  const surveyId = req.query.survey_id ? Number(req.query.survey_id) : null;
  const params = [];
  const filters = [];

  if (schoolId) {
    params.push(schoolId);
    filters.push(`responses.school_id = $${params.length}`);
  }

  if (surveyId) {
    params.push(surveyId);
    filters.push(`responses.survey_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT responses.id, responses.school_id, responses.survey_id,
            schools.name AS school_name, surveys.title AS survey_title,
            responses.answers, responses.comment, responses.created_at
     FROM responses
     JOIN schools ON schools.id = responses.school_id
     JOIN surveys ON surveys.id = responses.survey_id
     ${whereClause}
     ORDER BY responses.created_at DESC`,
    params
  );

  return res.json({ responses: result.rows });
});

router.get("/teams", async (req, res) => {
  const schoolId = req.query.school_id ? Number(req.query.school_id) : null;
  const params = [];
  const filters = [];

  if (schoolId) {
    params.push(schoolId);
    filters.push(`teams.school_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT teams.id, teams.school_id, teams.name, teams.sport, teams.level, teams.season,
            teams.location, teams.notes, teams.created_at,
            schools.name AS school_name,
            COUNT(contacts.id)::int AS contact_count
     FROM teams
     LEFT JOIN schools ON schools.id = teams.school_id
     LEFT JOIN contacts ON contacts.team_id = teams.id
     ${whereClause}
     GROUP BY teams.id, schools.name
     ORDER BY teams.created_at DESC`,
    params
  );

  return res.json({ teams: result.rows });
});

router.post("/teams", async (req, res) => {
  const rawSchoolId = req.body?.school_id;
  const schoolId = Number(rawSchoolId);
  const hasSchoolId = Number.isInteger(schoolId) && schoolId > 0;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const sport = typeof req.body?.sport === "string" ? req.body.sport.trim() : "";
  const level = typeof req.body?.level === "string" ? req.body.level.trim() : "";
  const season = typeof req.body?.season === "string" ? req.body.season.trim() : "";
  const location = typeof req.body?.location === "string" ? req.body.location.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (!name) {
    return res.status(400).json({ error: "Team name is required." });
  }

  if (hasSchoolId) {
    const schoolResult = await query("SELECT id FROM schools WHERE id = $1", [schoolId]);
    if (schoolResult.rowCount === 0) {
      return res.status(404).json({ error: "School not found." });
    }
  }

  const result = await query(
    `INSERT INTO teams (school_id, name, sport, level, season, location, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, school_id, name, sport, level, season, location, notes, created_at`,
    [
      hasSchoolId ? schoolId : null,
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

  const rawSchoolId = req.body?.school_id;
  const schoolId = Number(rawSchoolId);
  const hasSchoolId = Object.prototype.hasOwnProperty.call(req.body || {}, "school_id");
  const isValidSchoolId = Number.isInteger(schoolId) && schoolId > 0;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const sport = typeof req.body?.sport === "string" ? req.body.sport.trim() : "";
  const level = typeof req.body?.level === "string" ? req.body.level.trim() : "";
  const season = typeof req.body?.season === "string" ? req.body.season.trim() : "";
  const location = typeof req.body?.location === "string" ? req.body.location.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (hasSchoolId && isValidSchoolId) {
    const schoolResult = await query("SELECT id FROM schools WHERE id = $1", [schoolId]);
    if (schoolResult.rowCount === 0) {
      return res.status(404).json({ error: "School not found." });
    }
  }

  const updateFields = [];
  const params = [];
  let paramIndex = 1;

  if (name) {
    updateFields.push(`name = $${paramIndex++}`);
    params.push(name);
  }

  if (hasSchoolId) {
    updateFields.push(`school_id = $${paramIndex++}`);
    params.push(isValidSchoolId ? schoolId : null);
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
     RETURNING id, school_id, name, sport, level, season, location, notes, created_at`,
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
            teams.name AS team_name, schools.name AS school_name
     FROM contacts
     JOIN teams ON teams.id = contacts.team_id
     LEFT JOIN schools ON schools.id = teams.school_id
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

export default router;
