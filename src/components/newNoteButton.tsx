import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'

import BlockModal from './blockModal'

type NewNoteButtonProps = {
  className?: string
  hide?: boolean
  disabled?: boolean
}

export default function NewNoteButton(props: NewNoteButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const note = {
    title: 'New Note',
    content: 'test',
    createdAt: new Date(),
    updatedAt: new Date()
  }
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
      <BlockModal note={note} isOpen={isModalOpen} closeModal={closeModal} />
    </>
  )

  function createNote() {
    openModal()
  }

  function closeModal() {
    router.push('/')
    setIsModalOpen(false)
  }

  function openModal() {
    router.push('/?newNote')
    setIsModalOpen(true)
  }
}
