import { z } from 'zod';

export const ConfigValidator = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  name: z
    .string()
    .min(1, {
      message: 'Config name must be at least 1 characters long',
    })
    .max(15, {
      message: 'Config name must be less than 15 characters long',
    }),
  body: z.object({
    location: z.string(),
    timeRange: z.enum(['DAY', 'WEEK', 'MONTH']),
    listOfSearchKeywords: z.array(z.string()),
    titleIncludes: z.array(z.string()),
    titleExcludes: z.array(z.string()),
    priorityList: z.record(z.number()),
  }),
});

export type ConfigData = z.infer<typeof ConfigValidator>;
