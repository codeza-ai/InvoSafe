// Validation logic for invoice form
export function validateInvoiceForm({
    senderGstNumber,
    senderUserName,
    receiverGstNumber,
    amount,
    title,
    invoiceNumber,
    description,
    date,
    invoice
}: {
    senderGstNumber: string,
    senderUserName: string,
    receiverGstNumber: string,
    amount: string,
    title: string,
    invoiceNumber: string,
    description: string,
    date: Date | undefined,
    invoice: File | null
}) {
    const validationErrors: string[] = [];
    if (!senderGstNumber || !senderUserName) {
        validationErrors.push("Unauthorized: Please log in to create an invoice.");
    }
    if (!receiverGstNumber.trim()) {
        validationErrors.push("• Receiver GST Number is required");
    }
    if (!amount.trim()) {
        validationErrors.push("• Amount is required");
    }
    if (!title.trim()) {
        validationErrors.push("• Title is required");
    }
    if (!invoiceNumber.trim()) {
        validationErrors.push("• Invoice Number is required");
    }
    if (!date) {
        validationErrors.push("• Invoice Date is required");
    }
    // GST Number format validation
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[0-9A-Z]{4}$/;
    if (receiverGstNumber.trim() && !gstRegex.test(receiverGstNumber.trim())) {
        validationErrors.push("• Invalid GST Number format (should be 15 characters: 22AAAAA0000A1Z5)");
    }
    // Amount validation
    const amountValue = parseFloat(amount);
    if (amount.trim() && (isNaN(amountValue) || amountValue <= 0)) {
        validationErrors.push("• Amount must be a positive number");
    }
    if (amountValue > 10000000) { // 1 crore limit
        validationErrors.push("• Amount cannot exceed ₹1,00,00,000");
    }
    if (receiverGstNumber.trim() === senderGstNumber) {
        validationErrors.push("• Sender and receiver GST numbers cannot be the same");
    }
    if (title.trim() && title.trim().length > 100) {
        validationErrors.push("• Title cannot exceed 100 characters");
    }
    if (description.trim() && description.trim().length > 500) {
        validationErrors.push("• Description cannot exceed 500 characters");
    }
    if (date && date > new Date()) {
        validationErrors.push("• Invoice date cannot be in the future");
    }
    if (invoice) {
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "application/pdf",
        // "image/jpeg",
        // "image/jpg",
        // "image/png",
      ];
      if (invoice.size > maxFileSize) {
        validationErrors.push("• File size cannot exceed 5MB");
      }
      if (!allowedTypes.includes(invoice.type)) {
        validationErrors.push(
          "• Only PDF, JPEG, JPG, and PNG files are allowed"
        );
      }
    }
    return validationErrors;
}
