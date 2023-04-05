import cn from 'classnames'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Note } from '../interface'
import BlockModal from './blockModal'

type BlockProps = {
  note: Note
  className?: string
}

export default function Block(props: BlockProps) {
  const note = props.note
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    router.push('/')
    setIsOpen(false)
  }

  function openModal(noteId: string) {
    router.push(`/?note=${noteId}`)
    setIsOpen(true)
  }

  useEffect(() => {
    if (router.query.note === note._id) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [note._id, router.query.note])

  return (
    <>
      <div
        onClick={() => openModal(note._id)}
        className={cn(
          'an-block p-[1px] flex-1 cursor-pointer min-w-[400px] max-w-[500px] min-h-[200px]',
          'an-shadow-soft-xl overflow-hidden an-bg-clip-border hover:rounded-none rounded-xl',
          'transition-all duration-200'
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-2 justify-start p-3 text-slate-700 bg-white rounded-xl h-full overflow-hidden'
          )}
        >
          <div className={cn('font-semibold h-fit text-base px-1 pb-2 border-b')}>{note.title}</div>
          <div className={cn('flex-1 p-1 rounded-xl text-[0.9rem] prose')}>
            {parse(note.content)}
          </div>
        </div>
      </div>
      <BlockModal note={note} isOpen={isOpen} closeModal={closeModal} />
    </>
  )
}
