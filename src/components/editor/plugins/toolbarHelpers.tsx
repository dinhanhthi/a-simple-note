import { BsBlockquoteLeft, BsCodeSlash, BsTextParagraph } from 'react-icons/bs'
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md'

export const formatTextTypes: {
  type: string
  text: string
  icon: JSX.Element
}[] = [
  {
    type: 'paragraph',
    text: 'Normal',
    icon: getBlockTypeIcon('paragraph')
  },
  {
    type: 'h1',
    text: 'Large Heading (H1)',
    icon: getBlockTypeIcon('h1')
  },
  {
    type: 'h2',
    text: 'Medium Heading (H2)',
    icon: getBlockTypeIcon('h2')
  },
  {
    type: 'h3',
    text: 'Small Heading (H3)',
    icon: getBlockTypeIcon('h3')
  },
  {
    type: 'ul',
    text: 'Unordered List',
    icon: getBlockTypeIcon('ul')
  },
  {
    type: 'ol',
    text: 'Ordered List',
    icon: getBlockTypeIcon('ol')
  },
  {
    type: 'quote',
    text: 'Quote',
    icon: getBlockTypeIcon('quote')
  },
  {
    type: 'code',
    text: 'Code',
    icon: getBlockTypeIcon('code')
  }
]

export function getBlockTypeIcon(type: string): JSX.Element {
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
      return <MdFormatListBulleted />
    case 'ul':
      return <MdFormatListNumbered />
    case 'quote':
      return <BsBlockquoteLeft />
    case 'code':
      return <BsCodeSlash />
    default:
      return <></>
  }
}
