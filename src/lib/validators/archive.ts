import { z } from 'zod';
import { JobValidator } from './job';

export const ArchiveValidator = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  name: z
    .string()
    .min(1, {
      message: 'Archive name must be at least 1 characters long',
    })
    .max(15, {
      message: 'Archive name must be less than 15 characters long',
    }),
  jobs: z.array(JobValidator).optional(),
});

export type ArchiveData = z.infer<typeof ArchiveValidator>;
