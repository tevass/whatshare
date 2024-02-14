import { Footer, FooterProps } from '@/components/ui/footer'
import { cn } from '@/utils/cn'
import { forwardRef, type ComponentRef } from 'react'

type ChatFooterRef = ComponentRef<typeof Footer>

export type ChatFooterProps = FooterProps

export const ChatFooter = forwardRef<ChatFooterRef, ChatFooterProps>(
  ({ className, ...props }, ref) => (
    <Footer
      ref={ref}
      className={cn('flex items-center justify-between space-x-1', className)}
      {...props}
    />
  ),
)
ChatFooter.displayName = 'Chat.Footer'
