CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  employee_count TEXT NOT NULL,
  revenue_range TEXT NOT NULL,
  calendly_event_id TEXT,
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,
  calendly_scheduled_at TIMESTAMPTZ,
  pipeline_stage TEXT NOT NULL DEFAULT 'lead'
    CHECK (pipeline_stage IN ('lead','appointment','qualified','sold','not_interested')),
  sold_amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert leads"
  ON leads FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "service role full access"
  ON leads TO service_role USING (true) WITH CHECK (true);
