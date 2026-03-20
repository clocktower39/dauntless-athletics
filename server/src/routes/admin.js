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

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeNullableText = (value) => {
  const text = normalizeText(value);
  return text || null;
};

const normalizeInteger = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
};

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const DEFAULT_ORG_ID = 1;
const DEFAULT_SEASON_ID = 1;
const ATHLETE_MEMBERSHIP_STATUSES = new Set(["active", "inactive", "removed", "transferred"]);

const ATHLETE_PROFILE_FIELDS = [
  "primary_email",
  "age_label",
  "student_keywords",
  "roll_sheet_comment",
  "allergies_health_concerns",
  "hospital_clinic_preference",
  "insurance_carrier_company",
  "policy_number",
  "physician_name",
  "physician_phone",
  "emergency_contact_name",
  "emergency_contact_phone",
  "active_enrollment_count",
  "class_enrollment_count",
  "camp_enrollment_count",
  "appointment_booking_count",
  "current_event_name",
  "instructors",
];

const upsertAthleteProfile = async (client, athleteId, profileValues) => {
  const hasValues = Object.values(profileValues).some((value) => value !== null && value !== undefined);
  if (!hasValues) return;

  await client.query(
    `INSERT INTO athlete_profiles (
      athlete_id, primary_email, age_label, student_keywords, roll_sheet_comment,
      allergies_health_concerns, hospital_clinic_preference, insurance_carrier_company,
      policy_number, physician_name, physician_phone, emergency_contact_name,
      emergency_contact_phone, active_enrollment_count, class_enrollment_count,
      camp_enrollment_count, appointment_booking_count, current_event_name, instructors
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8,
      $9, $10, $11, $12,
      $13, $14, $15,
      $16, $17, $18, $19
    )
    ON CONFLICT (athlete_id)
    DO UPDATE SET
      primary_email = EXCLUDED.primary_email,
      age_label = EXCLUDED.age_label,
      student_keywords = EXCLUDED.student_keywords,
      roll_sheet_comment = EXCLUDED.roll_sheet_comment,
      allergies_health_concerns = EXCLUDED.allergies_health_concerns,
      hospital_clinic_preference = EXCLUDED.hospital_clinic_preference,
      insurance_carrier_company = EXCLUDED.insurance_carrier_company,
      policy_number = EXCLUDED.policy_number,
      physician_name = EXCLUDED.physician_name,
      physician_phone = EXCLUDED.physician_phone,
      emergency_contact_name = EXCLUDED.emergency_contact_name,
      emergency_contact_phone = EXCLUDED.emergency_contact_phone,
      active_enrollment_count = EXCLUDED.active_enrollment_count,
      class_enrollment_count = EXCLUDED.class_enrollment_count,
      camp_enrollment_count = EXCLUDED.camp_enrollment_count,
      appointment_booking_count = EXCLUDED.appointment_booking_count,
      current_event_name = EXCLUDED.current_event_name,
      instructors = EXCLUDED.instructors,
      updated_at = NOW()`,
    [
      athleteId,
      profileValues.primary_email,
      profileValues.age_label,
      profileValues.student_keywords,
      profileValues.roll_sheet_comment,
      profileValues.allergies_health_concerns,
      profileValues.hospital_clinic_preference,
      profileValues.insurance_carrier_company,
      profileValues.policy_number,
      profileValues.physician_name,
      profileValues.physician_phone,
      profileValues.emergency_contact_name,
      profileValues.emergency_contact_phone,
      profileValues.active_enrollment_count,
      profileValues.class_enrollment_count,
      profileValues.camp_enrollment_count,
      profileValues.appointment_booking_count,
      profileValues.current_event_name,
      profileValues.instructors,
    ]
  );
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
  const teamId = req.query.team_id ? Number(req.query.team_id) : null;
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

  if (teamId) {
    params.push(teamId);
    filters.push(`invites.team_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT invites.id, invites.organization_id, invites.team_id, invites.survey_id, invites.used_at, invites.created_at,
            organizations.name AS organization_name, organizations.type AS organization_type,
            teams.name AS team_name, teams.level AS team_level,
            surveys.title AS survey_title
     FROM invites
     LEFT JOIN organizations ON organizations.id = invites.organization_id
     LEFT JOIN teams ON teams.id = invites.team_id
     JOIN surveys ON surveys.id = invites.survey_id
     ${whereClause}
     ORDER BY invites.created_at DESC`,
    params
  );

  return res.json({ invites: result.rows });
});

