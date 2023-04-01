import cn from 'classnames'

import { fakeNotes } from '../lib/fakeData'
import Block from './block'

type BlocksProps = {
  className?: string
}

export default function Blocks(props: BlocksProps) {
  return (
    <div className={cn('pt-14 h-full flex bg-gray-50', props.className)}>
      <div className={cn('h-full w-full overflow-auto an-scrollbar')}>
        <div className={cn('container mx-auto flex flex-col w-full items-center p-6 xl:max-w-4xl')}>
          <div className={cn('flex gap-4 flex-wrap justify-center')}>
            {fakeNotes().map(note => (
              <Block key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
