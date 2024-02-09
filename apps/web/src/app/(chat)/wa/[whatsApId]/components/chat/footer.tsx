import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type ChatFooterProps = HTMLAttributes<HTMLElement>

export const ChatFooter = forwardRef<HTMLElement, ChatFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn('flex items-center justify-between space-x-1', className)}
      {...props}
    />
  ),
)
ChatFooter.displayName = 'Chat.Footer'
