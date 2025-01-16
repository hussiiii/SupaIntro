import { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create authenticated Supabase client
  const supabase = createPagesServerClient({ req, res })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({ error: 'Unauthorized' })

  switch (req.method) {
    case 'GET':
      // Get todos
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) return res.status(500).json({ error: fetchError.message })
      return res.status(200).json(data)

    case 'POST':
      // Create todo
      const { content } = req.body
      const { data: newTodo, error: createError } = await supabase
        .from('todos')
        .insert([{ content, user_id: session.user.id }])
        .select()
        .single()

      if (createError) return res.status(500).json({ error: createError.message })
      return res.status(201).json(newTodo)

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 