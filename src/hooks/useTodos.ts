import { useState, useCallback } from 'react'
import { Todo } from '@/types/todo'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/todos/getAllTodos', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addTodo = async (content: string) => {
    try {
      const response = await fetch('/api/todos/createTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content })
      })
      if (!response.ok) throw new Error('Failed to add todo')
      await fetchTodos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch('/api/todos/updateTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...updates })
      })
      if (!response.ok) throw new Error('Failed to update todo')
      await fetchTodos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch('/api/todos/deleteTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      await fetchTodos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo
  }
} 