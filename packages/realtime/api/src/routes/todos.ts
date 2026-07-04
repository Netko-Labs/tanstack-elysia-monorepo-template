import { TodoInsertSchema } from '@temp-repo/realtime-domain'
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '@temp-repo/realtime-service'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../setup'

const TodoPatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullish(),
  completed: z.boolean().optional(),
})

export const todosRoutes = new Elysia({ name: 'todos', prefix: '/todos' })
  .use(authPlugin)
  .get('/', () => getTodos())
  .get('/:todoId', ({ params }) => getTodo(params.todoId))
  .post('/', ({ body }) => createTodo(body), { auth: true, body: TodoInsertSchema })
  .patch('/:todoId', ({ params, body }) => updateTodo(params.todoId, body), {
    auth: true,
    body: TodoPatchSchema,
  })
  .delete('/:todoId', ({ params }) => deleteTodo(params.todoId), { auth: true })
