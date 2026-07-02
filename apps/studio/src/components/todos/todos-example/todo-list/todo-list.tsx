import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@temp-repo/ui/components/card'
import type { TodoListProps } from '../lib'
import { LIST_EMPTY, LIST_LOADING, LIST_TITLE } from '../lib'
import { TodoItemRow } from './todo-item/todo-item'

export function TodoList({
  todos,
  isLoading,
  onToggle,
  onDelete,
  isTogglePending,
  isDeletePending,
}: TodoListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{LIST_TITLE}</CardTitle>
        <CardDescription>
          {isLoading ? 'Loading...' : `${todos.length} todo${todos.length !== 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">{LIST_LOADING}</p>
        ) : todos.length === 0 ? (
          <p className="text-muted-foreground">{LIST_EMPTY}</p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo, index) => (
              <TodoItemRow
                key={todo.id}
                todo={todo}
                showSeparator={index > 0}
                onToggle={onToggle}
                onDelete={onDelete}
                isTogglePending={isTogglePending}
                isDeletePending={isDeletePending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
