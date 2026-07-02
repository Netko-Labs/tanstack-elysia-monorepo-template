import { createRouter } from '@tanstack/react-router'
import { getContext } from '@/integrations/tanstack-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const { queryClient } = getContext()

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      queryClient,
    },
  })

  return router
}
