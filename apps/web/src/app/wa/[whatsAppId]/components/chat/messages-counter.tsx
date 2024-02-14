import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type ChatMessagesCounterRef = HTMLDivElement

export type ChatMessagesCounterProps = HTMLAttributes<HTMLDivElement>

export const ChatMessagesCounter = forwardRef<
  ChatMessagesCounterRef,
  ChatMessagesCounterProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center aspect-square w-5 rounded-full text-xs font-semibold bg-emerald-500 text-background',
        className,
      )}
      {...props}
    />
  )
})
ChatMessagesCounter.displayName = 'Chat.MessagesCounter'
