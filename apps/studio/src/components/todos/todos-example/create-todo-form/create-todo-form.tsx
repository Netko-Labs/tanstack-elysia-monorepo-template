import { Button } from '@temp-repo/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import { Field, FieldGroup, FieldLabel } from '@temp-repo/ui/components/field'
import { Input } from '@temp-repo/ui/components/input'
import { Textarea } from '@temp-repo/ui/components/textarea'
import { type FormEvent, useState } from 'react'
import type { CreateTodoFormProps } from '../lib'
import {
  CREATE_TODO_DESCRIPTION,
  CREATE_TODO_DESCRIPTION_LABEL,
  CREATE_TODO_DESCRIPTION_PLACEHOLDER,
  CREATE_TODO_PENDING_LABEL,
  CREATE_TODO_SUBMIT_LABEL,
  CREATE_TODO_TITLE,
  CREATE_TODO_TITLE_LABEL,
  CREATE_TODO_TITLE_PLACEHOLDER,
} from '../lib'

export function CreateTodoForm({ onSubmit, isPending }: CreateTodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: FormEvent) => {
    onSubmit(e, title, description)
    setTitle('')
    setDescription('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CREATE_TODO_TITLE}</CardTitle>
        <CardDescription>{CREATE_TODO_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="todo-title">{CREATE_TODO_TITLE_LABEL}</FieldLabel>
              <Input
                id="todo-title"
                placeholder={CREATE_TODO_TITLE_PLACEHOLDER}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="todo-description">{CREATE_TODO_DESCRIPTION_LABEL}</FieldLabel>
              <Textarea
                id="todo-description"
                placeholder={CREATE_TODO_DESCRIPTION_PLACEHOLDER}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? CREATE_TODO_PENDING_LABEL : CREATE_TODO_SUBMIT_LABEL}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
