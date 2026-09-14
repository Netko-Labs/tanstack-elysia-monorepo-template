import { type RealtimeConfig, RealtimeConfigSchema } from '@temp-repo/realtime-domain'

const realtimeConfig: RealtimeConfig = {
  app: {
    dev: process.env.NODE_ENV !== 'production',
    port: Number(process.env.PORT ?? 3001),
    cors: process.env.CORS?.split(',') ?? ['https://studio.localhost', 'http://localhost:3000'],
    webBaseUrl: process.env.WEB_BASE_URL ?? 'https://studio.localhost',
  },
  db: {
    url: process.env.DATABASE_URL ?? '',
  },
}

export const realtimeEnvConfig = RealtimeConfigSchema.parse(realtimeConfig)
