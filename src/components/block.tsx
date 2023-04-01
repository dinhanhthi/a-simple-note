import cn from 'classnames'

import { Note } from '../additional'

type BlockProps = {
  note: Note
  className?: string
}

export default function Block(props: BlockProps) {
  return (
    <div
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
  )
}
