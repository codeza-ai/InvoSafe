import {
  encryptStreamBytes,
  decryptStreamBytes,
  generateBlobOrStreamKey,
} from "./crypto";

// Encrypt a PDF file
async function encryptPdf(pdfBytes: Uint8Array) {
  // Generate a random key for encryption
  const invoiceKey = await generateBlobOrStreamKey();

  // Encrypt the PDF bytes
  const encryptedFile = await encryptStreamBytes(pdfBytes, invoiceKey);

  // Save or transmit encryptedFile.encryptedData and encryptedFile.decryptionHeader
  return {
    encryptedData: encryptedFile.encryptedData,
    decryptionHeader: encryptedFile.decryptionHeader,
    invoiceKey,
  };
}

// Decrypt a PDF file
async function decryptPdf(
  encryptedData: Uint8Array,
  decryptionHeader: string,
  invoiceKey: string
) {
  // Decrypt the PDF bytes
  const decryptedBytes = await decryptStreamBytes(
    { encryptedData, decryptionHeader },
    invoiceKey
  );

  // Use decryptedBytes as the original PDF file
  return decryptedBytes;
}

// Example usage
// Assume you have loaded the PDF file as a Uint8Array called pdfBytes
// const pdfBytes = ... (load your PDF file as Uint8Array)

// Encrypt
// const { encryptedData, decryptionHeader, key } = await encryptPdf(pdfBytes);

// Decrypt
// const decryptedPdfBytes = await decryptPdf(encryptedData, decryptionHeader, key);
