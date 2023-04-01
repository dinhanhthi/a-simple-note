import cn from 'classnames'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function NavSearch() {
  const router = useRouter()
  const [valueSearch, setValueSearch] = useState('')
  const searchInput = useRef(null)
  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        router.push(`/search/?s=${encodeURI(valueSearch)}`)
      }}
      className={cn(
        'flex h-10 w-full items-center overflow-hidden rounded-lg bg-[#282a36]',
        'focus-within:shadow-inner'
      )}
    >
      <button
        type="submit"
        className="
        group grid h-full w-12 place-items-center
        text-slate-500 dark:text-gray-500
      "
      >
        <FiSearch className="h-5 w-5 group-hover:text-primary" />
      </button>
      <input
        className={cn(
          'peer h-full w-full text-ellipsis bg-transparent pr-2 text-white outline-none',
          'dark:text-gray-300'
        )}
        id="search"
        type="search"
        placeholder="find notes..."
        autoComplete="off"
        value={valueSearch}
        ref={searchInput}
        onChange={e => setValueSearch(e.target.value)}
      />
    </form>
  )
}
