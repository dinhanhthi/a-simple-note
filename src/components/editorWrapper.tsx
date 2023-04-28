import cn from 'classnames'
import { EditorState } from 'lexical'
import { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaSadCry } from 'react-icons/fa'
import useSwr from 'swr'

import { Note } from '../interface'
import { fetcher } from '../lib/helpers'
import Editor from './editor/editor'
import prepopulatedText from './editor/sampleText'

type EditorWrapperProps = {
  noteId: string
  saveNote: (data: any) => void
  closeModal: () => void
}

export default function EditorWrapper(props: EditorWrapperProps) {
  const { data: note, error, isLoading } = useSwr<Note>(`/api/note/${props.noteId}`, fetcher)
  const [hasError, setHasError] = useState(false)

  if (error) setHasError(true)

  const [editorState, setEditorState] = useState<EditorState | null>(null)

  if (note) {
    // /* ###Thi */ console.log('note: ', note)
    // setEditorState(editor.parseEditorState(note.content))
    // setEditorState(JSON.parse(note.content))
    // setEditorState(note.content as any)
    // setEditorState('' as any)
  }

  return (
    <>
      {note && !isLoading && !hasError && (
        <Editor
          // editorState={prepopulatedText}
          // editorState={prepopulatedText}
          // editorState={editorState}
          noteContent={note.content}
          saveNote={props.saveNote}
          closeModal={props.closeModal}
        />
      )}

      {/* {note && !isLoading && !hasError && (
        <Editor
          editorState={prepopulatedText}
          saveNote={props.saveNote}
          closeModal={props.closeModal}
        />
      )} */}

      {isLoading && (
        <div className={cn('h-60 flex items-center justify-center')}>
          <div className={cn('flex items-center gap-2 text-slate-600 animate-pulse')}>
            <div className="animate-spin">
              <AiOutlineLoading3Quarters className="text-2xl" />
            </div>
          </div>
        </div>
      )}

      {hasError && (
        <div className={cn('h-60 flex items-center justify-center')}>
          <div className={cn('flex items-center gap-2 text-slate-600')}>
            <div>
              <FaSadCry className="text-2xl" />
            </div>
            <div className="text-2xl">Failed to load the content of this note!</div>
          </div>
        </div>
      )}
    </>
  )
}
