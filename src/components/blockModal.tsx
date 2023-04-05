import { Dialog, Transition } from '@headlessui/react'
import cn from 'classnames'
import parse from 'html-react-parser'
import { Fragment } from 'react'

import { Note } from '../interface'

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
                  'flex flex-col gap-0 w-full max-w-md transform rounded-lg bg-white p-4 pb-3 text-left',
                  'align-middle shadow-xl transition-all text-slate-800'
                )}
              >
                <Dialog.Title as="h2" className={cn('pb-2 text-lg font-medium leading-6 border-b')}>
                  {note.title}
                </Dialog.Title>
                <div className="prose py-2">{parse(note.content)}</div>
                <div className={cn('flex items-center justify-end')}>
                  <button
                    type="button"
                    className={cn(
                      'bg-white z-10 p-1 text-sm font-semibold opacity-70 hover:opacity-100',
                      'focus:outline-none focus:ring-0 focus:ring-offset-0'
                    )}
                    onClick={props.closeModal}
                  >
                    CLOSE
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
