import { Avatar, type AvatarProps } from '@/components/ui/avatar'
import { forwardRef, type ElementRef } from 'react'

type ChatAvatarRef = ElementRef<typeof Avatar.Root>

export type ChatAvatarProps = AvatarProps

export const ChatAvatar = forwardRef<ChatAvatarRef, ChatAvatarProps>(
  ({ ...props }, ref) => {
    return <Avatar.Root size="lg" ref={ref} {...props} />
  },
)
ChatAvatar.displayName = 'Chat.Avatar'
