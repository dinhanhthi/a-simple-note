import type { NextApiRequest, NextApiResponse } from 'next'

import clientPromise from '../../lib/mongodb'

/**
 * Get a list of notes
 * GET /api/notes?num=2
 */
export default async function notesHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('atomicNote')
    const numNotes = req.query?.num ? +req.query?.num : 20

    const pipeline = [
      {
        $sort: {
          updatedAt: -1
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: {
            $substr: ['$content', 0, 50]
          },
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $limit: numNotes
      }
    ]

    const notes = await db.collection('notes').aggregate(pipeline).toArray()
    res.status(200).json(notes)
  } catch (e: any) {
    console.error(`Error when GET /api/notes: ${e}`)
    res.status(500).send({
      message: e.message,
      status: 500
    })
  }
}
