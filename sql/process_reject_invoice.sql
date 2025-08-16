CREATE OR REPLACE FUNCTION process_reject_invoice(
  p_status TEXT
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
    "encryptedKey",
    "keyDecryptionNonce",
    "kekSalt",
    "opsLimit",
    "memLimit",
    "publicKey",
    "encryptedSecretKey",
    "secretKeyDecryptionNonce"
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

-- Grant execute permission to the service role
-- Replace 'service_role' with your actual service role name if different
GRANT EXECUTE ON FUNCTION register_user_with_keys TO service_role;