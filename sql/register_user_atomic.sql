-- Create a PostgreSQL function to handle atomic user registration
-- This function ensures that both user and key-attributes records are inserted together
-- or both fail if there's an error (maintaining atomicity)

CREATE OR REPLACE FUNCTION register_user_with_keys(
  p_user_id UUID,
  p_gstin TEXT,
  p_business_name TEXT,
  p_mobile_number TEXT,
  p_password TEXT,
  p_business_address TEXT,
  p_business_description TEXT,
  p_encrypted_key TEXT,
  p_key_decryption_nonce TEXT,
  p_kek_salt TEXT,
  p_ops_limit INTEGER,
  p_mem_limit INTEGER,
  p_public_key TEXT,
  p_encrypted_secret_key TEXT,
  p_secret_key_decryption_nonce TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Start a transaction block (automatically handled by function)
  
  -- Insert user record
  INSERT INTO users (
    user_id,
    gstin,
    business_name,
    mobile_number,
    profile_url,
    password,
    business_email,
    business_address,
    business_description
  ) VALUES (
    p_user_id,
    p_gstin,
    p_business_name,
    p_mobile_number,
    NULL, -- profile_url
    p_password,
    NULL, -- business_email
    p_business_address,
    p_business_description
  );

  -- Insert key-attributes record
  INSERT INTO "key-attributes" (
    user_id,
    gstin,
    encrypted_key,
    key_decryption_nonce,
    kek_salt,
    ops_limit,
    mem_limit,
    public_key,
    encrypted_secret_key,
    secret_key_decryption_nonce
  ) VALUES (
    p_user_id,
    p_gstin,
    p_encrypted_key,
    p_key_decryption_nonce,
    p_kek_salt,
    p_ops_limit,
    p_mem_limit,
    p_public_key,
    p_encrypted_secret_key,
    p_secret_key_decryption_nonce
  );

  -- If we reach here, both inserts were successful
  result := json_build_object(
    'success', true,
    'message', 'User and key attributes registered successfully',
    'user_id', p_user_id
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- If any error occurs, the transaction will be rolled back automatically
    -- Return error information
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to the role - postgres
GRANT EXECUTE ON FUNCTION register_user_with_keys TO postgres;

-- Example usage:
-- SELECT register_user_with_keys(
--   'uuid-here'::UUID,
--   'gstin-here',
--   'business-name',
--   'mobile-number',
--   'hashed-password',
--   'business-address',
--   'business-description',
--   'encrypted-key',
--   'key-decryption-nonce',
--   'kek-salt',
--   2, -- ops_limit
--   1024, -- mem_limit
--   'public-key',
--   'encrypted-secret-key',
--   'secret-key-decryption-nonce'
-- );
