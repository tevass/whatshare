import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type ChatContentProps = HTMLAttributes<HTMLDivElement>

export const ChatContent = forwardRef<HTMLDivElement, ChatContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1', className)} {...props} />
  ),
)
ChatContent.displayName = 'Chat.Content'
