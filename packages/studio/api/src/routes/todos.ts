import { TodoInsertSchema } from '@temp-repo/studio-domain'
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '@temp-repo/studio-service'
import { Elysia } from 'elysia'
import { z } from 'zod'

const TodoPatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullish(),
  completed: z.boolean().optional(),
})

export const todosRoutes = new Elysia({ name: 'todos', prefix: '/todos' })
  .get('/', () => getTodos())
  .get('/:todoId', ({ params }) => getTodo(params.todoId))
  .post('/', ({ body }) => createTodo(body), { body: TodoInsertSchema })
  .patch('/:todoId', ({ params, body }) => updateTodo(params.todoId, body), {
    body: TodoPatchSchema,
  })
  .delete('/:todoId', ({ params }) => deleteTodo(params.todoId))
  // SSE stream (async generator) — Eden consumes this as an async iterable.
  .get('/stream', async function* ({ request }) {
    yield { type: 'sync' as const, todos: await getTodos(), timestamp: Date.now() }
    while (!request.signal.aborted) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      if (request.signal.aborted) break
      yield { type: 'update' as const, todos: await getTodos(), timestamp: Date.now() }
    }
  })
