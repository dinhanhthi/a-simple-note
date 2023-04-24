import type { NextApiRequest, NextApiResponse } from 'next'

import { Note } from '../../interface'
import clientPromise from '../../lib/mongodb'

export default async function notesHandler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('atomicNote')

    const notes = await db
      .collection<Note>('notes')
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray()

    res.status(200).json(notes)
  } catch (e: any) {
    console.error(`Error when GET /api/notes: ${e}`)
    res.status(500).send({
      message: e.message,
      status: 500
    })
  }
}
