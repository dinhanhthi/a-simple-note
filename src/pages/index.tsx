import cn from 'classnames'
import Head from 'next/head'
import { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaSadCry } from 'react-icons/fa'
import useSwr from 'swr'

import Blocks from '../components/blocks'
import Navigation from '../components/nav'
import NewNoteButton from '../components/newNoteButton'
import { Note } from '../interface'
import { fetcher } from '../lib/helpers'

// import clientPromise from '../lib/mongodb'

type HomeProps = {
  isMongoConnected: boolean
  notes: Note[]
}

export default function Home(props: HomeProps) {
  const { data: notes, error, isLoading } = useSwr<Note[]>('/api/notes?num=10', fetcher)
  const [hasError, setHasError] = useState(false)

  if (error) return setHasError(true)

  return (
    <>
      <Head>
        <title>AtomicNote</title>
        <meta name="description" content="Think and note atomically" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main>
        <div className={cn('relative flex h-screen flex-col justify-between')}>
          <Navigation />
          {notes && <Blocks notes={notes} />}
          {isLoading && (
            <div className={cn('h-full flex flex-col items-center justify-center')}>
              <div className={cn('flex items-center gap-2 text-slate-600 animate-pulse')}>
                <div className="animate-spin">
                  <AiOutlineLoading3Quarters className="text-2xl" />
                </div>
                <div className={cn('text-2xl font-semibold')}>Loading notes...</div>
              </div>
            </div>
          )}
          {hasError && (
            <div className={cn('h-full flex flex-col items-center justify-center')}>
              <div className={cn('flex items-center gap-2 text-slate-600')}>
                <div>
                  <FaSadCry className="text-2xl" />
                </div>
                <div className="text-2xl">Failed to load notes!</div>
              </div>
            </div>
          )}
          <NewNoteButton disabled={isLoading || hasError} className="absolute bottom-4 left-4" />
        </div>
      </main>
    </>
  )
}
