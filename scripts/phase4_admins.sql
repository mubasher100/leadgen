-- Phase 4: Admins table (RBAC groundwork)
-- Enable if needed gen_random_uuid()
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','staff','manager'))
);

CREATE INDEX admins_email_idx ON admins (email);
