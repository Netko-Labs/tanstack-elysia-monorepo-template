import { Button } from '@temp-repo/ui/components/button'
import { Card, CardContent } from '@temp-repo/ui/components/card'
import { Input } from '@temp-repo/ui/components/input'
import { type FormEvent, useState } from 'react'
import type { SendMessageFormProps } from '../lib'
import { GUEST_MESSAGE, SEND_LABEL, SEND_PENDING_LABEL, SEND_PLACEHOLDER } from '../lib'

export function SendMessageForm({ onSubmit, isPending }: SendMessageFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: FormEvent) => {
    onSubmit(e, content)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder={SEND_PLACEHOLDER}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || !content.trim()}>
        {isPending ? SEND_PENDING_LABEL : SEND_LABEL}
      </Button>
    </form>
  )
}

export function GuestNotice() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-6 text-center">
        <p className="text-muted-foreground">{GUEST_MESSAGE}</p>
      </CardContent>
    </Card>
  )
}
