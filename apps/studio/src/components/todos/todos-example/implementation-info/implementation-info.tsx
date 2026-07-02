import { Card, CardContent, CardHeader, CardTitle } from '@temp-repo/ui/components/card'
import {
  IMPLEMENTATION_HINT,
  IMPLEMENTATION_QUERY,
  IMPLEMENTATION_SSE,
  IMPLEMENTATION_TITLE,
} from '../lib'

export function ImplementationInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{IMPLEMENTATION_TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>TanStack Query:</strong> {IMPLEMENTATION_QUERY}
        </p>
        <p>
          <strong>SSE Subscriptions:</strong> {IMPLEMENTATION_SSE}
        </p>
        <p className="text-muted-foreground">{IMPLEMENTATION_HINT}</p>
      </CardContent>
    </Card>
  )
}
