import { Todo } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type TodoItemProps = {
  todo: Todo
  onDelete: (id: string) => void
  onToggle: (id: string, isComplete: boolean) => void
  onEdit: (id: string, content: string) => void
}

export function TodoItem({ todo, onDelete, onToggle, onEdit }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 p-4 border rounded-lg">
      <Checkbox 
        checked={todo.is_complete}
        onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
      />
      <p className={`flex-1 ${todo.is_complete ? 'line-through text-gray-500' : ''}`}>
        {todo.content}
      </p>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </Button>
    </div>
  )
} 