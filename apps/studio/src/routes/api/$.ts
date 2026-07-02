import { createFileRoute } from '@tanstack/react-router'
import { app } from '@temp-repo/studio-api'

function handler({ request }: { request: Request }) {
  return app.handle(request)
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
      PATCH: handler,
      PUT: handler,
      DELETE: handler,
    },
  },
})
