import { Note } from '../additional'

export const fakeNotes = (): Note[] => {
  const notes: Note[] = []
  for (let i = 0; i < 10; i++) {
    notes.push({
      id: `${i}`,
      title: `This is the title of Note ${i}`,
      content: `<p>Content ${i} with <b>some texts</b> and <cde>some code</code></p>`,
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
