import { Dialog, Transition } from '@headlessui/react'
import cn from 'classnames'
import parse from 'html-react-parser'
import { Fragment } from 'react'

import { Note } from '../additional'

type BlockModalProps = {
  isOpen: boolean
  closeModal: () => void
  note: Note
  className?: string
}

export default function BlockModal(props: BlockModalProps) {
  const note = props.note
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      {/* 👇 Give onClose an empty function to disable click outside to hide the dialog */}
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <Dialog as="div" className={cn('relative z-10', props.className)} onClose={() => {}}>
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
                  'w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left',
                  'align-middle shadow-xl transition-all'
                )}
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {note.title}
                </Dialog.Title>
                <div className="mt-2">{parse(note.content)}</div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={props.closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
