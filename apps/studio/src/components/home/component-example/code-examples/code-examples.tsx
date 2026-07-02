import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@temp-repo/ui/components/tabs'
import { CodeBlock } from '../code-block/code-block'
import { CODE_EXAMPLE_API, CODE_EXAMPLE_QUERY, CODE_EXAMPLE_SUBSCRIPTION } from '../lib'

export function CodeExamples() {
  return (
    <Tabs defaultValue="api">
      <TabsList>
        <TabsTrigger value="api">Elysia Route</TabsTrigger>
        <TabsTrigger value="query">React Query</TabsTrigger>
        <TabsTrigger value="subscription">SSE Subscription</TabsTrigger>
      </TabsList>

      <TabsContent value="api" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Elysia Route Definition</CardTitle>
            <CardDescription>Define type-safe routes with Zod input validation</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={CODE_EXAMPLE_API} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="query" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>TanStack Query Integration</CardTitle>
            <CardDescription>Use Eden Treaty with React Query for data fetching</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={CODE_EXAMPLE_QUERY} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subscription" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>SSE Subscriptions</CardTitle>
            <CardDescription>Real-time updates via Server-Sent Events</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={CODE_EXAMPLE_SUBSCRIPTION} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
