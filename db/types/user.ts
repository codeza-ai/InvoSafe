import { z} from 'zod';

export const UserSchema = z.object({
    user_id: z.string().uuid().optional(),
    gstin: z.string().min(15).max(15),
    business_name: z.string().min(1).max(100),
    profile_url: z.string().url().optional(),
    mobile_number : z.string().length(10).optional(),
    business_email: z.string().email().optional(),
    business_address: z.string().optional(),
    business_description: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;