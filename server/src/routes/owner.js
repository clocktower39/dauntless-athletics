import express from "express";
import { query } from "../db.js";
import { requireRole } from "../auth.js";

const router = express.Router();

router.use(requireRole("owner"));

router.get("/summary", async (_req, res) => {
  const inviteStatsResult = await query(
    `SELECT COUNT(*)::int AS total_invites,
            SUM(CASE WHEN used_at IS NOT NULL THEN 1 ELSE 0 END)::int AS used_invites
     FROM invites`
  );

  const summaryResult = await query(
    `SELECT COUNT(*)::int AS total_responses,
            AVG(q1)::numeric(4,2) AS avg_q1,
            AVG(q2)::numeric(4,2) AS avg_q2,
            AVG(q3)::numeric(4,2) AS avg_q3,
            AVG(q4)::numeric(4,2) AS avg_q4,
            AVG(q5)::numeric(4,2) AS avg_q5
     FROM responses`
  );

  const distributionResult = await query(
    `SELECT
      SUM(CASE WHEN q1 = 5 THEN 1 ELSE 0 END)::int AS q1_5,
      SUM(CASE WHEN q1 = 4 THEN 1 ELSE 0 END)::int AS q1_4,
      SUM(CASE WHEN q1 = 3 THEN 1 ELSE 0 END)::int AS q1_3,
      SUM(CASE WHEN q1 = 2 THEN 1 ELSE 0 END)::int AS q1_2,
      SUM(CASE WHEN q1 = 1 THEN 1 ELSE 0 END)::int AS q1_1,
      SUM(CASE WHEN q2 = 5 THEN 1 ELSE 0 END)::int AS q2_5,
      SUM(CASE WHEN q2 = 4 THEN 1 ELSE 0 END)::int AS q2_4,
      SUM(CASE WHEN q2 = 3 THEN 1 ELSE 0 END)::int AS q2_3,
      SUM(CASE WHEN q2 = 2 THEN 1 ELSE 0 END)::int AS q2_2,
      SUM(CASE WHEN q2 = 1 THEN 1 ELSE 0 END)::int AS q2_1,
      SUM(CASE WHEN q3 = 5 THEN 1 ELSE 0 END)::int AS q3_5,
      SUM(CASE WHEN q3 = 4 THEN 1 ELSE 0 END)::int AS q3_4,
      SUM(CASE WHEN q3 = 3 THEN 1 ELSE 0 END)::int AS q3_3,
      SUM(CASE WHEN q3 = 2 THEN 1 ELSE 0 END)::int AS q3_2,
      SUM(CASE WHEN q3 = 1 THEN 1 ELSE 0 END)::int AS q3_1,
      SUM(CASE WHEN q4 = 5 THEN 1 ELSE 0 END)::int AS q4_5,
      SUM(CASE WHEN q4 = 4 THEN 1 ELSE 0 END)::int AS q4_4,
      SUM(CASE WHEN q4 = 3 THEN 1 ELSE 0 END)::int AS q4_3,
      SUM(CASE WHEN q4 = 2 THEN 1 ELSE 0 END)::int AS q4_2,
      SUM(CASE WHEN q4 = 1 THEN 1 ELSE 0 END)::int AS q4_1,
      SUM(CASE WHEN q5 = 5 THEN 1 ELSE 0 END)::int AS q5_5,
      SUM(CASE WHEN q5 = 4 THEN 1 ELSE 0 END)::int AS q5_4,
      SUM(CASE WHEN q5 = 3 THEN 1 ELSE 0 END)::int AS q5_3,
      SUM(CASE WHEN q5 = 2 THEN 1 ELSE 0 END)::int AS q5_2,
      SUM(CASE WHEN q5 = 1 THEN 1 ELSE 0 END)::int AS q5_1
     FROM responses`
  );

  const commentsResult = await query(
    "SELECT comment, created_at FROM responses WHERE comment IS NOT NULL AND comment <> '' ORDER BY created_at DESC"
  );

  const summary = summaryResult.rows[0] || {};
  const inviteStats = inviteStatsResult.rows[0] || {};
  const distribution = distributionResult.rows[0] || {};
  const totalInvites = inviteStats.total_invites || 0;
  const usedInvites = inviteStats.used_invites || 0;
  const responseRate = totalInvites > 0 ? Number(((usedInvites / totalInvites) * 100).toFixed(1)) : 0;

  return res.json({
    totalResponses: summary.total_responses || 0,
    totalInvites,
    usedInvites,
    responseRate,
    averages: {
      q1: summary.avg_q1 ? Number(summary.avg_q1) : null,
      q2: summary.avg_q2 ? Number(summary.avg_q2) : null,
      q3: summary.avg_q3 ? Number(summary.avg_q3) : null,
      q4: summary.avg_q4 ? Number(summary.avg_q4) : null,
      q5: summary.avg_q5 ? Number(summary.avg_q5) : null,
    },
    distribution: {
      q1: {
        5: distribution.q1_5 || 0,
        4: distribution.q1_4 || 0,
        3: distribution.q1_3 || 0,
        2: distribution.q1_2 || 0,
        1: distribution.q1_1 || 0,
      },
      q2: {
        5: distribution.q2_5 || 0,
        4: distribution.q2_4 || 0,
        3: distribution.q2_3 || 0,
        2: distribution.q2_2 || 0,
        1: distribution.q2_1 || 0,
      },
      q3: {
        5: distribution.q3_5 || 0,
        4: distribution.q3_4 || 0,
        3: distribution.q3_3 || 0,
        2: distribution.q3_2 || 0,
        1: distribution.q3_1 || 0,
      },
      q4: {
        5: distribution.q4_5 || 0,
        4: distribution.q4_4 || 0,
        3: distribution.q4_3 || 0,
        2: distribution.q4_2 || 0,
        1: distribution.q4_1 || 0,
      },
      q5: {
        5: distribution.q5_5 || 0,
        4: distribution.q5_4 || 0,
        3: distribution.q5_3 || 0,
        2: distribution.q5_2 || 0,
        1: distribution.q5_1 || 0,
      },
    },
    comments: commentsResult.rows,
  });
});

export default router;
