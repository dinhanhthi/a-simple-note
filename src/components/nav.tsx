import cn from 'classnames'
import Link from 'next/link'

import NavIcon from './navIcon'
import NavSearch from './navSearch'

type NavigationProps = {
  className?: string
}

export default function Navigation(props: NavigationProps) {
  return (
    <div className={cn('fixed left-0 top-0 z-50 h-14 w-full bg-[#323541]', props.className)}>
      <div className={cn('container mx-auto flex h-full w-full items-center px-6 xl:max-w-4xl')}>
        <div className={cn('flex flex-1 items-center justify-center gap-4')}>
          <Link className={cn('flex items-center gap-3')} href={'/'}>
            <NavIcon />
            <div className={cn('an-text-rainbow whitespace-nowrap font-normal text-lg')}>
              AtomicNote
            </div>
          </Link>
          <NavSearch />
        </div>
      </div>
    </div>
  )
}
