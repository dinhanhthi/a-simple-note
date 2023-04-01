import cn from 'classnames'

type BlocksContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function BlocksContainer(props: BlocksContainerProps) {
  return (
    <div className={cn('flex min-h-screen flex-col justify-between bg-gray-50', props.className)}>
      {props.children}
    </div>
  )
}
