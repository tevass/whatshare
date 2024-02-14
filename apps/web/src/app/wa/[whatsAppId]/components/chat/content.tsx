import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type ChatContentRef = HTMLDivElement

export type ChatContentProps = HTMLAttributes<HTMLDivElement>

export const ChatContent = forwardRef<ChatContentRef, ChatContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1', className)} {...props} />
  ),
)
ChatContent.displayName = 'Chat.Content'