router.post("/invites", async (req, res) => {
  const teamId = Number(req.body?.team_id);
  const surveyId = Number(req.body?.survey_id);
  const count = Number(req.body?.count || 1);

  if (!Number.isInteger(teamId)) {
    return res.status(400).json({ error: "team_id is required." });
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

    const teamResult = await client.query(
      `SELECT teams.id, teams.name, teams.organization_id,
              organizations.name AS organization_name, organizations.type AS organization_type
       FROM teams
       LEFT JOIN organizations ON organizations.id = teams.organization_id
       WHERE teams.id = $1`,
      [teamId]
    );

    const surveyResult = await client.query(
      "SELECT id, title FROM surveys WHERE id = $1",
      [surveyId]
    );

    if (teamResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Team not found." });
    }

    if (surveyResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Survey not found." });
    }

    const team = teamResult.rows[0];
    if (!team.organization_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Team must be linked to an organization." });
    }

    const questionCountResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM survey_questions WHERE survey_id = $1",
      [surveyId]
    );
    if (questionCountResult.rows[0]?.count === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Survey has no questions." });
    }

    const invites = [];
    for (let i = 0; i < count; i += 1) {
      const token = crypto.randomBytes(32).toString("base64url");
      const tokenHash = hashToken(token);

      const inviteResult = await client.query(
        "INSERT INTO invites (survey_id, organization_id, team_id, token_hash) VALUES ($1, $2, $3, $4) RETURNING id, created_at",
        [surveyId, team.organization_id, team.id, tokenHash]
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
      organization: {
        id: team.organization_id,
        name: team.organization_name,
        type: team.organization_type,
      },
      team: { id: team.id, name: team.name },
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
      `SELECT invites.id, invites.organization_id, invites.team_id, invites.survey_id, invites.used_at,
              organizations.name AS organization_name, organizations.type AS organization_type,
              teams.name AS team_name,
              surveys.title AS survey_title
       FROM invites
       LEFT JOIN organizations ON organizations.id = invites.organization_id
       LEFT JOIN teams ON teams.id = invites.team_id
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

    const questionCountResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM survey_questions WHERE survey_id = $1",
      [invite.survey_id]
    );
    if (questionCountResult.rows[0]?.count === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Survey has no questions." });
    }

    await client.query("DELETE FROM invites WHERE id = $1", [inviteId]);

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);
    const newInviteResult = await client.query(
      "INSERT INTO invites (survey_id, organization_id, team_id, token_hash) VALUES ($1, $2, $3, $4) RETURNING id, created_at",
      [invite.survey_id, invite.organization_id, invite.team_id, tokenHash]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      organization: {
        id: invite.organization_id,
        name: invite.organization_name,
        type: invite.organization_type,
      },
      team: invite.team_id ? { id: invite.team_id, name: invite.team_name } : null,
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
  const teamId = req.query.team_id ? Number(req.query.team_id) : null;
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

  if (teamId) {
    params.push(teamId);
    filters.push(`responses.team_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT responses.id, responses.organization_id, responses.team_id, responses.survey_id,
            organizations.name AS organization_name, organizations.type AS organization_type,
            teams.name AS team_name, teams.level AS team_level,
            surveys.title AS survey_title,
            responses.answers, responses.comment, responses.created_at
     FROM responses
     LEFT JOIN organizations ON organizations.id = responses.organization_id
     LEFT JOIN teams ON teams.id = responses.team_id
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
            teams.expected_athlete_count, teams.location, teams.notes, teams.created_at,
            organizations.name AS organization_name,
            organizations.type AS organization_type,
            seasons.name AS season_name,
            COUNT(DISTINCT contact_team.contact_id)::int AS contact_count,
            COUNT(DISTINCT athlete_team.athlete_id) FILTER (
              WHERE athlete_team.status = 'active'
                AND athlete_team.season_id = teams.season_id
            )::int AS athlete_count
     FROM teams
     LEFT JOIN organizations ON organizations.id = teams.organization_id
     LEFT JOIN seasons ON seasons.id = teams.season_id
     LEFT JOIN contact_team ON contact_team.team_id = teams.id
     LEFT JOIN athlete_team ON athlete_team.team_id = teams.id
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
  const rawExpectedAthleteCount = Number(req.body?.expected_athlete_count);
  const expectedAthleteCount = Number.isFinite(rawExpectedAthleteCount)
    ? Math.max(0, Math.trunc(rawExpectedAthleteCount))
    : 0;
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
    `INSERT INTO teams (org_id, organization_id, season_id, name, sport, level, season, expected_athlete_count, location, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, org_id, organization_id, season_id, name, sport, level, season, expected_athlete_count, location, notes, created_at`,
    [
      DEFAULT_ORG_ID,
      hasOrganizationId ? organizationId : null,
      hasSeasonId ? seasonId : DEFAULT_SEASON_ID,
      name,
      sport || null,
      level || null,
      season || null,
      expectedAthleteCount,
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
  const hasExpectedAthleteCount = Object.prototype.hasOwnProperty.call(
    req.body || {},
    "expected_athlete_count"
  );
  const rawExpectedAthleteCount = Number(req.body?.expected_athlete_count);
  const expectedAthleteCount = Number.isFinite(rawExpectedAthleteCount)
    ? Math.max(0, Math.trunc(rawExpectedAthleteCount))
    : 0;
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

  if (hasExpectedAthleteCount) {
    updateFields.push(`expected_athlete_count = $${paramIndex++}`);
    params.push(expectedAthleteCount);
  }

  updateFields.push(`location = $${paramIndex++}`);
  params.push(location || null);

  updateFields.push(`notes = $${paramIndex++}`);
  params.push(notes || null);

  params.push(teamId);

  const result = await query(
    `UPDATE teams SET ${updateFields.join(", ")} WHERE id = $${paramIndex}
     RETURNING id, org_id, organization_id, season_id, name, sport, level, season, expected_athlete_count, location, notes, created_at`,
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

router.get("/families", async (req, res) => {
  const organizationId = normalizeInteger(req.query.organization_id);
  const params = [];
  const filters = [];

  if (organizationId) {
    params.push(organizationId);
    filters.push(`families.org_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT families.id, families.org_id, families.name, families.status, families.source_system,
            families.source_record_id, families.primary_guardian_name, families.primary_email,
            families.primary_phone, families.street_1, families.street_2, families.city,
            families.state, families.postal_code, families.country, families.balance_due,
            families.last_payment_date, families.last_payment_amount, families.notes,
            families.created_at, families.updated_at,
            COUNT(DISTINCT athletes.id)::int AS athlete_count,
            COUNT(DISTINCT parents.id)::int AS guardian_count
     FROM families
     LEFT JOIN athletes
       ON athletes.family_id = families.id
      AND athletes.deleted_at IS NULL
     LEFT JOIN parents
       ON parents.family_id = families.id
      AND COALESCE(parents.status, 'active') = 'active'
     ${whereClause}
     GROUP BY families.id
     ORDER BY families.name ASC, families.id ASC`,
    params
  );

  return res.json({ families: result.rows });
});

router.get("/families/:id", async (req, res) => {
  const familyId = Number(req.params.id);
  if (!Number.isInteger(familyId)) {
    return res.status(400).json({ error: "Family id is required." });
  }

  const familyResult = await query(
    `SELECT families.id, families.org_id, families.name, families.status, families.source_system,
            families.source_record_id, families.primary_guardian_name, families.primary_email,
            families.primary_phone, families.street_1, families.street_2, families.city,
            families.state, families.postal_code, families.country, families.balance_due,
            families.last_payment_date, families.last_payment_amount, families.notes,
            families.created_at, families.updated_at,
            COUNT(DISTINCT athletes.id)::int AS athlete_count,
            COUNT(DISTINCT parents.id)::int AS guardian_count
     FROM families
     LEFT JOIN athletes
       ON athletes.family_id = families.id
      AND athletes.deleted_at IS NULL
     LEFT JOIN parents
       ON parents.family_id = families.id
      AND COALESCE(parents.status, 'active') = 'active'
     WHERE families.id = $1
     GROUP BY families.id`,
    [familyId]
  );

  if (familyResult.rowCount === 0) {
    return res.status(404).json({ error: "Family not found." });
  }

  const guardiansResult = await query(
    `SELECT parents.id, parents.org_id, parents.family_id, parents.first_name, parents.last_name,
            parents.full_name, parents.email, parents.phone, parents.is_primary_guardian,
            parents.source_system, parents.source_record_id, parents.status, parents.notes,
            parents.created_at, parents.updated_at,
            COUNT(DISTINCT parent_athlete.athlete_id)::int AS athlete_count
     FROM parents
     LEFT JOIN parent_athlete
       ON parent_athlete.parent_id = parents.id
      AND COALESCE(parent_athlete.status, 'active') = 'active'
     WHERE parents.family_id = $1
     GROUP BY parents.id
     ORDER BY parents.is_primary_guardian DESC, parents.last_name ASC NULLS LAST, parents.first_name ASC NULLS LAST, parents.id ASC`,
    [familyId]
  );

  const athletesResult = await query(
    `SELECT athletes.id, athletes.org_id, athletes.family_id, athletes.first_name, athletes.last_name,
            athletes.dob, athletes.gender, athletes.external_source, athletes.external_source_id,
            athletes.source_created_at, athletes.created_at,
            athlete_profiles.primary_email, athlete_profiles.age_label,
            athlete_profiles.allergies_health_concerns, athlete_profiles.current_event_name,
            athlete_profiles.instructors,
            COALESCE(
              STRING_AGG(DISTINCT teams.name, ', ') FILTER (WHERE athlete_team.status = 'active'),
              ''
            ) AS active_team_names
     FROM athletes
     LEFT JOIN athlete_profiles ON athlete_profiles.athlete_id = athletes.id
     LEFT JOIN athlete_team ON athlete_team.athlete_id = athletes.id
     LEFT JOIN teams ON teams.id = athlete_team.team_id
     WHERE athletes.family_id = $1
       AND athletes.deleted_at IS NULL
     GROUP BY athletes.id, athlete_profiles.athlete_id
     ORDER BY athletes.last_name ASC, athletes.first_name ASC`,
    [familyId]
  );

  return res.json({
    family: familyResult.rows[0],
    guardians: guardiansResult.rows,
    athletes: athletesResult.rows,
  });
});

router.post("/families", async (req, res) => {
  const name = normalizeText(req.body?.name);
  const primaryGuardianName = normalizeNullableText(req.body?.primary_guardian_name);
  const primaryEmail = normalizeNullableText(req.body?.primary_email);
  const primaryPhone = normalizeNullableText(req.body?.primary_phone);
  const street1 = normalizeNullableText(req.body?.street_1);
  const street2 = normalizeNullableText(req.body?.street_2);
  const city = normalizeNullableText(req.body?.city);
  const state = normalizeNullableText(req.body?.state);
  const postalCode = normalizeNullableText(req.body?.postal_code);
  const country = normalizeNullableText(req.body?.country) || "USA";
  const sourceSystem = normalizeNullableText(req.body?.source_system);
  const sourceRecordId = normalizeNullableText(req.body?.source_record_id);
  const status = normalizeNullableText(req.body?.status) || "active";
  const notes = normalizeNullableText(req.body?.notes);
  const balanceDue = req.body?.balance_due === "" || req.body?.balance_due === undefined ? null : Number(req.body?.balance_due);
  const lastPaymentAmount =
    req.body?.last_payment_amount === "" || req.body?.last_payment_amount === undefined
      ? null
      : Number(req.body?.last_payment_amount);
  const lastPaymentDate =
    typeof req.body?.last_payment_date === "string" && req.body.last_payment_date.trim()
      ? req.body.last_payment_date.trim()
      : null;
  const orgId = normalizeInteger(req.body?.org_id) || DEFAULT_ORG_ID;

  if (!name) {
    return res.status(400).json({ error: "Family name is required." });
  }

  const result = await query(
    `INSERT INTO families (
      org_id, name, status, source_system, source_record_id, primary_guardian_name,
      primary_email, primary_phone, street_1, street_2, city, state, postal_code,
      country, balance_due, last_payment_date, last_payment_amount, notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18
    )
    RETURNING *`,
    [
      orgId,
      name,
      status,
      sourceSystem,
      sourceRecordId,
      primaryGuardianName,
      primaryEmail,
      primaryPhone,
      street1,
      street2,
      city,
      state,
      postalCode,
      country,
      Number.isFinite(balanceDue) ? balanceDue : null,
      lastPaymentDate,
      Number.isFinite(lastPaymentAmount) ? lastPaymentAmount : null,
      notes,
    ]
  );

  return res.status(201).json({ family: result.rows[0] });
});

router.put("/families/:id", async (req, res) => {
  const familyId = Number(req.params.id);
  if (!Number.isInteger(familyId)) {
    return res.status(400).json({ error: "Family id is required." });
  }

  const body = req.body || {};
  if (Object.prototype.hasOwnProperty.call(body, "name") && !normalizeText(body.name)) {
    return res.status(400).json({ error: "Family name is required." });
  }
  const fields = [
    "name",
    "status",
    "source_system",
    "source_record_id",
    "primary_guardian_name",
    "primary_email",
    "primary_phone",
    "street_1",
    "street_2",
    "city",
    "state",
    "postal_code",
    "country",
    "notes",
    "last_payment_date",
  ];
  const updates = [];
  const params = [];

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      params.push(field === "name" || field === "status" ? normalizeText(body[field]) : normalizeNullableText(body[field]));
      updates.push(`${field} = $${params.length}`);
    }
  });

  if (Object.prototype.hasOwnProperty.call(body, "org_id")) {
    const orgId = normalizeInteger(body.org_id);
    if (!orgId) {
      return res.status(400).json({ error: "org_id must be a valid organization id." });
    }
    params.push(orgId);
    updates.push(`org_id = $${params.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(body, "balance_due")) {
    const balanceDue = body.balance_due === "" ? null : Number(body.balance_due);
    if (balanceDue !== null && !Number.isFinite(balanceDue)) {
      return res.status(400).json({ error: "balance_due must be numeric." });
    }
    params.push(balanceDue);
    updates.push(`balance_due = $${params.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(body, "last_payment_amount")) {
    const amount = body.last_payment_amount === "" ? null : Number(body.last_payment_amount);
    if (amount !== null && !Number.isFinite(amount)) {
      return res.status(400).json({ error: "last_payment_amount must be numeric." });
    }
    params.push(amount);
    updates.push(`last_payment_amount = $${params.length}`);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  updates.push("updated_at = NOW()");
  params.push(familyId);
  const result = await query(
    `UPDATE families
     SET ${updates.join(", ")}
     WHERE id = $${params.length}
     RETURNING *`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Family not found." });
  }

  return res.json({ family: result.rows[0] });
});

router.get("/parents", async (req, res) => {
  const familyId = normalizeInteger(req.query.family_id);
  const params = [];
  const filters = [];

  if (familyId) {
    params.push(familyId);
    filters.push(`parents.family_id = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT parents.id, parents.org_id, parents.family_id, parents.first_name, parents.last_name,
            parents.full_name, parents.email, parents.phone, parents.is_primary_guardian,
            parents.source_system, parents.source_record_id, parents.status, parents.notes,
            parents.created_at, parents.updated_at,
            COUNT(DISTINCT parent_athlete.athlete_id)::int AS athlete_count
     FROM parents
     LEFT JOIN parent_athlete
       ON parent_athlete.parent_id = parents.id
      AND COALESCE(parent_athlete.status, 'active') = 'active'
     ${whereClause}
     GROUP BY parents.id
     ORDER BY parents.is_primary_guardian DESC, parents.last_name ASC NULLS LAST, parents.first_name ASC NULLS LAST, parents.id ASC`,
    params
  );

  return res.json({ parents: result.rows });
});

router.post("/parents", async (req, res) => {
  const familyId = normalizeInteger(req.body?.family_id);
  const firstName = normalizeNullableText(req.body?.first_name);
  const lastName = normalizeNullableText(req.body?.last_name);
  const fullName = normalizeNullableText(req.body?.full_name) || [firstName, lastName].filter(Boolean).join(" ") || null;
  const email = normalizeNullableText(req.body?.email);
  const phone = normalizeNullableText(req.body?.phone);
  const notes = normalizeNullableText(req.body?.notes);
  const sourceSystem = normalizeNullableText(req.body?.source_system);
  const sourceRecordId = normalizeNullableText(req.body?.source_record_id);
  const status = normalizeNullableText(req.body?.status) || "active";
  const isPrimaryGuardian = normalizeBoolean(req.body?.is_primary_guardian, false);
  const athleteLinks = Array.isArray(req.body?.athlete_links) ? req.body.athlete_links : [];
  const orgId = normalizeInteger(req.body?.org_id) || DEFAULT_ORG_ID;

  if (!familyId) {
    return res.status(400).json({ error: "family_id is required." });
  }

  if (!fullName && !email && !phone) {
    return res.status(400).json({ error: "A guardian name, email, or phone is required." });
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const familyResult = await client.query("SELECT id FROM families WHERE id = $1", [familyId]);
    if (familyResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Family not found." });
    }

    const parentResult = await client.query(
      `INSERT INTO parents (
        org_id, family_id, first_name, last_name, full_name, email, phone,
        is_primary_guardian, source_system, source_record_id, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        orgId,
        familyId,
        firstName,
        lastName,
        fullName,
        email,
        phone,
        isPrimaryGuardian,
        sourceSystem,
        sourceRecordId,
        status,
        notes,
      ]
    );

    for (const link of athleteLinks) {
      const athleteId = normalizeInteger(link?.athlete_id);
      if (!athleteId) continue;
      await client.query(
        `INSERT INTO parent_athlete (
          parent_id, athlete_id, relationship, is_legal_guardian, is_emergency_contact,
          receives_email, receives_sms, sort_order, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (parent_id, athlete_id)
        DO UPDATE SET
          relationship = EXCLUDED.relationship,
          is_legal_guardian = EXCLUDED.is_legal_guardian,
          is_emergency_contact = EXCLUDED.is_emergency_contact,
          receives_email = EXCLUDED.receives_email,
          receives_sms = EXCLUDED.receives_sms,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status`,
        [
          parentResult.rows[0].id,
          athleteId,
          normalizeNullableText(link?.relationship),
          normalizeBoolean(link?.is_legal_guardian, false),
          normalizeBoolean(link?.is_emergency_contact, false),
          normalizeBoolean(link?.receives_email, true),
          normalizeBoolean(link?.receives_sms, false),
          normalizeInteger(link?.sort_order) ?? 0,
          normalizeNullableText(link?.status) || "active",
        ]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ parent: parentResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to create guardian." });
  } finally {
    client.release();
  }
});

router.put("/parents/:id", async (req, res) => {
  const parentId = Number(req.params.id);
  if (!Number.isInteger(parentId)) {
    return res.status(400).json({ error: "Guardian id is required." });
  }

  const familyId = Object.prototype.hasOwnProperty.call(req.body || {}, "family_id")
    ? normalizeInteger(req.body?.family_id)
    : undefined;
  const athleteLinks = Array.isArray(req.body?.athlete_links) ? req.body.athlete_links : null;
  const body = req.body || {};
  const textFields = [
    "first_name",
    "last_name",
    "full_name",
    "email",
    "phone",
    "source_system",
    "source_record_id",
    "status",
    "notes",
  ];
  const updates = [];
  const params = [];

  textFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      params.push(normalizeNullableText(body[field]));
      updates.push(`${field} = $${params.length}`);
    }
  });

  if (Object.prototype.hasOwnProperty.call(body, "is_primary_guardian")) {
    params.push(normalizeBoolean(body.is_primary_guardian, false));
    updates.push(`is_primary_guardian = $${params.length}`);
  }

  if (familyId !== undefined) {
    if (!familyId) {
      return res.status(400).json({ error: "family_id must be a valid family id." });
    }
    params.push(familyId);
    updates.push(`family_id = $${params.length}`);
  }

  if (Object.prototype.hasOwnProperty.call(body, "org_id")) {
    const orgId = normalizeInteger(body.org_id);
    if (!orgId) {
      return res.status(400).json({ error: "org_id must be a valid organization id." });
    }
    params.push(orgId);
    updates.push(`org_id = $${params.length}`);
  }

  if (updates.length === 0 && athleteLinks === null) {
    return res.status(400).json({ error: "No updates provided." });
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    if (updates.length > 0) {
      updates.push("updated_at = NOW()");
      params.push(parentId);
      const parentResult = await client.query(
        `UPDATE parents
         SET ${updates.join(", ")}
         WHERE id = $${params.length}
         RETURNING id`,
        params
      );
      if (parentResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Guardian not found." });
      }
    }

    if (athleteLinks) {
      await client.query("DELETE FROM parent_athlete WHERE parent_id = $1", [parentId]);
      for (const link of athleteLinks) {
        const athleteId = normalizeInteger(link?.athlete_id);
        if (!athleteId) continue;
        await client.query(
          `INSERT INTO parent_athlete (
            parent_id, athlete_id, relationship, is_legal_guardian, is_emergency_contact,
            receives_email, receives_sms, sort_order, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            parentId,
            athleteId,
            normalizeNullableText(link?.relationship),
            normalizeBoolean(link?.is_legal_guardian, false),
            normalizeBoolean(link?.is_emergency_contact, false),
            normalizeBoolean(link?.receives_email, true),
            normalizeBoolean(link?.receives_sms, false),
            normalizeInteger(link?.sort_order) ?? 0,
            normalizeNullableText(link?.status) || "active",
          ]
        );
      }
    }

    await client.query("COMMIT");
    return res.json({ parentId, updated: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to update guardian." });
  } finally {
    client.release();
  }
});

router.get("/employees", async (req, res) => {
  const organizationId = normalizeInteger(req.query.organization_id);
  const status = normalizeNullableText(req.query.status);
  const params = [];
  const filters = [];

  if (organizationId) {
    params.push(organizationId);
    filters.push(`employees.org_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    filters.push(`employees.status = $${params.length}`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await query(
    `SELECT employees.id, employees.org_id, employees.first_name, employees.last_name,
            employees.preferred_name, employees.title, employees.department,
            employees.employment_type, employees.email, employees.phone,
            employees.status, employees.start_date, employees.end_date,
            employees.notes, employees.created_at, employees.updated_at,
            organizations.name AS organization_name
     FROM employees
     LEFT JOIN organizations ON organizations.org_id = employees.org_id
     ${whereClause}
     ORDER BY employees.last_name ASC, employees.first_name ASC, employees.id ASC`,
    params
  );

  return res.json({ employees: result.rows });
});

router.get("/employees/:id", async (req, res) => {
  const employeeId = Number(req.params.id);
  if (!Number.isInteger(employeeId)) {
    return res.status(400).json({ error: "Employee id is required." });
  }

  const result = await query(
    `SELECT employees.id, employees.org_id, employees.first_name, employees.last_name,
            employees.preferred_name, employees.title, employees.department,
            employees.employment_type, employees.email, employees.phone,
            employees.status, employees.start_date, employees.end_date,
            employees.notes, employees.created_at, employees.updated_at,
            organizations.name AS organization_name
     FROM employees
     LEFT JOIN organizations ON organizations.org_id = employees.org_id
     WHERE employees.id = $1`,
    [employeeId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Employee not found." });
  }

  return res.json({ employee: result.rows[0] });
});

router.post("/employees", async (req, res) => {
  const firstName = normalizeText(req.body?.first_name);
  const lastName = normalizeText(req.body?.last_name);
  const preferredName = normalizeNullableText(req.body?.preferred_name);
  const title = normalizeNullableText(req.body?.title);
  const department = normalizeNullableText(req.body?.department);
  const employmentType = normalizeNullableText(req.body?.employment_type) || "contractor";
  const email = normalizeNullableText(req.body?.email);
  const phone = normalizeNullableText(req.body?.phone);
  const status = normalizeNullableText(req.body?.status) || "active";
  const startDate =
    typeof req.body?.start_date === "string" && req.body.start_date.trim() ? req.body.start_date.trim() : null;
  const endDate =
    typeof req.body?.end_date === "string" && req.body.end_date.trim() ? req.body.end_date.trim() : null;
  const notes = normalizeNullableText(req.body?.notes);
  const orgId = normalizeInteger(req.body?.org_id) || DEFAULT_ORG_ID;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "First and last name are required." });
  }

  const result = await query(
    `INSERT INTO employees (
      org_id, first_name, last_name, preferred_name, title, department,
      employment_type, email, phone, status, start_date, end_date, notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12, $13
    )
    RETURNING id, org_id, first_name, last_name, preferred_name, title, department,
              employment_type, email, phone, status, start_date, end_date,
              notes, created_at, updated_at`,
    [
      orgId,
      firstName,
      lastName,
      preferredName,
      title,
      department,
      employmentType,
      email,
      phone,
      status,
      startDate,
      endDate,
      notes,
    ]
  );

  return res.status(201).json({ employee: result.rows[0] });
});

router.put("/employees/:id", async (req, res) => {
  const employeeId = Number(req.params.id);
  if (!Number.isInteger(employeeId)) {
    return res.status(400).json({ error: "Employee id is required." });
  }

  const firstName = normalizeText(req.body?.first_name);
  const lastName = normalizeText(req.body?.last_name);
  const preferredName = normalizeNullableText(req.body?.preferred_name);
  const title = normalizeNullableText(req.body?.title);
  const department = normalizeNullableText(req.body?.department);
  const employmentType = normalizeNullableText(req.body?.employment_type) || "contractor";
  const email = normalizeNullableText(req.body?.email);
  const phone = normalizeNullableText(req.body?.phone);
  const status = normalizeNullableText(req.body?.status) || "active";
  const startDate =
    typeof req.body?.start_date === "string" && req.body.start_date.trim() ? req.body.start_date.trim() : null;
  const endDate =
    typeof req.body?.end_date === "string" && req.body.end_date.trim() ? req.body.end_date.trim() : null;
  const notes = normalizeNullableText(req.body?.notes);
  const orgId = normalizeInteger(req.body?.org_id) || DEFAULT_ORG_ID;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "First and last name are required." });
  }

  const result = await query(
    `UPDATE employees
     SET org_id = $1,
         first_name = $2,
         last_name = $3,
         preferred_name = $4,
         title = $5,
         department = $6,
         employment_type = $7,
         email = $8,
         phone = $9,
         status = $10,
         start_date = $11,
         end_date = $12,
         notes = $13,
         updated_at = NOW()
     WHERE id = $14
     RETURNING id, org_id, first_name, last_name, preferred_name, title, department,
               employment_type, email, phone, status, start_date, end_date,
               notes, created_at, updated_at`,
    [
      orgId,
      firstName,
      lastName,
      preferredName,
      title,
      department,
      employmentType,
      email,
      phone,
      status,
      startDate,
      endDate,
      notes,
      employeeId,
    ]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Employee not found." });
  }

  return res.json({ employee: result.rows[0] });
});

router.delete("/employees/:id", async (req, res) => {
  const employeeId = Number(req.params.id);
  if (!Number.isInteger(employeeId)) {
    return res.status(400).json({ error: "Employee id is required." });
  }

  const result = await query("DELETE FROM employees WHERE id = $1 RETURNING id", [employeeId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Employee not found." });
  }

  return res.json({ employeeId, deleted: true });
});

router.get("/athletes", async (req, res) => {
  const teamId = normalizeInteger(req.query.team_id);
  const seasonId = normalizeInteger(req.query.season_id);
  const familyId = normalizeInteger(req.query.family_id);
  const status = typeof req.query.status === "string" ? req.query.status.trim().toLowerCase() : "";
  const params = [];
  const filters = ["athletes.deleted_at IS NULL"];

  if (teamId) {
    params.push(teamId);
    filters.push(`athlete_team.team_id = $${params.length}`);
  }

  if (seasonId) {
    params.push(seasonId);
    filters.push(`athlete_team.season_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    filters.push(`athlete_team.status = $${params.length}`);
  }

  if (familyId) {
    params.push(familyId);
    filters.push(`athletes.family_id = $${params.length}`);
  }

  const joinClause =
    teamId || seasonId || status
      ? "JOIN athlete_team ON athlete_team.athlete_id = athletes.id"
      : "LEFT JOIN athlete_team ON athlete_team.athlete_id = athletes.id";
  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT athletes.id, athletes.org_id, athletes.family_id, athletes.first_name, athletes.last_name,
            athletes.dob, athletes.gender, athletes.external_source, athletes.external_source_id,
            athletes.source_created_at, athletes.created_at,
            athlete_team.team_id, athlete_team.season_id, athlete_team.status,
            athlete_team.positions, athlete_team.skill_notes, athlete_team.goal_notes,
            athlete_team.notes, athlete_team.start_date, athlete_team.end_date,
            teams.name AS team_name, seasons.name AS season_name,
            families.name AS family_name,
            athlete_profiles.primary_email, athlete_profiles.age_label,
            athlete_profiles.student_keywords, athlete_profiles.roll_sheet_comment,
            athlete_profiles.allergies_health_concerns, athlete_profiles.hospital_clinic_preference,
            athlete_profiles.insurance_carrier_company, athlete_profiles.policy_number,
            athlete_profiles.physician_name, athlete_profiles.physician_phone,
            athlete_profiles.emergency_contact_name, athlete_profiles.emergency_contact_phone,
            athlete_profiles.active_enrollment_count, athlete_profiles.class_enrollment_count,
            athlete_profiles.camp_enrollment_count, athlete_profiles.appointment_booking_count,
            athlete_profiles.current_event_name, athlete_profiles.instructors
     FROM athletes
     ${joinClause}
     LEFT JOIN teams ON teams.id = athlete_team.team_id
     LEFT JOIN seasons ON seasons.id = athlete_team.season_id
     LEFT JOIN families ON families.id = athletes.family_id
     LEFT JOIN athlete_profiles ON athlete_profiles.athlete_id = athletes.id
     ${whereClause}
     ORDER BY athletes.last_name ASC, athletes.first_name ASC`,
    params
  );

  return res.json({ athletes: result.rows });
});

router.post("/athletes", async (req, res) => {
  const firstName = normalizeText(req.body?.first_name);
  const lastName = normalizeText(req.body?.last_name);
  const dob = typeof req.body?.dob === "string" && req.body.dob.trim() ? req.body.dob.trim() : null;
  const gender = normalizeText(req.body?.gender);
  const familyId = normalizeInteger(req.body?.family_id);
  const teamId = normalizeInteger(req.body?.team_id);
  const seasonId = normalizeInteger(req.body?.season_id);
  const status = typeof req.body?.status === "string" ? req.body.status.trim().toLowerCase() : "active";
  const positions = normalizeText(req.body?.positions);
  const skillNotes = normalizeText(req.body?.skill_notes);
  const goalNotes = normalizeText(req.body?.goal_notes);
  const membershipNotes = normalizeText(req.body?.notes);
  const startDate =
    typeof req.body?.start_date === "string" && req.body.start_date.trim()
      ? req.body.start_date.trim()
      : null;
  const endDate =
    typeof req.body?.end_date === "string" && req.body.end_date.trim() ? req.body.end_date.trim() : null;
  const externalSource = normalizeNullableText(req.body?.external_source);
  const externalSourceId = normalizeNullableText(req.body?.external_source_id);
  const sourceCreatedAt =
    typeof req.body?.source_created_at === "string" && req.body.source_created_at.trim()
      ? req.body.source_created_at.trim()
      : null;
  const profileValues = {
    primary_email: normalizeNullableText(req.body?.primary_email),
    age_label: normalizeNullableText(req.body?.age_label),
    student_keywords: normalizeNullableText(req.body?.student_keywords),
    roll_sheet_comment: normalizeNullableText(req.body?.roll_sheet_comment),
    allergies_health_concerns: normalizeNullableText(req.body?.allergies_health_concerns),
    hospital_clinic_preference: normalizeNullableText(req.body?.hospital_clinic_preference),
    insurance_carrier_company: normalizeNullableText(req.body?.insurance_carrier_company),
    policy_number: normalizeNullableText(req.body?.policy_number),
    physician_name: normalizeNullableText(req.body?.physician_name),
    physician_phone: normalizeNullableText(req.body?.physician_phone),
    emergency_contact_name: normalizeNullableText(req.body?.emergency_contact_name),
    emergency_contact_phone: normalizeNullableText(req.body?.emergency_contact_phone),
    active_enrollment_count: normalizeInteger(req.body?.active_enrollment_count),
    class_enrollment_count: normalizeInteger(req.body?.class_enrollment_count),
    camp_enrollment_count: normalizeInteger(req.body?.camp_enrollment_count),
    appointment_booking_count: normalizeInteger(req.body?.appointment_booking_count),
    current_event_name: normalizeNullableText(req.body?.current_event_name),
    instructors: normalizeNullableText(req.body?.instructors),
  };

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "First and last name are required." });
  }

  if ((teamId && !seasonId) || (!teamId && seasonId)) {
    return res.status(400).json({ error: "team_id and season_id must be provided together." });
  }

  if (!ATHLETE_MEMBERSHIP_STATUSES.has(status)) {
    return res.status(400).json({ error: "Invalid athlete status." });
  }

  if (familyId) {
    const familyResult = await query("SELECT id FROM families WHERE id = $1", [familyId]);
    if (familyResult.rowCount === 0) {
      return res.status(404).json({ error: "Family not found." });
    }
  }

  if (teamId) {
    const teamResult = await query("SELECT id FROM teams WHERE id = $1", [teamId]);
    if (teamResult.rowCount === 0) {
      return res.status(404).json({ error: "Team not found." });
    }
    const seasonResult = await query("SELECT id FROM seasons WHERE id = $1", [seasonId]);
    if (seasonResult.rowCount === 0) {
      return res.status(404).json({ error: "Season not found." });
    }
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    if (familyId) {
      const familyResult = await client.query("SELECT id FROM families WHERE id = $1", [familyId]);
      if (familyResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Family not found." });
      }
    }

    if (teamId && seasonId) {
      const teamResult = await client.query("SELECT id FROM teams WHERE id = $1", [teamId]);
      if (teamResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Team not found." });
      }

      const seasonResult = await client.query("SELECT id FROM seasons WHERE id = $1", [seasonId]);
      if (seasonResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Season not found." });
      }
    }

    const athleteResult = await client.query(
      `INSERT INTO athletes (
        org_id, family_id, first_name, last_name, dob, gender, external_source, external_source_id, source_created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, org_id, family_id, first_name, last_name, dob, gender, external_source, external_source_id, source_created_at, created_at`,
      [DEFAULT_ORG_ID, familyId, firstName, lastName, dob, gender || null, externalSource, externalSourceId, sourceCreatedAt]
    );

    await upsertAthleteProfile(client, athleteResult.rows[0].id, profileValues);

    if (teamId && seasonId) {
      await client.query(
        `INSERT INTO athlete_team (
          athlete_id, team_id, season_id, status, positions, skill_notes, goal_notes, notes, start_date, end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, CURRENT_DATE), $10)`,
        [
          athleteResult.rows[0].id,
          teamId,
          seasonId,
          status,
          positions || null,
          skillNotes || null,
          goalNotes || null,
          membershipNotes || null,
          startDate,
          endDate,
        ]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ athlete: athleteResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to create athlete." });
  } finally {
    client.release();
  }
});

router.put("/athletes/:id", async (req, res) => {
  const athleteId = Number(req.params.id);
  if (!Number.isInteger(athleteId)) {
    return res.status(400).json({ error: "Athlete id is required." });
  }

  const firstName = normalizeText(req.body?.first_name);
  const lastName = normalizeText(req.body?.last_name);
  const dob = typeof req.body?.dob === "string" && req.body.dob.trim() ? req.body.dob.trim() : null;
  const gender = normalizeText(req.body?.gender);
  const hasFamilyId = Object.prototype.hasOwnProperty.call(req.body || {}, "family_id");
  const familyId = hasFamilyId ? normalizeInteger(req.body?.family_id) : undefined;
  const teamId = normalizeInteger(req.body?.team_id);
  const seasonId = normalizeInteger(req.body?.season_id);
  const status = typeof req.body?.status === "string" ? req.body.status.trim().toLowerCase() : "active";
  const positions = normalizeText(req.body?.positions);
  const skillNotes = normalizeText(req.body?.skill_notes);
  const goalNotes = normalizeText(req.body?.goal_notes);
  const membershipNotes = normalizeText(req.body?.notes);
  const startDate =
    typeof req.body?.start_date === "string" && req.body.start_date.trim()
      ? req.body.start_date.trim()
      : null;
  const endDate =
    typeof req.body?.end_date === "string" && req.body.end_date.trim() ? req.body.end_date.trim() : null;
  const hasExternalSource = Object.prototype.hasOwnProperty.call(req.body || {}, "external_source");
  const externalSource = hasExternalSource ? normalizeNullableText(req.body?.external_source) : undefined;
  const hasExternalSourceId = Object.prototype.hasOwnProperty.call(req.body || {}, "external_source_id");
  const externalSourceId = hasExternalSourceId ? normalizeNullableText(req.body?.external_source_id) : undefined;
  const hasSourceCreatedAt = Object.prototype.hasOwnProperty.call(req.body || {}, "source_created_at");
  const sourceCreatedAt = hasSourceCreatedAt
    ? typeof req.body?.source_created_at === "string" && req.body.source_created_at.trim()
      ? req.body.source_created_at.trim()
      : null
    : undefined;
  const profileValues = {
    primary_email: Object.prototype.hasOwnProperty.call(req.body || {}, "primary_email")
      ? normalizeNullableText(req.body?.primary_email)
      : undefined,
    age_label: Object.prototype.hasOwnProperty.call(req.body || {}, "age_label")
      ? normalizeNullableText(req.body?.age_label)
      : undefined,
    student_keywords: Object.prototype.hasOwnProperty.call(req.body || {}, "student_keywords")
      ? normalizeNullableText(req.body?.student_keywords)
      : undefined,
    roll_sheet_comment: Object.prototype.hasOwnProperty.call(req.body || {}, "roll_sheet_comment")
      ? normalizeNullableText(req.body?.roll_sheet_comment)
      : undefined,
    allergies_health_concerns: Object.prototype.hasOwnProperty.call(req.body || {}, "allergies_health_concerns")
      ? normalizeNullableText(req.body?.allergies_health_concerns)
      : undefined,
    hospital_clinic_preference: Object.prototype.hasOwnProperty.call(req.body || {}, "hospital_clinic_preference")
      ? normalizeNullableText(req.body?.hospital_clinic_preference)
      : undefined,
    insurance_carrier_company: Object.prototype.hasOwnProperty.call(req.body || {}, "insurance_carrier_company")
      ? normalizeNullableText(req.body?.insurance_carrier_company)
      : undefined,
    policy_number: Object.prototype.hasOwnProperty.call(req.body || {}, "policy_number")
      ? normalizeNullableText(req.body?.policy_number)
      : undefined,
    physician_name: Object.prototype.hasOwnProperty.call(req.body || {}, "physician_name")
      ? normalizeNullableText(req.body?.physician_name)
      : undefined,
    physician_phone: Object.prototype.hasOwnProperty.call(req.body || {}, "physician_phone")
      ? normalizeNullableText(req.body?.physician_phone)
      : undefined,
    emergency_contact_name: Object.prototype.hasOwnProperty.call(req.body || {}, "emergency_contact_name")
      ? normalizeNullableText(req.body?.emergency_contact_name)
      : undefined,
    emergency_contact_phone: Object.prototype.hasOwnProperty.call(req.body || {}, "emergency_contact_phone")
      ? normalizeNullableText(req.body?.emergency_contact_phone)
      : undefined,
    active_enrollment_count: Object.prototype.hasOwnProperty.call(req.body || {}, "active_enrollment_count")
      ? normalizeInteger(req.body?.active_enrollment_count)
      : undefined,
    class_enrollment_count: Object.prototype.hasOwnProperty.call(req.body || {}, "class_enrollment_count")
      ? normalizeInteger(req.body?.class_enrollment_count)
      : undefined,
    camp_enrollment_count: Object.prototype.hasOwnProperty.call(req.body || {}, "camp_enrollment_count")
      ? normalizeInteger(req.body?.camp_enrollment_count)
      : undefined,
    appointment_booking_count: Object.prototype.hasOwnProperty.call(req.body || {}, "appointment_booking_count")
      ? normalizeInteger(req.body?.appointment_booking_count)
      : undefined,
    current_event_name: Object.prototype.hasOwnProperty.call(req.body || {}, "current_event_name")
      ? normalizeNullableText(req.body?.current_event_name)
      : undefined,
    instructors: Object.prototype.hasOwnProperty.call(req.body || {}, "instructors")
      ? normalizeNullableText(req.body?.instructors)
      : undefined,
  };

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "First and last name are required." });
  }

  if ((teamId && !seasonId) || (!teamId && seasonId)) {
    return res.status(400).json({ error: "team_id and season_id must be provided together." });
  }

  if (!ATHLETE_MEMBERSHIP_STATUSES.has(status)) {
    return res.status(400).json({ error: "Invalid athlete status." });
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    if (hasFamilyId && familyId !== null) {
      const familyResult = await client.query("SELECT id FROM families WHERE id = $1", [familyId]);
      if (familyResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Family not found." });
      }
    }

    const athleteResult = await client.query(
      `UPDATE athletes
       SET first_name = $1, last_name = $2, dob = $3, gender = $4,
           family_id = CASE WHEN $5 THEN $6 ELSE family_id END,
           external_source = CASE WHEN $7 THEN $8 ELSE external_source END,
           external_source_id = CASE WHEN $9 THEN $10 ELSE external_source_id END,
           source_created_at = CASE WHEN $11 THEN $12 ELSE source_created_at END
       WHERE id = $13 AND deleted_at IS NULL
       RETURNING id`,
      [
        firstName,
        lastName,
        dob,
        gender || null,
        hasFamilyId,
        familyId,
        hasExternalSource,
        externalSource,
        hasExternalSourceId,
        externalSourceId,
        hasSourceCreatedAt,
        sourceCreatedAt,
        athleteId,
      ]
    );

    if (athleteResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Athlete not found." });
    }

    const hasProfileValues = Object.values(profileValues).some((value) => value !== undefined);
    if (hasProfileValues) {
      const existingProfileResult = await client.query(
        `SELECT ${ATHLETE_PROFILE_FIELDS.join(", ")} FROM athlete_profiles WHERE athlete_id = $1`,
        [athleteId]
      );
      const mergedProfileValues = existingProfileResult.rowCount
        ? ATHLETE_PROFILE_FIELDS.reduce((acc, field) => {
            acc[field] =
              profileValues[field] === undefined ? existingProfileResult.rows[0][field] : profileValues[field];
            return acc;
          }, {})
        : ATHLETE_PROFILE_FIELDS.reduce((acc, field) => {
            acc[field] = profileValues[field] === undefined ? null : profileValues[field];
            return acc;
          }, {});
      await upsertAthleteProfile(client, athleteId, mergedProfileValues);
    }

    if (teamId && seasonId) {
      await client.query(
        `INSERT INTO athlete_team (
          athlete_id, team_id, season_id, status, positions, skill_notes, goal_notes, notes, start_date, end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, CURRENT_DATE), $10)
        ON CONFLICT (athlete_id, team_id, season_id)
        DO UPDATE SET
          status = EXCLUDED.status,
          positions = EXCLUDED.positions,
          skill_notes = EXCLUDED.skill_notes,
          goal_notes = EXCLUDED.goal_notes,
          notes = EXCLUDED.notes,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date`,
        [
          athleteId,
          teamId,
          seasonId,
          status,
          positions || null,
          skillNotes || null,
          goalNotes || null,
          membershipNotes || null,
          startDate,
          endDate,
        ]
      );
    }

    await client.query("COMMIT");
    return res.json({ athleteId, updated: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to update athlete." });
  } finally {
    client.release();
  }
});

router.get("/contacts", async (req, res) => {
  const teamId = req.query.team_id ? Number(req.query.team_id) : null;
  const organizationId = req.query.organization_id ? Number(req.query.organization_id) : null;
  const unassigned = req.query.unassigned === "1" || req.query.unassigned === "true";
  const params = [];
  const filters = [];

  if (teamId) {
    params.push(teamId);
    filters.push(`EXISTS (
      SELECT 1 FROM contact_team contact_team_filter
      WHERE contact_team_filter.contact_id = contacts.id
        AND contact_team_filter.team_id = $${params.length}
    )`);
  }

  if (organizationId) {
    params.push(organizationId);
    filters.push(`COALESCE(contacts.organization_id, teams.organization_id) = $${params.length}`);
  }

  if (unassigned) {
    filters.push("NOT EXISTS (SELECT 1 FROM contact_team contact_team_unassigned WHERE contact_team_unassigned.contact_id = contacts.id)");
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT contacts.id, contacts.team_id, contacts.organization_id, contacts.name, contacts.role, contacts.audience,
            contacts.email, contacts.phone, contacts.notes, contacts.created_at,
            primary_team.name AS team_name,
            COALESCE(contacts.organization_id, primary_team.organization_id) AS resolved_organization_id,
            organizations.name AS organization_name, organizations.type AS organization_type,
            ARRAY_REMOVE(ARRAY_AGG(DISTINCT contact_team.team_id), NULL) AS team_ids,
            COALESCE(
              STRING_AGG(DISTINCT teams.name, ', ' ORDER BY teams.name),
              primary_team.name
            ) AS team_names
     FROM contacts
     LEFT JOIN contact_team ON contact_team.contact_id = contacts.id
     LEFT JOIN teams ON teams.id = contact_team.team_id
     LEFT JOIN teams primary_team ON primary_team.id = contacts.team_id
     LEFT JOIN organizations ON organizations.id = COALESCE(contacts.organization_id, primary_team.organization_id)
     ${whereClause}
     GROUP BY contacts.id, primary_team.name, primary_team.organization_id, organizations.name, organizations.type
     ORDER BY contacts.created_at DESC`,
    params
  );

  return res.json({ contacts: result.rows });
});

router.post("/contacts", async (req, res) => {
  const hasTeamId = Object.prototype.hasOwnProperty.call(req.body || {}, "team_id");
  const rawTeamId = req.body?.team_id;
  const teamId = rawTeamId === "" || rawTeamId === null ? null : Number(rawTeamId);
  const requestedTeamIds = Array.isArray(req.body?.team_ids)
    ? req.body.team_ids
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    : [];
  const normalizedTeamIds = Array.from(
    new Set([
      ...requestedTeamIds,
      ...(Number.isInteger(teamId) && teamId > 0 ? [teamId] : []),
    ])
  );
  const hasOrganizationId = Object.prototype.hasOwnProperty.call(req.body || {}, "organization_id");
  const rawOrganizationId = req.body?.organization_id;
  const organizationId =
    rawOrganizationId === "" || rawOrganizationId === null ? null : Number(rawOrganizationId);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const role = typeof req.body?.role === "string" ? req.body.role.trim() : "";
  const audience = typeof req.body?.audience === "string" ? req.body.audience.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  if (!name) {
    return res.status(400).json({ error: "Contact name is required." });
  }

  let resolvedOrganizationId = null;

  if (hasTeamId && teamId !== null && (!Number.isInteger(teamId) || teamId < 1)) {
    return res.status(400).json({ error: "team_id must be a valid team." });
  }

  if (normalizedTeamIds.length > 0) {
    const teamResult = await query(
      "SELECT id, organization_id FROM teams WHERE id = ANY($1::bigint[])",
      [normalizedTeamIds]
    );
    if (teamResult.rowCount !== normalizedTeamIds.length) {
      return res.status(404).json({ error: "One or more teams were not found." });
    }
    resolvedOrganizationId = teamResult.rows[0]?.organization_id || null;
  }

  if (hasOrganizationId && organizationId !== null) {
    if (!Number.isInteger(organizationId) || organizationId < 1) {
      return res.status(400).json({ error: "organization_id must be a valid organization." });
    }
    const orgResult = await query("SELECT id FROM organizations WHERE id = $1", [organizationId]);
    if (orgResult.rowCount === 0) {
      return res.status(404).json({ error: "Organization not found." });
    }
  }

  const finalOrganizationId = hasOrganizationId ? organizationId : resolvedOrganizationId;

  const client = await getClient();
  try {
    await client.query("BEGIN");
    const primaryTeamId = normalizedTeamIds[0] || (hasTeamId ? teamId : null);
    const result = await client.query(
      `INSERT INTO contacts (team_id, organization_id, name, role, audience, email, phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, team_id, organization_id, name, role, audience, email, phone, notes, created_at`,
      [
        primaryTeamId,
        finalOrganizationId || null,
        name,
        role || null,
        audience || null,
        email || null,
        phone || null,
        notes || null,
      ]
    );

    for (const assignedTeamId of normalizedTeamIds) {
      await client.query(
        "INSERT INTO contact_team (contact_id, team_id) VALUES ($1, $2) ON CONFLICT (contact_id, team_id) DO NOTHING",
        [result.rows[0].id, assignedTeamId]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ contact: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to create contact." });
  } finally {
    client.release();
  }
});

router.put("/contacts/:id", async (req, res) => {
  const contactId = Number(req.params.id);
  if (!Number.isInteger(contactId)) {
    return res.status(400).json({ error: "Contact id is required." });
  }

  const body = req.body || {};
  const hasTeamId = Object.prototype.hasOwnProperty.call(body, "team_id");
  const rawTeamId = body.team_id;
  const teamId = rawTeamId === "" || rawTeamId === null ? null : Number(rawTeamId);
  const requestedTeamIds = Array.isArray(body.team_ids)
    ? body.team_ids
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    : [];
  const normalizedTeamIds = Array.from(
    new Set([
      ...requestedTeamIds,
      ...(Number.isInteger(teamId) && teamId > 0 ? [teamId] : []),
    ])
  );
  const hasOrganizationId = Object.prototype.hasOwnProperty.call(body, "organization_id");
  const rawOrganizationId = body.organization_id;
  const organizationId =
    rawOrganizationId === "" || rawOrganizationId === null ? null : Number(rawOrganizationId);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const role = typeof req.body?.role === "string" ? req.body.role.trim() : "";
  const audience = typeof req.body?.audience === "string" ? req.body.audience.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";

  let resolvedOrganizationId = null;

  if (hasTeamId && teamId !== null && (!Number.isInteger(teamId) || teamId < 1)) {
    return res.status(400).json({ error: "team_id must be a valid team." });
  }

  if (hasTeamId || Array.isArray(body.team_ids)) {
    if (normalizedTeamIds.length > 0) {
      const teamResult = await query(
        "SELECT id, organization_id FROM teams WHERE id = ANY($1::bigint[])",
        [normalizedTeamIds]
      );
      if (teamResult.rowCount !== normalizedTeamIds.length) {
        return res.status(404).json({ error: "One or more teams were not found." });
      }
      resolvedOrganizationId = teamResult.rows[0]?.organization_id || null;
    } else {
      resolvedOrganizationId = null;
    }
  }

  if (hasOrganizationId && organizationId !== null) {
    if (!Number.isInteger(organizationId) || organizationId < 1) {
      return res.status(400).json({ error: "organization_id must be a valid organization." });
    }
    const orgResult = await query("SELECT id FROM organizations WHERE id = $1", [organizationId]);
    if (orgResult.rowCount === 0) {
      return res.status(404).json({ error: "Organization not found." });
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
    params.push(normalizedTeamIds[0] || teamId);
  }

  if (hasOrganizationId) {
    updateFields.push(`organization_id = $${paramIndex++}`);
    params.push(organizationId);
  } else if (hasTeamId) {
    updateFields.push(`organization_id = $${paramIndex++}`);
    params.push(resolvedOrganizationId);
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

  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE contacts SET ${updateFields.join(", ")} WHERE id = $${paramIndex}
       RETURNING id, team_id, organization_id, name, role, audience, email, phone, notes, created_at`,
      params
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Contact not found." });
    }

    if (hasTeamId || Array.isArray(body.team_ids)) {
      await client.query("DELETE FROM contact_team WHERE contact_id = $1", [contactId]);
      for (const assignedTeamId of normalizedTeamIds) {
        await client.query(
          "INSERT INTO contact_team (contact_id, team_id) VALUES ($1, $2) ON CONFLICT (contact_id, team_id) DO NOTHING",
          [contactId, assignedTeamId]
        );
      }
    }

    await client.query("COMMIT");
    return res.json({ contact: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Unable to update contact." });
  } finally {
    client.release();
  }
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
      `SELECT contacts.id
       FROM contacts
       LEFT JOIN contact_team ON contact_team.contact_id = contacts.id
       WHERE contacts.id = $1
         AND (contacts.team_id = $2 OR contact_team.team_id = $2)
       LIMIT 1`,
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
      `SELECT contacts.id
       FROM contacts
       LEFT JOIN contact_team ON contact_team.contact_id = contacts.id
       WHERE contacts.id = $1
         AND (contacts.team_id = $2 OR contact_team.team_id = $2)
       LIMIT 1`,
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
