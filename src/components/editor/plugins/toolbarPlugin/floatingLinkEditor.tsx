import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isAtNodeEnd } from '@lexical/selection'
import { mergeRegister } from '@lexical/utils'
import cn from 'classnames'
import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'

import { LowPriority } from '../../editor'

export function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
  const editorRef = useRef(null)
  const inputRef = useRef(null)
  const mouseDownRef = useRef(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isEditMode, setEditMode] = useState(false)
  const [lastSelection, setLastSelection] = useState(null)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
    }
    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection?.anchorNode as any)
    ) {
      const domRange = nativeSelection?.getRangeAt(0)
      let rect
      if (nativeSelection?.anchorNode === rootElement) {
        let inner = rootElement
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as any
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange?.getBoundingClientRect()
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect)
      }
      setLastSelection(selection as any)
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, undefined)
      setLastSelection(null)
      setEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        LowPriority
      )
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      ;(inputRef.current as any).focus()
    }
  }, [isEditMode])

  return (
    // <div ref={editorRef} className="link-editor">
    <div
      ref={editorRef}
      className={cn(
        'absolute z-[100] an-shadow bg-white max-w-[400px] truncate py-2 pl-3 pr-2 rounded-md'
      )}
    >
      {isEditMode ? (
        <div className="flex items-center justify-center gap-2">
          <input
            ref={inputRef}
            className={cn(
              // need to keep "link-input"
              'link-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              'focus-visible:ring-opacity-50 bg-slate-100 focus-visible:rounded-sm',
              'focus-visible:px-1 focus-visible:py-0.5'
            )}
            value={linkUrl}
            onChange={event => {
              setLinkUrl(event.target.value)
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                if (lastSelection !== null) {
                  if (linkUrl !== '') {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
                  }
                  setEditMode(false)
                }
              } else if (event.key === 'Escape') {
                event.preventDefault()
                setEditMode(false)
              }
            }}
          />
          <div
            className="an-edt-toolbar-item bg-slate-100"
            role="button"
            tabIndex={0}
            onMouseDown={event => event.preventDefault()}
            onClick={() => {
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
                }
                setEditMode(false)
              }
            }}
          >
            <BsCheckLg />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-4">
            <a
              className="an-link block whitespace-nowrap"
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkUrl}
            </a>
            <div
              className="an-edt-toolbar-item bg-slate-100"
              role="button"
              tabIndex={0}
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                setEditMode(true)
              }}
            >
              <FiEdit3 />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

function positionEditorElement(editor: HTMLDivElement, rect?: DOMRect) {
  if (!rect) {
    editor.style.opacity = '0'
    editor.style.top = '-1000px'
    editor.style.left = '-1000px'
  } else {
    editor.style.opacity = '1'
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`
  }
}
