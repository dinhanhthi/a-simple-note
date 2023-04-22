import { $isCodeNode, getCodeLanguages, getDefaultCodeLanguage } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isAtNodeEnd } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import Tippy from '@tippyjs/react'
import cn from 'classnames'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  RangeSelection,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BiStrikethrough } from 'react-icons/bi'
import { BsChevronDown, BsCode, BsTextIndentLeft, BsTextIndentRight } from 'react-icons/bs'
import { GoLink } from 'react-icons/go'
import { RxFontBold, RxFontItalic, RxUnderline } from 'react-icons/rx'

import BlockFormatDropDown from './blockFormatDropdown'
import { FloatingLinkEditor } from './floatingLinkEditor'
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
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph')
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
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
          const type = parentList ? parentList.getListType() : element.getListType()
          // Because ListType contains "bullet" and "number", not "ul" and "ol"
          const convertedType = type === 'bullet' ? 'ul' : type === 'number' ? 'ol' : type
          setBlockType(convertedType as keyof typeof blockTypeToBlockName)
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
          setBlockType(type as keyof typeof blockTypeToBlockName)
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
          <Tippy content="Bold (⌘B)" arrow={false} placement="bottom">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
              }}
              className={cn('an-edt-toolbar-item', { active: isBold })}
              aria-label="Format Bold"
            >
              <RxFontBold />
            </button>
          </Tippy>
          <Tippy content="Italic (⌘I)" arrow={false} placement="bottom">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
              }}
              className={cn('an-edt-toolbar-item', { active: isItalic })}
              aria-label="Format Italics"
            >
              <RxFontItalic />
            </button>
          </Tippy>
          <Tippy content="Underline (⌘U)" arrow={false} placement="bottom">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
              }}
              className={cn('an-edt-toolbar-item', { active: isUnderline })}
              aria-label="Format Underline"
            >
              <RxUnderline />
            </button>
          </Tippy>
          <Tippy content="Strikethrough" arrow={false} placement="bottom">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
              }}
              className={cn('an-edt-toolbar-item', { active: isStrikethrough })}
              aria-label="Format Strikethrough"
            >
              <BiStrikethrough />
            </button>
          </Tippy>
          <Tippy content="Insert code block" arrow={false} placement="bottom">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
              }}
              className={cn('an-edt-toolbar-item', { active: isCode })}
              aria-label="Code"
            >
              <BsCode />
            </button>
          </Tippy>
          <Tippy content="Insert Link" arrow={false} placement="bottom">
            <button
              onClick={insertLink}
              className={cn('an-edt-toolbar-item', { active: isLink })}
              aria-label="Insert Link"
            >
              <GoLink />
            </button>
          </Tippy>
          <Tippy content="Indent" arrow={false} placement="bottom">
            <button
              onClick={indentList}
              className={cn('an-edt-toolbar-item')}
              aria-label="Indent List"
            >
              <BsTextIndentLeft />
            </button>
          </Tippy>
          <Tippy content="Outdent" arrow={false} placement="bottom">
            <button
              onClick={outdentList}
              className={cn('an-edt-toolbar-item')}
              aria-label="Outden List"
            >
              <BsTextIndentRight />
            </button>
          </Tippy>
          {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
        </>
      )}
    </div>
  )
}
