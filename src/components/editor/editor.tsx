import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import cn from 'classnames'
import React, { useCallback, useEffect, useRef } from 'react'

import { Note } from '../../interface'
import ExampleTheme from './customTheme'
import ActionsPlugin from './plugins/actionsPlugin'
import CodeHighlightPlugin from './plugins/codeHighlightPlugin'
import FixIndentOutdentListPlugin from './plugins/fixIndentOutdentList'
import ListMaxIndentLevelPlugin from './plugins/listMaxIndentLevelPlugin'
import MarkdownShortcutPlugin from './plugins/markdown/markdownShortcutPlugin'
import { AN_MD_TRANSFORMERS } from './plugins/markdown/markdownTransformers'
import ToolbarPlugin from './plugins/toolbarPlugin/toolbarPlugin'

export const LowPriority = 1

function Placeholder() {
  return (
    <div
      className={cn('absolute left-0 animate-pulse gap-2 truncate text-slate-500 top-4 xl:top-5')}
    >
      Take a note...
    </div>
  )
}

const editorConfig: any = (editorState: any) => ({
  // editorState: prepopulatedText,
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ]
})

type EditorProps = {
  note?: Note
  noteContent?: string
  // editorState?: any
  saveNote: (data: any) => void
  closeModal: () => void
}

const EditorCapturePlugin = React.forwardRef(function EditorCapturePlugin(props: any, ref: any) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    ref.current = editor
    return () => {
      ref.current = null
    }
  }, [editor, ref])

  return null
})

export default function Editor(props: EditorProps) {
  const editorRef: any = useRef()
  // let contentInMarkdown
  // let editorState = null

  const [markdown, setMarkdown] = React.useState('')

  useEffect(() => {
    // if (props.noteContent) {
    //   /* ###Thi */ console.log('content changes')
    //   const editorState = editorRef.current?.parseEditorState(props.noteContent)
    //   editorRef.current?.setEditorState(editorState)
    // }

    // if (props.note?.content) {
    //   /* ###Thi */ console.log('content changes')
    //   // const editorState = editorRef.current?.parseEditorState(props.note.content)
    //   const editorState = () => $convertFromMarkdownString(props.note.content, AN_MD_TRANSFORMERS)
    //   editorRef.current?.setEditorState(editorState)
    // }

    editorRef.current?.update(() => {
      const contentInMarkdown = $convertToMarkdownString(AN_MD_TRANSFORMERS)
      setMarkdown(contentInMarkdown)

      $convertFromMarkdownString(props.note?.content ?? '', AN_MD_TRANSFORMERS)
    })
  }, [props.note])

  return (
    <LexicalComposer initialConfig={editorConfig()}>
      <div className="flex h-full flex-col divide-y overflow-auto">
        <ToolbarPlugin />
        <div className="an-scrollbar relative h-full flex-1 overflow-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'an-prose relative min-h-[200px] h-full overflow-auto py-4 leading-normal',
                  'outline-none'
                )}
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin />
          <CodeHighlightPlugin />
          <ListMaxIndentLevelPlugin maxDepth={3} />
          <FixIndentOutdentListPlugin />
          <EditorCapturePlugin ref={editorRef} />
        </div>
        <div className={cn('flex items-center justify-between pt-2.5')}>
          <ActionsPlugin />
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className={cn(
                'bg-white z-10 p-1 text-sm font-semibold opacity-70 hover:opacity-100',
                'focus:outline-none focus:ring-0 focus:ring-offset-0'
              )}
              onClick={saveNote}
            >
              SAVE
            </button>
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
        </div>
      </div>
    </LexicalComposer>
  )

  function saveNote() {
    // const data = JSON.stringify(editorRef.current.getEditorState())
    const data = markdown
    props.saveNote(data)
  }
}
