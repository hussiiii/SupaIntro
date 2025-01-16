import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TodoItem } from '@/components/TodoItem'
import type { Todo } from '@/types/todo'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/login')
    } else {
      fetchTodos()
    }
  }, [session])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const { error } = await supabase
        .from('todos')
        .insert([
          { content: newTodo, user_id: session?.user.id }
        ])

      if (error) throw error
      setNewTodo('')
      fetchTodos()
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const toggleTodo = async (id: string, isComplete: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: isComplete })
        .eq('id', id)

      if (error) throw error
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
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

      <form onSubmit={addTodo} className="flex gap-2 mb-8">
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
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              onEdit={() => {}} // We'll implement this later
            />
          ))
        )}
      </div>
    </main>
  )
}
