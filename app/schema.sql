-- BAITNA LOCAL MVP DATABASE (SQLite 3). Development-only persistence.
-- PostgreSQL production migration is in ../../db/migrations/0001_core.sql.
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY, display_name TEXT NOT NULL, demo_role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS homes (
  id TEXT PRIMARY KEY,
  home_ref TEXT NOT NULL UNIQUE CHECK(home_ref LIKE 'BT-H-%'),
  label TEXT NOT NULL,
  phase TEXT NOT NULL DEFAULT 'construction',
  created_by TEXT NOT NULL REFERENCES accounts(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TRIGGER IF NOT EXISTS homes_immutable_identity
  BEFORE UPDATE OF id, home_ref ON homes
  WHEN NEW.id <> OLD.id OR NEW.home_ref <> OLD.home_ref
  BEGIN SELECT RAISE(ABORT, 'Permanent Home ID is immutable'); END;
CREATE TABLE IF NOT EXISTS home_access (
  id TEXT PRIMARY KEY,
  home_id TEXT NOT NULL REFERENCES homes(id),
  account_id TEXT NOT NULL REFERENCES accounts(id),
  role TEXT NOT NULL CHECK(role IN ('owner_manager','owner_delegate','home_viewer')),
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_current_manager ON home_access(home_id)
  WHERE role='owner_manager' AND active=1;
CREATE UNIQUE INDEX IF NOT EXISTS unique_home_role ON home_access(home_id,account_id,role)
  WHERE active=1;
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  home_id TEXT NOT NULL REFERENCES homes(id),
  project_ref TEXT NOT NULL,
  name TEXT NOT NULL,
  project_kind TEXT NOT NULL CHECK(project_kind IN ('new_build','renovation','maintenance','extension')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(home_id,project_ref), UNIQUE(id,home_id)
);
CREATE TABLE IF NOT EXISTS project_parties (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  account_id TEXT NOT NULL REFERENCES accounts(id),
  role TEXT NOT NULL CHECK(role IN ('main_contractor','subcontractor','consultant','project_manager','project_viewer')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id,account_id,role)
);
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id),
  contract_ref TEXT NOT NULL, counterparty TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id,contract_ref), UNIQUE(id,project_id)
);
CREATE TABLE IF NOT EXISTS contract_revisions (
  id TEXT PRIMARY KEY, contract_id TEXT NOT NULL REFERENCES contracts(id),
  revision_no INTEGER NOT NULL CHECK(revision_no >= 1),
  state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','approved')),
  terms TEXT NOT NULL DEFAULT '{}', approved_by TEXT REFERENCES accounts(id),
  approved_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(contract_id,revision_no)
);
CREATE TABLE IF NOT EXISTS sows (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id),
  contract_id TEXT NOT NULL REFERENCES contracts(id),
  sow_ref TEXT NOT NULL, title TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id,sow_ref), UNIQUE(id,project_id)
);
CREATE TABLE IF NOT EXISTS sow_revisions (
  id TEXT PRIMARY KEY, sow_id TEXT NOT NULL REFERENCES sows(id),
  revision_no INTEGER NOT NULL CHECK(revision_no >= 1),
  state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','approved')),
  specification TEXT NOT NULL DEFAULT '{}', acceptance_criteria TEXT NOT NULL DEFAULT '[]',
  approved_by TEXT REFERENCES accounts(id), approved_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(sow_id,revision_no)
);
CREATE TABLE IF NOT EXISTS wbs_nodes (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id),
  sow_id TEXT REFERENCES sows(id), wbs_code TEXT NOT NULL,
  title TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id,wbs_code), UNIQUE(id,project_id)
);
CREATE TABLE IF NOT EXISTS boq_lines (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id),
  wbs_id TEXT NOT NULL REFERENCES wbs_nodes(id), line_ref TEXT NOT NULL,
  description TEXT NOT NULL, quantity TEXT NOT NULL, unit TEXT NOT NULL,
  unit_price_aed TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id,line_ref)
);
CREATE TABLE IF NOT EXISTS ims_schedules (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL UNIQUE REFERENCES projects(id),
  base_date TEXT NOT NULL, baseline_revision_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS ims_revisions (
  id TEXT PRIMARY KEY, ims_id TEXT NOT NULL REFERENCES ims_schedules(id),
  revision_no INTEGER NOT NULL CHECK(revision_no>=1),
  state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','approved')),
  description TEXT NOT NULL DEFAULT '',
  approved_by TEXT REFERENCES accounts(id), approved_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(ims_id,revision_no)
);
CREATE TABLE IF NOT EXISTS ims_activities (
  id TEXT PRIMARY KEY, revision_id TEXT NOT NULL REFERENCES ims_revisions(id),
  wbs_id TEXT NOT NULL REFERENCES wbs_nodes(id), code TEXT NOT NULL,
  title TEXT NOT NULL, duration_days INTEGER NOT NULL CHECK(duration_days>=0),
  planned_start TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(revision_id,code), UNIQUE(revision_id,id)
);
CREATE TABLE IF NOT EXISTS ims_dependencies (
  id TEXT PRIMARY KEY, revision_id TEXT NOT NULL REFERENCES ims_revisions(id),
  predecessor_id TEXT NOT NULL REFERENCES ims_activities(id),
  successor_id TEXT NOT NULL REFERENCES ims_activities(id),
  link_type TEXT NOT NULL CHECK(link_type IN ('FS','SS','FF','SF')),
  lag_days INTEGER NOT NULL DEFAULT 0, CHECK(predecessor_id<>successor_id),
  UNIQUE(revision_id,predecessor_id,successor_id)
);
CREATE TRIGGER IF NOT EXISTS ims_activity_insert_guard
 BEFORE INSERT ON ims_activities
 WHEN (SELECT state FROM ims_revisions WHERE id=NEW.revision_id)='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved IMS is immutable'); END;
