/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import cn from 'classnames'

import ExampleTheme from './customTheme'
import ActionsPlugin from './plugins/actionsPlugin'
import CodeHighlightPlugin from './plugins/codeHighlightPlugin'
import FixIndentOutdentListPlugin from './plugins/fixIndentOutdentList'
import ListMaxIndentLevelPlugin from './plugins/listMaxIndentLevelPlugin'
import MarkdownShortcutPlugin from './plugins/markdown/markdownShortcutPlugin'
import ToolbarPlugin from './plugins/toolbarPlugin/toolbarPlugin'
import prepopulatedText from './sampleText'

function Placeholder() {
  return (
    <div
      className={cn('absolute left-0 animate-pulse gap-2 truncate text-slate-500 top-4 xl:top-5')}
    >
      Take a note...
    </div>
  )
}

const editorConfig: any = {
  editorState: prepopulatedText,
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
}

type EditorProps = {
  saveNote: () => void
  closeModal: () => void
}

export default function Editor(props: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
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
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin />
          <CodeHighlightPlugin />
          <ListMaxIndentLevelPlugin maxDepth={3} />
          <FixIndentOutdentListPlugin />
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
              onClick={props.saveNote}
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
}
