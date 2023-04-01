import cn from 'classnames'
import Head from 'next/head'

import Blocks from '../components/blocks'
import Navigation from '../components/nav'

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
          <Blocks />
        </div>
      </main>
    </>
  )
}
