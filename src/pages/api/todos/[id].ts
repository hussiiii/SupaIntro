import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res })
  const { id } = req.query

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' })

  switch (req.method) {
    case 'PUT':
      // Update todo
      const { content, is_complete } = req.body
      const { data: updatedTodo, error: updateError } = await supabase
        .from('todos')
        .update({ content, is_complete })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single()

      if (updateError) return res.status(500).json({ error: updateError.message })
      return res.status(200).json(updatedTodo)

    case 'DELETE':
      // Delete todo
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (deleteError) return res.status(500).json({ error: deleteError.message })
      return res.status(204).end()

    default:
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 