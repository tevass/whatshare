import { Header, HeaderProps } from '@/components/ui/header'
import { cn } from '@/utils/cn'
import { forwardRef, type ComponentRef } from 'react'

type ChatHeaderRef = ComponentRef<typeof Header>

export type ChatHeaderProps = HeaderProps

export const ChatHeader = forwardRef<ChatHeaderRef, ChatHeaderProps>(
  ({ className, ...props }, ref) => (
    <Header
      ref={ref}
      className={cn('flex items-center justify-between space-x-1', className)}
      {...props}
    />
  ),
)
ChatHeader.displayName = 'Chat.Header'
