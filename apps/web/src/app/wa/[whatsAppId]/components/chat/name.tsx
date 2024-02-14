import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type ChatNameRef = HTMLHeadingElement

export type ChatNameProps = HTMLAttributes<HTMLHeadingElement>

export const ChatName = forwardRef<ChatNameRef, ChatNameProps>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn(
          'text-base truncate font-medium leading-tight flex-1',
          className,
        )}
        {...props}
      />
    )
  },
)
ChatName.displayName = 'Chat.Name'
