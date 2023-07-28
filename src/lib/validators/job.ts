import { z } from 'zod';

const isValidDateString = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const JobValidator = z.object({
  id: z.string(),
  userId: z.string().optional(),
  source: z.enum(['LINKEDIN']),
  date: z.string().refine(isValidDateString, {
    message: 'Invalid date format. Expected "YYYY-MM-DD" format.',
  }),
  body: z.object({
    title: z.string(),
    company: z.string(),
    href: z.string(),
    location: z.string(),
    description: z.string(),
    priorityPoints: z.number(),
    priorityHits: z.array(z.string()),
  }),
});

export type JobData = z.infer<typeof JobValidator>;
