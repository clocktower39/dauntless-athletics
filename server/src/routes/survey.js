import express from "express";
import crypto from "crypto";
import { getClient, query } from "../db.js";

const router = express.Router();

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const toRatingValue = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    return null;
  }
  return parsed;
};

const toAnswersMap = (payload) => {
  const input = payload?.answers;
  if (!input) return {};

  if (Array.isArray(input)) {
    return input.reduce((acc, item) => {
      const questionId = Number(item?.question_id);
      if (Number.isInteger(questionId)) {
        acc[questionId] = item?.value;
      }
      return acc;
    }, {});
  }

  if (typeof input === "object") {
    return Object.entries(input).reduce((acc, [key, value]) => {
      const questionId = Number(key);
      if (Number.isInteger(questionId)) {
        acc[questionId] = value;
      }
      return acc;
    }, {});
  }

  return {};
};

router.get("/:token", async (req, res) => {
  const tokenHash = hashToken(req.params.token);

  const result = await query(
    `SELECT invites.used_at, invites.survey_id, schools.name AS school_name,
            surveys.title, surveys.description, surveys.comment_prompt
     FROM invites
     JOIN schools ON schools.id = invites.school_id
     JOIN surveys ON surveys.id = invites.survey_id
     WHERE invites.token_hash = $1`,
    [tokenHash]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Invalid or expired link." });
  }

  const invite = result.rows[0];
  const questionsResult = await query(
    "SELECT id, prompt, sort_order FROM survey_questions WHERE survey_id = $1 ORDER BY sort_order ASC",
    [invite.survey_id]
  );

  return res.json({
    schoolName: invite.school_name,
    used: Boolean(invite.used_at),
    survey: {
      id: invite.survey_id,
      title: invite.title,
      description: invite.description,
      commentPrompt: invite.comment_prompt,
      questions: questionsResult.rows.map((row) => ({
        id: row.id,
        text: row.prompt,
        order: row.sort_order,
      })),
    },
  });
});

router.post("/:token", async (req, res) => {
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

    const questionsResult = await client.query(
      "SELECT id FROM survey_questions WHERE survey_id = $1 ORDER BY sort_order ASC",
      [invite.survey_id]
    );
    const questions = questionsResult.rows;
    if (questions.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Survey has no questions." });
    }

    const answersMap = toAnswersMap(req.body);
    const answers = {};
    const errors = [];
    questions.forEach((question) => {
      const value = toRatingValue(answersMap[question.id]);
      if (value === null) {
        errors.push(`Question ${question.id} must be an integer from 1 to 5.`);
      } else {
        answers[String(question.id)] = value;
      }
    });

    if (errors.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid ratings.", details: errors });
    }

    await client.query(
      "INSERT INTO responses (survey_id, school_id, invite_id, answers, comment) VALUES ($1, $2, $3, $4, $5)",
      [
        invite.survey_id,
        invite.school_id,
        invite.id,
        answers,
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
