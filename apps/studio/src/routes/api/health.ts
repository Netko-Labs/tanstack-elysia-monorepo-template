import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        const startTime = Date.now()

        // Basic health info
        const health = {
          status: 'healthy' as const,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
        }

        // Check database if possible (optional, don't fail if unavailable)
        let dbStatus = 'unknown'
        try {
          // Import dynamically to avoid issues if db not configured
          const { db, sql } = await import('@temp-repo/studio-repository')
          await db.execute(sql`SELECT 1`)
          dbStatus = 'connected'
        } catch {
          dbStatus = 'unavailable'
        }

        return Response.json({
          ...health,
          responseTime: Date.now() - startTime,
          checks: {
            database: dbStatus,
          },
        })
      },
    },
  },
})
