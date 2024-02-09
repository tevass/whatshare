import { Avatar, AvatarFallbackProps } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'
import { ElementRef, forwardRef } from 'react'

type ChatAvatarFallbackRef = ElementRef<typeof Avatar.Fallback>
type ChatAvatarFallbackProps = AvatarFallbackProps

export const ChatAvatarFallback = forwardRef<
  ChatAvatarFallbackRef,
  ChatAvatarFallbackProps
>(({ className, ...props }, ref) => {
  return (
    <Avatar.Fallback
      className={cn('bg-primary/10 border text-primary grayscale', className)}
      ref={ref}
      {...props}
    />
  )
})
ChatAvatarFallback.displayName = 'Chat.AvatarFallback'
