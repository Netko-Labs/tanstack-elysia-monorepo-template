import type { Todo } from '@temp-repo/studio-domain'
import type { FormEvent } from 'react'

export interface TodoUpdateEvent {
  id: string
  type: 'sync' | 'update'
  todos: Todo[]
  timestamp: number
}

export interface CreateTodoFormProps {
  onSubmit: (e: FormEvent, title: string, description: string) => void
  isPending: boolean
}

export interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
  onToggle: (todoId: string, completed: boolean) => void
  onDelete: (todoId: string) => void
  isTogglePending: boolean
  isDeletePending: boolean
}

export interface TodoItemProps {
  todo: Todo
  onToggle: (todoId: string, completed: boolean) => void
  onDelete: (todoId: string) => void
  isTogglePending: boolean
  isDeletePending: boolean
}

export interface TodoItemRowProps extends TodoItemProps {
  showSeparator: boolean
}

export interface SubscriptionStatusProps {
  lastUpdate: string
}
