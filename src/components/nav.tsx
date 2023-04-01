import cn from 'classnames'

import NavIcon from './navIcon'
import NavSearch from './navSearch'

export default function Navigation() {
  return (
    <div className={'fixed left-0 top-0 z-50 h-14 w-full bg-[#323541]'}>
      <div className="container mx-auto flex h-full items-center">
        <div className={cn('flex flex-1 items-center justify-center gap-4')}>
          <NavIcon />
          <NavSearch />
        </div>
      </div>
    </div>
  )
}
