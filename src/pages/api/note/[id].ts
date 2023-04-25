import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

import { Note } from '../../../interface'
import clientPromise from '../../../lib/mongodb'

export default async function noteHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('atomicNote')

    switch (req.method) {
      case 'GET': {
        if (!req.query.id) res.status(200).json(null)
        const note = await db
          .collection<Note>('notes')
          .findOne({ _id: new ObjectId(req.query.id as string) as any })
        res.status(200).json(note)
        break
      }
    }
  } catch (e: any) {
    console.error(`Error when GET /api/notes: ${e}`)
    res.status(500).send({
      message: e.message,
      status: 500
    })
  }
}
