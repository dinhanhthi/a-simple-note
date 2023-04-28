import cn from 'classnames'

import { Note } from '../interface'
import Block from './block'

type BlocksProps = {
  notes: Note[]
  className?: string
}

export default function Blocks(props: BlocksProps) {
  return (
    <div className={cn('pt-14 h-full flex bg-gray-50', props.className)}>
      <div className={cn('h-full w-full overflow-auto an-scrollbar')}>
        <div
          className={cn(
            'container mx-auto flex flex-col w-full items-center p-6',
            'max-w-full 2xl:max-w-7xl'
          )}
        >
          <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-4 w-full')}>
            {props.notes.map(note => (
              <Block key={note._id} note={note} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