CREATE TRIGGER IF NOT EXISTS ims_activity_update_guard_update
 BEFORE UPDATE ON ims_activities
 
 BEGIN SELECT RAISE(ABORT, 'IMS activities are append-only; create a new revision'); END;
CREATE TRIGGER IF NOT EXISTS ims_activity_update_guard_delete
 BEFORE DELETE ON ims_activities
 
 BEGIN SELECT RAISE(ABORT, 'IMS activities are append-only; create a new revision'); END;
CREATE TRIGGER IF NOT EXISTS ims_dep_insert_guard
 BEFORE INSERT ON ims_dependencies
 WHEN (SELECT state FROM ims_revisions WHERE id=NEW.revision_id)='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved IMS is immutable'); END;
CREATE TRIGGER IF NOT EXISTS ims_dep_update_guard_update
 BEFORE UPDATE ON ims_dependencies
 
 BEGIN SELECT RAISE(ABORT, 'IMS dependencies are append-only; create a new revision'); END;
CREATE TRIGGER IF NOT EXISTS ims_dep_update_guard_delete
 BEFORE DELETE ON ims_dependencies
 
 BEGIN SELECT RAISE(ABORT, 'IMS dependencies are append-only; create a new revision'); END;
CREATE TRIGGER IF NOT EXISTS approved_contract_immutable_update
 BEFORE UPDATE ON contract_revisions
 WHEN OLD.state='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved contract revision is immutable'); END;
CREATE TRIGGER IF NOT EXISTS approved_contract_immutable_delete
 BEFORE DELETE ON contract_revisions
 WHEN OLD.state='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved contract revision is immutable'); END;
CREATE TRIGGER IF NOT EXISTS approved_sow_immutable_update
 BEFORE UPDATE ON sow_revisions
 WHEN OLD.state='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved SOW revision is immutable'); END;
CREATE TRIGGER IF NOT EXISTS approved_sow_immutable_delete
 BEFORE DELETE ON sow_revisions
 WHEN OLD.state='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved SOW revision is immutable'); END;
CREATE TRIGGER IF NOT EXISTS approved_ims_revision_immutable_update
 BEFORE UPDATE ON ims_revisions
 WHEN OLD.state='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved IMS revision is immutable'); END;
CREATE TRIGGER IF NOT EXISTS approved_ims_revision_immutable_delete
 BEFORE DELETE ON ims_revisions
 WHEN OLD.state='approved'
 BEGIN SELECT RAISE(ABORT, 'Approved IMS revision is immutable'); END;
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY, home_id TEXT REFERENCES homes(id),
 actor_id TEXT NOT NULL REFERENCES accounts(id),
 action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TRIGGER IF NOT EXISTS audit_event_immutable_update
 BEFORE UPDATE ON audit_events
 
 BEGIN SELECT RAISE(ABORT, 'Audit events are append-only'); END;
CREATE TRIGGER IF NOT EXISTS audit_event_immutable_delete
 BEFORE DELETE ON audit_events
 
 BEGIN SELECT RAISE(ABORT, 'Audit events are append-only'); END;
CREATE TABLE IF NOT EXISTS idempotency_keys (
 actor_id TEXT NOT NULL REFERENCES accounts(id),
 request_key TEXT NOT NULL, method TEXT NOT NULL, path TEXT NOT NULL,
 request_hash TEXT NOT NULL,
 response_body TEXT NOT NULL, status_code INTEGER NOT NULL,
 PRIMARY KEY (actor_id,request_key)
);