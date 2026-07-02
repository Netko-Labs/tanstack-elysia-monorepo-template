import { Card, CardContent } from '@temp-repo/ui/components/card'
import { CreateTodoForm } from './create-todo-form/create-todo-form'
import { ImplementationInfo } from './implementation-info/implementation-info'
import { TODOS_PAGE_DESCRIPTION, TODOS_PAGE_TITLE, useTodosExample } from './lib'
import { SubscriptionStatus } from './subscription-status/subscription-status'
import { TodoList } from './todo-list/todo-list'

export function TodosExample() {
  const {
    todos,
    isLoading,
    error,
    lastUpdate,
    createMutation,
    toggleMutation,
    deleteMutation,
    handleCreateTodo,
    handleToggleTodo,
    handleDeleteTodo,
  } = useTodosExample()

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{TODOS_PAGE_TITLE}</h1>
        <p className="text-muted-foreground">{TODOS_PAGE_DESCRIPTION}</p>
      </div>

      <SubscriptionStatus lastUpdate={lastUpdate} />

      <CreateTodoForm onSubmit={handleCreateTodo} isPending={createMutation.isPending} />

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      <TodoList
        todos={todos}
        isLoading={isLoading}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        isTogglePending={toggleMutation.isPending}
        isDeletePending={deleteMutation.isPending}
      />

      <ImplementationInfo />
    </div>
  )
}
