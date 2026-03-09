import express from "express";
import { query } from "../db.js";
import { requireRole } from "../auth.js";

const router = express.Router();

router.use(requireRole("owner"));

router.get("/surveys", async (_req, res) => {
  const result = await query(
    "SELECT id, title, description, comment_prompt, is_active, created_at FROM surveys ORDER BY created_at DESC"
  );
  return res.json({ surveys: result.rows });
});

router.get("/summary", async (_req, res) => {
  const surveyIdParam = _req.query.survey_id ? Number(_req.query.survey_id) : null;
  let surveyId = Number.isInteger(surveyIdParam) ? surveyIdParam : null;

  if (!surveyId) {
    const latestSurvey = await query(
      "SELECT id FROM surveys WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1"
    );
    if (latestSurvey.rowCount === 0) {
      const anySurvey = await query("SELECT id FROM surveys ORDER BY created_at DESC LIMIT 1");
      if (anySurvey.rowCount === 0) {
        return res.json({
          survey: null,
          questions: [],
          totalResponses: 0,
          totalInvites: 0,
          usedInvites: 0,
          responseRate: 0,
          averages: {},
          distribution: {},
          comments: [],
        });
      }
      surveyId = anySurvey.rows[0].id;
    } else {
      surveyId = latestSurvey.rows[0].id;
    }
  }

  const surveyResult = await query(
    "SELECT id, title, description, comment_prompt, is_active, created_at FROM surveys WHERE id = $1",
    [surveyId]
  );

  if (surveyResult.rowCount === 0) {
    return res.status(404).json({ error: "Survey not found." });
  }

  const questionsResult = await query(
    "SELECT id, prompt, sort_order FROM survey_questions WHERE survey_id = $1 ORDER BY sort_order ASC",
    [surveyId]
  );

  const inviteStatsResult = await query(
    `SELECT COUNT(*)::int AS total_invites,
            SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END)::int AS used_invites
     FROM invites WHERE survey_id = $1`,
    [surveyId]
  );

  const responsesResult = await query(
    "SELECT answers, comment, created_at FROM responses WHERE survey_id = $1 ORDER BY created_at DESC",
    [surveyId]
  );

  const questions = questionsResult.rows;
  const totals = {};
  questions.forEach((question) => {
    totals[question.id] = {
      sum: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  });

  const comments = [];

  responsesResult.rows.forEach((row) => {
    const answers = row.answers || {};
    questions.forEach((question) => {
      const raw = answers?.[question.id] ?? answers?.[String(question.id)];
      const value = Number(raw);
      if (Number.isInteger(value) && value >= 1 && value <= 5) {
        totals[question.id].sum += value;
        totals[question.id].count += 1;
        totals[question.id].distribution[value] += 1;
      }
    });

    if (row.comment) {
      comments.push({ comment: row.comment, created_at: row.created_at });
    }
  });

  const averages = {};
  const distribution = {};
  questions.forEach((question) => {
    const stats = totals[question.id];
    averages[question.id] = stats.count > 0 ? Number((stats.sum / stats.count).toFixed(2)) : null;
    distribution[question.id] = stats.distribution;
  });

  const inviteStats = inviteStatsResult.rows[0] || {};
  const totalInvites = inviteStats.total_invites || 0;
  const usedInvites = inviteStats.used_invites || 0;
  const responseRate = totalInvites > 0 ? Number(((usedInvites / totalInvites) * 100).toFixed(1)) : 0;

  return res.json({
    survey: {
      id: surveyResult.rows[0].id,
      title: surveyResult.rows[0].title,
      description: surveyResult.rows[0].description,
      commentPrompt: surveyResult.rows[0].comment_prompt,
      isActive: surveyResult.rows[0].is_active,
      createdAt: surveyResult.rows[0].created_at,
    },
    questions: questions.map((question) => ({
      id: question.id,
      text: question.prompt,
      order: question.sort_order,
    })),
    totalResponses: responsesResult.rowCount || 0,
    totalInvites,
    usedInvites,
    responseRate,
    averages,
    distribution,
    comments,
  });
});

export default router;
