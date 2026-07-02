import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type FormEvent, useEffect, useState } from 'react'
import { eden } from '@/integrations/eden'
import { formatSubscriptionUpdate } from '../utils'

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
      const { data, error } = await eden.api.todos.get()
      if (error) throw error
      return data
    },
  })

  const invalidateTodos = () => queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })

  const createMutation = useMutation({
    mutationFn: async (input: { title: string; description?: string }) => {
      const { data, error } = await eden.api.todos.post(input)
      if (error) throw error
      return data
    },
    onSuccess: invalidateTodos,
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ todoId, completed }: { todoId: string; completed: boolean }) => {
      const { data, error } = await eden.api.todos({ todoId }).patch({ completed })
      if (error) throw error
      return data
    },
    onSuccess: invalidateTodos,
  })

  const deleteMutation = useMutation({
    mutationFn: async (todoId: string) => {
      const { data, error } = await eden.api.todos({ todoId }).delete()
      if (error) throw error
      return data
    },
    onSuccess: invalidateTodos,
  })

  // Live updates via the Elysia SSE stream, consumed as an async iterable.
  useEffect(() => {
    const controller = new AbortController()

    const subscribe = async () => {
      const { data, error } = await eden.api.todos.stream.get({
        fetch: { signal: controller.signal },
      })
      if (error) {
        console.error('SSE subscription error:', error)
        return
      }
      try {
        for await (const event of data) {
          queryClient.setQueryData(TODOS_QUERY_KEY, event.todos)
          setLastUpdate(formatSubscriptionUpdate(event.type, event.timestamp))
        }
      } catch (err) {
        if (!controller.signal.aborted) console.error('SSE subscription error:', err)
      }
    }

    subscribe()

    return () => controller.abort()
  }, [queryClient])

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
