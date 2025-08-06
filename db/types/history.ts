import { z } from "zod";

export const HistorySchema = z.object({
  invoice_id: z.string().uuid(),
  sender_gstin: z.string().min(15).max(15),
  recipient_gstin: z.string().min(15).max(15),
  // created_at : z.string().timestamp().optional(),
  amount: z.number().positive(),
  status: z.string().default("requested"),
  invoice_date: z.string().datetime(),
  sender_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  invoice_number: z.string().min(1).max(50),
});

export type History = z.infer<typeof HistorySchema>;
