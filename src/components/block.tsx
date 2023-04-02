import cn from 'classnames'
import parse from 'html-react-parser'
import { useState } from 'react'

import { Note } from '../additional'

type BlockProps = {
  note: Note
  className?: string
}

export default function Block(props: BlockProps) {
  const note = props.note

  const [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <div
      onClick={openModal}
      className={cn(
        'an-block p-[1px] flex-1 cursor-pointer min-w-[400px] max-w-[500px] min-h-[200px]',
        'an-shadow-soft-xl overflow-hidden an-bg-clip-border hover:rounded-none rounded-xl',
        'transition-all duration-100'
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-2 justify-start p-3 text-slate-700 bg-white rounded-xl h-full overflow-hidden'
        )}
      >
        <div
          className={cn(
            // 'font-semibold h-fit text-base px-1 pb-2 border-b group-hover:text-primary-dark'
            'font-semibold h-fit text-base px-1 pb-2 border-b'
          )}
        >
          {note.title}
        </div>
        <div className={cn('flex-1 p-1 rounded-xl text-[0.9rem] prose')}>{parse(note.content)}</div>
      </div>
    </div>
  )
}
