import {z} from 'zod';

export const InvoiceSchema = z.object({
    invoice_id : z.string().uuid(),
    sender_gstin: z.string().min(14).max(15),
    recipient_gstin: z.string().min(14).max(15),
    amount: z.number().positive(),
    status: z.string().default("requested"),
    invoice_date: z.string().datetime(),
    sender_id: z.string().uuid(),
    recipient_id: z.string().uuid(),
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    invoice_number: z.string().min(1).max(50),
});

export type Invoice = z.infer<typeof InvoiceSchema>;