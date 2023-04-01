import cn from 'classnames'
import Head from 'next/head'

import Navigation from '../components/nav'
import { fakeNotes } from '../lib/fakeData'

export default function Home() {
  return (
    <>
      <Head>
        <title>AtomicNote</title>
        <meta name="description" content="Think and note atomically" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main>
        <div className={cn('flex h-screen flex-col justify-between')}>
          <Navigation />
          <div className={cn('pt-14 h-full flex bg-gray-50')}>
            <div
              className={cn(
                'container mx-auto flex flex-col h-full w-full items-center p-6 xl:max-w-4xl'
              )}
            >
              <div className={cn('flex gap-4 flex-wrap justify-center')}>
                {fakeNotes().map(note => (
                  <div
                    key={note.id}
                    className={cn(
                      'flex flex-1 flex-col gap-2 justify-center items-center min-w-[300px] max-w-[500px] min-h-[200px] rounded-lg bg-white shadow-md'
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
      </main>
    </>
  )
}
