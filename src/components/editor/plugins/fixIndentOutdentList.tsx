import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  COMMAND_PRIORITY_NORMAL,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND
} from 'lexical'
import { useEffect } from 'react'

export default function FixIndentOutdentListPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      payload => {
        const event: KeyboardEvent = payload
        event.preventDefault()
        return editor.dispatchCommand(
          event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND,
          undefined
        )
      },
      COMMAND_PRIORITY_NORMAL
    )
  }, [editor])

  return null
}
