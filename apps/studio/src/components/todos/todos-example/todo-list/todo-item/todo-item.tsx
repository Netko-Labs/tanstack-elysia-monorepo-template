import { Button } from '@temp-repo/ui/components/button'
import { Separator } from '@temp-repo/ui/components/separator'
import { Fragment } from 'react'
import { formatDateTime } from '@/shared/format-date'
import type { TodoItemProps, TodoItemRowProps } from '../../lib'

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  isTogglePending,
  isDeletePending,
}: TodoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
        className="mt-1 h-5 w-5 cursor-pointer"
        disabled={isTogglePending}
      />
      <div className="flex-1">
        <h3
          className={`font-semibold ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p
            className={`mt-1 text-sm ${todo.completed ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}
          >
            {todo.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Created: {formatDateTime(todo.createdAt)}
        </p>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(todo.id)}
        disabled={isDeletePending}
      >
        Delete
      </Button>
    </div>
  )
}

export function TodoItemSeparator() {
  return <Separator />
}

export function TodoItemRow({ todo, showSeparator, ...props }: TodoItemRowProps) {
  return (
    <Fragment>
      {showSeparator && <TodoItemSeparator />}
      <TodoItem todo={todo} {...props} />
    </Fragment>
  )
}
