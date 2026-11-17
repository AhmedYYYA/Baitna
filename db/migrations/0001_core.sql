-- BAITNA | 0001_core.sql
-- Proposal / DESIGN ARTIFACT ONLY. Not production-approved; run against an empty dev DB.
-- PostgreSQL 18; transactionally applied by a restricted migration administrator.
-- RLS is enabled with NO permissive policies: normal application SQL remains DENIED
-- until an audited actor-based authorization policy migration is implemented.

BEGIN;

CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oidc_subject text NOT NULL UNIQUE,
  display_label text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE homes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_ref text NOT NULL UNIQUE DEFAULT ('BT-H-' || upper(replace(gen_random_uuid()::text, '-', ''))),
  label text NOT NULL,
  lifecycle_phase text NOT NULL DEFAULT 'planning'
    CHECK (lifecycle_phase IN ('planning','construction','handover','operation','renovation','archived')),
  created_by uuid NOT NULL REFERENCES accounts(id),
  record_version bigint NOT NULL DEFAULT 1 CHECK (record_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT home_ref_format CHECK (home_ref ~ '^BT-H-[A-F0-9]{32}$')
);
COMMENT ON COLUMN homes.home_ref IS 'Permanent opaque platform reference, not proof of legal land title. Never change/reuse.';

CREATE OR REPLACE FUNCTION prevent_home_identity_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.home_ref IS DISTINCT FROM OLD.home_ref THEN
    RAISE EXCEPTION 'BAITNA Home ID and home_ref are immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER homes_identity_immutable
  BEFORE UPDATE ON homes FOR EACH ROW EXECUTE FUNCTION prevent_home_identity_change();

CREATE TABLE home_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid NOT NULL REFERENCES homes(id),
  account_id uuid NOT NULL REFERENCES accounts(id),
  role text NOT NULL CHECK (role IN ('owner_manager','owner_delegate','home_viewer')),
  granted_by uuid REFERENCES accounts(id),
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  CHECK (revoked_at IS NULL OR revoked_at >= granted_at)
);
CREATE UNIQUE INDEX one_current_home_manager
  ON home_access(home_id) WHERE role = 'owner_manager' AND revoked_at IS NULL;
CREATE UNIQUE INDEX one_current_home_role_per_account
  ON home_access(home_id, account_id, role) WHERE revoked_at IS NULL;
CREATE INDEX home_access_account ON home_access(account_id, home_id) WHERE revoked_at IS NULL;

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid NOT NULL REFERENCES homes(id),
  project_ref text NOT NULL,
  name text NOT NULL,
  project_kind text NOT NULL CHECK (project_kind IN ('new_build','renovation','maintenance','extension')),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','active','suspended','handover','closed')),
  created_by uuid NOT NULL REFERENCES accounts(id),
  record_version bigint NOT NULL DEFAULT 1 CHECK (record_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (home_id, project_ref),
  UNIQUE (home_id, id)
);

CREATE TABLE project_parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  account_id uuid NOT NULL REFERENCES accounts(id),
  role text NOT NULL CHECK (role IN ('main_contractor','subcontractor','consultant','project_manager','project_viewer')),
  granted_by uuid REFERENCES accounts(id),
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE UNIQUE INDEX one_active_project_role
  ON project_parties(project_id, account_id, role) WHERE revoked_at IS NULL;

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  contract_ref text NOT NULL,
  counterparty_label text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','in_review','active','closed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, contract_ref),
  UNIQUE(project_id, id)
);
CREATE TABLE contract_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES contracts(id),
  revision_number integer NOT NULL CHECK (revision_number > 0),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','submitted','approved','rejected')),
  terms jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_document_id uuid,
  approved_by uuid REFERENCES accounts(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(contract_id, revision_number),
  CHECK ((state = 'approved') = (approved_at IS NOT NULL))
);

CREATE TABLE sows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  contract_id uuid NOT NULL,
  sow_ref text NOT NULL,
  title text NOT NULL,
  incorporation_status text NOT NULL DEFAULT 'not_incorporated'
    CHECK (incorporation_status IN ('not_incorporated','incorporated','superseded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (project_id, contract_id) REFERENCES contracts(project_id,id),
  UNIQUE(project_id, sow_ref),
  UNIQUE(project_id,id)
);
CREATE TABLE sow_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sow_id uuid NOT NULL REFERENCES sows(id),
  revision_number integer NOT NULL CHECK (revision_number > 0),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','submitted','approved','rejected')),
  specification jsonb NOT NULL DEFAULT '{}'::jsonb,
  acceptance_criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  approved_by uuid REFERENCES accounts(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sow_id, revision_number),
  CHECK ((state = 'approved') = (approved_at IS NOT NULL))
);

