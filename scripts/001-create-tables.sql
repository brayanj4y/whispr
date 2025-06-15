-- Create secrets table
CREATE TABLE IF NOT EXISTS secrets (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_ip TEXT,
  is_read BOOLEAN DEFAULT FALSE
);

-- Create access logs table
CREATE TABLE IF NOT EXISTS secret_access_logs (
  id SERIAL PRIMARY KEY,
  secret_id TEXT NOT NULL,
  accessed_by_ip TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_secrets_expires_at ON secrets(expires_at);
CREATE INDEX IF NOT EXISTS idx_secrets_is_read ON secrets(is_read);
CREATE INDEX IF NOT EXISTS idx_access_logs_secret_id ON secret_access_logs(secret_id);

-- Enable Row Level Security (optional, for additional security)
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we're handling auth in the API)
CREATE POLICY "Allow public access to secrets" ON secrets FOR ALL USING (true);
CREATE POLICY "Allow public access to access logs" ON secret_access_logs FOR ALL USING (true);
