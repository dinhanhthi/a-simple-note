import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

import { Note } from '../../../interface'
import clientPromise from '../../../lib/mongodb'

export default async function noteHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('atomicNote')

    switch (req.method) {
      /**
       * GET /api/note/[id]
       */
      case 'GET': {
        if (!req.query.id) res.status(200).json(null) // new note
        const noteId = req.query.id![0] as string
        const note = await db
          .collection<Note>('notes')
          .findOne({ _id: new ObjectId(noteId) as any })
        res.status(200).json(note)
        break
      }

      /**
       * POSt /api/note
       */
      case 'POST': {
        const note = req.body as Note
        if (!note) {
          res.status(400).send({
            message: 'Note is required.',
            status: 400
          })
          return
        }
        if (!note.title) note.title = 'Untitled'
        if (!note.updatedAt) note.updatedAt = new Date()
        if (!note.createdAt) note.createdAt = new Date()
        const result = await db.collection<Note>('notes').insertOne(note)
        res.status(200).json(result.insertedId.toString())
        break
      }

      /**
       * PATCH /api/note
       */
      case 'PATCH': {
        if (!req.query.id) {
          res.status(400).send({
            message: 'Note ID is required.',
            status: 400
          })
          return
        }
        const note = req.body as Note
        if (!note) {
          res.status(400).send({
            message: 'Note is required.',
            status: 400
          })
          return
        }
        const noteId = req.query.id![0] as string
        const result = await db
          .collection<Note>('notes')
          .updateOne({ _id: new ObjectId(noteId) as any }, { $set: note })
        res.status(200).json(result.modifiedCount)
        break
      }
    }
  } catch (e: any) {
    console.error(`Error when GET /api/note/[id]: ${e}`)
    res.status(500).send({
      message: e.message,
      status: 500
    })
  }
}
