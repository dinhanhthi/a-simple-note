/* eslint-disable @typescript-eslint/no-explicit-any */
import { $isCodeNode, getCodeLanguages, getDefaultCodeLanguage } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isAtNodeEnd } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import cn from 'classnames'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
  RangeSelection,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BiStrikethrough } from 'react-icons/bi'
import {
  BsCheckLg,
  BsChevronDown,
  BsCode,
  BsTextIndentLeft,
  BsTextIndentRight
} from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'
import { GoLink } from 'react-icons/go'
import { RxFontBold, RxFontItalic, RxUnderline } from 'react-icons/rx'

import BlockFormatDropDown from './blockFormatDropdown'
import { blockTypeToBlockName, getBlockTypeIcon } from './toolbarHelpers'

const LowPriority = 1

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'h3',
  'ul',
  'ol',
  'check'
])

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

function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
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

function Select({ onChange, className, options, value }: any) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option: any) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
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

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [blockType, setBlockType] = useState('paragraph')
  const [selectedElementKey, setSelectedElementKey] = useState<any>(null)
  const [showFormatDropdown, setShowFormatDropDown] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState('')
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList ? parentList.getTag() : element.getTag()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
          setBlockType(type)
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage())
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar()
          return false
        },
        LowPriority
      )
    )
  }, [editor, updateToolbar])

  const codeLanguges = useMemo(() => getCodeLanguages(), [])
  const onCodeLanguageSelect = useCallback(
    (e: any) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey)
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value)
          }
        }
      })
    },
    [editor, selectedElementKey]
  )

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const indentList = useCallback(() => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
  }, [editor])

  const outdentList = useCallback(() => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
  }, [editor])

  return (
    <div className="flex flex-row items-center gap-1 py-1" ref={toolbarRef}>
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className={cn(
              'an-edt-toolbar-item justify-between gap-3 bg-none !py-1 !rounded-md min-w-[170px]'
            )}
            onClick={() => setShowFormatDropDown(!showFormatDropdown)}
            aria-label="Formatting Options"
          >
            {getBlockTypeIcon(blockType)}
            <span className="text-sm">{(blockTypeToBlockName as any)[blockType]}</span>
            <BsChevronDown />
          </button>
          {showFormatDropdown &&
            createPortal(
              <BlockFormatDropDown
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowFormatDropDown={setShowFormatDropDown}
              />,
              document.body
            )}
        </>
      )}
      {blockType === 'code' ? (
        <>
          <Select
            className="toolbar-item code-language mr-1"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          <BsChevronDown className="chevron-down inside" />
        </>
      ) : (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
            }}
            className={cn('an-edt-toolbar-item', { active: isBold })}
            aria-label="Format Bold"
          >
            <RxFontBold />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
            }}
            className={cn('an-edt-toolbar-item', { active: isItalic })}
            aria-label="Format Italics"
          >
            <RxFontItalic />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
            }}
            className={cn('an-edt-toolbar-item', { active: isUnderline })}
            aria-label="Format Underline"
          >
            <RxUnderline />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
            }}
            className={cn('an-edt-toolbar-item', { active: isStrikethrough })}
            aria-label="Format Strikethrough"
          >
            <BiStrikethrough />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
            }}
            className={cn('an-edt-toolbar-item', { active: isCode })}
            aria-label="Insert Code"
          >
            <BsCode />
          </button>
          <button
            onClick={insertLink}
            className={cn('an-edt-toolbar-item', { active: isLink })}
            aria-label="Insert Link"
          >
            <GoLink />
          </button>
          <button
            onClick={indentList}
            className={cn('an-edt-toolbar-item')}
            aria-label="Indent List"
          >
            <BsTextIndentLeft />
          </button>
          <button
            onClick={outdentList}
            className={cn('an-edt-toolbar-item')}
            aria-label="Outden List"
          >
            <BsTextIndentRight />
          </button>
          {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
        </>
      )}
    </div>
  )
}
