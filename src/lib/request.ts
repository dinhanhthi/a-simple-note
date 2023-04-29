import { Note } from '../interface'

export async function updateNoteTitle(title: string): Promise<void> {
  const res = await fetch('/api/note', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  })
  if (!res.ok) {
    throw new Error('Something went wrong when updating title')
  }
}

export async function updateNoteContent(noteId: string, content: string): Promise<void> {
  const res = await fetch(`/api/note/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, updatedAt: new Date() })
  })
  if (!res.ok) {
    throw new Error('Something went wrong when updating content')
  }
}

export async function updateNote(noteId: string, note: Note): Promise<void> {
  const res = await fetch(`/api/note/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...note, updatedAt: new Date() })
  })
  if (!res.ok) {
    throw new Error('Something went wrong when updating content')
  }
}

export async function createNewNote(): Promise<string> {
  const res = await fetch('/api/note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ updatedAt: new Date(), createdAt: new Date() })
  })
  if (!res.ok) {
    throw new Error('Something went wrong when creating a new note')
  }
  const noteId = await res.json()
  return noteId
}
