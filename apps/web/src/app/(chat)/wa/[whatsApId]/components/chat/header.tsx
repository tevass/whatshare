import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type ChatHeaderProps = HTMLAttributes<HTMLElement>

export const ChatHeader = forwardRef<HTMLElement, ChatHeaderProps>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn('flex items-center justify-between space-x-1', className)}
      {...props}
    />
  ),
)
ChatHeader.displayName = 'Chat.Header'