CREATE TABLE wbs_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  sow_id uuid,
  parent_id uuid,
  wbs_code text NOT NULL,
  title text NOT NULL,
  deliverable text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, id),
  UNIQUE(project_id, wbs_code),
  FOREIGN KEY (project_id,sow_id) REFERENCES sows(project_id,id),
  FOREIGN KEY (project_id,parent_id) REFERENCES wbs_nodes(project_id,id),
  CHECK (id IS DISTINCT FROM parent_id)
);
CREATE TABLE boq_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  wbs_node_id uuid NOT NULL,
  line_ref text NOT NULL,
  description text NOT NULL,
  quantity numeric(18,4) NOT NULL CHECK (quantity >= 0),
  unit text NOT NULL,
  unit_price numeric(18,2) NOT NULL CHECK (unit_price >= 0),
  currency char(3) NOT NULL DEFAULT 'AED' CHECK (currency = 'AED'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,line_ref),
  FOREIGN KEY (project_id,wbs_node_id) REFERENCES wbs_nodes(project_id,id)
);

CREATE TABLE ims_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES projects(id),
  name text NOT NULL DEFAULT 'Integrated Master Schedule',
  current_baseline_revision_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(id,project_id)
);
CREATE TABLE ims_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL,
  project_id uuid NOT NULL,
  revision_number integer NOT NULL CHECK (revision_number > 0),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','submitted','approved','rejected')),
  description text,
  approved_by uuid REFERENCES accounts(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (schedule_id,project_id) REFERENCES ims_schedules(id,project_id),
  UNIQUE(schedule_id, revision_number),
  UNIQUE(schedule_id,id),
  UNIQUE(id,project_id),
  CHECK ((state = 'approved') = (approved_at IS NOT NULL))
);
ALTER TABLE ims_schedules ADD CONSTRAINT ims_baseline_same_schedule
  FOREIGN KEY(id,current_baseline_revision_id) REFERENCES ims_revisions(schedule_id,id)
  DEFERRABLE INITIALLY IMMEDIATE;
COMMENT ON COLUMN ims_schedules.current_baseline_revision_id IS
  'Point to an approved immutable revision of THIS IMS via a privileged, audited approval transaction. DB FK checks schedule scope; service must check state.';

CREATE TABLE ims_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ims_revision_id uuid NOT NULL,
  project_id uuid NOT NULL,
  wbs_node_id uuid NOT NULL,
  activity_code text NOT NULL,
  title text NOT NULL,
  duration_days integer NOT NULL CHECK (duration_days >= 0),
  planned_start date NOT NULL,
  planned_finish date NOT NULL,
  responsible_party_id uuid REFERENCES project_parties(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (ims_revision_id,project_id) REFERENCES ims_revisions(id,project_id),
  FOREIGN KEY (project_id,wbs_node_id) REFERENCES wbs_nodes(project_id,id),
  UNIQUE(ims_revision_id,activity_code),
  UNIQUE(ims_revision_id,id),
  CHECK(planned_finish >= planned_start)
);
CREATE TABLE ims_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ims_revision_id uuid NOT NULL,
  predecessor_id uuid NOT NULL,
  successor_id uuid NOT NULL,
  link_type char(2) NOT NULL CHECK(link_type IN ('FS','SS','FF','SF')),
  lag_days integer NOT NULL DEFAULT 0,
  FOREIGN KEY(ims_revision_id,predecessor_id) REFERENCES ims_activities(ims_revision_id,id),
  FOREIGN KEY(ims_revision_id,successor_id) REFERENCES ims_activities(ims_revision_id,id),
  UNIQUE(ims_revision_id,predecessor_id,successor_id),
  CHECK(predecessor_id <> successor_id)
);
CREATE INDEX ims_dependencies_successor ON ims_dependencies(ims_revision_id,successor_id);

