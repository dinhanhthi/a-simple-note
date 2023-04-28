import { Dialog, Transition } from '@headlessui/react'
import cn from 'classnames'
import { Fragment, useRef } from 'react'

import { Note } from '../interface'
import Editor from './editor/editor'
import EditorWrapper from './editorWrapper'

type BlockModalProps = {
  isOpen: boolean
  closeModal: () => void
  // note: Note
  noteId?: string
  noteTitle?: string
  className?: string
}

export default function BlockModal(props: BlockModalProps) {
  const title = props.noteTitle || 'Untitled'
  const titleRef = useRef<HTMLInputElement>(null)

  const onKeyDown = (e: any) =>
    e.ctrlKey ||
    (e.metaKey && !['c', 'v', 'ArrowLeft', 'ArrowRight'].includes(e.key) && e.preventDefault())

  return (
    <Transition appear={true} show={props.isOpen} as={Fragment}>
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
                  'flex flex-col gap-0 w-full transform rounded-lg',
                  'md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[50vw] max-h-[80vh]',
                  'bg-white p-5 pb-3 text-left',
                  'align-middle shadow-xl transition-all text-slate-800'
                )}
              >
                <div className="border-b pb-2">
                  <Dialog.Title
                    ref={titleRef}
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

                {props.noteId && (
                  <EditorWrapper
                    noteId={props.noteId}
                    saveNote={saveNote}
                    closeModal={props.closeModal}
                  />
                )}

                {!props.noteId && (
                  <Editor editorState={null} saveNote={saveNote} closeModal={props.closeModal} />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )

  async function saveNote(data: any) {
    // /* ###Thi */ console.log('saveNote with data: ', data)
    const note: Note = {
      title: titleRef.current?.innerText || 'Untitled',
      content: data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await fetch('/api/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    })
    props.closeModal()
  }
}
