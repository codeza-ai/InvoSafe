import {z} from 'zod';

export const SubscriberSchema = z.object({
    created_at: z.string().datetime(),
    subscriber_email: z.string().email(),
});

export type Subscriber = z.infer<typeof SubscriberSchema>;