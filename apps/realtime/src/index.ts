import { createLogger } from '@temp-repo/logger'
import { app } from '@temp-repo/realtime-api'
import { realtimeEnvConfig } from '@temp-repo/realtime-config'

const logger = createLogger('realtime')

// The full app (HTTP routes + the WebSocket room) lives in @temp-repo/realtime-api;
// the entry just starts the Bun server.
app.listen(realtimeEnvConfig.app.port)
logger.info(`🚀 realtime server listening on http://localhost:${realtimeEnvConfig.app.port}`)
