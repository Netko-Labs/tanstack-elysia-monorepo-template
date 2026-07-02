import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import { TECH_STACK_ITEMS } from '../lib'

export function TechStack() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TECH_STACK_ITEMS.map((item) => (
        <Card key={item.title}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
