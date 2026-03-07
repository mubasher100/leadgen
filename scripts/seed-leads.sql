-- Phase 1: Seed sample leads for local testing (not for production)
-- Ensure the pgcrypto extension is enabled if you want to use gen_random_uuid()
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO leads (created_at, updated_at, status, validation_status, first_name, last_name, email, phone, company, city, state, country, address, business_type, service_interest, lead_source, budget, budget_bracket, data_source, source_id, source_timestamp, data, notes, ip_address, user_agent)
VALUES
  (now(), now(), 'New', 'pending', 'Alice', 'Anderson', 'alice@example.com', '(555) 111-2222', 'Acme Digital', 'Los Angeles', 'CA', 'US', '123 Market St', 'Digital Marketing', 'SEO', 'Website Form', 5000, '5k-10k', 'Google Places', 'gp-seed-1', now(), '{}', '', '', 'AgentBot/1.0'),
  (now(), now(), 'New', 'pending', 'Bob', 'Ng', 'bob.ng@example.com', '','Northstar LLC', 'New York', 'NY', 'US', '45 Broadway', 'Digital Marketing', 'PPC', 'Website Form', 7500, '5k-10k', 'Yelp', 'yp-seed-2', now(), '{}', '', '', 'AgentBot/1.0'),
  (now(), now(), 'New', 'pending', 'Carol', 'Chen', 'carol.chen@example.com', '', 'BluePeak', 'San Francisco', 'CA', 'US', '200 Market St', 'Digital Marketing', 'Content', 'Website Form', 12000, '10k+', 'Google Places', 'gp-seed-3', now(), '{}', '', '', 'AgentBot/1.0');
