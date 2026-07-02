import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QUERY_STALE_TIME_MS, type QueryProviderProps } from './lib'

let clientQueryClient: QueryClient | undefined

function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
      },
    },
  })
}

function getQueryClient() {
  if (typeof window === 'undefined') {
    return createAppQueryClient()
  }

  if (!clientQueryClient) {
    clientQueryClient = createAppQueryClient()
  }
  return clientQueryClient
}

export function getContext() {
  return { queryClient: getQueryClient() }
}

export function Provider({ children, queryClient }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
