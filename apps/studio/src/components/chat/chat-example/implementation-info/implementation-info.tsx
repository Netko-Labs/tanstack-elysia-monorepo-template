import { Card, CardContent, CardHeader, CardTitle } from '@temp-repo/ui/components/card'
import {
  IMPLEMENTATION_AUTH,
  IMPLEMENTATION_HINT,
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
          <strong>SSE Subscriptions:</strong> {IMPLEMENTATION_SSE}
        </p>
        <p>
          <strong>Authentication:</strong> {IMPLEMENTATION_AUTH}
        </p>
        <p className="text-muted-foreground">{IMPLEMENTATION_HINT}</p>
      </CardContent>
    </Card>
  )
}
