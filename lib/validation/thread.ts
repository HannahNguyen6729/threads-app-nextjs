import * as z from 'zod';

export const ThreadSchemaValidation = z.object({
  thread: z.string().min(1).min(3, { message: 'Minimum 3 characters.' }),
  accountId: z.string(),
});
