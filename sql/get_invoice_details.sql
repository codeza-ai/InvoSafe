CREATE OR REPLACE FUNCTION get_invoice_details(
  p_invoice_id TEXT,
  p_gstin TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
-- SET search_path = ''
AS $$
DECLARE
  result JSON;
BEGIN
  -- Try to fetch from invoices table
  SELECT row_to_json(inv) INTO result
  FROM invoices inv
  WHERE inv.invoice_id = p_invoice_id
    AND (inv.sender_gstin = p_gstin OR inv.recipient_gstin = p_gstin)
  LIMIT 1;

  -- If not found, try to fetch from history table
  IF result IS NULL THEN
    SELECT row_to_json(hist) INTO result
    FROM history hist
    WHERE hist.invoice_id = p_invoice_id
      AND (hist.sender_gstin = p_gstin OR hist.recipient_gstin = p_gstin)
    LIMIT 1;
  END IF;

  -- Return result (could be null if not found)
  IF result IS NULL THEN
    result := json_build_object(
      'error', 'Invoice not found',
      'status', 404
    );
  END IF;
  RETURN result;
END;
$$;

-- Grant execute permission to the role - postgres
GRANT EXECUTE ON FUNCTION get_invoice_details TO postgres;