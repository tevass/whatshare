import { cn } from '@/utils/cn'

import { forwardRef, HTMLAttributes } from 'react'

export type ChatMessagesCounterProps = HTMLAttributes<HTMLDivElement>

export const ChatMessagesCounter = forwardRef<
  HTMLDivElement,
  ChatMessagesCounterProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center aspect-square w-5 rounded-full text-xs font-semibold transition-colors bg-primary text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
})
ChatMessagesCounter.displayName = 'Chat.MessagesCounter'
