import { createLogger } from '@temp-repo/logger'
import { app } from '@temp-repo/realtime-api'
import { realtimeEnvConfig } from '@temp-repo/realtime-config'
import { roomRoutes } from './room'

const logger = createLogger('realtime')

app.use(roomRoutes).listen(realtimeEnvConfig.app.port)
logger.info(`🚀 realtime server listening on http://localhost:${realtimeEnvConfig.app.port}`)
