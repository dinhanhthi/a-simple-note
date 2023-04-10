import { $createCodeNode, $isCodeNode } from '@lexical/code'
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createTextNode, $getRoot } from 'lexical'
import * as React from 'react'
import { useCallback } from 'react'
import { BsMarkdown } from 'react-icons/bs'

import { PLAYGROUND_TRANSFORMERS } from './markdownTransformer'

export default function ActionsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot()
      const firstChild = root.getFirstChild()
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(firstChild.getTextContent(), PLAYGROUND_TRANSFORMERS)
      } else {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS)
        root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)))
      }
      root.selectEnd()
    })
  }, [editor])

  return (
    <button
      className="flex items-center justify-center opacity-70 hover:opacity-100"
      onClick={handleMarkdownToggle}
      title="Convert From Markdown"
      aria-label="Convert from markdown"
    >
      <BsMarkdown className="h-6 text-xl" />
    </button>
  )
}
