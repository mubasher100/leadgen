-- Phase 1: Leads table with discovery fields for Digital Marketing (in-clone)
-- Enable pgcrypto if you plan to use gen_random_uuid()
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Lifecycle
  status VARCHAR(20) NOT NULL DEFAULT 'New'
    CHECK (status IN ('New','Contacted','Closed')),
  validation_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (validation_status IN ('pending','validated','invalid')),

  -- Core contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  job_title TEXT,

  -- Location
  city TEXT,
  state TEXT,
  country TEXT,
  address TEXT,

  -- Context
  business_type TEXT NOT NULL,
  service_interest TEXT,
  lead_source TEXT,

  -- Budget
  budget NUMERIC,
  budget_bracket TEXT,

  -- Discovery & enrichment (Phase 1)
  data_source VARCHAR(100),
  source_id TEXT,
  enrichment JSONB,
  enrichment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (enrichment_status IN ('pending','completed','failed')),
  source_timestamp TIMESTAMPTZ,
  data JSONB,
  data_source_region TEXT,

  -- Audit
  notes TEXT,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX leads_created_at_idx ON leads (created_at);
CREATE INDEX leads_status_idx ON leads (status);
CREATE INDEX leads_data_source_idx ON leads (data_source);
CREATE INDEX leads_source_id_idx ON leads (source_id);
CREATE INDEX leads_email_idx ON leads (email);
