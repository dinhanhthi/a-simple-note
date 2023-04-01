import cn from 'classnames'
import parse from 'html-react-parser'

import { Note } from '../additional'

type BlockProps = {
  note: Note
  className?: string
}

export default function Block(props: BlockProps) {
  const note = props.note
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-2 justify-start p-3 text-slate-700',
        'min-w-[400px] max-w-[500px] min-h-[200px]',
        'bg-white an-shadow-soft-xl rounded-2xl an-bg-clip-border'
      )}
    >
      <div className={cn('font-semibold h-fit text-lg')}>{note.title}</div>
      <div className={cn('bg-slate-50 flex-1 p-3 rounded-2xl')}>{parse(note.content)}</div>
    </div>
  )
}
