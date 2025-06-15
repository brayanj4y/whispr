-- Function to clean up expired secrets
CREATE OR REPLACE FUNCTION cleanup_expired_secrets()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM secrets 
  WHERE expires_at < NOW() OR is_read = TRUE;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-secrets', '*/5 * * * *', 'SELECT cleanup_expired_secrets();');

-- For manual cleanup, you can run:
-- SELECT cleanup_expired_secrets();
