import { z } from 'zod'

export const RealtimeConfigSchema = z.object({
  app: z.object({
    dev: z.boolean(),
    port: z.number().default(3001),
    cors: z.array(z.string()).default(['http://localhost:3000']),
    webBaseUrl: z.string().default('http://localhost:3000'),
  }),
  db: z.object({
    url: z.string(),
  }),
})
export type RealtimeConfig = z.infer<typeof RealtimeConfigSchema>
