import cn from 'classnames'
import Head from 'next/head'

import Blocks from '../components/blocks'
import Navigation from '../components/nav'
import { Note } from '../interface'
import clientPromise from '../lib/mongodb'

type HomeProps = {
  isMongoConnected: boolean
  notes: Note[]
}

export default function Home(props: HomeProps) {
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
          <Blocks notes={props.notes} />
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise
    const db = client.db('atomicNote')
    const notes = await db
      .collection<Note>('notes')
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray()

    return {
      props: { isMongoConnected: true, notes: JSON.parse(JSON.stringify(notes)) }
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isMongoConnected: false }
    }
  }
}
