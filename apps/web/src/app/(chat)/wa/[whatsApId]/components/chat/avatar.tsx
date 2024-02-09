import { Avatar, AvatarProps } from '@/components/ui/avatar'
import { ElementRef, forwardRef } from 'react'

type ChatAvatarRef = ElementRef<typeof Avatar.Root>
type ChatAvatarProps = AvatarProps

export const ChatAvatar = forwardRef<ChatAvatarRef, ChatAvatarProps>(
  ({ ...props }, ref) => {
    return <Avatar.Root ref={ref} size="lg" {...props} />
  },
)
ChatAvatar.displayName = 'Chat.Avatar'
