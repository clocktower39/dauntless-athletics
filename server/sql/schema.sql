CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS orgs (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seasons (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

INSERT INTO orgs (id, name)
VALUES (1, 'Dauntless Athletics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO seasons (id, org_id, name, is_active)
VALUES (1, 1, 'Current', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS organizations (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  parent_id BIGINT REFERENCES organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'school',
  status TEXT NOT NULL DEFAULT 'active',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surveys (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT REFERENCES orgs(id) DEFAULT 1,
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

CREATE TABLE IF NOT EXISTS invites (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id BIGINT REFERENCES teams(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invites_survey_id_idx ON invites (survey_id);
CREATE INDEX IF NOT EXISTS invites_organization_id_idx ON invites (organization_id);
CREATE INDEX IF NOT EXISTS invites_team_id_idx ON invites (team_id);

CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  invite_id BIGINT NOT NULL UNIQUE REFERENCES invites(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS responses_organization_id_idx ON responses (organization_id);
CREATE INDEX IF NOT EXISTS responses_survey_id_idx ON responses (survey_id);
CREATE INDEX IF NOT EXISTS responses_team_id_idx ON responses (team_id);

CREATE TABLE IF NOT EXISTS teams (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT REFERENCES orgs(id) DEFAULT 1,
  organization_id BIGINT REFERENCES organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sport TEXT,
  level TEXT,
  season TEXT,
  season_id BIGINT REFERENCES seasons(id) DEFAULT 1,
  expected_athlete_count INTEGER NOT NULL DEFAULT 0 CHECK (expected_athlete_count >= 0),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
  organization_id BIGINT REFERENCES organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT,
  audience TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contacts_team_id_idx ON contacts (team_id);
CREATE INDEX IF NOT EXISTS contacts_organization_id_idx ON contacts (organization_id);

CREATE TABLE IF NOT EXISTS contact_team (
  contact_id BIGINT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (contact_id, team_id)
);

CREATE INDEX IF NOT EXISTS contact_team_team_id_idx ON contact_team (team_id);

CREATE TABLE IF NOT EXISTS practices (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  contact_id BIGINT REFERENCES contacts(id) ON DELETE SET NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS practices_team_id_idx ON practices (team_id);

CREATE INDEX IF NOT EXISTS organizations_org_id_idx ON organizations (org_id);
CREATE INDEX IF NOT EXISTS organizations_parent_id_idx ON organizations (parent_id);
CREATE INDEX IF NOT EXISTS organizations_type_idx ON organizations (type);
CREATE INDEX IF NOT EXISTS teams_org_id_idx ON teams (org_id);
CREATE INDEX IF NOT EXISTS teams_organization_id_idx ON teams (organization_id);
CREATE INDEX IF NOT EXISTS teams_season_id_idx ON teams (season_id);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS families (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  source_system TEXT,
  source_record_id TEXT,
  primary_guardian_name TEXT,
  primary_email TEXT,
  primary_phone TEXT,
  street_1 TEXT,
  street_2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  balance_due NUMERIC(10, 2),
  last_payment_date DATE,
  last_payment_amount NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS athletes (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  family_id BIGINT REFERENCES families(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  external_source TEXT,
  external_source_id TEXT,
  source_created_at DATE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parents (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  family_id BIGINT REFERENCES families(id) ON DELETE SET NULL,
  user_id BIGINT REFERENCES users(id),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  is_primary_guardian BOOLEAN NOT NULL DEFAULT FALSE,
  source_system TEXT,
  source_record_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS athlete_profiles (
  athlete_id BIGINT PRIMARY KEY REFERENCES athletes(id) ON DELETE CASCADE,
  primary_email TEXT,
  age_label TEXT,
  student_keywords TEXT,
  roll_sheet_comment TEXT,
  allergies_health_concerns TEXT,
  hospital_clinic_preference TEXT,
  insurance_carrier_company TEXT,
  policy_number TEXT,
  physician_name TEXT,
  physician_phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  active_enrollment_count INTEGER,
  class_enrollment_count INTEGER,
  camp_enrollment_count INTEGER,
  appointment_booking_count INTEGER,
  current_event_name TEXT,
  instructors TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS athlete_team (
  athlete_id BIGINT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  season_id BIGINT NOT NULL REFERENCES seasons(id),
  status TEXT NOT NULL DEFAULT 'active',
  positions TEXT,
  skill_notes TEXT,
  goal_notes TEXT,
  notes TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (athlete_id, team_id, season_id)
);

CREATE TABLE IF NOT EXISTS parent_athlete (
  parent_id BIGINT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  athlete_id BIGINT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  relationship TEXT,
  is_legal_guardian BOOLEAN NOT NULL DEFAULT FALSE,
  is_emergency_contact BOOLEAN NOT NULL DEFAULT FALSE,
  receives_email BOOLEAN NOT NULL DEFAULT TRUE,
  receives_sms BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (parent_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS families_org_id_idx ON families (org_id);
CREATE INDEX IF NOT EXISTS families_status_idx ON families (status);
CREATE UNIQUE INDEX IF NOT EXISTS families_source_record_idx
  ON families (source_system, source_record_id)
  WHERE source_system IS NOT NULL AND source_record_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS athletes_org_id_idx ON athletes (org_id);
CREATE INDEX IF NOT EXISTS athletes_family_id_idx ON athletes (family_id);
CREATE UNIQUE INDEX IF NOT EXISTS athletes_source_record_idx
  ON athletes (external_source, external_source_id)
  WHERE external_source IS NOT NULL AND external_source_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS parents_family_id_idx ON parents (family_id);
CREATE INDEX IF NOT EXISTS athlete_team_team_id_idx ON athlete_team (team_id);
CREATE INDEX IF NOT EXISTS athlete_team_athlete_id_idx ON athlete_team (athlete_id);
CREATE INDEX IF NOT EXISTS athlete_team_team_season_status_idx ON athlete_team (team_id, season_id, status);
CREATE INDEX IF NOT EXISTS parent_athlete_athlete_id_idx ON parent_athlete (athlete_id);

CREATE TABLE IF NOT EXISTS survey_campaigns (
  id BIGSERIAL PRIMARY KEY,
  org_id BIGINT NOT NULL REFERENCES orgs(id),
  survey_id BIGINT NOT NULL REFERENCES surveys(id),
  name TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'coach',
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_targets (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES survey_campaigns(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id BIGINT NOT NULL,
  include_children BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS campaign_recipients (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES survey_campaigns(id) ON DELETE CASCADE,
  person_type TEXT NOT NULL DEFAULT 'coach',
  person_id BIGINT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS campaign_targets_campaign_id_idx ON campaign_targets (campaign_id);
CREATE INDEX IF NOT EXISTS campaign_recipients_campaign_id_idx ON campaign_recipients (campaign_id);

CREATE TABLE IF NOT EXISTS survey_responses (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES survey_campaigns(id) ON DELETE CASCADE,
  survey_id BIGINT NOT NULL REFERENCES surveys(id),
  respondent_type TEXT NOT NULL DEFAULT 'coach',
  respondent_id BIGINT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS survey_response_answers (
  id BIGSERIAL PRIMARY KEY,
  response_id BIGINT NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES survey_questions(id),
  value_text TEXT,
  value_number NUMERIC,
  value_json JSONB
);

CREATE INDEX IF NOT EXISTS survey_campaigns_survey_id_idx ON survey_campaigns (survey_id);
CREATE INDEX IF NOT EXISTS survey_responses_campaign_id_idx ON survey_responses (campaign_id);
CREATE INDEX IF NOT EXISTS survey_response_answers_response_id_idx ON survey_response_answers (response_id);
