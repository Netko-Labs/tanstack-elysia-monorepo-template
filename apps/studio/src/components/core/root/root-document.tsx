import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import * as TanstackQuery from '@/integrations/tanstack-query/root-provider'
import type { RootDocumentProps } from './lib'

export function RootDocument({ children }: RootDocumentProps) {
  const rqContext = TanstackQuery.getContext()

  return (
    <TanstackQuery.Provider {...rqContext}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </TanstackQuery.Provider>
  )
}
