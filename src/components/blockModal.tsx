import { Dialog, Transition } from '@headlessui/react'
import cn from 'classnames'
import { Fragment } from 'react'
import useSwr from 'swr'

import { Note } from '../interface'
import { fetcher } from '../lib/helpers'
import Editor from './editor/editor'

type BlockModalProps = {
  isOpen: boolean
  closeModal: () => void
  // note: Note
  noteId?: string
  className?: string
}

export default function BlockModal(props: BlockModalProps) {
  const { data: note, error, isLoading } = useSwr<Note>(`/api/note/${props.noteId}`, fetcher)
  const title = !props.noteId || !note || !Object.keys(note).length ? 'New Note' : note.title
  const onKeyDown = (e: any) =>
    e.ctrlKey ||
    (e.metaKey && !['c', 'v', 'ArrowLeft', 'ArrowRight'].includes(e.key) && e.preventDefault())
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      {/* 👇 Give onClose an empty function to disable click outside to hide the dialog */}
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <Dialog as="div" className={cn('relative z-10', props.className)} onClose={props.closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity/25 fixed inset-0 bg-black opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'flex flex-col gap-0 w-full lg:max-w-[80vw] max-h-[80vh] transform rounded-lg',
                  'bg-white p-5 pb-3 text-left',
                  'align-middle shadow-xl transition-all text-slate-800'
                )}
              >
                <div className="border-b pb-2">
                  <Dialog.Title
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={onKeyDown}
                    role="textbox"
                    as="h2"
                    className={cn(
                      'text-xl font-medium leading-6 focus-within:ring-0',
                      'focus-within:outline-none'
                    )}
                  >
                    {title}
                  </Dialog.Title>
                </div>
                {/* <div className="prose py-2">{parse(note.content)}</div> */}
                <Editor saveNote={saveNote} closeModal={props.closeModal} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )

  function saveNote() {
    /* ###Thi */ console.log('saveNote')
    props.closeModal()
  }
}
