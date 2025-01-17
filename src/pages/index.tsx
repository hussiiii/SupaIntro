import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TodoItem } from '@/components/TodoItem'
import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [newTodo, setNewTodo] = useState('')
  
  const { todos, isLoading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    } else {
      fetchTodos()
    }
  }, [session, fetchTodos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    await addTodo(newTodo)
    setNewTodo('')
  }

  if (!session) return null

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Todo List</h1>
        <Button 
          variant="destructive" 
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <Input 
          placeholder="Add a new todo..." 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Add Todo</Button>
      </form>

      <div className="space-y-2">
        {isLoading ? (
          <div>Loading todos...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={(id, isComplete) => updateTodo(id, { is_complete: isComplete })}
              onEdit={(id, content) => updateTodo(id, { content })}
            />
          ))
        )}
      </div>
    </main>
  )
}
