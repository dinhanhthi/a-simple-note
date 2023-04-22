import { BsCodeSlash, BsTextParagraph } from 'react-icons/bs'
import { CgCheckR } from 'react-icons/cg'
import { TbListDetails, TbListNumbers } from 'react-icons/tb'
import { TbBlockquote } from 'react-icons/tb'

export const blockTypeToBlockName = {
  check: 'Check List',
  code: 'Code Block',
  h1: 'Large Heading (H1)',
  h2: 'Medium Heading (H2)',
  h3: 'Small Heading (H3)',
  ol: 'Ordered List',
  paragraph: 'Normal',
  quote: 'Quote',
  ul: 'Unordered List'
}

export const formatTextTypes: {
  type: string
  text: string
  icon: JSX.Element
}[] = [
  {
    type: 'paragraph',
    text: blockTypeToBlockName['paragraph'],
    icon: getBlockTypeIcon('paragraph')
  },
  {
    type: 'h1',
    text: blockTypeToBlockName['h1'],
    icon: getBlockTypeIcon('h1')
  },
  {
    type: 'h2',
    text: blockTypeToBlockName['h2'],
    icon: getBlockTypeIcon('h2')
  },
  {
    type: 'h3',
    text: blockTypeToBlockName['h3'],
    icon: getBlockTypeIcon('h3')
  },
  {
    type: 'ul',
    text: blockTypeToBlockName['ul'],
    icon: getBlockTypeIcon('ul')
  },
  {
    type: 'ol',
    text: blockTypeToBlockName['ol'],
    icon: getBlockTypeIcon('ol')
  },
  {
    type: 'check',
    text: blockTypeToBlockName['check'],
    icon: getBlockTypeIcon('check')
  },
  {
    type: 'quote',
    text: blockTypeToBlockName['quote'],
    icon: getBlockTypeIcon('quote')
  },
  {
    type: 'code',
    text: blockTypeToBlockName['code'],
    icon: getBlockTypeIcon('code')
  }
]

export function getBlockTypeIcon(type: string): JSX.Element {
  /* ###Thi */ console.log('getBlockTypeIcon: ', type, '')
  switch (type) {
    case 'paragraph':
      return <BsTextParagraph />
    case 'h1':
      return <span className="text-sm">H1</span>
    case 'h2':
      return <span className="text-sm">H2</span>
    case 'h3':
      return <span className="text-sm">H3</span>
    case 'ol':
      return <TbListNumbers />
    case 'ul':
      return <TbListDetails />
    case 'quote':
      return <TbBlockquote />
    case 'code':
      return <BsCodeSlash />
    case 'check':
      return <CgCheckR />
    default:
      return <></>
  }
}