CREATE TABLE change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  category text NOT NULL CHECK(category IN ('contract','scope','schedule','combined')),
  state text NOT NULL DEFAULT 'draft'
    CHECK(state IN ('draft','submitted','under_review','approved','rejected','implemented')),
  reason text NOT NULL,
  proposed_effects jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_revision_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  approved_by uuid REFERENCES accounts(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE change_requests IS 'Change authorization never automatically edits or legally amends approved contracts/SOW.';

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid NOT NULL REFERENCES homes(id),
  project_id uuid,
  uploaded_by uuid NOT NULL REFERENCES accounts(id),
  object_key text NOT NULL UNIQUE,
  sha256 char(64) NOT NULL CHECK(sha256 ~ '^[0-9a-f]{64}$'),
  mime_type text NOT NULL,
  byte_size bigint NOT NULL CHECK(byte_size > 0),
  document_type text NOT NULL,
  disclosure_class text NOT NULL CHECK(disclosure_class IN (
    'home_technical','restricted_contract','owner_private','owner_financial','identity_private'
  )),
  file_state text NOT NULL DEFAULT 'quarantined'
    CHECK(file_state IN ('quarantined','accepted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(home_id,project_id) REFERENCES projects(home_id,id)
);
ALTER TABLE contract_revisions
  ADD CONSTRAINT contract_revision_document FOREIGN KEY(source_document_id) REFERENCES documents(id);
COMMENT ON TABLE documents IS 'Metadata only. Actual media is in a private object store; never serve directly via GitHub Pages.';

CREATE TABLE home_transfer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid NOT NULL REFERENCES homes(id),
  from_account_id uuid NOT NULL REFERENCES accounts(id),
  to_account_id uuid NOT NULL REFERENCES accounts(id),
  state text NOT NULL DEFAULT 'requested'
    CHECK(state IN ('requested','accepted','under_review','completed','declined','cancelled','expired')),
  consented_by_from_at timestamptz,
  consented_by_to_at timestamptz,
  verification_state text NOT NULL DEFAULT 'unverified'
    CHECK(verification_state IN ('unverified','pending','verified','rejected')),
  disclosure_manifest jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_by uuid REFERENCES accounts(id),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(from_account_id <> to_account_id),
  CHECK(state <> 'completed' OR (consented_by_from_at IS NOT NULL AND consented_by_to_at IS NOT NULL AND verification_state='verified' AND completed_at IS NOT NULL))
);
CREATE UNIQUE INDEX one_open_home_transfer ON home_transfer_requests(home_id)
  WHERE state IN ('requested','accepted','under_review');

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id uuid REFERENCES homes(id),
  project_id uuid REFERENCES projects(id),
  actor_account_id uuid REFERENCES accounts(id),
  action text NOT NULL,
  object_kind text NOT NULL,
  object_id uuid NOT NULL,
  before_state jsonb,
  after_state jsonb,
  correlation_id text NOT NULL,
  event_time timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_events_by_home ON audit_events(home_id,event_time DESC);

CREATE OR REPLACE FUNCTION reject_audit_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Audit log is append-only';
END $$;
CREATE TRIGGER audit_events_append_only
  BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION reject_audit_mutation();

CREATE OR REPLACE FUNCTION reject_approved_revision_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.state = 'approved' THEN
    RAISE EXCEPTION 'Approved revision is immutable';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER contract_revision_immutable BEFORE UPDATE OR DELETE ON contract_revisions
  FOR EACH ROW EXECUTE FUNCTION reject_approved_revision_mutation();
CREATE TRIGGER sow_revision_immutable BEFORE UPDATE OR DELETE ON sow_revisions
  FOR EACH ROW EXECUTE FUNCTION reject_approved_revision_mutation();
CREATE TRIGGER ims_revision_immutable BEFORE UPDATE OR DELETE ON ims_revisions
  FOR EACH ROW EXECUTE FUNCTION reject_approved_revision_mutation();

CREATE OR REPLACE FUNCTION reject_approved_ims_child_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_revision uuid;
BEGIN
  v_revision := CASE WHEN TG_OP = 'DELETE' THEN OLD.ims_revision_id ELSE NEW.ims_revision_id END;
  IF EXISTS (SELECT 1 FROM ims_revisions WHERE id = v_revision AND state = 'approved') THEN
    RAISE EXCEPTION 'Approved IMS revision children are immutable';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER ims_activity_immutable BEFORE INSERT OR UPDATE OR DELETE ON ims_activities
  FOR EACH ROW EXECUTE FUNCTION reject_approved_ims_child_mutation();
CREATE TRIGGER ims_dependency_immutable BEFORE INSERT OR UPDATE OR DELETE ON ims_dependencies
  FOR EACH ROW EXECUTE FUNCTION reject_approved_ims_child_mutation();

-- Default-deny tenancy boundary. No application SQL can access protected tables
-- until least-privilege grants AND approved RLS policies are added in a later migration.
-- Run only in isolated BAITNA database; never on the public Pages host.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'accounts','homes','home_access','projects','project_parties',
    'contracts','contract_revisions','sows','sow_revisions','wbs_nodes',
    'boq_lines','ims_schedules','ims_revisions','ims_activities',
    'ims_dependencies','change_requests','documents','home_transfer_requests','audit_events'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
COMMIT;
