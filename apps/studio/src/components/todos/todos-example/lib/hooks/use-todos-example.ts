import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Todo } from '@temp-repo/realtime-domain'
import { type FormEvent, useState } from 'react'
import { realtime } from '@/integrations/realtime'

const TODOS_QUERY_KEY = ['todos'] as const

export function useTodosExample() {
  const queryClient = useQueryClient()
  const [lastUpdate, setLastUpdate] = useState('')

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await realtime.todos.get()
      if (error) throw error
      // eden@1.4 mis-infers Elysia 2 array responses; the runtime value is Todo[].
      return data as unknown as Todo[]
    },
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
    setLastUpdate(new Date().toLocaleTimeString())
  }

  const createMutation = useMutation({
    mutationFn: async (input: { title: string; description?: string }) => {
      const { data, error } = await realtime.todos.post(input)
      if (error) throw error
      return data
    },
    onSuccess: invalidate,
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ todoId, completed }: { todoId: string; completed: boolean }) => {
      const { data, error } = await realtime.todos({ todoId }).patch({ completed })
      if (error) throw error
      return data
    },
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: async (todoId: string) => {
      const { data, error } = await realtime.todos({ todoId }).delete()
      if (error) throw error
      return data
    },
    onSuccess: invalidate,
  })

  const handleCreateTodo = (e: FormEvent, title: string, description: string) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({ title, description: description || undefined })
  }

  const handleToggleTodo = (todoId: string, completed: boolean) => {
    toggleMutation.mutate({ todoId, completed: !completed })
  }

  const handleDeleteTodo = (todoId: string) => {
    deleteMutation.mutate(todoId)
  }

  return {
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
  }
}
