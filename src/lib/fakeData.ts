import { Note } from '../additional'

export const fakeNotes = (): Note[] => {
  const notes: Note[] = []
  for (let i = 0; i < 10; i++) {
    notes.push({
      id: `${i}`,
      title: `Note ${i}`,
      content: `Content ${i}`,
      createdAt: randomDate(),
      updatedAt: randomDate()
    })
  }
  return notes
}

const randomDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date
}
