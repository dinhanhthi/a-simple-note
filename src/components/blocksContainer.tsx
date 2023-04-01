import cn from 'classnames'

import { fakeNotes } from '../lib/fakeData'

type BlocksContainerProps = {
  className?: string
}

export default function BlocksContainer(props: BlocksContainerProps) {
  return (
    <div className={cn('pt-14 h-full flex bg-gray-50', props.className)}>
      <div className={cn('h-full w-full overflow-auto an-scrollbar')}>
        <div className={cn('container mx-auto flex flex-col w-full items-center p-6 xl:max-w-4xl')}>
          <div className={cn('flex gap-4 flex-wrap justify-center')}>
            {fakeNotes().map(note => (
              <div
                key={note.id}
                className={cn(
                  'flex flex-1 flex-col gap-2 justify-center items-center',
                  'min-w-[300px] max-w-[500px] min-h-[200px]',
                  'bg-white an-shadow-soft-xl rounded-2xl an-bg-clip-border'
                )}
              >
                <div className={cn('flex flex-col gap-2 justify-center items-center')}>
                  <div className={cn('flex gap-2 justify-center items-center')}>
                    <div className={cn('w-4 h-4 rounded-full bg-gray-300')} />
                    <div className={cn('w-4 h-4 rounded-full bg-gray-300')} />
                    <div className={cn('w-4 h-4 rounded-full bg-gray-300')} />
                  </div>
                  <div className={cn('w-12 h-12 rounded-full bg-gray-300')} />
                </div>
                <div className={cn('flex flex-col gap-2 justify-center items-center')}>
                  <div className={cn('w-24 h-4 rounded-full bg-gray-300')} />
                  <div className={cn('w-24 h-4 rounded-full bg-gray-300')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
