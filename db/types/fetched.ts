import {z} from 'zod';

export const FetchedInvoiceSchema = z.object({
    invoice_id : z.string().uuid(),
    sender_gstin: z.string().min(15).max(15),
    recipient_gstin: z.string().min(15).max(15),
    amount: z.number().positive(),
    status: z.string().default("requested"),
    invoice_date: z.string().datetime(),
    sender_name: z.string(),
    recipient_name: z.string(),
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    invoice_number: z.string().min(1).max(50),
    primary_invoice_key: z.string().optional().nullable(),
    secondary_invoice_key: z.string().optional().nullable(),
    decryption_header: z.string().optional().nullable(),
    // file_path: z.string().url().optional().nullable(),
    created_at: z.string().datetime().optional(),
});


export type FetchedInvoice = z.infer<typeof FetchedInvoiceSchema>;