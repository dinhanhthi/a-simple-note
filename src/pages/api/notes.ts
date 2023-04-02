import type { NextApiRequest, NextApiResponse } from 'next'

import { Note } from '../../interface'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Note[]>) {
  try {
    const client = await clientPromise
    const db = client.db('atomicNote')

    const notes = await db
      .collection<Note>('notes')
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray()

    // res.status(200).json(notes)
    res.json(notes)
  } catch (e) {
    console.error(e)
  }
}
