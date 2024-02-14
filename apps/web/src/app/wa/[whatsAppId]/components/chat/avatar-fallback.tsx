import { Avatar, AvatarFallbackProps } from '@/components/ui/avatar'
import { forwardRef, type ElementRef } from 'react'

import { cn } from '@/utils/cn'

type ChatAvatarFallbackRef = ElementRef<typeof Avatar.Fallback>

export type ChatAvatarFallbackProps = AvatarFallbackProps

export const ChatAvatarFallback = forwardRef<
  ChatAvatarFallbackRef,
  ChatAvatarFallbackProps
>(({ className, ...props }, ref) => {
  return (
    <Avatar.Fallback
      className={cn('bg-primary/10 text-primary/50', className)}
      ref={ref}
      {...props}
    />
  )
})
ChatAvatarFallback.displayName = 'Chat.AvatarFallback'
