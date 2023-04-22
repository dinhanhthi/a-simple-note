import { $createCodeNode } from '@lexical/code'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $wrapNodes } from '@lexical/selection'
import cn from 'classnames'
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useRef } from 'react'

import { formatTextTypes } from './toolbarHelpers'

export default function BlockFormatDropDown({
  editor,
  blockType,
  toolbarRef,
  setShowFormatDropDown
}: any) {
  const dropDownRef = useRef<any>(null)

  useEffect(() => {
    const toolbar = toolbarRef.current
    const dropDown = dropDownRef.current

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect()
      dropDown.style.top = `${top + 40}px`
      dropDown.style.left = `${left}px`
    }
  }, [dropDownRef, toolbarRef])

  useEffect(() => {
    const dropDown = dropDownRef.current
    const toolbar = toolbarRef.current

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowFormatDropDown(false)
        }
      }
      document.addEventListener('click', handle)

      return () => {
        document.removeEventListener('click', handle)
      }
    }
  }, [dropDownRef, setShowFormatDropDown, toolbarRef])

  function formatActionMethod(type: string) {
    switch (type) {
      case 'paragraph':
        return formatParagraph
      case 'h1':
        return formatLargeHeading
      case 'h2':
        return formatMediumHeading
      case 'h3':
        return formatSmallHeading
      case 'quote':
        return formatQuote
      case 'code':
        return formatCode
      case 'ul':
        return formatUnorderedList
      case 'ol':
        return formatOrderedList
      case 'check':
        return formatCheckList
    }
  }

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
    setShowFormatDropDown(false)
  }

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h1'))
        }
      })
    }
    setShowFormatDropDown(false)
  }

  const formatMediumHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h2'))
        }
      })
    }
    setShowFormatDropDown(false)
  }

  const formatSmallHeading = () => {
    if (blockType !== 'h3') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h3'))
        }
      })
    }
    setShowFormatDropDown(false)
  }

  const formatUnorderedList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND)
    }
    setShowFormatDropDown(false)
  }

  const formatOrderedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND)
    }
    setShowFormatDropDown(false)
  }

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
    setShowFormatDropDown(false)
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode())
        }
      })
    }
    setShowFormatDropDown(false)
  }

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode())
        }
      })
    }
    setShowFormatDropDown(false)
  }

  return (
    <div
      className={cn('absolute z-50 flex flex-col rounded-lg bg-white an-shadow p-2')}
      ref={dropDownRef}
    >
      {formatTextTypes.map(format => {
        return (
          <button
            className={cn(
              'flex items-center gap-2 opacity-80 hover:opacity-100 hover:bg-slate-100 px-2 py-1.5 rounded-md'
            )}
            key={format.type}
            onClick={formatActionMethod(format.type)}
          >
            {format.icon}
            <span className="text-sm">{format.text}</span>
            {blockType === format.type && <span className="active" />}
          </button>
        )
      })}
    </div>
  )
}
