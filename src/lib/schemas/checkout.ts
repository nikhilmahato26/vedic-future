import { z } from 'zod';

export const checkoutSchema = z.object({
  serviceId: z.coerce.number(),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  consultationDate: z.string().min(1, 'Date is required'),
  message: z.string().optional(),
});
