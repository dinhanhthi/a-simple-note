import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'

import { createNewNote } from '../lib/request'
import BlockModal from './blockModal'

type NewNoteButtonProps = {
  className?: string
  hide?: boolean
  disabled?: boolean
}

export default function NewNoteButton(props: NewNoteButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noteId, setNoteId] = useState<string | undefined>(undefined)

  return (
    <>
      {!props.hide && (
        <button
          disabled={props.disabled}
          onClick={createNote}
          className={cn(
            props.className,
            'bg-white rounded-full p-2 shadow-md hover:shadow-xl cursor-pointer'
          )}
        >
          <BsPlusLg className="h-6 w-6 text-slate-700" />
        </button>
      )}
      {noteId && (
        <BlockModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          noteId={noteId}
          noteTitle="New Note"
          isNew={true}
        />
      )}
    </>
  )

  async function createNote() {
    const noteId = await createNewNote()
    openModal(noteId)
  }

  function closeModal() {
    router.push('/')
    setIsModalOpen(false)
  }

  function openModal(noteId: string) {
    if (!noteId) return
    router.push(`/?note=${noteId}`)
    setIsModalOpen(true)
    setNoteId(noteId)
  }
}
