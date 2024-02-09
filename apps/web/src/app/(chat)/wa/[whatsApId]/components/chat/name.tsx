import { Heading, HeadingH4Props } from '@/components/ui/typography/heading'
import { cn } from '@/utils/cn'
import { ElementRef, forwardRef } from 'react'

type ChatNameRef = ElementRef<typeof Heading.H4>
type ChatNameProps = HeadingH4Props

export const ChatName = forwardRef<ChatNameRef, ChatNameProps>(
  ({ className, ...props }, ref) => {
    return (
      <Heading.H4
        ref={ref}
        className={cn('text-base truncate leading-tight flex-1', className)}
        {...props}
      />
    )
  },
)
ChatName.displayName = 'Chat.Name'
