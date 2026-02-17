CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS surveys (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  comment_prompt TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_questions (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS survey_questions_survey_id_idx
  ON survey_questions (survey_id, sort_order);

CREATE TABLE IF NOT EXISTS schools (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invites (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invites_survey_id_idx ON invites (survey_id);

CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  invite_id BIGINT NOT NULL UNIQUE REFERENCES invites(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS responses_school_id_idx ON responses (school_id);
CREATE INDEX IF NOT EXISTS responses_survey_id_idx ON responses (survey_id);

CREATE TABLE IF NOT EXISTS teams (
  id BIGSERIAL PRIMARY KEY,
  school_id BIGINT REFERENCES schools(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sport TEXT,
  level TEXT,
  season TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  audience TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contacts_team_id_idx ON contacts (team_id);
