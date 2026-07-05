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
  // (｡◕‿◕｡) list every todo
  .get('/', () => getTodos())
  // (・o・)ゞ peek a single todo by id
  .get('/:todoId', ({ params }) => getTodo(params.todoId))
  // ✨(っ◔◡◔)っ create a brand-new todo
  .post('/', { auth: true, body: TodoInsertSchema }, ({ body }) => createTodo(body))
  // (๑˃ᴗ˂)ﻭ tweak an existing todo
  .patch(
    '/:todoId',
    {
      auth: true,
      body: TodoPatchSchema,
    },
    ({ params, body }) => updateTodo(params.todoId, body),
  )
  // (ノ﹏ヽ) poof — delete a todo
  .delete('/:todoId', { auth: true }, ({ params }) => deleteTodo(params.todoId))
